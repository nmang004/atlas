'use client'

import { useState } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import {
  ArrowLeft,
  Plug,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check,
  Download,
  Clock,
  User,
  ExternalLink,
} from 'lucide-react'

import { McpInstallModal } from '@/components/mcps/McpInstallModal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SafeMarkdown } from '@/components/ui/safe-markdown'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useMcpQuery } from '@/hooks/queries/useMcpsQuery'
import { useToast } from '@/hooks/use-toast'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { useVoting } from '@/hooks/useVoting'
import { MCP_SERVER_TYPES } from '@/lib/constants'
import { formatRelativeTime, formatRating } from '@/lib/utils'
import type { VoteOutcome } from '@/types'

interface McpDetailContentProps {
  slug: string
}

function getServerTypeLabel(serverType: string): string {
  const found = MCP_SERVER_TYPES.find((t) => t.value === serverType)
  return found ? found.label : serverType
}

function McpDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-5 w-24" />
      <div className="space-y-3">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-5 w-full max-w-xl" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-28" />
        </div>
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-10 w-28" />
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10" />
      </div>
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-64 w-full" />
    </div>
  )
}

export function McpDetailContent({ slug }: McpDetailContentProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { data: mcp, isLoading } = useMcpQuery(slug)
  const { copied, copy } = useCopyToClipboard()
  const [installOpen, setInstallOpen] = useState(false)
  const [currentVote, setCurrentVote] = useState<VoteOutcome | null>(null)

  const { submitVote, isLoading: voteLoading } = useVoting({
    entityType: 'mcp',
    entityId: mcp?.id ?? '',
    onSuccess: () => {
      toast({
        title: 'Vote recorded',
        description: 'Thank you for your feedback!',
      })
      router.refresh()
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
      })
    },
  })

  const handleVote = async (outcome: VoteOutcome) => {
    if (voteLoading) {
      return
    }
    setCurrentVote(outcome)
    await submitVote(outcome)
  }

  if (isLoading) {
    return <McpDetailSkeleton />
  }

  if (!mcp) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground text-lg font-medium">MCP not found</p>
        <Link href="/mcps" className="text-primary mt-2 inline-block text-sm hover:underline">
          Back to MCPs Library
        </Link>
      </div>
    )
  }

  const linkedSkills = mcp.skill_mcps ?? []
  const formattedConfig = mcp.config_json ? JSON.stringify(mcp.config_json, null, 2) : null

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/mcps"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to MCPs
      </Link>

      {/* Hero section */}
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="from-primary/10 to-secondary/10 flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br">
                <Plug className="text-primary h-4.5 w-4.5" />
              </div>
              <h1 className="font-heading text-2xl font-bold md:text-3xl">{mcp.title}</h1>
            </div>
            {mcp.description && (
              <p className="text-muted-foreground max-w-2xl text-sm md:text-base">
                {mcp.description}
              </p>
            )}
          </div>
          {mcp.source_url && (
            <a
              href={mcp.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground inline-flex shrink-0 items-center gap-1 text-sm transition-colors"
            >
              Source <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>

        {/* Metadata badges */}
        <div className="flex flex-wrap items-center gap-2">
          {mcp.category?.name && <Badge variant="default">{mcp.category.name}</Badge>}
          {mcp.server_type && (
            <Badge variant="outline">{getServerTypeLabel(mcp.server_type)}</Badge>
          )}
          {mcp.author && (
            <span className="text-muted-foreground flex items-center gap-1.5 text-sm">
              <User className="h-3.5 w-3.5" />
              {mcp.author.name || mcp.author.email}
            </span>
          )}
          <span className="text-muted-foreground flex items-center gap-1.5 text-sm">
            <Clock className="h-3.5 w-3.5" />
            {formatRelativeTime(mcp.created_at)}
          </span>
          {mcp.rating_score !== null && mcp.rating_score !== undefined && (
            <span className="text-muted-foreground flex items-center gap-1.5 text-sm">
              <ThumbsUp className="h-3.5 w-3.5" />
              {formatRating(mcp.rating_score)}
            </span>
          )}
        </div>

        {/* Tags */}
        {mcp.tags && mcp.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {mcp.tags.map((tag: string) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        {mcp.config_json && (
          <Button onClick={() => setInstallOpen(true)} className="gap-2">
            <Download className="h-4 w-4" />
            Install
          </Button>
        )}
        <Button
          variant={currentVote === 'positive' ? 'default' : 'outline'}
          size="icon"
          onClick={() => handleVote('positive')}
          disabled={voteLoading}
          aria-label="Upvote"
        >
          <ThumbsUp className="h-4 w-4" />
        </Button>
        <Button
          variant={currentVote === 'negative' ? 'destructive' : 'outline'}
          size="icon"
          onClick={() => handleVote('negative')}
          disabled={voteLoading}
          aria-label="Downvote"
        >
          <ThumbsDown className="h-4 w-4" />
        </Button>
      </div>

      {/* Content tabs */}
      <Tabs defaultValue="documentation" className="w-full">
        <TabsList>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
          {formattedConfig && <TabsTrigger value="config">Config</TabsTrigger>}
        </TabsList>
        <TabsContent value="documentation" className="mt-4">
          {mcp.content ? (
            <div className="prose prose-invert max-w-none">
              <SafeMarkdown>{mcp.content}</SafeMarkdown>
            </div>
          ) : (
            <p className="text-muted-foreground py-8 text-center text-sm">
              No documentation available for this MCP.
            </p>
          )}
        </TabsContent>
        {formattedConfig && (
          <TabsContent value="config" className="mt-4">
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                className="absolute top-3 right-3 gap-1.5"
                onClick={() => copy(formattedConfig)}
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copy
                  </>
                )}
              </Button>
              <div className="bg-muted overflow-auto rounded-lg border">
                <pre className="p-4 text-sm">
                  <code>{formattedConfig}</code>
                </pre>
              </div>
            </div>
          </TabsContent>
        )}
      </Tabs>

      {/* Related Skills */}
      {linkedSkills.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Related Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {linkedSkills.map(
                (sm: { id: string; skill: { id: string; title: string; slug: string } }) => (
                  <li key={sm.id}>
                    <Link
                      href={`/skills/${sm.skill.slug}`}
                      className="text-primary text-sm hover:underline"
                    >
                      {sm.skill.title}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Install Modal */}
      {mcp.config_json && (
        <McpInstallModal
          open={installOpen}
          onClose={() => setInstallOpen(false)}
          title={mcp.title}
          configJson={mcp.config_json}
        />
      )}
    </div>
  )
}
