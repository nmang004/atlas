'use client'

import Link from 'next/link'

import { ChevronRight, Home } from 'lucide-react'

interface SMEBreadcrumbsProps {
  items: {
    label: string
    href?: string
  }[]
}

export function SMEBreadcrumbs({ items }: SMEBreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-1 text-sm text-muted-foreground">
      <Link
        href="/sme"
        className="flex items-center gap-1 hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
        <span className="sr-only">SME Home</span>
      </Link>
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-1">
          <ChevronRight className="h-4 w-4" />
          {item.href ? (
            <Link href={item.href} className="hover:text-foreground transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
