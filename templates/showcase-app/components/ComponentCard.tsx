import Link from 'next/link'
import { TierBadge } from './TierBadge'
import { IntentBadge } from './IntentBadge'
import type { SigilComponent } from '@/lib/types'

interface ComponentCardProps {
  component: SigilComponent
}

export function ComponentCard({ component }: ComponentCardProps) {
  return (
    <Link
      href={`/showcase/${encodeURIComponent(component.name)}`}
      className="component-card block"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          {component.name}
        </h3>
        <TierBadge tier={component.tier} size="sm" />
      </div>

      {component.description && (
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
          {component.description}
        </p>
      )}

      {component.feel && (
        <div className="mb-3">
          <span className="text-xs text-slate-500 dark:text-slate-500 uppercase tracking-wide">
            Feel
          </span>
          <p className="text-sm text-slate-700 dark:text-slate-300 italic">
            "{component.feel}"
          </p>
        </div>
      )}

      {component.rejected.length > 0 && (
        <div className="mb-3">
          <span className="text-xs text-slate-500 dark:text-slate-500 uppercase tracking-wide">
            Rejected
          </span>
          <div className="flex flex-wrap gap-1 mt-1">
            {component.rejected.slice(0, 3).map((r, i) => (
              <span
                key={i}
                className="text-xs bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded"
              >
                ✗ {r}
              </span>
            ))}
            {component.rejected.length > 3 && (
              <span className="text-xs text-slate-500">
                +{component.rejected.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-700">
        <IntentBadge intent={component.intent} size="sm" />
        {component.tier === 'gold' && component.owner && (
          <span className="text-xs text-slate-500 dark:text-slate-400">
            👤 {component.owner}
          </span>
        )}
      </div>
    </Link>
  )
}
