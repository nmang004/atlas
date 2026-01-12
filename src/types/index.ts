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

// Re-export database type
export type { Database }
