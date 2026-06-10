import Link from 'next/link'
import { auth, signOut } from '@/lib/auth'
import MobileMenu from './MobileMenu'

const navLinks = [
  { label: 'Grants', href: '/grants' },
  { label: 'AfriPublish', href: '/articles' },
  { label: 'Collaborate', href: '/collaborations' },
  { label: 'Mentorship', href: '/mentorships' },
]

export default async function Header() {
  const session = await auth()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
          <div className="flex size-9 items-center justify-center rounded-xl bg-blue-700">
            <span className="text-sm font-bold text-white">AG</span>
          </div>
          <span className="text-xl font-semibold tracking-tight text-gray-900">
            AfriGrant<span className="text-blue-700">Pipeline</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
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
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/settings"
                className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
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
                  className="rounded-lg px-3 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="rounded-2xl bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800"
              >
                Get Started Free
              </Link>
            </>
          )}
        </div>

        {/* Mobile */}
        <MobileMenu navLinks={navLinks} user={session?.user ?? null} />
      </div>
    </header>
  )
}
