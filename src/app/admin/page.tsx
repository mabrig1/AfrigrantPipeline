'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Shield, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

function AdminSetup() {
  const router = useRouter()
  const { data: session, status: sessionStatus, update } = useSession()
  const [secret, setSecret] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [msg, setMsg] = useState('')

  const alreadyAdmin = session?.user?.role === 'admin'

  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      router.replace('/login?callbackUrl=%2Fadmin')
    }
  }, [router, sessionStatus])

  async function activate() {
    if (sessionStatus !== 'authenticated') {
      router.replace('/login?callbackUrl=%2Fadmin')
      return
    }

    setStatus('loading')
    setMsg('')

    try {
      const res = await fetch('/api/admin/make-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ secret: secret.trim() || undefined }),
      })

      const json = await res.json()

      if (res.status === 401) {
        router.replace('/login?callbackUrl=%2Fadmin')
        return
      }

      if (res.ok) {
        // Refresh the JWT from MongoDB. The auth callback ignores any client-
        // supplied role and reloads the server-side privileges instead.
        await update()
        setStatus('ok')
        setMsg(json.message ?? 'Admin access activated.')
        setSecret('')
        router.refresh()
      } else {
        setStatus('error')
        setMsg(json.error ?? 'Failed to activate admin role.')
      }
    } catch {
      setStatus('error')
      setMsg('Network error. Check your connection and try again.')
    }
  }

  if (sessionStatus === 'loading' || sessionStatus === 'unauthenticated') {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Loader2 className="size-5 animate-spin text-gold" />
          {sessionStatus === 'loading'
            ? 'Checking your account session…'
            : 'Redirecting you to sign in…'}
        </div>
      </div>
    )
  }

  if (alreadyAdmin) {
    return (
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-6">
        <div className="flex items-center gap-2 text-emerald-400">
          <CheckCircle className="size-5" />
          <h2 className="font-semibold">Creator premium access active</h2>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {session.user.email} has administrator access. You can use the protected admin tools and grant intelligence controls.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center gap-2">
        <Shield className="size-5 text-gold" />
        <h2 className="font-semibold">Activate creator premium access</h2>
      </div>

      <p className="mb-4 text-sm text-muted-foreground">
        Sign in with Google using your verified owner email to activate directly. For any other account, enter the{' '}
        <code className="rounded bg-surface-2 px-1 py-0.5 text-xs">
          ADMIN_SETUP_SECRET
        </code>{' '}
        configured in the deployed environment.
      </p>

      <p className="mb-3 text-xs text-muted-foreground">
        Signed in as <span className="font-medium text-foreground">{session?.user?.email}</span>
      </p>

      <div className="flex gap-2">
        <input
          type="password"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') activate()
          }}
          placeholder="Optional for an authorized owner account"
          autoComplete="off"
          className="flex-1 rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20"
        />

        <button
          onClick={activate}
          disabled={status === 'loading' || status === 'ok'}
          className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-40"
        >
          {status === 'loading' && <Loader2 className="size-4 animate-spin" />}
          {status === 'ok' ? 'Done!' : 'Activate'}
        </button>
      </div>

      {msg && (
        <p
          className={cn(
            'mt-3 flex items-start gap-2 text-sm',
            status === 'ok' ? 'text-emerald-400' : 'text-red-400',
          )}
        >
          {status === 'ok' ? (
            <CheckCircle className="mt-0.5 size-4 shrink-0" />
          ) : (
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
          )}
          {msg}
        </p>
      )}
    </div>
  )
}

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-5 py-12">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Creator access</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage consultancy clients, grant searches, documents and project delivery. Creator access has no recurring charge.
        </p>
      </div>

      <AdminSetup />
      <Link href="/dashboard/consultancy" className="inline-flex rounded-xl bg-gold px-6 py-3 font-bold text-black">Open consultancy desk</Link>
    </div>
  )
}
