import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Grant from '@/models/Grant'
import {
  analyseCv,
  discoverAndMatchGrants,
  type GrantEvidence,
} from '@/lib/grants/cvMatcher'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const MAX_FILE_BYTES = 4 * 1024 * 1024

function sameOrigin(req: Request) {
  const origin = req.headers.get('origin')
  const host = req.headers.get('host')
  if (!origin || !host) return true
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

function fundingText(grant: {
  fundingText?: string
  amount?: number
  currency?: string
}) {
  if (grant.fundingText?.trim()) return grant.fundingText
  if (!grant.amount) return undefined
  return `${grant.currency || 'USD'} ${Number(grant.amount).toLocaleString()}`
}

export async function POST(req: Request) {
  try {
    if (!sameOrigin(req)) {
      return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
    }

    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Sign in to use CV grant matching.' }, { status: 401 })
    }

    const form = await req.formData()
    const consent = String(form.get('consent') || '') === 'true'
    if (!consent) {
      return NextResponse.json(
        { error: 'Confirm consent before sending CV content to the configured AI provider.' },
        { status: 400 },
      )
    }

    const focus = String(form.get('focus') || '').trim().slice(0, 500)
    const cvText = String(form.get('cvText') || '').trim().slice(0, 50000)
    const fileValue = form.get('cv')
    const file = fileValue instanceof File && fileValue.size > 0 ? fileValue : null

    if (!file && cvText.length < 100) {
      return NextResponse.json(
        { error: 'Upload a PDF/TXT CV or paste at least 100 characters of CV text.' },
        { status: 400 },
      )
    }

    if (file && file.size > MAX_FILE_BYTES) {
      return NextResponse.json({ error: 'CV file is too large. Maximum size is 4 MB.' }, { status: 413 })
    }

    let bytes: Uint8Array | undefined
    if (file) bytes = new Uint8Array(await file.arrayBuffer())

    const profile = await analyseCv({
      filename: file?.name,
      mimeType: file?.type,
      bytes,
      pastedText: cvText.length >= 100 ? cvText : undefined,
    })

    await connectDB()
    const now = new Date()
    const grants = await Grant.find({
      status: 'open',
      $or: [{ isRolling: true }, { deadline: { $gte: now } }],
    })
      .sort({ verificationStatus: 1, relevanceScore: -1, deadline: 1 })
      .limit(40)
      .lean()

    const catalogueEvidence: GrantEvidence[] = grants
      .map((grant): GrantEvidence | null => {
        const url = grant.applicationLink || grant.sourceUrl
        if (!url || !/^https:\/\//i.test(url)) return null
        return {
          title: grant.title,
          url,
          source: 'catalogue' as const,
          funder: grant.funder,
          description: grant.description,
          deadline: grant.isRolling
            ? 'Rolling'
            : grant.deadline
              ? new Date(grant.deadline).toISOString().slice(0, 10)
              : undefined,
          funding: fundingText(grant),
          eligibility: grant.eligibility,
          countries: grant.countries,
          categories: grant.categories,
          raw: [
            grant.agentNotes,
            grant.verificationStatus ? `Verification: ${grant.verificationStatus}` : '',
            grant.confidenceScore != null ? `Confidence: ${grant.confidenceScore}` : '',
          ]
            .filter(Boolean)
            .join(' | '),
        } satisfies GrantEvidence
      })
      .filter((item): item is GrantEvidence => Boolean(item))

    const result = await discoverAndMatchGrants({
      profile,
      catalogueEvidence,
      focus,
    })

    return NextResponse.json(
      {
        profile,
        ...result,
        privacy: {
          cvStored: false,
          note: 'The uploaded CV file is processed for this request and is not stored by AfriGrantPipeline.',
        },
      },
      { headers: { 'Cache-Control': 'private, no-store' } },
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'CV grant matching failed.'
    return NextResponse.json(
      { error: message },
      { status: /configure|configured/i.test(message) ? 503 : 500 },
    )
  }
}
