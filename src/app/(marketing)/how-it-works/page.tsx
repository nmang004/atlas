import Link from 'next/link'

import { FileCode2, Server, Download, Upload, ShieldCheck, ArrowRight } from 'lucide-react'

import { Button } from '@/components/ui/button'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How It Works',
  description:
    'Learn how Atlas works — what skills and MCPs are, how to install them, how to contribute your own, and the admin workflow.',
}

const concepts = [
  {
    icon: FileCode2,
    title: 'What are Skills?',
    description:
      'Skills are reusable instruction files with YAML frontmatter that define metadata (name, description, category, tags) and a markdown body with the actual instructions. They can be scoped to specific tools or workflows and are designed to be dropped into your setup for immediate use.',
    details: [
      'YAML frontmatter for metadata: name, description, category, tags',
      'Markdown body with detailed instructions and configuration',
      'Categories like SEO, Content, Development, Analytics',
      'Searchable and filterable within the Atlas library',
    ],
  },
  {
    icon: Server,
    title: 'What are MCPs?',
    description:
      'MCP (Model Context Protocol) servers are external tools that provide additional capabilities. Atlas stores pre-configured server definitions — JSON configs with the command, arguments, and environment variables needed to connect to services like SEMRush, GA4, Ahrefs, and more.',
    details: [
      'JSON configuration with command, args, and env vars',
      'Supports stdio, SSE, and HTTP transport types',
      'One listing per server — install instructions included',
      'Environment variable documentation for each config',
    ],
  },
]

const installSteps = [
  {
    step: '01',
    title: 'Find what you need',
    description:
      'Use the search bar, category filters, or browse the full library. Every skill and MCP config has tags, ratings, and descriptions to help you find the right tool.',
  },
  {
    step: '02',
    title: 'Review the details',
    description:
      'Each listing shows the full content, install instructions, required environment variables, and community ratings. Read through before installing.',
  },
  {
    step: '03',
    title: 'Copy and install',
    description:
      'Use the one-click copy button to grab the skill file or MCP config JSON. Paste it into your setup following the provided instructions. Done.',
  },
]

const contributeSteps = [
  {
    step: '01',
    title: 'Create or import',
    description:
      'Write a new skill from scratch using the built-in editor, or import directly from a GitHub repository. Atlas supports both workflows.',
  },
  {
    step: '02',
    title: 'Fill in metadata',
    description:
      'Add a title, description, category, and tags. For MCP configs, include the JSON configuration and any required environment variables.',
  },
  {
    step: '03',
    title: 'Submit for review',
    description:
      'Your contribution goes to the admin review queue. Once approved, it appears in the library for the whole team to discover and use.',
  },
]

export default function HowItWorksPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="bg-primary/20 absolute -top-32 -left-32 h-[400px] w-[400px] rounded-full blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl">
              How It Works
            </h1>
            <p className="mt-4 text-lg text-white/70 sm:text-xl">
              A step-by-step guide to skills, MCP configurations, installation, and contribution.
            </p>
          </div>
        </div>
      </section>

      {/* Concepts */}
      <section className="bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Core Concepts
            </h2>
            <p className="text-muted-foreground mt-4 text-lg">
              Understanding the building blocks of Atlas.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2">
            {concepts.map((concept) => (
              <div key={concept.title} className="border-border/60 bg-card rounded-xl border p-8">
                <div className="bg-primary/10 text-primary mb-5 flex h-12 w-12 items-center justify-center rounded-lg">
                  <concept.icon className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-xl font-semibold">{concept.title}</h3>
                <p className="text-muted-foreground mt-3 leading-relaxed">{concept.description}</p>
                <ul className="mt-5 space-y-2">
                  {concept.details.map((detail) => (
                    <li
                      key={detail}
                      className="text-muted-foreground flex items-start gap-2 text-sm"
                    >
                      <span className="bg-primary mt-1.5 block h-1.5 w-1.5 flex-shrink-0 rounded-full" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Install Steps */}
      <section className="border-border/40 bg-muted/30 border-t py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Download className="text-primary mx-auto mb-4 h-8 w-8" />
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Installing Skills & MCPs
            </h2>
            <p className="text-muted-foreground mt-4 text-lg">
              Three simple steps from discovery to a working configuration.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {installSteps.map((item) => (
              <div key={item.step} className="relative">
                <span className="font-heading text-primary/15 text-5xl font-bold">{item.step}</span>
                <h3 className="font-heading mt-2 text-xl font-semibold">{item.title}</h3>
                <p className="text-muted-foreground mt-2 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contribute Steps */}
      <section className="border-border/40 bg-background border-t py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Upload className="text-secondary mx-auto mb-4 h-8 w-8" />
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Contributing Your Own
            </h2>
            <p className="text-muted-foreground mt-4 text-lg">
              Share what you have built with the rest of the team.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {contributeSteps.map((item) => (
              <div key={item.step} className="relative">
                <span className="font-heading text-secondary/15 text-5xl font-bold">
                  {item.step}
                </span>
                <h3 className="font-heading mt-2 text-xl font-semibold">{item.title}</h3>
                <p className="text-muted-foreground mt-2 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Admin Workflow */}
      <section className="border-border/40 bg-muted/30 border-t py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <ShieldCheck className="text-primary mx-auto mb-4 h-8 w-8" />
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Admin Workflow
            </h2>
            <p className="text-muted-foreground mt-4 text-lg">
              Quality control for team-shared resources.
            </p>
          </div>

          <div className="border-border/60 bg-card mx-auto mt-12 max-w-2xl rounded-xl border p-8">
            <ol className="space-y-6">
              <li className="flex gap-4">
                <span className="bg-primary text-primary-foreground flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold">
                  1
                </span>
                <div>
                  <h4 className="font-heading font-semibold">Team members submit content</h4>
                  <p className="text-muted-foreground mt-1 text-sm">
                    New skills, MCPs, and prompts land in the review queue with a
                    &ldquo;pending&rdquo; status.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="bg-primary text-primary-foreground flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold">
                  2
                </span>
                <div>
                  <h4 className="font-heading font-semibold">Admins review submissions</h4>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Review the content, check quality, verify configurations, and approve or request
                    changes.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="bg-primary text-primary-foreground flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold">
                  3
                </span>
                <div>
                  <h4 className="font-heading font-semibold">Approved content goes live</h4>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Once approved, the skill or MCP config appears in the library for the entire
                    team.
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy relative overflow-hidden py-20 sm:py-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="bg-primary/15 absolute top-0 left-1/2 h-[400px] w-[600px] -translate-x-1/2 rounded-full blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to dive in?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/70">
            Create your account and start exploring the library today.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/signup">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 hover:text-white"
              asChild
            >
              <Link href="/features">View Features</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
