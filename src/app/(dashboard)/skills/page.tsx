import { SkillsContent } from '@/components/skills/SkillsContent'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Skills Library - Browse & Install Skills',
  description:
    'Browse and install Claude Code skills, system prompts, and custom skill files. Search by format, category, and tags.',
}

export default function SkillsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-xl font-bold md:text-2xl">Skills Library</h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Browse and install skills for Claude Code and other AI tools
        </p>
      </div>
      <SkillsContent />
    </div>
  )
}
