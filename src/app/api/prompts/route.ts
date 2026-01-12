import { type NextRequest, NextResponse } from 'next/server'

import { z } from 'zod'

import { requireAdmin } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

// Pagination constants
const DEFAULT_PAGE_SIZE = 12
const MAX_PAGE_SIZE = 50

// GET /api/prompts - Fetch paginated prompts
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)

    // Parse pagination params
    const cursor = searchParams.get('cursor') // last_verified_at of last item
    const limit = Math.min(
      parseInt(searchParams.get('limit') || String(DEFAULT_PAGE_SIZE), 10),
      MAX_PAGE_SIZE
    )
    const categoryId = searchParams.get('category')
    const search = searchParams.get('search')

    // Build query
    let query = supabase
      .from('prompts')
      .select(
        `
        id,
        title,
        content,
        tags,
        rating_score,
        vote_count,
        last_verified_at,
        is_flagged,
        model_version,
        category_id,
        category:categories(name)
      `
      )
      .order('last_verified_at', { ascending: false })
      .limit(limit + 1) // Fetch one extra to check if there are more

    // Apply cursor-based pagination
    if (cursor) {
      query = query.lt('last_verified_at', cursor)
    }

    // Apply category filter
    if (categoryId) {
      query = query.eq('category_id', categoryId)
    }

    // Apply search filter (case-insensitive)
    if (search?.trim()) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error('Prompts fetch error:', error)
      return NextResponse.json({ error: 'Failed to fetch prompts' }, { status: 500 })
    }

    interface PromptRow {
      id: string
      title: string
      content: string
      tags: string[] | null
      rating_score: number
      vote_count: number
      last_verified_at: string
      is_flagged: boolean
      model_version: string | null
      category_id: string | null
      category: { name: string } | null
    }

    const prompts = (data as unknown as PromptRow[]) || []

    // Check if there are more items
    const hasMore = prompts.length > limit
    const items = hasMore ? prompts.slice(0, limit) : prompts

    // Get the cursor for the next page
    const nextCursor = hasMore && items.length > 0 ? items[items.length - 1].last_verified_at : null

    return NextResponse.json({
      prompts: items.map((prompt) => ({
        id: prompt.id,
        title: prompt.title,
        content: prompt.content,
        category_id: prompt.category_id,
        category_name: prompt.category?.name || null,
        tags: prompt.tags || [],
        rating_score: prompt.rating_score,
        vote_count: prompt.vote_count,
        last_verified_at: prompt.last_verified_at,
        is_flagged: prompt.is_flagged,
        model_version: prompt.model_version,
      })),
      nextCursor,
      hasMore,
    })
  } catch (error) {
    console.error('Prompts API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

const variableSchema = z.object({
  key: z.string().min(1).max(50),
  label: z.string().min(1).max(100),
  type: z.enum(['text', 'textarea', 'select']),
  placeholder: z.string().max(200).optional().nullable(),
  is_required: z.boolean().default(false),
  options: z.array(z.string().max(100)).max(50).default([]),
  order_index: z.number().int().min(0).max(100).default(0),
})

const variantSchema = z.object({
  variant_type: z.enum(['basic', 'advanced', 'custom']),
  name: z.string().min(1).max(100),
  content: z.string().min(1).max(50000),
  description: z.string().max(500).optional().nullable(),
  order_index: z.number().int().min(0).max(10).default(0),
})

const createPromptSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(50000),
  category_id: z.string().uuid().optional().nullable(),
  tags: z.array(z.string().max(50)).max(20).default([]),
  model_version: z.string().max(50).optional().nullable(),
  data_requirements: z.string().max(10000).optional().nullable(),
  review_checklist: z.string().max(10000).optional().nullable(),
  variables: z.array(variableSchema).max(50).default([]),
  variants: z.array(variantSchema).max(5).default([]),
})

export async function POST(request: NextRequest) {
  try {
    // Check admin access (returns 401 for unauthenticated, 403 for non-admin)
    const authResult = await requireAdmin()
    if (!authResult.success) {
      return authResult.response
    }

    const user = authResult.user
    const supabase = createClient()

    // Parse and validate request body
    const body = await request.json()
    const result = createPromptSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: result.error.issues },
        { status: 400 }
      )
    }

    const { variables, variants, ...promptData } = result.data

    // Create prompt
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: prompt, error: promptError } = await (supabase.from('prompts') as any)
      .insert({
        ...promptData,
        created_by: user.id,
      })
      .select()
      .single()

    if (promptError || !prompt) {
      console.error('Prompt creation error:', promptError)
      return NextResponse.json({ error: 'Failed to create prompt' }, { status: 500 })
    }

    // Create variables if any
    if (variables.length > 0) {
      const variablesToInsert = variables.map((v, idx) => ({
        prompt_id: prompt.id,
        key: v.key,
        label: v.label,
        type: v.type,
        placeholder: v.placeholder || null,
        is_required: v.is_required,
        options: v.type === 'select' ? v.options : [],
        order_index: v.order_index ?? idx,
      }))

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: variablesError } = await (supabase.from('prompt_variables') as any).insert(
        variablesToInsert
      )

      if (variablesError) {
        console.error('Variables creation error:', variablesError)
        // Prompt was created, but variables failed - still return success
      }
    }

    // Create variants if any
    if (variants.length > 0) {
      const variantsToInsert = variants.map((v, idx) => ({
        prompt_id: prompt.id,
        variant_type: v.variant_type,
        name: v.name,
        content: v.content,
        description: v.description || null,
        order_index: v.order_index ?? idx,
      }))

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: variantsError } = await (supabase.from('prompt_variants') as any).insert(
        variantsToInsert
      )

      if (variantsError) {
        console.error('Variants creation error:', variantsError)
        // Prompt was created, but variants failed - still return success
      }
    }

    return NextResponse.json({
      success: true,
      prompt,
    })
  } catch (error) {
    console.error('Create prompt API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
