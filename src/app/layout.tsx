import { Outfit } from 'next/font/google'

import * as Sentry from '@sentry/nextjs'

import './globals.css'
import { PostHogProvider } from '@/components/providers/PostHogProvider'
import { QueryProvider } from '@/components/providers/QueryProvider'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { Toaster } from '@/components/ui/toaster'
import { TooltipProvider } from '@/components/ui/tooltip'

import type { Metadata, Viewport } from 'next'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

export function generateMetadata(): Metadata {
  return {
    title: {
      default: 'Atlas - Prompt Governance Platform',
      template: '%s | Atlas',
    },
    description:
      'A living prompt library that standardizes AI/LLM usage across teams through crowdsourced quality maintenance and voting at the point of use.',
    keywords: [
      'prompt library',
      'prompt governance',
      'AI prompts',
      'LLM prompts',
      'prompt management',
      'team collaboration',
      'ChatGPT prompts',
      'Claude prompts',
    ],
    authors: [{ name: 'Scorpion' }],
    creator: 'Scorpion',
    publisher: 'Scorpion',
    metadataBase: new URL('https://www.scorpionatlas.co'),
    alternates: {
      canonical: '/',
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: 'https://www.scorpionatlas.co',
      siteName: 'Atlas',
      title: 'Atlas - Prompt Governance Platform',
      description:
        'A living prompt library that standardizes AI/LLM usage across teams through crowdsourced quality maintenance and voting at the point of use.',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Atlas - Prompt Governance Platform',
      description:
        'A living prompt library that standardizes AI/LLM usage across teams through crowdsourced quality maintenance and voting at the point of use.',
    },
    robots: {
      index: true,
      follow: true,
    },
    other: {
      ...Sentry.getTraceData(),
    },
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#151231' },
  ],
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://www.scorpionatlas.co/#organization',
      name: 'Scorpion',
      url: 'https://www.scorpion.co',
    },
    {
      '@type': 'WebSite',
      '@id': 'https://www.scorpionatlas.co/#website',
      url: 'https://www.scorpionatlas.co',
      name: 'Atlas',
      description: 'AI Prompt Governance Platform',
      publisher: {
        '@id': 'https://www.scorpionatlas.co/#organization',
      },
    },
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://www.scorpionatlas.co/#software',
      name: 'Atlas',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      description:
        'A living prompt library that standardizes AI/LLM usage across teams through crowdsourced quality maintenance and voting at the point of use.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      featureList: [
        'AI Prompt Library',
        'Variable Injection',
        'Crowdsourced Quality Voting',
        'Team Collaboration',
        'Prompt Categories and Tags',
        'Before/After Examples',
      ],
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${outfit.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <PostHogProvider>
            <QueryProvider>
              <TooltipProvider>{children}</TooltipProvider>
            </QueryProvider>
            <Toaster />
          </PostHogProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
