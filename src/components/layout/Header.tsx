import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { auth, signOut } from '@/lib/auth'
import MobileMenu from './MobileMenu'

const mriItems = [
  { label: 'Research Projects', href: '/mri/research-projects', icon: '🔬' },
  { label: 'Policy Briefs', href: '/mri/policy-briefs', icon: '📋' },
  { label: 'Working Papers', href: '/mri/working-papers', icon: '📄' },
  { label: 'Research Reports', href: '/mri/research-reports', icon: '📊' },
  { label: 'Research Fellows', href: '/mri/research-fellows', icon: '👥' },
  { label: 'Academic Partnerships', href: '/mri/academic-partnerships', icon: '🤝' },
  { label: 'Publications', href: '/mri/publications', icon: '📚' },
  { label: 'Research Consulting', href: '/mri/research-consulting', icon: '💡' },
  { label: 'Monitoring & Evaluation', href: '/mri/monitoring-evaluation', icon: '📈' },
  { label: 'Publish Your Research', href: '/publish', icon: '✍️' },
]

// All top-level nav links (used by desktop nav, mobile menu, and homepage nav hub)
const navLinks = [
  { label: 'Browse Grants', href: '/grants' },
  { label: 'Scholarships', href: '/scholarships' },
  { label: 'Business Grants', href: '/business-grants' },
  { label: 'Writing Lab', href: '/writing-lab' },
  { label: 'Publish', href: '/publish' },
  { label: 'Services', href: '/services' },
  { label: 'Experts', href: '/experts' },
  { label: 'AfriPublish', href: '/articles' },
  { label: 'Research Center', href: '/research-center' },
  { label: 'Newsletter', href: '/newsletter' },
  { label: 'Pricing', href: '/pricing' },
]

export const mriNavLinks = mriItems
export { navLinks as allNavLinks }

export default async function Header() {
  const session = await auth()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-md">
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
        <nav className="hidden items-center gap-0.5 xl:flex">
          {navLinks.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="rounded-lg px-2.5 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              {label}
            </Link>
          ))}

          {/* MRI Dropdown */}
          <div className="relative group">
            <Link
              href="/mri"
              className="flex items-center gap-1 rounded-lg px-2.5 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              MRI
              <ChevronDown className="size-3.5 transition-transform duration-200 group-hover:rotate-180" />
            </Link>

            {/* Dropdown panel */}
            <div className="absolute top-full right-0 hidden group-hover:block w-64 rounded-2xl bg-slate-900 shadow-2xl border border-slate-700 py-2 z-50">
              <div className="px-4 pb-2 pt-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Mabrig Research Institute
                </p>
              </div>
              <div className="border-t border-slate-700/60" />
              {mriItems.map(({ label, href, icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  <span className="text-base leading-none">{icon}</span>
                  {label}
                </Link>
              ))}
              <div className="border-t border-slate-700/60 mt-2 pt-2 px-4 pb-1">
                <Link
                  href="/mri"
                  className="flex items-center gap-1 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
                >
                  View MRI Overview →
                </Link>
              </div>
            </div>
          </div>
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
        <MobileMenu
          navLinks={navLinks}
          mriItems={mriItems}
          user={session?.user ?? null}
        />
      </div>
    </header>
  )
}
