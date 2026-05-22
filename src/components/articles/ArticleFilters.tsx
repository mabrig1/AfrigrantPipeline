'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useRef, useTransition } from 'react'
import { Search, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const LANGUAGES = [
  { value: '',   label: 'All languages' },
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
  { value: 'pt', label: 'Português' },
  { value: 'ar', label: 'العربية' },
  { value: 'sw', label: 'Kiswahili' },
]

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium transition-colors',
        active
          ? 'border-gold/50 bg-gold/10 text-gold'
          : 'border-border bg-surface-2 text-muted-foreground hover:text-foreground',
      )}
    >
      {children}
    </button>
  )
}

export default function ArticleFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const currentSearch   = searchParams.get('search') ?? ''
  const currentLang     = searchParams.get('language') ?? ''
  const hasFilters      = currentSearch || currentLang

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    value ? params.set(key, value) : params.delete(key)
    params.delete('page')
    startTransition(() => router.push(`${pathname}?${params.toString()}`))
  }

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => updateParam('search', e.target.value), 400)
  }

  function clearAll() {
    if (inputRef.current) inputRef.current.value = ''
    startTransition(() => router.push(pathname))
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        {isPending && (
          <Loader2 className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
        <input
          ref={inputRef}
          type="search"
          defaultValue={currentSearch}
          onChange={handleSearch}
          placeholder="Search title, abstract…"
          className="w-full rounded-lg border border-border bg-surface-2 py-2.5 pl-9 pr-9 text-sm placeholder:text-muted-foreground/50 focus:border-gold/50 focus:bg-surface-3 focus:outline-none focus:ring-2 focus:ring-gold/20"
        />
      </div>

      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Language
        </p>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map(({ value, label }) => (
            <Pill
              key={value}
              active={currentLang === value}
              onClick={() => updateParam('language', value)}
            >
              {label}
            </Pill>
          ))}
        </div>
      </div>

      {hasFilters && (
        <button
          type="button"
          onClick={clearAll}
          className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="size-3" />
          Clear filters
        </button>
      )}
    </div>
  )
}
