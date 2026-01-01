import { AlertCircle } from 'lucide-react'

import { cn } from '@/lib/utils'

interface FormErrorProps {
  message?: string
  className?: string
}

export function FormError({ message, className }: FormErrorProps) {
  if (!message) {
    return null
  }

  return (
    <p className={cn('text-sm text-destructive', className)} role="alert">
      {message}
    </p>
  )
}

interface FormErrorSummaryProps {
  error?: string | null
  className?: string
}

export function FormErrorSummary({ error, className }: FormErrorSummaryProps) {
  if (!error) {
    return null
  }

  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive',
        className
      )}
      role="alert"
    >
      <AlertCircle className="h-4 w-4 shrink-0" />
      <p>{error}</p>
    </div>
  )
}
