import Link from 'next/link'
import { Clock, ExternalLink, MapPin } from 'lucide-react'
import { formatDeadline, formatCurrency, cn } from '@/lib/utils'
import type { GrantResponse } from '@/lib/api'
import BookmarkButton from './BookmarkButton'

// ── Deadline badge ────────────────────────────────────────────────────────────

const urgencyStyles = {
  safe:     'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
  warning:  'bg-amber-500/10  text-amber-400  border-amber-500/25',
  critical: 'bg-red-500/10    text-red-400    border-red-500/25',
  expired:  'bg-muted/40      text-muted-foreground border-border',
}

function DeadlineBadge({ deadline }: { deadline: string }) {
  const { label, urgency } = formatDeadline(deadline)
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium',
        urgencyStyles[urgency],
      )}
    >
      <Clock className="size-2.5" />
      {label}
    </span>
  )
}

// ── Grant type pill ───────────────────────────────────────────────────────────

const typeLabels: Record<string, string> = {
  research:    'Research',
  scholarship: 'Scholarship',
  fellowship:  'Fellowship',
  project:     'Project',
  seed:        'Seed',
  other:       'Other',
}

// ── Card ──────────────────────────────────────────────────────────────────────

interface GrantCardProps {
  grant: GrantResponse
  isLoggedIn?: boolean
}

export default function GrantCard({ grant, isLoggedIn = false }: GrantCardProps) {
  const amount = formatCurrency(grant.amount, grant.currency)

  return (
    <article className="card-hover group flex flex-col rounded-xl border border-border bg-card p-5">
      {/* Top row: funder + bookmark */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-muted-foreground">{grant.funder}</p>
          {grant.grantType && (
            <span className="mt-1 inline-block rounded-md bg-surface-3 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              {typeLabels[grant.grantType] ?? grant.grantType}
            </span>
          )}
        </div>
        <BookmarkButton
          grantId={grant._id}
          isLoggedIn={isLoggedIn}
          className="-mt-0.5 shrink-0"
        />
      </div>

      {/* Title */}
      <h3 className="mb-1 line-clamp-2 text-sm font-semibold leading-snug">
        {grant.title}
      </h3>

      {/* Amount */}
      <p className="mb-3 text-xl font-extrabold text-gold">{amount}</p>

      {/* Description */}
      <p className="mb-4 line-clamp-2 flex-1 text-xs leading-relaxed text-muted-foreground">
        {grant.description}
      </p>

      {/* Categories */}
      {grant.categories.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-1.5">
          {grant.categories.slice(0, 3).map((cat) => (
            <span
              key={cat}
              className="rounded-md bg-surface-2 px-2 py-0.5 text-[11px] text-muted-foreground"
            >
              {cat}
            </span>
          ))}
          {grant.categories.length > 3 && (
            <span className="rounded-md bg-surface-2 px-2 py-0.5 text-[11px] text-muted-foreground">
              +{grant.categories.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Region */}
      {(grant.region || grant.countries?.length > 0) && (
        <div className="mb-3 flex items-center gap-1 text-[11px] text-muted-foreground">
          <MapPin className="size-3 shrink-0" />
          <span className="truncate">
            {grant.region ?? grant.countries.slice(0, 2).join(', ')}
          </span>
        </div>
      )}

      {/* Footer: deadline + actions */}
      <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-3">
        <DeadlineBadge deadline={grant.deadline} />

        <div className="flex items-center gap-1.5">
          {grant.applicationLink && (
            <a
              href={grant.applicationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
            >
              Apply
              <ExternalLink className="size-3" />
            </a>
          )}
          <Link
            href={`/grants/${grant._id}`}
            className="rounded-md bg-surface-2 px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-surface-3 hover:text-foreground"
          >
            Details
          </Link>
        </div>
      </div>
    </article>
  )
}
