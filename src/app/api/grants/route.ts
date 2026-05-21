import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import Grant from '@/models/Grant'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') || 'open'
    const grants = await Grant.find({ status }).sort({ deadline: 1 }).lean()
    return NextResponse.json(grants)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch grants' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || (session.user as { role?: string }).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    await connectDB()
    const body = await req.json()
    const grant = await Grant.create({ ...body, createdBy: (session.user as { id?: string }).id })
    return NextResponse.json(grant, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create grant' }, { status: 500 })
  }
}
