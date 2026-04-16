'use client'

import { useState } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import {
  ArrowLeft,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check,
  Download,
  Clock,
  User,
  ExternalLink,
} from 'lucide-react'

import { InstallModal } from '@/components/skills/InstallModal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SafeMarkdown } from '@/components/ui/safe-markdown'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSkillQuery } from '@/hooks/queries/useSkillsQuery'
import { useToast } from '@/hooks/use-toast'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { useVoting } from '@/hooks/useVoting'
import { SKILL_FORMATS } from '@/lib/constants'
import { formatRelativeTime, formatRating } from '@/lib/utils'
import type { VoteOutcome } from '@/types'

interface SkillDetailContentProps {
  slug: string
}

function getFormatLabel(format: string): string {
  const found = SKILL_FORMATS.find((f) => f.value === format)
  return found ? found.label : format
}

function SkillDetailSkeleton() {
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

export function SkillDetailContent({ slug }: SkillDetailContentProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { data: skill, isLoading } = useSkillQuery(slug)
  const { copied, copy } = useCopyToClipboard()
  const [installOpen, setInstallOpen] = useState(false)
  const [currentVote, setCurrentVote] = useState<VoteOutcome | null>(null)

  const { submitVote, isLoading: voteLoading } = useVoting({
    entityType: 'skill',
    entityId: skill?.id ?? '',
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
    return <SkillDetailSkeleton />
  }

  if (!skill) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground text-lg font-medium">Skill not found</p>
        <Link href="/skills" className="text-primary mt-2 inline-block text-sm hover:underline">
          Back to Skills Library
        </Link>
      </div>
    )
  }

  const linkedPrompts = skill.skill_prompts ?? []
  const linkedMcps = skill.skill_mcps ?? []

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/skills"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Skills
      </Link>

      {/* Hero section */}
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="from-primary/10 to-secondary/10 flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br">
                <Sparkles className="text-primary h-4.5 w-4.5" />
              </div>
              <h1 className="font-heading text-2xl font-bold md:text-3xl">{skill.title}</h1>
            </div>
            {skill.description && (
              <p className="text-muted-foreground max-w-2xl text-sm md:text-base">
                {skill.description}
              </p>
            )}
          </div>
          {skill.source_url && (
            <a
              href={skill.source_url}
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
          {skill.category?.name && <Badge variant="default">{skill.category.name}</Badge>}
          {skill.format && <Badge variant="outline">{getFormatLabel(skill.format)}</Badge>}
          {skill.author && (
            <span className="text-muted-foreground flex items-center gap-1.5 text-sm">
              <User className="h-3.5 w-3.5" />
              {skill.author.name || skill.author.email}
            </span>
          )}
          <span className="text-muted-foreground flex items-center gap-1.5 text-sm">
            <Clock className="h-3.5 w-3.5" />
            {formatRelativeTime(skill.created_at)}
          </span>
          {skill.rating_score !== null && skill.rating_score !== undefined && (
            <span className="text-muted-foreground flex items-center gap-1.5 text-sm">
              <ThumbsUp className="h-3.5 w-3.5" />
              {formatRating(skill.rating_score)}
            </span>
          )}
        </div>

        {/* Tags */}
        {skill.tags && skill.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {skill.tags.map((tag: string) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        {skill.raw_file && (
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
          {skill.raw_file && <TabsTrigger value="raw">Raw File</TabsTrigger>}
        </TabsList>
        <TabsContent value="documentation" className="mt-4">
          {skill.content ? (
            <div className="prose prose-invert max-w-none">
              <SafeMarkdown>{skill.content}</SafeMarkdown>
            </div>
          ) : (
            <p className="text-muted-foreground py-8 text-center text-sm">
              No documentation available for this skill.
            </p>
          )}
        </TabsContent>
        {skill.raw_file && (
          <TabsContent value="raw" className="mt-4">
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                className="absolute top-3 right-3 gap-1.5"
                onClick={() => copy(skill.raw_file!)}
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
                  <code>{skill.raw_file}</code>
                </pre>
              </div>
            </div>
          </TabsContent>
        )}
      </Tabs>

      {/* Linked Prompts */}
      {linkedPrompts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Linked Prompts</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {linkedPrompts.map((sp: { id: string; prompt: { id: string; title: string } }) => (
                <li key={sp.id}>
                  <Link
                    href={`/prompts/${sp.prompt.id}`}
                    className="text-primary text-sm hover:underline"
                  >
                    {sp.prompt.title}
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Linked MCPs */}
      {linkedMcps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Linked MCPs</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {linkedMcps.map((sm: { id: string; mcp: { slug: string; title: string } }) => (
                <li key={sm.id}>
                  <Link
                    href={`/mcps/${sm.mcp.slug}`}
                    className="text-primary text-sm hover:underline"
                  >
                    {sm.mcp.title}
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Install Modal */}
      {skill.raw_file && (
        <InstallModal
          open={installOpen}
          onClose={() => setInstallOpen(false)}
          title={skill.title}
          slug={skill.slug}
          rawFile={skill.raw_file}
        />
      )}
    </div>
  )
}
