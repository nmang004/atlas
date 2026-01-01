import { redirect } from 'next/navigation'

import { ProfileContent } from '@/components/profile/ProfileContent'
import { createClient } from '@/lib/supabase/server'
import type { User, PromptVote } from '@/types'

interface VoteWithPrompt extends PromptVote {
  prompt: {
    id: string
    title: string
  } | null
}

async function getUserProfile(): Promise<User | null> {
  const supabase = createClient()

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser) {
    return null
  }

  const { data: userProfile } = await supabase
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .single()

  return userProfile as unknown as User | null
}

async function getUserVotes(): Promise<VoteWithPrompt[]> {
  const supabase = createClient()

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser) {
    return []
  }

  const { data: votes, error } = await supabase
    .from('prompt_votes')
    .select(
      `
      *,
      prompt:prompts(id, title)
    `
    )
    .eq('user_id', authUser.id)
    .order('created_at', { ascending: false })

  if (error || !votes) {
    return []
  }

  return votes as unknown as VoteWithPrompt[]
}

export default async function ProfilePage() {
  const user = await getUserProfile()

  if (!user) {
    redirect('/login')
  }

  const votes = await getUserVotes()

  return <ProfileContent user={user} votes={votes} />
}
