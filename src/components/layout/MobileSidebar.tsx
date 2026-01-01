'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'

import { FileText, FolderOpen, LayoutDashboard, Flag, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

interface Category {
  id: string
  name: string
  prompt_count?: number
}

interface MobileSidebarProps {
  categories: Category[]
  isAdmin?: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MobileSidebar({
  categories,
  isAdmin = false,
  open,
  onOpenChange,
}: MobileSidebarProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get('category')

  const handleNavClick = () => {
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[280px] p-0">
        <SheetHeader className="border-b px-4 py-4">
          <SheetTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <span>Atlas</span>
          </SheetTitle>
        </SheetHeader>

        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            <SheetClose asChild>
              <Link href="/prompts" onClick={handleNavClick}>
                <Button
                  variant={pathname === '/prompts' && !currentCategory ? 'secondary' : 'ghost'}
                  className="min-h-11 w-full justify-start"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  All Prompts
                </Button>
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link href="/categories" onClick={handleNavClick}>
                <Button
                  variant={pathname === '/categories' ? 'secondary' : 'ghost'}
                  className="min-h-11 w-full justify-start"
                >
                  <FolderOpen className="mr-2 h-4 w-4" />
                  Categories
                </Button>
              </Link>
            </SheetClose>
          </div>

          <Separator className="my-4" />

          <div className="space-y-1">
            <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Categories
            </p>
            {categories.map((category) => (
              <SheetClose asChild key={category.id}>
                <Link href={`/prompts?category=${category.id}`} onClick={handleNavClick}>
                  <Button
                    variant="ghost"
                    className={cn(
                      'min-h-11 w-full justify-between',
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
              </SheetClose>
            ))}
          </div>

          {isAdmin && (
            <>
              <Separator className="my-4" />

              <div className="space-y-1">
                <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Admin
                </p>
                <SheetClose asChild>
                  <Link href="/admin" onClick={handleNavClick}>
                    <Button
                      variant={pathname === '/admin' ? 'secondary' : 'ghost'}
                      className="min-h-11 w-full justify-start"
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/admin/flagged" onClick={handleNavClick}>
                    <Button
                      variant={pathname === '/admin/flagged' ? 'secondary' : 'ghost'}
                      className="min-h-11 w-full justify-start"
                    >
                      <Flag className="mr-2 h-4 w-4" />
                      Flagged Prompts
                    </Button>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/prompts/new" onClick={handleNavClick}>
                    <Button
                      variant={pathname === '/prompts/new' ? 'secondary' : 'ghost'}
                      className="min-h-11 w-full justify-start"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      New Prompt
                    </Button>
                  </Link>
                </SheetClose>
              </div>
            </>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
