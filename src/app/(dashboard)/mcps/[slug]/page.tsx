import { McpDetailContent } from '@/components/mcps/McpDetailContent'
import { createClient } from '@/lib/supabase/server'

import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase.from('mcps') as any)
    .select('title, description')
    .eq('slug', slug)
    .single()

  const mcp = data as { title: string; description: string | null } | null

  if (!mcp) {
    return {
      title: 'MCP Not Found',
    }
  }

  return {
    title: `${mcp.title} - MCP Server`,
    description: mcp.description?.slice(0, 155) || `Details and installation for ${mcp.title}`,
  }
}

export default async function McpDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  return <McpDetailContent slug={slug} />
}
