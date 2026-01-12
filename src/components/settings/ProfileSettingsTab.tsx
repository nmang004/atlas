'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { User as UserIcon, Save } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import type { User } from '@/types'

interface ProfileSettingsTabProps {
  user: User
}

export function ProfileSettingsTab({ user }: ProfileSettingsTabProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [name, setName] = useState(user.name || '')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Generate initials for avatar
  const initials = user.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : user.email[0].toUpperCase()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() || null }),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      toast({
        title: 'Profile updated',
        description: 'Your changes have been saved.',
      })

      router.refresh()
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserIcon className="h-5 w-5" />
          Profile Information
        </CardTitle>
        <CardDescription>Update your personal details</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
              {initials}
            </div>
            <div>
              <p className="font-medium">{user.name || 'No name set'}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="mt-1">
                {user.role}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Display Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              maxLength={100}
              className="max-w-md"
            />
            <p className="text-xs text-muted-foreground">
              This is how your name will appear across the platform.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={user.email} disabled className="max-w-md bg-muted" />
            <p className="text-xs text-muted-foreground">Email address cannot be changed.</p>
          </div>

          <div className="space-y-2">
            <Label>Member Since</Label>
            <p className="text-sm">{new Date(user.created_at).toLocaleDateString()}</p>
          </div>

          <Button type="submit" disabled={isSubmitting}>
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
