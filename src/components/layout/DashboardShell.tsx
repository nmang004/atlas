'use client'

import { useState, useEffect } from 'react'

import { CommandPalette } from '@/components/layout/CommandPalette'
import { Header } from '@/components/layout/Header'
import { MobileSidebar } from '@/components/layout/MobileSidebar'
import { Sidebar } from '@/components/layout/Sidebar'
import { identifyUser } from '@/lib/posthog'
import type { User } from '@/types'

interface DashboardShellProps {
  children: React.ReactNode
  user: User | null
  isAdmin: boolean
}

export function DashboardShell({ children, user, isAdmin }: DashboardShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Identify user in PostHog for analytics tracking
  useEffect(() => {
    if (user) {
      identifyUser({
        id: user.id,
        email: user.email,
        name: user.name ?? undefined,
        role: user.role ?? undefined,
      })
    }
  }, [user])

  return (
    <div className="flex h-screen">
      {/* Desktop sidebar */}
      <Sidebar user={user} isAdmin={isAdmin} />

      {/* Mobile sidebar */}
      <MobileSidebar
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        user={user}
        isAdmin={isAdmin}
      />

      {/* Main content area */}
      <div className="flex flex-1 flex-col lg:pl-64">
        <Header onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>

      {/* Command palette */}
      <CommandPalette />
    </div>
  )
}
