import { type NextRequest, NextResponse } from 'next/server'

import { z } from 'zod'

import { createClient } from '@/lib/supabase/server'

const updatePreferencesSchema = z.object({
  name: z.string().max(100).nullable().optional(),
  notify_prompt_flagged: z.boolean().optional(),
  notify_voted_prompt_updated: z.boolean().optional(),
  notify_weekly_digest: z.boolean().optional(),
  preferred_model: z.string().max(50).nullable().optional(),
  default_copy_with_placeholders: z.boolean().optional(),
  theme: z.enum(['light', 'dark', 'system']).optional(),
})

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

    // Fetch user profile
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Fetch or create user preferences
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let { data: preferences } = await (supabase as any)
      .from('user_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single()

    // Create default preferences if none exist
    if (!preferences) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: newPrefs, error: insertError } = await (supabase as any)
        .from('user_preferences')
        .insert({ user_id: user.id })
        .select()
        .single()

      if (insertError) {
        console.error('Error creating preferences:', insertError)
        // Return null preferences if creation fails (will work without them)
        preferences = null
      } else {
        preferences = newPrefs
      }
    }

    return NextResponse.json({
      user: userProfile,
      preferences,
    })
  } catch (error) {
    console.error('Settings GET API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
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
    const result = updatePreferencesSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: result.error.issues },
        { status: 400 }
      )
    }

    const { name, ...preferencesData } = result.data
    const updates: { user?: object; preferences?: object } = {}

    // Update user profile (name) if provided
    if (name !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: updatedUser, error: userError } = await (supabase as any)
        .from('users')
        .update({ name })
        .eq('id', user.id)
        .select()
        .single()

      if (userError) {
        console.error('User update error:', userError)
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
      }
      updates.user = updatedUser
    }

    // Update preferences if any preference fields provided
    if (Object.keys(preferencesData).length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const supabaseAny = supabase as any

      // Ensure preferences exist first
      const { data: existingPrefs } = await supabaseAny
        .from('user_preferences')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!existingPrefs) {
        // Create with the new values
        const { data: newPrefs, error: insertError } = await supabaseAny
          .from('user_preferences')
          .insert({ user_id: user.id, ...preferencesData })
          .select()
          .single()

        if (insertError) {
          console.error('Preferences insert error:', insertError)
          return NextResponse.json({ error: 'Failed to create preferences' }, { status: 500 })
        }
        updates.preferences = newPrefs
      } else {
        // Update existing preferences
        const { data: updatedPrefs, error: prefsError } = await supabaseAny
          .from('user_preferences')
          .update(preferencesData)
          .eq('user_id', user.id)
          .select()
          .single()

        if (prefsError) {
          console.error('Preferences update error:', prefsError)
          return NextResponse.json({ error: 'Failed to update preferences' }, { status: 500 })
        }
        updates.preferences = updatedPrefs
      }
    }

    return NextResponse.json({
      success: true,
      ...updates,
    })
  } catch (error) {
    console.error('Settings PATCH API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
