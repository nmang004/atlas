import { type NextRequest, NextResponse } from 'next/server'

import { z } from 'zod'

import { checkVoteRateLimit, requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

const voteBodySchema = z.object({
  entity_type: z.enum(['skill', 'mcp', 'prompt']),
  entity_id: z.string().uuid(),
  outcome: z.enum(['positive', 'negative']),
  feedback: z.string().max(2000).optional(),
})

const voteQuerySchema = z.object({
  entity_type: z.enum(['skill', 'mcp', 'prompt']),
  entity_id: z.string().uuid(),
})

// Map entity types to their database tables
const entityTableMap: Record<string, string> = {
  skill: 'skills',
  mcp: 'mcps',
  prompt: 'prompts',
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authResult = await requireAuth()
    if (!authResult.success) {
      return authResult.response
    }

    const user = authResult.user

    // Check rate limit
    const withinLimit = await checkVoteRateLimit(user.id)
    if (!withinLimit) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait before voting again.' },
        { status: 429 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const result = voteBodySchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: result.error.issues },
        { status: 400 }
      )
    }

    const { entity_type, entity_id, outcome, feedback } = result.data
    const supabase = await createClient()

    // Verify entity exists
    const tableName = entityTableMap[entity_type]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: entity, error: entityError } = await (supabase.from(tableName) as any)
      .select('id')
      .eq('id', entity_id)
      .single()

    if (entityError || !entity) {
      return NextResponse.json(
        { error: `${entity_type.charAt(0).toUpperCase() + entity_type.slice(1)} not found` },
        { status: 404 }
      )
    }

    // Upsert: delete existing vote first, then insert new one
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('votes') as any)
      .delete()
      .eq('entity_type', entity_type)
      .eq('entity_id', entity_id)
      .eq('user_id', user.id)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: vote, error: voteError } = await (supabase.from('votes') as any)
      .insert({
        entity_type,
        entity_id,
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Validate query params
    const queryResult = voteQuerySchema.safeParse({
      entity_type: searchParams.get('entity_type'),
      entity_id: searchParams.get('entity_id'),
    })

    if (!queryResult.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: queryResult.error.issues },
        { status: 400 }
      )
    }

    // Check authentication - return null vote if not authenticated
    const authResult = await requireAuth()
    if (!authResult.success) {
      return NextResponse.json({ vote: null })
    }

    const user = authResult.user
    const { entity_type, entity_id } = queryResult.data
    const supabase = await createClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: vote } = await (supabase.from('votes') as any)
      .select('*')
      .eq('entity_type', entity_type)
      .eq('entity_id', entity_id)
      .eq('user_id', user.id)
      .maybeSingle()

    return NextResponse.json({ vote: vote || null })
  } catch (error) {
    console.error('Get vote API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
