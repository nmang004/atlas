import { X, Check } from 'lucide-react'

import { cn } from '@/lib/utils'

interface ComparisonTableProps {
  headers: [string, string]
  rows: [string, string][]
  showIcons?: boolean
}

export function ComparisonTable({ headers, rows, showIcons = true }: ComparisonTableProps) {
  return (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th
              className={cn(
                'border border-border bg-red-500/10 px-4 py-2 text-left font-semibold',
                'text-red-700 dark:text-red-400'
              )}
            >
              {showIcons && <X className="inline-block h-4 w-4 mr-2" />}
              {headers[0]}
            </th>
            <th
              className={cn(
                'border border-border bg-green-500/10 px-4 py-2 text-left font-semibold',
                'text-green-700 dark:text-green-400'
              )}
            >
              {showIcons && <Check className="inline-block h-4 w-4 mr-2" />}
              {headers[1]}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td className="border border-border px-4 py-3 align-top bg-red-500/5">
                {row[0]}
              </td>
              <td className="border border-border px-4 py-3 align-top bg-green-500/5">
                {row[1]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
