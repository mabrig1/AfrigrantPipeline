'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Menu, X, ArrowRight } from 'lucide-react'

interface NavLink {
  label: string
  href: string
}

interface MobileUser {
  name?: string | null
  email?: string | null
  image?: string | null
}

interface MobileMenuProps {
  navLinks: NavLink[]
  user: MobileUser | null
}

export default function MobileMenu({ navLinks, user }: MobileMenuProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Close on route change
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 top-16 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Slide-down panel */}
      <div
        className={[
          'fixed inset-x-0 top-16 z-50 origin-top border-b border-border bg-background transition-all duration-200 ease-out',
          open ? 'animate-slide-down opacity-100' : 'pointer-events-none opacity-0',
        ].join(' ')}
      >
        <nav className="flex flex-col divide-y divide-border px-4">
          {navLinks.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={[
                'flex items-center justify-between py-4 text-sm font-medium transition-colors',
                pathname === href || pathname.startsWith(`${href}/`)
                  ? 'text-gold'
                  : 'text-foreground hover:text-gold',
              ].join(' ')}
            >
              {label}
              <ArrowRight className="size-4 text-muted-foreground" />
            </Link>
          ))}
        </nav>

        {/* Auth buttons */}
        <div className="flex flex-col gap-3 px-4 py-5">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="flex items-center justify-center rounded-lg border border-border bg-surface-2 py-2.5 text-sm font-medium transition-colors hover:border-gold/40"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/settings"
                className="flex items-center justify-center rounded-lg border border-border bg-surface-2 py-2.5 text-sm font-medium transition-colors hover:border-gold/40"
              >
                {user.name?.split(' ')[0] ?? 'Profile'}
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center justify-center rounded-lg border border-border bg-surface-2 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-red-500/30 hover:text-red-400"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="flex items-center justify-center rounded-lg border border-border bg-surface-2 py-2.5 text-sm font-medium transition-colors hover:border-gold/40"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="flex items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
              >
                Get Started Free
                <ArrowRight className="size-4" />
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
