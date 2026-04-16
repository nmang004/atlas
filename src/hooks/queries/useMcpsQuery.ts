'use client'

import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query'

import type { McpCardData } from '@/types'

interface McpsResponse {
  mcps: McpCardData[]
  nextCursor: string | null
  hasMore: boolean
}

interface McpsQueryOptions {
  category?: string | null
  search?: string | null
  server_type?: string | null
  tag?: string | null
}

export function useMcpsInfiniteQuery(options: McpsQueryOptions = {}) {
  return useInfiniteQuery({
    queryKey: ['mcps', options],
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
      if (options.server_type) {
        params.set('server_type', options.server_type)
      }
      if (options.tag) {
        params.set('tag', options.tag)
      }
      const res = await fetch(`/api/mcps?${params.toString()}`)
      if (!res.ok) {
        throw new Error('Failed to fetch MCPs')
      }
      return res.json() as Promise<McpsResponse>
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 60_000,
  })
}

export function useMcpQuery(slug: string) {
  return useQuery({
    queryKey: ['mcp', slug],
    queryFn: async () => {
      const res = await fetch(`/api/mcps/${slug}`)
      if (!res.ok) {
        throw new Error('Failed to fetch MCP')
      }
      const data = await res.json()
      return data.mcp
    },
    staleTime: 60_000,
  })
}

export function useInvalidateMcps() {
  const queryClient = useQueryClient()
  return {
    invalidateAll: () => queryClient.invalidateQueries({ queryKey: ['mcps'] }),
    invalidateOne: (slug: string) => queryClient.invalidateQueries({ queryKey: ['mcp', slug] }),
  }
}
