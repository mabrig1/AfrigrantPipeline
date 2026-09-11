import { createHash, timingSafeEqual } from 'node:crypto'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import { isOwnerEmail } from '@/lib/owner'
import { checkOrigin } from '@/lib/consultancy/access'

const EMERGENCY_TOKEN_HASH =
  '982c77bac5c851e12bc69787eacc6ce109fc53a9ccc8c3b891610afae5420282'
const EMERGENCY_TOKEN_EXPIRES_AT = new Date('2026-09-11T14:46:40.764Z')

const schema = z
  .object({
    email: z.string().trim().email().max(200),
    secret: z.string().max(300).optional(),
    token: z.string().max(300).optional(),
    password: z.string().min(12).max(128),
    confirm: z.string().min(12).max(128),
  })
  .refine((data) => Boolean(data.secret || data.token), {
    message: 'A recovery secret or one-time reset token is required.',
  })

function secureEqual(left: string, right: string) {
  const a = Buffer.from(left)
  const b = Buffer.from(right)
  return a.length === b.length && timingSafeEqual(a, b)
}

function validPassword(password: string) {
  return (
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  )
}

export async function POST(req: Request) {
  try {
    checkOrigin(req)

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

    if (!validPassword(body.password)) {
      return NextResponse.json(
        {
          error:
            'Use at least 12 characters with uppercase, lowercase, a number, and a symbol.',
        },
        { status: 400, headers: { 'Cache-Control': 'no-store' } },
      )
    }

    await connectDB()
    const existing = await User.collection.findOne({ email })

    if (!existing) {
      return NextResponse.json(
        { error: 'Creator account was not found.' },
        { status: 404, headers: { 'Cache-Control': 'no-store' } },
      )
    }

    let usedEmergencyToken = false

    if (body.token) {
      const tokenHash = createHash('sha256').update(body.token).digest('hex')
      const tokenValid =
        new Date() < EMERGENCY_TOKEN_EXPIRES_AT &&
        secureEqual(tokenHash, EMERGENCY_TOKEN_HASH) &&
        !existing['emergencyResetUsedAt']

      if (!tokenValid) {
        return NextResponse.json(
          { error: 'This one-time reset link is invalid, expired, or already used.' },
          { status: 403, headers: { 'Cache-Control': 'no-store' } },
        )
      }

      usedEmergencyToken = true
    } else {
      const configuredSecret = (
        process.env.OWNER_RECOVERY_SECRET ||
        process.env.ADMIN_SETUP_SECRET ||
        ''
      ).trim()

      if (!configuredSecret || configuredSecret.length < 12) {
        return NextResponse.json(
          {
            error:
              'Creator password recovery is not configured. Use the one-time reset link.',
          },
          { status: 503, headers: { 'Cache-Control': 'no-store' } },
        )
      }

      if (!secureEqual((body.secret || '').trim(), configuredSecret)) {
        return NextResponse.json(
          { error: 'The creator recovery secret is not valid.' },
          { status: 403, headers: { 'Cache-Control': 'no-store' } },
        )
      }
    }

    const hash = await bcrypt.hash(body.password, 12)
    const now = new Date()

    await User.collection.updateOne(
      { email },
      {
        $set: {
          password: hash,
          role: 'admin',
          subscription: 'platinum',
          subscriptionExpiresAt: null,
          ...(usedEmergencyToken ? { emergencyResetUsedAt: now } : {}),
        },
      },
    )

    return NextResponse.json(
      {
        success: true,
        message:
          'Creator password updated. Sign in with your email and new password.',
        user: {
          email,
          role: 'admin',
          subscription: 'platinum',
        },
      },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || 'Check the recovery form.' },
        { status: 400, headers: { 'Cache-Control': 'no-store' } },
      )
    }

    console.error(
      'Creator password recovery failed',
      error instanceof Error ? error.name : 'unknown',
    )
    return NextResponse.json(
      { error: 'Password recovery could not be completed. Try again.' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } },
    )
  }
}
