'use client'

import { useState, useCallback } from 'react'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'

import { Header } from '@/components/layout/Header'
import { MobileSidebar } from '@/components/layout/MobileSidebar'
import { Sidebar } from '@/components/layout/Sidebar'
import type { User } from '@/types'

interface Category {
  id: string
  name: string
  prompt_count: number
}

interface DashboardShellProps {
  categories: Category[]
  user: User | null
  isAdmin: boolean
  children: React.ReactNode
}

export function DashboardShell({ categories, user, isAdmin, children }: DashboardShellProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSearch = useCallback(
    (query: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (query.trim()) {
        params.set('search', query)
      } else {
        params.delete('search')
      }
      // Navigate to prompts page with search if not already there
      const targetPath = pathname === '/prompts' ? pathname : '/prompts'
      router.push(`${targetPath}?${params.toString()}`)
    },
    [router, pathname, searchParams]
  )

  const headerUser = user
    ? {
        name: user.name,
        email: user.email,
        role: user.role,
      }
    : null

  return (
    <div className="flex h-screen">
      {/* Desktop sidebar - hidden on mobile/tablet */}
      <div className="hidden lg:block">
        <Sidebar categories={categories} isAdmin={isAdmin} />
      </div>

      {/* Mobile sidebar drawer */}
      <MobileSidebar
        categories={categories}
        isAdmin={isAdmin}
        open={mobileMenuOpen}
        onOpenChange={setMobileMenuOpen}
      />

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          user={headerUser}
          onSearch={handleSearch}
          showSearch={true}
          onMenuClick={() => setMobileMenuOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
