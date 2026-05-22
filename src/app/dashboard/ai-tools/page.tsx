'use client'

import { useState, useRef } from 'react'
import { Sparkles, Copy, RotateCcw, ChevronDown, Check, Loader2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Types ─────────────────────────────────────────────────────────────────────

type TemplateKey = 'proposal' | 'abstract' | 'description' | 'cover_letter' | 'aim'

interface FormState {
  template: TemplateKey
  topic: string
  organization: string
  funder: string
  country: string
  wordCount: string
  context: string
}

// ── Constants ─────────────────────────────────────────────────────────────────

const TEMPLATES: { value: TemplateKey; label: string; description: string }[] = [
  { value: 'proposal',     label: 'Grant Proposal',       description: 'Executive summary for a full grant application' },
  { value: 'abstract',     label: 'Research Abstract',    description: 'Concise academic abstract for your research' },
  { value: 'description',  label: 'Project Description',  description: 'Detailed narrative describing your project' },
  { value: 'cover_letter', label: 'Cover Letter',         description: 'Professional letter to accompany an application' },
  { value: 'aim',          label: 'Specific Aims',        description: 'Objectives and hypotheses for research grants' },
]

const WORD_COUNTS = [
  { value: '150',  label: '~150 words' },
  { value: '300',  label: '~300 words' },
  { value: '500',  label: '~500 words' },
  { value: '800',  label: '~800 words' },
  { value: '1200', label: '~1200 words' },
]

const INITIAL_FORM: FormState = {
  template: 'proposal',
  topic: '',
  organization: '',
  funder: '',
  country: '',
  wordCount: '300',
  context: '',
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AIToolsPage() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const [output, setOutput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const outputRef = useRef<HTMLDivElement>(null)
  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null)

  const selectedTemplate = TEMPLATES.find((t) => t.value === form.template) ?? TEMPLATES[0]

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function generate(e: React.FormEvent) {
    e.preventDefault()
    if (!form.topic.trim() || streaming) return

    setOutput('')
    setError('')
    setDone(false)
    setStreaming(true)

    try {
      const res = await fetch('/api/ai/proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template: form.template,
          topic: form.topic.trim(),
          organization: form.organization.trim() || undefined,
          funder: form.funder.trim() || undefined,
          country: form.country.trim() || undefined,
          wordCount: parseInt(form.wordCount, 10),
          context: form.context.trim() || undefined,
        }),
      })

      if (!res.ok) {
        const json = (await res.json().catch(() => ({}))) as { error?: string }
        setError(json.error ?? 'Generation failed. Please try again.')
        return
      }

      const reader = res.body!.getReader()
      readerRef.current = reader
      const decoder = new TextDecoder()
      let text = ''

      while (true) {
        const { done: streamDone, value } = await reader.read()
        if (streamDone) break
        text += decoder.decode(value, { stream: true })
        setOutput(text)
        outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight, behavior: 'smooth' })
      }

      setDone(true)
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError('Network error. Please check your connection and try again.')
      }
    } finally {
      setStreaming(false)
      readerRef.current = null
    }
  }

  function stop() {
    readerRef.current?.cancel()
    setStreaming(false)
    if (output) setDone(true)
  }

  async function copy() {
    if (!output) return
    try {
      await navigator.clipboard.writeText(output)
    } catch {
      const el = document.createElement('textarea')
      el.value = output
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function clear() {
    setOutput('')
    setDone(false)
    setError('')
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="mb-1 flex items-center gap-2">
          <Sparkles className="size-5 text-gold" />
          <h1 className="text-2xl font-extrabold tracking-tight">AI Grant Writer</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Generate professional grant proposals, abstracts, and cover letters tailored to African research contexts.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
        {/* ── Left: Form ────────────────────────────────────────────────────── */}
        <form onSubmit={generate} className="space-y-5">
          {/* Template selector */}
          <div>
            <label className="mb-2 block text-sm font-medium">Document type</label>
            <div className="space-y-2">
              {TEMPLATES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setField('template', t.value)}
                  className={cn(
                    'flex w-full items-start gap-3 rounded-lg border px-4 py-3 text-left transition-colors',
                    form.template === t.value
                      ? 'border-gold/50 bg-gold/5 text-foreground'
                      : 'border-border bg-surface-2 text-muted-foreground hover:border-border/60 hover:text-foreground',
                  )}
                >
                  <span
                    className={cn(
                      'mt-0.5 size-3.5 shrink-0 rounded-full border-2 transition-colors',
                      form.template === t.value
                        ? 'border-gold bg-gold'
                        : 'border-border',
                    )}
                  />
                  <div>
                    <p className="text-sm font-medium leading-none">{t.label}</p>
                    <p className="mt-0.5 text-xs opacity-70">{t.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Topic */}
          <div>
            <label htmlFor="topic" className="mb-1.5 block text-sm font-medium">
              Topic / Research title <span className="text-red-400">*</span>
            </label>
            <textarea
              id="topic"
              rows={2}
              required
              value={form.topic}
              onChange={(e) => setField('topic', e.target.value)}
              placeholder={`e.g. "${selectedTemplate.value === 'abstract' ? 'Machine learning for malaria diagnosis in sub-Saharan Africa' : 'Youth entrepreneurship programme in rural Kenya'
              }"`}
              className="w-full resize-none rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20"
            />
          </div>

          {/* Org + Funder side by side */}
          <div className="grid grid-cols-2 gap-4">
            <InputField
              id="organization"
              label="Organisation"
              placeholder="Your institution"
              value={form.organization}
              onChange={(v) => setField('organization', v)}
            />
            <InputField
              id="funder"
              label="Target funder"
              placeholder="e.g. Gates Foundation"
              value={form.funder}
              onChange={(v) => setField('funder', v)}
            />
          </div>

          {/* Country + Word count side by side */}
          <div className="grid grid-cols-2 gap-4">
            <InputField
              id="country"
              label="Country / Region"
              placeholder="e.g. Nigeria"
              value={form.country}
              onChange={(v) => setField('country', v)}
            />
            <div>
              <label htmlFor="wordCount" className="mb-1.5 block text-sm font-medium">
                Length
              </label>
              <div className="relative">
                <select
                  id="wordCount"
                  value={form.wordCount}
                  onChange={(e) => setField('wordCount', e.target.value)}
                  className="w-full appearance-none rounded-lg border border-border bg-surface-2 px-4 py-2.5 pr-8 text-sm focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20"
                >
                  {WORD_COUNTS.map((w) => (
                    <option key={w.value} value={w.value}>
                      {w.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
          </div>

          {/* Additional context */}
          <div>
            <label htmlFor="context" className="mb-1.5 block text-sm font-medium">
              Additional context{' '}
              <span className="font-normal text-muted-foreground">(optional)</span>
            </label>
            <textarea
              id="context"
              rows={3}
              value={form.context}
              onChange={(e) => setField('context', e.target.value)}
              placeholder="Include relevant background, preliminary results, specific requirements, or key points to emphasise..."
              className="w-full resize-none rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20"
            />
          </div>

          {/* Submit / Stop */}
          <div className="flex gap-3">
            {streaming ? (
              <button
                type="button"
                onClick={stop}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 py-2.5 text-sm font-semibold text-red-400 transition-colors hover:bg-red-500/20"
              >
                Stop generating
              </button>
            ) : (
              <button
                type="submit"
                disabled={!form.topic.trim()}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Sparkles className="size-4" />
                Generate
              </button>
            )}
            {(output || error) && !streaming && (
              <button
                type="button"
                onClick={clear}
                className="flex items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <RotateCcw className="size-3.5" />
                Clear
              </button>
            )}
          </div>
        </form>

        {/* ── Right: Output ────────────────────────────────────────────────── */}
        <div className="flex flex-col">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-medium text-muted-foreground">
              {streaming ? 'Generating…' : done ? 'Generated output' : 'Output'}
            </h2>
            {done && output && (
              <button
                type="button"
                onClick={copy}
                className={cn(
                  'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                  copied
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'border border-border bg-surface-2 text-muted-foreground hover:text-foreground',
                )}
              >
                {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            )}
          </div>

          <div
            ref={outputRef}
            className={cn(
              'relative min-h-[420px] flex-1 overflow-y-auto rounded-xl border bg-card p-6 text-sm leading-relaxed',
              streaming || output
                ? 'border-gold/20'
                : 'border-dashed border-border',
            )}
          >
            {/* Idle placeholder */}
            {!streaming && !output && !error && (
              <div className="flex h-full flex-col items-center justify-center gap-4 py-12 text-center text-muted-foreground">
                <div className="flex size-16 items-center justify-center rounded-full border border-border bg-surface-2">
                  <Sparkles className="size-7 text-muted-foreground/40" />
                </div>
                <div>
                  <p className="font-medium">Ready to generate</p>
                  <p className="mt-1 text-xs">
                    Fill in the form and click Generate to create your{' '}
                    {selectedTemplate.label.toLowerCase()}.
                  </p>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/10 p-4">
                <AlertCircle className="mt-0.5 size-4 shrink-0 text-red-400" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Streaming / output */}
            {output && (
              <div className="whitespace-pre-wrap text-foreground">
                {output}
                {streaming && (
                  <span className="ml-0.5 inline-block h-[1.1em] w-0.5 animate-pulse bg-gold align-text-bottom" />
                )}
              </div>
            )}

            {/* Loading state before first token */}
            {streaming && !output && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="size-4 animate-spin text-gold" />
                <span className="text-xs">Writing your {selectedTemplate.label.toLowerCase()}…</span>
              </div>
            )}
          </div>

          {done && output && (
            <p className="mt-2 text-right text-xs text-muted-foreground">
              ~{output.trim().split(/\s+/).length} words
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function InputField({
  id,
  label,
  placeholder,
  value,
  onChange,
}: {
  id: string
  label: string
  placeholder: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20"
      />
    </div>
  )
}
