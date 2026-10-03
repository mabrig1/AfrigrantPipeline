'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  CheckCircle2,
  FileSearch,
  LockKeyhole,
  SearchCheck,
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
  const ngnPrice = data?.pricing?.NGN ?? 5000
  const usdPrice = data?.pricing?.USD ?? 5

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-7xl px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-sm font-bold text-blue-200">
            <Sparkles className="size-4" />
            AfriGrant AI Scholarship Matcher
          </div>

          <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl">
            Stop searching for scholarships.
            <span className="block text-blue-400">Upload your CV. Let AI find your best matches.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl">
            A growing scholarship intelligence database targeting <strong className="text-white">{target.toLocaleString()}+ curated opportunities</strong>,
            backed by continuous agentic search and crawling for new scholarship records.
          </p>

          <div className="mx-auto mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-3xl font-black">{loaded ? loaded.toLocaleString() + '+' : 'Live'}</div>
              <div className="mt-1 text-sm text-slate-400">records indexed now</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-3xl font-black">{target.toLocaleString()}+</div>
              <div className="mt-1 text-sm text-slate-400">curated catalogue target</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-3xl font-black">Continuous</div>
              <div className="mt-1 text-sm text-slate-400">agentic scholarship discovery</div>
            </div>
          </div>

          <div className="mt-10">
            <Link
              href="/scholarships/matcher"
              className="inline-flex items-center gap-3 rounded-2xl bg-blue-600 px-8 py-4 text-lg font-black text-white shadow-lg shadow-blue-900/30 transition hover:bg-blue-500"
            >
              <UploadCloud className="size-5" />
              Upload Your CV Now
              <ArrowRight className="size-5" />
            </Link>
            <p className="mt-4 text-sm font-semibold text-slate-300">
              AI scans your profile and returns your match count. Unlock matched scholarship details for
              <span className="text-white"> ₦{ngnPrice.toLocaleString()} or {'US$' + usdPrice}</span>.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.03]">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                icon: UploadCloud,
                number: '01',
                title: 'Upload your CV',
                text: 'Your CV is analysed for education, field, experience and scholarship-relevant profile signals.',
              },
              {
                icon: SearchCheck,
                number: '02',
                title: 'AI finds your matches',
                text: 'The matcher screens the scholarship database while the agentic pipeline keeps discovering new opportunities.',
              },
              {
                icon: LockKeyhole,
                number: '03',
                title: 'Pay once. Unlock your results.',
                text: 'Pay ₦' + ngnPrice.toLocaleString() + ' or US$' + usdPrice + ' to reveal matched scholarships, fit scores, providers and available application links.',
              },
            ].map(({ icon: Icon, number, title, text }) => (
              <div key={number} className="rounded-3xl border border-white/10 bg-slate-900 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-600/15 text-blue-300">
                    <Icon className="size-6" />
                  </div>
                  <span className="text-sm font-black text-slate-600">{number}</span>
                </div>
                <h2 className="mt-5 text-xl font-black">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16 text-center">
        <FileSearch className="mx-auto size-10 text-blue-400" />
        <h2 className="mt-4 text-3xl font-black sm:text-4xl">
          One CV can reveal opportunities you may never find manually.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-slate-400">
          No public scholarship directory. Your personalised match details are protected behind the paid unlock.
          Scholarship deadlines and eligibility can change, so always confirm final terms with the provider before applying.
        </p>

        <div className="mx-auto mt-8 max-w-xl rounded-3xl border border-blue-400/20 bg-blue-500/10 p-6">
          <div className="flex items-center justify-center gap-2 text-sm font-bold text-blue-200">
            <CheckCircle2 className="size-4" />
            Simple pricing. One clear action.
          </div>
          <div className="mt-3 text-4xl font-black">₦{ngnPrice.toLocaleString()} <span className="text-xl text-slate-400">or</span> {'US$' + usdPrice}</div>
          <p className="mt-2 text-sm text-slate-300">Unlock your matched scholarship records for the current match session.</p>
          <Link
            href="/scholarships/matcher"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 font-black text-slate-950 hover:bg-slate-100"
          >
            Upload Your CV Now
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </main>
  )
}
