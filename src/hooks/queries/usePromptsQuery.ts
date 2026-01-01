'use client'

import { useQuery, useInfiniteQuery, useQueryClient } from '@tanstack/react-query'

import { createClient } from '@/lib/supabase/client'
import type { PromptWithCategory, PromptWithDetails, PromptCardData } from '@/types'

// Query keys for cache management
export const promptsKeys = {
  all: ['prompts'] as const,
  lists: () => [...promptsKeys.all, 'list'] as const,
  list: (filters: { categoryId?: string; search?: string }) =>
    [...promptsKeys.lists(), filters] as const,
  details: () => [...promptsKeys.all, 'detail'] as const,
  detail: (id: string) => [...promptsKeys.details(), id] as const,
}

interface PromptListItem extends PromptCardData {
  category_id: string | null
  content: string
}

// Hook for fetching all prompts with optional filtering
export function usePromptsQuery(categoryId?: string) {
  return useQuery({
    queryKey: promptsKeys.list({ categoryId }),
    queryFn: async (): Promise<PromptWithCategory[]> => {
      const supabase = createClient()

      let query = supabase
        .from('prompts')
        .select(
          `
          *,
          category:categories(*)
        `
        )
        .order('last_verified_at', { ascending: false })

      if (categoryId) {
        query = query.eq('category_id', categoryId)
      }

      const { data, error } = await query

      if (error) {
        throw new Error(error.message)
      }

      return (data as unknown as PromptWithCategory[]) || []
    },
    staleTime: 60 * 1000, // 1 minute
  })
}

// Hook for fetching prompts list (card data only)
export function usePromptsListQuery() {
  return useQuery({
    queryKey: promptsKeys.lists(),
    queryFn: async (): Promise<PromptListItem[]> => {
      const supabase = createClient()

      const { data, error } = await supabase
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

      if (error) {
        throw new Error(error.message)
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

      const prompts = (data as unknown as PromptRow[]) || []

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
    },
    staleTime: 60 * 1000, // 1 minute
  })
}

// Hook for fetching a single prompt with full details
export function usePromptQuery(id: string) {
  return useQuery({
    queryKey: promptsKeys.detail(id),
    queryFn: async (): Promise<PromptWithDetails | null> => {
      const supabase = createClient()

      const { data, error } = await supabase
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

      if (error) {
        if (error.code === 'PGRST116') {
          return null // Not found
        }
        throw new Error(error.message)
      }

      const prompt = data as unknown as PromptWithDetails

      // Sort variables by order_index
      if (prompt.variables && Array.isArray(prompt.variables)) {
        prompt.variables.sort((a, b) => a.order_index - b.order_index)
      }

      return prompt
    },
    staleTime: 30 * 1000, // 30 seconds
    enabled: !!id,
  })
}

// Hook for invalidating prompts cache after mutations
export function useInvalidatePrompts() {
  const queryClient = useQueryClient()

  return {
    invalidateAll: () => queryClient.invalidateQueries({ queryKey: promptsKeys.all }),
    invalidateList: () => queryClient.invalidateQueries({ queryKey: promptsKeys.lists() }),
    invalidatePrompt: (id: string) =>
      queryClient.invalidateQueries({ queryKey: promptsKeys.detail(id) }),
  }
}

// Optimistic update helper for voting
export function useOptimisticVoteUpdate() {
  const queryClient = useQueryClient()

  return {
    updatePromptRating: (promptId: string, isPositive: boolean) => {
      // Optimistically update the prompt in cache
      queryClient.setQueryData(promptsKeys.detail(promptId), (old: PromptWithDetails | undefined) => {
        if (!old) {
          return old
        }

        const newVoteCount = old.vote_count + 1
        const currentPositiveVotes = Math.round((old.rating_score / 100) * old.vote_count)
        const newPositiveVotes = currentPositiveVotes + (isPositive ? 1 : 0)
        const newRating = (newPositiveVotes / newVoteCount) * 100

        return {
          ...old,
          vote_count: newVoteCount,
          rating_score: newRating,
          is_flagged: !isPositive ? true : old.is_flagged,
          last_verified_at: isPositive ? new Date().toISOString() : old.last_verified_at,
        }
      })
    },
  }
}

// Types for paginated response
interface PaginatedPromptsResponse {
  prompts: PromptListItem[]
  nextCursor: string | null
  hasMore: boolean
}

// Hook for infinite scrolling/load more pagination
export function usePromptsInfiniteQuery(options?: { categoryId?: string; search?: string }) {
  return useInfiniteQuery({
    queryKey: ['prompts', 'infinite', options],
    queryFn: async ({ pageParam }): Promise<PaginatedPromptsResponse> => {
      const params = new URLSearchParams()
      params.set('limit', '12')

      if (pageParam) {
        params.set('cursor', pageParam)
      }
      if (options?.categoryId) {
        params.set('category', options.categoryId)
      }
      if (options?.search?.trim()) {
        params.set('search', options.search)
      }

      const response = await fetch(`/api/prompts?${params.toString()}`)

      if (!response.ok) {
        throw new Error('Failed to fetch prompts')
      }

      return response.json()
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 60 * 1000, // 1 minute
  })
}
