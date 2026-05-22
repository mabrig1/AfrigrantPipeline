'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useTransition, useRef, useEffect } from 'react'
import { Search, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Filter data ───────────────────────────────────────────────────────────────

const GRANT_TYPES = [
  { value: '',            label: 'All types' },
  { value: 'research',    label: 'Research' },
  { value: 'scholarship', label: 'Scholarship' },
  { value: 'fellowship',  label: 'Fellowship' },
  { value: 'project',     label: 'Project' },
  { value: 'seed',        label: 'Seed' },
  { value: 'other',       label: 'Other' },
]

const DEADLINE_OPTIONS = [
  { value: '',   label: 'Any deadline' },
  { value: '7',  label: '≤ 7 days' },
  { value: '30', label: '≤ 30 days' },
  { value: '90', label: '≤ 90 days' },
]

// ── Pill button ───────────────────────────────────────────────────────────────

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium transition-colors',
        active
          ? 'border-gold/50 bg-gold/10 text-gold'
          : 'border-border bg-surface-2 text-muted-foreground hover:border-border/80 hover:text-foreground',
      )}
    >
      {children}
    </button>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function GrantFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // Current filter values from URL
  const currentSearch   = searchParams.get('search') ?? ''
  const currentType     = searchParams.get('grantType') ?? ''
  const currentDeadline = searchParams.get('deadline') ?? ''

  const hasFilters = currentSearch || currentType || currentDeadline

  // Debounce timer ref for search input
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Keep input value in sync with URL (e.g. back/forward navigation)
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (inputRef.current && inputRef.current.value !== currentSearch) {
      inputRef.current.value = currentSearch
    }
  }, [currentSearch])

  // ── Helpers ─────────────────────────────────────────────────────────────────

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    // Reset to page 1 on filter change
    params.delete('page')
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => updateParam('search', value), 400)
  }

  function clearAll() {
    if (inputRef.current) inputRef.current.value = ''
    startTransition(() => {
      router.push(pathname)
    })
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        {isPending && (
          <Loader2 className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
        <input
          ref={inputRef}
          type="search"
          defaultValue={currentSearch}
          onChange={handleSearchChange}
          placeholder="Search grants, funders…"
          className="w-full rounded-lg border border-border bg-surface-2 py-2.5 pl-9 pr-9 text-sm placeholder:text-muted-foreground/50 focus:border-gold/50 focus:bg-surface-3 focus:outline-none focus:ring-2 focus:ring-gold/20"
        />
      </div>

      {/* Grant type */}
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Grant type
        </p>
        <div className="flex flex-wrap gap-2">
          {GRANT_TYPES.map(({ value, label }) => (
            <Pill
              key={value}
              active={currentType === value}
              onClick={() => updateParam('grantType', value)}
            >
              {label}
            </Pill>
          ))}
        </div>
      </div>

      {/* Deadline */}
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Deadline
        </p>
        <div className="flex flex-wrap gap-2">
          {DEADLINE_OPTIONS.map(({ value, label }) => (
            <Pill
              key={value}
              active={currentDeadline === value}
              onClick={() => updateParam('deadline', value)}
            >
              {label}
            </Pill>
          ))}
        </div>
      </div>

      {/* Clear all */}
      {hasFilters && (
        <button
          type="button"
          onClick={clearAll}
          className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="size-3" />
          Clear all filters
        </button>
      )}
    </div>
  )
}
