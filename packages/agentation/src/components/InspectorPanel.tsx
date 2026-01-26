/**
 * Inspector Panel Component
 *
 * Panel for element inspection controls.
 */

import { useCallback, useState } from 'react'
import { colors, spacing, radii } from '../theme'
import { useElementInspector } from '../inspector/useElementInspector'
import { useAnnotationSession, CATEGORY_INFO } from '../inspector/useAnnotationSession'
import { ElementInspector } from '../inspector/ElementInspector'
import { AnnotationMarkerList } from '../inspector/AnnotationMarker'
import type { InspectedElement, AnnotationCategory } from '../types'

/**
 * Inspector panel with element inspection and annotation
 */
export function InspectorPanel() {
  const [highlightedId, setHighlightedId] = useState<string | null>(null)

  const {
    isInspecting,
    startInspecting,
    stopInspecting,
    hoveredElement,
    selectedElement,
    clearSelection,
  } = useElementInspector()

  const {
    annotations,
    addAnnotation,
    removeAnnotation,
    clearAnnotations,
    exportToMarkdown,
    stats,
  } = useAnnotationSession()

  const handleAnnotate = useCallback(
    (element: InspectedElement, note: string, category: AnnotationCategory) => {
      addAnnotation(element, note, category)
    },
    [addAnnotation]
  )

  const handleCopyMarkdown = useCallback(() => {
    const markdown = exportToMarkdown()
    navigator.clipboard.writeText(markdown)
  }, [exportToMarkdown])

  return (
    <>
      {/* Inspector overlay */}
      <ElementInspector
        hoveredElement={hoveredElement}
        selectedElement={selectedElement}
        isInspecting={isInspecting}
        onAnnotate={handleAnnotate}
        onClearSelection={clearSelection}
        onStopInspecting={stopInspecting}
      />

      {/* Annotation markers */}
      <AnnotationMarkerList
        annotations={annotations}
        highlightedId={highlightedId}
        onMarkerClick={(ann) => setHighlightedId(ann.id)}
        onDelete={removeAnnotation}
      />

      {/* Panel content */}
      <div style={{ padding: spacing.lg }}>
        {/* Controls */}
        <div style={{ marginBottom: spacing.lg }}>
          <button
            onClick={isInspecting ? stopInspecting : startInspecting}
            style={{
              width: '100%',
              padding: `${spacing.sm} ${spacing.md}`,
              backgroundColor: isInspecting ? 'rgba(239, 68, 68, 0.2)' : colors.primaryLight,
              border: `1px solid ${isInspecting ? 'rgba(239, 68, 68, 0.3)' : colors.primaryBorder}`,
              borderRadius: radii.sm,
              color: isInspecting ? colors.error : colors.primary,
              fontSize: '11px',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            {isInspecting ? 'Stop Inspecting' : 'Start Inspecting'}
          </button>

          <div
            style={{
              marginTop: spacing.sm,
              fontSize: '10px',
              color: colors.textMuted,
              textAlign: 'center',
            }}
          >
            {isInspecting
              ? 'Click on any element to annotate'
              : 'Click the button to start inspecting'}
          </div>
        </div>

        {/* Stats */}
        {stats.total > 0 && (
          <div style={{ marginBottom: spacing.lg }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: spacing.sm,
              }}
            >
              <span style={{ color: colors.textMuted, fontSize: '10px' }}>
                {stats.total} annotation{stats.total !== 1 ? 's' : ''}
              </span>
              <div style={{ display: 'flex', gap: spacing.xs }}>
                <button
                  onClick={handleCopyMarkdown}
                  style={{
                    padding: `2px ${spacing.sm}`,
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: radii.sm,
                    color: '#3b82f6',
                    fontSize: '10px',
                    cursor: 'pointer',
                  }}
                >
                  Copy Markdown
                </button>
                <button
                  onClick={clearAnnotations}
                  style={{
                    padding: `2px ${spacing.sm}`,
                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: radii.sm,
                    color: colors.error,
                    fontSize: '10px',
                    cursor: 'pointer',
                  }}
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Category breakdown */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.xs }}>
              {(Object.keys(stats.byCategory) as AnnotationCategory[]).map((category) => {
                const count = stats.byCategory[category]
                if (count === 0) return null
                const info = CATEGORY_INFO[category]
                return (
                  <span
                    key={category}
                    style={{
                      padding: `2px ${spacing.sm}`,
                      backgroundColor: colors.backgroundInput,
                      border: `1px solid ${colors.borderSubtle}`,
                      borderRadius: radii.sm,
                      fontSize: '10px',
                      color: colors.textMuted,
                    }}
                  >
                    {info.emoji} {count}
                  </span>
                )
              })}
            </div>
          </div>
        )}

        {/* Annotation list */}
        {annotations.length > 0 && (
          <div>
            <label
              style={{
                display: 'block',
                color: colors.textMuted,
                fontSize: '10px',
                marginBottom: spacing.sm,
              }}
            >
              Annotations
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
              {annotations.map((annotation, index) => {
                const info = CATEGORY_INFO[annotation.category]
                return (
                  <div
                    key={annotation.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: spacing.sm,
                      padding: spacing.sm,
                      backgroundColor:
                        highlightedId === annotation.id
                          ? colors.backgroundHover
                          : colors.backgroundInput,
                      border: `1px solid ${colors.borderSubtle}`,
                      borderRadius: radii.sm,
                      cursor: 'pointer',
                    }}
                    onClick={() =>
                      setHighlightedId(highlightedId === annotation.id ? null : annotation.id)
                    }
                  >
                    <span
                      style={{
                        width: '18px',
                        height: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: colors.primary,
                        color: '#000',
                        borderRadius: '50%',
                        fontSize: '10px',
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {index + 1}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: spacing.xs,
                          marginBottom: '2px',
                        }}
                      >
                        <span style={{ fontSize: '10px' }}>{info.emoji}</span>
                        <span
                          style={{
                            fontSize: '10px',
                            color: colors.textMuted,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {annotation.element.componentName ?? annotation.element.tagName}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: '11px',
                          color: colors.text,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {annotation.note}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        removeAnnotation(annotation.id)
                      }}
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: colors.textDim,
                        cursor: 'pointer',
                        padding: '2px',
                        fontSize: '12px',
                        lineHeight: 1,
                      }}
                    >
                      ✕
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Empty state */}
        {annotations.length === 0 && !isInspecting && (
          <div
            style={{
              textAlign: 'center',
              padding: spacing.lg,
              color: colors.textMuted,
            }}
          >
            <p style={{ fontSize: '11px', marginBottom: spacing.sm }}>No annotations yet</p>
            <p style={{ fontSize: '10px', color: colors.textDim }}>
              Start inspecting to annotate elements
            </p>
          </div>
        )}
      </div>
    </>
  )
}
