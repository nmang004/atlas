import { type NextRequest, NextResponse } from 'next/server'

import { z } from 'zod'

import { requireAdmin } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

const variableSchema = z.object({
  id: z.string().uuid().optional(),
  key: z.string().min(1).max(50),
  label: z.string().min(1).max(100),
  type: z.enum(['text', 'textarea', 'select']),
  placeholder: z.string().max(200).optional().nullable(),
  is_required: z.boolean().default(false),
  options: z.array(z.string().max(100)).max(50).default([]),
  order_index: z.number().int().min(0).max(100).default(0),
})

const variantSchema = z.object({
  id: z.string().uuid().optional(),
  variant_type: z.enum(['basic', 'advanced', 'custom']),
  name: z.string().min(1).max(100),
  content: z.string().min(1).max(50000),
  description: z.string().max(500).optional().nullable(),
  order_index: z.number().int().min(0).max(10).default(0),
})

const updatePromptSchema = z.object({
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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check admin access (returns 401 for unauthenticated, 403 for non-admin)
    const authResult = await requireAdmin()
    if (!authResult.success) {
      return authResult.response
    }

    const supabase = createClient()
    const promptId = params.id

    // Check if prompt exists
    const { data: existingPrompt, error: fetchError } = await supabase
      .from('prompts')
      .select('id')
      .eq('id', promptId)
      .single()

    if (fetchError || !existingPrompt) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 })
    }

    // Parse and validate request body
    const body = await request.json()
    const result = updatePromptSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: result.error.issues },
        { status: 400 }
      )
    }

    const { variables, variants, ...promptData } = result.data

    // Update prompt
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: prompt, error: updateError } = await (supabase.from('prompts') as any)
      .update({
        ...promptData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', promptId)
      .select()
      .single()

    if (updateError || !prompt) {
      console.error('Prompt update error:', updateError)
      return NextResponse.json({ error: 'Failed to update prompt' }, { status: 500 })
    }

    // Handle variables: delete existing and insert new ones
    // This is simpler than trying to diff and update individual variables
    await supabase.from('prompt_variables').delete().eq('prompt_id', promptId)

    if (variables.length > 0) {
      const variablesToInsert = variables.map((v, idx) => ({
        prompt_id: promptId,
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
        console.error('Variables update error:', variablesError)
      }
    }

    // Handle variants: delete existing and insert new ones
    await supabase.from('prompt_variants').delete().eq('prompt_id', promptId)

    if (variants.length > 0) {
      const variantsToInsert = variants.map((v, idx) => ({
        prompt_id: promptId,
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
        console.error('Variants update error:', variantsError)
      }
    }

    return NextResponse.json({
      success: true,
      prompt,
    })
  } catch (error) {
    console.error('Update prompt API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check admin access (returns 401 for unauthenticated, 403 for non-admin)
    const authResult = await requireAdmin()
    if (!authResult.success) {
      return authResult.response
    }

    const supabase = createClient()
    const promptId = params.id

    // Delete prompt (cascade will delete variables, examples, votes)
    const { error: deleteError } = await supabase.from('prompts').delete().eq('id', promptId)

    if (deleteError) {
      console.error('Prompt delete error:', deleteError)
      return NextResponse.json({ error: 'Failed to delete prompt' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error('Delete prompt API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
