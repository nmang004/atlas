'use client'

import { FileUpload } from '@/components/contribute/FileUpload'
import { GithubImport } from '@/components/contribute/GithubImport'
import { McpForm } from '@/components/contribute/McpForm'
import { SkillForm } from '@/components/contribute/SkillForm'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function ContributePage() {
  return (
    <Tabs defaultValue="paste" className="space-y-6">
      <TabsList>
        <TabsTrigger value="paste">Paste Skill</TabsTrigger>
        <TabsTrigger value="upload">Upload Files</TabsTrigger>
        <TabsTrigger value="github">GitHub Import</TabsTrigger>
        <TabsTrigger value="mcp">MCP Config</TabsTrigger>
      </TabsList>

      <TabsContent value="paste">
        <SkillForm />
      </TabsContent>

      <TabsContent value="upload">
        <FileUpload />
      </TabsContent>

      <TabsContent value="github">
        <GithubImport />
      </TabsContent>

      <TabsContent value="mcp">
        <McpForm />
      </TabsContent>
    </Tabs>
  )
}
