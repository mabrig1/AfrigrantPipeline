import { NextRequest, NextResponse } from 'next/server'
import { runGrantUpdateAgent } from '@/lib/grants/agenticUpdater'

export const maxDuration = 60
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (!secret) {
    return NextResponse.json({ error: 'CRON_SECRET is not configured' }, { status: 503 })
  }

  const authorization = req.headers.get('authorization')
  if (authorization !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const summary = await runGrantUpdateAgent('vercel-cron')
  return NextResponse.json(summary, { status: summary.status === 'completed' ? 200 : 502 })
}
