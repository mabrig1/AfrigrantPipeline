export type ReadinessBand = 'ready' | 'almost' | 'needs-work'

export type ReadinessCheck = {
  id: string
  label: string
  complete: boolean
  points: number
  maxPoints: number
  evidence: string
  action: string
}

export type ReadinessAssessment = {
  score: number
  band: ReadinessBand
  label: string
  checks: ReadinessCheck[]
  priorityActions: string[]
  notice: string
}

export type GoogleIndexInput = {
  fullName: string
  institution: string
  institutionalEmailVerified: boolean
  publicScholarProfile: boolean
  orcid: string
  title: string
  authors: string[]
  year: string
  journal: string
  doi: string
  abstract: string
  articleUrl: string
  pdfUrl: string
  rightsConfirmed: boolean
  publicLandingPage: boolean
  freeAbstractVisible: boolean
  searchablePdf: boolean
  oneArticlePerUrl: boolean
  scholarMetaTags: boolean
  robotsAllowed: boolean
  titleAndAuthorsVisible: boolean
  referencesPresent: boolean
  canonicalUrl: boolean
  sitemapIncluded: boolean
  linkedFromAuthorPage: boolean
  googleSearchVisible: boolean
  googleScholarVisible: boolean
}

export type ScopusHubInput = {
  hasScopusProfile: boolean
  profileHasCorrectName: boolean
  profileHasCorrectAffiliation: boolean
  duplicateProfilesResolved: boolean
  missingIndexedDocumentsResolved: boolean
  orcidConnected: boolean
  targetJournalCurrentlyCovered: boolean
  targetJournalScopeFit: boolean
  manuscriptHasEnglishTitleAbstract: boolean
  ethicsAndResearchIntegrityReady: boolean
}

export type MissionStage = {
  id: string
  title: string
  status: 'done' | 'current' | 'blocked' | 'pending'
  summary: string
  actions: string[]
  blockers: string[]
}

function clean(value: string) {
  return value.trim().replace(/\s+/g, ' ')
}

function calculate(checks: ReadinessCheck[]) {
  const max = checks.reduce((sum, item) => sum + item.maxPoints, 0)
  const earned = checks.reduce((sum, item) => sum + item.points, 0)
  return max ? Math.round((earned / max) * 100) : 0
}

function bandFor(score: number): ReadinessBand {
  if (score >= 85) return 'ready'
  if (score >= 65) return 'almost'
  return 'needs-work'
}

function escapeHtml(value: string) {
  return clean(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function normalizeDoi(value: string) {
  return clean(value)
    .replace(/^doi:\s*/i, '')
    .replace(/^https?:\/\/(?:dx\.)?doi\.org\//i, '')
}

function validYear(value: string) {
  const year = Number(value)
  return Number.isInteger(year) && year >= 1500 && year <= 2200
}

export function assessGoogleIndexReadiness(input: GoogleIndexInput): ReadinessAssessment {
  const checks: ReadinessCheck[] = [
    {
      id: 'identity',
      label: 'Stable researcher identity',
      complete: Boolean(clean(input.fullName) && clean(input.institution)),
      points: clean(input.fullName) && clean(input.institution) ? 8 : 0,
      maxPoints: 8,
      evidence: clean(input.fullName) && clean(input.institution)
        ? 'Researcher name and institution are supplied.'
        : 'A stable publishing identity is incomplete.',
      action: 'Use one consistent publishing name and institutional affiliation across the article, ORCID and profiles.',
    },
    {
      id: 'public-profile',
      label: 'Public Google Scholar profile',
      complete: input.publicScholarProfile,
      points: input.publicScholarProfile ? 8 : 0,
      maxPoints: 8,
      evidence: input.publicScholarProfile
        ? 'The Scholar profile is public.'
        : 'A public author profile improves researcher discoverability.',
      action: 'Make the Google Scholar author profile public when available.',
    },
    {
      id: 'institution-email',
      label: 'Institutional email verified',
      complete: input.institutionalEmailVerified,
      points: input.institutionalEmailVerified ? 7 : 0,
      maxPoints: 7,
      evidence: input.institutionalEmailVerified
        ? 'Institutional email verification is recorded.'
        : 'Institutional verification is not recorded.',
      action: 'Verify an institutional email on the Google Scholar profile when the institution provides one.',
    },
    {
      id: 'landing-page',
      label: 'One public landing page per article',
      complete: input.publicLandingPage && input.oneArticlePerUrl,
      points: input.publicLandingPage && input.oneArticlePerUrl ? 13 : 0,
      maxPoints: 13,
      evidence: input.publicLandingPage && input.oneArticlePerUrl
        ? 'The work has a dedicated public URL.'
        : 'Scholar works best with one scholarly work per crawlable URL.',
      action: 'Create one public HTML landing page for this article and keep the URL stable.',
    },
    {
      id: 'abstract',
      label: 'Complete author-written abstract visible',
      complete: input.freeAbstractVisible,
      points: input.freeAbstractVisible ? 10 : 0,
      maxPoints: 10,
      evidence: input.freeAbstractVisible
        ? 'The complete abstract is visible without login.'
        : 'The full author-written abstract is not confirmed as freely visible.',
      action: 'Expose the complete author-written abstract without login or click-through barriers.',
    },
    {
      id: 'document',
      label: 'Parser-friendly scholarly document',
      complete: input.searchablePdf && input.titleAndAuthorsVisible && input.referencesPresent,
      points: input.searchablePdf && input.titleAndAuthorsVisible && input.referencesPresent ? 14 : 0,
      maxPoints: 14,
      evidence: input.searchablePdf && input.titleAndAuthorsVisible && input.referencesPresent
        ? 'The PDF is searchable with conventional title, author and reference structure.'
        : 'The document structure still has parser-risk gaps.',
      action: 'Use a text-searchable PDF, clear title/authors, and a conventional References/Bibliography section.',
    },
    {
      id: 'metadata',
      label: 'Highwire / Scholar metadata',
      complete: input.scholarMetaTags && input.canonicalUrl,
      points: input.scholarMetaTags && input.canonicalUrl ? 16 : 0,
      maxPoints: 16,
      evidence: input.scholarMetaTags && input.canonicalUrl
        ? 'Citation metadata and canonical URL are present.'
        : 'Machine-readable citation metadata or canonical URL is incomplete.',
      action: 'Add citation_title, one citation_author per author, publication date, DOI/PDF URL where available, and a canonical link.',
    },
    {
      id: 'crawl',
      label: 'Crawl and discovery paths',
      complete: input.robotsAllowed && input.sitemapIncluded && input.linkedFromAuthorPage,
      points: input.robotsAllowed && input.sitemapIncluded && input.linkedFromAuthorPage ? 16 : 0,
      maxPoints: 16,
      evidence: input.robotsAllowed && input.sitemapIncluded && input.linkedFromAuthorPage
        ? 'Robots, sitemap and internal discovery paths are all present.'
        : 'One or more crawl/discovery paths are missing.',
      action: 'Allow crawling, add the landing page to the XML sitemap, and link it from an author/repository/publications page.',
    },
    {
      id: 'rights',
      label: 'Rights-safe public version',
      complete: input.rightsConfirmed,
      points: input.rightsConfirmed ? 8 : 0,
      maxPoints: 8,
      evidence: input.rightsConfirmed
        ? 'Public sharing rights are confirmed.'
        : 'The public-sharing right for this version is not confirmed.',
      action: 'Confirm publisher/repository rights before exposing the PDF or accepted manuscript.',
    },
  ]

  const score = calculate(checks)
  return {
    score,
    band: bandFor(score),
    label:
      score >= 85
        ? 'Strong Google Scholar discoverability readiness'
        : score >= 65
          ? 'Almost ready — repair the remaining indexing gaps'
          : 'Needs work before relying on Google Scholar discovery',
    checks,
    priorityActions: checks.filter((item) => !item.complete).map((item) => item.action).slice(0, 6),
    notice:
      'This engine improves crawlability, bibliographic parsing and discoverability. Google and Google Scholar control crawl timing, inclusion, grouping and final display; no indexing guarantee is possible.',
  }
}

export function assessScopusReadiness(input: ScopusHubInput): ReadinessAssessment {
  const checks: ReadinessCheck[] = [
    {
      id: 'profile',
      label: 'Scopus Author Profile exists',
      complete: input.hasScopusProfile,
      points: input.hasScopusProfile ? 12 : 0,
      maxPoints: 12,
      evidence: input.hasScopusProfile
        ? 'A Scopus author record is available.'
        : 'No Scopus author profile is confirmed.',
      action: 'Search Scopus Author Profiles using the researcher name, affiliation and ORCID.',
    },
    {
      id: 'identity',
      label: 'Preferred author name is correct',
      complete: input.profileHasCorrectName,
      points: input.profileHasCorrectName ? 10 : 0,
      maxPoints: 10,
      evidence: input.profileHasCorrectName
        ? 'The preferred author name is correct.'
        : 'Name variation can split the research record.',
      action: 'Use the Scopus Author Feedback Wizard to request the preferred display name.',
    },
    {
      id: 'affiliation',
      label: 'Primary affiliation is correct',
      complete: input.profileHasCorrectAffiliation,
      points: input.profileHasCorrectAffiliation ? 10 : 0,
      maxPoints: 10,
      evidence: input.profileHasCorrectAffiliation
        ? 'Primary affiliation is correct.'
        : 'Affiliation accuracy is not confirmed.',
      action: 'Request the correct primary affiliation through the Author Feedback Wizard.',
    },
    {
      id: 'duplicates',
      label: 'Duplicate author profiles resolved',
      complete: input.duplicateProfilesResolved,
      points: input.duplicateProfilesResolved ? 10 : 0,
      maxPoints: 10,
      evidence: input.duplicateProfilesResolved
        ? 'No unresolved duplicate profiles are reported.'
        : 'Duplicate author IDs can fragment documents and metrics.',
      action: 'Request profile merging where duplicate Scopus author records exist.',
    },
    {
      id: 'documents',
      label: 'Missing indexed documents reviewed',
      complete: input.missingIndexedDocumentsResolved,
      points: input.missingIndexedDocumentsResolved ? 10 : 0,
      maxPoints: 10,
      evidence: input.missingIndexedDocumentsResolved
        ? 'Known indexed publications are attached to the correct profile.'
        : 'Missing indexed documents may understate output.',
      action: 'Check missing papers in Scopus and request assignment to the correct author profile where appropriate.',
    },
    {
      id: 'orcid',
      label: 'ORCID identity is aligned',
      complete: input.orcidConnected,
      points: input.orcidConnected ? 8 : 0,
      maxPoints: 8,
      evidence: input.orcidConnected
        ? 'ORCID and researcher identity are aligned.'
        : 'ORCID alignment is incomplete.',
      action: 'Align ORCID, preferred publishing name and institutional affiliation.',
    },
    {
      id: 'source',
      label: 'Target journal is currently Scopus-covered',
      complete: input.targetJournalCurrentlyCovered,
      points: input.targetJournalCurrentlyCovered ? 16 : 0,
      maxPoints: 16,
      evidence: input.targetJournalCurrentlyCovered
        ? 'Current source coverage has been checked.'
        : 'Current Scopus source coverage is not confirmed.',
      action: 'Verify the target journal in the current Scopus Sources/Preview list before submission.',
    },
    {
      id: 'scope',
      label: 'Manuscript fits the journal scope',
      complete: input.targetJournalScopeFit,
      points: input.targetJournalScopeFit ? 10 : 0,
      maxPoints: 10,
      evidence: input.targetJournalScopeFit
        ? 'Journal scope fit has been reviewed.'
        : 'Indexing status alone is not a publication strategy.',
      action: 'Compare the manuscript with the journal aims/scope and recent papers before submission.',
    },
    {
      id: 'metadata',
      label: 'English title and abstract are publication-ready',
      complete: input.manuscriptHasEnglishTitleAbstract,
      points: input.manuscriptHasEnglishTitleAbstract ? 7 : 0,
      maxPoints: 7,
      evidence: input.manuscriptHasEnglishTitleAbstract
        ? 'English title and abstract are ready.'
        : 'Title/abstract discoverability needs work.',
      action: 'Prepare a precise English title, structured abstract and consistent keywords.',
    },
    {
      id: 'integrity',
      label: 'Research integrity package is ready',
      complete: input.ethicsAndResearchIntegrityReady,
      points: input.ethicsAndResearchIntegrityReady ? 7 : 0,
      maxPoints: 7,
      evidence: input.ethicsAndResearchIntegrityReady
        ? 'Required integrity/ethics materials are prepared.'
        : 'Ethics/disclosure/citation checks are incomplete.',
      action: 'Complete ethics statements, authorship declarations, conflicts/data disclosures and citation checks.',
    },
  ]

  const score = calculate(checks)
  return {
    score,
    band: bandFor(score),
    label:
      score >= 85
        ? 'Strong Scopus visibility and publication readiness'
        : score >= 65
          ? 'Almost ready — repair the remaining Scopus visibility gaps'
          : 'Needs work before relying on Scopus visibility',
    checks,
    priorityActions: checks.filter((item) => !item.complete).map((item) => item.action).slice(0, 6),
    notice:
      'Ordinary articles are not manually added to Scopus by an author. Scopus indexes covered sources and builds author profiles from indexed content. This hub focuses on source verification, profile accuracy, ORCID consistency and publication readiness.',
  }
}

export function buildHighwireMetaTags(input: GoogleIndexInput) {
  const lines: string[] = []
  const title = clean(input.title)
  if (title) lines.push('<meta name="citation_title" content="' + escapeHtml(title) + '" />')

  for (const author of input.authors.map(clean).filter(Boolean)) {
    lines.push('<meta name="citation_author" content="' + escapeHtml(author) + '" />')
  }

  if (validYear(input.year)) {
    lines.push('<meta name="citation_publication_date" content="' + escapeHtml(input.year) + '" />')
  }

  if (clean(input.journal)) {
    lines.push('<meta name="citation_journal_title" content="' + escapeHtml(input.journal) + '" />')
  }

  const doi = normalizeDoi(input.doi)
  if (doi) lines.push('<meta name="citation_doi" content="' + escapeHtml(doi) + '" />')
  if (clean(input.pdfUrl)) {
    lines.push('<meta name="citation_pdf_url" content="' + escapeHtml(input.pdfUrl) + '" />')
  }
  if (clean(input.articleUrl)) {
    lines.push('<link rel="canonical" href="' + escapeHtml(input.articleUrl) + '" />')
  }

  return lines.join('\n')
}

export function buildScholarlyArticleJsonLd(input: GoogleIndexInput) {
  const doi = normalizeDoi(input.doi)
  const payload: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'ScholarlyArticle',
    headline: clean(input.title) || undefined,
    author: input.authors.map(clean).filter(Boolean).map((name) => ({ '@type': 'Person', name })),
    datePublished: validYear(input.year) ? input.year : undefined,
    isPartOf: clean(input.journal)
      ? { '@type': 'Periodical', name: clean(input.journal) }
      : undefined,
    abstract: clean(input.abstract) || undefined,
    identifier: doi ? 'https://doi.org/' + doi : undefined,
    url: clean(input.articleUrl) || undefined,
    encoding: clean(input.pdfUrl)
      ? {
          '@type': 'MediaObject',
          contentUrl: clean(input.pdfUrl),
          encodingFormat: 'application/pdf',
        }
      : undefined,
  }

  for (const key of Object.keys(payload)) {
    const value = payload[key]
    if (value === undefined || (Array.isArray(value) && value.length === 0)) delete payload[key]
  }

  return '<script type="application/ld+json">\n' + JSON.stringify(payload, null, 2) + '\n</script>'
}

function stage(
  id: string,
  title: string,
  complete: boolean,
  blockers: string[],
  summary: string,
  actions: string[]
): MissionStage {
  return {
    id,
    title,
    status: complete ? 'done' : blockers.length ? 'blocked' : 'pending',
    summary,
    actions,
    blockers,
  }
}

export function buildGoogleIndexMission(input: GoogleIndexInput) {
  const readiness = assessGoogleIndexReadiness(input)

  const identityBlockers = [
    !clean(input.fullName) ? 'Add the researcher publishing name.' : '',
    !clean(input.institution) ? 'Add the researcher affiliation.' : '',
  ].filter(Boolean)

  const metadataBlockers = [
    !clean(input.title) ? 'Add the paper title.' : '',
    !input.authors.map(clean).filter(Boolean).length ? 'Add at least one author.' : '',
    !validYear(input.year) ? 'Add a valid publication year.' : '',
    clean(input.abstract).length < 80 ? 'Add the complete author-written abstract.' : '',
  ].filter(Boolean)

  const hostingBlockers = [
    !input.rightsConfirmed ? 'Confirm rights for the public version.' : '',
    !clean(input.articleUrl) ? 'Provide a permanent article landing-page URL.' : '',
    !input.publicLandingPage ? 'Make the landing page public without login.' : '',
    !input.freeAbstractVisible ? 'Expose the complete abstract.' : '',
    !input.oneArticlePerUrl ? 'Use one scholarly work per unique URL.' : '',
  ].filter(Boolean)

  const discoveryBlockers = [
    !input.robotsAllowed ? 'Allow Googlebot to crawl the article page and PDF.' : '',
    !input.sitemapIncluded ? 'Include the article landing page in the XML sitemap.' : '',
    !input.linkedFromAuthorPage ? 'Link the work from an author/repository/publications page.' : '',
  ].filter(Boolean)

  const stages = [
    stage(
      'identity',
      '1. Stabilize researcher identity',
      identityBlockers.length === 0,
      identityBlockers,
      'Align the researcher name, affiliation and persistent identifiers.',
      [
        'Use a consistent publishing name across the paper, ORCID, institutional page and Scholar profile.',
        'Verify the institutional email where available.',
      ]
    ),
    stage(
      'metadata',
      '2. Normalize the scholarly record',
      metadataBlockers.length === 0,
      metadataBlockers,
      'Give crawlers an unambiguous bibliographic record.',
      ['Keep title, authors, year, journal/repository and DOI consistent across every version.']
    ),
    stage(
      'hosting',
      '3. Publish a rights-safe article page',
      hostingBlockers.length === 0,
      hostingBlockers,
      'Expose a stable public landing page without violating publisher rights.',
      ['Use an allowed version: open-access version, accepted manuscript, preprint or repository copy.']
    ),
    stage(
      'markup',
      '4. Deploy Scholar-compatible metadata',
      input.scholarMetaTags && input.canonicalUrl && metadataBlockers.length === 0,
      [
        ...metadataBlockers,
        !input.scholarMetaTags ? 'Add Highwire/Scholar citation meta tags.' : '',
        !input.canonicalUrl ? 'Add a canonical URL.' : '',
      ].filter(Boolean),
      'Make the bibliographic record machine-readable.',
      ['Deploy the generated Highwire tags and ScholarlyArticle JSON-LD on the landing page.']
    ),
    stage(
      'discovery',
      '5. Build crawl and discovery paths',
      discoveryBlockers.length === 0,
      discoveryBlockers,
      'Help ordinary Google Search and Scholar discover the article naturally.',
      [
        'Allow crawling in robots directives.',
        'Add the URL to the XML sitemap and submit the sitemap in Search Console.',
        'Use Search Console URL Inspection for the public page.',
        'Do not misuse Google Indexing API for ordinary scholarly article pages.',
      ]
    ),
    stage(
      'verify',
      '6. Verify and monitor inclusion',
      input.googleSearchVisible && input.googleScholarVisible,
      input.googleSearchVisible
        ? []
        : ['First verify that ordinary Google Search can discover the article landing page.'],
      'Check discovery first in Google Search, then Scholar.',
      [
        'Search the exact title in Google Search and Google Scholar.',
        'If Google sees the page but Scholar does not, re-check metadata, abstract visibility, document structure and crawl paths.',
      ]
    ),
  ]

  const firstOpen = stages.findIndex((item) => item.status !== 'done')
  if (firstOpen >= 0) stages[firstOpen] = { ...stages[firstOpen], status: 'current' }

  const title = clean(input.title)
  const host = (() => {
    try {
      return new URL(input.articleUrl).hostname
    } catch {
      return ''
    }
  })()

  const verificationLinks = [
    title
      ? {
          label: 'Exact-title Google Search',
          url: 'https://www.google.com/search?q=' + encodeURIComponent('"' + title + '"'),
        }
      : null,
    title
      ? {
          label: 'Exact-title Google Scholar Search',
          url: 'https://scholar.google.com/scholar?q=' + encodeURIComponent('"' + title + '"'),
        }
      : null,
    host && title
      ? {
          label: 'Google site: check',
          url: 'https://www.google.com/search?q=' + encodeURIComponent('site:' + host + ' "' + title + '"'),
        }
      : null,
    normalizeDoi(input.doi)
      ? {
          label: 'Resolve DOI',
          url: 'https://doi.org/' + encodeURI(normalizeDoi(input.doi)),
        }
      : null,
  ].filter((item): item is { label: string; url: string } => Boolean(item))

  return {
    readiness,
    stages,
    progress: Math.round((stages.filter((item) => item.status === 'done').length / stages.length) * 100),
    nextAction:
      stages.find((item) => item.status === 'current')?.blockers[0] ||
      stages.find((item) => item.status === 'current')?.actions[0] ||
      'Maintain stable metadata and periodically verify exact-title inclusion.',
    highwireMetaTags: buildHighwireMetaTags(input),
    jsonLd: buildScholarlyArticleJsonLd(input),
    verificationLinks,
    policyNotice:
      'Google Indexing API is not used for ordinary scholarly article pages. The engine follows crawlability, metadata, sitemap, Search Console and Google Scholar inclusion practices instead.',
  }
}
