import Link from 'next/link'

import { AlertTriangle, Clock, ThumbsUp, FileText } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { STALE_THRESHOLD_DAYS } from '@/lib/constants'
import { createClient } from '@/lib/supabase/server'

interface AdminStats {
  totalPrompts: number
  flaggedPrompts: number
  stalePrompts: number
  totalVotes: number
}

interface PromptStats {
  id: string
  is_flagged: boolean
  last_verified_at: string
  vote_count: number
}

async function getAdminStats(): Promise<AdminStats> {
  const supabase = createClient()

  // Get all prompts
  const { data: promptsData } = await supabase
    .from('prompts')
    .select('id, is_flagged, last_verified_at, vote_count')

  if (!promptsData) {
    return {
      totalPrompts: 0,
      flaggedPrompts: 0,
      stalePrompts: 0,
      totalVotes: 0,
    }
  }

  // Cast to proper type
  const prompts = promptsData as unknown as PromptStats[]

  const staleThreshold = new Date()
  staleThreshold.setDate(staleThreshold.getDate() - STALE_THRESHOLD_DAYS)

  const flaggedCount = prompts.filter((p) => p.is_flagged).length
  const staleCount = prompts.filter((p) => {
    const verifiedDate = new Date(p.last_verified_at)
    return verifiedDate < staleThreshold && !p.is_flagged
  }).length
  const totalVotes = prompts.reduce((sum, p) => sum + p.vote_count, 0)

  return {
    totalPrompts: prompts.length,
    flaggedPrompts: flaggedCount,
    stalePrompts: staleCount,
    totalVotes,
  }
}

export default async function AdminDashboardPage() {
  const stats = await getAdminStats()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Monitor and manage the prompt library</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Prompts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPrompts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Flagged</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.flaggedPrompts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Needs Review</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{stats.stalePrompts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVotes}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/admin/flagged">
              <Button variant="outline" className="w-full justify-start">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Review Flagged Prompts ({stats.flaggedPrompts + stats.stalePrompts})
              </Button>
            </Link>
            <Link href="/prompts/new">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Create New Prompt
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Activity tracking will be implemented in a future phase.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
