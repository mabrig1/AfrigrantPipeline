import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import {
  calculateReadiness,
  matchScholarships,
  type ScholarshipApplicantProfile,
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
    const matches = matchScholarships(profile)

    return NextResponse.json({
      generatedAt: new Date().toISOString(),
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
