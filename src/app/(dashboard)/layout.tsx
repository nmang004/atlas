import { DashboardShell } from '@/components/layout/DashboardShell'
import { createClient } from '@/lib/supabase/server'
import type { User } from '@/types'

async function getCurrentUser(): Promise<{ user: User | null; isAdmin: boolean }> {
  const supabase = await createClient()

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser) {
    return { user: null, isAdmin: false }
  }

  // Fetch user profile from users table
  const { data: userProfile } = await supabase
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .single()

  // Cast to User type
  const user = userProfile as unknown as User | null

  return {
    user,
    isAdmin: user?.role === 'admin',
  }
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin } = await getCurrentUser()

  return (
    <DashboardShell user={user} isAdmin={isAdmin}>
      {children}
    </DashboardShell>
  )
}
