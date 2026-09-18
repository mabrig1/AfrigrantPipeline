'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import {
  AlertCircle,
  BookOpenCheck,
  DatabaseZap,
  ExternalLink,
  Loader2,
  Network,
  ShieldCheck,
} from 'lucide-react'

type Source = {
  id: string
  provider: string
  title: string
  authors: string[]
  year?: number
  venue?: string
  doi?: string
  url: string
  citedBy?: number
  openAccess?: boolean
  excerpt?: string
}

type Result = {
  requestId: string
  knowledge: {
    coverage: 'strong' | 'moderate' | 'limited' | 'none'
    retrievedAt: string
    providers: Array<{ provider: string; status: string; count: number }>
    sources: Source[]
    sourceLedger: string
  }
  workflow: Array<{
    id: string
    agent: string
    task: string
    evidence: string
  }>
  citationAudit: null | {
    status: 'pass' | 'warning' | 'fail'
    integrityScore: number
    validMarkers: number[]
    invalidMarkers: number[]
    issues: Array<{ severity: string; code: string; message: string }>
  }
  notice: string
}

export default function KnowledgeForgePage() {
  const [query, setQuery] = useState('')
  const [draft, setDraft] = useState('')
  const [result, setResult] = useState<Result | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/knowledgeforge/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, draft }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data?.error || 'Research retrieval failed.')
      setResult(data as Result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Research retrieval failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-semibold text-emerald-700">
            <DatabaseZap className="size-4" />
            KnowledgeForge Research Engine
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
            Retrieve evidence before generating conclusions.
          </h1>
          <p className="mt-4 max-w-3xl text-slate-600">
            Search OpenAlex, Crossref and PubMed where relevant, deduplicate records, build a
            traceable source ledger and audit [S#] citation markers before research output is used.
          </p>
          <Link href="/research-os" className="mt-4 inline-block text-sm font-medium text-blue-700 hover:underline">
            ← Research OS
          </Link>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[420px_minmax(0,1fr)]">
        <form onSubmit={submit} className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-950">Deep scholarly retrieval</h2>
          <label className="mt-5 block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Research question / topic</span>
            <textarea
              required
              minLength={3}
              maxLength={600}
              rows={5}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. local government financial autonomy and SDG implementation in Nigeria"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            />
          </label>

          <label className="mt-4 block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              Optional draft with [S#] markers
            </span>
            <textarea
              rows={7}
              maxLength={12000}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Example: Local fiscal autonomy is associated with stronger implementation capacity [S1]."
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            />
          </label>

          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            The citation audit checks whether the [S#] markers actually exist in the retrieved ledger.
            It does not replace full-text reading.
          </p>

          {error && (
            <div className="mt-4 flex gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              {error}
            </div>
          )}

          <button
            disabled={loading}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : <BookOpenCheck className="size-4" />}
            Retrieve Evidence
          </button>
        </form>

        <section>
          {!result ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10">
              <Network className="size-12 text-emerald-700" />
              <h2 className="mt-4 text-2xl font-semibold text-slate-950">
                One query, multiple scholarly providers.
              </h2>
              <p className="mt-2 max-w-2xl text-slate-600">
                KnowledgeForge merges duplicate DOI/title records and ranks the strongest traceable
                sources before you start synthesis, proposal writing or literature review.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl bg-slate-950 p-5 text-white">
                  <p className="text-xs uppercase tracking-widest text-slate-400">Coverage</p>
                  <p className="mt-2 text-2xl font-bold capitalize">{result.knowledge.coverage}</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-5">
                  <p className="text-xs uppercase tracking-widest text-slate-400">Sources</p>
                  <p className="mt-2 text-2xl font-bold text-slate-950">{result.knowledge.sources.length}</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-5">
                  <p className="text-xs uppercase tracking-widest text-slate-400">Request</p>
                  <p className="mt-2 truncate text-sm font-semibold text-slate-700">{result.requestId}</p>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6">
                <h2 className="text-xl font-semibold text-slate-950">Source ledger</h2>
                <div className="mt-5 space-y-4">
                  {result.knowledge.sources.map((source, index) => (
                    <article key={source.id} className="rounded-2xl border border-slate-200 p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="mb-2 flex flex-wrap gap-2">
                            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                              S{index + 1}
                            </span>
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                              {source.provider}
                            </span>
                            {source.openAccess && (
                              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                                Open access
                              </span>
                            )}
                          </div>
                          <h3 className="font-semibold text-slate-950">{source.title}</h3>
                          <p className="mt-1 text-sm text-slate-600">
                            {source.authors.slice(0, 4).join(', ')}
                            {source.year ? ' · ' + source.year : ''}
                            {source.venue ? ' · ' + source.venue : ''}
                          </p>
                          {typeof source.citedBy === 'number' && (
                            <p className="mt-1 text-xs text-slate-500">
                              Cited-by metadata: {source.citedBy}
                            </p>
                          )}
                        </div>
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-blue-700 hover:underline"
                        >
                          Open record
                          <ExternalLink className="size-3.5" />
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6">
                <h2 className="text-xl font-semibold text-slate-950">Agent workflow</h2>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {result.workflow.map((step) => (
                    <div key={step.id} className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-sm font-semibold text-slate-950">{step.agent}</p>
                      <p className="mt-1 text-sm text-slate-600">{step.task}</p>
                      <span className="mt-2 inline-flex rounded-full bg-white px-2.5 py-1 text-xs text-slate-500">
                        {step.evidence}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {result.citationAudit && (
                <div className="rounded-3xl border border-slate-200 bg-white p-6">
                  <div className="flex items-start gap-3">
                    <ShieldCheck
                      className={
                        result.citationAudit.status === 'fail'
                          ? 'mt-0.5 size-5 text-red-600'
                          : result.citationAudit.status === 'warning'
                            ? 'mt-0.5 size-5 text-amber-600'
                            : 'mt-0.5 size-5 text-emerald-600'
                      }
                    />
                    <div>
                      <h2 className="font-semibold text-slate-950">
                        Citation integrity: {result.citationAudit.integrityScore}/100
                      </h2>
                      <p className="mt-1 text-sm capitalize text-slate-600">
                        Status: {result.citationAudit.status}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    {result.citationAudit.issues.map((issue) => (
                      <div key={issue.code + issue.message} className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
                        <strong>{issue.code}:</strong> {issue.message}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-xs leading-relaxed text-slate-500">{result.notice}</p>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
