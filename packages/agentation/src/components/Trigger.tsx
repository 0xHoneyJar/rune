/**
 * Trigger Component
 *
 * Floating button to open the Agentation toolbar.
 * Uses inline styles only for consumer compatibility.
 */

import type { ReactNode, CSSProperties } from 'react'
import { useToolbarStore } from '../store/toolbar'
import { colors, shadows, zIndex } from '../theme'
import type { ToolbarPosition } from '../types'

/**
 * Props for Trigger
 */
export interface TriggerProps {
  /** Custom children (replaces default icon) */
  children?: ReactNode
  /** Override position (defaults to toolbar position) */
  position?: ToolbarPosition
}

/**
 * Position styles mapping
 */
const positionStyles: Record<ToolbarPosition, CSSProperties> = {
  'bottom-right': { bottom: '16px', right: '16px' },
  'bottom-left': { bottom: '16px', left: '16px' },
  'top-right': { top: '16px', right: '16px' },
  'top-left': { top: '16px', left: '16px' },
}

/**
 * Floating trigger button to open the toolbar
 */
export function Trigger({ children, position: overridePosition }: TriggerProps) {
  const isOpen = useToolbarStore((state) => state.isOpen)
  const toggle = useToolbarStore((state) => state.toggle)
  const storePosition = useToolbarStore((state) => state.position)

  const position = overridePosition ?? storePosition

  // Don't show trigger when toolbar is open
  if (isOpen) return null

  return (
    <button
      onClick={toggle}
      style={{
        position: 'fixed',
        ...positionStyles[position],
        zIndex: zIndex.fixed,
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        backgroundColor: colors.primary,
        border: `2px solid ${colors.primaryBorder}`,
        boxShadow: shadows.primary,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'transform 200ms ease-out, box-shadow 200ms ease-out',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)'
      }}
      aria-label="Open Agentation"
      title="Agentation (Ctrl+Shift+D)"
      data-agentation="trigger"
    >
      {children ?? (
        <span style={{ color: colors.text, fontSize: '18px', fontWeight: 600 }}>
          ◆
        </span>
      )}
    </button>
  )
}
