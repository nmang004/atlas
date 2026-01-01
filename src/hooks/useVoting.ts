'use client'

import { useState, useCallback, useRef } from 'react'

import type { VoteOutcome } from '@/types'

interface UseVotingOptions {
  promptId: string
  onSuccess?: () => void
  onError?: (error: string) => void
  maxRetries?: number
}

interface RetryState {
  attempt: number
  isRetrying: boolean
}

/**
 * Delay helper with exponential backoff
 * Base delay: 1s, Max delay: 8s
 */
function getRetryDelay(attempt: number): number {
  const baseDelay = 1000
  const maxDelay = 8000
  const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay)
  // Add some jitter to prevent thundering herd
  return delay + Math.random() * 500
}

/**
 * Check if error is retryable (network errors, 5xx, rate limits after cooldown)
 */
function isRetryableError(error: unknown, status?: number): boolean {
  // Network errors are retryable
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return true
  }
  // Server errors (5xx) are retryable
  if (status && status >= 500) {
    return true
  }
  // Rate limit (429) - retry after backoff
  if (status === 429) {
    return true
  }
  return false
}

export function useVoting({ promptId, onSuccess, onError, maxRetries = 3 }: UseVotingOptions) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [retryState, setRetryState] = useState<RetryState>({
    attempt: 0,
    isRetrying: false,
  })

  // Use ref to track if component is still mounted
  const isMounted = useRef(true)

  const submitVote = useCallback(
    async (outcome: VoteOutcome, feedback?: string) => {
      setLoading(true)
      setError(null)
      setRetryState({ attempt: 0, isRetrying: false })

      const executeRequest = async (attempt: number): Promise<unknown> => {
        try {
          const response = await fetch(`/api/prompts/${promptId}/vote`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ outcome, feedback }),
          })

          const data = await response.json()

          if (!response.ok) {
            const errorMessage = data.error || 'Failed to submit vote'

            // Check if we should retry
            if (attempt < maxRetries && isRetryableError(null, response.status)) {
              const delay = getRetryDelay(attempt)

              if (isMounted.current) {
                setRetryState({ attempt: attempt + 1, isRetrying: true })
              }

              await new Promise((resolve) => setTimeout(resolve, delay))

              if (isMounted.current) {
                return executeRequest(attempt + 1)
              }
            }

            throw new Error(errorMessage)
          }

          // Success - clear retry state
          if (isMounted.current) {
            setRetryState({ attempt: 0, isRetrying: false })
            setError(null)
          }

          onSuccess?.()
          return data
        } catch (err) {
          // Check if we should retry network errors
          if (attempt < maxRetries && isRetryableError(err)) {
            const delay = getRetryDelay(attempt)

            if (isMounted.current) {
              setRetryState({ attempt: attempt + 1, isRetrying: true })
            }

            await new Promise((resolve) => setTimeout(resolve, delay))

            if (isMounted.current) {
              return executeRequest(attempt + 1)
            }
          }

          // Final error - no more retries
          const message = err instanceof Error ? err.message : 'An unexpected error occurred'

          if (isMounted.current) {
            setError(message)
            setRetryState({ attempt: 0, isRetrying: false })
          }

          onError?.(message)
          return null
        }
      }

      try {
        return await executeRequest(0)
      } finally {
        if (isMounted.current) {
          setLoading(false)
        }
      }
    },
    [promptId, onSuccess, onError, maxRetries]
  )

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    submitVote,
    loading,
    error,
    clearError,
    isRetrying: retryState.isRetrying,
    retryAttempt: retryState.attempt,
  }
}
