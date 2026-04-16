import Link from 'next/link'

import {
  ArrowRight,
  CheckCircle2,
  ClipboardCopy,
  Copy,
  FileSearch,
  Lightbulb,
  MessageSquare,
  MousePointer,
  Search,
  Sparkles,
  TextCursor,
  ThumbsDown,
  ThumbsUp,
  TrendingUp,
  Vote,
  Zap,
} from 'lucide-react'

import { AnnouncementBanner } from '@/components/ui/announcement-banner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How It Works - Atlas Prompt Governance Platform',
  description:
    'Learn how Atlas works in 4 simple steps: find prompts, fill variables, copy with one click, and vote on quality. See the complete workflow.',
  openGraph: {
    title: 'How Atlas Works - Simple Workflow, Powerful Results',
    description:
      'Find prompts, fill variables, copy with one click, and vote on quality. See the complete workflow.',
  },
}

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col">
      <AnnouncementBanner
        version="v1.1 Released"
        message="Check out the new changelog and see what's new!"
        linkText="View changelog"
        linkHref="/changelog"
      />

      {/* Hero Section */}
      <section className="from-primary-light/30 via-background to-background dark:from-navy dark:via-background relative overflow-hidden bg-linear-to-b pt-16 pb-16">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5" />
        <div className="relative container">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-6">
              <Sparkles className="mr-1 h-3 w-3" />
              Simple Workflow
            </Badge>

            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              From search to AI output
              <br />
              <span className="text-gradient">in under 60 seconds</span>
            </h1>

            <p className="text-muted-foreground mx-auto mb-10 max-w-2xl text-lg sm:text-xl">
              Atlas makes it effortless to find the right prompt, customize it for your needs, and
              contribute to your team&apos;s collective knowledge. Here&apos;s exactly how it works.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="gap-2" asChild>
                <Link href="/signup">
                  Try It Now
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/features">Explore Features</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Workflow Steps */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-5xl">
            {/* Step 1 */}
            <div className="mb-20">
              <div className="mb-8 flex items-center gap-4">
                <div className="from-primary to-secondary flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-linear-to-br text-2xl font-bold text-white shadow-lg">
                  1
                </div>
                <div>
                  <h2 className="text-2xl font-bold sm:text-3xl">Find Your Prompt</h2>
                  <p className="text-muted-foreground">
                    Discover proven prompts in seconds, not minutes
                  </p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <div className="bg-primary/10 text-primary mb-2 flex h-10 w-10 items-center justify-center rounded-lg">
                      <FileSearch className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">Browse Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Navigate through organized categories like SEO, Content, Client Comms, or
                      Technical. Find prompts grouped by purpose.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="bg-primary/10 text-primary mb-2 flex h-10 w-10 items-center justify-center rounded-lg">
                      <Search className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">Search Keywords</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Type what you need and get instant results. Search across titles,
                      descriptions, and content to find matches.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="bg-primary/10 text-primary mb-2 flex h-10 w-10 items-center justify-center rounded-lg">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">Sort by Quality</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      See ratings at a glance. High-performing prompts rise to the top so you can
                      trust what you&apos;re using.
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>

              {/* Visual Example */}
              <div className="bg-card mt-8 overflow-hidden rounded-xl border shadow-sm">
                <div className="bg-muted/50 border-b px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-destructive/60 h-3 w-3 rounded-full" />
                    <div className="bg-warning/60 h-3 w-3 rounded-full" />
                    <div className="bg-success/60 h-3 w-3 rounded-full" />
                    <span className="text-muted-foreground ml-2 text-sm">
                      Atlas - Prompt Library
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="bg-background flex items-center gap-4 rounded-lg border p-3">
                    <Search className="text-muted-foreground h-5 w-5" />
                    <span className="text-muted-foreground">meta description generator...</span>
                  </div>
                  <div className="mt-4 space-y-3">
                    <div className="bg-background flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <div className="font-medium">Meta Description Generator</div>
                        <div className="text-muted-foreground text-sm">SEO • Content</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <ThumbsUp className="text-success h-4 w-4" />
                        <span className="text-success font-medium">94%</span>
                      </div>
                    </div>
                    <div className="bg-muted/30 flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <div className="font-medium">Product Description Writer</div>
                        <div className="text-muted-foreground text-sm">Content • E-commerce</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <ThumbsUp className="text-success h-4 w-4" />
                        <span className="text-success font-medium">89%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="mb-20">
              <div className="mb-8 flex items-center gap-4">
                <div className="from-primary to-secondary flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-linear-to-br text-2xl font-bold text-white shadow-lg">
                  2
                </div>
                <div>
                  <h2 className="text-2xl font-bold sm:text-3xl">Fill in Variables</h2>
                  <p className="text-muted-foreground">
                    Customize the prompt with your specific details
                  </p>
                </div>
              </div>

              <div className="grid gap-8 lg:grid-cols-2">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <div className="bg-primary/10 text-primary mb-2 flex h-10 w-10 items-center justify-center rounded-lg">
                        <TextCursor className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-lg">Text Fields</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>
                        Simple text inputs for names, keywords, topics, and short values. Quick to
                        fill, instant to validate.
                      </CardDescription>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="bg-primary/10 text-primary mb-2 flex h-10 w-10 items-center justify-center rounded-lg">
                        <MessageSquare className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-lg">Text Areas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>
                        Larger inputs for context, background information, or detailed
                        specifications. Room for the details that matter.
                      </CardDescription>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="bg-primary/10 text-primary mb-2 flex h-10 w-10 items-center justify-center rounded-lg">
                        <MousePointer className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-lg">Dropdowns</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>
                        Pre-defined options for common choices like tone, format, or audience.
                        Consistent values every time.
                      </CardDescription>
                    </CardContent>
                  </Card>
                </div>

                {/* Visual Example */}
                <div className="bg-card overflow-hidden rounded-xl border shadow-sm">
                  <div className="bg-muted/50 border-b px-4 py-3">
                    <span className="text-sm font-medium">Fill Variables</span>
                  </div>
                  <div className="space-y-4 p-6">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">
                        Page Topic <span className="text-destructive">*</span>
                      </label>
                      <div className="bg-background rounded-lg border px-3 py-2.5 text-sm">
                        Best practices for local SEO in 2025
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">
                        Target Keyword <span className="text-destructive">*</span>
                      </label>
                      <div className="bg-background rounded-lg border px-3 py-2.5 text-sm">
                        local SEO tips
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">Tone</label>
                      <div className="bg-background flex items-center justify-between rounded-lg border px-3 py-2.5 text-sm">
                        <span>Professional but approachable</span>
                        <svg
                          className="text-muted-foreground h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="bg-success/10 rounded-lg p-3">
                      <div className="text-success flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4" />
                        All required fields filled
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="mb-20">
              <div className="mb-8 flex items-center gap-4">
                <div className="from-primary to-secondary flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-linear-to-br text-2xl font-bold text-white shadow-lg">
                  3
                </div>
                <div>
                  <h2 className="text-2xl font-bold sm:text-3xl">Copy & Use</h2>
                  <p className="text-muted-foreground">
                    One click copies the complete prompt, ready for any AI tool
                  </p>
                </div>
              </div>

              <Card className="overflow-hidden">
                <div className="bg-muted/50 border-b px-6 py-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Generated Prompt</span>
                    <Button size="sm" className="gap-2">
                      <Copy className="h-4 w-4" />
                      Copy to Clipboard
                    </Button>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm">
                    <p>Write a meta description for a webpage about:</p>
                    <p className="mt-2">
                      <span className="bg-primary/20 text-primary rounded px-1 font-semibold">
                        Best practices for local SEO in 2025
                      </span>
                    </p>
                    <p className="mt-2">Target keyword:</p>
                    <p>
                      <span className="bg-primary/20 text-primary rounded px-1 font-semibold">
                        local SEO tips
                      </span>
                    </p>
                    <p className="mt-2">
                      The meta description should be under 160 characters, include a call to action,
                      and naturally incorporate the target keyword.
                    </p>
                    <p className="mt-2">Tone:</p>
                    <p>
                      <span className="bg-secondary/20 text-secondary rounded px-1 font-semibold">
                        Professional but approachable
                      </span>
                    </p>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-3">
                    <div className="bg-background flex items-center gap-3 rounded-lg border p-4">
                      <ClipboardCopy className="text-primary h-5 w-5" />
                      <div>
                        <div className="text-sm font-medium">Variables Filled</div>
                        <div className="text-muted-foreground text-xs">
                          All placeholders replaced
                        </div>
                      </div>
                    </div>
                    <div className="bg-background flex items-center gap-3 rounded-lg border p-4">
                      <CheckCircle2 className="text-success h-5 w-5" />
                      <div>
                        <div className="text-sm font-medium">Ready to Paste</div>
                        <div className="text-muted-foreground text-xs">Works with any AI tool</div>
                      </div>
                    </div>
                    <div className="bg-background flex items-center gap-3 rounded-lg border p-4">
                      <Zap className="text-warning h-5 w-5" />
                      <div>
                        <div className="text-sm font-medium">Instant Copy</div>
                        <div className="text-muted-foreground text-xs">One-click convenience</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Step 4 */}
            <div>
              <div className="mb-8 flex items-center gap-4">
                <div className="from-primary to-secondary flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-linear-to-br text-2xl font-bold text-white shadow-lg">
                  4
                </div>
                <div>
                  <h2 className="text-2xl font-bold sm:text-3xl">Vote on Quality</h2>
                  <p className="text-muted-foreground">
                    Your feedback keeps the library fresh and effective
                  </p>
                </div>
              </div>

              <div className="grid gap-8 lg:grid-cols-2">
                <div className="space-y-4">
                  <p className="text-muted-foreground text-lg">
                    After using the prompt with your AI tool, come back and cast your vote. Did the
                    prompt produce good results? Your honest feedback helps everyone.
                  </p>

                  <div className="space-y-4">
                    <Card className="border-success/20 bg-success/5">
                      <CardContent className="flex items-start gap-4 pt-6">
                        <div className="bg-success/20 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                          <ThumbsUp className="text-success h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-success font-medium">Positive Vote</div>
                          <p className="text-muted-foreground mt-1 text-sm">
                            The prompt worked well and produced quality output. This vote helps the
                            prompt rank higher.
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-destructive/20 bg-destructive/5">
                      <CardContent className="flex items-start gap-4 pt-6">
                        <div className="bg-destructive/20 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                          <ThumbsDown className="text-destructive h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-destructive font-medium">Negative Vote</div>
                          <p className="text-muted-foreground mt-1 text-sm">
                            The prompt didn&apos;t work as expected. Add optional feedback to help
                            admins understand and fix the issue.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <Card className="overflow-hidden">
                  <CardHeader className="bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Vote className="text-primary h-5 w-5" />
                      <CardTitle className="text-lg">Rate This Prompt</CardTitle>
                    </div>
                    <CardDescription>Did this prompt work well for you?</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <button className="border-success bg-success/5 hover:bg-success/10 flex flex-1 flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors">
                        <ThumbsUp className="text-success h-8 w-8" />
                        <span className="text-success font-medium">It worked!</span>
                      </button>
                      <button className="border-muted bg-background hover:border-destructive hover:bg-destructive/5 flex flex-1 flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors">
                        <ThumbsDown className="text-muted-foreground h-8 w-8" />
                        <span className="text-muted-foreground font-medium">Needs work</span>
                      </button>
                    </div>
                    <div className="bg-muted/30 mt-6 rounded-lg p-4">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="text-primary mt-0.5 h-4 w-4" />
                        <p className="text-muted-foreground text-sm">
                          <strong>Why vote?</strong> Your votes help surface the best prompts and
                          flag ones that need updating. It takes just one click!
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Cycle Section */}
      <section className="bg-muted/30 border-y py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-4">
              The Virtuous Cycle
            </Badge>
            <h2 className="text-3xl font-bold sm:text-4xl">Every use makes the library better</h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg">
              Atlas isn&apos;t just a storage system—it&apos;s a living knowledge base that improves
              with every team member&apos;s contribution.
            </p>

            <div className="mt-12 grid gap-6 md:grid-cols-4">
              <div className="text-center">
                <div className="from-primary/10 to-secondary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br">
                  <Search className="text-primary h-8 w-8" />
                </div>
                <h3 className="font-semibold">Search</h3>
                <p className="text-muted-foreground mt-1 text-sm">Find what you need</p>
              </div>
              <div className="text-center">
                <div className="from-primary/10 to-secondary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br">
                  <Copy className="text-primary h-8 w-8" />
                </div>
                <h3 className="font-semibold">Use</h3>
                <p className="text-muted-foreground mt-1 text-sm">Copy and paste</p>
              </div>
              <div className="text-center">
                <div className="from-primary/10 to-secondary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br">
                  <Vote className="text-primary h-8 w-8" />
                </div>
                <h3 className="font-semibold">Vote</h3>
                <p className="text-muted-foreground mt-1 text-sm">Share your experience</p>
              </div>
              <div className="text-center">
                <div className="from-primary/10 to-secondary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br">
                  <TrendingUp className="text-primary h-8 w-8" />
                </div>
                <h3 className="font-semibold">Improve</h3>
                <p className="text-muted-foreground mt-1 text-sm">Quality rises</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="from-primary/5 to-secondary/5 bg-linear-to-b py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Ready to try it yourself?</h2>
            <p className="text-muted-foreground mt-4 text-lg">
              Experience the Atlas workflow firsthand. From search to AI output in under a minute.
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
