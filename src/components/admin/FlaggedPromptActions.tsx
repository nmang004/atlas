'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { CheckCircle, Flag, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

interface FlaggedPromptActionsProps {
  promptId: string
  isFlagged: boolean
}

export function FlaggedPromptActions({ promptId, isFlagged }: FlaggedPromptActionsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isUnflagging, setIsUnflagging] = useState(false)
  const [isMarkingReviewed, setIsMarkingReviewed] = useState(false)

  const handleUnflag = async () => {
    setIsUnflagging(true)

    try {
      const response = await fetch(`/api/admin/prompts/${promptId}/unflag`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to unflag prompt')
      }

      toast({
        title: 'Prompt unflagged',
        description: 'The prompt has been unflagged successfully.',
      })

      router.refresh()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to unflag prompt. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsUnflagging(false)
    }
  }

  const handleMarkReviewed = async () => {
    setIsMarkingReviewed(true)

    try {
      const response = await fetch(`/api/admin/prompts/${promptId}/mark-reviewed`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to mark as reviewed')
      }

      toast({
        title: 'Marked as reviewed',
        description: 'The prompt has been marked as reviewed.',
      })

      router.refresh()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to mark as reviewed. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsMarkingReviewed(false)
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={handleMarkReviewed}
        disabled={isMarkingReviewed || isUnflagging}
      >
        {isMarkingReviewed ? (
          <Loader2 className="mr-1 h-4 w-4 animate-spin" />
        ) : (
          <CheckCircle className="mr-1 h-4 w-4" />
        )}
        Mark Reviewed
      </Button>
      {isFlagged && (
        <Button
          size="sm"
          variant="outline"
          onClick={handleUnflag}
          disabled={isUnflagging || isMarkingReviewed}
        >
          {isUnflagging ? (
            <Loader2 className="mr-1 h-4 w-4 animate-spin" />
          ) : (
            <Flag className="mr-1 h-4 w-4" />
          )}
          Unflag
        </Button>
      )}
    </div>
  )
}
