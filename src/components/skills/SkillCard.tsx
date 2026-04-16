'use client'

import { memo } from 'react'

import Link from 'next/link'

import { Sparkles, ThumbsUp, Clock, User } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { SKILL_FORMATS, MAX_VISIBLE_TAGS } from '@/lib/constants'
import { formatRelativeTime, formatRating } from '@/lib/utils'
import type { SkillCardData } from '@/types'

interface SkillCardProps {
  skill: SkillCardData
}

function getFormatLabel(format: string): string {
  const found = SKILL_FORMATS.find((f) => f.value === format)
  return found ? found.label : format
}

export const SkillCard = memo(function SkillCard({ skill }: SkillCardProps) {
  const visibleTags = skill.tags.slice(0, MAX_VISIBLE_TAGS)
  const remainingTags = skill.tags.length - MAX_VISIBLE_TAGS

  return (
    <Link href={`/skills/${skill.slug}`} className="group block">
      <Card className="hover:border-primary/20 h-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:shadow-sm">
        <CardHeader className="pb-2 md:pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="from-primary/10 to-secondary/10 flex h-6 w-6 shrink-0 items-center justify-center rounded bg-linear-to-br">
                <Sparkles className="text-primary h-3.5 w-3.5" />
              </div>
              <CardTitle className="line-clamp-2 text-base md:text-lg">{skill.title}</CardTitle>
            </div>
            {skill.format && (
              <Badge variant="outline" className="shrink-0 text-xs">
                {getFormatLabel(skill.format)}
              </Badge>
            )}
          </div>
          {skill.category_name && (
            <p className="text-muted-foreground text-xs md:text-sm">{skill.category_name}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-3 md:space-y-4">
          {skill.description && (
            <p className="text-muted-foreground line-clamp-2 text-sm">{skill.description}</p>
          )}

          {/* Tags */}
          {visibleTags.length > 0 && (
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
          )}

          {/* Stats */}
          <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-xs md:text-sm">
            {skill.rating_score !== null && skill.rating_score !== undefined && (
              <div className="flex items-center gap-1.5">
                <div className="from-primary/10 to-secondary/10 flex h-5 w-5 items-center justify-center rounded bg-linear-to-br md:h-6 md:w-6">
                  <ThumbsUp className="text-primary h-3 w-3 md:h-3.5 md:w-3.5" />
                </div>
                <span className="text-foreground font-medium">
                  {formatRating(skill.rating_score)}
                </span>
              </div>
            )}
            {skill.author_name && (
              <div className="flex items-center gap-1.5">
                <div className="from-primary/10 to-secondary/10 flex h-5 w-5 items-center justify-center rounded bg-linear-to-br md:h-6 md:w-6">
                  <User className="text-secondary h-3 w-3 md:h-3.5 md:w-3.5" />
                </div>
                <span>{skill.author_name}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <div className="from-primary/10 to-secondary/10 flex h-5 w-5 items-center justify-center rounded bg-linear-to-br md:h-6 md:w-6">
                <Clock className="text-secondary h-3 w-3 md:h-3.5 md:w-3.5" />
              </div>
              <span>{formatRelativeTime(skill.created_at)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
})

SkillCard.displayName = 'SkillCard'
