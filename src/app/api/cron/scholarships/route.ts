import { NextRequest, NextResponse } from 'next/server'
import { runScholarshipCrawler } from '@/lib/scholarships/agenticCrawler'
import {
  ensureScholarshipCatalogueTarget,
  SCHOLARSHIP_CATALOGUE_TARGET,
} from '@/lib/scholarships/catalogue590'

export const maxDuration = 60
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (!secret) {
    return NextResponse.json({ error: 'CRON_SECRET is not configured' }, { status: 503 })
  }

  const authorization = req.headers.get('authorization')
  if (authorization !== 'Bearer ' + secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const catalogue = await ensureScholarshipCatalogueTarget()

  // While source-backed catalogue growth is still making progress, keep this
  // cron invocation focused on filling the catalogue. Once the target is
  // reached (or the archive yields no new records), run the agentic
  // discovery/re-verification pass as well.
  if (catalogue.after < SCHOLARSHIP_CATALOGUE_TARGET && catalogue.inserted > 0) {
    return NextResponse.json({
      status: 'catalogue-filling',
      catalogue,
      intelligence: {
        skipped: true,
        reason: 'Catalogue is still progressing toward the curated target.',
      },
    })
  }

  const intelligence = await runScholarshipCrawler('vercel-cron')
  return NextResponse.json(
    {
      status: intelligence.status,
      catalogue,
      intelligence,
    },
    { status: intelligence.status === 'completed' ? 200 : 502 }
  )
}
