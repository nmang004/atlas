'use client'

import { useCallback, useRef, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { isValidSkillFile, parseSkillFrontmatter } from '@/lib/frontmatter'

interface ParsedFile {
  filename: string
  title: string
  raw: string
  valid: boolean
}

export function FileUpload() {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [files, setFiles] = useState<ParsedFile[]>([])
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)

  const processFiles = useCallback((fileList: FileList) => {
    const mdFiles = Array.from(fileList).filter((f) => f.name.endsWith('.md'))
    if (mdFiles.length === 0) {
      return
    }

    const promises = mdFiles.map(
      (file) =>
        new Promise<ParsedFile>((resolve) => {
          const reader = new FileReader()
          reader.onload = () => {
            const raw = reader.result as string
            const parsed = parseSkillFrontmatter(raw)
            resolve({
              filename: file.name,
              title: parsed.frontmatter.name ? String(parsed.frontmatter.name) : file.name,
              raw,
              valid: isValidSkillFile(raw),
            })
          }
          reader.readAsText(file)
        })
    )

    Promise.all(promises).then((results) => {
      setFiles((prev) => [...prev, ...results])
    })
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      if (e.dataTransfer.files.length > 0) {
        processFiles(e.dataTransfer.files)
      }
    },
    [processFiles]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
  }, [])

  const handleBrowse = () => {
    fileInputRef.current?.click()
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files)
      e.target.value = ''
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const validFiles = files.filter((f) => f.valid)

  const handleUpload = async () => {
    if (validFiles.length === 0) {
      return
    }

    setUploading(true)
    let successCount = 0
    let errorCount = 0

    for (const file of validFiles) {
      try {
        const res = await fetch('/api/skills', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: file.title,
            raw_file: file.raw,
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
      toast({ title: `${successCount} skill(s) uploaded successfully` })
    }
    if (errorCount > 0) {
      toast({
        title: `${errorCount} skill(s) failed to upload`,
        variant: 'destructive',
      })
    }

    setFiles([])
    setUploading(false)
  }

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleBrowse}
        className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
          dragging
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-primary/50'
        }`}
      >
        <p className="text-sm font-medium">Drag and drop .md files here, or click to browse</p>
        <p className="text-muted-foreground mt-1 text-xs">
          Supports single or multiple markdown files with frontmatter
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".md"
        multiple
        className="hidden"
        onChange={handleFileInput}
      />

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <Card key={index}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Badge variant={file.valid ? 'success' : 'destructive'}>
                    {file.valid ? 'Valid' : 'Invalid'}
                  </Badge>
                  <div>
                    <p className="text-sm font-medium">{file.title}</p>
                    <p className="text-muted-foreground text-xs">{file.filename}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => removeFile(index)}>
                  Remove
                </Button>
              </CardContent>
            </Card>
          ))}

          <Button onClick={handleUpload} disabled={uploading || validFiles.length === 0}>
            {uploading ? 'Uploading...' : `Upload ${validFiles.length} file(s)`}
          </Button>
        </div>
      )}
    </div>
  )
}
