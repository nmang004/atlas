'use client'

import { useCallback, useState } from 'react'

import type { EntityType, VoteOutcome } from '@/types'

interface UseVotingOptions {
  entityType: EntityType
  entityId: string
  onSuccess?: () => void
  onError?: (error: string) => void
}

interface UseVotingReturn {
  submitVote: (outcome: VoteOutcome, feedback?: string) => Promise<void>
  isLoading: boolean
  error: string | null
}

const MAX_RETRIES = 3
const BASE_DELAY = 1000

export function useVoting({
  entityType,
  entityId,
  onSuccess,
  onError,
}: UseVotingOptions): UseVotingReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitVote = useCallback(
    async (outcome: VoteOutcome, feedback?: string) => {
      setIsLoading(true)
      setError(null)

      let lastError = ''
      for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
          const res = await fetch('/api/vote', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              entity_type: entityType,
              entity_id: entityId,
              outcome,
              feedback,
            }),
          })

          if (res.ok) {
            setIsLoading(false)
            onSuccess?.()
            return
          }

          if (res.status === 429) {
            lastError = 'Rate limit exceeded. Please wait.'
            if (attempt < MAX_RETRIES) {
              await new Promise((r) => setTimeout(r, BASE_DELAY * 2 ** attempt))
              continue
            }
          }

          const data = await res.json()
          lastError = data.error || 'Vote failed'
          break
        } catch {
          lastError = 'Network error'
          if (attempt < MAX_RETRIES) {
            await new Promise((r) => setTimeout(r, BASE_DELAY * 2 ** attempt))
            continue
          }
        }
      }

      setIsLoading(false)
      setError(lastError)
      onError?.(lastError)
    },
    [entityType, entityId, onSuccess, onError]
  )

  return { submitVote, isLoading, error }
}
