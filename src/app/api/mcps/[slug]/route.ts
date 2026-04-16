import { type NextRequest, NextResponse } from 'next/server'

import { z } from 'zod'

import { requireOwnerOrAdmin } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

// GET /api/mcps/[slug] - Fetch MCP detail
export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const supabase = await createClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: mcp, error } = await (supabase.from('mcps') as any)
      .select(
        `
        *,
        category:categories(*),
        author:users!mcps_created_by_fkey(id, name, email),
        skill_mcps(*, skill:skills(id, title, slug, description))
      `
      )
      .eq('slug', slug)
      .single()

    if (error || !mcp) {
      console.error('MCP fetch error:', error)
      return NextResponse.json({ error: 'MCP not found' }, { status: 404 })
    }

    return NextResponse.json({ mcp })
  } catch (error) {
    console.error('MCP detail API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

const updateMcpSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional().nullable(),
  content: z.string().max(50000).optional().nullable(),
  config_json: z.record(z.unknown()).optional().nullable(),
  server_type: z.enum(['stdio', 'sse', 'http', 'websocket']).optional().nullable(),
  category_id: z.string().uuid().optional().nullable(),
  tags: z.array(z.string().max(50)).max(20).optional(),
  source_url: z.string().url().max(2000).optional().nullable(),
  is_published: z.boolean().optional(),
})

// PATCH /api/mcps/[slug] - Update an MCP
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const supabase = await createClient()

    // Fetch MCP first to check ownership
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: existingMcp, error: fetchError } = await (supabase.from('mcps') as any)
      .select('id, created_by')
      .eq('slug', slug)
      .single()

    if (fetchError || !existingMcp) {
      return NextResponse.json({ error: 'MCP not found' }, { status: 404 })
    }

    // Check ownership or admin
    const authResult = await requireOwnerOrAdmin(existingMcp.created_by)
    if (!authResult.success) {
      return authResult.response
    }

    // Parse and validate request body
    const body = await request.json()
    const result = updateMcpSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: result.error.issues },
        { status: 400 }
      )
    }

    const data = result.data

    // Update MCP
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: mcp, error: updateError } = await (supabase.from('mcps') as any)
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('slug', slug)
      .select()
      .single()

    if (updateError || !mcp) {
      console.error('MCP update error:', updateError)
      return NextResponse.json({ error: 'Failed to update MCP' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      mcp,
    })
  } catch (error) {
    console.error('Update MCP API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/mcps/[slug] - Delete an MCP
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const supabase = await createClient()

    // Fetch MCP first to check ownership
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: existingMcp, error: fetchError } = await (supabase.from('mcps') as any)
      .select('id, created_by')
      .eq('slug', slug)
      .single()

    if (fetchError || !existingMcp) {
      return NextResponse.json({ error: 'MCP not found' }, { status: 404 })
    }

    // Check ownership or admin
    const authResult = await requireOwnerOrAdmin(existingMcp.created_by)
    if (!authResult.success) {
      return authResult.response
    }

    // Delete MCP
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: deleteError } = await (supabase.from('mcps') as any).delete().eq('slug', slug)

    if (deleteError) {
      console.error('MCP delete error:', deleteError)
      return NextResponse.json({ error: 'Failed to delete MCP' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error('Delete MCP API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
