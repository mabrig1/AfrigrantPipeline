import Link from 'next/link'
import { CheckCircle, X, ArrowRight, Star, Sparkles, Shield } from 'lucide-react'

const tiers = [
  {
    name: 'Silver',
    price: '₦3,000',
    period: '/month',
    tagline: 'Personalized matching and weekly grant intelligence',
    color: 'border-gray-200 bg-white',
    cta: 'Start Silver',
    ctaStyle: 'border border-blue-700 text-blue-700 hover:bg-blue-50',
    href: '/signup?plan=silver',
    icon: Star,
    features: [
      { label: 'Full grant database access', included: true },
      { label: 'AI-powered grant matching', included: true },
      { label: 'Unlimited saved opportunities', included: true },
      { label: 'Weekly curated newsletter', included: true },
      { label: 'Deadline reminders & alerts', included: true },
      { label: 'Business grants access', included: true },
      { label: 'Proposal review', included: false },
      { label: 'Live webinars', included: false },
      { label: 'Priority support', included: false },
      { label: 'Grant concierge', included: false },
    ],
  },
  {
    name: 'Gold',
    price: '₦8,000',
    period: '/month',
    tagline: 'Premium database, proposal support, and live coaching',
    color: 'border-blue-500 bg-blue-700 text-white',
    cta: 'Start Gold',
    ctaStyle: 'bg-yellow-400 text-gray-900 hover:opacity-90 font-bold',
    href: '/signup?plan=gold',
    highlight: true,
    icon: Sparkles,
    features: [
      { label: 'Everything in Silver', included: true },
      { label: 'One proposal review per month', included: true },
      { label: 'Premium grant database', included: true },
      { label: 'Monthly live webinars', included: true },
      { label: 'Application templates library', included: true },
      { label: 'AI research assistant (full access)', included: true },
      { label: 'Priority support', included: false },
      { label: 'Grant concierge', included: false },
      { label: 'One-on-one consulting', included: false },
      { label: 'Custom opportunity alerts', included: false },
    ],
  },
  {
    name: 'Platinum',
    price: '₦18,000',
    period: '/month',
    tagline: 'Full concierge service for serious researchers & founders',
    color: 'border-gray-200 bg-white',
    cta: 'Start Platinum',
    ctaStyle: 'border border-blue-700 text-blue-700 hover:bg-blue-50',
    href: '/signup?plan=platinum',
    icon: Shield,
    features: [
      { label: 'Everything in Gold', included: true },
      { label: 'Grant concierge service', included: true },
      { label: 'One-on-one consulting session/month', included: true },
      { label: 'Priority support (24h response)', included: true },
      { label: 'Custom opportunity alerts', included: true },
      { label: 'Proposal writing support', included: true },
      { label: 'M&E framework development', included: true },
      { label: 'Budget design assistance', included: true },
      { label: 'Dedicated account manager', included: true },
      { label: 'White-glove application support', included: true },
    ],
  },
]

const faqs = [
  {
    q: 'What is the most affordable plan?',
    a: 'All plans require a subscription. Silver is our most affordable entry point at ₦3,000/month and gives you full access to the grant database, AI matching, and weekly newsletter.',
  },
  {
    q: 'Do you offer a quarterly subscription instead of monthly?',
    a: 'Yes! Our quarterly newsletter subscription is available at ₦12,000/quarter at store.mabrigkorie.org, which includes grant lists, deadline reminders, and application templates.',
  },
  {
    q: 'What is the Grant Concierge service?',
    a: 'Platinum members get a dedicated grant concierge who helps identify the best opportunities, reviews applications, and provides hands-on support throughout the application process.',
  },
  {
    q: 'Are the AI tools available on all plans?',
    a: 'Basic AI suggestions are available on Silver. Full AI tools — proposal generator, abstract improver, budget builder — are available on Gold and Platinum plans.',
  },
  {
    q: 'Can independent researchers (non-affiliated) benefit from AfriGrantPipeline?',
    a: 'Absolutely — AfriGrantPipeline is specifically designed to serve independent researchers, non-affiliated scholars, and faith-based innovators who are often excluded from mainstream funding platforms.',
  },
  {
    q: 'How do I cancel my subscription?',
    a: 'You can cancel anytime from your dashboard settings. Your access continues until the end of your current billing period.',
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <section className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-4xl px-6 py-14 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700">
            <Star className="size-4" /> Membership Plans
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Invest in Your<br />
            <span className="text-blue-700">Research Future</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-gray-500">
            From free discovery to full concierge service — choose the plan that matches your ambition. Every tier includes access to Africa&apos;s most comprehensive funding database.
          </p>
        </div>
      </section>

      {/* Tiers */}
      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {tiers.map(({ name, price, period, tagline, color, cta, ctaStyle, href, highlight, icon: Icon, features }) => (
            <div key={name} className={`relative flex flex-col rounded-3xl border p-6 ${color}`}>
              {highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-yellow-400 px-4 py-1 text-xs font-bold text-gray-900">
                  Most Popular
                </div>
              )}
              <div className={`mb-2 flex size-10 items-center justify-center rounded-xl ${highlight ? 'bg-white/20' : 'bg-blue-100'}`}>
                <Icon className={`size-5 ${highlight ? 'text-white' : 'text-blue-700'}`} />
              </div>
              <div className={`text-sm font-semibold ${highlight ? 'text-blue-200' : 'text-blue-700'}`}>{name}</div>
              <div className="mt-1 flex items-end gap-1">
                <span className={`text-3xl font-bold ${highlight ? 'text-white' : 'text-gray-900'}`}>{price}</span>
                <span className={`mb-1 text-sm ${highlight ? 'text-blue-200' : 'text-gray-400'}`}>{period}</span>
              </div>
              <p className={`mt-2 mb-5 text-sm ${highlight ? 'text-blue-100' : 'text-gray-500'}`}>{tagline}</p>
              <ul className="mb-6 flex-1 space-y-2.5">
                {features.map(({ label, included }) => (
                  <li key={label} className={`flex items-start gap-2 text-sm ${!included ? (highlight ? 'opacity-40' : 'text-gray-300') : (highlight ? 'text-blue-100' : 'text-gray-600')}`}>
                    {included
                      ? <CheckCircle className={`mt-0.5 size-4 shrink-0 ${highlight ? 'text-yellow-300' : 'text-blue-700'}`} />
                      : <X className="mt-0.5 size-4 shrink-0" />
                    }
                    {label}
                  </li>
                ))}
              </ul>
              <Link href={href} className={`block rounded-2xl py-3 text-center text-sm transition-all ${ctaStyle}`}>
                {cta} <ArrowRight className="inline size-4" />
              </Link>
            </div>
          ))}
        </div>

        {/* Quarterly option */}
        <div className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="mb-1 text-sm font-bold text-amber-700">Quarterly Newsletter Subscription</div>
              <h3 className="text-xl font-bold text-gray-900">Grant Intelligence — ₦12,000/quarter</h3>
              <p className="mt-1 text-sm text-gray-600">Updated grant lists, deadline reminders, application templates, and funding intel delivered to your inbox every quarter.</p>
            </div>
            <a href="https://store.mabrigkorie.org" target="_blank" rel="noopener noreferrer"
              className="shrink-0 rounded-full bg-amber-500 px-7 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90">
              Subscribe at store.mabrigkorie.org
            </a>
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-900">Full Feature Comparison</h2>
          <div className="overflow-x-auto rounded-2xl border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-5 py-4 text-left font-semibold text-gray-700">Feature</th>
                  {['Silver', 'Gold', 'Platinum'].map((t) => (
                    <th key={t} className={`px-5 py-4 text-center font-semibold ${t === 'Gold' ? 'bg-blue-700 text-white' : 'text-gray-700'}`}>{t}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  ['Full grant database access', true, true, true],
                  ['Save opportunities', 'Unlimited', 'Unlimited', 'Unlimited'],
                  ['AI grant matching', true, true, true],
                  ['Weekly newsletter', true, true, true],
                  ['Deadline alerts', true, true, true],
                  ['Business grants access', true, true, true],
                  ['Proposal review', false, '1/month', 'Unlimited'],
                  ['Live webinars', false, true, true],
                  ['Priority support', false, false, true],
                  ['Grant concierge', false, false, true],
                  ['1-on-1 consulting', false, false, '1/month'],
                ].map(([feature, ...values]) => (
                  <tr key={feature as string}>
                    <td className="px-5 py-3.5 text-gray-700">{feature as string}</td>
                    {values.map((v, i) => (
                      <td key={i} className={`px-5 py-3.5 text-center ${i === 1 ? 'bg-blue-50' : ''}`}>
                        {typeof v === 'boolean'
                          ? v
                            ? <CheckCircle className="mx-auto size-4 text-blue-700" />
                            : <X className="mx-auto size-4 text-gray-300" />
                          : <span className="font-medium text-gray-700">{v as string}</span>
                        }
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="mb-8 text-center text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map(({ q, a }) => (
            <div key={q} className="rounded-2xl border border-gray-200 bg-white p-5">
              <h3 className="mb-2 font-semibold text-gray-900">{q}</h3>
              <p className="text-sm leading-relaxed text-gray-600">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-700 py-14">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-3xl font-bold text-white">Start your subscription today</h2>
          <p className="mt-3 text-blue-100">From ₦3,000/month. Full access from day one.</p>
          <Link href="/signup?plan=silver" className="mt-6 inline-flex items-center gap-2 rounded-full bg-yellow-400 px-8 py-3.5 text-sm font-bold text-gray-900 transition-opacity hover:opacity-90">
            Get Started — Silver Plan <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
