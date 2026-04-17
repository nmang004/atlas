'use client'

import { useQuery } from '@tanstack/react-query'

interface SearchResults {
  skills: Array<{ id: string; title: string; slug: string; description: string | null }>
  mcps: Array<{ id: string; title: string; slug: string; description: string | null }>
  prompts: Array<{ id: string; title: string; description: string | null }>
}

export function useSearchQuery(query: string) {
  return useQuery({
    queryKey: ['search', query],
    queryFn: async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      if (!res.ok) {
        throw new Error('Search failed')
      }
      const data = await res.json()
      return data.results as SearchResults
    },
    enabled: query.length >= 2,
    staleTime: 30_000,
  })
}
