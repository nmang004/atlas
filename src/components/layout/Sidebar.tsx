'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'

import { FileText, FolderOpen, LayoutDashboard, Flag, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface Category {
  id: string
  name: string
  prompt_count?: number
}

interface SidebarProps {
  categories: Category[]
  isAdmin?: boolean
}

export function Sidebar({ categories, isAdmin = false }: SidebarProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get('category')

  return (
    <aside className="flex h-full w-64 flex-col border-r bg-muted/10">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/prompts" className="flex items-center gap-2 font-semibold">
          <FileText className="h-5 w-5" />
          <span>Atlas</span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          <Link href="/prompts">
            <Button
              variant={pathname === '/prompts' ? 'secondary' : 'ghost'}
              className="min-h-10 w-full justify-start"
            >
              <FileText className="mr-2 h-4 w-4" />
              All Prompts
            </Button>
          </Link>
          <Link href="/categories">
            <Button
              variant={pathname === '/categories' ? 'secondary' : 'ghost'}
              className="min-h-10 w-full justify-start"
            >
              <FolderOpen className="mr-2 h-4 w-4" />
              Categories
            </Button>
          </Link>
        </div>

        <Separator className="my-4" />

        <div className="space-y-1">
          <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Categories
          </p>
          {categories.map((category) => (
            <Link key={category.id} href={`/prompts?category=${category.id}`}>
              <Button
                variant="ghost"
                className={cn(
                  'min-h-10 w-full justify-between',
                  pathname === '/prompts' && currentCategory === category.id && 'bg-secondary'
                )}
              >
                <span className="truncate">{category.name}</span>
                {category.prompt_count !== undefined && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    {category.prompt_count}
                  </span>
                )}
              </Button>
            </Link>
          ))}
        </div>

        {isAdmin && (
          <>
            <Separator className="my-4" />

            <div className="space-y-1">
              <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Admin
              </p>
              <Link href="/admin">
                <Button
                  variant={pathname === '/admin' ? 'secondary' : 'ghost'}
                  className="min-h-10 w-full justify-start"
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/admin/flagged">
                <Button
                  variant={pathname === '/admin/flagged' ? 'secondary' : 'ghost'}
                  className="min-h-10 w-full justify-start"
                >
                  <Flag className="mr-2 h-4 w-4" />
                  Flagged Prompts
                </Button>
              </Link>
              <Link href="/prompts/new">
                <Button
                  variant={pathname === '/prompts/new' ? 'secondary' : 'ghost'}
                  className="min-h-10 w-full justify-start"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New Prompt
                </Button>
              </Link>
            </div>
          </>
        )}
      </nav>
    </aside>
  )
}
