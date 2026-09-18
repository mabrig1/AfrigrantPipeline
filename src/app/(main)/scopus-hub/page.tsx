'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  Loader2,
  ShieldCheck,
} from 'lucide-react'

type Assessment = {
  score: number
  label: string
  priorityActions: string[]
  notice: string
  checks: Array<{
    id: string
    label: string
    complete: boolean
    evidence: string
    action: string
  }>
}

type Result = {
  assessment: Assessment
  officialLinks: Array<{ label: string; url: string }>
}

const checks = [
  ['hasScopusProfile', 'Scopus Author Profile exists'],
  ['profileHasCorrectName', 'Preferred author name is correct'],
  ['profileHasCorrectAffiliation', 'Primary affiliation is correct'],
  ['duplicateProfilesResolved', 'Duplicate profiles are resolved'],
  ['missingIndexedDocumentsResolved', 'Missing indexed documents reviewed'],
  ['orcidConnected', 'ORCID identity is aligned'],
  ['targetJournalCurrentlyCovered', 'Target journal is currently Scopus-covered'],
  ['targetJournalScopeFit', 'Manuscript fits the journal scope'],
  ['manuscriptHasEnglishTitleAbstract', 'English title and abstract are publication-ready'],
  ['ethicsAndResearchIntegrityReady', 'Ethics, disclosures and citation integrity are ready'],
] as const

export default function ScopusHubPage() {
  const [form, setForm] = useState<Record<string, boolean>>(
    Object.fromEntries(checks.map(([key]) => [key, false]))
  )
  const [result, setResult] = useState<Result | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/scopus-hub/assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data?.error || 'Scopus assessment failed.')
      setResult(data as Result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Scopus assessment failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-1.5 text-sm font-semibold text-violet-700">
            <GraduationCap className="size-4" />
            Scholar Scopus Hub
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
            Repair researcher visibility before chasing another journal.
          </h1>
          <p className="mt-4 max-w-3xl text-slate-600">
            Audit Scopus profile accuracy, duplicate records, missing documents, ORCID alignment,
            target-source coverage, scope fit and manuscript integrity.
          </p>
          <Link href="/research-os" className="mt-4 inline-block text-sm font-medium text-blue-700 hover:underline">
            ← Research OS
          </Link>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[420px_minmax(0,1fr)]">
        <form onSubmit={submit} className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-950">Researcher & publication readiness</h2>
          <p className="mt-1 text-sm text-slate-500">
            Check each item that has been independently confirmed.
          </p>
          <div className="mt-5 space-y-3">
            {checks.map(([key, label]) => (
              <label
                key={key}
                className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700"
              >
                <input
                  type="checkbox"
                  checked={Boolean(form[key])}
                  onChange={(e) =>
                    setForm((current) => ({ ...current, [key]: e.target.checked }))
                  }
                  className="mt-0.5 size-4 accent-violet-700"
                />
                {label}
              </label>
            ))}

            {error && (
              <div className="flex gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                {error}
              </div>
            )}

            <button
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-700 px-4 py-3 text-sm font-semibold text-white hover:bg-violet-800 disabled:opacity-60"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}
              Assess Scopus Readiness
            </button>
          </div>
        </form>

        <section>
          {!result ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10">
              <GraduationCap className="size-12 text-violet-700" />
              <h2 className="mt-4 text-2xl font-semibold text-slate-950">
                Scopus profile accuracy is part of grant readiness.
              </h2>
              <p className="mt-2 max-w-2xl text-slate-600">
                Fragmented author profiles, wrong affiliations and missing indexed documents can
                weaken how a researcher presents their output in funding and promotion contexts.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-[180px_minmax(0,1fr)]">
                <div className="rounded-3xl bg-slate-950 p-6 text-white">
                  <p className="text-xs uppercase tracking-widest text-slate-400">Readiness</p>
                  <p className="mt-2 text-5xl font-bold">{result.assessment.score}</p>
                  <p className="text-sm text-slate-400">out of 100</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-6">
                  <h2 className="font-semibold text-slate-950">{result.assessment.label}</h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {result.assessment.priorityActions.map((action) => (
                      <span key={action} className="rounded-full bg-amber-50 px-3 py-1 text-xs text-amber-900">
                        {action}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6">
                <h2 className="text-xl font-semibold text-slate-950">Scopus repair pathway</h2>
                <div className="mt-5 space-y-4">
                  {result.assessment.checks.map((check) => (
                    <div key={check.id} className="rounded-2xl border border-slate-200 p-4">
                      <div className="flex items-start gap-3">
                        {check.complete ? (
                          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />
                        ) : (
                          <AlertCircle className="mt-0.5 size-5 shrink-0 text-amber-600" />
                        )}
                        <div>
                          <h3 className="font-semibold text-slate-900">{check.label}</h3>
                          <p className="mt-1 text-sm text-slate-600">{check.evidence}</p>
                          {!check.complete && (
                            <p className="mt-2 text-sm font-medium text-violet-700">{check.action}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-violet-200 bg-violet-50 p-6">
                <h2 className="font-semibold text-slate-950">Official Scopus actions</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {result.officialLinks.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-sm font-medium text-violet-700 shadow-sm"
                    >
                      {link.label}
                      <ExternalLink className="size-3.5" />
                    </a>
                  ))}
                </div>
                <p className="mt-4 text-xs leading-relaxed text-slate-600">{result.assessment.notice}</p>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
