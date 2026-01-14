'use client'

import { useEffect, useState, useCallback } from 'react'

import { useRouter } from 'next/navigation'

import { Command } from 'cmdk'
import { Search, FileText, Wrench, BookOpen, X } from 'lucide-react'

import type { SearchIndex } from '@/lib/sme/search'
import { cn } from '@/lib/utils'

interface SMECommandPaletteProps {
  searchIndex: SearchIndex[]
}

export function SMECommandPalette({ searchIndex }: SMECommandPaletteProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const router = useRouter()

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const handleSelect = useCallback(
    (slug: string) => {
      setOpen(false)
      setSearch('')
      router.push(`/sme/${slug}`)
    },
    [router]
  )

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'tools':
        return <Wrench className="h-4 w-4" />
      case 'reference':
        return <BookOpen className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  // Filter results based on search
  const filteredResults = search
    ? searchIndex.filter(
        (item) =>
          item.title.toLowerCase().includes(search.toLowerCase()) ||
          item.description?.toLowerCase().includes(search.toLowerCase()) ||
          item.tags?.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))
      )
    : searchIndex.slice(0, 8) // Show first 8 items when no search

  if (!open) {return null}

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={() => setOpen(false)} />

      {/* Command palette */}
      <div className="fixed left-1/2 top-[20%] w-full max-w-lg -translate-x-1/2 px-4">
        <Command
          className="rounded-lg border bg-background shadow-lg"
          shouldFilter={false}
        >
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder="Search documentation..."
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="p-1 hover:bg-muted rounded"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Command.List className="max-h-80 overflow-y-auto p-2">
            {filteredResults.length === 0 && (
              <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
                No results found.
              </Command.Empty>
            )}

            {/* Group by category */}
            {['core-principles', 'page-playbooks', 'verticals', 'technical', 'reference', 'tools'].map(
              (category) => {
                const categoryItems = filteredResults.filter(
                  (item) => item.category === category
                )
                if (categoryItems.length === 0) {return null}

                return (
                  <Command.Group
                    key={category}
                    heading={category
                      .split('-')
                      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                      .join(' ')}
                    className="py-1"
                  >
                    {categoryItems.map((item) => (
                      <Command.Item
                        key={item.slug}
                        value={item.slug}
                        onSelect={() => handleSelect(item.slug)}
                        className={cn(
                          'flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm',
                          'aria-selected:bg-accent aria-selected:text-accent-foreground'
                        )}
                      >
                        {getCategoryIcon(item.category)}
                        <div className="flex flex-col">
                          <span className="font-medium">{item.title}</span>
                          {item.description && (
                            <span className="text-xs text-muted-foreground line-clamp-1">
                              {item.description}
                            </span>
                          )}
                        </div>
                      </Command.Item>
                    ))}
                  </Command.Group>
                )
              }
            )}
          </Command.List>

          <div className="border-t p-2 text-xs text-muted-foreground">
            <span className="mr-4">
              <kbd className="rounded border bg-muted px-1">↑</kbd>
              <kbd className="ml-1 rounded border bg-muted px-1">↓</kbd> to navigate
            </span>
            <span className="mr-4">
              <kbd className="rounded border bg-muted px-1">↵</kbd> to select
            </span>
            <span>
              <kbd className="rounded border bg-muted px-1">esc</kbd> to close
            </span>
          </div>
        </Command>
      </div>
    </div>
  )
}
