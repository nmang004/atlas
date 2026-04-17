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

interface SidebarProps {
  user: User | null
  isAdmin: boolean
}

export function Sidebar({ user, isAdmin }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(href)
  }

  return (
    <aside className="bg-navy hidden text-white lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      {/* Logo */}
      <div className="flex h-14 items-center border-b border-white/10 px-4">
        <Link
          href="/skills"
          className="group font-heading flex items-center gap-2 font-semibold text-white"
        >
          <div className="from-primary to-secondary group-hover:shadow-glow-primary flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br shadow-lg transition-all">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold">Atlas</span>
        </Link>
      </div>

      {/* Main nav */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = ICON_MAP[item.icon]
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    'min-h-10 w-full justify-start text-white/80 hover:bg-white/10 hover:text-white',
                    isActive(item.href) && 'bg-primary/20 text-primary-foreground'
                  )}
                >
                  {Icon && <Icon className="mr-2 h-4 w-4" />}
                  {item.label}
                </Button>
              </Link>
            )
          })}
        </div>

        <Separator className="my-4 bg-white/10" />

        {/* Contribute */}
        <div className="space-y-1">
          {(() => {
            const Icon = ICON_MAP[CONTRIBUTE_NAV_ITEM.icon]
            return (
              <Link href={CONTRIBUTE_NAV_ITEM.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    'min-h-10 w-full justify-start text-white/80 hover:bg-white/10 hover:text-white',
                    isActive(CONTRIBUTE_NAV_ITEM.href) && 'bg-primary/20 text-primary-foreground'
                  )}
                >
                  {Icon && <Icon className="mr-2 h-4 w-4" />}
                  {CONTRIBUTE_NAV_ITEM.label}
                </Button>
              </Link>
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
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      className={cn(
                        'min-h-10 w-full justify-start text-white/80 hover:bg-white/10 hover:text-white',
                        isActive(item.href) && 'bg-primary/20 text-primary-foreground'
                      )}
                    >
                      {Icon && <Icon className="mr-2 h-4 w-4" />}
                      {item.label}
                    </Button>
                  </Link>
                )
              })}
            </div>
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 p-4">
        <Link href="/settings">
          <Button
            variant="ghost"
            className={cn(
              'min-h-10 w-full justify-start text-white/80 hover:bg-white/10 hover:text-white',
              isActive('/settings') && 'bg-primary/20 text-primary-foreground'
            )}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </Link>
        {user && (
          <div className="mt-2 px-2">
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
            router.push('/login')
            router.refresh()
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </div>
    </aside>
  )
}
