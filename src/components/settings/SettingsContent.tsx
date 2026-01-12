'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { User, UserPreferences, PromptVote } from '@/types'

import { AccountSettingsTab } from './AccountSettingsTab'
import { AdminQuickStats } from './AdminQuickStats'
import { AppearanceSettingsTab } from './AppearanceSettingsTab'
import { DefaultsSettingsTab } from './DefaultsSettingsTab'
import { NotificationSettingsTab } from './NotificationSettingsTab'
import { ProfileSettingsTab } from './ProfileSettingsTab'


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

interface SettingsContentProps {
  user: User
  preferences: UserPreferences | null
  votes: VoteWithPrompt[]
  adminStats: AdminStats | null
}

export function SettingsContent({ user, preferences, votes, adminStats }: SettingsContentProps) {
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      {user.role === 'admin' && adminStats && <AdminQuickStats stats={adminStats} />}

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="defaults">Defaults</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileSettingsTab user={user} />
        </TabsContent>

        <TabsContent value="appearance">
          <AppearanceSettingsTab preferences={preferences} />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettingsTab preferences={preferences} isAdmin={user.role === 'admin'} />
        </TabsContent>

        <TabsContent value="defaults">
          <DefaultsSettingsTab preferences={preferences} />
        </TabsContent>

        <TabsContent value="account">
          <AccountSettingsTab user={user} votes={votes} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
