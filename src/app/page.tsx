import Link from 'next/link'
import {
  ArrowRight, Globe, Search, Users, GraduationCap,
  Lightbulb, Bell, Star, Sparkles, TrendingUp, Award, Building2,
  FileText, Zap, Heart, CheckCircle, ChevronRight, Microscope,
  Handshake, BarChart3, ShieldCheck,
} from 'lucide-react'

// ── Static data ────────────────────────────────────────────────────────────

const platformModules = [
  {
    icon: Search,
    title: 'Funding Discovery Engine',
    description: 'Grants, scholarships, fellowships, accelerators, awards — every category, curated and searchable with AI-powered matching.',
    href: '/grants',
    badge: 'Core',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    icon: Microscope,
    title: 'Research Repository',
    description: 'Publish papers, theses, policy reports, and books. DOI-ready, searchable, with citation tools and download analytics.',
    href: '/articles',
    badge: 'AfriPublish',
    color: 'bg-purple-100 text-purple-700',
  },
  {
    icon: Users,
    title: 'Collaboration Hub',
    description: 'Find co-investigators, join open projects, and build cross-border research teams matched by interest and expertise.',
    href: '/collaborations',
    badge: 'Teams',
    color: 'bg-emerald-100 text-emerald-700',
  },
  {
    icon: GraduationCap,
    title: 'Scholarships Pipeline',
    description: 'Undergraduate to PhD scholarships for Nigerian and African students — government, private, and fully-funded international.',
    href: '/scholarships',
    badge: 'Education',
    color: 'bg-amber-100 text-amber-700',
  },
  {
    icon: Building2,
    title: 'Business Grants Explorer',
    description: 'MSME grants, startup seed funding, accelerators, and women-focused opportunities for Nigerian entrepreneurs.',
    href: '/business-grants',
    badge: 'Business',
    color: 'bg-green-100 text-green-700',
  },
  {
    icon: CheckCircle,
    title: '💯 Humanised Writing Service',
    description: 'Expert-written proposals, abstracts, and reports — 100% human, zero AI detection flags. Guaranteed original and publishable.',
    href: '/writing-lab',
    badge: 'Human',
    color: 'bg-teal-100 text-teal-700',
  },
  {
    icon: Handshake,
    title: 'Mentorship Programme',
    description: 'Connect with senior academics and industry leaders for structured mentorship with goal tracking.',
    href: '/mentorships',
    badge: 'Growth',
    color: 'bg-pink-100 text-pink-700',
  },
  {
    icon: FileText,
    title: 'Grant Writing Services',
    description: 'Professional proposal writing, budget design, M&E frameworks, and concept notes from expert consultants.',
    href: '/services',
    badge: 'Premium',
    color: 'bg-orange-100 text-orange-700',
  },
]

const fundingCategories = [
  { label: 'Research Grants', count: '500+', icon: Microscope, href: '/grants?type=research' },
  { label: 'Scholarships', count: '120+', icon: GraduationCap, href: '/scholarships' },
  { label: 'Business & MSME', count: '80+', icon: Building2, href: '/business-grants' },
  { label: 'Fellowships', count: '200+', icon: Award, href: '/grants?type=fellowship' },
  { label: 'NGO & Impact', count: '60+', icon: Heart, href: '/grants?type=project' },
  { label: 'Accelerators', count: '40+', icon: Zap, href: '/grants?type=seed' },
]

const stats = [
  { value: '1,200+', label: 'Funding Opportunities' },
  { value: '40+', label: 'African Countries' },
  { value: '15K+', label: 'Researchers & Founders' },
  { value: '₦2B+', label: 'Grants Facilitated' },
]

const featuredGrants = [
  {
    title: 'Cambridge-Africa ALBORADA Fund 2026',
    funder: 'University of Cambridge',
    amount: '£25,000',
    deadline: 'Sep 3, 2026',
    type: 'Research',
    status: 'Open',
    href: '/grants',
  },
  {
    title: 'Tony Elumelu Foundation Programme',
    funder: 'Tony Elumelu Foundation',
    amount: '$5,000 + Training',
    deadline: 'Jan 2027',
    type: 'Startup',
    status: 'Opening Soon',
    href: '/business-grants',
  },
  {
    title: 'DAAD Scholarships Germany 2026/27',
    funder: 'German Academic Exchange',
    amount: '€934/month',
    deadline: 'Oct 15, 2026',
    type: 'Scholarship',
    status: 'Open',
    href: '/scholarships',
  },
  {
    title: 'Mastercard Foundation Scholars',
    funder: 'Mastercard Foundation',
    amount: 'Fully Funded',
    deadline: 'Varies by university',
    type: 'Scholarship',
    status: 'Open',
    href: '/scholarships',
  },
]

const successStories = [
  {
    name: 'Dr. Amina Yusuf',
    role: 'Climate Researcher, Abuja',
    result: 'Secured $18,000 GCIP grant for solar micro-grid project',
    avatar: 'AY',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    name: 'Chukwuemeka Obi',
    role: 'PhD Candidate, Lagos',
    result: 'Won Chevening Scholarship — studying at University of Exeter',
    avatar: 'CO',
    color: 'bg-emerald-100 text-emerald-700',
  },
  {
    name: 'Fatima Al-Hassan',
    role: 'AgriTech Founder, Kano',
    result: 'TEF Programme alumna — grew to 12 employees with seed capital',
    avatar: 'FA',
    color: 'bg-purple-100 text-purple-700',
  },
]

const membershipTiers = [
  {
    name: 'Free',
    price: '₦0',
    period: 'forever',
    description: "Get started with Africa's largest grant directory.",
    features: ['Basic grant search & alerts', 'Community forum access', 'Save up to 5 opportunities', 'Monthly newsletter'],
    cta: 'Get Started Free',
    href: '/signup',
    highlight: false,
  },
  {
    name: 'Silver',
    price: '₦3,000',
    period: '/month',
    description: 'Personalized matching and weekly grant intelligence.',
    features: ['Everything in Free', 'AI-powered grant matching', 'Weekly curated newsletters', 'Unlimited saved opportunities', 'Deadline reminders'],
    cta: 'Start Silver',
    href: '/signup?plan=silver',
    highlight: false,
  },
  {
    name: 'Gold',
    price: '₦8,000',
    period: '/month',
    description: 'Premium access with proposal support and live webinars.',
    features: ['Everything in Silver', 'One proposal review/month', 'Premium grant database', 'Monthly live webinars', 'Application templates library'],
    cta: 'Start Gold',
    href: '/signup?plan=gold',
    highlight: true,
  },
  {
    name: 'Platinum',
    price: '₦18,000',
    period: '/month',
    description: 'Full concierge service for serious researchers and founders.',
    features: ['Everything in Gold', 'Grant concierge service', 'One-on-one consulting session', 'Priority support', 'Custom opportunity alerts'],
    cta: 'Start Platinum',
    href: '/signup?plan=platinum',
    highlight: false,
  },
]

const trustLogos = ['African Union', 'UNESCO Africa', 'World Bank', 'Gates Foundation', 'African Development Bank', 'USAID']

// ── Page ──────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-20 -top-20 size-96 rounded-full bg-blue-300 blur-3xl" />
          <div className="absolute -right-20 bottom-0 size-80 rounded-full bg-indigo-300 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-28">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium">
            <Globe className="size-4" />
            <span>Africa&apos;s Research, Innovation &amp; Funding Ecosystem</span>
          </div>

          <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
            Where African Research,<br />
            Innovation and{' '}
            <span className="text-yellow-300">Funding Connect</span>
          </h1>

          <p className="mt-6 max-w-2xl text-xl text-blue-100">
            Discover grants, scholarships, fellowships, publish your research, find collaborators, and accelerate your impact — all in one platform built for Africa.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/signup" className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-8 py-3.5 text-sm font-bold text-gray-900 transition-opacity hover:opacity-90">
              Join Free Today <ArrowRight className="size-4" />
            </Link>
            <Link href="/grants" className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/20">
              <Search className="size-4" /> Explore Funding
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map(({ value, label }) => (
              <div key={label} className="rounded-2xl border border-white/20 bg-white/10 px-4 py-4 text-center backdrop-blur-sm">
                <div className="text-2xl font-bold text-yellow-300">{value}</div>
                <div className="mt-0.5 text-xs text-blue-200">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust bar ── */}
      <section className="border-y border-gray-200 bg-white py-5">
        <div className="mx-auto max-w-6xl px-6">
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-gray-400">Trusted by organizations across Africa</p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-2">
            {trustLogos.map((name) => (
              <span key={name} className="text-sm font-semibold text-gray-400 transition-colors hover:text-gray-600">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Funding categories ── */}
      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Browse by Funding Type</h2>
            <p className="mt-1 text-sm text-gray-500">From research grants to startup accelerators — every opportunity in one place</p>
          </div>
          <Link href="/grants" className="hidden items-center gap-1 text-sm font-medium text-blue-700 hover:underline sm:flex">
            View all <ChevronRight className="size-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {fundingCategories.map(({ label, count, icon: Icon, href }) => (
            <Link key={label} href={href}
              className="flex flex-col items-center gap-2 rounded-2xl border border-gray-200 bg-white p-5 text-center transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-md">
              <div className="flex size-11 items-center justify-center rounded-xl bg-blue-50">
                <Icon className="size-5 text-blue-700" />
              </div>
              <span className="text-sm font-semibold text-gray-800">{label}</span>
              <span className="text-xs font-bold text-blue-700">{count}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured grants ── */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                <Star className="size-3.5 fill-yellow-500 text-yellow-500" /> Featured Opportunities
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Top Funding Right Now</h2>
            </div>
            <Link href="/grants" className="hidden items-center gap-1 text-sm font-medium text-blue-700 hover:underline sm:flex">
              All opportunities <ChevronRight className="size-4" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredGrants.map((g) => (
              <Link key={g.title} href={g.href}
                className="group flex flex-col rounded-3xl border border-gray-200 bg-gray-50 p-5 transition-all hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:shadow-lg">
                <div className="mb-3 flex items-center justify-between">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    g.status === 'Open' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>{g.status}</span>
                  <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">{g.type}</span>
                </div>
                <h3 className="mb-1 text-sm font-bold leading-snug text-gray-900">{g.title}</h3>
                <p className="mb-3 flex-1 text-xs text-gray-500">{g.funder}</p>
                <div className="text-lg font-bold text-blue-700">{g.amount}</div>
                <div className="mt-1 text-xs text-gray-400">Deadline: {g.deadline}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Platform modules ── */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700">
              <Lightbulb className="size-4" /> Platform Modules
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need, in one ecosystem
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-gray-500">
              From grant discovery to publishing, collaboration to AI assistance — AfriGrantPipeline is the complete infrastructure for African research and innovation.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {platformModules.map(({ icon: Icon, title, description, href, badge, color }) => (
              <Link key={title} href={href}
                className="group flex flex-col gap-4 rounded-3xl border border-gray-200 bg-white p-6 transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg">
                <div className="flex items-start justify-between">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-gray-100 group-hover:bg-blue-50">
                    <Icon className="size-5 text-gray-600 group-hover:text-blue-700" />
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${color}`}>{badge}</span>
                </div>
                <div>
                  <h3 className="mb-1.5 font-bold text-gray-900">{title}</h3>
                  <p className="text-sm leading-relaxed text-gray-500">{description}</p>
                </div>
                <div className="mt-auto flex items-center gap-1 text-xs font-semibold text-blue-700 opacity-0 transition-opacity group-hover:opacity-100">
                  Explore <ArrowRight className="size-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Independent researchers spotlight ── */}
      <section className="bg-gradient-to-br from-[#0A5C36] to-[#1E3A5F] py-16 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium">
                <ShieldCheck className="size-4" /> Platform Differentiator
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Funding for<br />
                <span className="text-yellow-300">Independent Researchers</span>
              </h2>
              <p className="mt-4 text-lg text-white/80">
                Most grant platforms focus only on universities. AfriGrantPipeline uniquely serves independent researchers, non-affiliated scholars, authors, consultants, and faith-based innovators who are often invisible to mainstream funding.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  'No institutional affiliation required',
                  'Grants open to individuals and solo researchers',
                  'Faith-based and ministry-linked funding',
                  'Personal capacity grants and book publication funds',
                  'AI tools that work without a university email',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-white/90">
                    <CheckCircle className="size-4 shrink-0 text-yellow-300" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/grants"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-yellow-400 px-7 py-3 text-sm font-bold text-gray-900 transition-opacity hover:opacity-90">
                Explore Independent Researcher Grants <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'NEH Public Scholars', amount: '$60,000', tag: 'No institution required' },
                { label: 'APSA Centennial Center', amount: '$10,000', tag: 'Independent scholars' },
                { label: 'Open Society Foundations', amount: 'Varies', tag: 'Civil society' },
                { label: 'Pulitzer Center', amount: 'Project grants', tag: 'Independent journalists' },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                  <div className="text-base font-bold text-yellow-300">{item.amount}</div>
                  <div className="mt-1 text-sm font-semibold text-white">{item.label}</div>
                  <div className="mt-1 text-xs text-white/60">{item.tag}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Success stories ── */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-700">
              <TrendingUp className="size-4" /> Success Stories
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Real Results for African Researchers
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {successStories.map(({ name, role, result, avatar, color }) => (
              <div key={name} className="rounded-3xl border border-gray-200 bg-white p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className={`flex size-11 items-center justify-center rounded-full text-sm font-bold ${color}`}>
                    {avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{name}</div>
                    <div className="text-xs text-gray-500">{role}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                  <p className="text-sm text-gray-700">{result}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Membership tiers ── */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-yellow-100 px-4 py-1.5 text-sm font-medium text-yellow-700">
              <BarChart3 className="size-4" /> Membership Plans
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Invest in Your Research Future
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-gray-500">
              From free access to full concierge service — choose the plan that matches your ambition.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {membershipTiers.map(({ name, price, period, description, features, cta, href, highlight }) => (
              <div key={name} className={`relative flex flex-col rounded-3xl border p-6 transition-all ${
                highlight
                  ? 'border-blue-500 bg-blue-700 text-white shadow-2xl shadow-blue-200'
                  : 'border-gray-200 bg-gray-50'
              }`}>
                {highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-yellow-400 px-4 py-1 text-xs font-bold text-gray-900">
                    Most Popular
                  </div>
                )}
                <div className={`mb-1 text-sm font-semibold ${highlight ? 'text-blue-200' : 'text-blue-700'}`}>{name}</div>
                <div className="flex items-end gap-1">
                  <span className={`text-3xl font-bold ${highlight ? 'text-white' : 'text-gray-900'}`}>{price}</span>
                  <span className={`mb-1 text-sm ${highlight ? 'text-blue-200' : 'text-gray-400'}`}>{period}</span>
                </div>
                <p className={`mb-5 mt-2 text-sm ${highlight ? 'text-blue-100' : 'text-gray-500'}`}>{description}</p>
                <ul className="mb-6 flex-1 space-y-2.5">
                  {features.map((f) => (
                    <li key={f} className={`flex items-start gap-2 text-sm ${highlight ? 'text-blue-100' : 'text-gray-600'}`}>
                      <CheckCircle className={`mt-0.5 size-4 shrink-0 ${highlight ? 'text-yellow-300' : 'text-blue-700'}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={href}
                  className={`block rounded-2xl py-3 text-center text-sm font-bold transition-all ${
                    highlight
                      ? 'bg-yellow-400 text-gray-900 hover:opacity-90'
                      : 'border border-blue-700 text-blue-700 hover:bg-blue-50'
                  }`}>
                  {cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Up and running in minutes</h2>
            <p className="mt-3 text-gray-500">Join thousands of African researchers, students, and entrepreneurs already on the platform.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { n: '01', title: 'Create your profile', desc: 'Sign up as a researcher, founder, or institution. Add your interests, background, and goals.' },
              { n: '02', title: 'Discover opportunities', desc: 'Browse grants, scholarships, and accelerators matched to your discipline, country, and career stage.' },
              { n: '03', title: 'Apply and connect', desc: 'Submit applications, get AI assistance, publish your work, and build collaborations.' },
            ].map(({ n, title, desc }) => (
              <div key={n} className="flex flex-col items-center rounded-3xl border border-gray-200 bg-white p-8 text-center">
                <div className="mb-5 flex size-12 items-center justify-center rounded-full bg-blue-700 text-sm font-bold text-white">{n}</div>
                <h3 className="mb-2 font-semibold text-gray-900">{title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Subscription CTA ── */}
      <section className="bg-blue-700 py-14">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Bell className="mx-auto mb-4 size-10 text-blue-200" />
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Get Weekly Grant Intelligence
          </h2>
          <p className="mx-auto mt-3 max-w-md text-blue-100">
            Updated grant lists, deadline reminders, application templates, and funding intelligence — delivered every week.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a href="https://store.mabrigkorie.org" target="_blank" rel="noopener noreferrer"
              className="rounded-full bg-white px-8 py-3.5 text-sm font-bold text-blue-700 transition-colors hover:bg-gray-100">
              Start Quarterly Subscription — ₦12,000
            </a>
            <Link href="/signup"
              className="rounded-full border border-blue-400 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-blue-600">
              Create Free Account
            </Link>
          </div>
          <p className="mt-4 text-sm text-blue-200">Cancel anytime · Quarterly updates · Application templates included</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex size-9 items-center justify-center rounded-xl bg-blue-700">
                  <span className="text-sm font-bold text-white">AG</span>
                </div>
                <span className="text-lg font-bold text-gray-900">AfriGrant<span className="text-blue-700">Pipeline</span></span>
              </div>
              <p className="max-w-xs text-sm leading-relaxed text-gray-500">
                Africa&apos;s most comprehensive research, funding, and innovation ecosystem — connecting the continent&apos;s brightest minds with the resources they deserve.
              </p>
              <div className="mt-4 text-xs text-gray-400">Built for Africa, by Africa 🌍</div>
            </div>
            {[
              {
                title: 'Discover',
                links: [['Research Grants', '/grants'], ['Scholarships', '/scholarships'], ['Business Grants', '/business-grants'], ['Fellowships', '/grants'], ['Accelerators', '/grants']],
              },
              {
                title: 'Platform',
                links: [['AfriPublish', '/articles'], ['Collaborate', '/collaborations'], ['Mentorship', '/mentorships'], ['AI Tools', '/dashboard/ai-tools'], ['Research Center', '/research-center']],
              },
              {
                title: 'Company',
                links: [['About', '/about'], ['Pricing', '/pricing'], ['Blog', '/blog'], ['Privacy', '/privacy'], ['Contact', '/contact']],
              },
            ].map(({ title, links }) => (
              <div key={title}>
                <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">{title}</h4>
                <ul className="space-y-2.5 text-sm">
                  {links.map(([label, href]) => (
                    <li key={label}><Link href={href} className="text-gray-500 hover:text-gray-900">{label}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-8 sm:flex-row">
            <p className="text-xs text-gray-400">© {new Date().getFullYear()} AfriGrantPipeline. All rights reserved.</p>
            <div className="flex gap-6 text-xs text-gray-400">
              <Link href="/privacy" className="hover:text-gray-600">Privacy</Link>
              <Link href="/terms" className="hover:text-gray-600">Terms</Link>
              <Link href="/contact" className="hover:text-gray-600">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
