'use client'

import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query'

import type { SkillCardData } from '@/types'

interface SkillsResponse {
  skills: SkillCardData[]
  nextCursor: string | null
  hasMore: boolean
}

interface SkillsQueryOptions {
  category?: string | null
  search?: string | null
  format?: string | null
  tag?: string | null
}

export function useSkillsInfiniteQuery(options: SkillsQueryOptions = {}) {
  return useInfiniteQuery({
    queryKey: ['skills', options],
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams()
      if (pageParam) {
        params.set('cursor', pageParam)
      }
      if (options.category) {
        params.set('category', options.category)
      }
      if (options.search) {
        params.set('search', options.search)
      }
      if (options.format) {
        params.set('format', options.format)
      }
      if (options.tag) {
        params.set('tag', options.tag)
      }
      const res = await fetch(`/api/skills?${params.toString()}`)
      if (!res.ok) {
        throw new Error('Failed to fetch skills')
      }
      return res.json() as Promise<SkillsResponse>
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 60_000,
  })
}

export function useSkillQuery(slug: string) {
  return useQuery({
    queryKey: ['skill', slug],
    queryFn: async () => {
      const res = await fetch(`/api/skills/${slug}`)
      if (!res.ok) {
        throw new Error('Failed to fetch skill')
      }
      const data = await res.json()
      return data.skill
    },
    staleTime: 60_000,
  })
}

export function useInvalidateSkills() {
  const queryClient = useQueryClient()
  return {
    invalidateAll: () => queryClient.invalidateQueries({ queryKey: ['skills'] }),
    invalidateOne: (slug: string) => queryClient.invalidateQueries({ queryKey: ['skill', slug] }),
  }
}
