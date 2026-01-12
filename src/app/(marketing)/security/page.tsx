import Link from 'next/link'

import {
  ArrowRight,
  CheckCircle2,
  Database,
  Eye,
  EyeOff,
  Globe,
  Key,
  Lock,
  Network,
  Server,
  Shield,
  ShieldCheck,
  UserCheck,
  Users,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Security & Data Protection - Atlas Platform Security',
  description:
    'Enterprise-grade security for your prompts. TLS encryption, row-level security, SOC 2 compliant infrastructure, and secure authentication.',
  openGraph: {
    title: 'Atlas Security - Enterprise-Grade Data Protection',
    description:
      'Enterprise-grade security for your prompts. TLS encryption, row-level security, SOC 2 compliant infrastructure, and secure authentication.',
  },
}

export default function SecurityPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-light/30 via-background to-background pb-20 pt-16 dark:from-navy dark:via-background">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5" />
        <div className="container relative">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-6">
              <Shield className="mr-1 h-3 w-3" />
              Security & Privacy
            </Badge>

            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Your data is protected
              <br />
              <span className="text-gradient">at every layer</span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Atlas is built with security as a foundation, not an afterthought. From encrypted
              connections to row-level database security, we protect your prompts and data with
              enterprise-grade measures.
            </p>
          </div>
        </div>
      </section>

      {/* Architecture Overview */}
      <section className="border-y bg-muted/30 py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <Badge variant="outline" className="mb-4">
                Architecture
              </Badge>
              <h2 className="text-3xl font-bold sm:text-4xl">How Atlas is built</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                A modern, secure stack designed for reliability and performance
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Frontend</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Hosted on Vercel&apos;s edge network with automatic HTTPS, DDoS protection, and
                    global CDN distribution for fast, secure access worldwide.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Database className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Database</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    PostgreSQL database hosted on Supabase in AWS us-east-2. Data encrypted at rest
                    and in transit with automatic backups.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Key className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Authentication</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Powered by Supabase Auth with secure session management, password hashing using
                    bcrypt, and protection against leaked passwords.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-20">
        <div className="container">
          <div className="mb-16 text-center">
            <Badge variant="secondary" className="mb-4">
              Security Measures
            </Badge>
            <h2 className="text-3xl font-bold sm:text-4xl">Multiple layers of protection</h2>
          </div>

          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
            <SecurityFeatureCard
              icon={<Lock className="h-6 w-6" />}
              title="Encryption in Transit"
              description="All data transmitted between your browser and our servers is encrypted using TLS 1.3. HTTPS is enforced on all connections with HSTS headers."
              details={[
                'TLS 1.3 encryption',
                'HSTS with 1-year max-age',
                'Automatic HTTP to HTTPS redirect',
              ]}
            />

            <SecurityFeatureCard
              icon={<Database className="h-6 w-6" />}
              title="Encryption at Rest"
              description="Your data is encrypted when stored in our database using AES-256 encryption, the same standard used by banks and government agencies."
              details={[
                'AES-256 encryption',
                'Encrypted database backups',
                'Secure key management',
              ]}
            />

            <SecurityFeatureCard
              icon={<UserCheck className="h-6 w-6" />}
              title="Row-Level Security"
              description="Every database table has Row Level Security (RLS) policies that ensure users can only access data they're authorized to see."
              details={[
                'Enforced at database level',
                'Cannot be bypassed by application code',
                'Granular access control per user',
              ]}
            />

            <SecurityFeatureCard
              icon={<Shield className="h-6 w-6" />}
              title="Security Headers"
              description="Comprehensive HTTP security headers protect against common web vulnerabilities including XSS, clickjacking, and content injection."
              details={[
                'Content Security Policy (CSP)',
                'X-Frame-Options: DENY',
                'X-Content-Type-Options: nosniff',
              ]}
            />

            <SecurityFeatureCard
              icon={<Key className="h-6 w-6" />}
              title="Secure Authentication"
              description="Password authentication with industry best practices including secure hashing, rate limiting, and leaked password protection."
              details={[
                'bcrypt password hashing',
                'Leaked password detection (HaveIBeenPwned)',
                'Secure session tokens',
              ]}
            />

            <SecurityFeatureCard
              icon={<Users className="h-6 w-6" />}
              title="Role-Based Access Control"
              description="Two-tier permission system ensures only authorized users can perform administrative actions like creating or editing prompts."
              details={[
                'Admin and User roles',
                'Admins: full CRUD on prompts',
                'Users: view, copy, and vote only',
              ]}
            />
          </div>
        </div>
      </section>

      {/* Data Access Table */}
      <section className="border-y bg-muted/30 py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <Badge variant="outline" className="mb-4">
                Access Control
              </Badge>
              <h2 className="text-3xl font-bold sm:text-4xl">Who can access what</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Clear permission boundaries enforced at the database level
              </p>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="px-6 py-4 text-left font-semibold">Action</th>
                        <th className="px-6 py-4 text-center font-semibold">
                          <div className="flex items-center justify-center gap-2">
                            <EyeOff className="h-4 w-4" />
                            Public
                          </div>
                        </th>
                        <th className="px-6 py-4 text-center font-semibold">
                          <div className="flex items-center justify-center gap-2">
                            <Eye className="h-4 w-4" />
                            Users
                          </div>
                        </th>
                        <th className="px-6 py-4 text-center font-semibold">
                          <div className="flex items-center justify-center gap-2">
                            <ShieldCheck className="h-4 w-4" />
                            Admins
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <AccessRow action="View prompts" public={false} user={true} admin={true} />
                      <AccessRow action="Copy prompts" public={false} user={true} admin={true} />
                      <AccessRow action="Vote on prompts" public={false} user={true} admin={true} />
                      <AccessRow action="Create prompts" public={false} user={false} admin={true} />
                      <AccessRow action="Edit prompts" public={false} user={false} admin={true} />
                      <AccessRow action="Delete prompts" public={false} user={false} admin={true} />
                      <AccessRow
                        action="View own profile"
                        public={false}
                        user={true}
                        admin={true}
                      />
                      <AccessRow
                        action="Edit own profile"
                        public={false}
                        user={true}
                        admin={true}
                      />
                      <AccessRow
                        action="View all users"
                        public={false}
                        user={false}
                        admin={true}
                      />
                      <AccessRow
                        action="Manage categories"
                        public={false}
                        user={false}
                        admin={true}
                      />
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Infrastructure */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <Badge variant="secondary" className="mb-4">
                Infrastructure
              </Badge>
              <h2 className="text-3xl font-bold sm:text-4xl">Built on trusted platforms</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-black">
                      <svg className="h-6 w-6 text-white" viewBox="0 0 76 65" fill="currentColor">
                        <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
                      </svg>
                    </div>
                    <div>
                      <CardTitle>Vercel</CardTitle>
                      <CardDescription>Frontend Hosting</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <ListItem>Global edge network (100+ locations)</ListItem>
                    <ListItem>Automatic SSL/TLS certificates</ListItem>
                    <ListItem>DDoS protection included</ListItem>
                    <ListItem>SOC 2 Type II compliant</ListItem>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-600">
                      <Server className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle>Supabase</CardTitle>
                      <CardDescription>Database & Auth</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <ListItem>Hosted on AWS infrastructure</ListItem>
                    <ListItem>Daily automated backups</ListItem>
                    <ListItem>Point-in-time recovery available</ListItem>
                    <ListItem>SOC 2 Type II compliant</ListItem>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Security Practices */}
      <section className="border-y bg-muted/30 py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <Badge variant="outline" className="mb-4">
                Best Practices
              </Badge>
              <h2 className="text-3xl font-bold sm:text-4xl">How we keep Atlas secure</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-success/10">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                </div>
                <div>
                  <h3 className="font-semibold">No Secrets in Code</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    All API keys and credentials are stored as environment variables, never
                    committed to version control.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-success/10">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                </div>
                <div>
                  <h3 className="font-semibold">Minimal Permissions</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    The application uses the least-privileged API keys required. No service role
                    keys are exposed to the client.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-success/10">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                </div>
                <div>
                  <h3 className="font-semibold">Input Validation</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    All user input is validated on both client and server using Zod schemas to
                    prevent injection attacks.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-success/10">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                </div>
                <div>
                  <h3 className="font-semibold">Regular Updates</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Dependencies are kept up to date to patch known vulnerabilities. Security
                    updates are prioritized.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-success/10">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                </div>
                <div>
                  <h3 className="font-semibold">Error Monitoring</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Application errors are tracked via Sentry, allowing us to quickly identify and
                    resolve issues.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-success/10">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                </div>
                <div>
                  <h3 className="font-semibold">Audit Logging</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    User actions like voting and prompt usage are logged for accountability and
                    debugging purposes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <Network className="mx-auto mb-6 h-12 w-12 text-primary" />
            <h2 className="text-3xl font-bold sm:text-4xl">Questions about security?</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Security is an ongoing commitment. If you have questions or concerns about how we
              protect your data, please reach out to your administrator.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="gap-2" asChild>
                <Link href="/signup">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/about">Learn More About Atlas</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function SecurityFeatureCard({
  icon,
  title,
  description,
  details,
}: {
  icon: React.ReactNode
  title: string
  description: string
  details: string[]
}) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 text-primary">
          {icon}
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {details.map((detail) => (
            <li key={detail} className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
              {detail}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

function AccessRow({
  action,
  public: isPublic,
  user,
  admin,
}: {
  action: string
  public: boolean
  user: boolean
  admin: boolean
}) {
  return (
    <tr>
      <td className="px-6 py-3 text-sm">{action}</td>
      <td className="px-6 py-3 text-center">
        {isPublic ? (
          <CheckCircle2 className="mx-auto h-5 w-5 text-success" />
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </td>
      <td className="px-6 py-3 text-center">
        {user ? (
          <CheckCircle2 className="mx-auto h-5 w-5 text-success" />
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </td>
      <td className="px-6 py-3 text-center">
        {admin ? (
          <CheckCircle2 className="mx-auto h-5 w-5 text-success" />
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </td>
    </tr>
  )
}

function ListItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2 text-sm text-muted-foreground">
      <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
      {children}
    </li>
  )
}
