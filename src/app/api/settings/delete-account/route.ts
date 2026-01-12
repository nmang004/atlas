import { type NextRequest, NextResponse } from 'next/server'

import { z } from 'zod'

import { createClient } from '@/lib/supabase/server'

const deleteSchema = z.object({
  confirmation: z.literal('DELETE MY ACCOUNT'),
})

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const result = deleteSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid confirmation. Please type "DELETE MY ACCOUNT" exactly.' },
        { status: 400 }
      )
    }

    // Delete user from users table
    // This will CASCADE to:
    // - user_preferences (ON DELETE CASCADE)
    // - prompt_votes (ON DELETE CASCADE)
    // Prompts created by user will have created_by set to NULL
    const { error: deleteError } = await supabase.from('users').delete().eq('id', user.id)

    if (deleteError) {
      console.error('Account deletion error:', deleteError)
      return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 })
    }

    // Sign out the user
    await supabase.auth.signOut()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete account API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
