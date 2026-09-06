import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Grant Intelligence Newsletter',
  description:
    'Curated funding alerts, deadline intelligence and grant opportunities for African researchers and institutions.',
}

const issues = [
  {
    title: 'European Funding Alert for Dr David C. Nwogbo',
    date: '6 September 2026',
    audience: 'Public Administration, Governance & Social Sciences',
    summary:
      'A focused scan of current European fellowships and research funding routes accessible to Nigerian academics, with urgent deadlines and eligibility notes.',
    href: '/newsletter/dr-david-c-nwogbo-europe-funding-september-2026',
  },
]

export default function NewsletterPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main>
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
              AfriGrant Intelligence
            </p>
            <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">
              Grant Intelligence Newsletter
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              Verified funding alerts, deadline reminders and practical application guidance for African researchers, academics and institutions.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid gap-6">
            {issues.map((issue) => (
              <article
                key={issue.href}
                className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <span>{issue.date}</span>
                  <span>•</span>
                  <span>{issue.audience}</span>
                </div>
                <h2 className="mt-3 text-2xl font-bold tracking-tight">{issue.title}</h2>
                <p className="mt-3 max-w-4xl leading-7 text-slate-600">{issue.summary}</p>
                <Link
                  href={issue.href}
                  className="mt-6 inline-flex rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-800"
                >
                  Read funding brief →
                </Link>
              </article>
            ))}
          </div>

          <div className="mt-10 rounded-3xl bg-slate-900 p-8 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-300">
              Weekly Grant Intelligence
            </p>
            <h2 className="mt-2 text-2xl font-bold">Turn opportunities into an application pipeline.</h2>
            <p className="mt-3 max-w-3xl leading-7 text-slate-300">
              Create an AfriGrantPipeline account to save opportunities, track deadlines and use the platform's grant intelligence tools.
            </p>
            <Link
              href="/signup"
              className="mt-6 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100"
            >
              Create free account
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
