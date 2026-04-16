import { NextResponse } from 'next/server'

import { requireAdmin } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

const ENTITY_TABLE_MAP: Record<string, string> = {
  skill: 'skills',
  mcp: 'mcps',
  prompt: 'prompts',
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ entityType: string; id: string }> }
) {
  try {
    const { entityType, id } = await params

    const tableName = ENTITY_TABLE_MAP[entityType]
    if (!tableName) {
      return NextResponse.json(
        { error: 'Invalid entity type. Must be skill, mcp, or prompt.' },
        { status: 400 }
      )
    }

    const authResult = await requireAdmin()
    if (!authResult.success) {
      return authResult.response
    }

    const supabase = await createClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: updateError } = await (supabase.from(tableName) as any)
      .update({
        is_published: true,
        is_flagged: false,
      })
      .eq('id', id)

    if (updateError) {
      console.error(`Publish ${entityType} error:`, updateError)
      return NextResponse.json({ error: `Failed to publish ${entityType}` }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin publish API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
