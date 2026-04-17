import Link from 'next/link'

import { AlertTriangle } from 'lucide-react'

import { PublishButton } from '@/components/admin/PublishButton'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { formatRelativeTime } from '@/lib/utils'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Flagged Items - Admin',
  description: 'Review and resolve flagged skills, MCPs, and prompts.',
}

interface FlaggedItem {
  id: string
  title: string
  slug?: string
  created_at: string
  author: { name: string } | null
}

interface FlaggedPromptItem {
  id: string
  title: string
  created_at: string
}

async function getFlaggedItems() {
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: skills } = await (supabase.from('skills') as any)
    .select(
      `
      id,
      title,
      slug,
      created_at,
      author:users!skills_created_by_fkey(name)
    `
    )
    .eq('is_flagged', true)
    .order('created_at', { ascending: false })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: mcps } = await (supabase.from('mcps') as any)
    .select(
      `
      id,
      title,
      slug,
      created_at,
      author:users!mcps_created_by_fkey(name)
    `
    )
    .eq('is_flagged', true)
    .order('created_at', { ascending: false })

  const { data: prompts } = await supabase
    .from('prompts')
    .select('id, title, created_at')
    .eq('is_flagged', true)
    .order('created_at', { ascending: false })

  return {
    skills: (skills as FlaggedItem[] | null) ?? [],
    mcps: (mcps as FlaggedItem[] | null) ?? [],
    prompts: (prompts as FlaggedPromptItem[] | null) ?? [],
  }
}

export default async function FlaggedItemsPage() {
  const { skills, mcps, prompts } = await getFlaggedItems()
  const isEmpty = skills.length === 0 && mcps.length === 0 && prompts.length === 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Flagged Items</h1>
        <p className="text-muted-foreground">
          Review flagged skills, MCPs, and prompts. Publishing will also remove the flag.
        </p>
      </div>

      {isEmpty ? (
        <div className="py-12 text-center">
          <p className="text-muted-foreground text-lg font-medium">No flagged items</p>
          <p className="text-muted-foreground text-sm">All content is in good standing</p>
        </div>
      ) : (
        <>
          {skills.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Skills ({skills.length})</h2>
              {skills.map((skill) => (
                <Card key={skill.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          <Link href={`/skills/${skill.slug}`} className="hover:underline">
                            {skill.title}
                          </Link>
                        </CardTitle>
                        <p className="text-muted-foreground text-sm">
                          by {skill.author?.name ?? 'Unknown'}
                        </p>
                      </div>
                      <Badge variant="destructive">
                        <AlertTriangle className="mr-1 h-3 w-3" />
                        Flagged {formatRelativeTime(skill.created_at)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-end">
                      <PublishButton entityType="skill" id={skill.id} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {mcps.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">MCPs ({mcps.length})</h2>
              {mcps.map((mcp) => (
                <Card key={mcp.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          <Link href={`/mcps/${mcp.slug}`} className="hover:underline">
                            {mcp.title}
                          </Link>
                        </CardTitle>
                        <p className="text-muted-foreground text-sm">
                          by {mcp.author?.name ?? 'Unknown'}
                        </p>
                      </div>
                      <Badge variant="destructive">
                        <AlertTriangle className="mr-1 h-3 w-3" />
                        Flagged {formatRelativeTime(mcp.created_at)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-end">
                      <PublishButton entityType="mcp" id={mcp.id} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {prompts.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Prompts ({prompts.length})</h2>
              {prompts.map((prompt) => (
                <Card key={prompt.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          <Link href={`/prompts/${prompt.id}`} className="hover:underline">
                            {prompt.title}
                          </Link>
                        </CardTitle>
                      </div>
                      <Badge variant="destructive">
                        <AlertTriangle className="mr-1 h-3 w-3" />
                        Flagged {formatRelativeTime(prompt.created_at)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-end gap-2">
                      <Link href={`/prompts/${prompt.id}/edit`}>
                        <button className="text-muted-foreground hover:text-foreground text-sm underline">
                          Edit
                        </button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
