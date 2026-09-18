'use client'

import type { FormEvent } from 'react'
import { useState } from 'react'
import Link from 'next/link'
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  FileCheck2,
  GraduationCap,
  Loader2,
  SearchCheck,
  Sparkles,
  Target,
} from 'lucide-react'
import type {
  ScholarshipApplicantProfile,
  ScholarshipMatch,
  ScholarshipReadiness,
  ScholarshipLevel,
} from '@/lib/scholarships/matcher'

interface MatchResponse {
  generatedAt: string
  readiness: ScholarshipReadiness
  matches: ScholarshipMatch[]
  disclaimer: string
}

const initialProfile: ScholarshipApplicantProfile = {
  nationality: 'Nigeria',
  targetLevel: 'masters',
  field: '',
  workExperienceYears: 0,
  needsFullFunding: true,
  hasCv: false,
  hasTranscript: false,
  hasStatement: false,
  hasReferences: false,
  hasEnglishProof: false,
}

const documentChecks: Array<{
  key: keyof Pick<
    ScholarshipApplicantProfile,
    'hasCv' | 'hasTranscript' | 'hasStatement' | 'hasReferences' | 'hasEnglishProof'
  >
  label: string
}> = [
  { key: 'hasCv', label: 'Academic CV ready' },
  { key: 'hasTranscript', label: 'Transcript/result ready' },
  { key: 'hasStatement', label: 'Statement of purpose ready' },
  { key: 'hasReferences', label: 'Referees/reference letters ready' },
  { key: 'hasEnglishProof', label: 'English-language evidence ready' },
]

function scoreClass(score: number) {
  if (score >= 75) return 'bg-emerald-100 text-emerald-800'
  if (score >= 50) return 'bg-amber-100 text-amber-800'
  return 'bg-gray-100 text-gray-700'
}

export default function ScholarshipMatcherPage() {
  const [profile, setProfile] = useState<ScholarshipApplicantProfile>(initialProfile)
  const [gpaInput, setGpaInput] = useState('')
  const [result, setResult] = useState<MatchResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function update<K extends keyof ScholarshipApplicantProfile>(
    key: K,
    value: ScholarshipApplicantProfile[K]
  ) {
    setProfile((current) => ({ ...current, [key]: value }))
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const payload: ScholarshipApplicantProfile = {
        ...profile,
        ...(gpaInput.trim() ? { gpa: Number(gpaInput) } : {}),
      }

      const response = await fetch('/api/scholarships/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.error ?? 'Unable to match scholarships.')
      }

      setResult(data as MatchResponse)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to match scholarships.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-1.5 text-sm font-semibold text-violet-700">
            <Sparkles className="size-4" />
            Scholarship Intelligence Agent
          </div>
          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Stop searching blindly.
            <span className="block text-blue-700">Find scholarships that fit your real profile.</span>
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-600">
            Tell AfriGrantPipeline your study goal, field, experience and document readiness.
            The matcher screens opportunities, explains why they fit, highlights missing
            requirements and gives you a practical next action.
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[420px_minmax(0,1fr)]">
        <form
          onSubmit={submit}
          className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-700 text-white">
              <Target className="size-5" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-950">Your scholarship profile</h2>
              <p className="text-xs text-slate-500">Takes about one minute.</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Nationality</span>
              <input
                value={profile.nationality}
                onChange={(e) => update('nationality', e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                placeholder="Nigeria"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Target level</span>
              <select
                value={profile.targetLevel}
                onChange={(e) => update('targetLevel', e.target.value as ScholarshipLevel)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              >
                <option value="undergraduate">Undergraduate</option>
                <option value="masters">Master&apos;s</option>
                <option value="phd">PhD / Doctorate</option>
                <option value="postdoc">Postdoctoral</option>
                <option value="fellowship">Fellowship</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Field of study</span>
              <input
                value={profile.field}
                onChange={(e) => update('field', e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                placeholder="e.g. Public administration"
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">GPA / 5.0</span>
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.01"
                  value={gpaInput}
                  onChange={(e) => setGpaInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  placeholder="Optional"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">Work experience</span>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={profile.workExperienceYears}
                  onChange={(e) => update('workExperienceYears', Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </label>
            </div>

            <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <span className="text-sm font-medium text-slate-700">I need full funding</span>
              <input
                type="checkbox"
                checked={profile.needsFullFunding}
                onChange={(e) => update('needsFullFunding', e.target.checked)}
                className="size-4 accent-blue-700"
              />
            </label>

            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="mb-3 text-sm font-semibold text-slate-800">Application documents</p>
              <div className="space-y-2.5">
                {documentChecks.map((item) => (
                  <label key={item.key} className="flex items-center gap-2.5 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      checked={profile[item.key]}
                      onChange={(e) => update(item.key, e.target.checked)}
                      className="size-4 accent-blue-700"
                    />
                    {item.label}
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
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Matching opportunities…
                </>
              ) : (
                <>
                  <SearchCheck className="size-4" />
                  Find My Best Matches
                </>
              )}
            </button>
          </div>
        </form>

        <section className="min-w-0">
          {!result ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 sm:p-12">
              <GraduationCap className="mb-5 size-12 text-blue-700" />
              <h2 className="text-2xl font-semibold text-slate-950">
                Your matched scholarships will appear here.
              </h2>
              <p className="mt-3 max-w-2xl leading-relaxed text-slate-600">
                The engine evaluates study level, field alignment, funding preference,
                experience and document readiness. It does not invent eligibility:
                programme-specific requirements still need to be verified at the official source.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  ['Fit score', 'See which opportunities align with your profile.'],
                  ['Gap analysis', 'Know what is missing before you spend hours applying.'],
                  ['Pathway', 'Get a next action when you are not application-ready yet.'],
                ].map(([title, description]) => (
                  <div key={title} className="rounded-2xl bg-slate-50 p-4">
                    <p className="font-semibold text-slate-900">{title}</p>
                    <p className="mt-1 text-sm text-slate-600">{description}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-[180px_minmax(0,1fr)]">
                <div className="rounded-3xl bg-slate-950 p-6 text-white">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Readiness
                  </p>
                  <div className="mt-3 text-5xl font-bold">{result.readiness.score}</div>
                  <p className="text-sm text-slate-400">out of 100</p>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6">
                  <div className="flex items-start gap-3">
                    <FileCheck2 className="mt-0.5 size-5 text-blue-700" />
                    <div>
                      <h2 className="font-semibold text-slate-950">Your next best action</h2>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600">
                        {result.readiness.nextAction}
                      </p>
                    </div>
                  </div>

                  {result.readiness.missing.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {result.readiness.missing.map((item) => (
                        <span
                          key={item}
                          className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800"
                        >
                          Missing: {item}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-blue-700">Profile-based results</p>
                  <h2 className="text-2xl font-semibold text-slate-950">Your scholarship matches</h2>
                </div>
                <span className="text-xs text-slate-500">{result.matches.length} screened</span>
              </div>

              <div className="space-y-4">
                {result.matches.map((match) => (
                  <article
                    key={match.opportunity.id}
                    className="rounded-3xl border border-slate-200 bg-white p-6 transition hover:border-blue-200 hover:shadow-md"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="mb-2 flex flex-wrap gap-2">
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${scoreClass(match.score)}`}>
                            {match.score}% · {match.label}
                          </span>
                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                            {match.opportunity.funding === 'full' ? 'Fully funded' : 'Partial funding'}
                          </span>
                          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                            Official source
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-slate-950">
                          {match.opportunity.title}
                        </h3>
                        <p className="mt-1 text-sm font-medium text-blue-700">
                          {match.opportunity.provider}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {match.opportunity.countries.join(', ')} · {match.opportunity.deadlineLabel}
                        </p>
                      </div>

                      <a
                        href={match.opportunity.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                      >
                        Verify <ExternalLink className="size-4" />
                      </a>
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      <div className="rounded-2xl bg-emerald-50/70 p-4">
                        <p className="mb-2 text-sm font-semibold text-emerald-900">Why it matches</p>
                        <ul className="space-y-2">
                          {match.reasons.length > 0 ? (
                            match.reasons.map((reason) => (
                              <li key={reason} className="flex gap-2 text-sm text-emerald-900/80">
                                <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
                                {reason}
                              </li>
                            ))
                          ) : (
                            <li className="text-sm text-emerald-900/70">
                              Verify programme-specific requirements before applying.
                            </li>
                          )}
                        </ul>
                      </div>

                      <div className="rounded-2xl bg-amber-50/70 p-4">
                        <p className="mb-2 text-sm font-semibold text-amber-900">Gaps / checks</p>
                        <ul className="space-y-2">
                          {match.gaps.length > 0 ? (
                            match.gaps.map((gap) => (
                              <li key={gap} className="flex gap-2 text-sm text-amber-900/80">
                                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                                {gap}
                              </li>
                            ))
                          ) : (
                            <li className="text-sm text-amber-900/70">
                              No major profile gap detected by the screening rules.
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="rounded-3xl bg-blue-700 p-6 text-white sm:p-8">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-blue-100">Need application support?</p>
                    <h3 className="mt-1 text-2xl font-semibold">
                      Turn a strong match into an application-ready package.
                    </h3>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-blue-100">
                      Use AfriGrantPipeline consultancy for CV review, document-gap checks,
                      statement guidance, proposal support and submission readiness.
                    </p>
                  </div>
                  <Link
                    href="/consultancy"
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
                  >
                    Get Application Help
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>

              <p className="text-xs leading-relaxed text-slate-500">{result.disclaimer}</p>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
