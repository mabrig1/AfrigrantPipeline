import { type NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Article from '@/models/Article'
import mongoose from 'mongoose'

interface SubmitBody {
  title: string
  abstract: string
  content: string
  keywords?: string[]
  language?: string
  license?: string
  journal?: string
  attachments?: string[]
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  let body: SubmitBody
  try {
    body = (await req.json()) as SubmitBody
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { title, abstract, content, keywords, language, license, journal, attachments } = body

  if (!title?.trim() || title.trim().length < 5) {
    return NextResponse.json({ error: 'Title must be at least 5 characters' }, { status: 422 })
  }
  if (!abstract?.trim() || abstract.trim().length < 50) {
    return NextResponse.json({ error: 'Abstract must be at least 50 characters' }, { status: 422 })
  }
  if (!content?.trim() || content.trim().length < 100) {
    return NextResponse.json({ error: 'Content must be at least 100 characters' }, { status: 422 })
  }

  const journalId =
    journal && mongoose.isValidObjectId(journal)
      ? new mongoose.Types.ObjectId(journal)
      : undefined

  await connectDB()

  const article = await Article.create({
    title: title.trim(),
    abstract: abstract.trim(),
    content: content.trim(),
    authors: [new mongoose.Types.ObjectId(session.user.id)],
    keywords: Array.isArray(keywords) ? keywords : [],
    language: language ?? 'en',
    license: license ?? 'All Rights Reserved',
    journal: journalId,
    attachments: Array.isArray(attachments) ? attachments.filter(Boolean) : [],
    status: 'submitted',
  })

  return NextResponse.json(
    { data: { _id: article._id.toString(), title: article.title, status: article.status } },
    { status: 201 },
  )
}
