'use client'

import { Copy, Check, Plug } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'

interface McpInstallModalProps {
  open: boolean
  onClose: () => void
  title: string
  configJson: Record<string, unknown> | null
}

export function McpInstallModal({ open, onClose, title, configJson }: McpInstallModalProps) {
  const { copied, copy } = useCopyToClipboard()
  const formattedConfig = configJson ? JSON.stringify(configJson, null, 2) : null

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plug className="h-5 w-5" />
            Install {title}
          </DialogTitle>
          <DialogDescription>
            Add this MCP server configuration to your project or global config
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Config JSON */}
          {formattedConfig && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">MCP Configuration</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copy(formattedConfig)}
                  className="gap-1.5"
                >
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
                  <code>{formattedConfig}</code>
                </pre>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Instructions</h3>
            <ol className="text-muted-foreground list-inside list-decimal space-y-2 text-sm">
              <li>Copy the configuration JSON above</li>
              <li>
                Add it to your project&apos;s{' '}
                <code className="bg-muted rounded px-1.5 py-0.5 text-xs">.mcp.json</code> file in
                the project root
              </li>
              <li>
                Or add it to your global config at{' '}
                <code className="bg-muted rounded px-1.5 py-0.5 text-xs">~/.claude/.mcp.json</code>
              </li>
              <li>Restart your Claude Code session to activate the MCP server</li>
            </ol>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
