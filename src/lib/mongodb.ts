import mongoose from 'mongoose'
import { MongoClient, type MongoClientOptions } from 'mongodb'

// ── Shared connection options ─────────────────────────────────────────────────

const POOL_SIZE = 10
const SERVER_SELECTION_TIMEOUT = 5_000
const SOCKET_TIMEOUT = 45_000

const clientOptions: MongoClientOptions = {
  maxPoolSize: POOL_SIZE,
  serverSelectionTimeoutMS: SERVER_SELECTION_TIMEOUT,
  socketTimeoutMS: SOCKET_TIMEOUT,
}

function getMongoURI(): string {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('MONGODB_URI environment variable is not defined')
  return uri
}

// ── Mongoose singleton (model queries) ───────────────────────────────────────
//
// Next.js HMR re-executes modules on every save in dev, so we cache in global.

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
      .connect(getMongoURI(), {
        bufferCommands: false,
        maxPoolSize: POOL_SIZE,
        serverSelectionTimeoutMS: SERVER_SELECTION_TIMEOUT,
        socketTimeoutMS: SOCKET_TIMEOUT,
      })
      .catch((err: unknown) => {
        mongooseCache.promise = null
        throw err
      })
  }

  mongooseCache.conn = await mongooseCache.promise
  return mongooseCache.conn
}

// ── MongoClient singleton (NextAuth / MongoDBAdapter) ─────────────────────────
//
// MongoDBAdapter accepts a Promise<MongoClient>. We export a lazy promise that
// defers the connection until it is first awaited (i.e. during an actual request)
// rather than at module-import time, so the Next.js build succeeds even without
// MONGODB_URI in the build environment.

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

let _prodClientPromise: Promise<MongoClient> | null = null

function resolveClientPromise(): Promise<MongoClient> {
  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = new MongoClient(getMongoURI(), clientOptions).connect()
    }
    return global._mongoClientPromise
  }
  if (!_prodClientPromise) {
    _prodClientPromise = new MongoClient(getMongoURI(), clientOptions).connect()
  }
  return _prodClientPromise
}

// A thenable that only creates the MongoClient when first awaited.
export const clientPromise: Promise<MongoClient> = {
  then: <TResult1 = MongoClient, TResult2 = never>(
    onfulfilled?: ((value: MongoClient) => TResult1 | PromiseLike<TResult1>) | null | undefined,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null | undefined,
  ) => resolveClientPromise().then(onfulfilled, onrejected),
  catch: <TResult = never>(
    onrejected?: ((reason: unknown) => TResult | PromiseLike<TResult>) | null | undefined,
  ) => resolveClientPromise().catch(onrejected),
  finally: (onfinally?: (() => void) | null | undefined) =>
    resolveClientPromise().finally(onfinally),
  [Symbol.toStringTag]: 'Promise',
} as Promise<MongoClient>
