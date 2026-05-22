import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, differenceInDays, isPast, isToday, isTomorrow } from 'date-fns'

// ── Class name merger ─────────────────────────────────────────────────────────

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

// ── Date formatters ───────────────────────────────────────────────────────────

/**
 * Format a date with an optional date-fns format string.
 * Default: "Jan 15, 2025"
 */
export function formatDate(date: Date | string, fmt = 'MMM d, yyyy'): string {
  return format(new Date(date), fmt)
}

/**
 * Format a date as a human-readable relative string.
 * e.g. "3 days ago", "in 2 months"
 */
export function formatRelativeDate(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

// ── Deadline urgency ──────────────────────────────────────────────────────────

export type DeadlineUrgency = 'safe' | 'warning' | 'critical' | 'expired'

export interface DeadlineInfo {
  label: string
  urgency: DeadlineUrgency
  daysLeft: number
}

/**
 * Returns a human-readable deadline label and an urgency level:
 *   expired   — deadline has passed
 *   critical  — ≤ 3 days remaining
 *   warning   — 4–14 days remaining
 *   safe      — > 14 days remaining
 */
export function formatDeadline(deadline: Date | string): DeadlineInfo {
  const d = new Date(deadline)

  if (isPast(d) && !isToday(d)) {
    return { label: 'Expired', urgency: 'expired', daysLeft: 0 }
  }

  const daysLeft = differenceInDays(d, new Date())

  if (isToday(d)) return { label: 'Due today', urgency: 'critical', daysLeft: 0 }
  if (isTomorrow(d)) return { label: 'Due tomorrow', urgency: 'critical', daysLeft: 1 }
  if (daysLeft <= 3) return { label: `${daysLeft} days left`, urgency: 'critical', daysLeft }
  if (daysLeft <= 14) return { label: `${daysLeft} days left`, urgency: 'warning', daysLeft }

  return { label: format(d, 'MMM d, yyyy'), urgency: 'safe', daysLeft }
}

// ── Currency formatter ────────────────────────────────────────────────────────

/**
 * Format a monetary amount using the browser/Node Intl API.
 * e.g. formatCurrency(50000, 'USD') → "$50,000"
 *      formatCurrency(2500000, 'NGN', 'en-NG') → "₦2,500,000"
 */
export function formatCurrency(
  amount: number,
  currency: string,
  locale = 'en-US',
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount)
  } catch {
    // Fallback for unknown currency codes
    return `${currency} ${amount.toLocaleString(locale)}`
  }
}

// ── Citation generators ───────────────────────────────────────────────────────

export interface CitationSource {
  /** Article or book title */
  title: string
  /** Author full names in display order, e.g. ["John Doe", "Mary Smith"] */
  authors: string[]
  /** Journal or periodical name */
  journal?: string
  /** Publication year */
  year?: number
  /** Journal volume number */
  volume?: string
  /** Journal issue number */
  issue?: string
  /** Page range, e.g. "45–62" */
  pages?: string
  /** DOI without the "https://doi.org/" prefix, e.g. "10.1000/xyz123" */
  doi?: string
  /** Fallback URL when no DOI */
  url?: string
  /** Publisher name (books) */
  publisher?: string
  /** Publisher city (books) */
  publisherCity?: string
}

interface ParsedName {
  first: string   // e.g. "Mary Anne"
  last: string    // e.g. "Smith"
  initials: string // e.g. "M. A."
}

function parseName(fullName: string): ParsedName {
  const parts = fullName.trim().split(/\s+/)
  if (parts.length === 1) return { first: '', last: parts[0], initials: '' }
  const last = parts[parts.length - 1]
  const firstParts = parts.slice(0, -1)
  const first = firstParts.join(' ')
  const initials = firstParts.map((p) => `${p[0].toUpperCase()}.`).join(' ')
  return { first, last, initials }
}

// ── APA 7th Edition ───────────────────────────────────────────────────────────

/**
 * Generate an APA 7th edition citation string.
 *
 * Journal article:
 *   Doe, J., & Smith, A. (2023). The title. Nature, 42(3), 100–110.
 *   https://doi.org/10.1234/nature
 *
 * Book:
 *   Doe, J. (2023). The title. Publisher City: Publisher.
 */
export function citationAPA(src: CitationSource): string {
  const names = src.authors.map(parseName)

  // Format each name as "Last, I. M."
  const formatted = names.map(({ last, initials }) =>
    initials ? `${last}, ${initials}` : last,
  )

  let authorStr: string
  if (formatted.length === 0) {
    authorStr = 'Unknown Author'
  } else if (formatted.length === 1) {
    authorStr = formatted[0]
  } else if (formatted.length <= 20) {
    authorStr =
      formatted.slice(0, -1).join(', ') + ', & ' + formatted[formatted.length - 1]
  } else {
    // 21+ authors: first 19, ellipsis, last author
    authorStr =
      formatted.slice(0, 19).join(', ') + ', . . . ' + formatted[formatted.length - 1]
  }

  const year = src.year ?? 'n.d.'
  let citation = `${authorStr}. (${year}). ${src.title}.`

  if (src.journal) {
    citation += ` ${src.journal}`
    if (src.volume) {
      citation += `, ${src.volume}`
      if (src.issue) citation += `(${src.issue})`
    }
    if (src.pages) citation += `, ${src.pages}`
    citation += '.'
  } else if (src.publisher) {
    const loc = src.publisherCity ? `${src.publisherCity}: ` : ''
    citation += ` ${loc}${src.publisher}.`
  }

  if (src.doi) {
    citation += ` https://doi.org/${src.doi}`
  } else if (src.url) {
    citation += ` ${src.url}`
  }

  return citation
}

// ── MLA 9th Edition ───────────────────────────────────────────────────────────

/**
 * Generate an MLA 9th edition citation string.
 *
 * Journal article:
 *   Doe, John, and Mary Smith. "The title." Nature, vol. 42, no. 3,
 *   2023, pp. 100–110. doi:10.1234/nature.
 */
export function citationMLA(src: CitationSource): string {
  const names = src.authors.map(parseName)

  let authorStr: string
  if (names.length === 0) {
    authorStr = ''
  } else if (names.length === 1) {
    const { first, last } = names[0]
    authorStr = first ? `${last}, ${first}` : last
  } else if (names.length === 2) {
    const { first: f1, last: l1 } = names[0]
    const { first: f2, last: l2 } = names[1]
    const n1 = f1 ? `${l1}, ${f1}` : l1
    const n2 = f2 ? `${f2} ${l2}` : l2
    authorStr = `${n1}, and ${n2}`
  } else {
    // 3+ authors: first author + "et al."
    const { first, last } = names[0]
    authorStr = first ? `${last}, ${first}, et al` : `${last}, et al`
  }

  let citation = authorStr ? `${authorStr}. ` : ''
  citation += `"${src.title}."`

  if (src.journal) {
    citation += ` ${src.journal}`
    if (src.volume) citation += `, vol. ${src.volume}`
    if (src.issue) citation += `, no. ${src.issue}`
    if (src.year) citation += `, ${src.year}`
    if (src.pages) citation += `, pp. ${src.pages}`
    citation += '.'
  } else if (src.publisher) {
    if (src.year) citation += ` ${src.year}.`
    citation += ` ${src.publisher}.`
  } else if (src.year) {
    citation += ` ${src.year}.`
  }

  if (src.doi) {
    citation += ` doi:${src.doi}.`
  } else if (src.url) {
    citation += ` ${src.url}.`
  }

  return citation
}

// ── Chicago 17th Edition (Author-Date) ───────────────────────────────────────

/**
 * Generate a Chicago 17th edition author-date citation string.
 *
 * Journal article:
 *   Doe, John, and Mary Smith. 2023. "The title." Nature 42 (3): 100–110.
 *   https://doi.org/10.1234/nature.
 */
export function citationChicago(src: CitationSource): string {
  const names = src.authors.map(parseName)

  let authorStr: string
  if (names.length === 0) {
    authorStr = ''
  } else if (names.length === 1) {
    const { first, last } = names[0]
    authorStr = first ? `${last}, ${first}` : last
  } else if (names.length <= 3) {
    const parts = names.map(({ first, last }, i) => {
      // First author: "Last, First"
      if (i === 0) return first ? `${last}, ${first}` : last
      // Subsequent: "First Last"
      return first ? `${first} ${last}` : last
    })
    authorStr =
      parts.length === 2
        ? `${parts[0]}, and ${parts[1]}`
        : `${parts[0]}, ${parts[1]}, and ${parts[2]}`
  } else {
    // 4+ authors: first author + "et al."
    const { first, last } = names[0]
    authorStr = first ? `${last}, ${first}, et al` : `${last}, et al`
  }

  const year = src.year ?? 'n.d.'
  let citation = authorStr ? `${authorStr}. ` : ''
  citation += `${year}. `

  if (src.journal) {
    citation += `"${src.title}." ${src.journal}`
    if (src.volume) {
      citation += ` ${src.volume}`
      if (src.issue) citation += ` (${src.issue})`
    }
    if (src.pages) citation += `: ${src.pages}`
    citation += '.'
  } else {
    citation += `${src.title}.`
    if (src.publisher) {
      const loc = src.publisherCity ? `${src.publisherCity}: ` : ''
      citation += ` ${loc}${src.publisher}.`
    }
  }

  if (src.doi) {
    citation += ` https://doi.org/${src.doi}.`
  } else if (src.url) {
    citation += ` ${src.url}.`
  }

  return citation
}
