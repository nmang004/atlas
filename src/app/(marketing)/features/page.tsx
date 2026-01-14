import Link from 'next/link'

import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ClipboardCopy,
  Clock,
  Filter,
  Flag,
  FolderOpen,
  Layers,
  Lock,
  RefreshCw,
  Search,
  Settings,
  Shield,
  Sparkles,
  Tag,
  TrendingUp,
  Users,
  Variable,
  Vote,
  Zap,
} from 'lucide-react'

import { AnnouncementBanner } from '@/components/ui/announcement-banner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Features - Atlas Prompt Governance Platform',
  description:
    'Explore all Atlas features: variable injection, crowdsourced voting, stale detection, admin controls, and more. Everything you need for team-wide prompt governance.',
  openGraph: {
    title: 'Atlas Features - Complete Prompt Governance Toolkit',
    description:
      'Variable injection, crowdsourced voting, stale detection, admin controls, and more. Everything you need for team-wide prompt governance.',
  },
}

export default function FeaturesPage() {
  return (
    <div className="flex flex-col">
      <AnnouncementBanner
        version="v1.1 Released"
        message="Check out the new changelog and see what's new!"
        linkText="View changelog"
        linkHref="/changelog"
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-light/30 via-background to-background pb-16 pt-16 dark:from-navy dark:via-background">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5" />
        <div className="container relative">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-6">
              <Sparkles className="mr-1 h-3 w-3" />
              Platform Features
            </Badge>

            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Everything you need for
              <br />
              <span className="text-gradient">prompt governance</span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Atlas combines powerful features to help your team create, maintain, and improve
              prompts together. From variable injection to crowdsourced quality control.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="gap-2" asChild>
                <Link href="/signup">
                  Start Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/how-it-works">See How It Works</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="border-y bg-muted/30 py-20">
        <div className="container">
          <div className="mb-16 text-center">
            <Badge variant="default" className="mb-4">
              Core Features
            </Badge>
            <h2 className="text-3xl font-bold sm:text-4xl">The foundation of prompt governance</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              These core features work together to transform scattered prompts into a centralized,
              self-improving knowledge base.
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Variable className="h-6 w-6" />}
              title="Variable Injection"
              description="Build flexible prompts with dynamic fields. Define text inputs, dropdowns, and text areas that users fill in while keeping the core prompt structure intact."
              highlights={[
                'Text, textarea, and select field types',
                'Required and optional fields',
                'Default values support',
                'Real-time preview',
              ]}
            />
            <FeatureCard
              icon={<ClipboardCopy className="h-6 w-6" />}
              title="One-Click Copy"
              description="Fill in your variables and copy the complete prompt instantly. No manual assembly, no forgotten sections - just paste and go."
              highlights={[
                'Instant variable substitution',
                'Works with any AI tool',
                'Copy confirmation feedback',
                'Keyboard shortcuts',
              ]}
            />
            <FeatureCard
              icon={<Vote className="h-6 w-6" />}
              title="Crowdsourced Voting"
              description="Every prompt use includes a vote. Real feedback from real usage ensures quality rises to the top and problems surface quickly."
              highlights={[
                'Vote at point of use',
                'Optional feedback comments',
                'Automatic rating calculation',
                'Historical vote tracking',
              ]}
            />
            <FeatureCard
              icon={<TrendingUp className="h-6 w-6" />}
              title="Quality Ratings"
              description="See at a glance which prompts perform best. Ratings are calculated from actual usage, not guesses."
              highlights={[
                'Percentage-based ratings',
                'Vote count visibility',
                'Sort by performance',
                'Trend indicators',
              ]}
            />
            <FeatureCard
              icon={<RefreshCw className="h-6 w-6" />}
              title="Stale Detection"
              description="Prompts that go unused get automatically flagged. Keep your library fresh and relevant without manual audits."
              highlights={[
                '60-day staleness threshold',
                'Admin notifications',
                'Easy refresh workflow',
                'Archive or update options',
              ]}
            />
            <FeatureCard
              icon={<Flag className="h-6 w-6" />}
              title="Auto-Flagging"
              description="Negative votes automatically flag prompts for admin review. Problems surface before they spread through the team."
              highlights={[
                'Automatic escalation',
                'Review queue for admins',
                'Feedback context included',
                'Quick resolution workflow',
              ]}
            />
          </div>
        </div>
      </section>

      {/* Organization Features */}
      <section className="py-20">
        <div className="container">
          <div className="mb-16 text-center">
            <Badge variant="outline" className="mb-4">
              Organization
            </Badge>
            <h2 className="text-3xl font-bold sm:text-4xl">Find the right prompt instantly</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Powerful organization tools ensure your team can find exactly what they need in
              seconds, not minutes.
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-primary/5 to-secondary/5">
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 text-primary">
                  <FolderOpen className="h-6 w-6" />
                </div>
                <CardTitle>Categories</CardTitle>
                <CardDescription>
                  Organize prompts into logical groups that match how your team thinks and works.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                    <span className="text-sm text-muted-foreground">
                      Custom categories for your workflow (SEO, Content, Client Comms, etc.)
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                    <span className="text-sm text-muted-foreground">
                      Category-level descriptions and guidelines
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                    <span className="text-sm text-muted-foreground">
                      Quick filter sidebar for fast navigation
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-primary/5 to-secondary/5">
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 text-primary">
                  <Tag className="h-6 w-6" />
                </div>
                <CardTitle>Tags</CardTitle>
                <CardDescription>
                  Cross-cutting labels that let you slice your library in multiple ways.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                    <span className="text-sm text-muted-foreground">
                      Flexible tagging for topics, clients, or use cases
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                    <span className="text-sm text-muted-foreground">
                      Multi-tag filtering to narrow results
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                    <span className="text-sm text-muted-foreground">
                      Tag suggestions based on content
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-primary/5 to-secondary/5">
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 text-primary">
                  <Search className="h-6 w-6" />
                </div>
                <CardTitle>Full-Text Search</CardTitle>
                <CardDescription>
                  Search across titles, descriptions, and prompt content to find exactly what you
                  need.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                    <span className="text-sm text-muted-foreground">
                      Instant search results as you type
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                    <span className="text-sm text-muted-foreground">
                      Search within categories or across all
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                    <span className="text-sm text-muted-foreground">
                      Recent searches for quick access
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-primary/5 to-secondary/5">
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 text-primary">
                  <Filter className="h-6 w-6" />
                </div>
                <CardTitle>Smart Filtering</CardTitle>
                <CardDescription>
                  Combine filters to narrow down to exactly the prompts you need.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                    <span className="text-sm text-muted-foreground">
                      Filter by rating, recency, or vote count
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                    <span className="text-sm text-muted-foreground">
                      Show only high-performing prompts
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                    <span className="text-sm text-muted-foreground">
                      Hide stale or flagged content
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Admin & Control Features */}
      <section className="border-y bg-muted/30 py-20">
        <div className="container">
          <div className="mb-16 text-center">
            <Badge variant="secondary" className="mb-4">
              Admin Controls
            </Badge>
            <h2 className="text-3xl font-bold sm:text-4xl">Maintain quality at scale</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Powerful admin tools give you control over content while empowering the team to
              contribute feedback.
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white">
                  <Users className="h-7 w-7" />
                </div>
                <CardTitle className="text-lg">Role-Based Access</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Admins create and edit prompts. Users browse, copy, and vote. Clear separation of
                  responsibilities.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white">
                  <BarChart3 className="h-7 w-7" />
                </div>
                <CardTitle className="text-lg">Review Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  See flagged prompts, stale content, and low-rated items in one place. Prioritize
                  what needs attention.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white">
                  <Settings className="h-7 w-7" />
                </div>
                <CardTitle className="text-lg">Category Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Create, rename, and reorganize categories as your library grows. Keep structure
                  aligned with workflow.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white">
                  <BookOpen className="h-7 w-7" />
                </div>
                <CardTitle className="text-lg">Teaching Examples</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Add before/after examples to show why prompts work. Help team members understand
                  best practices.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Security & Technical Features */}
      <section className="py-20">
        <div className="container">
          <div className="mb-16 text-center">
            <Badge variant="outline" className="mb-4">
              Security & Technical
            </Badge>
            <h2 className="text-3xl font-bold sm:text-4xl">Built for enterprise teams</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Enterprise-grade security and modern architecture ensure your prompts are safe and
              your team stays productive.
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 text-primary">
                  <Shield className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">Row-Level Security</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Database-level access control ensures users only see and interact with authorized
                  data. No application bugs can bypass security.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 text-primary">
                  <Lock className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">Secure Authentication</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Industry-standard authentication with encrypted passwords, secure sessions, and
                  automatic token refresh.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 text-primary">
                  <Zap className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">Fast Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Server-side rendering, optimized queries, and edge deployment ensure sub-second
                  page loads worldwide.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 text-primary">
                  <Clock className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">Real-Time Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Changes sync instantly across all users. No refresh needed to see new prompts or
                  updated ratings.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 text-primary">
                  <Layers className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">Modern Stack</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Built with Next.js 14, TypeScript, and Supabase. Modern tools that scale with your
                  team.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 text-primary">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">Analytics Ready</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Built-in tracking for usage patterns, popular prompts, and team engagement.
                  Understand how your library is used.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-gradient-to-b from-primary/5 to-secondary/5 py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Ready to explore all features?</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Start using Atlas today and experience every feature firsthand. No credit card
              required.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="gap-2" asChild>
                <Link href="/signup">
                  <Zap className="h-4 w-4" />
                  Start Using Atlas Free
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/use-cases">See Use Cases</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  highlights,
}: {
  icon: React.ReactNode
  title: string
  description: string
  highlights: string[]
}) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 text-primary">
          {icon}
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {highlights.map((highlight) => (
            <li key={highlight} className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
              {highlight}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
