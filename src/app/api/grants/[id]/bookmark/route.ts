import { type NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Grant from '@/models/Grant'
import mongoose from 'mongoose'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const { id } = await params

  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: 'Invalid grant ID' }, { status: 400 })
  }

  await connectDB()

  const grant = await Grant.findById(id).select('bookmarkedBy').lean()
  if (!grant) {
    return NextResponse.json({ error: 'Grant not found' }, { status: 404 })
  }

  const userId = new mongoose.Types.ObjectId(session.user.id)
  const isBookmarked = (grant.bookmarkedBy ?? []).some((b) => b.equals(userId))

  if (isBookmarked) {
    await Grant.findByIdAndUpdate(id, { $pull: { bookmarkedBy: userId } })
  } else {
    await Grant.findByIdAndUpdate(id, { $addToSet: { bookmarkedBy: userId } })
  }

  return NextResponse.json({ data: { bookmarked: !isBookmarked } })
}
