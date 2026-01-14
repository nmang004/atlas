import { type NextRequest, NextResponse } from 'next/server'

import { z } from 'zod'

import { createClient } from '@/lib/supabase/server'

const feedbackSchema = z.object({
  type: z.enum(['feature', 'improvement', 'bug', 'general']),
  message: z.string().min(1).max(5000),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = feedbackSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: result.error.issues },
        { status: 400 }
      )
    }

    const { type, message } = result.data

    // Store feedback in Supabase
    const supabase = createClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('feedback') as any).insert({ type, message })

    if (error) {
      console.error('Supabase feedback insert error:', error)
      return NextResponse.json({ error: 'Failed to save feedback' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Feedback submitted successfully',
    })
  } catch (error) {
    console.error('Feedback API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
