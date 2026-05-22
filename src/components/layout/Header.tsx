import Link from 'next/link'
import { auth } from '@/lib/auth'
import { Button } from '@/components/ui/button'

export default async function Header() {
  const session = await auth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">AfrigrantPipeline</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/grants" className="text-muted-foreground hover:text-foreground transition-colors">Grants</Link>
          <Link href="/research" className="text-muted-foreground hover:text-foreground transition-colors">Research</Link>
          <Link href="/collaborate" className="text-muted-foreground hover:text-foreground transition-colors">Collaborate</Link>
          <Link href="/mentorship" className="text-muted-foreground hover:text-foreground transition-colors">Mentorship</Link>
        </nav>
        <div className="flex items-center gap-3">
          {session?.user ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">Dashboard</Button>
              </Link>
              <Link href="/profile">
                <Button variant="outline" size="sm">{session.user.name ?? 'Profile'}</Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
