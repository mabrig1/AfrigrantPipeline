import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t bg-muted/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-sm mb-3">Platform</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/grants" className="hover:text-foreground">Grants</Link></li>
              <li><Link href="/research" className="hover:text-foreground">Research</Link></li>
              <li><Link href="/collaborate" className="hover:text-foreground">Collaborate</Link></li>
              <li><Link href="/mentorship" className="hover:text-foreground">Mentorship</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-3">About</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground">About Us</Link></li>
              <li><Link href="/team" className="hover:text-foreground">Team</Link></li>
              <li><Link href="/blog" className="hover:text-foreground">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-3">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/faq" className="hover:text-foreground">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-foreground">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-3">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-foreground">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} AfrigrantPipeline. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
