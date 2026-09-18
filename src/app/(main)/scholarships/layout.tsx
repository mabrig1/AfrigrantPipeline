import Link from 'next/link'
import { GraduationCap, Sparkles } from 'lucide-react'

export default function ScholarshipsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div>
      <div className="border-b border-blue-100 bg-blue-50/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-700 text-white">
              <GraduationCap className="size-5" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Scholarship Intelligence Hub</p>
              <p className="text-xs text-gray-600">
                Discover, match, prepare, and track funding opportunities.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-sm">
            <Link
              href="/scholarships"
              className="rounded-lg border border-blue-200 bg-white px-3 py-2 font-medium text-blue-700 transition-colors hover:bg-blue-100"
            >
              Browse Scholarships
            </Link>
            <Link
              href="/scholarships/matcher"
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-3 py-2 font-semibold text-white transition-colors hover:bg-blue-800"
            >
              <Sparkles className="size-4" />
              AI Matcher
            </Link>
          </div>
        </div>
      </div>
      {children}
    </div>
  )
}
