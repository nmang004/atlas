import Link from 'next/link'

import { ArrowRight } from 'lucide-react'

import { Button } from '@/components/ui/button'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Changelog',
  description: 'See what is new in Atlas — release notes, updates, and improvements.',
}

const entries = [
  {
    date: 'April 2026',
    title: 'Atlas Rework: Skills & MCP Marketplace',
    type: 'Major Release' as const,
    description:
      'Complete platform rework. Atlas is now a full-featured marketplace for skills and MCP server configurations. New features include a curated skill library, MCP config listings with install instructions, GitHub import, community voting, admin moderation queue, Cmd+K global search, and a refreshed dark-mode UI.',
    highlights: [
      'Skill library with category browsing, search, and filtering',
      'MCP server config listings with JSON viewer and environment variable documentation',
      'GitHub import — pull skills directly from any repository',
      'Community voting and quality ratings',
      'Admin moderation and review queue',
      'Global Cmd+K search across skills, MCPs, and prompts',
    ],
  },
  {
    date: 'January 2026',
    title: 'SME Knowledge Base',
    type: 'Removed' as const,
    description:
      'Introduced the SME Knowledge Base for subject matter expert documentation. This feature was later removed during the April 2026 rework to focus the platform on skills and MCP configurations.',
    highlights: [],
  },
  {
    date: 'December 2025',
    title: 'Initial Launch: Prompt Library',
    type: 'Launch' as const,
    description:
      'Atlas launched as an internal prompt library for the Scorpion team. The initial release included a shared prompt collection with variable support, copy-to-clipboard, and basic category organization.',
    highlights: [
      'Shared prompt library with template variables',
      'Category-based organization',
      'One-click copy to clipboard',
      'Dark mode with Scorpion navy palette',
    ],
  },
]

function getTypeStyle(type: string) {
  switch (type) {
    case 'Major Release':
      return 'border-blue-500/30 bg-blue-500/10 text-blue-400/80'
    case 'Removed':
      return 'border-white/10 bg-white/5 text-white/40'
    case 'Launch':
      return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400/80'
    default:
      return 'border-white/10 bg-white/5 text-white/40'
  }
}

export default function ChangelogPage() {
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
              Changelog
            </h1>
            <p className="mt-6 text-lg text-white/50 sm:text-xl">
              What&apos;s new in Atlas — release notes, updates, and improvements.
            </p>
          </div>
        </div>
      </section>

      {/* Changelog entries */}
      <section className="bg-background border-t border-white/[0.06] py-24 lg:py-32">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="relative space-y-12">
            {/* Timeline line */}
            <div className="absolute top-0 bottom-0 left-[7px] hidden w-px bg-white/[0.06] sm:block" />

            {entries.map((entry, idx) => (
              <div key={idx} className="relative flex gap-6 sm:gap-8">
                {/* Timeline dot */}
                <div className="hidden sm:block">
                  <div className="bg-primary/60 relative top-2 h-[15px] w-[15px] rounded-full border-2 border-[hsl(var(--background))]" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm font-medium text-white/50">{entry.date}</span>
                    <span
                      className={`rounded-md border px-2 py-0.5 text-xs font-medium ${getTypeStyle(entry.type)}`}
                    >
                      {entry.type}
                    </span>
                  </div>

                  <h3 className="font-heading mt-2 text-xl font-semibold text-white">
                    {entry.title}
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/40">
                    {entry.description}
                  </p>

                  {entry.highlights.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {entry.highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="flex items-start gap-3 text-sm text-white/40"
                        >
                          <span className="bg-primary/50 mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  )}
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
            Try the latest version
          </h2>
          <p className="mx-auto mt-4 max-w-md text-lg text-white/45">
            Sign up and explore everything new in Atlas.
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
