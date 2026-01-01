'use client'

import { useState } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { User as UserIcon, ThumbsUp, ThumbsDown, Edit2, Check, X } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { formatRelativeTime } from '@/lib/utils'
import type { User, PromptVote } from '@/types'

interface VoteWithPrompt extends PromptVote {
  prompt: {
    id: string
    title: string
  } | null
}

interface ProfileContentProps {
  user: User
  votes: VoteWithPrompt[]
}

export function ProfileContent({ user, votes }: ProfileContentProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(user.name || '')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSaveName = async () => {
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() || null }),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      toast({
        title: 'Profile updated',
        description: 'Your name has been updated successfully.',
      })

      setIsEditing(false)
      router.refresh()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancelEdit = () => {
    setName(user.name || '')
    setIsEditing(false)
  }

  const positiveVotes = votes.filter((v) => v.outcome === 'positive')
  const negativeVotes = votes.filter((v) => v.outcome === 'negative')

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Manage your account and view your activity</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="mt-1">{user.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Role</p>
              <div className="mt-1">
                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>{user.role}</Badge>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Name</p>
            {isEditing ? (
              <div className="mt-1 flex items-center gap-2">
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="max-w-xs"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleSaveName}
                  disabled={isSubmitting}
                >
                  <Check className="h-4 w-4 text-green-600" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleCancelEdit}
                  disabled={isSubmitting}
                >
                  <X className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ) : (
              <div className="mt-1 flex items-center gap-2">
                <p>{user.name || <span className="text-muted-foreground">Not set</span>}</p>
                <Button size="icon" variant="ghost" onClick={() => setIsEditing(true)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Member since</p>
            <p className="mt-1">{new Date(user.created_at).toLocaleDateString()}</p>
          </div>
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
            <div className="space-y-2">
              {votes.map((vote) => (
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
                        <p className="line-clamp-1 text-sm text-muted-foreground">
                          {vote.feedback}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formatRelativeTime(vote.created_at)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
