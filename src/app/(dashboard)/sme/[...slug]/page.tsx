import { notFound } from 'next/navigation'

import { Clock, Calendar, Tag } from 'lucide-react'
import { MDXRemote } from 'next-mdx-remote/rsc'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'

import {
  Callout,
  ComparisonTable,
  SampleContent,
  InteractiveChecklist,
  CharacterCounter,
} from '@/components/sme/mdx'
import { SMEBreadcrumbs } from '@/components/sme/SMEBreadcrumbs'
import { SMETableOfContents } from '@/components/sme/SMETableOfContents'
import { getContentBySlug, getAllContentPaths } from '@/lib/sme/mdx'

interface PageProps {
  params: Promise<{
    slug: string[]
  }>
}

// MDX components mapping
const components = {
  Callout,
  ComparisonTable,
  SampleContent,
  InteractiveChecklist,
  CharacterCounter,
  // Style overrides for MDX elements
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="scroll-m-20 text-3xl font-bold tracking-tight mb-6" {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight mt-10 mb-4 first:mt-0"
      {...props}
    />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="scroll-m-20 text-xl font-semibold tracking-tight mt-8 mb-4" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="leading-7 [&:not(:first-child)]:mt-4" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="my-6 ml-6 list-disc [&>li]:mt-2" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="my-6 ml-6 list-decimal [&>li]:mt-2" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => <li className="leading-7" {...props} />,
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="mt-6 border-l-4 border-primary pl-6 italic" {...props} />
  ),
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 w-full overflow-y-auto">
      <table className="w-full" {...props} />
    </div>
  ),
  th: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right"
      {...props}
    />
  ),
  td: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td
      className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right"
      {...props}
    />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code
      className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm"
      {...props}
    />
  ),
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre
      className="mb-4 mt-6 overflow-x-auto rounded-lg border bg-muted p-4 font-mono text-sm"
      {...props}
    />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a className="text-primary underline underline-offset-4 hover:no-underline" {...props} />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-semibold" {...props} />
  ),
  hr: () => <hr className="my-8 border-t" />,
}

export async function generateStaticParams() {
  const paths = getAllContentPaths()
  return paths.map((slug) => ({
    slug: slug.split('/').filter(Boolean),
  }))
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const slugPath = slug.join('/')
  const content = getContentBySlug(slugPath)

  if (!content) {
    return { title: 'Not Found | SME Knowledge Base' }
  }

  return {
    title: `${content.frontmatter.title} | SME Knowledge Base`,
    description: content.frontmatter.description,
  }
}

export default async function SMEContentPage({ params }: PageProps) {
  const { slug } = await params
  const slugPath = slug.join('/')
  const content = getContentBySlug(slugPath)

  if (!content) {
    notFound()
  }

  const { frontmatter, content: mdxContent, readingTime } = content

  // Build breadcrumb items
  const breadcrumbItems = slug.map((part, index) => ({
    label: part
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
    href: index < slug.length - 1 ? `/sme/${slug.slice(0, index + 1).join('/')}` : undefined,
  }))

  return (
    <div className="relative">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <SMEBreadcrumbs items={breadcrumbItems} />
      </div>

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-3">{frontmatter.title}</h1>
        {frontmatter.description && (
          <p className="text-lg text-muted-foreground">{frontmatter.description}</p>
        )}

        {/* Meta info */}
        <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{readingTime.text}</span>
          </div>
          {frontmatter.lastUpdated && (
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Updated {frontmatter.lastUpdated}</span>
            </div>
          )}
          {frontmatter.tags && frontmatter.tags.length > 0 && (
            <div className="flex items-center gap-1">
              <Tag className="h-4 w-4" />
              <span>{frontmatter.tags.join(', ')}</span>
            </div>
          )}
        </div>
      </header>

      {/* Content grid with TOC */}
      <div className="flex gap-8">
        {/* Main content */}
        <article className="prose prose-slate dark:prose-invert max-w-none flex-1">
          <MDXRemote
            source={mdxContent}
            components={components}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [
                  rehypeSlug,
                  [rehypeAutolinkHeadings, { behavior: 'wrap' }],
                ],
              },
            }}
          />
        </article>

        {/* Table of contents (sticky sidebar) */}
        <aside className="hidden xl:block w-56 shrink-0">
          <div className="sticky top-24">
            <SMETableOfContents content={mdxContent} />
          </div>
        </aside>
      </div>
    </div>
  )
}
