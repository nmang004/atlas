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
} from 'lucide-react'

import { Button } from '@/components/ui/button'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Features',
  description:
    'Explore the full feature set of Atlas — skill library, MCP configs, prompt library, GitHub import, admin moderation, and more.',
}

const features = [
  {
    icon: Library,
    title: 'Skill Library',
    description:
      'Browse a curated collection of skill files organized by category. Filter by tags, search by name, and discover new skills your teammates have shared. Each skill includes documentation, install instructions, and community ratings.',
  },
  {
    icon: Server,
    title: 'MCP Server Configs',
    description:
      'Pre-configured MCP server setups for tools like SEMRush, GA4, Ahrefs, and more. Each listing includes the JSON config, required environment variables, and step-by-step install instructions. Copy and paste into your setup.',
  },
  {
    icon: FileText,
    title: 'Prompt Library',
    description:
      'A shared library of reusable prompts with variable support. Fill in template variables, copy the assembled prompt, and use it immediately. Perfect for standardizing team workflows across common tasks.',
  },
  {
    icon: GitBranch,
    title: 'GitHub Import',
    description:
      'Import skills directly from GitHub repositories. Point Atlas to a repo and pull in skill files automatically. Keep your library in sync with version control and update with a single click.',
  },
  {
    icon: ShieldCheck,
    title: 'Admin Moderation',
    description:
      'Admins can review, approve, or reject community-contributed skills and MCP configs. Maintain quality standards with built-in moderation tools and a structured review queue.',
  },
  {
    icon: SearchCode,
    title: 'Cmd+K Search',
    description:
      'Instant global search across skills, MCPs, and prompts. Hit Cmd+K from anywhere in the app to find what you need. Results are ranked by relevance with clear category labels.',
  },
  {
    icon: ThumbsUp,
    title: 'Voting & Quality',
    description:
      'Upvote and downvote skills and configs to surface the best content. Community ratings help the team identify high-quality, battle-tested configurations at a glance.',
  },
  {
    icon: Moon,
    title: 'Dark Mode',
    description:
      'Full dark mode support with the Scorpion navy palette. Toggle between light and dark themes, or follow your system preference. Every component is designed to look sharp in both modes.',
  },
]

export default function FeaturesPage() {
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
              Features
            </h1>
            <p className="mt-6 text-lg text-white/50 sm:text-xl">
              Everything you need to discover, install, share, and manage skills and MCP
              configurations — nothing you don&apos;t.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="bg-background border-t border-white/[0.06] py-24 lg:py-32">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 text-left transition-all duration-200 hover:border-white/[0.12] hover:shadow-lg hover:shadow-black/10"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04]">
                  <feature.icon className="text-primary h-5 w-5" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/40">{feature.description}</p>
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
            See it in action
          </h2>
          <p className="mx-auto mt-4 max-w-md text-lg text-white/45">
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
              variant="outline"
              className="border-white/15 bg-transparent text-white/70 hover:bg-white/5 hover:text-white"
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
