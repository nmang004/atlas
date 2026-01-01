'use client'

import { useState, useEffect } from 'react'

import { createClient } from '@/lib/supabase/client'
import type { Category } from '@/types'

interface CategoryWithCount extends Category {
  prompt_count: number
}

export function useCategories() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true)
      setError(null)

      const supabase = createClient()

      // Fetch categories with prompt counts
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      if (categoriesError) {
        setError(categoriesError.message)
        setCategories([])
        setLoading(false)
        return
      }

      // Get prompt counts for each category
      const { data: countData } = await supabase.from('prompts').select('category_id')

      const counts: Record<string, number> = {}
      ;(countData as Array<{ category_id: string | null }> | null)?.forEach((prompt) => {
        if (prompt.category_id) {
          counts[prompt.category_id] = (counts[prompt.category_id] || 0) + 1
        }
      })

      const categoriesWithCounts = ((categoriesData || []) as Category[]).map((category) => ({
        ...category,
        prompt_count: counts[category.id] || 0,
      }))

      setCategories(categoriesWithCounts)
      setLoading(false)
    }

    fetchCategories()
  }, [])

  return { categories, loading, error }
}
