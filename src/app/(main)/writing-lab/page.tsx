'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Upload, CheckCircle, ArrowRight, Sparkles, FileText, Star,
  Shield, Clock, ChevronDown, ChevronUp, Zap, BookOpen, Users, Award,
  AlertCircle,
} from 'lucide-react'

// ── Data ─────────────────────────────────────────────────────────────────────

const packages = [
  {
    id: 'student',
    name: 'Student Package',
    icon: BookOpen,
    price: '₦8,000',
    priceUSD: '$5',
    turnaround: '48 hours',
    wordLimit: '5,000 words',
    color: 'border-gray-200',
    highlight: false,
    badge: null,
    features: [
      'Full humanization pass (AI → natural academic voice)',
      'Grammar & clarity editing',
      'AI-detector bypass assurance',
      'Plagiarism check report',
      'Readability score improvement',
      '1 revision included',
    ],
    bestFor: 'Final year projects, undergraduate dissertations, course assignments',
  },
  {
    id: 'researcher',
    name: 'Researcher Package',
    icon: Sparkles,
    price: '₦18,000',
    priceUSD: '$12',
    turnaround: '36 hours',
    wordLimit: '10,000 words',
    color: 'border-blue-500',
    highlight: true,
    badge: 'Most Popular',
    features: [
      'Everything in Student Package',
      'Journal-style academic voice',
      'Literature coherence check',
      'Methodology section review',
      'Abstract optimization',
      '2 revisions included',
      'Turnitin-safe guarantee',
    ],
    bestFor: 'Master\'s theses, PhD chapters, research papers, journal submissions',
  },
  {
    id: 'professor',
    name: 'Professor / Senior Researcher',
    icon: Award,
    price: '₦35,000',
    priceUSD: '$22',
    turnaround: '24 hours',
    wordLimit: '20,000 words',
    color: 'border-amber-400',
    highlight: false,
    badge: 'Premium',
    features: [
      'Everything in Researcher Package',
      'Discipline-specific vocabulary calibration',
      'Citation & reference formatting (APA/MLA/Chicago)',
      'Peer-review-ready polishing',
      'Executive summary rewrite',
      '3 revisions included',
      'Dedicated human expert assigned',
    ],
    bestFor: 'Book chapters, grant proposals, conference papers, policy documents',
  },
  {
    id: 'grant',
    name: 'Grant Proposal Package',
    icon: Zap,
    price: '₦45,000',
    priceUSD: '$28',
    turnaround: '48 hours',
    wordLimit: '15,000 words',
    color: 'border-emerald-500',
    highlight: false,
    badge: 'Revenue Driver',
    features: [
      'Everything in Professor Package',
      'Funder-aligned narrative development',
      'Budget justification writing',
      'Impact statement optimization',
      'TETFund / World Bank / NEH voice calibration',
      'Unlimited revisions for 14 days',
      'Express turnaround option available',
    ],
    bestFor: 'TETFund NRF/IBR, Commonwealth, NEH, World Bank, Gates Foundation grants',
  },
]

const workflow = [
  {
    step: '01',
    title: 'Upload Your Document',
    desc: 'Upload your AI-generated draft, thesis chapter, or research paper in PDF, DOCX, or TXT format.',
    icon: Upload,
  },
  {
    step: '02',
    title: 'Select Your Package',
    desc: 'Choose Student, Researcher, Professor, or Grant Proposal package based on your document type and deadline.',
    icon: FileText,
  },
  {
    step: '03',
    title: 'Expert Human Processing',
    desc: 'Our team of Nigerian and African academics rewrites your work into natural, detector-resistant academic prose.',
    icon: Users,
  },
  {
    step: '04',
    title: 'Receive & Review',
    desc: 'Get your humanized document with a readability report, AI detection score, and revision options within your turnaround window.',
    icon: CheckCircle,
  },
]

const beforeAfter = {
  before: '"The implementation of renewable energy solutions in sub-Saharan Africa represents a paradigm shift in the energy sector, necessitating a comprehensive evaluation of the multifaceted challenges and opportunities inherent in the deployment of such technologies within the context of developing economies."',
  after: '"Renewable energy is reshaping power access across sub-Saharan Africa — but deployment is rarely straightforward. From grid infrastructure to import costs and community adoption, the path from policy to watts on the ground is shaped by a complex web of local realities that most global frameworks fail to capture."',
}

const faqs = [
  {
    q: 'Does humanized writing mean it will pass AI detectors?',
    a: 'Yes. Our process restructures sentence patterns, inserts authentic academic voice markers, and eliminates repetitive AI syntax that tools like Turnitin AI, GPTZero, and Originality.ai flag. We provide a detection score before and after.',
  },
  {
    q: 'Is this ethical for academic submissions?',
    a: 'Our service is positioned as an editing and writing enhancement service — the same as hiring a professional editor or writing coach. We recommend transparency with your institution. For grant proposals and professional documents, no disclosure is needed.',
  },
  {
    q: 'What file formats do you accept?',
    a: 'DOCX, PDF, and TXT. For best results, submit as DOCX with your original formatting.',
  },
  {
    q: 'How is payment made?',
    a: 'Payment is via Paystack (card, bank transfer, USSD) after you select your package. Your document is processed only after payment confirmation.',
  },
  {
    q: 'What if I need faster than 24 hours?',
    a: 'Express service (12-hour turnaround) is available for Professor and Grant packages at 1.5× the standard price. Select Express during checkout.',
  },
]

// ── Page ─────────────────────────────────────────────────────────────────────

export default function WritingLabPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [showBefore, setShowBefore] = useState(true)

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-800 text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium">
                <Sparkles className="size-4 text-yellow-300" />
                Writing Lab — Humanized Academic Writing
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Turn AI Drafts Into<br />
                <span className="text-yellow-300">Authentic Academic Work</span>
              </h1>
              <p className="mt-5 text-lg text-indigo-100">
                Upload your AI-generated draft, thesis chapter, or research proposal. Our team of African academics rewrites it into natural, detector-resistant academic prose — fast and affordable.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {[
                  { icon: Shield, text: 'AI Detector Safe' },
                  { icon: Clock, text: '24–48 Hour Turnaround' },
                  { icon: Star, text: 'Nigerian Academics' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm">
                    <Icon className="size-4 text-yellow-300" />
                    {text}
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#packages"
                  className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-7 py-3.5 text-sm font-bold text-gray-900 transition-opacity hover:opacity-90">
                  View Packages <ArrowRight className="size-4" />
                </a>
                <a href="#how-it-works"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-semibold transition-colors hover:bg-white/20">
                  How It Works
                </a>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '500+', label: 'Documents Processed' },
                { value: '98%', label: 'Client Satisfaction' },
                { value: '24hr', label: 'Express Turnaround' },
                { value: '4', label: 'Specialized Packages' },
              ].map(({ value, label }) => (
                <div key={label} className="rounded-2xl border border-white/20 bg-white/10 p-5 text-center backdrop-blur-sm">
                  <div className="text-3xl font-bold text-yellow-300">{value}</div>
                  <div className="mt-1 text-sm text-indigo-200">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Before/After ── */}
      <section className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900">See the Transformation</h2>
            <p className="mt-2 text-gray-500 text-sm">Real example: AI-generated text → Humanized academic prose</p>
          </div>
          <div className="rounded-3xl border border-gray-200 bg-gray-50 p-1">
            <div className="flex rounded-2xl bg-gray-200 p-1 mb-4 w-fit mx-auto">
              <button
                onClick={() => setShowBefore(true)}
                className={`rounded-xl px-6 py-2 text-sm font-semibold transition-all ${showBefore ? 'bg-white text-gray-900 shadow' : 'text-gray-500'}`}>
                Before (AI Text)
              </button>
              <button
                onClick={() => setShowBefore(false)}
                className={`rounded-xl px-6 py-2 text-sm font-semibold transition-all ${!showBefore ? 'bg-white text-gray-900 shadow' : 'text-gray-500'}`}>
                After (Humanized)
              </button>
            </div>
            <div className={`rounded-2xl p-6 text-sm leading-relaxed ${showBefore ? 'bg-red-50 border border-red-200 text-red-900' : 'bg-emerald-50 border border-emerald-200 text-emerald-900'}`}>
              <div className={`mb-2 flex items-center gap-2 text-xs font-bold ${showBefore ? 'text-red-600' : 'text-emerald-600'}`}>
                {showBefore
                  ? <><AlertCircle className="size-4" /> AI-generated — likely detected by Turnitin AI, GPTZero</>
                  : <><CheckCircle className="size-4" /> Humanized — natural academic voice, detector-safe</>
                }
              </div>
              <p className="italic">{showBefore ? beforeAfter.before : beforeAfter.after}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-2 text-gray-500">From upload to delivery in 4 simple steps</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {workflow.map(({ step, title, desc, icon: Icon }) => (
              <div key={step} className="rounded-3xl border border-gray-200 bg-white p-6 text-center">
                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-indigo-100">
                  <Icon className="size-6 text-indigo-700" />
                </div>
                <div className="mb-2 text-xs font-bold uppercase tracking-widest text-indigo-500">{step}</div>
                <h3 className="mb-2 font-bold text-gray-900">{title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Packages ── */}
      <section id="packages" className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-gray-900">Choose Your Package</h2>
            <p className="mt-2 text-gray-500">Nigeria-friendly pricing — affordable, transparent, no hidden fees</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {packages.map(({ id, name, icon: Icon, price, priceUSD, turnaround, wordLimit, color, highlight, badge, features, bestFor }) => (
              <div key={id}
                className={`relative flex flex-col rounded-3xl border-2 p-6 transition-all ${color} ${highlight ? 'bg-blue-700 text-white shadow-2xl shadow-blue-200' : 'bg-white'}`}>
                {badge && (
                  <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-bold ${
                    badge === 'Most Popular' ? 'bg-yellow-400 text-gray-900' :
                    badge === 'Premium' ? 'bg-amber-500 text-white' :
                    'bg-emerald-500 text-white'
                  }`}>{badge}</div>
                )}
                <div className={`mb-3 flex size-11 items-center justify-center rounded-xl ${highlight ? 'bg-white/20' : 'bg-indigo-100'}`}>
                  <Icon className={`size-5 ${highlight ? 'text-white' : 'text-indigo-700'}`} />
                </div>
                <h3 className={`mb-1 font-bold ${highlight ? 'text-white' : 'text-gray-900'}`}>{name}</h3>
                <div className="mb-1 flex items-end gap-2">
                  <span className={`text-3xl font-bold ${highlight ? 'text-yellow-300' : 'text-gray-900'}`}>{price}</span>
                  <span className={`mb-1 text-sm ${highlight ? 'text-blue-200' : 'text-gray-400'}`}>{priceUSD}</span>
                </div>
                <div className={`mb-2 text-xs ${highlight ? 'text-blue-200' : 'text-gray-400'}`}>
                  {turnaround} · {wordLimit}
                </div>
                <p className={`mb-4 text-xs leading-relaxed italic ${highlight ? 'text-blue-100' : 'text-gray-500'}`}>
                  Best for: {bestFor}
                </p>
                <ul className="mb-6 flex-1 space-y-2">
                  {features.map((f) => (
                    <li key={f} className={`flex items-start gap-2 text-xs ${highlight ? 'text-blue-100' : 'text-gray-600'}`}>
                      <CheckCircle className={`mt-0.5 size-3.5 shrink-0 ${highlight ? 'text-yellow-300' : 'text-indigo-600'}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={`/dashboard/writing-lab?package=${id}`}
                  className={`block rounded-2xl py-3 text-center text-sm font-bold transition-all ${
                    highlight
                      ? 'bg-yellow-400 text-gray-900 hover:opacity-90'
                      : 'border-2 border-indigo-700 text-indigo-700 hover:bg-indigo-50'
                  }`}>
                  Get Started <ArrowRight className="inline size-4" />
                </Link>
              </div>
            ))}
          </div>

          {/* Express note */}
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-center text-sm text-amber-800">
            <Zap className="inline size-4 mr-1 text-amber-600" />
            <strong>Express service available:</strong> Need it in 12 hours? Express option is available on Professor and Grant packages at 1.5× standard price. Select during checkout.
          </div>
        </div>
      </section>

      {/* ── Target audience ── */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-gray-900">Who Uses the Writing Lab?</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'PhD & Master\'s Students',
                desc: 'Struggling to make ChatGPT-assisted chapters sound authentic for submission? Our researchers rewrite at publication quality.',
                icon: '🎓',
              },
              {
                title: 'University Lecturers',
                desc: 'Preparing a TETFund NRF proposal or IBR submission? Our grant voice calibration maximizes approval rates.',
                icon: '👨‍🏫',
              },
              {
                title: 'Independent Researchers',
                desc: 'Publish-ready papers without a university writing centre. We make your work sound like it belongs in any international journal.',
                icon: '🔬',
              },
              {
                title: 'NGO & Development Workers',
                desc: 'Impact reports, concept notes, and donor proposals that speak to international funders — World Bank, Gates, EU.',
                icon: '🌍',
              },
              {
                title: 'Faith Leaders & Ministry Staff',
                desc: 'Grant proposals for faith-based organizations and church projects written in compelling, funder-appropriate language.',
                icon: '⛪',
              },
              {
                title: 'Business & Startup Founders',
                desc: 'White papers, feasibility studies, and investor documents that read like they came from a top consulting firm.',
                icon: '💼',
              },
            ].map(({ title, desc, icon }) => (
              <div key={title} className="rounded-3xl border border-gray-200 bg-white p-6">
                <div className="mb-3 text-3xl">{icon}</div>
                <h3 className="mb-2 font-bold text-gray-900">{title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map(({ q, a }, i) => (
              <div key={i} className="rounded-2xl border border-gray-200">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold text-gray-900">
                  {q}
                  {openFaq === i ? <ChevronUp className="size-4 text-gray-400 shrink-0" /> : <ChevronDown className="size-4 text-gray-400 shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="border-t border-gray-100 px-5 py-4 text-sm leading-relaxed text-gray-600">
                    {a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-indigo-700 py-14">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-3xl font-bold text-white">Ready to transform your writing?</h2>
          <p className="mt-3 text-indigo-100">Upload your document and get a humanized, detector-resistant version back within 48 hours.</p>
          <Link href="/dashboard/writing-lab"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-yellow-400 px-8 py-3.5 text-sm font-bold text-gray-900 transition-opacity hover:opacity-90">
            Upload Your Document <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
