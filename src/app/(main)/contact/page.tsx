export const metadata = {
  title: 'Contact | AfriGrantPipeline',
  description:
    'Contact AfriGrantPipeline for research funding, grant development and international partnership support.',
}

const contacts = [
  {
    label: 'Email',
    value: 'victoryonline1@gmail.com',
    href: 'mailto:victoryonline1@gmail.com',
  },
  {
    label: 'Phone',
    value: '+234 706 534 2818',
    href: 'tel:+2347065342818',
  },
  {
    label: 'WhatsApp',
    value: '+234 706 534 2818',
    href: 'https://wa.me/2347065342818?text=Hello%20Mabrig%2C%20I%20would%20like%20to%20discuss%20AfriGrantPipeline%20services.',
  },
  {
    label: 'Website',
    value: 'www.afrigrantpipeline.com',
    href: 'https://www.afrigrantpipeline.com',
  },
]

export default function ContactPage() {
  return (
    <div className="bg-gray-50 text-gray-900">
      <section className="mx-auto max-w-5xl px-5 py-14 sm:py-20">
        <p className="text-sm font-bold uppercase tracking-wider text-blue-700">
          AfriGrantPipeline
        </p>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
          Contact our grant consultancy
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600">
          Research funding, grant development and international partnership
          support for researchers, innovators and institutions.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_1fr]">
          <div className="rounded-2xl border border-gray-200 bg-white p-7">
            <h2 className="text-2xl font-bold">Mabrig Korie</h2>
            <p className="mt-2 font-semibold text-blue-700">
              Founder &amp; Lead Consultant
            </p>
            <p className="mt-1 text-sm text-gray-500">
              AfriGrantPipeline · A MABRIG Technologies initiative
            </p>

            <div className="mt-7 space-y-5">
              {contacts.map((contact) => (
                <div key={contact.label}>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    {contact.label}
                  </p>
                  <a
                    href={contact.href}
                    target={contact.label === 'WhatsApp' || contact.label === 'Website' ? '_blank' : undefined}
                    rel={contact.label === 'WhatsApp' || contact.label === 'Website' ? 'noreferrer' : undefined}
                    className="mt-1 inline-block break-all font-semibold text-blue-700 hover:underline"
                  >
                    {contact.value}
                  </a>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-2xl border border-blue-200 bg-blue-50 p-7">
            <p className="text-sm font-bold uppercase tracking-wider text-blue-700">
              Grant consultancy
            </p>
            <h2 className="mt-4 text-2xl font-bold">
              Tell us what you are trying to fund.
            </h2>
            <p className="mt-4 leading-7 text-gray-600">
              Send your current CV, research topic or project brief and the type
              of support you need. We will assess the request and recommend the
              next suitable consultancy step.
            </p>
            <a
              href="https://wa.me/2347065342818?text=Hello%20Mabrig%2C%20I%20would%20like%20grant%20consultancy%20support."
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex rounded-xl bg-blue-700 px-6 py-3 font-bold text-white hover:bg-blue-800"
            >
              Start on WhatsApp
            </a>
            <p className="mt-5 text-sm leading-6 text-gray-500">
              Funding decisions are made by external funders and cannot be
              guaranteed.
            </p>
          </aside>
        </div>
      </section>
    </div>
  )
}
