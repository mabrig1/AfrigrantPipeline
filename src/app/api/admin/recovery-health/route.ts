import { createHash, timingSafeEqual } from 'node:crypto'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'

export const runtime = 'nodejs'

const KEY_HASH = '263b9d779f8130f8e04c778155c9983980c4671c330e57141619aec4df1cdcb0'
const EXPIRES_AT = new Date('2026-09-11T15:30:00.000Z')

function equalHex(left: string, right: string) {
  const a = Buffer.from(left)
  const b = Buffer.from(right)
  return a.length === b.length && timingSafeEqual(a, b)
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const key = url.searchParams.get('key') || ''
  const hash = createHash('sha256').update(key).digest('hex')
  if (new Date() > EXPIRES_AT || !equalHex(hash, KEY_HASH)) {
    return NextResponse.json({ ok: false }, { status: 404 })
  }

  const stages: string[] = []
  try {
    stages.push('start')
    await connectDB()
    stages.push('db-connected')
    const owner = await User.findOne({ email: 'mabrig1@gmail.com' }).select('_id role subscription').lean()
    stages.push(owner ? 'owner-found' : 'owner-missing')
    await bcrypt.hash('AfriGrant-Diagnostic-Only-9384!', 12)
    stages.push('bcrypt-ok')
    return NextResponse.json({ ok: Boolean(owner), stages }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        stages,
        error: error instanceof Error ? error.name : 'unknown',
      },
      { status: 500, headers: { 'Cache-Control': 'no-store' } },
    )
  }
}
