import { Users } from 'lucide-react'

export default function CollaboratePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Collaborate</h1>
        <p className="mt-1 text-sm text-muted-foreground">Find and connect with research partners across Africa.</p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-24 text-center">
        <Users className="mb-4 size-12 text-muted-foreground/30" />
        <p className="font-semibold">Collaboration hub coming soon</p>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Post collaboration requests, browse open research projects, and connect with institutions, NGOs, and researchers across the continent.
        </p>
      </div>
    </div>
  )
}
