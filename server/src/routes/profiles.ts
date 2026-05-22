import { Router } from 'express'
import { z } from 'zod'
import User from '../models/User'
import { requireAuth, type AuthRequest } from '../middleware/auth'

const router = Router()

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password').lean()
    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }
    res.json({ data: user })
  } catch {
    res.status(500).json({ error: 'Failed to fetch profile' })
  }
})

router.patch('/me', requireAuth, async (req: AuthRequest, res) => {
  try {
    const body = z
      .object({
        name: z.string().min(2).optional(),
        bio: z.string().optional(),
        organization: z.string().optional(),
        country: z.string().optional(),
        researchInterests: z.array(z.string()).optional(),
        avatar: z.string().url().optional(),
      })
      .parse(req.body)
    const user = await User.findByIdAndUpdate(req.userId, body, { new: true }).select('-password')
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

export default router
