import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Grant from '@/models/Grant'
import ScholarshipSyncRun from '@/models/ScholarshipSyncRun'
import {
  SCHOLARSHIP_SOURCE_REGISTRY,
  runScholarshipCrawler,
} from '@/lib/scholarships/agenticCrawler'

export const maxDuration = 60
export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  await connectDB()
  const staleBefore = new Date(Date.now() - 21 * 24 * 60 * 60 * 1000)

  const [latestRun, total, verified, needsReview, nigeriaEligible, stale, latestScholarships] =
    await Promise.all([
      ScholarshipSyncRun.findOne().sort({ startedAt: -1 }).lean(),
      Grant.countDocuments({ grantType: 'scholarship', discoveredBy: 'agent' }),
      Grant.countDocuments({
        grantType: 'scholarship',
        discoveredBy: 'agent',
        verificationStatus: 'verified',
        status: 'open',
      }),
      Grant.countDocuments({
        grantType: 'scholarship',
        discoveredBy: 'agent',
        verificationStatus: 'needs_review',
        status: 'open',
      }),
      Grant.countDocuments({
        grantType: 'scholarship',
        discoveredBy: 'agent',
        nigeriaEligible: true,
        status: 'open',
      }),
      Grant.countDocuments({
        grantType: 'scholarship',
        discoveredBy: 'agent',
        status: 'open',
        lastCheckedAt: { $lt: staleBefore },
      }),
      Grant.find({
        grantType: 'scholarship',
        discoveredBy: 'agent',
        status: 'open',
      })
        .sort({ verificationStatus: 1, relevanceScore: -1, deadline: 1 })
        .limit(12)
        .lean(),
    ])

  return NextResponse.json({
    latestRun,
    stats: { total, verified, needsReview, nigeriaEligible, stale },
    configuration: {
      aiConfigured: Boolean(process.env.OPENROUTER_API_KEY || process.env.ANTHROPIC_API_KEY),
      webSearchConfigured: Boolean(process.env.TAVILY_API_KEY),
      cronConfigured: Boolean(process.env.CRON_SECRET),
    },
    sources: SCHOLARSHIP_SOURCE_REGISTRY,
    latestScholarships: latestScholarships.map((item) => ({
      _id: item._id.toString(),
      title: item.title,
      provider: item.funder,
      fundingText: item.fundingText,
      amount: item.amount,
      currency: item.currency,
      deadline: item.deadline,
      isRolling: item.isRolling,
      applicationLink: item.applicationLink,
      sourceName: item.sourceName,
      sourceUrl: item.sourceUrl,
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

export async function POST() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }
  if (session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Administrator access required' }, { status: 403 })
  }

  const summary = await runScholarshipCrawler('admin:' + session.user.id)
  return NextResponse.json(summary, {
    status: summary.status === 'completed' ? 200 : 502,
  })
}
