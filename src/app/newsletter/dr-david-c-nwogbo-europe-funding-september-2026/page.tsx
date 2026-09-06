import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'European Funding Alert for Dr David C. Nwogbo',
  description:
    'A September 2026 funding brief for Dr David C. Nwogbo covering European opportunities relevant to public administration, governance and social sciences.',
}

type Opportunity = {
  title: string
  funder: string
  deadline: string
  funding: string
  fit: string
  eligibility: string
  action: string
  url: string
  priority: 'Immediate' | 'High' | 'Conditional'
}

const opportunities: Opportunity[] = [
  {
    title: 'MSCA Postdoctoral Fellowships 2026',
    funder: 'European Commission — Marie Skłodowska-Curie Actions',
    deadline: '9 September 2026, 17:00 CEST',
    funding: '€399.05 million indicative call budget; individual fellowships include living, mobility and research/training support.',
    fit: 'Strong for governance, public policy, public-sector innovation or comparative administration research if the project can be hosted in Europe.',
    eligibility:
      'Researchers of any nationality can apply for a European Postdoctoral Fellowship. Applicant must hold a PhD, normally have no more than 8 years of research experience after the PhD, satisfy the mobility rule, and apply jointly with a host organisation in an EU Member State or Horizon Europe Associated Country.',
    action:
      'Treat as an emergency opportunity only if a suitable European host and a near-ready proposal are already available.',
    url: 'https://marie-sklodowska-curie-actions.ec.europa.eu/funding/msca-postdoctoral-fellowships-2026',
    priority: 'Immediate',
  },
  {
    title: 'Horizon Europe 2026 — Democracy and Governance',
    funder: 'European Research Executive Agency',
    deadline: '23 September 2026',
    funding: '€112.5 million overall indicative budget across the 2026 Democracy and Governance call.',
    fit: 'Excellent. Relevant themes include democratic governance, institutions, trust, local democracy, accountability, public-sector capacity and governance reform.',
    eligibility:
      'Nigeria is on the Horizon Europe list of low- and middle-income countries automatically eligible for funding, subject to the specific topic conditions. Most collaborative calls require an EU/Associated Country consortium, with Nigerian institutions joining as additional funded partners.',
    action:
      'Prioritise consortium entry immediately. Position Dr Nwogbo around local democracy, decentralisation, public-sector reform, accountability, service delivery or citizen participation.',
    url: 'https://rea.ec.europa.eu/funding-and-grants/horizon-europe-cluster-2-culture-creativity-and-inclusive-society/democracy-and-governance_en',
    priority: 'High',
  },
  {
    title: 'Horizon Europe 2026 — Social and Economic Transformations',
    funder: 'European Research Executive Agency',
    deadline: '23 September 2026',
    funding: '€100.5 million overall indicative budget across the 2026 call.',
    fit: 'Strong for public policy research on inequality, labour-market governance, human capital, social inclusion, institutional resilience and development administration.',
    eligibility:
      'Nigerian organisations can participate in Horizon Europe and are automatically eligible for funding under the low- and middle-income country rules unless a topic states otherwise. Consortium rules still apply.',
    action:
      'Use this route where the proposal is more social-policy, development-policy or institutional-resilience focused than democracy focused.',
    url: 'https://rea.ec.europa.eu/funding-and-grants/horizon-europe-cluster-2-culture-creativity-and-inclusive-society/social-and-economic-transformations_en',
    priority: 'High',
  },
  {
    title: 'Fernand Braudel Senior Fellowship — Political and Social Sciences',
    funder: 'European University Institute, Florence',
    deadline: '30 September 2026, 14:00 CEST',
    funding: '€3,200 monthly stipend. The Political and Social Sciences Department funds fellows for up to 3 months, with longer visiting periods possible subject to departmental conditions.',
    fit: 'One of the strongest individual opportunities for an established Public Administration or Governance scholar.',
    eligibility:
      'Open to established academics with an international reputation; all nationalities are eligible. The Political and Social Sciences Department accepts applications at the 30 September 2026 deadline.',
    action:
      'Prepare a concise 2–4 page research proposal centred on comparative governance, local administration, democratic institutions, public-sector reform or policy implementation.',
    url: 'https://www.eui.eu/apply?id=fernand-braudel-senior-fellowships',
    priority: 'High',
  },
  {
    title: 'ERC Starting Grant 2027',
    funder: 'European Research Council',
    deadline: '14 October 2026',
    funding: 'Up to €1.5 million for 5 years, plus justified additional funding; researchers relocating from a non-associated third country may request up to €2 million in additional funding.',
    fit: 'Potentially transformational for an ambitious frontier-research programme in governance, institutions, public policy or political science.',
    eligibility:
      'Researchers of any nationality may apply if they are within 0–10 years of successful PhD defence under the 2027 rules. The research must be hosted by an eligible organisation in an EU Member State or Horizon Europe Associated Country.',
    action:
      'Pursue only if Dr Nwogbo falls within the PhD eligibility window and can secure a European host institution willing to support the application.',
    url: 'https://erc.europa.eu/apply-grant/starting-grant',
    priority: 'Conditional',
  },
  {
    title: 'Max Weber Fellowship 2027–28',
    funder: 'European University Institute, Florence',
    deadline: '16 October 2026, 14:00 CEST',
    funding: '€2,500 per month, with research support and possible family allowances; normally 1–2 years depending on the hosting unit.',
    fit: 'Excellent for early-career researchers in Political and Social Sciences, public policy and transnational governance.',
    eligibility:
      'Open to candidates of any nationality who are within 5 years of completing their PhD, subject to the programme rules and permitted extensions.',
    action:
      'Use this route if Dr Nwogbo is within five years of his PhD; otherwise prioritise Fernand Braudel or Jean Monnet instead.',
    url: 'https://www.eui.eu/apply?id=max-weber-fellowships',
    priority: 'Conditional',
  },
  {
    title: 'Jean Monnet Fellowship 2027–28',
    funder: 'European University Institute — Robert Schuman Centre',
    deadline: '23 October 2026, 14:00 CEST',
    funding: '€2,850 per month for a 12-month residential fellowship.',
    fit: 'Excellent for an established scholar working on governance, institutions, public policy, democracy, migration, regulation or transnational governance.',
    eligibility:
      'Open to all nationalities. For the 2027–28 round, applicants should have obtained their doctorate more than five years before the fellowship start date of 1 September 2027.',
    action:
      'If Dr Nwogbo has been post-PhD for more than five years, this should be treated as a priority individual fellowship application.',
    url: 'https://www.eui.eu/apply?id=jean-monnet-fellowships',
    priority: 'High',
  },
]

function priorityStyle(priority: Opportunity['priority']) {
  if (priority === 'Immediate') return 'bg-red-50 text-red-700 ring-red-200'
  if (priority === 'High') return 'bg-emerald-50 text-emerald-700 ring-emerald-200'
  return 'bg-amber-50 text-amber-800 ring-amber-200'
}

export default function DavidNwogboEuropeFundingBrief() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main>
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-14">
            <Link href="/newsletter" className="text-sm font-semibold text-blue-700 hover:text-blue-800">
              ← Grant Intelligence Newsletter
            </Link>
            <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
              Europe Funding Alert • 6 September 2026
            </p>
            <h1 className="mt-3 max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl">
              European Funding Brief for Dr David C. Nwogbo
            </h1>
            <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-600">
              A focused AfriGrantPipeline scan for Public Administration, Governance, Public Policy and related Social Sciences, prioritising opportunities that a Nigerian academic can realistically pursue either directly or through a European consortium or host institution.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {['Public Administration', 'Governance', 'Public Policy', 'Social Sciences', 'Nigeria → Europe'].map((tag) => (
                <span key={tag} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-10">
          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-red-700">Most urgent</p>
              <p className="mt-2 font-bold">MSCA PF — 9 September</p>
              <p className="mt-2 text-sm leading-6 text-red-900/75">Only realistic now if a host and proposal are already substantially prepared.</p>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Best thematic fit</p>
              <p className="mt-2 font-bold">Horizon Europe — Democracy & Governance</p>
              <p className="mt-2 text-sm leading-6 text-emerald-900/75">Strongest institutional route for governance, local democracy and public-sector reform research.</p>
            </div>
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-700">Best individual route</p>
              <p className="mt-2 font-bold">EUI Fernand Braudel / Jean Monnet</p>
              <p className="mt-2 text-sm leading-6 text-blue-900/75">Excellent options for an established scholar, depending on career stage and project fit.</p>
            </div>
          </div>

          <div className="mt-10 space-y-6">
            {opportunities.map((opportunity, index) => (
              <article key={opportunity.title} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-blue-700">#{index + 1} • {opportunity.funder}</p>
                    <h2 className="mt-1 text-2xl font-bold tracking-tight">{opportunity.title}</h2>
                  </div>
                  <span className={`w-fit rounded-full px-3 py-1 text-xs font-bold ring-1 ${priorityStyle(opportunity.priority)}`}>
                    {opportunity.priority}
                  </span>
                </div>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Deadline</p>
                    <p className="mt-1 font-semibold">{opportunity.deadline}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Funding</p>
                    <p className="mt-1 leading-6 text-slate-700">{opportunity.funding}</p>
                  </div>
                </div>

                <div className="mt-6 space-y-4 text-sm leading-7 text-slate-700">
                  <p><strong className="text-slate-900">Why it fits:</strong> {opportunity.fit}</p>
                  <p><strong className="text-slate-900">Eligibility:</strong> {opportunity.eligibility}</p>
                  <p><strong className="text-slate-900">Recommended action:</strong> {opportunity.action}</p>
                </div>

                <a
                  href={opportunity.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                >
                  Verify on official funder page ↗
                </a>
              </article>
            ))}
          </div>

          <section className="mt-10 rounded-3xl bg-slate-900 p-8 text-white">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-300">Recommended application sequence</p>
            <ol className="mt-5 space-y-4 text-sm leading-7 text-slate-200">
              <li><strong className="text-white">1. Immediately:</strong> decide whether MSCA is viable based on host readiness; do not start from zero three days before deadline.</li>
              <li><strong className="text-white">2. This week:</strong> pursue Horizon Europe consortium contacts and prepare the Fernand Braudel research proposal.</li>
              <li><strong className="text-white">3. Before mid-October:</strong> determine Dr Nwogbo's exact PhD defence year to choose between ERC Starting, Max Weber and Jean Monnet.</li>
              <li><strong className="text-white">4. Proposal positioning:</strong> emphasise Nigeria–Europe comparative governance, local democracy, public-sector performance, digital government, SDG localisation, accountability or citizen participation.</li>
            </ol>
          </section>

          <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-950">
            <strong>Verification note:</strong> This brief was compiled from official European Commission, European Research Executive Agency, European Research Council, Marie Skłodowska-Curie Actions and European University Institute sources checked on 6 September 2026. Funding rules can change, and the legal call text always takes precedence. Confirm eligibility on the official application page before submission.
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
