import Link from 'next/link'

import {
  ArrowRight,
  Blocks,
  Brain,
  CheckCircle2,
  Chrome,
  Clock,
  Code2,
  Copy,
  GitBranch,
  Heart,
  LineChart,
  MessageSquare,
  PenTool,
  Rocket,
  Search,
  Share2,
  Smartphone,
  Sparkles,
  Target,
  Users,
  Zap,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Product Roadmap - Upcoming Atlas Features',
  description:
    'See what features are coming to Atlas. From browser extensions to AI-powered suggestions, explore the future of prompt governance.',
  openGraph: {
    title: 'Atlas Roadmap - Upcoming Features',
    description:
      'See what features are coming to Atlas. From browser extensions to AI-powered suggestions, explore the future of prompt governance.',
  },
}

type RoadmapStatus = 'completed' | 'in-progress' | 'planned' | 'considering'

interface RoadmapItem {
  title: string
  description: string
  icon: React.ReactNode
  status: RoadmapStatus
  quarter?: string
}

const roadmapItems: RoadmapItem[] = [
  // Currently Building
  {
    title: 'Favorites Section',
    description:
      'Save your most-used prompts for quick access. Star prompts and view them in a dedicated favorites view.',
    icon: <Heart className="h-5 w-5" />,
    status: 'in-progress',
    quarter: 'Q1 2026',
  },
  {
    title: 'Create Your Own Prompts',
    description:
      'Let users create and save personal prompts. Share them with the team or keep them private for your own use.',
    icon: <PenTool className="h-5 w-5" />,
    status: 'in-progress',
    quarter: 'Q1 2026',
  },
  {
    title: 'Enhanced Search',
    description:
      'Smarter search with filters for rating, recency, and usage. Find the perfect prompt faster with advanced query options.',
    icon: <Search className="h-5 w-5" />,
    status: 'in-progress',
    quarter: 'Q1 2026',
  },
  {
    title: 'Prompt Collections',
    description:
      'Group related prompts into collections. Create workflows like "New Client Onboarding" or "Monthly Reporting" bundles.',
    icon: <Blocks className="h-5 w-5" />,
    status: 'in-progress',
    quarter: 'Q1 2026',
  },
  {
    title: 'Usage Statistics',
    description:
      'See how often prompts are copied and which ones you use most. Personal usage insights on your dashboard.',
    icon: <LineChart className="h-5 w-5" />,
    status: 'in-progress',
    quarter: 'Q1 2026',
  },
  // Planned
  {
    title: 'Browser Extension',
    description:
      'Access Atlas prompts directly from any webpage. Quick search, copy, and paste without leaving your current tab.',
    icon: <Chrome className="h-5 w-5" />,
    status: 'planned',
    quarter: 'Q2 2026',
  },
  {
    title: 'Prompt Analytics Dashboard',
    description:
      'Track which prompts are most popular, usage trends over time, and team adoption metrics.',
    icon: <LineChart className="h-5 w-5" />,
    status: 'planned',
    quarter: 'Q2 2026',
  },
  {
    title: 'Version History',
    description:
      'Track changes to prompts over time. See who made edits, compare versions, and restore previous iterations.',
    icon: <GitBranch className="h-5 w-5" />,
    status: 'planned',
    quarter: 'Q2 2026',
  },
  {
    title: 'Keyboard Shortcuts',
    description:
      'Power user shortcuts for quick navigation, copying, and voting. Speed up your workflow with hotkeys.',
    icon: <Zap className="h-5 w-5" />,
    status: 'planned',
    quarter: 'Q2 2026',
  },
  {
    title: 'Team Workspaces',
    description:
      'Organize prompts by team or department. Set custom permissions and share across workspace boundaries.',
    icon: <Users className="h-5 w-5" />,
    status: 'planned',
    quarter: 'Q3 2026',
  },
  {
    title: 'Prompt Duplication',
    description:
      'Clone existing prompts as a starting point. Quickly create variations without starting from scratch.',
    icon: <Copy className="h-5 w-5" />,
    status: 'planned',
    quarter: 'Q2 2026',
  },
  // Considering
  {
    title: 'AI-Powered Suggestions',
    description:
      'Get intelligent prompt recommendations based on your context, past usage, and team patterns.',
    icon: <Brain className="h-5 w-5" />,
    status: 'considering',
  },
  {
    title: 'API Access',
    description:
      'Programmatic access to your prompt library. Integrate Atlas with your existing tools and workflows.',
    icon: <Code2 className="h-5 w-5" />,
    status: 'considering',
  },
  {
    title: 'Slack & Teams Integration',
    description:
      'Access and share prompts directly from Slack or Microsoft Teams. Quick commands for instant access.',
    icon: <MessageSquare className="h-5 w-5" />,
    status: 'considering',
  },
  {
    title: 'Prompt Templates',
    description:
      'Create reusable templates for common prompt patterns. Build your own framework for consistent outputs.',
    icon: <Blocks className="h-5 w-5" />,
    status: 'considering',
  },
  {
    title: 'Import/Export',
    description:
      'Bulk import prompts from spreadsheets or other tools. Export your library for backup or migration.',
    icon: <Share2 className="h-5 w-5" />,
    status: 'considering',
  },
  {
    title: 'Mobile App',
    description:
      'Native mobile experience for iOS and Android. Access your prompts on the go.',
    icon: <Smartphone className="h-5 w-5" />,
    status: 'considering',
  },
  {
    title: 'Prompt Performance Scoring',
    description:
      'AI-analyzed quality scores based on prompt structure, clarity, and effectiveness patterns.',
    icon: <Target className="h-5 w-5" />,
    status: 'considering',
  },
]

const statusConfig: Record<
  RoadmapStatus,
  { label: string; color: string; bgColor: string; icon: React.ReactNode }
> = {
  completed: {
    label: 'Completed',
    color: 'text-success',
    bgColor: 'bg-success/10',
    icon: <CheckCircle2 className="h-4 w-4" />,
  },
  'in-progress': {
    label: 'In Progress',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    icon: <Rocket className="h-4 w-4" />,
  },
  planned: {
    label: 'Planned',
    color: 'text-secondary',
    bgColor: 'bg-secondary/10',
    icon: <Clock className="h-4 w-4" />,
  },
  considering: {
    label: 'Considering',
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
    icon: <Sparkles className="h-4 w-4" />,
  },
}

export default function RoadmapPage() {
  const groupedItems = {
    'in-progress': roadmapItems.filter((item) => item.status === 'in-progress'),
    planned: roadmapItems.filter((item) => item.status === 'planned'),
    considering: roadmapItems.filter((item) => item.status === 'considering'),
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-light/30 via-background to-background pb-12 pt-16 dark:from-navy dark:via-background">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5" />
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-6">
              <Rocket className="mr-1 h-3 w-3" />
              Product Roadmap
            </Badge>

            <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              The Future of
              <br />
              <span className="text-gradient">Atlas</span>
            </h1>

            <p className="mb-8 text-lg text-muted-foreground">
              See what we&apos;re building next. These features are shaped by user feedback and our
              mission to make prompt governance seamless.
            </p>

            <Button asChild>
              <Link href="/feedback">
                <MessageSquare className="mr-2 h-4 w-4" />
                Share Your Ideas
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Legend */}
      <section className="border-b bg-muted/30 py-4">
        <div className="container">
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
            {Object.entries(statusConfig).map(([status, config]) => (
              <div key={status} className="flex items-center gap-2">
                <div className={`flex h-6 w-6 items-center justify-center rounded-full ${config.bgColor} ${config.color}`}>
                  {config.icon}
                </div>
                <span className="text-sm font-medium">{config.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap Sections */}
      <section className="py-16">
        <div className="container">
          <div className="mx-auto max-w-4xl space-y-16">
            {/* In Progress */}
            <div>
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Rocket className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Currently Building</h2>
                  <p className="text-muted-foreground">Features actively in development</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {groupedItems['in-progress'].map((item) => (
                  <RoadmapCard key={item.title} item={item} />
                ))}
              </div>
            </div>

            {/* Planned */}
            <div>
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Coming Soon</h2>
                  <p className="text-muted-foreground">On the roadmap for this year</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {groupedItems.planned.map((item) => (
                  <RoadmapCard key={item.title} item={item} />
                ))}
              </div>
            </div>

            {/* Considering */}
            <div>
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Under Consideration</h2>
                  <p className="text-muted-foreground">Ideas we&apos;re exploring</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {groupedItems.considering.map((item) => (
                  <RoadmapCard key={item.title} item={item} compact />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-gradient-to-b from-primary/5 to-secondary/5 py-16">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-2xl font-bold">Have an idea?</h2>
            <p className="mb-6 text-muted-foreground">
              Your feedback directly influences our roadmap. Tell us what features would make Atlas
              more valuable for you.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild>
                <Link href="/feedback">
                  <Zap className="mr-2 h-4 w-4" />
                  Submit Feedback
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/changelog">
                  View Changelog
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function RoadmapCard({ item, compact = false }: { item: RoadmapItem; compact?: boolean }) {
  const config = statusConfig[item.status]

  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className={compact ? 'pb-2' : ''}>
        <div className="flex items-start justify-between gap-2">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${config.bgColor} ${config.color}`}>
            {item.icon}
          </div>
          {item.quarter && (
            <Badge variant="outline" className="shrink-0 text-xs">
              {item.quarter}
            </Badge>
          )}
        </div>
        <CardTitle className={compact ? 'text-base' : 'text-lg'}>{item.title}</CardTitle>
      </CardHeader>
      <CardContent className={compact ? 'pt-0' : ''}>
        <CardDescription className={compact ? 'text-sm' : ''}>
          {item.description}
        </CardDescription>
      </CardContent>
    </Card>
  )
}
