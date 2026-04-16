'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

import {
  Sparkles,
  Plug,
  FileText,
  FolderOpen,
  LayoutDashboard,
  Clock,
  Flag,
  Plus,
  Settings,
  LogOut,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet'
import { NAV_ITEMS, ADMIN_NAV_ITEMS, CONTRIBUTE_NAV_ITEM } from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import type { User } from '@/types'

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles,
  Plug,
  FileText,
  FolderOpen,
  LayoutDashboard,
  Clock,
  Flag,
  Plus,
  Settings,
}

interface MobileSidebarProps {
  open: boolean
  onClose: () => void
  user: User | null
  isAdmin: boolean
}

export function MobileSidebar({ open, onClose, user, isAdmin }: MobileSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(href)
  }

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent side="left" className="bg-navy w-[280px] border-none p-0 text-white">
        <SheetHeader className="border-b border-white/10 px-4 py-4">
          <SheetTitle className="font-heading flex items-center gap-2 text-white">
            <div className="from-primary to-secondary flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br shadow-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">Atlas</span>
          </SheetTitle>
        </SheetHeader>

        <nav className="flex-1 overflow-y-auto p-4">
          {/* Main nav */}
          <div className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = ICON_MAP[item.icon]
              return (
                <SheetClose asChild key={item.href}>
                  <Link href={item.href} onClick={onClose}>
                    <Button
                      variant="ghost"
                      className={cn(
                        'min-h-11 w-full justify-start text-white/80 hover:bg-white/10 hover:text-white',
                        isActive(item.href) && 'bg-primary/20 text-primary-foreground'
                      )}
                    >
                      {Icon && <Icon className="mr-2 h-4 w-4" />}
                      {item.label}
                    </Button>
                  </Link>
                </SheetClose>
              )
            })}
          </div>

          <Separator className="my-4 bg-white/10" />

          {/* Contribute */}
          <div className="space-y-1">
            {(() => {
              const Icon = ICON_MAP[CONTRIBUTE_NAV_ITEM.icon]
              return (
                <SheetClose asChild>
                  <Link href={CONTRIBUTE_NAV_ITEM.href} onClick={onClose}>
                    <Button
                      variant="ghost"
                      className={cn(
                        'min-h-11 w-full justify-start text-white/80 hover:bg-white/10 hover:text-white',
                        isActive(CONTRIBUTE_NAV_ITEM.href) &&
                          'bg-primary/20 text-primary-foreground'
                      )}
                    >
                      {Icon && <Icon className="mr-2 h-4 w-4" />}
                      {CONTRIBUTE_NAV_ITEM.label}
                    </Button>
                  </Link>
                </SheetClose>
              )
            })()}
          </div>

          {/* Admin section */}
          {isAdmin && (
            <>
              <Separator className="my-4 bg-white/10" />

              <div className="space-y-1">
                <p className="mb-2 px-2 text-xs font-semibold tracking-wider text-white/50 uppercase">
                  Admin
                </p>
                {ADMIN_NAV_ITEMS.map((item) => {
                  const Icon = ICON_MAP[item.icon]
                  return (
                    <SheetClose asChild key={item.href}>
                      <Link href={item.href} onClick={onClose}>
                        <Button
                          variant="ghost"
                          className={cn(
                            'min-h-11 w-full justify-start text-white/80 hover:bg-white/10 hover:text-white',
                            isActive(item.href) && 'bg-primary/20 text-primary-foreground'
                          )}
                        >
                          {Icon && <Icon className="mr-2 h-4 w-4" />}
                          {item.label}
                        </Button>
                      </Link>
                    </SheetClose>
                  )
                })}
              </div>
            </>
          )}

          <Separator className="my-4 bg-white/10" />

          {/* Settings */}
          <div className="space-y-1">
            <SheetClose asChild>
              <Link href="/settings" onClick={onClose}>
                <Button
                  variant="ghost"
                  className={cn(
                    'min-h-11 w-full justify-start text-white/80 hover:bg-white/10 hover:text-white',
                    isActive('/settings') && 'bg-primary/20 text-primary-foreground'
                  )}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </Link>
            </SheetClose>
          </div>

          {/* User info */}
          {user && (
            <div className="mt-4 px-2">
              <p className="truncate text-sm font-medium text-white/90">{user.name || 'User'}</p>
              <p className="truncate text-xs text-white/50">{user.email}</p>
            </div>
          )}
          <Button
            variant="ghost"
            className="mt-2 min-h-10 w-full justify-start text-white/60 hover:bg-white/10 hover:text-white"
            onClick={async () => {
              const supabase = createClient()
              await supabase.auth.signOut()
              onClose()
              router.push('/login')
              router.refresh()
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
