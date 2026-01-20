/**
 * Sigil Toolbar - Violation Checker
 * Checks elements for Sigil physics violations
 */

import type { Violation, ViolationSeverity, PhysicsConfig } from '../shared/types'
import { getSelector } from './physics-detector'

const MIN_TOUCH_TARGET = 44 // Apple HIG minimum

/**
 * Check an element for violations
 */
export function checkViolations(element: Element, physics: PhysicsConfig | null): Violation[] {
  const violations: Violation[] = []

  // Check touch target size
  const touchViolation = checkTouchTarget(element)
  if (touchViolation) violations.push(touchViolation)

  // Check focus ring
  const focusViolation = checkFocusRing(element)
  if (focusViolation) violations.push(focusViolation)

  // Physics-specific checks
  if (physics) {
    const physicsViolations = checkPhysicsViolations(element, physics)
    violations.push(...physicsViolations)
  }

  return violations
}

/**
 * Check if element meets minimum touch target size
 */
function checkTouchTarget(element: Element): Violation | null {
  const rect = element.getBoundingClientRect()

  // Only check interactive elements
  if (!isInteractive(element)) return null

  const width = rect.width
  const height = rect.height

  if (width < MIN_TOUCH_TARGET || height < MIN_TOUCH_TARGET) {
    return {
      id: `touch-target-${Date.now()}`,
      element,
      selector: getSelector(element),
      type: 'touch-target',
      severity: 'error',
      message: `Touch target too small: ${Math.round(width)}x${Math.round(height)}px (minimum ${MIN_TOUCH_TARGET}x${MIN_TOUCH_TARGET}px)`,
      recommendation: `Increase padding or min-width/min-height to meet ${MIN_TOUCH_TARGET}px minimum`,
      details: {
        width,
        height,
        minimum: MIN_TOUCH_TARGET,
      },
    }
  }

  return null
}

/**
 * Check if element has visible focus ring
 */
function checkFocusRing(element: Element): Violation | null {
  // Only check focusable elements
  if (!isFocusable(element)) return null

  // Store current state
  const activeElement = document.activeElement

  // Focus element (without scrolling)
  if (element instanceof HTMLElement) {
    element.focus({ preventScroll: true })
  }

  // Get focus styles
  const focusedStyle = window.getComputedStyle(element)
  const outline = focusedStyle.outline
  const outlineWidth = focusedStyle.outlineWidth
  const boxShadow = focusedStyle.boxShadow

  // Restore focus
  if (activeElement instanceof HTMLElement) {
    activeElement.focus({ preventScroll: true })
  } else {
    (element as HTMLElement).blur?.()
  }

  // Check if focus is visible
  const hasOutline = outline !== 'none' && outlineWidth !== '0px'
  const hasBoxShadowRing = boxShadow !== 'none' && boxShadow.includes('0px 0px 0px')

  if (!hasOutline && !hasBoxShadowRing) {
    return {
      id: `focus-ring-${Date.now()}`,
      element,
      selector: getSelector(element),
      type: 'focus-ring',
      severity: 'error',
      message: 'Missing visible focus indicator',
      recommendation: 'Add outline or box-shadow on :focus-visible state',
      details: {
        outline,
        boxShadow,
      },
    }
  }

  return null
}

/**
 * Check physics-specific violations
 */
function checkPhysicsViolations(element: Element, physics: PhysicsConfig): Violation[] {
  const violations: Violation[] = []

  // Financial/Destructive should have confirmation
  if (physics.effect === 'Financial' || physics.effect === 'Destructive') {
    // Check for confirmation mechanism
    const hasConfirmation = checkForConfirmation(element)
    if (!hasConfirmation && physics.behavioral.confirmation === 'none') {
      violations.push({
        id: `missing-confirmation-${Date.now()}`,
        element,
        selector: getSelector(element),
        type: 'missing-confirmation',
        severity: 'warning',
        message: `${physics.effect} action should have confirmation`,
        recommendation: 'Add confirmation modal or two-step process',
        details: {
          effect: physics.effect,
        },
      })
    }
  }

  // Financial should not be optimistic
  if (physics.effect === 'Financial' && physics.behavioral.sync === 'optimistic') {
    violations.push({
      id: `optimistic-financial-${Date.now()}`,
      element,
      selector: getSelector(element),
      type: 'optimistic-financial',
      severity: 'error',
      message: 'Financial operations must be pessimistic',
      recommendation: 'Change sync strategy to pessimistic - financial operations cannot roll back',
      details: {
        currentSync: physics.behavioral.sync,
        requiredSync: 'pessimistic',
      },
    })
  }

  // Check timing is appropriate
  const timingViolation = checkTiming(element, physics)
  if (timingViolation) violations.push(timingViolation)

  return violations
}

/**
 * Check for confirmation mechanism (simplified heuristic)
 */
function checkForConfirmation(element: Element): boolean {
  // Check for data attributes indicating confirmation
  if (element.hasAttribute('data-confirm') || element.hasAttribute('data-confirmation')) {
    return true
  }

  // Check for common confirmation patterns in nearby elements
  const container = element.closest('form, [role="dialog"], .modal')
  if (container) {
    // If in a modal/dialog, assume confirmation exists
    return true
  }

  return false
}

/**
 * Check if timing matches effect expectations
 */
function checkTiming(element: Element, physics: PhysicsConfig): Violation | null {
  const timing = parseInt(physics.behavioral.timing)

  // Financial should be 800ms+
  if (physics.effect === 'Financial' && timing < 800) {
    return {
      id: `timing-financial-${Date.now()}`,
      element,
      selector: getSelector(element),
      type: 'timing-mismatch',
      severity: 'warning',
      message: `Financial timing too fast: ${timing}ms (recommended 800ms)`,
      recommendation: 'Increase timing to 800ms for financial operations',
      details: {
        currentTiming: timing,
        recommendedTiming: 800,
        effect: physics.effect,
      },
    }
  }

  // Destructive should be 600ms+
  if (physics.effect === 'Destructive' && timing < 600) {
    return {
      id: `timing-destructive-${Date.now()}`,
      element,
      selector: getSelector(element),
      type: 'timing-mismatch',
      severity: 'warning',
      message: `Destructive timing too fast: ${timing}ms (recommended 600ms)`,
      recommendation: 'Increase timing to 600ms for destructive operations',
      details: {
        currentTiming: timing,
        recommendedTiming: 600,
        effect: physics.effect,
      },
    }
  }

  return null
}

/**
 * Check if element is interactive
 */
function isInteractive(element: Element): boolean {
  const tag = element.tagName.toLowerCase()
  const interactiveTags = ['button', 'a', 'input', 'select', 'textarea']

  if (interactiveTags.includes(tag)) return true

  // Check role
  const role = element.getAttribute('role')
  const interactiveRoles = ['button', 'link', 'checkbox', 'radio', 'tab', 'menuitem']
  if (role && interactiveRoles.includes(role)) return true

  // Check click handlers (limited detection)
  if (element.hasAttribute('onclick')) return true

  return false
}

/**
 * Check if element is focusable
 */
function isFocusable(element: Element): boolean {
  if (!isInteractive(element)) return false

  // Check tabindex
  const tabindex = element.getAttribute('tabindex')
  if (tabindex === '-1') return false

  // Check if disabled
  if ((element as HTMLButtonElement).disabled) return false

  return true
}

/**
 * Check all interactive elements on page
 */
export function auditPage(): Violation[] {
  const violations: Violation[] = []
  const interactiveSelector = 'button, a, input, select, textarea, [role="button"], [role="link"], [onclick]'

  const elements = document.querySelectorAll(interactiveSelector)

  for (const element of elements) {
    const elementViolations = checkViolations(element, null)
    violations.push(...elementViolations)
  }

  return violations
}
