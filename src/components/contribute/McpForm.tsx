'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { MCP_SERVER_TYPES } from '@/lib/constants'

export function McpForm() {
  const router = useRouter()
  const { toast } = useToast()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [serverType, setServerType] = useState<string>('stdio')
  const [tags, setTags] = useState('')
  const [configJson, setConfigJson] = useState('')
  const [documentation, setDocumentation] = useState('')
  const [jsonError, setJsonError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const validateJson = (value: string) => {
    setConfigJson(value)
    if (!value.trim()) {
      setJsonError(null)
      return
    }
    try {
      JSON.parse(value)
      setJsonError(null)
    } catch {
      setJsonError('Invalid JSON')
    }
  }

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast({ title: 'Title is required', variant: 'destructive' })
      return
    }

    if (configJson.trim() && jsonError) {
      toast({ title: 'Please fix the JSON configuration', variant: 'destructive' })
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/mcps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          content: documentation.trim() || null,
          config_json: configJson.trim() ? JSON.parse(configJson) : null,
          server_type: serverType,
          tags: tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to create MCP')
      }

      toast({ title: 'MCP created successfully' })
      router.push('/mcps')
    } catch (error) {
      toast({
        title: 'Error creating MCP',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-4">
      <div className="space-y-2">
        <Label htmlFor="mcp-title">Title</Label>
        <Input
          id="mcp-title"
          placeholder="MCP server name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="mcp-description">Description</Label>
        <Input
          id="mcp-description"
          placeholder="Brief description of this MCP server"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="mcp-server-type">Server Type</Label>
        <Select value={serverType} onValueChange={setServerType}>
          <SelectTrigger id="mcp-server-type">
            <SelectValue placeholder="Select server type" />
          </SelectTrigger>
          <SelectContent>
            {MCP_SERVER_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="mcp-tags">Tags (comma-separated)</Label>
        <Input
          id="mcp-tags"
          placeholder="e.g. database, search, api"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="mcp-config">Configuration JSON</Label>
        <Textarea
          id="mcp-config"
          placeholder='{\n  "command": "npx",\n  "args": ["-y", "my-mcp-server"]\n}'
          value={configJson}
          onChange={(e) => validateJson(e.target.value)}
          className="min-h-[150px] font-mono text-sm"
        />
        {jsonError && <p className="text-destructive text-xs">{jsonError}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="mcp-docs">Documentation</Label>
        <Textarea
          id="mcp-docs"
          placeholder="Setup instructions, usage notes, etc."
          value={documentation}
          onChange={(e) => setDocumentation(e.target.value)}
          className="min-h-[150px]"
        />
      </div>

      <Button onClick={handleSubmit} disabled={submitting || !title.trim()}>
        {submitting ? 'Creating...' : 'Create MCP'}
      </Button>
    </div>
  )
}
