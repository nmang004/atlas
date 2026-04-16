import Link from 'next/link'

import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardCopy,
  Lightbulb,
  RefreshCw,
  Shield,
  Sparkles,
  Target,
  ThumbsDown,
  ThumbsUp,
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
  title: 'About Atlas - AI Prompt Governance Platform for Teams',
  description:
    'Eliminate AI output variance with Atlas. A living prompt library with crowdsourced quality voting, variable injection, and team-wide standardization.',
  openGraph: {
    title: 'Atlas - AI Prompt Governance Platform',
    description:
      'Eliminate AI output variance with Atlas. A living prompt library with crowdsourced quality voting, variable injection, and team-wide standardization.',
  },
}

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      <AnnouncementBanner
        version="v1.1 Released"
        message="Check out the new changelog and see what's new!"
        linkText="View changelog"
        linkHref="/changelog"
      />
      {/* Hero Section */}
      <section className="from-primary-light/30 via-background to-background dark:from-navy dark:via-background relative overflow-hidden bg-linear-to-b pt-16 pb-20">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5" />
        <div className="relative container">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-6">
              <Sparkles className="mr-1 h-3 w-3" />
              Prompt Governance Platform
            </Badge>

            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Stop losing consistency
              <br />
              <span className="text-gradient">across your AI outputs</span>
            </h1>

            <p className="text-muted-foreground mx-auto mb-10 max-w-2xl text-lg sm:text-xl">
              Atlas is a living prompt library that self-maintains through collective verification.
              Store proven prompts, inject variables on-the-fly, and ensure every team member
              produces consistent, high-quality AI work.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="gap-2" asChild>
                <Link href="/signup">
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/how-it-works">See How It Works</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4">
              <div>
                <div className="text-primary text-3xl font-bold">50%</div>
                <div className="text-muted-foreground text-sm">Less output variance</div>
              </div>
              <div>
                <div className="text-primary text-3xl font-bold">3x</div>
                <div className="text-muted-foreground text-sm">Faster prompt discovery</div>
              </div>
              <div>
                <div className="text-primary text-3xl font-bold">0</div>
                <div className="text-muted-foreground text-sm">Stale prompts tolerated</div>
              </div>
              <div>
                <div className="text-primary text-3xl font-bold">100%</div>
                <div className="text-muted-foreground text-sm">Team alignment</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="bg-muted/30 border-y py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <Badge variant="outline" className="mb-4">
                The Problem
              </Badge>
              <h2 className="text-3xl font-bold sm:text-4xl">
                Your team&apos;s prompts are scattered everywhere
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Card className="border-destructive/20 bg-destructive/5">
                <CardHeader>
                  <div className="bg-destructive/10 mb-2 flex h-10 w-10 items-center justify-center rounded-lg">
                    <RefreshCw className="text-destructive h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">Reinventing the Wheel</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Team members write the same prompts from scratch, wasting time and creating
                    inconsistent outputs.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-destructive/20 bg-destructive/5">
                <CardHeader>
                  <div className="bg-destructive/10 mb-2 flex h-10 w-10 items-center justify-center rounded-lg">
                    <Target className="text-destructive h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">Inconsistent Quality</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Without standardized prompts, AI outputs vary wildly between team members,
                    damaging brand consistency.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-destructive/20 bg-destructive/5">
                <CardHeader>
                  <div className="bg-destructive/10 mb-2 flex h-10 w-10 items-center justify-center rounded-lg">
                    <BookOpen className="text-destructive h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">Knowledge Silos</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Best prompts live in individual documents or minds. When someone leaves, that
                    knowledge walks out the door.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <Badge variant="default" className="mb-4">
                The Solution
              </Badge>
              <h2 className="text-3xl font-bold sm:text-4xl">
                A living library that maintains itself
              </h2>
              <p className="text-muted-foreground mt-4 text-lg">
                Atlas turns your scattered prompts into a centralized, self-improving knowledge
                base.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-success/20 bg-success/5">
                <CardHeader>
                  <div className="bg-success/10 mb-2 flex h-10 w-10 items-center justify-center rounded-lg">
                    <CheckCircle2 className="text-success h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">Centralized & Searchable</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    All prompts in one place, organized by category and tags. Find the right prompt
                    in seconds, not minutes.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-success/20 bg-success/5">
                <CardHeader>
                  <div className="bg-success/10 mb-2 flex h-10 w-10 items-center justify-center rounded-lg">
                    <Vote className="text-success h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">Crowdsourced Quality</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Every use includes a vote. Good prompts rise to the top; broken ones get flagged
                    for review automatically.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-success/20 bg-success/5">
                <CardHeader>
                  <div className="bg-success/10 mb-2 flex h-10 w-10 items-center justify-center rounded-lg">
                    <Variable className="text-success h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">Dynamic Variables</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Build prompts with customizable fields. Users fill in their specifics; the
                    structure stays consistent.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-success/20 bg-success/5">
                <CardHeader>
                  <div className="bg-success/10 mb-2 flex h-10 w-10 items-center justify-center rounded-lg">
                    <Lightbulb className="text-success h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">Teaching Examples</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Show before/after examples so team members understand why the prompt works and
                    how to use it correctly.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-muted/30 scroll-mt-20 border-y py-20">
        <div className="container">
          <div className="mb-16 text-center">
            <Badge variant="secondary" className="mb-4">
              Features
            </Badge>
            <h2 className="text-3xl font-bold sm:text-4xl">
              Everything you need for prompt governance
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Variable className="h-6 w-6" />}
              title="Variable Injection"
              description="Define text fields, dropdowns, and text areas. Users customize prompts without touching the core structure."
            />
            <FeatureCard
              icon={<ClipboardCopy className="h-6 w-6" />}
              title="One-Click Copy"
              description="Fill variables, copy with one click, paste into any AI tool. Consistent prompts, zero friction."
            />
            <FeatureCard
              icon={<Vote className="h-6 w-6" />}
              title="Vote at Point of Use"
              description="Every copy triggers a vote prompt. Real feedback from real usage keeps quality high."
            />
            <FeatureCard
              icon={<TrendingUp className="h-6 w-6" />}
              title="Quality Ratings"
              description="See at a glance which prompts perform best. Sort by rating, votes, or freshness."
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6" />}
              title="Stale Detection"
              description="Prompts unused for 60+ days get flagged. Keep your library fresh and relevant."
            />
            <FeatureCard
              icon={<Users className="h-6 w-6" />}
              title="Admin Controls"
              description="Admins create and edit prompts. Review flagged content. Maintain quality standards."
            />
          </div>

          <div className="mt-12 text-center">
            <Button variant="outline" size="lg" className="gap-2" asChild>
              <Link href="/features">
                Explore All Features
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="scroll-mt-20 py-20">
        <div className="container">
          <div className="mb-16 text-center">
            <Badge variant="outline" className="mb-4">
              How It Works
            </Badge>
            <h2 className="text-3xl font-bold sm:text-4xl">Simple workflow, powerful results</h2>
          </div>

          <div className="mx-auto max-w-4xl">
            <div className="relative">
              {/* Connection line */}
              <div className="from-primary via-secondary to-primary absolute top-0 left-8 hidden h-full w-0.5 bg-linear-to-b md:block" />

              <div className="space-y-12">
                <WorkflowStep
                  number={1}
                  title="Find Your Prompt"
                  description="Browse by category, search by keyword, or filter by tags. Find proven prompts in seconds."
                />
                <WorkflowStep
                  number={2}
                  title="Fill in Variables"
                  description="Customize the prompt with your specific details. Client name, project context, tone preferences - whatever the prompt needs."
                />
                <WorkflowStep
                  number={3}
                  title="Copy & Use"
                  description="One click copies the complete prompt with all variables filled in. Paste into ChatGPT, Claude, or any AI tool."
                />
                <WorkflowStep
                  number={4}
                  title="Vote on Quality"
                  description="After using the prompt, give quick feedback. Your vote helps the whole team know which prompts work best."
                />
              </div>
            </div>

            <div className="mt-12 text-center">
              <Button variant="outline" size="lg" className="gap-2" asChild>
                <Link href="/how-it-works">
                  See Detailed Walkthrough
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Example Section */}
      <section id="use-cases" className="bg-muted/30 scroll-mt-20 border-y py-20">
        <div className="container">
          <div className="mb-16 text-center">
            <Badge variant="secondary" className="mb-4">
              Real Examples
            </Badge>
            <h2 className="text-3xl font-bold sm:text-4xl">See Atlas in action</h2>
            <p className="text-muted-foreground mt-4 text-lg">
              Here&apos;s how teams use Atlas to standardize their AI workflows
            </p>
          </div>

          <div className="mx-auto max-w-5xl">
            {/* Example Prompt Card */}
            <Card className="overflow-hidden">
              <div className="bg-card border-b p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <Badge>SEO</Badge>
                      <Badge variant="outline">Content</Badge>
                    </div>
                    <h3 className="text-xl font-semibold">Meta Description Generator</h3>
                    <p className="text-muted-foreground mt-1">
                      Generate compelling meta descriptions that drive clicks
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-sm">
                      <ThumbsUp className="text-success h-4 w-4" />
                      <span className="font-medium">94%</span>
                    </div>
                    <div className="text-muted-foreground text-sm">127 uses</div>
                  </div>
                </div>
              </div>

              <CardContent className="grid gap-6 p-6 lg:grid-cols-2">
                {/* Prompt Template */}
                <div>
                  <h4 className="mb-3 font-semibold">Prompt Template</h4>
                  <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm">
                    <p>Write a meta description for a webpage about:</p>
                    <p className="mt-2">
                      <span className="bg-primary/20 text-primary rounded px-1">
                        {'{{page_topic}}'}
                      </span>
                    </p>
                    <p className="mt-2">Target keyword:</p>
                    <p>
                      <span className="bg-primary/20 text-primary rounded px-1">
                        {'{{target_keyword}}'}
                      </span>
                    </p>
                    <p className="mt-2">
                      The meta description should be under 160 characters, include a call to action,
                      and naturally incorporate the target keyword.
                    </p>
                    <p className="mt-2">Tone:</p>
                    <p>
                      <span className="bg-secondary/20 text-secondary rounded px-1">
                        {'{{tone}}'}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Variable Inputs */}
                <div>
                  <h4 className="mb-3 font-semibold">Fill Variables</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium">Page Topic</label>
                      <div className="bg-background rounded-lg border px-3 py-2 text-sm">
                        Best practices for local SEO in 2024
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Target Keyword</label>
                      <div className="bg-background rounded-lg border px-3 py-2 text-sm">
                        local SEO tips
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Tone</label>
                      <div className="bg-background rounded-lg border px-3 py-2 text-sm">
                        Professional but approachable
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>

              {/* Before/After Examples */}
              <div className="bg-muted/30 border-t p-6">
                <h4 className="mb-4 font-semibold">Before / After Example</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="border-destructive/20 bg-destructive/5 rounded-lg border p-4">
                    <div className="text-destructive mb-2 flex items-center gap-2 text-sm font-medium">
                      <ThumbsDown className="h-4 w-4" />
                      Without Atlas
                    </div>
                    <p className="text-muted-foreground text-sm">
                      &quot;Learn about local SEO. Click here to read more about optimizing your
                      business.&quot;
                    </p>
                    <p className="text-destructive mt-2 text-xs">
                      Generic, no keyword, weak call to action
                    </p>
                  </div>
                  <div className="border-success/20 bg-success/5 rounded-lg border p-4">
                    <div className="text-success mb-2 flex items-center gap-2 text-sm font-medium">
                      <ThumbsUp className="h-4 w-4" />
                      With Atlas
                    </div>
                    <p className="text-muted-foreground text-sm">
                      &quot;Master local SEO tips that actually work. Discover proven strategies to
                      boost your business visibility and attract more local customers today.&quot;
                    </p>
                    <p className="text-success mt-2 text-xs">
                      Keyword included, compelling CTA, under 160 chars
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Use Cases Grid */}
      <section className="py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Perfect for every team use case</h2>
          </div>

          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            <UseCaseCard
              title="Content Writing"
              description="Blog outlines, social posts, email sequences - all with consistent brand voice."
              examples={['Blog post structures', 'Social media captions', 'Email templates']}
            />
            <UseCaseCard
              title="SEO Work"
              description="Meta descriptions, title tags, alt text - optimized and on-brand every time."
              examples={['Meta descriptions', 'Title tag formulas', 'Schema markup']}
            />
            <UseCaseCard
              title="Client Communication"
              description="Responses, proposals, and updates that maintain your agency's professional tone."
              examples={['Ticket responses', 'Proposal sections', 'Status updates']}
            />
            <UseCaseCard
              title="Technical Tasks"
              description="Code reviews, documentation, and technical explanations standardized."
              examples={['Code explanations', 'Bug report summaries', 'Documentation']}
            />
            <UseCaseCard
              title="Creative Briefs"
              description="Campaign ideation, headline generation, and creative direction prompts."
              examples={['Ad copy variations', 'Headline testing', 'Creative concepts']}
            />
            <UseCaseCard
              title="Research & Analysis"
              description="Competitor analysis, market research, and data interpretation frameworks."
              examples={['Competitor summaries', 'Trend analysis', 'Report generation']}
            />
          </div>

          <div className="mt-12 text-center">
            <Button variant="outline" size="lg" className="gap-2" asChild>
              <Link href="/use-cases">
                View All Use Cases
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="from-primary/5 to-secondary/5 border-t bg-linear-to-b py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Ready to standardize your AI workflow?
            </h2>
            <p className="text-muted-foreground mt-4 text-lg">
              Join teams who&apos;ve eliminated prompt chaos and achieved consistent, high-quality
              AI outputs across their entire organization.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="gap-2" asChild>
                <Link href="/signup">
                  <Zap className="h-4 w-4" />
                  Start Using Atlas Free
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/login">Log in to Your Account</Link>
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
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="from-primary/10 to-secondary/10 text-primary mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br">
          {icon}
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardContent>
    </Card>
  )
}

function WorkflowStep({
  number,
  title,
  description,
}: {
  number: number
  title: string
  description: string
}) {
  return (
    <div className="relative flex gap-6">
      <div className="from-primary to-secondary relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-linear-to-br text-2xl font-bold text-white shadow-lg">
        {number}
      </div>
      <div className="pt-3">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-muted-foreground mt-2">{description}</p>
      </div>
    </div>
  )
}

function UseCaseCard({
  title,
  description,
  examples,
}: {
  title: string
  description: string
  examples: string[]
}) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1.5">
          {examples.map((example) => (
            <li key={example} className="text-muted-foreground flex items-center gap-2 text-sm">
              <CheckCircle2 className="text-success h-4 w-4 shrink-0" />
              {example}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
