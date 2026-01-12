'use client'

import { Component, type ErrorInfo, type ReactNode } from 'react'

import * as Sentry from '@sentry/nextjs'

import { Button } from '@/components/ui/button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  eventId: string | null
}

export class SentryErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null, eventId: null }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const eventId = Sentry.captureException(error, {
      extra: {
        componentStack: errorInfo.componentStack,
      },
    })
    this.setState({ eventId })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, eventId: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center p-8">
          <div className="mx-auto max-w-md text-center">
            <h2 className="mb-4 text-2xl font-semibold text-foreground">Something went wrong</h2>
            <p className="mb-6 text-muted-foreground">
              An unexpected error occurred. Our team has been notified and is working on a fix.
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={this.handleReset} variant="default">
                Try Again
              </Button>
              <Button onClick={() => window.location.reload()} variant="outline">
                Refresh Page
              </Button>
            </div>
            {this.state.eventId && (
              <p className="mt-4 text-xs text-muted-foreground">
                Error ID: {this.state.eventId}
              </p>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
