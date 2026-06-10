import Link from 'next/link'
import { auth, signOut } from '@/lib/auth'
import MobileMenu from './MobileMenu'

const navLinks = [
  { label: 'Grants', href: '/grants' },
  { label: 'Scholarships', href: '/scholarships' },
  { label: 'AfriPublish', href: '/articles' },
  { label: 'Collaborate', href: '/collaborations' },
  { label: 'Mentorship', href: '/mentorships' },
]

export default async function Header() {
  const session = await auth()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-1.5 text-lg font-extrabold tracking-tight transition-opacity hover:opacity-80"
        >
          Afri<span className="text-gold">grant</span>Pipeline
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop auth */}
        <div className="hidden items-center gap-2 md:flex">
          {session?.user ? (
            <>
              <Link
                href="/dashboard"
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/settings"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-4 py-2 text-sm font-medium transition-colors hover:border-gold/40 hover:bg-surface-3"
              >
                {session.user.name?.split(' ')[0] ?? 'Profile'}
              </Link>
              <form
                action={async () => {
                  'use server'
                  await signOut({ redirectTo: '/' })
                }}
              >
                <button
                  type="submit"
                  className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98]"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile — delegate to client component */}
        <MobileMenu navLinks={navLinks} user={session?.user ?? null} />
      </div>
    </header>
  )
}
