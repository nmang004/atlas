import { McpsContent } from '@/components/mcps/McpsContent'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MCPs Library - Browse & Install MCP Servers',
  description:
    'Browse and install MCP (Model Context Protocol) servers for Claude Code and other AI tools. Search by server type, category, and tags.',
}

export default function McpsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-xl font-bold md:text-2xl">MCPs Library</h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Browse and install MCP servers for Claude Code and other AI tools
        </p>
      </div>
      <McpsContent />
    </div>
  )
}
