import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { buildGoogleIndexMission } from '@/lib/research-visibility'

const schema = z.object({
  fullName: z.string().max(200).default(''),
  institution: z.string().max(250).default(''),
  institutionalEmailVerified: z.boolean().default(false),
  publicScholarProfile: z.boolean().default(false),
  orcid: z.string().max(100).default(''),
  title: z.string().max(500).default(''),
  authors: z.array(z.string().max(200)).max(30).default([]),
  year: z.string().max(10).default(''),
  journal: z.string().max(300).default(''),
  doi: z.string().max(300).default(''),
  abstract: z.string().max(6000).default(''),
  articleUrl: z.string().max(1200).default(''),
  pdfUrl: z.string().max(1200).default(''),
  rightsConfirmed: z.boolean().default(false),
  publicLandingPage: z.boolean().default(false),
  freeAbstractVisible: z.boolean().default(false),
  searchablePdf: z.boolean().default(false),
  oneArticlePerUrl: z.boolean().default(false),
  scholarMetaTags: z.boolean().default(false),
  robotsAllowed: z.boolean().default(false),
  titleAndAuthorsVisible: z.boolean().default(false),
  referencesPresent: z.boolean().default(false),
  canonicalUrl: z.boolean().default(false),
  sitemapIncluded: z.boolean().default(false),
  linkedFromAuthorPage: z.boolean().default(false),
  googleSearchVisible: z.boolean().default(false),
  googleScholarVisible: z.boolean().default(false),
})

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid indexing assessment input.', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    mission: buildGoogleIndexMission(parsed.data),
  })
}
