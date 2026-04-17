import { NextResponse } from 'next/server'

import { z } from 'zod'

import { requireOwnerOrAdmin } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

const linkSchema = z.object({
  type: z.enum(['prompt', 'mcp']),
  id: z.string().uuid(),
  relationship: z.string().max(200).optional(),
})

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const supabase = await createClient()

    // Fetch skill to check ownership
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: skill, error: fetchError } = await (supabase.from('skills') as any)
      .select('id, created_by')
      .eq('slug', slug)
      .single()

    if (fetchError || !skill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 })
    }

    // Check ownership or admin
    const authResult = await requireOwnerOrAdmin(skill.created_by)
    if (!authResult.success) {
      return authResult.response
    }

    // Parse and validate request body
    const body = await request.json()
    const result = linkSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: result.error.issues },
        { status: 400 }
      )
    }

    const { type, id, relationship } = result.data

    if (type === 'prompt') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: insertError } = await (supabase.from('skill_prompts') as any).insert({
        skill_id: skill.id,
        prompt_id: id,
        relationship: relationship || null,
      })

      if (insertError) {
        console.error('Skill-prompt link error:', insertError)
        return NextResponse.json({ error: 'Failed to link prompt to skill' }, { status: 500 })
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: insertError } = await (supabase.from('skill_mcps') as any).insert({
        skill_id: skill.id,
        mcp_id: id,
        relationship: relationship || null,
      })

      if (insertError) {
        console.error('Skill-MCP link error:', insertError)
        return NextResponse.json({ error: 'Failed to link MCP to skill' }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Skill link API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
