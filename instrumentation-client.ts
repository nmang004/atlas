import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Performance monitoring
  tracesSampleRate: 1.0,

  // Enable logging
  enableLogs: true,

  // Set environment
  environment: process.env.NODE_ENV,

  // Capture console errors as logs
  integrations: [Sentry.consoleLoggingIntegration({ levels: ['error', 'warn'] })],

  // Only send errors in production
  enabled: process.env.NODE_ENV === 'production',

  // Ignore common non-actionable errors
  ignoreErrors: [
    // Browser extensions
    'ResizeObserver loop limit exceeded',
    'ResizeObserver loop completed with undelivered notifications',
    // Network errors
    'Failed to fetch',
    'NetworkError',
    'Load failed',
    // User-cancelled requests
    'AbortError',
  ],
})

// Export for router transition instrumentation
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
