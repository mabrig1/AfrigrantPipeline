'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Menu, X, ArrowRight, ChevronDown } from 'lucide-react'

interface NavLinkChild {
  label: string
  href: string
  icon?: string
}

interface NavLink {
  label: string
  href: string
  children?: NavLinkChild[]
}

interface MobileUser {
  name?: string | null
  email?: string | null
  image?: string | null
}

interface MobileMenuProps {
  navLinks: NavLink[]
  mriItems: NavLinkChild[]
  user: MobileUser | null
}

export default function MobileMenu({ navLinks, mriItems, user }: MobileMenuProps) {
  const [open, setOpen] = useState(false)
  const [mriExpanded, setMriExpanded] = useState(false)
  const pathname = usePathname()

  // Close on route change
  useEffect(() => {
    setOpen(false)
    setMriExpanded(false)
  }, [pathname])

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // All nav links + MRI accordion inserted before Pricing
  const enrichedLinks: NavLink[] = [
    ...navLinks.slice(0, navLinks.length - 1).map((l) => ({ ...l })),
    {
      label: 'MRI',
      href: '/mri',
      children: mriItems,
    },
    navLinks[navLinks.length - 1], // Pricing always last
  ]

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
          {enrichedLinks.map((link) => {
            if (link.children) {
              const isActive = pathname.startsWith('/mri')
              return (
                <div key={link.href}>
                  {/* Accordion trigger */}
                  <button
                    onClick={() => setMriExpanded((v) => !v)}
                    className={[
                      'flex w-full items-center justify-between py-4 text-sm font-medium transition-colors',
                      isActive ? 'text-blue-700' : 'text-foreground hover:text-blue-700',
                    ].join(' ')}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        MRI
                      </span>
                      <span className="rounded-full bg-blue-100 px-1.5 py-0.5 text-xs font-semibold text-blue-700">
                        Institute
                      </span>
                    </span>
                    <ChevronDown
                      className={[
                        'size-4 text-muted-foreground transition-transform duration-200',
                        mriExpanded ? 'rotate-180' : '',
                      ].join(' ')}
                    />
                  </button>

                  {/* Accordion children */}
                  {mriExpanded && (
                    <div className="mb-2 rounded-xl bg-slate-900 px-1 py-1">
                      <Link
                        href="/mri"
                        className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold uppercase tracking-widest text-slate-400 hover:text-slate-200 transition-colors"
                      >
                        Mabrig Research Institute →
                      </Link>
                      <div className="border-t border-slate-700/50 my-1" />
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={[
                            'flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors',
                            pathname === child.href || pathname.startsWith(`${child.href}/`)
                              ? 'bg-slate-800 text-white'
                              : 'text-slate-300 hover:bg-slate-800 hover:text-white',
                          ].join(' ')}
                        >
                          {child.icon && (
                            <span className="text-base leading-none">{child.icon}</span>
                          )}
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={[
                  'flex items-center justify-between py-4 text-sm font-medium transition-colors',
                  pathname === link.href || pathname.startsWith(`${link.href}/`)
                    ? 'text-gold'
                    : 'text-foreground hover:text-gold',
                ].join(' ')}
              >
                {link.label}
                <ArrowRight className="size-4 text-muted-foreground" />
              </Link>
            )
          })}
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
