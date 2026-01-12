'use client'

import * as Sentry from '@sentry/nextjs'

import { Button } from '@/components/ui/button'

export default function SentryExamplePage() {
  const throwError = () => {
    throw new Error('Sentry Example Frontend Error')
  }

  const triggerServerError = async () => {
    const response = await fetch('/api/sentry-example-api')
    if (!response.ok) {
      console.log('Server error triggered')
    }
  }

  const captureMessage = () => {
    Sentry.captureMessage('Sentry test message from example page')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-2xl font-bold">Sentry Example Page</h1>
      <p className="text-muted-foreground">
        Click the buttons below to test Sentry error tracking
      </p>
      <div className="flex flex-col gap-4">
        <Button onClick={throwError} variant="destructive">
          Throw Client Error
        </Button>
        <Button onClick={triggerServerError} variant="outline">
          Trigger Server Error
        </Button>
        <Button onClick={captureMessage} variant="secondary">
          Capture Message
        </Button>
      </div>
    </div>
  )
}
