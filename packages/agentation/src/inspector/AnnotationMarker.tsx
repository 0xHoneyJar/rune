/**
 * Annotation Marker Component
 *
 * Visual markers displayed on annotated elements.
 */

import { useState, useCallback, useMemo, useEffect } from 'react'
import { colors, spacing, radii, shadows, zIndex } from '../theme'
import type { Annotation, AnnotationCategory } from '../types'

/**
 * Props for AnnotationMarker component
 */
export interface AnnotationMarkerProps {
  /** The annotation to display */
  annotation: Annotation
  /** Index number for display */
  index: number
  /** Whether the marker is highlighted */
  isHighlighted?: boolean
  /** Callback when marker is clicked */
  onClick?: (annotation: Annotation) => void
  /** Callback when annotation is deleted */
  onDelete?: (id: string) => void
}

/**
 * Category colors
 */
const CATEGORY_COLORS: Record<AnnotationCategory, string> = {
  bug: colors.error,
  suggestion: colors.primary,
  ux: '#ec4899',
  layout: '#3b82f6',
  accessibility: '#a855f7',
  performance: colors.success,
  other: colors.textMuted,
}

/**
 * Category emojis
 */
const CATEGORY_EMOJIS: Record<AnnotationCategory, string> = {
  bug: '🐛',
  suggestion: '💡',
  ux: '👤',
  layout: '📐',
  accessibility: '♿',
  performance: '🚀',
  other: '📝',
}

/**
 * Annotation Marker component
 */
export function AnnotationMarker({
  annotation,
  index,
  isHighlighted = false,
  onClick,
  onDelete,
}: AnnotationMarkerProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [rect, setRect] = useState<DOMRect | null>(null)

  const color = CATEGORY_COLORS[annotation.category]
  const emoji = CATEGORY_EMOJIS[annotation.category]

  useEffect(() => {
    const updateRect = () => {
      try {
        const element = document.querySelector(annotation.element.selector)
        if (element) {
          setRect(element.getBoundingClientRect())
        } else {
          setRect(null)
        }
      } catch {
        setRect(null)
      }
    }

    updateRect()

    window.addEventListener('resize', updateRect)
    window.addEventListener('scroll', updateRect, true)

    return () => {
      window.removeEventListener('resize', updateRect)
      window.removeEventListener('scroll', updateRect, true)
    }
  }, [annotation.element.selector])

  const handleClick = useCallback(() => {
    onClick?.(annotation)
  }, [annotation, onClick])

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onDelete?.(annotation.id)
    },
    [annotation.id, onDelete]
  )

  const formatTime = useCallback((timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  }, [])

  if (!rect) {
    return null
  }

  const showTooltip = isHovered || isHighlighted

  return (
    <>
      {/* Element outline when hovered */}
      {showTooltip && (
        <div
          style={{
            position: 'fixed',
            pointerEvents: 'none',
            border: `2px dashed ${color}`,
            borderRadius: radii.sm,
            zIndex: zIndex.fixed - 1,
            left: rect.left - 2,
            top: rect.top - 2,
            width: rect.width + 4,
            height: rect.height + 4,
          }}
          data-agentation="annotation-outline"
        />
      )}

      {/* Marker badge */}
      <div
        style={{
          position: 'fixed',
          zIndex: zIndex.fixed,
          pointerEvents: 'auto',
          cursor: 'pointer',
          left: rect.right - 12,
          top: rect.top - 12,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        data-agentation="annotation-marker"
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: color,
            color: '#000',
            fontSize: '10px',
            fontWeight: 700,
            boxShadow: shadows.md,
            border: '2px solid #fff',
            transform: showTooltip ? 'scale(1.2)' : 'scale(1)',
            transition: 'transform 150ms ease-out',
          }}
        >
          {index + 1}
        </div>

        {/* Tooltip */}
        {showTooltip && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginTop: spacing.sm,
              padding: spacing.md,
              backgroundColor: colors.background,
              border: `1px solid ${colors.border}`,
              borderRadius: radii.lg,
              boxShadow: shadows.md,
              minWidth: '200px',
              maxWidth: '280px',
              fontSize: '12px',
              color: colors.text,
              zIndex: 1,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.sm,
                marginBottom: spacing.sm,
                paddingBottom: spacing.sm,
                borderBottom: `1px solid ${colors.border}`,
              }}
            >
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: `2px ${spacing.sm}`,
                  backgroundColor: `${color}20`,
                  color: color,
                  border: `1px solid ${color}40`,
                  borderRadius: radii.sm,
                  fontSize: '10px',
                  fontWeight: 500,
                }}
              >
                <span>{emoji}</span>
                <span>{annotation.category}</span>
              </span>
              <span style={{ fontSize: '10px', color: colors.textMuted }}>
                {annotation.element.componentName ?? annotation.element.tagName}
              </span>
            </div>

            <div style={{ wordBreak: 'break-word' }}>{annotation.note}</div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: spacing.sm,
                paddingTop: spacing.sm,
                borderTop: `1px solid ${colors.border}`,
              }}
            >
              <span style={{ fontSize: '10px', color: colors.textDim }}>
                {formatTime(annotation.timestamp)}
              </span>
              {onDelete && (
                <button
                  style={{
                    backgroundColor: 'transparent',
                    border: `1px solid rgba(239, 68, 68, 0.3)`,
                    color: colors.error,
                    padding: `2px ${spacing.sm}`,
                    borderRadius: radii.sm,
                    fontSize: '10px',
                    cursor: 'pointer',
                  }}
                  onClick={handleDelete}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

/**
 * Props for AnnotationMarkerList component
 */
export interface AnnotationMarkerListProps {
  /** All annotations to display */
  annotations: Annotation[]
  /** ID of highlighted annotation */
  highlightedId?: string | null
  /** Callback when a marker is clicked */
  onMarkerClick?: (annotation: Annotation) => void
  /** Callback when an annotation is deleted */
  onDelete?: (id: string) => void
}

/**
 * Component to render all annotation markers
 */
export function AnnotationMarkerList({
  annotations,
  highlightedId,
  onMarkerClick,
  onDelete,
}: AnnotationMarkerListProps) {
  return (
    <>
      {annotations.map((annotation, index) => (
        <AnnotationMarker
          key={annotation.id}
          annotation={annotation}
          index={index}
          isHighlighted={annotation.id === highlightedId}
          onClick={onMarkerClick}
          onDelete={onDelete}
        />
      ))}
    </>
  )
}
