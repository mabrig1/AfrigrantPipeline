'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Lock, Sparkles, CheckCircle, ArrowRight } from 'lucide-react'

const PAID_PLANS = ['silver', 'gold', 'platinum']

interface Props {
  children: React.ReactNode
  previewSlot?: React.ReactNode  // optional teaser shown above the gate
}

export default function SubscriptionGuard({ children, previewSlot }: Props) {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-blue-700 border-t-transparent" />
      </div>
    )
  }

  const role = session?.user?.role
  const subscription = session?.user?.subscription ?? 'free'
  const isLoggedIn = !!session?.user
  const fullAccess = role === 'admin' || PAID_PLANS.includes(subscription)

  if (fullAccess) return <>{children}</>

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      {/* Teaser slot (optional hero/description shown before gate) */}
      {previewSlot && <div className="mb-8">{previewSlot}</div>}

      {/* Paywall gate */}
      <div className="overflow-hidden rounded-3xl border-2 border-blue-200 bg-white shadow-xl">
        {/* Blurred preview */}
        <div className="pointer-events-none select-none blur-sm opacity-30 grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-44 rounded-2xl border border-gray-200 bg-gray-100 animate-pulse" />
          ))}
        </div>

        {/* Lock overlay */}
        <div className="border-t border-blue-100 bg-gradient-to-b from-blue-50 to-white px-6 py-12 text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-blue-700">
            <Lock className="size-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Subscribers Only</h2>
          <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
            This content is exclusively available to AfriGrantPipeline subscribers. Subscribe from ₦3,000/month to unlock full access.
          </p>

          <ul className="mt-6 space-y-2 text-left text-sm text-gray-700 max-w-xs mx-auto">
            {[
              'Full access to all grants & opportunities',
              'Business grants, scholarships & services',
              'Expert directory & writing lab',
              'Weekly curated newsletter + alerts',
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <CheckCircle className="size-4 shrink-0 text-blue-700" /> {item}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/pricing"
              className="inline-flex items-center gap-2 rounded-full bg-blue-700 px-7 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90">
              <Sparkles className="size-4" /> View Plans — From ₦3,000/month
            </Link>
            <a href="https://store.mabrigkorie.org" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-7 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50">
              Quarterly Newsletter — ₦12,000
            </a>
          </div>

          {!isLoggedIn ? (
            <p className="mt-5 text-xs text-gray-400">
              Already subscribed?{' '}
              <Link href="/login" className="font-medium text-blue-700 hover:underline">Sign in to access</Link>
            </p>
          ) : (
            <p className="mt-5 text-xs text-gray-400">
              Logged in as free member.{' '}
              <Link href="/pricing" className="font-medium text-blue-700 hover:underline">
                Upgrade your plan <ArrowRight className="inline size-3" />
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
