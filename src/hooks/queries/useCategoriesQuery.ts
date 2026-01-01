'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'

import { createClient } from '@/lib/supabase/client'
import type { Category } from '@/types'

// Query keys for cache management
export const categoriesKeys = {
  all: ['categories'] as const,
  lists: () => [...categoriesKeys.all, 'list'] as const,
  withCounts: () => [...categoriesKeys.all, 'withCounts'] as const,
}

interface CategoryWithCount extends Category {
  prompt_count: number
}

// Hook for fetching categories (cached for 5 minutes - rarely change)
export function useCategoriesQuery() {
  return useQuery({
    queryKey: categoriesKeys.lists(),
    queryFn: async (): Promise<Category[]> => {
      const supabase = createClient()

      const { data, error } = await supabase.from('categories').select('*').order('name')

      if (error) {
        throw new Error(error.message)
      }

      return (data as unknown as Category[]) || []
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - categories rarely change
    gcTime: 30 * 60 * 1000, // 30 minutes garbage collection
  })
}

// Hook for fetching categories with prompt counts
export function useCategoriesWithCountsQuery() {
  return useQuery({
    queryKey: categoriesKeys.withCounts(),
    queryFn: async (): Promise<CategoryWithCount[]> => {
      const supabase = createClient()

      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      if (categoriesError) {
        throw new Error(categoriesError.message)
      }

      // Get prompt counts for each category
      const { data: countData } = await supabase.from('prompts').select('category_id')

      const counts: Record<string, number> = {}
      ;(countData as Array<{ category_id: string | null }> | null)?.forEach((prompt) => {
        if (prompt.category_id) {
          counts[prompt.category_id] = (counts[prompt.category_id] || 0) + 1
        }
      })

      const categories = (categoriesData as unknown as Category[]) || []

      return categories.map((category) => ({
        ...category,
        prompt_count: counts[category.id] || 0,
      }))
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  })
}

// Hook for invalidating categories cache
export function useInvalidateCategories() {
  const queryClient = useQueryClient()

  return {
    invalidateAll: () => queryClient.invalidateQueries({ queryKey: categoriesKeys.all }),
  }
}
