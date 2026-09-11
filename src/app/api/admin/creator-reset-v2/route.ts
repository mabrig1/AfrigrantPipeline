import { createHash, timingSafeEqual } from 'node:crypto'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import { isOwnerEmail } from '@/lib/owner'

export const runtime = 'nodejs'

const RESET_TOKEN_HASH =
  'c44cf4cdf33a0c6e8fa0a2f78a4cd6044574d021dc4727952c1375bfa68093b0'
const RESET_EXPIRES_AT = new Date('2026-09-11T16:00:00.000Z')

const schema = z.object({
  email: z.string().trim().email().max(200),
  token: z.string().min(20).max(300),
  password: z.string().min(12).max(128),
  confirm: z.string().min(12).max(128),
})

function secureEqual(left: string, right: string) {
  const a = Buffer.from(left)
  const b = Buffer.from(right)
  return a.length === b.length && timingSafeEqual(a, b)
}

function strongPassword(password: string) {
  return (
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  )
}

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json())
    const email = body.email.toLowerCase()

    if (!isOwnerEmail(email)) {
      return NextResponse.json(
        { error: 'This email is not authorized for creator recovery.' },
        { status: 403, headers: { 'Cache-Control': 'no-store' } },
      )
    }

    if (body.password !== body.confirm) {
      return NextResponse.json(
        { error: 'The passwords do not match.' },
        { status: 400, headers: { 'Cache-Control': 'no-store' } },
      )
    }

    if (!strongPassword(body.password)) {
      return NextResponse.json(
        {
          error:
            'Use at least 12 characters with uppercase, lowercase, a number, and a symbol.',
        },
        { status: 400, headers: { 'Cache-Control': 'no-store' } },
      )
    }

    const tokenHash = createHash('sha256').update(body.token).digest('hex')
    if (
      new Date() >= RESET_EXPIRES_AT ||
      !secureEqual(tokenHash, RESET_TOKEN_HASH)
    ) {
      return NextResponse.json(
        { error: 'This reset link is invalid or has expired.' },
        { status: 403, headers: { 'Cache-Control': 'no-store' } },
      )
    }

    await connectDB()

    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json(
        { error: 'Creator account was not found.' },
        { status: 404, headers: { 'Cache-Control': 'no-store' } },
      )
    }

    if (user.emergencyResetUsedAt) {
      return NextResponse.json(
        { error: 'This reset link has already been used.' },
        { status: 403, headers: { 'Cache-Control': 'no-store' } },
      )
    }

    user.password = await bcrypt.hash(body.password, 12)
    user.role = 'admin'
    user.subscription = 'platinum'
    user.set('subscriptionExpiresAt', null)
    user.emergencyResetUsedAt = new Date()

    await user.save()

    return NextResponse.json(
      {
        success: true,
        message: 'Creator password reset successfully.',
      },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || 'Check the reset form.' },
        { status: 400, headers: { 'Cache-Control': 'no-store' } },
      )
    }

    const message =
      error instanceof Error
        ? `${error.name}: ${error.message}`
        : 'Unknown server error'

    console.error('Creator reset v2 failed', message)

    return NextResponse.json(
      { error: `Password reset failed: ${message}` },
      { status: 500, headers: { 'Cache-Control': 'no-store' } },
    )
  }
}
