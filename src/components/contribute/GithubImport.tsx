'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useGithubImport } from '@/hooks/queries/useGithubImportQuery'
import { useToast } from '@/hooks/use-toast'

interface ScannedFile {
  name: string
  path: string
  raw: string
  is_valid: boolean
}

export function GithubImport() {
  const router = useRouter()
  const { toast } = useToast()
  const importMutation = useGithubImport()

  const [url, setUrl] = useState('')
  const [scannedFiles, setScannedFiles] = useState<ScannedFile[]>([])
  const [importing, setImporting] = useState(false)

  const handleScan = async () => {
    if (!url.trim()) {
      return
    }

    try {
      const files = await importMutation.mutateAsync(url.trim())
      setScannedFiles(files)

      if (files.length === 0) {
        toast({ title: 'No skill files found in this repository' })
      }
    } catch (error) {
      toast({
        title: 'Failed to scan repository',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      })
    }
  }

  const validFiles = scannedFiles.filter((f) => f.is_valid)
  const skippedFiles = scannedFiles.filter((f) => !f.is_valid)

  const handleImport = async () => {
    if (validFiles.length === 0) {
      return
    }

    setImporting(true)
    let successCount = 0
    let errorCount = 0

    for (const file of validFiles) {
      try {
        const res = await fetch('/api/skills', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: file.name,
            raw_file: file.raw,
            source_url: url.trim(),
            tags: [],
          }),
        })

        if (res.ok) {
          successCount++
        } else {
          errorCount++
        }
      } catch {
        errorCount++
      }
    }

    if (successCount > 0) {
      toast({ title: `${successCount} skill(s) imported successfully` })
      router.push('/skills')
    }
    if (errorCount > 0) {
      toast({
        title: `${errorCount} skill(s) failed to import`,
        variant: 'destructive',
      })
    }

    setImporting(false)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="github-url">GitHub Repository URL</Label>
        <div className="flex gap-2">
          <Input
            id="github-url"
            placeholder="https://github.com/user/repo"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Button
            onClick={handleScan}
            disabled={importMutation.isPending || !url.trim()}
            variant="outline"
          >
            {importMutation.isPending ? 'Scanning...' : 'Scan'}
          </Button>
        </div>
      </div>

      {/* Scanned files */}
      {scannedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-muted-foreground text-sm">
            Found {scannedFiles.length} file(s): {validFiles.length} valid, {skippedFiles.length}{' '}
            skipped
          </p>

          {scannedFiles.map((file, index) => (
            <Card key={index}>
              <CardContent className="flex items-center gap-3 p-4">
                <Badge variant={file.is_valid ? 'success' : 'secondary'}>
                  {file.is_valid ? 'Valid' : 'Skipped'}
                </Badge>
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-muted-foreground text-xs">{file.path}</p>
                </div>
              </CardContent>
            </Card>
          ))}

          {validFiles.length > 0 && (
            <Button onClick={handleImport} disabled={importing}>
              {importing ? 'Importing...' : `Import ${validFiles.length} valid file(s)`}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
