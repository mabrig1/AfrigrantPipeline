'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Check, ChevronRight, ChevronLeft, Loader2, X, AlertCircle, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { JournalResponse, ArticleLicense } from '@/lib/api'

// ── Constants ─────────────────────────────────────────────────────────────────

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
  { value: 'pt', label: 'Português' },
  { value: 'ar', label: 'العربية' },
  { value: 'sw', label: 'Kiswahili' },
  { value: 'other', label: 'Other' },
]

const LICENSES: { value: ArticleLicense; label: string; description: string; open: boolean }[] = [
  { value: 'CC BY',          label: 'CC BY 4.0',          description: 'Free to share and adapt with attribution', open: true },
  { value: 'CC BY-SA',       label: 'CC BY-SA 4.0',       description: 'Share alike — derivatives must use same license', open: true },
  { value: 'CC BY-NC',       label: 'CC BY-NC 4.0',       description: 'Non-commercial use only', open: true },
  { value: 'CC BY-ND',       label: 'CC BY-ND 4.0',       description: 'No derivatives allowed', open: true },
  { value: 'CC0',            label: 'CC0 1.0 (Public Domain)', description: 'No rights reserved — public domain', open: true },
  { value: 'All Rights Reserved', label: 'All Rights Reserved', description: 'Standard copyright', open: false },
]

const STEPS = [
  { id: 1, label: 'Metadata' },
  { id: 2, label: 'Content' },
  { id: 3, label: 'Publication' },
  { id: 4, label: 'Review' },
]

// ── Form state ────────────────────────────────────────────────────────────────

interface FormData {
  title: string
  abstract: string
  keywords: string[]
  language: string
  license: ArticleLicense
  content: string
  journal: string
  attachmentUrl: string
}

const initialData: FormData = {
  title: '',
  abstract: '',
  keywords: [],
  language: 'en',
  license: 'CC BY',
  content: '',
  journal: '',
  attachmentUrl: '',
}

// ── Sub-components ────────────────────────────────────────────────────────────

const inputCls = (hasError?: boolean) =>
  cn(
    'w-full rounded-lg border bg-surface-2 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 transition-colors focus:bg-surface-3 focus:outline-none focus:ring-2',
    hasError
      ? 'border-destructive/70 focus:border-destructive/70 focus:ring-destructive/20'
      : 'border-border focus:border-gold/50 focus:ring-gold/20',
  )

// ── Step indicator ────────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: number }) {
  return (
    <ol className="mb-8 flex items-center">
      {STEPS.map((step, i) => {
        const done    = step.id < current
        const active  = step.id === current
        const isLast  = i === STEPS.length - 1

        return (
          <li key={step.id} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  'flex size-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors',
                  done    ? 'border-gold bg-gold text-primary-foreground' :
                  active  ? 'border-gold bg-gold/10 text-gold' :
                            'border-border bg-surface-2 text-muted-foreground',
                )}
              >
                {done ? <Check className="size-4" /> : step.id}
              </div>
              <span
                className={cn(
                  'hidden text-[11px] font-medium sm:block',
                  active ? 'text-foreground' : 'text-muted-foreground',
                )}
              >
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div
                className={cn(
                  'mx-2 mb-5 h-px flex-1 transition-colors',
                  done ? 'bg-gold/50' : 'bg-border',
                )}
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}

// ── Keyword input ─────────────────────────────────────────────────────────────

function KeywordInput({
  keywords,
  onChange,
}: {
  keywords: string[]
  onChange: (kw: string[]) => void
}) {
  const [input, setInput] = useState('')

  function add() {
    const trimmed = input.trim().toLowerCase()
    if (trimmed && !keywords.includes(trimmed) && keywords.length < 10) {
      onChange([...keywords, trimmed])
      setInput('')
    }
  }

  function remove(kw: string) {
    onChange(keywords.filter((k) => k !== kw))
  }

  return (
    <div>
      <div className="mb-2 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add() }
          }}
          placeholder="Type a keyword and press Enter"
          maxLength={40}
          className={inputCls()}
        />
        <button
          type="button"
          onClick={add}
          disabled={!input.trim() || keywords.length >= 10}
          className="rounded-lg border border-border bg-surface-2 px-3 text-sm font-medium transition-colors hover:bg-surface-3 disabled:opacity-50"
        >
          Add
        </button>
      </div>
      {keywords.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {keywords.map((kw) => (
            <span
              key={kw}
              className="flex items-center gap-1 rounded-full border border-border bg-surface-2 px-2.5 py-1 text-xs"
            >
              {kw}
              <button
                type="button"
                onClick={() => remove(kw)}
                className="ml-0.5 text-muted-foreground transition-colors hover:text-destructive"
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
      )}
      <p className="mt-1.5 text-[11px] text-muted-foreground">{keywords.length}/10 keywords</p>
    </div>
  )
}

// ── Step 1: Metadata ──────────────────────────────────────────────────────────

function Step1({
  data,
  errors,
  onChange,
}: {
  data: FormData
  errors: Record<string, string>
  onChange: (patch: Partial<FormData>) => void
}) {
  return (
    <div className="space-y-5">
      <div>
        <label className="mb-1.5 block text-sm font-medium">
          Article title <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="A descriptive title for your research"
          maxLength={300}
          className={inputCls(!!errors.title)}
        />
        {errors.title && <p className="mt-1 text-xs text-destructive">{errors.title}</p>}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">
          Abstract <span className="text-destructive">*</span>
        </label>
        <textarea
          value={data.abstract}
          onChange={(e) => onChange({ abstract: e.target.value })}
          placeholder="Summarise your research — methods, findings, and significance (min. 150 characters)"
          rows={5}
          className={cn(inputCls(!!errors.abstract), 'resize-y')}
        />
        <div className="mt-1 flex items-center justify-between">
          {errors.abstract
            ? <p className="text-xs text-destructive">{errors.abstract}</p>
            : <span />}
          <span className="text-[11px] text-muted-foreground">{data.abstract.length} chars</span>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">Keywords</label>
        <KeywordInput keywords={data.keywords} onChange={(kw) => onChange({ keywords: kw })} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Language</label>
          <select
            value={data.language}
            onChange={(e) => onChange({ language: e.target.value })}
            className={cn(inputCls(), 'cursor-pointer')}
          >
            {LANGUAGES.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">License</label>
          <select
            value={data.license}
            onChange={(e) => onChange({ license: e.target.value as ArticleLicense })}
            className={cn(inputCls(), 'cursor-pointer')}
          >
            {LICENSES.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <p className="mt-1 text-[11px] text-muted-foreground">
            {LICENSES.find((l) => l.value === data.license)?.description}
          </p>
        </div>
      </div>
    </div>
  )
}

// ── Step 2: Content ───────────────────────────────────────────────────────────

function Step2({
  data,
  errors,
  onChange,
}: {
  data: FormData
  errors: Record<string, string>
  onChange: (patch: Partial<FormData>) => void
}) {
  return (
    <div className="space-y-5">
      <div>
        <label className="mb-1.5 block text-sm font-medium">
          Full manuscript <span className="text-destructive">*</span>
        </label>
        <p className="mb-2 text-xs text-muted-foreground">
          Paste or type the full text of your article. Formatting will be preserved.
        </p>
        <textarea
          value={data.content}
          onChange={(e) => onChange({ content: e.target.value })}
          placeholder="Introduction&#10;&#10;Background and motivation for the study...&#10;&#10;Methods&#10;&#10;...&#10;&#10;Results&#10;&#10;...&#10;&#10;Discussion&#10;&#10;...&#10;&#10;Conclusion&#10;&#10;..."
          rows={20}
          className={cn(inputCls(!!errors.content), 'resize-y font-mono text-xs leading-relaxed')}
        />
        <div className="mt-1 flex items-center justify-between">
          {errors.content
            ? <p className="text-xs text-destructive">{errors.content}</p>
            : <span />}
          <span className="text-[11px] text-muted-foreground">
            {data.content.split(/\s+/).filter(Boolean).length} words
          </span>
        </div>
      </div>
    </div>
  )
}

// ── Step 3: Publication details ───────────────────────────────────────────────

function Step3({
  data,
  journals,
  onChange,
}: {
  data: FormData
  journals: JournalResponse[]
  onChange: (patch: Partial<FormData>) => void
}) {
  return (
    <div className="space-y-5">
      <div>
        <label className="mb-1.5 block text-sm font-medium">
          Target journal{' '}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <select
          value={data.journal}
          onChange={(e) => onChange({ journal: e.target.value })}
          className={cn(inputCls(), 'cursor-pointer')}
        >
          <option value="">No specific journal — general submission</option>
          {journals.map((j) => (
            <option key={j._id} value={j._id}>
              {j.name}{j.isOpenAccess ? ' (Open Access)' : ''}
            </option>
          ))}
        </select>
        <p className="mt-1.5 text-[11px] text-muted-foreground">
          Selecting a journal directs your article to that journal&apos;s editorial board.
        </p>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">
          PDF / attachment URL{' '}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <input
          type="url"
          value={data.attachmentUrl}
          onChange={(e) => onChange({ attachmentUrl: e.target.value })}
          placeholder="https://res.cloudinary.com/..."
          className={inputCls()}
        />
        <p className="mt-1.5 text-[11px] text-muted-foreground">
          Upload your PDF to Cloudinary or any hosting service and paste the URL here.
        </p>
      </div>

      <div className="rounded-xl border border-gold/20 bg-gold/5 p-4 text-sm text-muted-foreground">
        <p className="mb-1 font-medium text-foreground">What happens next?</p>
        <ul className="space-y-1 text-xs">
          <li>• Your article is saved as a <strong>draft</strong> immediately.</li>
          <li>• Submitting moves it to <strong>under review</strong> — editors are notified.</li>
          <li>• Upon acceptance it is assigned a DOI and <strong>published</strong> open-access.</li>
        </ul>
      </div>
    </div>
  )
}

// ── Step 4: Review ────────────────────────────────────────────────────────────

function Step4({
  data,
  journals,
}: {
  data: FormData
  journals: JournalResponse[]
}) {
  const journal = journals.find((j) => j._id === data.journal)
  const license = LICENSES.find((l) => l.value === data.license)
  const lang = LANGUAGES.find((l) => l.value === data.language)

  const row = (label: string, value: string | React.ReactNode) => (
    <div className="flex gap-3 border-b border-border py-3 last:border-0">
      <span className="w-28 shrink-0 text-xs font-medium text-muted-foreground">{label}</span>
      <span className="flex-1 text-xs">{value}</span>
    </div>
  )

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">
        Review your submission before sending. You can go back to make changes.
      </p>

      <div className="rounded-xl border border-border bg-surface-1 px-4 py-1">
        {row('Title', data.title || <em className="text-muted-foreground">—</em>)}
        {row('Abstract', data.abstract
          ? `${data.abstract.slice(0, 120)}${data.abstract.length > 120 ? '…' : ''}`
          : <em className="text-muted-foreground">—</em>
        )}
        {row('Keywords', data.keywords.length > 0
          ? data.keywords.join(', ')
          : <em className="text-muted-foreground">None</em>
        )}
        {row('Language', lang?.label ?? data.language)}
        {row('License', license?.label ?? data.license)}
        {row('Content', data.content
          ? `${data.content.split(/\s+/).filter(Boolean).length} words`
          : <em className="text-destructive">Missing — go back to Step 2</em>
        )}
        {row('Journal', journal ? journal.name : 'General submission')}
        {row('Attachment', data.attachmentUrl || <em className="text-muted-foreground">None</em>)}
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

interface SubmitArticleFormProps {
  journals: JournalResponse[]
}

export default function SubmitArticleForm({ journals }: SubmitArticleFormProps) {
  const router = useRouter()
  const [step, setStep]       = useState(1)
  const [formData, setFormData] = useState<FormData>(initialData)
  const [errors, setErrors]   = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [createdId, setCreatedId] = useState<string | null>(null)

  function patch(update: Partial<FormData>) {
    setFormData((prev) => ({ ...prev, ...update }))
    // Clear errors for changed fields
    const clearedKeys = Object.keys(update)
    if (clearedKeys.some((k) => errors[k])) {
      setErrors((prev) => {
        const next = { ...prev }
        clearedKeys.forEach((k) => delete next[k])
        return next
      })
    }
  }

  // ── Validation per step ─────────────────────────────────────────────────────

  function validateStep(n: number): boolean {
    const errs: Record<string, string> = {}

    if (n === 1) {
      if (!formData.title.trim()) errs.title = 'Title is required.'
      else if (formData.title.trim().length < 10) errs.title = 'Title must be at least 10 characters.'
      if (!formData.abstract.trim()) errs.abstract = 'Abstract is required.'
      else if (formData.abstract.trim().length < 150) errs.abstract = `Abstract must be at least 150 characters (${formData.abstract.trim().length} so far).`
    }

    if (n === 2) {
      if (!formData.content.trim()) errs.content = 'Article content is required.'
      else if (formData.content.trim().length < 500) errs.content = 'Content must be at least 500 characters.'
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function next() {
    if (validateStep(step)) setStep((s) => Math.min(s + 1, STEPS.length))
  }

  function back() {
    setStep((s) => Math.max(s - 1, 1))
    setErrors({})
  }

  // ── Submit ──────────────────────────────────────────────────────────────────

  async function handleSubmit() {
    setSubmitError('')
    setSubmitting(true)

    const body = {
      title: formData.title.trim(),
      abstract: formData.abstract.trim(),
      content: formData.content.trim(),
      keywords: formData.keywords,
      language: formData.language,
      license: formData.license,
      journal: formData.journal || undefined,
      attachments: formData.attachmentUrl ? [formData.attachmentUrl.trim()] : [],
    }

    // We need a token — use the session cookie via the Next.js API proxy
    // The Railway JWT isn't available in the browser; we proxy through our API route
    const res = await fetch('/api/articles/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    setSubmitting(false)

    if (!res.ok) {
      const json = await res.json().catch(() => ({}))
      setSubmitError((json as { error?: string }).error ?? 'Submission failed. Please try again.')
      return
    }

    const json = await res.json() as { data?: { _id: string } }
    setCreatedId(json.data?._id ?? null)
    setSubmitted(true)
  }

  // ── Success screen ──────────────────────────────────────────────────────────

  if (submitted) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-border bg-card p-12 text-center">
        <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-emerald-500/10">
          <CheckCircle2 className="size-8 text-emerald-400" />
        </div>
        <h2 className="mb-2 text-xl font-extrabold">Article submitted!</h2>
        <p className="mb-8 max-w-sm text-sm text-muted-foreground">
          Your article has been saved and queued for editorial review. You&apos;ll be notified
          when the status changes.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          {createdId && (
            <Link
              href={`/articles/${createdId}`}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
            >
              View Your Article
            </Link>
          )}
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-surface-3"
          >
            Back to Repository
          </Link>
        </div>
      </div>
    )
  }

  // ── Form ────────────────────────────────────────────────────────────────────

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <StepIndicator current={step} />

      {/* Global submit error */}
      {submitError && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          {submitError}
        </div>
      )}

      {/* Step content */}
      <div className="min-h-[320px]">
        {step === 1 && <Step1 data={formData} errors={errors} onChange={patch} />}
        {step === 2 && <Step2 data={formData} errors={errors} onChange={patch} />}
        {step === 3 && <Step3 data={formData} journals={journals} onChange={patch} />}
        {step === 4 && <Step4 data={formData} journals={journals} />}
      </div>

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
        <button
          type="button"
          onClick={back}
          disabled={step === 1}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-surface-3 disabled:opacity-40"
        >
          <ChevronLeft className="size-4" />
          Back
        </button>

        {step < STEPS.length ? (
          <button
            type="button"
            onClick={next}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98]"
          >
            Next
            <ChevronRight className="size-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
          >
            {submitting && <Loader2 className="size-4 animate-spin" />}
            {submitting ? 'Submitting…' : 'Submit for Review'}
          </button>
        )}
      </div>
    </div>
  )
}
