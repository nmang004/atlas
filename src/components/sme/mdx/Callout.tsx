import { AlertCircle, AlertTriangle, Lightbulb, Info } from 'lucide-react'

import { cn } from '@/lib/utils'

type CalloutType = 'tip' | 'warning' | 'mistake' | 'insight'

interface CalloutProps {
  type: CalloutType
  children: React.ReactNode
  title?: string
}

const calloutConfig: Record<
  CalloutType,
  { icon: React.ReactNode; className: string; defaultTitle: string }
> = {
  tip: {
    icon: <Lightbulb className="h-5 w-5" />,
    className: 'border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400',
    defaultTitle: 'Pro Tip',
  },
  warning: {
    icon: <AlertTriangle className="h-5 w-5" />,
    className: 'border-orange-500/50 bg-orange-500/10 text-orange-700 dark:text-orange-400',
    defaultTitle: 'Warning',
  },
  mistake: {
    icon: <AlertCircle className="h-5 w-5" />,
    className: 'border-red-500/50 bg-red-500/10 text-red-700 dark:text-red-400',
    defaultTitle: 'Common Mistake',
  },
  insight: {
    icon: <Info className="h-5 w-5" />,
    className: 'border-blue-500/50 bg-blue-500/10 text-blue-700 dark:text-blue-400',
    defaultTitle: 'Key Insight',
  },
}

export function Callout({ type, children, title }: CalloutProps) {
  const config = calloutConfig[type]

  return (
    <div
      className={cn(
        'my-6 flex gap-3 rounded-lg border-l-4 p-4',
        config.className
      )}
    >
      <div className="flex-shrink-0 mt-0.5">{config.icon}</div>
      <div className="flex-1">
        <p className="font-semibold mb-1">{title || config.defaultTitle}</p>
        <div className="text-sm [&>p]:m-0">{children}</div>
      </div>
    </div>
  )
}
