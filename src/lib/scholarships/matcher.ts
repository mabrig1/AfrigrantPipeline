export type ScholarshipLevel = 'undergraduate' | 'masters' | 'phd' | 'postdoc' | 'fellowship'

export type FundingType = 'full' | 'partial' | 'unknown'

export interface ScholarshipOpportunity {
  id: string
  title: string
  provider: string
  levels: ScholarshipLevel[]
  funding: FundingType
  countries: string[]
  fields: string[]
  minGpa?: number
  requiresExperienceYears?: number
  requiresEnglishProof?: boolean
  officialUrl: string
  verificationStatus: 'official-source' | 'needs-verification'
  deadlineLabel: string
  catalogueStatus?: 'open' | 'draft'
  nigeriaEligible?: boolean
  eligibility?: string[]
  hasSourceLink?: boolean
  confidenceScore?: number
  relevanceScore?: number
  lastCheckedAt?: string
  lastVerifiedAt?: string
}

export interface ScholarshipApplicantProfile {
  nationality: string
  targetLevel: ScholarshipLevel
  field: string
  gpa?: number
  workExperienceYears: number
  needsFullFunding: boolean
  hasCv: boolean
  hasTranscript: boolean
  hasStatement: boolean
  hasReferences: boolean
  hasEnglishProof: boolean
  keywords?: string[]
}

export interface ScholarshipMatch {
  opportunity: ScholarshipOpportunity
  score: number
  label: 'Strong match' | 'Possible match' | 'Low match'
  reasons: string[]
  gaps: string[]
}

export interface ScholarshipReadiness {
  score: number
  completed: string[]
  missing: string[]
  nextAction: string
}

export const SCHOLARSHIP_STARTER_CATALOG: ScholarshipOpportunity[] = [
  {
    id: 'daad-development',
    title: 'DAAD Development-Related Postgraduate Opportunities',
    provider: 'German Academic Exchange Service (DAAD)',
    levels: ['masters', 'phd'],
    funding: 'full',
    countries: ['Germany'],
    fields: ['development', 'engineering', 'agriculture', 'public policy', 'economics', 'environment', 'health'],
    requiresExperienceYears: 2,
    requiresEnglishProof: true,
    officialUrl: 'https://www.daad.de/en/studying-in-germany/scholarships/',
    verificationStatus: 'official-source',
    deadlineLabel: 'Varies by programme — verify on official portal',
  },
  {
    id: 'commonwealth',
    title: 'Commonwealth Scholarship Opportunities',
    provider: 'Commonwealth Scholarship Commission',
    levels: ['masters', 'phd'],
    funding: 'full',
    countries: ['United Kingdom'],
    fields: ['development', 'health', 'education', 'agriculture', 'public policy', 'science', 'technology'],
    requiresEnglishProof: true,
    officialUrl: 'https://cscuk.fcdo.gov.uk/scholarships/',
    verificationStatus: 'official-source',
    deadlineLabel: 'Cycle-specific — verify on official portal',
  },
  {
    id: 'mastercard-foundation',
    title: 'Mastercard Foundation Scholars Program',
    provider: 'Mastercard Foundation',
    levels: ['undergraduate', 'masters'],
    funding: 'full',
    countries: ['Multiple countries'],
    fields: ['all'],
    officialUrl: 'https://mastercardfdn.org/all/scholars/',
    verificationStatus: 'official-source',
    deadlineLabel: 'Varies by partner institution',
  },
  {
    id: 'erasmus-mundus',
    title: 'Erasmus Mundus Joint Masters Scholarships',
    provider: 'European Commission / Erasmus+',
    levels: ['masters'],
    funding: 'full',
    countries: ['Europe'],
    fields: ['all'],
    requiresEnglishProof: true,
    officialUrl: 'https://erasmus-plus.ec.europa.eu/opportunities/opportunities-for-individuals/students/erasmus-mundus-joint-masters',
    verificationStatus: 'official-source',
    deadlineLabel: 'Varies by joint masters programme',
  },
  {
    id: 'chevening',
    title: 'Chevening Scholarships',
    provider: 'UK Foreign, Commonwealth & Development Office',
    levels: ['masters'],
    funding: 'full',
    countries: ['United Kingdom'],
    fields: ['all'],
    requiresExperienceYears: 2,
    officialUrl: 'https://www.chevening.org/scholarships/',
    verificationStatus: 'official-source',
    deadlineLabel: 'Annual cycle — verify current application window',
  },
  {
    id: 'fulbright-foreign-student',
    title: 'Fulbright Foreign Student Program',
    provider: 'Fulbright Program',
    levels: ['masters', 'phd'],
    funding: 'full',
    countries: ['United States'],
    fields: ['all'],
    requiresEnglishProof: true,
    officialUrl: 'https://foreign.fulbrightonline.org/',
    verificationStatus: 'official-source',
    deadlineLabel: 'Country-specific cycle — verify through official country channel',
  },
]

function normalise(value: string) {
  return value.trim().toLowerCase()
}

type FieldAlignment = 'specific' | 'broad' | 'unknown' | 'mismatch'

function applicantTerms(profile: ScholarshipApplicantProfile) {
  const terms = [profile.field, ...(profile.keywords ?? [])]
    .map(normalise)
    .filter((value) => value.length >= 3)

  return [...new Set(terms)]
}

function fieldAlignment(profile: ScholarshipApplicantProfile, supportedFields: string[]): FieldAlignment {
  const supported = supportedFields.map(normalise).filter(Boolean)
  if (!supported.length) return 'unknown'
  if (supported.includes('all') || supported.includes('any') || supported.includes('all fields')) {
    return 'broad'
  }

  const terms = applicantTerms(profile)
  if (!terms.length) return 'unknown'

  const matched = supported.some((candidate) =>
    terms.some((term) => term.includes(candidate) || candidate.includes(term))
  )
  return matched ? 'specific' : 'mismatch'
}

function eligibilityMentionsNationality(profile: ScholarshipApplicantProfile, eligibility: string[]) {
  const nationality = normalise(profile.nationality)
  if (!nationality || !eligibility.length) return false
  return eligibility.some((rule) => normalise(rule).includes(nationality))
}

export function calculateReadiness(profile: ScholarshipApplicantProfile): ScholarshipReadiness {
  const checks = [
    { done: Boolean(profile.nationality.trim()), label: 'Nationality/profile details' },
    { done: Boolean(profile.targetLevel), label: 'Target study level' },
    { done: Boolean(profile.field.trim()), label: 'Field of study' },
    { done: profile.hasCv, label: 'Academic CV' },
    { done: profile.hasTranscript, label: 'Academic transcript' },
    { done: profile.hasStatement, label: 'Statement of purpose / motivation letter' },
    { done: profile.hasReferences, label: 'Reference letters / referees' },
    { done: profile.hasEnglishProof, label: 'English-language evidence where required' },
  ]

  const completed = checks.filter((check) => check.done).map((check) => check.label)
  const missing = checks.filter((check) => !check.done).map((check) => check.label)
  const score = Math.round((completed.length / checks.length) * 100)

  let nextAction = 'You are ready to shortlist opportunities and verify programme-specific requirements.'
  if (!profile.hasCv) nextAction = 'Complete your academic CV first; it improves matching and application readiness.'
  else if (!profile.hasTranscript) nextAction = 'Prepare a clear academic transcript or result summary for eligibility checks.'
  else if (!profile.hasStatement) nextAction = 'Draft a scholarship-specific statement of purpose or motivation letter.'
  else if (!profile.hasReferences) nextAction = 'Identify referees and prepare reference-letter requests before deadlines.'
  else if (!profile.hasEnglishProof) nextAction = 'Check whether your target scholarships require IELTS, TOEFL, or an accepted waiver.'

  return { score, completed, missing, nextAction }
}

export function matchScholarship(
  profile: ScholarshipApplicantProfile,
  opportunity: ScholarshipOpportunity
): ScholarshipMatch {
  let score = 20
  const reasons: string[] = []
  const gaps: string[] = []
  let structuredSignals = 0

  if (opportunity.levels.length === 0) {
    gaps.push('Study level is not yet structured in the catalogue; verify it with the provider.')
  } else if (opportunity.levels.includes(profile.targetLevel)) {
    score += 25
    structuredSignals += 1
    reasons.push('Study level aligns with this opportunity.')
  } else {
    score -= 25
    gaps.push(`Targets ${opportunity.levels.join(', ')} rather than ${profile.targetLevel}.`)
  }

  const fieldFit = fieldAlignment(profile, opportunity.fields)
  if (fieldFit === 'specific') {
    score += 15
    structuredSignals += 1
    reasons.push('Your CV field or skills align with the listed programme areas.')
  } else if (fieldFit === 'broad') {
    score += 7
    structuredSignals += 1
    reasons.push('The opportunity is listed as open to broad or all fields.')
  } else if (fieldFit === 'unknown') {
    gaps.push('Field coverage is not yet structured; verify the programme-specific course list.')
  } else {
    score -= 8
    gaps.push('Field alignment is not explicit in the stored programme areas.')
  }

  if (profile.needsFullFunding) {
    if (opportunity.funding === 'full') {
      score += 12
      structuredSignals += 1
      reasons.push('Funding type matches your preference for fully funded opportunities.')
    } else if (opportunity.funding === 'partial') {
      score -= 10
      gaps.push('This opportunity may not cover all study and living costs.')
    } else {
      gaps.push('Funding coverage is not yet verified; confirm what the award actually pays for.')
    }
  }

  if (opportunity.verificationStatus === 'official-source') {
    score += 10
    structuredSignals += 1
    reasons.push('The stored record has provider-level source verification.')
  } else {
    score -= 2
    gaps.push('This catalogue record still needs current provider-level verification.')
  }

  if (opportunity.catalogueStatus === 'open') {
    score += 6
    structuredSignals += 1
    reasons.push('The stored application cycle is currently marked open.')
  } else if (opportunity.catalogueStatus === 'draft') {
    score -= 5
    gaps.push('The current application window or deadline still needs verification.')
  }

  if (opportunity.hasSourceLink === false) {
    score -= 12
    gaps.push('A direct provider/source link has not yet been attached to this catalogue record.')
  } else if (opportunity.hasSourceLink === true) {
    score += 3
    structuredSignals += 1
    reasons.push('A provider or source link is attached to the catalogue record.')
  }

  if (
    normalise(profile.nationality) === 'nigeria' &&
    opportunity.nigeriaEligible === true
  ) {
    score += 12
    structuredSignals += 1
    reasons.push('The catalogue explicitly marks Nigerian applicants as eligible.')
  } else if (eligibilityMentionsNationality(profile, opportunity.eligibility ?? [])) {
    score += 8
    structuredSignals += 1
    reasons.push('Stored eligibility text explicitly mentions your nationality.')
  }

  if (typeof opportunity.minGpa === 'number') {
    if (typeof profile.gpa === 'number' && profile.gpa >= opportunity.minGpa) {
      score += 8
      reasons.push('Your GPA meets the stored academic threshold.')
    } else if (typeof profile.gpa === 'number') {
      score -= 15
      gaps.push(`Stored GPA threshold is ${opportunity.minGpa}; verify equivalency rules.`)
    } else {
      gaps.push('GPA was not provided, so academic-threshold matching is incomplete.')
    }
  }

  if (opportunity.requiresExperienceYears) {
    if (profile.workExperienceYears >= opportunity.requiresExperienceYears) {
      score += 8
      reasons.push('Your work-experience level meets the stored experience requirement.')
    } else {
      score -= 14
      gaps.push(`May require about ${opportunity.requiresExperienceYears} years of relevant experience.`)
    }
  }

  if (opportunity.requiresEnglishProof) {
    if (profile.hasEnglishProof) {
      score += 5
      reasons.push('You indicated that you have English-language evidence available.')
    } else {
      gaps.push('English-language proof or an accepted waiver may be required.')
    }
  }

  if (profile.hasCv && profile.hasTranscript) {
    score += 5
    reasons.push('Core academic documents are already available.')
  }

  if (typeof opportunity.confidenceScore === 'number') {
    if (opportunity.confidenceScore >= 0.85) {
      score += 4
      reasons.push('The catalogue record has high extraction/source confidence.')
    } else if (opportunity.confidenceScore < 0.5) {
      score -= 4
      gaps.push('This catalogue record has low extraction/source confidence.')
    }
  }

  if (typeof opportunity.relevanceScore === 'number' && opportunity.relevanceScore >= 85) {
    score += 3
  }

  const checkedAt = opportunity.lastVerifiedAt || opportunity.lastCheckedAt
  if (checkedAt) {
    const ageMs = Date.now() - new Date(checkedAt).getTime()
    const ninetyDays = 90 * 24 * 60 * 60 * 1000
    const oneYear = 365 * 24 * 60 * 60 * 1000
    if (Number.isFinite(ageMs) && ageMs >= 0 && ageMs <= ninetyDays) {
      score += 4
      reasons.push('The source record was checked recently.')
    } else if (Number.isFinite(ageMs) && ageMs > oneYear) {
      score -= 5
      gaps.push('The stored source check is more than a year old; verify the current cycle.')
    }
  }

  if (structuredSignals < 2) {
    score -= 10
    gaps.push('Too little structured evidence is available for a high-confidence match.')
  }

  score = Math.max(0, Math.min(100, score))

  const label: ScholarshipMatch['label'] =
    score >= 75 ? 'Strong match' : score >= 50 ? 'Possible match' : 'Low match'

  return { opportunity, score, label, reasons, gaps }
}

export function matchScholarships(
  profile: ScholarshipApplicantProfile,
  opportunities = SCHOLARSHIP_STARTER_CATALOG
) {
  return opportunities
    .map((opportunity) => matchScholarship(profile, opportunity))
    .sort((a, b) => b.score - a.score)
}
