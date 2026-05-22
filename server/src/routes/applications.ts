import { Router } from 'express'
import { z } from 'zod'
import mongoose from 'mongoose'
import { requireAuth, type AuthRequest } from '../middleware/auth'

const ApplicationSchema = new mongoose.Schema(
  {
    grant: { type: mongoose.Schema.Types.ObjectId, ref: 'Grant', required: true },
    applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['draft', 'submitted', 'under_review', 'approved', 'rejected'],
      default: 'draft',
    },
    projectTitle: { type: String, required: true },
    projectDescription: { type: String, required: true },
    requestedAmount: { type: Number, required: true },
    attachments: [String],
    aiScore: Number,
    reviewerNotes: String,
    submittedAt: Date,
  },
  { timestamps: true }
)
const Application =
  mongoose.models.Application || mongoose.model('Application', ApplicationSchema)

const router = Router()

router.get('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const apps = await Application.find({ applicant: req.userId })
      .populate('grant', 'title funder deadline amount')
      .sort({ createdAt: -1 })
      .lean()
    res.json({ data: apps })
  } catch {
    res.status(500).json({ error: 'Failed to fetch applications' })
  }
})

const createSchema = z.object({
  grant: z.string(),
  projectTitle: z.string().min(1),
  projectDescription: z.string().min(1),
  requestedAmount: z.number().positive(),
  attachments: z.array(z.string()).default([]),
})

router.post('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const body = createSchema.parse(req.body)
    const app = await Application.create({ ...body, applicant: req.userId })
    res.status(201).json({ data: app, message: 'Application created' })
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors[0].message })
      return
    }
    res.status(500).json({ error: 'Failed to create application' })
  }
})

router.patch('/:id/status', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { status } = z.object({ status: z.string() }).parse(req.body)
    const app = await Application.findByIdAndUpdate(req.params.id, { status }, { new: true })
    if (!app) {
      res.status(404).json({ error: 'Application not found' })
      return
    }
    res.json({ data: app, message: 'Status updated' })
  } catch {
    res.status(500).json({ error: 'Failed to update status' })
  }
})

export default router
