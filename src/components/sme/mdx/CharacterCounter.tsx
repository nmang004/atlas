'use client'

import { useState } from 'react'

import { cn } from '@/lib/utils'

interface CharacterCounterProps {
  type: 'title' | 'meta'
  placeholder?: string
}

const limits = {
  title: 60,
  meta: 155,
}

const labels = {
  title: 'Title Tag',
  meta: 'Meta Description',
}

const placeholders = {
  title: 'Enter your title tag...',
  meta: 'Enter your meta description...',
}

export function CharacterCounter({ type, placeholder }: CharacterCounterProps) {
  const [value, setValue] = useState('')
  const limit = limits[type]
  const remaining = limit - value.length
  const isOverLimit = remaining < 0
  const isNearLimit = remaining >= 0 && remaining <= 10

  return (
    <div className="my-4">
      <label className="block text-sm font-medium mb-2">{labels[type]}</label>
      {type === 'title' ? (
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder || placeholders[type]}
          className={cn(
            'w-full rounded-lg border bg-background px-4 py-2 text-sm',
            'focus:outline-none focus:ring-2 focus:ring-primary',
            isOverLimit && 'border-red-500 focus:ring-red-500'
          )}
        />
      ) : (
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder || placeholders[type]}
          rows={3}
          className={cn(
            'w-full rounded-lg border bg-background px-4 py-2 text-sm resize-none',
            'focus:outline-none focus:ring-2 focus:ring-primary',
            isOverLimit && 'border-red-500 focus:ring-red-500'
          )}
        />
      )}
      <div className="mt-2 flex items-center justify-between text-sm">
        <span
          className={cn(
            'font-medium',
            isOverLimit
              ? 'text-red-500'
              : isNearLimit
                ? 'text-orange-500'
                : 'text-muted-foreground'
          )}
        >
          {value.length} / {limit} characters
          {isOverLimit && ` (${Math.abs(remaining)} over)`}
        </span>
        {value.length > 0 && (
          <button
            onClick={() => setValue('')}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Clear
          </button>
        )}
      </div>
      {/* Preview */}
      {value.length > 0 && (
        <div className="mt-4 rounded-lg border bg-muted/50 p-3">
          <p className="text-xs text-muted-foreground mb-1">
            SERP Preview ({type === 'title' ? 'Title' : 'Description'})
          </p>
          <p
            className={cn(
              'text-sm',
              type === 'title' ? 'text-blue-600 font-medium' : 'text-muted-foreground'
            )}
          >
            {value.length > limit ? `${value.slice(0, limit)}...` : value}
          </p>
        </div>
      )}
    </div>
  )
}
