'use client'

import Link from 'next/link'

export function SMEHeader() {
  const triggerSearch = () => {
    const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true })
    document.dispatchEvent(event)
  }

  return (
    <header className="fixed top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <Link href="/sme" className="flex items-center gap-2 font-semibold">
            <span className="text-xl">📚</span>
            <span>SME Knowledge Base</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <button
            className="hidden md:flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted"
            onClick={triggerSearch}
          >
            Search...
            <kbd className="rounded border bg-background px-1.5 text-xs">⌘K</kbd>
          </button>
          <Link
            href="/prompts"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to Atlas
          </Link>
        </div>
      </div>
    </header>
  )
}
