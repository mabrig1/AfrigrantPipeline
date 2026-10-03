'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  CheckCircle2,
  FileSearch,
  GraduationCap,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  UploadCloud,
} from 'lucide-react'

type CatalogueStats = {
  target: number
  stats: {
    catalogueTotal: number
    open: number
    verified: number
    nigeriaEligible: number
  }
  pricing: { NGN: number; USD: number }
}

export default function ScholarshipsPage() {
  const [data, setData] = useState<CatalogueStats | null>(null)

  useEffect(() => {
    fetch('/api/scholarships/live?bootstrap=false', { cache: 'no-store' })
      .then((response) => response.json())
      .then((payload) => setData(payload as CatalogueStats))
      .catch(() => setData(null))
  }, [])

  const loaded = data?.stats.catalogueTotal ?? 0
  const target = data?.target ?? 2000
  const targetReached = loaded >= target

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="overflow-hidden bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/15 px-4 py-1.5 text-sm font-semibold text-blue-200">
            <Sparkles className="size-4" />
            AfriGrant Scholarship Intelligence
          </div>

          <h1 className="mt-5 max-w-5xl text-4xl font-black tracking-tight sm:text-6xl">
            {targetReached
              ? target.toLocaleString() + '+ curated scholarships. One CV. Your best matches.'
              : 'A curated scholarship database growing to ' + target.toLocaleString() + ' opportunities.'}
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-300">
            Upload your CV and let the agentic matcher screen the scholarship catalogue for
            opportunities aligned with your education, field, experience and target study level.
            See how many matches were found before you pay.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/scholarships/matcher"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-bold text-white hover:bg-blue-500"
            >
              Upload CV & Find My Matches
              <ArrowRight className="size-4" />
            </Link>
            <div className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3.5 text-sm font-semibold text-slate-200">
              <LockKeyhole className="size-4" />
              Unlock results for ₦5,000 or US$5
            </div>
          </div>

          <div className="mt-10 grid max-w-5xl gap-3 sm:grid-cols-4">
            {[
              [loaded ? loaded.toLocaleString() : '—', 'records currently loaded'],
              [target.toLocaleString(), 'curated catalogue target'],
              [data ? data.stats.open.toLocaleString() : '—', 'currently marked open'],
              ['7 days', 'match-session access'],
            ].map(([value, label]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="text-2xl font-black">{value}</div>
                <div className="mt-1 text-xs text-slate-400">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-wide text-blue-700">How it works</p>
          <h2 className="mt-2 text-3xl font-black text-slate-950">
            Stop opening hundreds of scholarship tabs.
          </h2>
          <p className="mt-3 text-slate-600">
            The system narrows the catalogue to the records that best fit your profile,
            while keeping programme-specific eligibility and deadlines subject to provider verification.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            {
              icon: UploadCloud,
              step: '01',
              title: 'Upload your CV',
              text: 'The agent extracts scholarship-relevant education, field, experience and profile signals. The raw CV is not stored in the match session.',
            },
            {
              icon: FileSearch,
              step: '02',
              title: 'See your match count',
              text: 'The matcher screens the catalogue and shows how many strong and possible matches it found before any payment.',
            },
            {
              icon: LockKeyhole,
              step: '03',
              title: 'Unlock matched records',
              text: 'Pay ₦5,000 or US$5 once to reveal scholarship names, fit scores, provider details and available application/source links.',
            },
          ].map(({ icon: Icon, step, title, text }) => (
            <div key={step} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                  <Icon className="size-6" />
                </div>
                <span className="text-sm font-black text-slate-300">{step}</span>
              </div>
              <h3 className="mt-5 text-xl font-bold text-slate-950">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-14 lg:grid-cols-2">
          <div>
            <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <ShieldCheck className="size-6" />
            </div>
            <h2 className="mt-5 text-3xl font-black text-slate-950">Curated does not mean blindly guaranteed.</h2>
            <p className="mt-3 max-w-xl leading-7 text-slate-600">
              Scholarship cycles change. Imported records keep their provenance and review status,
              while higher-confidence records can be refreshed against provider sources. Applicants
              should always confirm the current deadline, eligibility and award terms before applying.
            </p>
          </div>

          <div className="rounded-3xl bg-slate-50 p-6">
            <p className="font-bold text-slate-950">What you receive after unlock</p>
            <div className="mt-4 space-y-3">
              {[
                'Matched scholarship names and providers',
                'Profile-fit score and match explanation',
                'Funding and target-level information where available',
                'Deadline or cycle status where available',
                'Official/application source link where available',
                'Gap checks before you spend time applying',
              ].map((item) => (
                <div key={item} className="flex gap-2.5 text-sm text-slate-700">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-14">
        <div className="rounded-3xl bg-blue-700 p-8 text-white sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-blue-100">
                <GraduationCap className="size-5" />
                <span className="text-sm font-semibold">Scholarship Intelligence Agent</span>
              </div>
              <h2 className="mt-2 text-3xl font-black">Find the opportunities that fit your CV.</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100">
                Matching is free. You see the number of relevant records first. Pay only when
                you want to open the matched scholarship details.
              </p>
            </div>
            <Link
              href="/scholarships/matcher"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-blue-700 hover:bg-blue-50"
            >
              Start CV Match
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
