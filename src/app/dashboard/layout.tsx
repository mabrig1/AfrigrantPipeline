import Link from 'next/link'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect('/login?callbackUrl=%2Fdashboard%2Fconsultancy')

  const initials = session.user.name
    ? session.user.name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-border bg-card/80 px-4 backdrop-blur-md">
        <Link
          href="/"
          className="text-lg font-extrabold tracking-tight transition-opacity hover:opacity-80"
        >
          Afri<span className="text-gold">grant</span>Pipeline
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-muted-foreground sm:block">
            {session.user.email}
          </span>
          <Link
            href="/dashboard/settings"
            className="flex size-8 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-xs font-bold text-gold transition-colors hover:bg-gold/20"
            title="Profile settings"
          >
            {initials}
          </Link>
        </div>
      </header>

      <nav aria-label="Dashboard navigation" className="flex flex-wrap gap-4 border-b border-border px-4 py-3 text-sm lg:hidden">
        <Link href="/dashboard/consultancy">Consultancy desk</Link><Link href="/dashboard/grant-intelligence">Grant intelligence</Link><Link href="/dashboard">Overview</Link><Link href="/admin">Creator access</Link>
      </nav>
      {/* Page body */}
      <div className="mx-auto flex max-w-7xl">
        <Sidebar />
        <main className="min-w-0 flex-1 px-4 py-8 lg:px-8">{children}</main>
      </div>
    </div>
  )
}
