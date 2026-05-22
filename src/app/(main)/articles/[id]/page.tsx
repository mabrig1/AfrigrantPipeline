import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  Calendar,
  Eye,
  Globe,
  FileText,
  Download,
  ExternalLink,
  BookOpen,
  User,
} from 'lucide-react'
import { articlesApi } from '@/lib/api'
import type { UserResponse, JournalResponse } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import type { CitationSource } from '@/lib/utils'
import CitationBox from '@/components/articles/CitationBox'

// ── Types ─────────────────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ id: string }>
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const { data } = await articlesApi.get(id)
  if (!data) return { title: 'Article Not Found' }
  return {
    title: data.title,
    description: data.abstract.slice(0, 160),
    openGraph: {
      title: data.title,
      description: data.abstract.slice(0, 160),
      type: 'article',
    },
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function isUserResponse(a: string | UserResponse): a is UserResponse {
  return typeof a !== 'string'
}

function isJournalResponse(j: string | JournalResponse | undefined): j is JournalResponse {
  return !!j && typeof j !== 'string'
}

const licenseInfo: Record<string, { label: string; url?: string; open: boolean }> = {
  'CC BY':             { label: 'CC BY 4.0', url: 'https://creativecommons.org/licenses/by/4.0/', open: true },
  'CC BY-SA':          { label: 'CC BY-SA 4.0', url: 'https://creativecommons.org/licenses/by-sa/4.0/', open: true },
  'CC BY-NC':          { label: 'CC BY-NC 4.0', url: 'https://creativecommons.org/licenses/by-nc/4.0/', open: true },
  'CC BY-ND':          { label: 'CC BY-ND 4.0', url: 'https://creativecommons.org/licenses/by-nd/4.0/', open: true },
  'CC0':               { label: 'CC0 1.0 (Public Domain)', url: 'https://creativecommons.org/publicdomain/zero/1.0/', open: true },
  'All Rights Reserved': { label: 'All Rights Reserved', open: false },
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function ArticlePage({ params }: PageProps) {
  const { id } = await params
  const { data: article, error } = await articlesApi.get(id)

  if (error || !article) notFound()

  const populatedAuthors = article.authors.filter(isUserResponse)
  const authorNames = populatedAuthors.length > 0
    ? populatedAuthors.map((a) => a.name)
    : ['Unknown Author']

  const journal = isJournalResponse(article.journal) ? article.journal : null

  const citationYear = article.publishedAt
    ? new Date(article.publishedAt).getFullYear()
    : undefined

  const citationSource: CitationSource = {
    title: article.title,
    authors: authorNames,
    journal: journal?.name,
    year: citationYear,
    doi: article.doi,
    url: article.doi
      ? undefined
      : `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://afrigrantpipeline.com'}/articles/${article._id}`,
  }

  const license = licenseInfo[article.license] ?? { label: article.license, open: false }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      {/* Back link */}
      <Link
        href="/articles"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to AfriPublish
      </Link>

      {/* Main content card */}
      <article className="rounded-2xl border border-border bg-card p-8 sm:p-10">
        {/* Journal badge */}
        {journal && (
          <div className="mb-4 flex items-center gap-2">
            <BookOpen className="size-4 text-gold" />
            <span className="text-sm font-medium text-gold">{journal.name}</span>
            {journal.isOpenAccess && (
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400 border border-emerald-500/20">
                Open Access
              </span>
            )}
          </div>
        )}

        {/* Title */}
        <h1 className="mb-5 text-balance text-2xl font-extrabold leading-snug tracking-tight sm:text-3xl">
          {article.title}
        </h1>

        {/* Authors */}
        <div className="mb-5 flex flex-wrap gap-2">
          {populatedAuthors.length > 0 ? (
            populatedAuthors.map((author) => (
              <Link
                key={author._id}
                href={`/researchers/${author._id}`}
                className="flex items-center gap-1.5 rounded-full border border-border bg-surface-2 px-3 py-1 text-xs font-medium transition-colors hover:border-gold/40 hover:text-gold"
              >
                <User className="size-3" />
                {author.name}
                {author.organization && (
                  <span className="text-muted-foreground">· {author.organization}</span>
                )}
              </Link>
            ))
          ) : (
            <span className="text-sm text-muted-foreground">Author information unavailable</span>
          )}
        </div>

        {/* Meta row */}
        <div className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-border py-4 text-xs text-muted-foreground">
          {article.publishedAt && (
            <span className="flex items-center gap-1.5">
              <Calendar className="size-3.5" />
              Published {formatDate(article.publishedAt, 'MMMM d, yyyy')}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Eye className="size-3.5" />
            {article.viewCount.toLocaleString()} views
          </span>
          <span className="flex items-center gap-1.5">
            <Globe className="size-3.5" />
            {article.language.toUpperCase()}
          </span>
          {article.doi && (
            <a
              href={`https://doi.org/${article.doi}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-mono transition-colors hover:text-gold"
            >
              <FileText className="size-3.5" />
              DOI: {article.doi}
              <ExternalLink className="size-3" />
            </a>
          )}
          {/* License */}
          <span className="flex items-center gap-1.5">
            {license.url ? (
              <a
                href={license.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 transition-colors hover:text-gold"
              >
                {license.label}
                <ExternalLink className="size-3" />
              </a>
            ) : (
              license.label
            )}
          </span>
        </div>

        {/* Abstract */}
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Abstract
          </h2>
          <p className="text-sm leading-relaxed text-foreground">{article.abstract}</p>
        </section>

        {/* Keywords */}
        {article.keywords.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Keywords
            </h2>
            <div className="flex flex-wrap gap-2">
              {article.keywords.map((kw) => (
                <span
                  key={kw}
                  className="rounded-md bg-surface-2 px-2.5 py-1 text-xs text-muted-foreground"
                >
                  {kw}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Downloads */}
        {article.attachments.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Downloads
            </h2>
            <div className="flex flex-wrap gap-3">
              {article.attachments.map((url, i) => (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-4 py-2 text-sm font-medium transition-colors hover:border-gold/40 hover:bg-surface-3"
                >
                  <Download className="size-4" />
                  {i === 0 ? 'Full Text (PDF)' : `Attachment ${i + 1}`}
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Citation box */}
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Cite This Article
          </h2>
          <CitationBox source={citationSource} />
        </section>
      </article>
    </div>
  )
}
