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
  Zap,
  Shield,
  GitBranch,
  Command,
  BarChart3,
  Globe,
  Activity,
  Link2,
  FileSearch,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Atlas - Your Team's Skill & MCP Library",
  description:
    'Discover, share, and install skills and MCP configurations for your team. A curated marketplace by Scorpion.',
}

const stats = [
  { label: 'Skills', value: '40+' },
  { label: 'MCP Configs', value: '12' },
  { label: 'Team Members', value: '25+' },
  { label: 'Installs', value: '500+' },
]

const trustedTools = [
  { name: 'SEMRush', icon: BarChart3 },
  { name: 'GA4', icon: Activity },
  { name: 'Ahrefs', icon: Link2 },
  { name: 'Search Console', icon: Globe },
  { name: 'DataForSEO', icon: FileSearch },
]

const bentoFeatures = [
  {
    icon: Library,
    title: 'Skill Library',
    description:
      'Browse a curated collection of skills organized by category — SEO, content, development, analytics, and more.',
    span: 'md:col-span-2',
    snippet: `---\nname: seo-audit\ncategory: SEO\ntags: [audit, technical]\n---\n\n# SEO Audit Skill\nAnalyze on-page factors...`,
  },
  {
    icon: Server,
    title: 'MCP Configs',
    description:
      'Pre-built server configurations for the tools your team uses daily. Ready to paste into your setup.',
    span: 'md:col-span-1',
    snippet: null,
  },
  {
    icon: MousePointerClick,
    title: 'One-Click Install',
    description: 'Copy configs and skill files directly. No manual wiring needed.',
    span: 'md:col-span-1',
    snippet: null,
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description:
      'Share skills across the team, vote on quality, and discover what your teammates have built. Build a shared library everyone benefits from.',
    span: 'md:col-span-2',
    snippet: null,
  },
  {
    icon: GitBranch,
    title: 'GitHub Import',
    description: 'Pull skills directly from repos. Keep your library in sync with version control.',
    span: 'md:col-span-1',
    snippet: null,
  },
  {
    icon: Shield,
    title: 'Admin Moderation',
    description: 'Quality-controlled submissions with admin review and approval workflows.',
    span: 'md:col-span-1',
    snippet: null,
  },
  {
    icon: Command,
    title: 'Cmd+K Search',
    description: 'Instant global search across every skill, MCP, and prompt in the library.',
    span: 'md:col-span-1',
    snippet: null,
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
      'One-click copy to your config. Each listing includes clear instructions and ready-to-paste configurations.',
  },
  {
    icon: Share2,
    step: '03',
    title: 'Contribute',
    description:
      'Share your own skills with the team. Import from GitHub, write from scratch, or adapt existing configs.',
  },
]

export default function MarketingHomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy relative min-h-screen overflow-hidden">
        {/* Animated background elements */}
        <div className="pointer-events-none absolute inset-0">
          {/* Gradient mesh orbs */}
          <div className="absolute -top-40 -left-40 h-[600px] w-[600px] animate-pulse rounded-full bg-[radial-gradient(circle,rgba(0,127,253,0.15)_0%,transparent_70%)]" />
          <div className="absolute top-20 -right-32 h-[500px] w-[500px] animate-pulse rounded-full bg-[radial-gradient(circle,rgba(109,90,255,0.12)_0%,transparent_70%)] [animation-delay:1s]" />
          <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] animate-pulse rounded-full bg-[radial-gradient(circle,rgba(0,127,253,0.08)_0%,transparent_70%)] [animation-delay:2s]" />

          {/* Dot grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />

          {/* Gradient line at top */}
          <div className="from-primary via-secondary absolute top-0 right-0 left-0 h-px bg-linear-to-r to-transparent opacity-40" />
        </div>

        <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-4 pt-24 pb-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            {/* Eyebrow badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-sm">
              <Zap className="text-primary h-3.5 w-3.5" />
              <span className="text-sm font-medium text-white/70">Built for the Scorpion team</span>
            </div>

            <h1 className="font-heading text-5xl leading-[1.1] font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Your team&apos;s
              <br />
              <span className="text-gradient">skill &amp; MCP</span> library
            </h1>

            <p className="font-body mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/50 sm:text-xl">
              One place to discover, share, and install skills and MCP configurations. Stop
              rebuilding what your teammates have already perfected.
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
                variant="ghost"
                className="gap-2 text-white/60 hover:bg-white/5 hover:text-white"
                asChild
              >
                <Link href="/features">Explore Features</Link>
              </Button>
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-20 w-full max-w-3xl">
            <div className="grid grid-cols-2 gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-sm sm:grid-cols-4 sm:gap-0 sm:divide-x sm:divide-white/[0.06] sm:p-0">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col items-center py-4 sm:py-6">
                  <span className="font-heading text-2xl font-bold text-white sm:text-3xl">
                    {stat.value}
                  </span>
                  <span className="mt-1 text-sm text-white/40">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trusted tools strip */}
      <section className="border-y border-white/[0.06] bg-white/[0.02]">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <p className="mb-6 text-center text-xs font-semibold tracking-[0.2em] text-white/30 uppercase">
            Integrations with tools you rely on
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {trustedTools.map((tool) => (
              <div
                key={tool.name}
                className="flex items-center gap-2.5 rounded-full border border-white/[0.06] bg-white/[0.03] px-5 py-2.5 transition-all duration-200 hover:border-white/10 hover:bg-white/[0.05]"
              >
                <tool.icon className="h-4 w-4 text-white/40" />
                <span className="text-sm font-medium text-white/50">{tool.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bento Feature Grid */}
      <section className="bg-navy relative py-24 sm:py-32">
        {/* Background accent */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(0,127,253,0.06)_0%,transparent_70%)]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="mb-4 border-white/10 text-white/60">
              Features
            </Badge>
            <h2 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Everything your team needs
            </h2>
            <p className="font-body mt-4 text-lg text-white/40">
              A curated marketplace of skills, MCP servers, and prompts — built for your workflows.
            </p>
          </div>

          <div className="mt-16 grid gap-4 md:grid-cols-3">
            {bentoFeatures.map((feature) => (
              <div
                key={feature.title}
                className={`group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04] sm:p-8 ${feature.span}`}
              >
                {/* Hover glow */}
                <div className="from-primary/5 to-secondary/5 pointer-events-none absolute inset-0 bg-linear-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04]">
                    <feature.icon className="text-primary h-5 w-5" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-white">{feature.title}</h3>
                  <p className="font-body mt-2 text-sm leading-relaxed text-white/40">
                    {feature.description}
                  </p>

                  {feature.snippet && (
                    <div className="mt-5 overflow-hidden rounded-lg border border-white/[0.06] bg-black/20 p-4">
                      <pre className="text-xs leading-relaxed text-white/40">
                        <code>{feature.snippet}</code>
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-white/[0.06] bg-white/[0.02] py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="mb-4 border-white/10 text-white/60">
              How It Works
            </Badge>
            <h2 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Up and running in minutes
            </h2>
            <p className="font-body mt-4 text-lg text-white/40">
              Three steps from discovery to a working configuration.
            </p>
          </div>

          <div className="relative mt-16">
            {/* Connecting line - desktop only */}
            <div className="absolute top-12 right-24 left-24 hidden h-px bg-linear-to-r from-transparent via-white/10 to-transparent md:block" />

            <div className="grid gap-8 md:grid-cols-3 md:gap-12">
              {steps.map((item) => (
                <div key={item.step} className="relative text-center">
                  {/* Step number circle */}
                  <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center">
                    {/* Outer glow ring */}
                    <div className="from-primary/20 to-secondary/20 absolute inset-0 rounded-full bg-linear-to-br blur-lg" />
                    {/* Circle */}
                    <div className="from-primary to-secondary relative flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br shadow-lg">
                      <item.icon className="h-7 w-7 text-white" />
                    </div>
                  </div>

                  <span className="font-heading text-primary text-xs font-bold tracking-[0.25em] uppercase">
                    Step {item.step}
                  </span>
                  <h3 className="font-heading mt-2 text-xl font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="font-body mt-3 text-sm leading-relaxed text-white/40">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="bg-navy relative py-20 sm:py-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/2 left-1/2 h-[300px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(109,90,255,0.06)_0%,transparent_70%)]" />
        </div>
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.03]">
            <span className="text-2xl">&ldquo;</span>
          </div>
          <blockquote className="font-body text-xl leading-relaxed text-white/60 sm:text-2xl">
            Atlas eliminated the &lsquo;who has the config for X?&rsquo; Slack messages. Now
            everything is in one place, documented and ready to install.
          </blockquote>
          <div className="mt-6 text-sm text-white/30">&mdash; Scorpion SEO Team</div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="from-primary/10 to-secondary/10 absolute inset-0 bg-linear-to-br" />
          <div className="absolute top-0 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(0,127,253,0.2)_0%,transparent_70%)]" />
          <div className="absolute right-0 bottom-0 left-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Ready to get started?
          </h2>
          <p className="font-body mx-auto mt-4 max-w-xl text-lg text-white/50">
            Join your team on Atlas and start discovering skills and MCP configurations today.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="gap-2 px-8" asChild>
              <Link href="/signup">
                Create your account
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="text-white/60 hover:bg-white/5 hover:text-white"
              asChild
            >
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
