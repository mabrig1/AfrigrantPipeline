import { Suspense } from 'react'
import { differenceInDays } from 'date-fns'
import { Search, Lock, Star, CheckCircle, ArrowRight, Bell, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Grant from '@/models/Grant'
import User from '@/models/User'
import mongoose from 'mongoose'
import type { GrantResponse } from '@/lib/api'
import type { GrantType, SubscriptionPlan } from '@/types/database'
import GrantCard from '@/components/grants/GrantCard'
import GrantFilters from '@/components/grants/GrantFilters'

// ── Config ────────────────────────────────────────────────────────────────────

// Free / not logged in: show this many grants, then paywall
const FREE_PREVIEW_COUNT = 3

// Plans that get full access
const PAID_PLANS: SubscriptionPlan[] = ['silver', 'gold', 'platinum']

// ── Types ─────────────────────────────────────────────────────────────────────

interface PageProps {
  searchParams: Promise<{
    search?: string
    grantType?: string
    deadline?: string
    page?: string
  }>
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function hasFullAccess(role: string | undefined, subscription: SubscriptionPlan | undefined): boolean {
  if (role === 'admin') return true
  return PAID_PLANS.includes(subscription ?? 'free')
}

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

// ── Paywall gate ──────────────────────────────────────────────────────────────

function PaywallGate({ isLoggedIn, totalCount }: { isLoggedIn: boolean; totalCount: number }) {
  return (
    <div className="relative mt-2 overflow-hidden rounded-2xl border-2 border-blue-200 bg-white shadow-xl">
      {/* Blurred fake cards */}
      <div className="pointer-events-none select-none blur-sm opacity-40 grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-52 rounded-xl border border-gray-200 bg-gray-100 animate-pulse" />
        ))}
      </div>

      {/* Lock overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm px-6 py-10 text-center">
        <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-blue-700">
          <Lock className="size-8 text-white" />
        </div>
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
          <Star className="size-3.5 fill-blue-700" />
          {totalCount - FREE_PREVIEW_COUNT}+ more opportunities locked
        </div>
        <h2 className="mt-2 text-2xl font-bold text-gray-900">
          Unlock Full Grant Access
        </h2>
        <p className="mt-2 max-w-md text-sm text-gray-500">
          You&apos;re seeing {FREE_PREVIEW_COUNT} of <strong>{totalCount}</strong> open grants. Subscribe to unlock the full database — including TETFund, international fellowships, scholarships, and business grants — with deadline alerts and AI matching.
        </p>

        <ul className="mt-5 space-y-2 text-left text-sm text-gray-700">
          {[
            'Full access to all ' + totalCount + ' open opportunities',
            'AI-powered grant matching to your profile',
            'Weekly curated grant newsletter + deadline alerts',
            'Application templates and writing support',
          ].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <CheckCircle className="size-4 shrink-0 text-blue-700" /> {item}
            </li>
          ))}
        </ul>

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 rounded-full bg-blue-700 px-7 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            <Sparkles className="size-4" /> View Plans — From ₦3,000/month
          </Link>
          <a
            href="https://store.mabrigkorie.org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-7 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            <Bell className="size-4" /> Quarterly Newsletter — ₦12,000
          </a>
        </div>

        {!isLoggedIn && (
          <p className="mt-4 text-xs text-gray-400">
            Already subscribed?{' '}
            <Link href="/login" className="text-blue-700 font-medium hover:underline">
              Sign in to access your grants
            </Link>
          </p>
        )}

        {isLoggedIn && (
          <p className="mt-4 text-xs text-gray-400">
            Logged in as a free member.{' '}
            <Link href="/pricing" className="text-blue-700 font-medium hover:underline">
              Upgrade your plan
            </Link>{' '}
            to unlock full access.
          </p>
        )}
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export const metadata = { title: 'Browse Grants — AfriGrantPipeline' }

export default async function GrantsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const session = await auth()
  const isLoggedIn = !!session?.user

  // Resolve subscription: check session first, fall back to DB for freshness
  let subscription: SubscriptionPlan = session?.user?.subscription ?? 'free'
  const userRole = session?.user?.role

  if (isLoggedIn && session?.user?.id) {
    try {
      await connectDB()
      const dbUser = await User.findById(
        new mongoose.Types.ObjectId(session.user.id)
      ).select('subscription subscriptionExpiresAt').lean()

      if (dbUser) {
        const plan = dbUser.subscription as SubscriptionPlan | undefined
        const expires = dbUser.subscriptionExpiresAt as Date | undefined
        const isExpired = expires ? expires < new Date() : false
        subscription = (!plan || plan === 'free' || isExpired) ? 'free' : plan
      }
    } catch { /* fall through — use session value */ }
  }

  const fullAccess = hasFullAccess(userRole, subscription)

  // Build MongoDB filter
  const filter: Record<string, unknown> = { status: 'open' }
  if (params.grantType) filter.grantType = params.grantType
  if (params.search) filter.$text = { $search: params.search }

  let allGrants: GrantResponse[] = []
  let totalCount = 0
  let error: string | null = null

  try {
    await connectDB()
    const limit = params.deadline ? 100 : 48
    const page = params.page ? Math.max(1, parseInt(params.page)) : 1
    const skip = (page - 1) * limit

    totalCount = await Grant.countDocuments(filter)

    const raw = await Grant.find(filter)
      .sort(params.search ? { score: { $meta: 'textScore' } } : { deadline: 1 })
      .skip(skip)
      .limit(limit)
      .lean()

    allGrants = raw.map((g) => ({
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
      allGrants = allGrants.filter((g) => {
        const d = differenceInDays(new Date(g.deadline), new Date())
        return d >= 0 && d <= days
      })
    }
  }

  // Gate: free/logged-out users only see preview
  const visibleGrants = fullAccess ? allGrants : allGrants.slice(0, FREE_PREVIEW_COUNT)
  const showPaywall = !fullAccess && allGrants.length > 0
  const hasFilters = !!(params.search || params.grantType || params.deadline)

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Page header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Grant Marketplace
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {error
              ? 'Could not load grants right now.'
              : `${totalCount} open grant${totalCount !== 1 ? 's' : ''} available`}
          </p>
        </div>

        {/* Subscription status badge */}
        <div className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold ${
          fullAccess
            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
            : 'border-amber-200 bg-amber-50 text-amber-700'
        }`}>
          {fullAccess ? (
            <><CheckCircle className="size-3.5" /> Full Access — {subscription.charAt(0).toUpperCase() + subscription.slice(1)} Plan</>
          ) : (
            <><Lock className="size-3.5" /> Free Preview — {FREE_PREVIEW_COUNT} of {totalCount} visible</>
          )}
        </div>
      </div>

      {/* Subscriber-only banner for non-subscribers */}
      {!fullAccess && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4">
          <div className="flex items-center gap-3">
            <Lock className="size-5 text-blue-700 shrink-0" />
            <div>
              <div className="text-sm font-bold text-blue-900">Subscriber-only content</div>
              <div className="text-xs text-blue-700">
                {isLoggedIn
                  ? `You're on the free plan. Upgrade to see all ${totalCount} grants.`
                  : `Sign in or subscribe to access all ${totalCount} grants.`}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {!isLoggedIn && (
              <Link href="/login" className="rounded-full border border-blue-300 bg-white px-4 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-50">
                Sign In
              </Link>
            )}
            <Link href="/pricing" className="inline-flex items-center gap-1.5 rounded-full bg-blue-700 px-4 py-1.5 text-xs font-bold text-white transition-opacity hover:opacity-90">
              Upgrade <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>
      )}

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
          ) : allGrants.length === 0 ? (
            <EmptyState hasFilters={hasFilters} />
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {visibleGrants.map((grant) => (
                  <GrantCard key={grant._id} grant={grant} isLoggedIn={isLoggedIn} />
                ))}
              </div>

              {/* Paywall gate below preview cards */}
              {showPaywall && (
                <PaywallGate isLoggedIn={isLoggedIn} totalCount={totalCount} />
              )}
            </>
          )}
        </section>
      </div>
    </div>
  )
}
