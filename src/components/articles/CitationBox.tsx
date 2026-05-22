'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { cn, citationAPA, citationMLA, citationChicago } from '@/lib/utils'
import type { CitationSource } from '@/lib/utils'

// ── Types ─────────────────────────────────────────────────────────────────────

type CitationStyle = 'APA' | 'MLA' | 'Chicago'

const STYLES: CitationStyle[] = ['APA', 'MLA', 'Chicago']

const generators: Record<CitationStyle, (src: CitationSource) => string> = {
  APA:     citationAPA,
  MLA:     citationMLA,
  Chicago: citationChicago,
}

const styleLabels: Record<CitationStyle, string> = {
  APA:     'APA 7th',
  MLA:     'MLA 9th',
  Chicago: 'Chicago 17th',
}

// ── Component ─────────────────────────────────────────────────────────────────

interface CitationBoxProps {
  source: CitationSource
}

export default function CitationBox({ source }: CitationBoxProps) {
  const [active, setActive] = useState<CitationStyle>('APA')
  const [copied, setCopied] = useState(false)

  const citation = generators[active](source)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(citation)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback: select the text
      const el = document.getElementById('citation-text')
      if (el) {
        const range = document.createRange()
        range.selectNodeContents(el)
        window.getSelection()?.removeAllRanges()
        window.getSelection()?.addRange(range)
      }
    }
  }

  return (
    <div className="rounded-xl border border-border bg-surface-1">
      {/* Tab bar */}
      <div className="flex items-center gap-0.5 border-b border-border px-3 pt-3">
        {STYLES.map((style) => (
          <button
            key={style}
            type="button"
            onClick={() => setActive(style)}
            className={cn(
              'rounded-t-md px-3 py-2 text-xs font-medium transition-colors',
              active === style
                ? 'bg-surface-2 text-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {styleLabels[style]}
          </button>
        ))}
        <div className="flex-1" />
        <button
          type="button"
          onClick={handleCopy}
          className="mb-1 flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-surface-2"
        >
          {copied ? (
            <>
              <Check className="size-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="size-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Citation text */}
      <p
        id="citation-text"
        className="select-all p-4 font-mono text-xs leading-relaxed text-foreground"
      >
        {citation}
      </p>
    </div>
  )
}
