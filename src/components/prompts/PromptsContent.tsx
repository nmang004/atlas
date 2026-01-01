'use client'

import { useState, useMemo } from 'react'

import { useSearchParams } from 'next/navigation'

import { SlidersHorizontal } from 'lucide-react'

import { PromptCard } from '@/components/prompts/PromptCard'
import { TagFilter } from '@/components/prompts/TagFilter'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SORT_OPTIONS, DEFAULT_SORT, type SortOption } from '@/lib/constants'
import type { PromptCardData } from '@/types'

interface PromptListItem extends PromptCardData {
  category_id: string | null
  content: string
}

interface PromptsContentProps {
  prompts: PromptListItem[]
}

export function PromptsContent({ prompts }: PromptsContentProps) {
  const searchParams = useSearchParams()
  const categoryFilter = searchParams.get('category')
  const searchQuery = searchParams.get('search')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<SortOption>(DEFAULT_SORT)
  const [filtersOpen, setFiltersOpen] = useState(false)

  // Extract tags with usage counts, sorted by popularity
  const tagsWithCounts = useMemo(() => {
    const tagCounts = new Map<string, number>()
    prompts.forEach((prompt) => {
      prompt.tags.forEach((tag) => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
      })
    })
    // Sort by count descending, then alphabetically
    return Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([tag, count]) => ({ tag, count }))
  }, [prompts])

  // Filter and sort prompts
  const filteredPrompts = useMemo(() => {
    let filtered = [...prompts]

    // Filter by search query (title and content, case-insensitive)
    if (searchQuery?.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (prompt) =>
          prompt.title.toLowerCase().includes(query) || prompt.content.toLowerCase().includes(query)
      )
    }

    // Filter by category
    if (categoryFilter) {
      filtered = filtered.filter((prompt) => prompt.category_id === categoryFilter)
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter((prompt) => selectedTags.some((tag) => prompt.tags.includes(tag)))
    }

    // Sort prompts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'verified':
          return new Date(b.last_verified_at).getTime() - new Date(a.last_verified_at).getTime()
        case 'rating':
          return b.rating_score - a.rating_score
        case 'votes':
          return b.vote_count - a.vote_count
        case 'newest':
        default:
          return 0
      }
    })

    return filtered
  }, [prompts, searchQuery, categoryFilter, selectedTags, sortBy])

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const handleClearTags = () => {
    setSelectedTags([])
  }

  const hasActiveFilters = selectedTags.length > 0 || sortBy !== DEFAULT_SORT

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header - responsive layout */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold md:text-2xl">Prompt Library</h1>
          <p className="text-sm text-muted-foreground md:text-base">
            {searchQuery ? (
              <>
                {filteredPrompts.length} result{filteredPrompts.length !== 1 ? 's' : ''} for &quot;
                {searchQuery}&quot;
              </>
            ) : (
              <>{filteredPrompts.length} prompts available</>
            )}
          </p>
        </div>

        {/* Sort - always visible, but compact on mobile */}
        <div className="flex items-center gap-2">
          {/* Mobile filter toggle */}
          <Button
            variant="outline"
            size="sm"
            className="min-h-10 gap-2 md:hidden"
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                {selectedTags.length + (sortBy !== DEFAULT_SORT ? 1 : 0)}
              </span>
            )}
          </Button>

          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
            <SelectTrigger className="min-h-10 w-[140px] md:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Mobile collapsible filters */}
      <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen} className="md:hidden">
        <CollapsibleContent className="space-y-4">
          <TagFilter
            tagsWithCounts={tagsWithCounts}
            selectedTags={selectedTags}
            onTagToggle={handleTagToggle}
            onClearAll={handleClearTags}
          />
        </CollapsibleContent>
      </Collapsible>

      {/* Desktop tag filter - always visible */}
      <div className="hidden md:block">
        <TagFilter
          tagsWithCounts={tagsWithCounts}
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
          onClearAll={handleClearTags}
        />
      </div>

      {/* Prompt grid - responsive columns */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPrompts.map((prompt) => (
          <PromptCard key={prompt.id} prompt={prompt} />
        ))}
      </div>

      {filteredPrompts.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-lg font-medium text-muted-foreground">No prompts found</p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your filters or search query
          </p>
        </div>
      )}
    </div>
  )
}
