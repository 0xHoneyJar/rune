import { clsx } from 'clsx'

interface NorthStarCardProps {
  type: 'games' | 'products'
  items: string[]
}

const typeConfig = {
  games: {
    emoji: '🎮',
    label: 'Games',
    bgClass: 'bg-purple-50 dark:bg-purple-900/20',
    borderClass: 'border-purple-200 dark:border-purple-800',
  },
  products: {
    emoji: '💎',
    label: 'Products',
    bgClass: 'bg-blue-50 dark:bg-blue-900/20',
    borderClass: 'border-blue-200 dark:border-blue-800',
  },
}

export function NorthStarCard({ type, items }: NorthStarCardProps) {
  const config = typeConfig[type]

  if (items.length === 0) {
    return null
  }

  return (
    <div
      className={clsx(
        'rounded-lg border p-4',
        config.bgClass,
        config.borderClass
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">{config.emoji}</span>
        <h3 className="font-medium text-slate-900 dark:text-white">
          {config.label}
        </h3>
      </div>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li
            key={i}
            className="text-sm text-slate-700 dark:text-slate-300 flex items-center"
          >
            <span className="mr-2 text-slate-400">•</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
