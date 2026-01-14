'use client'

import { useState } from 'react'

import Link from 'next/link'

import { ArrowRight, Sparkles, X } from 'lucide-react'

interface AnnouncementBannerProps {
  version: string
  message: string
  linkText: string
  linkHref: string
}

export function AnnouncementBanner({ version, message, linkText, linkHref }: AnnouncementBannerProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) {
    return null
  }

  return (
    <div className="relative isolate flex items-center gap-x-6 overflow-hidden bg-gradient-to-r from-primary via-primary/90 to-secondary px-6 py-2.5 sm:px-3.5">
      {/* Background decoration */}
      <div
        className="absolute left-[max(-7rem,calc(50%-52rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
        aria-hidden="true"
      >
        <div
          className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-white/20 to-white/5 opacity-30"
          style={{
            clipPath:
              'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)',
          }}
        />
      </div>
      <div
        className="absolute left-[max(45rem,calc(50%+8rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
        aria-hidden="true"
      >
        <div
          className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-white/20 to-white/5 opacity-30"
          style={{
            clipPath:
              'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)',
          }}
        />
      </div>

      <div className="flex flex-1 flex-wrap items-center justify-center gap-x-4 gap-y-2">
        <div className="flex items-center gap-2 text-sm font-medium leading-6 text-white">
          <Sparkles className="h-4 w-4" />
          <span className="font-semibold">{version}</span>
          <span className="hidden sm:inline">—</span>
          <span className="hidden sm:inline">{message}</span>
        </div>
        <Link
          href={linkHref}
          className="flex items-center gap-1 rounded-full bg-white/20 px-3.5 py-1 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-white/30"
        >
          {linkText}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <button
        type="button"
        className="-m-1.5 flex-none p-1.5 text-white/80 transition-colors hover:text-white"
        onClick={() => setIsVisible(false)}
      >
        <span className="sr-only">Dismiss</span>
        <X className="h-5 w-5" />
      </button>
    </div>
  )
}
