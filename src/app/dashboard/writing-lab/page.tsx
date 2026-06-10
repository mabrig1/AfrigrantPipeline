'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Upload, FileText, CheckCircle, Clock, Sparkles, AlertCircle, ArrowRight } from 'lucide-react'

const PACKAGES = [
  { id: 'student', name: 'Student Package', price: '₦8,000', turnaround: '48 hrs', wordLimit: '5,000 words' },
  { id: 'researcher', name: 'Researcher Package', price: '₦18,000', turnaround: '36 hrs', wordLimit: '10,000 words' },
  { id: 'professor', name: 'Professor / Senior', price: '₦35,000', turnaround: '24 hrs', wordLimit: '20,000 words' },
  { id: 'grant', name: 'Grant Proposal', price: '₦45,000', turnaround: '48 hrs', wordLimit: '15,000 words' },
]

// Mock orders for the dashboard — replace with real DB query
const MOCK_ORDERS = [
  { id: 'WL001', title: 'Chapter 3 — Research Methodology', package: 'Researcher Package', status: 'Delivered', date: 'Jun 5, 2026', words: '4,200' },
  { id: 'WL002', title: 'TETFund NRF Proposal — STEM Education', package: 'Grant Proposal', status: 'In Progress', date: 'Jun 8, 2026', words: '8,500' },
]

const STATUS_STYLES: Record<string, string> = {
  Delivered: 'bg-emerald-100 text-emerald-700',
  'In Progress': 'bg-blue-100 text-blue-700',
  'Under Review': 'bg-amber-100 text-amber-700',
  Submitted: 'bg-gray-100 text-gray-600',
}

export default function DashboardWritingLabPage() {
  const [selectedPackage, setSelectedPackage] = useState('researcher')
  const [docTitle, setDocTitle] = useState('')
  const [docType, setDocType] = useState('')
  const [notes, setNotes] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // TODO: POST to /api/writing-lab/submit — create order record, notify admin
    setSubmitted(true)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Writing Lab</h1>
        <p className="mt-1 text-sm text-muted-foreground">Submit documents for humanization, editing, and AI-detector bypass.</p>
      </div>

      {/* My orders */}
      {MOCK_ORDERS.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">My Orders</h2>
          <div className="space-y-3">
            {MOCK_ORDERS.map((o) => (
              <div key={o.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <FileText className="size-4 text-muted-foreground" />
                    <span className="text-sm font-semibold">{o.title}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{o.package} · {o.words} words · {o.date}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[o.status] ?? 'bg-gray-100 text-gray-500'}`}>
                  {o.status}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* New submission form */}
      <section className="rounded-xl border border-border bg-card p-6">
        <div className="mb-5 flex items-center gap-2">
          <Sparkles className="size-5 text-gold" />
          <h2 className="font-semibold">Submit a New Document</h2>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <CheckCircle className="size-12 text-emerald-400" />
            <h3 className="font-bold text-lg">Order Received!</h3>
            <p className="text-sm text-muted-foreground max-w-sm">Your request has been submitted. Our team will contact you within 2 hours to confirm payment and begin processing.</p>
            <button onClick={() => { setSubmitted(false); setDocTitle(''); setNotes('') }}
              className="mt-2 rounded-lg border border-border px-5 py-2 text-sm font-medium hover:bg-surface-2">
              Submit Another Document
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Package selector */}
            <div>
              <label className="mb-2 block text-sm font-medium">Select Package</label>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {PACKAGES.map((pkg) => (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => setSelectedPackage(pkg.id)}
                    className={`rounded-xl border p-3 text-left transition-all ${
                      selectedPackage === pkg.id
                        ? 'border-gold bg-gold/10 ring-2 ring-gold/30'
                        : 'border-border bg-surface-2 hover:border-gold/30'
                    }`}>
                    <div className="text-sm font-bold">{pkg.name}</div>
                    <div className="text-gold font-semibold text-sm mt-0.5">{pkg.price}</div>
                    <div className="text-xs text-muted-foreground mt-0.5"><Clock className="inline size-3 mr-0.5" />{pkg.turnaround} · {pkg.wordLimit}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Document Title *</label>
                <input
                  required
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="e.g. Chapter 3 — Research Methodology"
                  className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Document Type *</label>
                <select
                  required
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20">
                  <option value="">Select type…</option>
                  <option>Thesis Chapter</option>
                  <option>Full Dissertation</option>
                  <option>Research Paper</option>
                  <option>Grant Proposal</option>
                  <option>Literature Review</option>
                  <option>Research Report</option>
                  <option>Conference Paper</option>
                  <option>Book Chapter</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            {/* File upload placeholder */}
            <div>
              <label className="mb-1.5 block text-sm font-medium">Upload Document</label>
              {/* TODO: Integrate Cloudinary or UploadThing for file upload */}
              <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-surface-2 px-6 py-8 text-center">
                <Upload className="mx-auto mb-2 size-8 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">DOCX, PDF, or TXT · Max 25MB</p>
                <p className="mt-1 text-xs text-muted-foreground/60">File upload coming soon — for now, paste your document text below or email to kmabrig@gmail.com</p>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">Instructions / Notes</label>
              <textarea
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any specific instructions? Deadline? Target journal? Paste document text here if not uploading a file…"
                className="w-full resize-none rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20"
              />
            </div>

            <div className="flex items-start gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
              <AlertCircle className="size-4 shrink-0 text-amber-400 mt-0.5" />
              <p className="text-xs text-muted-foreground">
                Payment is collected after order confirmation. You&apos;ll receive a WhatsApp/email quote within 2 hours. Payment via <strong>Paystack</strong> (card, bank transfer, USSD).
              </p>
            </div>

            <button
              type="submit"
              disabled={!docTitle || !docType}
              className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed">
              <Upload className="size-4" />
              Submit for Processing
            </button>
          </form>
        )}
      </section>

      {/* Link to full writing lab */}
      <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between gap-4">
        <div>
          <div className="font-semibold text-sm">Full Writing Lab Details</div>
          <div className="text-xs text-muted-foreground mt-0.5">See all packages, before/after examples, and FAQs</div>
        </div>
        <Link href="/writing-lab" className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-surface-2 shrink-0">
          Writing Lab Page <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  )
}
