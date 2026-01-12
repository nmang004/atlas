'use client'

import { useMemo } from 'react'

import { CheckCircle2, Circle, Database, FileText, Search, User } from 'lucide-react'

import { cn } from '@/lib/utils'

interface DataRequirementsProps {
  content: string
  className?: string
}

interface Section {
  title: string
  items: string[]
}

// Map section titles to icons
const sectionIcons: Record<string, React.ReactNode> = {
  'our asset': <FileText className="h-4 w-4" />,
  'target research': <Search className="h-4 w-4" />,
  'personalization intel': <User className="h-4 w-4" />,
  'client info': <User className="h-4 w-4" />,
  'data sources': <Database className="h-4 w-4" />,
  default: <CheckCircle2 className="h-4 w-4" />,
}

function getIconForSection(title: string): React.ReactNode {
  const normalizedTitle = title.toLowerCase()
  for (const [key, icon] of Object.entries(sectionIcons)) {
    if (normalizedTitle.includes(key)) {
      return icon
    }
  }
  return sectionIcons.default
}

export function DataRequirements({ content, className }: DataRequirementsProps) {
  const sections = useMemo(() => {
    const result: Section[] = []
    let currentSection: Section | null = null

    // Split content by lines and parse
    const lines = content.split('\n')

    for (const line of lines) {
      const trimmed = line.trim()

      // Skip empty lines
      if (!trimmed) {
        continue
      }

      // Skip main title (H2 with ##)
      if (trimmed.startsWith('## ')) {
        continue
      }

      // Check for section header (H3 with ###)
      if (trimmed.startsWith('### ')) {
        if (currentSection && currentSection.items.length > 0) {
          result.push(currentSection)
        }
        currentSection = {
          title: trimmed.replace('### ', ''),
          items: [],
        }
        continue
      }

      // Check for list items (- [ ] or - or * [ ] or *)
      const listMatch = trimmed.match(/^[-*]\s*(\[.\])?\s*(.+)$/)
      if (listMatch && currentSection) {
        // Remove the [ ] checkbox notation if present
        const itemText = listMatch[2].trim()
        currentSection.items.push(itemText)
      }
    }

    // Don't forget the last section
    if (currentSection && currentSection.items.length > 0) {
      result.push(currentSection)
    }

    return result
  }, [content])

  // If we couldn't parse sections, fall back to simple display
  if (sections.length === 0) {
    return (
      <div className={cn('prose prose-sm max-w-none dark:prose-invert', className)}>
        <pre className="whitespace-pre-wrap text-sm">{content}</pre>
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      {sections.map((section, sectionIndex) => (
        <div
          key={sectionIndex}
          className="rounded-lg border bg-gradient-to-br from-muted/30 to-muted/10 p-4"
        >
          {/* Section Header */}
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-primary/10 to-secondary/10 text-primary">
              {getIconForSection(section.title)}
            </div>
            <h4 className="font-semibold text-foreground">{section.title}</h4>
          </div>

          {/* Checklist Items */}
          <ul className="space-y-2 pl-1">
            {section.items.map((item, itemIndex) => (
              <li key={itemIndex} className="flex items-start gap-2.5">
                <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/50" />
                <span className="text-sm text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
