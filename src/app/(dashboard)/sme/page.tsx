import Link from 'next/link'

import {
  Target,
  FileText,
  Layers,
  Wrench,
  Sparkles,
  BookOpen,
  Hammer,
  ArrowRight,
} from 'lucide-react'

const sections = [
  {
    title: 'Core Principles',
    description: 'Time to Value, E-E-A-T, and the shift from keywords to answers',
    href: '/sme/core-principles/time-to-value',
    icon: Target,
    color: 'bg-blue-500/10 text-blue-600',
  },
  {
    title: 'Page Playbooks',
    description: 'Best practices for Home, Service, and About pages',
    href: '/sme/page-playbooks/home-page',
    icon: FileText,
    color: 'bg-green-500/10 text-green-600',
  },
  {
    title: 'Verticals',
    description: 'Deep dives into Home Services, Medical, and Legal',
    href: '/sme/verticals/home-services',
    icon: Layers,
    color: 'bg-purple-500/10 text-purple-600',
  },
  {
    title: 'Technical',
    description: 'On-page elements, schema markup, image optimization',
    href: '/sme/technical/on-page-elements',
    icon: Wrench,
    color: 'bg-orange-500/10 text-orange-600',
  },
  {
    title: '2025 Trends',
    description: 'AI Overviews, voice search, zero-click strategies',
    href: '/sme/trends-2025/ai-overviews',
    icon: Sparkles,
    color: 'bg-pink-500/10 text-pink-600',
  },
  {
    title: 'Reference',
    description: 'Cheat sheets, checklists, glossary, and templates',
    href: '/sme/reference/cheat-sheet',
    icon: BookOpen,
    color: 'bg-cyan-500/10 text-cyan-600',
  },
]

const tools = [
  {
    title: 'Title Tag Checker',
    description: 'Check your title tag length and preview SERP display',
    href: '/sme/tools/title-checker',
  },
  {
    title: 'Meta Description Checker',
    description: 'Validate meta description length with live preview',
    href: '/sme/tools/meta-checker',
  },
  {
    title: 'Pre-Launch Checklist',
    description: 'Complete SEO audit checklist before going live',
    href: '/sme/tools/checklist',
  },
]

export default function SMEHomePage() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">SEO Content Best Practices</h1>
        <p className="text-xl text-muted-foreground">
          The definitive reference guide for Account Managers and SEO Specialists
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-orange-500/10 px-3 py-1 text-sm font-medium text-orange-600">
            Home Services
          </span>
          <span className="rounded-full bg-teal-500/10 px-3 py-1 text-sm font-medium text-teal-600">
            Medical
          </span>
          <span className="rounded-full bg-purple-500/10 px-3 py-1 text-sm font-medium text-purple-600">
            Legal
          </span>
        </div>
      </div>

      {/* Quick start */}
      <div className="rounded-lg border bg-primary/5 p-6">
        <h2 className="text-lg font-semibold mb-2">Quick Start Guide</h2>
        <p className="text-muted-foreground mb-4">New to the team? Start here:</p>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>
            Read{' '}
            <Link href="/sme/core-principles/time-to-value" className="text-primary hover:underline">
              Core Principles
            </Link>{' '}
            to understand our foundational thinking
          </li>
          <li>
            Skim{' '}
            <Link href="/sme/page-playbooks/home-page" className="text-primary hover:underline">
              Page Playbooks
            </Link>{' '}
            to understand different page types
          </li>
          <li>Deep-dive into your assigned vertical</li>
          <li>
            Print the{' '}
            <Link href="/sme/reference/cheat-sheet" className="text-primary hover:underline">
              Cheat Sheet
            </Link>{' '}
            and keep it handy
          </li>
          <li>
            Use the{' '}
            <Link href="/sme/tools/checklist" className="text-primary hover:underline">
              Pre-Launch Checklist
            </Link>{' '}
            for every project
          </li>
        </ol>
      </div>

      {/* Sections grid */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Documentation</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => (
            <Link
              key={section.title}
              href={section.href}
              className="group rounded-lg border p-4 hover:border-primary/50 hover:bg-primary/5 transition-colors"
            >
              <div
                className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg ${section.color}`}
              >
                <section.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold group-hover:text-primary">{section.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{section.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Tools */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Interactive Tools</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {tools.map((tool) => (
            <Link
              key={tool.title}
              href={tool.href}
              className="group flex items-center justify-between rounded-lg border p-4 hover:border-primary/50 hover:bg-primary/5 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2">
                  <Hammer className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-medium group-hover:text-primary">{tool.title}</h3>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{tool.description}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
          ))}
        </div>
      </div>

      {/* The 80/20 rule */}
      <div className="rounded-lg border-l-4 border-green-500 bg-green-500/10 p-6">
        <h3 className="font-semibold text-green-700 dark:text-green-400 mb-2">
          The 80/20 Rule
        </h3>
        <p className="text-sm text-muted-foreground">
          80% of your SEO impact comes from getting the fundamentals right: clear H1s,
          fast-loading pages, mobile optimization, and content that directly answers user
          questions. Master these before worrying about advanced tactics.
        </p>
      </div>
    </div>
  )
}
