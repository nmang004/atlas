'use client'

import Link from 'next/link'

import { LayoutDashboard, FileText, Flag, Users } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

interface AdminStats {
  totalPrompts: number
  flaggedCount: number
  usersCount: number
}

interface AdminQuickStatsProps {
  stats: AdminStats
}

export function AdminQuickStats({ stats }: AdminQuickStatsProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5" />
              Admin Overview
            </CardTitle>
            <CardDescription>Quick stats and admin access</CardDescription>
          </div>
          <Link href="/admin">
            <Button variant="outline" size="sm">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-3 rounded-lg border p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalPrompts}</p>
              <p className="text-sm text-muted-foreground">Total Prompts</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg border p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
              <Flag className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.flaggedCount}</p>
              <p className="text-sm text-muted-foreground">Flagged</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg border p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
              <Users className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.usersCount}</p>
              <p className="text-sm text-muted-foreground">Users</p>
            </div>
          </div>
        </div>

        {stats.flaggedCount > 0 && (
          <div className="mt-4">
            <Link href="/admin/flagged">
              <Button variant="secondary" size="sm" className="w-full">
                <Flag className="mr-2 h-4 w-4" />
                Review {stats.flaggedCount} flagged prompt{stats.flaggedCount !== 1 ? 's' : ''}
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
