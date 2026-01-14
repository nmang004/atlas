import Fuse, { type IFuseOptions } from 'fuse.js'

import type { SMEContent } from './mdx'

export interface SearchResult {
  slug: string
  title: string
  description: string
  category: string
  tags: string[]
  matches?: {
    key: string
    value: string
    indices: [number, number][]
  }[]
}

export interface SearchIndex {
  slug: string
  title: string
  description: string
  category: string
  tags: string[]
  content: string
}

/**
 * Build search index from content
 */
export function buildSearchIndex(content: SMEContent[]): SearchIndex[] {
  return content.map((item) => ({
    slug: item.slug,
    title: item.frontmatter.title,
    description: item.frontmatter.description,
    category: item.frontmatter.category,
    tags: item.frontmatter.tags || [],
    // Strip MDX components and markdown for plain text search
    content: item.content
      .replace(/<[^>]+>/g, '') // Remove JSX/HTML tags
      .replace(/\{[^}]+\}/g, '') // Remove JSX expressions
      .replace(/#+\s/g, '') // Remove markdown headers
      .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold
      .replace(/\*([^*]+)\*/g, '$1') // Remove italic
      .replace(/`[^`]+`/g, '') // Remove inline code
      .replace(/\n+/g, ' ') // Collapse newlines
      .trim(),
  }))
}

const fuseOptions: IFuseOptions<SearchIndex> = {
  keys: [
    { name: 'title', weight: 2 },
    { name: 'description', weight: 1.5 },
    { name: 'tags', weight: 1.5 },
    { name: 'content', weight: 1 },
  ],
  threshold: 0.3,
  includeMatches: true,
  minMatchCharLength: 2,
  ignoreLocation: true,
}

/**
 * Create Fuse instance for searching
 */
export function createSearchInstance(index: SearchIndex[]): Fuse<SearchIndex> {
  return new Fuse(index, fuseOptions)
}

/**
 * Search content
 */
export function searchContent(fuse: Fuse<SearchIndex>, query: string): SearchResult[] {
  const results = fuse.search(query, { limit: 10 })

  return results.map((result) => ({
    slug: result.item.slug,
    title: result.item.title,
    description: result.item.description,
    category: result.item.category,
    tags: result.item.tags,
    matches: result.matches?.map((match) => ({
      key: match.key || '',
      value: match.value || '',
      indices: match.indices as [number, number][],
    })),
  }))
}
