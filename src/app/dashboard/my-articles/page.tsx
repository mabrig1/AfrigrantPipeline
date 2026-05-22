import Link from 'next/link'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { connectDB } from '@/lib/mongodb'
import Article from '@/models/Article'
import mongoose from 'mongoose'
import { BookOpen, PlusCircle, Eye, ArrowUpRight, FileText } from 'lucide-react'
import { formatDate, cn } from '@/lib/utils'
import type { ArticleStatus, ArticleLicense } from '@/types/database'

// ── Types ─────────────────────────────────────────────────────────────────────

interface ArticleLean {
  _id: mongoose.Types.ObjectId
  title: string
  abstract: string
  status: ArticleStatus
  keywords: string[]
  language: string
  license: ArticleLicense
  viewCount: number
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
  journal?: { _id: mongoose.Types.ObjectId; name: string } | null
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<ArticleStatus, { label: string; cls: string; dot: string }> = {
  draft: {
    label: 'Draft',
    cls: 'bg-muted/40 text-muted-foreground border-border',
    dot: 'bg-muted-foreground',
  },
  submitted: {
    label: 'Submitted',
    cls: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    dot: 'bg-blue-400',
  },
  under_review: {
    label: 'Under Review',
    cls: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    dot: 'bg-amber-400 animate-pulse',
  },
  published: {
    label: 'Published',
    cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    dot: 'bg-emerald-400',
  },
  rejected: {
    label: 'Rejected',
    cls: 'bg-red-500/10 text-red-400 border-red-500/20',
    dot: 'bg-red-400',
  },
}

function StatusBadge({ status }: { status: ArticleStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.draft
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium', cfg.cls)}>
      <span className={cn('size-1.5 rounded-full', cfg.dot)} />
      {cfg.label}
    </span>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export const metadata = { title: 'My Articles — Dashboard' }

export default async function MyArticlesPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  await connectDB()

  const userId = new mongoose.Types.ObjectId(session.user.id)

  const articles = await Article.find({ authors: userId })
    .populate<{ journal: { _id: mongoose.Types.ObjectId; name: string } | null }>('journal', 'name')
    .sort({ createdAt: -1 })
    .lean() as unknown as ArticleLean[]

  const counts = articles.reduce<Record<ArticleStatus, number>>(
    (acc, a) => { acc[a.status] = (acc[a.status] ?? 0) + 1; return acc },
    {} as Record<ArticleStatus, number>,
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">My Articles</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {articles.length} {articles.length === 1 ? 'submission' : 'submissions'} total
          </p>
        </div>
        <Link
          href="/publish/submit"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
        >
          <PlusCircle className="size-4" />
          New Submission
        </Link>
      </div>

      {/* Status summary */}
      {articles.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {(Object.entries(STATUS_CONFIG) as [ArticleStatus, typeof STATUS_CONFIG[ArticleStatus]][]).map(
            ([status, cfg]) => {
              const count = counts[status] ?? 0
              if (count === 0) return null
              return (
                <div
                  key={status}
                  className={cn('flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium', cfg.cls)}
                >
                  <span className={cn('size-1.5 rounded-full', cfg.dot)} />
                  {cfg.label}
                  <span className="ml-0.5 font-bold">{count}</span>
                </div>
              )
            },
          )}
        </div>
      )}

      {/* Articles list */}
      {articles.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-card/50 py-16">
          <div className="flex size-16 items-center justify-center rounded-full border border-border bg-surface-2">
            <FileText className="size-7 text-muted-foreground/60" />
          </div>
          <div className="text-center">
            <p className="font-semibold">No articles yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Submit your research to the AfriPublish community.
            </p>
          </div>
          <Link
            href="/publish/submit"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
          >
            <PlusCircle className="size-4" />
            Submit Your First Article
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map((article) => (
            <ArticleRow key={article._id.toString()} article={article} />
          ))}
        </div>
      )}
    </div>
  )
}

function ArticleRow({ article }: { article: ArticleLean }) {
  const id = article._id.toString()
  const journalName = article.journal?.name ?? null

  return (
    <article className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-border/60">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {/* Title + status */}
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <StatusBadge status={article.status} />
            {journalName && (
              <span className="rounded-full border border-gold/20 bg-gold/10 px-2 py-0.5 text-[10px] font-medium text-gold">
                {journalName}
              </span>
            )}
          </div>
          <h3 className="text-base font-semibold leading-snug">{article.title}</h3>
          <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{article.abstract}</p>

          {/* Keywords */}
          {article.keywords.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {article.keywords.slice(0, 5).map((kw) => (
                <span
                  key={kw}
                  className="rounded-md bg-surface-2 px-2 py-0.5 text-[10px] text-muted-foreground"
                >
                  {kw}
                </span>
              ))}
              {article.keywords.length > 5 && (
                <span className="rounded-md bg-surface-2 px-2 py-0.5 text-[10px] text-muted-foreground">
                  +{article.keywords.length - 5}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right meta */}
        <div className="flex shrink-0 flex-col items-end gap-2 text-xs text-muted-foreground">
          <span>
            {article.status === 'published' && article.publishedAt
              ? `Published ${formatDate(article.publishedAt.toISOString(), 'MMM d, yyyy')}`
              : `Submitted ${formatDate(article.createdAt.toISOString(), 'MMM d, yyyy')}`}
          </span>
          {article.status === 'published' && (
            <span className="flex items-center gap-1">
              <Eye className="size-3" />
              {article.viewCount.toLocaleString()} views
            </span>
          )}
          {article.status === 'published' && (
            <Link
              href={`/articles/${id}`}
              className="flex items-center gap-1 text-gold transition-colors hover:underline"
            >
              <BookOpen className="size-3" />
              View Article
              <ArrowUpRight className="size-3" />
            </Link>
          )}
        </div>
      </div>

      {/* Status-specific messaging */}
      {article.status === 'under_review' && (
        <p className="mt-3 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs text-amber-400">
          Your article is currently under peer review. You will be notified once the review is complete.
        </p>
      )}
      {article.status === 'rejected' && (
        <p className="mt-3 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs text-red-400">
          This submission was not accepted. Review the feedback and consider revising before resubmitting.
        </p>
      )}
    </article>
  )
}
