import Link from 'next/link'

import { Library, Server, Users, ArrowRight } from 'lucide-react'

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
  },
  {
    icon: Server,
    title: 'MCP Configs',
    description:
      'Pre-built server configurations for the tools your team uses daily. JSON configs ready to paste into your setup.',
  },
  {
    icon: Users,
    title: 'Team Contributions',
    description:
      'Share what you build with the team. Import from GitHub, write from scratch, and grow the library together.',
  },
]

const integrations = ['SEMRush', 'GA4', 'Ahrefs', 'Search Console', 'DataForSEO']

export default function MarketingHomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy relative overflow-hidden">
        {/* Subtle radial glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,127,253,0.08)_0%,transparent_70%)]" />
        </div>

        <div className="relative mx-auto flex max-w-5xl flex-col items-center px-4 py-32 pt-40 sm:px-6 lg:px-8 lg:py-44 lg:pt-52">
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
        </div>
      </section>

      {/* What is Atlas? */}
      <section className="bg-background border-t border-white/[0.06] py-24 lg:py-32">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
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

            {/* Mock skill card */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04]">
                  <Library className="text-primary h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-heading text-sm font-semibold text-white">
                    seo-technical-audit
                  </p>
                  <p className="mt-0.5 text-xs text-white/40">
                    SEO &middot; v1.2.0 &middot; seo-team
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-white/40">
                Analyze on-page SEO factors including meta tags, heading structure, schema markup,
                and Core Web Vitals for any given URL.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
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
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-background border-t border-white/[0.06] py-24 lg:py-32">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Built for your workflow
          </h2>
          <p className="mt-4 max-w-xl text-lg text-white/45">
            Everything your team needs to manage skills and MCP configurations, without the clutter.
          </p>

          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="text-left">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04]">
                  <feature.icon className="text-primary h-5 w-5" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/40">{feature.description}</p>
              </div>
            ))}
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
                <span className="font-medium text-white/65">{name}</span>
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
