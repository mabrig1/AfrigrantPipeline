import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import Application from '@/models/Application'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    await connectDB()
    const userId = (session.user as { id?: string }).id
    const applications = await Application.find({ applicant: userId })
      .populate('grant', 'title funder deadline amount')
      .sort({ createdAt: -1 })
      .lean()
    return NextResponse.json(applications)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    await connectDB()
    const body = await req.json()
    const userId = (session.user as { id?: string }).id
    const application = await Application.create({ ...body, applicant: userId })
    return NextResponse.json(application, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create application' }, { status: 500 })
  }
}
