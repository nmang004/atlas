import { NextResponse } from 'next/server'

import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabaseAny = supabase as any

    // Fetch all user data in parallel
    const [
      { data: userProfile },
      { data: votes },
      { data: preferences },
      { data: createdPrompts },
    ] = await Promise.all([
      supabase.from('users').select('id, email, name, role, created_at').eq('id', user.id).single(),
      supabase
        .from('prompt_votes')
        .select('id, outcome, feedback, created_at, prompt:prompts(id, title)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }),
      supabaseAny.from('user_preferences').select('*').eq('user_id', user.id).single(),
      supabase
        .from('prompts')
        .select('id, title, created_at')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false }),
    ])

    const exportData = {
      exportedAt: new Date().toISOString(),
      profile: userProfile,
      preferences: preferences || null,
      votingHistory: votes || [],
      createdPrompts: createdPrompts || [],
    }

    const dateStr = new Date().toISOString().split('T')[0]
    const filename = `atlas-export-${dateStr}.json`

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('Export API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
