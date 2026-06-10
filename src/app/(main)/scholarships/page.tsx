'use client'

import { useState, useEffect } from 'react'
import { Heart, ExternalLink, X, Search, Filter, BookOpen, GraduationCap, Globe, Award } from 'lucide-react'

interface Scholarship {
  id: string
  title: string
  provider: string
  type: 'government' | 'private' | 'international'
  level: 'undergraduate' | 'masters' | 'phd' | 'all'
  funding: 'fully-funded' | 'partial'
  status: 'open' | 'closed'
  deadline: string
  amount: string
  description: string
  eligibility: string[]
  benefits: string[]
  howToApply: string
  link: string
  country: string
  badge?: string
}

const SCHOLARSHIPS: Scholarship[] = [
  {
    id: 'ptdf-2026',
    title: 'PTDF In-Country Scholarship 2026/27',
    provider: 'Petroleum Technology Development Fund',
    type: 'government',
    level: 'undergraduate',
    funding: 'partial',
    status: 'closed',
    deadline: 'Applications Closed',
    amount: '₦300,000/year + tuition support',
    description: 'PTDF In-Country Scholarship supports Nigerian undergraduate students in STEM and petroleum-related fields at Nigerian universities. Aimed at building local capacity in Nigeria\'s oil and gas sector.',
    eligibility: [
      'Nigerian nationals only',
      '100-level students in STEM or petroleum-related courses',
      'CGPA of 3.5 and above (5.0 scale)',
      'No previous scholarship holder',
    ],
    benefits: ['₦300,000 annual stipend', 'Tuition fee support', 'Book allowance', 'Mentorship program'],
    howToApply: 'Applications open annually on the PTDF portal. Create an account, fill the online form, upload required documents (JAMB result, admission letter, O\'level results), and submit before deadline.',
    link: 'https://ptdf.gov.ng',
    country: 'Nigeria',
    badge: 'Government',
  },
  {
    id: 'mtn-2026',
    title: 'MTN Foundation Scholarships 2026',
    provider: 'MTN Nigeria Foundation',
    type: 'private',
    level: 'undergraduate',
    funding: 'partial',
    status: 'open',
    deadline: 'July 31, 2026',
    amount: '₦200,000/year',
    description: 'MTN Foundation Science & Technology Scholarship supports high-achieving Nigerian undergraduates in science, technology, engineering, and mathematics (STEM) fields.',
    eligibility: [
      'Nigerian nationals',
      '200-level STEM students',
      'Minimum CGPA of 3.5/5.0',
      'Family income below ₦1.5 million annually',
    ],
    benefits: ['₦200,000 annual scholarship', 'Laptop provision', 'Internship opportunities at MTN', 'Career mentorship'],
    howToApply: 'Visit the MTN Foundation website, complete the online application form, attach your transcript, means of identification, and income declaration. Shortlisted candidates undergo an interview.',
    link: 'https://www.mtnfoundation.com.ng',
    country: 'Nigeria',
    badge: 'Open',
  },
  {
    id: 'nnpc-snepco',
    title: 'NNPC-SNEPCo Postgraduate Scholarship',
    provider: 'NNPC / Shell Nigeria Exploration and Production',
    type: 'private',
    level: 'masters',
    funding: 'fully-funded',
    status: 'closed',
    deadline: 'Applications Closed',
    amount: 'Full funding up to $30,000',
    description: 'A fully-funded postgraduate scholarship for Nigerians to study petroleum engineering, geosciences, or related fields at top international universities.',
    eligibility: [
      'Nigerian nationals under 28 years',
      'First-class or upper second degree in engineering/geosciences',
      'NYSC discharge/exemption certificate',
      'Not currently employed by NNPC/Shell',
    ],
    benefits: ['Full tuition fees', 'Monthly living stipend', 'Return airfare', 'Health insurance', 'Book allowance'],
    howToApply: 'Monitor the NNPC and SNEPCo official websites for application portal openings. Complete the form, upload academic transcripts, reference letters, and personal statement.',
    link: 'https://snepco.com',
    country: 'Nigeria',
    badge: 'Fully Funded',
  },
  {
    id: 'chevening-2026',
    title: 'Chevening Scholarships UK 2026/27',
    provider: 'UK Foreign, Commonwealth & Development Office',
    type: 'international',
    level: 'masters',
    funding: 'fully-funded',
    status: 'closed',
    deadline: 'November 5, 2025 (closed)',
    amount: 'Full funding — tuition + living + flights',
    description: 'Chevening is the UK Government\'s flagship international scholarship programme. Nigerian candidates with leadership potential can study any master\'s degree at UK universities.',
    eligibility: [
      'Nigerian national with 2+ years work experience',
      'Undergraduate degree (minimum 2:1)',
      'Leadership potential demonstrated',
      'Return to Nigeria after studies',
    ],
    benefits: ['Full tuition at any UK university', '£1,200+/month living allowance', 'Return flights', 'Visa fees covered', 'Chevening network access'],
    howToApply: 'Apply via the Chevening online portal (opens August annually). Choose 3 UK universities, write 4 essays on leadership, career goals, and why Chevening. Referee letters required.',
    link: 'https://www.chevening.org/scholarships/nigeria',
    country: 'United Kingdom',
    badge: 'Fully Funded',
  },
  {
    id: 'great-scholarships',
    title: 'GREAT Scholarships UK 2026',
    provider: 'British Council & UK Universities',
    type: 'international',
    level: 'masters',
    funding: 'partial',
    status: 'open',
    deadline: 'Varies by university (May–June 2026)',
    amount: '£10,000 minimum toward tuition',
    description: 'GREAT Scholarships offer Nigerian students £10,000 or more toward a one-year master\'s degree at participating UK universities, funded jointly by the British Council and universities.',
    eligibility: [
      'Nigerian nationals',
      'Strong undergraduate degree',
      'Accepted into a GREAT partner university',
      'Different universities have additional criteria',
    ],
    benefits: ['£10,000+ tuition contribution', 'Some universities offer full fee waivers', 'British Council support network'],
    howToApply: 'Apply directly to participating UK universities and select the GREAT Scholarship option. Each university has its own deadline and supplementary application.',
    link: 'https://www.britishcouncil.org.ng/study-uk/scholarships/great-scholarships',
    country: 'United Kingdom',
    badge: 'Open',
  },
  {
    id: 'fulbright-nigeria',
    title: 'Fulbright Foreign Student Program (Nigeria)',
    provider: 'U.S. Embassy Nigeria / Fulbright Program',
    type: 'international',
    level: 'phd',
    funding: 'fully-funded',
    status: 'closed',
    deadline: 'March 1, 2026 (cycle closed)',
    amount: 'Full funding — all costs covered',
    description: 'The Fulbright Foreign Student Program enables Nigerian PhD candidates to pursue graduate study or research in the United States. Strong track record for public policy, education, and social sciences.',
    eligibility: [
      'Nigerian nationals only',
      'Minimum 2 years of a PhD program',
      'Strong academic record',
      'Commitment to return to Nigeria post-study',
    ],
    benefits: ['Full tuition', 'Monthly stipend', 'Health insurance', 'Return flights', 'Cultural enrichment programs'],
    howToApply: 'Apply through the U.S. Embassy Nigeria Fulbright portal. Requires project proposal, academic transcripts, 3 reference letters, CV, and English proficiency scores.',
    link: 'https://ng.usembassy.gov/the-fulbright-foreign-student-program/',
    country: 'United States',
    badge: 'Fully Funded',
  },
  {
    id: 'daad-2026',
    title: 'DAAD Scholarships Germany 2026/27',
    provider: 'German Academic Exchange Service (DAAD)',
    type: 'international',
    level: 'masters',
    funding: 'fully-funded',
    status: 'open',
    deadline: 'October 15, 2026',
    amount: '€934/month + tuition + flights',
    description: 'DAAD offers fully-funded scholarships for Nigerian students to pursue master\'s or PhD programs at German universities in any field, including development-related studies.',
    eligibility: [
      'Nigerian national with bachelor\'s degree',
      'Excellent academic record',
      'Minimum 2 years relevant work experience (for some programs)',
      'German or English language proficiency',
    ],
    benefits: ['€934/month stipend', 'Health insurance', 'Travel allowance', 'Tuition waiver at public German universities', 'German language course'],
    howToApply: 'Apply via the DAAD portal. Identify a DAAD-partnered program, prepare motivation letter, CV, academic transcripts, language certificates, and recommendation letters.',
    link: 'https://www.daad.de/en/study-and-research-in-germany/scholarships/',
    country: 'Germany',
    badge: 'Open',
  },
  {
    id: 'mastercard-scholars',
    title: 'Mastercard Foundation Scholars Program',
    provider: 'Mastercard Foundation',
    type: 'international',
    level: 'undergraduate',
    funding: 'fully-funded',
    status: 'open',
    deadline: 'Varies by partner university',
    amount: 'Full funding — all costs covered',
    description: 'The Mastercard Foundation Scholars Program enables talented African students from economically disadvantaged backgrounds to access higher education and become transformative leaders.',
    eligibility: [
      'African nationals (including Nigerians)',
      'Demonstrated financial need',
      'Academic excellence',
      'Leadership potential and commitment to give back',
    ],
    benefits: ['Full tuition', 'Room and board', 'Airfare', 'Laptop and supplies', 'Mentorship', 'Leadership development'],
    howToApply: 'Apply through one of 38 partner universities worldwide (including University of Toronto, McGill, Michigan). Each university has its own application window — check the Mastercard Foundation website.',
    link: 'https://mastercardfdn.org/all/scholars/',
    country: 'Multiple Countries',
    badge: 'Open',
  },
  {
    id: 'commonwealth-2027',
    title: 'Commonwealth Scholarships UK 2026/27',
    provider: 'Commonwealth Scholarship Commission (CSC)',
    type: 'international',
    level: 'masters',
    funding: 'fully-funded',
    status: 'open',
    deadline: 'December 2026 (check portal)',
    amount: 'Full funding — tuition + living + flights',
    description: 'Commonwealth Scholarships enable Nigerian students to pursue master\'s degrees at UK universities. Priority given to development-focused disciplines: health, agriculture, environment, education.',
    eligibility: [
      'Nigerian nationals (Commonwealth member)',
      'First degree at minimum upper second class (2:1)',
      'Cannot already be living in a developed country',
      'Commitment to development impact',
    ],
    benefits: ['Full tuition', 'Monthly living allowance', 'Return airfare', 'Thesis grant', 'Study travel grant'],
    howToApply: 'Applications submitted through the Nigerian government nominating agency (NUC or Federal Ministry of Education). An online application is made via the CSC portal, then forwarded by the nominating body.',
    link: 'https://cscuk.fcdo.gov.uk/apply/',
    country: 'United Kingdom',
    badge: 'Open',
  },
  {
    id: 'manchester-global',
    title: 'University of Manchester Global Futures Scholarship',
    provider: 'University of Manchester',
    type: 'international',
    level: 'undergraduate',
    funding: 'partial',
    status: 'open',
    deadline: 'June 30, 2026',
    amount: '£5,000 per year',
    description: 'The Global Futures Scholarship at the University of Manchester supports high-achieving international students from Nigeria and other developing countries to study undergraduate programs.',
    eligibility: [
      'Nigerian nationals',
      'Applying for undergraduate study at University of Manchester',
      'Strong academic results (A-levels or equivalent)',
      'Demonstrated financial need',
    ],
    benefits: ['£5,000/year toward tuition', 'Access to Manchester bursary fund', 'Career development workshops'],
    howToApply: 'Apply for a place at the University of Manchester via UCAS, then separately apply for the Global Futures Scholarship via the university\'s scholarship portal after receiving an offer.',
    link: 'https://www.manchester.ac.uk/study/international/fees-and-funding/scholarships/',
    country: 'United Kingdom',
    badge: 'Open',
  },
]

const TYPE_LABELS: Record<string, string> = {
  all: 'All Types',
  government: 'Government',
  private: 'Private/Corporate',
  international: 'International',
}

const LEVEL_LABELS: Record<string, string> = {
  all: 'All Levels',
  undergraduate: 'Undergraduate',
  masters: "Master's",
  phd: 'PhD / Doctorate',
}

const FUNDING_LABELS: Record<string, string> = {
  all: 'All Funding',
  'fully-funded': 'Fully Funded',
  partial: 'Partial Funding',
}

export default function ScholarshipsPage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [levelFilter, setLevelFilter] = useState('all')
  const [fundingFilter, setFundingFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selected, setSelected] = useState<Scholarship | null>(null)
  const [saved, setSaved] = useState<string[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem('afrigrant-scholarships')
      if (stored) setSaved(JSON.parse(stored) as string[])
    } catch { /* ignore */ }
  }, [])

  function toggleSave(id: string) {
    setSaved((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      localStorage.setItem('afrigrant-scholarships', JSON.stringify(next))
      return next
    })
  }

  const filtered = SCHOLARSHIPS.filter((s) => {
    if (typeFilter !== 'all' && s.type !== typeFilter) return false
    if (levelFilter !== 'all' && s.level !== levelFilter) return false
    if (fundingFilter !== 'all' && s.funding !== fundingFilter) return false
    if (statusFilter !== 'all' && s.status !== statusFilter) return false
    if (search) {
      const q = search.toLowerCase()
      if (!s.title.toLowerCase().includes(q) && !s.provider.toLowerCase().includes(q) && !s.description.toLowerCase().includes(q)) return false
    }
    return true
  })

  const savedScholarships = SCHOLARSHIPS.filter((s) => saved.includes(s.id))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700">
            <GraduationCap className="size-4" />
            <span>Scholarships for Nigerian Students</span>
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            Fund Your Education,<br />
            <span className="text-blue-700">Shape Africa&apos;s Future</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-600">
            10 curated scholarships for Nigerian students — from government grants to fully-funded international programs. Filter, save, and apply from one place.
          </p>

          {/* Stats */}
          <div className="mt-8 flex flex-wrap gap-6">
            {[
              { icon: Award, value: `${SCHOLARSHIPS.length}`, label: 'Scholarships Listed' },
              { icon: Globe, value: `${SCHOLARSHIPS.filter((s) => s.funding === 'fully-funded').length}`, label: 'Fully Funded' },
              { icon: BookOpen, value: `${SCHOLARSHIPS.filter((s) => s.status === 'open').length}`, label: 'Currently Open' },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-5 py-3">
                <Icon className="size-5 text-blue-700" />
                <div>
                  <div className="text-xl font-bold text-blue-700">{value}</div>
                  <div className="text-xs text-gray-500">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Filters */}
        <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-5">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Filter className="size-4 text-blue-700" />
            Filter Scholarships
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <div className="relative lg:col-span-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search scholarships…"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-4 text-sm focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
            {([
              { value: typeFilter, setter: setTypeFilter, options: TYPE_LABELS },
              { value: levelFilter, setter: setLevelFilter, options: LEVEL_LABELS },
              { value: fundingFilter, setter: setFundingFilter, options: FUNDING_LABELS },
              { value: statusFilter, setter: setStatusFilter, options: { all: 'All Status', open: 'Open', closed: 'Closed' } },
            ] as const).map((f, i) => (
              <select
                key={i}
                value={f.value}
                onChange={(e) => f.setter(e.target.value)}
                className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                {Object.entries(f.options).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            ))}
          </div>
          <p className="mt-3 text-xs text-gray-400">{filtered.length} scholarship{filtered.length !== 1 ? 's' : ''} found</p>
        </div>

        {/* Saved section */}
        {savedScholarships.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Heart className="size-5 fill-red-500 text-red-500" />
              Saved Scholarships ({savedScholarships.length})
            </h2>
            <div className="flex flex-wrap gap-3">
              {savedScholarships.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelected(s)}
                  className="flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100"
                >
                  {s.title.length > 40 ? s.title.slice(0, 40) + '…' : s.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-gray-200 bg-white py-16 text-center">
            <GraduationCap className="mx-auto mb-3 size-12 text-gray-300" />
            <p className="font-medium text-gray-500">No scholarships match your filters.</p>
            <button onClick={() => { setSearch(''); setTypeFilter('all'); setLevelFilter('all'); setFundingFilter('all'); setStatusFilter('all') }} className="mt-3 text-sm text-blue-700 hover:underline">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((s) => (
              <div key={s.id} className="group flex flex-col rounded-3xl border border-gray-200 bg-white p-6 transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg">
                {/* Header row */}
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      s.status === 'open'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {s.status === 'open' ? 'Open' : 'Closed'}
                    </span>
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                      {s.funding === 'fully-funded' ? 'Fully Funded' : 'Partial'}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleSave(s.id)}
                    aria-label={saved.includes(s.id) ? 'Remove from saved' : 'Save scholarship'}
                    className="shrink-0 rounded-full p-1.5 transition-colors hover:bg-red-50"
                  >
                    <Heart className={`size-5 ${saved.includes(s.id) ? 'fill-red-500 text-red-500' : 'text-gray-300'}`} />
                  </button>
                </div>

                <h3 className="mb-1 text-base font-semibold leading-snug text-gray-900">{s.title}</h3>
                <p className="mb-1 text-sm font-medium text-blue-700">{s.provider}</p>
                <p className="mb-3 text-xs text-gray-500">📍 {s.country} · {LEVEL_LABELS[s.level]}</p>

                <div className="mb-3 rounded-xl bg-gray-50 px-4 py-2.5 text-sm">
                  <span className="font-semibold text-gray-900">{s.amount}</span>
                </div>

                <p className="mb-4 line-clamp-3 flex-1 text-sm leading-relaxed text-gray-600">{s.description}</p>

                <div className="mb-4 text-xs text-gray-500">
                  <span className="font-medium text-gray-700">Deadline: </span>{s.deadline}
                </div>

                <div className="mt-auto flex gap-2">
                  <button
                    onClick={() => setSelected(s)}
                    className="flex-1 rounded-xl border border-gray-200 bg-gray-50 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-700"
                  >
                    View Details
                  </button>
                  {s.status === 'open' && (
                    <a
                      href={s.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800"
                    >
                      Apply <ExternalLink className="size-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
          <strong>Note:</strong> Deadline dates and availability change. Always verify on the official scholarship website before applying. AfrigrantPipeline is not affiliated with any scholarship provider.
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center" onClick={() => setSelected(null)}>
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white p-6 sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <div className="mb-2 flex flex-wrap gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${selected.status === 'open' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                    {selected.status === 'open' ? 'Open' : 'Closed'}
                  </span>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                    {selected.funding === 'fully-funded' ? 'Fully Funded' : 'Partial Funding'}
                  </span>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                    {LEVEL_LABELS[selected.level]}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">{selected.title}</h2>
                <p className="text-sm text-blue-700">{selected.provider} · {selected.country}</p>
              </div>
              <button onClick={() => setSelected(null)} className="shrink-0 rounded-full p-2 transition-colors hover:bg-gray-100">
                <X className="size-5 text-gray-500" />
              </button>
            </div>

            <div className="mb-5 rounded-2xl bg-blue-50 px-5 py-4">
              <div className="text-lg font-bold text-blue-700">{selected.amount}</div>
              <div className="text-sm text-gray-600">Deadline: {selected.deadline}</div>
            </div>

            <p className="mb-5 text-sm leading-relaxed text-gray-700">{selected.description}</p>

            <div className="mb-5">
              <h3 className="mb-2 font-semibold text-gray-900">Eligibility Requirements</h3>
              <ul className="space-y-1.5">
                {selected.eligibility.map((e, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="mt-1 size-1.5 shrink-0 rounded-full bg-blue-700" />
                    {e}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-5">
              <h3 className="mb-2 font-semibold text-gray-900">Benefits</h3>
              <ul className="space-y-1.5">
                {selected.benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="mt-1 size-1.5 shrink-0 rounded-full bg-emerald-500" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="mb-2 font-semibold text-gray-900">How to Apply</h3>
              <p className="text-sm leading-relaxed text-gray-700">{selected.howToApply}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => toggleSave(selected.id)}
                className={`flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-medium transition-colors ${
                  saved.includes(selected.id)
                    ? 'border-red-200 bg-red-50 text-red-600'
                    : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-red-200 hover:bg-red-50 hover:text-red-600'
                }`}
              >
                <Heart className={`size-4 ${saved.includes(selected.id) ? 'fill-red-500' : ''}`} />
                {saved.includes(selected.id) ? 'Saved' : 'Save'}
              </button>
              {selected.status === 'open' ? (
                <a
                  href={selected.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-700 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800"
                >
                  Apply Now <ExternalLink className="size-4" />
                </a>
              ) : (
                <a
                  href={selected.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
                >
                  Visit Website <ExternalLink className="size-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
