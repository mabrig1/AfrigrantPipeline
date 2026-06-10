import Link from 'next/link'

const sections = [
  {
    href: '/mri/research-projects',
    icon: '🔬',
    title: 'Research Projects',
    description:
      'Ongoing and completed research initiatives across health, agriculture, governance, and climate adaptation in Africa.',
  },
  {
    href: '/mri/policy-briefs',
    icon: '📋',
    title: 'Policy Briefs',
    description:
      'Evidence-based policy recommendations for African governments, development agencies, and international organizations.',
  },
  {
    href: '/mri/working-papers',
    icon: '📄',
    title: 'Working Papers',
    description:
      'Pre-publication research findings shared with the academic community for feedback and peer review.',
  },
  {
    href: '/mri/research-reports',
    icon: '📊',
    title: 'Research Reports',
    description:
      'Comprehensive research reports with data, analysis, and actionable recommendations.',
  },
  {
    href: '/mri/research-fellows',
    icon: '👥',
    title: 'Research Fellows',
    description:
      'Meet our network of affiliated researchers, visiting scholars, and research associates.',
  },
  {
    href: '/mri/academic-partnerships',
    icon: '🤝',
    title: 'Academic Partnerships',
    description:
      'Institutional partnerships with universities and research bodies across Africa and the diaspora.',
  },
  {
    href: '/mri/publications',
    icon: '📚',
    title: 'Publications',
    description:
      'Peer-reviewed articles, books, book chapters, and edited volumes from MRI researchers.',
  },
  {
    href: '/mri/research-consulting',
    icon: '💡',
    title: 'Research Consulting',
    description:
      'Expert research design, data collection, analysis, and reporting for organizations and governments.',
  },
  {
    href: '/mri/monitoring-evaluation',
    icon: '📈',
    title: 'Monitoring & Evaluation',
    description:
      'Rigorous M&E frameworks, baseline studies, mid-term reviews, and impact evaluations.',
  },
]

const stats = [
  { value: '40+', label: 'Research Projects' },
  { value: '120+', label: 'Publications' },
  { value: '18', label: 'African Countries' },
  { value: '60+', label: 'Research Fellows' },
]

export const metadata = {
  title: 'Mabrig Research Institute | AfriGrant Pipeline',
  description:
    'The Mabrig Research Institute (MRI) is a leading African think tank producing rigorous, policy-relevant research to drive sustainable development across the continent.',
}

export default function MRIPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-blue-900 text-white">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-300">
              <span className="size-1.5 rounded-full bg-blue-400" />
              Mabrig Research Institute
            </div>
            <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
              African Research.{' '}
              <span className="text-yellow-400">Global Impact.</span>
            </h1>
            <p className="mb-8 text-lg leading-relaxed text-slate-300 md:text-xl">
              The Mabrig Research Institute (MRI) is an independent African think tank
              committed to producing rigorous, evidence-based research that informs
              policy, drives innovation, and accelerates sustainable development across
              the continent. We bridge the gap between knowledge and action.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/mri/research-projects"
                className="inline-flex items-center gap-2 rounded-2xl bg-yellow-400 px-6 py-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-yellow-300"
              >
                Explore Research
                <span aria-hidden>→</span>
              </Link>
              <Link
                href="/mri/publications"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/20"
              >
                View Publications
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map(({ value, label }) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-center">
                <div className="text-3xl font-bold text-yellow-400">{value}</div>
                <div className="mt-1 text-sm text-slate-400">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission strip */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: '🎯',
                heading: 'Our Mission',
                body: 'To generate and translate rigorous knowledge into policies and practices that improve lives across Africa.',
              },
              {
                icon: '🌍',
                heading: 'Our Reach',
                body: 'Active research partnerships spanning 18 African countries, with collaboration networks in Europe, North America, and Asia.',
              },
              {
                icon: '🔑',
                heading: 'Our Approach',
                body: 'Interdisciplinary, participatory, and locally-rooted research that centers African agency and elevates African expertise.',
              },
            ].map(({ icon, heading, body }) => (
              <div key={heading} className="flex gap-4">
                <span className="text-3xl">{icon}</span>
                <div>
                  <h3 className="mb-1 text-base font-semibold text-gray-900">{heading}</h3>
                  <p className="text-sm leading-relaxed text-gray-500">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sections grid */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Research Areas & Resources
          </h2>
          <p className="mt-2 text-gray-500">
            Explore MRI&apos;s full portfolio of research outputs, expertise, and engagement opportunities.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map(({ href, icon, title, description }) => (
            <Link
              key={href}
              href={href}
              className="group flex flex-col rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
            >
              <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-slate-900 text-2xl">
                {icon}
              </div>
              <h3 className="mb-2 text-base font-semibold text-gray-900 group-hover:text-blue-700">
                {title}
              </h3>
              <p className="flex-1 text-sm leading-relaxed text-gray-500">{description}</p>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-blue-700">
                Explore
                <span
                  aria-hidden
                  className="transition-transform group-hover:translate-x-1"
                >
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-slate-900 to-blue-900">
        <div className="mx-auto max-w-7xl px-6 py-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">
            Partner with MRI
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-slate-300">
            Whether you are a government agency, development organization, university,
            or private sector entity, MRI offers tailored research partnerships,
            consulting, and M&amp;E services.
          </p>
          <Link
            href="/mri/research-consulting"
            className="inline-flex items-center gap-2 rounded-2xl bg-yellow-400 px-8 py-3.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-yellow-300"
          >
            Engage MRI
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>
    </main>
  )
}
