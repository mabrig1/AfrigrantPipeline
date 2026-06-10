import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface SectionMeta {
  title: string
  description: string
  icon: string
  color: string
}

const sectionMap: Record<string, SectionMeta> = {
  'research-projects': {
    title: 'Research Projects',
    description:
      'Ongoing and completed research initiatives across health, agriculture, governance, and climate adaptation in Africa.',
    icon: '🔬',
    color: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  },
  'policy-briefs': {
    title: 'Policy Briefs',
    description:
      'Evidence-based policy recommendations for African governments, development agencies, and international organizations.',
    icon: '📋',
    color: 'bg-blue-50 border-blue-200 text-blue-700',
  },
  'working-papers': {
    title: 'Working Papers',
    description:
      'Pre-publication research findings shared with the academic community for feedback and peer review.',
    icon: '📄',
    color: 'bg-violet-50 border-violet-200 text-violet-700',
  },
  'research-reports': {
    title: 'Research Reports',
    description:
      'Comprehensive research reports with data, analysis, and actionable recommendations.',
    icon: '📊',
    color: 'bg-orange-50 border-orange-200 text-orange-700',
  },
  'research-fellows': {
    title: 'Research Fellows',
    description:
      'Meet our network of affiliated researchers, visiting scholars, and research associates.',
    icon: '👥',
    color: 'bg-sky-50 border-sky-200 text-sky-700',
  },
  'academic-partnerships': {
    title: 'Academic Partnerships',
    description:
      'Institutional partnerships with universities and research bodies across Africa and the diaspora.',
    icon: '🤝',
    color: 'bg-teal-50 border-teal-200 text-teal-700',
  },
  publications: {
    title: 'Publications',
    description:
      'Peer-reviewed articles, books, book chapters, and edited volumes from MRI researchers.',
    icon: '📚',
    color: 'bg-indigo-50 border-indigo-200 text-indigo-700',
  },
  'research-consulting': {
    title: 'Research Consulting',
    description:
      'Expert research design, data collection, analysis, and reporting for organizations and governments.',
    icon: '💡',
    color: 'bg-amber-50 border-amber-200 text-amber-700',
  },
  'monitoring-evaluation': {
    title: 'Monitoring & Evaluation',
    description:
      'Rigorous M&E frameworks, baseline studies, mid-term reviews, and impact evaluations.',
    icon: '📈',
    color: 'bg-rose-50 border-rose-200 text-rose-700',
  },
}

interface PageProps {
  params: Promise<{ section: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { section } = await params
  const meta = sectionMap[section]
  if (!meta) return { title: 'Not Found' }
  return {
    title: `${meta.title} | Mabrig Research Institute`,
    description: meta.description,
  }
}

export function generateStaticParams() {
  return Object.keys(sectionMap).map((section) => ({ section }))
}

export default async function MRISectionPage({ params }: PageProps) {
  const { section } = await params
  const meta = sectionMap[section]
  if (!meta) notFound()

  const allSections = Object.entries(sectionMap)
  const currentIndex = allSections.findIndex(([key]) => key === section)
  const relatedSections = allSections
    .filter(([key]) => key !== section)
    .slice(0, 3)

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Page header */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-gray-900 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/mri" className="hover:text-gray-900 transition-colors">
              MRI
            </Link>
            <span>/</span>
            <span className="font-medium text-gray-900">{meta.title}</span>
          </nav>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-3xl">
              {meta.icon}
            </div>
            <div>
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Mabrig Research Institute
              </div>
              <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">{meta.title}</h1>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-gray-500">
                {meta.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main content area */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Content placeholder */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm">
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                {meta.icon}
              </div>
              <h2 className="mb-2 text-xl font-semibold text-gray-900">
                Content Coming Soon
              </h2>
              <p className="mx-auto max-w-sm text-sm leading-relaxed text-gray-500">
                This section is actively being developed. Our team is compiling and
                curating high-quality{' '}
                <span className="font-medium text-gray-700">{meta.title.toLowerCase()}</span>{' '}
                content for you. Check back soon.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <Link
                  href="/mri"
                  className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                >
                  ← Back to MRI
                </Link>
                <Link
                  href="/mri/research-consulting"
                  className="rounded-2xl bg-yellow-400 px-5 py-2.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-yellow-300"
                >
                  Engage MRI
                </Link>
              </div>
            </div>

            {/* What to expect */}
            <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                What to Expect in This Section
              </h3>
              <div className="space-y-3">
                {getExpectations(section).map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 size-5 shrink-0 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-700">{i + 1}</span>
                    </div>
                    <p className="text-sm leading-relaxed text-gray-600">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Section index */}
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
                MRI Sections
              </h3>
              <nav className="space-y-1">
                {allSections.map(([key, s]) => (
                  <Link
                    key={key}
                    href={`/mri/${key}`}
                    className={[
                      'flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors',
                      key === section
                        ? 'bg-slate-900 text-white font-medium'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                    ].join(' ')}
                  >
                    <span className="text-base leading-none">{s.icon}</span>
                    {s.title}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Contact prompt */}
            <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-700 to-slate-900 p-6 text-white shadow-sm">
              <div className="mb-3 text-2xl">📬</div>
              <h3 className="mb-2 text-base font-semibold">Interested in Collaborating?</h3>
              <p className="mb-4 text-sm leading-relaxed text-blue-200">
                MRI welcomes partnerships with researchers, institutions, and
                organizations aligned with our mission.
              </p>
              <Link
                href="/mri/research-consulting"
                className="inline-flex w-full items-center justify-center rounded-xl bg-yellow-400 py-2.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-yellow-300"
              >
                Get in Touch
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* Related sections */}
      {relatedSections.length > 0 && (
        <section className="border-t border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-12">
            <h2 className="mb-6 text-xl font-semibold text-gray-900">Explore More from MRI</h2>
            <div className="grid gap-5 sm:grid-cols-3">
              {relatedSections.map(([key, s]) => (
                <Link
                  key={key}
                  href={`/mri/${key}`}
                  className="group flex items-start gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-5 transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white hover:shadow-md"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-xl">
                    {s.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-700">
                      {s.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-gray-500 line-clamp-2">
                      {s.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}

function getExpectations(section: string): string[] {
  const map: Record<string, string[]> = {
    'research-projects': [
      'A searchable directory of ongoing and completed research initiatives with project summaries, timelines, and lead researchers.',
      'Detailed project pages covering objectives, methodology, geographic focus, and key partners.',
      'Progress updates, interim findings, and links to associated publications or reports.',
    ],
    'policy-briefs': [
      'Concise, accessible briefs translating complex research into targeted policy recommendations.',
      'Briefs organized by thematic area: governance, health, climate, agriculture, and digital economy.',
      'Downloadable PDFs suitable for policymakers, legislators, and development practitioners.',
    ],
    'working-papers': [
      'Pre-publication drafts open for community feedback, peer input, and academic engagement.',
      'Papers spanning diverse disciplines and African regions, with author contact information.',
      'A submission portal for affiliated MRI researchers to share works-in-progress.',
    ],
    'research-reports': [
      'Full-length reports presenting comprehensive data, methodology, findings, and recommendations.',
      'Reports commissioned by governments, NGOs, multilateral organizations, and private sector clients.',
      'Executive summaries and data annexes available alongside full report downloads.',
    ],
    'research-fellows': [
      'Profiles of affiliated researchers, visiting scholars, and postdoctoral research associates.',
      'Information on MRI fellowship programs, eligibility criteria, and application processes.',
      'A network map showing fellows\' institutional affiliations and geographic distribution.',
    ],
    'academic-partnerships': [
      'A directory of partner universities and research institutions across Africa and globally.',
      'Details on joint degree programs, faculty exchanges, and collaborative research grants.',
      'Partnership application pathways for universities seeking to engage with MRI.',
    ],
    publications: [
      'A curated database of peer-reviewed journal articles, book chapters, and monographs.',
      'Open-access and subscription-based publications organized by theme, author, and year.',
      'Citation metrics, altmetrics, and links to publisher pages or preprint repositories.',
    ],
    'research-consulting': [
      'An overview of MRI\'s consulting services including research design, data collection, and analysis.',
      'Case studies from previous consulting engagements with governments and development organizations.',
      'A request-for-proposal (RFP) portal for organizations seeking MRI\'s technical expertise.',
    ],
    'monitoring-evaluation': [
      'Details on MRI\'s M&E services including theory of change, KPI frameworks, and evaluation design.',
      'Case studies of completed baseline studies, mid-term reviews, and final impact evaluations.',
      'Tools and templates for M&E practitioners, available for download under open license.',
    ],
  }
  return (
    map[section] ?? [
      'Detailed content and resources for this section are being prepared.',
      'Check back soon for updates from the MRI team.',
    ]
  )
}
