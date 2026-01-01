'use client'

import { useState } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import {
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check,
  Clock,
  AlertTriangle,
  ChevronDown,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
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
import { useVoting } from '@/hooks/useVoting'
import { cn, formatRelativeTime, formatRating, needsReview, assemblePrompt } from '@/lib/utils'
import type { PromptWithDetails, PromptVote, VoteOutcome } from '@/types'

interface PromptDetailContentProps {
  prompt: PromptWithDetails
  existingVote: PromptVote | null
}

export function PromptDetailContent({ prompt, existingVote }: PromptDetailContentProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [variables, setVariables] = useState<Record<string, string>>({})
  const [copied, setCopied] = useState(false)
  const [showVoting, setShowVoting] = useState(false)
  const [currentVote, setCurrentVote] = useState<VoteOutcome | null>(
    existingVote?.outcome as VoteOutcome | null
  )
  const [feedbackText, setFeedbackText] = useState('')
  const [showFeedbackInput, setShowFeedbackInput] = useState(false)

  // Collapsible states for mobile
  const [dataReqOpen, setDataReqOpen] = useState(false)
  const [checklistOpen, setChecklistOpen] = useState(false)
  const [examplesOpen, setExamplesOpen] = useState(false)

  const { submitVote, loading: voteLoading } = useVoting({
    promptId: prompt.id,
    onSuccess: () => {
      toast({
        title: 'Vote recorded',
        description: 'Thank you for your feedback!',
      })
      setShowVoting(false)
      setShowFeedbackInput(false)
      setFeedbackText('')
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

  const isStale = needsReview(prompt.last_verified_at)
  const categoryName = prompt.category?.name || 'Uncategorized'

  const allRequiredFilled = prompt.variables
    .filter((v) => v.is_required)
    .every((v) => variables[v.key]?.trim())

  const assembledPrompt = assemblePrompt(prompt.content, variables)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(assembledPrompt)
    setCopied(true)
    setShowVoting(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleVote = async (outcome: VoteOutcome) => {
    if (outcome === 'negative' && !showFeedbackInput) {
      setShowFeedbackInput(true)
      return
    }

    setCurrentVote(outcome)
    await submitVote(outcome, outcome === 'negative' ? feedbackText : undefined)
  }

  const handleCancelFeedback = () => {
    setShowFeedbackInput(false)
    setFeedbackText('')
  }

  // Parse select options from JSON
  const getSelectOptions = (options: unknown): string[] => {
    if (Array.isArray(options)) {
      return options.filter((opt): opt is string => typeof opt === 'string')
    }
    return []
  }

  return (
    <div className="mx-auto max-w-4xl space-y-4 pb-24 md:space-y-6 md:pb-6">
      {/* Header */}
      <div className="flex items-start gap-3 md:gap-4">
        <Link href="/prompts">
          <Button variant="ghost" size="icon" className="min-h-11 min-w-11 shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold md:text-2xl">{prompt.title}</h1>
            {(prompt.is_flagged || isStale) && (
              <Badge variant="warning" className="shrink-0">
                <AlertTriangle className="mr-1 h-3 w-3" />
                {prompt.is_flagged ? 'Flagged' : 'Needs Review'}
              </Badge>
            )}
          </div>
          {/* Meta info - stacked on mobile */}
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground md:text-sm">
            <span>{categoryName}</span>
            <span className="hidden md:inline">|</span>
            <span className="flex items-center gap-1">
              <ThumbsUp className="h-3 w-3" />
              {formatRating(prompt.rating_score)} ({prompt.vote_count})
            </span>
            <span className="hidden md:inline">|</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatRelativeTime(prompt.last_verified_at)}
            </span>
          </div>
        </div>
      </div>

      {/* Tags - horizontally scrollable on mobile */}
      <div className="scrollbar-hide -mx-4 flex flex-nowrap gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
        {prompt.tags?.map((tag) => (
          <Badge key={tag} variant="secondary" className="shrink-0">
            {tag}
          </Badge>
        ))}
        {prompt.model_version && (
          <Badge variant="outline" className="shrink-0">
            {prompt.model_version}
          </Badge>
        )}
      </div>

      {currentVote && (
        <div className="rounded-lg border bg-muted/50 p-3 md:p-4">
          <p className="text-sm text-muted-foreground">
            You previously voted{' '}
            <span className="font-medium">
              {currentVote === 'positive' ? 'positively' : 'negatively'}
            </span>{' '}
            on this prompt.
          </p>
        </div>
      )}

      {/* Data Requirements - collapsible on mobile */}
      {prompt.data_requirements && (
        <>
          {/* Desktop view */}
          <Card className="hidden md:block">
            <CardHeader>
              <CardTitle className="text-lg">Data Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <SafeMarkdown>{prompt.data_requirements}</SafeMarkdown>
              </div>
            </CardContent>
          </Card>
          {/* Mobile collapsible */}
          <Collapsible open={dataReqOpen} onOpenChange={setDataReqOpen} className="md:hidden">
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Data Requirements</CardTitle>
                    <ChevronDown
                      className={cn('h-5 w-5 transition-transform', dataReqOpen && 'rotate-180')}
                    />
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <SafeMarkdown>{prompt.data_requirements}</SafeMarkdown>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        </>
      )}

      {/* Variables */}
      {prompt.variables.length > 0 && (
        <Card>
          <CardHeader className="pb-2 md:pb-4">
            <CardTitle className="text-base md:text-lg">Variables</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {prompt.variables.map((variable) => (
              <div key={variable.id} className="space-y-2">
                <Label htmlFor={variable.key} className="text-sm">
                  {variable.label}
                  {variable.is_required && <span className="ml-1 text-destructive">*</span>}
                </Label>
                {variable.type === 'textarea' ? (
                  <Textarea
                    id={variable.key}
                    placeholder={variable.placeholder || ''}
                    value={variables[variable.key] || ''}
                    onChange={(e) =>
                      setVariables((prev) => ({ ...prev, [variable.key]: e.target.value }))
                    }
                    className="min-h-[100px]"
                  />
                ) : variable.type === 'select' ? (
                  <Select
                    value={variables[variable.key] || ''}
                    onValueChange={(value) =>
                      setVariables((prev) => ({ ...prev, [variable.key]: value }))
                    }
                  >
                    <SelectTrigger className="min-h-11">
                      <SelectValue placeholder={variable.placeholder || 'Select...'} />
                    </SelectTrigger>
                    <SelectContent>
                      {getSelectOptions(variable.options).map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id={variable.key}
                    placeholder={variable.placeholder || ''}
                    value={variables[variable.key] || ''}
                    onChange={(e) =>
                      setVariables((prev) => ({ ...prev, [variable.key]: e.target.value }))
                    }
                    className="min-h-11"
                  />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Assembled Prompt */}
      <Card>
        <CardHeader className="pb-2 md:pb-4">
          <CardTitle className="text-base md:text-lg">Assembled Prompt</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="whitespace-pre-wrap rounded-md bg-muted p-3 text-sm md:p-4">
            {assembledPrompt}
          </pre>
        </CardContent>
      </Card>

      {/* Desktop voting section */}
      <div className="hidden flex-col items-center justify-center gap-4 md:flex">
        {!showVoting ? (
          <Button
            size="lg"
            disabled={!allRequiredFilled}
            onClick={handleCopy}
            className="min-w-[200px]"
          >
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy to Clipboard
              </>
            )}
          </Button>
        ) : showFeedbackInput ? (
          <div className="w-full max-w-md space-y-4">
            <p className="text-center text-sm text-muted-foreground">What could be improved?</p>
            <Textarea
              placeholder="Describe what didn't work well..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
            />
            <div className="flex justify-center gap-2">
              <Button variant="outline" onClick={handleCancelFeedback} disabled={voteLoading}>
                Cancel
              </Button>
              <Button
                onClick={() => handleVote('negative')}
                disabled={voteLoading || !feedbackText.trim()}
              >
                {voteLoading ? 'Submitting...' : 'Submit Feedback'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">How did it work?</p>
            <Button
              variant="outline"
              size="lg"
              onClick={() => handleVote('positive')}
              disabled={voteLoading}
              className="gap-2"
            >
              <ThumbsUp className="h-4 w-4" />
              Worked well
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => handleVote('negative')}
              disabled={voteLoading}
              className="gap-2"
            >
              <ThumbsDown className="h-4 w-4" />
              Needs work
            </Button>
          </div>
        )}
      </div>

      {/* Review Checklist - collapsible on mobile */}
      {prompt.review_checklist && (
        <>
          {/* Desktop view */}
          <Card className="hidden md:block">
            <CardHeader>
              <CardTitle className="text-lg">Review Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <SafeMarkdown>{prompt.review_checklist}</SafeMarkdown>
              </div>
            </CardContent>
          </Card>
          {/* Mobile collapsible */}
          <Collapsible open={checklistOpen} onOpenChange={setChecklistOpen} className="md:hidden">
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Review Checklist</CardTitle>
                    <ChevronDown
                      className={cn('h-5 w-5 transition-transform', checklistOpen && 'rotate-180')}
                    />
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <SafeMarkdown>{prompt.review_checklist}</SafeMarkdown>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        </>
      )}

      {/* Examples - collapsible on mobile */}
      {prompt.examples && prompt.examples.length > 0 && (
        <>
          {/* Desktop view */}
          <Card className="hidden md:block">
            <CardHeader>
              <CardTitle className="text-lg">Examples</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {prompt.examples.map((example, index) => (
                <div key={example.id} className="space-y-4">
                  {index > 0 && <hr className="border-muted" />}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="mb-2 text-sm font-medium text-destructive">Weak Version</p>
                      <pre className="whitespace-pre-wrap rounded-md bg-destructive/10 p-3 text-sm">
                        {example.weak_version}
                      </pre>
                      {example.weak_output && (
                        <>
                          <p className="mb-2 mt-3 text-xs font-medium text-muted-foreground">
                            Output:
                          </p>
                          <pre className="whitespace-pre-wrap rounded-md bg-muted p-3 text-xs">
                            {example.weak_output}
                          </pre>
                        </>
                      )}
                    </div>
                    <div>
                      <p className="mb-2 text-sm font-medium text-green-600">Strong Version</p>
                      <pre className="whitespace-pre-wrap rounded-md bg-green-500/10 p-3 text-sm">
                        {example.strong_version}
                      </pre>
                      {example.strong_output && (
                        <>
                          <p className="mb-2 mt-3 text-xs font-medium text-muted-foreground">
                            Output:
                          </p>
                          <pre className="whitespace-pre-wrap rounded-md bg-muted p-3 text-xs">
                            {example.strong_output}
                          </pre>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          {/* Mobile collapsible */}
          <Collapsible open={examplesOpen} onOpenChange={setExamplesOpen} className="md:hidden">
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Examples ({prompt.examples.length})</CardTitle>
                    <ChevronDown
                      className={cn('h-5 w-5 transition-transform', examplesOpen && 'rotate-180')}
                    />
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-6 pt-0">
                  {prompt.examples.map((example, index) => (
                    <div key={example.id} className="space-y-4">
                      {index > 0 && <hr className="border-muted" />}
                      <div className="space-y-4">
                        <div>
                          <p className="mb-2 text-sm font-medium text-destructive">Weak Version</p>
                          <pre className="whitespace-pre-wrap rounded-md bg-destructive/10 p-3 text-xs">
                            {example.weak_version}
                          </pre>
                          {example.weak_output && (
                            <>
                              <p className="mb-2 mt-3 text-xs font-medium text-muted-foreground">
                                Output:
                              </p>
                              <pre className="whitespace-pre-wrap rounded-md bg-muted p-3 text-xs">
                                {example.weak_output}
                              </pre>
                            </>
                          )}
                        </div>
                        <div>
                          <p className="mb-2 text-sm font-medium text-green-600">Strong Version</p>
                          <pre className="whitespace-pre-wrap rounded-md bg-green-500/10 p-3 text-xs">
                            {example.strong_version}
                          </pre>
                          {example.strong_output && (
                            <>
                              <p className="mb-2 mt-3 text-xs font-medium text-muted-foreground">
                                Output:
                              </p>
                              <pre className="whitespace-pre-wrap rounded-md bg-muted p-3 text-xs">
                                {example.strong_output}
                              </pre>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        </>
      )}

      {/* Mobile sticky bottom bar */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-background p-4 md:hidden">
        {!showVoting ? (
          <Button
            size="lg"
            disabled={!allRequiredFilled}
            onClick={handleCopy}
            className="min-h-12 w-full text-base"
          >
            {copied ? (
              <>
                <Check className="mr-2 h-5 w-5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-5 w-5" />
                Copy to Clipboard
              </>
            )}
          </Button>
        ) : showFeedbackInput ? (
          <div className="space-y-3">
            <Textarea
              placeholder="What could be improved?"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              className="min-h-[80px]"
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleCancelFeedback}
                disabled={voteLoading}
                className="min-h-11 flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleVote('negative')}
                disabled={voteLoading || !feedbackText.trim()}
                className="min-h-11 flex-1"
              >
                {voteLoading ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-center text-sm text-muted-foreground">How did it work?</p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleVote('positive')}
                disabled={voteLoading}
                className="min-h-12 flex-1 gap-2"
              >
                <ThumbsUp className="h-5 w-5" />
                Good
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleVote('negative')}
                disabled={voteLoading}
                className="min-h-12 flex-1 gap-2"
              >
                <ThumbsDown className="h-5 w-5" />
                Needs work
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
