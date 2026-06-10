'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import {
  Search, Filter, X, Heart, ExternalLink, Grid3X3, List,
  ChevronDown, Star, Sparkles, Building2, Globe, Leaf,
  Users, Zap, Palette, ShoppingBag, Sprout, Share2, CheckCircle,
  Lock, ArrowRight,
} from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────

interface Grant {
  id: number
  name: string
  provider: string
  type: 'Federal' | 'State' | 'International Accelerator' | 'Women-Focused' | 'Sector-Specific'
  amount: string
  amountValue: number
  currency: 'NGN' | 'USD'
  sectors: string[]
  eligibility: string[]
  status: 'Open' | 'Rolling' | 'Verify'
  deadline: string
  shortDesc: string
  fullDesc: string
  requirements: string[]
  howToApply: string
  link: string
  tags: string[]
  matchScore?: number
}

// ── Data ─────────────────────────────────────────────────────────────────────

const GRANTS: Grant[] = [
  {
    id: 1,
    name: 'SMEDAN Conditional Grant Scheme (CGS)',
    provider: 'SMEDAN (Federal)',
    type: 'Federal',
    amount: '₦50,000',
    amountValue: 50000,
    currency: 'NGN',
    sectors: ['General MSME'],
    eligibility: ['Women', 'Youth', 'PWD'],
    status: 'Rolling',
    deadline: 'Periodic calls – Check portal',
    shortDesc: '₦50k grant for nano/micro businesses with job creation condition.',
    fullDesc: 'Non-repayable grant to support nano and micro enterprises at LGA level with equipment, capacity building, and operations. Strong focus on job creation.',
    requirements: ['CAC registration recommended', 'Must employ at least one additional person', 'Business proposal aligned with guidelines'],
    howToApply: 'Apply via SMEDAN portal or designated LGA offices. Submit documentation and project proposal.',
    link: 'https://smedan.gov.ng/our-programs/cgs/',
    tags: ['Nano', 'Job Creation'],
  },
  {
    id: 2,
    name: 'Presidential Conditional Grant Scheme (PCGS)',
    provider: 'BOI / FMITI',
    type: 'Federal',
    amount: '₦50,000',
    amountValue: 50000,
    currency: 'NGN',
    sectors: ['General MSME', 'Trading', 'Artisans'],
    eligibility: ['Women', 'Youth', 'PWD', 'Elderly'],
    status: 'Open',
    deadline: 'Ongoing disbursement across LGAs',
    shortDesc: 'Nationwide ₦50k grants for nano businesses in trading, artisanship, and services.',
    fullDesc: 'Federal initiative supporting 1 million nano businesses with conditional grants targeting women, youth, and vulnerable groups.',
    requirements: ['CAC registration preferred', 'Located in any of the 774 LGAs'],
    howToApply: 'Monitor BOI and FMITI announcements or visit local BOI offices.',
    link: 'https://www.boi.ng/',
    tags: ['Nano', 'Nationwide'],
  },
  {
    id: 3,
    name: 'LSETF Operations, Credit & IT Grants',
    provider: 'Lagos State Employment Trust Fund',
    type: 'State',
    amount: 'Up to ₦1.5M',
    amountValue: 1500000,
    currency: 'NGN',
    sectors: ['General MSME'],
    eligibility: ['Lagos-based businesses'],
    status: 'Open',
    deadline: 'Rolling – Check current windows',
    shortDesc: 'Operations grants, IT enhancement support, and credit co-financing for Lagos MSMEs.',
    fullDesc: 'Multiple grant types including operations cost support (up to 50% for 6 months), IT tools, and credit guarantees for Lagos entrepreneurs.',
    requirements: ['Lagos resident or business operation', 'Valid business registration'],
    howToApply: 'Apply via lsetf.ng – check Grant sections for active windows.',
    link: 'https://lsetf.ng/',
    tags: ['Lagos', 'Operations Support'],
  },
  {
    id: 4,
    name: 'GCIP Nigeria Accelerator Fund',
    provider: 'Rural Electrification Agency (REA)',
    type: 'International Accelerator',
    amount: 'Up to $20,000',
    amountValue: 20000,
    currency: 'USD',
    sectors: ['Cleantech', 'Energy', 'Green Economy'],
    eligibility: ['Startups & SMEs 0-5 years', 'Incubation hub track record preferred'],
    status: 'Verify',
    deadline: 'Recent deadline June 2026 – check for extensions',
    shortDesc: 'Grants for high-growth clean-tech and renewable energy startups/SMEs.',
    fullDesc: 'Part of Global Cleantech Innovation Programme supporting innovative cleantech solutions in energy efficiency, renewables, waste, and green buildings.',
    requirements: ['Proven track record from reputable incubation hubs', 'Detailed budget and proposal'],
    howToApply: 'Email gcip.nigeria@rea.gov.ng with company name as subject.',
    link: 'https://gcip.rea.gov.ng/',
    tags: ['Cleantech', 'High Growth'],
  },
  {
    id: 5,
    name: 'Tony Elumelu Foundation (TEF) Entrepreneurship Programme',
    provider: 'Tony Elumelu Foundation',
    type: 'International Accelerator',
    amount: '$5,000 + Training',
    amountValue: 5000,
    currency: 'USD',
    sectors: ['All scalable businesses'],
    eligibility: ['Africans 18+', 'For-profit early-stage (0-5 years)'],
    status: 'Verify',
    deadline: 'Next cycle expected Jan–Mar 2027',
    shortDesc: '$5,000 non-refundable seed + world-class training and mentorship.',
    fullDesc: "One of Africa's most prestigious entrepreneurship programmes offering seed capital, training, mentorship, and access to a powerful network.",
    requirements: ['African citizen or legal resident', 'Scalable for-profit business idea or early-stage company'],
    howToApply: 'Apply at tefconnect.com when cycle opens.',
    link: 'https://www.tonyelumelufoundation.org/',
    tags: ['Pan-African', 'Mentorship'],
  },
  {
    id: 6,
    name: 'Orange Corners Nigeria Incubation Programme',
    provider: 'Dutch Embassy + FATE Foundation',
    type: 'International Accelerator',
    amount: 'Training + Prototype Funding',
    amountValue: 0,
    currency: 'NGN',
    sectors: ['Impact', 'SDGs', 'Innovative Solutions'],
    eligibility: ['18-35 years', 'Innovative idea or business <2 years', 'Addresses local challenges'],
    status: 'Open',
    deadline: 'Cohorts open twice yearly – Apply when live',
    shortDesc: '6-month incubation with training, mentorship, prototype funding and market linkages.',
    fullDesc: 'Fully funded programme by the Kingdom of the Netherlands supporting young Nigerian entrepreneurs building sustainable, impactful businesses.',
    requirements: ['Innovative concept linked to SDGs', 'Strong team and feasibility'],
    howToApply: 'Apply via orangecorners.com/nigeria when application window is open.',
    link: 'https://www.orangecorners.com/country/nigeria/',
    tags: ['Youth', 'Incubation', 'Impact'],
  },
  {
    id: 7,
    name: 'She Leads Africa Accelerator',
    provider: 'She Leads Africa',
    type: 'Women-Focused',
    amount: 'Up to ₦2 Million',
    amountValue: 2000000,
    currency: 'NGN',
    sectors: ['All', 'Women-led'],
    eligibility: ['Nigerian women 18-35', 'Business <3 years', 'Female-led/owned'],
    status: 'Verify',
    deadline: 'Check sheleadsafrica.org for current cohort',
    shortDesc: 'Accelerator + up to ₦2M funding for young Nigerian female entrepreneurs.',
    fullDesc: '3-month programme with mentorship, pitch opportunities, media visibility, and funding for high-potential women-led businesses.',
    requirements: ['Nigeria-based', 'Live product/service', 'Limited prior external funding'],
    howToApply: 'Apply via sheleadsafrica.org',
    link: 'https://sheleadsafrica.org/',
    tags: ['Women', 'Accelerator'],
  },
  {
    id: 8,
    name: 'Creative Fund 2026',
    provider: 'Creative Industries Support',
    type: 'Sector-Specific',
    amount: 'Project Funding',
    amountValue: 0,
    currency: 'NGN',
    sectors: ['Creative', 'Film', 'Fashion', 'Music'],
    eligibility: ['Nigerian creative businesses & studios'],
    status: 'Open',
    deadline: '30 July 2026',
    shortDesc: 'Support for film, fashion, music, and creative production projects.',
    fullDesc: 'Funding to strengthen technical quality and production capacity of Nigerian creative enterprises.',
    requirements: ['Registered creative business/studio', 'Project proposal'],
    howToApply: 'Check current calls on drpcngr.org or creative industry networks.',
    link: 'https://drpcngr.org/',
    tags: ['Creative', 'Deadline July 2026'],
  },
]

// ── Config ────────────────────────────────────────────────────────────────────

const TYPE_COLORS: Record<string, string> = {
  Federal: 'bg-emerald-700',
  State: 'bg-blue-700',
  'International Accelerator': 'bg-indigo-700',
  'Women-Focused': 'bg-pink-600',
  'Sector-Specific': 'bg-amber-600',
}

const STATUS_STYLES: Record<string, string> = {
  Open: 'bg-emerald-100 text-emerald-700',
  Rolling: 'bg-blue-100 text-blue-700',
  Verify: 'bg-amber-100 text-amber-700',
}

const SECTOR_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'General MSME': ShoppingBag,
  'Cleantech': Leaf,
  'Energy': Zap,
  'Creative': Palette,
  'Agriculture': Sprout,
  'Women-led': Users,
  'Tech & Digital': Globe,
}

// ── Smart Match config ────────────────────────────────────────────────────────

const WHO_OPTIONS = [
  { id: 'woman', label: 'Woman Entrepreneur', match: (g: Grant) => g.eligibility.some((e) => e.toLowerCase().includes('women')) },
  { id: 'youth', label: 'Youth Founder 18-35', match: (g: Grant) => g.eligibility.some((e) => e.toLowerCase().includes('youth') || e.includes('18-35')) },
  { id: 'msme', label: 'General MSME', match: (g: Grant) => g.sectors.some((s) => s.includes('MSME')) },
  { id: 'tech', label: 'Tech / Digital Startup', match: (g: Grant) => g.sectors.some((s) => s.toLowerCase().includes('tech') || s.toLowerCase().includes('digital') || s.toLowerCase().includes('innovative')) },
  { id: 'agri', label: 'Agri-business', match: (g: Grant) => g.sectors.some((s) => s.toLowerCase().includes('agri') || s.toLowerCase().includes('food')) },
  { id: 'creative', label: 'Creative Entrepreneur', match: (g: Grant) => g.sectors.some((s) => s.toLowerCase().includes('creative') || s.toLowerCase().includes('film') || s.toLowerCase().includes('music')) },
  { id: 'social', label: 'Social Enterprise', match: (g: Grant) => g.sectors.some((s) => s.toLowerCase().includes('impact') || s.toLowerCase().includes('sdg')) },
]

const SIZE_OPTIONS = [
  { id: 'nano', label: 'Nano / Micro (under ₦1M)', match: (g: Grant) => g.currency === 'NGN' && g.amountValue < 1000000 },
  { id: 'sme', label: 'SME (₦1M+)', match: (g: Grant) => g.currency === 'NGN' && g.amountValue >= 1000000 },
  { id: 'intl', label: 'International seed ($5K+)', match: (g: Grant) => g.currency === 'USD' && g.amountValue >= 5000 },
]

const FOCUS_OPTIONS = [
  { id: 'jobs', label: 'Job Creation', match: (g: Grant) => g.tags.some((t) => t.toLowerCase().includes('job')) },
  { id: 'women', label: 'Women Empowerment', match: (g: Grant) => g.type === 'Women-Focused' || g.eligibility.some((e) => e.toLowerCase().includes('women')) },
  { id: 'clean', label: 'Cleantech / Energy', match: (g: Grant) => g.sectors.some((s) => s.toLowerCase().includes('clean') || s.toLowerCase().includes('energy')) },
  { id: 'creative', label: 'Creative Industries', match: (g: Grant) => g.sectors.some((s) => s.toLowerCase().includes('creative')) },
  { id: 'scale', label: 'Scalable Growth', match: (g: Grant) => g.tags.some((t) => t.toLowerCase().includes('high growth') || t.toLowerCase().includes('accelerator') || t.toLowerCase().includes('mentorship')) },
]

// ── Paywall ───────────────────────────────────────────────────────────────────

const FREE_PREVIEW = 2
const PAID_PLANS = ['silver', 'gold', 'platinum']

function BusinessPaywallGate({ isLoggedIn, total }: { isLoggedIn: boolean; total: number }) {
  return (
    <div className="relative mt-4 overflow-hidden rounded-3xl border-2 border-[#0A5C36]/30 bg-white shadow-xl">
      <div className="pointer-events-none select-none blur-sm opacity-40 grid gap-5 p-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-52 rounded-3xl border border-gray-200 bg-gray-100 animate-pulse" />
        ))}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/92 backdrop-blur-sm px-6 py-10 text-center">
        <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-[#0A5C36]">
          <Lock className="size-8 text-white" />
        </div>
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#0A5C36]/10 px-3 py-1 text-xs font-semibold text-[#0A5C36]">
          <Star className="size-3.5 fill-[#0A5C36]" />
          {total - FREE_PREVIEW}+ more opportunities locked
        </div>
        <h2 className="mt-2 text-2xl font-bold text-gray-900">Unlock Full Access</h2>
        <p className="mt-2 max-w-md text-sm text-gray-500">
          You&apos;re seeing {FREE_PREVIEW} of <strong>{total}</strong> business grants. Subscribe to access all opportunities — full details, application links, eligibility, and Smart Match results.
        </p>
        <ul className="mt-5 space-y-2 text-left text-sm text-gray-700">
          {[
            `All ${total} business grants with full details`,
            'Smart Match tool results & recommendations',
            'Application links & eligibility requirements',
            'Weekly new grant alerts for your sector',
          ].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <CheckCircle className="size-4 shrink-0 text-[#0A5C36]" /> {item}
            </li>
          ))}
        </ul>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/pricing"
            className="inline-flex items-center gap-2 rounded-full bg-[#0A5C36] px-7 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90">
            <Sparkles className="size-4" /> View Plans — From ₦3,000/month
          </Link>
          <a href="https://store.mabrigkorie.org" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-7 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50">
            Quarterly Newsletter — ₦12,000
          </a>
        </div>
        {!isLoggedIn && (
          <p className="mt-4 text-xs text-gray-400">
            Already subscribed?{' '}
            <Link href="/login" className="font-medium text-[#0A5C36] hover:underline">Sign in</Link>
          </p>
        )}
        {isLoggedIn && (
          <p className="mt-4 text-xs text-gray-400">
            You&apos;re on the free plan.{' '}
            <Link href="/pricing" className="font-medium text-[#0A5C36] hover:underline">Upgrade to unlock full access.</Link>
          </p>
        )}
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function BusinessGrantsPage() {
  const { data: session } = useSession()
  const isLoggedIn = !!session?.user
  const fullAccess = session?.user?.role === 'admin' || PAID_PLANS.includes(session?.user?.subscription ?? 'free')

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [sort, setSort] = useState<'best' | 'amount' | 'az'>('best')
  const [selected, setSelected] = useState<Grant | null>(null)
  const [saved, setSaved] = useState<number[]>([])
  const [toast, setToast] = useState('')
  const [matchIds, setMatchIds] = useState<number[] | null>(null)

  // Smart Match state
  const [whoSel, setWhoSel] = useState<string[]>([])
  const [sizeSel, setSizeSel] = useState<string[]>([])
  const [focusSel, setFocusSel] = useState<string[]>([])
  const [matchDone, setMatchDone] = useState(false)

  const resultsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      const s = localStorage.getItem('agp-biz-saved')
      if (s) setSaved(JSON.parse(s) as number[])
    } catch { /* ignore */ }
  }, [])

  function toggleSave(id: number) {
    setSaved((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      localStorage.setItem('agp-biz-saved', JSON.stringify(next))
      showToast(next.includes(id) ? 'Saved to your pipeline!' : 'Removed from pipeline')
      return next
    })
  }

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2800)
  }

  function handleShare(g: Grant) {
    const text = `${g.name} — ${g.amount} | AfriGrantPipeline`
    if (navigator.share) navigator.share({ title: text, url: g.link }).catch(() => null)
    else {
      navigator.clipboard.writeText(g.link).catch(() => null)
      showToast('Link copied!')
    }
  }

  function runSmartMatch() {
    if (!whoSel.length && !sizeSel.length && !focusSel.length) { showToast('Select at least one option!'); return }
    const whoFns = WHO_OPTIONS.filter((o) => whoSel.includes(o.id)).map((o) => o.match)
    const sizeFns = SIZE_OPTIONS.filter((o) => sizeSel.includes(o.id)).map((o) => o.match)
    const focusFns = FOCUS_OPTIONS.filter((o) => focusSel.includes(o.id)).map((o) => o.match)

    const scored = GRANTS.map((g) => {
      let score = 0
      if (whoFns.some((fn) => fn(g))) score += 3
      if (sizeFns.some((fn) => fn(g))) score += 2
      if (focusFns.some((fn) => fn(g))) score += 2
      return { id: g.id, score }
    })
    const matches = scored.filter((x) => x.score > 0).map((x) => x.id)
    setMatchIds(matches.length ? matches : null)
    setMatchDone(true)
    resultsRef.current?.scrollIntoView({ behavior: 'smooth' })
    if (!matches.length) showToast('No exact matches — showing all grants')
    else showToast(`${matches.length} grants matched your profile!`)
  }

  function clearMatch() { setMatchIds(null); setMatchDone(false); setWhoSel([]); setSizeSel([]); setFocusSel([]) }

  function toggleChip<T>(arr: T[], val: T, set: (v: T[]) => void) {
    set(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val])
  }

  const types = Array.from(new Set(GRANTS.map((g) => g.type)))
  const statuses = Array.from(new Set(GRANTS.map((g) => g.status)))

  let displayed = GRANTS.filter((g) => {
    if (search) {
      const q = search.toLowerCase()
      if (!g.name.toLowerCase().includes(q) && !g.provider.toLowerCase().includes(q) && !g.shortDesc.toLowerCase().includes(q)) return false
    }
    if (typeFilter.length && !typeFilter.includes(g.type)) return false
    if (statusFilter.length && !statusFilter.includes(g.status)) return false
    return true
  })

  if (sort === 'amount') displayed = [...displayed].sort((a, b) => (b.amountValue || 0) - (a.amountValue || 0))
  else if (sort === 'az') displayed = [...displayed].sort((a, b) => a.name.localeCompare(b.name))
  else if (matchIds) displayed = [...displayed].sort((a, b) => (matchIds.includes(b.id) ? 1 : 0) - (matchIds.includes(a.id) ? 1 : 0))

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-[#0A5C36] to-[#1E3A5F] text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium">
            <Building2 className="size-4" />
            Nigeria Business Grants Explorer | AfriGrantPipeline
          </div>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            Nigeria Business &amp; MSME<br />
            <span className="text-[#D4A017]">Grants Pipeline 2026</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-white/80">
            Discover, filter, and apply to the best local and international grants, seed funding, and accelerators for Nigerian entrepreneurs.
          </p>
          <p className="mt-2 text-sm text-white/50">
            Part of AfriGrantPipeline&apos;s Grant Marketplace • Information as of June 2026
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="rounded-full bg-[#D4A017] px-7 py-3 text-sm font-bold text-[#1E2937] transition-opacity hover:opacity-90"
            >
              Start Exploring
            </button>
            <button
              onClick={() => document.getElementById('smart-match')?.scrollIntoView({ behavior: 'smooth' })}
              className="rounded-full border border-white/40 bg-white/10 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/20"
            >
              Get Personalized Matches
            </button>
          </div>

          {/* Quick stats */}
          <div className="mt-10 flex flex-wrap gap-4">
            {[
              { label: 'Opportunities', value: GRANTS.length },
              { label: 'Open / Rolling', value: GRANTS.filter((g) => g.status !== 'Verify').length },
              { label: 'Women-focused', value: GRANTS.filter((g) => g.type === 'Women-Focused' || g.eligibility.some((e) => e.toLowerCase().includes('women'))).length },
              { label: 'International grants', value: GRANTS.filter((g) => g.currency === 'USD').length },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-center">
                <div className="text-2xl font-bold text-[#D4A017]">{value}</div>
                <div className="text-xs text-white/70">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Smart Match ────────────────────────────────────────────────── */}
      <section id="smart-match" className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#0A5C36]">
              <Sparkles className="size-5 text-[#D4A017]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1E2937]">Smart Match Tool</h2>
              <p className="text-sm text-gray-500">Answer 3 quick questions and we&apos;ll rank your best opportunities</p>
            </div>
          </div>

          <div className="space-y-5">
            <MatchGroup label="Who are you?" options={WHO_OPTIONS.map((o) => o.label)} selected={whoSel}
              onToggle={(l) => toggleChip(whoSel, l, setWhoSel)} />
            <MatchGroup label="Preferred funding size" options={SIZE_OPTIONS.map((o) => o.label)} selected={sizeSel}
              onToggle={(l) => toggleChip(sizeSel, l, setSizeSel)} />
            <MatchGroup label="Priority focus" options={FOCUS_OPTIONS.map((o) => o.label)} selected={focusSel}
              onToggle={(l) => toggleChip(focusSel, l, setFocusSel)} />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {!fullAccess ? (
              <Link href="/pricing"
                className="flex items-center gap-2 rounded-full bg-[#0A5C36] px-7 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90">
                <Lock className="size-4" /> Subscribe to Use Smart Match
              </Link>
            ) : (
              <button
                onClick={runSmartMatch}
                className="flex items-center gap-2 rounded-full bg-[#0A5C36] px-7 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
              >
                <Sparkles className="size-4" /> Find My Top Matches
              </button>
            )}
            {matchDone && (
              <button onClick={clearMatch} className="flex items-center gap-2 rounded-full border border-gray-200 px-5 py-3 text-sm text-gray-600 hover:bg-gray-50">
                <X className="size-4" /> Clear Match
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── Subscriber banner ──────────────────────────────────────────── */}
      {!fullAccess && (
        <div className="border-b border-[#0A5C36]/20 bg-[#0A5C36]/5">
          <div className="mx-auto max-w-7xl px-6 py-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-[#0A5C36]">
              <Lock className="size-4 shrink-0" />
              <span className="font-semibold">Subscriber-only content</span>
              <span className="text-[#0A5C36]/70">— showing {FREE_PREVIEW} of {GRANTS.length} grants</span>
            </div>
            <div className="flex gap-2">
              {!isLoggedIn && (
                <Link href="/login" className="rounded-full border border-[#0A5C36]/30 bg-white px-4 py-1.5 text-xs font-semibold text-[#0A5C36] hover:bg-[#0A5C36]/5">Sign In</Link>
              )}
              <Link href="/pricing" className="inline-flex items-center gap-1.5 rounded-full bg-[#0A5C36] px-4 py-1.5 text-xs font-bold text-white hover:opacity-90">
                Upgrade <ArrowRight className="size-3" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── Filters + Results ──────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-6 py-8" ref={resultsRef}>

        {/* Filter bar */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search grants, providers…"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-4 text-sm focus:border-[#0A5C36]/40 focus:outline-none focus:ring-2 focus:ring-[#0A5C36]/10"
              />
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => setView('grid')} className={`rounded-lg p-2 ${view === 'grid' ? 'bg-[#0A5C36] text-white' : 'text-gray-400 hover:bg-gray-100'}`}>
                <Grid3X3 className="size-4" />
              </button>
              <button onClick={() => setView('list')} className={`rounded-lg p-2 ${view === 'list' ? 'bg-[#0A5C36] text-white' : 'text-gray-400 hover:bg-gray-100'}`}>
                <List className="size-4" />
              </button>
            </div>

            <SortSelect value={sort} onChange={setSort} />
          </div>

          <div className="flex flex-wrap gap-3">
            <FilterGroup label="Type" options={types} selected={typeFilter} onToggle={(v) => toggleChip(typeFilter, v, setTypeFilter)} />
            <FilterGroup label="Status" options={statuses} selected={statusFilter} onToggle={(v) => toggleChip(statusFilter, v, setStatusFilter)} />
            {(typeFilter.length > 0 || statusFilter.length > 0 || search) && (
              <button onClick={() => { setTypeFilter([]); setStatusFilter([]); setSearch('') }}
                className="flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100">
                <X className="size-3" /> Clear filters
              </button>
            )}
          </div>

          <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
            <Filter className="size-3" />
            Showing {displayed.length} of {GRANTS.length} opportunities
            {matchIds && <span className="ml-1 text-[#0A5C36] font-medium">· {matchIds.length} matched your profile</span>}
          </div>
        </div>

        {/* Grant cards */}
        {(() => {
          const visibleGrants = fullAccess ? displayed : displayed.slice(0, FREE_PREVIEW)
          const showPaywall = !fullAccess && displayed.length > 0
          return displayed.length === 0 ? (
            <div className="rounded-3xl border border-gray-200 bg-white py-20 text-center">
              <Building2 className="mx-auto mb-3 size-12 text-gray-200" />
              <p className="font-medium text-gray-500">No grants match your filters.</p>
            </div>
          ) : (
            <>
              {view === 'grid' ? (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {visibleGrants.map((g) => (
                    <GrantCard key={g.id} grant={g} saved={saved.includes(g.id)}
                      isMatch={!!matchIds?.includes(g.id)}
                      onSave={() => toggleSave(g.id)}
                      onView={fullAccess ? () => setSelected(g) : () => null} />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {visibleGrants.map((g) => (
                    <GrantRow key={g.id} grant={g} saved={saved.includes(g.id)}
                      isMatch={!!matchIds?.includes(g.id)}
                      onSave={() => toggleSave(g.id)}
                      onView={fullAccess ? () => setSelected(g) : () => null} />
                  ))}
                </div>
              )}
              {showPaywall && <BusinessPaywallGate isLoggedIn={isLoggedIn} total={GRANTS.length} />}
            </>
          )
        })()}

        {/* Saved strip */}
        {saved.length > 0 && (
          <div className="mt-10">
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-[#1E2937]">
              <Heart className="size-4 fill-red-500 text-red-500" /> My Pipeline ({saved.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {GRANTS.filter((g) => saved.includes(g.id)).map((g) => (
                <button key={g.id} onClick={() => setSelected(g)}
                  className="rounded-full border border-[#0A5C36]/20 bg-[#0A5C36]/5 px-4 py-1.5 text-sm font-medium text-[#0A5C36] hover:bg-[#0A5C36]/10">
                  {g.name.length > 36 ? g.name.slice(0, 36) + '…' : g.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <p className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <strong>Disclaimer:</strong> Grant details are current as of June 2026 but may change. Always verify on the official provider website before applying. AfriGrantPipeline is not affiliated with any grant provider.
        </p>
      </div>

      {/* ── Detail Modal ───────────────────────────────────────────────── */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center"
          onClick={() => setSelected(null)}>
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}>
            {/* Accent bar */}
            <div className={`h-2 w-full rounded-t-3xl ${TYPE_COLORS[selected.type] ?? 'bg-gray-400'}`} />
            <div className="p-6">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <div className="mb-2 flex flex-wrap gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[selected.status]}`}>
                      {selected.status}
                    </span>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">{selected.type}</span>
                  </div>
                  <h2 className="text-xl font-bold text-[#1E2937]">{selected.name}</h2>
                  <p className="text-sm text-[#0A5C36] font-medium">{selected.provider}</p>
                </div>
                <button onClick={() => setSelected(null)} className="shrink-0 rounded-full p-2 hover:bg-gray-100">
                  <X className="size-5 text-gray-500" />
                </button>
              </div>

              <div className="mb-5 rounded-2xl bg-[#0A5C36]/5 border border-[#0A5C36]/10 px-5 py-4">
                <div className="text-2xl font-bold text-[#0A5C36]">{selected.amount}</div>
                <div className="mt-1 text-sm text-gray-600">Deadline: {selected.deadline}</div>
              </div>

              <p className="mb-5 text-sm leading-relaxed text-gray-700">{selected.fullDesc}</p>

              <div className="mb-5">
                <h3 className="mb-2 font-semibold text-[#1E2937]">Eligibility &amp; Requirements</h3>
                <ul className="space-y-1.5">
                  {selected.requirements.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="mt-0.5 size-4 shrink-0 text-[#0A5C36]" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="mb-2 font-semibold text-[#1E2937]">How to Apply</h3>
                <p className="text-sm leading-relaxed text-gray-700">{selected.howToApply}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button onClick={() => toggleSave(selected.id)}
                  className={`flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-medium transition-colors ${
                    saved.includes(selected.id)
                      ? 'border-red-200 bg-red-50 text-red-600'
                      : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-red-200 hover:bg-red-50 hover:text-red-600'
                  }`}>
                  <Heart className={`size-4 ${saved.includes(selected.id) ? 'fill-red-500' : ''}`} />
                  {saved.includes(selected.id) ? 'Saved' : 'Save to Pipeline'}
                </button>
                <button onClick={() => handleShare(selected)}
                  className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100">
                  <Share2 className="size-4" /> Share
                </button>
                <a href={selected.link} target="_blank" rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#0A5C36] py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90">
                  Apply / Visit Official Site <ExternalLink className="size-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ─────────────────────────────────────────────────────── */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#1E2937] px-6 py-3 text-sm font-medium text-white shadow-xl animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function GrantCard({ grant: g, saved, isMatch, onSave, onView }: {
  grant: Grant; saved: boolean; isMatch: boolean; onSave: () => void; onView: () => void
}) {
  const IconComp = SECTOR_ICONS[g.sectors[0]] ?? Building2
  return (
    <div className={`group relative flex flex-col rounded-3xl border bg-white transition-all hover:-translate-y-1 hover:shadow-lg ${isMatch ? 'border-[#0A5C36] ring-2 ring-[#0A5C36]/20' : 'border-gray-200'}`}>
      {isMatch && (
        <div className="absolute -top-3 left-4 flex items-center gap-1 rounded-full bg-[#0A5C36] px-3 py-1 text-xs font-bold text-white shadow">
          <Star className="size-3 fill-[#D4A017] text-[#D4A017]" /> Recommended for you
        </div>
      )}
      <div className={`h-1.5 w-full rounded-t-3xl ${TYPE_COLORS[g.type] ?? 'bg-gray-300'}`} />
      <div className="flex flex-1 flex-col p-5 pt-4">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#0A5C36]/10">
            <IconComp className="size-5 text-[#0A5C36]" />
          </div>
          <div className="flex gap-2">
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[g.status]}`}>{g.status}</span>
            <button onClick={onSave} className="rounded-full p-1 hover:bg-red-50">
              <Heart className={`size-4 ${saved ? 'fill-red-500 text-red-500' : 'text-gray-300'}`} />
            </button>
          </div>
        </div>

        <h3 className="mb-1 text-sm font-bold leading-snug text-[#1E2937]">{g.name}</h3>
        <p className="mb-2 text-xs font-medium text-[#0A5C36]">{g.provider}</p>

        <div className="mb-3 rounded-xl bg-[#0A5C36]/5 px-3 py-2">
          <span className="text-base font-bold text-[#0A5C36]">{g.amount}</span>
        </div>

        <p className="mb-3 flex-1 text-xs leading-relaxed text-gray-500">{g.shortDesc}</p>

        <div className="mb-4 flex flex-wrap gap-1.5">
          {g.tags.map((t) => (
            <span key={t} className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">{t}</span>
          ))}
        </div>

        <button onClick={onView}
          className="w-full rounded-xl bg-[#1E3A5F] py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90">
          View Details
        </button>
      </div>
    </div>
  )
}

function GrantRow({ grant: g, saved, isMatch, onSave, onView }: {
  grant: Grant; saved: boolean; isMatch: boolean; onSave: () => void; onView: () => void
}) {
  return (
    <div className={`flex items-center gap-4 rounded-2xl border bg-white p-4 transition-all hover:shadow-md ${isMatch ? 'border-[#0A5C36] ring-2 ring-[#0A5C36]/10' : 'border-gray-200'}`}>
      <div className={`h-12 w-1.5 shrink-0 rounded-full ${TYPE_COLORS[g.type] ?? 'bg-gray-300'}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-bold text-[#1E2937] truncate">{g.name}</span>
          {isMatch && <span className="flex items-center gap-1 rounded-full bg-[#0A5C36] px-2 py-0.5 text-xs font-bold text-white"><Star className="size-3 fill-[#D4A017] text-[#D4A017]" /> Match</span>}
        </div>
        <p className="text-xs text-[#0A5C36]">{g.provider}</p>
        <p className="mt-0.5 text-xs text-gray-500 truncate">{g.shortDesc}</p>
      </div>
      <div className="shrink-0 text-right">
        <div className="text-sm font-bold text-[#0A5C36]">{g.amount}</div>
        <span className={`text-xs font-medium rounded-full px-2 py-0.5 ${STATUS_STYLES[g.status]}`}>{g.status}</span>
      </div>
      <div className="flex shrink-0 gap-2">
        <button onClick={onSave} className="rounded-full p-1.5 hover:bg-red-50">
          <Heart className={`size-4 ${saved ? 'fill-red-500 text-red-500' : 'text-gray-300'}`} />
        </button>
        <button onClick={onView} className="rounded-xl bg-[#1E3A5F] px-4 py-1.5 text-xs font-semibold text-white hover:opacity-90">
          Details
        </button>
      </div>
    </div>
  )
}

function MatchGroup({ label, options, selected, onToggle }: {
  label: string; options: string[]; selected: string[]; onToggle: (v: string) => void
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-[#1E2937]">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button key={o} onClick={() => onToggle(o)}
            className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-all ${
              selected.includes(o)
                ? 'border-[#0A5C36] bg-[#0A5C36] text-white'
                : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-[#0A5C36]/40 hover:bg-[#0A5C36]/5'
            }`}>
            {o}
          </button>
        ))}
      </div>
    </div>
  )
}

function FilterGroup({ label, options, selected, onToggle }: {
  label: string; options: string[]; selected: string[]; onToggle: (v: string) => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
          selected.length ? 'border-[#0A5C36] bg-[#0A5C36]/5 text-[#0A5C36]' : 'border-gray-200 text-gray-600 hover:border-gray-300'
        }`}>
        {label} {selected.length ? `(${selected.length})` : ''} <ChevronDown className="size-3" />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-20 mt-2 w-52 rounded-2xl border border-gray-200 bg-white p-2 shadow-lg">
          {options.map((o) => (
            <button key={o} onClick={() => onToggle(o)}
              className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                selected.includes(o) ? 'bg-[#0A5C36]/5 text-[#0A5C36] font-medium' : 'text-gray-700 hover:bg-gray-50'
              }`}>
              <div className={`size-4 shrink-0 rounded border ${selected.includes(o) ? 'border-[#0A5C36] bg-[#0A5C36]' : 'border-gray-300'} flex items-center justify-center`}>
                {selected.includes(o) && <CheckCircle className="size-3 text-white" />}
              </div>
              {o}
            </button>
          ))}
          <button onClick={() => setOpen(false)} className="mt-1 w-full rounded-xl py-1.5 text-center text-xs text-gray-400 hover:text-gray-600">Close</button>
        </div>
      )}
    </div>
  )
}

function SortSelect({ value, onChange }: { value: string; onChange: (v: 'best' | 'amount' | 'az') => void }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value as 'best' | 'amount' | 'az')}
      className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0A5C36]/20">
      <option value="best">Best Match</option>
      <option value="amount">Highest Funding</option>
      <option value="az">A–Z</option>
    </select>
  )
}
