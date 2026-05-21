import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { connectDB } from '@/lib/db'
import Grant from '@/models/Grant'
import { format } from 'date-fns'

export default async function GrantsPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  await connectDB()
  const grants = await Grant.find({ status: 'open' }).sort({ deadline: 1 }).lean()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl font-bold text-green-800">Available Grants</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-8">
        {grants.length === 0 ? (
          <p className="text-gray-500">No open grants available at the moment.</p>
        ) : (
          <div className="grid gap-4">
            {grants.map((grant) => (
              <div key={grant._id.toString()} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{grant.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{grant.funder}</p>
                    <p className="text-gray-700 mt-2 line-clamp-2">{grant.description}</p>
                  </div>
                  <div className="text-right ml-4 shrink-0">
                    <p className="text-lg font-bold text-green-700">
                      {grant.currency} {grant.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      Due: {format(new Date(grant.deadline), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
