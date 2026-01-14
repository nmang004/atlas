import Link from 'next/link'

import {
  BarChart3,
  BookOpen,
  Bug,
  CheckCircle2,
  Gauge,
  Globe,
  Heart,
  History,
  Layers,
  LayoutDashboard,
  Lock,
  Moon,
  RefreshCw,
  Rocket,
  Search,
  Settings,
  Shield,
  Sparkles,
  Variable,
  Vote,
  Zap,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Changelog - Atlas Version History & Release Notes',
  description:
    'Stay up to date with Atlas releases. See new features, improvements, and fixes in each version of our AI prompt governance platform.',
  openGraph: {
    title: 'Atlas Changelog - Version History & Release Notes',
    description:
      'Stay up to date with Atlas releases. See new features, improvements, and fixes in each version.',
  },
}

interface ChangelogEntry {
  version: string
  date: string
  title: string
  description: string
  isCurrent?: boolean
  thankYouMessage?: {
    title: string
    message: string
    signature: string
  }
  categories: {
    name: string
    icon: React.ReactNode
    items: string[]
  }[]
}

const changelog: ChangelogEntry[] = [
  {
    version: '1.1',
    date: 'January 14, 2026',
    title: 'Community & Communication Update',
    description:
      'Major improvements to user experience based on team feedback, plus new ways to share your thoughts and see what\'s coming next.',
    isCurrent: true,
    thankYouMessage: {
      title: 'Thank You, Scorpion SEO Team',
      message:
        'A heartfelt thank you to the entire Scorpion SEO team for your incredible support, feedback, and enthusiasm for Atlas. Your insights and real-world usage drive every improvement we make. Together, we\'re building something that makes everyone\'s work better, faster, and more consistent. I\'m grateful to be building this with all of you.',
      signature: 'Nick',
    },
    categories: [
      {
        name: 'New Pages',
        icon: <Sparkles className="h-5 w-5" />,
        items: [
          'Changelog page with full version history',
          'Roadmap page showing upcoming features',
          'Anonymous feedback form',
          'Announcement banners for new releases',
        ],
      },
      {
        name: 'User Experience',
        icon: <Rocket className="h-5 w-5" />,
        items: [
          'Quick Start is now the default prompt variant',
          'Renamed "Data Requirements" to "Data Recommendations"',
          'Feedback link added to dashboard sidebar',
          'Roadmap and Feedback links in footer',
        ],
      },
      {
        name: 'Bug Fixes',
        icon: <Bug className="h-5 w-5" />,
        items: [
          'Fixed 406 error when viewing prompts without prior votes',
          'Improved vote fetching reliability',
        ],
      },
    ],
  },
  {
    version: '1.0',
    date: 'January 12, 2026',
    title: 'Initial Launch',
    description:
      'The complete prompt governance platform with everything you need to standardize AI workflows across your team.',
    categories: [
      {
        name: 'Prompt Library',
        icon: <BookOpen className="h-5 w-5" />,
        items: [
          'Centralized prompt storage with categories',
          'Tag-based organization and filtering',
          'Before/after teaching examples',
          'Markdown rendering for rich content',
          'One-click copy to clipboard',
        ],
      },
      {
        name: 'Variable Injection',
        icon: <Variable className="h-5 w-5" />,
        items: [
          'Dynamic text field variables',
          'Textarea variables for longer content',
          'Select dropdown variables with predefined options',
          'Real-time variable substitution on copy',
        ],
      },
      {
        name: 'Prompt Variants',
        icon: <Layers className="h-5 w-5" />,
        items: [
          'Quick Start variant for fast usage',
          'Advanced variant with full customization',
          'Per-prompt variant configurations',
          'Data requirements guidance',
        ],
      },
      {
        name: 'Quality Voting',
        icon: <Vote className="h-5 w-5" />,
        items: [
          'Positive/negative voting system',
          'Optional feedback with votes',
          'Automatic rating calculation (% positive)',
          'Vote rate limiting to prevent abuse',
        ],
      },
      {
        name: 'Stale Detection',
        icon: <RefreshCw className="h-5 w-5" />,
        items: [
          'Automatic detection of unused prompts (60+ days)',
          'Flagging system for negative feedback',
          'Admin queue for prompts needing review',
        ],
      },
      {
        name: 'Search & Filtering',
        icon: <Search className="h-5 w-5" />,
        items: [
          'Full-text search across prompts',
          'Category filtering with counts',
          'Tag filtering with popularity sorting',
          'Collapsible tag filter panel',
          'Debounced search for performance',
        ],
      },
      {
        name: 'Dashboard UI',
        icon: <LayoutDashboard className="h-5 w-5" />,
        items: [
          'Responsive sidebar navigation',
          'Server Components with Suspense streaming',
          'Optimistic UI updates for voting',
          'Toast notifications for actions',
          'Scorpion corporate branding',
        ],
      },
      {
        name: 'Theme Support',
        icon: <Moon className="h-5 w-5" />,
        items: [
          'Light and dark mode themes',
          'System preference detection',
          'User preference persistence',
          'Smooth theme transitions',
        ],
      },
      {
        name: 'User Settings',
        icon: <Settings className="h-5 w-5" />,
        items: [
          'User profile management',
          'Theme preference settings',
          'Display name customization',
        ],
      },
      {
        name: 'Admin Controls',
        icon: <Shield className="h-5 w-5" />,
        items: [
          'Full CRUD for prompts',
          'Category management',
          'Flagged prompt review queue',
          'User role management',
        ],
      },
      {
        name: 'Security',
        icon: <Lock className="h-5 w-5" />,
        items: [
          'Row-level security on all tables',
          'Role-based access control (Admin/User)',
          'Secure authentication via Supabase Auth',
          'Password leak detection (HaveIBeenPwned)',
          'Comprehensive security headers',
        ],
      },
      {
        name: 'Performance',
        icon: <Gauge className="h-5 w-5" />,
        items: [
          'Database query caching',
          'Pagination for large datasets',
          'Optimized database indexes',
          'Edge network CDN delivery',
        ],
      },
      {
        name: 'Analytics & Monitoring',
        icon: <BarChart3 className="h-5 w-5" />,
        items: [
          'PostHog product analytics',
          'User identification and tracking',
          'Sentry error monitoring',
          'Performance tracing',
        ],
      },
      {
        name: 'SEO & Marketing',
        icon: <Globe className="h-5 w-5" />,
        items: [
          'Public about page',
          'Public security page',
          'SEO-optimized meta titles',
          'JSON-LD structured data',
          'OpenGraph metadata',
        ],
      },
    ],
  },
]

export default function ChangelogPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-light/30 via-background to-background pb-16 pt-16 dark:from-navy dark:via-background">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5" />
        <div className="container relative">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-6">
              <History className="mr-1 h-3 w-3" />
              Version History
            </Badge>

            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              What&apos;s new in
              <br />
              <span className="text-gradient">Atlas</span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Track every feature, improvement, and fix. Stay informed about the latest updates to
              your prompt governance platform.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16">
        <div className="container">
          <div className="mx-auto max-w-5xl">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-0 top-0 hidden h-full w-px bg-gradient-to-b from-primary via-secondary to-border md:left-[11.5rem] md:block" />

              <div className="space-y-16">
                {changelog.map((entry) => (
                  <div key={entry.version} className="relative">
                    {/* Version header */}
                    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start">
                      {/* Date column */}
                      <div className="flex shrink-0 items-center gap-3 md:w-44 md:flex-col md:items-end md:text-right">
                        <div className="relative z-10 hidden h-4 w-4 rounded-full border-4 border-primary bg-background md:block" />
                        <span className="text-sm font-medium text-muted-foreground">
                          {entry.date}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 md:pl-8">
                        <div className="mb-2 flex flex-wrap items-center gap-3">
                          <h2 className="text-3xl font-bold">v{entry.version}</h2>
                          {entry.isCurrent && (
                            <Badge className="bg-gradient-to-r from-primary to-secondary">
                              <Sparkles className="mr-1 h-3 w-3" />
                              Latest
                            </Badge>
                          )}
                        </div>
                        <h3 className="mb-2 text-xl font-semibold text-foreground">
                          {entry.title}
                        </h3>
                        <p className="text-muted-foreground">{entry.description}</p>
                      </div>
                    </div>

                    {/* Categories grid */}
                    <div className="md:ml-52">
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {entry.categories.map((category) => (
                          <Card
                            key={category.name}
                            className="transition-all hover:shadow-md hover:shadow-primary/5"
                          >
                            <CardHeader className="pb-3">
                              <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 text-primary">
                                  {category.icon}
                                </div>
                                <CardTitle className="text-base">{category.name}</CardTitle>
                              </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <ul className="space-y-2">
                                {category.items.map((item) => (
                                  <li
                                    key={item}
                                    className="flex items-start gap-2 text-sm text-muted-foreground"
                                  >
                                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      {/* Thank you message - shown directly under version */}
                      {entry.thankYouMessage && (
                        <Card className="mt-6 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
                          <CardContent className="pt-6">
                            <div className="flex items-start gap-4">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                <Heart className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <h3 className="mb-2 font-semibold">{entry.thankYouMessage.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {entry.thankYouMessage.message}
                                </p>
                                <p className="mt-3 font-medium">— {entry.thankYouMessage.signature}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-gradient-to-b from-primary/5 to-secondary/5 py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Ready to get started?</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Experience all these features and more. Start standardizing your AI workflow today.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="gap-2" asChild>
                <Link href="/signup">
                  <Zap className="h-4 w-4" />
                  Start Using Atlas Free
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
