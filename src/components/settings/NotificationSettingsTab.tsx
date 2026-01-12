'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { Bell, Flag, ThumbsUp, Mail } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import type { UserPreferences } from '@/types'

interface NotificationSettingsTabProps {
  preferences: UserPreferences | null
  isAdmin: boolean
}

export function NotificationSettingsTab({ preferences, isAdmin }: NotificationSettingsTabProps) {
  const router = useRouter()
  const { toast } = useToast()

  const [notifyFlagged, setNotifyFlagged] = useState(preferences?.notify_prompt_flagged ?? true)
  const [notifyVotedUpdated, setNotifyVotedUpdated] = useState(
    preferences?.notify_voted_prompt_updated ?? true
  )
  const [notifyWeeklyDigest, setNotifyWeeklyDigest] = useState(
    preferences?.notify_weekly_digest ?? false
  )
  const [isSaving, setIsSaving] = useState(false)

  const handleToggle = async (
    field: 'notify_prompt_flagged' | 'notify_voted_prompt_updated' | 'notify_weekly_digest',
    value: boolean
  ) => {
    // Optimistic update
    switch (field) {
      case 'notify_prompt_flagged':
        setNotifyFlagged(value)
        break
      case 'notify_voted_prompt_updated':
        setNotifyVotedUpdated(value)
        break
      case 'notify_weekly_digest':
        setNotifyWeeklyDigest(value)
        break
    }

    setIsSaving(true)

    try {
      const response = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      })

      if (!response.ok) {
        throw new Error('Failed to update notification settings')
      }

      toast({
        title: 'Preference saved',
        description: 'Your notification preference has been updated.',
      })

      router.refresh()
    } catch {
      // Revert optimistic update
      switch (field) {
        case 'notify_prompt_flagged':
          setNotifyFlagged(!value)
          break
        case 'notify_voted_prompt_updated':
          setNotifyVotedUpdated(!value)
          break
        case 'notify_weekly_digest':
          setNotifyWeeklyDigest(!value)
          break
      }

      toast({
        title: 'Error',
        description: 'Failed to save preference. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Preferences
        </CardTitle>
        <CardDescription>
          Choose what email notifications you want to receive (coming soon)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border border-amber-500/50 bg-amber-500/10 p-3">
          <p className="text-sm text-amber-700 dark:text-amber-400">
            Email notifications are coming soon. Your preferences will be saved for when this
            feature launches.
          </p>
        </div>

        <div className="space-y-4">
          {isAdmin && (
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <Flag className="mt-0.5 h-5 w-5 text-muted-foreground" />
                <div className="space-y-0.5">
                  <Label htmlFor="notify-flagged">Prompt flagged</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when a prompt is flagged for review
                  </p>
                </div>
              </div>
              <Switch
                id="notify-flagged"
                checked={notifyFlagged}
                onCheckedChange={(checked) => handleToggle('notify_prompt_flagged', checked)}
                disabled={isSaving}
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <ThumbsUp className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <div className="space-y-0.5">
                <Label htmlFor="notify-voted-updated">Voted prompt updated</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when a prompt you voted on is updated
                </p>
              </div>
            </div>
            <Switch
              id="notify-voted-updated"
              checked={notifyVotedUpdated}
              onCheckedChange={(checked) => handleToggle('notify_voted_prompt_updated', checked)}
              disabled={isSaving}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <div className="space-y-0.5">
                <Label htmlFor="notify-weekly">Weekly digest</Label>
                <p className="text-sm text-muted-foreground">
                  Receive a weekly summary of new prompts
                </p>
              </div>
            </div>
            <Switch
              id="notify-weekly"
              checked={notifyWeeklyDigest}
              onCheckedChange={(checked) => handleToggle('notify_weekly_digest', checked)}
              disabled={isSaving}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
