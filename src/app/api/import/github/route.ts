import { NextResponse } from 'next/server'

import { z } from 'zod'

import { requireAuth } from '@/lib/auth'
import { parseSkillFrontmatter, isValidSkillFile } from '@/lib/frontmatter'

const importGithubSchema = z.object({
  url: z.string().url(),
})

interface GitHubFile {
  name: string
  path: string
  type: string
  download_url: string | null
}

interface ParsedFile {
  name: string
  path: string
  raw: string
  frontmatter: Record<string, unknown>
  content: string
  is_valid: boolean
}

function parseGitHubUrl(url: string): {
  owner: string
  repo: string
  path: string
  type: 'file' | 'directory'
  branch: string | null
} | null {
  try {
    const parsed = new URL(url)
    if (parsed.hostname !== 'github.com') {
      return null
    }

    const parts = parsed.pathname.replace(/^\//, '').replace(/\/$/, '').split('/')
    if (parts.length < 2) {
      return null
    }

    const owner = parts[0]
    const repo = parts[1]

    // github.com/owner/repo — root directory
    if (parts.length === 2) {
      return { owner, repo, path: '', type: 'directory', branch: null }
    }

    // github.com/owner/repo/blob/branch/path — file
    if (parts[2] === 'blob' && parts.length >= 4) {
      const branch = parts[3]
      const path = parts.slice(4).join('/')
      return { owner, repo, path, type: 'file', branch }
    }

    // github.com/owner/repo/tree/branch/path — directory
    if (parts[2] === 'tree' && parts.length >= 4) {
      const branch = parts[3]
      const path = parts.slice(4).join('/')
      return { owner, repo, path, type: 'directory', branch }
    }

    return null
  } catch {
    return null
  }
}

async function fetchRawContent(
  owner: string,
  repo: string,
  path: string,
  branch: string
): Promise<string | null> {
  const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`
  const response = await fetch(url)
  if (!response.ok) {
    return null
  }
  return response.text()
}

async function fetchDirectoryContents(
  owner: string,
  repo: string,
  path: string,
  branch: string
): Promise<GitHubFile[] | null> {
  const url = path
    ? `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`
    : `https://api.github.com/repos/${owner}/${repo}/contents?ref=${branch}`
  const response = await fetch(url, {
    headers: { Accept: 'application/vnd.github.v3+json' },
  })
  if (!response.ok) {
    return null
  }
  return response.json()
}

async function fetchWithBranchFallback<T>(
  fn: (branch: string) => Promise<T | null>,
  preferredBranch: string | null
): Promise<T | null> {
  const branches = preferredBranch ? [preferredBranch] : ['main', 'master']

  for (const branch of branches) {
    const result = await fn(branch)
    if (result !== null) {
      return result
    }
  }
  return null
}

export async function POST(request: Request) {
  try {
    const authResult = await requireAuth()
    if (!authResult.success) {
      return authResult.response
    }

    const body = await request.json()
    const result = importGithubSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: result.error.issues },
        { status: 400 }
      )
    }

    const parsed = parseGitHubUrl(result.data.url)
    if (!parsed) {
      return NextResponse.json(
        {
          error:
            'Invalid GitHub URL. Expected format: github.com/owner/repo[/blob|tree/branch/path]',
        },
        { status: 400 }
      )
    }

    const { owner, repo, path, type, branch } = parsed
    const files: ParsedFile[] = []

    if (type === 'file') {
      const raw = await fetchWithBranchFallback(
        (b) => fetchRawContent(owner, repo, path, b),
        branch
      )

      if (!raw) {
        return NextResponse.json({ error: 'Failed to fetch file from GitHub' }, { status: 404 })
      }

      const parsedFile = parseSkillFrontmatter(raw)
      files.push({
        name: path.split('/').pop() || path,
        path,
        raw,
        frontmatter: parsedFile.frontmatter,
        content: parsedFile.content,
        is_valid: isValidSkillFile(raw),
      })
    } else {
      // Directory listing
      const contents = await fetchWithBranchFallback(
        (b) => fetchDirectoryContents(owner, repo, path, b),
        branch
      )

      if (!contents) {
        return NextResponse.json(
          { error: 'Failed to fetch directory from GitHub' },
          { status: 404 }
        )
      }

      const mdFiles = contents.filter(
        (f: GitHubFile) => f.type === 'file' && f.name.endsWith('.md')
      )

      // Determine the branch that worked for the directory listing
      const effectiveBranch = branch || 'main'

      for (const file of mdFiles) {
        const raw = await fetchWithBranchFallback(
          (b) => fetchRawContent(owner, repo, file.path, b),
          effectiveBranch
        )

        if (!raw) {
          continue
        }

        const parsedFile = parseSkillFrontmatter(raw)
        files.push({
          name: file.name,
          path: file.path,
          raw,
          frontmatter: parsedFile.frontmatter,
          content: parsedFile.content,
          is_valid: isValidSkillFile(raw),
        })
      }
    }

    return NextResponse.json({ files })
  } catch (error) {
    console.error('GitHub import API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
