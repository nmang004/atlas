'use client'

import { Menu, Search } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const handleSearchClick = () => {
    // Dispatch Cmd+K to open the command palette
    const event = new KeyboardEvent('keydown', {
      key: 'k',
      metaKey: true,
      bubbles: true,
    })
    document.dispatchEvent(event)
  }

  return (
    <header className="bg-background sticky top-0 z-40 flex h-14 items-center gap-4 border-b px-4 md:px-6">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="min-h-11 min-w-11 lg:hidden"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Search trigger styled as search bar */}
      <button
        type="button"
        onClick={handleSearchClick}
        className="border-input bg-muted/50 text-muted-foreground hover:bg-muted flex h-9 w-full max-w-sm items-center gap-2 rounded-md border px-3 text-sm transition-colors"
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="flex-1 text-left">Search skills, MCPs, prompts...</span>
        <kbd className="bg-muted text-muted-foreground pointer-events-none hidden h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium select-none sm:flex">
          <span className="text-xs">&#8984;</span>K
        </kbd>
      </button>
    </header>
  )
}
