import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Grant from '@/models/Grant'

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin only' }, { status: 403 })
    }

    const body = (await req.json()) as {
      title: string
      description: string
      funder: string
      amount: number
      currency: string
      deadline: string
      grantType: string
      eligibility: string
      categories: string
      countries: string
      region: string
      applicationLink: string
    }

    await connectDB()
    const grant = await Grant.create({
      title: body.title.trim(),
      description: body.description.trim(),
      funder: body.funder.trim(),
      amount: Number(body.amount),
      currency: body.currency || 'USD',
      deadline: new Date(body.deadline),
      grantType: body.grantType || 'other',
      eligibility: body.eligibility ? body.eligibility.split(',').map((s) => s.trim()).filter(Boolean) : [],
      categories: body.categories ? body.categories.split(',').map((s) => s.trim()).filter(Boolean) : [],
      countries: body.countries ? body.countries.split(',').map((s) => s.trim()).filter(Boolean) : [],
      region: body.region?.trim() || undefined,
      applicationLink: body.applicationLink?.trim() || undefined,
      status: 'open',
      createdBy: session.user.id,
    })

    return NextResponse.json({ data: grant, message: 'Grant created' }, { status: 201 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to create grant'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
