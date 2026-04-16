import { type NextRequest, NextResponse } from 'next/server'

import { z } from 'zod'

import { requireAuth } from '@/lib/auth'
import { parseSkillFrontmatter } from '@/lib/frontmatter'
import { generateSlug } from '@/lib/slug'
import { createClient } from '@/lib/supabase/server'

// Pagination constants
const DEFAULT_PAGE_SIZE = 12
const MAX_PAGE_SIZE = 50

// GET /api/skills - Fetch paginated skills
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    // Parse pagination params
    const cursor = searchParams.get('cursor') // created_at of last item
    const limit = Math.min(
      parseInt(searchParams.get('limit') || String(DEFAULT_PAGE_SIZE), 10),
      MAX_PAGE_SIZE
    )
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const format = searchParams.get('format')
    const tag = searchParams.get('tag')

    // Build query
    let query = supabase
      .from('skills')
      .select(
        `
        id,
        title,
        slug,
        description,
        format,
        tags,
        created_at,
        category_id,
        category:categories(name),
        author:users!skills_created_by_fkey(name)
      `
      )
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(limit + 1) // Fetch one extra to check if there are more

    // Apply cursor-based pagination
    if (cursor) {
      query = query.lt('created_at', cursor)
    }

    // Apply category filter
    if (category) {
      query = query.eq('category_id', category)
    }

    // Apply format filter
    if (format) {
      query = query.eq('format', format)
    }

    // Apply tag filter
    if (tag) {
      query = query.contains('tags', [tag])
    }

    // Apply search filter (case-insensitive)
    if (search?.trim()) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error('Skills fetch error:', error)
      return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 })
    }

    interface SkillRow {
      id: string
      title: string
      slug: string
      description: string | null
      format: string | null
      tags: string[] | null
      created_at: string
      category_id: string | null
      category: { name: string } | null
      author: { name: string } | null
    }

    const skills = (data as SkillRow[]) || []

    // Check if there are more items
    const hasMore = skills.length > limit
    const items = hasMore ? skills.slice(0, limit) : skills

    // Get the cursor for the next page
    const nextCursor = hasMore && items.length > 0 ? items[items.length - 1].created_at : null

    return NextResponse.json({
      skills: items.map((skill) => ({
        id: skill.id,
        title: skill.title,
        slug: skill.slug,
        description: skill.description,
        format: skill.format,
        tags: skill.tags || [],
        created_at: skill.created_at,
        category_id: skill.category_id,
        category_name: skill.category?.name || null,
        author_name: skill.author?.name || null,
      })),
      nextCursor,
      hasMore,
    })
  } catch (error) {
    console.error('Skills API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

const createSkillSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional().nullable(),
  content: z.string().max(50000).optional().nullable(),
  raw_file: z.string().max(100000).optional().nullable(),
  format: z.enum(['markdown', 'yaml', 'json', 'text', 'xml']).optional().nullable(),
  category_id: z.string().uuid().optional().nullable(),
  tags: z.array(z.string().max(50)).max(20).default([]),
  source_url: z.string().url().max(2000).optional().nullable(),
})

// POST /api/skills - Create a skill
export async function POST(request: NextRequest) {
  try {
    // Check authentication (any authenticated user can create)
    const authResult = await requireAuth()
    if (!authResult.success) {
      return authResult.response
    }

    const user = authResult.user
    const supabase = await createClient()

    // Parse and validate request body
    const body = await request.json()
    const result = createSkillSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: result.error.issues },
        { status: 400 }
      )
    }

    const data = result.data

    // Parse frontmatter from raw_file if provided
    let content = data.content || null
    let description = data.description || null
    if (data.raw_file) {
      const parsed = parseSkillFrontmatter(data.raw_file)
      if (!content) {
        content = parsed.content
      }
      if (!description && parsed.frontmatter.description) {
        description = String(parsed.frontmatter.description)
      }
    }

    // Generate unique slug from title
    const baseSlug = generateSlug(data.title)
    const { data: existingSlugs } = await supabase
      .from('skills')
      .select('slug')
      .like('slug', `${baseSlug}%`)
    const takenSlugs = (existingSlugs || []).map((r: { slug: string }) => r.slug)
    let slug = baseSlug
    if (takenSlugs.includes(slug)) {
      let counter = 1
      while (takenSlugs.includes(`${baseSlug}-${counter}`)) {
        counter++
      }
      slug = `${baseSlug}-${counter}`
    }

    // Auto-publish if user is admin, otherwise is_published: false
    const isPublished = user.role === 'admin'

    // Create skill
    const { data: skill, error: skillError } = await supabase
      .from('skills')
      .insert({
        title: data.title,
        slug,
        description,
        content,
        raw_file: data.raw_file || null,
        format: data.format || undefined,
        category_id: data.category_id || null,
        tags: data.tags,
        source_url: data.source_url || null,
        is_published: isPublished,
        created_by: user.id,
      })
      .select()
      .single()

    if (skillError || !skill) {
      console.error('Skill creation error:', skillError)
      return NextResponse.json({ error: 'Failed to create skill' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      skill,
    })
  } catch (error) {
    console.error('Create skill API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
