export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          role: 'admin' | 'user'
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          role?: 'admin' | 'user'
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          role?: 'admin' | 'user'
          created_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
        }
      }
      prompts: {
        Row: {
          id: string
          category_id: string | null
          title: string
          content: string
          tags: string[]
          data_requirements: string | null
          review_checklist: string | null
          model_version: string | null
          last_verified_at: string
          rating_score: number
          vote_count: number
          is_flagged: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id?: string | null
          title: string
          content: string
          tags?: string[]
          data_requirements?: string | null
          review_checklist?: string | null
          model_version?: string | null
          last_verified_at?: string
          rating_score?: number
          vote_count?: number
          is_flagged?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category_id?: string | null
          title?: string
          content?: string
          tags?: string[]
          data_requirements?: string | null
          review_checklist?: string | null
          model_version?: string | null
          last_verified_at?: string
          rating_score?: number
          vote_count?: number
          is_flagged?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      prompt_variables: {
        Row: {
          id: string
          prompt_id: string
          key: string
          label: string
          type: 'text' | 'textarea' | 'select'
          options: Json
          is_required: boolean
          placeholder: string | null
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          prompt_id: string
          key: string
          label: string
          type: 'text' | 'textarea' | 'select'
          options?: Json
          is_required?: boolean
          placeholder?: string | null
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          prompt_id?: string
          key?: string
          label?: string
          type?: 'text' | 'textarea' | 'select'
          options?: Json
          is_required?: boolean
          placeholder?: string | null
          order_index?: number
          created_at?: string
        }
      }
      prompt_examples: {
        Row: {
          id: string
          prompt_id: string
          weak_version: string | null
          strong_version: string | null
          weak_output: string | null
          strong_output: string | null
          created_at: string
        }
        Insert: {
          id?: string
          prompt_id: string
          weak_version?: string | null
          strong_version?: string | null
          weak_output?: string | null
          strong_output?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          prompt_id?: string
          weak_version?: string | null
          strong_version?: string | null
          weak_output?: string | null
          strong_output?: string | null
          created_at?: string
        }
      }
      prompt_votes: {
        Row: {
          id: string
          prompt_id: string
          user_id: string
          outcome: 'positive' | 'negative'
          feedback: string | null
          created_at: string
        }
        Insert: {
          id?: string
          prompt_id: string
          user_id: string
          outcome: 'positive' | 'negative'
          feedback?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          prompt_id?: string
          user_id?: string
          outcome?: 'positive' | 'negative'
          feedback?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      prompts_needing_review: {
        Row: {
          id: string
          category_id: string | null
          title: string
          content: string
          tags: string[]
          data_requirements: string | null
          review_checklist: string | null
          model_version: string | null
          last_verified_at: string
          rating_score: number
          vote_count: number
          is_flagged: boolean
          created_by: string | null
          created_at: string
          updated_at: string
          category_name: string | null
        }
      }
    }
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
