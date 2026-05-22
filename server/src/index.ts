import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import mongoose from 'mongoose'

import authRoutes from './routes/auth'
import grantsRoutes from './routes/grants'
import applicationsRoutes from './routes/applications'
import articlesRoutes from './routes/articles'
import collaborationsRoutes from './routes/collaborations'
import mentorshipsRoutes from './routes/mentorships'
import profilesRoutes from './routes/profiles'
import aiRoutes from './routes/ai'

const app = express()
const PORT = process.env.PORT ?? 8080

app.set('trust proxy', 1)

app.use(helmet())
app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    credentials: true,
  })
)
app.use(express.json({ limit: '10mb' }))

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) =>
    (req.headers['cf-connecting-ip'] as string) ?? req.ip ?? 'unknown',
})
app.use(limiter)

app.get('/health', (_req, res) => res.json({ status: 'ok' }))

app.use('/api/auth', authRoutes)
app.use('/api/grants', grantsRoutes)
app.use('/api/applications', applicationsRoutes)
app.use('/api/articles', articlesRoutes)
app.use('/api/collaborations', collaborationsRoutes)
app.use('/api/mentorships', mentorshipsRoutes)
app.use('/api/profiles', profilesRoutes)
app.use('/api/ai', aiRoutes)

mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err)
    process.exit(1)
  })

export default app
