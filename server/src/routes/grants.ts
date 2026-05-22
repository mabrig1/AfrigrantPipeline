import { Router } from 'express'
import { z } from 'zod'
import mongoose from 'mongoose'
import Grant from '../models/Grant'
import { requireAuth, requireRole, type AuthRequest } from '../middleware/auth'

const router = Router()

// ── Validation schemas ────────────────────────────────────────────────────────

const createGrantSchema = z.object({
  title: z.string().min(3).max(200).trim(),
  description: z.string().min(10),
  funder: z.string().min(1).trim(),
  amount: z.number().positive(),
  currency: z.string().length(3).default('USD'),
  deadline: z.string().datetime({ message: 'deadline must be an ISO 8601 datetime' }),
  grantType: z.enum(['government', 'ngo', 'private', 'academic', 'international']).optional(),
  eligibility: z.array(z.string()).default([]),
  categories: z.array(z.string()).default([]),
  countries: z.array(z.string()).default([]),
  region: z.string().optional(),
  applicationLink: z.string().url().optional(),
})

const updateGrantSchema = createGrantSchema.partial()

const listSchema = z.object({
  status: z.enum(['open', 'closed', 'draft']).optional(),
  grantType: z.enum(['government', 'ngo', 'private', 'academic', 'international']).optional(),
  region: z.string().optional(),
  categories: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})

// ── GET /  — list grants ──────────────────────────────────────────────────────

router.get('/', async (req, res) => {
  try {
    const { status, grantType, region, categories, search, page, limit } =
      listSchema.parse(req.query)

    const filter: Record<string, unknown> = {}

    if (status) filter.status = status
    else filter.status = 'open' // default to open

    if (grantType) filter.grantType = grantType
    if (region) filter.region = region
    if (categories) filter.categories = { $in: categories.split(',').map((c) => c.trim()) }

    if (search) {
      filter.$text = { $search: search }
    }

    const skip = (page - 1) * limit
    const [grants, total] = await Promise.all([
      Grant.find(filter)
        .sort(search ? { score: { $meta: 'textScore' } } : { deadline: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Grant.countDocuments(filter),
    ])

    res.json({
      data: grants,
      total,
      page,
      limit,
      hasMore: skip + grants.length < total,
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors[0].message })
      return
    }
    res.status(500).json({ error: 'Failed to fetch grants' })
  }
})

// ── GET /bookmarks  — bookmarked grants for current user ──────────────────────

router.get('/bookmarks', requireAuth, async (req: AuthRequest, res) => {
  try {
    const grants = await Grant.find({ bookmarkedBy: req.userId }).sort({ deadline: 1 }).lean()
    res.json({ data: grants })
  } catch {
    res.status(500).json({ error: 'Failed to fetch bookmarks' })
  }
})

// ── GET /:id  — single grant ──────────────────────────────────────────────────

router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400).json({ error: 'Invalid grant ID' })
      return
    }
    const grant = await Grant.findById(req.params.id).lean()
    if (!grant) {
      res.status(404).json({ error: 'Grant not found' })
      return
    }
    res.json({ data: grant })
  } catch {
    res.status(500).json({ error: 'Failed to fetch grant' })
  }
})

// ── POST /  — create grant (admin only) ──────────────────────────────────────

router.post('/', requireAuth, requireRole('admin'), async (req: AuthRequest, res) => {
  try {
    const body = createGrantSchema.parse(req.body)
    const grant = await Grant.create({
      ...body,
      deadline: new Date(body.deadline),
      createdBy: req.userId,
    })
    res.status(201).json({ data: grant, message: 'Grant created' })
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors[0].message })
      return
    }
    res.status(500).json({ error: 'Failed to create grant' })
  }
})

// ── PATCH /:id  — update grant (admin only) ───────────────────────────────────

router.patch('/:id', requireAuth, requireRole('admin'), async (req: AuthRequest, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400).json({ error: 'Invalid grant ID' })
      return
    }
    const body = updateGrantSchema.parse(req.body)
    const update: Record<string, unknown> = { ...body }
    if (body.deadline) update.deadline = new Date(body.deadline)

    const grant = await Grant.findByIdAndUpdate(req.params.id, update, { new: true }).lean()
    if (!grant) {
      res.status(404).json({ error: 'Grant not found' })
      return
    }
    res.json({ data: grant, message: 'Grant updated' })
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors[0].message })
      return
    }
    res.status(500).json({ error: 'Failed to update grant' })
  }
})

// ── DELETE /:id  — delete grant (admin only) ──────────────────────────────────

router.delete('/:id', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400).json({ error: 'Invalid grant ID' })
      return
    }
    const grant = await Grant.findByIdAndDelete(req.params.id)
    if (!grant) {
      res.status(404).json({ error: 'Grant not found' })
      return
    }
    res.json({ data: null, message: 'Grant deleted' })
  } catch {
    res.status(500).json({ error: 'Failed to delete grant' })
  }
})

// ── POST /:id/bookmark  — toggle bookmark ─────────────────────────────────────

router.post('/:id/bookmark', requireAuth, async (req: AuthRequest, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400).json({ error: 'Invalid grant ID' })
      return
    }
    const grant = await Grant.findById(req.params.id)
    if (!grant) {
      res.status(404).json({ error: 'Grant not found' })
      return
    }

    const bookmarkedBy = (grant as unknown as { bookmarkedBy?: mongoose.Types.ObjectId[] }).bookmarkedBy ?? []
    const userId = new mongoose.Types.ObjectId(req.userId)
    const idx = bookmarkedBy.findIndex((id) => id.equals(userId))

    let bookmarked: boolean
    if (idx >= 0) {
      await Grant.findByIdAndUpdate(req.params.id, { $pull: { bookmarkedBy: userId } })
      bookmarked = false
    } else {
      await Grant.findByIdAndUpdate(req.params.id, { $addToSet: { bookmarkedBy: userId } })
      bookmarked = true
    }

    res.json({ data: { bookmarked }, message: bookmarked ? 'Bookmarked' : 'Removed bookmark' })
  } catch {
    res.status(500).json({ error: 'Failed to toggle bookmark' })
  }
})

export default router
