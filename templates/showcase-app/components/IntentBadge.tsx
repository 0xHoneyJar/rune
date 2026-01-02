import { clsx } from 'clsx'

interface IntentBadgeProps {
  intent: string
  size?: 'sm' | 'md'
}

// Determine category from intent prefix
function getIntentCategory(intent: string): 'functional' | 'personal' | 'social' {
  const lower = intent.toLowerCase()
  if (lower.includes('help me feel') || lower.includes('insider')) {
    return 'social'
  }
  if (lower.includes('reduce') || lower.includes('anxiety') || lower.includes('confident')) {
    return 'personal'
  }
  return 'functional'
}

const categoryColors = {
  functional: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700',
  personal: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700',
  social: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700',
}

const sizeClasses = {
  sm: 'text-xs px-1.5 py-0.5',
  md: 'text-sm px-2 py-1',
}

export function IntentBadge({ intent, size = 'md' }: IntentBadgeProps) {
  if (!intent) return null

  const category = getIntentCategory(intent)

  return (
    <span
      className={clsx(
        'intent-badge border rounded',
        categoryColors[category],
        sizeClasses[size]
      )}
    >
      {intent}
    </span>
  )
}
