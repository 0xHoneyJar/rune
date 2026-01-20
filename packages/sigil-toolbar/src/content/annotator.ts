/**
 * Sigil Toolbar - Annotator
 * Point-and-click annotation with physics context capture
 */

import type { Annotation, PhysicsConfig, ScreenshotRequest, ScreenshotResponse, Message } from '../shared/types'
import { detectPhysics, getSelector } from './physics-detector'
import { checkViolations } from './violation-checker'

let isAnnotating = false
let overlay: HTMLDivElement | null = null
let highlightedElement: Element | null = null
let onAnnotationComplete: ((annotation: Annotation | null) => void) | null = null

/**
 * Start annotation mode
 */
export function startAnnotation(): Promise<Annotation | null> {
  return new Promise((resolve) => {
    if (isAnnotating) {
      resolve(null)
      return
    }

    isAnnotating = true
    onAnnotationComplete = resolve

    createOverlay()
    document.addEventListener('mousemove', handleMouseMove, { capture: true })
    document.addEventListener('click', handleClick, { capture: true })
    document.addEventListener('keydown', handleKeyDown, { capture: true })

    console.log('[Sigil] Annotation mode started')
  })
}

/**
 * Stop annotation mode
 */
export function stopAnnotation(): void {
  if (!isAnnotating) return

  isAnnotating = false
  removeOverlay()
  removeHighlight()

  document.removeEventListener('mousemove', handleMouseMove, { capture: true })
  document.removeEventListener('click', handleClick, { capture: true })
  document.removeEventListener('keydown', handleKeyDown, { capture: true })

  if (onAnnotationComplete) {
    onAnnotationComplete(null)
    onAnnotationComplete = null
  }

  console.log('[Sigil] Annotation mode stopped')
}

/**
 * Check if annotation mode is active
 */
export function isAnnotationMode(): boolean {
  return isAnnotating
}

/**
 * Create overlay for annotation mode
 */
function createOverlay(): void {
  overlay = document.createElement('div')
  overlay.className = 'sigil-annotation-overlay'
  document.body.appendChild(overlay)
}

/**
 * Remove overlay
 */
function removeOverlay(): void {
  if (overlay) {
    overlay.remove()
    overlay = null
  }
}

/**
 * Handle mouse movement - highlight hovered element
 */
function handleMouseMove(event: MouseEvent): void {
  // Ignore toolbar elements
  if ((event.target as Element)?.closest('.sigil-toolbar')) {
    removeHighlight()
    return
  }

  const element = document.elementFromPoint(event.clientX, event.clientY)

  if (element && element !== overlay && !element.closest('.sigil-toolbar')) {
    highlightElement(element)
  } else {
    removeHighlight()
  }
}

/**
 * Highlight an element
 */
function highlightElement(element: Element): void {
  if (highlightedElement === element) return

  removeHighlight()
  highlightedElement = element
  element.classList.add('sigil-highlight')
}

/**
 * Remove highlight from current element
 */
function removeHighlight(): void {
  if (highlightedElement) {
    highlightedElement.classList.remove('sigil-highlight')
    highlightedElement = null
  }
}

/**
 * Handle click - capture annotation
 */
async function handleClick(event: MouseEvent): Promise<void> {
  event.preventDefault()
  event.stopPropagation()

  if (!highlightedElement) {
    stopAnnotation()
    return
  }

  const element = highlightedElement

  // Stop annotation mode immediately
  const callback = onAnnotationComplete
  onAnnotationComplete = null
  isAnnotating = false
  removeOverlay()
  removeHighlight()
  document.removeEventListener('mousemove', handleMouseMove, { capture: true })
  document.removeEventListener('click', handleClick, { capture: true })
  document.removeEventListener('keydown', handleKeyDown, { capture: true })

  // Capture annotation data
  const annotation = await captureAnnotation(element)

  if (callback) {
    callback(annotation)
  }
}

/**
 * Handle escape key to cancel
 */
function handleKeyDown(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    stopAnnotation()
  }
}

/**
 * Capture all annotation data for an element
 */
async function captureAnnotation(element: Element): Promise<Annotation> {
  // Detect physics
  const physics = detectPhysics(element)

  // Get element bounds
  const rect = element.getBoundingClientRect()

  // Capture screenshot
  const screenshotRequest: ScreenshotRequest = {
    bounds: {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
    },
    padding: 20,
  }

  let screenshotRef: string | undefined

  try {
    const response = await chrome.runtime.sendMessage({
      type: 'CAPTURE_SCREENSHOT',
      payload: screenshotRequest,
    } as Message<ScreenshotRequest>) as ScreenshotResponse

    if (response?.success && response.ref) {
      screenshotRef = response.ref
    }
  } catch (error) {
    console.warn('[Sigil] Screenshot capture failed:', error)
  }

  // Build annotation
  const annotation: Annotation = {
    id: generateId(),
    timestamp: new Date().toISOString(),
    element: {
      selector: getSelector(element),
      tagName: element.tagName.toLowerCase(),
      textContent: element.textContent?.slice(0, 100) || undefined,
    },
    physics,
    screenshot: screenshotRef,
    note: '', // Will be filled by user
    url: window.location.href,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
  }

  return annotation
}

/**
 * Generate unique ID
 */
function generateId(): string {
  return `ann-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Get violations for annotated element
 */
export function getAnnotationViolations(annotation: Annotation): ReturnType<typeof checkViolations> {
  const element = document.querySelector(annotation.element.selector)
  if (!element) return []

  return checkViolations(element, annotation.physics)
}
