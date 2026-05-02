import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: 'Orbit - Intelligent Codebase Analyzer',
  description: 'Analyze, understand, and upgrade your codebase with Orbit. Intelligent code analysis that changes what matters.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

import { Providers } from '@/components/Providers'
import { BackgroundEffect } from '@/components/BackgroundEffect'
import { GlobalShortcuts } from '@/components/GlobalShortcuts'
import { WaitlistModal } from '@/components/WaitlistModal'
import { PageWrapper } from '@/components/PageWrapper'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground font-sans antialiased`}>
        <BackgroundEffect />
        <Providers>
          <GlobalShortcuts />
          <WaitlistModal />
          <PageWrapper>
            {children}
          </PageWrapper>
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </Providers>
      </body>
    </html>
  )
}
