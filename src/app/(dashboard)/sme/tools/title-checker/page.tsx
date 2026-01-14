'use client'

import { useState } from 'react'

import { Check, X, AlertTriangle } from 'lucide-react'

import { SMEBreadcrumbs } from '@/components/sme/SMEBreadcrumbs'
import { cn } from '@/lib/utils'

const TITLE_LIMIT = 60

interface Analysis {
  length: number
  hasKeyword: boolean
  hasGeo: boolean
  hasBrand: boolean
  startsWithKeyword: boolean
}

export default function TitleCheckerPage() {
  const [title, setTitle] = useState('')
  const [keyword, setKeyword] = useState('')
  const [geo, setGeo] = useState('')
  const [brand, setBrand] = useState('')

  const analyze = (): Analysis => {
    const lowerTitle = title.toLowerCase()
    return {
      length: title.length,
      hasKeyword: keyword ? lowerTitle.includes(keyword.toLowerCase()) : false,
      hasGeo: geo ? lowerTitle.includes(geo.toLowerCase()) : false,
      hasBrand: brand ? lowerTitle.includes(brand.toLowerCase()) : false,
      startsWithKeyword: keyword
        ? lowerTitle.startsWith(keyword.toLowerCase())
        : false,
    }
  }

  const analysis = analyze()
  const remaining = TITLE_LIMIT - analysis.length
  const isOverLimit = remaining < 0
  const isNearLimit = remaining >= 0 && remaining <= 5

  const getScore = () => {
    let score = 0
    if (analysis.length > 0 && analysis.length <= TITLE_LIMIT) {score += 25}
    if (analysis.hasKeyword) {score += 25}
    if (analysis.startsWithKeyword) {score += 15}
    if (analysis.hasGeo) {score += 20}
    if (analysis.hasBrand) {score += 15}
    return Math.min(score, 100)
  }

  const score = getScore()

  return (
    <div className="space-y-8">
      <SMEBreadcrumbs
        items={[
          { label: 'Tools', href: '/sme/tools' },
          { label: 'Title Tag Checker' },
        ]}
      />

      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Title Tag Checker</h1>
        <p className="text-muted-foreground">
          Validate your title tag against SEO best practices
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title Tag</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your title tag..."
              className={cn(
                'w-full rounded-lg border bg-background px-4 py-3 text-lg',
                'focus:outline-none focus:ring-2 focus:ring-primary',
                isOverLimit && 'border-red-500 focus:ring-red-500'
              )}
            />
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
                {analysis.length} / {TITLE_LIMIT} characters
                {isOverLimit && ` (${Math.abs(remaining)} over)`}
              </span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium mb-2">Target Keyword</label>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="e.g., Emergency Plumber"
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Geographic Target</label>
              <input
                type="text"
                value={geo}
                onChange={(e) => setGeo(e.target.value)}
                placeholder="e.g., Dallas"
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Brand Name</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g., ABC Plumbing"
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Analysis results */}
        <div className="space-y-4">
          {/* Score */}
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">SEO Score</span>
              <span
                className={cn(
                  'text-2xl font-bold',
                  score >= 80
                    ? 'text-green-600'
                    : score >= 50
                      ? 'text-orange-500'
                      : 'text-red-500'
                )}
              >
                {score}%
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className={cn(
                  'h-full transition-all duration-300',
                  score >= 80
                    ? 'bg-green-500'
                    : score >= 50
                      ? 'bg-orange-500'
                      : 'bg-red-500'
                )}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>

          {/* Checklist */}
          <div className="rounded-lg border p-4 space-y-3">
            <h3 className="font-semibold">Analysis</h3>
            <CheckItem
              passed={analysis.length > 0 && analysis.length <= TITLE_LIMIT}
              label={`Character count (${analysis.length}/${TITLE_LIMIT})`}
              warning={isNearLimit}
            />
            <CheckItem
              passed={analysis.hasKeyword}
              label="Contains target keyword"
              disabled={!keyword}
            />
            <CheckItem
              passed={analysis.startsWithKeyword}
              label="Starts with keyword (recommended)"
              disabled={!keyword}
            />
            <CheckItem
              passed={analysis.hasGeo}
              label="Contains geographic modifier"
              disabled={!geo}
            />
            <CheckItem
              passed={analysis.hasBrand}
              label="Contains brand name"
              disabled={!brand}
            />
          </div>

          {/* SERP Preview */}
          {title && (
            <div className="rounded-lg border p-4">
              <h3 className="font-semibold mb-3">SERP Preview</h3>
              <div className="rounded-lg bg-white p-4 text-sm">
                <p className="text-blue-600 text-lg hover:underline cursor-pointer">
                  {title.length > TITLE_LIMIT ? `${title.slice(0, TITLE_LIMIT)}...` : title}
                </p>
                <p className="text-green-700 text-sm">www.example.com/service</p>
                <p className="text-gray-600 mt-1">
                  This is where your meta description would appear in search results...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Best practices */}
      <div className="rounded-lg border p-6">
        <h3 className="font-semibold mb-4">Title Tag Best Practices</h3>
        <ul className="grid gap-3 sm:grid-cols-2 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            <span>Keep under 60 characters to avoid truncation</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            <span>Put primary keyword FIRST for maximum weight</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            <span>Include geographic modifier for local SEO</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            <span>Add brand name at the end (e.g., | Brand Name)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-500">✗</span>
            <span>Avoid generic titles like &quot;Welcome&quot; or &quot;Home&quot;</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-500">✗</span>
            <span>Don&apos;t keyword stuff - keep it natural</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

function CheckItem({
  passed,
  label,
  warning,
  disabled,
}: {
  passed: boolean
  label: string
  warning?: boolean
  disabled?: boolean
}) {
  if (disabled) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <div className="h-5 w-5 rounded-full border-2 border-muted" />
        <span className="text-sm">{label}</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {passed ? (
        warning ? (
          <AlertTriangle className="h-5 w-5 text-orange-500" />
        ) : (
          <Check className="h-5 w-5 text-green-500" />
        )
      ) : (
        <X className="h-5 w-5 text-red-500" />
      )}
      <span className={cn('text-sm', passed ? 'text-foreground' : 'text-muted-foreground')}>
        {label}
      </span>
    </div>
  )
}
