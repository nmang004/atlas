import { notFound } from 'next/navigation'

import { PromptDetailContent } from '@/components/prompts/PromptDetailContent'
import { createClient } from '@/lib/supabase/server'
import type { PromptWithDetails, PromptVote } from '@/types'

import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  const supabase = createClient()
  const { data } = await supabase
    .from('prompts')
    .select('title, content')
    .eq('id', params.id)
    .single()

  const prompt = data as { title: string; content: string } | null

  if (!prompt) {
    return {
      title: 'Prompt Not Found',
    }
  }

  const description = prompt.content.slice(0, 155).replace(/\n/g, ' ') + '...'

  return {
    title: `${prompt.title} - AI Prompt Template`,
    description,
  }
}

async function getPrompt(id: string): Promise<PromptWithDetails | null> {
  const supabase = createClient()

  const { data: promptData, error } = await supabase
    .from('prompts')
    .select(
      `
      *,
      category:categories(*),
      variables:prompt_variables(*),
      examples:prompt_examples(*),
      variants:prompt_variants(*)
    `
    )
    .eq('id', id)
    .single()

  if (error || !promptData) {
    return null
  }

  // Cast to proper type
  const prompt = promptData as unknown as PromptWithDetails

  // Sort variables by order_index
  if (prompt.variables && Array.isArray(prompt.variables)) {
    prompt.variables.sort((a, b) => a.order_index - b.order_index)
  }

  return prompt
}

async function getUserVote(promptId: string): Promise<PromptVote | null> {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: vote } = await supabase
    .from('prompt_votes')
    .select('*')
    .eq('prompt_id', promptId)
    .eq('user_id', user.id)
    .single()

  return vote as unknown as PromptVote | null
}

export default async function PromptDetailPage({ params }: { params: { id: string } }) {
  const [prompt, existingVote] = await Promise.all([getPrompt(params.id), getUserVote(params.id)])

  if (!prompt) {
    notFound()
  }

  return <PromptDetailContent prompt={prompt} existingVote={existingVote} />
}
