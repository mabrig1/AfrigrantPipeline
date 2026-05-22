'use client'

import { useState } from 'react'
import { Bookmark } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BookmarkButtonProps {
  grantId: string
  initialBookmarked?: boolean
  isLoggedIn: boolean
  className?: string
}

export default function BookmarkButton({
  grantId,
  initialBookmarked = false,
  isLoggedIn,
  className,
}: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked)
  const [pending, setPending] = useState(false)

  async function toggle() {
    if (!isLoggedIn) {
      window.location.href = '/login'
      return
    }
    if (pending) return

    setPending(true)
    // Optimistic update
    setBookmarked((v) => !v)

    try {
      const res = await fetch(`/api/grants/${grantId}/bookmark`, { method: 'POST' })
      if (!res.ok) {
        // Revert on failure
        setBookmarked((v) => !v)
      } else {
        const json = (await res.json()) as { data?: { bookmarked: boolean } }
        if (json.data !== undefined) setBookmarked(json.data.bookmarked)
      }
    } catch {
      setBookmarked((v) => !v)
    } finally {
      setPending(false)
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={pending}
      aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark this grant'}
      title={isLoggedIn ? undefined : 'Sign in to bookmark'}
      className={cn(
        'flex size-8 items-center justify-center rounded-md transition-colors',
        'hover:bg-gold/10 disabled:cursor-not-allowed disabled:opacity-50',
        bookmarked
          ? 'text-gold hover:text-gold/80'
          : 'text-muted-foreground hover:text-gold',
        className,
      )}
    >
      <Bookmark
        className={cn('size-4 transition-all', bookmarked && 'fill-current')}
      />
    </button>
  )
}
