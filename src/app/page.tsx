import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        <h1 className="text-5xl font-bold text-green-800 mb-4">AfrigrantPipeline</h1>
        <p className="text-xl text-green-700 mb-8">
          Streamlining grant discovery and application management for African organizations.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-6 py-3 bg-green-700 text-white rounded-lg font-semibold hover:bg-green-800 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-6 py-3 border-2 border-green-700 text-green-700 rounded-lg font-semibold hover:bg-green-50 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </main>
  )
}
