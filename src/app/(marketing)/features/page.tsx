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
      'Browse a curated collection of skill files organized by category. Filter by tags, search by name, and discover new skills your teammates have shared. Each skill includes full documentation and install instructions.',
  },
  {
    icon: Server,
    title: 'MCP Server Configs',
    description:
      'Pre-configured MCP server setups for tools like SEMRush, GA4, Ahrefs, and more. Each listing includes the JSON config, required environment variables, and step-by-step install instructions.',
  },
  {
    icon: FileText,
    title: 'Prompt Library',
    description:
      'A shared library of reusable prompts with variable support. Fill in template variables, copy the assembled prompt, and use it immediately. Great for standardizing team workflows.',
  },
  {
    icon: GitBranch,
    title: 'GitHub Import',
    description:
      'Import skills directly from GitHub repositories. Point Atlas to a repo and pull in skill files automatically. Keep your library in sync with your version-controlled configurations.',
  },
  {
    icon: ShieldCheck,
    title: 'Admin Moderation',
    description:
      'Admins can review, approve, or reject community-contributed skills and MCP configs. Maintain quality standards and keep the library clean with built-in moderation tools.',
  },
  {
    icon: SearchCode,
    title: 'Cmd+K Search',
    description:
      'Instant global search across skills, MCPs, and prompts. Hit Cmd+K from anywhere in the app to find what you need. Results are ranked by relevance with category badges.',
  },
  {
    icon: ThumbsUp,
    title: 'Voting & Quality System',
    description:
      'Upvote and downvote skills and configs to surface the best content. Ratings help the team identify high-quality, battle-tested configurations at a glance.',
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
      <section className="bg-navy relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="bg-secondary/20 absolute -top-32 -right-32 h-[400px] w-[400px] rounded-full blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Features
            </h1>
            <p className="mt-4 text-lg text-white/70 sm:text-xl">
              Everything you need to discover, install, share, and manage skills and MCP
              configurations for your team.
            </p>
          </div>
        </div>
      </section>

      {/* Features Detail Grid */}
      <section className="bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group border-border/60 bg-card hover:border-primary/40 hover:shadow-primary/5 rounded-xl border p-8 transition-all duration-200 hover:shadow-lg"
              >
                <div className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground mb-5 flex h-12 w-12 items-center justify-center rounded-lg transition-colors">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground mt-3 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-border/40 bg-muted/30 border-t py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            See it in action
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-lg">
            Sign up and explore the full Atlas experience. Browse skills, install MCP configs, and
            start contributing.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/signup">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/how-it-works">How It Works</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
