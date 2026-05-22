import { Router } from 'express'
import { z } from 'zod'
import mongoose from 'mongoose'
import { requireAuth, type AuthRequest } from '../middleware/auth'

const ArticleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    abstract: { type: String, required: true },
    content: { type: String, required: true },
    authors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    journal: { type: mongoose.Schema.Types.ObjectId, ref: 'Journal' },
    keywords: [String],
    status: {
      type: String,
      enum: ['draft', 'submitted', 'under_review', 'published', 'rejected'],
      default: 'draft',
    },
    doi: String,
    attachments: [String],
    publishedAt: Date,
  },
  { timestamps: true }
)
const Article = mongoose.models.Article || mongoose.model('Article', ArticleSchema)

const router = Router()

router.get('/', async (_req, res) => {
  try {
    const articles = await Article.find({ status: 'published' })
      .populate('authors', 'name organization')
      .sort({ publishedAt: -1 })
      .lean()
    res.json({ data: articles })
  } catch {
    res.status(500).json({ error: 'Failed to fetch articles' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate('authors', 'name organization avatar')
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

const createSchema = z.object({
  title: z.string().min(1),
  abstract: z.string().min(1),
  content: z.string().min(1),
  keywords: z.array(z.string()).default([]),
  attachments: z.array(z.string()).default([]),
})

router.post('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const body = createSchema.parse(req.body)
    const article = await Article.create({ ...body, authors: [req.userId] })
    res.status(201).json({ data: article, message: 'Article created' })
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors[0].message })
      return
    }
    res.status(500).json({ error: 'Failed to create article' })
  }
})

export default router
