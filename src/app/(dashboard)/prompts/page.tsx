import { Suspense } from 'react'

import { PromptsContent } from '@/components/prompts/PromptsContent'
import { createClient } from '@/lib/supabase/server'
import type { PromptCardData } from '@/types'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Prompt Library - Browse & Search Prompts',
  description:
    'Browse proven AI prompts organized by category and tags. Copy prompts with one click, vote on quality, and keep your team aligned.',
}

interface PromptRow {
  id: string
  title: string
  content: string
  tags: string[] | null
  rating_score: number
  vote_count: number
  last_verified_at: string
  is_flagged: boolean
  model_version: string | null
  category_id: string | null
  category: { name: string } | null
}

export interface PromptListItem extends PromptCardData {
  category_id: string | null
  content: string
}

async function getPrompts(): Promise<PromptListItem[]> {
  const supabase = createClient()

  const { data: promptsData, error } = await supabase
    .from('prompts')
    .select(
      `
      id,
      title,
      content,
      tags,
      rating_score,
      vote_count,
      last_verified_at,
      is_flagged,
      model_version,
      category_id,
      category:categories(name)
    `
    )
    .order('last_verified_at', { ascending: false })

  if (error || !promptsData) {
    console.error('Error fetching prompts:', error)
    return []
  }

  // Cast to proper type
  const prompts = promptsData as unknown as PromptRow[]

  return prompts.map((prompt) => ({
    id: prompt.id,
    title: prompt.title,
    content: prompt.content,
    category_id: prompt.category_id,
    category_name: prompt.category?.name || null,
    tags: prompt.tags || [],
    rating_score: prompt.rating_score,
    vote_count: prompt.vote_count,
    last_verified_at: prompt.last_verified_at,
    is_flagged: prompt.is_flagged,
    model_version: prompt.model_version,
  }))
}

function PromptsPageFallback() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-48 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-4 w-32 animate-pulse rounded bg-muted" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    </div>
  )
}

export default async function PromptsPage() {
  const prompts = await getPrompts()

  return (
    <Suspense fallback={<PromptsPageFallback />}>
      <PromptsContent prompts={prompts} />
    </Suspense>
  )
}
