import { randomBytes } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { connectDB } from '@/lib/mongodb'
import Grant from '@/models/Grant'
import ScholarshipMatchSession from '@/models/ScholarshipMatchSession'
import { extractScholarshipProfileFromCv } from '@/lib/scholarships/cvProfile'
import {
  calculateReadiness,
  matchScholarships,
  type ScholarshipApplicantProfile,
  type ScholarshipOpportunity,
  type ScholarshipLevel,
} from '@/lib/scholarships/matcher'

export const runtime = 'nodejs'
export const maxDuration = 60

const requestSchema = z.object({
  email: z.string().email().max(200),
  targetLevel: z.enum(['undergraduate', 'masters', 'phd', 'postdoc', 'fellowship']),
  needsFullFunding: z.boolean().default(true),
})

const validLevels = new Set<ScholarshipLevel>([
  'undergraduate',
  'masters',
  'phd',
  'postdoc',
  'fellowship',
])

type ScholarshipGrantRecord = {
  _id: { toString(): string }
  title: string
  funder: string
  deadline?: Date
  isRolling?: boolean
  status?: string
  applicationLink?: string
  sourceUrl?: string
  verificationStatus?: string
  nigeriaEligible?: boolean
  eligibility?: string[]
  categories?: string[]
  countries?: string[]
  scholarshipDetails?: {
    levels?: string[]
    fundingType?: string
    fieldsOfStudy?: string[]
    studyCountries?: string[]
    applicationCycle?: string
  }
}

function opportunityFromGrant(
  item: ScholarshipGrantRecord,
  targetLevel: ScholarshipLevel
): ScholarshipOpportunity {
  const rawLevels = (item.scholarshipDetails?.levels ?? []).filter(
    (level): level is ScholarshipLevel => validLevels.has(level as ScholarshipLevel)
  )
  const levels = rawLevels
  const fields = item.scholarshipDetails?.fieldsOfStudy?.length
    ? item.scholarshipDetails.fieldsOfStudy
    : item.categories?.filter(
        (value) => value !== 'scholarship' && !validLevels.has(value as ScholarshipLevel)
      )

  const deadline = item.deadline ? new Date(item.deadline) : null
  const deadlineLabel =
    item.isRolling
      ? 'Rolling applications'
      : deadline && !Number.isNaN(deadline.getTime()) && deadline.getUTCFullYear() < 2098
        ? 'Deadline: ' + deadline.toISOString().slice(0, 10)
        : item.scholarshipDetails?.applicationCycle || 'Current cycle requires provider verification'

  const fundingType = item.scholarshipDetails?.fundingType
  const sourceLink = item.applicationLink || item.sourceUrl || ''

  return {
    id: item._id.toString(),
    title: item.title,
    provider: item.funder,
    levels,
    funding:
      fundingType === 'full'
        ? 'full'
        : fundingType && fundingType !== 'other'
          ? 'partial'
          : 'unknown',
    countries:
      item.scholarshipDetails?.studyCountries?.length
        ? item.scholarshipDetails.studyCountries
        : item.countries?.length
          ? item.countries
          : ['International'],
    fields: fields?.length ? fields : [],
    officialUrl: sourceLink,
    verificationStatus:
      item.verificationStatus === 'verified' ? 'official-source' : 'needs-verification',
    deadlineLabel,
    catalogueStatus:
      item.status === 'open' ? 'open' : item.status === 'draft' ? 'draft' : undefined,
    nigeriaEligible: item.nigeriaEligible === true,
    eligibility: item.eligibility ?? [],
    hasSourceLink: Boolean(sourceLink),
  }
}

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData()
    const email = String(form.get('email') || '').trim().toLowerCase()
    const targetLevel = String(form.get('targetLevel') || '')
    const needsFullFunding = String(form.get('needsFullFunding') || 'true') !== 'false'
    const file = form.get('cv')

    const parsed = requestSchema.safeParse({ email, targetLevel, needsFullFunding })
    if (!parsed.success) {
      return NextResponse.json({ error: 'Enter a valid email and target study level.' }, { status: 400 })
    }
    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: 'Upload your CV to start the scholarship match.' }, { status: 400 })
    }

    const extracted = await extractScholarshipProfileFromCv(file)
    const profile: ScholarshipApplicantProfile = {
      nationality: extracted.nationality,
      targetLevel: parsed.data.targetLevel,
      field: extracted.field,
      ...(typeof extracted.gpa === 'number' ? { gpa: extracted.gpa } : {}),
      workExperienceYears: extracted.workExperienceYears,
      needsFullFunding: parsed.data.needsFullFunding,
      hasCv: true,
      hasTranscript: false,
      hasStatement: false,
      hasReferences: false,
      hasEnglishProof: false,
      keywords: extracted.keywords,
    }

    await connectDB()

    const records = (await Grant.find({
      grantType: 'scholarship',
      status: { $in: ['open', 'draft'] },
      verificationStatus: { $ne: 'stale' },
    })
      .sort({ verificationStatus: 1, relevanceScore: -1, deadline: 1, createdAt: -1 })
      .limit(2000)
      .lean()) as unknown as ScholarshipGrantRecord[]

    const opportunities = records.map((item) =>
      opportunityFromGrant(item, parsed.data.targetLevel)
    )
    const allMatches = matchScholarships(profile, opportunities)
    const relevantMatches = allMatches.filter((match) => match.score >= 50)
    const strongCount = relevantMatches.filter((match) => match.score >= 75).length
    const possibleCount = relevantMatches.length - strongCount
    const readiness = calculateReadiness(profile)
    const byId = new Map(records.map((item) => [item._id.toString(), item]))

    const publicId = randomBytes(24).toString('hex')
    await ScholarshipMatchSession.create({
      publicId,
      email: parsed.data.email,
      targetLevel: parsed.data.targetLevel,
      profile: extracted,
      readinessScore: readiness.score,
      screenedCount: records.length,
      matchCount: relevantMatches.length,
      strongCount,
      possibleCount,
      matches: relevantMatches.map((match) => ({
        grant: byId.get(match.opportunity.id)!._id,
        score: match.score,
        label: match.label,
        reasons: match.reasons,
        gaps: match.gaps,
      })),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    })

    return NextResponse.json({
      sessionId: publicId,
      screenedCount: records.length,
      matchCount: relevantMatches.length,
      strongCount,
      possibleCount,
      readiness: {
        score: readiness.score,
        nextAction: readiness.nextAction,
      },
      profileSummary: {
        nationality: extracted.nationality,
        field: extracted.field,
        targetLevel: parsed.data.targetLevel,
        workExperienceYears: extracted.workExperienceYears,
        educationSummary: extracted.educationSummary,
      },
      price: {
        NGN: 5000,
        USD: 5,
      },
      message:
        relevantMatches.length > 0
          ? 'Your scholarship matches are ready. Unlock the matched records to view scholarship names, fit scores, provider details and application links.'
          : 'No relevant match reached the current screening threshold. Try a different target level or an updated CV.',
      disclaimer:
        'Matching is screening guidance, not an eligibility guarantee. Programme details must be verified with the scholarship provider before applying.',
    })
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Unable to analyse this CV and generate scholarship matches.',
      },
      { status: 500 }
    )
  }
}
