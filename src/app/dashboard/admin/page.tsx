'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, PlusCircle, Loader2, CheckCircle, AlertCircle, Database } from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Admin setup ────────────────────────────────────────────────────────────────

function AdminSetup() {
  const [secret, setSecret] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [msg, setMsg] = useState('')

  async function activate() {
    setStatus('loading')
    const res = await fetch('/api/admin/make-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret }),
    })
    const json = (await res.json()) as { message?: string; error?: string }
    if (res.ok) {
      setStatus('ok')
      setMsg(json.message ?? 'You are now admin. Refresh the page.')
    } else {
      setStatus('error')
      setMsg(json.error ?? 'Failed')
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center gap-2">
        <Shield className="size-5 text-gold" />
        <h2 className="font-semibold">Step 1 — Activate admin role</h2>
      </div>
      <p className="mb-4 text-sm text-muted-foreground">
        Enter your <code className="rounded bg-surface-2 px-1 py-0.5 text-xs">ADMIN_SETUP_SECRET</code> from Vercel env vars to upgrade your account to admin.
      </p>
      <div className="flex gap-2">
        <input
          type="password"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          placeholder="Paste your ADMIN_SETUP_SECRET"
          className="flex-1 rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20"
        />
        <button
          onClick={activate}
          disabled={!secret || status === 'loading' || status === 'ok'}
          className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {status === 'loading' && <Loader2 className="size-4 animate-spin" />}
          {status === 'ok' ? 'Done!' : 'Activate'}
        </button>
      </div>
      {msg && (
        <p className={cn('mt-3 flex items-center gap-2 text-sm', status === 'ok' ? 'text-emerald-400' : 'text-red-400')}>
          {status === 'ok' ? <CheckCircle className="size-4" /> : <AlertCircle className="size-4" />}
          {msg}
        </p>
      )}
    </div>
  )
}

// ── Seed Grants ───────────────────────────────────────────────────────────────

function SeedGrants() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [msg, setMsg] = useState('')

  async function seed() {
    setStatus('loading')
    const res = await fetch('/api/admin/seed-grants', { method: 'POST' })
    const json = (await res.json()) as { message?: string; error?: string }
    if (res.ok) { setStatus('ok'); setMsg(json.message ?? 'Done') }
    else { setStatus('error'); setMsg(json.error ?? 'Failed') }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center gap-2">
        <Database className="size-5 text-gold" />
        <h2 className="font-semibold">Step 2 — Seed 7 starter grants</h2>
      </div>
      <p className="mb-4 text-sm text-muted-foreground">
        Adds 7 curated 2026 Africa grants (AFEP, Cambridge-Africa, TETFund, NEH, Fulbright, NYFF, APSA) to the database. Skips any already added.
      </p>
      <button
        onClick={seed}
        disabled={status === 'loading' || status === 'ok'}
        className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-40"
      >
        {status === 'loading' && <Loader2 className="size-4 animate-spin" />}
        {status === 'ok' ? 'Done!' : 'Seed Grants'}
      </button>
      {msg && (
        <p className={cn('mt-3 flex items-center gap-2 text-sm', status === 'ok' ? 'text-emerald-400' : 'text-red-400')}>
          {status === 'ok' ? <CheckCircle className="size-4" /> : <AlertCircle className="size-4" />}
          {msg}
        </p>
      )}
    </div>
  )
}

// ── Grant form ─────────────────────────────────────────────────────────────────

const GRANT_TYPES = ['research', 'scholarship', 'fellowship', 'project', 'seed', 'other']
const CURRENCIES = ['USD', 'EUR', 'GBP', 'NGN', 'KES', 'ZAR', 'GHS', 'ETB']

export default function AdminPage() {
  const router = useRouter()
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [msg, setMsg] = useState('')
  const [form, setForm] = useState({
    title: '', description: '', funder: '', amount: '',
    currency: 'USD', deadline: '', grantType: 'research',
    eligibility: '', categories: '', countries: '', region: '', applicationLink: '',
  })

  function set(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setMsg('')

    const res = await fetch('/api/admin/grants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const json = (await res.json()) as { message?: string; error?: string }

    if (res.ok) {
      setStatus('ok')
      setMsg('Grant created successfully!')
      setForm({ title: '', description: '', funder: '', amount: '', currency: 'USD', deadline: '', grantType: 'research', eligibility: '', categories: '', countries: '', region: '', applicationLink: '' })
      setTimeout(() => router.push('/grants'), 1500)
    } else {
      setStatus('error')
      setMsg(json.error ?? 'Failed to create grant')
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Admin — Create Grant</h1>
        <p className="mt-1 text-sm text-muted-foreground">Add a new grant to the marketplace.</p>
      </div>

      <AdminSetup />

      {/* Seed grants */}
      <SeedGrants />

      {/* Grant creation form */}
      <form onSubmit={submit} className="space-y-6 rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-2 border-b border-border pb-4">
          <PlusCircle className="size-5 text-gold" />
          <h2 className="font-semibold">Step 3 — Create a custom grant</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Grant title *" col={2}>
            <input required value={form.title} onChange={(e) => set('title', e.target.value)}
              placeholder="e.g. African Research Innovation Fund 2025"
              className={inputCls} />
          </Field>

          <Field label="Funder / Organisation *">
            <input required value={form.funder} onChange={(e) => set('funder', e.target.value)}
              placeholder="e.g. Gates Foundation"
              className={inputCls} />
          </Field>

          <Field label="Grant type *">
            <select required value={form.grantType} onChange={(e) => set('grantType', e.target.value)} className={inputCls}>
              {GRANT_TYPES.map((t) => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </Field>

          <Field label="Amount *">
            <input required type="number" min={1} value={form.amount} onChange={(e) => set('amount', e.target.value)}
              placeholder="e.g. 50000"
              className={inputCls} />
          </Field>

          <Field label="Currency">
            <select value={form.currency} onChange={(e) => set('currency', e.target.value)} className={inputCls}>
              {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>

          <Field label="Application deadline *">
            <input required type="date" value={form.deadline} onChange={(e) => set('deadline', e.target.value)}
              className={inputCls} />
          </Field>

          <Field label="Description *" col={2}>
            <textarea required rows={4} value={form.description} onChange={(e) => set('description', e.target.value)}
              placeholder="Describe the grant, its purpose, and what it funds..."
              className={cn(inputCls, 'resize-none')} />
          </Field>

          <Field label="Eligibility" hint="comma-separated">
            <input value={form.eligibility} onChange={(e) => set('eligibility', e.target.value)}
              placeholder="e.g. PhD students, Postdocs"
              className={inputCls} />
          </Field>

          <Field label="Categories" hint="comma-separated">
            <input value={form.categories} onChange={(e) => set('categories', e.target.value)}
              placeholder="e.g. Health, Agriculture"
              className={inputCls} />
          </Field>

          <Field label="Countries" hint="comma-separated">
            <input value={form.countries} onChange={(e) => set('countries', e.target.value)}
              placeholder="e.g. Nigeria, Kenya, Ghana"
              className={inputCls} />
          </Field>

          <Field label="Region">
            <input value={form.region} onChange={(e) => set('region', e.target.value)}
              placeholder="e.g. Sub-Saharan Africa"
              className={inputCls} />
          </Field>

          <Field label="Application link" col={2}>
            <input type="url" value={form.applicationLink} onChange={(e) => set('applicationLink', e.target.value)}
              placeholder="https://..."
              className={inputCls} />
          </Field>
        </div>

        {msg && (
          <p className={cn('flex items-center gap-2 text-sm', status === 'ok' ? 'text-emerald-400' : 'text-red-400')}>
            {status === 'ok' ? <CheckCircle className="size-4" /> : <AlertCircle className="size-4" />}
            {msg}
          </p>
        )}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-40"
        >
          {status === 'loading' && <Loader2 className="size-4 animate-spin" />}
          {status === 'loading' ? 'Creating…' : 'Create Grant'}
        </button>
      </form>
    </div>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const inputCls = 'w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20'

function Field({ label, hint, col, children }: { label: string; hint?: string; col?: number; children: React.ReactNode }) {
  return (
    <div className={col === 2 ? 'sm:col-span-2' : ''}>
      <label className="mb-1.5 block text-sm font-medium">
        {label}
        {hint && <span className="ml-1 font-normal text-muted-foreground">({hint})</span>}
      </label>
      {children}
    </div>
  )
}
