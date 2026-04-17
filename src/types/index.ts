import type { Database } from './database'

// Table row types
export type User = Database['public']['Tables']['users']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type Prompt = Database['public']['Tables']['prompts']['Row']
export type PromptVariable = Database['public']['Tables']['prompt_variables']['Row']
export type PromptExample = Database['public']['Tables']['prompt_examples']['Row']
export type PromptVote = Database['public']['Tables']['prompt_votes']['Row']
export type PromptVariant = Database['public']['Tables']['prompt_variants']['Row']
export type UserPreferences = Database['public']['Tables']['user_preferences']['Row']

// Insert types
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type CategoryInsert = Database['public']['Tables']['categories']['Insert']
export type PromptInsert = Database['public']['Tables']['prompts']['Insert']
export type PromptVariableInsert = Database['public']['Tables']['prompt_variables']['Insert']
export type PromptExampleInsert = Database['public']['Tables']['prompt_examples']['Insert']
export type PromptVoteInsert = Database['public']['Tables']['prompt_votes']['Insert']
export type PromptVariantInsert = Database['public']['Tables']['prompt_variants']['Insert']
export type UserPreferencesInsert = Database['public']['Tables']['user_preferences']['Insert']

// Update types
export type UserUpdate = Database['public']['Tables']['users']['Update']
export type CategoryUpdate = Database['public']['Tables']['categories']['Update']
export type PromptUpdate = Database['public']['Tables']['prompts']['Update']
export type PromptVariableUpdate = Database['public']['Tables']['prompt_variables']['Update']
export type PromptExampleUpdate = Database['public']['Tables']['prompt_examples']['Update']
export type PromptVoteUpdate = Database['public']['Tables']['prompt_votes']['Update']
export type PromptVariantUpdate = Database['public']['Tables']['prompt_variants']['Update']
export type UserPreferencesUpdate = Database['public']['Tables']['user_preferences']['Update']

// Extended types with relations
export type PromptWithCategory = Prompt & {
  category: Category | null
}

export type PromptWithDetails = Prompt & {
  category: Category | null
  variables: PromptVariable[]
  examples: PromptExample[]
  variants: PromptVariant[]
}

// Variant type for form/UI usage
export type VariantType = 'basic' | 'advanced' | 'custom'

export type PromptCardData = {
  id: string
  title: string
  category_name: string | null
  tags: string[]
  rating_score: number
  vote_count: number
  last_verified_at: string
  is_flagged: boolean
  model_version: string | null
}

// Variable form state
export type VariableFormState = Record<string, string>

// Vote outcome type
export type VoteOutcome = 'positive' | 'negative'

// --- New types for Atlas rework ---

export type SkillFormat = 'claude_code_skill' | 'system_prompt' | 'custom'
export type McpServerType = 'stdio' | 'sse' | 'http' | 'websocket'
export type EntityType = 'skill' | 'mcp' | 'prompt'

export interface Skill {
  id: string
  title: string
  slug: string
  description: string | null
  content: string | null
  raw_file: string | null
  format: SkillFormat
  category_id: string | null
  tags: string[]
  install_command: string | null
  source_url: string | null
  created_by: string
  is_published: boolean
  is_flagged: boolean
  rating_score: number
  vote_count: number
  created_at: string
  updated_at: string
}

export interface SkillInsert {
  title: string
  slug: string
  description?: string | null
  content?: string | null
  raw_file?: string | null
  format?: SkillFormat
  category_id?: string | null
  tags?: string[]
  install_command?: string | null
  source_url?: string | null
  created_by: string
  is_published?: boolean
}

export interface Mcp {
  id: string
  title: string
  slug: string
  description: string | null
  content: string | null
  config_json: Record<string, unknown> | null
  server_type: McpServerType
  category_id: string | null
  tags: string[]
  source_url: string | null
  created_by: string
  is_published: boolean
  is_flagged: boolean
  rating_score: number
  vote_count: number
  created_at: string
  updated_at: string
}

export interface McpInsert {
  title: string
  slug: string
  description?: string | null
  content?: string | null
  config_json?: Record<string, unknown> | null
  server_type?: McpServerType
  category_id?: string | null
  tags?: string[]
  source_url?: string | null
  created_by: string
  is_published?: boolean
}

export interface Vote {
  id: string
  entity_type: EntityType
  entity_id: string
  user_id: string
  outcome: 'positive' | 'negative'
  feedback: string | null
  created_at: string
}

export interface SkillPrompt {
  id: string
  skill_id: string
  prompt_id: string
  relationship: string
  order_index: number
}

export interface SkillMcp {
  id: string
  skill_id: string
  mcp_id: string
  relationship: string
}

export type SkillWithCategory = Skill & {
  category: Category | null
}

export type SkillWithDetails = Skill & {
  category: Category | null
  linked_prompts: (SkillPrompt & { prompt: Prompt })[]
  linked_mcps: (SkillMcp & { mcp: Mcp })[]
  author: Pick<User, 'id' | 'name' | 'email'>
}

export type McpWithCategory = Mcp & {
  category: Category | null
}

export type McpWithDetails = Mcp & {
  category: Category | null
  linked_skills: (SkillMcp & { skill: Skill })[]
  author: Pick<User, 'id' | 'name' | 'email'>
}

export interface SkillCardData {
  id: string
  title: string
  slug: string
  description: string | null
  format: string
  category_name: string | null
  tags: string[]
  rating_score: number
  vote_count: number
  author_name: string | null
  created_at: string
  is_flagged: boolean
}

export interface McpCardData {
  id: string
  title: string
  slug: string
  description: string | null
  server_type: string
  category_name: string | null
  tags: string[]
  rating_score: number
  vote_count: number
  author_name: string | null
  created_at: string
  is_flagged: boolean
}

// Re-export database type
export type { Database }
