import Link from 'next/link'
import {
  ArrowRight,
  BookOpenCheck,
  DatabaseZap,
  GraduationCap,
  SearchCheck,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

const tools = [
  {
    href: '/google-index-agent',
    icon: SearchCheck,
    title: 'Google Index Agentic Engine',
    description:
      'Audit article crawlability, Google Scholar compatibility, Highwire metadata, canonical URLs, sitemap paths and verification progress.',
    points: ['Scholar readiness score', 'Highwire meta tags', 'ScholarlyArticle JSON-LD', 'Step-by-step indexing mission'],
  },
  {
    href: '/scopus-hub',
    icon: GraduationCap,
    title: 'Scholar Scopus Hub',
    description:
      'Improve researcher visibility with Scopus profile checks, duplicate-profile repair guidance, ORCID alignment and source/journal readiness.',
    points: ['Scopus readiness score', 'Profile repair plan', 'Source coverage workflow', 'Publication-integrity gate'],
  },
  {
    href: '/knowledgeforge',
    icon: DatabaseZap,
    title: 'KnowledgeForge Research Engine',
    description:
      'Retrieve scholarly evidence from OpenAlex, Crossref and PubMed, deduplicate records and build a traceable source ledger before writing.',
    points: ['Deep knowledge search', 'Evidence ledger', 'Research workflow agents', 'Citation marker audit'],
  },
]

export default function ResearchOSPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-1.5 text-sm font-semibold text-violet-700">
            <Sparkles className="size-4" />
            AfriGrant Research OS
          </div>
          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Funding is stronger when
            <span className="block text-blue-700">research visibility and evidence are strong too.</span>
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-600">
            Move from grant discovery into publication readiness, scholarly discoverability,
            Scopus profile hygiene and evidence-grounded research — without leaving
            AfriGrantPipeline.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-5 lg:grid-cols-3">
          {tools.map(({ href, icon: Icon, title, description, points }) => (
            <article
              key={href}
              className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-blue-700 text-white">
                <Icon className="size-6" />
              </div>
              <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
              <ul className="mt-5 space-y-2">
                {points.map((point) => (
                  <li key={point} className="flex items-center gap-2 text-sm text-slate-700">
                    <ShieldCheck className="size-4 shrink-0 text-emerald-600" />
                    {point}
                  </li>
                ))}
              </ul>
              <Link
                href={href}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Open Tool
                <ArrowRight className="size-4" />
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl border border-blue-200 bg-blue-50 p-6">
            <BookOpenCheck className="size-6 text-blue-700" />
            <h3 className="mt-3 text-lg font-semibold text-slate-950">
              Built for the grant-to-publication cycle
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Scholarship and grant matching can now flow into evidence discovery, manuscript
              preparation, discoverability checks and researcher-profile visibility.
            </p>
          </div>
          <div className="rounded-3xl border border-violet-200 bg-violet-50 p-6">
            <DatabaseZap className="size-6 text-violet-700" />
            <h3 className="mt-3 text-lg font-semibold text-slate-950">
              Evidence first, AI second
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              KnowledgeForge retrieves traceable scholarly metadata first. AI-generated claims
              should be tied back to the source ledger and human-reviewed before submission.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
