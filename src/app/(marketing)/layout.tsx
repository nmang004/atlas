'use client'

import { useState, useEffect } from 'react'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Menu, X, Layers } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/features', label: 'Features' },
  { href: '/how-it-works', label: 'How It Works' },
]

function MarketingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'bg-navy/80 border-b border-white/10 shadow-lg shadow-black/10 backdrop-blur-xl'
          : 'bg-transparent'
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:h-18 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="relative flex h-8 w-8 items-center justify-center">
            <div className="bg-primary absolute inset-0 rounded-lg opacity-20 blur-sm transition-all duration-300 group-hover:opacity-40 group-hover:blur-md" />
            <div className="bg-primary relative flex h-8 w-8 items-center justify-center rounded-lg">
              <Layers className="h-4 w-4 text-white" />
            </div>
          </div>
          <span className="font-heading text-xl font-bold tracking-tight text-white">Atlas</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-200',
                pathname === link.href ? 'text-white' : 'text-white/60 hover:text-white'
              )}
            >
              {pathname === link.href && (
                <span className="absolute inset-0 rounded-full bg-white/10" />
              )}
              <span className="relative">{link.label}</span>
            </Link>
          ))}
        </nav>

        {/* Desktop auth buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <Button
            variant="ghost"
            size="sm"
            className="text-white/70 hover:bg-white/10 hover:text-white"
            asChild
          >
            <Link href="/login">Log in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-white/70 transition-colors hover:text-white md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      <div
        className={cn(
          'overflow-hidden border-white/10 transition-all duration-300 md:hidden',
          mobileOpen ? 'bg-navy/95 max-h-80 border-t backdrop-blur-xl' : 'max-h-0 border-t-0'
        )}
      >
        <div className="space-y-1 px-4 py-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'block rounded-lg px-4 py-2.5 text-base font-medium transition-colors',
                pathname === link.href
                  ? 'bg-white/10 text-white'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              )}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-white/20 text-white hover:bg-white/10 hover:text-white"
              asChild
            >
              <Link href="/login">Log in</Link>
            </Button>
            <Button size="sm" className="flex-1" asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

function MarketingFooter() {
  return (
    <footer className="bg-navy border-t border-white/5">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
          {/* Logo & tagline */}
          <div className="flex flex-col items-center gap-3 sm:items-start">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="bg-primary flex h-7 w-7 items-center justify-center rounded-lg">
                <Layers className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="font-heading text-lg font-bold text-white">Atlas</span>
            </Link>
            <p className="text-sm text-white/40">
              The internal skill &amp; MCP marketplace for Scorpion.
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-white/40 transition-colors hover:text-white/70"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10 border-t border-white/5 pt-8">
          <p className="text-center text-sm text-white/30">
            &copy; {new Date().getFullYear()} Scorpion. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-navy flex min-h-screen flex-col">
      <MarketingHeader />
      <main className="flex-1">{children}</main>
      <MarketingFooter />
    </div>
  )
}
