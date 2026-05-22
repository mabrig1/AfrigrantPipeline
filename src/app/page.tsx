import Link from 'next/link'
import {
  BookOpen,
  Users,
  Lightbulb,
  GraduationCap,
  ArrowRight,
  Globe,
  Search,
  FileText,
  Star,
} from 'lucide-react'
import Header from '@/components/layout/Header'

// ── Static data ───────────────────────────────────────────────────────────────

const features = [
  {
    icon: Search,
    title: 'Grant Marketplace',
    description:
      'Discover hundreds of funding opportunities across Africa. Filter by country, field, deadline, and grant type — all in one place.',
    href: '/grants',
    badge: 'Funding',
  },
  {
    icon: BookOpen,
    title: 'AfriPublish',
    description:
      'Submit, review, and publish peer-reviewed research in African journals. Open-access first, with full DOI registration.',
    href: '/articles',
    badge: 'Publishing',
  },
  {
    icon: Users,
    title: 'Collaborate',
    description:
      'Post open collaboration projects, find co-investigators, and build cross-border research teams across African institutions.',
    href: '/collaborations',
    badge: 'Teams',
  },
  {
    icon: GraduationCap,
    title: 'Mentorship',
    description:
      'Connect emerging researchers with senior academics and industry leaders. Structured mentorship with goal tracking.',
    href: '/mentorships',
    badge: 'Growth',
  },
]

const steps = [
  {
    number: '01',
    title: 'Create your profile',
    description:
      'Sign up as a researcher, institution, or funder. Add your research interests, publications, and affiliation.',
  },
  {
    number: '02',
    title: 'Discover opportunities',
    description:
      'Browse grants, open collaborations, and journals matched to your discipline, country, and career stage.',
  },
  {
    number: '03',
    title: 'Apply and connect',
    description:
      'Submit grant applications, request mentorship, or publish your work — all from a single dashboard.',
  },
]

const stats = [
  { value: '500+', label: 'Active Grants' },
  { value: '120+', label: 'Partner Institutions' },
  { value: '40+', label: 'Countries Covered' },
  { value: '10K+', label: 'Researchers' },
]

const trustLogos = [
  'African Union',
  'UNESCO Africa',
  'World Bank',
  'Bill & Melinda Gates Foundation',
  'African Development Bank',
]

// ── Page ──────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
    <Header />
    <main className="flex flex-col">
      {/* ── Hero ── */}
      <section className="hero-bg relative isolate flex min-h-[92vh] flex-col items-center justify-center px-4 py-24 text-center">
        <div className="animate-fade-in">
          <span className="badge-gold mb-6">
            <Star className="size-3" />
            Africa&apos;s Research Infrastructure
          </span>
        </div>

        <h1 className="animate-fade-up mx-auto max-w-4xl text-balance text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
          Where African{' '}
          <span className="text-gradient">Research</span>{' '}
          Meets{' '}
          <span className="text-gradient">Funding</span>
        </h1>

        <p
          className="animate-fade-up mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl"
          style={{ animationDelay: '0.1s' }}
        >
          The LinkedIn + ResearchGate + Grant Marketplace for Africa. Connecting
          students, researchers, universities, NGOs, and funders across the continent.
        </p>

        <div
          className="animate-fade-up mt-10 flex flex-col items-center gap-4 sm:flex-row"
          style={{ animationDelay: '0.2s' }}
        >
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98]"
          >
            Get Started Free
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/grants"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-7 py-3.5 text-sm font-semibold text-foreground transition-all hover:border-gold/40 hover:bg-surface-3 active:scale-[0.98]"
          >
            Browse Grants
          </Link>
        </div>

        {/* Scroll hint */}
        <div
          className="animate-fade-in absolute bottom-10 left-1/2 -translate-x-1/2"
          style={{ animationDelay: '0.6s' }}
        >
          <div className="flex h-8 w-5 items-start justify-center rounded-full border border-border p-1">
            <div className="h-2 w-1 animate-bounce rounded-full bg-muted-foreground" />
          </div>
        </div>
      </section>

      {/* ── Trust bar ── */}
      <section className="border-y border-border bg-surface-1 py-8">
        <div className="mx-auto max-w-6xl px-4">
          <p className="mb-6 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Trusted by organizations across Africa
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {trustLogos.map((name) => (
              <span
                key={name}
                className="text-sm font-semibold text-muted-foreground/60 transition-colors hover:text-muted-foreground"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="mx-auto w-full max-w-6xl px-4 py-24">
        <div className="mb-14 text-center">
          <span className="badge-gold mb-4">
            <Lightbulb className="size-3" />
            Platform Modules
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Everything you need in one place
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            AfrigrantPipeline bundles grant discovery, academic publishing,
            collaboration, and mentorship into a single cohesive platform.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {features.map(({ icon: Icon, title, description, href, badge }) => (
            <Link
              key={title}
              href={href}
              className="card-hover group flex flex-col gap-4 rounded-xl border border-border bg-card p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex size-11 items-center justify-center rounded-lg bg-gold/10">
                  <Icon className="size-5 text-gold" />
                </div>
                <span className="badge-gold text-[11px]">{badge}</span>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
              </div>
              <div className="mt-auto flex items-center gap-1.5 text-sm font-medium text-gold opacity-0 transition-opacity group-hover:opacity-100">
                Explore <ArrowRight className="size-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="bg-surface-1 py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-14 text-center">
            <span className="badge-gold mb-4">
              <FileText className="size-3" />
              Getting Started
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Up and running in minutes
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Join thousands of African researchers who found funding, collaborators,
              and mentors on AfrigrantPipeline.
            </p>
          </div>

          <div className="relative grid gap-10 sm:grid-cols-3">
            {steps.map(({ number, title, description }, i) => (
              <div key={number} className="relative flex flex-col items-center text-center">
                {i < steps.length - 1 && <div className="step-connector" />}
                <div className="mb-5 flex size-12 items-center justify-center rounded-full border-2 border-gold/40 bg-gold/10 text-sm font-bold text-gold">
                  {number}
                </div>
                <h3 className="mb-2 text-base font-semibold">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="mx-auto w-full max-w-6xl px-4 py-24">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {stats.map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center text-center">
              <span className="text-4xl font-extrabold text-gold sm:text-5xl">{value}</span>
              <span className="mt-2 text-sm text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section className="px-4 pb-24">
        <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-gold/20 bg-gradient-to-br from-gold/10 via-surface-2 to-surface-1 p-10 text-center sm:p-14">
          <Globe className="mx-auto mb-6 size-12 text-gold" />
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Ready to accelerate African research?
          </h2>
          <p className="mx-auto mb-8 max-w-lg text-muted-foreground">
            Join the platform built for African researchers, institutions, and funders.
            Free to sign up. No credit card required.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98]"
          >
            Create your free account
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border bg-surface-1">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-1">
              <Link href="/" className="inline-flex items-center gap-2 text-lg font-extrabold">
                Afri<span className="text-gold">grant</span>Pipeline
              </Link>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Africa&apos;s Research & Innovation Infrastructure — connecting
                the continent&apos;s brightest minds with the funding they deserve.
              </p>
            </div>

            <div>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Platform
              </h4>
              <ul className="space-y-2.5 text-sm">
                {[
                  ['Browse Grants', '/grants'],
                  ['AfriPublish', '/articles'],
                  ['Collaborate', '/collaborations'],
                  ['Mentorship', '/mentorships'],
                ].map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="text-muted-foreground transition-colors hover:text-foreground">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Community
              </h4>
              <ul className="space-y-2.5 text-sm">
                {[
                  ['Researchers', '/researchers'],
                  ['Institutions', '/institutions'],
                  ['Funders', '/funders'],
                  ['Blog', '/blog'],
                ].map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="text-muted-foreground transition-colors hover:text-foreground">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Legal
              </h4>
              <ul className="space-y-2.5 text-sm">
                {[
                  ['Privacy Policy', '/privacy'],
                  ['Terms of Service', '/terms'],
                  ['Cookie Policy', '/cookies'],
                  ['Contact', '/contact'],
                ].map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="text-muted-foreground transition-colors hover:text-foreground">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} AfrigrantPipeline. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">Built for Africa, by Africa 🌍</p>
          </div>
        </div>
      </footer>
    </main>
    </>
  )
}
