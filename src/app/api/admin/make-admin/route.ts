import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'

// One-time route: promotes the signed-in user to admin.
// Protected by ADMIN_SETUP_SECRET env var so only you can use it.
export async function POST(req: Request) {
  try {
    const { secret } = (await req.json()) as { secret?: string }

    const requiredSecret = process.env.ADMIN_SETUP_SECRET
    if (!requiredSecret || secret !== requiredSecret) {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 403 })
    }

    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'You must be signed in' }, { status: 401 })
    }

    await connectDB()
    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { role: 'admin' },
      { new: true },
    )

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ message: `${user.email} is now admin` })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
