'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Search,
  FileText,
  Users,
  BookOpen,
  GraduationCap,
  Settings,
  Sparkles,
  Edit3,
  ShieldCheck,
} from 'lucide-react'

const baseNavItems = [
  { href: '/dashboard',                  label: 'Overview',     icon: LayoutDashboard },
  { href: '/dashboard/grants',           label: 'Grants',       icon: Search },
  { href: '/dashboard/applications',     label: 'Applications', icon: FileText },
  { href: '/dashboard/my-articles',      label: 'My Articles',  icon: BookOpen },
  { href: '/dashboard/writing-lab',      label: 'Writing Lab',  icon: Edit3 },
  { href: '/dashboard/collaborate',      label: 'Collaborate',  icon: Users },
  { href: '/dashboard/mentorship',       label: 'Mentorship',   icon: GraduationCap },
  { href: '/dashboard/settings',         label: 'Settings',     icon: Settings },
]

const adminNavItems = [
  { href: '/dashboard/ai-tools',         label: 'AI Tools',     icon: Sparkles },
  { href: '/dashboard/admin',            label: 'Admin',        icon: ShieldCheck },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === 'admin'

  const navItems = isAdmin ? [...baseNavItems, ...adminNavItems] : baseNavItems

  return (
    <aside className="hidden w-56 shrink-0 flex-col gap-0.5 py-6 pr-4 lg:flex">
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              active
                ? 'bg-gold/10 text-gold border border-gold/20'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground border border-transparent',
            )}
          >
            <Icon className="size-4 shrink-0" />
            {label}
          </Link>
        )
      })}
    </aside>
  )
}
