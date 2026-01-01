'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2, GripVertical, ChevronDown } from 'lucide-react'
import { useForm, useFieldArray } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
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
import { cn } from '@/lib/utils'
import type { PromptWithDetails, Category } from '@/types'

const variableSchema = z.object({
  id: z.string().optional(),
  key: z.string().min(1, 'Key is required'),
  label: z.string().min(1, 'Label is required'),
  type: z.enum(['text', 'textarea', 'select']),
  placeholder: z.string().optional(),
  is_required: z.boolean().default(false),
  options: z.array(z.string()).default([]),
  order_index: z.number().default(0),
})

const promptSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  content: z.string().min(1, 'Content is required'),
  category_id: z.string().optional().nullable(),
  tags: z.string().optional(),
  model_version: z.string().optional(),
  data_requirements: z.string().optional(),
  review_checklist: z.string().optional(),
  variables: z.array(variableSchema).default([]),
})

type PromptFormData = z.infer<typeof promptSchema>

interface PromptFormProps {
  prompt?: PromptWithDetails
  categories: Category[]
  mode: 'create' | 'edit'
}

export function PromptForm({ prompt, categories, mode }: PromptFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [additionalOpen, setAdditionalOpen] = useState(false)

  const defaultValues: PromptFormData = {
    title: prompt?.title ?? '',
    content: prompt?.content ?? '',
    category_id: prompt?.category_id ?? null,
    tags: prompt?.tags?.join(', ') ?? '',
    model_version: prompt?.model_version ?? '',
    data_requirements: prompt?.data_requirements ?? '',
    review_checklist: prompt?.review_checklist ?? '',
    variables:
      prompt?.variables?.map((v, idx) => ({
        id: v.id,
        key: v.key,
        label: v.label,
        type: v.type,
        placeholder: v.placeholder ?? '',
        is_required: v.is_required,
        options: Array.isArray(v.options)
          ? v.options.filter((o): o is string => typeof o === 'string')
          : [],
        order_index: v.order_index ?? idx,
      })) ?? [],
  }

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PromptFormData>({
    resolver: zodResolver(promptSchema),
    defaultValues,
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variables',
  })

  const detectVariables = () => {
    const content = watch('content')
    const regex = /\{\{(\w+)\}\}/g
    const existingKeys = fields.map((f) => f.key)
    const foundKeys: string[] = []

    let match: RegExpExecArray | null
    while ((match = regex.exec(content)) !== null) {
      const key = match[1]
      if (!existingKeys.includes(key) && !foundKeys.includes(key)) {
        foundKeys.push(key)
        append({
          key,
          label: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
          type: 'text',
          placeholder: '',
          is_required: false,
          options: [],
          order_index: fields.length + foundKeys.length - 1,
        })
      }
    }

    toast({
      title: 'Variables detected',
      description: `Found ${foundKeys.length} new variable(s) in content.`,
    })
  }

  const onSubmit = async (data: PromptFormData) => {
    setIsSubmitting(true)

    try {
      const tags = data.tags
        ? data.tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : []

      const payload = {
        title: data.title,
        content: data.content,
        category_id: data.category_id || null,
        tags,
        model_version: data.model_version || null,
        data_requirements: data.data_requirements || null,
        review_checklist: data.review_checklist || null,
        variables: data.variables.map((v, idx) => ({
          ...v,
          order_index: idx,
          options: v.type === 'select' ? v.options : [],
        })),
      }

      const url = mode === 'edit' ? `/api/prompts/${prompt?.id}` : '/api/prompts'

      const response = await fetch(url, {
        method: mode === 'edit' ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save prompt')
      }

      const result = await response.json()

      toast({
        title: mode === 'edit' ? 'Prompt updated' : 'Prompt created',
        description: 'Your changes have been saved.',
      })

      router.push(`/prompts/${result.prompt?.id || prompt?.id}`)
      router.refresh()
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save prompt',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pb-24 md:space-y-6 md:pb-6">
      <Card>
        <CardHeader className="pb-2 md:pb-4">
          <CardTitle className="text-base md:text-lg">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Enter prompt title"
              className="min-h-11"
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={watch('category_id') ?? 'none'}
                onValueChange={(value) => setValue('category_id', value === 'none' ? null : value)}
              >
                <SelectTrigger className="min-h-11">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No category</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="model_version">Model Version</Label>
              <Input
                id="model_version"
                {...register('model_version')}
                placeholder="e.g., GPT-4, Claude 3"
                className="min-h-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              {...register('tags')}
              placeholder="seo, client, technical"
              className="min-h-11"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2 md:pb-4">
          <CardTitle className="text-base md:text-lg">Prompt Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <Label htmlFor="content">Content *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={detectVariables}
                className="min-h-10 w-full sm:w-auto"
              >
                Detect Variables
              </Button>
            </div>
            <Textarea
              id="content"
              {...register('content')}
              placeholder="Enter your prompt content. Use {{variable_name}} for dynamic variables."
              className="min-h-[200px] font-mono text-sm"
            />
            {errors.content && <p className="text-sm text-destructive">{errors.content.message}</p>}
            <p className="text-xs text-muted-foreground md:text-sm">
              Use {`{{variable_name}}`} syntax for dynamic variables that users can fill in.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2 md:pb-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-base md:text-lg">Variables</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                append({
                  key: '',
                  label: '',
                  type: 'text',
                  placeholder: '',
                  is_required: false,
                  options: [],
                  order_index: fields.length,
                })
              }
              className="min-h-10 w-full sm:w-auto"
            >
              <Plus className="mr-1 h-4 w-4" />
              Add Variable
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {fields.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No variables defined. Add variables or use &quot;Detect Variables&quot; to scan
              content.
            </p>
          ) : (
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="rounded-lg border p-3 md:p-4">
                  {/* Mobile: stacked layout */}
                  <div className="flex items-start gap-2 md:gap-4">
                    <div className="hidden items-center pt-6 md:flex">
                      <GripVertical className="h-5 w-5 cursor-move text-muted-foreground" />
                    </div>
                    <div className="flex-1 space-y-3 md:space-y-4">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label className="text-sm">Key *</Label>
                          <Input
                            {...register(`variables.${index}.key`)}
                            placeholder="variable_key"
                            className="min-h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm">Label *</Label>
                          <Input
                            {...register(`variables.${index}.label`)}
                            placeholder="Variable Label"
                            className="min-h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm">Type</Label>
                          <Select
                            value={watch(`variables.${index}.type`)}
                            onValueChange={(value) =>
                              setValue(
                                `variables.${index}.type`,
                                value as 'text' | 'textarea' | 'select'
                              )
                            }
                          >
                            <SelectTrigger className="min-h-11">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="text">Text</SelectItem>
                              <SelectItem value="textarea">Textarea</SelectItem>
                              <SelectItem value="select">Select</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label className="text-sm">Placeholder</Label>
                          <Input
                            {...register(`variables.${index}.placeholder`)}
                            placeholder="Enter placeholder text"
                            className="min-h-11"
                          />
                        </div>
                        <div className="flex items-end space-x-3 pb-2">
                          <Checkbox
                            id={`required-${index}`}
                            checked={watch(`variables.${index}.is_required`)}
                            onCheckedChange={(checked) =>
                              setValue(`variables.${index}.is_required`, checked as boolean)
                            }
                            className="h-5 w-5"
                          />
                          <Label htmlFor={`required-${index}`} className="text-sm">
                            Required
                          </Label>
                        </div>
                      </div>

                      {watch(`variables.${index}.type`) === 'select' && (
                        <div className="space-y-2">
                          <Label className="text-sm">Options (comma-separated)</Label>
                          <Input
                            value={watch(`variables.${index}.options`)?.join(', ') ?? ''}
                            onChange={(e) =>
                              setValue(
                                `variables.${index}.options`,
                                e.target.value
                                  .split(',')
                                  .map((o) => o.trim())
                                  .filter(Boolean)
                              )
                            }
                            placeholder="Option 1, Option 2, Option 3"
                            className="min-h-11"
                          />
                        </div>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className="min-h-11 min-w-11 shrink-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Details - collapsible on mobile */}
      <>
        {/* Desktop view */}
        <Card className="hidden md:block">
          <CardHeader>
            <CardTitle className="text-lg">Additional Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="data_requirements">Data Requirements (Markdown)</Label>
              <Textarea
                id="data_requirements"
                {...register('data_requirements')}
                placeholder="List what data or information is needed before using this prompt..."
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="review_checklist">Review Checklist (Markdown)</Label>
              <Textarea
                id="review_checklist"
                {...register('review_checklist')}
                placeholder="- [ ] Check for accuracy&#10;- [ ] Verify client name&#10;- [ ] Review tone"
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Mobile collapsible */}
        <Collapsible open={additionalOpen} onOpenChange={setAdditionalOpen} className="md:hidden">
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Additional Details</CardTitle>
                  <ChevronDown
                    className={cn('h-5 w-5 transition-transform', additionalOpen && 'rotate-180')}
                  />
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4 pt-0">
                <div className="space-y-2">
                  <Label htmlFor="data_requirements_mobile">Data Requirements (Markdown)</Label>
                  <Textarea
                    id="data_requirements_mobile"
                    {...register('data_requirements')}
                    placeholder="List what data or information is needed..."
                    className="min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="review_checklist_mobile">Review Checklist (Markdown)</Label>
                  <Textarea
                    id="review_checklist_mobile"
                    {...register('review_checklist')}
                    placeholder="- [ ] Check for accuracy"
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      </>

      {/* Desktop buttons */}
      <div className="hidden justify-end gap-4 md:flex">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="min-h-11"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="min-h-11">
          {isSubmitting ? 'Saving...' : mode === 'edit' ? 'Update Prompt' : 'Create Prompt'}
        </Button>
      </div>

      {/* Mobile sticky buttons */}
      <div className="fixed inset-x-0 bottom-0 z-50 flex gap-2 border-t bg-background p-4 md:hidden">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="min-h-12 flex-1"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="min-h-12 flex-1">
          {isSubmitting ? 'Saving...' : mode === 'edit' ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  )
}
