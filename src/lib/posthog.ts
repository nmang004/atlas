import posthog from 'posthog-js'

export const initPostHog = () => {
  if (typeof window !== 'undefined' && !posthog.__loaded) {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
      capture_pageview: false, // We handle this manually in PostHogProvider
      capture_pageleave: true,
      persistence: 'localStorage',
      autocapture: false, // Manual control over events
    })
  }
  return posthog
}

// User identification
export const identifyUser = (user: { id: string; email: string; name?: string; role?: string }) => {
  if (typeof window !== 'undefined' && posthog.__loaded) {
    posthog.identify(user.id, {
      email: user.email,
      name: user.name,
      role: user.role,
    })
  }
}

export const resetUser = () => {
  if (typeof window !== 'undefined' && posthog.__loaded) {
    posthog.reset()
  }
}

// Type-safe event tracking
export const trackEvent = {
  promptViewed: (data: { prompt_id: string; prompt_title: string; category: string }) => {
    posthog.capture('prompt_viewed', data)
  },

  promptCopied: (data: {
    prompt_id: string
    prompt_title: string
    category: string
    had_variables: boolean
    variables_filled: number
  }) => {
    posthog.capture('prompt_copied', data)
  },

  promptVoted: (data: {
    prompt_id: string
    prompt_title: string
    outcome: 'positive' | 'negative'
    had_feedback: boolean
  }) => {
    posthog.capture('prompt_voted', data)
  },

  variablesFilled: (data: {
    prompt_id: string
    prompt_title: string
    variables_count: number
    required_filled: number
  }) => {
    posthog.capture('variables_filled', data)
  },

  searchPerformed: (data: { query: string; results_count: number }) => {
    posthog.capture('search_performed', data)
  },

  categoryFiltered: (data: { category_id: string; category_name: string }) => {
    posthog.capture('category_filtered', data)
  },

  tagFiltered: (data: { tags: string[]; tags_count: number }) => {
    posthog.capture('tag_filtered', data)
  },
}

export { posthog }
