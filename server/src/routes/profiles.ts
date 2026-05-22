import { Router } from 'express'
import { z } from 'zod'
import mongoose from 'mongoose'
import User from '../models/User'
import { requireAuth, type AuthRequest } from '../middleware/auth'

const router = Router()

// ── Validation ────────────────────────────────────────────────────────────────

const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).trim().optional(),
  bio: z.string().max(1000).optional(),
  organization: z.string().max(200).trim().optional(),
  country: z.string().max(100).trim().optional(),
  researchInterests: z.array(z.string().trim()).max(20).optional(),
  avatar: z.string().url().optional(),
  website: z.string().url().optional(),
})

// ── GET /me  — current user's own profile ────────────────────────────────────

router.get('/me', requireAuth, async (req: AuthRequest, res) => {
  try {
    const user = await User.findById(req.userId).select('-password').lean()
    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }
    res.json({ data: user })
  } catch {
    res.status(500).json({ error: 'Failed to fetch profile' })
  }
})

// ── PATCH /me  — update own profile ──────────────────────────────────────────

router.patch('/me', requireAuth, async (req: AuthRequest, res) => {
  try {
    const body = updateProfileSchema.parse(req.body)

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: body },
      { new: true, runValidators: true },
    ).select('-password')

    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }
    res.json({ data: user, message: 'Profile updated' })
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors[0].message })
      return
    }
    res.status(500).json({ error: 'Failed to update profile' })
  }
})

// ── GET /:id  — public profile by user ID ────────────────────────────────────

router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400).json({ error: 'Invalid user ID' })
      return
    }

    const user = await User.findById(req.params.id)
      .select('-password -email') // hide private fields on public view
      .lean()

    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }
    res.json({ data: user })
  } catch {
    res.status(500).json({ error: 'Failed to fetch profile' })
  }
})

// ── GET /  — search / list researchers ───────────────────────────────────────

router.get('/', async (req, res) => {
  try {
    const { search, country, page: rawPage, limit: rawLimit } = req.query

    const page = Math.max(1, parseInt(rawPage as string) || 1)
    const limit = Math.min(50, Math.max(1, parseInt(rawLimit as string) || 20))

    const filter: Record<string, unknown> = {}
    if (country) filter.country = country
    if (search) filter.$text = { $search: search as string }

    const skip = (page - 1) * limit
    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-password -email')
        .sort(search ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(filter),
    ])

    res.json({ data: users, total, page, limit, hasMore: skip + users.length < total })
  } catch {
    res.status(500).json({ error: 'Failed to fetch profiles' })
  }
})

export default router
