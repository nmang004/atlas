import { NextResponse } from 'next/server'

import { createClient } from '@/lib/supabase/server'

export type AuthResult =
  | { success: true; user: { id: string; role: string; email: string } }
  | { success: false; response: NextResponse }

export type AdminAuthResult =
  | { success: true; user: { id: string; role: 'admin'; email: string } }
  | { success: false; response: NextResponse }

/**
 * Check if the current request is from an authenticated user.
 * Returns either the user object or an appropriate error response.
 */
export async function requireAuth(): Promise<AuthResult> {
  const supabase = createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return {
      success: false,
      response: NextResponse.json({ error: 'Authentication required' }, { status: 401 }),
    }
  }

  // Fetch user profile to get role
  const { data: userProfile, error: profileError } = await supabase
    .from('users')
    .select('role, email')
    .eq('id', user.id)
    .single()

  if (profileError || !userProfile) {
    return {
      success: false,
      response: NextResponse.json({ error: 'User profile not found' }, { status: 401 }),
    }
  }

  const profile = userProfile as { role: string; email: string }

  return {
    success: true,
    user: {
      id: user.id,
      role: profile.role,
      email: profile.email,
    },
  }
}

/**
 * Check if the current request is from an authenticated admin user.
 * Returns 401 for unauthenticated users, 403 for non-admin users.
 */
export async function requireAdmin(): Promise<AdminAuthResult> {
  const authResult = await requireAuth()

  if (!authResult.success) {
    return authResult
  }

  if (authResult.user.role !== 'admin') {
    return {
      success: false,
      response: NextResponse.json({ error: 'Admin access required' }, { status: 403 }),
    }
  }

  return {
    success: true,
    user: {
      ...authResult.user,
      role: 'admin' as const,
    },
  }
}

/**
 * Rate limiting check for voting.
 * Returns true if within limits, false if rate limited.
 */
export async function checkVoteRateLimit(userId: string): Promise<boolean> {
  const supabase = createClient()

  // Call the database function to check/update rate limit
  // Using type assertion since the function is defined in migrations but not in generated types
  const { data, error } = await (supabase.rpc as CallableFunction)('check_vote_rate_limit', {
    p_user_id: userId,
  })

  if (error) {
    console.error('Rate limit check error:', error)
    // On error, allow the request (fail open for availability)
    // but log for monitoring
    return true
  }

  return data === true
}
