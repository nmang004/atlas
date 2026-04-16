export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.1'
  }
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          entity_type: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          entity_type?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          entity_type?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      feedback: {
        Row: {
          created_at: string | null
          id: string
          message: string
          type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          type?: string
        }
        Relationships: []
      }
      mcps: {
        Row: {
          category_id: string | null
          config_json: Json | null
          content: string | null
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          is_flagged: boolean | null
          is_published: boolean | null
          rating_score: number | null
          server_type: string | null
          slug: string
          source_url: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          vote_count: number | null
        }
        Insert: {
          category_id?: string | null
          config_json?: Json | null
          content?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          is_flagged?: boolean | null
          is_published?: boolean | null
          rating_score?: number | null
          server_type?: string | null
          slug: string
          source_url?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          vote_count?: number | null
        }
        Update: {
          category_id?: string | null
          config_json?: Json | null
          content?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          is_flagged?: boolean | null
          is_published?: boolean | null
          rating_score?: number | null
          server_type?: string | null
          slug?: string
          source_url?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          vote_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'mcps_category_id_fkey'
            columns: ['category_id']
            isOneToOne: false
            referencedRelation: 'categories'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'mcps_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      prompt_examples: {
        Row: {
          created_at: string | null
          id: string
          prompt_id: string
          strong_output: string | null
          strong_version: string | null
          weak_output: string | null
          weak_version: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          prompt_id: string
          strong_output?: string | null
          strong_version?: string | null
          weak_output?: string | null
          weak_version?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          prompt_id?: string
          strong_output?: string | null
          strong_version?: string | null
          weak_output?: string | null
          weak_version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'prompt_examples_prompt_id_fkey'
            columns: ['prompt_id']
            isOneToOne: false
            referencedRelation: 'prompts'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'prompt_examples_prompt_id_fkey'
            columns: ['prompt_id']
            isOneToOne: false
            referencedRelation: 'prompts_needing_review'
            referencedColumns: ['id']
          },
        ]
      }
      prompt_variables: {
        Row: {
          created_at: string | null
          id: string
          is_required: boolean | null
          key: string
          label: string
          options: Json | null
          order_index: number | null
          placeholder: string | null
          prompt_id: string
          type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_required?: boolean | null
          key: string
          label: string
          options?: Json | null
          order_index?: number | null
          placeholder?: string | null
          prompt_id: string
          type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_required?: boolean | null
          key?: string
          label?: string
          options?: Json | null
          order_index?: number | null
          placeholder?: string | null
          prompt_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: 'prompt_variables_prompt_id_fkey'
            columns: ['prompt_id']
            isOneToOne: false
            referencedRelation: 'prompts'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'prompt_variables_prompt_id_fkey'
            columns: ['prompt_id']
            isOneToOne: false
            referencedRelation: 'prompts_needing_review'
            referencedColumns: ['id']
          },
        ]
      }
      prompt_variants: {
        Row: {
          content: string
          created_at: string | null
          description: string | null
          id: string
          name: string
          order_index: number | null
          prompt_id: string
          updated_at: string | null
          variant_type: string
        }
        Insert: {
          content: string
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          order_index?: number | null
          prompt_id: string
          updated_at?: string | null
          variant_type: string
        }
        Update: {
          content?: string
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          order_index?: number | null
          prompt_id?: string
          updated_at?: string | null
          variant_type?: string
        }
        Relationships: [
          {
            foreignKeyName: 'prompt_variants_prompt_id_fkey'
            columns: ['prompt_id']
            isOneToOne: false
            referencedRelation: 'prompts'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'prompt_variants_prompt_id_fkey'
            columns: ['prompt_id']
            isOneToOne: false
            referencedRelation: 'prompts_needing_review'
            referencedColumns: ['id']
          },
        ]
      }
      prompt_votes: {
        Row: {
          created_at: string | null
          feedback: string | null
          id: string
          outcome: string
          prompt_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          feedback?: string | null
          id?: string
          outcome: string
          prompt_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          feedback?: string | null
          id?: string
          outcome?: string
          prompt_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'prompt_votes_prompt_id_fkey'
            columns: ['prompt_id']
            isOneToOne: false
            referencedRelation: 'prompts'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'prompt_votes_prompt_id_fkey'
            columns: ['prompt_id']
            isOneToOne: false
            referencedRelation: 'prompts_needing_review'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'prompt_votes_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      prompts: {
        Row: {
          category_id: string | null
          content: string
          created_at: string | null
          created_by: string | null
          data_requirements: string | null
          id: string
          is_flagged: boolean | null
          last_verified_at: string | null
          model_version: string | null
          rating_score: number | null
          review_checklist: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          vote_count: number | null
        }
        Insert: {
          category_id?: string | null
          content: string
          created_at?: string | null
          created_by?: string | null
          data_requirements?: string | null
          id?: string
          is_flagged?: boolean | null
          last_verified_at?: string | null
          model_version?: string | null
          rating_score?: number | null
          review_checklist?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          vote_count?: number | null
        }
        Update: {
          category_id?: string | null
          content?: string
          created_at?: string | null
          created_by?: string | null
          data_requirements?: string | null
          id?: string
          is_flagged?: boolean | null
          last_verified_at?: string | null
          model_version?: string | null
          rating_score?: number | null
          review_checklist?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          vote_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'prompts_category_id_fkey'
            columns: ['category_id']
            isOneToOne: false
            referencedRelation: 'categories'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'prompts_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      skill_mcps: {
        Row: {
          id: string
          mcp_id: string
          relationship: string | null
          skill_id: string
        }
        Insert: {
          id?: string
          mcp_id: string
          relationship?: string | null
          skill_id: string
        }
        Update: {
          id?: string
          mcp_id?: string
          relationship?: string | null
          skill_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'skill_mcps_mcp_id_fkey'
            columns: ['mcp_id']
            isOneToOne: false
            referencedRelation: 'mcps'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'skill_mcps_skill_id_fkey'
            columns: ['skill_id']
            isOneToOne: false
            referencedRelation: 'skills'
            referencedColumns: ['id']
          },
        ]
      }
      skill_prompts: {
        Row: {
          id: string
          order_index: number | null
          prompt_id: string
          relationship: string | null
          skill_id: string
        }
        Insert: {
          id?: string
          order_index?: number | null
          prompt_id: string
          relationship?: string | null
          skill_id: string
        }
        Update: {
          id?: string
          order_index?: number | null
          prompt_id?: string
          relationship?: string | null
          skill_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'skill_prompts_prompt_id_fkey'
            columns: ['prompt_id']
            isOneToOne: false
            referencedRelation: 'prompts'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'skill_prompts_prompt_id_fkey'
            columns: ['prompt_id']
            isOneToOne: false
            referencedRelation: 'prompts_needing_review'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'skill_prompts_skill_id_fkey'
            columns: ['skill_id']
            isOneToOne: false
            referencedRelation: 'skills'
            referencedColumns: ['id']
          },
        ]
      }
      skills: {
        Row: {
          category_id: string | null
          content: string | null
          created_at: string | null
          created_by: string
          description: string | null
          format: string
          id: string
          install_command: string | null
          is_flagged: boolean | null
          is_published: boolean | null
          rating_score: number | null
          raw_file: string | null
          slug: string
          source_url: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          vote_count: number | null
        }
        Insert: {
          category_id?: string | null
          content?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          format?: string
          id?: string
          install_command?: string | null
          is_flagged?: boolean | null
          is_published?: boolean | null
          rating_score?: number | null
          raw_file?: string | null
          slug: string
          source_url?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          vote_count?: number | null
        }
        Update: {
          category_id?: string | null
          content?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          format?: string
          id?: string
          install_command?: string | null
          is_flagged?: boolean | null
          is_published?: boolean | null
          rating_score?: number | null
          raw_file?: string | null
          slug?: string
          source_url?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          vote_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'skills_category_id_fkey'
            columns: ['category_id']
            isOneToOne: false
            referencedRelation: 'categories'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'skills_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      user_preferences: {
        Row: {
          created_at: string | null
          default_copy_with_placeholders: boolean | null
          id: string
          notify_prompt_flagged: boolean | null
          notify_voted_prompt_updated: boolean | null
          notify_weekly_digest: boolean | null
          preferred_model: string | null
          theme: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          default_copy_with_placeholders?: boolean | null
          id?: string
          notify_prompt_flagged?: boolean | null
          notify_voted_prompt_updated?: boolean | null
          notify_weekly_digest?: boolean | null
          preferred_model?: string | null
          theme?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          default_copy_with_placeholders?: boolean | null
          id?: string
          notify_prompt_flagged?: boolean | null
          notify_voted_prompt_updated?: boolean | null
          notify_weekly_digest?: boolean | null
          preferred_model?: string | null
          theme?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'user_preferences_user_id_fkey'
            columns: ['user_id']
            isOneToOne: true
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string | null
          role: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          name?: string | null
          role?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string | null
          role?: string | null
        }
        Relationships: []
      }
      vote_rate_limits: {
        Row: {
          id: string
          user_id: string
          vote_count: number
          window_start: string
        }
        Insert: {
          id?: string
          user_id: string
          vote_count?: number
          window_start?: string
        }
        Update: {
          id?: string
          user_id?: string
          vote_count?: number
          window_start?: string
        }
        Relationships: [
          {
            foreignKeyName: 'vote_rate_limits_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      votes: {
        Row: {
          created_at: string | null
          entity_id: string
          entity_type: string
          feedback: string | null
          id: string
          outcome: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          entity_id: string
          entity_type: string
          feedback?: string | null
          id?: string
          outcome: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          feedback?: string | null
          id?: string
          outcome?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'votes_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      prompts_needing_review: {
        Row: {
          category_id: string | null
          category_name: string | null
          content: string | null
          created_at: string | null
          created_by: string | null
          data_requirements: string | null
          id: string | null
          is_flagged: boolean | null
          last_verified_at: string | null
          model_version: string | null
          rating_score: number | null
          review_checklist: string | null
          tags: string[] | null
          title: string | null
          updated_at: string | null
          vote_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'prompts_category_id_fkey'
            columns: ['category_id']
            isOneToOne: false
            referencedRelation: 'categories'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'prompts_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Functions: {
      check_vote_rate_limit: { Args: { p_user_id: string }; Returns: boolean }
      cleanup_old_rate_limits: { Args: never; Returns: undefined }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
