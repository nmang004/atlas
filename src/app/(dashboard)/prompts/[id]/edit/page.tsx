import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

import { ArrowLeft } from 'lucide-react'

import { PromptForm } from '@/components/prompts/PromptForm'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import type { PromptWithDetails, Category } from '@/types'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Edit Prompt - Update & Improve',
  description:
    'Update prompt content, variables, and examples. Keep your AI prompts current and effective for your team.',
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
      examples:prompt_examples(*)
    `
    )
    .eq('id', id)
    .single()

  if (error || !promptData) {
    return null
  }

  const prompt = promptData as unknown as PromptWithDetails

  if (prompt.variables && Array.isArray(prompt.variables)) {
    prompt.variables.sort((a, b) => a.order_index - b.order_index)
  }

  return prompt
}

async function getCategories(): Promise<Category[]> {
  const supabase = createClient()

  const { data, error } = await supabase.from('categories').select('*').order('name')

  if (error || !data) {
    return []
  }

  return data as unknown as Category[]
}

async function checkAdminAccess(): Promise<boolean> {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return false
  }

  const { data: userProfile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  const profile = userProfile as { role: string } | null
  return profile?.role === 'admin'
}

export default async function EditPromptPage({ params }: { params: { id: string } }) {
  const isAdmin = await checkAdminAccess()

  if (!isAdmin) {
    redirect('/prompts')
  }

  const [prompt, categories] = await Promise.all([getPrompt(params.id), getCategories()])

  if (!prompt) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/prompts/${params.id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Edit Prompt</h1>
          <p className="text-muted-foreground">Update prompt details and variables</p>
        </div>
      </div>

      <PromptForm prompt={prompt} categories={categories} mode="edit" />
    </div>
  )
}
