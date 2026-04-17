import Link from 'next/link'

import { ArrowRight, Search, FileText, Code, BarChart3, Target } from 'lucide-react'

import { Button } from '@/components/ui/button'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Use Cases',
  description:
    'See how Scorpion teams use Atlas for SEO analysis, content strategy, technical audits, analytics reporting, and competitive intelligence.',
}

const useCases = [
  {
    icon: Search,
    title: 'SEO Analysis',
    description:
      'Run comprehensive domain audits, keyword research, and on-page analysis using preconfigured skills and MCP servers. Pull data from SEMRush, Ahrefs, and Search Console without setup friction.',
    skills: ['seo-technical-audit', 'keyword-research', 'on-page-analyzer'],
    mcps: ['semrush-mcp', 'ahrefs-mcp', 'search-console-mcp'],
  },
  {
    icon: FileText,
    title: 'Content Strategy',
    description:
      'Generate structured content briefs, editorial calendars, and topic clusters. Standardize your content workflow with reusable prompt templates and skill files that keep the whole team aligned.',
    skills: ['content-brief-generator', 'topic-cluster-builder', 'editorial-calendar'],
    mcps: ['ga4-mcp'],
  },
  {
    icon: Code,
    title: 'Technical Audits',
    description:
      "Validate schema markup, check Core Web Vitals, audit heading structures, and analyze site architecture. Skill files that encode your team's technical SEO checklist into repeatable workflows.",
    skills: ['schema-validator', 'cwv-analyzer', 'site-architecture-audit'],
    mcps: ['dataforseo-mcp', 'search-console-mcp'],
  },
  {
    icon: BarChart3,
    title: 'Analytics Reporting',
    description:
      'Pull GA4 reports, set up tracking dashboards, and generate performance summaries. MCP configs that connect directly to your analytics stack with ready-to-use prompt templates for common reports.',
    skills: ['ga4-report-builder', 'performance-summary', 'kpi-tracker'],
    mcps: ['ga4-mcp', 'looker-mcp'],
  },
  {
    icon: Target,
    title: 'Competitive Intelligence',
    description:
      'Monitor competitor rankings, track SERP changes, and benchmark domain authority. Combine multiple data sources through MCP servers and analyze results with structured skill files.',
    skills: ['competitor-analysis', 'serp-tracker', 'domain-benchmark'],
    mcps: ['semrush-mcp', 'ahrefs-mcp', 'dataforseo-mcp'],
  },
]

export default function UseCasesPage() {
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
              Use Cases
            </h1>
            <p className="mt-6 text-lg text-white/50 sm:text-xl">
              How Scorpion teams use Atlas to streamline their daily workflows.
            </p>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="bg-background border-t border-white/[0.06] py-24 lg:py-32">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {useCases.map((uc) => (
              <div
                key={uc.title}
                className="relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 text-left"
              >
                {/* Gradient left border */}
                <div className="absolute top-6 bottom-6 left-0 w-px bg-gradient-to-b from-transparent via-blue-500/40 to-transparent" />

                <div className="flex items-start gap-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04]">
                    <uc.icon className="text-primary h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-heading text-xl font-semibold text-white">{uc.title}</h3>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/40">
                      {uc.description}
                    </p>

                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="mb-2 text-xs font-medium tracking-wide text-white/30 uppercase">
                          Related Skills
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {uc.skills.map((skill) => (
                            <span
                              key={skill}
                              className="rounded-md border border-white/[0.06] bg-white/[0.03] px-2.5 py-1 font-mono text-xs text-white/35"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="mb-2 text-xs font-medium tracking-wide text-white/30 uppercase">
                          MCP Configs
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {uc.mcps.map((mcp) => (
                            <span
                              key={mcp}
                              className="rounded-md border border-white/[0.06] bg-white/[0.03] px-2.5 py-1 font-mono text-xs text-white/35"
                            >
                              {mcp}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
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
            Find the right tools for your workflow
          </h2>
          <p className="mx-auto mt-4 max-w-md text-lg text-white/45">
            Browse the full Atlas library and discover skills and MCP configs tailored to your team.
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
