import Link from 'next/link'
import {
  ArrowRight, BookOpen, FileText, Globe, Award,
  CheckCircle, Star, Users, Microscope, ChevronRight,
} from 'lucide-react'

const publishingPackages = [
  {
    icon: BookOpen,
    title: 'Research Repository Upload',
    description: 'Deposit your thesis, dissertation, or working paper into AfriGrantPipeline\'s open-access repository. Get a DOI, citation stats, and global discoverability.',
    features: [
      'Digital Object Identifier (DOI) assignment',
      'Full-text indexing & search visibility',
      'Download and citation analytics',
      'Permanent archival storage',
      'CC-BY open access licensing',
    ],
    badge: 'Open Access',
    badgeColor: 'bg-emerald-100 text-emerald-700',
    cta: 'Upload Your Work',
    href: '/articles',
  },
  {
    icon: FileText,
    title: 'Working Papers & Policy Briefs',
    description: 'Publish pre-print working papers and policy-relevant briefs through the Mabrig Research Institute. Reach policymakers, funders, and institutions directly.',
    features: [
      'MRI-branded publication series',
      'Peer feedback from research fellows',
      'Policy audience distribution',
      'Formatted PDF export (Word/LaTeX input)',
      'Listed in MRI Working Papers database',
    ],
    badge: 'MRI Series',
    badgeColor: 'bg-blue-100 text-blue-700',
    cta: 'Submit a Working Paper',
    href: '/mri/working-papers',
  },
  {
    icon: Globe,
    title: 'Open Access Journal Support',
    description: 'Get expert guidance and editorial support to publish in reputable open-access journals. We help you identify the right journal, prepare your manuscript, and navigate the submission process.',
    features: [
      'Journal matching & ranking guidance',
      'Manuscript formatting & style compliance',
      'Cover letter & response-to-reviewer support',
      'APC fee navigation (waiver applications)',
      'Post-acceptance promotion & indexing',
    ],
    badge: 'Guided',
    badgeColor: 'bg-purple-100 text-purple-700',
    cta: 'Get Publishing Support',
    href: '/services',
    highlight: true,
  },
  {
    icon: Award,
    title: 'High-Impact Journal Submission',
    description: 'Targeting Q1/Q2 Scopus or Web of Science journals? Our expert team provides end-to-end submission support — from language editing to strategic journal targeting.',
    features: [
      'Manuscript language editing (academic English)',
      'Q1/Q2 journal targeting strategy',
      'Structured abstract & keyword optimization',
      'Ethical compliance & plagiarism check',
      'Ongoing revision support until acceptance',
    ],
    badge: 'Premium',
    badgeColor: 'bg-amber-100 text-amber-700',
    cta: 'Start High-Impact Journey',
    href: '/services',
  },
]

const publishStats = [
  { value: '200+', label: 'Papers Published' },
  { value: '40+', label: 'Journals Supported' },
  { value: '15', label: 'African Countries' },
  { value: '94%', label: 'Acceptance Rate' },
]

const publishingSteps = [
  { n: '01', title: 'Submit Your Manuscript', desc: 'Upload your research document — thesis, article, policy brief, or working paper. We accept Word, PDF, and LaTeX formats.' },
  { n: '02', title: 'Expert Review & Preparation', desc: 'Our team checks formatting, language, and compliance with target journal or repository standards. We provide feedback and revisions.' },
  { n: '03', title: 'Publish & Promote', desc: 'Your work is published, indexed, and promoted to relevant researchers, funders, and institutions across Africa and globally.' },
]

export default function PublishPage() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-20 -top-20 size-96 rounded-full bg-blue-400 blur-3xl" />
          <div className="absolute -right-10 bottom-0 size-80 rounded-full bg-indigo-400 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-28">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium">
            <BookOpen className="size-4 text-yellow-300" />
            <span>AfriGrantPipeline × Mabrig Research Institute</span>
          </div>
          <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
            Publish Your Research<br />
            <span className="text-yellow-300">Reach the World</span>
          </h1>
          <p className="mt-6 max-w-2xl text-xl text-blue-100">
            From repository uploads to high-impact journal submissions — AfriGrantPipeline and Mabrig Research Institute make your research visible, citable, and impactful.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/articles"
              className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-8 py-3.5 text-sm font-bold text-gray-900 transition-opacity hover:opacity-90">
              Start Publishing <ArrowRight className="size-4" />
            </Link>
            <Link href="/mri/publications"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/20">
              <Microscope className="size-4" /> View MRI Publications
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {publishStats.map(({ value, label }) => (
              <div key={label} className="rounded-2xl border border-white/20 bg-white/10 px-4 py-4 text-center backdrop-blur-sm">
                <div className="text-2xl font-bold text-yellow-300">{value}</div>
                <div className="mt-0.5 text-xs text-blue-200">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Publishing packages */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-12 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700">
            <Star className="size-4 fill-blue-500" /> Publishing Services
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Choose Your Publishing Path
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-gray-500">
            Whether you&apos;re sharing preliminary findings or targeting a top-tier journal, we have the right service for your stage and goals.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {publishingPackages.map(({ icon: Icon, title, description, features, badge, badgeColor, cta, href, highlight }) => (
            <div key={title} className={`relative flex flex-col rounded-3xl border p-8 transition-all hover:-translate-y-1 hover:shadow-xl ${
              highlight ? 'border-blue-500 bg-blue-700 text-white shadow-2xl shadow-blue-100' : 'border-gray-200 bg-white'
            }`}>
              {highlight && (
                <div className="absolute -top-3 left-8 rounded-full bg-yellow-400 px-4 py-1 text-xs font-bold text-gray-900">
                  Most Popular
                </div>
              )}
              <div className="mb-5 flex items-start justify-between">
                <div className={`flex size-12 items-center justify-center rounded-2xl ${highlight ? 'bg-white/20' : 'bg-gray-100'}`}>
                  <Icon className={`size-6 ${highlight ? 'text-white' : 'text-blue-700'}`} />
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${highlight ? 'bg-white/20 text-white' : badgeColor}`}>
                  {badge}
                </span>
              </div>
              <h3 className={`mb-2 text-lg font-bold ${highlight ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
              <p className={`mb-5 text-sm leading-relaxed ${highlight ? 'text-blue-100' : 'text-gray-500'}`}>{description}</p>
              <ul className="mb-7 flex-1 space-y-2.5">
                {features.map((f) => (
                  <li key={f} className={`flex items-start gap-2 text-sm ${highlight ? 'text-blue-100' : 'text-gray-600'}`}>
                    <CheckCircle className={`mt-0.5 size-4 shrink-0 ${highlight ? 'text-yellow-300' : 'text-blue-700'}`} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={href}
                className={`inline-flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold transition-all ${
                  highlight
                    ? 'bg-yellow-400 text-gray-900 hover:opacity-90'
                    : 'border border-blue-700 text-blue-700 hover:bg-blue-50'
                }`}>
                {cta} <ArrowRight className="size-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">How Publishing Works</h2>
            <p className="mt-3 text-gray-500">A simple, guided process from submission to global visibility.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {publishingSteps.map(({ n, title, desc }) => (
              <div key={n} className="flex flex-col items-center rounded-3xl border border-gray-200 bg-gray-50 p-8 text-center">
                <div className="mb-5 flex size-12 items-center justify-center rounded-full bg-blue-700 text-sm font-bold text-white">{n}</div>
                <h3 className="mb-2 font-semibold text-gray-900">{title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MRI Connection */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 p-10 sm:p-14">
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-300">
                  <span className="inline-block size-1.5 animate-pulse rounded-full bg-blue-400" />
                  Mabrig Research Institute
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Publish Through MRI&apos;s<br />
                  <span className="text-yellow-300">Recognized Series</span>
                </h2>
                <p className="mt-4 text-base leading-relaxed text-slate-300">
                  MRI publishes peer-reviewed working papers, policy briefs, research reports, and books under its institutional banner — giving your work credibility, reach, and recognition across African academia and policy circles.
                </p>
                <div className="mt-6 space-y-3">
                  {[
                    'MRI Working Papers Series (ISSN-registered)',
                    'MRI Policy Briefs for government and NGO audiences',
                    'MRI Research Reports — applied, field-based studies',
                    'MRI Open Access Journals — rigorous peer review',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3 text-sm text-slate-300">
                      <CheckCircle className="size-4 shrink-0 text-yellow-300" />
                      {item}
                    </div>
                  ))}
                </div>
                <Link href="/mri/publications"
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-yellow-400 px-7 py-3 text-sm font-bold text-gray-900 transition-opacity hover:opacity-90">
                  View MRI Publications <ArrowRight className="size-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Working Papers', count: '40+', icon: '📄' },
                  { label: 'Policy Briefs', count: '25+', icon: '📋' },
                  { label: 'Research Reports', count: '18+', icon: '📊' },
                  { label: 'Journal Articles', count: '60+', icon: '📚' },
                ].map(({ label, count, icon }) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center">
                    <div className="mb-2 text-2xl">{icon}</div>
                    <div className="text-xl font-bold text-yellow-300">{count}</div>
                    <div className="mt-1 text-xs text-slate-400">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For researchers banner */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Users className="mx-auto mb-4 size-10 text-blue-700" />
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Built for Every African Researcher
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-gray-500">
            University-affiliated or independent, student or senior academic — AfriGrantPipeline and MRI provide the publishing infrastructure Africa&apos;s researchers deserve.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/signup"
              className="inline-flex items-center gap-2 rounded-full bg-blue-700 px-8 py-3.5 text-sm font-bold text-white transition-colors hover:bg-blue-800">
              Start Publishing Free <ArrowRight className="size-4" />
            </Link>
            <Link href="/pricing"
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-8 py-3.5 text-sm font-semibold text-gray-700 transition-colors hover:border-blue-200 hover:bg-blue-50">
              View Plans <ChevronRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
