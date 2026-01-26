/**
 * Element Inspector Component
 *
 * Visual overlay for element inspection with hover highlighting
 * and element info display.
 */

import { useState, useCallback, useMemo } from 'react'
import { colors, spacing, radii, shadows, zIndex } from '../theme'
import type { InspectedElement, AnnotationCategory } from '../types'

/**
 * Props for ElementInspector component
 */
export interface ElementInspectorProps {
  /** Currently hovered element */
  hoveredElement: InspectedElement | null
  /** Currently selected element */
  selectedElement: InspectedElement | null
  /** Whether inspector is active */
  isInspecting: boolean
  /** Callback to add annotation */
  onAnnotate?: (element: InspectedElement, note: string, category: AnnotationCategory) => void
  /** Callback when selection is cleared */
  onClearSelection?: () => void
  /** Callback to stop inspecting */
  onStopInspecting?: () => void
}

/**
 * Category options for annotation
 */
const CATEGORY_OPTIONS: Array<{ value: AnnotationCategory; label: string }> = [
  { value: 'ux', label: '👤 UX' },
  { value: 'bug', label: '🐛 Bug' },
  { value: 'suggestion', label: '💡 Suggestion' },
  { value: 'layout', label: '📐 Layout' },
  { value: 'accessibility', label: '♿ Accessibility' },
  { value: 'performance', label: '🚀 Performance' },
  { value: 'other', label: '📝 Other' },
]

/**
 * Element Inspector component
 */
export function ElementInspector({
  hoveredElement,
  selectedElement,
  isInspecting,
  onAnnotate,
  onClearSelection,
}: ElementInspectorProps) {
  const [note, setNote] = useState('')
  const [category, setCategory] = useState<AnnotationCategory>('ux')

  const infoPanelPosition = useMemo(() => {
    if (!selectedElement) return null

    const rect = selectedElement.rect
    const panelWidth = 350
    const panelHeight = 300
    const margin = 16

    let left = rect.right + margin
    let top = rect.top

    if (left + panelWidth > window.innerWidth - margin) {
      left = rect.left - panelWidth - margin
    }

    if (left < margin) {
      left = margin
    }

    if (top + panelHeight > window.innerHeight - margin) {
      top = window.innerHeight - panelHeight - margin
    }

    if (top < margin) {
      top = margin
    }

    return { left, top }
  }, [selectedElement])

  const handleAnnotate = useCallback(() => {
    if (!selectedElement || !note.trim()) return
    onAnnotate?.(selectedElement, note.trim(), category)
    setNote('')
    onClearSelection?.()
  }, [selectedElement, note, category, onAnnotate, onClearSelection])

  const handleClose = useCallback(() => {
    setNote('')
    onClearSelection?.()
  }, [onClearSelection])

  if (!isInspecting && !selectedElement) {
    return null
  }

  return (
    <>
      {/* Mode indicator when inspecting */}
      {isInspecting && (
        <div
          style={{
            position: 'fixed',
            top: spacing.md,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: zIndex.modal,
            padding: `${spacing.sm} ${spacing.lg}`,
            backgroundColor: colors.background,
            border: `1px solid ${colors.primaryBorder}`,
            borderRadius: radii.full,
            fontSize: '12px',
            color: colors.text,
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm,
            boxShadow: shadows.md,
          }}
          data-agentation="inspector-indicator"
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: colors.primary,
            }}
          />
          <span>Inspector Mode</span>
          <span style={{ color: colors.textMuted, fontSize: '10px' }}>Press ESC to exit</span>
        </div>
      )}

      {/* Hover highlight */}
      {hoveredElement && isInspecting && (
        <div
          style={{
            position: 'fixed',
            pointerEvents: 'none',
            zIndex: zIndex.fixed,
            border: `2px solid ${colors.primary}`,
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderRadius: radii.sm,
            left: hoveredElement.rect.left - 2,
            top: hoveredElement.rect.top - 2,
            width: hoveredElement.rect.width + 4,
            height: hoveredElement.rect.height + 4,
          }}
          data-agentation="inspector-highlight"
        >
          <div
            style={{
              position: 'absolute',
              bottom: '100%',
              left: '0',
              marginBottom: '4px',
              padding: `2px ${spacing.sm}`,
              backgroundColor: colors.primary,
              color: '#000',
              fontSize: '10px',
              fontWeight: 600,
              borderRadius: radii.sm,
              whiteSpace: 'nowrap',
            }}
          >
            {hoveredElement.componentName ?? hoveredElement.tagName}
          </div>
        </div>
      )}

      {/* Selection highlight */}
      {selectedElement && (
        <div
          style={{
            position: 'fixed',
            pointerEvents: 'none',
            zIndex: zIndex.fixed + 1,
            border: `3px solid #3b82f6`,
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderRadius: radii.sm,
            left: selectedElement.rect.left - 3,
            top: selectedElement.rect.top - 3,
            width: selectedElement.rect.width + 6,
            height: selectedElement.rect.height + 6,
          }}
          data-agentation="inspector-selection"
        />
      )}

      {/* Info panel for selected element */}
      {selectedElement && infoPanelPosition && (
        <div
          style={{
            position: 'fixed',
            zIndex: zIndex.modal,
            backgroundColor: colors.background,
            border: `1px solid ${colors.border}`,
            borderRadius: radii.lg,
            boxShadow: shadows.md,
            fontSize: '12px',
            color: colors.text,
            minWidth: '300px',
            maxWidth: '400px',
            overflow: 'hidden',
            left: infoPanelPosition.left,
            top: infoPanelPosition.top,
          }}
          data-agentation="inspector-panel"
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: spacing.md,
              borderBottom: `1px solid ${colors.border}`,
              backgroundColor: colors.backgroundHover,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
              <span style={{ fontWeight: 600 }}>{selectedElement.tagName}</span>
              {selectedElement.componentName && (
                <span
                  style={{
                    padding: `2px ${spacing.sm}`,
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    color: '#3b82f6',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: radii.sm,
                    fontSize: '10px',
                  }}
                >
                  {selectedElement.componentName}
                </span>
              )}
            </div>
            <button
              onClick={handleClose}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: colors.textMuted,
                cursor: 'pointer',
                padding: spacing.xs,
                fontSize: '14px',
                borderRadius: radii.sm,
              }}
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div style={{ padding: spacing.md }}>
            <div style={{ display: 'flex', marginBottom: spacing.sm }}>
              <span
                style={{
                  width: '80px',
                  flexShrink: 0,
                  color: colors.textMuted,
                  fontSize: '10px',
                  textTransform: 'uppercase',
                }}
              >
                Selector
              </span>
              <code
                style={{
                  flex: 1,
                  padding: `2px ${spacing.xs}`,
                  backgroundColor: colors.backgroundInput,
                  borderRadius: radii.sm,
                  fontSize: '10px',
                  wordBreak: 'break-all',
                }}
              >
                {selectedElement.selector}
              </code>
            </div>

            {selectedElement.classes.length > 0 && (
              <div style={{ display: 'flex', marginBottom: spacing.sm }}>
                <span
                  style={{
                    width: '80px',
                    flexShrink: 0,
                    color: colors.textMuted,
                    fontSize: '10px',
                    textTransform: 'uppercase',
                  }}
                >
                  Classes
                </span>
                <span style={{ flex: 1, wordBreak: 'break-all' }}>
                  {selectedElement.classes.slice(0, 5).join(', ')}
                  {selectedElement.classes.length > 5 &&
                    ` +${selectedElement.classes.length - 5} more`}
                </span>
              </div>
            )}
          </div>

          {/* Annotation section */}
          {onAnnotate && (
            <div
              style={{
                padding: spacing.md,
                borderTop: `1px solid ${colors.border}`,
              }}
            >
              <textarea
                style={{
                  width: '100%',
                  padding: spacing.sm,
                  backgroundColor: colors.backgroundInput,
                  border: `1px solid ${colors.border}`,
                  borderRadius: radii.sm,
                  color: colors.text,
                  fontSize: '12px',
                  resize: 'vertical',
                  minHeight: '60px',
                  marginBottom: spacing.sm,
                  boxSizing: 'border-box',
                }}
                placeholder="Add a note about this element..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />

              <select
                style={{
                  width: '100%',
                  padding: spacing.sm,
                  backgroundColor: colors.backgroundInput,
                  border: `1px solid ${colors.border}`,
                  borderRadius: radii.sm,
                  color: colors.text,
                  fontSize: '12px',
                  marginBottom: spacing.sm,
                  cursor: 'pointer',
                }}
                value={category}
                onChange={(e) => setCategory(e.target.value as AnnotationCategory)}
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <div style={{ display: 'flex', gap: spacing.sm, justifyContent: 'flex-end' }}>
                <button
                  style={{
                    padding: `${spacing.sm} ${spacing.md}`,
                    borderRadius: radii.sm,
                    fontSize: '12px',
                    cursor: 'pointer',
                    backgroundColor: 'transparent',
                    border: `1px solid ${colors.border}`,
                    color: colors.textMuted,
                  }}
                  onClick={handleClose}
                >
                  Cancel
                </button>
                <button
                  style={{
                    padding: `${spacing.sm} ${spacing.md}`,
                    borderRadius: radii.sm,
                    fontSize: '12px',
                    cursor: note.trim() ? 'pointer' : 'not-allowed',
                    backgroundColor: colors.primaryLight,
                    border: `1px solid ${colors.primaryBorder}`,
                    color: colors.primary,
                  }}
                  onClick={handleAnnotate}
                  disabled={!note.trim()}
                >
                  Add Annotation
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}
