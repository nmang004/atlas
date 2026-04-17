import Link from 'next/link'

import {
  Library,
  Server,
  Users,
  ArrowRight,
  FileText,
  Search,
  BarChart3,
  Globe,
  Target,
} from 'lucide-react'

import { Button } from '@/components/ui/button'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Atlas - Your Team's Skill & MCP Library",
  description:
    'Discover, share, and install skills and MCP configurations for your team. A curated marketplace by Scorpion.',
}

const features = [
  {
    icon: Library,
    title: 'Skills Library',
    description:
      'Browse a curated collection of reusable skill files organized by category. Search, filter, and install in seconds.',
    href: '/features',
  },
  {
    icon: Server,
    title: 'MCP Configs',
    description:
      'Pre-built server configurations for the tools your team uses daily. JSON configs ready to paste into your setup.',
    href: '/features',
  },
  {
    icon: FileText,
    title: 'Prompt Library',
    description:
      'Shared, reusable prompts with variable support. Standardize workflows and ensure consistency across the team.',
    href: '/features',
  },
  {
    icon: Users,
    title: 'Team Contributions',
    description:
      'Share what you build with the team. Import from GitHub, write from scratch, and grow the library together.',
    href: '/features',
  },
]

const useCases = [
  {
    icon: Search,
    title: 'Run SEMRush domain audits',
    description:
      'Preconfigured MCP servers and skill files that let you run full domain audits, keyword research, and backlink analysis without setup friction.',
  },
  {
    icon: BarChart3,
    title: 'Configure GA4 reporting',
    description:
      'Ready-to-use analytics configurations and prompt templates for pulling reports, setting up dashboards, and tracking KPIs.',
  },
  {
    icon: Globe,
    title: 'Standardize content workflows',
    description:
      'Content brief generators, editorial guidelines, and SEO checklist skills that keep your entire team aligned on process.',
  },
  {
    icon: Target,
    title: 'Competitive intelligence',
    description:
      'Skills and MCP configs for competitive analysis — track rankings, monitor SERP changes, and benchmark against competitors.',
  },
]

const integrations = ['SEMRush', 'GA4', 'Ahrefs', 'Search Console', 'DataForSEO']

const mcpSnippet = `{
  "mcpServers": {
    "semrush": {
      "command": "npx",
      "args": ["-y", "@anthropic/semrush-mcp"],
      "env": {
        "SEMRUSH_API_KEY": "your-key"
      }
    }
  }
}`

export default function MarketingHomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy relative overflow-hidden">
        {/* Subtle radial glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,127,253,0.08)_0%,transparent_70%)]" />
        </div>

        <div className="relative mx-auto flex max-w-5xl flex-col items-center px-4 pt-40 pb-16 sm:px-6 lg:px-8 lg:pt-52 lg:pb-20">
          <h1 className="font-heading text-center text-5xl leading-[1.08] font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Your team&apos;s
            <br />
            <span className="text-gradient">skill &amp; MCP</span> library
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-center text-lg leading-relaxed text-white/50">
            One place to discover, share, and install skills and MCP configurations. Stop rebuilding
            what your teammates have already perfected.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <Button size="lg" className="gap-2 px-8" asChild>
              <Link href="/signup">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/15 bg-transparent text-white/70 hover:bg-white/5 hover:text-white"
              asChild
            >
              <Link href="/features">Learn More</Link>
            </Button>
          </div>

          {/* Product screenshot mockup */}
          <div className="mt-16 w-full max-w-4xl">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur sm:p-6">
              {/* Window chrome */}
              <div className="mb-4 flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
                <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
                <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
                <div className="ml-3 h-5 w-48 rounded-md bg-white/[0.04]" />
              </div>
              {/* Fake skill cards grid */}
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { name: 'seo-technical-audit', cat: 'SEO', author: 'seo-team' },
                  { name: 'content-brief-gen', cat: 'Content', author: 'content-team' },
                  { name: 'ga4-reporting', cat: 'Analytics', author: 'analytics-team' },
                  { name: 'keyword-research', cat: 'SEO', author: 'seo-team' },
                  { name: 'competitor-analysis', cat: 'Strategy', author: 'strategy-team' },
                  { name: 'schema-validator', cat: 'Technical', author: 'dev-team' },
                ].map((card) => (
                  <div
                    key={card.name}
                    className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-3"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.04]">
                        <Library className="h-3.5 w-3.5 text-white/30" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-white/50">{card.name}</p>
                        <p className="text-[10px] text-white/25">
                          {card.cat} &middot; {card.author}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Gradient divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      </section>

      {/* What is Atlas? */}
      <section className="bg-background py-24 lg:py-32">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Text */}
            <div>
              <h2 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
                One place for your team&apos;s AI workflows
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-white/45">
                Atlas is an internal library where your team discovers, installs, and shares skill
                files and MCP server configurations. No more Slack messages asking &ldquo;who has
                the config for X?&rdquo; &mdash; everything lives in one searchable, documented hub.
              </p>
            </div>

            {/* Preview cards */}
            <div className="space-y-4">
              {/* Mock skill card — enhanced */}
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04]">
                    <Library className="text-primary h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-heading text-sm font-semibold text-white">
                        seo-technical-audit
                      </p>
                      <span className="rounded border border-white/[0.08] bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-medium text-white/35">
                        Skill
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-white/40">
                      SEO &middot; v1.2.0 &middot; seo-team
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-white/40">
                  Analyze on-page SEO factors including meta tags, heading structure, schema markup,
                  and Core Web Vitals for any given URL.
                </p>
                {/* Rating bar */}
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div
                        key={star}
                        className={`h-1.5 w-4 rounded-sm ${star <= 4 ? 'bg-primary/60' : 'bg-white/10'}`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-white/30">24 installs</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {['audit', 'technical', 'on-page'].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-xs text-white/35"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Mock MCP config snippet */}
              <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02]">
                <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-2.5">
                  <Server className="h-4 w-4 text-white/30" />
                  <span className="text-xs font-medium text-white/40">semrush-mcp</span>
                  <span className="ml-auto rounded border border-white/[0.08] bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-medium text-white/35">
                    MCP
                  </span>
                </div>
                <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-white/40">
                  <code>{mcpSnippet}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features — 2x2 grid */}
      <section className="bg-background border-t border-white/[0.06] py-24 lg:py-32">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Built for your workflow
          </h2>
          <p className="mt-4 max-w-xl text-lg text-white/45">
            Everything your team needs to manage skills and MCP configurations, without the clutter.
          </p>

          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 text-left"
              >
                {/* Gradient left border */}
                <div className="absolute top-4 bottom-4 left-0 w-px bg-gradient-to-b from-transparent via-blue-500/40 to-transparent" />
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04]">
                  <feature.icon className="text-primary h-5 w-5" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/40">{feature.description}</p>
                <Link
                  href={feature.href}
                  className="text-primary/70 hover:text-primary mt-4 inline-flex items-center gap-1 text-sm font-medium transition-colors"
                >
                  Learn more
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Built for SEO & Marketing Teams */}
      <section className="bg-background border-t border-white/[0.06] py-24 lg:py-32">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Built for SEO &amp; marketing teams
          </h2>
          <p className="mt-4 max-w-xl text-lg text-white/45">
            Purpose-built for the workflows Scorpion teams run every day. Not a generic tool store
            &mdash; a focused library for the work that matters.
          </p>

          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {useCases.map((uc) => (
              <div
                key={uc.title}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-left"
              >
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04]">
                  <uc.icon className="h-4 w-4 text-white/50" />
                </div>
                <h3 className="font-heading text-base font-semibold text-white">{uc.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/40">{uc.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Link
              href="/use-cases"
              className="text-primary/70 hover:text-primary inline-flex items-center gap-1 text-sm font-medium transition-colors"
            >
              See all use cases
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="bg-background border-t border-white/[0.06] py-24 lg:py-32">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-lg text-white/45">
            Works with{' '}
            {integrations.map((name, i) => (
              <span key={name}>
                <span className="inline-flex items-center gap-1.5">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-400/50" />
                  <span className="font-medium text-white/65">{name}</span>
                </span>
                {i < integrations.length - 1 ? (
                  <span className="mx-2 text-white/20">&middot;</span>
                ) : null}
              </span>
            ))}
            <span className="mx-2 text-white/20">&middot;</span>
            <span className="text-white/45">and more</span>
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy relative overflow-hidden py-24 lg:py-32">
        {/* Subtle glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,127,253,0.06)_0%,transparent_70%)]" />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to get started?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-lg text-white/45">
            Join your team on Atlas and start discovering skills and MCP configurations today.
          </p>
          <div className="mt-10">
            <Button size="lg" className="gap-2 px-8" asChild>
              <Link href="/signup">
                Create your account
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
