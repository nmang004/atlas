import Link from 'next/link'

import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Code,
  Globe,
  MessageSquare,
  Palette,
  PenTool,
  Search,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  Users,
  Zap,
} from 'lucide-react'

import { AnnouncementBanner } from '@/components/ui/announcement-banner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Use Cases - Atlas Prompt Governance Platform',
  description:
    'Discover how teams use Atlas for SEO, content writing, client communications, technical tasks, creative briefs, and more. Real examples with proven results.',
  openGraph: {
    title: 'Atlas Use Cases - Real Examples for Every Team',
    description:
      'See how teams use Atlas for SEO, content writing, client communications, technical tasks, creative briefs, and more.',
  },
}

export default function UseCasesPage() {
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
              Real-World Examples
            </Badge>

            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Every team finds value
              <br />
              <span className="text-gradient">in their own way</span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              From SEO specialists to developers, from content writers to client success teams—see
              how Atlas transforms AI workflows across every department.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="gap-2" asChild>
                <Link href="/signup">
                  Start Building Your Library
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

      {/* Featured Example Section */}
      <section className="border-y bg-muted/30 py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <Badge variant="default" className="mb-4">
              Featured Example
            </Badge>
            <h2 className="text-3xl font-bold sm:text-4xl">SEO Meta Description Generator</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              One of our most-used prompts. See how Atlas turns a simple task into a consistent,
              high-quality process.
            </p>
          </div>

          <div className="mx-auto max-w-5xl">
            <Card className="overflow-hidden">
              <div className="border-b bg-card p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <Badge>SEO</Badge>
                      <Badge variant="outline">Content</Badge>
                    </div>
                    <h3 className="text-xl font-semibold">Meta Description Generator</h3>
                    <p className="mt-1 text-muted-foreground">
                      Generate compelling meta descriptions that drive clicks
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-sm">
                      <ThumbsUp className="h-4 w-4 text-success" />
                      <span className="font-medium">94%</span>
                    </div>
                    <div className="text-sm text-muted-foreground">127 uses</div>
                  </div>
                </div>
              </div>

              <CardContent className="grid gap-6 p-6 lg:grid-cols-2">
                <div>
                  <h4 className="mb-3 font-semibold">Prompt Template</h4>
                  <div className="rounded-lg bg-muted/50 p-4 font-mono text-sm">
                    <p>Write a meta description for a webpage about:</p>
                    <p className="mt-2">
                      <span className="rounded bg-primary/20 px-1 text-primary">
                        {'{{page_topic}}'}
                      </span>
                    </p>
                    <p className="mt-2">Target keyword:</p>
                    <p>
                      <span className="rounded bg-primary/20 px-1 text-primary">
                        {'{{target_keyword}}'}
                      </span>
                    </p>
                    <p className="mt-2">
                      The meta description should be under 160 characters, include a call to action,
                      and naturally incorporate the target keyword.
                    </p>
                    <p className="mt-2">Tone:</p>
                    <p>
                      <span className="rounded bg-secondary/20 px-1 text-secondary">
                        {'{{tone}}'}
                      </span>
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="mb-3 font-semibold">Fill Variables</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium">Page Topic</label>
                      <div className="rounded-lg border bg-background px-3 py-2 text-sm">
                        Best practices for local SEO in 2025
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Target Keyword</label>
                      <div className="rounded-lg border bg-background px-3 py-2 text-sm">
                        local SEO tips
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Tone</label>
                      <div className="rounded-lg border bg-background px-3 py-2 text-sm">
                        Professional but approachable
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>

              <div className="border-t bg-muted/30 p-6">
                <h4 className="mb-4 font-semibold">Before / After Comparison</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-destructive">
                      <ThumbsDown className="h-4 w-4" />
                      Without Atlas
                    </div>
                    <p className="text-sm text-muted-foreground">
                      &quot;Learn about local SEO. Click here to read more about optimizing your
                      business.&quot;
                    </p>
                    <p className="mt-2 text-xs text-destructive">
                      Generic, no keyword, weak call to action
                    </p>
                  </div>
                  <div className="rounded-lg border border-success/20 bg-success/5 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-success">
                      <ThumbsUp className="h-4 w-4" />
                      With Atlas
                    </div>
                    <p className="text-sm text-muted-foreground">
                      &quot;Master local SEO tips that actually work. Discover proven strategies to
                      boost your business visibility and attract more local customers today.&quot;
                    </p>
                    <p className="mt-2 text-xs text-success">
                      Keyword included, compelling CTA, under 160 chars
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Use Case Categories */}
      <section className="py-20">
        <div className="container">
          <div className="mb-16 text-center">
            <Badge variant="outline" className="mb-4">
              By Department
            </Badge>
            <h2 className="text-3xl font-bold sm:text-4xl">Use cases for every team</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Atlas adapts to your workflow. Here&apos;s how different teams leverage the platform.
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-3">
            <UseCaseCard
              icon={<Search className="h-6 w-6" />}
              title="SEO Teams"
              description="Standardize optimization tasks and maintain consistency across all client work."
              examples={[
                { name: 'Meta description generator', rating: 94 },
                { name: 'Title tag formula', rating: 91 },
                { name: 'Alt text writer', rating: 88 },
                { name: 'Schema markup helper', rating: 85 },
              ]}
              benefits={[
                'Consistent optimization patterns',
                'Faster page-level SEO work',
                'Training for new team members',
              ]}
            />

            <UseCaseCard
              icon={<PenTool className="h-6 w-6" />}
              title="Content Writers"
              description="Produce on-brand content faster with proven prompt structures."
              examples={[
                { name: 'Blog post outline', rating: 92 },
                { name: 'Social media caption', rating: 89 },
                { name: 'Email sequence builder', rating: 87 },
                { name: 'Product description', rating: 86 },
              ]}
              benefits={[
                'Consistent brand voice',
                'Faster first drafts',
                'Reduced revision cycles',
              ]}
            />

            <UseCaseCard
              icon={<MessageSquare className="h-6 w-6" />}
              title="Client Services"
              description="Respond to clients professionally and consistently every time."
              examples={[
                { name: 'Support ticket response', rating: 93 },
                { name: 'Proposal section writer', rating: 90 },
                { name: 'Status update template', rating: 88 },
                { name: 'Meeting summary', rating: 85 },
              ]}
              benefits={[
                'Professional tone always',
                'Faster response times',
                'Consistent quality',
              ]}
            />

            <UseCaseCard
              icon={<Code className="h-6 w-6" />}
              title="Development Teams"
              description="Document, explain, and communicate technical work clearly."
              examples={[
                { name: 'Code explainer', rating: 91 },
                { name: 'Bug report summarizer', rating: 89 },
                { name: 'Documentation writer', rating: 87 },
                { name: 'PR description generator', rating: 84 },
              ]}
              benefits={[
                'Clear technical communication',
                'Faster documentation',
                'Consistent code reviews',
              ]}
            />

            <UseCaseCard
              icon={<Palette className="h-6 w-6" />}
              title="Creative Teams"
              description="Generate ideas and variations that stay on brand."
              examples={[
                { name: 'Ad copy variations', rating: 90 },
                { name: 'Headline generator', rating: 88 },
                { name: 'Campaign ideation', rating: 86 },
                { name: 'Creative brief expander', rating: 83 },
              ]}
              benefits={[
                'Consistent creative direction',
                'More variations faster',
                'Brand guideline adherence',
              ]}
            />

            <UseCaseCard
              icon={<BarChart3 className="h-6 w-6" />}
              title="Research & Analytics"
              description="Transform data into insights with structured analysis prompts."
              examples={[
                { name: 'Competitor summary', rating: 89 },
                { name: 'Trend analysis', rating: 87 },
                { name: 'Report generator', rating: 85 },
                { name: 'Data interpreter', rating: 82 },
              ]}
              benefits={[
                'Structured analysis',
                'Consistent reporting',
                'Faster insights',
              ]}
            />
          </div>
        </div>
      </section>

      {/* Industry Examples */}
      <section className="border-y bg-muted/30 py-20">
        <div className="container">
          <div className="mb-16 text-center">
            <Badge variant="secondary" className="mb-4">
              By Industry
            </Badge>
            <h2 className="text-3xl font-bold sm:text-4xl">Industry-specific applications</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Whether you&apos;re an agency, SaaS company, or enterprise team, Atlas adapts to your
              needs.
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-primary/5 to-secondary/5">
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 text-primary">
                  <Briefcase className="h-6 w-6" />
                </div>
                <CardTitle>Digital Marketing Agencies</CardTitle>
                <CardDescription>
                  Manage prompts across multiple clients while maintaining quality standards.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                    <span className="text-sm text-muted-foreground">
                      Client-specific variables for personalized outputs
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                    <span className="text-sm text-muted-foreground">
                      Consistent deliverable quality across all accounts
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                    <span className="text-sm text-muted-foreground">
                      Faster onboarding for new team members
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                    <span className="text-sm text-muted-foreground">
                      Quality control through voting feedback
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-primary/5 to-secondary/5">
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 text-primary">
                  <Globe className="h-6 w-6" />
                </div>
                <CardTitle>SaaS Companies</CardTitle>
                <CardDescription>
                  Scale content production while maintaining brand consistency.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                    <span className="text-sm text-muted-foreground">
                      Product documentation prompts with version control
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                    <span className="text-sm text-muted-foreground">
                      Support response templates that match tone
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                    <span className="text-sm text-muted-foreground">
                      Marketing content aligned with brand voice
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                    <span className="text-sm text-muted-foreground">
                      Engineering docs that non-technical users understand
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-primary/5 to-secondary/5">
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 text-primary">
                  <Users className="h-6 w-6" />
                </div>
                <CardTitle>Enterprise Teams</CardTitle>
                <CardDescription>
                  Standardize AI usage across large organizations with proper governance.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                    <span className="text-sm text-muted-foreground">
                      Approved prompts that meet compliance requirements
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                    <span className="text-sm text-muted-foreground">
                      Role-based access for different departments
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                    <span className="text-sm text-muted-foreground">
                      Audit trail through voting and usage tracking
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                    <span className="text-sm text-muted-foreground">
                      Centralized management of AI best practices
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-primary/5 to-secondary/5">
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 text-primary">
                  <BookOpen className="h-6 w-6" />
                </div>
                <CardTitle>Educational Institutions</CardTitle>
                <CardDescription>
                  Teach responsible AI usage with curated, vetted prompts.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                    <span className="text-sm text-muted-foreground">
                      Curated prompts that demonstrate best practices
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                    <span className="text-sm text-muted-foreground">
                      Before/after examples for learning
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                    <span className="text-sm text-muted-foreground">
                      Student feedback on prompt effectiveness
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                    <span className="text-sm text-muted-foreground">
                      Consistent learning experience across classes
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Examples Grid */}
      <section className="py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <Badge variant="outline" className="mb-4">
              Quick Examples
            </Badge>
            <h2 className="text-3xl font-bold sm:text-4xl">Prompts that teams love</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Here are some of the highest-rated prompts across all Atlas users.
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <QuickExampleCard
              category="SEO"
              title="Keyword Research Summary"
              description="Synthesize keyword data into actionable recommendations"
              rating={96}
            />
            <QuickExampleCard
              category="Content"
              title="Blog Post Hook Generator"
              description="Create attention-grabbing opening paragraphs"
              rating={94}
            />
            <QuickExampleCard
              category="Email"
              title="Outreach Email Sequence"
              description="Multi-touch email campaigns that convert"
              rating={93}
            />
            <QuickExampleCard
              category="Social"
              title="LinkedIn Post Writer"
              description="Professional posts that drive engagement"
              rating={92}
            />
            <QuickExampleCard
              category="Support"
              title="Ticket Response Template"
              description="Helpful responses for common issues"
              rating={91}
            />
            <QuickExampleCard
              category="Technical"
              title="API Documentation"
              description="Clear, consistent API documentation"
              rating={90}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-gradient-to-b from-primary/5 to-secondary/5 py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Ready to build your prompt library?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Start with templates like these or create your own. Every team&apos;s library is
              unique.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="gap-2" asChild>
                <Link href="/signup">
                  <Zap className="h-4 w-4" />
                  Start Using Atlas Free
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/features">Explore All Features</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function UseCaseCard({
  icon,
  title,
  description,
  examples,
  benefits,
}: {
  icon: React.ReactNode
  title: string
  description: string
  examples: { name: string; rating: number }[]
  benefits: string[]
}) {
  return (
    <Card className="flex flex-col transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 text-primary">
          {icon}
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <div className="mb-4">
          <h4 className="mb-2 text-sm font-medium">Popular Prompts</h4>
          <div className="space-y-1.5">
            {examples.map((example) => (
              <div
                key={example.name}
                className="flex items-center justify-between text-sm text-muted-foreground"
              >
                <span>{example.name}</span>
                <span className="flex items-center gap-1 text-success">
                  <ThumbsUp className="h-3 w-3" />
                  {example.rating}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto border-t pt-4">
          <h4 className="mb-2 text-sm font-medium">Key Benefits</h4>
          <ul className="space-y-1">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-success" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

function QuickExampleCard({
  category,
  title,
  description,
  rating,
}: {
  category: string
  title: string
  description: string
  rating: number
}) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="pt-6">
        <div className="mb-3 flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">
            {category}
          </Badge>
          <div className="flex items-center gap-1 text-sm text-success">
            <ThumbsUp className="h-3.5 w-3.5" />
            {rating}%
          </div>
        </div>
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
