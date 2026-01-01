'use client'

import { useState, useMemo } from 'react'

import { ChevronDown, ChevronUp, Search, X } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const VISIBLE_COUNT = 8 // Tags shown when collapsed

interface TagFilterProps {
  tagsWithCounts: Array<{ tag: string; count: number }>
  selectedTags: string[]
  onTagToggle: (tag: string) => void
  onClearAll: () => void
}

export function TagFilter({
  tagsWithCounts,
  selectedTags,
  onTagToggle,
  onClearAll,
}: TagFilterProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)

  // Filter tags by search query
  const filteredTags = useMemo(() => {
    if (!searchQuery.trim()) {
      return tagsWithCounts
    }
    const query = searchQuery.toLowerCase()
    return tagsWithCounts.filter(({ tag }) => tag.toLowerCase().includes(query))
  }, [tagsWithCounts, searchQuery])

  // Separate selected from unselected tags
  const { selectedTagsData, unselectedTags } = useMemo(() => {
    const selected = filteredTags.filter((t) => selectedTags.includes(t.tag))
    const unselected = filteredTags.filter((t) => !selectedTags.includes(t.tag))
    return { selectedTagsData: selected, unselectedTags: unselected }
  }, [filteredTags, selectedTags])

  // Apply collapse logic only to unselected tags
  const visibleUnselectedTags = isExpanded ? unselectedTags : unselectedTags.slice(0, VISIBLE_COUNT)
  const hiddenCount = Math.max(0, unselectedTags.length - VISIBLE_COUNT)

  // Auto-expand when searching
  const effectiveExpanded = isExpanded || searchQuery.trim().length > 0

  if (tagsWithCounts.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">Filter by tags</span>
        {selectedTags.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-auto min-h-7 px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
            onClick={onClearAll}
          >
            Clear all
            <X className="ml-1 h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Search input */}
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-9 pl-9 pr-9 text-sm"
          aria-label="Search tags"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Selected tags (always visible, promoted to top) */}
      {selectedTagsData.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTagsData.map(({ tag, count }) => (
            <Badge
              key={tag}
              variant="default"
              className={cn(
                'cursor-pointer bg-primary px-3 py-1.5 text-sm text-primary-foreground transition-all',
                'hover:bg-primary/90 active:scale-95'
              )}
              onClick={() => onTagToggle(tag)}
            >
              {tag}
              <span className="ml-1.5 opacity-70">({count})</span>
              <X className="ml-1 h-3 w-3" />
            </Badge>
          ))}
        </div>
      )}

      {/* Unselected tags (collapsible) */}
      {(effectiveExpanded ? unselectedTags : visibleUnselectedTags).length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {(effectiveExpanded ? unselectedTags : visibleUnselectedTags).map(({ tag, count }) => (
            <Badge
              key={tag}
              variant="outline"
              className={cn(
                'cursor-pointer px-3 py-1.5 text-sm transition-all',
                'hover:bg-accent hover:text-accent-foreground active:scale-95'
              )}
              onClick={() => onTagToggle(tag)}
            >
              {tag}
              <span className="ml-1.5 text-muted-foreground">({count})</span>
            </Badge>
          ))}

          {/* Expand/Collapse button */}
          {hiddenCount > 0 && !effectiveExpanded && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto min-h-7 px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => setIsExpanded(true)}
              aria-expanded={false}
            >
              +{hiddenCount} more
              <ChevronDown className="ml-1 h-3 w-3" />
            </Button>
          )}
          {effectiveExpanded && unselectedTags.length > VISIBLE_COUNT && !searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto min-h-7 px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => setIsExpanded(false)}
              aria-expanded={true}
            >
              Show less
              <ChevronUp className="ml-1 h-3 w-3" />
            </Button>
          )}
        </div>
      )}

      {/* No results message */}
      {filteredTags.length === 0 && searchQuery && (
        <p className="text-sm text-muted-foreground">No tags match &quot;{searchQuery}&quot;</p>
      )}
    </div>
  )
}
