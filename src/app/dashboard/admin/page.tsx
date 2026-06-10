'use client'

import { useState } from 'react'
import { Shield, PlusCircle, Loader2, CheckCircle, AlertCircle, Database, UserCheck, Crown } from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Admin Setup ────────────────────────────────────────────────────────────

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
    if (res.ok) { setStatus('ok'); setMsg(json.message ?? 'You are now admin. Refresh the page.') }
    else { setStatus('error'); setMsg(json.error ?? 'Failed') }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center gap-2">
        <Shield className="size-5 text-gold" />
        <h2 className="font-semibold">Step 1 — Activate admin role</h2>
      </div>
      <p className="mb-4 text-sm text-muted-foreground">
        Enter your <code className="rounded bg-surface-2 px-1 py-0.5 text-xs">ADMIN_SETUP_SECRET</code> to upgrade your account to admin.
      </p>
      <div className="flex gap-2">
        <input type="password" value={secret} onChange={(e) => setSecret(e.target.value)}
          placeholder="Paste your ADMIN_SETUP_SECRET"
          className="flex-1 rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20" />
        <button onClick={activate} disabled={!secret || status === 'loading' || status === 'ok'}
          className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-40">
          {status === 'loading' && <Loader2 className="size-4 animate-spin" />}
          {status === 'ok' ? 'Done!' : 'Activate'}
        </button>
      </div>
      {msg && (
        <p className={cn('mt-3 flex items-center gap-2 text-sm', status === 'ok' ? 'text-emerald-400' : 'text-red-400')}>
          {status === 'ok' ? <CheckCircle className="size-4" /> : <AlertCircle className="size-4" />}{msg}
        </p>
      )}
    </div>
  )
}

// ── Seed Grants ────────────────────────────────────────────────────────────

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
        <h2 className="font-semibold">Step 2 — Seed starter grants</h2>
      </div>
      <p className="mb-4 text-sm text-muted-foreground">
        Adds 7 curated 2026 Africa grants to the database. Skips any already added.
      </p>
      <button onClick={seed} disabled={status === 'loading' || status === 'ok'}
        className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-40">
        {status === 'loading' && <Loader2 className="size-4 animate-spin" />}
        {status === 'ok' ? 'Done!' : 'Seed Grants'}
      </button>
      {msg && (
        <p className={cn('mt-3 flex items-center gap-2 text-sm', status === 'ok' ? 'text-emerald-400' : 'text-red-400')}>
          {status === 'ok' ? <CheckCircle className="size-4" /> : <AlertCircle className="size-4" />}{msg}
        </p>
      )}
    </div>
  )
}

// ── Subscription Manager ───────────────────────────────────────────────────

function SubscriptionManager() {
  const [email, setEmail] = useState('')
  const [plan, setPlan] = useState<'silver' | 'gold' | 'platinum' | 'free'>('silver')
  const [days, setDays] = useState('30')
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [msg, setMsg] = useState('')

  async function upgrade() {
    if (!email) return
    setStatus('loading')
    setMsg('')
    const res = await fetch('/api/admin/set-subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, plan, durationDays: parseInt(days) || 30 }),
    })
    const json = (await res.json()) as { message?: string; error?: string }
    if (res.ok) { setStatus('ok'); setMsg(json.message ?? 'Subscription updated') }
    else { setStatus('error'); setMsg(json.error ?? 'Failed') }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center gap-2">
        <Crown className="size-5 text-gold" />
        <h2 className="font-semibold">Subscription Manager — Upgrade a User</h2>
      </div>
      <p className="mb-4 text-sm text-muted-foreground">
        After receiving payment via Paystack or bank transfer, use this to manually activate a user&apos;s subscription.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">User Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Plan</label>
          <select
            value={plan}
            onChange={(e) => setPlan(e.target.value as typeof plan)}
            className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20"
          >
            <option value="silver">Silver — ₦3,000/month</option>
            <option value="gold">Gold — ₦8,000/month</option>
            <option value="platinum">Platinum — ₦18,000/month</option>
            <option value="free">Free (downgrade / reset)</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Duration (days)</label>
          <input
            type="number"
            min={1}
            max={365}
            value={days}
            onChange={(e) => setDays(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20"
          />
          <p className="mt-1 text-xs text-muted-foreground">30 = monthly · 90 = quarterly · 365 = annual</p>
        </div>
        <div className="flex items-end">
          <button
            onClick={upgrade}
            disabled={!email || status === 'loading'}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-40"
          >
            {status === 'loading' && <Loader2 className="size-4 animate-spin" />}
            <UserCheck className="size-4" />
            Activate Subscription
          </button>
        </div>
      </div>
      {msg && (
        <p className={cn('mt-3 flex items-center gap-2 text-sm', status === 'ok' ? 'text-emerald-400' : 'text-red-400')}>
          {status === 'ok' ? <CheckCircle className="size-4" /> : <AlertCircle className="size-4" />}{msg}
        </p>
      )}

      <div className="mt-4 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-muted-foreground">
        <strong className="text-amber-400">Note:</strong> After upgrading, the user must sign out and back in for the new subscription to appear in their session. They can also use their dashboard to refresh their session.
      </div>
    </div>
  )
}

// ── Grant Form ─────────────────────────────────────────────────────────────

const GRANT_TYPES = ['research', 'scholarship', 'fellowship', 'project', 'seed', 'other']
const CURRENCIES = ['USD', 'EUR', 'GBP', 'NGN', 'KES', 'ZAR', 'GHS', 'ETB']
const inputCls = 'w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20'

function Field({ label, hint, col, children }: { label: string; hint?: string; col?: number; children: React.ReactNode }) {
  return (
    <div className={col === 2 ? 'sm:col-span-2' : ''}>
      <label className="mb-1.5 block text-sm font-medium">
        {label}{hint && <span className="ml-1 font-normal text-muted-foreground">({hint})</span>}
      </label>
      {children}
    </div>
  )
}

export default function AdminPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [msg, setMsg] = useState('')
  const [form, setForm] = useState({
    title: '', description: '', funder: '', amount: '', currency: 'USD',
    deadline: '', grantType: 'research', eligibility: '', categories: '',
    countries: '', region: '', applicationLink: '',
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
    } else {
      setStatus('error')
      setMsg(json.error ?? 'Failed to create grant')
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Admin Panel</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage grants, subscriptions, and platform settings.</p>
      </div>

      <AdminSetup />
      <SeedGrants />
      <SubscriptionManager />

      {/* Grant creation form */}
      <form onSubmit={submit} className="space-y-6 rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-2 border-b border-border pb-4">
          <PlusCircle className="size-5 text-gold" />
          <h2 className="font-semibold">Create a Custom Grant</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Grant title *" col={2}>
            <input required value={form.title} onChange={(e) => set('title', e.target.value)}
              placeholder="e.g. African Research Innovation Fund 2025" className={inputCls} />
          </Field>
          <Field label="Funder / Organisation *">
            <input required value={form.funder} onChange={(e) => set('funder', e.target.value)}
              placeholder="e.g. Gates Foundation" className={inputCls} />
          </Field>
          <Field label="Grant type *">
            <select required value={form.grantType} onChange={(e) => set('grantType', e.target.value)} className={inputCls}>
              {GRANT_TYPES.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
          </Field>
          <Field label="Amount *">
            <input required type="number" min={1} value={form.amount} onChange={(e) => set('amount', e.target.value)}
              placeholder="e.g. 50000" className={inputCls} />
          </Field>
          <Field label="Currency">
            <select value={form.currency} onChange={(e) => set('currency', e.target.value)} className={inputCls}>
              {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Application deadline *">
            <input required type="date" value={form.deadline} onChange={(e) => set('deadline', e.target.value)} className={inputCls} />
          </Field>
          <Field label="Description *" col={2}>
            <textarea required rows={4} value={form.description} onChange={(e) => set('description', e.target.value)}
              placeholder="Describe the grant, its purpose, and what it funds..."
              className={cn(inputCls, 'resize-none')} />
          </Field>
          <Field label="Eligibility" hint="comma-separated">
            <input value={form.eligibility} onChange={(e) => set('eligibility', e.target.value)}
              placeholder="e.g. PhD students, Postdocs" className={inputCls} />
          </Field>
          <Field label="Categories" hint="comma-separated">
            <input value={form.categories} onChange={(e) => set('categories', e.target.value)}
              placeholder="e.g. Health, Agriculture" className={inputCls} />
          </Field>
          <Field label="Countries" hint="comma-separated">
            <input value={form.countries} onChange={(e) => set('countries', e.target.value)}
              placeholder="e.g. Nigeria, Kenya, Ghana" className={inputCls} />
          </Field>
          <Field label="Region">
            <input value={form.region} onChange={(e) => set('region', e.target.value)}
              placeholder="e.g. Sub-Saharan Africa" className={inputCls} />
          </Field>
          <Field label="Application link" col={2}>
            <input type="url" value={form.applicationLink} onChange={(e) => set('applicationLink', e.target.value)}
              placeholder="https://..." className={inputCls} />
          </Field>
        </div>

        {msg && (
          <p className={cn('flex items-center gap-2 text-sm', status === 'ok' ? 'text-emerald-400' : 'text-red-400')}>
            {status === 'ok' ? <CheckCircle className="size-4" /> : <AlertCircle className="size-4" />}{msg}
          </p>
        )}

        <button type="submit" disabled={status === 'loading'}
          className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-40">
          {status === 'loading' && <Loader2 className="size-4 animate-spin" />}
          {status === 'loading' ? 'Creating…' : 'Create Grant'}
        </button>
      </form>
    </div>
  )
}
