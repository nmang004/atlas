import { type NextRequest, NextResponse } from 'next/server'

import { createClient } from '@/lib/supabase/server'

const RESULTS_PER_TYPE = 10
const VALID_TYPES = ['skill', 'mcp', 'prompt'] as const

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')?.trim()
    const typesParam = searchParams.get('types')

    // If no query, return empty results
    if (!q) {
      return NextResponse.json({
        results: { skills: [], mcps: [], prompts: [] },
      })
    }

    // Parse which types to search
    const requestedTypes = typesParam
      ? typesParam
          .split(',')
          .map((t) => t.trim())
          .filter((t): t is (typeof VALID_TYPES)[number] =>
            VALID_TYPES.includes(t as (typeof VALID_TYPES)[number])
          )
      : [...VALID_TYPES]

    const supabase = await createClient()
    const searchPattern = `%${q}%`

    // Build queries in parallel
    const queries: Promise<{ type: string; data: unknown[] }>[] = []

    if (requestedTypes.includes('skill')) {
      queries.push(
        (async () => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { data, error } = await (supabase.from('skills') as any)
            .select('id, title, slug, description, tags, rating_score')
            .eq('is_published', true)
            .or(`title.ilike.${searchPattern},description.ilike.${searchPattern}`)
            .order('rating_score', { ascending: false, nullsFirst: false })
            .limit(RESULTS_PER_TYPE)

          if (error) {
            console.error('Search skills error:', error)
            return { type: 'skill', data: [] }
          }
          return { type: 'skill', data: data || [] }
        })()
      )
    }

    if (requestedTypes.includes('mcp')) {
      queries.push(
        (async () => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { data, error } = await (supabase.from('mcps') as any)
            .select('id, title, slug, description, tags, rating_score')
            .eq('is_published', true)
            .or(`title.ilike.${searchPattern},description.ilike.${searchPattern}`)
            .order('rating_score', { ascending: false, nullsFirst: false })
            .limit(RESULTS_PER_TYPE)

          if (error) {
            console.error('Search mcps error:', error)
            return { type: 'mcp', data: [] }
          }
          return { type: 'mcp', data: data || [] }
        })()
      )
    }

    if (requestedTypes.includes('prompt')) {
      queries.push(
        (async () => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { data, error } = await (supabase.from('prompts') as any)
            .select('id, title, slug, description, tags, rating_score')
            .eq('is_published', true)
            .or(`title.ilike.${searchPattern},content.ilike.${searchPattern}`)
            .order('rating_score', { ascending: false, nullsFirst: false })
            .limit(RESULTS_PER_TYPE)

          if (error) {
            console.error('Search prompts error:', error)
            return { type: 'prompt', data: [] }
          }
          return { type: 'prompt', data: data || [] }
        })()
      )
    }

    const results = await Promise.all(queries)

    const response: Record<string, unknown[]> = {
      skills: [],
      mcps: [],
      prompts: [],
    }

    for (const result of results) {
      const key = result.type === 'skill' ? 'skills' : result.type === 'mcp' ? 'mcps' : 'prompts'
      response[key] = result.data
    }

    return NextResponse.json({ results: response })
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
