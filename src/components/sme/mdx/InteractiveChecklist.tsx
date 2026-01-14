'use client'

import { useState, useEffect } from 'react'

import { Check } from 'lucide-react'

import { cn } from '@/lib/utils'

interface InteractiveChecklistProps {
  id: string
  children: React.ReactNode
}

interface ChecklistItem {
  text: string
  checked: boolean
}

export function InteractiveChecklist({ id, children }: InteractiveChecklistProps) {
  const [items, setItems] = useState<ChecklistItem[]>([])
  const [mounted, setMounted] = useState(false)

  // Parse children to extract checklist items
  useEffect(() => {
    const content = String(children)
    const lines = content.split('\n').filter((line) => line.trim().startsWith('- ['))

    const parsedItems = lines.map((line) => {
      const isChecked = line.includes('[x]') || line.includes('[X]')
      const text = line.replace(/^-\s*\[[xX\s]\]\s*/, '').trim()
      return { text, checked: isChecked }
    })

    // Load saved state from localStorage
    const savedState = localStorage.getItem(`sme-checklist-${id}`)
    if (savedState) {
      const savedItems = JSON.parse(savedState) as boolean[]
      setItems(
        parsedItems.map((item, index) => ({
          ...item,
          checked: savedItems[index] ?? item.checked,
        }))
      )
    } else {
      setItems(parsedItems)
    }
    setMounted(true)
  }, [id, children])

  // Save state to localStorage
  useEffect(() => {
    if (mounted && items.length > 0) {
      localStorage.setItem(
        `sme-checklist-${id}`,
        JSON.stringify(items.map((item) => item.checked))
      )
    }
  }, [id, items, mounted])

  const toggleItem = (index: number) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, checked: !item.checked } : item))
    )
  }

  const resetChecklist = () => {
    setItems((prev) => prev.map((item) => ({ ...item, checked: false })))
    localStorage.removeItem(`sme-checklist-${id}`)
  }

  const completedCount = items.filter((item) => item.checked).length
  const progress = items.length > 0 ? (completedCount / items.length) * 100 : 0

  if (!mounted) {
    return (
      <div className="my-6 rounded-lg border bg-muted/50 p-4">
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-5 w-5 rounded bg-muted" />
              <div className="h-4 flex-1 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="my-6 rounded-lg border bg-card p-4">
      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-muted-foreground">
            {completedCount} of {items.length} completed
          </span>
          <button
            onClick={resetChecklist}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Reset
          </button>
        </div>
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Checklist items */}
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index}>
            <button
              onClick={() => toggleItem(index)}
              className={cn(
                'flex w-full items-start gap-3 rounded-lg p-2 text-left transition-colors',
                'hover:bg-muted/50',
                item.checked && 'text-muted-foreground'
              )}
            >
              <div
                className={cn(
                  'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors',
                  item.checked
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-muted-foreground'
                )}
              >
                {item.checked && <Check className="h-3 w-3" />}
              </div>
              <span className={cn('text-sm', item.checked && 'line-through')}>
                {item.text}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
