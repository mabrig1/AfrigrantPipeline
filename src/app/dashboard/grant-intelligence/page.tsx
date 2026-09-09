'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  Clock3,
  Database,
  ExternalLink,
  Loader2,
  Radar,
  RefreshCw,
  SearchCheck,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

interface GrantItem {
  _id: string
  title: string
  funder: string
  fundingText?: string
  amount: number
  currency: string
  deadline: string
  isRolling?: boolean
  applicationLink?: string
  sourceName?: string
  sourceUrl?: string
  verificationStatus?: string
  confidenceScore?: number
  relevanceScore?: number
  nigeriaEligible?: boolean
  lastCheckedAt?: string
}

interface IntelligenceResponse {
  latestRun?: {
    status?: string
    startedAt?: string
    completedAt?: string
    sourcesChecked?: number
    candidatesFound?: number
    created?: number
    updated?: number
    skipped?: number
    errors?: string[]
  } | null
  stats: {
    totalAgentGrants: number
    verified: number
    needsReview: number
    nigeriaEligible: number
    stale: number
  }
  configuration: {
    aiConfigured: boolean
    webSearchConfigured: boolean
    cronConfigured: boolean
  }
  sources: Array<{ name: string; url: string }>
  latestGrants: GrantItem[]
}

function formatDate(value?: string, rolling?: boolean) {
  if (rolling) return 'Rolling'
  if (!value) return 'Not stated'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Not stated'
  return new Intl.DateTimeFormat('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

function formatFunding(grant: GrantItem) {
  if (grant.fundingText?.trim()) return grant.fundingText
  if (!grant.amount) return 'Funding amount not stated'
  try {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: grant.currency || 'USD',
      maximumFractionDigits: 0,
    }).format(grant.amount)
  } catch {
    return `${grant.currency || 'USD'} ${grant.amount.toLocaleString()}`
  }
}

export default function GrantIntelligencePage() {
  const { data: session } = useSession()
  const [data, setData] = useState<IntelligenceResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const load = useCallback(async () => {
    try {
      setError('')
      const response = await fetch('/api/agentic/grants/sync', { cache: 'no-store' })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || 'Failed to load grant intelligence')
      setData(payload)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load grant intelligence')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  async function runSync() {
    setSyncing(true)
    setError('')
    setNotice('')
    try {
      const response = await fetch('/api/agentic/grants/sync', { method: 'POST' })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.errors?.[0] || payload.error || 'Grant sync failed')
      setNotice(
        `Sync complete: ${payload.created ?? 0} new, ${payload.updated ?? 0} refreshed, ${payload.skipped ?? 0} skipped.`,
      )
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Grant sync failed')
    } finally {
      setSyncing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-gold" />
      </div>
    )
  }

  const isAdmin = session?.user?.role === 'admin'
  const stats = data?.stats ?? {
    totalAgentGrants: 0,
    verified: 0,
    needsReview: 0,
    nigeriaEligible: 0,
    stale: 0,
  }

  const capabilities = [
    {
      icon: Radar,
      title: 'Discover',
      text: 'Scans trusted funder pages and, when Tavily is configured, searches the wider web for new calls.',
    },
    {
      icon: SearchCheck,
      title: 'Verify',
      text: 'Rejects expired calls, requires a usable application link and records confidence, source and last-checked time.',
    },
    {
      icon: Sparkles,
      title: 'Score',
      text: 'Ranks opportunities for Nigerian and African academics, with special attention to governance and public policy.',
    },
    {
      icon: Database,
      title: 'Deduplicate',
      text: 'Fingerprints title, funder and application URL so the pipeline refreshes existing grants instead of multiplying copies.',
    },
    {
      icon: RefreshCw,
      title: 'Refresh',
      text: 'Daily cron support closes expired opportunities and refreshes the intelligence feed without manual data entry.',
    },
  ]

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-2xl border border-gold/20 bg-gradient-to-br from-gold/10 via-card to-card p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
              <Bot className="size-3.5" />
              Agentic updating system
            </div>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Agentic Grant <span className="text-gold">Intelligence</span>
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Funding discovery for Nigerian lecturers, postgraduate students and independent researchers. The agent discovers calls, checks deadlines,
              flags possible Nigeria eligibility, records source provenance and keeps the grant database current.
            </p>
          </div>

          {isAdmin && (
            <button
              type="button"
              onClick={runSync}
              disabled={syncing || !data?.configuration.aiConfigured}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold px-5 py-3 text-sm font-bold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {syncing ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
              {syncing ? 'Scanning funders…' : 'Run intelligence scan'}
            </button>
          )}
        </div>
      </section>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {notice && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {[
          ['Agent-tracked', stats.totalAgentGrants],
          ['Reviewed', stats.verified],
          ['Nigeria eligible', stats.nigeriaEligible],
          ['Needs review', stats.needsReview],
          ['Stale >14 days', stats.stale],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-xl border border-border bg-card p-4">
            <div className="text-2xl font-black">{value}</div>
            <div className="mt-1 text-xs font-medium text-muted-foreground">{label}</div>
          </div>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-bold">System readiness</h2>
              <p className="mt-1 text-xs text-muted-foreground">Secrets are never exposed; only configuration state is shown.</p>
            </div>
            <ShieldCheck className="size-5 text-gold" />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ['AI extraction', data?.configuration.aiConfigured, 'OpenRouter or Anthropic'],
              ['Web discovery', data?.configuration.webSearchConfigured, 'Tavily optional'],
              ['Daily automation', data?.configuration.cronConfigured, 'Vercel cron'],
            ].map(([label, ready, detail]) => (
              <div key={String(label)} className="rounded-xl border border-border/70 bg-background/40 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <span className={`size-2 rounded-full ${ready ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                  {label}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{detail}</div>
              </div>
            ))}
          </div>
          {!data?.configuration.aiConfigured && isAdmin && (
            <p className="mt-4 text-xs text-amber-300">
              Add OPENROUTER_API_KEY or ANTHROPIC_API_KEY before the first scan. Tavily is optional but improves discovery breadth.
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2">
            <Clock3 className="size-4 text-gold" />
            <h2 className="font-bold">Latest run</h2>
          </div>
          {data?.latestRun ? (
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between gap-3"><span className="text-muted-foreground">Status</span><span className="font-semibold capitalize">{data.latestRun.status}</span></div>
              <div className="flex justify-between gap-3"><span className="text-muted-foreground">Sources checked</span><span>{data.latestRun.sourcesChecked ?? 0}</span></div>
              <div className="flex justify-between gap-3"><span className="text-muted-foreground">Candidates</span><span>{data.latestRun.candidatesFound ?? 0}</span></div>
              <div className="flex justify-between gap-3"><span className="text-muted-foreground">New / refreshed</span><span>{data.latestRun.created ?? 0} / {data.latestRun.updated ?? 0}</span></div>
              <div className="pt-2 text-xs text-muted-foreground">{formatDate(data.latestRun.completedAt || data.latestRun.startedAt)}</div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">No intelligence run has completed yet.</p>
          )}
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold">How the agent works</h2>
          <p className="mt-1 text-sm text-muted-foreground">Designed to reduce stale links, duplicate calls and ineligible recommendations.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {capabilities.map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-xl border border-border bg-card p-4">
              <div className="mb-3 flex size-9 items-center justify-center rounded-lg bg-gold/10 text-gold">
                <Icon className="size-4" />
              </div>
              <h3 className="font-bold">{title}</h3>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="rounded-2xl border border-border bg-card">
          <div className="border-b border-border p-5">
            <h2 className="text-lg font-bold">High-priority live intelligence</h2>
            <p className="mt-1 text-xs text-muted-foreground">Ranked by relevance to Nigerian academics, then deadline.</p>
          </div>
          <div className="divide-y divide-border">
            {(data?.latestGrants ?? []).length === 0 ? (
              <div className="p-6 text-sm text-muted-foreground">Run the first intelligence scan to populate this feed.</div>
            ) : (
              data?.latestGrants.map((grant) => (
                <article key={grant._id} className="p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        {grant.nigeriaEligible && (
                          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-300">Nigeria eligible</span>
                        )}
                        <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${grant.verificationStatus === 'verified' ? 'bg-blue-500/10 text-blue-300' : 'bg-amber-500/10 text-amber-300'}`}>
                          {grant.verificationStatus === 'verified' ? 'Reviewed' : 'Needs review'}
                        </span>
                        <span className="rounded-full bg-gold/10 px-2 py-0.5 text-[11px] font-semibold text-gold">
                          Relevance {Math.round(grant.relevanceScore ?? 0)}/100
                        </span>
                      </div>
                      <h3 className="font-bold leading-snug">{grant.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{grant.funder}</p>
                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span>{formatFunding(grant)}</span>
                        <span>Deadline: {formatDate(grant.deadline, grant.isRolling)}</span>
                        <span>Confidence: {Math.round((grant.confidenceScore ?? 0) * 100)}%</span>
                      </div>
                    </div>
                    {grant.applicationLink && (
                      <a
                        href={grant.applicationLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-gold hover:underline"
                      >
                        Open call <ExternalLink className="size-3" />
                      </a>
                    )}
                  </div>
                </article>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="font-bold">Trusted discovery sources</h2>
          <p className="mt-1 text-xs text-muted-foreground">Curated sources are scanned even when external web search is disabled.</p>
          <div className="mt-4 space-y-2">
            {(data?.sources ?? []).map((source) => (
              <a
                key={source.url}
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-3 rounded-lg border border-border/70 px-3 py-2 text-sm transition hover:border-gold/30 hover:bg-gold/5"
              >
                <span className="truncate">{source.name}</span>
                <ExternalLink className="size-3.5 shrink-0 text-muted-foreground" />
              </a>
            ))}
          </div>
          <p className="mt-4 text-[11px] leading-5 text-muted-foreground">
            “Reviewed” means the source and extracted fields passed automated confidence checks. Applicants should still read the official call before submission.
          </p>
        </div>
      </section>
    </div>
  )
}
