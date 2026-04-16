interface SkillFrontmatter {
  name?: string
  description?: string
  [key: string]: unknown
}

interface ParsedSkillFile {
  frontmatter: SkillFrontmatter
  content: string
  raw: string
}

export function parseSkillFrontmatter(raw: string): ParsedSkillFile {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
  const match = raw.match(frontmatterRegex)

  if (!match) {
    return {
      frontmatter: {},
      content: raw,
      raw,
    }
  }

  const [, frontmatterBlock, content] = match
  const frontmatter: SkillFrontmatter = {}

  for (const line of frontmatterBlock.split('\n')) {
    const colonIndex = line.indexOf(':')
    if (colonIndex === -1) {
      continue
    }
    const key = line.slice(0, colonIndex).trim()
    const value = line.slice(colonIndex + 1).trim()
    if (key && value) {
      frontmatter[key] = value
    }
  }

  return { frontmatter, content: content.trim(), raw }
}

export function isValidSkillFile(raw: string): boolean {
  const parsed = parseSkillFrontmatter(raw)
  return Boolean(parsed.frontmatter.name || parsed.frontmatter.description)
}
