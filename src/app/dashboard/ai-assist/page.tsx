'use client'

import { useState } from 'react'

export default function AIAssistPage() {
  const [prompt, setPrompt] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!prompt.trim()) return
    setLoading(true)
    setResult('')
    const res = await fetch('/api/ai/assist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    })
    const data = await res.json()
    setResult(data.result || data.error || 'No response')
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-xl font-bold text-green-800">AI Grant Assistant</h1>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-8">
        <p className="text-gray-600 mb-6">
          Get AI-powered help writing and improving your grant applications.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="E.g. Write an executive summary for a youth education grant in Nigeria..."
            rows={5}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
          />
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="px-6 py-2 bg-green-700 text-white rounded-lg font-semibold hover:bg-green-800 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Generating...' : 'Generate'}
          </button>
        </form>
        {result && (
          <div className="mt-6 bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-gray-500 mb-2">AI Response</h2>
            <p className="text-gray-800 whitespace-pre-wrap">{result}</p>
          </div>
        )}
      </main>
    </div>
  )
}
