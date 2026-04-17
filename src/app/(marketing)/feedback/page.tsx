'use client'

import { useState } from 'react'

import Link from 'next/link'

import { ArrowRight, Send, CheckCircle2 } from 'lucide-react'

import { Button } from '@/components/ui/button'

export default function FeedbackPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [type, setType] = useState<'feature' | 'improvement' | 'bug' | 'general'>('general')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!message.trim()) {
      return
    }

    setStatus('sending')

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          message: `[${name || 'Anonymous'}] [${email || 'No email'}] ${message}`,
        }),
      })

      if (res.ok) {
        setStatus('sent')
        setName('')
        setEmail('')
        setMessage('')
        setType('general')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

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
              Feedback
            </h1>
            <p className="mt-6 text-lg text-white/50 sm:text-xl">
              Help us make Atlas better. Share your thoughts, report issues, or request features.
            </p>
          </div>
        </div>
      </section>

      {/* Feedback form */}
      <section className="bg-background border-t border-white/[0.06] py-24 lg:py-32">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-xl">
            {status === 'sent' ? (
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-12 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400/70" />
                <h2 className="font-heading mt-4 text-2xl font-bold text-white">
                  Thanks for your feedback
                </h2>
                <p className="mt-2 text-sm text-white/45">
                  We appreciate you taking the time to share your thoughts. Your feedback helps us
                  improve Atlas for the whole team.
                </p>
                <Button
                  variant="outline"
                  className="mt-8 border-white/15 bg-transparent text-white/70 hover:bg-white/5 hover:text-white"
                  onClick={() => setStatus('idle')}
                >
                  Send more feedback
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-white/60">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name (optional)"
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/25 focus:border-white/20 focus:ring-0 focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-white/60">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email (optional)"
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/25 focus:border-white/20 focus:ring-0 focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="type" className="mb-2 block text-sm font-medium text-white/60">
                    Type
                  </label>
                  <select
                    id="type"
                    value={type}
                    onChange={(e) =>
                      setType(e.target.value as 'feature' | 'improvement' | 'bug' | 'general')
                    }
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white focus:border-white/20 focus:ring-0 focus:outline-none"
                  >
                    <option value="general" className="bg-[hsl(var(--background))]">
                      General Feedback
                    </option>
                    <option value="feature" className="bg-[hsl(var(--background))]">
                      Feature Request
                    </option>
                    <option value="improvement" className="bg-[hsl(var(--background))]">
                      Improvement
                    </option>
                    <option value="bug" className="bg-[hsl(var(--background))]">
                      Bug Report
                    </option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-medium text-white/60">
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={5}
                    placeholder="Tell us what's on your mind..."
                    className="w-full resize-none rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/25 focus:border-white/20 focus:ring-0 focus:outline-none"
                  />
                </div>

                {status === 'error' && (
                  <p className="text-sm text-red-400/80">Something went wrong. Please try again.</p>
                )}

                <Button
                  type="submit"
                  size="lg"
                  className="w-full gap-2"
                  disabled={!message.trim() || status === 'sending'}
                >
                  {status === 'sending' ? 'Sending...' : 'Send Feedback'}
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Alternative */}
      <section className="bg-navy relative overflow-hidden py-24 lg:py-32">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,127,253,0.06)_0%,transparent_70%)]" />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
            New to Atlas?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-lg text-white/45">
            Create your account and start exploring skills and MCP configurations.
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
