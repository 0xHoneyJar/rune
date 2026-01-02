import { clsx } from 'clsx'
import type { Tier } from '@/lib/types'

interface TierBadgeProps {
  tier: Tier
  size?: 'sm' | 'md' | 'lg'
}

const tierConfig: Record<Tier, { label: string; emoji: string; className: string }> = {
  gold: {
    label: 'Gold',
    emoji: '🏆',
    className: 'tier-badge-gold',
  },
  silver: {
    label: 'Silver',
    emoji: '🥈',
    className: 'tier-badge-silver',
  },
  uncaptured: {
    label: 'Uncaptured',
    emoji: '📝',
    className: 'tier-badge-uncaptured',
  },
}

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
  lg: 'text-base px-3 py-1.5',
}

export function TierBadge({ tier, size = 'md' }: TierBadgeProps) {
  const config = tierConfig[tier]

  return (
    <span
      className={clsx(
        'tier-badge',
        config.className,
        sizeClasses[size]
      )}
    >
      <span className="mr-1">{config.emoji}</span>
      {config.label}
    </span>
  )
}
