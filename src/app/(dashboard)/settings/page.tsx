import { redirect } from 'next/navigation'

import { SettingsContent } from '@/components/settings/SettingsContent'
import { createClient } from '@/lib/supabase/server'
import type { User, UserPreferences, PromptVote } from '@/types'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Account Settings - Preferences & History',
  description:
    'Manage your profile, notification preferences, and review your voting history. Customize your Atlas experience.',
}

interface VoteWithPrompt extends PromptVote {
  prompt: {
    id: string
    title: string
  } | null
}

interface AdminStats {
  totalPrompts: number
  flaggedCount: number
  usersCount: number
}

async function getSettingsData(): Promise<{
  user: User | null
  preferences: UserPreferences | null
  votes: VoteWithPrompt[]
  adminStats: AdminStats | null
}> {
  const supabase = createClient()

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser) {
    return { user: null, preferences: null, votes: [], adminStats: null }
  }

  // Fetch user profile
  const { data: userProfile } = await supabase
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .single()

  if (!userProfile) {
    return { user: null, preferences: null, votes: [], adminStats: null }
  }

  const user = userProfile as User

  // Fetch preferences (may not exist yet)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: preferences } = await (supabase as any)
    .from('user_preferences')
    .select('*')
    .eq('user_id', authUser.id)
    .single()

  // Fetch user votes for history
  const { data: votes } = await supabase
    .from('prompt_votes')
    .select(
      `
      *,
      prompt:prompts(id, title)
    `
    )
    .eq('user_id', authUser.id)
    .order('created_at', { ascending: false })

  // Fetch admin stats if user is admin
  let adminStats: AdminStats | null = null
  if (user.role === 'admin') {
    const [promptsResult, usersResult] = await Promise.all([
      supabase.from('prompts').select('id, is_flagged'),
      supabase.from('users').select('id', { count: 'exact', head: true }),
    ])

    const prompts = promptsResult.data as { id: string; is_flagged: boolean }[] | null

    adminStats = {
      totalPrompts: prompts?.length || 0,
      flaggedCount: prompts?.filter((p) => p.is_flagged).length || 0,
      usersCount: usersResult.count || 0,
    }
  }

  return {
    user,
    preferences: preferences as UserPreferences | null,
    votes: (votes as VoteWithPrompt[]) || [],
    adminStats,
  }
}

export default async function SettingsPage() {
  const { user, preferences, votes, adminStats } = await getSettingsData()

  if (!user) {
    redirect('/login')
  }

  return (
    <SettingsContent user={user} preferences={preferences} votes={votes} adminStats={adminStats} />
  )
}
