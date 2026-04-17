import Link from 'next/link'

import { ArrowRight, Layers, Users, ShieldCheck, Zap } from 'lucide-react'

import { Button } from '@/components/ui/button'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Atlas',
  description:
    'Learn about Atlas — an internal skill and MCP marketplace built by Scorpion, for Scorpion.',
}

const values = [
  {
    icon: Users,
    title: 'Built by Scorpion, for Scorpion',
    description:
      'Atlas is an internal tool created by the Scorpion team to solve our own workflow challenges. Every feature reflects the real needs of our SEO, content, and marketing teams.',
  },
  {
    icon: Zap,
    title: 'Speed over ceremony',
    description:
      'Find what you need in seconds, not minutes. One-click copy, instant search, and zero configuration overhead. We optimize for the time between "I need this" and "I have this."',
  },
  {
    icon: ShieldCheck,
    title: 'Quality through community',
    description:
      'Every skill and MCP config is reviewed before it reaches the library. Community ratings surface the best content, and admin moderation keeps quality high.',
  },
]

export default function AboutPage() {
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
              About Atlas
            </h1>
            <p className="mt-6 text-lg text-white/50 sm:text-xl">
              An internal skill and MCP marketplace built by Scorpion, for Scorpion.
            </p>
          </div>
        </div>
      </section>

      {/* What is Atlas */}
      <section className="bg-background border-t border-white/[0.06] py-24 lg:py-32">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-12 lg:grid-cols-5 lg:gap-16">
            <div className="lg:col-span-3">
              <h2 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
                What is Atlas?
              </h2>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-white/45">
                <p>
                  Atlas is Scorpion&apos;s internal marketplace for skills, MCP server
                  configurations, and prompt templates. It gives every team member a single,
                  searchable hub for the tools and workflows they use every day.
                </p>
                <p>
                  Instead of passing configs through Slack, digging through Google Docs, or
                  rebuilding what a teammate already perfected, you search Atlas. Find what you
                  need, copy it, and get back to work.
                </p>
                <p>
                  Skills are reusable instruction files written in Markdown. MCP configs are
                  pre-built JSON definitions for Model Context Protocol servers — the external tools
                  that extend your capabilities. Prompts are templated, variable-supported text
                  blocks for common tasks.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center lg:col-span-2">
              <div className="flex h-32 w-32 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03]">
                <Layers className="text-primary h-16 w-16 opacity-60" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why it exists */}
      <section className="bg-background border-t border-white/[0.06] py-24 lg:py-32">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Why Atlas exists
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/45">
            As Scorpion&apos;s teams adopted more tools and workflows, the same problem kept
            surfacing: people were building the same configurations independently, and there was no
            central place to share what worked. Atlas was created to fix that — a single source of
            truth for the team&apos;s collective knowledge.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-background border-t border-white/[0.06] py-24 lg:py-32">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Our principles
          </h2>

          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            {values.map((value) => (
              <div key={value.title} className="text-left">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04]">
                  <value.icon className="text-primary h-5 w-5" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-white">{value.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/40">{value.description}</p>
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
            Join the team on Atlas
          </h2>
          <p className="mx-auto mt-4 max-w-md text-lg text-white/45">
            Create your account and start discovering what your teammates have built.
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
