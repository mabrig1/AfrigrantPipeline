import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'

import { isOwnerEmail } from '@/lib/owner'
import { checkOrigin } from '@/lib/consultancy/access'

// One-time route: promotes the signed-in owner (or a user with the setup secret)
// to admin. The owner path prevents an environment-secret mismatch from locking
// the repository owner out of the first admin bootstrap.
export async function POST(req: Request) {
  try {
    checkOrigin(req)
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'You must be signed in' }, { status: 401 })
    }

    let secret = ''
    try {
      const body = (await req.json()) as { secret?: string }
      secret = body.secret?.trim() ?? ''
    } catch {
      // Secret is optional for an authorized owner account.
    }

    const email = session.user.email.trim().toLowerCase()
    await connectDB()
    const current = await User.findById(session.user.id).select('email role emailVerified').lean()
    const isOwner = Boolean(current && current.email === email && ((current.role === 'admin' && session.user.role === 'admin') || (session.user.verifiedOwner && current.emailVerified && isOwnerEmail(email))))
    const requiredSecret = process.env.ADMIN_SETUP_SECRET?.trim() ?? ''
    const secretMatches = Boolean(requiredSecret && secret && secret === requiredSecret)

    if (!isOwner && !secretMatches) {
      if (!requiredSecret) {
        return NextResponse.json(
          {
            error:
              'Use Google sign-in with your verified owner email, or supply the configured admin setup secret.',
          },
          { status: 503 },
        )
      }

      return NextResponse.json(
        {
          error:
            'The setup secret does not match the deployed environment. Check the Production ADMIN_SETUP_SECRET in Vercel, or add your signed-in email to ADMIN_EMAILS.',
        },
        { status: 403 },
      )
    }

    await connectDB()
    const user = await User.findOneAndUpdate(
      { email },
      {
        role: 'admin',
        subscription: 'platinum',
        subscriptionExpiresAt: null,
      },
      { new: true },
    ).select('name email role subscription')

    if (!user) {
      return NextResponse.json({ error: 'Signed-in user was not found in the database' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: `${user.email} now has permanent creator premium access. Sign in again if the workspace has not refreshed. No subscription is required.`,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        subscription: user.subscription,
      },
    })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 },
    )
  }
}
