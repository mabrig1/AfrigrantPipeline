import mongoose from 'mongoose'
import { MongoClient, type MongoClientOptions } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) throw new Error('MONGODB_URI environment variable is not defined')

// ── Shared connection options ─────────────────────────────────────────────────

const POOL_SIZE = 10
const SERVER_SELECTION_TIMEOUT = 5_000
const SOCKET_TIMEOUT = 45_000

// ── Mongoose singleton (model queries) ───────────────────────────────────────
//
// Next.js hot-module replacement re-executes modules on every save in dev,
// which would create a new connection on each reload without this global cache.

declare global {
  // eslint-disable-next-line no-var
  var _mongoose:
    | { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }
    | undefined
}

const mongooseCache = global._mongoose ?? { conn: null, promise: null }
if (!global._mongoose) global._mongoose = mongooseCache

export async function connectDB(): Promise<typeof mongoose> {
  if (mongooseCache.conn) return mongooseCache.conn

  if (!mongooseCache.promise) {
    mongooseCache.promise = mongoose
      .connect(MONGODB_URI as string, {
        bufferCommands: false,
        maxPoolSize: POOL_SIZE,
        serverSelectionTimeoutMS: SERVER_SELECTION_TIMEOUT,
        socketTimeoutMS: SOCKET_TIMEOUT,
      })
      .catch((err: unknown) => {
        // Reset so the next call retries rather than hanging forever
        mongooseCache.promise = null
        throw err
      })
  }

  mongooseCache.conn = await mongooseCache.promise
  return mongooseCache.conn
}

// ── MongoClient singleton (NextAuth adapter) ──────────────────────────────────
//
// The MongoDBAdapter needs a MongoClient (or Promise<MongoClient>). We keep it
// separate from Mongoose so each can manage its own pool independently.

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

const clientOptions: MongoClientOptions = {
  maxPoolSize: POOL_SIZE,
  serverSelectionTimeoutMS: SERVER_SELECTION_TIMEOUT,
  socketTimeoutMS: SOCKET_TIMEOUT,
}

let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  // Reuse across HMR reloads in development
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = new MongoClient(
      MONGODB_URI as string,
      clientOptions
    ).connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  // Production: module-level singleton (no global needed)
  clientPromise = new MongoClient(MONGODB_URI as string, clientOptions).connect()
}

export { clientPromise }
