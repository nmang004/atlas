import { SkillDetailContent } from '@/components/skills/SkillDetailContent'
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
  const { data } = await (supabase.from('skills') as any)
    .select('title, description')
    .eq('slug', slug)
    .single()

  const skill = data as { title: string; description: string | null } | null

  if (!skill) {
    return {
      title: 'Skill Not Found',
    }
  }

  return {
    title: `${skill.title} - Skill`,
    description: skill.description?.slice(0, 155) || `Details and installation for ${skill.title}`,
  }
}

export default async function SkillDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  return <SkillDetailContent slug={slug} />
}
