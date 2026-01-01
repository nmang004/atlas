// Application constants

export const APP_NAME = 'Atlas'
export const APP_DESCRIPTION = 'Prompt Library & Governance System'

// Stale prompt threshold in days
export const STALE_THRESHOLD_DAYS = 60

// Debounce delay for search input (ms)
export const SEARCH_DEBOUNCE_MS = 300

// Voting UI reset timeout (ms)
export const VOTING_RESET_TIMEOUT_MS = 30000

// Maximum tags to display on card before showing overflow
export const MAX_VISIBLE_TAGS = 3

// Sort options for prompt list
export const SORT_OPTIONS = [
  { value: 'verified', label: 'Recently Verified' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'votes', label: 'Most Voted' },
  { value: 'newest', label: 'Newest' },
] as const

export type SortOption = (typeof SORT_OPTIONS)[number]['value']

// Default sort option
export const DEFAULT_SORT: SortOption = 'verified'

// Navigation items
export const NAV_ITEMS = [
  { href: '/prompts', label: 'All Prompts', icon: 'FileText' },
  { href: '/categories', label: 'Categories', icon: 'FolderOpen' },
] as const

// Admin navigation items
export const ADMIN_NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: 'LayoutDashboard' },
  { href: '/admin/flagged', label: 'Flagged Prompts', icon: 'Flag' },
] as const
