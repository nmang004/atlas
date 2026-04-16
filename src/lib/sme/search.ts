// fuse.js dep removed (Task 8). SME hub deleted in Plan 3.

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
 * NOTE: fuse.js dep removed. SME hub deleted in Plan 3.
 */
export function buildSearchIndex(_content: SMEContent[]): SearchIndex[] {
  return []
}
