'use client'

import { useState, useEffect, useTransition, useRef } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Search, ExternalLink, Bell, Globe, X } from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────

interface Grant {
  _id: string
  title: string
  description: string
  funder: string
  amount: number
  currency: string
  deadline: string
  status: string
  grantType: string
  eligibility: string[]
  categories: string[]
  countries: string[]
  region?: string
  applicationLink?: string
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatAmount(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount)
  } catch {
    return `${currency} ${amount.toLocaleString()}`
  }
}

function deadlineStatus(deadline: string): { label: string; cls: string } {
  const d = new Date(deadline)
  const now = new Date()
  const diff = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  if (diff < 0) return { label: 'Closed', cls: 'bg-red-100 text-red-800' }
  if (diff <= 14) return { label: 'Closing soon', cls: 'bg-yellow-100 text-yellow-800' }
  return { label: 'Open Now', cls: 'bg-green-100 text-green-800' }
}

function formatDeadline(deadline: string) {
  return new Date(deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

const TYPE_LABELS: Record<string, string> = {
  research: 'Research', scholarship: 'Scholarship', fellowship: 'Fellowship',
  project: 'Project', seed: 'Seed', other: 'Other',
}

const CATEGORIES = [
  { value: '', label: 'All' },
  { value: 'research', label: 'Research' },
  { value: 'scholarship', label: 'Scholarship' },
  { value: 'fellowship', label: 'Fellowship' },
  { value: 'project', label: 'Project' },
  { value: 'seed', label: 'Seed' },
]

// ── Subscription Modal ────────────────────────────────────────────────────────

function SubscriptionModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white">
        <div className="px-6 pb-6 pt-6">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Subscribe for Grant Updates</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="size-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-gray-200 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-gray-900">Quarterly Subscription</p>
                  <p className="mt-0.5 text-sm text-gray-500">Updated grant lists + application templates</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">₦12,000</p>
                  <p className="text-xs text-gray-500">per quarter</p>
                </div>
              </div>
            </div>

            <a
              href="https://store.mabrigkorie.org"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center rounded-2xl bg-blue-700 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800"
            >
              Subscribe Now
            </a>
            <p className="text-center text-xs text-gray-500">Cancel anytime · Full access to updated lists</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Grant Card ─────────────────────────────────────────────────────────────────

function GrantCard({ grant }: { grant: Grant }) {
  const status = deadlineStatus(grant.deadline)
  return (
    <div className="flex flex-col rounded-3xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="mb-4 flex items-start justify-between">
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${status.cls}`}>{status.label}</span>
        <span className="rounded-xl bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
          {TYPE_LABELS[grant.grantType] ?? grant.grantType}
        </span>
      </div>

      <h3 className="mb-3 text-base font-semibold leading-snug text-gray-900 line-clamp-2">{grant.title}</h3>

      <div className="mb-4 flex-1 space-y-1 text-sm text-gray-600">
        <p><span className="font-medium">Funder:</span> {grant.funder}</p>
        <p><span className="font-medium">Amount:</span> {formatAmount(grant.amount, grant.currency)}</p>
        <p><span className="font-medium">Deadline:</span> {formatDeadline(grant.deadline)}</p>
        {grant.region && <p><span className="font-medium">Region:</span> {grant.region}</p>}
        <p className="mt-2 text-xs leading-relaxed text-gray-500 line-clamp-2">{grant.description}</p>
      </div>

      {grant.categories.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-1.5">
          {grant.categories.slice(0, 3).map((c) => (
            <span key={c} className="rounded-lg bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700">{c}</span>
          ))}
        </div>
      )}

      <div className="mt-auto border-t border-gray-100 pt-4">
        {grant.applicationLink ? (
          <a
            href={grant.applicationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-black"
          >
            View Details <ExternalLink className="size-3" />
          </a>
        ) : (
          <span className="flex w-full items-center justify-center rounded-2xl bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-400">
            No link available
          </span>
        )}
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function GrantsPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const [grants, setGrants] = useState<Grant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)

  const currentType = searchParams.get('grantType') ?? ''
  const currentSearch = searchParams.get('search') ?? ''
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    params.set('status', 'open')
    if (currentType) params.set('grantType', currentType)
    if (currentSearch) params.set('search', currentSearch)
    params.set('limit', '50')

    fetch(`/api/grants/list?${params.toString()}`)
      .then((r) => r.json())
      .then((json: { data?: Grant[]; error?: string }) => {
        setGrants(json.data ?? [])
        if (json.error) setError(json.error)
      })
      .catch(() => setError('Failed to load grants'))
      .finally(() => setLoading(false))
  }, [currentType, currentSearch])

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    params.delete('page')
    startTransition(() => router.push(`${pathname}?${params.toString()}`))
  }

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => setParam('search', val), 400)
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-12">
        <div className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700">
            <Globe className="size-4" />
            <span>Updated {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
          </div>

          <h1 className="text-5xl font-semibold leading-none tracking-tight text-gray-900">
            2026 Grant Opportunities<br />
            <span className="text-blue-700">for Africa</span>
          </h1>

          <p className="mt-4 max-w-lg text-xl text-gray-600">
            Curated research grants, fellowships & funding opportunities for academics, independent researchers, NGOs & practitioners.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => document.getElementById('grants-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="rounded-full bg-blue-700 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800"
            >
              Browse All Grants
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-6 py-3.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100"
            >
              <Bell className="size-4" /> Get Monthly Updates
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mx-auto max-w-7xl px-6 pb-6">
        <div className="rounded-3xl border border-gray-200 bg-white p-5">
          <div className="flex flex-col items-center gap-4 lg:flex-row">
            <div className="relative w-full flex-1">
              <Search className="absolute left-4 top-3.5 size-4 text-gray-400" />
              <input
                type="text"
                defaultValue={currentSearch}
                onChange={handleSearch}
                placeholder="Search grants by name, focus or discipline..."
                className="w-full rounded-2xl border border-gray-200 py-3 pl-11 pr-4 text-sm focus:border-blue-400 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setParam('grantType', value)}
                  className={`rounded-2xl px-4 py-2 text-sm font-medium transition-colors ${
                    currentType === value
                      ? 'bg-blue-700 text-white'
                      : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grants Grid */}
      <div id="grants-section" className="mx-auto max-w-7xl px-6 pb-16">
        {loading ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-72 animate-pulse rounded-3xl bg-white border border-gray-200" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error}</div>
        ) : grants.length === 0 ? (
          <div className="py-16 text-center">
            <Search className="mx-auto mb-3 size-10 text-gray-300" />
            <p className="font-medium text-gray-600">No grants found matching your search.</p>
            <p className="mt-1 text-sm text-gray-400">Try adjusting your filters.</p>
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-gray-500">{grants.length} grant{grants.length !== 1 ? 's' : ''} found</p>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {grants.map((grant) => <GrantCard key={grant._id} grant={grant} />)}
            </div>
          </>
        )}
      </div>

      {/* Subscription CTA */}
      <div className="bg-blue-700 py-12">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-white">Want fresh grants every month?</h2>
          <p className="mx-auto mt-3 max-w-md text-blue-100">
            Subscribe to get updated grant lists + deadline reminders delivered to your inbox.
          </p>
          <div className="mt-6">
            <button
              onClick={() => setShowModal(true)}
              className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-blue-700 transition-colors hover:bg-gray-100"
            >
              Start Quarterly Subscription — ₦12,000
            </button>
          </div>
          <p className="mt-3 text-sm text-blue-200">Cancel anytime · Quarterly updates · Application templates included</p>
        </div>
      </div>

      {showModal && <SubscriptionModal onClose={() => setShowModal(false)} />}
    </div>
  )
}
