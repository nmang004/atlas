'use client'

import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

interface TOCItem {
  id: string
  text: string
  level: number
}

interface SMETableOfContentsProps {
  content: string
}

export function SMETableOfContents({ content }: SMETableOfContentsProps) {
  const [headings, setHeadings] = useState<TOCItem[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    // Extract headings from content
    const headingRegex = /^(#{2,3})\s+(.+)$/gm
    const matches: TOCItem[] = []
    let match

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length
      const text = match[2].replace(/\*\*/g, '').trim()
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')

      matches.push({ id, text, level })
    }

    setHeadings(matches)
  }, [content])

  useEffect(() => {
    // Set up intersection observer for active heading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-80px 0px -80% 0px' }
    )

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) {
    return null
  }

  return (
    <nav className="hidden xl:block">
      <p className="mb-2 text-sm font-semibold">On This Page</p>
      <ul className="space-y-1 text-sm">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className={cn(
                'block py-1 transition-colors hover:text-foreground',
                heading.level === 3 && 'pl-4',
                activeId === heading.id
                  ? 'text-primary font-medium'
                  : 'text-muted-foreground'
              )}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(heading.id)?.scrollIntoView({
                  behavior: 'smooth',
                })
              }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
