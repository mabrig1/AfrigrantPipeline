'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  GraduationCap,
  FlaskConical,
  BookOpen,
  Building2,
} from 'lucide-react'
import { authApi } from '@/lib/api'

// ── Role options ──────────────────────────────────────────────────────────────

type SignupRole = 'student' | 'researcher' | 'lecturer' | 'institution'

const roles: { value: SignupRole; label: string; description: string; icon: React.ElementType }[] =
  [
    {
      value: 'student',
      label: 'Student',
      description: 'Undergraduate or postgraduate student',
      icon: GraduationCap,
    },
    {
      value: 'researcher',
      label: 'Researcher',
      description: 'Independent or affiliated researcher',
      icon: FlaskConical,
    },
    {
      value: 'lecturer',
      label: 'Lecturer',
      description: 'Academic faculty member',
      icon: BookOpen,
    },
    {
      value: 'institution',
      label: 'Institution',
      description: 'University, NGO, or organization',
      icon: Building2,
    },
  ]

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

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SignupPage() {
  const router = useRouter()

  const [selectedRole, setSelectedRole] = useState<SignupRole>('researcher')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  // ── Validation ──────────────────────────────────────────────────────────────

  function validate(data: {
    name: string
    email: string
    password: string
    confirm: string
  }): boolean {
    const errs: Record<string, string> = {}

    if (data.name.trim().length < 2) errs.name = 'Full name must be at least 2 characters.'
    if (!/^\S+@\S+\.\S+$/.test(data.email)) errs.email = 'Please enter a valid email address.'
    if (data.password.length < 8) errs.password = 'Password must be at least 8 characters.'
    if (data.password !== data.confirm) errs.confirm = 'Passwords do not match.'

    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  // ── Submit ──────────────────────────────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    const form = new FormData(e.currentTarget)
    const name = (form.get('name') as string).trim()
    const email = (form.get('email') as string).toLowerCase().trim()
    const organization = (form.get('organization') as string).trim()
    const password = form.get('password') as string
    const confirm = form.get('confirm') as string

    if (!validate({ name, email, password, confirm })) return

    setLoading(true)

    const { error: apiError } = await authApi.register({
      name,
      email,
      password,
      organization: organization || undefined,
      role: selectedRole,
    })

    if (apiError) {
      setLoading(false)
      setError(apiError)
      return
    }

    // Auto-sign-in after successful registration
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      // Registration succeeded but auto-login failed — send to login
      router.push('/login?registered=1')
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

  // ── Shared styles ───────────────────────────────────────────────────────────

  const inputCls = (field: string) =>
    [
      'w-full rounded-lg border bg-surface-2 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 transition-colors focus:bg-surface-3 focus:outline-none focus:ring-2',
      fieldErrors[field]
        ? 'border-destructive/70 focus:border-destructive/70 focus:ring-destructive/20'
        : 'border-border focus:border-gold/50 focus:ring-gold/20',
    ].join(' ')

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="animate-fade-up">
      <h1 className="mb-1 text-2xl font-extrabold tracking-tight">Create your account</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Join thousands of African researchers and funders
      </p>

      {/* Global error */}
      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Google OAuth */}
      <button
        type="button"
        onClick={handleGoogle}
        disabled={googleLoading || loading}
        className="mb-6 flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-surface-3 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {googleLoading ? <Loader2 className="size-4 animate-spin" /> : <GoogleIcon />}
        Continue with Google
      </button>

      {/* Divider */}
      <div className="relative mb-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">or</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* ── Role picker ── */}
        <fieldset>
          <legend className="mb-2.5 text-sm font-medium">I am a…</legend>
          <div className="grid grid-cols-2 gap-2.5">
            {roles.map(({ value, label, description, icon: Icon }) => {
              const active = selectedRole === value
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSelectedRole(value)}
                  className={[
                    'flex items-start gap-3 rounded-lg border p-3 text-left transition-all',
                    active
                      ? 'border-gold/50 bg-gold/10 ring-1 ring-gold/30'
                      : 'border-border bg-surface-2 hover:border-border/80 hover:bg-surface-3',
                  ].join(' ')}
                >
                  <div
                    className={[
                      'mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md',
                      active ? 'bg-gold/20' : 'bg-surface-3',
                    ].join(' ')}
                  >
                    <Icon className={['size-4', active ? 'text-gold' : 'text-muted-foreground'].join(' ')} />
                  </div>
                  <div>
                    <p className={['text-xs font-semibold', active ? 'text-foreground' : 'text-foreground/80'].join(' ')}>
                      {label}
                    </p>
                    <p className="text-[11px] leading-tight text-muted-foreground">{description}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </fieldset>

        {/* ── Full name ── */}
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
            Full name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            placeholder="Dr. Amina Diallo"
            className={inputCls('name')}
          />
          {fieldErrors.name && (
            <p className="mt-1.5 text-xs text-destructive">{fieldErrors.name}</p>
          )}
        </div>

        {/* ── Email ── */}
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
            className={inputCls('email')}
          />
          {fieldErrors.email && (
            <p className="mt-1.5 text-xs text-destructive">{fieldErrors.email}</p>
          )}
        </div>

        {/* ── Institution (optional) ── */}
        <div>
          <label htmlFor="organization" className="mb-1.5 block text-sm font-medium">
            Institution{' '}
            <span className="font-normal text-muted-foreground">(optional)</span>
          </label>
          <input
            id="organization"
            name="organization"
            type="text"
            autoComplete="organization"
            placeholder="University of Nairobi"
            className={inputCls('organization')}
          />
        </div>

        {/* ── Password ── */}
        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              minLength={8}
              placeholder="At least 8 characters"
              className={`${inputCls('password')} pr-10`}
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
          {fieldErrors.password && (
            <p className="mt-1.5 text-xs text-destructive">{fieldErrors.password}</p>
          )}
        </div>

        {/* ── Confirm password ── */}
        <div>
          <label htmlFor="confirm" className="mb-1.5 block text-sm font-medium">
            Confirm password
          </label>
          <div className="relative">
            <input
              id="confirm"
              name="confirm"
              type={showConfirm ? 'text' : 'password'}
              autoComplete="new-password"
              required
              placeholder="Repeat your password"
              className={`${inputCls('confirm')} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            >
              {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {fieldErrors.confirm && (
            <p className="mt-1.5 text-xs text-destructive">{fieldErrors.confirm}</p>
          )}
        </div>

        {/* ── Terms ── */}
        <div className="flex items-start gap-2.5">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            required
            className="mt-0.5 size-4 shrink-0 cursor-pointer accent-gold"
          />
          <label htmlFor="terms" className="text-xs leading-relaxed text-muted-foreground">
            I agree to the{' '}
            <Link href="/terms" className="text-gold hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-gold hover:underline">
              Privacy Policy
            </Link>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading || googleLoading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading && <Loader2 className="size-4 animate-spin" />}
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-gold transition-opacity hover:opacity-80">
          Sign in
        </Link>
      </p>
    </div>
  )
}
