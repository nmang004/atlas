'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { Settings2, Bot, Copy, Save } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import type { UserPreferences } from '@/types'

const AI_MODELS = [
  { value: 'all', label: 'All Models' },
  { value: 'gpt-5.1', label: 'GPT 5.1' },
  { value: 'claude-4.5', label: 'Claude 4.5' },
  { value: 'gemini-3', label: 'Gemini 3' },
] as const

interface DefaultsSettingsTabProps {
  preferences: UserPreferences | null
}

export function DefaultsSettingsTab({ preferences }: DefaultsSettingsTabProps) {
  const router = useRouter()
  const { toast } = useToast()

  const [preferredModel, setPreferredModel] = useState(preferences?.preferred_model || 'all')
  const [copyWithPlaceholders, setCopyWithPlaceholders] = useState(
    preferences?.default_copy_with_placeholders ?? false
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preferred_model: preferredModel === 'all' ? null : preferredModel,
          default_copy_with_placeholders: copyWithPlaceholders,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update defaults')
      }

      toast({
        title: 'Defaults saved',
        description: 'Your default settings have been updated.',
      })

      router.refresh()
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to save defaults. Please try again.',
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
          <Settings2 className="h-5 w-5" />
          Default Settings
        </CardTitle>
        <CardDescription>Set your default preferences for working with prompts</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="preferred-model">Preferred AI Model</Label>
            </div>
            <Select value={preferredModel} onValueChange={setPreferredModel}>
              <SelectTrigger id="preferred-model" className="max-w-xs">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                {AI_MODELS.map((model) => (
                  <SelectItem key={model.value} value={model.value}>
                    {model.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Set your preferred AI model for default filtering and display.
            </p>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="flex items-start gap-3">
              <Copy className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <div className="space-y-0.5">
                <Label htmlFor="copy-placeholders">Show placeholders when copying</Label>
                <p className="text-sm text-muted-foreground">
                  Include variable placeholders (e.g., {"{{variable}}"}) in copied prompts
                </p>
              </div>
            </div>
            <Switch
              id="copy-placeholders"
              checked={copyWithPlaceholders}
              onCheckedChange={setCopyWithPlaceholders}
            />
          </div>

          <Button type="submit" disabled={isSubmitting}>
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? 'Saving...' : 'Save Defaults'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
