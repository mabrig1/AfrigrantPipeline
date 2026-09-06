import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'

const DEFAULT_OWNER_EMAILS = ['mabrig1@gmail.com']

function ownerEmails(): Set<string> {
  const configured = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)

  return new Set([...DEFAULT_OWNER_EMAILS, ...configured])
}

// One-time route: promotes the signed-in owner (or a user with the setup secret)
// to admin. The owner path prevents an environment-secret mismatch from locking
// the repository owner out of the first admin bootstrap.
export async function POST(req: Request) {
  try {
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
    const isOwner = ownerEmails().has(email)
    const requiredSecret = process.env.ADMIN_SETUP_SECRET?.trim() ?? ''
    const secretMatches = Boolean(requiredSecret && secret && secret === requiredSecret)

    if (!isOwner && !secretMatches) {
      if (!requiredSecret) {
        return NextResponse.json(
          {
            error:
              'Admin setup is not configured for this account. Add this email to ADMIN_EMAILS or set ADMIN_SETUP_SECRET in Vercel, then redeploy.',
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
        subscriptionExpiresAt: new Date('2099-12-31T23:59:59.999Z'),
      },
      { new: true },
    ).select('name email role subscription')

    if (!user) {
      return NextResponse.json({ error: 'Signed-in user was not found in the database' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: `${user.email} now has admin and Platinum access.`,
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
