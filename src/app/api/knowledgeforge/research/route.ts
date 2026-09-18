import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import {
  auditCitationMarkers,
  buildResearchWorkflow,
  evidenceRequestId,
  retrieveKnowledge,
} from '@/lib/knowledgeforge'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 30

const schema = z.object({
  query: z.string().trim().min(3).max(600),
  draft: z.string().max(12000).optional().default(''),
})

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid research query.', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  try {
    const knowledge = await retrieveKnowledge(parsed.data.query)
    const workflow = buildResearchWorkflow(parsed.data.query)
    const citationAudit = parsed.data.draft.trim()
      ? auditCitationMarkers(parsed.data.draft, knowledge)
      : null

    return NextResponse.json({
      requestId: evidenceRequestId(parsed.data.query + ':' + Date.now()),
      knowledge,
      workflow,
      citationAudit,
      notice:
        'Bibliographic metadata is an evidence pointer, not proof of every proposition in a paper. Inspect full text before making high-stakes or precise empirical claims.',
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Knowledge retrieval failed.' },
      { status: 502 }
    )
  }
}
