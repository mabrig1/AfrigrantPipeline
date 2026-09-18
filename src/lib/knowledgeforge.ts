import crypto from 'node:crypto'

export type KnowledgeProvider = 'OpenAlex' | 'Crossref' | 'PubMed'

export type KnowledgeSource = {
  id: string
  provider: KnowledgeProvider
  title: string
  authors: string[]
  year?: number
  venue?: string
  doi?: string
  url: string
  type?: string
  citedBy?: number
  openAccess?: boolean
  excerpt?: string
  score: number
}

export type ProviderStatus = {
  provider: KnowledgeProvider
  status: 'ok' | 'error' | 'skipped'
  count: number
}

export type KnowledgeBundle = {
  query: string
  retrievedAt: string
  coverage: 'strong' | 'moderate' | 'limited' | 'none'
  sources: KnowledgeSource[]
  providers: ProviderStatus[]
  sourceLedger: string
}

export type CitationAudit = {
  status: 'pass' | 'warning' | 'fail'
  integrityScore: number
  validMarkers: number[]
  invalidMarkers: number[]
  uncitedSources: number[]
  issues: Array<{ severity: 'info' | 'warning' | 'error'; code: string; message: string }>
}

export type AgentStep = {
  id: string
  agent: string
  task: string
  evidence: 'Verified' | 'Needs source' | 'Human review'
}

const biomedicalWords =
  /medicine|medical|health|disease|clinical|patient|nursing|pharmacy|drug|therapy|cancer|malaria|hiv|public health|epidemiology|biomedical/i

function cleanText(value: unknown, max = 600) {
  if (typeof value !== 'string') return ''
  return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max)
}

function normalizeDoi(value: unknown) {
  const doi = cleanText(value, 200)
    .replace(/^https?:\/\/(dx\.)?doi\.org\//i, '')
    .replace(/^doi:\s*/i, '')
  return doi || undefined
}

function yearBoost(year?: number) {
  if (!year) return 0
  const age = Math.max(0, new Date().getUTCFullYear() - year)
  return Math.max(0, 14 - age * 1.3)
}

function citationBoost(count?: number) {
  return Math.min(24, Math.log1p(Math.max(0, count ?? 0)) * 4.2)
}

function relevanceBoost(value: unknown) {
  const score = Number(value)
  if (!Number.isFinite(score) || score <= 0) return 0
  return Math.min(36, Math.log1p(score) * 7)
}

function abstractFromInvertedIndex(index: unknown) {
  if (!index || typeof index !== 'object') return undefined
  const pairs: Array<[number, string]> = []
  for (const [word, positions] of Object.entries(index as Record<string, unknown>)) {
    if (!Array.isArray(positions)) continue
    for (const position of positions) {
      if (typeof position === 'number') pairs.push([position, word])
    }
  }
  if (!pairs.length) return undefined
  pairs.sort((a, b) => a[0] - b[0])
  return cleanText(
    pairs.map(([, word]) => word).join(' '),
    650
  ) || undefined
}

async function fetchJson(url: string) {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(10_000),
    headers: {
      'User-Agent': 'AfriGrantPipeline-KnowledgeForge/1.0 (source-grounded research assistant)',
    },
    cache: 'no-store',
  })

  if (!response.ok) throw new Error('Knowledge provider returned HTTP ' + response.status)
  return response.json()
}

async function searchOpenAlex(query: string): Promise<KnowledgeSource[]> {
  const params = new URLSearchParams({ search: query, 'per-page': '8' })
  if (process.env.OPENALEX_API_KEY) params.set('api_key', process.env.OPENALEX_API_KEY)
  const data = await fetchJson('https://api.openalex.org/works?' + params.toString())
  const results = Array.isArray(data?.results) ? data.results : []

  return results.map((item: any, index: number) => {
    const doi = normalizeDoi(item?.doi)
    const year = Number(item?.publication_year) || undefined
    const citedBy = Number(item?.cited_by_count) || 0
    const authors = (Array.isArray(item?.authorships) ? item.authorships : [])
      .slice(0, 8)
      .map((entry: any) => cleanText(entry?.author?.display_name, 100))
      .filter(Boolean)
    const venue = cleanText(item?.primary_location?.source?.display_name, 160) || undefined
    const title = cleanText(item?.display_name || item?.title, 400) || 'Untitled work'
    const score =
      45 +
      relevanceBoost(item?.relevance_score) +
      citationBoost(citedBy) +
      yearBoost(year) +
      (doi ? 8 : 0) +
      (item?.open_access?.is_oa ? 4 : 0)

    return {
      id: 'openalex-' + (cleanText(item?.id, 100) || index),
      provider: 'OpenAlex' as const,
      title,
      authors,
      year,
      venue,
      doi,
      url: doi ? 'https://doi.org/' + doi : cleanText(item?.id, 300) || 'https://openalex.org',
      type: cleanText(item?.type, 80) || undefined,
      citedBy,
      openAccess: Boolean(item?.open_access?.is_oa),
      excerpt: abstractFromInvertedIndex(item?.abstract_inverted_index),
      score,
    }
  })
}

function crossrefYear(item: any) {
  const candidates = [
    item?.published?.['date-parts'],
    item?.['published-print']?.['date-parts'],
    item?.['published-online']?.['date-parts'],
  ]
  for (const candidate of candidates) {
    const value = candidate?.[0]?.[0]
    if (typeof value === 'number') return value
  }
  return undefined
}

async function searchCrossref(query: string): Promise<KnowledgeSource[]> {
  const params = new URLSearchParams({ 'query.bibliographic': query, rows: '8' })
  if (process.env.KNOWLEDGE_CONTACT_EMAIL) {
    params.set('mailto', process.env.KNOWLEDGE_CONTACT_EMAIL)
  }

  const data = await fetchJson('https://api.crossref.org/works?' + params.toString())
  const items = Array.isArray(data?.message?.items) ? data.message.items : []

  return items.map((item: any, index: number) => {
    const doi = normalizeDoi(item?.DOI)
    const year = crossrefYear(item)
    const citedBy = Number(item?.['is-referenced-by-count']) || 0
    const authors = (Array.isArray(item?.author) ? item.author : [])
      .slice(0, 8)
      .map((author: any) =>
        cleanText([author?.given, author?.family].filter(Boolean).join(' '), 100)
      )
      .filter(Boolean)
    const title =
      cleanText(Array.isArray(item?.title) ? item.title[0] : item?.title, 400) ||
      'Untitled work'
    const venue =
      cleanText(
        Array.isArray(item?.['container-title'])
          ? item['container-title'][0]
          : item?.['container-title'],
        160
      ) || undefined
    const score =
      40 +
      relevanceBoost(item?.score) +
      citationBoost(citedBy) +
      yearBoost(year) +
      (doi ? 10 : 0) +
      (item?.type === 'journal-article' ? 5 : 0)

    return {
      id: 'crossref-' + (doi || index),
      provider: 'Crossref' as const,
      title,
      authors,
      year,
      venue,
      doi,
      url: doi ? 'https://doi.org/' + doi : cleanText(item?.URL, 300) || 'https://crossref.org',
      type: cleanText(item?.type, 80) || undefined,
      citedBy,
      score,
    }
  })
}

async function searchPubMed(query: string): Promise<KnowledgeSource[]> {
  const searchParams = new URLSearchParams({
    db: 'pubmed',
    retmode: 'json',
    retmax: '6',
    term: query,
  })
  if (process.env.NCBI_API_KEY) searchParams.set('api_key', process.env.NCBI_API_KEY)

  const searchData = await fetchJson(
    'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?' +
      searchParams.toString()
  )

  const ids = Array.isArray(searchData?.esearchresult?.idlist)
    ? searchData.esearchresult.idlist
    : []
  if (!ids.length) return []

  const summaryParams = new URLSearchParams({
    db: 'pubmed',
    retmode: 'json',
    id: ids.join(','),
  })
  if (process.env.NCBI_API_KEY) summaryParams.set('api_key', process.env.NCBI_API_KEY)

  const summaryData = await fetchJson(
    'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?' +
      summaryParams.toString()
  )
  const result = summaryData?.result ?? {}

  return ids.map((uid: string, index: number) => {
    const item = result?.[uid] ?? {}
    const articleIds = Array.isArray(item?.articleids) ? item.articleids : []
    const doi = normalizeDoi(
      articleIds.find((entry: any) => entry?.idtype === 'doi')?.value
    )
    const yearMatch = cleanText(item?.pubdate, 40).match(/\b(19|20)\d{2}\b/)
    const year = yearMatch ? Number(yearMatch[0]) : undefined
    const authors = (Array.isArray(item?.authors) ? item.authors : [])
      .slice(0, 8)
      .map((author: any) => cleanText(author?.name, 100))
      .filter(Boolean)
    const title = cleanText(item?.title, 400) || 'Untitled PubMed record'
    const score = 52 + yearBoost(year) + (doi ? 10 : 0) + Math.max(0, 8 - index)

    return {
      id: 'pubmed-' + uid,
      provider: 'PubMed' as const,
      title,
      authors,
      year,
      venue: cleanText(item?.fulljournalname, 160) || undefined,
      doi,
      url: 'https://pubmed.ncbi.nlm.nih.gov/' + uid + '/',
      type: 'biomedical-index-record',
      score,
    }
  })
}

function sourceKey(source: KnowledgeSource) {
  if (source.doi) return 'doi:' + source.doi.toLowerCase()
  return (
    'title:' +
    source.title.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim() +
    ':' +
    (source.year ?? '')
  )
}

function mergeSources(sources: KnowledgeSource[], limit = 10) {
  const map = new Map<string, KnowledgeSource>()
  for (const source of sources) {
    const key = sourceKey(source)
    const existing = map.get(key)
    if (!existing || source.score > existing.score) map.set(key, source)
  }
  return [...map.values()].sort((a, b) => b.score - a.score).slice(0, limit)
}

function coverageFor(sources: KnowledgeSource[]): KnowledgeBundle['coverage'] {
  if (!sources.length) return 'none'
  const doiCount = sources.filter((source) => source.doi).length
  if (sources.length >= 7 && doiCount >= 4) return 'strong'
  if (sources.length >= 4) return 'moderate'
  return 'limited'
}

function buildLedger(sources: KnowledgeSource[]) {
  return sources
    .map((source, index) => {
      const parts = [
        '[S' + (index + 1) + '] ' + source.title,
        source.authors.length ? 'Authors: ' + source.authors.join(', ') : '',
        source.year ? 'Year: ' + source.year : '',
        source.venue ? 'Venue: ' + source.venue : '',
        source.doi ? 'DOI: ' + source.doi : '',
        typeof source.citedBy === 'number' ? 'Cited-by metadata: ' + source.citedBy : '',
        'Provider: ' + source.provider,
        'URL: ' + source.url,
        source.excerpt ? 'Metadata excerpt: ' + source.excerpt : '',
      ].filter(Boolean)
      return parts.join(' | ')
    })
    .join('\n')
}

export async function retrieveKnowledge(rawQuery: string): Promise<KnowledgeBundle> {
  const query = cleanText(rawQuery, 600)
  if (query.length < 3) throw new Error('Knowledge query must be at least 3 characters.')

  const jobs: Array<{ provider: KnowledgeProvider; task: Promise<KnowledgeSource[]> }> = [
    { provider: 'OpenAlex', task: searchOpenAlex(query) },
    { provider: 'Crossref', task: searchCrossref(query) },
  ]

  if (biomedicalWords.test(query)) {
    jobs.push({ provider: 'PubMed', task: searchPubMed(query) })
  }

  const settled = await Promise.allSettled(jobs.map((job) => job.task))
  const providers: ProviderStatus[] = []
  const allSources: KnowledgeSource[] = []

  settled.forEach((result, index) => {
    const provider = jobs[index].provider
    if (result.status === 'fulfilled') {
      providers.push({ provider, status: 'ok', count: result.value.length })
      allSources.push(...result.value)
    } else {
      providers.push({ provider, status: 'error', count: 0 })
    }
  })

  if (!biomedicalWords.test(query)) {
    providers.push({ provider: 'PubMed', status: 'skipped', count: 0 })
  }

  const sources = mergeSources(allSources, 10)
  return {
    query,
    retrievedAt: new Date().toISOString(),
    coverage: coverageFor(sources),
    sources,
    providers,
    sourceLedger: buildLedger(sources),
  }
}

export function buildResearchWorkflow(goal: string): AgentStep[] {
  const cleaned = cleanText(goal, 1200) || 'Prepare an evidence-grounded research output'
  return [
    {
      id: 'plan',
      agent: 'Planner Agent',
      task: 'Decompose the goal into an ordered research workflow: ' + cleaned,
      evidence: 'Human review',
    },
    {
      id: 'retrieve',
      agent: 'Deep Knowledge Agent',
      task: 'Retrieve, rank and deduplicate traceable scholarly records before factual synthesis.',
      evidence: 'Needs source',
    },
    {
      id: 'gap',
      agent: 'Gap Hunter Agent',
      task: 'Map prior work, defensible evidence gaps and possible contribution without inventing novelty.',
      evidence: 'Needs source',
    },
    {
      id: 'method',
      agent: 'Methodology Agent',
      task: 'Stress-test alignment among research questions, theory, data and method.',
      evidence: 'Human review',
    },
    {
      id: 'citation',
      agent: 'Citation Integrity Agent',
      task: 'Require material scholarly claims to point to real ledger sources and block invalid source markers.',
      evidence: 'Needs source',
    },
    {
      id: 'review',
      agent: 'Peer Review Agent',
      task: 'Challenge unsupported assumptions, scope, logic and publication readiness.',
      evidence: 'Human review',
    },
    {
      id: 'approval',
      agent: 'Human Approval Gate',
      task: 'Require researcher approval before publication, submission or other external action.',
      evidence: 'Verified',
    },
  ]
}

function extractMarkers(text: string) {
  const values: number[] = []
  for (const match of text.matchAll(/\[S(\d+)\]/gi)) {
    values.push(Number(match[1]))
  }
  return values.filter((value) => Number.isInteger(value) && value > 0)
}

export function auditCitationMarkers(text: string, bundle: KnowledgeBundle): CitationAudit {
  const markers = [...new Set(extractMarkers(text))]
  const validMarkers = markers.filter((value) => value <= bundle.sources.length)
  const invalidMarkers = markers.filter((value) => value > bundle.sources.length)
  const uncitedSources = bundle.sources
    .map((_, index) => index + 1)
    .filter((value) => !validMarkers.includes(value))

  const issues: CitationAudit['issues'] = []
  if (!bundle.sources.length) {
    issues.push({
      severity: 'error',
      code: 'NO_SOURCE_LEDGER',
      message: 'No source ledger is available for evidence-backed output.',
    })
  }
  if (bundle.sources.length && !validMarkers.length) {
    issues.push({
      severity: 'warning',
      code: 'NO_VALID_SOURCE_MARKERS',
      message: 'No valid [S#] source markers were found in the supplied text.',
    })
  }
  for (const marker of invalidMarkers) {
    issues.push({
      severity: 'error',
      code: 'INVALID_SOURCE_MARKER',
      message: '[S' + marker + '] does not exist in the current source ledger.',
    })
  }
  if (uncitedSources.length && validMarkers.length) {
    issues.push({
      severity: 'info',
      code: 'UNUSED_RETRIEVED_SOURCES',
      message: uncitedSources.length + ' retrieved source(s) are not cited in the supplied text.',
    })
  }

  let integrityScore = 100
  for (const issue of issues) {
    if (issue.severity === 'error') integrityScore -= 22
    if (issue.severity === 'warning') integrityScore -= 8
  }

  return {
    status: issues.some((item) => item.severity === 'error')
      ? 'fail'
      : issues.some((item) => item.severity === 'warning')
        ? 'warning'
        : 'pass',
    integrityScore: Math.max(0, integrityScore),
    validMarkers,
    invalidMarkers,
    uncitedSources,
    issues,
  }
}

export function evidenceRequestId(query: string) {
  return crypto.createHash('sha256').update(query.toLowerCase().trim()).digest('hex').slice(0, 16)
}
