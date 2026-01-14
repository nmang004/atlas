'use client'

import { useState } from 'react'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  Compass,
  FileText,
  Hammer,
  Layers,
  Search,
  Sparkles,
  Target,
  Wrench,
} from 'lucide-react'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import type { SMENavItem } from '@/lib/sme/mdx'
import { cn } from '@/lib/utils'

interface SMESidebarProps {
  navigation: SMENavItem[]
}

const categoryIcons: Record<string, React.ReactNode> = {
  'getting-started': <Compass className="h-4 w-4" />,
  'core-principles': <Target className="h-4 w-4" />,
  'page-playbooks': <FileText className="h-4 w-4" />,
  verticals: <Layers className="h-4 w-4" />,
  technical: <Wrench className="h-4 w-4" />,
  'trends-2025': <Sparkles className="h-4 w-4" />,
  reference: <BookOpen className="h-4 w-4" />,
  tools: <Hammer className="h-4 w-4" />,
}

export function SMESidebar({ navigation }: SMESidebarProps) {
  const pathname = usePathname()
  const [openSections, setOpenSections] = useState<string[]>(['getting-started', 'core-principles'])

  const toggleSection = (slug: string) => {
    setOpenSections((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    )
  }

  const isActive = (slug: string) => {
    const currentPath = pathname.replace('/sme', '').replace(/^\//, '')
    return currentPath === slug || currentPath.startsWith(`${slug}/`)
  }

  return (
    <aside className="fixed left-0 top-16 z-30 hidden h-[calc(100vh-4rem)] w-64 overflow-y-auto border-r bg-background lg:block">
      <div className="p-4">
        {/* Search trigger */}
        <button
          className="mb-4 flex w-full items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
          onClick={() => {
            // Will trigger command palette
            const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true })
            document.dispatchEvent(event)
          }}
        >
          <Search className="h-4 w-4" />
          <span>Search...</span>
          <kbd className="ml-auto rounded border bg-background px-1.5 text-xs">⌘K</kbd>
        </button>

        {/* Navigation */}
        <nav className="space-y-1">
          {/* Home link */}
          <Link
            href="/sme"
            className={cn(
              'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              pathname === '/sme'
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <BookOpen className="h-4 w-4" />
            Overview
          </Link>

          {/* Category sections */}
          {navigation.map((category) => (
            <Collapsible
              key={category.slug}
              open={openSections.includes(category.slug)}
              onOpenChange={() => toggleSection(category.slug)}
            >
              <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
                {categoryIcons[category.slug] || <FileText className="h-4 w-4" />}
                <span className="flex-1 text-left">{category.title}</span>
                {openSections.includes(category.slug) ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-4">
                {category.children?.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/sme/${item.slug}`}
                    className={cn(
                      'flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors',
                      isActive(item.slug)
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    {item.title}
                  </Link>
                ))}
              </CollapsibleContent>
            </Collapsible>
          ))}

          {/* Tools section (always visible) */}
          <div className="pt-4">
            <div className="border-t pt-4">
              <p className="mb-2 px-3 text-xs font-semibold uppercase text-muted-foreground">
                Tools
              </p>
              <Link
                href="/sme/tools/title-checker"
                className={cn(
                  'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
                  pathname === '/sme/tools/title-checker'
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                Title Tag Checker
              </Link>
              <Link
                href="/sme/tools/meta-checker"
                className={cn(
                  'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
                  pathname === '/sme/tools/meta-checker'
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                Meta Description Checker
              </Link>
              <Link
                href="/sme/tools/checklist"
                className={cn(
                  'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
                  pathname === '/sme/tools/checklist'
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                Pre-Launch Checklist
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </aside>
  )
}
