import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable')
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: { conn: typeof import('mongoose') | null; promise: Promise<typeof import('mongoose')> | null } | undefined
}

const cached = global.mongoose ?? { conn: null, promise: null }
if (!global.mongoose) global.mongoose = cached

export async function connectDB() {
  if (cached.conn) return cached.conn
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((m) => m)
  }
  cached.conn = await cached.promise
  return cached.conn
}
