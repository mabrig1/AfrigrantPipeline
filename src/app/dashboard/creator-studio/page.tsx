import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import {
  ArrowRight,
  Bot,
  BriefcaseBusiness,
  FileSearch,
  Radar,
  Rocket,
  Sparkles,
  Target,
} from 'lucide-react'

export const metadata = {
  title: 'Mabrig Grant Studio | AfriGrantPipeline',
}

const stations = [
  {
    icon: FileSearch,
    title: 'CV Grant Matcher',
    description:
      'Upload a CV, search live opportunities, test hard eligibility, expose missing requirements and build a realistic funding path.',
    href: '/dashboard/cv-grant-matcher',
    action: 'Match a CV',
    badge: 'Start here',
  },
  {
    icon: Rocket,
    title: 'Personal Grant Pipeline',
    description:
      'Turn your live Mabrig technology, research, education and innovation platforms into creator-owned funding cases.',
    href: '/dashboard/personal-grant-pipeline',
    action: 'Open pipeline',
    badge: 'Creator',
  },
  {
    icon: Radar,
    title: 'Grant Intelligence',
    description:
      'Run the agentic discovery engine, inspect current calls, verify sources and keep the funding catalogue fresh.',
    href: '/dashboard/grant-intelligence',
    action: 'Scan funding',
    badge: 'Live web',
  },
  {
    icon: BriefcaseBusiness,
    title: 'Consultancy Desk',
    description:
      'Manage your own and client grant engagements, quotes, applications, partnerships, milestones and reporting.',
    href: '/dashboard/consultancy',
    action: 'Manage cases',
    badge: 'Operations',
  },
  {
    icon: Sparkles,
    title: 'AI Tools',
    description:
      'Open the creator-only AI workbench for proposal support and other assisted research workflows.',
    href: '/dashboard/ai-tools',
    action: 'Open tools',
    badge: 'AI',
  },
]

export default async function CreatorStudioPage() {
  const session = await auth()
  if (!session?.user) redirect('/login?callbackUrl=%2Fdashboard%2Fcreator-studio')
  if (session.user.role !== 'admin') redirect('/dashboard')

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl border border-gold/25 bg-gradient-to-br from-gold/15 via-card to-card p-6 sm:p-8">
        <div className="max-w-4xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-gold">
            <Bot className="size-3.5" />
            Creator-only command centre
          </div>
          <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
            Mabrig <span className="text-gold">Grant Studio</span>
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
            Your private funding production studio: assess a CV, discover realistic grants, create a funding case, build the application, develop partnerships and manage delivery from one workspace.
          </p>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          {[
            ['01', 'Profile', 'Understand what the applicant or project can actually qualify for.'],
            ['02', 'Match', 'Search current calls and expose eligibility gaps before wasting an application.'],
            ['03', 'Execute', 'Move a viable opportunity into consultancy, proposal and grant-management workflows.'],
          ].map(([n, title, text]) => (
            <div key={n} className="rounded-2xl border border-border/70 bg-background/35 p-4">
              <div className="text-xs font-black text-gold">{n}</div>
              <div className="mt-1 font-bold">{title}</div>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">Studio workstations</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Each workstation handles one stage of your funding pipeline.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {stations.map(({ icon: Icon, title, description, href, action, badge }) => (
            <Link
              key={title}
              href={href}
              className="group flex min-h-56 flex-col rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-gold/35 hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex size-11 items-center justify-center rounded-xl bg-gold/10 text-gold">
                  <Icon className="size-5" />
                </div>
                <span className="rounded-full border border-gold/20 bg-gold/5 px-2.5 py-1 text-[11px] font-semibold text-gold">
                  {badge}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-bold">{title}</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{description}</p>
              <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-gold">
                {action} <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5">
        <div className="flex items-start gap-3">
          <Target className="mt-0.5 size-5 shrink-0 text-emerald-300" />
          <div>
            <h2 className="font-bold text-emerald-200">Recommended studio flow</h2>
            <p className="mt-1 text-sm leading-6 text-emerald-100/80">
              Start with the CV Grant Matcher when an applicant has a CV. Start with Personal Grant Pipeline when the funding target is one of your own platforms or ventures. Only move strong or strategically repairable matches into the Consultancy Desk for application execution.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
