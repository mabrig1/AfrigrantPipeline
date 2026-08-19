import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import SessionProvider from '@/components/providers/SessionProvider'

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://afrigrantpipeline.com'),
  title: {
    default: 'AfrigrantPipeline — Africa\'s Research & Innovation Infrastructure',
    template: '%s | AfrigrantPipeline',
  },
  description:
    'The LinkedIn + ResearchGate + Grant Marketplace for Africa. Connecting students, researchers, universities, NGOs, industries, and funding organizations across the continent.',
  keywords: [
    'Africa grants',
    'research funding Africa',
    'African researchers',
    'grant marketplace',
    'African journals',
    'research collaboration Africa',
    'AfriPublish',
    'mentorship Africa',
    'STEM Africa',
  ],
  authors: [{ name: 'AfrigrantPipeline' }],
  creator: 'AfrigrantPipeline',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://afrigrantpipeline.com',
    siteName: 'AfrigrantPipeline',
    title: 'AfrigrantPipeline — Africa\'s Research & Innovation Infrastructure',
    description: 'The LinkedIn + ResearchGate + Grant Marketplace for Africa.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: "AfrigrantPipeline – Africa's Research & Innovation Infrastructure" }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AfrigrantPipeline',
    description: 'The LinkedIn + ResearchGate + Grant Marketplace for Africa.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#F0B429',
  colorScheme: 'dark',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={jakartaSans.variable}>
      <body className="font-sans antialiased min-h-screen bg-background text-foreground">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
