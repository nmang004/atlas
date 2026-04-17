import Link from 'next/link'

import { ArrowRight, Key, Globe, Sparkles, BarChart3, GitBranch } from 'lucide-react'

import { Button } from '@/components/ui/button'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Roadmap',
  description:
    'See what is coming next for Atlas — planned features, in-progress work, and upcoming improvements.',
}

const items = [
  {
    icon: Key,
    title: 'SSO Integration',
    description:
      'Single sign-on support using Scorpion corporate credentials. Log in once and access Atlas without a separate account or password.',
    status: 'In Progress' as const,
  },
  {
    icon: Globe,
    title: 'Browser Extension',
    description:
      'A Chrome extension that lets you search and install Atlas skills directly from your browser. No need to open the Atlas dashboard — find what you need from any tab.',
    status: 'Planned' as const,
  },
  {
    icon: Sparkles,
    title: 'AI-Powered Suggestions',
    description:
      'Get skill and MCP config recommendations based on your usage patterns, team role, and the tools you use most. Personalized suggestions to help you discover relevant content faster.',
    status: 'Planned' as const,
  },
  {
    icon: BarChart3,
    title: 'Team Analytics',
    description:
      'Dashboard showing which skills and MCPs are most popular, who is contributing the most, and how the library is growing over time. Insights for admins and team leads.',
    status: 'Planned' as const,
  },
  {
    icon: GitBranch,
    title: 'Prompt Versioning',
    description:
      'Version history for prompts and skills. Track changes over time, compare versions, and roll back to previous iterations if needed.',
    status: 'Coming Soon' as const,
  },
]

function getStatusStyle(status: string) {
  switch (status) {
    case 'In Progress':
      return 'border-blue-500/30 bg-blue-500/10 text-blue-400/80'
    case 'Coming Soon':
      return 'border-amber-500/30 bg-amber-500/10 text-amber-400/80'
    case 'Planned':
      return 'border-white/10 bg-white/5 text-white/40'
    default:
      return 'border-white/10 bg-white/5 text-white/40'
  }
}

export default function RoadmapPage() {
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
              Roadmap
            </h1>
            <p className="mt-6 text-lg text-white/50 sm:text-xl">
              What&apos;s coming next for Atlas — planned features and upcoming improvements.
            </p>
          </div>
        </div>
      </section>

      {/* Roadmap items */}
      <section className="bg-background border-t border-white/[0.06] py-24 lg:py-32">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {items.map((item) => (
              <div
                key={item.title}
                className="relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 text-left"
              >
                {/* Gradient left border */}
                <div className="absolute top-6 bottom-6 left-0 w-px bg-gradient-to-b from-transparent via-blue-500/40 to-transparent" />

                <div className="flex items-start gap-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04]">
                    <item.icon className="text-primary h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-heading text-lg font-semibold text-white">
                        {item.title}
                      </h3>
                      <span
                        className={`rounded-md border px-2 py-0.5 text-xs font-medium ${getStatusStyle(item.status)}`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/40">
                      {item.description}
                    </p>
                  </div>
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
            Have a feature request?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-lg text-white/45">
            Let us know what you would like to see in Atlas next.
          </p>
          <div className="mt-10">
            <Button size="lg" className="gap-2 px-8" asChild>
              <Link href="/feedback">
                Send Feedback
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
