import { DashboardShell } from '@/components/layout/DashboardShell'
import { createClient } from '@/lib/supabase/server'
import type { User } from '@/types'

interface CategoryRow {
  id: string
  name: string
  description: string | null
  created_at: string
}

interface PromptCategoryId {
  category_id: string | null
}

async function getCategories() {
  const supabase = createClient()

  // Fetch categories
  const { data: categoriesData, error: categoriesError } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  if (categoriesError || !categoriesData) {
    console.error('Error fetching categories:', categoriesError)
    return []
  }

  // Cast to proper type
  const categories = categoriesData as unknown as CategoryRow[]

  // Get prompt counts for each category
  const { data: promptsData } = await supabase.from('prompts').select('category_id')

  // Cast to proper type
  const prompts = (promptsData as unknown as PromptCategoryId[] | null) || []

  const counts: Record<string, number> = {}
  prompts.forEach((prompt) => {
    if (prompt.category_id) {
      counts[prompt.category_id] = (counts[prompt.category_id] || 0) + 1
    }
  })

  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    prompt_count: counts[category.id] || 0,
  }))
}

async function getCurrentUser(): Promise<{ user: User | null; isAdmin: boolean }> {
  const supabase = createClient()

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser) {
    return { user: null, isAdmin: false }
  }

  // Fetch user profile from users table
  const { data: userProfile } = await supabase
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .single()

  // Cast to User type
  const user = userProfile as unknown as User | null

  return {
    user,
    isAdmin: user?.role === 'admin',
  }
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [categories, { user, isAdmin }] = await Promise.all([getCategories(), getCurrentUser()])

  return (
    <DashboardShell categories={categories} user={user} isAdmin={isAdmin}>
      {children}
    </DashboardShell>
  )
}
