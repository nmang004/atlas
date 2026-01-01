import { type NextRequest, NextResponse } from 'next/server'

import { z } from 'zod'

import { checkVoteRateLimit, requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

// Validate prompt ID parameter
const paramsSchema = z.object({
  id: z.string().uuid(),
})

const voteSchema = z.object({
  outcome: z.enum(['positive', 'negative']),
  feedback: z.string().max(2000).optional(),
})

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Validate prompt ID
    const paramsResult = paramsSchema.safeParse(params)
    if (!paramsResult.success) {
      return NextResponse.json({ error: 'Invalid prompt ID' }, { status: 400 })
    }

    // Check authentication
    const authResult = await requireAuth()
    if (!authResult.success) {
      return authResult.response
    }

    const user = authResult.user

    // Check rate limit (10 votes per minute)
    const withinLimit = await checkVoteRateLimit(user.id)
    if (!withinLimit) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait before voting again.' },
        { status: 429 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const result = voteSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: result.error.issues },
        { status: 400 }
      )
    }

    const { outcome, feedback } = result.data
    const promptId = paramsResult.data.id
    const supabase = createClient()

    // Check if prompt exists
    const { data: prompt, error: promptError } = await supabase
      .from('prompts')
      .select('id')
      .eq('id', promptId)
      .single()

    if (promptError || !prompt) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 })
    }

    // Upsert vote (replace existing vote if any)
    // First, try to delete existing vote, then insert new one
    await supabase.from('prompt_votes').delete().eq('prompt_id', promptId).eq('user_id', user.id)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: vote, error: voteError } = await (supabase.from('prompt_votes') as any)
      .insert({
        prompt_id: promptId,
        user_id: user.id,
        outcome,
        feedback: outcome === 'negative' ? feedback : null,
      })
      .select()
      .single()

    if (voteError) {
      console.error('Vote error:', voteError)
      return NextResponse.json({ error: 'Failed to record vote' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      vote,
    })
  } catch (error) {
    console.error('Vote API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Validate prompt ID
    const paramsResult = paramsSchema.safeParse(params)
    if (!paramsResult.success) {
      return NextResponse.json({ error: 'Invalid prompt ID' }, { status: 400 })
    }

    // Check authentication - return null vote if not authenticated
    const authResult = await requireAuth()
    if (!authResult.success) {
      return NextResponse.json({ vote: null })
    }

    const user = authResult.user
    const promptId = paramsResult.data.id
    const supabase = createClient()

    const { data: vote } = await supabase
      .from('prompt_votes')
      .select('*')
      .eq('prompt_id', promptId)
      .eq('user_id', user.id)
      .single()

    return NextResponse.json({ vote: vote || null })
  } catch (error) {
    console.error('Get vote API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
