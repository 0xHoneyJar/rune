/**
 * Element Inspector Hook
 *
 * Provides element inspection capabilities.
 * Detects hovered elements, extracts React component info from fiber,
 * and generates CSS selectors.
 */

import { useState, useCallback, useEffect, useRef } from 'react'
import type { InspectedElement } from '../types'

/**
 * Options for the inspector hook
 */
export interface UseElementInspectorOptions {
  /** Elements to exclude from inspection (e.g., the toolbar itself) */
  excludeSelectors?: string[]
  /** Callback when an element is inspected */
  onInspect?: (element: InspectedElement) => void
  /** Callback when inspection mode ends */
  onExit?: () => void
}

/**
 * Return type for useElementInspector
 */
export interface UseElementInspectorReturn {
  /** Whether inspector mode is active */
  isInspecting: boolean
  /** Start inspector mode */
  startInspecting: () => void
  /** Stop inspector mode */
  stopInspecting: () => void
  /** Toggle inspector mode */
  toggleInspecting: () => void
  /** Currently hovered element info */
  hoveredElement: InspectedElement | null
  /** Currently selected (clicked) element info */
  selectedElement: InspectedElement | null
  /** Clear selection */
  clearSelection: () => void
}

// React internal key for accessing fiber
const FIBER_KEYS = ['__reactFiber$', '__reactInternalInstance$', '_reactRootContainer']

/**
 * Extract React component name from a DOM element's fiber
 */
function getReactComponentName(element: HTMLElement): string | undefined {
  for (const key of Object.keys(element)) {
    for (const fiberKey of FIBER_KEYS) {
      if (key.startsWith(fiberKey)) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const fiber = (element as any)[key]
          if (fiber) {
            let current = fiber
            while (current) {
              const name = getComponentNameFromFiber(current)
              if (name && !isInternalComponent(name)) {
                return name
              }
              current = current.return
            }
          }
        } catch {
          // Fiber access failed
        }
      }
    }
  }
  return undefined
}

/**
 * Get component name from a fiber node
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getComponentNameFromFiber(fiber: any): string | null {
  if (!fiber) return null

  if (fiber.type) {
    if (typeof fiber.type === 'function') {
      return fiber.type.displayName || fiber.type.name || null
    }
    if (typeof fiber.type === 'string') {
      return null
    }
    if (fiber.type.displayName) {
      return fiber.type.displayName
    }
    if (fiber.type.render?.displayName || fiber.type.render?.name) {
      return fiber.type.render.displayName || fiber.type.render.name
    }
  }

  return null
}

/**
 * Check if a component name is internal (should be skipped)
 */
function isInternalComponent(name: string): boolean {
  const internalPatterns = [
    /^Fragment$/,
    /^Suspense$/,
    /^Provider$/,
    /^Consumer$/,
    /^Context\./,
    /^ForwardRef\(/,
    /^Memo\(/,
    /^__/,
  ]
  return internalPatterns.some((pattern) => pattern.test(name))
}

/**
 * Generate a CSS selector for an element
 */
function getSelector(element: HTMLElement): string {
  if (element.id) {
    return `#${CSS.escape(element.id)}`
  }

  const testId = element.getAttribute('data-testid')
  if (testId) {
    return `[data-testid="${CSS.escape(testId)}"]`
  }

  const agentationAttr = element.getAttribute('data-agentation')
  if (agentationAttr) {
    return `[data-agentation="${CSS.escape(agentationAttr)}"]`
  }

  const path: string[] = []
  let current: HTMLElement | null = element

  while (current && current !== document.body) {
    let selector = current.tagName.toLowerCase()

    if (current.id) {
      selector = `#${CSS.escape(current.id)}`
      path.unshift(selector)
      break
    }

    const meaningfulClasses = Array.from(current.classList)
      .filter((c) => !isUtilityClass(c))
      .slice(0, 2)

    if (meaningfulClasses.length > 0) {
      selector += meaningfulClasses.map((c) => `.${CSS.escape(c)}`).join('')
    }

    const parent = current.parentElement
    if (parent) {
      const siblings = Array.from(parent.children).filter(
        (child) => child.tagName === current!.tagName
      )
      if (siblings.length > 1) {
        const index = siblings.indexOf(current) + 1
        selector += `:nth-of-type(${index})`
      }
    }

    path.unshift(selector)
    current = current.parentElement
  }

  return path.join(' > ')
}

/**
 * Check if a class name looks like a utility class (Tailwind, etc.)
 */
function isUtilityClass(className: string): boolean {
  const utilityPatterns = [
    /^(p|m|w|h|min|max)(-|$)/,
    /^(flex|grid|block|inline|hidden)$/,
    /^(bg|text|border|rounded|shadow)-/,
    /^(absolute|relative|fixed|sticky)$/,
    /^(overflow|z)-/,
    /^(gap|space)-/,
    /^(font|leading|tracking)-/,
    /^(opacity|cursor|pointer-events)-/,
  ]
  return utilityPatterns.some((pattern) => pattern.test(className))
}

/**
 * Extract element information
 */
function extractElementInfo(element: HTMLElement): InspectedElement {
  const dataAttributes: Record<string, string> = {}
  for (const attr of Array.from(element.attributes)) {
    if (attr.name.startsWith('data-')) {
      dataAttributes[attr.name] = attr.value
    }
  }

  return {
    selector: getSelector(element),
    tagName: element.tagName.toLowerCase(),
    classes: Array.from(element.classList),
    dataAttributes,
    componentName: getReactComponentName(element),
    rect: element.getBoundingClientRect(),
  }
}

/**
 * Hook for element inspection
 */
export function useElementInspector(
  options: UseElementInspectorOptions = {}
): UseElementInspectorReturn {
  const { excludeSelectors = ['[data-agentation]'], onInspect, onExit } = options

  const [isInspecting, setIsInspecting] = useState(false)
  const [hoveredElement, setHoveredElement] = useState<InspectedElement | null>(null)
  const [selectedElement, setSelectedElement] = useState<InspectedElement | null>(null)

  const isInspectingRef = useRef(isInspecting)
  isInspectingRef.current = isInspecting

  const shouldExclude = useCallback(
    (element: HTMLElement): boolean => {
      return excludeSelectors.some((selector) => {
        try {
          return element.closest(selector) !== null
        } catch {
          return false
        }
      })
    },
    [excludeSelectors]
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isInspectingRef.current) return

      const target = e.target as HTMLElement
      if (!target || target === document.body || target === document.documentElement) {
        setHoveredElement(null)
        return
      }

      if (shouldExclude(target)) {
        setHoveredElement(null)
        return
      }

      const info = extractElementInfo(target)
      setHoveredElement(info)
    },
    [shouldExclude]
  )

  const handleClick = useCallback(
    (e: MouseEvent) => {
      if (!isInspectingRef.current) return

      const target = e.target as HTMLElement
      if (!target || shouldExclude(target)) return

      e.preventDefault()
      e.stopPropagation()

      const info = extractElementInfo(target)
      setSelectedElement(info)
      onInspect?.(info)
    },
    [shouldExclude, onInspect]
  )

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isInspectingRef.current) return

      if (e.key === 'Escape') {
        e.preventDefault()
        setIsInspecting(false)
        setHoveredElement(null)
        onExit?.()
      }
    },
    [onExit]
  )

  const startInspecting = useCallback(() => {
    setIsInspecting(true)
    setSelectedElement(null)
  }, [])

  const stopInspecting = useCallback(() => {
    setIsInspecting(false)
    setHoveredElement(null)
    onExit?.()
  }, [onExit])

  const toggleInspecting = useCallback(() => {
    if (isInspectingRef.current) {
      stopInspecting()
    } else {
      startInspecting()
    }
  }, [startInspecting, stopInspecting])

  const clearSelection = useCallback(() => {
    setSelectedElement(null)
  }, [])

  useEffect(() => {
    if (!isInspecting) return

    document.addEventListener('mousemove', handleMouseMove, true)
    document.addEventListener('click', handleClick, true)
    document.addEventListener('keydown', handleKeyDown, true)
    document.body.style.cursor = 'crosshair'

    return () => {
      document.removeEventListener('mousemove', handleMouseMove, true)
      document.removeEventListener('click', handleClick, true)
      document.removeEventListener('keydown', handleKeyDown, true)
      document.body.style.cursor = ''
    }
  }, [isInspecting, handleMouseMove, handleClick, handleKeyDown])

  return {
    isInspecting,
    startInspecting,
    stopInspecting,
    toggleInspecting,
    hoveredElement,
    selectedElement,
    clearSelection,
  }
}
