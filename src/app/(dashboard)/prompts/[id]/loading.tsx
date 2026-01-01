import { Skeleton } from '@/components/ui/skeleton'

export default function PromptDetailLoading() {
  return (
    <div className="mx-auto max-w-4xl space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3 md:gap-4">
        <Skeleton className="h-11 w-11 shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-7 w-3/4" />
          <div className="flex gap-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-6 w-16" />
        ))}
      </div>

      {/* Variables card */}
      <div className="rounded-lg border bg-card p-4 md:p-6">
        <Skeleton className="mb-4 h-5 w-24" />
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-11 w-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Assembled prompt card */}
      <div className="rounded-lg border bg-card p-4 md:p-6">
        <Skeleton className="mb-4 h-5 w-32" />
        <Skeleton className="h-32 w-full" />
      </div>

      {/* Copy button */}
      <div className="flex justify-center">
        <Skeleton className="h-12 w-[200px]" />
      </div>
    </div>
  )
}
