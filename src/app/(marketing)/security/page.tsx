import Link from 'next/link'

import { ArrowRight, ShieldCheck, Lock, Eye, Users, Server, Database } from 'lucide-react'

import { Button } from '@/components/ui/button'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Security',
  description:
    'Learn about Atlas security practices — authentication, row-level security, role-based access, and data handling.',
}

const practices = [
  {
    icon: Lock,
    title: 'Authentication',
    description:
      'Atlas uses Supabase Auth for secure authentication. All sessions are managed with HTTP-only cookies and automatic token refresh. Password hashing, rate limiting, and brute-force protection are handled at the infrastructure level.',
  },
  {
    icon: Database,
    title: 'Row-Level Security (RLS)',
    description:
      'Every database table is protected by Supabase Row-Level Security policies. Users can only access data they are authorized to see. RLS policies are enforced at the database level, not the application level — even direct API access respects these boundaries.',
  },
  {
    icon: Users,
    title: 'Role-Based Access',
    description:
      'Atlas has two roles: admin and user. Admins can approve or reject contributed content, manage categories, and access the moderation queue. Regular users can browse, install, and contribute skills and MCP configs. Role enforcement happens at both the API and database layer.',
  },
  {
    icon: Eye,
    title: 'No External Data Exposure',
    description:
      'Atlas is an internal tool — it is not publicly accessible and does not expose any data externally. All content is shared within the organization only. There are no public APIs, no third-party analytics, and no external data pipelines.',
  },
  {
    icon: Server,
    title: 'Secure MCP Handling',
    description:
      'MCP server configurations stored in Atlas are JSON definitions only — Atlas does not execute MCP servers or handle API keys. Environment variables referenced in configs are documented but never stored. Users manage their own secrets locally.',
  },
  {
    icon: ShieldCheck,
    title: 'Admin Moderation',
    description:
      'All community-contributed content goes through an admin review queue before being published to the library. This ensures quality standards are maintained and prevents malicious or low-quality content from reaching the team.',
  },
]

export default function SecurityPage() {
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
              Security
            </h1>
            <p className="mt-6 text-lg text-white/50 sm:text-xl">
              How Atlas protects your data, manages access, and keeps your team&apos;s content
              secure.
            </p>
          </div>
        </div>
      </section>

      {/* Security practices */}
      <section className="bg-background border-t border-white/[0.06] py-24 lg:py-32">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            {practices.map((practice) => (
              <div
                key={practice.title}
                className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 text-left transition-all duration-200 hover:border-white/[0.12] hover:shadow-lg hover:shadow-black/10"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04]">
                  <practice.icon className="text-primary h-5 w-5" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-white">{practice.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/40">{practice.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="bg-background border-t border-white/[0.06] py-24 lg:py-32">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Security summary
          </h2>
          <div className="mt-8 space-y-4">
            {[
              'All data stored in Supabase with row-level security enabled on every table',
              'Authentication via Supabase Auth with HTTP-only session cookies',
              'Role-based access control — admin and user roles enforced at API and DB layers',
              'Internal tool only — no public endpoints or external data exposure',
              'MCP configs are stored as JSON definitions; Atlas never executes servers or stores API keys',
              'All contributed content is reviewed by admins before publication',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 text-sm text-white/45">
                <span className="bg-primary mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full" />
                {item}
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
            Questions about security?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-lg text-white/45">
            Reach out to the team if you have questions about how Atlas handles data and access.
          </p>
          <div className="mt-10">
            <Button size="lg" className="gap-2 px-8" asChild>
              <Link href="/feedback">
                Contact Us
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
