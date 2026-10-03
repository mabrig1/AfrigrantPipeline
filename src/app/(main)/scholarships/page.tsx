'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Database,
  FileSearch,
  GraduationCap,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  UploadCloud,
} from 'lucide-react'

type PublicStats = {
  target: number
  stats: {
    catalogueTotal: number
    open: number
    verified: number
    nigeriaEligible: number
  }
  access: string
  pricing: { NGN: number; USD: number }
}

export default function ScholarshipsPage() {
  const [data, setData] = useState<PublicStats | null>(null)

  useEffect(() => {
    fetch('/api/scholarships/live?bootstrap=false', { cache: 'no-store' })
      .then((response) => response.json())
      .then((payload) => setData(payload as PublicStats))
      .catch(() => setData(null))
  }, [])

  const loaded = data?.stats.catalogueTotal ?? 0
  const target = data?.target ?? 2000
  const complete = loaded >= target

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-blue-100">
            <Sparkles className="size-4" />
            AfriGrant Scholarship Intelligence
          </div>

          <h1 className="mt-6 max-w-5xl text-4xl font-black tracking-tight sm:text-6xl">
            One CV. One intelligent match.
            <span className="block text-blue-300">
              Your most relevant scholarships, pulled from a curated database.
            </span>
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-300">
            Upload your CV and our agentic AI screens the scholarship catalogue against
            your academic background, field, study level, experience and funding needs.
            You see the number of relevant matches before paying.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/scholarships/matcher"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-500"
            >
              Upload CV & Find My Matches
              <ArrowRight className="size-4" />
            </Link>
            <div className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200">
              <LockKeyhole className="size-4" />
              Unlock matched records for ₦5,000 or US$5
            </div>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <Database className="size-5 text-blue-300" />
              <div className="mt-3 text-3xl font-black">
                {complete ? target.toLocaleString() : loaded ? loaded.toLocaleString() : '—'}
              </div>
              <div className="mt-1 text-sm text-slate-300">
                {complete
                  ? 'curated scholarship records'
                  : 'records currently loaded toward the 2,000 target'}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <FileSearch className="size-5 text-blue-300" />
              <div className="mt-3 text-3xl font-black">AI</div>
              <div className="mt-1 text-sm text-slate-300">CV-to-scholarship screening</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <ShieldCheck className="size-5 text-blue-300" />
              <div className="mt-3 text-3xl font-black">
                {data ? data.stats.verified.toLocaleString() : '—'}
              </div>
              <div className="mt-1 text-sm text-slate-300">provider-level verified records</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <GraduationCap className="size-5 text-blue-300" />
              <div className="mt-3 text-3xl font-black">₦5k / $5</div>
              <div className="mt-1 text-sm text-slate-300">one-time match-session unlock</div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-5 lg:grid-cols-3">
          {[
            {
              icon: UploadCloud,
              step: '1',
              title: 'Upload your CV',
              text: 'Upload a PDF or text CV and choose your target study level. The raw CV is analysed for scholarship-relevant signals and is not stored in the match session.',
            },
            {
              icon: FileSearch,
              step: '2',
              title: 'See your match count',
              text: 'The agent screens the database and tells you how many relevant scholarship records it found before you pay.',
            },
            {
              icon: LockKeyhole,
              step: '3',
              title: 'Unlock the actual records',
              text: 'Pay ₦5,000 or US$5 to open the matched scholarship names, fit scores, providers, verification status and application/source links.',
            },
          ].map(({ icon: Icon, step, title, text }) => (
            <div key={step} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                  <Icon className="size-5" />
                </div>
                <span className="text-sm font-black text-slate-300">0{step}</span>
              </div>
              <h2 className="mt-5 text-xl font-bold text-slate-950">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-3xl border border-blue-100 bg-blue-50 p-7 sm:flex sm:items-center sm:justify-between sm:gap-6">
          <div>
            <p className="text-sm font-bold text-blue-700">Pay only after you see that matches exist</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">
              The match count is free. The detailed matched scholarship list is paid.
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Scholarship information changes by cycle. Every unlocked record keeps its
              source and verification status so you can confirm the final deadline,
              eligibility and funding terms with the provider before applying.
            </p>
          </div>
          <Link
            href="/scholarships/matcher"
            className="mt-5 inline-flex shrink-0 items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 font-bold text-white hover:bg-blue-800 sm:mt-0"
          >
            Match My CV
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </main>
  )
}
