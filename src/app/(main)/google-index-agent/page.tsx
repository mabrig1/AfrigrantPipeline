'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import {
  AlertCircle,
  CheckCircle2,
  Code2,
  ExternalLink,
  Loader2,
  SearchCheck,
  ShieldCheck,
} from 'lucide-react'

type Result = {
  mission: {
    readiness: {
      score: number
      label: string
      priorityActions: string[]
      notice: string
    }
    stages: Array<{
      id: string
      title: string
      status: 'done' | 'current' | 'blocked' | 'pending'
      summary: string
      actions: string[]
      blockers: string[]
    }>
    progress: number
    nextAction: string
    highwireMetaTags: string
    jsonLd: string
    verificationLinks: Array<{ label: string; url: string }>
    policyNotice: string
  }
}

const checkboxFields = [
  ['institutionalEmailVerified', 'Institutional email verified'],
  ['publicScholarProfile', 'Public Google Scholar profile'],
  ['rightsConfirmed', 'Rights-safe public version confirmed'],
  ['publicLandingPage', 'Dedicated public article landing page'],
  ['freeAbstractVisible', 'Complete abstract visible without login'],
  ['searchablePdf', 'Text-searchable PDF'],
  ['oneArticlePerUrl', 'One article per URL'],
  ['scholarMetaTags', 'Scholar/Highwire meta tags already present'],
  ['robotsAllowed', 'Googlebot allowed to crawl'],
  ['titleAndAuthorsVisible', 'Title and authors clearly visible'],
  ['referencesPresent', 'References/Bibliography section present'],
  ['canonicalUrl', 'Canonical URL present'],
  ['sitemapIncluded', 'Article URL included in XML sitemap'],
  ['linkedFromAuthorPage', 'Linked from author/repository/publications page'],
  ['googleSearchVisible', 'Already visible in ordinary Google Search'],
  ['googleScholarVisible', 'Already visible in Google Scholar'],
] as const

export default function GoogleIndexAgentPage() {
  const [form, setForm] = useState<Record<string, string | boolean>>({
    fullName: '',
    institution: '',
    institutionalEmailVerified: false,
    publicScholarProfile: false,
    orcid: '',
    title: '',
    authorsText: '',
    year: '',
    journal: '',
    doi: '',
    abstract: '',
    articleUrl: '',
    pdfUrl: '',
    rightsConfirmed: false,
    publicLandingPage: false,
    freeAbstractVisible: false,
    searchablePdf: false,
    oneArticlePerUrl: false,
    scholarMetaTags: false,
    robotsAllowed: false,
    titleAndAuthorsVisible: false,
    referencesPresent: false,
    canonicalUrl: false,
    sitemapIncluded: false,
    linkedFromAuthorPage: false,
    googleSearchVisible: false,
    googleScholarVisible: false,
  })
  const [result, setResult] = useState<Result | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function setValue(key: string, value: string | boolean) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/google-index-agent/assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          authors: String(form.authorsText || '')
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean),
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data?.error || 'Indexing assessment failed.')
      setResult(data as Result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Indexing assessment failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700">
            <SearchCheck className="size-4" />
            Google Index Agentic Engine
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
            Make legitimate scholarly pages easier to discover.
          </h1>
          <p className="mt-4 max-w-3xl text-slate-600">
            Audit Google Scholar compatibility, crawl paths, metadata, article structure and
            verification progress. The engine generates Highwire tags, JSON-LD and a repair mission.
          </p>
          <Link href="/research-os" className="mt-4 inline-block text-sm font-medium text-blue-700 hover:underline">
            ← Research OS
          </Link>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[430px_minmax(0,1fr)]">
        <form onSubmit={submit} className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-950">Article & researcher record</h2>
          <div className="mt-5 space-y-3">
            {[
              ['fullName', 'Researcher name'],
              ['institution', 'Institution'],
              ['orcid', 'ORCID'],
              ['title', 'Article title'],
              ['authorsText', 'Authors — comma separated'],
              ['year', 'Publication year'],
              ['journal', 'Journal / repository'],
              ['doi', 'DOI'],
              ['articleUrl', 'Article landing-page URL'],
              ['pdfUrl', 'PDF URL'],
            ].map(([key, label]) => (
              <label key={key} className="block">
                <span className="mb-1 block text-xs font-semibold text-slate-600">{label}</span>
                <input
                  value={String(form[key] || '')}
                  onChange={(e) => setValue(key, e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </label>
            ))}
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-slate-600">Abstract</span>
              <textarea
                rows={5}
                value={String(form.abstract || '')}
                onChange={(e) => setValue('abstract', e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="mb-3 text-sm font-semibold text-slate-800">Technical checklist</p>
              <div className="space-y-2.5">
                {checkboxFields.map(([key, label]) => (
                  <label key={key} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={Boolean(form[key])}
                      onChange={(e) => setValue(key, e.target.checked)}
                      className="mt-0.5 size-4 accent-blue-700"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            {error && (
              <div className="flex gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                {error}
              </div>
            )}

            <button
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : <SearchCheck className="size-4" />}
              Run Indexing Mission
            </button>
          </div>
        </form>

        <section>
          {!result ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10">
              <ShieldCheck className="size-12 text-blue-700" />
              <h2 className="mt-4 text-2xl font-semibold text-slate-950">No fake instant-index promise.</h2>
              <p className="mt-2 max-w-2xl text-slate-600">
                The engine improves the conditions Google Scholar actually needs: stable scholarly pages,
                visible abstracts, parser-friendly metadata, crawl access, sitemaps and verification.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-[180px_minmax(0,1fr)]">
                <div className="rounded-3xl bg-slate-950 p-6 text-white">
                  <p className="text-xs uppercase tracking-widest text-slate-400">Readiness</p>
                  <p className="mt-2 text-5xl font-bold">{result.mission.readiness.score}</p>
                  <p className="text-sm text-slate-400">out of 100</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-6">
                  <h2 className="font-semibold text-slate-950">{result.mission.readiness.label}</h2>
                  <p className="mt-2 text-sm text-slate-600">{result.mission.nextAction}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {result.mission.readiness.priorityActions.map((action) => (
                      <span key={action} className="rounded-full bg-amber-50 px-3 py-1 text-xs text-amber-900">
                        {action}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6">
                <h2 className="text-xl font-semibold text-slate-950">Agentic indexing mission</h2>
                <div className="mt-5 space-y-4">
                  {result.mission.stages.map((stage) => (
                    <div key={stage.id} className="rounded-2xl border border-slate-200 p-4">
                      <div className="flex items-start gap-3">
                        {stage.status === 'done' ? (
                          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />
                        ) : (
                          <AlertCircle className="mt-0.5 size-5 shrink-0 text-amber-600" />
                        )}
                        <div>
                          <h3 className="font-semibold text-slate-900">{stage.title}</h3>
                          <p className="mt-1 text-sm text-slate-600">{stage.summary}</p>
                          {stage.blockers.length > 0 && (
                            <p className="mt-2 text-sm text-amber-800">{stage.blockers[0]}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-5 xl:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-white p-6">
                  <div className="mb-3 flex items-center gap-2">
                    <Code2 className="size-5 text-blue-700" />
                    <h2 className="font-semibold text-slate-950">Highwire metadata</h2>
                  </div>
                  <pre className="max-h-80 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">
                    {result.mission.highwireMetaTags || 'Complete the article record to generate tags.'}
                  </pre>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-6">
                  <div className="mb-3 flex items-center gap-2">
                    <Code2 className="size-5 text-violet-700" />
                    <h2 className="font-semibold text-slate-950">ScholarlyArticle JSON-LD</h2>
                  </div>
                  <pre className="max-h-80 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">
                    {result.mission.jsonLd}
                  </pre>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6">
                <h2 className="font-semibold text-slate-950">Verification links</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {result.mission.verificationLinks.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50"
                    >
                      {link.label}
                      <ExternalLink className="size-3.5" />
                    </a>
                  ))}
                </div>
                <p className="mt-4 text-xs leading-relaxed text-slate-500">{result.mission.policyNotice}</p>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
