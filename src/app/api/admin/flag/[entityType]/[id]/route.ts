import { NextResponse } from 'next/server'

import { requireAdmin } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ entityType: string; id: string }> }
) {
  try {
    const { entityType, id } = await params

    if (entityType !== 'skill' && entityType !== 'mcp' && entityType !== 'prompt') {
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

    let updateError
    if (entityType === 'skill') {
      ;({ error: updateError } = await supabase
        .from('skills')
        .update({ is_flagged: true })
        .eq('id', id))
    } else if (entityType === 'mcp') {
      ;({ error: updateError } = await supabase
        .from('mcps')
        .update({ is_flagged: true })
        .eq('id', id))
    } else {
      ;({ error: updateError } = await supabase
        .from('prompts')
        .update({ is_flagged: true })
        .eq('id', id))
    }

    if (updateError) {
      console.error(`Flag ${entityType} error:`, updateError)
      return NextResponse.json({ error: `Failed to flag ${entityType}` }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin flag API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
