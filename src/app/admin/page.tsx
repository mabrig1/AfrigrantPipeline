'use client'

import { useState } from 'react'
import { Shield, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

function AdminSetup() {
  const [secret, setSecret] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [msg, setMsg] = useState('')

  async function activate() {
    if (!secret.trim()) return

    setStatus('loading')
    setMsg('')

    try {
      const res = await fetch('/api/admin/make-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ secret }),
      })

      const json = await res.json()

      if (res.ok) {
        setStatus('ok')
        setMsg(json.message ?? 'You are now admin. Refresh the page.')
        setSecret('')
      } else {
        setStatus('error')
        setMsg(json.error ?? 'Failed to activate admin role.')
      }
    } catch {
      setStatus('error')
      setMsg('Network error. Check your connection and try again.')
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center gap-2">
        <Shield className="size-5 text-gold" />
        <h2 className="font-semibold">Step 1: Activate admin role</h2>
      </div>

      <p className="mb-4 text-sm text-muted-foreground">
        Enter your{' '}
        <code className="rounded bg-surface-2 px-1 py-0.5 text-xs">
          ADMIN_SETUP_SECRET
        </code>{' '}
        to upgrade your account to admin.
      </p>

      <div className="flex gap-2">
        <input
          type="password"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') activate()
          }}
          placeholder="Paste your ADMIN_SETUP_SECRET"
          autoComplete="off"
          className="flex-1 rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20"
        />

        <button
          onClick={activate}
          disabled={!secret.trim() || status === 'loading' || status === 'ok'}
          className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-40"
        >
          {status === 'loading' && <Loader2 className="size-4 animate-spin" />}
          {status === 'ok' ? 'Done!' : 'Activate'}
        </button>
      </div>

      {msg && (
        <p
          className={cn(
            'mt-3 flex items-center gap-2 text-sm',
            status === 'ok' ? 'text-emerald-400' : 'text-red-400',
          )}
        >
          {status === 'ok' ? (
            <CheckCircle className="size-4" />
          ) : (
            <AlertCircle className="size-4" />
          )}
          {msg}
        </p>
      )}
    </div>
  )
}

export default function AdminPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Admin Panel</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage grants, subscriptions, and platform settings.
        </p>
      </div>

      <AdminSetup />
    </div>
  )
}
