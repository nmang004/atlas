export const APP_NAME = 'Atlas'
export const APP_DESCRIPTION = 'Skill & MCP Marketplace'

export const STALE_THRESHOLD_DAYS = 60
export const SEARCH_DEBOUNCE_MS = 300
export const VOTING_RESET_TIMEOUT_MS = 30000
export const MAX_VISIBLE_TAGS = 3

export const SKILL_SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'votes', label: 'Most Voted' },
] as const

export const PROMPT_SORT_OPTIONS = [
  { value: 'verified', label: 'Recently Verified' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'votes', label: 'Most Voted' },
  { value: 'newest', label: 'Newest' },
] as const

export type SkillSortOption = (typeof SKILL_SORT_OPTIONS)[number]['value']
export type PromptSortOption = (typeof PROMPT_SORT_OPTIONS)[number]['value']

export const SORT_OPTIONS = PROMPT_SORT_OPTIONS
export type SortOption = PromptSortOption
export const DEFAULT_SORT: SortOption = 'verified'

export const NAV_ITEMS = [
  { href: '/skills', label: 'Skills', icon: 'Sparkles' },
  { href: '/mcps', label: 'MCPs', icon: 'Plug' },
  { href: '/prompts', label: 'Prompts', icon: 'FileText' },
  { href: '/categories', label: 'Categories', icon: 'FolderOpen' },
] as const

export const ADMIN_NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: 'LayoutDashboard' },
  { href: '/admin/pending', label: 'Pending', icon: 'Clock' },
  { href: '/admin/flagged', label: 'Flagged', icon: 'Flag' },
] as const

export const CONTRIBUTE_NAV_ITEM = {
  href: '/contribute',
  label: 'Contribute',
  icon: 'Plus',
} as const

export const SKILL_FORMATS = [
  { value: 'claude_code_skill', label: 'Claude Code Skill' },
  { value: 'system_prompt', label: 'System Prompt' },
  { value: 'custom', label: 'Custom' },
] as const

export const MCP_SERVER_TYPES = [
  { value: 'stdio', label: 'stdio' },
  { value: 'sse', label: 'SSE' },
  { value: 'http', label: 'HTTP' },
  { value: 'websocket', label: 'WebSocket' },
] as const
