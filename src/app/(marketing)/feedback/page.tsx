'use client'

import { useState } from 'react'

import Link from 'next/link'

import { ArrowRight, CheckCircle2, Lightbulb, MessageSquare, Send, Shield } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'

type FeedbackType = 'feature' | 'improvement' | 'bug' | 'general'

export default function FeedbackPage() {
  const { toast } = useToast()
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('general')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!message.trim()) {
      toast({
        title: 'Message required',
        description: 'Please enter your feedback before submitting.',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: feedbackType,
          message: message.trim(),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit feedback')
      }

      setIsSubmitted(true)
      toast({
        title: 'Feedback submitted',
        description: 'Thank you for helping us improve Atlas!',
      })
    } catch {
      toast({
        title: 'Submission failed',
        description: 'Please try again or email us directly.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const feedbackTypes = [
    { value: 'feature', label: 'Feature Request', description: 'Suggest a new feature' },
    { value: 'improvement', label: 'Improvement', description: 'Enhance existing features' },
    { value: 'bug', label: 'Bug Report', description: 'Report an issue' },
    { value: 'general', label: 'General Feedback', description: 'Share your thoughts' },
  ]

  if (isSubmitted) {
    return (
      <div className="flex flex-col">
        <section className="relative overflow-hidden bg-gradient-to-b from-primary-light/30 via-background to-background py-20 dark:from-navy dark:via-background">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5" />
          <div className="container relative">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                <CheckCircle2 className="h-8 w-8 text-success" />
              </div>
              <h1 className="mb-4 text-3xl font-bold">Thank You!</h1>
              <p className="mb-8 text-lg text-muted-foreground">
                Your feedback has been submitted anonymously. We appreciate you taking the time to
                help us improve Atlas.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button asChild>
                  <Link href="/about">
                    Back to About
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsSubmitted(false)
                    setMessage('')
                    setFeedbackType('general')
                  }}
                >
                  Submit More Feedback
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-light/30 via-background to-background pb-12 pt-16 dark:from-navy dark:via-background">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5" />
        <div className="container relative">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary" className="mb-6">
              <MessageSquare className="mr-1 h-3 w-3" />
              Share Your Thoughts
            </Badge>

            <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Help Us Improve Atlas
            </h1>

            <p className="text-lg text-muted-foreground">
              Your feedback shapes the future of Atlas. Tell us what&apos;s working, what
              isn&apos;t, and what you&apos;d like to see next.
            </p>
          </div>
        </div>
      </section>

      {/* Feedback Form */}
      <section className="pb-20">
        <div className="container">
          <div className="mx-auto max-w-2xl">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  Submit Feedback
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  All feedback is anonymous - we don&apos;t collect any personal information.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="feedback-type">Feedback Type</Label>
                    <Select
                      value={feedbackType}
                      onValueChange={(value) => setFeedbackType(value as FeedbackType)}
                    >
                      <SelectTrigger id="feedback-type" className="w-full">
                        <SelectValue placeholder="Select feedback type" />
                      </SelectTrigger>
                      <SelectContent>
                        {feedbackTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex flex-col">
                              <span>{type.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      {feedbackTypes.find((t) => t.value === feedbackType)?.description}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Your Feedback</Label>
                    <Textarea
                      id="message"
                      placeholder="Share your thoughts, suggestions, or report issues..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="min-h-[200px]"
                      required
                    />
                    <p className="text-sm text-muted-foreground">
                      Be as specific as possible. Include examples if relevant.
                    </p>
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      'Submitting...'
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Submit Feedback
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Info Cards */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="pt-6">
                  <h3 className="mb-2 font-semibold">What happens next?</h3>
                  <p className="text-sm text-muted-foreground">
                    Your feedback is sent directly to the development team. We review all
                    submissions and prioritize based on community impact.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-secondary/20 bg-secondary/5">
                <CardContent className="pt-6">
                  <h3 className="mb-2 font-semibold">Check the Roadmap</h3>
                  <p className="text-sm text-muted-foreground">
                    See what features are coming next on our{' '}
                    <Link href="/roadmap" className="text-primary hover:underline">
                      public roadmap
                    </Link>
                    . Your feedback helps shape these priorities.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
