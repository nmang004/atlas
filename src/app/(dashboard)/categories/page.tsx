import Link from 'next/link'

import { FolderOpen } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'

interface CategoryWithCount {
  id: string
  name: string
  description: string | null
  prompt_count: number
}

interface CategoryRow {
  id: string
  name: string
  description: string | null
  created_at: string
}

interface PromptCategoryId {
  category_id: string | null
}

async function getCategoriesWithCounts(): Promise<CategoryWithCount[]> {
  const supabase = createClient()

  // Fetch categories
  const { data: categoriesData, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  if (error || !categoriesData) {
    console.error('Error fetching categories:', error)
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
    description: category.description,
    prompt_count: counts[category.id] || 0,
  }))
}

export default async function CategoriesPage() {
  const categories = await getCategoriesWithCounts()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Categories</h1>
        <p className="text-muted-foreground">Browse prompts organized by category</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link key={category.id} href={`/prompts?category=${category.id}`}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <FolderOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{category.prompt_count} prompts</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  {category.description || 'No description available'}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-lg font-medium text-muted-foreground">No categories found</p>
        </div>
      )}
    </div>
  )
}
