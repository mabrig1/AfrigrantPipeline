'use client'

import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
} from 'lucide-react'

export default function CreatorResetV2Page() {
  const router = useRouter()
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    const match = window.location.hash.match(/(?:^#|&)token=([^&]+)/)
    if (match?.[1]) {
      setToken(decodeURIComponent(match[1]))
      window.history.replaceState(null, '', window.location.pathname)
    }
  }, [])

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setDone(false)

    if (!token) {
      setError('This reset link is missing its one-time token. Open the full reset link again.')
      return
    }

    const form = new FormData(e.currentTarget)
    const email = String(form.get('email') || '').toLowerCase().trim()
    const password = String(form.get('password') || '')
    const confirm = String(form.get('confirm') || '')

    if (password !== confirm) {
      setError('The passwords do not match.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/admin/creator-reset-v2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ email, token, password, confirm }),
      })

      const json = (await res.json()) as { error?: string; message?: string }

      if (!res.ok) {
        setError(json.error || 'Password reset failed.')
        return
      }

      setDone(true)
      window.setTimeout(() => {
        router.push('/login?passwordReset=1&callbackUrl=%2Fadmin')
        router.refresh()
      }, 1000)
    } catch (err) {
      setError(
        err instanceof Error
          ? `Network error: ${err.message}`
          : 'Network error. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  const inputCls =
    'w-full rounded-lg border border-border bg-surface-2 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20'

  return (
    <div className="animate-fade-up">
      <div className="mb-6 flex size-11 items-center justify-center rounded-xl bg-gold/10 text-gold">
        <KeyRound className="size-5" />
      </div>

      <h1 className="mb-1 text-2xl font-extrabold tracking-tight">
        Reset creator password
      </h1>
      <p className="mb-7 text-sm leading-relaxed text-muted-foreground">
        Secure fallback access for the AfriGrant creator account.
      </p>

      {token && !done && (
        <div className="mb-5 flex items-start gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
          One-time reset token loaded. Choose a new password.
        </div>
      )}

      {error && (
        <div className="mb-5 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {done && (
        <div className="mb-5 flex items-start gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
          Password reset successfully. Redirecting to sign in…
        </div>
      )}

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
            Creator email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            required
            defaultValue="mabrig1@gmail.com"
            className={inputCls}
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
            New password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              minLength={12}
              placeholder="12+ characters"
              className={`${inputCls} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="confirm" className="mb-1.5 block text-sm font-medium">
            Confirm new password
          </label>
          <div className="relative">
            <input
              id="confirm"
              name="confirm"
              type={showConfirm ? 'text' : 'password'}
              autoComplete="new-password"
              required
              minLength={12}
              placeholder="Repeat the new password"
              className={`${inputCls} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            Use uppercase, lowercase, a number, and a symbol.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || done || !token}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          {loading && <Loader2 className="size-4 animate-spin" />}
          {loading ? 'Resetting password…' : 'Reset creator password'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        <Link href="/login" className="font-medium text-gold hover:underline">
          Return to sign in
        </Link>
      </div>
    </div>
  )
}
