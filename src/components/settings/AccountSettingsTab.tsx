'use client'

import { useState } from 'react'

import Link from 'next/link'

import { Shield, Key, Download, ThumbsUp, ThumbsDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { formatRelativeTime } from '@/lib/utils'
import type { User, PromptVote } from '@/types'

import { DeleteAccountDialog } from './DeleteAccountDialog'

interface VoteWithPrompt extends PromptVote {
  prompt: {
    id: string
    title: string
  } | null
}

interface AccountSettingsTabProps {
  user: User
  votes: VoteWithPrompt[]
}

export function AccountSettingsTab({ user: _user, votes }: AccountSettingsTabProps) {
  const { toast } = useToast()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const positiveVotes = votes.filter((v) => v.outcome === 'positive')
  const negativeVotes = votes.filter((v) => v.outcome === 'negative')

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'Please make sure both password fields match.',
        variant: 'destructive',
      })
      return
    }

    if (newPassword.length < 8) {
      toast({
        title: 'Password too short',
        description: 'Password must be at least 8 characters long.',
        variant: 'destructive',
      })
      return
    }

    setIsChangingPassword(true)

    try {
      const response = await fetch('/api/settings/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to change password')
      }

      toast({
        title: 'Password changed',
        description: 'Your password has been updated successfully.',
      })

      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to change password.',
        variant: 'destructive',
      })
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleExport = async () => {
    setIsExporting(true)

    try {
      const response = await fetch('/api/settings/export')

      if (!response.ok) {
        throw new Error('Failed to export data')
      }

      // Get the blob and download it
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `atlas-export-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: 'Data exported',
        description: 'Your data has been downloaded.',
      })
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to export data. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Change Password
          </CardTitle>
          <CardDescription>Update your account password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="max-w-sm"
                minLength={8}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="max-w-sm"
                minLength={8}
              />
            </div>
            <Button type="submit" disabled={isChangingPassword || !newPassword || !confirmPassword}>
              {isChangingPassword ? 'Changing...' : 'Change Password'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Data
          </CardTitle>
          <CardDescription>Download all your data from Atlas</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            Export your profile information, voting history, and preferences as a JSON file.
          </p>
          <Button variant="outline" onClick={handleExport} disabled={isExporting}>
            <Download className="mr-2 h-4 w-4" />
            {isExporting ? 'Exporting...' : 'Export My Data'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Voting Activity</CardTitle>
          <CardDescription>Your recent votes on prompts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-4">
            <div className="flex items-center gap-2">
              <ThumbsUp className="h-4 w-4 text-green-600" />
              <span className="text-sm">{positiveVotes.length} positive</span>
            </div>
            <div className="flex items-center gap-2">
              <ThumbsDown className="h-4 w-4 text-destructive" />
              <span className="text-sm">{negativeVotes.length} negative</span>
            </div>
          </div>

          {votes.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              You haven&apos;t voted on any prompts yet.
            </p>
          ) : (
            <div className="max-h-64 space-y-2 overflow-y-auto">
              {votes.slice(0, 10).map((vote) => (
                <div
                  key={vote.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    {vote.outcome === 'positive' ? (
                      <ThumbsUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <ThumbsDown className="h-4 w-4 text-destructive" />
                    )}
                    <div>
                      {vote.prompt ? (
                        <Link
                          href={`/prompts/${vote.prompt.id}`}
                          className="font-medium hover:underline"
                        >
                          {vote.prompt.title}
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">Deleted prompt</span>
                      )}
                      {vote.feedback && (
                        <p className="line-clamp-1 text-sm text-muted-foreground">{vote.feedback}</p>
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formatRelativeTime(vote.created_at)}
                  </span>
                </div>
              ))}
              {votes.length > 10 && (
                <p className="pt-2 text-center text-sm text-muted-foreground">
                  Showing 10 of {votes.length} votes
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Shield className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>Irreversible account actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Delete Account</p>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all associated data.
              </p>
            </div>
            <DeleteAccountDialog />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
