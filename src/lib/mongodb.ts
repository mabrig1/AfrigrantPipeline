import mongoose from 'mongoose'
import { MongoClient, type MongoClientOptions } from 'mongodb'

const POOL_SIZE = 10
const SERVER_SELECTION_TIMEOUT = 5_000
const SOCKET_TIMEOUT = 45_000

const clientOptions: MongoClientOptions = {
  maxPoolSize: POOL_SIZE,
  serverSelectionTimeoutMS: SERVER_SELECTION_TIMEOUT,
  socketTimeoutMS: SOCKET_TIMEOUT,
}

function getMongoURI(): string {
  // DATABASE_URL is the canonical production variable. MONGODB_URI is kept as
  // a backward-compatible fallback for existing local environments.
  const uri = process.env.DATABASE_URL ?? process.env.MONGODB_URI
  if (!uri) throw new Error('DATABASE_URL environment variable is not defined')
  return uri
}

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

export const clientPromise: Promise<MongoClient> = {
  then: <TResult1 = MongoClient, TResult2 = never>(
    onfulfilled?: ((value: MongoClient) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ) => resolveClientPromise().then(onfulfilled, onrejected),
  catch: <TResult = never>(
    onrejected?: ((reason: unknown) => TResult | PromiseLike<TResult>) | null,
  ) => resolveClientPromise().catch(onrejected),
  finally: (onfinally?: (() => void) | null) => resolveClientPromise().finally(onfinally),
  [Symbol.toStringTag]: 'Promise',
} as Promise<MongoClient>
