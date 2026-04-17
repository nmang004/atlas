import Link from 'next/link'

import { ArrowRight } from 'lucide-react'

import { Button } from '@/components/ui/button'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How It Works',
  description:
    'Learn how Atlas works — what skills and MCPs are, how to install them, how to contribute your own, and the admin workflow.',
}

const skillExample = `---
name: content-brief-generator
description: Generate structured content briefs
category: Content
tags: [content, brief, seo]
version: 1.0.0
author: content-team
---

# Content Brief Generator

Create comprehensive content briefs with
target keywords, audience analysis, and
a recommended heading structure.`

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

const installSteps = [
  {
    num: 1,
    title: 'Find what you need',
    description:
      'Use the search bar, category filters, or browse the full library. Every skill and MCP config has tags, ratings, and descriptions to help you find the right one.',
  },
  {
    num: 2,
    title: 'Review the details',
    description:
      'Each listing shows the full content, install instructions, required environment variables, and community ratings. Know exactly what you are getting before you install.',
  },
  {
    num: 3,
    title: 'Copy and install',
    description:
      'Use the one-click copy button to grab the skill file or MCP config JSON. Paste it into your setup and you are done.',
  },
]

const contributeSteps = [
  {
    num: 1,
    title: 'Create or import',
    description:
      'Write a new skill from scratch using the built-in editor, or import directly from a GitHub repository URL.',
  },
  {
    num: 2,
    title: 'Add metadata',
    description:
      'Fill in the title, description, category, and tags. For MCP configs, include the JSON and any required environment variables.',
  },
  {
    num: 3,
    title: 'Submit for review',
    description:
      'Your contribution goes to the admin review queue. Once approved, it appears in the library for the whole team to use.',
  },
]

export default function HowItWorksPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,127,253,0.06)_0%,transparent_70%)]" />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              How it works
            </h1>
            <p className="mt-6 text-lg text-white/50 sm:text-xl">
              A guide to skills, MCP configurations, installation, and contributing your own.
            </p>
          </div>
        </div>
      </section>

      {/* Skills concept */}
      <section className="bg-background border-t border-white/[0.06] py-24 lg:py-32">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Skills
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-white/45">
                Skills are reusable instruction files written in Markdown with YAML frontmatter.
                They define metadata like name, category, and tags at the top, followed by the
                actual instructions in the body. Easy to write, easy to review, easy to share.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  'YAML frontmatter for metadata and categorization',
                  'Markdown body for instructions and documentation',
                  'Version tracking for iterative improvement',
                  'Import directly from any GitHub repository',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-white/45">
                    <span className="bg-primary mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Code block */}
            <div className="overflow-hidden rounded-xl bg-[#0d0b1a]">
              <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
                <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
                <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
                <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
                <span className="ml-2 text-xs text-white/20">content-brief-generator.md</span>
              </div>
              <pre className="overflow-x-auto p-6 font-mono text-sm leading-relaxed text-white/50">
                <code>{skillExample}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* MCPs concept */}
      <section className="bg-background border-t border-white/[0.06] py-24 lg:py-32">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
                MCPs
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-white/45">
                MCP (Model Context Protocol) servers are external tools that provide additional
                capabilities. Atlas stores pre-configured server definitions as JSON &mdash; the
                command, arguments, and environment variables you need to get running.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  'JSON configuration with command, args, and env vars',
                  'Supports stdio, SSE, and HTTP transport types',
                  'Install instructions included with every listing',
                  'Environment variable documentation for each config',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-white/45">
                    <span className="bg-secondary mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Code block */}
            <div className="overflow-hidden rounded-xl bg-[#0d0b1a]">
              <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
                <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
                <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
                <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
                <span className="ml-2 text-xs text-white/20">.mcp.json</span>
              </div>
              <pre className="overflow-x-auto p-6 font-mono text-sm leading-relaxed text-white/50">
                <code>{mcpExample}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Install flow */}
      <section className="bg-background border-t border-white/[0.06] py-24 lg:py-32">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Installing skills &amp; MCPs
          </h2>
          <p className="mt-4 max-w-xl text-lg text-white/45">
            Three steps from discovery to a working configuration.
          </p>

          <div className="mt-12 space-y-8">
            {installSteps.map((step) => (
              <div key={step.num} className="flex gap-6">
                <span className="font-heading text-primary shrink-0 text-2xl font-bold">
                  {step.num}.
                </span>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-white">{step.title}</h3>
                  <p className="mt-1 max-w-xl text-sm leading-relaxed text-white/40">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contribute flow */}
      <section className="bg-background border-t border-white/[0.06] py-24 lg:py-32">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Contributing your own
          </h2>
          <p className="mt-4 max-w-xl text-lg text-white/45">
            Share what you&apos;ve built with the rest of the team.
          </p>

          <div className="mt-12 space-y-8">
            {contributeSteps.map((step) => (
              <div key={step.num} className="flex gap-6">
                <span className="font-heading text-secondary shrink-0 text-2xl font-bold">
                  {step.num}.
                </span>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-white">{step.title}</h3>
                  <p className="mt-1 max-w-xl text-sm leading-relaxed text-white/40">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy relative overflow-hidden py-24 lg:py-32">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,127,253,0.06)_0%,transparent_70%)]" />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to dive in?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-lg text-white/45">
            Create your account and start exploring the library today.
          </p>
          <div className="mt-10">
            <Button size="lg" className="gap-2 px-8" asChild>
              <Link href="/signup">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
