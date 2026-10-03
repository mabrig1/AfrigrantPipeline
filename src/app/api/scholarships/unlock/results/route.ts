import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Grant from '@/models/Grant'
import ScholarshipMatchSession from '@/models/ScholarshipMatchSession'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('sessionId') || ''
  if (!/^[a-f0-9]{48}$/.test(sessionId)) {
    return NextResponse.json({ error: 'Invalid match session.' }, { status: 400 })
  }

  await connectDB()
  const session = await ScholarshipMatchSession.findOne({
    publicId: sessionId,
    unlockedAt: { $exists: true },
    expiresAt: { $gt: new Date() },
  }).lean()

  if (!session) {
    return NextResponse.json(
      { error: 'Payment is required before matched scholarship details can be viewed.' },
      { status: 402 }
    )
  }

  const ids = session.matches.map((match) => match.grant)
  const grants = await Grant.find({ _id: { $in: ids } }).lean()
  const byId = new Map(grants.map((grant) => [grant._id.toString(), grant]))

  const matches = session.matches
    .map((match) => {
      const grant = byId.get(match.grant.toString())
      if (!grant) return null
      return {
        id: grant._id.toString(),
        title: grant.title,
        provider: grant.funder,
        description: grant.description,
        score: match.score,
        label: match.label,
        reasons: match.reasons,
        gaps: match.gaps,
        fundingText: grant.fundingText,
        status: grant.status,
        deadline: grant.deadline,
        applicationCycle: grant.scholarshipDetails?.applicationCycle,
        levels: grant.scholarshipDetails?.levels ?? [],
        studyCountries:
          grant.scholarshipDetails?.studyCountries?.length
            ? grant.scholarshipDetails.studyCountries
            : grant.countries,
        verificationStatus: grant.verificationStatus,
        applicationLink: grant.applicationLink,
        sourceUrl: grant.sourceUrl,
        sourceName: grant.sourceName,
        lastCheckedAt: grant.lastCheckedAt,
      }
    })
    .filter(Boolean)
    .sort((a, b) => (b?.score ?? 0) - (a?.score ?? 0))

  return NextResponse.json({
    unlocked: true,
    generatedAt: session.updatedAt,
    matchCount: session.matchCount,
    strongCount: session.strongCount,
    possibleCount: session.possibleCount,
    profile: {
      nationality: session.profile.nationality,
      field: session.profile.field,
      targetLevel: session.targetLevel,
    },
    matches,
    disclaimer:
      'Match scores are screening guidance, not guarantees. Verify the current deadline, eligibility and application route with the scholarship provider before applying.',
  })
}
