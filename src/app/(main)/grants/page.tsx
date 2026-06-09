import { Suspense } from 'react'
import { differenceInDays } from 'date-fns'
import { Search } from 'lucide-react'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Grant from '@/models/Grant'
import type { GrantResponse } from '@/lib/api'
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

  // Build MongoDB filter
  const filter: Record<string, unknown> = { status: 'open' }
  if (params.grantType) filter.grantType = params.grantType
  if (params.search) filter.$text = { $search: params.search }

  let grants: GrantResponse[] = []
  let error: string | null = null

  try {
    await connectDB()
    const limit = params.deadline ? 100 : 24
    const page = params.page ? Math.max(1, parseInt(params.page)) : 1
    const skip = (page - 1) * limit

    const raw = await Grant.find(filter)
      .sort(params.search ? { score: { $meta: 'textScore' } } : { deadline: 1 })
      .skip(skip)
      .limit(limit)
      .lean()

    // Serialize: ObjectId → string, Date → ISO string
    grants = raw.map((g) => ({
      _id: g._id.toString(),
      title: g.title,
      description: g.description,
      funder: g.funder,
      amount: g.amount,
      currency: g.currency,
      deadline: new Date(g.deadline).toISOString(),
      status: g.status,
      grantType: (g.grantType ?? 'other') as GrantType,
      eligibility: g.eligibility ?? [],
      categories: g.categories ?? [],
      countries: g.countries ?? [],
      region: g.region,
      applicationLink: g.applicationLink,
      createdBy: g.createdBy.toString(),
      createdAt: new Date(g.createdAt).toISOString(),
      updatedAt: new Date(g.updatedAt).toISOString(),
    }))
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load grants'
  }

  // Post-filter by deadline window if requested
  if (params.deadline && !error) {
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
