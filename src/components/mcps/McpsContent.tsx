'use client'

import { useState, useMemo, useCallback } from 'react'

import { Search } from 'lucide-react'

import { McpCard } from '@/components/mcps/McpCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useMcpsInfiniteQuery } from '@/hooks/queries/useMcpsQuery'
import { MCP_SERVER_TYPES, SEARCH_DEBOUNCE_MS } from '@/lib/constants'
import { debounce } from '@/lib/utils'

export function McpsContent() {
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [serverTypeFilter, setServerTypeFilter] = useState<string | null>(null)

  const debouncedSetSearch = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedSearch(value)
      }, SEARCH_DEBOUNCE_MS),
    []
  )

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setSearchInput(value)
      debouncedSetSearch(value)
    },
    [debouncedSetSearch]
  )

  const handleServerTypeChange = useCallback((value: string) => {
    setServerTypeFilter(value === 'all' ? null : value)
  }, [])

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useMcpsInfiniteQuery({
    search: debouncedSearch || null,
    server_type: serverTypeFilter,
  })

  const mcps = useMemo(() => data?.pages.flatMap((page) => page.mcps) ?? [], [data])

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Search and filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search MCPs..."
            value={searchInput}
            onChange={handleSearchChange}
            className="min-h-10 pl-9"
          />
        </div>
        <Select value={serverTypeFilter ?? 'all'} onValueChange={handleServerTypeChange}>
          <SelectTrigger className="min-h-10 w-full sm:w-[180px]">
            <SelectValue placeholder="All server types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Server Types</SelectItem>
            {MCP_SERVER_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3 rounded-lg border p-6">
              <div className="flex items-start justify-between">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-5 w-20" />
              </div>
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-10 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-14" />
                <Skeleton className="h-5 w-14" />
              </div>
              <div className="flex gap-4">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-24" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MCPs grid */}
      {!isLoading && mcps.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {mcps.map((mcp) => (
            <McpCard key={mcp.id} mcp={mcp} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && mcps.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground text-lg font-medium">No MCPs found</p>
          <p className="text-muted-foreground text-sm">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

      {/* Load more */}
      {hasNextPage && (
        <div className="flex justify-center pt-4">
          <Button variant="outline" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            {isFetchingNextPage ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}
    </div>
  )
}
