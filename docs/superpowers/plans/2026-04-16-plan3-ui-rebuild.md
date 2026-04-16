# Plan 3: UI Rebuild

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Atlas UI around skills and MCPs as primary content, with a polished new navigation, command palette, contribute page, and refreshed admin/prompts sections. Dark mode first, Scorpion blue branding.

**Architecture:** Replace the dashboard layout (sidebar, header) first so new pages render in the new shell. Build pages top-down: skills library → skill detail → MCPs library → MCP detail → contribute → admin → prompts refresh. Reuse shadcn/ui components. React Query hooks for all data fetching.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS 4, shadcn/ui, React Query, cmdk, lucide-react

**Prerequisite:** Plans 1 and 2 must be completed first.

---

## File Structure

| File | Action | Responsibility |
|------|--------|---------------|
| `src/components/layout/Sidebar.tsx` | Replace | New sidebar with skills/mcps/prompts nav |
| `src/components/layout/Header.tsx` | Replace | New header with global search + Cmd+K |
| `src/components/layout/DashboardShell.tsx` | Replace | New shell with updated sidebar/header |
| `src/components/layout/MobileSidebar.tsx` | Replace | Updated mobile drawer |
| `src/components/layout/CommandPalette.tsx` | Create | Cmd+K search across all content |
| `src/app/(dashboard)/layout.tsx` | Modify | Update data fetching for new nav |
| `src/hooks/queries/useSkillsQuery.ts` | Create | React Query hooks for skills |
| `src/hooks/queries/useMcpsQuery.ts` | Create | React Query hooks for MCPs |
| `src/hooks/queries/useSearchQuery.ts` | Create | React Query hook for global search |
| `src/hooks/queries/useGithubImportQuery.ts` | Create | React Query mutation for GitHub import |
| `src/hooks/useVoting.ts` | Modify | Generalize for entity types |
| `src/components/skills/SkillCard.tsx` | Create | Skill card for grid |
| `src/components/skills/SkillsContent.tsx` | Create | Skills library with filters |
| `src/components/skills/SkillDetailContent.tsx` | Create | Skill detail with tabs/install |
| `src/components/skills/InstallModal.tsx` | Create | Install instructions modal |
| `src/components/mcps/McpCard.tsx` | Create | MCP card for grid |
| `src/components/mcps/McpsContent.tsx` | Create | MCPs library with filters |
| `src/components/mcps/McpDetailContent.tsx` | Create | MCP detail with config/install |
| `src/components/mcps/McpInstallModal.tsx` | Create | MCP install instructions modal |
| `src/components/contribute/ContributePage.tsx` | Create | Tabbed upload/create page |
| `src/components/contribute/SkillForm.tsx` | Create | Paste/form skill creation |
| `src/components/contribute/FileUpload.tsx` | Create | Drag-and-drop file upload |
| `src/components/contribute/GithubImport.tsx` | Create | GitHub URL import |
| `src/components/contribute/McpForm.tsx` | Create | MCP creation form |
| `src/app/(dashboard)/skills/page.tsx` | Create | Skills library page |
| `src/app/(dashboard)/skills/[slug]/page.tsx` | Create | Skill detail page |
| `src/app/(dashboard)/mcps/page.tsx` | Create | MCPs library page |
| `src/app/(dashboard)/mcps/[slug]/page.tsx` | Create | MCP detail page |
| `src/app/(dashboard)/contribute/page.tsx` | Create | Contribute page |
| `src/app/(dashboard)/admin/page.tsx` | Modify | Multi-entity admin dashboard |
| `src/app/(dashboard)/admin/pending/page.tsx` | Create | Pending items page |
| `src/app/(dashboard)/admin/flagged/page.tsx` | Modify | Multi-entity flagged page |
| `src/lib/supabase/middleware.ts` | Modify | Update routes + default redirect |

---

### Task 1: Update Middleware Routes

**Files:**
- Modify: `src/lib/supabase/middleware.ts`

- [ ] **Step 1: Update protected routes and default redirect**

In `src/lib/supabase/middleware.ts`, update the route lists:

```typescript
const protectedRoutes = ['/skills', '/mcps', '/prompts', '/categories', '/admin', '/settings', '/contribute']
const authRoutes = ['/login', '/signup']
const publicRoutes = ['/about']
```

And update the root redirect to `/skills` instead of `/prompts`:

```typescript
if (pathname === '/') {
  if (user) {
    return NextResponse.redirect(new URL('/skills', request.url))
  } else {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}
```

Also update the auth route redirect:

```typescript
if (isAuthRoute && user) {
  return NextResponse.redirect(new URL('/skills', request.url))
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/nick/atlas && git add src/lib/supabase/middleware.ts && git commit -m "refactor: update middleware routes for skills-first navigation"
```

---

### Task 2: Create React Query Hooks

**Files:**
- Create: `src/hooks/queries/useSkillsQuery.ts`
- Create: `src/hooks/queries/useMcpsQuery.ts`
- Create: `src/hooks/queries/useSearchQuery.ts`
- Create: `src/hooks/queries/useGithubImportQuery.ts`
- Modify: `src/hooks/useVoting.ts`

- [ ] **Step 1: Create skills query hooks**

```typescript
// src/hooks/queries/useSkillsQuery.ts
'use client'

import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import type { SkillCardData } from '@/types'

interface SkillsResponse {
  skills: SkillCardData[]
  nextCursor: string | null
  hasMore: boolean
}

interface SkillsQueryOptions {
  category?: string | null
  search?: string | null
  format?: string | null
  tag?: string | null
}

export function useSkillsInfiniteQuery(options: SkillsQueryOptions = {}) {
  return useInfiniteQuery({
    queryKey: ['skills', options],
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams()
      if (pageParam) {
        params.set('cursor', pageParam)
      }
      if (options.category) {
        params.set('category', options.category)
      }
      if (options.search) {
        params.set('search', options.search)
      }
      if (options.format) {
        params.set('format', options.format)
      }
      if (options.tag) {
        params.set('tag', options.tag)
      }
      const res = await fetch(`/api/skills?${params.toString()}`)
      if (!res.ok) {
        throw new Error('Failed to fetch skills')
      }
      return res.json() as Promise<SkillsResponse>
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 60_000,
  })
}

export function useSkillQuery(slug: string) {
  return useQuery({
    queryKey: ['skill', slug],
    queryFn: async () => {
      const res = await fetch(`/api/skills/${slug}`)
      if (!res.ok) {
        throw new Error('Failed to fetch skill')
      }
      const data = await res.json()
      return data.skill
    },
    staleTime: 60_000,
  })
}

export function useInvalidateSkills() {
  const queryClient = useQueryClient()
  return {
    invalidateAll: () => queryClient.invalidateQueries({ queryKey: ['skills'] }),
    invalidateOne: (slug: string) =>
      queryClient.invalidateQueries({ queryKey: ['skill', slug] }),
  }
}
```

- [ ] **Step 2: Create MCPs query hooks**

```typescript
// src/hooks/queries/useMcpsQuery.ts
'use client'

import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import type { McpCardData } from '@/types'

interface McpsResponse {
  mcps: McpCardData[]
  nextCursor: string | null
  hasMore: boolean
}

interface McpsQueryOptions {
  category?: string | null
  search?: string | null
  server_type?: string | null
  tag?: string | null
}

export function useMcpsInfiniteQuery(options: McpsQueryOptions = {}) {
  return useInfiniteQuery({
    queryKey: ['mcps', options],
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams()
      if (pageParam) {
        params.set('cursor', pageParam)
      }
      if (options.category) {
        params.set('category', options.category)
      }
      if (options.search) {
        params.set('search', options.search)
      }
      if (options.server_type) {
        params.set('server_type', options.server_type)
      }
      if (options.tag) {
        params.set('tag', options.tag)
      }
      const res = await fetch(`/api/mcps?${params.toString()}`)
      if (!res.ok) {
        throw new Error('Failed to fetch MCPs')
      }
      return res.json() as Promise<McpsResponse>
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 60_000,
  })
}

export function useMcpQuery(slug: string) {
  return useQuery({
    queryKey: ['mcp', slug],
    queryFn: async () => {
      const res = await fetch(`/api/mcps/${slug}`)
      if (!res.ok) {
        throw new Error('Failed to fetch MCP')
      }
      const data = await res.json()
      return data.mcp
    },
    staleTime: 60_000,
  })
}

export function useInvalidateMcps() {
  const queryClient = useQueryClient()
  return {
    invalidateAll: () => queryClient.invalidateQueries({ queryKey: ['mcps'] }),
    invalidateOne: (slug: string) =>
      queryClient.invalidateQueries({ queryKey: ['mcp', slug] }),
  }
}
```

- [ ] **Step 3: Create search query hook**

```typescript
// src/hooks/queries/useSearchQuery.ts
'use client'

import { useQuery } from '@tanstack/react-query'

interface SearchResults {
  skills: Array<{ id: string; title: string; slug: string; description: string | null }>
  mcps: Array<{ id: string; title: string; slug: string; description: string | null }>
  prompts: Array<{ id: string; title: string; description: string | null }>
}

export function useSearchQuery(query: string) {
  return useQuery({
    queryKey: ['search', query],
    queryFn: async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      if (!res.ok) {
        throw new Error('Search failed')
      }
      const data = await res.json()
      return data.results as SearchResults
    },
    enabled: query.length >= 2,
    staleTime: 30_000,
  })
}
```

- [ ] **Step 4: Create GitHub import mutation hook**

```typescript
// src/hooks/queries/useGithubImportQuery.ts
'use client'

import { useMutation } from '@tanstack/react-query'

interface ImportedFile {
  name: string
  path: string
  raw: string
  frontmatter: Record<string, unknown>
  content: string
  is_valid: boolean
}

export function useGithubImport() {
  return useMutation({
    mutationFn: async (url: string) => {
      const res = await fetch('/api/import/github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Import failed')
      }
      const data = await res.json()
      return data.files as ImportedFile[]
    },
  })
}
```

- [ ] **Step 5: Generalize the voting hook**

Update `src/hooks/useVoting.ts` to accept entity type and ID instead of just prompt ID:

```typescript
// src/hooks/useVoting.ts
'use client'

import { useCallback, useState } from 'react'

import type { EntityType, VoteOutcome } from '@/types'

interface UseVotingOptions {
  entityType: EntityType
  entityId: string
  onSuccess?: () => void
  onError?: (error: string) => void
}

interface UseVotingReturn {
  submitVote: (outcome: VoteOutcome, feedback?: string) => Promise<void>
  isLoading: boolean
  error: string | null
}

const MAX_RETRIES = 3
const BASE_DELAY = 1000

export function useVoting({
  entityType,
  entityId,
  onSuccess,
  onError,
}: UseVotingOptions): UseVotingReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitVote = useCallback(
    async (outcome: VoteOutcome, feedback?: string) => {
      setIsLoading(true)
      setError(null)

      let lastError = ''
      for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
          const res = await fetch('/api/vote', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              entity_type: entityType,
              entity_id: entityId,
              outcome,
              feedback,
            }),
          })

          if (res.ok) {
            setIsLoading(false)
            onSuccess?.()
            return
          }

          if (res.status === 429) {
            lastError = 'Rate limit exceeded. Please wait.'
            if (attempt < MAX_RETRIES) {
              await new Promise((r) => setTimeout(r, BASE_DELAY * 2 ** attempt))
              continue
            }
          }

          const data = await res.json()
          lastError = data.error || 'Vote failed'
          break
        } catch {
          lastError = 'Network error'
          if (attempt < MAX_RETRIES) {
            await new Promise((r) => setTimeout(r, BASE_DELAY * 2 ** attempt))
            continue
          }
        }
      }

      setIsLoading(false)
      setError(lastError)
      onError?.(lastError)
    },
    [entityType, entityId, onSuccess, onError]
  )

  return { submitVote, isLoading, error }
}
```

- [ ] **Step 6: Commit**

```bash
cd /Users/nick/atlas && git add src/hooks/ && git commit -m "feat: add skills, mcps, search query hooks and generalize voting"
```

---

### Task 3: Rebuild Layout — Sidebar

**Files:**
- Replace: `src/components/layout/Sidebar.tsx`

- [ ] **Step 1: Create new Sidebar component**

```tsx
// src/components/layout/Sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  FileText,
  Flag,
  FolderOpen,
  LayoutDashboard,
  Clock,
  Plug,
  Plus,
  Settings,
  Sparkles,
  MessageSquare,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { NAV_ITEMS, ADMIN_NAV_ITEMS, CONTRIBUTE_NAV_ITEM } from '@/lib/constants'

import type { User } from '@/types'

const iconMap: Record<string, React.ElementType> = {
  Sparkles,
  Plug,
  FileText,
  FolderOpen,
  LayoutDashboard,
  Clock,
  Flag,
  Plus,
  Settings,
  MessageSquare,
}

interface SidebarProps {
  user: User | null
  isAdmin: boolean
}

export function Sidebar({ user, isAdmin }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-navy text-white">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <span className="font-heading text-lg font-bold">Atlas</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {/* Main nav */}
        {NAV_ITEMS.map((item) => {
          const Icon = iconMap[item.icon]
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/20 text-primary-foreground'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              )}
            >
              {Icon && <Icon className="w-4 h-4 shrink-0" />}
              {item.label}
            </Link>
          )
        })}

        {/* Divider */}
        <div className="my-3 border-t border-white/10" />

        {/* Contribute */}
        {(() => {
          const Icon = iconMap[CONTRIBUTE_NAV_ITEM.icon]
          const isActive = pathname === CONTRIBUTE_NAV_ITEM.href
          return (
            <Link
              href={CONTRIBUTE_NAV_ITEM.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/20 text-primary-foreground'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              )}
            >
              {Icon && <Icon className="w-4 h-4 shrink-0" />}
              {CONTRIBUTE_NAV_ITEM.label}
            </Link>
          )
        })()}

        {/* Admin section */}
        {isAdmin && (
          <>
            <div className="my-3 border-t border-white/10" />
            <p className="px-3 text-xs font-semibold text-white/40 uppercase tracking-wider mb-1">
              Admin
            </p>
            {ADMIN_NAV_ITEMS.map((item) => {
              const Icon = iconMap[item.icon]
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/20 text-primary-foreground'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  )}
                >
                  {Icon && <Icon className="w-4 h-4 shrink-0" />}
                  {item.label}
                </Link>
              )
            })}
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/10 space-y-1">
        <Link
          href="/settings"
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
            pathname === '/settings'
              ? 'bg-primary/20 text-primary-foreground'
              : 'text-white/70 hover:text-white hover:bg-white/5'
          )}
        >
          <Settings className="w-4 h-4 shrink-0" />
          Settings
        </Link>
        {user && (
          <div className="px-3 py-2 text-xs text-white/40 truncate">
            {user.name || user.email}
          </div>
        )}
      </div>
    </aside>
  )
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/nick/atlas && git add src/components/layout/Sidebar.tsx && git commit -m "feat: rebuild sidebar with skills-first navigation"
```

---

### Task 4: Rebuild Layout — Header with Command Palette

**Files:**
- Replace: `src/components/layout/Header.tsx`
- Create: `src/components/layout/CommandPalette.tsx`

- [ ] **Step 1: Create Command Palette component**

```tsx
// src/components/layout/CommandPalette.tsx
'use client'

import { useCallback, useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { Command } from 'cmdk'
import { FileText, Plug, Search, Sparkles } from 'lucide-react'

import { useSearchQuery } from '@/hooks/queries/useSearchQuery'
import { useDebounce } from '@/hooks/useDebounce'

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)
  const { data: results } = useSearchQuery(debouncedQuery)
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const navigate = useCallback(
    (path: string) => {
      setOpen(false)
      setQuery('')
      router.push(path)
    },
    [router]
  )

  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      <div className="relative mx-auto mt-[20vh] max-w-lg">
        <Command className="rounded-xl border border-border bg-popover shadow-2xl overflow-hidden">
          <div className="flex items-center border-b border-border px-4">
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <Command.Input
              value={query}
              onValueChange={setQuery}
              placeholder="Search skills, MCPs, prompts..."
              className="flex-1 py-3 px-2 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-border bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
              Esc
            </kbd>
          </div>

          <Command.List className="max-h-72 overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
              No results found.
            </Command.Empty>

            {results?.skills && results.skills.length > 0 && (
              <Command.Group heading="Skills">
                {results.skills.map((skill) => (
                  <Command.Item
                    key={skill.id}
                    value={`skill-${skill.title}`}
                    onSelect={() => navigate(`/skills/${skill.slug}`)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm aria-selected:bg-accent"
                  >
                    <Sparkles className="w-4 h-4 text-primary shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium truncate">{skill.title}</p>
                      {skill.description && (
                        <p className="text-xs text-muted-foreground truncate">
                          {skill.description}
                        </p>
                      )}
                    </div>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {results?.mcps && results.mcps.length > 0 && (
              <Command.Group heading="MCPs">
                {results.mcps.map((mcp) => (
                  <Command.Item
                    key={mcp.id}
                    value={`mcp-${mcp.title}`}
                    onSelect={() => navigate(`/mcps/${mcp.slug}`)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm aria-selected:bg-accent"
                  >
                    <Plug className="w-4 h-4 text-secondary shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium truncate">{mcp.title}</p>
                      {mcp.description && (
                        <p className="text-xs text-muted-foreground truncate">
                          {mcp.description}
                        </p>
                      )}
                    </div>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {results?.prompts && results.prompts.length > 0 && (
              <Command.Group heading="Prompts">
                {results.prompts.map((prompt) => (
                  <Command.Item
                    key={prompt.id}
                    value={`prompt-${prompt.title}`}
                    onSelect={() => navigate(`/prompts/${prompt.id}`)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm aria-selected:bg-accent"
                  >
                    <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium truncate">{prompt.title}</p>
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
```

- [ ] **Step 2: Add useDebounce hook if it doesn't exist**

Check if it exists:
```bash
grep -rn "useDebounce" /Users/nick/atlas/src/hooks/
```

If not, create it:

```typescript
// src/hooks/useDebounce.ts
'use client'

import { useEffect, useState } from 'react'

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
```

- [ ] **Step 3: Create new Header component**

```tsx
// src/components/layout/Header.tsx
'use client'

import { Menu, Search } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between h-14 px-4 lg:px-6 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
      >
        <Menu className="w-5 h-5" />
      </Button>

      {/* Cmd+K search trigger */}
      <button
        onClick={() => {
          document.dispatchEvent(
            new KeyboardEvent('keydown', { key: 'k', metaKey: true })
          )
        }}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-muted/50 text-sm text-muted-foreground hover:bg-muted transition-colors max-w-sm w-full lg:w-80"
      >
        <Search className="w-4 h-4 shrink-0" />
        <span className="flex-1 text-left">Search...</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-border bg-background px-1.5 py-0.5 text-xs">
          <span className="text-xs">&#8984;</span>K
        </kbd>
      </button>

      {/* Spacer for right-aligned items if needed */}
      <div className="w-10 lg:hidden" />
    </header>
  )
}
```

- [ ] **Step 4: Commit**

```bash
cd /Users/nick/atlas && git add src/components/layout/Header.tsx src/components/layout/CommandPalette.tsx src/hooks/useDebounce.ts && git commit -m "feat: add command palette and new header with Cmd+K search"
```

---

### Task 5: Rebuild DashboardShell and Mobile Sidebar

**Files:**
- Replace: `src/components/layout/DashboardShell.tsx`
- Replace: `src/components/layout/MobileSidebar.tsx`
- Modify: `src/app/(dashboard)/layout.tsx`

- [ ] **Step 1: Create new DashboardShell**

```tsx
// src/components/layout/DashboardShell.tsx
'use client'

import { useState } from 'react'

import { CommandPalette } from '@/components/layout/CommandPalette'
import { Header } from '@/components/layout/Header'
import { MobileSidebar } from '@/components/layout/MobileSidebar'
import { Sidebar } from '@/components/layout/Sidebar'

import type { User } from '@/types'

interface DashboardShellProps {
  children: React.ReactNode
  user: User | null
  isAdmin: boolean
}

export function DashboardShell({ children, user, isAdmin }: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Sidebar user={user} isAdmin={isAdmin} />
      <MobileSidebar
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        user={user}
        isAdmin={isAdmin}
      />
      <div className="lg:pl-64">
        <Header onMenuClick={() => setMobileOpen(true)} />
        <main className="p-4 lg:p-6 max-w-7xl mx-auto">{children}</main>
      </div>
      <CommandPalette />
    </div>
  )
}
```

- [ ] **Step 2: Create new MobileSidebar**

```tsx
// src/components/layout/MobileSidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  FileText,
  Flag,
  FolderOpen,
  LayoutDashboard,
  Clock,
  Plug,
  Plus,
  Settings,
  Sparkles,
  X,
} from 'lucide-react'

import { Sheet, SheetContent } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { NAV_ITEMS, ADMIN_NAV_ITEMS, CONTRIBUTE_NAV_ITEM } from '@/lib/constants'

import type { User } from '@/types'

const iconMap: Record<string, React.ElementType> = {
  Sparkles, Plug, FileText, FolderOpen, LayoutDashboard, Clock, Flag, Plus, Settings, X,
}

interface MobileSidebarProps {
  open: boolean
  onClose: () => void
  user: User | null
  isAdmin: boolean
}

export function MobileSidebar({ open, onClose, user, isAdmin }: MobileSidebarProps) {
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="left" className="w-64 p-0 bg-navy text-white border-none">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-heading text-lg font-bold">Atlas</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = iconMap[item.icon]
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/20 text-primary-foreground'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                )}
              >
                {Icon && <Icon className="w-4 h-4 shrink-0" />}
                {item.label}
              </Link>
            )
          })}

          <div className="my-3 border-t border-white/10" />

          <Link
            href={CONTRIBUTE_NAV_ITEM.href}
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/5"
          >
            <Plus className="w-4 h-4 shrink-0" />
            {CONTRIBUTE_NAV_ITEM.label}
          </Link>

          {isAdmin && (
            <>
              <div className="my-3 border-t border-white/10" />
              <p className="px-3 text-xs font-semibold text-white/40 uppercase tracking-wider mb-1">
                Admin
              </p>
              {ADMIN_NAV_ITEMS.map((item) => {
                const Icon = iconMap[item.icon]
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/5"
                  >
                    {Icon && <Icon className="w-4 h-4 shrink-0" />}
                    {item.label}
                  </Link>
                )
              })}
            </>
          )}
        </nav>

        <div className="p-3 border-t border-white/10">
          <Link
            href="/settings"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/5"
          >
            <Settings className="w-4 h-4 shrink-0" />
            Settings
          </Link>
          {user && (
            <div className="px-3 py-2 text-xs text-white/40 truncate">
              {user.name || user.email}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
```

- [ ] **Step 3: Simplify dashboard layout**

Update `src/app/(dashboard)/layout.tsx` — the DashboardShell no longer needs categories:

```tsx
// src/app/(dashboard)/layout.tsx
import { DashboardShell } from '@/components/layout/DashboardShell'
import { createClient } from '@/lib/supabase/server'

import type { User } from '@/types'

async function getCurrentUser(): Promise<{ user: User | null; isAdmin: boolean }> {
  const supabase = await createClient()

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser) {
    return { user: null, isAdmin: false }
  }

  const { data: userProfile } = await supabase
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .single()

  const user = userProfile as unknown as User | null

  return {
    user,
    isAdmin: user?.role === 'admin',
  }
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin } = await getCurrentUser()

  return (
    <DashboardShell user={user} isAdmin={isAdmin}>
      {children}
    </DashboardShell>
  )
}
```

- [ ] **Step 4: Commit**

```bash
cd /Users/nick/atlas && git add src/components/layout/ src/app/\(dashboard\)/layout.tsx && git commit -m "feat: rebuild dashboard shell with new sidebar, header, mobile nav"
```

---

### Task 6: Skills Library Page

**Files:**
- Create: `src/components/skills/SkillCard.tsx`
- Create: `src/components/skills/SkillsContent.tsx`
- Create: `src/app/(dashboard)/skills/page.tsx`

- [ ] **Step 1: Create SkillCard component**

```tsx
// src/components/skills/SkillCard.tsx
import Link from 'next/link'

import { Sparkles, ThumbsUp } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { MAX_VISIBLE_TAGS } from '@/lib/constants'
import { formatRelativeTime } from '@/lib/utils'

import type { SkillCardData } from '@/types'

interface SkillCardProps {
  skill: SkillCardData
}

export function SkillCard({ skill }: SkillCardProps) {
  const visibleTags = skill.tags.slice(0, MAX_VISIBLE_TAGS)
  const overflowCount = skill.tags.length - MAX_VISIBLE_TAGS

  return (
    <Link href={`/skills/${skill.slug}`}>
      <Card className="h-full hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Sparkles className="w-4 h-4 text-primary shrink-0" />
              <h3 className="font-heading font-semibold text-sm truncate group-hover:text-primary transition-colors">
                {skill.title}
              </h3>
            </div>
            <Badge variant="outline" className="text-xs shrink-0">
              {skill.format === 'claude_code_skill' ? 'Skill' : skill.format}
            </Badge>
          </div>
          {skill.category_name && (
            <p className="text-xs text-muted-foreground">{skill.category_name}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          {skill.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {skill.description}
            </p>
          )}

          {visibleTags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {visibleTags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {overflowCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  +{overflowCount}
                </Badge>
              )}
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
            <div className="flex items-center gap-3">
              {skill.vote_count > 0 && (
                <span className="flex items-center gap-1">
                  <ThumbsUp className="w-3 h-3" />
                  {Math.round(skill.rating_score)}%
                </span>
              )}
              {skill.author_name && <span>by {skill.author_name}</span>}
            </div>
            <span>{formatRelativeTime(skill.created_at)}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
```

- [ ] **Step 2: Create SkillsContent component**

```tsx
// src/components/skills/SkillsContent.tsx
'use client'

import { useState } from 'react'

import { Loader2 } from 'lucide-react'

import { SkillCard } from '@/components/skills/SkillCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useSkillsInfiniteQuery } from '@/hooks/queries/useSkillsQuery'
import { useDebounce } from '@/hooks/useDebounce'
import { SKILL_FORMATS } from '@/lib/constants'

export function SkillsContent() {
  const [search, setSearch] = useState('')
  const [format, setFormat] = useState<string | null>(null)
  const debouncedSearch = useDebounce(search, 300)

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useSkillsInfiniteQuery({
    search: debouncedSearch || null,
    format,
  })

  const skills = data?.pages.flatMap((page) => page.skills) || []

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Search skills..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-xs"
        />
        <Select
          value={format || 'all'}
          onValueChange={(v) => setFormat(v === 'all' ? null : v)}
        >
          <SelectTrigger className="sm:w-48">
            <SelectValue placeholder="All formats" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All formats</SelectItem>
            {SKILL_FORMATS.map((f) => (
              <SelectItem key={f.value} value={f.value}>
                {f.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-48 rounded-lg bg-muted animate-pulse"
            />
          ))}
        </div>
      ) : skills.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg font-medium">No skills found</p>
          <p className="text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {skills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
          {hasNextPage && (
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Load more
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Create skills page**

```tsx
// src/app/(dashboard)/skills/page.tsx
import { SkillsContent } from '@/components/skills/SkillsContent'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Skills',
  description: 'Browse Claude Code skills and other AI skill configurations',
}

export default function SkillsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Skills</h1>
        <p className="text-muted-foreground mt-1">
          Browse and install Claude Code skills for your workflows
        </p>
      </div>
      <SkillsContent />
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
cd /Users/nick/atlas && git add src/components/skills/ src/app/\(dashboard\)/skills/ && git commit -m "feat: add skills library page with cards, filters, infinite scroll"
```

---

### Task 7: Skill Detail Page with Install Modal

**Files:**
- Create: `src/components/skills/SkillDetailContent.tsx`
- Create: `src/components/skills/InstallModal.tsx`
- Create: `src/app/(dashboard)/skills/[slug]/page.tsx`

- [ ] **Step 1: Create InstallModal**

```tsx
// src/components/skills/InstallModal.tsx
'use client'

import { Check, Copy } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'

interface InstallModalProps {
  open: boolean
  onClose: () => void
  title: string
  slug: string
  rawFile: string | null
}

export function InstallModal({ open, onClose, title, slug, rawFile }: InstallModalProps) {
  const { copy, copied } = useCopyToClipboard()
  const filePath = `.claude/skills/${slug}.md`
  const content = rawFile || ''

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Install {title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-1">Save to:</p>
            <code className="text-sm bg-muted px-2 py-1 rounded">{filePath}</code>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-medium">File content:</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copy(content)}
              >
                {copied ? (
                  <Check className="w-4 h-4 mr-1" />
                ) : (
                  <Copy className="w-4 h-4 mr-1" />
                )}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
            <pre className="bg-muted rounded-lg p-4 text-xs overflow-x-auto max-h-96">
              <code>{content}</code>
            </pre>
          </div>

          <div className="bg-accent/50 rounded-lg p-3 text-sm">
            <p className="font-medium mb-1">Instructions:</p>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>Copy the file content above</li>
              <li>Create the file at <code className="text-xs bg-muted px-1 rounded">{filePath}</code> in your project</li>
              <li>The skill will be available in your next Claude Code session</li>
            </ol>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

- [ ] **Step 2: Create SkillDetailContent**

```tsx
// src/components/skills/SkillDetailContent.tsx
'use client'

import { useState } from 'react'

import Link from 'next/link'

import { ArrowLeft, Check, Copy, Download, Plug, ThumbsDown, ThumbsUp } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

import { InstallModal } from '@/components/skills/InstallModal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { useSkillQuery } from '@/hooks/queries/useSkillsQuery'
import { useVoting } from '@/hooks/useVoting'
import { formatRelativeTime } from '@/lib/utils'

interface SkillDetailContentProps {
  slug: string
}

export function SkillDetailContent({ slug }: SkillDetailContentProps) {
  const { data: skill, isLoading } = useSkillQuery(slug)
  const [installOpen, setInstallOpen] = useState(false)
  const { copy, copied } = useCopyToClipboard()
  const { submitVote, isLoading: voteLoading } = useVoting({
    entityType: 'skill',
    entityId: skill?.id || '',
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="h-64 bg-muted animate-pulse rounded-lg" />
      </div>
    )
  }

  if (!skill) {
    return <p className="text-muted-foreground">Skill not found.</p>
  }

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/skills"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Skills
      </Link>

      {/* Hero */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="font-heading text-2xl font-bold">{skill.title}</h1>
          {skill.description && (
            <p className="text-muted-foreground max-w-2xl">{skill.description}</p>
          )}
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            {skill.category && <Badge variant="outline">{skill.category.name}</Badge>}
            <Badge variant="secondary">{skill.format}</Badge>
            {skill.author && <span>by {skill.author.name || skill.author.email}</span>}
            <span>{formatRelativeTime(skill.created_at)}</span>
            {skill.vote_count > 0 && (
              <span className="flex items-center gap-1">
                <ThumbsUp className="w-3 h-3" />
                {Math.round(skill.rating_score)}% ({skill.vote_count} votes)
              </span>
            )}
          </div>
          {skill.tags && skill.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {skill.tags.map((tag: string) => (
                <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          <Button onClick={() => setInstallOpen(true)}>
            <Download className="w-4 h-4 mr-2" />
            Install
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => submitVote('positive')}
            disabled={voteLoading}
          >
            <ThumbsUp className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => submitVote('negative')}
            disabled={voteLoading}
          >
            <ThumbsDown className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content tabs */}
      <Tabs defaultValue="docs" className="w-full">
        <TabsList>
          <TabsTrigger value="docs">Documentation</TabsTrigger>
          {skill.raw_file && <TabsTrigger value="raw">Raw File</TabsTrigger>}
        </TabsList>

        <TabsContent value="docs" className="mt-4">
          {skill.content ? (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown>{skill.content}</ReactMarkdown>
            </div>
          ) : (
            <p className="text-muted-foreground">No documentation available.</p>
          )}
        </TabsContent>

        {skill.raw_file && (
          <TabsContent value="raw" className="mt-4">
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => copy(skill.raw_file)}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
              <pre className="bg-muted rounded-lg p-4 text-xs overflow-x-auto">
                <code>{skill.raw_file}</code>
              </pre>
            </div>
          </TabsContent>
        )}
      </Tabs>

      {/* Linked content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {skill.linked_prompts && skill.linked_prompts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Linked Prompts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {skill.linked_prompts.map((lp: { prompt: { id: string; title: string } }) => (
                <Link
                  key={lp.prompt.id}
                  href={`/prompts/${lp.prompt.id}`}
                  className="block p-2 rounded hover:bg-muted transition-colors text-sm"
                >
                  {lp.prompt.title}
                </Link>
              ))}
            </CardContent>
          </Card>
        )}

        {skill.linked_mcps && skill.linked_mcps.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Plug className="w-4 h-4" />
                Works With
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {skill.linked_mcps.map((lm: { mcp: { slug: string; title: string; description: string | null } }) => (
                <Link
                  key={lm.mcp.slug}
                  href={`/mcps/${lm.mcp.slug}`}
                  className="block p-2 rounded hover:bg-muted transition-colors"
                >
                  <p className="text-sm font-medium">{lm.mcp.title}</p>
                  {lm.mcp.description && (
                    <p className="text-xs text-muted-foreground truncate">{lm.mcp.description}</p>
                  )}
                </Link>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      <InstallModal
        open={installOpen}
        onClose={() => setInstallOpen(false)}
        title={skill.title}
        slug={skill.slug}
        rawFile={skill.raw_file}
      />
    </div>
  )
}
```

- [ ] **Step 3: Create skill detail page**

```tsx
// src/app/(dashboard)/skills/[slug]/page.tsx
import { SkillDetailContent } from '@/components/skills/SkillDetailContent'

import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  return { title: slug.replace(/-/g, ' ') }
}

export default async function SkillDetailPage({ params }: Props) {
  const { slug } = await params
  return <SkillDetailContent slug={slug} />
}
```

- [ ] **Step 4: Commit**

```bash
cd /Users/nick/atlas && git add src/components/skills/ src/app/\(dashboard\)/skills/ && git commit -m "feat: add skill detail page with install modal, voting, linked content"
```

---

### Task 8: MCPs Library and Detail Pages

**Files:**
- Create: `src/components/mcps/McpCard.tsx`
- Create: `src/components/mcps/McpsContent.tsx`
- Create: `src/components/mcps/McpDetailContent.tsx`
- Create: `src/components/mcps/McpInstallModal.tsx`
- Create: `src/app/(dashboard)/mcps/page.tsx`
- Create: `src/app/(dashboard)/mcps/[slug]/page.tsx`

- [ ] **Step 1: Create McpCard component**

```tsx
// src/components/mcps/McpCard.tsx
import Link from 'next/link'

import { Plug, ThumbsUp } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { MAX_VISIBLE_TAGS } from '@/lib/constants'
import { formatRelativeTime } from '@/lib/utils'

import type { McpCardData } from '@/types'

interface McpCardProps {
  mcp: McpCardData
}

export function McpCard({ mcp }: McpCardProps) {
  const visibleTags = mcp.tags.slice(0, MAX_VISIBLE_TAGS)
  const overflowCount = mcp.tags.length - MAX_VISIBLE_TAGS

  return (
    <Link href={`/mcps/${mcp.slug}`}>
      <Card className="h-full hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Plug className="w-4 h-4 text-secondary shrink-0" />
              <h3 className="font-heading font-semibold text-sm truncate group-hover:text-primary transition-colors">
                {mcp.title}
              </h3>
            </div>
            <Badge variant="outline" className="text-xs shrink-0">
              {mcp.server_type}
            </Badge>
          </div>
          {mcp.category_name && (
            <p className="text-xs text-muted-foreground">{mcp.category_name}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          {mcp.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {mcp.description}
            </p>
          )}

          {visibleTags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {visibleTags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {overflowCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  +{overflowCount}
                </Badge>
              )}
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
            <div className="flex items-center gap-3">
              {mcp.vote_count > 0 && (
                <span className="flex items-center gap-1">
                  <ThumbsUp className="w-3 h-3" />
                  {Math.round(mcp.rating_score)}%
                </span>
              )}
              {mcp.author_name && <span>by {mcp.author_name}</span>}
            </div>
            <span>{formatRelativeTime(mcp.created_at)}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
```

- [ ] **Step 2: Create McpsContent component**

```tsx
// src/components/mcps/McpsContent.tsx
'use client'

import { useState } from 'react'

import { Loader2 } from 'lucide-react'

import { McpCard } from '@/components/mcps/McpCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useMcpsInfiniteQuery } from '@/hooks/queries/useMcpsQuery'
import { useDebounce } from '@/hooks/useDebounce'
import { MCP_SERVER_TYPES } from '@/lib/constants'

export function McpsContent() {
  const [search, setSearch] = useState('')
  const [serverType, setServerType] = useState<string | null>(null)
  const debouncedSearch = useDebounce(search, 300)

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useMcpsInfiniteQuery({
    search: debouncedSearch || null,
    server_type: serverType,
  })

  const mcps = data?.pages.flatMap((page) => page.mcps) || []

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Search MCPs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-xs"
        />
        <Select
          value={serverType || 'all'}
          onValueChange={(v) => setServerType(v === 'all' ? null : v)}
        >
          <SelectTrigger className="sm:w-48">
            <SelectValue placeholder="All server types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All server types</SelectItem>
            {MCP_SERVER_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : mcps.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg font-medium">No MCPs found</p>
          <p className="text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {mcps.map((mcp) => (
              <McpCard key={mcp.id} mcp={mcp} />
            ))}
          </div>
          {hasNextPage && (
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Load more
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Create McpInstallModal**

```tsx
// src/components/mcps/McpInstallModal.tsx
'use client'

import { Check, Copy } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'

interface McpInstallModalProps {
  open: boolean
  onClose: () => void
  title: string
  configJson: Record<string, unknown> | null
}

export function McpInstallModal({ open, onClose, title, configJson }: McpInstallModalProps) {
  const { copy, copied } = useCopyToClipboard()
  const configString = configJson ? JSON.stringify(configJson, null, 2) : '{}'

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Install {title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-medium">MCP config:</p>
              <Button variant="ghost" size="sm" onClick={() => copy(configString)}>
                {copied ? (
                  <Check className="w-4 h-4 mr-1" />
                ) : (
                  <Copy className="w-4 h-4 mr-1" />
                )}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
            <pre className="bg-muted rounded-lg p-4 text-xs overflow-x-auto max-h-96">
              <code>{configString}</code>
            </pre>
          </div>

          <div className="bg-accent/50 rounded-lg p-3 text-sm">
            <p className="font-medium mb-1">Instructions:</p>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>Copy the config JSON above</li>
              <li>
                Add it to your project's <code className="text-xs bg-muted px-1 rounded">.mcp.json</code> file
                under the <code className="text-xs bg-muted px-1 rounded">mcpServers</code> key
              </li>
              <li>Or add it to your global Claude Code config at <code className="text-xs bg-muted px-1 rounded">~/.claude/.mcp.json</code></li>
              <li>Restart your Claude Code session to activate</li>
            </ol>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

- [ ] **Step 4: Create McpDetailContent**

```tsx
// src/components/mcps/McpDetailContent.tsx
'use client'

import { useState } from 'react'

import Link from 'next/link'

import { ArrowLeft, Check, Copy, Download, Sparkles, ThumbsDown, ThumbsUp } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

import { McpInstallModal } from '@/components/mcps/McpInstallModal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { useMcpQuery } from '@/hooks/queries/useMcpsQuery'
import { useVoting } from '@/hooks/useVoting'
import { formatRelativeTime } from '@/lib/utils'

interface McpDetailContentProps {
  slug: string
}

export function McpDetailContent({ slug }: McpDetailContentProps) {
  const { data: mcp, isLoading } = useMcpQuery(slug)
  const [installOpen, setInstallOpen] = useState(false)
  const { copy, copied } = useCopyToClipboard()
  const { submitVote, isLoading: voteLoading } = useVoting({
    entityType: 'mcp',
    entityId: mcp?.id || '',
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="h-64 bg-muted animate-pulse rounded-lg" />
      </div>
    )
  }

  if (!mcp) {
    return <p className="text-muted-foreground">MCP not found.</p>
  }

  const configString = mcp.config_json ? JSON.stringify(mcp.config_json, null, 2) : null

  return (
    <div className="space-y-6">
      <Link
        href="/mcps"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to MCPs
      </Link>

      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="font-heading text-2xl font-bold">{mcp.title}</h1>
          {mcp.description && (
            <p className="text-muted-foreground max-w-2xl">{mcp.description}</p>
          )}
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            {mcp.category && <Badge variant="outline">{mcp.category.name}</Badge>}
            <Badge variant="secondary">{mcp.server_type}</Badge>
            {mcp.author && <span>by {mcp.author.name || mcp.author.email}</span>}
            <span>{formatRelativeTime(mcp.created_at)}</span>
            {mcp.vote_count > 0 && (
              <span className="flex items-center gap-1">
                <ThumbsUp className="w-3 h-3" />
                {Math.round(mcp.rating_score)}% ({mcp.vote_count} votes)
              </span>
            )}
          </div>
          {mcp.tags && mcp.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {mcp.tags.map((tag: string) => (
                <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          <Button onClick={() => setInstallOpen(true)}>
            <Download className="w-4 h-4 mr-2" />
            Install
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => submitVote('positive')}
            disabled={voteLoading}
          >
            <ThumbsUp className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => submitVote('negative')}
            disabled={voteLoading}
          >
            <ThumbsDown className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="docs" className="w-full">
        <TabsList>
          <TabsTrigger value="docs">Documentation</TabsTrigger>
          {configString && <TabsTrigger value="config">Config</TabsTrigger>}
        </TabsList>

        <TabsContent value="docs" className="mt-4">
          {mcp.content ? (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown>{mcp.content}</ReactMarkdown>
            </div>
          ) : (
            <p className="text-muted-foreground">No documentation available.</p>
          )}
        </TabsContent>

        {configString && (
          <TabsContent value="config" className="mt-4">
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => copy(configString)}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
              <pre className="bg-muted rounded-lg p-4 text-xs overflow-x-auto">
                <code>{configString}</code>
              </pre>
            </div>
          </TabsContent>
        )}
      </Tabs>

      {mcp.linked_skills && mcp.linked_skills.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Related Skills
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {mcp.linked_skills.map((ls: { skill: { slug: string; title: string; description: string | null } }) => (
              <Link
                key={ls.skill.slug}
                href={`/skills/${ls.skill.slug}`}
                className="block p-2 rounded hover:bg-muted transition-colors"
              >
                <p className="text-sm font-medium">{ls.skill.title}</p>
                {ls.skill.description && (
                  <p className="text-xs text-muted-foreground truncate">{ls.skill.description}</p>
                )}
              </Link>
            ))}
          </CardContent>
        </Card>
      )}

      <McpInstallModal
        open={installOpen}
        onClose={() => setInstallOpen(false)}
        title={mcp.title}
        configJson={mcp.config_json}
      />
    </div>
  )
}
```

- [ ] **Step 5: Create MCPs library page**

```tsx
// src/app/(dashboard)/mcps/page.tsx
import { McpsContent } from '@/components/mcps/McpsContent'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MCPs',
  description: 'Browse MCP server configurations for Claude Code',
}

export default function McpsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">MCPs</h1>
        <p className="text-muted-foreground mt-1">
          Browse and install MCP server configurations
        </p>
      </div>
      <McpsContent />
    </div>
  )
}
```

- [ ] **Step 6: Create MCP detail page**

```tsx
// src/app/(dashboard)/mcps/[slug]/page.tsx
import { McpDetailContent } from '@/components/mcps/McpDetailContent'

import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  return { title: slug.replace(/-/g, ' ') }
}

export default async function McpDetailPage({ params }: Props) {
  const { slug } = await params
  return <McpDetailContent slug={slug} />
}
```

- [ ] **Step 7: Commit**

```bash
cd /Users/nick/atlas && git add src/components/mcps/ src/app/\(dashboard\)/mcps/ && git commit -m "feat: add MCPs library and detail pages with install modal"
```

---

### Task 9: Contribute Page

**Files:**
- Create: `src/components/contribute/ContributePage.tsx`
- Create: `src/components/contribute/SkillForm.tsx`
- Create: `src/components/contribute/FileUpload.tsx`
- Create: `src/components/contribute/GithubImport.tsx`
- Create: `src/components/contribute/McpForm.tsx`
- Create: `src/app/(dashboard)/contribute/page.tsx`

- [ ] **Step 1: Create SkillForm component (paste/type)**

```tsx
// src/components/contribute/SkillForm.tsx
'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import ReactMarkdown from 'react-markdown'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { parseSkillFrontmatter } from '@/lib/frontmatter'
import { SKILL_FORMATS } from '@/lib/constants'

export function SkillForm() {
  const [rawContent, setRawContent] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [format, setFormat] = useState('claude_code_skill')
  const [tags, setTags] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  // Auto-parse frontmatter as user types
  const parsed = rawContent ? parseSkillFrontmatter(rawContent) : null
  const autoTitle = parsed?.frontmatter.name ? String(parsed.frontmatter.name) : ''
  const autoDesc = parsed?.frontmatter.description ? String(parsed.frontmatter.description) : ''

  const effectiveTitle = title || autoTitle
  const effectiveDesc = description || autoDesc

  async function handleSubmit() {
    if (!effectiveTitle) {
      toast({ title: 'Title is required', variant: 'destructive' })
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: effectiveTitle,
          description: effectiveDesc || null,
          content: parsed?.content || rawContent || null,
          raw_file: rawContent || null,
          format,
          tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create skill')
      }

      toast({ title: 'Skill created successfully' })
      router.push('/skills')
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Unknown error',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Editor */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="raw">Skill file content (markdown with frontmatter)</Label>
          <Textarea
            id="raw"
            value={rawContent}
            onChange={(e) => setRawContent(e.target.value)}
            placeholder="---\nname: My Skill\ndescription: What it does\n---\n\n# Instructions\n..."
            className="mt-1 font-mono text-sm min-h-[300px]"
          />
        </div>

        <div>
          <Label htmlFor="title">Title {autoTitle && '(auto-detected from frontmatter)'}</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={autoTitle || 'Skill title'}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="desc">Description</Label>
          <Input
            id="desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={autoDesc || 'Short description'}
            className="mt-1"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <Label>Format</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SKILL_FORMATS.map((f) => (
                  <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="seo, content, review"
              className="mt-1"
            />
          </div>
        </div>

        <Button onClick={handleSubmit} disabled={isSubmitting || !effectiveTitle}>
          {isSubmitting ? 'Creating...' : 'Submit Skill'}
        </Button>
      </div>

      {/* Preview */}
      <div className="border rounded-lg p-4 space-y-3">
        <h3 className="font-heading font-semibold">Preview</h3>
        {parsed?.frontmatter && Object.keys(parsed.frontmatter).length > 0 && (
          <div className="bg-muted rounded p-3 text-xs space-y-1">
            <p className="font-medium text-muted-foreground">Frontmatter:</p>
            {Object.entries(parsed.frontmatter).map(([k, v]) => (
              <p key={k}><span className="text-primary">{k}:</span> {String(v)}</p>
            ))}
          </div>
        )}
        {parsed?.content && (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown>{parsed.content}</ReactMarkdown>
          </div>
        )}
        {!rawContent && (
          <p className="text-sm text-muted-foreground">Start typing to see a preview...</p>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create FileUpload component**

```tsx
// src/components/contribute/FileUpload.tsx
'use client'

import { useCallback, useState } from 'react'

import { Upload } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { isValidSkillFile, parseSkillFrontmatter } from '@/lib/frontmatter'

interface ParsedFile {
  name: string
  raw: string
  title: string
  description: string
  isValid: boolean
}

export function FileUpload() {
  const [files, setFiles] = useState<ParsedFile[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleFiles = useCallback((fileList: FileList) => {
    Array.from(fileList).forEach((file) => {
      if (!file.name.endsWith('.md')) {
        return
      }
      const reader = new FileReader()
      reader.onload = (e) => {
        const raw = e.target?.result as string
        const parsed = parseSkillFrontmatter(raw)
        setFiles((prev) => [
          ...prev,
          {
            name: file.name,
            raw,
            title: String(parsed.frontmatter.name || file.name.replace('.md', '')),
            description: String(parsed.frontmatter.description || ''),
            isValid: isValidSkillFile(raw),
          },
        ])
      }
      reader.readAsText(file)
    })
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles]
  )

  async function submitAll() {
    setIsSubmitting(true)
    let success = 0
    for (const file of files) {
      try {
        const res = await fetch('/api/skills', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: file.title,
            description: file.description || null,
            raw_file: file.raw,
            format: 'claude_code_skill',
          }),
        })
        if (res.ok) {
          success++
        }
      } catch {
        // continue with others
      }
    }
    toast({ title: `Created ${success} of ${files.length} skills` })
    setFiles([])
    setIsSubmitting(false)
  }

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
        onClick={() => {
          const input = document.createElement('input')
          input.type = 'file'
          input.multiple = true
          input.accept = '.md'
          input.onchange = (e) => {
            const target = e.target as HTMLInputElement
            if (target.files) {
              handleFiles(target.files)
            }
          }
          input.click()
        }}
      >
        <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm font-medium">Drop .md files here or click to browse</p>
        <p className="text-xs text-muted-foreground mt-1">
          Files with valid frontmatter will be auto-parsed
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, i) => (
            <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="text-sm font-medium">{file.title}</p>
                <p className="text-xs text-muted-foreground">{file.name}</p>
              </div>
              <Badge variant={file.isValid ? 'default' : 'destructive'}>
                {file.isValid ? 'Valid' : 'No frontmatter'}
              </Badge>
            </div>
          ))}
          <Button onClick={submitAll} disabled={isSubmitting}>
            {isSubmitting ? 'Uploading...' : `Upload ${files.length} file(s)`}
          </Button>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Create GithubImport component**

```tsx
// src/components/contribute/GithubImport.tsx
'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { Github } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useGithubImport } from '@/hooks/queries/useGithubImportQuery'
import { useToast } from '@/hooks/use-toast'

export function GithubImport() {
  const [url, setUrl] = useState('')
  const { mutate: importFiles, data: files, isPending } = useGithubImport()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  async function submitSelected() {
    if (!files) {
      return
    }
    setIsSubmitting(true)
    let success = 0
    for (const file of files.filter((f) => f.is_valid)) {
      try {
        const res = await fetch('/api/skills', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: String(file.frontmatter.name || file.name.replace('.md', '')),
            description: String(file.frontmatter.description || ''),
            raw_file: file.raw,
            format: 'claude_code_skill',
            source_url: url,
          }),
        })
        if (res.ok) {
          success++
        }
      } catch {
        // continue
      }
    }
    toast({ title: `Imported ${success} skills from GitHub` })
    setIsSubmitting(false)
    router.push('/skills')
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="https://github.com/owner/repo/tree/main/skills"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button
          onClick={() => importFiles(url)}
          disabled={isPending || !url}
        >
          <Github className="w-4 h-4 mr-2" />
          {isPending ? 'Scanning...' : 'Scan'}
        </Button>
      </div>

      {files && files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Found {files.length} file(s):</p>
          {files.map((file, i) => (
            <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="text-sm font-medium">
                  {String(file.frontmatter.name || file.name)}
                </p>
                <p className="text-xs text-muted-foreground">{file.path}</p>
              </div>
              <Badge variant={file.is_valid ? 'default' : 'secondary'}>
                {file.is_valid ? 'Valid' : 'Skipped'}
              </Badge>
            </div>
          ))}
          <Button
            onClick={submitSelected}
            disabled={isSubmitting || !files.some((f) => f.is_valid)}
          >
            {isSubmitting ? 'Importing...' : `Import ${files.filter((f) => f.is_valid).length} valid file(s)`}
          </Button>
        </div>
      )}

      {files && files.length === 0 && (
        <p className="text-sm text-muted-foreground">No .md files found at that URL.</p>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Create McpForm component**

```tsx
// src/components/contribute/McpForm.tsx
'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { MCP_SERVER_TYPES } from '@/lib/constants'

export function McpForm() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [configRaw, setConfigRaw] = useState('')
  const [serverType, setServerType] = useState('stdio')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  async function handleSubmit() {
    if (!title) {
      toast({ title: 'Title is required', variant: 'destructive' })
      return
    }

    let configJson = null
    if (configRaw.trim()) {
      try {
        configJson = JSON.parse(configRaw)
      } catch {
        toast({ title: 'Invalid JSON in config', variant: 'destructive' })
        return
      }
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/mcps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description: description || null,
          content: content || null,
          config_json: configJson,
          server_type: serverType,
          tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create MCP')
      }

      toast({ title: 'MCP created successfully' })
      router.push('/mcps')
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Unknown error',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <div>
        <Label htmlFor="mcp-title">Title</Label>
        <Input id="mcp-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Supabase MCP" className="mt-1" />
      </div>

      <div>
        <Label htmlFor="mcp-desc">Description</Label>
        <Input id="mcp-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What this MCP does" className="mt-1" />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <Label>Server Type</Label>
          <Select value={serverType} onValueChange={setServerType}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              {MCP_SERVER_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Label htmlFor="mcp-tags">Tags</Label>
          <Input id="mcp-tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="database, supabase" className="mt-1" />
        </div>
      </div>

      <div>
        <Label htmlFor="mcp-config">Config JSON (.mcp.json content)</Label>
        <Textarea id="mcp-config" value={configRaw} onChange={(e) => setConfigRaw(e.target.value)} placeholder='{"mcpServers": {...}}' className="mt-1 font-mono text-sm min-h-[150px]" />
      </div>

      <div>
        <Label htmlFor="mcp-content">Documentation (markdown)</Label>
        <Textarea id="mcp-content" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Setup instructions, use cases..." className="mt-1 min-h-[150px]" />
      </div>

      <Button onClick={handleSubmit} disabled={isSubmitting || !title}>
        {isSubmitting ? 'Creating...' : 'Submit MCP'}
      </Button>
    </div>
  )
}
```

- [ ] **Step 5: Create ContributePage**

```tsx
// src/components/contribute/ContributePage.tsx
'use client'

import { FileUpload } from '@/components/contribute/FileUpload'
import { GithubImport } from '@/components/contribute/GithubImport'
import { McpForm } from '@/components/contribute/McpForm'
import { SkillForm } from '@/components/contribute/SkillForm'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function ContributePage() {
  return (
    <Tabs defaultValue="skill-paste" className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="skill-paste">Paste Skill</TabsTrigger>
        <TabsTrigger value="skill-upload">Upload Files</TabsTrigger>
        <TabsTrigger value="skill-github">GitHub Import</TabsTrigger>
        <TabsTrigger value="mcp">MCP Config</TabsTrigger>
      </TabsList>

      <TabsContent value="skill-paste">
        <SkillForm />
      </TabsContent>

      <TabsContent value="skill-upload">
        <FileUpload />
      </TabsContent>

      <TabsContent value="skill-github">
        <GithubImport />
      </TabsContent>

      <TabsContent value="mcp">
        <McpForm />
      </TabsContent>
    </Tabs>
  )
}
```

- [ ] **Step 6: Create contribute page**

```tsx
// src/app/(dashboard)/contribute/page.tsx
import { ContributePage } from '@/components/contribute/ContributePage'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contribute',
  description: 'Upload skills, MCPs, and prompts to Atlas',
}

export default function ContributeRoute() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Contribute</h1>
        <p className="text-muted-foreground mt-1">
          Share skills, MCP configurations, and prompts with your team
        </p>
      </div>
      <ContributePage />
    </div>
  )
}
```

- [ ] **Step 7: Commit**

```bash
cd /Users/nick/atlas && git add src/components/contribute/ src/app/\(dashboard\)/contribute/ && git commit -m "feat: add contribute page with paste, upload, GitHub import, MCP form"
```

---

### Task 10: Rebuild Admin Dashboard

**Files:**
- Modify: `src/app/(dashboard)/admin/page.tsx`
- Create: `src/app/(dashboard)/admin/pending/page.tsx`

- [ ] **Step 1: Update admin dashboard**

```tsx
// src/app/(dashboard)/admin/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'

import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin Dashboard' }

export default async function AdminPage() {
  const supabase = await createClient()

  const [skills, mcps, prompts, pendingSkills, pendingMcps, flaggedSkills, flaggedMcps, flaggedPrompts] =
    await Promise.all([
      supabase.from('skills').select('id', { count: 'exact', head: true }).eq('is_published', true),
      supabase.from('mcps').select('id', { count: 'exact', head: true }).eq('is_published', true),
      supabase.from('prompts').select('id', { count: 'exact', head: true }),
      supabase.from('skills').select('id', { count: 'exact', head: true }).eq('is_published', false),
      supabase.from('mcps').select('id', { count: 'exact', head: true }).eq('is_published', false),
      supabase.from('skills').select('id', { count: 'exact', head: true }).eq('is_flagged', true),
      supabase.from('mcps').select('id', { count: 'exact', head: true }).eq('is_flagged', true),
      supabase.from('prompts').select('id', { count: 'exact', head: true }).eq('is_flagged', true),
    ])

  const stats = [
    { label: 'Published Skills', value: skills.count || 0 },
    { label: 'Published MCPs', value: mcps.count || 0 },
    { label: 'Prompts', value: prompts.count || 0 },
    { label: 'Pending Approval', value: (pendingSkills.count || 0) + (pendingMcps.count || 0) },
    { label: 'Flagged Items', value: (flaggedSkills.count || 0) + (flaggedMcps.count || 0) + (flaggedPrompts.count || 0) },
  ]

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create PublishButton client component**

```tsx
// src/components/admin/PublishButton.tsx
'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { Check } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

interface PublishButtonProps {
  entityType: 'skill' | 'mcp'
  id: string
}

export function PublishButton({ entityType, id }: PublishButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  async function handlePublish() {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/admin/publish/${entityType}/${id}`, {
        method: 'POST',
      })
      if (!res.ok) {
        throw new Error('Failed to publish')
      }
      toast({ title: `${entityType === 'skill' ? 'Skill' : 'MCP'} published` })
      router.refresh()
    } catch {
      toast({ title: 'Failed to publish', variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button size="sm" onClick={handlePublish} disabled={isLoading}>
      <Check className="w-3 h-3 mr-1" />
      {isLoading ? 'Publishing...' : 'Publish'}
    </Button>
  )
}
```

- [ ] **Step 3: Create FlagButton client component**

```tsx
// src/components/admin/FlagButton.tsx
'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { Flag } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

interface FlagButtonProps {
  entityType: 'skill' | 'mcp' | 'prompt'
  id: string
}

export function FlagButton({ entityType, id }: FlagButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  async function handleFlag() {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/admin/flag/${entityType}/${id}`, {
        method: 'POST',
      })
      if (!res.ok) {
        throw new Error('Failed to flag')
      }
      toast({ title: 'Item flagged' })
      router.refresh()
    } catch {
      toast({ title: 'Failed to flag', variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button size="sm" variant="destructive" onClick={handleFlag} disabled={isLoading}>
      <Flag className="w-3 h-3 mr-1" />
      Flag
    </Button>
  )
}
```

- [ ] **Step 4: Create pending page with publish buttons**

```tsx
// src/app/(dashboard)/admin/pending/page.tsx
import Link from 'next/link'

import { PublishButton } from '@/components/admin/PublishButton'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { formatRelativeTime } from '@/lib/utils'

import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Pending Approval' }

export default async function PendingPage() {
  const supabase = await createClient()

  const [{ data: skills }, { data: mcps }] = await Promise.all([
    supabase
      .from('skills')
      .select('id, title, slug, format, created_at, author:users!skills_created_by_fkey(name)')
      .eq('is_published', false)
      .order('created_at', { ascending: false }),
    supabase
      .from('mcps')
      .select('id, title, slug, server_type, created_at, author:users!mcps_created_by_fkey(name)')
      .eq('is_published', false)
      .order('created_at', { ascending: false }),
  ])

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Pending Approval</h1>

      {(skills?.length || 0) > 0 && (
        <div>
          <h2 className="font-heading text-lg font-semibold mb-3">Skills</h2>
          <div className="space-y-2">
            {skills?.map((s) => (
              <Card key={s.id}>
                <CardContent className="flex items-center justify-between py-3">
                  <div>
                    <Link href={`/skills/${s.slug}`} className="font-medium hover:text-primary">
                      {s.title}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {(s.author as { name: string | null })?.name} &middot; {formatRelativeTime(s.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{s.format}</Badge>
                    <PublishButton entityType="skill" id={s.id} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {(mcps?.length || 0) > 0 && (
        <div>
          <h2 className="font-heading text-lg font-semibold mb-3">MCPs</h2>
          <div className="space-y-2">
            {mcps?.map((m) => (
              <Card key={m.id}>
                <CardContent className="flex items-center justify-between py-3">
                  <div>
                    <Link href={`/mcps/${m.slug}`} className="font-medium hover:text-primary">
                      {m.title}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {(m.author as { name: string | null })?.name} &middot; {formatRelativeTime(m.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{m.server_type}</Badge>
                    <PublishButton entityType="mcp" id={m.id} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {(skills?.length || 0) === 0 && (mcps?.length || 0) === 0 && (
        <p className="text-muted-foreground">No items pending approval.</p>
      )}
    </div>
  )
}
```

- [ ] **Step 5: Create flagged items page**

```tsx
// src/app/(dashboard)/admin/flagged/page.tsx
import Link from 'next/link'

import { PublishButton } from '@/components/admin/PublishButton'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { formatRelativeTime } from '@/lib/utils'

import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Flagged Items' }

export default async function FlaggedPage() {
  const supabase = await createClient()

  const [{ data: skills }, { data: mcps }, { data: prompts }] = await Promise.all([
    supabase
      .from('skills')
      .select('id, title, slug, format, created_at, author:users!skills_created_by_fkey(name)')
      .eq('is_flagged', true)
      .order('created_at', { ascending: false }),
    supabase
      .from('mcps')
      .select('id, title, slug, server_type, created_at, author:users!mcps_created_by_fkey(name)')
      .eq('is_flagged', true)
      .order('created_at', { ascending: false }),
    supabase
      .from('prompts')
      .select('id, title, created_at')
      .eq('is_flagged', true)
      .order('created_at', { ascending: false }),
  ])

  const hasItems = (skills?.length || 0) > 0 || (mcps?.length || 0) > 0 || (prompts?.length || 0) > 0

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Flagged Items</h1>

      {(skills?.length || 0) > 0 && (
        <div>
          <h2 className="font-heading text-lg font-semibold mb-3">Skills</h2>
          <div className="space-y-2">
            {skills?.map((s) => (
              <Card key={s.id}>
                <CardContent className="flex items-center justify-between py-3">
                  <div>
                    <Link href={`/skills/${s.slug}`} className="font-medium hover:text-primary">{s.title}</Link>
                    <p className="text-xs text-muted-foreground">
                      {(s.author as { name: string | null })?.name} &middot; {formatRelativeTime(s.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">Flagged</Badge>
                    <PublishButton entityType="skill" id={s.id} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {(mcps?.length || 0) > 0 && (
        <div>
          <h2 className="font-heading text-lg font-semibold mb-3">MCPs</h2>
          <div className="space-y-2">
            {mcps?.map((m) => (
              <Card key={m.id}>
                <CardContent className="flex items-center justify-between py-3">
                  <div>
                    <Link href={`/mcps/${m.slug}`} className="font-medium hover:text-primary">{m.title}</Link>
                    <p className="text-xs text-muted-foreground">
                      {(m.author as { name: string | null })?.name} &middot; {formatRelativeTime(m.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">Flagged</Badge>
                    <PublishButton entityType="mcp" id={m.id} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {(prompts?.length || 0) > 0 && (
        <div>
          <h2 className="font-heading text-lg font-semibold mb-3">Prompts</h2>
          <div className="space-y-2">
            {prompts?.map((p) => (
              <Card key={p.id}>
                <CardContent className="flex items-center justify-between py-3">
                  <div>
                    <Link href={`/prompts/${p.id}`} className="font-medium hover:text-primary">{p.title}</Link>
                    <p className="text-xs text-muted-foreground">{formatRelativeTime(p.created_at)}</p>
                  </div>
                  <Badge variant="destructive">Flagged</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {!hasItems && (
        <p className="text-muted-foreground">No flagged items.</p>
      )}
    </div>
  )
}
```

- [ ] **Step 6: Commit**

```bash
cd /Users/nick/atlas && git add src/components/admin/ src/app/\(dashboard\)/admin/ && git commit -m "feat: rebuild admin with publish/flag actions, pending and flagged pages"
```

---

### Task 11: Clean Up — Remove Old Code

**Files:**
- Delete: `src/app/(dashboard)/sme/` (entire directory)
- Delete: `src/app/(marketing)/` (entire directory)
- Remove unused SME imports

- [ ] **Step 1: Remove SME hub**

```bash
rm -rf /Users/nick/atlas/src/app/\(dashboard\)/sme/
```

- [ ] **Step 2: Remove marketing pages**

```bash
rm -rf /Users/nick/atlas/src/app/\(marketing\)/
```

- [ ] **Step 3: Remove /sme from middleware protected routes**

In `src/lib/supabase/middleware.ts`, remove `/sme` from `protectedRoutes` if still present.

- [ ] **Step 4: Update root layout metadata**

In `src/app/layout.tsx`, update the title and description:

```typescript
title: {
  default: 'Atlas - Skill & MCP Marketplace',
  template: '%s | Atlas',
},
description:
  'Internal platform for discovering, sharing, and installing Claude Code skills and MCP configurations.',
```

Update keywords, OpenGraph, and JSON-LD similarly to reflect the new focus.

- [ ] **Step 5: Verify build**

```bash
cd /Users/nick/atlas && npm run build
```

- [ ] **Step 6: Commit**

```bash
cd /Users/nick/atlas && git add -A && git commit -m "refactor: remove SME hub and marketing pages, update metadata"
```

---

### Task 12: Update Metadata in Root Layout

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Update metadata and theme default**

Change `defaultTheme` from `"light"` to `"dark"` in the ThemeProvider (dark mode first):

```tsx
<ThemeProvider
  attribute="class"
  defaultTheme="dark"
  enableSystem
  disableTransitionOnChange
>
```

- [ ] **Step 2: Commit**

```bash
cd /Users/nick/atlas && git add src/app/layout.tsx && git commit -m "refactor: set dark mode as default theme"
```

---

### Task 13: Final Verification

- [ ] **Step 1: Clean install and build**

```bash
cd /Users/nick/atlas && rm -rf node_modules .next && npm install && npm run build
```

- [ ] **Step 2: Lint and typecheck**

```bash
cd /Users/nick/atlas && npm run lint && npm run typecheck
```

- [ ] **Step 3: Start dev server and smoke test**

```bash
cd /Users/nick/atlas && npm run dev
```

Verify in browser:
- `/` redirects to `/skills`
- Skills page loads (empty state if no data)
- MCPs page loads
- Prompts page still works
- Contribute page: paste form, file upload, GitHub import tabs work
- Cmd+K command palette opens and searches
- Sidebar navigation works (desktop + mobile)
- Admin dashboard shows stats
- Admin pending page loads
- Dark mode is default, light mode toggle works
- Install modals open with copy functionality

- [ ] **Step 4: Commit any remaining fixes**

```bash
cd /Users/nick/atlas && git add -A && git commit -m "fix: resolve remaining issues from UI rebuild"
```
