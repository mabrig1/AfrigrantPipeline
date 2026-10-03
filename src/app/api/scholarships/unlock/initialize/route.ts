import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { connectDB } from '@/lib/mongodb'
import ScholarshipMatchSession from '@/models/ScholarshipMatchSession'

export const runtime = 'nodejs'

const schema = z.object({
  sessionId: z.string().length(48),
  currency: z.enum(['NGN', 'USD']),
})

const PRICE_MINOR = {
  NGN: 500000,
  USD: 500,
} as const

export async function POST(request: NextRequest) {
  try {
    const body = schema.safeParse(await request.json())
    if (!body.success) {
      return NextResponse.json({ error: 'Invalid unlock request.' }, { status: 400 })
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
      return NextResponse.json({
        alreadyUnlocked: true,
        resultsUrl: '/api/scholarships/unlock/results?sessionId=' + session.publicId,
      })
    }

    if (session.matchCount < 1) {
      return NextResponse.json({ error: 'There are no matched records to unlock.' }, { status: 400 })
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ||
      request.nextUrl.origin.replace(/\/$/, '')
    const amount = PRICE_MINOR[body.data.currency]

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      cache: 'no-store',
      signal: AbortSignal.timeout(15_000),
      headers: {
        Authorization: 'Bearer ' + secret,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: session.email,
        amount,
        currency: body.data.currency,
        callback_url:
          baseUrl +
          '/scholarships/matcher?session=' +
          encodeURIComponent(session.publicId),
        metadata: {
          product: 'scholarship_match_unlock',
          sessionId: session.publicId,
          matchedRecords: session.matchCount,
        },
      }),
    })

    const payload = (await response.json()) as {
      status?: boolean
      message?: string
      data?: {
        authorization_url?: string
        access_code?: string
        reference?: string
      }
    }

    if (!response.ok || !payload.status || !payload.data?.authorization_url) {
      return NextResponse.json(
        {
          error:
            payload.message ||
            (body.data.currency === 'USD'
              ? 'USD payment is not enabled on this Paystack account. Choose ₦5,000 instead.'
              : 'Unable to start payment.'),
        },
        { status: 502 }
      )
    }

    return NextResponse.json({
      authorizationUrl: payload.data.authorization_url,
      reference: payload.data.reference,
      currency: body.data.currency,
      amount: body.data.currency === 'NGN' ? 5000 : 5,
    })
  } catch {
    return NextResponse.json({ error: 'Unable to start payment.' }, { status: 500 })
  }
}
