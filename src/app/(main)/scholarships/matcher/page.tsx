'use client'

import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  FileText,
  GraduationCap,
  Loader2,
  LockKeyhole,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  UploadCloud,
} from 'lucide-react'

type TargetLevel = 'undergraduate' | 'masters' | 'phd' | 'postdoc' | 'fellowship'

type Preview = {
  sessionId: string
  screenedCount: number
  matchCount: number
  strongCount: number
  possibleCount: number
  readiness: { score: number; nextAction: string }
  profileSummary: {
    nationality: string
    field: string
    targetLevel: TargetLevel
    workExperienceYears: number
    educationSummary: string
  }
  price: { NGN: number; USD: number }
  message: string
  disclaimer: string
}

type UnlockedMatch = {
  id: string
  title: string
  provider: string
  description: string
  score: number
  label: string
  reasons: string[]
  gaps: string[]
  fundingText?: string
  status: string
  deadline?: string
  applicationCycle?: string
  levels: string[]
  studyCountries: string[]
  verificationStatus?: string
  applicationLink?: string
  sourceUrl?: string
  sourceName?: string
}

type Results = {
  unlocked: true
  matchCount: number
  strongCount: number
  possibleCount: number
  profile: { nationality: string; field: string; targetLevel: string }
  matches: UnlockedMatch[]
  disclaimer: string
}

function deadlineLabel(match: UnlockedMatch) {
  if (match.deadline) {
    const date = new Date(match.deadline)
    if (!Number.isNaN(date.getTime()) && date.getUTCFullYear() < 2098) {
      return date.toLocaleDateString('en-NG', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    }
  }
  return match.applicationCycle || 'Verify current cycle'
}

export default function ScholarshipMatcherPage() {
  const [email, setEmail] = useState('')
  const [targetLevel, setTargetLevel] = useState<TargetLevel>('masters')
  const [needsFullFunding, setNeedsFullFunding] = useState(true)
  const [cv, setCv] = useState<File | null>(null)
  const [preview, setPreview] = useState<Preview | null>(null)
  const [results, setResults] = useState<Results | null>(null)
  const [loading, setLoading] = useState(false)
  const [paying, setPaying] = useState<'NGN' | 'USD' | ''>('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const sessionId = params.get('session')
    const reference = params.get('reference') || params.get('trxref')
    if (!sessionId || !reference) return

    setLoading(true)
    setNotice('Verifying payment and unlocking your scholarship matches…')

    fetch('/api/scholarships/unlock/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, reference }),
    })
      .then(async (response) => {
        const payload = await response.json()
        if (!response.ok) throw new Error(payload.error || 'Payment verification failed.')
        const resultResponse = await fetch(
          '/api/scholarships/unlock/results?sessionId=' + encodeURIComponent(sessionId),
          { cache: 'no-store' }
        )
        const resultPayload = await resultResponse.json()
        if (!resultResponse.ok) {
          throw new Error(resultPayload.error || 'Unable to load unlocked matches.')
        }
        return resultPayload as Results
      })
      .then((payload) => {
        setResults(payload)
        setNotice('Payment verified. Your matched scholarships are unlocked.')
        window.history.replaceState({}, '', '/scholarships/matcher')
      })
      .catch((reason: unknown) => {
        setError(reason instanceof Error ? reason.message : 'Payment verification failed.')
        setNotice('')
      })
      .finally(() => setLoading(false))
  }, [])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setNotice('')
    setResults(null)

    if (!cv) {
      setError('Upload your CV as PDF, TXT or Markdown.')
      return
    }

    setLoading(true)
    try {
      const form = new FormData()
      form.set('email', email)
      form.set('targetLevel', targetLevel)
      form.set('needsFullFunding', String(needsFullFunding))
      form.set('cv', cv)

      const response = await fetch('/api/scholarships/match', {
        method: 'POST',
        body: form,
      })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || 'Unable to match your CV.')

      setPreview(payload as Preview)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to match your CV.')
    } finally {
      setLoading(false)
    }
  }

  async function unlock(currency: 'NGN' | 'USD') {
    if (!preview) return
    setError('')
    setPaying(currency)

    try {
      const response = await fetch('/api/scholarships/unlock/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: preview.sessionId, currency }),
      })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || 'Unable to start payment.')

      if (payload.alreadyUnlocked) {
        const resultResponse = await fetch(payload.resultsUrl, { cache: 'no-store' })
        const resultPayload = await resultResponse.json()
        if (!resultResponse.ok) throw new Error(resultPayload.error || 'Unable to load matches.')
        setResults(resultPayload as Results)
        return
      }

      if (!payload.authorizationUrl) throw new Error('Payment link was not returned.')
      window.location.assign(payload.authorizationUrl)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to start payment.')
      setPaying('')
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-blue-100">
            <Sparkles className="size-4" />
            Agentic Scholarship Matcher
          </div>
          <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
            Upload your CV now. AI finds the scholarships worth your time.
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-300">
            One CV. A growing database targeting 2,000+ curated scholarships. Continuous agentic discovery.
            See your match count, then unlock the actual opportunities for ₦5,000 or US$5.
          </p>

          <div className="mt-8 grid max-w-4xl gap-3 sm:grid-cols-3">
            {[
              ['2,000+', 'curated scholarship target'],
              ['Continuous AI', 'agentic scholarship discovery'],
              ['₦5,000 / $5', 'paid result unlock'],
            ].map(([value, label]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-2xl font-bold">{value}</div>
                <div className="mt-1 text-sm text-slate-300">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[420px_minmax(0,1fr)]">
        <form
          onSubmit={submit}
          className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-blue-700 text-white">
              <UploadCloud className="size-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-950">Match my CV</h2>
              <p className="text-xs text-slate-500">Your raw CV is not stored in the match session.</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Target level</span>
              <select
                value={targetLevel}
                onChange={(event) => setTargetLevel(event.target.value as TargetLevel)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
              >
                <option value="undergraduate">Undergraduate</option>
                <option value="masters">Master&apos;s</option>
                <option value="phd">PhD / Doctorate</option>
                <option value="postdoc">Postdoctoral</option>
                <option value="fellowship">Fellowship</option>
              </select>
            </label>

            <label className="block rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-5 text-center hover:border-blue-300">
              <FileText className="mx-auto size-8 text-blue-700" />
              <span className="mt-2 block text-sm font-semibold text-slate-800">
                {cv ? cv.name : 'Choose your CV'}
              </span>
              <span className="mt-1 block text-xs text-slate-500">
                PDF, TXT or Markdown · maximum 8 MB
              </span>
              <input
                type="file"
                required
                accept=".pdf,.txt,.md,application/pdf,text/plain,text/markdown"
                onChange={(event) => setCv(event.target.files?.[0] || null)}
                className="sr-only"
              />
            </label>

            <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-3">
              <span className="text-sm font-medium text-slate-700">Prioritize fully funded awards</span>
              <input
                type="checkbox"
                checked={needsFullFunding}
                onChange={(event) => setNeedsFullFunding(event.target.checked)}
                className="size-4 accent-blue-700"
              />
            </label>

            {error && (
              <div className="flex gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                {error}
              </div>
            )}

            {notice && (
              <div className="flex gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
                <ShieldCheck className="mt-0.5 size-4 shrink-0" />
                {notice}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-sm font-bold text-white hover:bg-blue-800 disabled:opacity-60"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : <SearchCheck className="size-4" />}
              {loading ? 'Analysing CV…' : 'Upload CV & Find My Matches'}
            </button>
          </div>
        </form>

        <section className="min-w-0">
          {results ? (
            <div className="space-y-6">
              <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="size-7 text-emerald-700" />
                  <div>
                    <p className="text-sm font-semibold text-emerald-700">Unlocked</p>
                    <h2 className="text-2xl font-bold text-emerald-950">
                      {results.matchCount.toLocaleString()} matched scholarship records
                    </h2>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {results.matches.map((match) => {
                  const link = match.applicationLink || match.sourceUrl
                  return (
                    <article key={match.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="mb-2 flex flex-wrap gap-2">
                            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                              {match.score}% · {match.label}
                            </span>
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                              {match.verificationStatus === 'verified' ? 'Provider verified' : 'Verify current cycle'}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-slate-950">{match.title}</h3>
                          <p className="mt-1 font-medium text-blue-700">{match.provider}</p>
                          <p className="mt-2 text-sm text-slate-500">
                            {match.studyCountries?.join(', ') || 'International'} · {deadlineLabel(match)}
                          </p>
                        </div>

                        {link ? (
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-800"
                          >
                            View source <ExternalLink className="size-4" />
                          </a>
                        ) : (
                          <span className="rounded-xl bg-amber-50 px-4 py-2.5 text-xs font-semibold text-amber-800">
                            Provider link pending verification
                          </span>
                        )}
                      </div>

                      <p className="mt-4 text-sm leading-6 text-slate-600">{match.description}</p>
                      <div className="mt-4 grid gap-3 md:grid-cols-2">
                        <div className="rounded-2xl bg-emerald-50 p-4">
                          <p className="text-sm font-bold text-emerald-900">Why it matches</p>
                          <ul className="mt-2 space-y-1.5 text-sm text-emerald-900/80">
                            {match.reasons.map((reason) => <li key={reason}>• {reason}</li>)}
                          </ul>
                        </div>
                        <div className="rounded-2xl bg-amber-50 p-4">
                          <p className="text-sm font-bold text-amber-900">Checks before applying</p>
                          <ul className="mt-2 space-y-1.5 text-sm text-amber-900/80">
                            {match.gaps.length
                              ? match.gaps.map((gap) => <li key={gap}>• {gap}</li>)
                              : <li>• Confirm the current provider requirements and deadline.</li>}
                          </ul>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>

              <p className="text-xs leading-relaxed text-slate-500">{results.disclaimer}</p>
            </div>
          ) : preview ? (
            <div className="space-y-6">
              <div className="rounded-3xl border border-blue-200 bg-white p-7 shadow-sm">
                <p className="text-sm font-bold uppercase tracking-wide text-blue-700">CV match complete</p>
                <div className="mt-3 flex items-end gap-3">
                  <div className="text-6xl font-black text-slate-950">{preview.matchCount}</div>
                  <div className="pb-2 text-slate-500">relevant records found</div>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  We screened {preview.screenedCount.toLocaleString()} catalogue records.
                  {preview.strongCount > 0 && <> {preview.strongCount} are strong matches.</>}
                  {preview.possibleCount > 0 && <> {preview.possibleCount} are possible matches.</>}
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Detected field</p>
                    <p className="mt-1 font-bold text-slate-900">{preview.profileSummary.field}</p>
                    <p className="mt-1 text-sm text-slate-600">{preview.profileSummary.nationality}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Application readiness</p>
                    <p className="mt-1 text-2xl font-bold text-slate-900">{preview.readiness.score}/100</p>
                    <p className="mt-1 text-xs text-slate-600">{preview.readiness.nextAction}</p>
                  </div>
                </div>
              </div>

              {preview.matchCount > 0 && (
                <div className="rounded-3xl bg-slate-950 p-7 text-white">
                  <div className="flex items-start gap-3">
                    <LockKeyhole className="mt-1 size-6 text-blue-300" />
                    <div>
                      <p className="text-sm font-semibold text-blue-200">Unlock your matched records</p>
                      <h2 className="mt-1 text-2xl font-bold">
                        See names, fit scores, provider details and application links.
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        One payment unlocks this match session for seven days.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      disabled={Boolean(paying)}
                      onClick={() => unlock('NGN')}
                      className="rounded-2xl bg-white px-5 py-4 text-left text-slate-950 disabled:opacity-60"
                    >
                      <div className="text-2xl font-black">₦5,000</div>
                      <div className="mt-1 text-xs font-semibold text-slate-500">
                        Pay in Naira with Paystack
                      </div>
                    </button>
                    <button
                      type="button"
                      disabled={Boolean(paying)}
                      onClick={() => unlock('USD')}
                      className="rounded-2xl border border-white/20 bg-white/10 px-5 py-4 text-left disabled:opacity-60"
                    >
                      <div className="text-2xl font-black">US$5</div>
                      <div className="mt-1 text-xs font-semibold text-slate-300">
                        Pay in USD where enabled
                      </div>
                    </button>
                  </div>

                  {paying && (
                    <p className="mt-4 flex items-center gap-2 text-sm text-blue-200">
                      <Loader2 className="size-4 animate-spin" />
                      Opening secure payment…
                    </p>
                  )}
                </div>
              )}

              <p className="text-xs leading-relaxed text-slate-500">{preview.disclaimer}</p>
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10">
              <GraduationCap className="size-12 text-blue-700" />
              <h2 className="mt-5 text-2xl font-bold text-slate-950">
                Upload your CV. See your match count. Pay to unlock the opportunities.
              </h2>
              <p className="mt-3 max-w-2xl leading-relaxed text-slate-600">
                The AI analyses your profile against the scholarship database and shows how many relevant
                opportunities it found. Scholarship names, providers and application links remain locked until payment.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  ['1', 'Upload CV', 'PDF or text CV is analysed for scholarship-relevant signals.'],
                  ['2', 'See match count', 'Know how many relevant records were found before paying.'],
                  ['3', 'Unlock results', 'Pay once to view the actual matched opportunities and links.'],
                ].map(([step, title, description]) => (
                  <div key={step} className="rounded-2xl bg-slate-50 p-4">
                    <div className="flex size-8 items-center justify-center rounded-full bg-blue-700 text-sm font-bold text-white">
                      {step}
                    </div>
                    <p className="mt-3 font-bold text-slate-900">{title}</p>
                    <p className="mt-1 text-sm text-slate-600">{description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
