import { NextResponse } from 'next/server'

import { requireAdmin } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const authResult = await requireAdmin()
    if (!authResult.success) {
      return authResult.response
    }

    const supabase = await createClient()

    // Fetch unpublished skills
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: skills, error: skillsError } = await (supabase.from('skills') as any)
      .select('id, title, slug, description, created_at, created_by')
      .eq('is_published', false)
      .order('created_at', { ascending: false })

    if (skillsError) {
      console.error('Pending skills fetch error:', skillsError)
      return NextResponse.json({ error: 'Failed to fetch pending skills' }, { status: 500 })
    }

    // Fetch unpublished MCPs
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: mcps, error: mcpsError } = await (supabase.from('mcps') as any)
      .select('id, title, slug, description, created_at, created_by')
      .eq('is_published', false)
      .order('created_at', { ascending: false })

    if (mcpsError) {
      console.error('Pending MCPs fetch error:', mcpsError)
      return NextResponse.json({ error: 'Failed to fetch pending MCPs' }, { status: 500 })
    }

    return NextResponse.json({
      pending: {
        skills: skills || [],
        mcps: mcps || [],
      },
    })
  } catch (error) {
    console.error('Admin pending API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
