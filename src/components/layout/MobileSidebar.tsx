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
      <SheetContent side="left" className="w-[280px] bg-navy p-0 text-white border-none">
        {/* Gradient accent line at top */}
        <div className="h-1 bg-gradient-to-r from-primary to-secondary" />

        <SheetHeader className="border-b border-white/10 px-4 py-4">
          <SheetTitle className="flex items-center gap-2 font-heading text-white">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary shadow-lg">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">Atlas</span>
          </SheetTitle>
        </SheetHeader>

        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            <SheetClose asChild>
              <Link href="/prompts" onClick={handleNavClick}>
                <Button
                  variant="ghost"
                  className={cn(
                    'min-h-11 w-full justify-start text-white/80 hover:bg-white/10 hover:text-white',
                    pathname === '/prompts' && !currentCategory && 'bg-gradient-to-r from-primary/20 to-transparent text-white border-l-2 border-primary rounded-l-none'
                  )}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  All Prompts
                </Button>
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link href="/categories" onClick={handleNavClick}>
                <Button
                  variant="ghost"
                  className={cn(
                    'min-h-11 w-full justify-start text-white/80 hover:bg-white/10 hover:text-white',
                    pathname === '/categories' && 'bg-gradient-to-r from-primary/20 to-transparent text-white border-l-2 border-primary rounded-l-none'
                  )}
                >
                  <FolderOpen className="mr-2 h-4 w-4" />
                  Categories
                </Button>
              </Link>
            </SheetClose>
          </div>

          <Separator className="my-4 bg-white/10" />

          <div className="space-y-1">
            <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-white/50">
              Categories
            </p>
            {categories.map((category) => (
              <SheetClose asChild key={category.id}>
                <Link href={`/prompts?category=${category.id}`} onClick={handleNavClick}>
                  <Button
                    variant="ghost"
                    className={cn(
                      'min-h-11 w-full justify-between text-white/80 hover:bg-white/10 hover:text-white',
                      pathname === '/prompts' && currentCategory === category.id && 'bg-gradient-to-r from-secondary/20 to-transparent text-white border-l-2 border-secondary rounded-l-none'
                    )}
                  >
                    <span className="truncate">{category.name}</span>
                    {category.prompt_count !== undefined && (
                      <span className="ml-2 text-xs text-white/50">
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
              <Separator className="my-4 bg-white/10" />

              <div className="space-y-1">
                <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-white/50">
                  Admin
                </p>
                <SheetClose asChild>
                  <Link href="/admin" onClick={handleNavClick}>
                    <Button
                      variant="ghost"
                      className={cn(
                        'min-h-11 w-full justify-start text-white/80 hover:bg-white/10 hover:text-white',
                        pathname === '/admin' && 'bg-gradient-to-r from-primary/20 to-transparent text-white border-l-2 border-primary rounded-l-none'
                      )}
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/admin/flagged" onClick={handleNavClick}>
                    <Button
                      variant="ghost"
                      className={cn(
                        'min-h-11 w-full justify-start text-white/80 hover:bg-white/10 hover:text-white',
                        pathname === '/admin/flagged' && 'bg-gradient-to-r from-primary/20 to-transparent text-white border-l-2 border-primary rounded-l-none'
                      )}
                    >
                      <Flag className="mr-2 h-4 w-4" />
                      Flagged Prompts
                    </Button>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/prompts/new" onClick={handleNavClick}>
                    <Button
                      variant="ghost"
                      className={cn(
                        'min-h-11 w-full justify-start text-white/80 hover:bg-white/10 hover:text-white',
                        pathname === '/prompts/new' && 'bg-gradient-to-r from-primary/20 to-transparent text-white border-l-2 border-primary rounded-l-none'
                      )}
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
