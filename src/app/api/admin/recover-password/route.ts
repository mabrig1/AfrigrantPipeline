import { timingSafeEqual } from 'node:crypto'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import { isOwnerEmail } from '@/lib/owner'
import { checkOrigin } from '@/lib/consultancy/access'

const schema = z
  .object({
    email: z.string().trim().email().max(200),
    secret: z.string().min(12).max(300),
    password: z.string().min(12).max(128),
    confirm: z.string().min(12).max(128),
  })
  .strict()

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
    const configuredSecret = (
      process.env.OWNER_RECOVERY_SECRET ||
      process.env.ADMIN_SETUP_SECRET ||
      ''
    ).trim()

    if (!configuredSecret || configuredSecret.length < 12) {
      return NextResponse.json(
        {
          error:
            'Creator password recovery is not configured. Set OWNER_RECOVERY_SECRET (recommended) or ADMIN_SETUP_SECRET in the production environment.',
        },
        { status: 503, headers: { 'Cache-Control': 'no-store' } },
      )
    }

    if (
      !isOwnerEmail(email) ||
      !secureEqual(body.secret.trim(), configuredSecret)
    ) {
      return NextResponse.json(
        { error: 'The creator email or recovery secret is not valid.' },
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
    const hash = await bcrypt.hash(body.password, 12)

    const user = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          password: hash,
          role: 'admin',
          subscription: 'platinum',
          subscriptionExpiresAt: null,
        },
        $setOnInsert: {
          name: 'Mabrig Korie',
          email,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ).select('_id email role subscription')

    return NextResponse.json(
      {
        success: true,
        message:
          'Creator password updated. Sign in with your email and new password.',
        user: {
          email: user.email,
          role: user.role,
          subscription: user.subscription,
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
