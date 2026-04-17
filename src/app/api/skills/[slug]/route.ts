import { type NextRequest, NextResponse } from 'next/server'

import { z } from 'zod'

import { requireOwnerOrAdmin } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

// GET /api/skills/[slug] - Fetch skill detail
export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const supabase = await createClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: skill, error } = await (supabase.from('skills') as any)
      .select(
        `
        *,
        category:categories(*),
        author:users!skills_created_by_fkey(id, name, email),
        skill_prompts(*, prompt:prompts(*)),
        skill_mcps(*, mcp:mcps(id, title, slug, description))
      `
      )
      .eq('slug', slug)
      .single()

    if (error || !skill) {
      console.error('Skill fetch error:', error)
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 })
    }

    return NextResponse.json({ skill })
  } catch (error) {
    console.error('Skill detail API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

const updateSkillSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional().nullable(),
  content: z.string().max(50000).optional().nullable(),
  raw_file: z.string().max(100000).optional().nullable(),
  format: z.enum(['markdown', 'yaml', 'json', 'text', 'xml']).optional().nullable(),
  category_id: z.string().uuid().optional().nullable(),
  tags: z.array(z.string().max(50)).max(20).optional(),
  source_url: z.string().url().max(2000).optional().nullable(),
  is_published: z.boolean().optional(),
})

// PATCH /api/skills/[slug] - Update a skill
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const supabase = await createClient()

    // Fetch skill first to check ownership
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: existingSkill, error: fetchError } = await (supabase.from('skills') as any)
      .select('id, created_by')
      .eq('slug', slug)
      .single()

    if (fetchError || !existingSkill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 })
    }

    // Check ownership or admin
    const authResult = await requireOwnerOrAdmin(existingSkill.created_by)
    if (!authResult.success) {
      return authResult.response
    }

    // Parse and validate request body
    const body = await request.json()
    const result = updateSkillSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: result.error.issues },
        { status: 400 }
      )
    }

    const data = result.data

    // Update skill
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: skill, error: updateError } = await (supabase.from('skills') as any)
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('slug', slug)
      .select()
      .single()

    if (updateError || !skill) {
      console.error('Skill update error:', updateError)
      return NextResponse.json({ error: 'Failed to update skill' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      skill,
    })
  } catch (error) {
    console.error('Update skill API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/skills/[slug] - Delete a skill
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const supabase = await createClient()

    // Fetch skill first to check ownership
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: existingSkill, error: fetchError } = await (supabase.from('skills') as any)
      .select('id, created_by')
      .eq('slug', slug)
      .single()

    if (fetchError || !existingSkill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 })
    }

    // Check ownership or admin
    const authResult = await requireOwnerOrAdmin(existingSkill.created_by)
    if (!authResult.success) {
      return authResult.response
    }

    // Delete skill
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: deleteError } = await (supabase.from('skills') as any).delete().eq('slug', slug)

    if (deleteError) {
      console.error('Skill delete error:', deleteError)
      return NextResponse.json({ error: 'Failed to delete skill' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error('Delete skill API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
