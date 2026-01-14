'use client'

import { useState, useEffect } from 'react'

import { Check, RotateCcw, Printer } from 'lucide-react'

import { SMEBreadcrumbs } from '@/components/sme/SMEBreadcrumbs'
import { cn } from '@/lib/utils'

interface ChecklistSection {
  title: string
  items: string[]
}

const checklist: ChecklistSection[] = [
  {
    title: 'On-Page SEO',
    items: [
      'Title tag is under 60 characters with keyword first',
      'Meta description is under 155 characters with CTA',
      'Only one H1 on the page containing target keyword',
      'URL is clean, lowercase, hyphenated',
      'Primary keyword appears in first 100 words',
      'H2s and H3s use keyword variations naturally',
      'All images have descriptive alt text',
      'All images are optimized (under 200KB)',
      'Internal links use descriptive anchor text',
    ],
  },
  {
    title: 'Content Quality',
    items: [
      'Page directly addresses user intent',
      'Key answer/value is visible above the fold',
      'Content is comprehensive for the target keyword',
      'E-E-A-T signals are present (credentials, experience, trust)',
      'No duplicate content from other pages',
      'Content is free of spelling and grammar errors',
    ],
  },
  {
    title: 'Conversion Elements',
    items: [
      'Primary CTA is above the fold',
      'Additional CTAs appear after major sections',
      'Phone number is click-to-call on mobile',
      'Contact form is short and simple',
      'Trust signals (reviews, credentials) are visible',
    ],
  },
  {
    title: 'Mobile Experience',
    items: [
      'Page passes Google Mobile-Friendly Test',
      'Sticky header or floating CTA on mobile',
      'Buttons pass thumb test (easily tappable)',
      'Paragraphs are 2-3 lines max on mobile viewport',
      'Page loads in under 3 seconds on mobile',
    ],
  },
  {
    title: 'Schema & Technical',
    items: [
      'LocalBusiness schema implemented correctly',
      'FAQ schema on pages with FAQ content',
      'Schema validates in Google Rich Results Test',
      'Canonical tag is set correctly',
      'No broken internal or external links',
    ],
  },
]

const STORAGE_KEY = 'sme-prelaunch-checklist'

export default function PreLaunchChecklistPage() {
  const [projectName, setProjectName] = useState('')
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})
  const [mounted, setMounted] = useState(false)

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      setProjectName(parsed.projectName || '')
      setCheckedItems(parsed.checkedItems || {})
    }
    setMounted(true)
  }, [])

  // Save to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ projectName, checkedItems })
      )
    }
  }, [projectName, checkedItems, mounted])

  const toggleItem = (key: string) => {
    setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const resetChecklist = () => {
    if (confirm('Are you sure you want to reset the entire checklist?')) {
      setCheckedItems({})
      setProjectName('')
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  const totalItems = checklist.reduce((sum, section) => sum + section.items.length, 0)
  const completedItems = Object.values(checkedItems).filter(Boolean).length
  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0

  const getSectionProgress = (section: ChecklistSection) => {
    const completed = section.items.filter(
      (_, i) => checkedItems[`${section.title}-${i}`]
    ).length
    return { completed, total: section.items.length }
  }

  const printChecklist = () => {
    window.print()
  }

  if (!mounted) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-8 w-64 bg-muted rounded" />
        <div className="h-4 w-48 bg-muted rounded" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 print:space-y-4">
      <div className="print:hidden">
        <SMEBreadcrumbs
          items={[
            { label: 'Tools', href: '/sme/tools' },
            { label: 'Pre-Launch Checklist' },
          ]}
        />
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 print:text-2xl">
            Pre-Launch SEO Checklist
          </h1>
          <p className="text-muted-foreground print:text-sm">
            Complete this checklist before launching any page or site
          </p>
        </div>
        <div className="flex gap-2 print:hidden">
          <button
            onClick={printChecklist}
            className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-muted"
          >
            <Printer className="h-4 w-4" />
            Print
          </button>
          <button
            onClick={resetChecklist}
            className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-muted text-red-500"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>
      </div>

      {/* Project name */}
      <div className="print:hidden">
        <label className="block text-sm font-medium mb-2">Project Name (optional)</label>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="e.g., ABC Plumbing - Service Page"
          className="w-full max-w-md rounded-lg border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {projectName && (
        <div className="hidden print:block text-lg font-semibold">
          Project: {projectName}
        </div>
      )}

      {/* Overall progress */}
      <div className="rounded-lg border p-4 print:border-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Overall Progress</span>
          <span className="text-lg font-bold">
            {completedItems} / {totalItems} ({Math.round(progress)}%)
          </span>
        </div>
        <div className="h-3 w-full rounded-full bg-muted overflow-hidden print:border">
          <div
            className={cn(
              'h-full transition-all duration-300',
              progress === 100
                ? 'bg-green-500'
                : progress >= 50
                  ? 'bg-blue-500'
                  : 'bg-orange-500'
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
        {progress === 100 && (
          <p className="mt-2 text-sm text-green-600 font-medium">
            All items completed! Ready for launch.
          </p>
        )}
      </div>

      {/* Checklist sections */}
      <div className="space-y-6 print:space-y-4">
        {checklist.map((section) => {
          const sectionProgress = getSectionProgress(section)
          const isComplete = sectionProgress.completed === sectionProgress.total

          return (
            <div
              key={section.title}
              className={cn(
                'rounded-lg border p-4 print:break-inside-avoid',
                isComplete && 'border-green-500/50 bg-green-500/5'
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  {isComplete && <Check className="h-5 w-5 text-green-500" />}
                  {section.title}
                </h2>
                <span className="text-sm text-muted-foreground">
                  {sectionProgress.completed}/{sectionProgress.total}
                </span>
              </div>
              <ul className="space-y-2">
                {section.items.map((item, index) => {
                  const key = `${section.title}-${index}`
                  const isChecked = checkedItems[key]

                  return (
                    <li key={index}>
                      <button
                        onClick={() => toggleItem(key)}
                        className={cn(
                          'flex w-full items-start gap-3 rounded-lg p-2 text-left transition-colors',
                          'hover:bg-muted/50 print:hover:bg-transparent',
                          isChecked && 'text-muted-foreground'
                        )}
                      >
                        <div
                          className={cn(
                            'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors print:border',
                            isChecked
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-muted-foreground'
                          )}
                        >
                          {isChecked && <Check className="h-3 w-3" />}
                        </div>
                        <span
                          className={cn('text-sm', isChecked && 'line-through print:no-underline')}
                        >
                          {item}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </div>

      {/* Print footer */}
      <div className="hidden print:block text-sm text-muted-foreground pt-4 border-t">
        Generated from SME Knowledge Base | {new Date().toLocaleDateString()}
      </div>
    </div>
  )
}
