import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import type { UserRole } from '@/types/database'

const VALID_ROLES: UserRole[] = ['student', 'researcher', 'lecturer', 'institution']

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      name?: string
      email?: string
      password?: string
      organization?: string
      role?: string
    }

    const { name, email, password, organization, role } = body

    if (!name || name.trim().length < 2)
      return NextResponse.json({ error: 'Full name must be at least 2 characters.' }, { status: 400 })
    if (!email || !/^\S+@\S+\.\S+$/.test(email))
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    if (!password || password.length < 8)
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })

    const userRole: UserRole = VALID_ROLES.includes(role as UserRole) ? (role as UserRole) : 'student'

    await connectDB()

    const existing = await User.findOne({ email: email.toLowerCase().trim() }).lean()
    if (existing)
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 })

    const hashed = await bcrypt.hash(password, 12)

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashed,
      role: userRole,
      organization: organization?.trim() || undefined,
      subscription: 'free',
    })

    return NextResponse.json({ id: user._id.toString() }, { status: 201 })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Registration failed. Please try again.' },
      { status: 500 }
    )
  }
}
