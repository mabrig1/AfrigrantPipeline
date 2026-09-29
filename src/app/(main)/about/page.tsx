import Link from 'next/link'
import {
  ArrowRight,
  Search,
  FileText,
  Handshake,
  ClipboardCheck,
  ShieldCheck,
  Globe2,
  Users,
} from 'lucide-react'

export const metadata = {
  title: 'About AfriGrantPipeline',
  description:
    'Learn about AfriGrantPipeline, its research-funding mission, consultancy services, and commitment to practical support for African researchers and innovators.',
}

const services = [
  {
    icon: Search,
    title: 'Funding discovery',
    text: 'We help researchers identify grants, fellowships, scholarships, and other funding opportunities that fit their research profile and eligibility.',
  },
  {
    icon: FileText,
    title: 'Grant development',
    text: 'We support concept notes, proposals, budgets, work plans, application narratives, and submission-readiness reviews.',
  },
  {
    icon: Handshake,
    title: 'Research partnerships',
    text: 'We help map potential collaborators, clarify partnership roles, and prepare professional outreach and collaboration materials.',
  },
  {
    icon: ClipboardCheck,
    title: 'Project support',
    text: 'For funded work, consultancy support can include milestones, reporting preparation, monitoring plans, and grant-delivery organization.',
  },
]

const principles = [
  {
    icon: ShieldCheck,
    title: 'Evidence before claims',
    text: 'We separate verified facts from assumptions and avoid presenting funding, partnerships, or outcomes as guaranteed.',
  },
  {
    icon: Globe2,
    title: 'Africa-focused, globally connected',
    text: 'The platform is designed around the needs of African researchers while supporting access to relevant international opportunities and collaborators.',
  },
  {
    icon: Users,
    title: 'Researcher-centered support',
    text: 'Researchers, postgraduate students, independent scholars, innovators, and institutions can use the platform according to their specific needs.',
  },
]

export default function AboutPage() {
  return (
    <div className="bg-gray-50 text-gray-900">
      <section className="border-b border-gray-200 bg-gradient-to-br from-blue-800 via-blue-900 to-slate-900 text-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
          <p className="text-sm font-bold uppercase tracking-wider text-yellow-300">
            About AfriGrantPipeline
          </p>
          <div className="mt-5 grid items-start gap-10 lg:grid-cols-[1.35fr_1fr]">
            <div>
              <h1 className="max-w-3xl text-4xl font-extrabold leading-tight sm:text-6xl">
                Connecting African research to funding, partnerships and practical support.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-100">
                AfriGrantPipeline is a research-support and funding platform
                built to help African researchers, postgraduate students,
                innovators and institutions discover opportunities and prepare
                stronger, evidence-based applications.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/consultancy"
                  className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-6 py-3 font-bold text-gray-900 hover:opacity-90"
                >
                  Explore consultancy <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/grants"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 font-semibold text-white hover:bg-white/20"
                >
                  Browse funding
                </Link>
              </div>
            </div>

            <aside className="rounded-3xl border border-white/15 bg-white/10 p-7 backdrop-blur-sm">
              <p className="text-sm font-bold uppercase tracking-wider text-yellow-300">
                Leadership
              </p>
              <h2 className="mt-3 text-2xl font-bold">Mabrig Korie</h2>
              <p className="mt-1 font-semibold text-blue-100">
                Founder &amp; Lead Consultant
              </p>
              <p className="mt-4 leading-7 text-blue-100">
                AfriGrantPipeline is a MABRIG Technologies initiative focused
                on research funding, grant development, research partnerships
                and practical project support.
              </p>
              <Link
                href="/contact"
                className="mt-6 inline-flex items-center gap-2 font-semibold text-yellow-300 hover:underline"
              >
                Contact AfriGrantPipeline <ArrowRight className="size-4" />
              </Link>
            </aside>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-blue-700">
              Our purpose
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">
              Make the funding process easier to navigate.
            </h2>
          </div>
          <div className="space-y-4 text-base leading-8 text-gray-600">
            <p>
              Researchers often work across disconnected tools, funding portals,
              institutional requirements and application formats. AfriGrantPipeline
              brings grant discovery, proposal support, partnership development,
              research tools and consultancy workflows into one environment.
            </p>
            <p>
              The platform is designed to support both self-service discovery
              and project-based consultancy. Where professional support is
              requested, scope, deliverables, turnaround and fees are agreed
              before work begins.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-wider text-blue-700">
              What we do
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">
              From research brief to funding application.
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {services.map(({ icon: Icon, title, text }) => (
              <article
                key={title}
                className="rounded-2xl border border-gray-200 bg-gray-50 p-7"
              >
                <Icon className="size-7 text-blue-700" />
                <h3 className="mt-5 text-xl font-bold">{title}</h3>
                <p className="mt-3 leading-7 text-gray-600">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-wider text-blue-700">
            How we work
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight">
            Practical support with clear boundaries.
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {principles.map(({ icon: Icon, title, text }) => (
            <article
              key={title}
              className="rounded-2xl border border-gray-200 bg-white p-6"
            >
              <Icon className="size-6 text-blue-700" />
              <h3 className="mt-4 font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-7 text-gray-600">{text}</p>
            </article>
          ))}
        </div>

        <div className="mt-12 rounded-3xl bg-blue-700 px-7 py-10 text-white sm:px-10">
          <div className="grid items-center gap-6 md:grid-cols-[1fr_auto]">
            <div>
              <h2 className="text-2xl font-bold">Have a research project or funding need?</h2>
              <p className="mt-2 max-w-2xl leading-7 text-blue-100">
                Send your research topic, project brief or funding question and
                we will help identify the next suitable step.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="rounded-full bg-white px-6 py-3 font-bold text-blue-700 hover:bg-gray-100"
              >
                Contact us
              </Link>
              <Link
                href="/dashboard/consultancy"
                className="rounded-full border border-blue-300 px-6 py-3 font-bold text-white hover:bg-blue-600"
              >
                Request consultancy
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-8 text-sm leading-6 text-gray-500">
          Funding decisions are made by external funders. AfriGrantPipeline
          provides research intelligence, drafting support and consultancy, but
          does not guarantee awards or institutional approvals.
        </p>
      </section>
    </div>
  )
}
