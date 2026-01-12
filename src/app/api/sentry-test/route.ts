import { NextResponse } from 'next/server'

import * as Sentry from '@sentry/nextjs'

export async function GET() {
  // Create a span for tracing
  return Sentry.startSpan(
    {
      op: 'test.sentry',
      name: 'Sentry Test API Route',
    },
    () => {
      // Log an info message
      const { logger } = Sentry
      logger.info('Sentry test route was called')

      // Throw a test error to verify Sentry is capturing errors
      throw new Error('Sentry test error - this is intentional to verify the setup works')
    }
  )
}

// Also handle POST for more comprehensive testing
export async function POST() {
  // Manually capture an exception without throwing
  const testError = new Error('Sentry manual capture test')
  const eventId = Sentry.captureException(testError, {
    tags: {
      test: 'manual-capture',
    },
    extra: {
      source: 'sentry-test-route',
      timestamp: new Date().toISOString(),
    },
  })

  return NextResponse.json({
    success: true,
    message: 'Test error sent to Sentry',
    eventId,
  })
}
