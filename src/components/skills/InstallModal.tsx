'use client'

import { Copy, Check, FolderDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'

interface InstallModalProps {
  open: boolean
  onClose: () => void
  title: string
  slug: string
  rawFile: string
}

export function InstallModal({ open, onClose, title, slug, rawFile }: InstallModalProps) {
  const { copied, copy } = useCopyToClipboard()
  const filePath = `.claude/skills/${slug}.md`

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderDown className="h-5 w-5" />
            Install {title}
          </DialogTitle>
          <DialogDescription>
            Follow these steps to add this skill to your project
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* File path */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Save Location</h3>
            <div className="bg-muted flex items-center justify-between rounded-md border px-3 py-2">
              <code className="text-sm">{filePath}</code>
            </div>
          </div>

          {/* File content */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">File Content</h3>
              <Button variant="outline" size="sm" onClick={() => copy(rawFile)} className="gap-1.5">
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <div className="bg-muted max-h-64 overflow-auto rounded-md border">
              <pre className="p-4 text-sm">
                <code>{rawFile}</code>
              </pre>
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Instructions</h3>
            <ol className="text-muted-foreground list-inside list-decimal space-y-2 text-sm">
              <li>
                Create the skills directory if it doesn&apos;t exist:
                <code className="bg-muted mx-1 rounded px-1.5 py-0.5 text-xs">
                  mkdir -p .claude/skills
                </code>
              </li>
              <li>
                Create a new file at{' '}
                <code className="bg-muted rounded px-1.5 py-0.5 text-xs">{filePath}</code>
              </li>
              <li>Paste the copied content into the file and save</li>
              <li>The skill will be automatically loaded by Claude Code in your next session</li>
            </ol>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
