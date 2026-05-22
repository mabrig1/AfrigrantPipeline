import { Router } from 'express'
import { z } from 'zod'
import mongoose from 'mongoose'
import Article from '../models/Article'
import { requireAuth, type AuthRequest } from '../middleware/auth'

const router = Router()

// ── Validation schemas ────────────────────────────────────────────────────────

const createArticleSchema = z.object({
  title: z.string().min(3).max(300).trim(),
  abstract: z.string().min(50),
  content: z.string().min(100),
  keywords: z.array(z.string()).default([]),
  journal: z.string().optional(),
  attachments: z.array(z.string()).default([]),
  language: z.string().default('en'),
  license: z
    .enum(['CC BY', 'CC BY-SA', 'CC BY-NC', 'CC BY-ND', 'CC0', 'All Rights Reserved'])
    .default('CC BY'),
})

const updateArticleSchema = createArticleSchema.partial()

const listSchema = z.object({
  status: z
    .enum(['draft', 'submitted', 'under_review', 'published', 'rejected'])
    .optional(),
  journal: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})

// ── GET /  — list published articles (or all for authenticated users) ─────────

router.get('/', async (req, res) => {
  try {
    const { status, journal, search, page, limit } = listSchema.parse(req.query)

    const filter: Record<string, unknown> = {}
    filter.status = status ?? 'published'

    if (journal && mongoose.isValidObjectId(journal)) {
      filter.journal = new mongoose.Types.ObjectId(journal)
    }
    if (search) filter.$text = { $search: search }

    const skip = (page - 1) * limit
    const [articles, total] = await Promise.all([
      Article.find(filter)
        .populate('authors', 'name organization avatar')
        .populate('journal', 'name issn')
        .sort(search ? { score: { $meta: 'textScore' } } : { publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Article.countDocuments(filter),
    ])

    res.json({ data: articles, total, page, limit, hasMore: skip + articles.length < total })
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors[0].message })
      return
    }
    res.status(500).json({ error: 'Failed to fetch articles' })
  }
})

// ── GET /:id  — single article (increments viewCount) ────────────────────────

router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400).json({ error: 'Invalid article ID' })
      return
    }
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { $inc: { viewCount: 1 } },
      { new: true },
    )
      .populate('authors', 'name organization avatar country')
      .populate('journal', 'name issn isOpenAccess')
      .lean()

    if (!article) {
      res.status(404).json({ error: 'Article not found' })
      return
    }
    res.json({ data: article })
  } catch {
    res.status(500).json({ error: 'Failed to fetch article' })
  }
})

// ── POST /  — create article (authenticated) ──────────────────────────────────

router.post('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const body = createArticleSchema.parse(req.body)
    const article = await Article.create({
      ...body,
      authors: [req.userId],
      journal: body.journal && mongoose.isValidObjectId(body.journal)
        ? new mongoose.Types.ObjectId(body.journal)
        : undefined,
    })
    const populated = await article.populate('authors', 'name organization')
    res.status(201).json({ data: populated, message: 'Article created' })
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors[0].message })
      return
    }
    if ((err as { code?: number }).code === 11000) {
      res.status(409).json({ error: 'DOI already registered' })
      return
    }
    res.status(500).json({ error: 'Failed to create article' })
  }
})

// ── PATCH /:id  — update article (author only) ────────────────────────────────

router.patch('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400).json({ error: 'Invalid article ID' })
      return
    }

    const existing = await Article.findById(req.params.id)
    if (!existing) {
      res.status(404).json({ error: 'Article not found' })
      return
    }

    const isAuthor = existing.authors.some((a) => a.toString() === req.userId)
    if (!isAuthor) {
      res.status(403).json({ error: 'Only authors can edit this article' })
      return
    }

    // Only allow editing drafts/submitted — not published/under_review
    if (['published', 'under_review'].includes(existing.status)) {
      res.status(409).json({ error: `Cannot edit an article with status '${existing.status}'` })
      return
    }

    const body = updateArticleSchema.parse(req.body)
    const updated = await Article.findByIdAndUpdate(req.params.id, body, { new: true })
      .populate('authors', 'name organization')
      .lean()

    res.json({ data: updated, message: 'Article updated' })
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors[0].message })
      return
    }
    res.status(500).json({ error: 'Failed to update article' })
  }
})

// ── POST /:id/submit  — submit for review ─────────────────────────────────────

router.post('/:id/submit', requireAuth, async (req: AuthRequest, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400).json({ error: 'Invalid article ID' })
      return
    }

    const article = await Article.findById(req.params.id)
    if (!article) {
      res.status(404).json({ error: 'Article not found' })
      return
    }

    const isAuthor = article.authors.some((a) => a.toString() === req.userId)
    if (!isAuthor) {
      res.status(403).json({ error: 'Only authors can submit this article' })
      return
    }

    if (article.status !== 'draft') {
      res.status(409).json({ error: 'Only draft articles can be submitted' })
      return
    }

    article.status = 'submitted'
    await article.save()

    res.json({ data: article, message: 'Article submitted for review' })
  } catch {
    res.status(500).json({ error: 'Failed to submit article' })
  }
})

// ── DELETE /:id  — delete draft (author only) ─────────────────────────────────

router.delete('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400).json({ error: 'Invalid article ID' })
      return
    }

    const article = await Article.findById(req.params.id)
    if (!article) {
      res.status(404).json({ error: 'Article not found' })
      return
    }

    const isAuthor = article.authors.some((a) => a.toString() === req.userId)
    if (!isAuthor) {
      res.status(403).json({ error: 'Only authors can delete this article' })
      return
    }

    if (article.status === 'published') {
      res.status(409).json({ error: 'Published articles cannot be deleted' })
      return
    }

    await article.deleteOne()
    res.json({ data: null, message: 'Article deleted' })
  } catch {
    res.status(500).json({ error: 'Failed to delete article' })
  }
})

export default router
