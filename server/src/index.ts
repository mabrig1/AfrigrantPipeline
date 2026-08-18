import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { Request, Response, NextFunction } from 'express';

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? 'https://afrigrantpipeline.com'
    : 'http://localhost:3000',
  credentials: true,
}));

// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URL!)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Middleware to check if user is admin
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const adminToken = req.cookies['admin-token'];
  if (adminToken !== process.env.ADMIN_SETUP_SECRET) {
    return res.status(403).json({ error: 'Unauthorized: Not an admin' });
  }
  next();
}

// Admin setup endpoint
app.post('/api/admin/make-admin', (req: Request, res: Response) => {
  const { secret } = req.body;
  if (secret !== process.env.ADMIN_SETUP_SECRET) {
    return res.status(401).json({ error: 'Invalid admin secret' });
  }

  // Set admin cookie
  res.cookie('admin-token', process.env.ADMIN_SETUP_SECRET!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    sameSite: 'strict',
  });

  return res.json({ message: 'Admin activated! Refresh the page.' });
});

// Example protected route
app.get('/api/admin/test', requireAdmin, (req: Request, res: Response) => {
  res.json({ message: 'You are an admin!' });
});

// Export for Vercel
export default app;
