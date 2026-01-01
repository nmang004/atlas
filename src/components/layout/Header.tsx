'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { LogOut, Settings, Menu, Search, X } from 'lucide-react'

import { SearchInput } from '@/components/common/SearchInput'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { createClient } from '@/lib/supabase/client'

interface HeaderProps {
  user?: {
    name: string | null
    email: string
    role: 'admin' | 'user'
  } | null
  onSearch?: (query: string) => void
  showSearch?: boolean
  onMenuClick?: () => void
}

export function Header({ user, onSearch, showSearch = true, onMenuClick }: HeaderProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

  const handleLogout = async () => {
    const supabase = createClient()

    const { error } = await supabase.auth.signOut()

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign out. Please try again.',
        variant: 'destructive',
      })
      return
    }

    toast({
      title: 'Signed out',
      description: 'You have been successfully signed out.',
    })

    router.push('/login')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b bg-background px-4 md:px-6">
      {/* Left section: Menu button (mobile) + Search */}
      <div className="flex flex-1 items-center gap-2 md:gap-4">
        {/* Hamburger menu - visible on mobile */}
        {onMenuClick && (
          <Button
            variant="ghost"
            size="icon"
            className="min-h-11 min-w-11 lg:hidden"
            onClick={onMenuClick}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}

        {/* Desktop search - hidden on small screens */}
        {showSearch && onSearch && (
          <div className="hidden w-full max-w-md md:block">
            <SearchInput placeholder="Search prompts..." onSearch={onSearch} />
          </div>
        )}

        {/* Mobile search toggle - visible on small screens */}
        {showSearch && onSearch && (
          <Button
            variant="ghost"
            size="icon"
            className="min-h-11 min-w-11 md:hidden"
            onClick={() => setMobileSearchOpen(true)}
            aria-label="Open search"
          >
            <Search className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Right section: User info */}
      <div className="flex items-center gap-2">
        {user ? (
          <div className="flex items-center gap-2 md:gap-3">
            {/* User info - hidden on very small screens, compact on medium */}
            <div className="hidden text-right sm:block">
              <p className="max-w-[120px] truncate text-sm font-medium md:max-w-none">
                {user.name || user.email}
              </p>
              <p className="text-xs capitalize text-muted-foreground">{user.role}</p>
            </div>
            <Button variant="ghost" size="icon" className="hidden min-h-11 min-w-11 sm:flex">
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="min-h-11 min-w-11"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild className="min-h-11">
              <a href="/login">Log in</a>
            </Button>
            <Button asChild className="min-h-11">
              <a href="/signup">Sign up</a>
            </Button>
          </div>
        )}
      </div>

      {/* Mobile search overlay */}
      {mobileSearchOpen && showSearch && onSearch && (
        <div className="absolute inset-0 z-50 flex items-center gap-2 bg-background px-4 md:hidden">
          <div className="flex-1">
            <SearchInput
              placeholder="Search prompts..."
              onSearch={(query) => {
                onSearch(query)
                setMobileSearchOpen(false)
              }}
              autoFocus
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="min-h-11 min-w-11 shrink-0"
            onClick={() => setMobileSearchOpen(false)}
            aria-label="Close search"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      )}
    </header>
  )
}
