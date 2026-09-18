import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Grant from '@/models/Grant'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  await connectDB()

  const params = req.nextUrl.searchParams
  const level = params.get('level')
  const funding = params.get('funding')
  const country = params.get('country')
  const verifiedOnly = params.get('verified') === 'true'
  const limit = Math.min(50, Math.max(1, Number(params.get('limit') || 24)))

  const query: Record<string, unknown> = {
    grantType: 'scholarship',
    discoveredBy: 'agent',
    status: 'open',
    deadline: { $gt: new Date() },
  }

  if (level) query['scholarshipDetails.levels'] = level
  if (funding) query['scholarshipDetails.fundingType'] = funding
  if (country) query['scholarshipDetails.studyCountries'] = { $regex: country, $options: 'i' }
  if (verifiedOnly) query.verificationStatus = 'verified'

  const items = await Grant.find(query)
    .sort({ verificationStatus: 1, relevanceScore: -1, deadline: 1 })
    .limit(limit)
    .lean()

  return NextResponse.json({
    count: items.length,
    items: items.map((item) => ({
      id: item._id.toString(),
      title: item.title,
      provider: item.funder,
      description: item.description,
      fundingText: item.fundingText,
      amount: item.amount,
      currency: item.currency,
      deadline: item.deadline,
      isRolling: item.isRolling,
      eligibility: item.eligibility,
      applicationLink: item.applicationLink,
      sourceUrl: item.sourceUrl,
      verificationStatus: item.verificationStatus,
      relevanceScore: item.relevanceScore,
      nigeriaEligible: item.nigeriaEligible,
      scholarshipDetails: item.scholarshipDetails,
      lastCheckedAt: item.lastCheckedAt,
      lastVerifiedAt: item.lastVerifiedAt,
    })),
  })
}
