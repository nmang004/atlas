'use client'

import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { Palette, Sun, Moon, Monitor } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import type { UserPreferences } from '@/types'

interface AppearanceSettingsTabProps {
  preferences: UserPreferences | null
}

export function AppearanceSettingsTab({ preferences }: AppearanceSettingsTabProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleThemeChange = async (newTheme: string) => {
    setTheme(newTheme)
    setIsSaving(true)

    try {
      const response = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: newTheme }),
      })

      if (!response.ok) {
        throw new Error('Failed to save theme preference')
      }

      toast({
        title: 'Theme updated',
        description: `Theme set to ${newTheme}.`,
      })

      router.refresh()
    } catch {
      toast({
        title: 'Theme applied',
        description: 'Theme updated locally. Could not save to server.',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (!mounted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Appearance
          </CardTitle>
          <CardDescription>Customize how Atlas looks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-20 animate-pulse rounded bg-muted" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Appearance
        </CardTitle>
        <CardDescription>Customize how Atlas looks</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label>Theme</Label>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={theme === 'light' ? 'default' : 'outline'}
              onClick={() => handleThemeChange('light')}
              disabled={isSaving}
              className="flex-1 min-w-[100px]"
            >
              <Sun className="mr-2 h-4 w-4" />
              Light
            </Button>
            <Button
              variant={theme === 'dark' ? 'default' : 'outline'}
              onClick={() => handleThemeChange('dark')}
              disabled={isSaving}
              className="flex-1 min-w-[100px]"
            >
              <Moon className="mr-2 h-4 w-4" />
              Dark
            </Button>
            <Button
              variant={theme === 'system' ? 'default' : 'outline'}
              onClick={() => handleThemeChange('system')}
              disabled={isSaving}
              className="flex-1 min-w-[100px]"
            >
              <Monitor className="mr-2 h-4 w-4" />
              System
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Select a theme preference. System will automatically match your device settings.
          </p>
        </div>

        <div className="rounded-lg border p-4">
          <p className="text-sm font-medium">Current theme: {theme}</p>
          {preferences?.theme && preferences.theme !== theme && (
            <p className="mt-1 text-xs text-muted-foreground">
              Server preference: {preferences.theme}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
