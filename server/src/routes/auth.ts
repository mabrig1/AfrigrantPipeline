import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import User from '../models/User'

const router = Router()

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  organization: z.string().optional(),
})

router.post('/register', async (req, res) => {
  try {
    const body = registerSchema.parse(req.body)
    const existing = await User.findOne({ email: body.email })
    if (existing) {
      res.status(409).json({ error: 'Email already registered' })
      return
    }
    const hashed = await bcrypt.hash(body.password, 12)
    const user = await User.create({ ...body, password: hashed })
    res.status(201).json({ message: 'Account created', data: { id: user._id } })
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors[0].message })
      return
    }
    res.status(500).json({ error: 'Registration failed' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = z
      .object({ email: z.string().email(), password: z.string() })
      .parse(req.body)
    const user = await User.findOne({ email })
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' })
      return
    }
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      res.status(401).json({ error: 'Invalid credentials' })
      return
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    })
    res.json({
      data: { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } },
    })
  } catch {
    res.status(500).json({ error: 'Login failed' })
  }
})

export default router
