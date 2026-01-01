'use client'

import { X } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface TagFilterProps {
  availableTags: string[]
  selectedTags: string[]
  onTagToggle: (tag: string) => void
  onClearAll: () => void
}

export function TagFilter({
  availableTags,
  selectedTags,
  onTagToggle,
  onClearAll,
}: TagFilterProps) {
  if (availableTags.length === 0) {
    return null
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Filter by tags</p>
        {selectedTags.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-auto min-h-8 px-2 py-1 text-xs"
            onClick={onClearAll}
          >
            Clear all
            <X className="ml-1 h-3 w-3" />
          </Button>
        )}
      </div>
      {/* Horizontally scrollable on mobile, wrapping on desktop */}
      <div className="-mx-4 overflow-x-auto px-4 pb-2 md:mx-0 md:overflow-visible md:px-0 md:pb-0">
        <div className="flex flex-nowrap gap-2 md:flex-wrap">
          {availableTags.map((tag) => {
            const isSelected = selectedTags.includes(tag)
            return (
              <Badge
                key={tag}
                variant={isSelected ? 'default' : 'outline'}
                className={cn(
                  'shrink-0 cursor-pointer px-3 py-1.5 text-sm transition-colors active:scale-95',
                  isSelected && 'bg-primary text-primary-foreground'
                )}
                onClick={() => onTagToggle(tag)}
              >
                {tag}
              </Badge>
            )
          })}
        </div>
      </div>
    </div>
  )
}
