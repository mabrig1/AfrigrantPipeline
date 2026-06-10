'use client'

import { useState } from 'react'
import {
  Search, Star, MapPin, BookOpen, CheckCircle, Filter,
  ArrowRight, Users, Award, MessageSquare, ExternalLink,
} from 'lucide-react'

// ── Data ─────────────────────────────────────────────────────────────────────

interface Expert {
  id: string
  name: string
  title: string
  institution: string
  location: string
  avatar: string
  avatarColor: string
  expertise: string[]
  specialization: string
  rating: number
  reviews: number
  projects: number
  availability: 'Available' | 'Busy' | 'Limited'
  tier: 'Standard' | 'Featured' | 'Premium'
  bio: string
  services: string[]
  rate: string
}

const EXPERTS: Expert[] = [
  {
    id: 'draobi',
    name: 'Dr. Adaeze Obi',
    title: 'Research Consultant & Grant Writer',
    institution: 'Independent / UNILAG Affiliate',
    location: 'Lagos, Nigeria',
    avatar: 'AO',
    avatarColor: 'bg-blue-100 text-blue-700',
    expertise: ['Grant Writing', 'Development Research', 'M&E'],
    specialization: 'TETFund NRF/IBR, World Bank, and NGO proposals',
    rating: 4.9,
    reviews: 47,
    projects: 62,
    availability: 'Available',
    tier: 'Premium',
    bio: 'Former TETFund proposal assessor with 12 years of experience writing winning research grants for Nigerian academics and institutions. Specializes in NRF and IBR applications.',
    services: ['Research Proposal Writing', 'Grant Coaching', 'Budget Development', 'M&E Framework'],
    rate: '₦45,000/proposal',
  },
  {
    id: 'profkanu',
    name: 'Prof. Emmanuel Kanu',
    title: 'Professor of Statistics & Data Science',
    institution: 'University of Nigeria, Nsukka',
    location: 'Enugu, Nigeria',
    avatar: 'EK',
    avatarColor: 'bg-purple-100 text-purple-700',
    expertise: ['Data Analysis', 'SPSS', 'R', 'Academic Statistics'],
    specialization: 'Quantitative research methods and statistical consulting',
    rating: 5.0,
    reviews: 89,
    projects: 134,
    availability: 'Limited',
    tier: 'Premium',
    bio: 'Professor of Statistics with over 200 published papers. Available for PhD/Masters statistical consultancy, data analysis, and methodology review.',
    services: ['Data Analysis', 'SPSS/R Consulting', 'Research Methodology', 'Statistics Teaching'],
    rate: '₦30,000/project',
  },
  {
    id: 'drbello',
    name: 'Dr. Fatima Bello',
    title: 'Academic Editor & Publishing Consultant',
    institution: 'Ahmadu Bello University (Ret.)',
    location: 'Kaduna, Nigeria',
    avatar: 'FB',
    avatarColor: 'bg-emerald-100 text-emerald-700',
    expertise: ['Academic Editing', 'Journal Publishing', 'Manuscript Preparation'],
    specialization: 'African journal submissions and Elsevier/Springer manuscripts',
    rating: 4.8,
    reviews: 63,
    projects: 95,
    availability: 'Available',
    tier: 'Featured',
    bio: 'Expert academic editor who has guided 95+ researchers through the journal publication process. Strong network with AJOL, Elsevier, and Springer editorial boards.',
    services: ['Journal Support', 'Manuscript Editing', 'Peer Review Coaching', 'DOI Registration'],
    rate: '₦20,000/manuscript',
  },
  {
    id: 'mrsadeyemi',
    name: 'Mrs. Chisom Adeyemi',
    title: 'Grant Writing Specialist (NGO & Faith Sector)',
    institution: 'AfriGrant Consulting',
    location: 'Abuja, Nigeria',
    avatar: 'CA',
    avatarColor: 'bg-amber-100 text-amber-700',
    expertise: ['NGO Grants', 'Faith-Based Funding', 'Community Development'],
    specialization: 'EU, USAID, Gates Foundation, and faith-aligned grant applications',
    rating: 4.7,
    reviews: 38,
    projects: 51,
    availability: 'Available',
    tier: 'Featured',
    bio: 'Specialist in faith-based and community development grant writing. Has secured over $2M in funding for churches, NGOs, and faith-linked development organizations across Nigeria.',
    services: ['NGO Proposal Writing', 'Faith-Based Grants', 'Community Development', 'Donor Reporting'],
    rate: '₦35,000/proposal',
  },
  {
    id: 'drtunde',
    name: 'Dr. Rotimi Tunde',
    title: 'Research Methodology & Academic Writing Coach',
    institution: 'Lagos Business School',
    location: 'Lagos, Nigeria',
    avatar: 'RT',
    avatarColor: 'bg-rose-100 text-rose-700',
    expertise: ['Research Methodology', 'Academic Writing', 'Thesis Coaching'],
    specialization: 'PhD dissertation coaching and qualitative research design',
    rating: 4.9,
    reviews: 55,
    projects: 78,
    availability: 'Limited',
    tier: 'Featured',
    bio: 'Business school lecturer and research coach helping PhD and Masters students design, execute, and write up research to international publication standards.',
    services: ['1-on-1 Research Coaching', 'Dissertation Review', 'Literature Review', 'Qualitative Methods'],
    rate: '₦15,000/session',
  },
  {
    id: 'msibrahim',
    name: 'Aisha Ibrahim',
    title: 'Statistical Analyst & SPSS Trainer',
    institution: 'Freelance',
    location: 'Kano, Nigeria',
    avatar: 'AI',
    avatarColor: 'bg-indigo-100 text-indigo-700',
    expertise: ['SPSS', 'Data Entry', 'Survey Analysis', 'Excel Modeling'],
    specialization: 'Survey-based research and dissertation data analysis',
    rating: 4.6,
    reviews: 29,
    projects: 44,
    availability: 'Available',
    tier: 'Standard',
    bio: 'Certified SPSS trainer offering fast, affordable data analysis for undergraduate and postgraduate students. Strong in questionnaire design and interpretation write-up.',
    services: ['SPSS Analysis', 'Data Entry & Cleaning', 'Survey Design', 'Results Write-up'],
    rate: '₦10,000/project',
  },
]

const EXPERTISE_FILTERS = ['All', 'Grant Writing', 'Data Analysis', 'Academic Editing', 'Coaching', 'NGO Grants', 'Statistics']
const AVAILABILITY_FILTERS = ['All', 'Available', 'Limited', 'Busy']

const TIER_STYLES: Record<string, string> = {
  Premium: 'bg-blue-100 text-blue-700 border border-blue-200',
  Featured: 'bg-amber-100 text-amber-700 border border-amber-200',
  Standard: 'bg-gray-100 text-gray-600 border border-gray-200',
}

const AVAIL_STYLES: Record<string, string> = {
  Available: 'bg-emerald-100 text-emerald-700',
  Limited: 'bg-amber-100 text-amber-700',
  Busy: 'bg-gray-100 text-gray-500',
}

// ── Page ─────────────────────────────────────────────────────────────────────

function ExpertsPageInner() {
  const [search, setSearch] = useState('')
  const [expertiseFilter, setExpertiseFilter] = useState('All')
  const [availFilter, setAvailFilter] = useState('All')
  const [selected, setSelected] = useState<Expert | null>(null)

  const filtered = EXPERTS.filter((e) => {
    if (availFilter !== 'All' && e.availability !== availFilter) return false
    if (expertiseFilter !== 'All' && !e.expertise.some((x) => x.toLowerCase().includes(expertiseFilter.toLowerCase()))) return false
    if (search) {
      const q = search.toLowerCase()
      if (!e.name.toLowerCase().includes(q) && !e.specialization.toLowerCase().includes(q) && !e.expertise.some((x) => x.toLowerCase().includes(q))) return false
    }
    return true
  })

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero ── */}
      <section className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700">
            <Users className="size-4" /> Expert Directory
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Find Verified African<br />
            <span className="text-blue-700">Research Experts</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-500">
            Connect with vetted Nigerian and African academics, grant writers, statisticians, and editors — ready to support your research and funding journey.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            {[
              { value: `${EXPERTS.length}+`, label: 'Verified Experts', icon: CheckCircle },
              { value: '4.8★', label: 'Average Rating', icon: Star },
              { value: '450+', label: 'Projects Completed', icon: Award },
            ].map(({ value, label, icon: Icon }) => (
              <div key={label} className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5">
                <Icon className="size-4 text-blue-700" />
                <span className="text-sm font-bold text-blue-700">{value}</span>
                <span className="text-xs text-gray-500">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Filters ── */}
      <div className="sticky top-16 z-30 bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-6 py-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-48 flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search experts or expertise…"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-sm focus:border-blue-300 focus:outline-none"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {EXPERTISE_FILTERS.map((f) => (
                <button key={f} onClick={() => setExpertiseFilter(f)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                    expertiseFilter === f ? 'bg-blue-700 text-white' : 'border border-gray-200 text-gray-600 hover:border-blue-200 hover:text-blue-700'
                  }`}>{f}</button>
              ))}
            </div>
            <select
              value={availFilter}
              onChange={(e) => setAvailFilter(e.target.value)}
              className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-700 focus:outline-none">
              {AVAILABILITY_FILTERS.map((f) => <option key={f} value={f}>{f === 'All' ? 'All Availability' : f}</option>)}
            </select>
          </div>
          <p className="mt-2 text-xs text-gray-400">
            <Filter className="inline size-3 mr-1" />
            {filtered.length} expert{filtered.length !== 1 ? 's' : ''} found
          </p>
        </div>
      </div>

      {/* ── Expert grid ── */}
      <div className="mx-auto max-w-7xl px-6 py-10">
        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-gray-200 bg-white py-16 text-center">
            <Users className="mx-auto mb-3 size-12 text-gray-200" />
            <p className="text-gray-500">No experts match your filters.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((e) => (
              <div key={e.id}
                className={`flex flex-col rounded-3xl border bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-lg ${
                  e.tier === 'Premium' ? 'border-blue-300 ring-2 ring-blue-50' :
                  e.tier === 'Featured' ? 'border-amber-200' : 'border-gray-200'
                }`}>
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`flex size-12 items-center justify-center rounded-2xl text-sm font-bold ${e.avatarColor}`}>
                      {e.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 leading-tight">{e.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{e.title}</div>
                    </div>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${TIER_STYLES[e.tier]}`}>{e.tier}</span>
                </div>

                <div className="mb-3 flex flex-wrap gap-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><MapPin className="size-3" />{e.location}</span>
                  <span className="flex items-center gap-1"><BookOpen className="size-3" />{e.institution.split('/')[0].trim()}</span>
                </div>

                <p className="mb-3 flex-1 text-xs leading-relaxed text-gray-600">{e.bio}</p>

                <div className="mb-3 flex flex-wrap gap-1.5">
                  {e.expertise.slice(0, 3).map((x) => (
                    <span key={x} className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">{x}</span>
                  ))}
                </div>

                <div className="mb-4 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="size-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-gray-900">{e.rating}</span>
                    <span className="text-xs text-gray-400">({e.reviews} reviews)</span>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${AVAIL_STYLES[e.availability]}`}>
                    {e.availability}
                  </span>
                </div>

                <div className="mb-4 flex items-center justify-between text-xs text-gray-500">
                  <span>{e.projects} projects completed</span>
                  <span className="font-bold text-gray-900">{e.rate}</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelected(e)}
                    className="flex-1 rounded-xl border border-gray-200 bg-gray-50 py-2.5 text-xs font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700">
                    View Profile
                  </button>
                  <a href="/dashboard"
                    className="flex-1 rounded-xl bg-blue-700 py-2.5 text-center text-xs font-bold text-white transition-opacity hover:opacity-90">
                    Hire
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Join as expert CTA */}
        <div className="mt-10 rounded-3xl border-2 border-dashed border-blue-200 bg-blue-50 p-8 text-center">
          <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-2xl bg-blue-100">
            <Award className="size-7 text-blue-700" />
          </div>
          <h3 className="mb-2 text-xl font-bold text-gray-900">Are you a Research Expert?</h3>
          <p className="mx-auto mb-5 max-w-md text-sm text-gray-600">
            Join our expert network and get matched with researchers who need your skills. Featured listings available for premium visibility.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="mailto:kmabrig@gmail.com?subject=Expert Directory Application"
              className="inline-flex items-center gap-2 rounded-full bg-blue-700 px-7 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90">
              Apply to Join <ArrowRight className="size-4" />
            </a>
            <a href="/pricing"
              className="inline-flex items-center gap-2 rounded-full border border-blue-300 bg-white px-7 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50">
              View Featured Listing Pricing <ExternalLink className="size-4" />
            </a>
          </div>
        </div>
      </div>

      {/* ── Detail modal ── */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={() => setSelected(null)}>
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6"
            onClick={(e) => e.stopPropagation()}>
            <div className="mb-5 flex items-start gap-4">
              <div className={`flex size-16 shrink-0 items-center justify-center rounded-2xl text-lg font-bold ${selected.avatarColor}`}>
                {selected.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold text-gray-900">{selected.name}</h2>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${TIER_STYLES[selected.tier]}`}>{selected.tier}</span>
                </div>
                <p className="text-sm text-blue-700">{selected.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{selected.institution} · {selected.location}</p>
              </div>
              <button onClick={() => setSelected(null)} className="rounded-full p-2 hover:bg-gray-100 text-gray-500 text-xl">×</button>
            </div>
            <div className="mb-4 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="size-4 fill-yellow-400 text-yellow-400" />
                <span className="font-bold">{selected.rating}</span>
                <span className="text-gray-400">({selected.reviews} reviews)</span>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${AVAIL_STYLES[selected.availability]}`}>{selected.availability}</span>
              <span className="text-gray-500">{selected.projects} projects</span>
            </div>
            <p className="mb-5 text-sm leading-relaxed text-gray-700">{selected.bio}</p>
            <div className="mb-4">
              <h3 className="mb-2 font-semibold text-gray-900 text-sm">Services Offered</h3>
              <ul className="space-y-1.5">
                {selected.services.map((s) => (
                  <li key={s} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="size-4 text-blue-700 shrink-0" />{s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-5 rounded-2xl bg-gray-50 border border-gray-100 p-4">
              <span className="text-sm text-gray-500">Starting rate: </span>
              <span className="text-lg font-bold text-gray-900">{selected.rate}</span>
            </div>
            <div className="flex gap-3">
              <a href="/dashboard"
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-blue-700 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90">
                <MessageSquare className="size-4" /> Contact & Hire
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

import SubscriptionGuard from '@/components/SubscriptionGuard'
export default function ExpertsPage() { return <SubscriptionGuard><ExpertsPageInner /></SubscriptionGuard> }
