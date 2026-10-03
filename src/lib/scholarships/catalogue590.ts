import crypto from 'node:crypto'
import { connectDB } from '@/lib/mongodb'
import Grant from '@/models/Grant'
import User from '@/models/User'

export const SCHOLARSHIP_CATALOGUE_TARGET = 590

const OFA_BASE_URL = 'https://www.opportunitiesforafricans.com'
const OFA_CATEGORY_URL = OFA_BASE_URL + '/category/scholarships/'
const OFA_MAX_PAGES = 32
const FETCH_TIMEOUT_MS = 12_000

type GrantStatus = 'open' | 'closed' | 'draft'
type FundingType = 'full' | 'partial' | 'tuition-only' | 'stipend-only' | 'other'
type ScholarshipLevel = 'undergraduate' | 'masters' | 'phd' | 'postdoc' | 'fellowship' | 'other'

type ParsedDeadline = {
  deadline: Date
  status: GrantStatus
  isRolling: boolean
  label: string
}

type CatalogueRecord = {
  title: string
  description: string
  funder: string
  amount: number
  currency: string
  fundingText: string
  deadline: Date
  isRolling: boolean
  status: GrantStatus
  grantType: 'scholarship'
  eligibility: string[]
  categories: string[]
  countries: string[]
  region: string
  applicationLink: string
  sourceName: string
  sourceUrl: string
  sourceDomain: string
  lastCheckedAt: Date
  verificationStatus: 'needs_review'
  confidenceScore: number
  relevanceScore: number
  nigeriaEligible: boolean
  agentNotes: string
  fingerprint: string
  discoveredBy: 'import'
  scholarshipDetails: {
    levels: ScholarshipLevel[]
    fundingType: FundingType
    benefits: string[]
    requiredDocuments: string[]
    fieldsOfStudy: string[]
    studyCountries: string[]
    applicationCycle: string
    officialProviderDomain?: string
  }
}

export type ScholarshipCatalogueBootstrapSummary = {
  target: number
  before: number
  after: number
  inserted: number
  parsed: number
  pagesFetched: number
  errors: string[]
}

declare global {
  // eslint-disable-next-line no-var
  var __scholarshipCatalogue590Promise:
    | Promise<ScholarshipCatalogueBootstrapSummary>
    | undefined
}

function decodeHtml(value: string) {
  return value
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;|&#34;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&ndash;|&#8211;/gi, '–')
    .replace(/&mdash;|&#8212;/gi, '—')
    .replace(/&pound;|&#163;/gi, '£')
    .replace(/&euro;|&#8364;/gi, '€')
    .replace(/&dollar;|&#36;/gi, '$')
    .replace(/&#(\\d+);/g, (_, code: string) => {
      const value = Number(code)
      return Number.isFinite(value) ? String.fromCodePoint(value) : ''
    })
}

function stripHtml(value: string) {
  return decodeHtml(
    value
      .replace(/<script[\\s\\S]*?<\\/script>/gi, ' ')
      .replace(/<style[\\s\\S]*?<\\/style>/gi, ' ')
      .replace(/<svg[\\s\\S]*?<\\/svg>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
  )
    .replace(/\s+/g, ' ')
    .trim()
}

function normalizeTitle(value: string) {
  return stripHtml(value)
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 300)
}

function safeInternalArticleUrl(value: string) {
  try {
    const url = new URL(value, OFA_BASE_URL)
    if (!['http:', 'https:'].includes(url.protocol)) return undefined
    if (url.hostname.replace(/^www\./, '') !== 'opportunitiesforafricans.com') return undefined
    url.hash = ''
    const path = url.pathname.toLowerCase()
    if (
      path === '/' ||
      path.startsWith('/category/') ||
      path.startsWith('/tag/') ||
      path.startsWith('/author/') ||
      path.startsWith('/page/') ||
      path.startsWith('/wp-') ||
      path.includes('/feed/')
    ) {
      return undefined
    }
    return url.toString()
  } catch {
    return undefined
  }
}

function looksLikeScholarshipTitle(title: string) {
  if (title.length < 18) return false
  return /(scholar|bursar|studentship|tuition|study award|education award|fully funded|funded study|mastercard foundation)/i.test(
    title
  )
}

function inferLevels(title: string): ScholarshipLevel[] {
  const levels: ScholarshipLevel[] = []
  if (/undergraduate|bachelor|tertiary/i.test(title)) levels.push('undergraduate')
  if (/master(?:'s|s)?|msc|mba|postgraduate/i.test(title)) levels.push('masters')
  if (/\bphd\b|doctor(?:al|ate)/i.test(title)) levels.push('phd')
  if (/postdoc|post-doctor/i.test(title)) levels.push('postdoc')
  if (/fellowship/i.test(title)) levels.push('fellowship')
  return levels.length ? [...new Set(levels)] : ['other']
}

function inferFundingType(title: string): FundingType {
  if (/fully[- ]funded|full scholarship|all costs covered/i.test(title)) return 'full'
  if (/tuition (?:covered|waiver)|full tuition/i.test(title)) return 'tuition-only'
  if (/stipend/i.test(title) && !/fully[- ]funded/i.test(title)) return 'stipend-only'
  if (/partial|contribution|award|bursary/i.test(title)) return 'partial'
  return 'other'
}

const COUNTRY_PATTERNS: Array<[RegExp, string]> = [
  [/nigeria|nigerian/i, 'Nigeria'],
  [/south africa|south african/i, 'South Africa'],
  [/ghana|ghanaian/i, 'Ghana'],
  [/kenya|kenyan/i, 'Kenya'],
  [/uganda|ugandan/i, 'Uganda'],
  [/rwanda|rwandan/i, 'Rwanda'],
  [/tanzania|tanzanian/i, 'Tanzania'],
  [/namibia|namibian/i, 'Namibia'],
  [/botswana|botswanan/i, 'Botswana'],
  [/senegal|senegalese/i, 'Senegal'],
  [/ethiopia|ethiopian/i, 'Ethiopia'],
  [/egypt|egyptian/i, 'Egypt'],
  [/united kingdom|\buk\b|britain/i, 'United Kingdom'],
  [/united states|\busa\b|america/i, 'United States'],
  [/germany|german/i, 'Germany'],
  [/france|french/i, 'France'],
  [/japan|japanese/i, 'Japan'],
  [/canada|canadian/i, 'Canada'],
  [/switzerland|swiss/i, 'Switzerland'],
  [/australia|australian/i, 'Australia'],
]

function inferCountries(title: string) {
  return COUNTRY_PATTERNS.filter(([pattern]) => pattern.test(title)).map(([, country]) => country)
}

function inferProvider(title: string) {
  const clean = title.replace(/^the\s+/i, '').trim()
  const cut = clean.split(
    /\b(?:scholarships?|bursar(?:y|ies)|scholars? program(?:me)?|studentships?|fellowships?)\b/i
  )[0]
  const candidate = cut
    .replace(/\b20\d{2}(?:\s*\/\s*20\d{2})?\b.*$/i, '')
    .replace(/[\s:–—-]+$/g, '')
    .trim()
  if (candidate.length >= 3 && candidate.length <= 190) return candidate
  return 'Provider listed in source'
}

function extractDeadlineLabel(contextText: string) {
  const marker = contextText.match(/Application Deadline\s*:\s*/i)
  if (!marker || marker.index === undefined) return ''
  const start = marker.index + marker[0].length
  const tail = contextText.slice(start, start + 180)
  const stopWords = [
    ' Applications are',
    ' Applications for',
    ' The ',
    ' This ',
    ' Eligible ',
    ' Applicants ',
    ' Apply ',
  ]
  let end = tail.length
  for (const word of stopWords) {
    const idx = tail.indexOf(word)
    if (idx >= 0) end = Math.min(end, idx)
  }
  return tail.slice(0, end).replace(/\s+/g, ' ').trim().replace(/[.]+$/g, '').slice(0, 150)
}

function parseDeadline(label: string, now: Date): ParsedDeadline {
  const normalized = label
    .replace(/(\d{1,2})(st|nd|rd|th)\b/gi, '$1')
    .replace(/[·•]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (/ongoing|rolling|open year[- ]round/i.test(normalized)) {
    return {
      deadline: new Date('2099-12-31T23:59:59.000Z'),
      status: 'open',
      isRolling: true,
      label: normalized || 'Rolling',
    }
  }

  if (!normalized || /unspecified|var(?:y|ies|ying)|depends|check (?:the )?(?:portal|website)|not stated|tba/i.test(normalized)) {
    return {
      deadline: new Date('2098-12-31T23:59:59.000Z'),
      status: 'draft',
      isRolling: false,
      label: normalized || 'Check source for deadline',
    }
  }

  const month =
    '(?:January|February|March|April|May|June|July|August|September|October|November|December)'
  const patterns = [
    new RegExp(month + '\\s+\\d{1,2},?\\s+20\\d{2}', 'gi'),
    new RegExp('\\d{1,2}\\s+' + month + '\\s+20\\d{2}', 'gi'),
    /20\d{2}-\d{1,2}-\d{1,2}/g,
  ]

  const dates: Date[] = []
  for (const pattern of patterns) {
    const matches = normalized.match(pattern) ?? []
    for (const value of matches) {
      const parsed = new Date(value.replace(/,/g, ''))
      if (!Number.isNaN(parsed.getTime())) dates.push(parsed)
    }
  }

  if (!dates.length) {
    const direct = new Date(normalized)
    if (!Number.isNaN(direct.getTime())) dates.push(direct)
  }

  if (!dates.length) {
    return {
      deadline: new Date('2098-12-31T23:59:59.000Z'),
      status: 'draft',
      isRolling: false,
      label: normalized,
    }
  }

  dates.sort((a, b) => b.getTime() - a.getTime())
  const deadline = dates[0]
  deadline.setUTCHours(23, 59, 59, 999)

  return {
    deadline,
    status: deadline.getTime() >= now.getTime() ? 'open' : 'closed',
    isRolling: false,
    label: normalized,
  }
}

function recordFingerprint(url: string) {
  return crypto.createHash('sha256').update('ofa|' + url.toLowerCase()).digest('hex')
}

function parsePage(html: string, pageUrl: string, now: Date): CatalogueRecord[] {
  const records: CatalogueRecord[] = []
  const heading =
    /<h[1-6][^>]*>\s*<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>\s*<\/h[1-6]>/gi

  let match: RegExpExecArray | null
  while ((match = heading.exec(html))) {
    const applicationLink = safeInternalArticleUrl(match[1])
    const title = normalizeTitle(match[2])
    if (!applicationLink || !looksLikeScholarshipTitle(title)) continue

    const contextStart = match.index + match[0].length
    const contextHtml = html.slice(contextStart, contextStart + 2600)
    const contextText = stripHtml(contextHtml)
    const deadlineLabel = extractDeadlineLabel(contextText)
    const deadline = parseDeadline(deadlineLabel, now)
    const levels = inferLevels(title)
    const fundingType = inferFundingType(title)
    const countries = inferCountries(title)
    const nigeriaEligible = /nigeria|nigerian/i.test(title)
    const genericAfricaEligible =
      /africa(?:n)?\s+(?:students|graduates|professionals|scholars|youth|applicants|leaders)|young africans/i.test(
        title
      )
    const descriptionSource = contextText
      .replace(/^by\s+OFA\s+/i, '')
      .replace(/^\w+\s+\d{1,2},\s+20\d{2}\s+/i, '')
      .trim()
    const description =
      descriptionSource.length >= 20
        ? descriptionSource.slice(0, 900)
        : 'Source-backed scholarship opportunity published by Opportunities For Africans. Review the linked source for current eligibility, funding and application details.'

    const fundingText =
      fundingType === 'full'
        ? 'Fully funded — verify benefits on source'
        : fundingType === 'tuition-only'
          ? 'Tuition support — verify amount on source'
          : fundingType === 'stipend-only'
            ? 'Stipend support — verify amount on source'
            : fundingType === 'partial'
              ? 'Partial funding / award — verify amount on source'
              : 'See source for funding details'

    records.push({
      title,
      description,
      funder: inferProvider(title),
      amount: 0,
      currency: 'USD',
      fundingText,
      deadline: deadline.deadline,
      isRolling: deadline.isRolling,
      status: deadline.status,
      grantType: 'scholarship',
      eligibility: [],
      categories: ['scholarship', ...levels],
      countries,
      region: nigeriaEligible
        ? 'Nigeria'
        : genericAfricaEligible
          ? 'Africa'
          : countries.length
            ? countries.join(' / ')
            : 'Africa / International',
      applicationLink,
      sourceName: 'Opportunities For Africans',
      sourceUrl: applicationLink,
      sourceDomain: 'opportunitiesforafricans.com',
      lastCheckedAt: now,
      verificationStatus: 'needs_review',
      confidenceScore: 0.78,
      relevanceScore: nigeriaEligible ? 95 : genericAfricaEligible ? 85 : 65,
      nigeriaEligible,
      agentNotes:
        'Imported from the Opportunities For Africans scholarship archive. Verify the provider page, final eligibility, benefits and application deadline before applying.',
      fingerprint: recordFingerprint(applicationLink),
      discoveredBy: 'import',
      scholarshipDetails: {
        levels,
        fundingType,
        benefits: [],
        requiredDocuments: [],
        fieldsOfStudy: [],
        studyCountries: countries,
        applicationCycle: deadline.label || 'See source',
      },
    })
  }

  // A source page may repeat items in sidebars; the URL fingerprint removes duplicates.
  const unique = new Map<string, CatalogueRecord>()
  for (const record of records) unique.set(record.fingerprint, record)

  if (!unique.size) {
    throw new Error('No scholarship entries parsed from ' + pageUrl)
  }

  return [...unique.values()]
}

async function fetchArchivePage(page: number) {
  const url = page === 1 ? OFA_CATEGORY_URL : OFA_CATEGORY_URL + 'page/' + page + '/'
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
  try {
    const response = await fetch(url, {
      redirect: 'follow',
      cache: 'no-store',
      signal: controller.signal,
      headers: {
        Accept: 'text/html,application/xhtml+xml',
        'User-Agent':
          'Mozilla/5.0 (compatible; AfriGrantPipeline-ScholarshipCatalogue/1.0; +https://afrigrantpipeline.com)',
      },
    })
    if (!response.ok) {
      throw new Error('HTTP ' + response.status + ' ' + response.statusText)
    }
    return { url, html: await response.text() }
  } finally {
    clearTimeout(timer)
  }
}

async function ensureImporterUser() {
  const existingAdmin = await User.findOne({ role: 'admin' }).sort({ createdAt: 1 }).select('_id').lean()
  if (existingAdmin?._id) return existingAdmin._id

  const systemUser = await User.findOneAndUpdate(
    { email: 'catalogue@afrigrantpipeline.system' },
    {
      $setOnInsert: {
        name: 'AfriGrant Scholarship Catalogue',
        email: 'catalogue@afrigrantpipeline.system',
        role: 'admin',
        subscription: 'platinum',
        organization: 'AfriGrant Pipeline',
        bio: 'System identity for source-backed scholarship catalogue imports.',
        country: 'Nigeria',
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  )
  return systemUser._id
}

async function bootstrapCatalogue(): Promise<ScholarshipCatalogueBootstrapSummary> {
  await connectDB()

  const before = await Grant.countDocuments({ grantType: 'scholarship' })
  if (before >= SCHOLARSHIP_CATALOGUE_TARGET) {
    return {
      target: SCHOLARSHIP_CATALOGUE_TARGET,
      before,
      after: before,
      inserted: 0,
      parsed: 0,
      pagesFetched: 0,
      errors: [],
    }
  }

  const now = new Date()
  const pages = Array.from({ length: OFA_MAX_PAGES }, (_, index) => index + 1)
  const fetched = await Promise.allSettled(pages.map(fetchArchivePage))

  const errors: string[] = []
  const recordsByFingerprint = new Map<string, CatalogueRecord>()
  let pagesFetched = 0

  for (let index = 0; index < fetched.length; index += 1) {
    const result = fetched[index]
    if (result.status === 'rejected') {
      errors.push(
        'Archive page ' +
          pages[index] +
          ': ' +
          (result.reason instanceof Error ? result.reason.message : 'fetch failed')
      )
      continue
    }

    pagesFetched += 1
    try {
      for (const record of parsePage(result.value.html, result.value.url, now)) {
        if (!recordsByFingerprint.has(record.fingerprint)) {
          recordsByFingerprint.set(record.fingerprint, record)
        }
      }
    } catch (error) {
      errors.push(
        'Archive page ' +
          pages[index] +
          ': ' +
          (error instanceof Error ? error.message : 'parse failed')
      )
    }
  }

  const existing = await Grant.find({ grantType: 'scholarship' })
    .select('fingerprint applicationLink')
    .lean()

  const existingFingerprints = new Set(
    existing.map((item) => item.fingerprint).filter((value): value is string => Boolean(value))
  )
  const existingLinks = new Set(
    existing
      .map((item) => item.applicationLink)
      .filter((value): value is string => Boolean(value))
  )

  const needed = Math.max(0, SCHOLARSHIP_CATALOGUE_TARGET - existing.length)
  const selected = [...recordsByFingerprint.values()]
    .filter(
      (record) =>
        !existingFingerprints.has(record.fingerprint) && !existingLinks.has(record.applicationLink)
    )
    .slice(0, needed)

  if (selected.length) {
    const createdBy = await ensureImporterUser()
    await Grant.bulkWrite(
      selected.map((record) => ({
        updateOne: {
          filter: { fingerprint: record.fingerprint },
          update: {
            $set: record,
            $setOnInsert: { createdBy },
          },
          upsert: true,
        },
      })),
      { ordered: false }
    )
  }

  const after = await Grant.countDocuments({ grantType: 'scholarship' })

  if (after < SCHOLARSHIP_CATALOGUE_TARGET) {
    errors.push(
      'Catalogue reached ' +
        after +
        ' of ' +
        SCHOLARSHIP_CATALOGUE_TARGET +
        ' records. Increase archive coverage or add another source before claiming the full target.'
    )
  }

  return {
    target: SCHOLARSHIP_CATALOGUE_TARGET,
    before,
    after,
    inserted: Math.max(0, after - before),
    parsed: recordsByFingerprint.size,
    pagesFetched,
    errors: errors.slice(0, 30),
  }
}

export async function ensureScholarshipCatalogue590() {
  if (!global.__scholarshipCatalogue590Promise) {
    global.__scholarshipCatalogue590Promise = bootstrapCatalogue().finally(() => {
      global.__scholarshipCatalogue590Promise = undefined
    })
  }

  return global.__scholarshipCatalogue590Promise
}
