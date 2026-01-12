'use client'

import { useEffect } from 'react'

import * as Sentry from '@sentry/nextjs'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html>
      <body>
        <div
          style={{
            display: 'flex',
            minHeight: '100vh',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <div style={{ maxWidth: '28rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>
              Something went wrong!
            </h2>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>
              A critical error occurred. Our team has been notified.
            </p>
            <button
              onClick={reset}
              style={{
                backgroundColor: '#0070f3',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              Try again
            </button>
            {error.digest && (
              <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#999' }}>
                Error ID: {error.digest}
              </p>
            )}
          </div>
        </div>
      </body>
    </html>
  )
}
