import { Suspense } from 'react'
import Link from 'next/link'
import { BookOpen, PenLine } from 'lucide-react'
import { auth } from '@/lib/auth'
import { articlesApi } from '@/lib/api'
import type { ArticleListParams } from '@/lib/api'
import ArticleCard from '@/components/articles/ArticleCard'
import ArticleFilters from '@/components/articles/ArticleFilters'

// ── Types ─────────────────────────────────────────────────────────────────────

interface PageProps {
  searchParams: Promise<{
    search?: string
    language?: string
    page?: string
  }>
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-20 text-center">
      <BookOpen className="mb-4 size-10 text-muted-foreground/40" />
      <h3 className="mb-1 text-base font-semibold">No articles found</h3>
      <p className="mb-6 text-sm text-muted-foreground">
        {hasFilters
          ? 'No published articles match those filters. Try adjusting your search.'
          : 'No published articles yet. Be the first to contribute.'}
      </p>
      <Link
        href="/publish/submit"
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
      >
        <PenLine className="size-4" />
        Submit Your Research
      </Link>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export const metadata = { title: 'AfriPublish — Research Repository' }

export default async function ArticlesPage({ searchParams }: PageProps) {
  const params = await searchParams
  const session = await auth()

  const apiParams: ArticleListParams = {
    status: 'published',
    search: params.search || undefined,
    page: params.page ? Math.max(1, parseInt(params.page)) : 1,
    limit: 24,
  }

  const { data: allArticles, error } = await articlesApi.list(apiParams)

  // Client-side language filter (server doesn't support it yet)
  let articles = allArticles ?? []
  if (params.language) {
    articles = articles.filter((a) => a.language === params.language)
  }

  const hasFilters = !!(params.search || params.language)

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Page header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <BookOpen className="size-5 text-gold" />
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              AfriPublish
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            {error
              ? 'Could not load articles.'
              : `${articles.length} published article${articles.length !== 1 ? 's' : ''} in the repository`}
          </p>
        </div>

        {session?.user && (
          <Link
            href="/publish/submit"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98]"
          >
            <PenLine className="size-4" />
            Submit Research
          </Link>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        {/* Filters sidebar */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <Suspense fallback={null}>
            <ArticleFilters />
          </Suspense>
        </aside>

        {/* Article grid */}
        <section aria-label="Research articles">
          {error ? (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-sm text-destructive">
              Failed to load articles: {error}
            </div>
          ) : articles.length === 0 ? (
            <EmptyState hasFilters={hasFilters} />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {articles.map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
