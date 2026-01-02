import Link from 'next/link'
import { clsx } from 'clsx'
import type { MoodboardStatus } from '@/lib/types'

interface FeatureCardProps {
  name: string
  status: MoodboardStatus
}

const statusConfig: Record<
  MoodboardStatus,
  { label: string; className: string }
> = {
  active: {
    label: 'Active',
    className:
      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  },
  draft: {
    label: 'Draft',
    className:
      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  },
  deprecated: {
    label: 'Deprecated',
    className:
      'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
  },
}

export function FeatureCard({ name, status }: FeatureCardProps) {
  const config = statusConfig[status]

  return (
    <Link
      href={`/moodboard/${name}`}
      className="block p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-slate-900 dark:text-white capitalize">
          {name.replace(/-/g, ' ')}
        </h3>
        <span
          className={clsx(
            'text-xs px-2 py-0.5 rounded-full font-medium',
            config.className
          )}
        >
          {config.label}
        </span>
      </div>
    </Link>
  )
}
