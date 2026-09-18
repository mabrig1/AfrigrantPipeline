import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { connectDB } from '@/lib/mongodb'
import Grant from '@/models/Grant'
import {
  calculateReadiness,
  matchScholarships,
  type ScholarshipApplicantProfile,
  type ScholarshipOpportunity,
  type ScholarshipLevel,
} from '@/lib/scholarships/matcher'

const profileSchema = z.object({
  nationality: z.string().trim().min(2).max(100),
  targetLevel: z.enum(['undergraduate', 'masters', 'phd', 'postdoc', 'fellowship']),
  field: z.string().trim().min(2).max(200),
  gpa: z.number().min(0).max(5).optional(),
  workExperienceYears: z.number().int().min(0).max(50).default(0),
  needsFullFunding: z.boolean().default(true),
  hasCv: z.boolean().default(false),
  hasTranscript: z.boolean().default(false),
  hasStatement: z.boolean().default(false),
  hasReferences: z.boolean().default(false),
  hasEnglishProof: z.boolean().default(false),
})

const matcherLevels = new Set<ScholarshipLevel>([
  'undergraduate',
  'masters',
  'phd',
  'postdoc',
  'fellowship',
])

function deadlineLabel(item: {
  deadline?: Date
  isRolling?: boolean
  scholarshipDetails?: { applicationCycle?: string }
}) {
  if (item.isRolling) return 'Rolling applications'

  const deadline = item.deadline ? new Date(item.deadline) : null
  if (deadline && !Number.isNaN(deadline.getTime()) && deadline.getUTCFullYear() < 2098) {
    return 'Deadline: ' + deadline.toISOString().slice(0, 10)
  }

  return item.scholarshipDetails?.applicationCycle || 'Verify current application window'
}

async function liveScholarshipCatalog(): Promise<ScholarshipOpportunity[]> {
  await connectDB()

  const records = await Grant.find({
    grantType: 'scholarship',
    discoveredBy: 'agent',
    status: 'open',
    deadline: { $gt: new Date() },
    verificationStatus: { $in: ['verified', 'needs_review'] },
  })
    .sort({ verificationStatus: 1, relevanceScore: -1, deadline: 1 })
    .limit(60)
    .lean()

  return records
    .map((item): ScholarshipOpportunity | null => {
      const details = item.scholarshipDetails
      const levels = (details?.levels ?? []).filter(
        (level): level is ScholarshipLevel => matcherLevels.has(level as ScholarshipLevel)
      )

      if (levels.length === 0 || !item.applicationLink) return null

      return {
        id: item._id.toString(),
        title: item.title,
        provider: item.funder,
        levels,
        funding: details?.fundingType === 'full' ? 'full' : 'partial',
        countries:
          details?.studyCountries?.length
            ? details.studyCountries
            : item.countries?.length
              ? item.countries
              : ['International'],
        fields:
          details?.fieldsOfStudy?.length
            ? details.fieldsOfStudy
            : item.categories?.filter((value) => value !== 'scholarship') ?? ['all'],
        officialUrl: item.applicationLink,
        verificationStatus:
          item.verificationStatus === 'verified' ? 'official-source' : 'needs-verification',
        deadlineLabel: deadlineLabel(item),
      }
    })
    .filter((item): item is ScholarshipOpportunity => Boolean(item))
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = profileSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Invalid scholarship profile.',
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const profile = parsed.data as ScholarshipApplicantProfile
    const readiness = calculateReadiness(profile)
    const liveCatalog = await liveScholarshipCatalog()
    const matches = matchScholarships(
      profile,
      liveCatalog.length > 0 ? liveCatalog : undefined
    )

    return NextResponse.json({
      generatedAt: new Date().toISOString(),
      catalogSource: liveCatalog.length > 0 ? 'live-crawler' : 'starter-fallback',
      opportunitiesScreened: liveCatalog.length > 0 ? liveCatalog.length : matches.length,
      readiness,
      matches,
      disclaimer:
        'Match scores are screening guidance, not an eligibility guarantee. Always verify current deadlines and requirements on the official scholarship website.',
    })
  } catch {
    return NextResponse.json(
      { error: 'Unable to generate scholarship matches.' },
      { status: 500 }
    )
  }
}
