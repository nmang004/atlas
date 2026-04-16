'use client'

import { useCallback, useState } from 'react'

import { useRouter } from 'next/navigation'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SafeMarkdown } from '@/components/ui/safe-markdown'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { SKILL_FORMATS } from '@/lib/constants'
import { parseSkillFrontmatter } from '@/lib/frontmatter'

export function SkillForm() {
  const router = useRouter()
  const { toast } = useToast()

  const [rawContent, setRawContent] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [format, setFormat] = useState<string>('claude_code_skill')
  const [tags, setTags] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const parsed = parseSkillFrontmatter(rawContent)

  const handleContentChange = useCallback((value: string) => {
    setRawContent(value)
    const result = parseSkillFrontmatter(value)
    if (result.frontmatter.name) {
      setTitle(String(result.frontmatter.name))
    }
    if (result.frontmatter.description) {
      setDescription(String(result.frontmatter.description))
    }
  }, [])

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast({ title: 'Title is required', variant: 'destructive' })
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          content: parsed.content || null,
          raw_file: rawContent || null,
          format,
          tags: tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to create skill')
      }

      toast({ title: 'Skill created successfully' })
      router.push('/skills')
    } catch (error) {
      toast({
        title: 'Error creating skill',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Editor */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="skill-content">Skill Content (Markdown with frontmatter)</Label>
          <Textarea
            id="skill-content"
            placeholder={`---\nname: My Skill\ndescription: A useful skill\n---\n\n# Instructions\n\nYour skill content here...`}
            value={rawContent}
            onChange={(e) => handleContentChange(e.target.value)}
            className="min-h-[300px] font-mono text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="skill-title">Title</Label>
          <Input
            id="skill-title"
            placeholder="Skill title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="skill-description">Description</Label>
          <Input
            id="skill-description"
            placeholder="Brief description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="skill-format">Format</Label>
          <Select value={format} onValueChange={setFormat}>
            <SelectTrigger id="skill-format">
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              {SKILL_FORMATS.map((f) => (
                <SelectItem key={f.value} value={f.value}>
                  {f.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="skill-tags">Tags (comma-separated)</Label>
          <Input
            id="skill-tags"
            placeholder="e.g. coding, review, testing"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        <Button onClick={handleSubmit} disabled={submitting || !title.trim()}>
          {submitting ? 'Creating...' : 'Create Skill'}
        </Button>
      </div>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Preview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.keys(parsed.frontmatter).length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Frontmatter</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(parsed.frontmatter).map(([key, value]) => (
                  <Badge key={key} variant="secondary">
                    {key}: {String(value)}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {parsed.content ? (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <SafeMarkdown>{parsed.content}</SafeMarkdown>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">Start typing to see a preview...</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
