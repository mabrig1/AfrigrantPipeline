import Link from 'next/link'
import {
  BookOpen, FileText, Microscope, Globe, Award, Users, ExternalLink,
  ArrowRight, Lightbulb, Quote, Mail, Twitter,
} from 'lucide-react'

// ── Data ────────────────────────────────────────────────────────────────────

const publications = [
  {
    title: 'Vision Suppression Theory: Understanding How Systems Neutralize Visionaries',
    type: 'Original Theory',
    year: '2024',
    description: 'A groundbreaking theoretical framework examining the systemic mechanisms — social, institutional, and psychological — that suppress visionary potential in African societies and global contexts.',
    tags: ['Leadership Theory', 'Organizational Behavior', 'African Studies'],
    badge: 'Original Theory',
    badgeColor: 'bg-purple-100 text-purple-700',
  },
  {
    title: 'The Metamorphosis Protocol: A Framework for Radical Personal Transformation',
    type: 'Framework Paper',
    year: '2024',
    description: 'A structured protocol for individuals seeking transformative change, drawing on behavioral science, spiritual intelligence, and strategic self-reinvention for African professionals.',
    tags: ['Behavioral Science', 'Personal Development', 'Transformation'],
    badge: 'Framework',
    badgeColor: 'bg-blue-100 text-blue-700',
  },
  {
    title: 'Faith-Based Research Funding: A Guide for Ministers, Churches, and Faith Entrepreneurs',
    type: 'Policy Paper',
    year: '2025',
    description: 'Mapping the largely invisible landscape of faith-aligned grant funding available to Nigerian churches, ministries, and religious NGOs across local and international platforms.',
    tags: ['Faith-Based Funding', 'NGO', 'Ministry Development'],
    badge: 'Policy Paper',
    badgeColor: 'bg-emerald-100 text-emerald-700',
  },
  {
    title: 'Grant Writing as Kingdom Ministry: How African Leaders Can Fund Their Vision',
    type: 'Practitioner Guide',
    year: '2025',
    description: 'A practical guide bridging spiritual vision and strategic grant acquisition for church leaders, faith-based organizations, and Christian researchers across Africa.',
    tags: ['Grant Writing', 'Kingdom Leadership', 'African Church'],
    badge: 'Practitioner Guide',
    badgeColor: 'bg-amber-100 text-amber-700',
  },
  {
    title: 'The Independent Researcher in Africa: Challenges, Strategies, and Emerging Pathways',
    type: 'Research Paper',
    year: '2026',
    description: 'An empirical examination of the unique challenges facing non-affiliated African researchers — from funding access to publication barriers — with a strategic framework for sustainable independent scholarship.',
    tags: ['Independent Research', 'African Academia', 'Research Methodology'],
    badge: 'Research Paper',
    badgeColor: 'bg-rose-100 text-rose-700',
  },
  {
    title: 'AfriGrantPipeline: Architecture of Africa\'s Research and Funding Infrastructure',
    type: 'Technical White Paper',
    year: '2026',
    description: 'A white paper documenting the design principles, platform architecture, and strategic rationale behind building Africa\'s first integrated research-funding-publishing ecosystem.',
    tags: ['Platform Architecture', 'Research Infrastructure', 'EdTech'],
    badge: 'White Paper',
    badgeColor: 'bg-indigo-100 text-indigo-700',
  },
]

const projects = [
  {
    title: 'Kingdom Impact Research Initiative',
    description: 'A long-term research program examining the intersection of faith, leadership, and social transformation in sub-Saharan Africa.',
    status: 'Active',
    phase: 'Phase 2 — Data Collection',
    icon: Lightbulb,
  },
  {
    title: 'African Independent Researcher Index (AIRI)',
    description: 'Building a database of non-affiliated researchers across Africa with their work, expertise, and funding needs — making them visible to funders.',
    status: 'Active',
    phase: 'Phase 1 — Design',
    icon: Microscope,
  },
  {
    title: 'Funding Equity in African Academia',
    description: 'A comparative study of grant access disparities between institutional and independent researchers across 15 African countries.',
    status: 'Planned',
    phase: 'Grant Seeking',
    icon: Globe,
  },
]

const researchAreas = [
  'Leadership & Visionary Theory',
  'Faith-Based Social Entrepreneurship',
  'Research Funding & Grant Ecosystems',
  'African Higher Education Policy',
  'Behavioral Science & Transformation',
  'Knowledge Production in the Global South',
  'Ministry & Church Development',
  'Independent Scholarship Methodology',
]

const presentations = [
  { title: 'Vision Suppression in African Organizations', event: 'African Leadership Summit', year: '2024', location: 'Lagos, Nigeria' },
  { title: 'Funding Your Faith: Grants for Nigerian Ministries', event: 'Church Entrepreneurs Forum', year: '2025', location: 'Abuja, Nigeria' },
  { title: 'The AfriGrantPipeline Model: Infrastructure for African Research', event: 'African Research Innovation Conference', year: '2026', location: 'Virtual' },
]

// ── Page ─────────────────────────────────────────────────────────────────────

export default function ResearchCenterPage() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-[#1E3A5F] to-[#0A5C36] text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-3">
            {/* Profile */}
            <div className="flex flex-col items-center lg:items-start">
              <div className="flex size-28 items-center justify-center rounded-3xl bg-white/20 text-4xl font-bold backdrop-blur-sm">
                MK
              </div>
              <div className="mt-4 text-center lg:text-left">
                <h1 className="text-2xl font-bold">Apostle Mabrig Korie</h1>
                <p className="mt-1 text-sm text-white/70">Researcher · Author · Platform Builder</p>
                <p className="mt-0.5 text-xs text-white/50">Nigeria</p>
              </div>
              <div className="mt-4 flex gap-3">
                <a href="mailto:kmabrig@gmail.com" className="flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs text-white transition-colors hover:bg-white/20">
                  <Mail className="size-3.5" /> Contact
                </a>
                <a href="https://store.mabrigkorie.org" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-full bg-yellow-400 px-4 py-2 text-xs font-bold text-gray-900 transition-opacity hover:opacity-90">
                  <ExternalLink className="size-3.5" /> Website
                </a>
              </div>
              {/* Stats */}
              <div className="mt-6 grid w-full grid-cols-3 gap-3">
                {[
                  { value: '6+', label: 'Publications' },
                  { value: '3', label: 'Projects' },
                  { value: '2', label: 'Theories' },
                ].map(({ value, label }) => (
                  <div key={label} className="rounded-xl border border-white/20 bg-white/10 py-3 text-center">
                    <div className="text-lg font-bold text-yellow-300">{value}</div>
                    <div className="text-xs text-white/60">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bio */}
            <div className="lg:col-span-2">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium">
                <Microscope className="size-4" /> Mabrig Korie Research Center
              </div>
              <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
                Africa&apos;s Research &<br />
                <span className="text-yellow-300">Kingdom Innovation Hub</span>
              </h2>
              <p className="text-lg leading-relaxed text-white/85">
                Apostle Mabrig Korie is a Nigerian researcher, author, and platform innovator whose work sits at the intersection of leadership theory, faith-based entrepreneurship, knowledge production, and research infrastructure in Africa.
              </p>
              <p className="mt-4 text-white/75">
                As the founder of AfriGrantPipeline, he has pioneered a new model for African research ecosystems — one that centers independent scholars, faith-based innovators, and non-institutional researchers who are systematically excluded from mainstream academic funding and publishing networks.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {researchAreas.slice(0, 4).map((area) => (
                  <div key={area} className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-center text-xs text-white/80">
                    {area}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Quote ── */}
      <section className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-4xl px-6 py-10 text-center">
          <Quote className="mx-auto mb-4 size-8 text-blue-200" />
          <blockquote className="text-xl font-semibold italic leading-relaxed text-gray-800">
            &quot;The African researcher does not lack intelligence, vision, or capacity. What has been suppressed is access — access to funding, platforms, networks, and the language of institutional power. AfriGrantPipeline is the infrastructure to end that suppression.&quot;
          </blockquote>
          <p className="mt-4 text-sm text-gray-500">— Apostle Mabrig Korie, Founder of AfriGrantPipeline</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 lg:grid-cols-3">

          {/* ── Main content ── */}
          <div className="lg:col-span-2 space-y-10">

            {/* Original Theories */}
            <div>
              <div className="mb-5 flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-xl bg-purple-100">
                  <Lightbulb className="size-5 text-purple-700" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Original Theories</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  {
                    name: 'Vision Suppression Theory',
                    shortDesc: 'How systems neutralize visionaries — a framework for understanding institutional and social resistance to exceptional vision.',
                    year: '2024',
                    color: 'border-purple-200 bg-purple-50',
                    textColor: 'text-purple-700',
                  },
                  {
                    name: 'Metamorphosis Protocol',
                    shortDesc: 'A structured framework for radical personal transformation, integrating behavioral science with spiritual intelligence.',
                    year: '2024',
                    color: 'border-blue-200 bg-blue-50',
                    textColor: 'text-blue-700',
                  },
                ].map((theory) => (
                  <div key={theory.name} className={`rounded-2xl border p-5 ${theory.color}`}>
                    <div className={`mb-2 text-xs font-bold uppercase tracking-wider ${theory.textColor}`}>Original Theory · {theory.year}</div>
                    <h3 className="mb-2 font-bold text-gray-900">{theory.name}</h3>
                    <p className="text-sm leading-relaxed text-gray-600">{theory.shortDesc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Publications */}
            <div>
              <div className="mb-5 flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-xl bg-blue-100">
                  <BookOpen className="size-5 text-blue-700" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Publications & Papers</h2>
              </div>
              <div className="space-y-4">
                {publications.map((pub) => (
                  <div key={pub.title} className="rounded-2xl border border-gray-200 bg-white p-5">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${pub.badgeColor}`}>{pub.badge}</span>
                      <span className="text-xs text-gray-400">{pub.year}</span>
                    </div>
                    <h3 className="mb-2 font-semibold leading-snug text-gray-900">{pub.title}</h3>
                    <p className="mb-3 text-sm leading-relaxed text-gray-600">{pub.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {pub.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">{tag}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Research Projects */}
            <div>
              <div className="mb-5 flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-100">
                  <Microscope className="size-5 text-emerald-700" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Active Research Projects</h2>
              </div>
              <div className="space-y-4">
                {projects.map((proj) => (
                  <div key={proj.title} className="rounded-2xl border border-gray-200 bg-white p-5">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        proj.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                      }`}>{proj.status}</span>
                      <span className="text-xs text-gray-400">{proj.phase}</span>
                    </div>
                    <h3 className="mb-1.5 font-semibold text-gray-900">{proj.title}</h3>
                    <p className="text-sm leading-relaxed text-gray-600">{proj.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Conference Presentations */}
            <div>
              <div className="mb-5 flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-xl bg-amber-100">
                  <Users className="size-5 text-amber-700" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Conference Presentations</h2>
              </div>
              <div className="space-y-3">
                {presentations.map((p) => (
                  <div key={p.title} className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-sm font-bold text-amber-700">
                      {p.year}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{p.title}</div>
                      <div className="text-sm text-gray-500">{p.event} · {p.location}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-6">

            {/* Research interests */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <h3 className="mb-4 font-bold text-gray-900">Research Interests</h3>
              <div className="flex flex-wrap gap-2">
                {researchAreas.map((area) => (
                  <span key={area} className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700">{area}</span>
                ))}
              </div>
            </div>

            {/* Collaborate CTA */}
            <div className="rounded-2xl border border-[#0A5C36]/20 bg-[#0A5C36]/5 p-5">
              <h3 className="mb-2 font-bold text-[#0A5C36]">Collaborate with Mabrig Korie</h3>
              <p className="mb-4 text-sm text-gray-600">
                Open to research partnerships, co-authored papers, keynote invitations, and grant collaboration opportunities.
              </p>
              <a href="mailto:kmabrig@gmail.com"
                className="flex items-center justify-center gap-2 rounded-xl bg-[#0A5C36] px-5 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90">
                <Mail className="size-4" /> Send Collaboration Request
              </a>
            </div>

            {/* AfriPublish CTA */}
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
              <h3 className="mb-2 font-bold text-blue-800">Publish Your Research</h3>
              <p className="mb-4 text-sm text-gray-600">
                Share your papers, theses, and reports on AfriPublish — Africa&apos;s open-access research repository.
              </p>
              <Link href="/articles"
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-800">
                <FileText className="size-4" /> Submit to AfriPublish <ArrowRight className="size-4" />
              </Link>
            </div>

            {/* Quote */}
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <Award className="mb-3 size-6 text-amber-600" />
              <p className="text-sm italic leading-relaxed text-amber-800">
                &quot;Independent research is not second-class scholarship. It is the frontier where the most urgent questions get asked — and the most ignored problems get solved.&quot;
              </p>
              <p className="mt-2 text-xs text-amber-600 font-medium">— Apostle Mabrig Korie</p>
            </div>

            {/* Social */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <h3 className="mb-3 font-bold text-gray-900">Connect</h3>
              <div className="space-y-2">
                <a href="mailto:kmabrig@gmail.com" className="flex items-center gap-3 rounded-xl border border-gray-100 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50">
                  <Mail className="size-4 text-gray-400" /> kmabrig@gmail.com
                </a>
                <a href="https://store.mabrigkorie.org" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-gray-100 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50">
                  <Globe className="size-4 text-gray-400" /> store.mabrigkorie.org
                </a>
                <a href="https://twitter.com/mabrigkorie" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-gray-100 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50">
                  <Twitter className="size-4 text-gray-400" /> @mabrigkorie
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
