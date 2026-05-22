import { Router } from 'express'
import { z } from 'zod'
import Grant from '../models/Grant'
import { requireAuth, requireRole, type AuthRequest } from '../middleware/auth'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const status = (req.query.status as string) ?? 'open'
    const grants = await Grant.find({ status }).sort({ deadline: 1 }).lean()
    res.json({ data: grants })
  } catch {
    res.status(500).json({ error: 'Failed to fetch grants' })
  }
})

router.get('/:id', async (req, res) => {
  try {
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

const createGrantSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  funder: z.string().min(1),
  amount: z.number().positive(),
  currency: z.string().default('USD'),
  deadline: z.string().datetime(),
  eligibility: z.array(z.string()).default([]),
  categories: z.array(z.string()).default([]),
  applicationLink: z.string().url().optional(),
})

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

export default router
