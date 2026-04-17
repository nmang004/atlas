import Link from 'next/link'

import {
  Library,
  Server,
  FileText,
  GitBranch,
  ShieldCheck,
  SearchCode,
  ThumbsUp,
  Moon,
  ArrowRight,
  Sparkles,
  Code2,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Features',
  description:
    'Explore the full feature set of Atlas — skill library, MCP configs, prompt library, GitHub import, admin moderation, and more.',
}

const featuresGroupA = [
  {
    icon: Library,
    color: 'from-blue-500 to-cyan-400',
    iconBg: 'bg-blue-500/10 border-blue-500/20',
    title: 'Skill Library',
    description:
      'Browse a curated collection of skill files organized by category. Filter by tags, search by name, and discover new skills your teammates have shared. Each skill includes full documentation, install instructions, and community ratings.',
  },
  {
    icon: Server,
    color: 'from-violet-500 to-purple-400',
    iconBg: 'bg-violet-500/10 border-violet-500/20',
    title: 'MCP Server Configs',
    description:
      'Pre-configured MCP server setups for tools like SEMRush, GA4, Ahrefs, and more. Each listing includes the JSON config, required environment variables, and step-by-step install instructions. Copy and paste — done.',
  },
  {
    icon: FileText,
    color: 'from-emerald-500 to-teal-400',
    iconBg: 'bg-emerald-500/10 border-emerald-500/20',
    title: 'Prompt Library',
    description:
      'A shared library of reusable prompts with variable support. Fill in template variables, copy the assembled prompt, and use it immediately. Perfect for standardizing team workflows across common tasks.',
  },
  {
    icon: GitBranch,
    color: 'from-orange-500 to-amber-400',
    iconBg: 'bg-orange-500/10 border-orange-500/20',
    title: 'GitHub Import',
    description:
      'Import skills directly from GitHub repositories. Point Atlas to a repo and pull in skill files automatically. Keep your library in sync with your version-controlled configurations and update with a single click.',
  },
]

const featuresGroupB = [
  {
    icon: ShieldCheck,
    color: 'from-rose-500 to-pink-400',
    iconBg: 'bg-rose-500/10 border-rose-500/20',
    title: 'Admin Moderation',
    description:
      'Admins can review, approve, or reject community-contributed skills and MCP configs. Maintain quality standards and keep the library clean with built-in moderation tools and a structured review queue.',
  },
  {
    icon: SearchCode,
    color: 'from-sky-500 to-blue-400',
    iconBg: 'bg-sky-500/10 border-sky-500/20',
    title: 'Cmd+K Search',
    description:
      'Instant global search across skills, MCPs, and prompts. Hit Cmd+K from anywhere in the app to find what you need. Results are ranked by relevance with category badges for quick identification.',
  },
  {
    icon: ThumbsUp,
    color: 'from-yellow-500 to-orange-400',
    iconBg: 'bg-yellow-500/10 border-yellow-500/20',
    title: 'Voting & Quality',
    description:
      'Upvote and downvote skills and configs to surface the best content. Community ratings help the team identify high-quality, battle-tested configurations at a glance without manual curation overhead.',
  },
  {
    icon: Moon,
    color: 'from-indigo-500 to-violet-400',
    iconBg: 'bg-indigo-500/10 border-indigo-500/20',
    title: 'Dark Mode',
    description:
      'Full dark mode support with the Scorpion navy palette. Toggle between light and dark themes, or follow your system preference. Every component is designed to look sharp in both modes without compromise.',
  },
]

const skillExample = `---
name: seo-technical-audit
description: Run a comprehensive technical SEO audit
category: SEO
tags: [audit, technical, on-page]
version: 1.2.0
author: seo-team
---

# Technical SEO Audit

## Overview
Analyze on-page SEO factors including meta tags,
heading structure, schema markup, and Core Web
Vitals for any given URL.

## Steps
1. Fetch the target URL and parse the DOM
2. Check meta title and description
3. Validate heading hierarchy (H1-H6)
4. Verify schema.org structured data
5. Audit image alt attributes
6. Check canonical and hreflang tags`

export default function FeaturesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
        {/* Background effects */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 right-0 h-[500px] w-[500px] animate-pulse rounded-full bg-[radial-gradient(circle,rgba(109,90,255,0.12)_0%,transparent_70%)]" />
          <div className="absolute bottom-0 -left-32 h-[400px] w-[400px] animate-pulse rounded-full bg-[radial-gradient(circle,rgba(0,127,253,0.1)_0%,transparent_70%)] [animation-delay:1.5s]" />
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
              <Sparkles className="mr-1.5 h-3 w-3" />
              Features
            </Badge>
            <h1 className="font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Everything you need,
              <br />
              <span className="text-gradient">nothing you don&apos;t</span>
            </h1>
            <p className="font-body mt-6 text-lg text-white/50 sm:text-xl">
              Discover, install, share, and manage skills and MCP configurations for your team — all
              from one polished interface.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Cards - Group A */}
      <section className="bg-navy relative py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-2">
            {featuresGroupA.map((feature) => (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04] sm:p-10"
              >
                {/* Hover gradient */}
                <div
                  className={`pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full bg-linear-to-br ${feature.color} opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-[0.07]`}
                />

                <div className="relative">
                  <div
                    className={`mb-6 flex h-12 w-12 items-center justify-center rounded-xl border ${feature.iconBg}`}
                  >
                    <feature.icon className="h-6 w-6 text-white/80" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-white">{feature.title}</h3>
                  <p className="font-body mt-3 leading-relaxed text-white/40">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Example Section */}
      <section className="border-y border-white/[0.06] bg-white/[0.02] py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <Badge variant="outline" className="mb-4 border-white/10 text-white/60">
                <Code2 className="mr-1.5 h-3 w-3" />
                Skill Format
              </Badge>
              <h2 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Simple, readable,
                <br />
                <span className="text-gradient">version-controlled</span>
              </h2>
              <p className="font-body mt-4 text-lg leading-relaxed text-white/40">
                Skills are markdown files with YAML frontmatter. Easy to write, easy to review, easy
                to share. No proprietary format — just files your team already knows how to work
                with.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  'YAML frontmatter for metadata and categorization',
                  'Markdown body for instructions and documentation',
                  'Version tracking for iterative improvement',
                  'Import directly from any GitHub repository',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-white/50">
                    <span className="bg-primary mt-1.5 block h-1.5 w-1.5 flex-shrink-0 rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Code block */}
            <div className="relative">
              <div className="from-primary/[0.08] to-secondary/[0.08] absolute -inset-4 rounded-3xl bg-linear-to-br blur-xl" />
              <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-black/40 shadow-2xl">
                {/* Window chrome */}
                <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
                  <div className="h-3 w-3 rounded-full bg-white/10" />
                  <div className="h-3 w-3 rounded-full bg-white/10" />
                  <div className="h-3 w-3 rounded-full bg-white/10" />
                  <span className="ml-3 text-xs text-white/20">seo-technical-audit.md</span>
                </div>
                <div className="overflow-x-auto p-5">
                  <pre className="font-mono text-[13px] leading-relaxed text-white/50">
                    <code>{skillExample}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards - Group B */}
      <section className="bg-navy relative py-20 sm:py-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute bottom-0 left-1/2 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(0,127,253,0.04)_0%,transparent_70%)]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-2">
            {featuresGroupB.map((feature) => (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04] sm:p-10"
              >
                {/* Hover gradient */}
                <div
                  className={`pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full bg-linear-to-br ${feature.color} opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-[0.07]`}
                />

                <div className="relative">
                  <div
                    className={`mb-6 flex h-12 w-12 items-center justify-center rounded-xl border ${feature.iconBg}`}
                  >
                    <feature.icon className="h-6 w-6 text-white/80" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-white">{feature.title}</h3>
                  <p className="font-body mt-3 leading-relaxed text-white/40">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="pointer-events-none absolute inset-0">
          <div className="from-primary/10 to-secondary/10 absolute inset-0 bg-linear-to-br" />
          <div className="absolute top-0 left-1/2 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(0,127,253,0.15)_0%,transparent_70%)]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            See it in action
          </h2>
          <p className="font-body mx-auto mt-4 max-w-xl text-lg text-white/50">
            Sign up and explore the full Atlas experience. Browse skills, install MCP configs, and
            start contributing.
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
              <Link href="/how-it-works">How It Works</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
