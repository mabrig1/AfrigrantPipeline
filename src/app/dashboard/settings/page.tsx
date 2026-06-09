import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Settings } from 'lucide-react'

export default async function SettingsPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your account and preferences.</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-sm font-bold text-gold">
            {session.user.name?.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase() ?? '?'}
          </div>
          <div>
            <p className="font-semibold">{session.user.name}</p>
            <p className="text-sm text-muted-foreground">{session.user.email}</p>
          </div>
        </div>
        <div className="mt-6 flex flex-col items-center gap-3 rounded-lg border border-dashed border-border py-10 text-center">
          <Settings className="size-8 text-muted-foreground/30" />
          <p className="font-medium">Profile settings coming soon</p>
          <p className="text-sm text-muted-foreground">
            Update your name, avatar, institution, and research interests here.
          </p>
        </div>
      </div>
    </div>
  )
}
