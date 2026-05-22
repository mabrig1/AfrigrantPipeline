import Link from 'next/link'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { connectDB } from '@/lib/mongodb'
import Grant from '@/models/Grant'
import Article from '@/models/Article'
import mongoose from 'mongoose'
import {
  Bookmark,
  BookOpen,
  TrendingUp,
  Clock,
  ChevronRight,
  PlusCircle,
  Search,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react'
import { formatDeadline, formatDate, formatCurrency, cn } from '@/lib/utils'
import type { ArticleStatus, GrantType } from '@/types/database'

// ── Serialised lean types ──────────────────────────────────────────────────────

interface GrantLean {
  _id: mongoose.Types.ObjectId
  title: string
  funder: string
  amount: number
  currency: string
  deadline: Date
  grantType: GrantType
  status: string
  categories: string[]
}

interface ArticleLean {
  _id: mongoose.Types.ObjectId
  title: string
  status: ArticleStatus
  createdAt: Date
  viewCount: number
  keywords: string[]
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const ARTICLE_STATUS: Record<ArticleStatus, { label: string; cls: string }> = {
  draft:        { label: 'Draft',        cls: 'bg-muted/40 text-muted-foreground border-border' },
  submitted:    { label: 'Submitted',    cls: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  under_review: { label: 'Under Review', cls: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  published:    { label: 'Published',    cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  rejected:     { label: 'Rejected',     cls: 'bg-red-500/10 text-red-400 border-red-500/20' },
}

const GRANT_TYPE_LABEL: Record<GrantType, string> = {
  research: 'Research', project: 'Project', scholarship: 'Scholarship',
  fellowship: 'Fellowship', seed: 'Seed', other: 'Other',
}

function ArticleStatusBadge({ status }: { status: ArticleStatus }) {
  const s = ARTICLE_STATUS[status] ?? ARTICLE_STATUS.draft
  return (
    <span className={cn('rounded-full border px-2 py-0.5 text-[10px] font-medium', s.cls)}>
      {s.label}
    </span>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export const metadata = { title: 'Dashboard — AfrigrantPipeline' }

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  await connectDB()

  const userId = new mongoose.Types.ObjectId(session.user.id)
  const now = new Date()

  const [bookmarkedGrants, recentArticles, upcomingDeadlines, allArticleStats] =
    await Promise.all([
      Grant.find({ bookmarkedBy: userId })
        .select('title funder amount currency deadline grantType status categories')
        .sort({ deadline: 1 })
        .limit(5)
        .lean() as Promise<unknown> as Promise<GrantLean[]>,

      Article.find({ authors: userId })
        .select('title status createdAt viewCount keywords')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean() as Promise<unknown> as Promise<ArticleLean[]>,

      Grant.find({ status: 'open', deadline: { $gte: now } })
        .select('title funder amount currency deadline grantType categories')
        .sort({ deadline: 1 })
        .limit(6)
        .lean() as Promise<unknown> as Promise<GrantLean[]>,

      Article.aggregate<{ _id: ArticleStatus; count: number }>([
        { $match: { authors: userId } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
    ])

  const totalArticles = allArticleStats.reduce((s, g) => s + g.count, 0)
  const publishedCount = allArticleStats.find((g) => g._id === 'published')?.count ?? 0
  const bookmarkCount = bookmarkedGrants.length

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const firstName = session.user.name?.split(' ')[0] ?? 'Researcher'

  return (
    <div className="space-y-8">
      {/* ── Welcome row ────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            {greeting}, {firstName}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatDate(new Date().toISOString(), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/publish/submit"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
          >
            <PlusCircle className="size-4" />
            Submit Research
          </Link>
        </div>
      </div>

      {/* ── Stat cards ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          label="Bookmarks"
          value={bookmarkCount}
          icon={<Bookmark className="size-4" />}
          href="/dashboard/grants"
          accent="gold"
        />
        <StatCard
          label="My Articles"
          value={totalArticles}
          icon={<BookOpen className="size-4" />}
          href="/dashboard/my-articles"
          accent="blue"
        />
        <StatCard
          label="Published"
          value={publishedCount}
          icon={<TrendingUp className="size-4" />}
          href="/dashboard/my-articles"
          accent="emerald"
        />
        <StatCard
          label="Closing Soon"
          value={upcomingDeadlines.filter((g) => formatDeadline(g.deadline).daysLeft <= 14).length}
          icon={<Clock className="size-4" />}
          href="/grants"
          accent="amber"
        />
      </div>

      {/* ── Quick actions ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <QuickLink
          href="/grants"
          icon={<Search className="size-4 text-gold" />}
          label="Browse Grants"
          description="Discover funding opportunities"
        />
        <QuickLink
          href="/dashboard/ai-tools"
          icon={<Sparkles className="size-4 text-gold" />}
          label="AI Grant Writer"
          description="Generate proposals with AI"
        />
        <QuickLink
          href="/articles"
          icon={<BookOpen className="size-4 text-gold" />}
          label="AfriPublish"
          description="Explore research repository"
        />
      </div>

      {/* ── Main 3-col grid ─────────────────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Bookmarked grants — 2 cols */}
        <section className="lg:col-span-2">
          <SectionHeader title="Bookmarked Grants" href="/dashboard/grants" />
          <div className="mt-3 space-y-2">
            {bookmarkedGrants.length === 0 ? (
              <EmptyState
                message="No bookmarks yet — browse grants and save the ones that interest you."
                href="/grants"
                linkLabel="Browse grants"
              />
            ) : (
              bookmarkedGrants.map((g) => {
                const dl = formatDeadline(g.deadline)
                return (
                  <div
                    key={g._id.toString()}
                    className="flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-colors hover:border-border/80"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{g.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {g.funder} · {GRANT_TYPE_LABEL[g.grantType] ?? g.grantType}
                      </p>
                    </div>
                    <div className="ml-4 flex shrink-0 flex-col items-end gap-1">
                      <span className="text-sm font-semibold text-gold">
                        {formatCurrency(g.amount, g.currency)}
                      </span>
                      <DeadlinePill label={dl.label} urgency={dl.urgency} />
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </section>

        {/* Upcoming deadlines — 1 col */}
        <section>
          <SectionHeader title="Upcoming Deadlines" href="/grants" />
          <div className="mt-3 space-y-2">
            {upcomingDeadlines.length === 0 ? (
              <p className="py-4 text-center text-xs text-muted-foreground">
                No upcoming deadlines.
              </p>
            ) : (
              upcomingDeadlines.map((g) => {
                const dl = formatDeadline(g.deadline)
                return (
                  <div
                    key={g._id.toString()}
                    className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2.5"
                  >
                    <p className="line-clamp-1 flex-1 text-xs font-medium">{g.title}</p>
                    <DeadlinePill label={dl.label} urgency={dl.urgency} />
                  </div>
                )
              })
            )}
          </div>
        </section>
      </div>

      {/* ── Recent submissions ──────────────────────────────────────────────── */}
      <section>
        <SectionHeader title="My Recent Submissions" href="/dashboard/my-articles" />
        <div className="mt-3 overflow-hidden rounded-xl border border-border bg-card">
          {recentArticles.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-10">
              <BookOpen className="size-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                You haven&apos;t submitted any research yet.
              </p>
              <Link
                href="/publish/submit"
                className="text-xs text-gold underline-offset-2 hover:underline"
              >
                Submit your first article →
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {recentArticles.map((a) => (
                <li key={a._id.toString()} className="flex items-center gap-3 px-4 py-3">
                  <ArticleStatusBadge status={a.status} />
                  <p className="min-w-0 flex-1 truncate text-sm font-medium">{a.title}</p>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatDate(a.createdAt.toISOString(), 'MMM d')}
                  </span>
                  {a.status === 'published' && (
                    <Link
                      href={`/articles/${a._id.toString()}`}
                      className="shrink-0 text-xs text-gold transition-colors hover:underline"
                    >
                      View <ArrowUpRight className="inline size-3" />
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon,
  href,
  accent,
}: {
  label: string
  value: number
  icon: React.ReactNode
  href: string
  accent: 'gold' | 'blue' | 'emerald' | 'amber'
}) {
  const accentCls = {
    gold:    'text-gold bg-gold/10 border-gold/20',
    blue:    'text-blue-400 bg-blue-500/10 border-blue-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    amber:   'text-amber-400 bg-amber-500/10 border-amber-500/20',
  }[accent]

  return (
    <Link
      href={href}
      className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-border/60 hover:bg-card/80"
    >
      <div className={cn('flex size-8 items-center justify-center rounded-lg border', accentCls)}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-extrabold">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </Link>
  )
}

function QuickLink({
  href,
  icon,
  label,
  description,
}: {
  href: string
  icon: React.ReactNode
  label: string
  description: string
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-gold/30 hover:bg-surface-2"
    >
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-gold/20 bg-gold/10">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold">{label}</p>
        <p className="truncate text-xs text-muted-foreground">{description}</p>
      </div>
      <ChevronRight className="ml-auto size-4 shrink-0 text-muted-foreground/50" />
    </Link>
  )
}

function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h2>
      <Link href={href} className="text-xs text-gold transition-colors hover:underline">
        View all →
      </Link>
    </div>
  )
}

function EmptyState({
  message,
  href,
  linkLabel,
}: {
  message: string
  href: string
  linkLabel: string
}) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card/50 px-6 py-8 text-center">
      <p className="text-sm text-muted-foreground">{message}</p>
      <Link href={href} className="mt-2 inline-block text-xs text-gold hover:underline">
        {linkLabel} →
      </Link>
    </div>
  )
}

type DeadlineUrgency = 'safe' | 'warning' | 'critical' | 'expired'

function DeadlinePill({ label, urgency }: { label: string; urgency: DeadlineUrgency }) {
  const cls = {
    safe:     'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning:  'bg-amber-500/10 text-amber-400 border-amber-500/20',
    critical: 'bg-red-500/10 text-red-400 border-red-500/20',
    expired:  'bg-muted/40 text-muted-foreground border-border',
  }[urgency]
  return (
    <span className={cn('whitespace-nowrap rounded-full border px-2 py-0.5 text-[10px] font-medium', cls)}>
      {label}
    </span>
  )
}
