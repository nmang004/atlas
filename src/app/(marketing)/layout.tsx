'use client'

import { useState } from 'react'

import Link from 'next/link'

import { Menu, X, Layers } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/features', label: 'Features' },
  { href: '/how-it-works', label: 'How It Works' },
]

function MarketingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="border-border/40 bg-background/80 sticky top-0 z-50 w-full border-b backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
            <Layers className="text-primary-foreground h-4 w-4" />
          </div>
          <span className="font-heading text-xl font-bold tracking-tight">Atlas</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop auth buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Log in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/signup">Sign up</Link>
          </Button>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="text-muted-foreground hover:text-foreground inline-flex items-center justify-center rounded-md p-2 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      <div
        className={cn(
          'border-border/40 overflow-hidden border-t transition-all duration-200 md:hidden',
          mobileOpen ? 'max-h-64' : 'max-h-0 border-t-0'
        )}
      >
        <div className="space-y-1 px-4 py-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:bg-accent hover:text-foreground block rounded-md px-3 py-2 text-base font-medium transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-3 pt-3">
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button size="sm" className="flex-1" asChild>
              <Link href="/signup">Sign up</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

function MarketingFooter() {
  return (
    <footer className="border-border/40 bg-background border-t">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="bg-primary flex h-6 w-6 items-center justify-center rounded-md">
            <Layers className="text-primary-foreground h-3 w-3" />
          </div>
          <span className="font-heading text-sm font-semibold">Atlas</span>
        </div>
        <p className="text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} Scorpion. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />
      <main className="flex-1">{children}</main>
      <MarketingFooter />
    </div>
  )
}
