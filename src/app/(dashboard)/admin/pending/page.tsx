import Link from 'next/link'

import { Clock } from 'lucide-react'

import { PublishButton } from '@/components/admin/PublishButton'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { formatRelativeTime } from '@/lib/utils'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pending Submissions - Admin',
  description: 'Review and publish pending skill and MCP submissions.',
}

interface PendingItem {
  id: string
  title: string
  slug: string
  description: string | null
  created_at: string
  author: { name: string } | null
}

async function getPendingItems() {
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: skills } = await (supabase.from('skills') as any)
    .select(
      `
      id,
      title,
      slug,
      description,
      created_at,
      author:users!skills_created_by_fkey(name)
    `
    )
    .eq('is_published', false)
    .order('created_at', { ascending: false })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: mcps } = await (supabase.from('mcps') as any)
    .select(
      `
      id,
      title,
      slug,
      description,
      created_at,
      author:users!mcps_created_by_fkey(name)
    `
    )
    .eq('is_published', false)
    .order('created_at', { ascending: false })

  return {
    skills: (skills as PendingItem[] | null) ?? [],
    mcps: (mcps as PendingItem[] | null) ?? [],
  }
}

export default async function PendingPage() {
  const { skills, mcps } = await getPendingItems()
  const isEmpty = skills.length === 0 && mcps.length === 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pending Submissions</h1>
        <p className="text-muted-foreground">Review and publish submitted skills and MCPs</p>
      </div>

      {isEmpty ? (
        <div className="py-12 text-center">
          <p className="text-muted-foreground text-lg font-medium">No pending submissions</p>
          <p className="text-muted-foreground text-sm">All submissions have been reviewed</p>
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
                        {skill.description && (
                          <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                            {skill.description}
                          </p>
                        )}
                      </div>
                      <Badge variant="secondary">
                        <Clock className="mr-1 h-3 w-3" />
                        {formatRelativeTime(skill.created_at)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <p className="text-muted-foreground text-sm">
                        by {skill.author?.name ?? 'Unknown'}
                      </p>
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
                        {mcp.description && (
                          <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                            {mcp.description}
                          </p>
                        )}
                      </div>
                      <Badge variant="secondary">
                        <Clock className="mr-1 h-3 w-3" />
                        {formatRelativeTime(mcp.created_at)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <p className="text-muted-foreground text-sm">
                        by {mcp.author?.name ?? 'Unknown'}
                      </p>
                      <PublishButton entityType="mcp" id={mcp.id} />
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
