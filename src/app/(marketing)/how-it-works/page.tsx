import Link from 'next/link'

import {
  FileCode2,
  Server,
  Download,
  Upload,
  ShieldCheck,
  ArrowRight,
  Search,
  Eye,
  Copy,
  PenLine,
  Tag,
  CheckCircle2,
  Layers,
  Plug,
  BookOpen,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How It Works',
  description:
    'Learn how Atlas works — what skills and MCPs are, how to install them, how to contribute your own, and the admin workflow.',
}

const skillDetails = [
  { icon: Tag, text: 'YAML frontmatter for metadata: name, description, category, tags' },
  { icon: BookOpen, text: 'Markdown body with detailed instructions and configuration' },
  { icon: Layers, text: 'Categories like SEO, Content, Development, Analytics' },
  { icon: Search, text: 'Searchable and filterable within the Atlas library' },
]

const mcpDetails = [
  { icon: Plug, text: 'JSON configuration with command, args, and env vars' },
  { icon: Server, text: 'Supports stdio, SSE, and HTTP transport types' },
  { icon: Copy, text: 'One listing per server — install instructions included' },
  { icon: FileCode2, text: 'Environment variable documentation for each config' },
]

const installSteps = [
  {
    step: '01',
    icon: Search,
    title: 'Find what you need',
    description:
      'Use the search bar, category filters, or browse the full library. Every skill and MCP config has tags, ratings, and descriptions.',
  },
  {
    step: '02',
    icon: Eye,
    title: 'Review the details',
    description:
      'Each listing shows full content, install instructions, required environment variables, and community ratings.',
  },
  {
    step: '03',
    icon: Copy,
    title: 'Copy and install',
    description:
      'Use the one-click copy button to grab the skill file or MCP config JSON. Paste it into your setup. Done.',
  },
]

const contributeSteps = [
  {
    step: '01',
    icon: PenLine,
    title: 'Create or import',
    description:
      'Write a new skill from scratch using the built-in editor, or import directly from a GitHub repository.',
  },
  {
    step: '02',
    icon: Tag,
    title: 'Fill in metadata',
    description:
      'Add a title, description, category, and tags. For MCP configs, include the JSON and any required environment variables.',
  },
  {
    step: '03',
    icon: CheckCircle2,
    title: 'Submit for review',
    description:
      'Your contribution goes to the admin review queue. Once approved, it appears in the library for the whole team.',
  },
]

const skillExample = `---
name: content-brief-generator
description: Generate structured content briefs
category: Content
tags: [content, brief, seo]
---

# Content Brief Generator
Create comprehensive content briefs with
target keywords, audience, and structure.`

const mcpExample = `{
  "mcpServers": {
    "semrush": {
      "command": "npx",
      "args": [
        "-y",
        "@anthropic/semrush-mcp"
      ],
      "env": {
        "SEMRUSH_API_KEY": "your-key"
      }
    }
  }
}`

export default function HowItWorksPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 -left-32 h-[500px] w-[500px] animate-pulse rounded-full bg-[radial-gradient(circle,rgba(0,127,253,0.12)_0%,transparent_70%)]" />
          <div className="absolute -right-20 bottom-0 h-[400px] w-[400px] animate-pulse rounded-full bg-[radial-gradient(circle,rgba(109,90,255,0.1)_0%,transparent_70%)] [animation-delay:1.5s]" />
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="mb-6 border-white/10 text-white/60">
              <BookOpen className="mr-1.5 h-3 w-3" />
              How It Works
            </Badge>
            <h1 className="font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              From zero to
              <br />
              <span className="text-gradient">fully configured</span>
            </h1>
            <p className="font-body mt-6 text-lg text-white/50 sm:text-xl">
              A step-by-step guide to skills, MCP configurations, installation, and contributing
              your own.
            </p>
          </div>
        </div>
      </section>

      {/* Core Concepts - Two Column */}
      <section className="bg-navy relative py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Core Concepts
            </h2>
            <p className="font-body mt-4 text-lg text-white/40">
              Understanding the building blocks of Atlas.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Skills card */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04]">
              {/* Header */}
              <div className="border-b border-white/[0.06] p-8 sm:p-10">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10">
                  <FileCode2 className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="font-heading text-2xl font-semibold text-white">What are Skills?</h3>
                <p className="font-body mt-3 leading-relaxed text-white/40">
                  Skills are reusable instruction files with YAML frontmatter that define metadata
                  and a markdown body with the actual instructions. They can be scoped to specific
                  tools or workflows.
                </p>
              </div>

              {/* Details list */}
              <div className="space-y-0 divide-y divide-white/[0.04]">
                {skillDetails.map((detail) => (
                  <div
                    key={detail.text}
                    className="flex items-start gap-4 px-8 py-4 transition-colors hover:bg-white/[0.02] sm:px-10"
                  >
                    <detail.icon className="text-primary mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span className="text-sm text-white/50">{detail.text}</span>
                  </div>
                ))}
              </div>

              {/* Code example */}
              <div className="border-t border-white/[0.06] p-6 sm:p-8">
                <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-black/30">
                  <div className="flex items-center gap-2 border-b border-white/[0.04] px-4 py-2.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
                    <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
                    <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
                    <span className="ml-2 text-[11px] text-white/20">
                      content-brief-generator.md
                    </span>
                  </div>
                  <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-white/40">
                    <code>{skillExample}</code>
                  </pre>
                </div>
              </div>
            </div>

            {/* MCPs card */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04]">
              {/* Header */}
              <div className="border-b border-white/[0.06] p-8 sm:p-10">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10">
                  <Server className="h-6 w-6 text-violet-400" />
                </div>
                <h3 className="font-heading text-2xl font-semibold text-white">What are MCPs?</h3>
                <p className="font-body mt-3 leading-relaxed text-white/40">
                  MCP (Model Context Protocol) servers are external tools that provide additional
                  capabilities. Atlas stores pre-configured server definitions — JSON configs with
                  the command, arguments, and environment variables needed.
                </p>
              </div>

              {/* Details list */}
              <div className="space-y-0 divide-y divide-white/[0.04]">
                {mcpDetails.map((detail) => (
                  <div
                    key={detail.text}
                    className="flex items-start gap-4 px-8 py-4 transition-colors hover:bg-white/[0.02] sm:px-10"
                  >
                    <detail.icon className="text-secondary mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span className="text-sm text-white/50">{detail.text}</span>
                  </div>
                ))}
              </div>

              {/* Code example */}
              <div className="border-t border-white/[0.06] p-6 sm:p-8">
                <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-black/30">
                  <div className="flex items-center gap-2 border-b border-white/[0.04] px-4 py-2.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
                    <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
                    <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
                    <span className="ml-2 text-[11px] text-white/20">.mcp.json</span>
                  </div>
                  <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-white/40">
                    <code>{mcpExample}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Installing Section */}
      <section className="border-y border-white/[0.06] bg-white/[0.02] py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <div className="from-primary to-secondary mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br">
              <Download className="h-7 w-7 text-white" />
            </div>
            <h2 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Installing Skills &amp; MCPs
            </h2>
            <p className="font-body mt-4 text-lg text-white/40">
              Three simple steps from discovery to a working configuration.
            </p>
          </div>

          <div className="relative">
            {/* Connecting line */}
            <div className="absolute top-16 right-24 left-24 hidden h-px bg-linear-to-r from-transparent via-white/10 to-transparent md:block" />

            <div className="grid gap-8 md:grid-cols-3 md:gap-12">
              {installSteps.map((item) => (
                <div key={item.step} className="group relative text-center">
                  {/* Step circle */}
                  <div className="relative mx-auto mb-6 flex h-32 w-32 items-center justify-center">
                    <div className="from-primary/15 to-secondary/15 absolute inset-0 rounded-full bg-linear-to-br blur-xl transition-all duration-300 group-hover:blur-2xl" />
                    <div className="relative flex h-20 w-20 flex-col items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] transition-all duration-300 group-hover:border-white/[0.15] group-hover:bg-white/[0.05]">
                      <item.icon className="text-primary h-7 w-7" />
                    </div>
                  </div>

                  <span className="font-heading text-primary text-xs font-bold tracking-[0.25em] uppercase">
                    Step {item.step}
                  </span>
                  <h3 className="font-heading mt-2 text-xl font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="font-body mt-3 text-sm leading-relaxed text-white/40">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contributing Section */}
      <section className="bg-navy relative py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/2 left-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(109,90,255,0.04)_0%,transparent_70%)]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <div className="from-secondary to-primary mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br">
              <Upload className="h-7 w-7 text-white" />
            </div>
            <h2 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Contributing Your Own
            </h2>
            <p className="font-body mt-4 text-lg text-white/40">
              Share what you&apos;ve built with the rest of the team.
            </p>
          </div>

          <div className="relative">
            <div className="absolute top-16 right-24 left-24 hidden h-px bg-linear-to-r from-transparent via-white/10 to-transparent md:block" />

            <div className="grid gap-8 md:grid-cols-3 md:gap-12">
              {contributeSteps.map((item) => (
                <div key={item.step} className="group relative text-center">
                  <div className="relative mx-auto mb-6 flex h-32 w-32 items-center justify-center">
                    <div className="from-secondary/15 to-primary/15 absolute inset-0 rounded-full bg-linear-to-br blur-xl transition-all duration-300 group-hover:blur-2xl" />
                    <div className="relative flex h-20 w-20 flex-col items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] transition-all duration-300 group-hover:border-white/[0.15] group-hover:bg-white/[0.05]">
                      <item.icon className="text-secondary h-7 w-7" />
                    </div>
                  </div>

                  <span className="font-heading text-secondary text-xs font-bold tracking-[0.25em] uppercase">
                    Step {item.step}
                  </span>
                  <h3 className="font-heading mt-2 text-xl font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="font-body mt-3 text-sm leading-relaxed text-white/40">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Admin Workflow */}
      <section className="border-t border-white/[0.06] bg-white/[0.02] py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <div className="from-primary to-secondary mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br">
              <ShieldCheck className="h-7 w-7 text-white" />
            </div>
            <h2 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Admin Workflow
            </h2>
            <p className="font-body mt-4 text-lg text-white/40">
              Quality control for team-shared resources.
            </p>
          </div>

          <div className="mx-auto max-w-2xl">
            <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              {[
                {
                  num: 1,
                  title: 'Team members submit content',
                  desc: 'New skills, MCPs, and prompts land in the review queue with a "pending" status.',
                },
                {
                  num: 2,
                  title: 'Admins review submissions',
                  desc: 'Review the content, check quality, verify configurations, and approve or request changes.',
                },
                {
                  num: 3,
                  title: 'Approved content goes live',
                  desc: 'Once approved, the skill or MCP config appears in the library for the entire team.',
                },
              ].map((item, i) => (
                <div
                  key={item.num}
                  className={`flex items-start gap-5 px-8 py-6 transition-colors hover:bg-white/[0.02] sm:px-10 ${
                    i < 2 ? 'border-b border-white/[0.06]' : ''
                  }`}
                >
                  <div className="from-primary to-secondary flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-linear-to-br text-sm font-bold text-white shadow-lg">
                    {item.num}
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-white">{item.title}</h4>
                    <p className="font-body mt-1 text-sm text-white/40">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="pointer-events-none absolute inset-0">
          <div className="from-primary/10 to-secondary/10 absolute inset-0 bg-linear-to-br" />
          <div className="absolute top-0 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(0,127,253,0.2)_0%,transparent_70%)]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Ready to dive in?
          </h2>
          <p className="font-body mx-auto mt-4 max-w-xl text-lg text-white/50">
            Create your account and start exploring the library today.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="gap-2 px-8" asChild>
              <Link href="/signup">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="text-white/60 hover:bg-white/5 hover:text-white"
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
