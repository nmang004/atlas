'use client'

import { useMemo } from 'react'

import { CheckSquare, Circle } from 'lucide-react'

import { cn } from '@/lib/utils'

interface ReviewChecklistProps {
  content: string
  className?: string
}

export function ReviewChecklist({ content, className }: ReviewChecklistProps) {
  const items = useMemo(() => {
    const result: string[] = []

    // Split content by lines and parse
    const lines = content.split('\n')

    for (const line of lines) {
      const trimmed = line.trim()

      // Skip empty lines
      if (!trimmed) {
        continue
      }

      // Skip headings (## or ###)
      if (trimmed.startsWith('#')) {
        continue
      }

      // Check for list items (- [ ] or - or * [ ] or *)
      const listMatch = trimmed.match(/^[-*]\s*(\[.\])?\s*(.+)$/)
      if (listMatch) {
        // Remove the [ ] checkbox notation if present
        const itemText = listMatch[2].trim()
        result.push(itemText)
      }
    }

    return result
  }, [content])

  // If we couldn't parse items, fall back to simple display
  if (items.length === 0) {
    return (
      <div className={cn('prose prose-sm max-w-none dark:prose-invert', className)}>
        <pre className="whitespace-pre-wrap text-sm">{content}</pre>
      </div>
    )
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Header with icon */}
      <div className="flex items-center gap-2 text-muted-foreground">
        <CheckSquare className="h-4 w-4" />
        <span className="text-sm font-medium">Verify before sending</span>
      </div>

      {/* Checklist Items in a grid for better use of space */}
      <div className="grid gap-2 sm:grid-cols-2">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-2.5 rounded-md border bg-muted/30 px-3 py-2"
          >
            <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/50" />
            <span className="text-sm text-muted-foreground">{item}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
