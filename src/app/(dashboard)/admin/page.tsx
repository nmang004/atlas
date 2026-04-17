import Link from 'next/link'

import { AlertTriangle, CheckCircle, Clock, FileText, Server } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard - Atlas',
  description:
    'Monitor content health, review pending submissions, and manage flagged items across skills, MCPs, and prompts.',
}

interface AdminStats {
  publishedSkills: number
  publishedMcps: number
  prompts: number
  pendingSkills: number
  pendingMcps: number
  flaggedSkills: number
  flaggedMcps: number
  flaggedPrompts: number
}

async function getAdminStats(): Promise<AdminStats> {
  const supabase = await createClient()

  // Use head: true with count: 'exact' for efficient counting
  const [
    publishedSkillsRes,
    publishedMcpsRes,
    promptsRes,
    pendingSkillsRes,
    pendingMcpsRes,
    flaggedSkillsRes,
    flaggedMcpsRes,
    flaggedPromptsRes,
  ] = await Promise.all([
    supabase.from('skills').select('id', { count: 'exact', head: true }).eq('is_published', true),
    supabase.from('mcps').select('id', { count: 'exact', head: true }).eq('is_published', true),
    supabase.from('prompts').select('id', { count: 'exact', head: true }),
    supabase.from('skills').select('id', { count: 'exact', head: true }).eq('is_published', false),
    supabase.from('mcps').select('id', { count: 'exact', head: true }).eq('is_published', false),
    supabase.from('skills').select('id', { count: 'exact', head: true }).eq('is_flagged', true),
    supabase.from('mcps').select('id', { count: 'exact', head: true }).eq('is_flagged', true),
    supabase.from('prompts').select('id', { count: 'exact', head: true }).eq('is_flagged', true),
  ])

  return {
    publishedSkills: publishedSkillsRes.count ?? 0,
    publishedMcps: publishedMcpsRes.count ?? 0,
    prompts: promptsRes.count ?? 0,
    pendingSkills: pendingSkillsRes.count ?? 0,
    pendingMcps: pendingMcpsRes.count ?? 0,
    flaggedSkills: flaggedSkillsRes.count ?? 0,
    flaggedMcps: flaggedMcpsRes.count ?? 0,
    flaggedPrompts: flaggedPromptsRes.count ?? 0,
  }
}

export default async function AdminDashboardPage() {
  const stats = await getAdminStats()
  const pendingTotal = stats.pendingSkills + stats.pendingMcps
  const flaggedTotal = stats.flaggedSkills + stats.flaggedMcps + stats.flaggedPrompts

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor and manage content across skills, MCPs, and prompts
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Published Skills</CardTitle>
            <CheckCircle className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.publishedSkills}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Published MCPs</CardTitle>
            <Server className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.publishedMcps}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Prompts</CardTitle>
            <FileText className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.prompts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{pendingTotal}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Flagged Items</CardTitle>
            <AlertTriangle className="text-destructive h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-destructive text-2xl font-bold">{flaggedTotal}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/admin/pending">
              <Button variant="outline" className="w-full justify-start">
                <Clock className="mr-2 h-4 w-4" />
                Review Pending Submissions ({pendingTotal})
              </Button>
            </Link>
            <Link href="/admin/flagged">
              <Button variant="outline" className="w-full justify-start">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Review Flagged Items ({flaggedTotal})
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pending Skills</span>
                <span className="font-medium">{stats.pendingSkills}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pending MCPs</span>
                <span className="font-medium">{stats.pendingMcps}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Flagged Skills</span>
                <span className="font-medium">{stats.flaggedSkills}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Flagged MCPs</span>
                <span className="font-medium">{stats.flaggedMcps}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Flagged Prompts</span>
                <span className="font-medium">{stats.flaggedPrompts}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
