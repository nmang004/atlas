import { ContributePage } from '@/components/contribute/ContributePage'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contribute - Share Skills & MCPs',
  description:
    'Contribute skills, system prompts, and MCP server configurations to the Atlas marketplace.',
}

export default function ContributePageRoute() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-xl font-bold md:text-2xl">Contribute</h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Share your skills and MCP server configurations with the community
        </p>
      </div>
      <ContributePage />
    </div>
  )
}
