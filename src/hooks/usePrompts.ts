'use client'

import { useState, useEffect } from 'react'

import { createClient } from '@/lib/supabase/client'
import type { PromptWithCategory, PromptWithDetails } from '@/types'

export function usePrompts(categoryId?: string) {
  const [prompts, setPrompts] = useState<PromptWithCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPrompts() {
      setLoading(true)
      setError(null)

      const supabase = createClient()

      let query = supabase
        .from('prompts')
        .select(
          `
          *,
          category:categories(*)
        `
        )
        .order('last_verified_at', { ascending: false })

      if (categoryId) {
        query = query.eq('category_id', categoryId)
      }

      const { data, error: fetchError } = await query

      if (fetchError) {
        setError(fetchError.message)
        setPrompts([])
      } else {
        setPrompts(data || [])
      }

      setLoading(false)
    }

    fetchPrompts()
  }, [categoryId])

  return { prompts, loading, error }
}

export function usePrompt(id: string) {
  const [prompt, setPrompt] = useState<PromptWithDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPrompt() {
      setLoading(true)
      setError(null)

      const supabase = createClient()

      const { data, error: fetchError } = await supabase
        .from('prompts')
        .select(
          `
          *,
          category:categories(*),
          variables:prompt_variables(*),
          examples:prompt_examples(*)
        `
        )
        .eq('id', id)
        .single()

      if (fetchError) {
        setError(fetchError.message)
        setPrompt(null)
      } else {
        setPrompt(data)
      }

      setLoading(false)
    }

    if (id) {
      fetchPrompt()
    }
  }, [id])

  return { prompt, loading, error }
}
