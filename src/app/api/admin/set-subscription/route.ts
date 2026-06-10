import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import type { SubscriptionPlan } from '@/types/database'

const VALID_PLANS: SubscriptionPlan[] = ['free', 'silver', 'gold', 'platinum']

// POST /api/admin/set-subscription
// Body: { email, plan, durationDays? }
// Admin-only — used to manually upgrade users after Paystack payment confirmation
export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    if (session.user.role !== 'admin') return NextResponse.json({ error: 'Admin only' }, { status: 403 })

    const body = (await req.json()) as { email?: string; plan?: string; durationDays?: number }
    const { email, plan, durationDays = 30 } = body

    if (!email || !plan) return NextResponse.json({ error: 'email and plan are required' }, { status: 400 })
    if (!VALID_PLANS.includes(plan as SubscriptionPlan)) {
      return NextResponse.json({ error: `Invalid plan. Must be one of: ${VALID_PLANS.join(', ')}` }, { status: 400 })
    }

    await connectDB()

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + durationDays)

    const updated = await User.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      {
        subscription: plan as SubscriptionPlan,
        subscriptionExpiresAt: plan === 'free' ? null : expiresAt,
      },
      { new: true }
    ).select('name email subscription subscriptionExpiresAt')

    if (!updated) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    return NextResponse.json({
      message: `${updated.name} upgraded to ${plan}`,
      user: {
        name: updated.name,
        email: updated.email,
        subscription: updated.subscription,
        expiresAt: updated.subscriptionExpiresAt,
      },
    })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 500 })
  }
}
