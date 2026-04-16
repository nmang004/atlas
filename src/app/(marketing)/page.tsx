import Link from 'next/link'

import {
  Library,
  Server,
  Users,
  MousePointerClick,
  Search,
  Download,
  Share2,
  ArrowRight,
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
      'Browse and install skills for SEO, content, development workflows, and more. Curated by your team.',
  },
  {
    icon: Server,
    title: 'MCP Configurations',
    description:
      'Pre-configured MCP servers for SEMRush, GA4, Ahrefs, and other tools your team relies on daily.',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description:
      'Share skills across the team, vote on quality, and discover community-contributed configurations.',
  },
  {
    icon: MousePointerClick,
    title: 'One-Click Install',
    description: 'Copy configs and skill files directly to your setup. No manual wiring required.',
  },
]

const steps = [
  {
    icon: Search,
    step: '01',
    title: 'Browse',
    description:
      'Find skills and MCP configs for your use case. Filter by category, search by name, or explore curated collections.',
  },
  {
    icon: Download,
    step: '02',
    title: 'Install',
    description:
      'One-click copy to your config. Each listing includes clear install instructions and ready-to-paste configurations.',
  },
  {
    icon: Share2,
    step: '03',
    title: 'Contribute',
    description:
      'Share your own skills with the team. Import from GitHub, write from scratch, or adapt existing configurations.',
  },
]

export default function MarketingHomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy relative overflow-hidden">
        {/* Background gradient accents */}
        <div className="pointer-events-none absolute inset-0">
          <div className="bg-primary/20 absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full blur-3xl" />
          <div className="bg-secondary/20 absolute -right-40 -bottom-40 h-[500px] w-[500px] rounded-full blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Your Team&apos;s <span className="text-gradient">Skill Library</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/70 sm:text-xl">
              Discover, share, and install skills and MCP configurations across your team. One place
              for everything your workflows need.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
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
                <Link href="/login">Browse Skills</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="border-border/40 bg-background border-b py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Everything your team needs
            </h2>
            <p className="text-muted-foreground mt-4 text-lg">
              A curated marketplace of skills, MCP servers, and prompts — built for your workflows.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group border-border/60 bg-card hover:border-primary/40 hover:shadow-primary/5 relative rounded-xl border p-6 transition-all duration-200 hover:shadow-lg"
              >
                <div className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground mb-4 flex h-10 w-10 items-center justify-center rounded-lg transition-colors">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="font-heading text-lg font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/30 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              How it works
            </h2>
            <p className="text-muted-foreground mt-4 text-lg">
              Get up and running in minutes. Browse, install, and contribute.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {steps.map((item) => (
              <div key={item.step} className="relative text-center">
                <div className="from-primary to-secondary mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br text-white">
                  <item.icon className="h-6 w-6" />
                </div>
                <span className="text-primary text-xs font-semibold tracking-widest uppercase">
                  Step {item.step}
                </span>
                <h3 className="font-heading mt-2 text-xl font-semibold">{item.title}</h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy relative overflow-hidden py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="bg-primary/15 absolute top-0 left-1/2 h-[400px] w-[600px] -translate-x-1/2 rounded-full blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to get started?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/70">
            Join your team on Atlas and start discovering skills and MCP configurations today.
          </p>
          <div className="mt-8">
            <Button size="lg" asChild>
              <Link href="/signup">
                Create your account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
