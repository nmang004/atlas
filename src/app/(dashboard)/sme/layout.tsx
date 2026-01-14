import { SMECommandPalette } from '@/components/sme/SMECommandPalette'
import { SMEHeader } from '@/components/sme/SMEHeader'
import { SMESidebar } from '@/components/sme/SMESidebar'
import { getAllContent, getNavigation } from '@/lib/sme/mdx'
import { buildSearchIndex } from '@/lib/sme/search'

export const metadata = {
  title: 'SME Knowledge Base | Atlas',
  description: 'SEO Content Best Practices for Account Managers and SEO Specialists',
}

// Force dynamic rendering since we read content from the filesystem
export const dynamic = 'force-dynamic'

export default function SMELayout({ children }: { children: React.ReactNode }) {
  const navigation = getNavigation()
  const allContent = getAllContent()
  const searchIndex = buildSearchIndex(allContent)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <SMEHeader />

      {/* Sidebar */}
      <SMESidebar navigation={navigation} />

      {/* Command Palette */}
      <SMECommandPalette searchIndex={searchIndex} />

      {/* Main content */}
      <main className="lg:pl-64 pt-16">
        <div className="container max-w-4xl py-8 px-4 lg:px-8">{children}</div>
      </main>
    </div>
  )
}
