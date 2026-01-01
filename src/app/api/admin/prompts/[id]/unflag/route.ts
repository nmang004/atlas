import { type NextRequest, NextResponse } from 'next/server'

import { z } from 'zod'

import { requireAdmin } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

// Validate prompt ID parameter
const paramsSchema = z.object({
  id: z.string().uuid(),
})

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Validate prompt ID
    const paramsResult = paramsSchema.safeParse(params)
    if (!paramsResult.success) {
      return NextResponse.json({ error: 'Invalid prompt ID' }, { status: 400 })
    }

    // Check admin access (returns 401 for unauthenticated, 403 for non-admin)
    const authResult = await requireAdmin()
    if (!authResult.success) {
      return authResult.response
    }

    const supabase = createClient()
    const promptId = paramsResult.data.id

    // Unflag the prompt
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: updateError } = await (supabase.from('prompts') as any)
      .update({ is_flagged: false })
      .eq('id', promptId)

    if (updateError) {
      console.error('Unflag error:', updateError)
      return NextResponse.json({ error: 'Failed to unflag prompt' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error('Unflag API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
