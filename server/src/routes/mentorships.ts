import { Router } from 'express'
import { z } from 'zod'
import mongoose from 'mongoose'
import { requireAuth, type AuthRequest } from '../middleware/auth'

const MentorshipSchema = new mongoose.Schema(
  {
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mentee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    topic: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'active', 'completed', 'declined'],
      default: 'pending',
    },
    startDate: Date,
    endDate: Date,
  },
  { timestamps: true }
)
const Mentorship =
  mongoose.models.Mentorship || mongoose.model('Mentorship', MentorshipSchema)

const router = Router()

router.get('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const mentorships = await Mentorship.find({
      $or: [{ mentor: req.userId }, { mentee: req.userId }],
    })
      .populate('mentor mentee', 'name avatar organization')
      .lean()
    res.json({ data: mentorships })
  } catch {
    res.status(500).json({ error: 'Failed to fetch mentorships' })
  }
})

router.post('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const body = z
      .object({ mentor: z.string(), topic: z.string().min(1) })
      .parse(req.body)
    const mentorship = await Mentorship.create({ ...body, mentee: req.userId })
    res.status(201).json({ data: mentorship, message: 'Mentorship requested' })
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors[0].message })
      return
    }
    res.status(500).json({ error: 'Failed to request mentorship' })
  }
})

export default router
