import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { auth } from '@/lib/auth'
import Grant from '@/models/Grant'
import {
  ensureScholarshipCatalogueTarget,
  SCHOLARSHIP_CATALOGUE_TARGET,
} from '@/lib/scholarships/catalogue590'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

function escapeRegex(value: string) {
  return value.replace(/[.*+?^{}()|[\]\\]/g, '\\$&')
}

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams
  const page = Math.max(1, Number(params.get('page') || 1))
  const limit = Math.min(60, Math.max(1, Number(params.get('limit') || 24)))
  const status = params.get('status') || 'all'
  const level = params.get('level')
  const funding = params.get('funding')
  const country = params.get('country')
  const source = params.get('source')
  const queryText = params.get('q')?.trim()
  const verifiedOnly = params.get('verified') === 'true'
  const nigeriaOnly = params.get('nigeria') === 'true'

  const session = await auth()
  const canBrowseCatalogue = session?.user?.role === 'admin'

  let bootstrap:
    | Awaited<ReturnType<typeof ensureScholarshipCatalogueTarget>>
    | undefined

  // Catalogue expansion is an administrative operation. Public requests only
  // receive aggregate catalogue statistics so application details cannot bypass
  // the paid CV-match unlock flow.
  if (canBrowseCatalogue && page === 1 && params.get('bootstrap') !== 'false') {
    bootstrap = await ensureScholarshipCatalogueTarget()
  }

  await connectDB()

  const query: Record<string, unknown> = {
    grantType: 'scholarship',
  }

  if (status !== 'all' && ['open', 'closed', 'draft'].includes(status)) {
    query.status = status
  }

  if (level && level !== 'all') query['scholarshipDetails.levels'] = level
  if (funding && funding !== 'all') query['scholarshipDetails.fundingType'] = funding

  if (country) {
    query.$or = [
      { 'scholarshipDetails.studyCountries': { $regex: escapeRegex(country), $options: 'i' } },
      { countries: { $regex: escapeRegex(country), $options: 'i' } },
    ]
  }

  if (source && ['agent', 'import', 'manual'].includes(source)) {
    query.discoveredBy = source
  }

  if (verifiedOnly) query.verificationStatus = 'verified'
  if (nigeriaOnly) query.nigeriaEligible = true

  if (queryText) {
    const textRegex = { $regex: escapeRegex(queryText), $options: 'i' }
    const textQuery = [
      { title: textRegex },
      { funder: textRegex },
      { description: textRegex },
      { categories: textRegex },
    ]

    if (query.$or) {
      query.$and = [{ $or: query.$or }, { $or: textQuery }]
      delete query.$or
    } else {
      query.$or = textQuery
    }
  }

  const skip = (page - 1) * limit

  const [total, catalogueTotal, openTotal, verifiedTotal, nigeriaEligibleTotal] =
    await Promise.all([
      Grant.countDocuments(query),
      Grant.countDocuments({ grantType: 'scholarship' }),
      Grant.countDocuments({ grantType: 'scholarship', status: 'open' }),
      Grant.countDocuments({
        grantType: 'scholarship',
        status: 'open',
        verificationStatus: 'verified',
      }),
      Grant.countDocuments({
        grantType: 'scholarship',
        status: 'open',
        nigeriaEligible: true,
      }),
    ])

  if (!canBrowseCatalogue) {
    return NextResponse.json({
      target: SCHOLARSHIP_CATALOGUE_TARGET,
      stats: {
        catalogueTotal,
        open: openTotal,
        verified: verifiedTotal,
        nigeriaEligible: nigeriaEligibleTotal,
      },
      access: 'match-required',
      matcherUrl: '/scholarships/matcher',
      pricing: { NGN: 5000, USD: 5 },
    })
  }

  const items = await Grant.find(query)
    .sort({ status: -1, relevanceScore: -1, deadline: 1, createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()

  return NextResponse.json({
    count: items.length,
    total,
    page,
    limit,
    pages: Math.max(1, Math.ceil(total / limit)),
    target: SCHOLARSHIP_CATALOGUE_TARGET,
    stats: {
      catalogueTotal,
      open: openTotal,
      verified: verifiedTotal,
      nigeriaEligible: nigeriaEligibleTotal,
    },
    bootstrap,
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
      status: item.status,
      eligibility: item.eligibility,
      categories: item.categories,
      countries: item.countries,
      region: item.region,
      applicationLink: item.applicationLink,
      sourceName: item.sourceName,
      sourceUrl: item.sourceUrl,
      discoveredBy: item.discoveredBy,
      verificationStatus: item.verificationStatus,
      confidenceScore: item.confidenceScore,
      relevanceScore: item.relevanceScore,
      nigeriaEligible: item.nigeriaEligible,
      scholarshipDetails: item.scholarshipDetails,
      lastCheckedAt: item.lastCheckedAt,
      lastVerifiedAt: item.lastVerifiedAt,
    })),
  })
}
