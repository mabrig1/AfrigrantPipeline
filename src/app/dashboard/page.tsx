import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-green-800">AfrigrantPipeline</h1>
          <span className="text-sm text-gray-600">{session.user.name}</span>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardCard title="Available Grants" value="—" href="/dashboard/grants" />
          <DashboardCard title="My Applications" value="—" href="/dashboard/applications" />
          <DashboardCard title="AI Assist" value="Write Smarter" href="/dashboard/ai-assist" />
        </div>
      </main>
    </div>
  )
}

function DashboardCard({ title, value, href }: { title: string; value: string; href: string }) {
  return (
    <a
      href={href}
      className="block bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
    >
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </a>
  )
}
