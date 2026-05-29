import { Suspense } from 'react'
import { differenceInDays } from 'date-fns'
import { Search } from 'lucide-react'
import { auth } from '@/lib/auth'
import { grantsApi } from '@/lib/api'
import type { GrantListParams } from '@/lib/api'
import type { GrantType } from '@/types/database'
import GrantCard from '@/components/grants/GrantCard'
import GrantFilters from '@/components/grants/GrantFilters'

// ── Types ─────────────────────────────────────────────────────────────────────

interface PageProps {
  searchParams: Promise<{
    search?: string
    grantType?: string
    deadline?: string
    page?: string
  }>
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-20 text-center">
      <Search className="mb-4 size-10 text-muted-foreground/40" />
      <h3 className="mb-1 text-base font-semibold">No grants found</h3>
      <p className="text-sm text-muted-foreground">
        {hasFilters
          ? 'Try adjusting your filters or clearing the search.'
          : 'No open grants are available right now. Check back soon.'}
      </p>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export const metadata = { title: 'Browse Grants' }

export default async function GrantsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const session = await auth()
  const isLoggedIn = !!session?.user

  // Build API query
  const apiParams: GrantListParams = {
    status: 'open',
    search: params.search || undefined,
    grantType: (params.grantType || undefined) as GrantType | undefined,
    // Fetch more when deadline filter is active (we post-filter locally)
    limit: params.deadline ? 100 : 24,
    page: params.page ? Math.max(1, parseInt(params.page)) : 1,
  }

  const { data: rawGrants, error } = await grantsApi.list(apiParams)

  // Post-filter by deadline window if requested
  let grants = rawGrants ?? []
  if (params.deadline) {
    const days = parseInt(params.deadline)
    if (!isNaN(days)) {
      grants = grants.filter((g) => {
        const d = differenceInDays(new Date(g.deadline), new Date())
        return d >= 0 && d <= days
      })
    }
  }

  const hasFilters = !!(params.search || params.grantType || params.deadline)

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
          Grant Marketplace
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {error
            ? 'Could not load grants right now.'
            : grants.length > 0
              ? `${grants.length} open grant${grants.length !== 1 ? 's' : ''} available`
              : 'Showing all open grants'}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        {/* Filters sidebar */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          {/* Suspense boundary needed because GrantFilters reads useSearchParams */}
          <Suspense fallback={null}>
            <GrantFilters />
          </Suspense>
        </aside>

        {/* Grant grid */}
        <section aria-label="Grant listings">
          {error ? (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-sm text-destructive">
              Failed to load grants: {error}
            </div>
          ) : grants.length === 0 ? (
            <EmptyState hasFilters={hasFilters} />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {grants.map((grant) => (
                <GrantCard key={grant._id} grant={grant} isLoggedIn={isLoggedIn} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
