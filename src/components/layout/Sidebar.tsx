'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'

import {
  FileText,
  FolderOpen,
  LayoutDashboard,
  Flag,
  MessageSquare,
  Plus,
  Settings,
} from 'lucide-react'

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
    <aside className="bg-navy flex h-full w-64 flex-col text-white">
      <div className="flex h-14 items-center border-b border-white/10 px-4">
        <Link
          href="/prompts"
          className="group font-heading flex items-center gap-2 font-semibold text-white"
        >
          <div className="from-primary to-secondary group-hover:shadow-glow-primary flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br shadow-lg transition-all">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold">Atlas</span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          <Link href="/prompts">
            <Button
              variant="ghost"
              className={cn(
                'min-h-10 w-full justify-start text-white/80 hover:bg-white/10 hover:text-white',
                pathname === '/prompts' &&
                  !currentCategory &&
                  'from-primary/20 border-primary rounded-l-none border-l-2 bg-linear-to-r to-transparent text-white'
              )}
            >
              <FileText className="mr-2 h-4 w-4" />
              All Prompts
            </Button>
          </Link>
          <Link href="/categories">
            <Button
              variant="ghost"
              className={cn(
                'min-h-10 w-full justify-start text-white/80 hover:bg-white/10 hover:text-white',
                pathname === '/categories' &&
                  'from-primary/20 border-primary rounded-l-none border-l-2 bg-linear-to-r to-transparent text-white'
              )}
            >
              <FolderOpen className="mr-2 h-4 w-4" />
              Categories
            </Button>
          </Link>
        </div>

        <Separator className="my-4 bg-white/10" />

        <div className="space-y-1">
          <p className="mb-2 px-2 text-xs font-semibold tracking-wider text-white/50 uppercase">
            Categories
          </p>
          {categories.map((category) => (
            <Link key={category.id} href={`/prompts?category=${category.id}`}>
              <Button
                variant="ghost"
                className={cn(
                  'min-h-10 w-full justify-between text-white/80 hover:bg-white/10 hover:text-white',
                  pathname === '/prompts' &&
                    currentCategory === category.id &&
                    'from-secondary/20 border-secondary rounded-l-none border-l-2 bg-linear-to-r to-transparent text-white'
                )}
              >
                <span className="truncate">{category.name}</span>
                {category.prompt_count !== undefined && (
                  <span className="ml-2 text-xs text-white/50">{category.prompt_count}</span>
                )}
              </Button>
            </Link>
          ))}
        </div>

        <Separator className="my-4 bg-white/10" />

        <div className="space-y-1">
          <Link href="/settings">
            <Button
              variant="ghost"
              className={cn(
                'min-h-10 w-full justify-start text-white/80 hover:bg-white/10 hover:text-white',
                pathname === '/settings' &&
                  'from-primary/20 border-primary rounded-l-none border-l-2 bg-linear-to-r to-transparent text-white'
              )}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </Link>
          <a href="/feedback" target="_blank" rel="noopener noreferrer">
            <Button
              variant="ghost"
              className="min-h-10 w-full justify-start text-white/80 hover:bg-white/10 hover:text-white"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Feedback
            </Button>
          </a>
        </div>

        {isAdmin && (
          <>
            <Separator className="my-4 bg-white/10" />

            <div className="space-y-1">
              <p className="mb-2 px-2 text-xs font-semibold tracking-wider text-white/50 uppercase">
                Admin
              </p>
              <Link href="/admin">
                <Button
                  variant="ghost"
                  className={cn(
                    'min-h-10 w-full justify-start text-white/80 hover:bg-white/10 hover:text-white',
                    pathname === '/admin' &&
                      'from-primary/20 border-primary rounded-l-none border-l-2 bg-linear-to-r to-transparent text-white'
                  )}
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/admin/flagged">
                <Button
                  variant="ghost"
                  className={cn(
                    'min-h-10 w-full justify-start text-white/80 hover:bg-white/10 hover:text-white',
                    pathname === '/admin/flagged' &&
                      'from-primary/20 border-primary rounded-l-none border-l-2 bg-linear-to-r to-transparent text-white'
                  )}
                >
                  <Flag className="mr-2 h-4 w-4" />
                  Flagged Prompts
                </Button>
              </Link>
              <Link href="/prompts/new">
                <Button
                  variant="ghost"
                  className={cn(
                    'min-h-10 w-full justify-start text-white/80 hover:bg-white/10 hover:text-white',
                    pathname === '/prompts/new' &&
                      'from-primary/20 border-primary rounded-l-none border-l-2 bg-linear-to-r to-transparent text-white'
                  )}
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
