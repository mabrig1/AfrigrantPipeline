'use client'

import { useState } from 'react'
import {
  FileText, BarChart3, BookOpen, User, Edit3, Brain, Search,
  ArrowRight, CheckCircle, Star, ExternalLink, Clock, Shield,
  ChevronDown, ChevronUp, Sparkles, MessageSquare,
} from 'lucide-react'

// ── Data ─────────────────────────────────────────────────────────────────────

interface Service {
  id: string
  icon: React.ComponentType<{ className?: string }>
  category: string
  title: string
  description: string
  price: string
  priceRange: string
  turnaround: string
  badge?: string
  badgeColor?: string
  popular?: boolean
  features: string[]
  deliverables: string[]
}

const SERVICES: Service[] = [
  {
    id: 'research-proposal',
    icon: FileText,
    category: 'Grant Writing',
    title: 'Research Proposal Writing',
    description: 'Full proposal development from concept to submission-ready document. Aligned with funder guidelines — TETFund, World Bank, Commonwealth, Gates, and more.',
    price: '₦45,000',
    priceRange: '₦45,000 – ₦120,000',
    turnaround: '5–7 business days',
    badge: 'Best Seller',
    badgeColor: 'bg-blue-700 text-white',
    popular: true,
    features: [
      'Full proposal narrative (background, objectives, methodology)',
      'Budget development and justification',
      'M&E framework and logframe',
      'TETFund NRF/IBR voice calibration available',
      'Unlimited revisions for 14 days',
    ],
    deliverables: ['Complete proposal document', 'Budget spreadsheet', 'M&E framework', 'Executive summary'],
  },
  {
    id: 'data-analysis',
    icon: BarChart3,
    category: 'Research Services',
    title: 'Data Analysis & Statistics',
    description: 'SPSS, R, STATA, and Python-based statistical analysis for academic and applied research. Descriptive, inferential, and advanced modeling.',
    price: '₦25,000',
    priceRange: '₦25,000 – ₦80,000',
    turnaround: '3–5 business days',
    features: [
      'Descriptive & inferential statistics',
      'Regression, ANOVA, factor analysis',
      'Data cleaning and management',
      'Results interpretation and write-up',
      'Charts and visualizations',
    ],
    deliverables: ['Analysis results file', 'Interpretation report', 'Publication-ready charts', 'SPSS/R output files'],
  },
  {
    id: 'journal-support',
    icon: BookOpen,
    category: 'Publishing',
    title: 'Journal Submission Support',
    description: 'From journal selection to submission-ready manuscript preparation. We format, proofread, and submit to African and international peer-reviewed journals.',
    price: '₦20,000',
    priceRange: '₦20,000 – ₦55,000',
    turnaround: '48–72 hours',
    features: [
      'Journal suitability assessment',
      'Manuscript formatting to journal style',
      'Cover letter writing',
      'Response to reviewer comments',
      'DOI registration assistance',
    ],
    deliverables: ['Formatted manuscript', 'Cover letter', 'Journal shortlist report'],
  },
  {
    id: 'cv-optimization',
    icon: User,
    category: 'Career Development',
    title: 'Academic CV & Profile Optimization',
    description: 'Craft a competitive academic CV, LinkedIn profile, ORCID setup, and Google Scholar profile for fellowship and grant applications.',
    price: '₦12,000',
    priceRange: '₦12,000 – ₦30,000',
    turnaround: '24–48 hours',
    features: [
      'Academic CV rewrite',
      'LinkedIn optimization',
      'ORCID & Google Scholar setup',
      'Research statement drafting',
      'Personal statement for fellowships',
    ],
    deliverables: ['Polished CV document', 'Optimized LinkedIn summary', 'Research statement'],
  },
  {
    id: 'humanized-editing',
    icon: Edit3,
    category: 'Writing Lab',
    title: 'Humanized Academic Editing',
    description: 'Transform AI-generated academic drafts into authentic, detector-resistant scholarly writing. See our full Writing Lab for complete package options.',
    price: '₦8,000',
    priceRange: '₦8,000 – ₦45,000',
    turnaround: '24–48 hours',
    badge: 'High Demand',
    badgeColor: 'bg-indigo-600 text-white',
    features: [
      'AI-to-human voice conversion',
      'AI detector bypass (Turnitin, GPTZero)',
      'Grammar and academic clarity',
      'Readability score improvement',
      'Plagiarism check included',
    ],
    deliverables: ['Humanized document', 'Detection score report', 'Readability analysis'],
  },
  {
    id: 'literature-review',
    icon: Search,
    category: 'Research Services',
    title: 'Literature Review Writing',
    description: 'Comprehensive, thematic literature review with synthesis, critique, and gap identification. Ideal for thesis chapters and journal papers.',
    price: '₦30,000',
    priceRange: '₦30,000 – ₦75,000',
    turnaround: '5–7 business days',
    features: [
      'Systematic literature search',
      'Thematic synthesis and critique',
      'Research gap identification',
      'Proper citation formatting',
      'Reference management file',
    ],
    deliverables: ['Full literature review chapter', 'Annotated bibliography', 'Conceptual framework diagram'],
  },
  {
    id: 'grant-coaching',
    icon: MessageSquare,
    category: 'Coaching',
    title: 'Grant Writing Coaching (1-on-1)',
    description: 'Personalized coaching sessions with an experienced grant writer. Learn the strategy, not just the writing — and apply for grants with confidence.',
    price: '₦15,000',
    priceRange: '₦15,000 / session',
    turnaround: 'Scheduled 60-min session',
    badge: 'New',
    badgeColor: 'bg-emerald-600 text-white',
    features: [
      '60-minute Zoom/WhatsApp session',
      'Grant opportunity identification',
      'Proposal structure walkthrough',
      'Budget planning basics',
      'Session recording provided',
    ],
    deliverables: ['Session notes & action plan', 'Grant opportunity shortlist', 'Template starter pack'],
  },
  {
    id: 'ai-tools',
    icon: Sparkles,
    category: 'AI Tools',
    title: 'AI Proposal Generator (Self-Service)',
    description: 'Use our built-in AI to generate proposal drafts, abstracts, and research outlines. Available in your dashboard — no external tools needed.',
    price: 'Free for Gold+',
    priceRange: 'Included in Gold & Platinum plans',
    turnaround: 'Instant',
    features: [
      'Proposal introduction generator',
      'Abstract improver',
      'Methodology planner',
      'Budget builder',
      'Grant match assistant',
    ],
    deliverables: ['AI-generated draft', 'Editable document'],
  },
]

const categories = ['All', ...Array.from(new Set(SERVICES.map((s) => s.category)))]

const testimonials = [
  {
    name: 'Dr. Aisha Bello',
    role: 'Senior Lecturer, University of Abuja',
    text: 'AfriGrantPipeline\'s proposal writing team helped me secure a TETFund NRF grant on my first application. Worth every naira.',
    avatar: 'AB',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    name: 'Emeka Okonkwo',
    role: 'PhD Candidate, UNILAG',
    text: 'The humanized editing service turned my ChatGPT-assisted thesis chapter into something my supervisor praised as "impressively well-written."',
    avatar: 'EO',
    color: 'bg-purple-100 text-purple-700',
  },
  {
    name: 'Blessing Adeyemi',
    role: 'NGO Director, Lagos',
    text: 'We\'ve used three services — data analysis, journal support, and CV optimization. The quality matches what international consultants charge 10× for.',
    avatar: 'BA',
    color: 'bg-emerald-100 text-emerald-700',
  },
]

// ── Page ─────────────────────────────────────────────────────────────────────

function ServicesPageInner() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [selected, setSelected] = useState<Service | null>(null)

  const filtered = activeCategory === 'All'
    ? SERVICES
    : SERVICES.filter((s) => s.category === activeCategory)

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero ── */}
      <section className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700">
                <Brain className="size-4" /> Research Services Marketplace
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Expert Research<br />
                <span className="text-blue-700">Services for Africa</span>
              </h1>
              <p className="mt-5 text-lg text-gray-500">
                Proposal writing, data analysis, journal support, editing, and coaching — all from verified African academics and research professionals.
              </p>
              <div className="mt-6 grid grid-cols-3 gap-4">
                {[
                  { value: '8+', label: 'Services' },
                  { value: '150+', label: 'Clients Served' },
                  { value: '4.9★', label: 'Average Rating' },
                ].map(({ value, label }) => (
                  <div key={label} className="rounded-2xl border border-gray-200 bg-gray-50 py-4 text-center">
                    <div className="text-xl font-bold text-blue-700">{value}</div>
                    <div className="text-xs text-gray-500">{label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Shield className="size-4 text-blue-700" /> How It Works
              </div>
              <ol className="space-y-4">
                {[
                  'Browse our service catalogue and select what you need',
                  'Click "Request Service" and describe your project',
                  'We match you with the right expert within 24 hours',
                  'Receive your deliverables with unlimited support',
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-700 text-xs font-bold text-white">{i + 1}</span>
                    <span className="text-sm text-gray-600">{step}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                <strong>Payment:</strong> Secure via Paystack. Pay after scoping call — no upfront commitment for larger projects.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Category filter ── */}
      <div className="sticky top-16 z-30 bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-6 py-3">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-blue-700 text-white'
                    : 'border border-gray-200 bg-white text-gray-600 hover:border-blue-200 hover:text-blue-700'
                }`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Service grid ── */}
      <div className="mx-auto max-w-7xl px-6 py-10">
        <p className="mb-6 text-sm text-gray-500">{filtered.length} services found</p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((s) => (
            <div key={s.id}
              className={`relative flex flex-col rounded-3xl border bg-white p-5 transition-all hover:-translate-y-1 hover:shadow-lg ${s.popular ? 'border-blue-300 ring-2 ring-blue-100' : 'border-gray-200'}`}>
              {s.badge && (
                <div className={`absolute -top-3 left-4 rounded-full px-3 py-1 text-xs font-bold ${s.badgeColor}`}>{s.badge}</div>
              )}
              <div className="mb-3 flex items-start justify-between gap-2">
                <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50">
                  <s.icon className="size-5 text-blue-700" />
                </div>
                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">{s.category}</span>
              </div>
              <h3 className="mb-1.5 font-bold text-gray-900">{s.title}</h3>
              <p className="mb-3 flex-1 text-xs leading-relaxed text-gray-500">{s.description}</p>
              <div className="mb-4 space-y-1">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Star className="size-3.5 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold text-gray-900">{s.price}</span>
                  <span className="text-gray-400">· {s.priceRange}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Clock className="size-3" /> {s.turnaround}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelected(s)}
                  className="flex-1 rounded-xl border border-gray-200 bg-gray-50 py-2 text-xs font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700">
                  Details
                </button>
                <a href="/dashboard"
                  className="flex-1 rounded-xl bg-blue-700 py-2 text-center text-xs font-bold text-white transition-opacity hover:opacity-90">
                  Request
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Commission note */}
        <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-5 text-sm text-gray-600">
          <div className="flex items-start gap-3">
            <Shield className="size-5 shrink-0 text-blue-700 mt-0.5" />
            <div>
              <span className="font-semibold text-gray-900">Platform Trust & Quality:</span> AfriGrantPipeline connects you with vetted African research professionals. A 10–20% platform fee is included in all prices to cover quality assurance, support, and escrow protection. You pay the listed price — nothing extra.
            </div>
          </div>
        </div>
      </div>

      {/* ── Testimonials ── */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-900">What Clients Say</h2>
          <div className="grid gap-5 sm:grid-cols-3">
            {testimonials.map(({ name, role, text, avatar, color }) => (
              <div key={name} className="rounded-3xl border border-gray-200 bg-gray-50 p-6">
                <div className="mb-4 flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="size-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="mb-4 text-sm italic leading-relaxed text-gray-700">&quot;{text}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className={`flex size-9 items-center justify-center rounded-full text-xs font-bold ${color}`}>{avatar}</div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{name}</div>
                    <div className="text-xs text-gray-500">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-blue-700 py-14">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-3xl font-bold text-white">Need help with your research?</h2>
          <p className="mt-3 text-blue-100">Not sure which service fits? Book a free 15-minute consultation and we&apos;ll point you in the right direction.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a href="mailto:kmabrig@gmail.com"
              className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-7 py-3 text-sm font-bold text-gray-900 transition-opacity hover:opacity-90">
              Book Free Consultation <ArrowRight className="size-4" />
            </a>
            <a href="/writing-lab"
              className="inline-flex items-center gap-2 rounded-full border border-blue-400 px-7 py-3 text-sm font-semibold text-white hover:bg-blue-600">
              Explore Writing Lab <ExternalLink className="size-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ── Detail modal ── */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={() => setSelected(null)}>
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6"
            onClick={(e) => e.stopPropagation()}>
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <div className="mb-1 text-xs font-semibold uppercase text-blue-700">{selected.category}</div>
                <h2 className="text-xl font-bold text-gray-900">{selected.title}</h2>
              </div>
              <button onClick={() => setSelected(null)} className="rounded-full p-2 hover:bg-gray-100 text-gray-500 text-xl leading-none">×</button>
            </div>
            <div className="mb-4 rounded-2xl bg-blue-50 border border-blue-100 p-4">
              <div className="text-lg font-bold text-blue-700">{selected.priceRange}</div>
              <div className="text-sm text-gray-500 mt-0.5"><Clock className="inline size-3.5 mr-1" />{selected.turnaround}</div>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-gray-700">{selected.description}</p>
            <div className="mb-4">
              <h3 className="mb-2 font-semibold text-gray-900 text-sm">What&apos;s Included</h3>
              <ul className="space-y-1.5">
                {selected.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="mt-0.5 size-4 shrink-0 text-blue-700" />{f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-5">
              <h3 className="mb-2 font-semibold text-gray-900 text-sm">Deliverables</h3>
              <ul className="space-y-1.5">
                {selected.deliverables.map((d) => (
                  <li key={d} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="mt-1 size-1.5 shrink-0 rounded-full bg-blue-700" />{d}
                  </li>
                ))}
              </ul>
            </div>
            <a href="/dashboard"
              className="block rounded-2xl bg-blue-700 py-3 text-center text-sm font-bold text-white transition-opacity hover:opacity-90">
              Request This Service <ArrowRight className="inline size-4" />
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

import SubscriptionGuard from '@/components/SubscriptionGuard'
export default function ServicesPage() { return <SubscriptionGuard><ServicesPageInner /></SubscriptionGuard> }
