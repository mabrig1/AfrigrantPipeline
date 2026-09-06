import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Grant from '@/models/Grant'
import GrantSyncRun from '@/models/GrantSyncRun'
import { GRANT_SOURCE_REGISTRY, runGrantUpdateAgent } from '@/lib/grants/agenticUpdater'

export const maxDuration = 60
export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  await connectDB()
  const staleBefore = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)

  const [latestRun, totalAgentGrants, verified, needsReview, nigeriaEligible, stale, latestGrants] =
    await Promise.all([
      GrantSyncRun.findOne().sort({ startedAt: -1 }).lean(),
      Grant.countDocuments({ discoveredBy: 'agent' }),
      Grant.countDocuments({ discoveredBy: 'agent', verificationStatus: 'verified', status: 'open' }),
      Grant.countDocuments({ discoveredBy: 'agent', verificationStatus: 'needs_review', status: 'open' }),
      Grant.countDocuments({ discoveredBy: 'agent', nigeriaEligible: true, status: 'open' }),
      Grant.countDocuments({ discoveredBy: 'agent', status: 'open', lastCheckedAt: { $lt: staleBefore } }),
      Grant.find({ discoveredBy: 'agent', status: 'open' })
        .sort({ relevanceScore: -1, deadline: 1 })
        .limit(8)
        .lean(),
    ])

  return NextResponse.json({
    latestRun,
    stats: {
      totalAgentGrants,
      verified,
      needsReview,
      nigeriaEligible,
      stale,
    },
    configuration: {
      aiConfigured: Boolean(process.env.OPENROUTER_API_KEY || process.env.ANTHROPIC_API_KEY),
      webSearchConfigured: Boolean(process.env.TAVILY_API_KEY),
      cronConfigured: Boolean(process.env.CRON_SECRET),
    },
    sources: GRANT_SOURCE_REGISTRY,
    latestGrants: latestGrants.map((grant) => ({
      _id: grant._id.toString(),
      title: grant.title,
      funder: grant.funder,
      fundingText: grant.fundingText,
      amount: grant.amount,
      currency: grant.currency,
      deadline: grant.deadline,
      isRolling: grant.isRolling,
      applicationLink: grant.applicationLink,
      sourceName: grant.sourceName,
      sourceUrl: grant.sourceUrl,
      verificationStatus: grant.verificationStatus,
      confidenceScore: grant.confidenceScore,
      relevanceScore: grant.relevanceScore,
      nigeriaEligible: grant.nigeriaEligible,
      lastCheckedAt: grant.lastCheckedAt,
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

  const summary = await runGrantUpdateAgent(`admin:${session.user.id}`)
  return NextResponse.json(summary, { status: summary.status === 'completed' ? 200 : 502 })
}
