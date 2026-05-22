import Link from 'next/link'
import { Eye, Calendar, BookOpen } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { ArticleResponse, UserResponse } from '@/lib/api'

// ── Helpers ───────────────────────────────────────────────────────────────────

function authorNames(authors: string[] | UserResponse[]): string {
  const names = authors.map((a) => (typeof a === 'string' ? 'Unknown' : a.name))
  if (names.length === 0) return 'Unknown Author'
  if (names.length === 1) return names[0]
  if (names.length === 2) return names.join(' & ')
  return `${names[0]}, ${names[1]} et al.`
}

function journalName(journal: string | { name: string } | undefined): string | null {
  if (!journal) return null
  return typeof journal === 'string' ? null : journal.name
}

const licenseShort: Record<string, string> = {
  'CC BY':             'CC BY',
  'CC BY-SA':          'CC BY-SA',
  'CC BY-NC':          'CC BY-NC',
  'CC BY-ND':          'CC BY-ND',
  'CC0':               'CC0',
  'All Rights Reserved': '© All rights reserved',
}

// ── Card ──────────────────────────────────────────────────────────────────────

interface ArticleCardProps {
  article: ArticleResponse
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const jName = journalName(article.journal)
  const authors = authorNames(article.authors)

  return (
    <article className="card-hover group flex flex-col rounded-xl border border-border bg-card p-5">
      {/* Top meta */}
      <div className="mb-3 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
        {jName && (
          <span className="flex items-center gap-1">
            <BookOpen className="size-3" />
            {jName}
          </span>
        )}
        {article.publishedAt && (
          <span className="flex items-center gap-1">
            <Calendar className="size-3" />
            {formatDate(article.publishedAt)}
          </span>
        )}
        {article.language && article.language !== 'en' && (
          <span className="rounded bg-surface-3 px-1.5 py-0.5 font-mono uppercase">
            {article.language}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="mb-1.5 line-clamp-2 text-sm font-semibold leading-snug">
        {article.title}
      </h3>

      {/* Authors */}
      <p className="mb-3 text-xs text-muted-foreground">{authors}</p>

      {/* Abstract excerpt */}
      <p className="mb-4 line-clamp-3 flex-1 text-xs leading-relaxed text-muted-foreground">
        {article.abstract}
      </p>

      {/* Keywords */}
      {article.keywords.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-1.5">
          {article.keywords.slice(0, 4).map((kw) => (
            <span
              key={kw}
              className="rounded-md bg-surface-2 px-2 py-0.5 text-[11px] text-muted-foreground"
            >
              {kw}
            </span>
          ))}
          {article.keywords.length > 4 && (
            <span className="rounded-md bg-surface-2 px-2 py-0.5 text-[11px] text-muted-foreground">
              +{article.keywords.length - 4}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
        <div className="flex items-center gap-3">
          {article.doi && (
            <span className="text-[10px] font-mono text-muted-foreground/60">
              DOI
            </span>
          )}
          <span className="text-[10px] text-muted-foreground/60">
            {licenseShort[article.license] ?? article.license}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Eye className="size-3" />
            {article.viewCount.toLocaleString()}
          </span>
          <Link
            href={`/articles/${article._id}`}
            className="rounded-md bg-surface-2 px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-surface-3"
          >
            Read →
          </Link>
        </div>
      </div>
    </article>
  )
}
