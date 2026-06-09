import Link from 'next/link'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { connectDB } from '@/lib/mongodb'
import Grant from '@/models/Grant'
import { formatDeadline, formatCurrency, cn } from '@/lib/utils'
import { Search, ExternalLink } from 'lucide-react'
import type { GrantType } from '@/types/database'

const TYPE_LABEL: Record<string, string> = {
  research: 'Research', project: 'Project', scholarship: 'Scholarship',
  fellowship: 'Fellowship', seed: 'Seed', other: 'Other',
}

export default async function DashboardGrantsPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  await connectDB()
  const grants = await Grant.find({ status: 'open' }).sort({ deadline: 1 }).lean()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Grants</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {grants.length} open grant{grants.length !== 1 ? 's' : ''} available
          </p>
        </div>
        <Link
          href="/grants"
          className="flex items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-4 py-2 text-sm font-medium transition-colors hover:border-gold/40"
        >
          <Search className="size-3.5" />
          Browse all
        </Link>
      </div>

      {grants.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20 text-center">
          <Search className="mb-3 size-10 text-muted-foreground/30" />
          <p className="font-medium">No open grants right now</p>
          <p className="mt-1 text-sm text-muted-foreground">Check back soon or browse the full marketplace.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {grants.map((grant) => {
            const deadline = formatDeadline(new Date(grant.deadline))
            const isUrgent = deadline.urgency === 'critical'
            return (
              <div
                key={grant._id.toString()}
                className="flex flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-gold/30"
              >
                <div className="mb-3 flex items-start justify-between gap-2">
                  <span className="rounded-md border border-border bg-surface-2 px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    {TYPE_LABEL[(grant.grantType as GrantType) ?? 'other'] ?? 'Grant'}
                  </span>
                  <span className={cn(
                    'rounded-md border px-2 py-0.5 text-xs font-medium',
                    isUrgent
                      ? 'border-red-500/20 bg-red-500/10 text-red-400'
                      : 'border-border bg-surface-2 text-muted-foreground',
                  )}>
                    {deadline.label}
                  </span>
                </div>
                <h3 className="mb-1 line-clamp-2 text-sm font-semibold leading-snug">{grant.title}</h3>
                <p className="mb-3 text-xs text-muted-foreground">{grant.funder}</p>
                <p className="mb-4 line-clamp-2 text-xs text-muted-foreground">{grant.description}</p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-sm font-bold text-gold">
                    {formatCurrency(grant.amount, grant.currency)}
                  </span>
                  {grant.applicationLink && (
                    <a
                      href={grant.applicationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Apply <ExternalLink className="size-3" />
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
