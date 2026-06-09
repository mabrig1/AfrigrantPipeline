import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { connectDB } from '@/lib/mongodb'
import Application from '@/models/Application'
import { cn } from '@/lib/utils'
import { FileText } from 'lucide-react'
import type { ApplicationStatus } from '@/types/database'

const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  draft:        { label: 'Draft',        cls: 'bg-muted/40 text-muted-foreground border-border' },
  submitted:    { label: 'Submitted',    cls: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  under_review: { label: 'Under Review', cls: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  approved:     { label: 'Approved',     cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  rejected:     { label: 'Rejected',     cls: 'bg-red-500/10 text-red-400 border-red-500/20' },
}

export default async function ApplicationsPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  await connectDB()
  const applications = await Application.find({ applicant: session.user.id })
    .populate('grant', 'title funder deadline')
    .sort({ createdAt: -1 })
    .lean()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">My Applications</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {applications.length} application{applications.length !== 1 ? 's' : ''} submitted
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20 text-center">
          <FileText className="mb-3 size-10 text-muted-foreground/30" />
          <p className="font-medium">No applications yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Browse grants and submit your first application.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {applications.map((app) => {
            const grant = app.grant as { title?: string; funder?: string } | null
            const config = STATUS_CONFIG[app.status as ApplicationStatus] ?? STATUS_CONFIG.draft
            return (
              <div
                key={app._id.toString()}
                className="flex items-center justify-between rounded-xl border border-border bg-card p-5"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold">{app.projectTitle}</p>
                  <p className="mt-0.5 truncate text-sm text-muted-foreground">
                    {grant?.title ?? 'Unknown grant'} — {grant?.funder ?? ''}
                  </p>
                </div>
                <span className={cn(
                  'ml-4 shrink-0 rounded-full border px-3 py-1 text-xs font-medium',
                  config.cls,
                )}>
                  {config.label}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
