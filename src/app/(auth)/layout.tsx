import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

const bullets = [
  'Discover 500+ active grants across Africa',
  'Publish and review research open-access',
  'Find collaborators and mentors continent-wide',
]

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1fr]">
      {/* ── Brand panel (desktop only) ── */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-surface-1 p-10 lg:flex">
        {/* Background glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 20% 110%, hsl(42 87% 55% / 0.12) 0%, transparent 60%)',
          }}
        />

        {/* Logo */}
        <Link
          href="/"
          className="relative z-10 inline-flex items-center gap-1.5 text-xl font-extrabold tracking-tight transition-opacity hover:opacity-80"
        >
          Afri<span className="text-gold">grant</span>Pipeline
        </Link>

        {/* Middle copy */}
        <div className="relative z-10">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gold">
            Africa&apos;s Research Infrastructure
          </p>
          <h2 className="mb-8 max-w-sm text-3xl font-extrabold leading-snug tracking-tight">
            Where African research meets the funding it deserves
          </h2>
          <ul className="space-y-4">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-3 text-sm text-muted-foreground">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-gold" />
                {b}
              </li>
            ))}
          </ul>
        </div>

        {/* Footer note */}
        <p className="relative z-10 text-xs text-muted-foreground/60">
          © {new Date().getFullYear()} AfrigrantPipeline — Built for Africa, by Africa
        </p>
      </aside>

      {/* ── Form panel ── */}
      <main className="flex flex-col items-center justify-center bg-background px-4 py-12">
        {/* Mobile logo */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-lg font-extrabold tracking-tight lg:hidden"
        >
          Afri<span className="text-gold">grant</span>Pipeline
        </Link>

        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  )
}
