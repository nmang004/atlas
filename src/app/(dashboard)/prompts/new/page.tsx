import Link from 'next/link'
import { redirect } from 'next/navigation'

import { ArrowLeft } from 'lucide-react'

import { PromptForm } from '@/components/prompts/PromptForm'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import type { Category } from '@/types'

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

export default async function NewPromptPage() {
  const isAdmin = await checkAdminAccess()

  if (!isAdmin) {
    redirect('/prompts')
  }

  const categories = await getCategories()

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/prompts">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Create New Prompt</h1>
          <p className="text-muted-foreground">Add a new prompt to the library</p>
        </div>
      </div>

      <PromptForm categories={categories} mode="create" />
    </div>
  )
}
