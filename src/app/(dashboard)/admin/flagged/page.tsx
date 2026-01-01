import Link from 'next/link'

import { AlertTriangle, Clock } from 'lucide-react'

import { FlaggedPromptActions } from '@/components/admin/FlaggedPromptActions'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { STALE_THRESHOLD_DAYS } from '@/lib/constants'
import { createClient } from '@/lib/supabase/server'
import { formatRelativeTime } from '@/lib/utils'

interface FlaggedPrompt {
  id: string
  title: string
  category_name: string | null
  is_flagged: boolean
  last_verified_at: string
  negative_feedback: string[]
}

interface PromptWithCategory {
  id: string
  title: string
  is_flagged: boolean
  last_verified_at: string
  category: { name: string } | null
}

interface VoteFeedback {
  prompt_id: string
  feedback: string | null
}

async function getFlaggedAndStalePrompts(): Promise<FlaggedPrompt[]> {
  const supabase = createClient()

  const staleThreshold = new Date()
  staleThreshold.setDate(staleThreshold.getDate() - STALE_THRESHOLD_DAYS)

  // Fetch all prompts and filter client-side for complex conditions
  const { data: allPrompts, error } = await supabase
    .from('prompts')
    .select(
      `
      id,
      title,
      is_flagged,
      last_verified_at,
      category:categories(name)
    `
    )
    .order('is_flagged', { ascending: false })
    .order('last_verified_at', { ascending: true })

  if (error || !allPrompts) {
    console.error('Error fetching prompts:', error)
    return []
  }

  // Cast to proper type
  const typedPrompts = allPrompts as unknown as PromptWithCategory[]

  // Filter for flagged or stale prompts
  const prompts = typedPrompts.filter((p) => {
    if (p.is_flagged) {
      return true
    }
    const verifiedDate = new Date(p.last_verified_at)
    return verifiedDate < staleThreshold
  })

  if (prompts.length === 0) {
    return []
  }

  // Get negative feedback for each prompt
  const promptIds = prompts.map((p) => p.id)
  const { data: votesData } = await supabase
    .from('prompt_votes')
    .select('prompt_id, feedback')
    .in('prompt_id', promptIds)
    .eq('outcome', 'negative')

  // Cast to proper type and filter for non-null feedback
  const votes = (votesData as unknown as VoteFeedback[] | null) || []

  const feedbackByPrompt: Record<string, string[]> = {}
  votes.forEach((vote) => {
    if (vote.feedback) {
      if (!feedbackByPrompt[vote.prompt_id]) {
        feedbackByPrompt[vote.prompt_id] = []
      }
      feedbackByPrompt[vote.prompt_id].push(vote.feedback)
    }
  })

  return prompts.map((prompt) => ({
    id: prompt.id,
    title: prompt.title,
    category_name: prompt.category?.name || null,
    is_flagged: prompt.is_flagged,
    last_verified_at: prompt.last_verified_at,
    negative_feedback: feedbackByPrompt[prompt.id] || [],
  }))
}

export default async function FlaggedPromptsPage() {
  const flaggedPrompts = await getFlaggedAndStalePrompts()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Flagged & Stale Prompts</h1>
        <p className="text-muted-foreground">
          Prompts that need review or have been flagged by users
        </p>
      </div>

      {flaggedPrompts.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-lg font-medium text-muted-foreground">No prompts need review</p>
          <p className="text-sm text-muted-foreground">All prompts are up to date and unflagged</p>
        </div>
      ) : (
        <div className="space-y-4">
          {flaggedPrompts.map((prompt) => (
            <Card key={prompt.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{prompt.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {prompt.category_name || 'Uncategorized'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {prompt.is_flagged && (
                      <Badge variant="destructive">
                        <AlertTriangle className="mr-1 h-3 w-3" />
                        Flagged
                      </Badge>
                    )}
                    <Badge variant="warning">
                      <Clock className="mr-1 h-3 w-3" />
                      {formatRelativeTime(prompt.last_verified_at)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {prompt.negative_feedback.length > 0 && (
                  <div>
                    <p className="mb-2 text-sm font-medium">User Feedback:</p>
                    <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                      {prompt.negative_feedback.map((feedback, i) => (
                        <li key={i}>{feedback}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  <Link href={`/prompts/${prompt.id}`}>
                    <Button size="sm">View Prompt</Button>
                  </Link>
                  <Link href={`/prompts/${prompt.id}/edit`}>
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  </Link>
                  <FlaggedPromptActions promptId={prompt.id} isFlagged={prompt.is_flagged} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
