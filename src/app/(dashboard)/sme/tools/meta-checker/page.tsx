'use client'

import { useState } from 'react'

import { Check, X, AlertTriangle } from 'lucide-react'

import { SMEBreadcrumbs } from '@/components/sme/SMEBreadcrumbs'
import { cn } from '@/lib/utils'

const META_LIMIT = 155

interface Analysis {
  length: number
  hasValueProp: boolean
  hasCTA: boolean
  hasPhone: boolean
  endsWithCTA: boolean
}

const ctaPatterns = [
  'call',
  'contact',
  'schedule',
  'book',
  'get',
  'request',
  'learn more',
  'free',
  'today',
  'now',
  'quote',
  'estimate',
  'consultation',
]

export default function MetaCheckerPage() {
  const [meta, setMeta] = useState('')
  const [phone, setPhone] = useState('')

  const analyze = (): Analysis => {
    const lowerMeta = meta.toLowerCase()
    const hasCTA = ctaPatterns.some((pattern) => lowerMeta.includes(pattern))
    const phonePattern = /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/
    const hasPhone = phone ? meta.includes(phone) : phonePattern.test(meta)

    return {
      length: meta.length,
      hasValueProp: meta.length > 50, // Assuming longer = more likely to have value prop
      hasCTA,
      hasPhone,
      endsWithCTA:
        lowerMeta.endsWith('.') ||
        lowerMeta.endsWith('!') ||
        ctaPatterns.some((p) => lowerMeta.trim().endsWith(p)),
    }
  }

  const analysis = analyze()
  const remaining = META_LIMIT - analysis.length
  const isOverLimit = remaining < 0
  const isNearLimit = remaining >= 0 && remaining <= 10
  const isTooShort = analysis.length > 0 && analysis.length < 120

  const getScore = () => {
    let score = 0
    if (analysis.length >= 120 && analysis.length <= META_LIMIT) {score += 30}
    else if (analysis.length > 0 && analysis.length < 120) {score += 15}
    if (analysis.hasCTA) {score += 30}
    if (analysis.hasPhone) {score += 25}
    if (analysis.hasValueProp) {score += 15}
    return Math.min(score, 100)
  }

  const score = getScore()

  return (
    <div className="space-y-8">
      <SMEBreadcrumbs
        items={[
          { label: 'Tools', href: '/sme/tools' },
          { label: 'Meta Description Checker' },
        ]}
      />

      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Meta Description Checker</h1>
        <p className="text-muted-foreground">
          Validate your meta description for maximum click-through rate
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Meta Description</label>
            <textarea
              value={meta}
              onChange={(e) => setMeta(e.target.value)}
              placeholder="Enter your meta description..."
              rows={4}
              className={cn(
                'w-full rounded-lg border bg-background px-4 py-3 text-base resize-none',
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
                      : isTooShort
                        ? 'text-yellow-500'
                        : 'text-muted-foreground'
                )}
              >
                {analysis.length} / {META_LIMIT} characters
                {isOverLimit && ` (${Math.abs(remaining)} over)`}
                {isTooShort && ' (consider adding more detail)'}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Phone Number (optional - for detection)
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g., (555) 123-4567"
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Analysis results */}
        <div className="space-y-4">
          {/* Score */}
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">CTR Optimization Score</span>
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
              passed={analysis.length >= 120 && analysis.length <= META_LIMIT}
              label="Optimal length (120-155 chars)"
              warning={isTooShort || isNearLimit}
            />
            <CheckItem passed={analysis.hasCTA} label="Contains call-to-action" />
            <CheckItem passed={analysis.hasPhone} label="Includes phone number" />
            <CheckItem passed={!isOverLimit} label="Under character limit" />
          </div>

          {/* SERP Preview */}
          {meta && (
            <div className="rounded-lg border p-4">
              <h3 className="font-semibold mb-3">SERP Preview</h3>
              <div className="rounded-lg bg-white p-4 text-sm">
                <p className="text-blue-600 text-lg hover:underline cursor-pointer">
                  Example Page Title | Brand Name
                </p>
                <p className="text-green-700 text-sm">www.example.com/service</p>
                <p className="text-gray-600 mt-1">
                  {meta.length > META_LIMIT ? `${meta.slice(0, META_LIMIT)}...` : meta}
                </p>
              </div>
            </div>
          )}

          {/* CTA detection */}
          {meta && (
            <div className="rounded-lg border p-4">
              <h3 className="font-semibold mb-3">Detected CTAs</h3>
              <div className="flex flex-wrap gap-2">
                {ctaPatterns
                  .filter((pattern) => meta.toLowerCase().includes(pattern))
                  .map((cta) => (
                    <span
                      key={cta}
                      className="rounded-full bg-green-500/10 px-2 py-1 text-xs font-medium text-green-600"
                    >
                      {cta}
                    </span>
                  ))}
                {!analysis.hasCTA && (
                  <span className="text-sm text-muted-foreground">
                    No CTAs detected. Consider adding: call, free, today, schedule, etc.
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Best practices */}
      <div className="rounded-lg border p-6">
        <h3 className="font-semibold mb-4">Meta Description Best Practices</h3>
        <ul className="grid gap-3 sm:grid-cols-2 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            <span>Keep between 120-155 characters</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            <span>Include a clear call-to-action</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            <span>Add phone number for local services</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            <span>Highlight your unique value proposition</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-500">✗</span>
            <span>Don&apos;t just repeat the title tag</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-500">✗</span>
            <span>Avoid generic descriptions</span>
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
}: {
  passed: boolean
  label: string
  warning?: boolean
}) {
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
