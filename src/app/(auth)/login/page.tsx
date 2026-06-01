'use client'

import { useState, useEffect, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'

// ── Google Icon ───────────────────────────────────────────────────────────────

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

// ── Error messages from NextAuth ──────────────────────────────────────────────

const AUTH_ERRORS: Record<string, string> = {
  CredentialsSignin: 'Invalid email or password.',
  OAuthAccountNotLinked: 'This email is already registered with a different sign-in method.',
  OAuthSignin: 'Could not sign in with Google. Please try again.',
  Default: 'Something went wrong. Please try again.',
}

// ── Page ──────────────────────────────────────────────────────────────────────

function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()

  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formError, setFormError] = useState('')

  // Error forwarded by NextAuth via ?error= query param
  const urlError = params.get('error')
  const errorMessage = urlError ? (AUTH_ERRORS[urlError] ?? AUTH_ERRORS.Default) : ''

  // Success banner when arriving from signup
  const registered = params.get('registered') === '1'

  // Clear form error when user starts typing again
  useEffect(() => {
    if (formError) setFormError('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Credentials submit ──────────────────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormError('')
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const result = await signIn('credentials', {
      email: (form.get('email') as string).toLowerCase().trim(),
      password: form.get('password'),
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setFormError('Invalid email or password.')
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  // ── Google OAuth ────────────────────────────────────────────────────────────

  async function handleGoogle() {
    setGoogleLoading(true)
    await signIn('google', { callbackUrl: '/dashboard' })
  }

  // ── Shared input class ──────────────────────────────────────────────────────

  const inputCls =
    'w-full rounded-lg border border-border bg-surface-2 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 transition-colors focus:border-gold/50 focus:bg-surface-3 focus:outline-none focus:ring-2 focus:ring-gold/20'

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="animate-fade-up">
      <h1 className="mb-1 text-2xl font-extrabold tracking-tight">Welcome back</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Sign in to your AfrigrantPipeline account
      </p>

      {/* Registered success banner */}
      {registered && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
          Account created! Sign in below to get started.
        </div>
      )}

      {/* URL error banner (from NextAuth redirect) */}
      {errorMessage && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          {errorMessage}
        </div>
      )}

      {/* Google OAuth */}
      <button
        type="button"
        onClick={handleGoogle}
        disabled={googleLoading || loading}
        className="mb-6 flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-surface-3 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {googleLoading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <GoogleIcon />
        )}
        Continue with Google
      </button>

      {/* Divider */}
      <div className="relative mb-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">or</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Credentials form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@institution.ac"
            className={inputCls}
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-muted-foreground transition-colors hover:text-gold"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              placeholder="••••••••"
              className={`${inputCls} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        {/* Form-level error */}
        {formError && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="size-3.5 shrink-0" />
            {formError}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || googleLoading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading && <Loader2 className="size-4 animate-spin" />}
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="font-medium text-gold transition-opacity hover:opacity-80">
          Create one free
        </Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
