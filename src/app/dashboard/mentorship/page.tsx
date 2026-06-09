import { GraduationCap } from 'lucide-react'

export default function MentorshipPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Mentorship</h1>
        <p className="mt-1 text-sm text-muted-foreground">Connect with experienced researchers and grant writers.</p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-24 text-center">
        <GraduationCap className="mb-4 size-12 text-muted-foreground/30" />
        <p className="font-semibold">Mentorship programme coming soon</p>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Browse mentors by field and country, request sessions, and get guidance on grant writing, research methodology, and career development.
        </p>
      </div>
    </div>
  )
}
