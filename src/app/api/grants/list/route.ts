import { NextResponse, type NextRequest } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Grant from '@/models/Grant'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') ?? 'open'
    const grantType = searchParams.get('grantType')
    const search = searchParams.get('search')
    const nigeriaEligible = searchParams.get('nigeriaEligible')
    const verified = searchParams.get('verified')
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100)

    const filter: Record<string, unknown> = { status }
    if (grantType) filter.grantType = grantType
    if (search) filter.$text = { $search: search }
    if (nigeriaEligible === 'true') filter.nigeriaEligible = true
    if (verified === 'true') filter.verificationStatus = 'verified'

    await connectDB()
    const grants = await Grant.find(filter)
      .sort(search ? { score: { $meta: 'textScore' } } : { relevanceScore: -1, deadline: 1 })
      .limit(limit)
      .lean()

    const data = grants.map((g) => ({
      _id: g._id.toString(),
      title: g.title,
      description: g.description,
      funder: g.funder,
      amount: g.amount,
      currency: g.currency,
      fundingText: g.fundingText,
      deadline: new Date(g.deadline).toISOString(),
      isRolling: g.isRolling ?? false,
      status: g.status,
      grantType: g.grantType ?? 'other',
      eligibility: g.eligibility ?? [],
      categories: g.categories ?? [],
      countries: g.countries ?? [],
      region: g.region,
      applicationLink: g.applicationLink,
      sourceName: g.sourceName,
      sourceUrl: g.sourceUrl,
      lastCheckedAt: g.lastCheckedAt,
      lastVerifiedAt: g.lastVerifiedAt,
      verificationStatus: g.verificationStatus ?? 'unverified',
      confidenceScore: g.confidenceScore,
      relevanceScore: g.relevanceScore,
      nigeriaEligible: g.nigeriaEligible ?? false,
      discoveredBy: g.discoveredBy ?? 'manual',
    }))

    return NextResponse.json({ data })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch grants'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
