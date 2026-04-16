'use client'

import { useMutation } from '@tanstack/react-query'

interface ImportedFile {
  name: string
  path: string
  raw: string
  frontmatter: Record<string, unknown>
  content: string
  is_valid: boolean
}

export function useGithubImport() {
  return useMutation({
    mutationFn: async (url: string) => {
      const res = await fetch('/api/import/github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Import failed')
      }
      const data = await res.json()
      return data.files as ImportedFile[]
    },
  })
}
