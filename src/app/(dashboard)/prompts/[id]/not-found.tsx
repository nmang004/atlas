import Link from 'next/link'

import { FileX } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function PromptNotFound() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center p-4">
      <Card className="mx-auto max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <FileX className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle>Prompt not found</CardTitle>
          <CardDescription>
            This prompt doesn&apos;t exist or may have been deleted.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href="/prompts">Browse prompts</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/categories">View categories</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
