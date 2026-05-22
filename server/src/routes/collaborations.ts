import { Router } from 'express'
import { z } from 'zod'
import mongoose from 'mongoose'
import { requireAuth, type AuthRequest } from '../middleware/auth'

const CollaborationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    status: { type: String, enum: ['open', 'closed', 'completed'], default: 'open' },
    tags: [String],
  },
  { timestamps: true }
)
const Collaboration =
  mongoose.models.Collaboration || mongoose.model('Collaboration', CollaborationSchema)

const router = Router()

router.get('/', async (_req, res) => {
  try {
    const collabs = await Collaboration.find({ status: 'open' })
      .populate('owner', 'name organization avatar')
      .sort({ createdAt: -1 })
      .lean()
    res.json({ data: collabs })
  } catch {
    res.status(500).json({ error: 'Failed to fetch collaborations' })
  }
})

router.post('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const body = z
      .object({
        title: z.string().min(1),
        description: z.string().min(1),
        tags: z.array(z.string()).default([]),
      })
      .parse(req.body)
    const collab = await Collaboration.create({
      ...body,
      owner: req.userId,
      members: [req.userId],
    })
    res.status(201).json({ data: collab, message: 'Collaboration created' })
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors[0].message })
      return
    }
    res.status(500).json({ error: 'Failed to create collaboration' })
  }
})

router.post('/:id/join', requireAuth, async (req: AuthRequest, res) => {
  try {
    const collab = await Collaboration.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { members: req.userId } },
      { new: true }
    )
    if (!collab) {
      res.status(404).json({ error: 'Collaboration not found' })
      return
    }
    res.json({ data: collab, message: 'Joined collaboration' })
  } catch {
    res.status(500).json({ error: 'Failed to join collaboration' })
  }
})

export default router
