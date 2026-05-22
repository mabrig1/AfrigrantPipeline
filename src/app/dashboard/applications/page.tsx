import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { connectDB } from '@/lib/mongodb'
import Application from '@/models/Application'

const statusColors: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700',
  submitted: 'bg-blue-100 text-blue-700',
  under_review: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
}

export default async function ApplicationsPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  await connectDB()
  const userId = (session.user as { id?: string }).id
  const applications = await Application.find({ applicant: userId })
    .populate('grant', 'title funder deadline')
    .sort({ createdAt: -1 })
    .lean()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl font-bold text-green-800">My Applications</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-8">
        {applications.length === 0 ? (
          <p className="text-gray-500">You have not submitted any applications yet.</p>
        ) : (
          <div className="grid gap-4">
            {applications.map((app) => {
              const grant = app.grant as { title?: string; funder?: string }
              return (
                <div key={app._id.toString()} className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{app.projectTitle}</h3>
                      <p className="text-sm text-gray-500">{grant?.title} — {grant?.funder}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[app.status] || ''}`}>
                      {app.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
