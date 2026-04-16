import { type NextRequest, NextResponse } from 'next/server'

import { z } from 'zod'

import { requireAuth } from '@/lib/auth'
import { generateSlug } from '@/lib/slug'
import { createClient } from '@/lib/supabase/server'

// Pagination constants
const DEFAULT_PAGE_SIZE = 12
const MAX_PAGE_SIZE = 50

// GET /api/mcps - Fetch paginated MCPs
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
    const serverType = searchParams.get('server_type')
    const tag = searchParams.get('tag')

    // Build query
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query = (supabase.from('mcps') as any)
      .select(
        `
        id,
        title,
        slug,
        description,
        server_type,
        tags,
        created_at,
        category_id,
        category:categories(name),
        author:users!mcps_created_by_fkey(name)
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

    // Apply server_type filter
    if (serverType) {
      query = query.eq('server_type', serverType)
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
      console.error('MCPs fetch error:', error)
      return NextResponse.json({ error: 'Failed to fetch MCPs' }, { status: 500 })
    }

    interface McpRow {
      id: string
      title: string
      slug: string
      description: string | null
      server_type: string | null
      tags: string[] | null
      created_at: string
      category_id: string | null
      category: { name: string } | null
      author: { name: string } | null
    }

    const mcps = (data as McpRow[]) || []

    // Check if there are more items
    const hasMore = mcps.length > limit
    const items = hasMore ? mcps.slice(0, limit) : mcps

    // Get the cursor for the next page
    const nextCursor = hasMore && items.length > 0 ? items[items.length - 1].created_at : null

    return NextResponse.json({
      mcps: items.map((mcp) => ({
        id: mcp.id,
        title: mcp.title,
        slug: mcp.slug,
        description: mcp.description,
        server_type: mcp.server_type,
        tags: mcp.tags || [],
        created_at: mcp.created_at,
        category_id: mcp.category_id,
        category_name: mcp.category?.name || null,
        author_name: mcp.author?.name || null,
      })),
      nextCursor,
      hasMore,
    })
  } catch (error) {
    console.error('MCPs API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

const createMcpSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional().nullable(),
  content: z.string().max(50000).optional().nullable(),
  config_json: z.record(z.unknown()).optional().nullable(),
  server_type: z.enum(['stdio', 'sse', 'http', 'websocket']).optional().nullable(),
  category_id: z.string().uuid().optional().nullable(),
  tags: z.array(z.string().max(50)).max(20).default([]),
  source_url: z.string().url().max(2000).optional().nullable(),
})

// POST /api/mcps - Create an MCP
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
    const result = createMcpSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: result.error.issues },
        { status: 400 }
      )
    }

    const data = result.data

    // Generate unique slug from title
    const baseSlug = generateSlug(data.title)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: existingSlugs } = await (supabase.from('mcps') as any)
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

    // Create MCP
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: mcp, error: mcpError } = await (supabase.from('mcps') as any)
      .insert({
        title: data.title,
        slug,
        description: data.description || null,
        content: data.content || null,
        config_json: data.config_json || null,
        server_type: data.server_type || null,
        category_id: data.category_id || null,
        tags: data.tags,
        source_url: data.source_url || null,
        is_published: isPublished,
        created_by: user.id,
      })
      .select()
      .single()

    if (mcpError || !mcp) {
      console.error('MCP creation error:', mcpError)
      return NextResponse.json({ error: 'Failed to create MCP' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      mcp,
    })
  } catch (error) {
    console.error('Create MCP API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
