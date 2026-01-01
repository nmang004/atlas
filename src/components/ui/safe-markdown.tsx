'use client'

import ReactMarkdown from 'react-markdown'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'

interface SafeMarkdownProps {
  children: string
  className?: string
}

/**
 * Secure markdown renderer with XSS protection.
 *
 * Uses rehype-sanitize to prevent XSS attacks from user-generated content.
 * All HTML is sanitized according to a strict schema that only allows
 * safe elements and attributes.
 */
export function SafeMarkdown({ children, className }: SafeMarkdownProps) {
  return (
    <ReactMarkdown
      className={className}
      rehypePlugins={[
        [
          rehypeSanitize,
          {
            ...defaultSchema,
            // Explicitly allow only safe elements
            tagNames: [
              'h1',
              'h2',
              'h3',
              'h4',
              'h5',
              'h6',
              'p',
              'a',
              'ul',
              'ol',
              'li',
              'blockquote',
              'pre',
              'code',
              'em',
              'strong',
              'del',
              'br',
              'hr',
              'table',
              'thead',
              'tbody',
              'tr',
              'th',
              'td',
            ],
            // Restrict attributes
            attributes: {
              ...defaultSchema.attributes,
              a: ['href', 'title'],
              // Remove all other attributes from other elements
              '*': [],
            },
            // Only allow safe protocols for links
            protocols: {
              href: ['http', 'https', 'mailto'],
            },
          },
        ],
      ]}
    >
      {children}
    </ReactMarkdown>
  )
}
