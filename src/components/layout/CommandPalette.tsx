'use client'

import { useCallback, useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { Command } from 'cmdk'
import { FileText, Plug, Search, Sparkles } from 'lucide-react'

import { useSearchQuery } from '@/hooks/queries/useSearchQuery'
import { useDebounce } from '@/hooks/useDebounce'
import { SEARCH_DEBOUNCE_MS } from '@/lib/constants'
import { cn } from '@/lib/utils'

export function CommandPalette() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, SEARCH_DEBOUNCE_MS)
  const { data: results, isLoading } = useSearchQuery(debouncedQuery)

  const close = useCallback(() => {
    setOpen(false)
    setQuery('')
  }, [])

  // Toggle on Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((prev) => {
          if (prev) {
            // closing — also reset query
            setQuery('')
          }
          return !prev
        })
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSelect = useCallback(
    (path: string) => {
      close()
      router.push(path)
    },
    [close, router]
  )

  if (!open) {
    return null
  }

  const hasResults =
    results && (results.skills.length > 0 || results.mcps.length > 0 || results.prompts.length > 0)

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={close} />

      {/* Command palette */}
      <div className="fixed top-[20%] left-1/2 w-full max-w-lg -translate-x-1/2">
        <Command className="bg-background rounded-lg border shadow-2xl" shouldFilter={false} loop>
          <div className="flex items-center border-b px-3">
            <Search className="text-muted-foreground mr-2 h-4 w-4 shrink-0" />
            <Command.Input
              value={query}
              onValueChange={setQuery}
              placeholder="Search skills, MCPs, prompts..."
              className="placeholder:text-muted-foreground flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  close()
                }
              }}
            />
          </div>

          <Command.List className="max-h-[300px] overflow-y-auto p-2">
            {debouncedQuery.length < 2 && (
              <Command.Empty className="text-muted-foreground py-6 text-center text-sm">
                Type to search...
              </Command.Empty>
            )}

            {debouncedQuery.length >= 2 && isLoading && (
              <Command.Loading className="text-muted-foreground py-6 text-center text-sm">
                Searching...
              </Command.Loading>
            )}

            {debouncedQuery.length >= 2 && !isLoading && !hasResults && (
              <Command.Empty className="text-muted-foreground py-6 text-center text-sm">
                No results found.
              </Command.Empty>
            )}

            {results && results.skills.length > 0 && (
              <Command.Group
                heading="Skills"
                className="[&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium"
              >
                {results.skills.map((skill) => (
                  <Command.Item
                    key={`skill-${skill.id}`}
                    value={`skill-${skill.id}`}
                    onSelect={() => handleSelect(`/skills/${skill.slug}`)}
                    className={cn(
                      'flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none',
                      'aria-selected:bg-accent aria-selected:text-accent-foreground'
                    )}
                  >
                    <Sparkles className="text-muted-foreground h-4 w-4 shrink-0" />
                    <div className="flex-1 truncate">
                      <p className="truncate font-medium">{skill.title}</p>
                      {skill.description && (
                        <p className="text-muted-foreground truncate text-xs">
                          {skill.description}
                        </p>
                      )}
                    </div>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {results && results.mcps.length > 0 && (
              <Command.Group
                heading="MCPs"
                className="[&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium"
              >
                {results.mcps.map((mcp) => (
                  <Command.Item
                    key={`mcp-${mcp.id}`}
                    value={`mcp-${mcp.id}`}
                    onSelect={() => handleSelect(`/mcps/${mcp.slug}`)}
                    className={cn(
                      'flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none',
                      'aria-selected:bg-accent aria-selected:text-accent-foreground'
                    )}
                  >
                    <Plug className="text-muted-foreground h-4 w-4 shrink-0" />
                    <div className="flex-1 truncate">
                      <p className="truncate font-medium">{mcp.title}</p>
                      {mcp.description && (
                        <p className="text-muted-foreground truncate text-xs">{mcp.description}</p>
                      )}
                    </div>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {results && results.prompts.length > 0 && (
              <Command.Group
                heading="Prompts"
                className="[&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium"
              >
                {results.prompts.map((prompt) => (
                  <Command.Item
                    key={`prompt-${prompt.id}`}
                    value={`prompt-${prompt.id}`}
                    onSelect={() => handleSelect(`/prompts/${prompt.id}`)}
                    className={cn(
                      'flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none',
                      'aria-selected:bg-accent aria-selected:text-accent-foreground'
                    )}
                  >
                    <FileText className="text-muted-foreground h-4 w-4 shrink-0" />
                    <div className="flex-1 truncate">
                      <p className="truncate font-medium">{prompt.title}</p>
                      {prompt.description && (
                        <p className="text-muted-foreground truncate text-xs">
                          {prompt.description}
                        </p>
                      )}
                    </div>
                  </Command.Item>
                ))}
              </Command.Group>
            )}
          </Command.List>
        </Command>
      </div>
    </div>
  )
}
