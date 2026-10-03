import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { connectDB } from '@/lib/mongodb'
import ScholarshipMatchSession from '@/models/ScholarshipMatchSession'

export const runtime = 'nodejs'

const schema = z.object({
  sessionId: z.string().length(48),
  reference: z.string().min(4).max(200),
})

const EXPECTED_MINOR = {
  NGN: 500000,
  USD: 500,
} as const

export async function POST(request: NextRequest) {
  try {
    const body = schema.safeParse(await request.json())
    if (!body.success) {
      return NextResponse.json({ error: 'Invalid payment verification request.' }, { status: 400 })
    }

    const secret = process.env.PAYSTACK_SECRET_KEY
    if (!secret) {
      return NextResponse.json({ error: 'Payment gateway is not configured.' }, { status: 503 })
    }

    await connectDB()
    const session = await ScholarshipMatchSession.findOne({
      publicId: body.data.sessionId,
      expiresAt: { $gt: new Date() },
    })

    if (!session) {
      return NextResponse.json({ error: 'This match session has expired.' }, { status: 404 })
    }
    if (session.unlockedAt) {
      return NextResponse.json({ unlocked: true })
    }

    const response = await fetch(
      'https://api.paystack.co/transaction/verify/' + encodeURIComponent(body.data.reference),
      {
        cache: 'no-store',
        signal: AbortSignal.timeout(15_000),
        headers: { Authorization: 'Bearer ' + secret },
      }
    )
    const payload = (await response.json()) as {
      status?: boolean
      message?: string
      data?: {
        status?: string
        amount?: number
        currency?: string
        reference?: string
        metadata?: { product?: string; sessionId?: string }
        customer?: { email?: string }
      }
    }

    const payment = payload.data
    const currency = payment?.currency as keyof typeof EXPECTED_MINOR | undefined
    const expected = currency ? EXPECTED_MINOR[currency] : undefined
    const verified =
      response.ok &&
      payload.status === true &&
      payment?.status === 'success' &&
      (currency === 'NGN' || currency === 'USD') &&
      payment.amount === expected &&
      payment.metadata?.product === 'scholarship_match_unlock' &&
      payment.metadata?.sessionId === session.publicId &&
      payment.customer?.email?.toLowerCase() === session.email.toLowerCase()

    if (!verified || !currency || expected === undefined) {
      return NextResponse.json(
        { error: payload.message || 'Payment could not be verified for this match session.' },
        { status: 402 }
      )
    }

    session.unlockedAt = new Date()
    session.paymentReference = payment.reference || body.data.reference
    session.paymentCurrency = currency
    session.paymentAmountMinor = expected
    await session.save()

    return NextResponse.json({ unlocked: true })
  } catch {
    return NextResponse.json({ error: 'Unable to verify payment.' }, { status: 500 })
  }
}
