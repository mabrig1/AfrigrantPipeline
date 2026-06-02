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

// ── Proxy & security ──────────────────────────────────────────────────────────

app.set('trust proxy', 1)
app.use(helmet())

// ── CORS ──────────────────────────────────────────────────────────────────────

const allowedOrigins = [
  'https://afrigrantpipeline.com',
  'https://www.afrigrantpipeline.com',
  'http://localhost:3000',
  ...(process.env.EXTRA_ORIGINS ? process.env.EXTRA_ORIGINS.split(',') : []),
]

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server (no origin) and whitelisted origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error(`CORS: origin '${origin}' not allowed`))
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
)

app.use(express.json({ limit: '10mb' }))

// ── Global rate limit ─────────────────────────────────────────────────────────

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    // Respect Cloudflare real IP
    keyGenerator: (req) =>
      (req.headers['cf-connecting-ip'] as string) ?? req.ip ?? 'unknown',
  }),
)

// ── Health check ──────────────────────────────────────────────────────────────

app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }))

// ── API v1 routes ─────────────────────────────────────────────────────────────

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/grants', grantsRoutes)
app.use('/api/v1/applications', applicationsRoutes)
app.use('/api/v1/articles', articlesRoutes)
app.use('/api/v1/collaborations', collaborationsRoutes)
app.use('/api/v1/mentorships', mentorshipsRoutes)
app.use('/api/v1/profiles', profilesRoutes)
app.use('/api/v1/ai', aiRoutes)

// ── 404 fallthrough ───────────────────────────────────────────────────────────

app.use((_req, res) => res.status(404).json({ error: 'Route not found' }))

// ── Database & server start ───────────────────────────────────────────────────

// Start HTTP server immediately so Railway healthcheck passes,
// then connect to MongoDB. If DB connection fails, log and exit.
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

mongoose
  .connect(process.env.MONGODB_URI!, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection failed:', err)
    server.close(() => process.exit(1))
  })

export default app
