import Link from 'next/link'
import {
  ArrowRight,
  Search,
  FileText,
  Handshake,
  ClipboardCheck,
} from 'lucide-react'
export const metadata = {
  title: 'Academic grant consultancy | AfriGrantPipeline',
  description:
    'Project-based grant consultancy for Nigerian lecturers and postgraduate researchers, starting with UNN and NOUN.',
}
const offers = [
  {
    icon: Search,
    title: 'Find suitable funding',
    text: 'Research grants, postgraduate funding and fellowships, with source links and eligibility review.',
    deliverable: 'A research brief and grant shortlist.',
  },
  {
    icon: FileText,
    title: 'Prepare your application',
    text: 'Concept notes, proposals, budgets and supporting narratives developed around your research and the funder’s requirements.',
    deliverable: 'Versioned drafts and a readiness checklist.',
  },
  {
    icon: Handshake,
    title: 'Develop partnerships',
    text: 'Find relevant research groups, prepare outreach, define partner roles and develop a memorandum of understanding.',
    deliverable: 'Partner records, outreach drafts and an unsigned MoU.',
  },
  {
    icon: ClipboardCheck,
    title: 'Manage funded projects',
    text: 'Organize deliverables, reporting deadlines, monitoring plans and progress reports from verified project information.',
    deliverable: 'A milestone tracker and reporting documents.',
  },
]
export default function ConsultancyPage() {
  return (
    <div className="bg-gray-50 text-gray-900">
      <section className="mx-auto max-w-6xl px-5 py-14 sm:py-20">
        <p className="text-sm font-bold uppercase tracking-wider text-blue-700">
          Mabrig Korie · Academic grant consultancy
        </p>
        <div className="mt-5 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
              Move your research
              <br />
              towards funding.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
              Grant discovery, application preparation, research partnerships
              and grant management for Nigerian lecturers and postgraduate
              students.
            </p>
            <p className="mt-4 text-gray-600">
              Starting with the University of Nigeria, Nsukka and the National
              Open University of Nigeria. Researchers from other institutions
              are welcome.
            </p>
            <Link
              href="/dashboard/consultancy"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3 font-bold text-white"
            >
              Request consultancy <ArrowRight className="size-4" />
            </Link>
          </div>
          <aside className="rounded-2xl border border-blue-200 bg-blue-50 p-7">
            <p className="text-sm font-bold text-blue-700">
              PAY PER ENGAGEMENT
            </p>
            <h2 className="mt-4 text-2xl font-bold">
              A clear scope.
              <br />
              An agreed fee.
            </h2>
            <p className="mt-4 leading-7 text-gray-600">
              Tell us what you need. We assess your brief and send a project
              quote with deliverables, turnaround and payment terms. Work
              proceeds on the agreed engagement.
            </p>
            <p className="mt-5 font-semibold text-blue-800">
              No subscriptions or recurring access charges.
            </p>
            <a
              href="https://wa.me/2347065342818?text=Hello%20Mabrig%2C%20I%20would%20like%20academic%20grant%20consultancy."
              className="mt-5 inline-block text-blue-700 underline"
            >
              Discuss your project on WhatsApp
            </a>
          </aside>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-5 px-5 pb-14 sm:grid-cols-2">
        {offers.map((o) => (
          <article
            key={o.title}
            className="rounded-2xl border border-gray-200 bg-white p-7"
          >
            <o.icon className="size-7 text-blue-700" />
            <h2 className="mt-5 text-xl font-bold">{o.title}</h2>
            <p className="mt-3 leading-7 text-gray-600">{o.text}</p>
            <p className="mt-4 text-sm font-semibold text-blue-800">
              {o.deliverable}
            </p>
          </article>
        ))}
      </section>
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-12">
          <h2 className="text-2xl font-bold">
            From first brief to final report
          </h2>
          <ol className="mt-6 grid gap-5 sm:grid-cols-3">
            {[
              [
                '1. Submit your brief',
                'Create a free account and describe your research, institution and support needs.',
              ],
              [
                '2. Agree the engagement',
                'Review the fee, scope and milestones in your private case workspace.',
              ],
              [
                '3. Prepare and deliver',
                'Review documents with the consultant and track your application and reporting work.',
              ],
            ].map(([title, text]) => (
              <li key={title}>
                <h3 className="font-bold">{title}</h3>
                <p className="mt-2 leading-7 text-gray-600">{text}</p>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-sm leading-6 text-gray-500">
            AI supports research and drafting under creator review. Applicants
            remain responsible for accurate research information and
            institutional approvals. Funding is awarded by funders and is not
            guaranteed. UNN and NOUN are the initial service communities; no
            institutional endorsement or partnership is implied.
          </p>
          <div className="mt-7 flex flex-wrap gap-5">
            <Link
              className="font-semibold text-blue-700 underline"
              href="/dashboard/consultancy"
            >
              Open your consultancy workspace
            </Link>
            <Link className="text-blue-700 underline" href="/admin">
              Creator premium access
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
