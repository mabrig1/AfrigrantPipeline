import Link from 'next/link'
import { ArrowRight, Globe, Search, BookOpen, Users, GraduationCap, Lightbulb, FileText, Bell } from 'lucide-react'

const features = [
  {
    icon: Search,
    title: 'Grant Marketplace',
    description: 'Discover curated funding opportunities across Africa. Filter by country, field, deadline, and grant type — all in one place.',
    href: '/grants',
    badge: 'Funding',
  },
  {
    icon: BookOpen,
    title: 'AfriPublish',
    description: 'Submit, review, and publish peer-reviewed research in African journals. Open-access first, with full DOI registration.',
    href: '/articles',
    badge: 'Publishing',
  },
  {
    icon: Users,
    title: 'Collaborate',
    description: 'Post open collaboration projects, find co-investigators, and build cross-border research teams across African institutions.',
    href: '/collaborations',
    badge: 'Teams',
  },
  {
    icon: GraduationCap,
    title: 'Mentorship',
    description: 'Connect emerging researchers with senior academics and industry leaders. Structured mentorship with goal tracking.',
    href: '/mentorships',
    badge: 'Growth',
  },
]

const steps = [
  { number: '01', title: 'Create your profile', description: 'Sign up as a researcher, institution, or funder. Add your research interests, publications, and affiliation.' },
  { number: '02', title: 'Discover opportunities', description: 'Browse grants, open collaborations, and journals matched to your discipline, country, and career stage.' },
  { number: '03', title: 'Apply and connect', description: 'Submit grant applications, request mentorship, or publish your work — all from a single dashboard.' },
]

const stats = [
  { value: '500+', label: 'Active Grants' },
  { value: '120+', label: 'Partner Institutions' },
  { value: '40+', label: 'Countries Covered' },
  { value: '10K+', label: 'Researchers' },
]

const trustLogos = ['African Union', 'UNESCO Africa', 'World Bank', 'Gates Foundation', 'African Development Bank']

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Navbar ── */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-700">
              <span className="text-lg font-bold text-white">AG</span>
            </div>
            <span className="text-2xl font-semibold tracking-tight">
              AfriGrant<span className="text-blue-700">Pipeline</span>
            </span>
          </div>
          <div className="hidden items-center gap-1 md:flex">
            <Link href="/" className="px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-gray-900">Home</Link>
            <Link href="/grants" className="px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-gray-900">Browse Grants</Link>
            <Link href="/articles" className="px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-gray-900">AfriPublish</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">Sign In</Link>
            <Link href="/signup" className="rounded-2xl bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="mx-auto max-w-7xl px-6 pb-8 pt-16">
        <div className="max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700">
            <Globe className="size-4" />
            <span>Africa&apos;s Research & Grant Infrastructure</span>
          </div>

          <h1 className="text-5xl font-semibold leading-none tracking-tight text-gray-900 sm:text-6xl">
            Where African Research<br />
            <span className="text-blue-700">Meets Funding</span>
          </h1>

          <p className="mt-5 max-w-xl text-xl text-gray-600">
            The LinkedIn + ResearchGate + Grant Marketplace for Africa. Connecting students, researchers, universities, NGOs, and funders across the continent.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/signup" className="inline-flex items-center gap-2 rounded-full bg-blue-700 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800">
              Get Started Free <ArrowRight className="size-4" />
            </Link>
            <Link href="/grants" className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-7 py-3.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100">
              <Search className="size-4" /> Browse Grants
            </Link>
          </div>
        </div>
      </section>

      {/* ── Trust bar ── */}
      <section className="border-y border-gray-200 bg-white py-6">
        <div className="mx-auto max-w-6xl px-6">
          <p className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-gray-400">Trusted by organizations across Africa</p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
            {trustLogos.map((name) => (
              <span key={name} className="text-sm font-semibold text-gray-400 transition-colors hover:text-gray-600">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center rounded-3xl border border-gray-200 bg-white py-8 text-center">
              <span className="text-4xl font-bold text-blue-700">{value}</span>
              <span className="mt-1 text-sm text-gray-500">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700">
              <Lightbulb className="size-4" /> Platform Modules
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">Everything you need in one place</h2>
            <p className="mx-auto mt-3 max-w-xl text-gray-600">
              AfrigrantPipeline bundles grant discovery, academic publishing, collaboration, and mentorship into one cohesive platform.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {features.map(({ icon: Icon, title, description, href, badge }) => (
              <Link
                key={title}
                href={href}
                className="group flex flex-col gap-4 rounded-3xl border border-gray-200 bg-gray-50 p-6 transition-all hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-blue-100">
                    <Icon className="size-5 text-blue-700" />
                  </div>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">{badge}</span>
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
                  <p className="text-sm leading-relaxed text-gray-600">{description}</p>
                </div>
                <div className="mt-auto flex items-center gap-1.5 text-sm font-medium text-blue-700 opacity-0 transition-opacity group-hover:opacity-100">
                  Explore <ArrowRight className="size-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700">
              <FileText className="size-4" /> Getting Started
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">Up and running in minutes</h2>
            <p className="mx-auto mt-3 max-w-xl text-gray-600">
              Join thousands of African researchers who found funding, collaborators, and mentors on AfrigrantPipeline.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {steps.map(({ number, title, description }) => (
              <div key={number} className="flex flex-col items-center rounded-3xl border border-gray-200 bg-white p-8 text-center">
                <div className="mb-5 flex size-12 items-center justify-center rounded-full bg-blue-700 text-sm font-bold text-white">
                  {number}
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">{title}</h3>
                <p className="text-sm leading-relaxed text-gray-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Subscription CTA ── */}
      <section className="bg-blue-700 py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Bell className="mx-auto mb-4 size-10 text-blue-200" />
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Want fresh grants every month?</h2>
          <p className="mx-auto mt-3 max-w-md text-blue-100">
            Subscribe to get updated grant lists + deadline reminders + application templates delivered to your inbox.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://store.mabrigkorie.org"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-blue-700 transition-colors hover:bg-gray-100"
            >
              Start Quarterly Subscription — ₦12,000
            </a>
            <Link href="/signup" className="rounded-full border border-blue-400 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-blue-600">
              Create Free Account
            </Link>
          </div>
          <p className="mt-4 text-sm text-blue-200">Cancel anytime · Quarterly updates · Application templates included</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-blue-700">
                  <span className="text-xs font-bold text-white">AG</span>
                </div>
                <span className="font-semibold text-gray-900">AfriGrant<span className="text-blue-700">Pipeline</span></span>
              </div>
              <p className="text-sm leading-relaxed text-gray-500">
                Africa&apos;s Research & Innovation Infrastructure — connecting the continent&apos;s brightest minds with the funding they deserve.
              </p>
            </div>
            <div>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">Platform</h4>
              <ul className="space-y-2.5 text-sm">
                {[['Browse Grants', '/grants'], ['AfriPublish', '/articles'], ['Collaborate', '/collaborations'], ['Mentorship', '/mentorships']].map(([label, href]) => (
                  <li key={label}><Link href={href} className="text-gray-500 hover:text-gray-900">{label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">Community</h4>
              <ul className="space-y-2.5 text-sm">
                {[['Researchers', '/researchers'], ['Institutions', '/institutions'], ['Funders', '/funders'], ['Blog', '/blog']].map(([label, href]) => (
                  <li key={label}><Link href={href} className="text-gray-500 hover:text-gray-900">{label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">Legal</h4>
              <ul className="space-y-2.5 text-sm">
                {[['Privacy Policy', '/privacy'], ['Terms of Service', '/terms'], ['Contact', '/contact']].map(([label, href]) => (
                  <li key={label}><Link href={href} className="text-gray-500 hover:text-gray-900">{label}</Link></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-8 sm:flex-row">
            <p className="text-xs text-gray-400">© {new Date().getFullYear()} AfrigrantPipeline. All rights reserved.</p>
            <p className="text-xs text-gray-400">Built for Africa, by Africa 🌍</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
