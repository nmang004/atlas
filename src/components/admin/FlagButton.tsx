'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { Flag, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

interface FlagButtonProps {
  entityType: 'skill' | 'mcp' | 'prompt'
  id: string
}

export function FlagButton({ entityType, id }: FlagButtonProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleFlag = async () => {
    setIsLoading(true)

    try {
      const response = await fetch(`/api/admin/flag/${entityType}/${id}`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error(`Failed to flag ${entityType}`)
      }

      toast({
        title: 'Flagged',
        description: `The ${entityType} has been flagged for review.`,
      })

      router.refresh()
    } catch {
      toast({
        title: 'Error',
        description: `Failed to flag ${entityType}. Please try again.`,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button size="sm" variant="destructive" onClick={handleFlag} disabled={isLoading}>
      {isLoading ? (
        <Loader2 className="mr-1 h-4 w-4 animate-spin" />
      ) : (
        <Flag className="mr-1 h-4 w-4" />
      )}
      Flag
    </Button>
  )
}
