import { type NextRequest, NextResponse } from 'next/server'

import { z } from 'zod'

import { requireAdmin } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

const variableSchema = z.object({
  key: z.string().min(1).max(50),
  label: z.string().min(1).max(100),
  type: z.enum(['text', 'textarea', 'select']),
  placeholder: z.string().max(200).optional().nullable(),
  is_required: z.boolean().default(false),
  options: z.array(z.string().max(100)).max(50).default([]),
  order_index: z.number().int().min(0).max(100).default(0),
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

    const { variables, ...promptData } = result.data

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

    return NextResponse.json({
      success: true,
      prompt,
    })
  } catch (error) {
    console.error('Create prompt API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
