'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { CheckCircle, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

interface PublishButtonProps {
  entityType: 'skill' | 'mcp'
  id: string
}

export function PublishButton({ entityType, id }: PublishButtonProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handlePublish = async () => {
    setIsLoading(true)

    try {
      const response = await fetch(`/api/admin/publish/${entityType}/${id}`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error(`Failed to publish ${entityType}`)
      }

      toast({
        title: 'Published',
        description: `The ${entityType} has been published successfully.`,
      })

      router.refresh()
    } catch {
      toast({
        title: 'Error',
        description: `Failed to publish ${entityType}. Please try again.`,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button size="sm" onClick={handlePublish} disabled={isLoading}>
      {isLoading ? (
        <Loader2 className="mr-1 h-4 w-4 animate-spin" />
      ) : (
        <CheckCircle className="mr-1 h-4 w-4" />
      )}
      Publish
    </Button>
  )
}
