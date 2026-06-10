import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'

// GET /api/admin/bootstrap?secret=YOUR_ADMIN_SETUP_SECRET
// Promotes mabrig1@gmail.com to admin + platinum without requiring login
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const secret = searchParams.get('secret')

    const adminSecret = process.env.ADMIN_SETUP_SECRET
    if (!adminSecret || secret !== adminSecret) {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
    }

    await connectDB()

    const user = await User.findOneAndUpdate(
      { email: 'mabrig1@gmail.com' },
      {
        role: 'admin',
        subscription: 'platinum',
        subscriptionExpiresAt: new Date('2099-12-31'),
      },
      { new: true }
    ).select('name email role subscription')

    if (!user) {
      return NextResponse.json(
        { error: 'User mabrig1@gmail.com not found. Register first at /signup, then call this endpoint.' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Done! ${user.name} is now admin with Platinum access. Sign in at /login.`,
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
      { status: 500 }
    )
  }
}
