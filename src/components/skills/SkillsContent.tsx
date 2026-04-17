'use client'

import { useState, useMemo, useCallback } from 'react'

import { Search } from 'lucide-react'

import { SkillCard } from '@/components/skills/SkillCard'
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
import { useSkillsInfiniteQuery } from '@/hooks/queries/useSkillsQuery'
import { SKILL_FORMATS, SEARCH_DEBOUNCE_MS } from '@/lib/constants'
import { debounce } from '@/lib/utils'

export function SkillsContent() {
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [formatFilter, setFormatFilter] = useState<string | null>(null)

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

  const handleFormatChange = useCallback((value: string) => {
    setFormatFilter(value === 'all' ? null : value)
  }, [])

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useSkillsInfiniteQuery({
      search: debouncedSearch || null,
      format: formatFilter,
    })

  const skills = useMemo(() => data?.pages.flatMap((page) => page.skills) ?? [], [data])

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Search and filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search skills..."
            value={searchInput}
            onChange={handleSearchChange}
            className="min-h-10 pl-9"
          />
        </div>
        <Select value={formatFilter ?? 'all'} onValueChange={handleFormatChange}>
          <SelectTrigger className="min-h-10 w-full sm:w-[180px]">
            <SelectValue placeholder="All formats" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Formats</SelectItem>
            {SKILL_FORMATS.map((format) => (
              <SelectItem key={format.value} value={format.value}>
                {format.label}
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

      {/* Skills grid */}
      {!isLoading && skills.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {skills.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && skills.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground text-lg font-medium">No skills found</p>
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
