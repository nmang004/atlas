'use client'

import { memo } from 'react'

import Link from 'next/link'

import { ThumbsUp, Clock, AlertTriangle } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { MAX_VISIBLE_TAGS } from '@/lib/constants'
import { formatRelativeTime, formatRating, needsReview } from '@/lib/utils'
import type { PromptCardData } from '@/types'

interface PromptCardProps {
  prompt: PromptCardData
}

// Memoized PromptCard component to prevent unnecessary re-renders in lists
export const PromptCard = memo(function PromptCard({ prompt }: PromptCardProps) {
  const isStale = needsReview(prompt.last_verified_at)
  const visibleTags = prompt.tags.slice(0, MAX_VISIBLE_TAGS)
  const remainingTags = prompt.tags.length - MAX_VISIBLE_TAGS

  return (
    <Link href={`/prompts/${prompt.id}`} className="group block">
      <Card className="hover:border-primary/20 h-full transition-all hover:shadow-md active:shadow-sm">
        <CardHeader className="pb-2 md:pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="line-clamp-2 text-base md:text-lg">{prompt.title}</CardTitle>
            {(prompt.is_flagged || isStale) && (
              <Badge variant="warning" className="shrink-0 text-xs">
                <AlertTriangle className="mr-1 h-3 w-3" />
                <span className="hidden sm:inline">
                  {prompt.is_flagged ? 'Flagged' : 'Needs Review'}
                </span>
                <span className="sm:hidden">!</span>
              </Badge>
            )}
          </div>
          {prompt.category_name && (
            <p className="text-muted-foreground text-xs md:text-sm">{prompt.category_name}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-3 md:space-y-4">
          {/* Tags - horizontally scrollable on mobile */}
          <div className="scrollbar-hide -mx-1 flex flex-nowrap gap-1.5 overflow-x-auto px-1 pb-1 md:flex-wrap md:overflow-visible">
            {visibleTags.map((tag) => (
              <Badge key={tag} variant="secondary" className="shrink-0 text-xs">
                {tag}
              </Badge>
            ))}
            {remainingTags > 0 && (
              <Badge variant="outline" className="shrink-0 text-xs">
                +{remainingTags}
              </Badge>
            )}
          </div>

          {/* Stats - responsive layout */}
          <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-xs md:text-sm">
            <div className="flex items-center gap-1.5">
              <div className="from-primary/10 to-secondary/10 flex h-5 w-5 items-center justify-center rounded bg-linear-to-br md:h-6 md:w-6">
                <ThumbsUp className="text-primary h-3 w-3 md:h-3.5 md:w-3.5" />
              </div>
              <span className="text-foreground font-medium">
                {formatRating(prompt.rating_score)}
              </span>
              <span className="text-[10px] md:text-xs">({prompt.vote_count})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="from-primary/10 to-secondary/10 flex h-5 w-5 items-center justify-center rounded bg-linear-to-br md:h-6 md:w-6">
                <Clock className="text-secondary h-3 w-3 md:h-3.5 md:w-3.5" />
              </div>
              <span>{formatRelativeTime(prompt.last_verified_at)}</span>
            </div>
          </div>

          {prompt.model_version && (
            <p className="text-muted-foreground text-[10px] md:text-xs">
              Optimized for {prompt.model_version}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  )
})

// Display name for dev tools
PromptCard.displayName = 'PromptCard'
