'use client'

import { useState } from 'react'

import { cn } from '@/lib/utils'

type Vertical = 'home-services' | 'medical' | 'legal' | 'all'

interface SampleContentProps {
  vertical: Vertical
  children: React.ReactNode
}

const verticalLabels: Record<Vertical, string> = {
  'home-services': 'Home Services',
  medical: 'Medical',
  legal: 'Legal',
  all: 'All Verticals',
}

const verticalColors: Record<Vertical, string> = {
  'home-services': 'border-orange-500/50 bg-orange-500/5',
  medical: 'border-teal-500/50 bg-teal-500/5',
  legal: 'border-purple-500/50 bg-purple-500/5',
  all: 'border-gray-500/50 bg-gray-500/5',
}

const verticalBadgeColors: Record<Vertical, string> = {
  'home-services': 'bg-orange-500/20 text-orange-700 dark:text-orange-400',
  medical: 'bg-teal-500/20 text-teal-700 dark:text-teal-400',
  legal: 'bg-purple-500/20 text-purple-700 dark:text-purple-400',
  all: 'bg-gray-500/20 text-gray-700 dark:text-gray-400',
}

export function SampleContent({ vertical, children }: SampleContentProps) {
  return (
    <div
      className={cn(
        'my-4 rounded-lg border-l-4 p-4',
        verticalColors[vertical]
      )}
    >
      <span
        className={cn(
          'inline-block rounded-full px-2 py-0.5 text-xs font-medium mb-2',
          verticalBadgeColors[vertical]
        )}
      >
        {verticalLabels[vertical]}
      </span>
      <div className="text-sm [&>p]:m-0 italic">{children}</div>
    </div>
  )
}

interface SampleContentGroupProps {
  children: React.ReactNode
}

export function SampleContentGroup({ children }: SampleContentGroupProps) {
  const [selectedVertical, setSelectedVertical] = useState<Vertical | 'all'>('all')

  return (
    <div className="my-6">
      <div className="flex gap-2 mb-4">
        {(['all', 'home-services', 'medical', 'legal'] as const).map((v) => (
          <button
            key={v}
            onClick={() => setSelectedVertical(v)}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium transition-colors',
              selectedVertical === v
                ? verticalBadgeColors[v]
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            {verticalLabels[v]}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {/* Filter children based on selected vertical */}
        {children}
      </div>
    </div>
  )
}
