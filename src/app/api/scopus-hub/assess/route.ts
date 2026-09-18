import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { assessScopusReadiness } from '@/lib/research-visibility'

const schema = z.object({
  hasScopusProfile: z.boolean().default(false),
  profileHasCorrectName: z.boolean().default(false),
  profileHasCorrectAffiliation: z.boolean().default(false),
  duplicateProfilesResolved: z.boolean().default(false),
  missingIndexedDocumentsResolved: z.boolean().default(false),
  orcidConnected: z.boolean().default(false),
  targetJournalCurrentlyCovered: z.boolean().default(false),
  targetJournalScopeFit: z.boolean().default(false),
  manuscriptHasEnglishTitleAbstract: z.boolean().default(false),
  ethicsAndResearchIntegrityReady: z.boolean().default(false),
})

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid Scopus readiness input.', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    assessment: assessScopusReadiness(parsed.data),
    officialLinks: [
      {
        label: 'Scopus Author Profiles',
        url: 'https://www.elsevier.com/products/scopus/author-profiles',
      },
      {
        label: 'Scopus Preview / Sources',
        url: 'https://www.scopus.com/sources',
      },
      {
        label: 'Scopus content policy and selection',
        url: 'https://www.elsevier.com/products/scopus/content/content-policy-and-selection',
      },
    ],
  })
}
