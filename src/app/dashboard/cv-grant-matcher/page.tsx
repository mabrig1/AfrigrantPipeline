'use client'

import { FormEvent, useState } from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  FileText,
  Loader2,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  UploadCloud,
} from 'lucide-react'

type CvProfile = {
  name?: string
  country?: string
  careerStage?: string
  currentRole?: string
  institution?: string
  yearsExperience?: number | null
  highestDegree?: string
  fields: string[]
  skills: string[]
  publications: string[]
  grantsAndAwards: string[]
  projects: string[]
  keywords: string[]
  unknowns: string[]
  summary: string
}

type Match = {
  title: string
  funder: string
  url: string
  source: 'catalogue' | 'web'
  matchScore: number
  status: 'strong_match' | 'partial_match' | 'requirements_gap' | 'verify'
  eligibleNow: boolean | null
  deadline?: string | null
  funding?: string | null
  evidenceLevel: 'official' | 'secondary' | 'unclear'
  matchedRequirements: string[]
  missingRequirements: string[]
  actionPlan: string[]
  rationale: string
  confidence: number
}

type Result = {
  profile: CvProfile
  readiness: {
    summary: string
    strongestAssets: string[]
    gapsToClose: string[]
    recommendedGrantTypes: string[]
  }
  matches: Match[]
  meta: {
    webSearchUsed: boolean
    catalogueUsed: boolean
    sourcesConsidered: number
    generatedAt: string
  }
  privacy: {
    cvStored: boolean
    note: string
  }
}

const statusStyle: Record<Match['status'], string> = {
  strong_match: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  partial_match: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
  requirements_gap: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  verify: 'bg-slate-500/10 text-slate-300 border-slate-500/20',
}

const statusLabel: Record<Match['status'], string> = {
  strong_match: 'Strong match',
  partial_match: 'Partial match',
  requirements_gap: 'Requirements gap',
  verify: 'Verify eligibility',
}

export default function CvGrantMatcherPage() {
  const [file, setFile] = useState<File | null>(null)
  const [cvText, setCvText] = useState('')
  const [focus, setFocus] = useState('')
  const [consent, setConsent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<Result | null>(null)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setResult(null)

    if (!file && cvText.trim().length < 100) {
      setError('Upload a PDF/TXT CV or paste your CV text.')
      return
    }
    if (!consent) {
      setError('Confirm consent so the configured AI provider can analyse the CV.')
      return
    }

    const body = new FormData()
    if (file) body.append('cv', file)
    if (cvText.trim()) body.append('cvText', cvText.trim())
    body.append('focus', focus.trim())
    body.append('consent', 'true')

    setBusy(true)
    try {
      const response = await fetch('/api/grant-match/cv', {
        method: 'POST',
        body,
      })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || 'CV grant matching failed.')
      setResult(payload)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'CV grant matching failed.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-2xl border border-gold/20 bg-gradient-to-br from-gold/10 via-card to-card p-6 sm:p-8">
        <div className="max-w-4xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            <Sparkles className="size-3.5" />
            CV-to-Grant Matching Agent
          </div>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            Upload your CV. Find grants you can <span className="text-gold">realistically win.</span>
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
            The agent extracts only what your CV proves, searches current funding evidence, checks hard eligibility before topical fit, and shows the exact requirements you still need when you are not yet eligible.
          </p>
        </div>
      </section>

      <form onSubmit={submit} className="grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
        <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <UploadCloud className="size-5 text-gold" />
            <h2 className="text-lg font-bold">1. Add your CV</h2>
          </div>

          <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-gold/30 bg-gold/5 px-5 py-8 text-center transition hover:bg-gold/10">
            <UploadCloud className="mb-3 size-8 text-gold" />
            <span className="font-semibold">{file ? file.name : 'Choose PDF or TXT CV'}</span>
            <span className="mt-1 text-xs text-muted-foreground">Maximum 4 MB. Word users can export the CV as PDF.</span>
            <input
              type="file"
              accept=".pdf,.txt,.md,text/plain,application/pdf"
              className="sr-only"
              onChange={(event) => setFile(event.target.files?.[0] || null)}
            />
          </label>

          <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" />
            OR PASTE CV TEXT
            <div className="h-px flex-1 bg-border" />
          </div>

          <textarea
            value={cvText}
            onChange={(event) => setCvText(event.target.value)}
            rows={8}
            placeholder="Paste the CV text here when you do not want to upload a file…"
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-gold/50"
          />

          <div className="mt-4">
            <label className="text-sm font-semibold">Funding focus (optional)</label>
            <textarea
              value={focus}
              onChange={(event) => setFocus(event.target.value)}
              rows={3}
              placeholder="Example: AI for education, public administration, climate-smart agriculture, independent builder fellowships…"
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-gold/50"
            />
          </div>

          <label className="mt-4 flex items-start gap-3 rounded-xl border border-border bg-background/40 p-4 text-sm">
            <input
              type="checkbox"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
              className="mt-1"
            />
            <span>
              I consent to this CV being sent to the configured AI provider for this analysis. AfriGrantPipeline does not store the uploaded CV file in this workflow.
            </span>
          </label>

          <button
            type="submit"
            disabled={busy}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gold px-5 py-3 text-sm font-bold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
            {busy ? 'Analysing CV and searching grants…' : 'Analyse CV + Match Grants'}
          </button>

          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-300">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              {error}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-gold" />
            <h2 className="text-lg font-bold">2. What the agent checks</h2>
          </div>
          <div className="mt-5 space-y-3">
            {[
              ['Hard eligibility first', 'Country, degree, career stage, institution type, PI rules, legal status, partners and other stated requirements.'],
              ['Evidence, not optimism', 'The agent will not treat topic similarity as eligibility and will mark unclear rules for verification.'],
              ['Live + catalogue search', 'Matches the CV against the AfriGrant catalogue and searches the wider web when Tavily is configured.'],
              ['Gap-to-eligibility plan', 'When you do not qualify, it lists the missing requirement and practical next action instead of hiding the mismatch.'],
            ].map(([title, detail]) => (
              <div key={title} className="rounded-xl border border-border/70 bg-background/40 p-4">
                <div className="font-semibold">{title}</div>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{detail}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-xs leading-5 text-amber-200">
            Final eligibility always comes from the official funder call. This tool is designed to prevent unrealistic applications, not to guarantee an award.
          </div>
        </section>
      </form>

      {result && (
        <>
          <section className="grid gap-4 xl:grid-cols-[1.15fr_.85fr]">
            <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
              <div className="flex items-center gap-2">
                <FileText className="size-5 text-gold" />
                <h2 className="text-lg font-bold">CV funding profile</h2>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{result.profile.summary}</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  ['Applicant', result.profile.name || 'Not confirmed'],
                  ['Country', result.profile.country || 'Not confirmed'],
                  ['Career stage', result.profile.careerStage || 'Not confirmed'],
                  ['Current role', result.profile.currentRole || 'Not confirmed'],
                  ['Institution', result.profile.institution || 'Not confirmed'],
                  ['Highest degree', result.profile.highestDegree || 'Not confirmed'],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-border/70 bg-background/40 p-3">
                    <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
                    <div className="mt-1 text-sm font-semibold">{value}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {[...result.profile.fields, ...result.profile.keywords].slice(0, 14).map((item) => (
                  <span key={item} className="rounded-full border border-gold/20 bg-gold/5 px-2.5 py-1 text-xs text-gold">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
              <div className="flex items-center gap-2">
                <Target className="size-5 text-gold" />
                <h2 className="text-lg font-bold">Funding readiness</h2>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{result.readiness.summary}</p>
              {result.readiness.strongestAssets.length > 0 && (
                <div className="mt-4">
                  <div className="text-xs font-semibold uppercase tracking-wide text-emerald-300">Strongest assets</div>
                  <ul className="mt-2 space-y-2 text-sm">
                    {result.readiness.strongestAssets.map((item) => (
                      <li key={item} className="flex gap-2"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-400" />{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {result.readiness.gapsToClose.length > 0 && (
                <div className="mt-4">
                  <div className="text-xs font-semibold uppercase tracking-wide text-amber-300">Gaps to close</div>
                  <ul className="mt-2 space-y-2 text-sm">
                    {result.readiness.gapsToClose.map((item) => (
                      <li key={item} className="flex gap-2"><AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-400" />{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="mt-5 text-xs text-muted-foreground">
                {result.meta.sourcesConsidered} funding sources considered · Web search {result.meta.webSearchUsed ? 'used' : 'not configured/available'}.
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card">
            <div className="border-b border-border p-5 sm:p-6">
              <h2 className="text-xl font-bold">Realistic grant matches</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Ranked by hard eligibility, evidence quality and strategic fit — not keywords alone.
              </p>
            </div>

            {result.matches.length === 0 ? (
              <div className="p-6 text-sm text-muted-foreground">
                No realistic match was confirmed from the evidence checked. Use the readiness gaps above to strengthen the next search.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {result.matches.map((match) => (
                  <article key={match.url} className="p-5 sm:p-6">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <span className={"rounded-full border px-2.5 py-1 text-[11px] font-semibold " + statusStyle[match.status]}>
                            {statusLabel[match.status]}
                          </span>
                          <span className="rounded-full border border-gold/20 bg-gold/5 px-2.5 py-1 text-[11px] font-semibold text-gold">
                            Match {Math.round(match.matchScore)}/100
                          </span>
                          <span className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground">
                            {match.evidenceLevel} evidence
                          </span>
                        </div>
                        <h3 className="text-lg font-bold leading-snug">{match.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{match.funder}</p>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                          {match.deadline && <span>Deadline: {match.deadline}</span>}
                          {match.funding && <span>Funding: {match.funding}</span>}
                          <span>Confidence: {Math.round(match.confidence * 100)}%</span>
                        </div>
                        <p className="mt-4 text-sm leading-6 text-muted-foreground">{match.rationale}</p>

                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                          <div>
                            <div className="text-xs font-semibold uppercase tracking-wide text-emerald-300">What you already meet</div>
                            <ul className="mt-2 space-y-1.5 text-sm">
                              {match.matchedRequirements.length === 0 ? (
                                <li className="text-muted-foreground">No hard requirement was confirmed from available evidence.</li>
                              ) : match.matchedRequirements.map((item) => (
                                <li key={item} className="flex gap-2"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-400" />{item}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <div className="text-xs font-semibold uppercase tracking-wide text-amber-300">Requirements still missing / unproven</div>
                            <ul className="mt-2 space-y-1.5 text-sm">
                              {match.missingRequirements.length === 0 ? (
                                <li className="text-muted-foreground">No specific gap was proven from the available call evidence.</li>
                              ) : match.missingRequirements.map((item) => (
                                <li key={item} className="flex gap-2"><AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-400" />{item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {match.actionPlan.length > 0 && (
                          <div className="mt-4 rounded-xl border border-border/70 bg-background/40 p-4">
                            <div className="text-xs font-semibold uppercase tracking-wide text-gold">Path to eligibility / stronger application</div>
                            <ol className="mt-2 space-y-1.5 text-sm">
                              {match.actionPlan.map((item, index) => (
                                <li key={item}><span className="mr-2 font-bold text-gold">{index + 1}.</span>{item}</li>
                              ))}
                            </ol>
                          </div>
                        )}
                      </div>

                      <a
                        href={match.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-gold/30 bg-gold/10 px-4 py-2 text-sm font-semibold text-gold hover:bg-gold/15"
                      >
                        Official/source page <ExternalLink className="size-4" />
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs text-emerald-200">
            <strong>Privacy:</strong> {result.privacy.note}
          </div>
        </>
      )}
    </div>
  )
}
