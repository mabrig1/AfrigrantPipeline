import Link from 'next/link'

const contactItems = [
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
    href: 'https://wa.me/2347065342818',
  },
  {
    label: 'Website',
    value: 'afrigrantpipeline.com',
    href: 'https://www.afrigrantpipeline.com',
  },
]

export default function Footer() {
  return (
    <footer className="mt-auto border-t bg-muted/50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <h3 className="font-semibold text-foreground">AfriGrantPipeline</h3>
            <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
              Research funding, grant development and international partnerships
              for African researchers, innovators and institutions.
            </p>
            <p className="mt-3 text-sm font-medium text-foreground">
              Mabrig Korie · Founder &amp; Lead Consultant
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              A MABRIG Technologies initiative
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Platform</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/grants" className="hover:text-foreground">Grants</Link></li>
              <li><Link href="/scholarships" className="hover:text-foreground">Scholarships</Link></li>
              <li><Link href="/consultancy" className="hover:text-foreground">Consultancy</Link></li>
              <li><Link href="/research-center" className="hover:text-foreground">Research Center</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {contactItems.map((item) => (
                <li key={item.label}>
                  <span className="block text-xs font-medium uppercase tracking-wide text-muted-foreground/80">
                    {item.label}
                  </span>
                  <a
                    href={item.href}
                    className="break-words hover:text-foreground"
                    target={item.label === 'WhatsApp' || item.label === 'Website' ? '_blank' : undefined}
                    rel={item.label === 'WhatsApp' || item.label === 'Website' ? 'noreferrer' : undefined}
                  >
                    {item.value}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/contact" className="hover:text-foreground">Contact page</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-foreground">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} AfriGrantPipeline. All rights reserved.</p>
          <p className="mt-1">Connecting African research to global funding opportunities.</p>
        </div>
      </div>
    </footer>
  )
}
