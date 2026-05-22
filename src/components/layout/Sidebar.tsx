'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Search,
  FileText,
  Users,
  BookOpen,
  GraduationCap,
  Settings,
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/grants', label: 'Grants', icon: Search },
  { href: '/dashboard/applications', label: 'Applications', icon: FileText },
  { href: '/dashboard/research', label: 'Research', icon: BookOpen },
  { href: '/dashboard/collaborate', label: 'Collaborate', icon: Users },
  { href: '/dashboard/mentorship', label: 'Mentorship', icon: GraduationCap },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-60 shrink-0 hidden lg:flex flex-col gap-1 py-4">
      {navItems.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
            pathname === href
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          )}
        >
          <Icon className="h-4 w-4 shrink-0" />
          {label}
        </Link>
      ))}
    </aside>
  )
}
