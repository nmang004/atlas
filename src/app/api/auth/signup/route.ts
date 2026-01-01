import { type NextRequest, NextResponse } from 'next/server'

import { z } from 'zod'

import { createClient } from '@/lib/supabase/server'

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = signupSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: result.error.issues },
        { status: 400 }
      )
    }

    const { email, password, name } = result.data
    const supabase = createClient()

    // Sign up the user
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    })

    if (signUpError) {
      return NextResponse.json({ error: signUpError.message }, { status: 400 })
    }

    if (data.user) {
      // Create user record in users table
      // Using type assertion because Supabase types don't account for service role permissions
      const { error: insertError } = await (
        supabase.from('users') as ReturnType<typeof supabase.from>
      ).insert({
        id: data.user.id,
        email: data.user.email!,
        name,
        role: 'user',
      } as never)

      if (insertError) {
        console.error('Error creating user record:', insertError)
        // Don't fail the signup - the user record might already exist or RLS might block it
        // The user can still authenticate, we'll handle missing user records gracefully
      }
    }

    return NextResponse.json({
      success: true,
      user: data.user,
    })
  } catch (error) {
    console.error('Signup API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
