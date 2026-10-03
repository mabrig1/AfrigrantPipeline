'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Filter,
  Globe,
  GraduationCap,
  Heart,
  Loader2,
  Search,
  ShieldCheck,
} from 'lucide-react'

type ScholarshipLevel = 'undergraduate' | 'masters' | 'phd' | 'postdoc' | 'fellowship' | 'other'
type FundingType = 'full' | 'partial' | 'tuition-only' | 'stipend-only' | 'other'
type ScholarshipStatus = 'open' | 'closed' | 'draft'

interface Scholarship {
  id: string
  title: string
  provider: string
  description: string
  fundingText?: string
  amount?: number
  currency?: string
  deadline?: string
  isRolling?: boolean
  status: ScholarshipStatus
  eligibility?: string[]
  countries?: string[]
  region?: string
  applicationLink?: string
  sourceName?: string
  sourceUrl?: string
  discoveredBy?: 'agent' | 'import' | 'manual'
  verificationStatus?: 'unverified' | 'needs_review' | 'verified' | 'stale'
  relevanceScore?: number
  nigeriaEligible?: boolean
  scholarshipDetails?: {
    levels?: ScholarshipLevel[]
    fundingType?: FundingType
    benefits?: string[]
    fieldsOfStudy?: string[]
    studyCountries?: string[]
    applicationCycle?: string
  }
}

interface CatalogueResponse {
  count: number
  total: number
  page: number
  limit: number
  pages: number
  target: number
  stats: {
    catalogueTotal: number
    open: number
    verified: number
    nigeriaEligible: number
  }
  bootstrap?: {
    target: number
    before: number
    after: number
    inserted: number
    parsed: number
    pagesFetched: number
    errors: string[]
  }
  items: Scholarship[]
}

const LEVEL_LABELS: Record<string, string> = {
  all: 'All levels',
  undergraduate: 'Undergraduate',
  masters: "Master's",
  phd: 'PhD',
  postdoc: 'Postdoctoral',
  fellowship: 'Fellowship',
  other: 'Other',
}

const FUNDING_LABELS: Record<string, string> = {
  all: 'All funding',
  full: 'Fully funded',
  partial: 'Partial funding',
  'tuition-only': 'Tuition only',
  'stipend-only': 'Stipend only',
  other: 'Other / check source',
}

const STATUS_LABELS: Record<string, string> = {
  all: 'All statuses',
  open: 'Open',
  draft: 'Deadline to verify',
  closed: 'Closed / archive',
}

function formatDeadline(item: Scholarship) {
  if (item.isRolling) return 'Rolling'
  if (item.status === 'draft') {
    return item.scholarshipDetails?.applicationCycle || 'Check source'
  }
  if (!item.deadline) return 'Check source'

  const date = new Date(item.deadline)
  if (Number.isNaN(date.getTime()) || date.getUTCFullYear() >= 2098) {
    return item.scholarshipDetails?.applicationCycle || 'Check source'
  }

  return date.toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function fundingLabel(item: Scholarship) {
  const type = item.scholarshipDetails?.fundingType
  if (type && FUNDING_LABELS[type]) return FUNDING_LABELS[type]
  return item.fundingText || 'Funding details on source'
}

function statusBadge(item: Scholarship) {
  if (item.status === 'open') return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  if (item.status === 'closed') return 'bg-gray-100 text-gray-600 border-gray-200'
  return 'bg-amber-50 text-amber-700 border-amber-200'
}

function verificationBadge(item: Scholarship) {
  if (item.verificationStatus === 'verified') {
    return {
      label: 'Verified source',
      className: 'bg-blue-50 text-blue-700 border-blue-200',
    }
  }
  if (item.verificationStatus === 'stale') {
    return {
      label: 'Recheck source',
      className: 'bg-orange-50 text-orange-700 border-orange-200',
    }
  }
  return {
    label: 'Source review',
    className: 'bg-violet-50 text-violet-700 border-violet-200',
  }
}

export default function ScholarshipsPage() {
  const [search, setSearch] = useState('')
  const [searchDraft, setSearchDraft] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [levelFilter, setLevelFilter] = useState('all')
  const [fundingFilter, setFundingFilter] = useState('all')
  const [nigeriaOnly, setNigeriaOnly] = useState(false)
  const [page, setPage] = useState(1)
  const [data, setData] = useState<CatalogueResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState<string[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem('afrigrant-scholarships')
      if (stored) setSaved(JSON.parse(stored) as string[])
    } catch {
      // Browser storage is optional.
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    const params = new URLSearchParams({
      page: String(page),
      limit: '24',
      status: statusFilter,
    })

    if (search) params.set('q', search)
    if (levelFilter !== 'all') params.set('level', levelFilter)
    if (fundingFilter !== 'all') params.set('funding', fundingFilter)
    if (nigeriaOnly) params.set('nigeria', 'true')

    setLoading(true)
    setError('')

    fetch('/api/scholarships/live?' + params.toString(), {
      signal: controller.signal,
      cache: 'no-store',
    })
      .then(async (response) => {
        const payload = (await response.json()) as CatalogueResponse & { error?: string }
        if (!response.ok) throw new Error(payload.error || 'Unable to load scholarships')
        return payload
      })
      .then((payload) => {
        setData(payload)
        if (payload.page > payload.pages) setPage(payload.pages)
      })
      .catch((reason: unknown) => {
        if (reason instanceof DOMException && reason.name === 'AbortError') return
        setError(reason instanceof Error ? reason.message : 'Unable to load scholarships')
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [search, statusFilter, levelFilter, fundingFilter, nigeriaOnly, page])

  const savedOnPage = useMemo(
    () => data?.items.filter((item) => saved.includes(item.id)) ?? [],
    [data?.items, saved]
  )

  function toggleSave(id: string) {
    setSaved((previous) => {
      const next = previous.includes(id)
        ? previous.filter((value) => value !== id)
        : [...previous, id]
      localStorage.setItem('afrigrant-scholarships', JSON.stringify(next))
      return next
    })
  }

  function applySearch() {
    setPage(1)
    setSearch(searchDraft.trim())
  }

  function resetFilters() {
    setSearch('')
    setSearchDraft('')
    setStatusFilter('all')
    setLevelFilter('all')
    setFundingFilter('all')
    setNigeriaOnly(false)
    setPage(1)
  }

  const stats = data?.stats
  const targetReached = Boolean(stats && stats.catalogueTotal >= (data?.target ?? 590))

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700">
            <GraduationCap className="size-4" />
            Scholarship Intelligence for Africa
          </div>

          <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Search a source-backed scholarship catalogue built for African applicants.
          </h1>

          <p className="mt-4 max-w-3xl text-lg text-gray-600">
            Browse undergraduate, master&apos;s, PhD, postdoctoral and fellowship opportunities.
            Imported listings keep their source link and review status so you can verify the final
            deadline, eligibility and benefits before applying.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Award,
                value: stats ? stats.catalogueTotal.toLocaleString() : '—',
                label: targetReached
                  ? 'Scholarships in catalogue'
                  : 'Scholarships loaded',
              },
              {
                icon: BookOpen,
                value: stats ? stats.open.toLocaleString() : '—',
                label: 'Currently marked open',
              },
              {
                icon: ShieldCheck,
                value: stats ? stats.verified.toLocaleString() : '—',
                label: 'Provider-level verified',
              },
              {
                icon: Globe,
                value: stats ? stats.nigeriaEligible.toLocaleString() : '—',
                label: 'Explicitly Nigeria eligible',
              },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{value}</div>
                    <div className="text-xs text-gray-500">{label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {data?.bootstrap && data.bootstrap.inserted > 0 && (
            <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              <CheckCircle2 className="mr-2 inline size-4" />
              Catalogue import added {data.bootstrap.inserted.toLocaleString()} source-backed
              scholarship records. Total: {data.bootstrap.after.toLocaleString()}.
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Filter className="size-4 text-blue-700" />
            Search and filter
          </div>

          <div className="grid gap-3 lg:grid-cols-6">
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <input
                value={searchDraft}
                onChange={(event) => setSearchDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') applySearch()
                }}
                placeholder="Scholarship, provider, field…"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-4 text-sm focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value)
                setPage(1)
              }}
              className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm"
            >
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>

            <select
              value={levelFilter}
              onChange={(event) => {
                setLevelFilter(event.target.value)
                setPage(1)
              }}
              className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm"
            >
              {Object.entries(LEVEL_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>

            <select
              value={fundingFilter}
              onChange={(event) => {
                setFundingFilter(event.target.value)
                setPage(1)
              }}
              className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm"
            >
              {Object.entries(FUNDING_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>

            <button
              onClick={applySearch}
              className="rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
            >
              Search
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={nigeriaOnly}
                onChange={(event) => {
                  setNigeriaOnly(event.target.checked)
                  setPage(1)
                }}
                className="size-4 rounded border-gray-300 text-blue-700"
              />
              Explicitly Nigeria-eligible only
            </label>

            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span>
                {data ? data.total.toLocaleString() : '—'} result{data?.total === 1 ? '' : 's'}
              </span>
              <button onClick={resetFilters} className="font-semibold text-blue-700 hover:underline">
                Clear filters
              </button>
            </div>
          </div>
        </div>

        {savedOnPage.length > 0 && (
          <div className="mb-7 rounded-2xl border border-rose-100 bg-rose-50 p-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-rose-700">
              <Heart className="size-4 fill-current" />
              {savedOnPage.length} saved scholarship{savedOnPage.length === 1 ? '' : 's'} on this page
            </p>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800">
            <p className="font-semibold">Scholarship catalogue could not load.</p>
            <p className="mt-1 text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white"
            >
              Retry
            </button>
          </div>
        )}

        {loading && !data ? (
          <div className="flex min-h-72 items-center justify-center rounded-3xl border border-gray-200 bg-white">
            <div className="text-center">
              <Loader2 className="mx-auto size-8 animate-spin text-blue-700" />
              <p className="mt-3 text-sm text-gray-500">Loading scholarship catalogue…</p>
            </div>
          </div>
        ) : data?.items.length === 0 ? (
          <div className="rounded-3xl border border-gray-200 bg-white py-16 text-center">
            <GraduationCap className="mx-auto mb-3 size-12 text-gray-300" />
            <p className="font-semibold text-gray-700">No scholarships match these filters.</p>
            <button onClick={resetFilters} className="mt-3 text-sm font-semibold text-blue-700 hover:underline">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data?.items.map((item) => {
              const verification = verificationBadge(item)
              const levels = item.scholarshipDetails?.levels ?? []
              const savedItem = saved.includes(item.id)

              return (
                <article
                  key={item.id}
                  className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-wrap gap-2">
                      <span className={'rounded-full border px-2.5 py-1 text-[11px] font-bold ' + statusBadge(item)}>
                        {STATUS_LABELS[item.status] ?? item.status}
                      </span>
                      <span className={'rounded-full border px-2.5 py-1 text-[11px] font-bold ' + verification.className}>
                        {verification.label}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleSave(item.id)}
                      aria-label={savedItem ? 'Remove saved scholarship' : 'Save scholarship'}
                      className="rounded-full p-2 text-gray-400 hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Heart className={'size-5 ' + (savedItem ? 'fill-rose-500 text-rose-500' : '')} />
                    </button>
                  </div>

                  <h2 className="mt-4 text-lg font-bold leading-snug text-gray-900">{item.title}</h2>
                  <p className="mt-1 text-sm font-medium text-blue-700">{item.provider}</p>
                  <p className="mt-3 line-clamp-4 text-sm leading-6 text-gray-600">{item.description}</p>

                  <dl className="mt-5 space-y-2 border-t border-gray-100 pt-4 text-sm">
                    <div className="flex justify-between gap-4">
                      <dt className="text-gray-500">Deadline</dt>
                      <dd className="text-right font-semibold text-gray-800">{formatDeadline(item)}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-gray-500">Funding</dt>
                      <dd className="text-right font-semibold text-gray-800">{fundingLabel(item)}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-gray-500">Level</dt>
                      <dd className="text-right font-semibold text-gray-800">
                        {levels.length
                          ? levels.map((level) => LEVEL_LABELS[level] ?? level).join(', ')
                          : 'Check source'}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {item.nigeriaEligible && (
                      <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                        Nigeria eligible
                      </span>
                    )}
                    {(item.scholarshipDetails?.studyCountries ?? []).slice(0, 2).map((country) => (
                      <span key={country} className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
                        {country}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto pt-5">
                    <a
                      href={item.applicationLink || item.sourceUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
                    >
                      View source &amp; apply
                      <ExternalLink className="size-4" />
                    </a>
                    <p className="mt-2 text-center text-[11px] text-gray-400">
                      Confirm deadline and eligibility on the provider page before submitting.
                    </p>
                  </div>
                </article>
              )
            })}
          </div>
        )}

        {data && data.pages > 1 && (
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => {
                setPage((value) => Math.max(1, value - 1))
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className="inline-flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 disabled:opacity-40"
            >
              <ChevronLeft className="size-4" />
              Previous
            </button>

            <span className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700">
              Page {data.page.toLocaleString()} of {data.pages.toLocaleString()}
            </span>

            <button
              type="button"
              disabled={page >= data.pages || loading}
              onClick={() => {
                setPage((value) => Math.min(data.pages, value + 1))
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className="inline-flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 disabled:opacity-40"
            >
              Next
              <ChevronRight className="size-4" />
            </button>
          </div>
        )}

        <div className="mt-10 rounded-2xl border border-blue-100 bg-blue-50 p-5 text-sm text-blue-900">
          <p className="font-semibold">How the catalogue is handled</p>
          <p className="mt-1 leading-6">
            Agent-verified entries and source-archive imports are kept distinct. Imported records
            are marked for source review rather than presented as provider-verified facts. The
            daily scholarship intelligence crawler can continue refreshing higher-confidence
            opportunities after the catalogue is populated.
          </p>
        </div>
      </div>
    </div>
  )
}
