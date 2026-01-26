/**
 * Toolbar Component
 *
 * Main toolbar panel with tab navigation.
 */

import type { CSSProperties } from 'react'
import { useToolbarStore } from '../store/toolbar'
import { colors, spacing, radii, shadows, zIndex } from '../theme'
import type { ToolbarPosition, ToolbarTab } from '../types'
import { LensPanel } from './LensPanel'
import { InspectorPanel } from './InspectorPanel'

/**
 * Position styles for toolbar
 */
const positionStyles: Record<ToolbarPosition, CSSProperties> = {
  'bottom-right': { bottom: '16px', right: '16px' },
  'bottom-left': { bottom: '16px', left: '16px' },
  'top-right': { top: '16px', right: '16px' },
  'top-left': { top: '16px', left: '16px' },
}

/**
 * Tab configuration
 */
const TABS: Array<{ id: ToolbarTab; label: string; shortcut: string }> = [
  { id: 'lens', label: 'Lens', shortcut: '1' },
  { id: 'inspector', label: 'Inspector', shortcut: '2' },
]

/**
 * Main toolbar panel
 */
export function Toolbar() {
  const isOpen = useToolbarStore((state) => state.isOpen)
  const activeTab = useToolbarStore((state) => state.activeTab)
  const position = useToolbarStore((state) => state.position)
  const close = useToolbarStore((state) => state.close)
  const setActiveTab = useToolbarStore((state) => state.setActiveTab)

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        ...positionStyles[position],
        zIndex: zIndex.fixed,
        width: '320px',
        maxHeight: '70vh',
        backgroundColor: colors.background,
        border: `1px solid ${colors.border}`,
        borderRadius: radii.lg,
        boxShadow: shadows.md,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
      data-agentation="toolbar"
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: `${spacing.sm} ${spacing.md}`,
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        {/* Tabs */}
        <div style={{ display: 'flex', gap: spacing.xs }}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: `${spacing.xs} ${spacing.sm}`,
                backgroundColor: activeTab === tab.id ? colors.primaryLight : 'transparent',
                border: 'none',
                borderRadius: radii.sm,
                color: activeTab === tab.id ? colors.primary : colors.textMuted,
                fontSize: '11px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'background-color 150ms ease-out',
              }}
              title={`${tab.label} (${tab.shortcut})`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Close button */}
        <button
          onClick={close}
          style={{
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: radii.sm,
            color: colors.textMuted,
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'color 150ms ease-out',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = colors.text
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = colors.textMuted
          }}
          aria-label="Close toolbar"
          title="Close (Esc)"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {activeTab === 'lens' && <LensPanel />}
        {activeTab === 'inspector' && <InspectorPanel />}
      </div>
    </div>
  )
}
