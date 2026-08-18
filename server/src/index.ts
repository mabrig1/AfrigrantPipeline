import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { Request, Response, NextFunction } from 'express';

const app = express();

app.use(express.json());
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = process.env.NODE_ENV === 'production'
      ? ['https://afrigrantpipeline.com', 'https://www.afrigrantpipeline.com']
      : ['http://localhost:3000'];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('❌ DATABASE_URL is not configured');
} else {
  mongoose.connect(databaseUrl)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));
}

function getCookie(req: Request, name: string): string | undefined {
  const header = req.headers.cookie;
  if (!header) return undefined;

  const prefix = `${name}=`;
  const cookie = header
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix));

  return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : undefined;
}

function setAdminCookie(res: Response, secret: string): void {
  const maxAge = 60 * 60 * 24 * 7;
  const attributes = [
    'Path=/',
    `Max-Age=${maxAge}`,
    'HttpOnly',
    'SameSite=Lax',
    ...(process.env.NODE_ENV === 'production' ? ['Secure'] : []),
  ];

  res.setHeader('Set-Cookie', `admin-token=${encodeURIComponent(secret)}; ${attributes.join('; ')}`);
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const secret = process.env.ADMIN_SETUP_SECRET;
  const adminToken = getCookie(req, 'admin-token');

  if (!secret || adminToken !== secret) {
    return res.status(403).json({ error: 'Unauthorized: Not an admin' });
  }

  next();
}

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    ok: true,
    mongodb: mongoose.connection.readyState === 1,
  });
});

app.post('/api/admin/make-admin', (req: Request, res: Response) => {
  const configuredSecret = process.env.ADMIN_SETUP_SECRET;
  const { secret } = req.body as { secret?: string };

  if (!configuredSecret) {
    return res.status(500).json({ error: 'ADMIN_SETUP_SECRET is not configured' });
  }

  if (!secret || secret !== configuredSecret) {
    return res.status(401).json({ error: 'Invalid admin secret' });
  }

  setAdminCookie(res, configuredSecret);
  return res.json({ message: 'Admin activated! Refresh the page.' });
});

app.get('/api/admin/test', requireAdmin, (_req: Request, res: Response) => {
  res.json({ message: 'You are an admin!' });
});

export default app;
