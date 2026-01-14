import fs from 'fs'
import path from 'path'

import matter from 'gray-matter'
import readingTime from 'reading-time'

export interface SMEFrontmatter {
  title: string
  description: string
  category: string
  order: number
  tags: string[]
  verticals: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  readingTime?: number
  lastUpdated: string
}

export interface SMEContent {
  slug: string
  frontmatter: SMEFrontmatter
  content: string
  readingTime: {
    text: string
    minutes: number
  }
}

export interface SMENavItem {
  slug: string
  title: string
  description?: string
  order: number
  children?: SMENavItem[]
}

const CONTENT_DIR = path.join(process.cwd(), 'content', 'sme')

/**
 * Get all MDX files recursively from the content directory
 */
export function getAllContentPaths(): string[] {
  const paths: string[] = []

  function walkDir(dir: string, basePath: string = '') {
    if (!fs.existsSync(dir)) {return}

    const files = fs.readdirSync(dir)

    for (const file of files) {
      const filePath = path.join(dir, file)
      const stat = fs.statSync(filePath)

      if (stat.isDirectory()) {
        walkDir(filePath, path.join(basePath, file))
      } else if (file.endsWith('.mdx')) {
        const slug = path.join(basePath, file.replace('.mdx', '')).replace(/\\/g, '/')
        paths.push(slug === 'index' ? '' : slug.replace(/\/index$/, ''))
      }
    }
  }

  walkDir(CONTENT_DIR)
  return paths
}

/**
 * Get content for a specific slug
 */
export function getContentBySlug(slug: string): SMEContent | null {
  // Try exact path first, then index file
  const possiblePaths = [
    path.join(CONTENT_DIR, `${slug}.mdx`),
    path.join(CONTENT_DIR, slug, 'index.mdx'),
    path.join(CONTENT_DIR, 'index.mdx'), // For root
  ]

  for (const filePath of possiblePaths) {
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      const { data, content } = matter(fileContent)
      const stats = readingTime(content)

      return {
        slug: slug || 'index',
        frontmatter: data as SMEFrontmatter,
        content,
        readingTime: {
          text: stats.text,
          minutes: Math.ceil(stats.minutes),
        },
      }
    }
  }

  return null
}

/**
 * Get all content with frontmatter for search indexing
 */
export function getAllContent(): SMEContent[] {
  const paths = getAllContentPaths()
  const content: SMEContent[] = []

  for (const slug of paths) {
    const item = getContentBySlug(slug)
    if (item) {
      content.push(item)
    }
  }

  return content
}

/**
 * Build navigation tree from content
 */
export function getNavigation(): SMENavItem[] {
  const allContent = getAllContent()

  // Group content by category
  const categories: Record<string, SMENavItem[]> = {}

  for (const item of allContent) {
    const category = item.frontmatter.category || 'uncategorized'
    if (!categories[category]) {
      categories[category] = []
    }
    categories[category].push({
      slug: item.slug,
      title: item.frontmatter.title,
      description: item.frontmatter.description,
      order: item.frontmatter.order || 0,
    })
  }

  // Sort items within each category
  for (const category in categories) {
    categories[category].sort((a, b) => a.order - b.order)
  }

  // Define category order
  const categoryOrder = [
    'getting-started',
    'core-principles',
    'page-playbooks',
    'verticals',
    'technical',
    'trends-2025',
    'reference',
    'tools',
  ]

  const categoryTitles: Record<string, string> = {
    'getting-started': 'Getting Started',
    'core-principles': 'Core Principles',
    'page-playbooks': 'Page Playbooks',
    verticals: 'Verticals',
    technical: 'Technical',
    'trends-2025': '2025 Trends',
    reference: 'Reference',
    tools: 'Tools',
  }

  // Build navigation tree
  const nav: SMENavItem[] = []

  for (const category of categoryOrder) {
    if (categories[category] && categories[category].length > 0) {
      nav.push({
        slug: category,
        title: categoryTitles[category] || category,
        order: categoryOrder.indexOf(category),
        children: categories[category],
      })
    }
  }

  return nav
}
