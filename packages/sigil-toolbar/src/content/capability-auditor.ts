/**
 * Sigil Toolbar - Protected Capabilities Auditor
 * Audits page for Sigil protected capability compliance
 */

export interface AuditResult {
  capability: string
  status: 'pass' | 'warn' | 'fail'
  message: string
  elements?: Element[]
  details?: Record<string, unknown>
}

export interface CapabilityAudit {
  timestamp: string
  url: string
  results: AuditResult[]
  summary: {
    pass: number
    warn: number
    fail: number
  }
}

/**
 * Run full capability audit on the page
 */
export function auditCapabilities(): CapabilityAudit {
  const results: AuditResult[] = [
    auditCancelButtons(),
    auditBalanceDisplay(),
    auditErrorRecovery(),
    auditTouchTargets(),
    auditFocusRings(),
    auditLoadingStates(),
  ]

  const summary = {
    pass: results.filter(r => r.status === 'pass').length,
    warn: results.filter(r => r.status === 'warn').length,
    fail: results.filter(r => r.status === 'fail').length,
  }

  return {
    timestamp: new Date().toISOString(),
    url: window.location.href,
    results,
    summary,
  }
}

/**
 * Audit: Cancel buttons must be present and visible
 */
function auditCancelButtons(): AuditResult {
  // Find forms, modals, dialogs
  const containers = document.querySelectorAll('form, [role="dialog"], .modal, [data-modal]')

  if (containers.length === 0) {
    return {
      capability: 'Cancel/Escape Hatch',
      status: 'pass',
      message: 'No forms or dialogs requiring cancel buttons found',
    }
  }

  const missingCancel: Element[] = []

  for (const container of containers) {
    // Look for cancel/close/back buttons
    const cancelSelectors = [
      'button[type="reset"]',
      '[data-cancel]',
      '[aria-label*="cancel" i]',
      '[aria-label*="close" i]',
      '[aria-label*="back" i]',
      'button:has-text("cancel")',
      'button:has-text("close")',
      'button:has-text("back")',
      '.cancel',
      '.close',
      '[data-dismiss]',
    ]

    const cancelButton = container.querySelector(cancelSelectors.join(', ')) ||
      findButtonByText(container, ['cancel', 'close', 'back', 'dismiss', 'nevermind'])

    if (!cancelButton) {
      missingCancel.push(container)
    }
  }

  if (missingCancel.length > 0) {
    return {
      capability: 'Cancel/Escape Hatch',
      status: 'fail',
      message: `${missingCancel.length} container(s) missing cancel/close button`,
      elements: missingCancel,
      details: { containersChecked: containers.length },
    }
  }

  return {
    capability: 'Cancel/Escape Hatch',
    status: 'pass',
    message: `All ${containers.length} containers have cancel buttons`,
    details: { containersChecked: containers.length },
  }
}

/**
 * Audit: Balance displays should be clearly visible
 */
function auditBalanceDisplay(): AuditResult {
  // Find elements that likely display balances
  const balanceSelectors = [
    '[data-balance]',
    '[data-amount]',
    '.balance',
    '.amount',
    '[aria-label*="balance" i]',
  ]

  const balanceElements = document.querySelectorAll(balanceSelectors.join(', '))

  if (balanceElements.length === 0) {
    return {
      capability: 'Balance Display',
      status: 'pass',
      message: 'No balance displays detected (may not be a financial app)',
    }
  }

  const issues: Element[] = []

  for (const element of balanceElements) {
    // Check visibility
    const computed = window.getComputedStyle(element)
    if (computed.display === 'none' || computed.visibility === 'hidden' || computed.opacity === '0') {
      issues.push(element)
      continue
    }

    // Check font size (should be readable)
    const fontSize = parseFloat(computed.fontSize)
    if (fontSize < 12) {
      issues.push(element)
    }
  }

  if (issues.length > 0) {
    return {
      capability: 'Balance Display',
      status: 'warn',
      message: `${issues.length} balance element(s) may have visibility issues`,
      elements: issues,
      details: { totalBalances: balanceElements.length },
    }
  }

  return {
    capability: 'Balance Display',
    status: 'pass',
    message: `${balanceElements.length} balance display(s) are visible`,
    details: { totalBalances: balanceElements.length },
  }
}

/**
 * Audit: Error states should have recovery paths
 */
function auditErrorRecovery(): AuditResult {
  // Find error states
  const errorSelectors = [
    '[data-error]',
    '.error',
    '.error-message',
    '[role="alert"]',
    '[aria-invalid="true"]',
  ]

  const errorElements = document.querySelectorAll(errorSelectors.join(', '))

  if (errorElements.length === 0) {
    return {
      capability: 'Error Recovery',
      status: 'pass',
      message: 'No error states currently displayed',
    }
  }

  const missingRecovery: Element[] = []

  for (const error of errorElements) {
    // Look for nearby recovery options (retry, back, contact support)
    const container = error.parentElement || error
    const recoveryButton = container.querySelector('button, a') ||
      findButtonByText(container, ['retry', 'try again', 'go back', 'contact', 'help'])

    if (!recoveryButton) {
      missingRecovery.push(error)
    }
  }

  if (missingRecovery.length > 0) {
    return {
      capability: 'Error Recovery',
      status: 'fail',
      message: `${missingRecovery.length} error state(s) without recovery path`,
      elements: missingRecovery,
      details: { totalErrors: errorElements.length },
    }
  }

  return {
    capability: 'Error Recovery',
    status: 'pass',
    message: `${errorElements.length} error state(s) have recovery options`,
    details: { totalErrors: errorElements.length },
  }
}

/**
 * Audit: Touch targets must be at least 44px
 */
function auditTouchTargets(): AuditResult {
  const interactiveSelector = 'button, a, input, select, textarea, [role="button"], [role="link"], [onclick]'
  const elements = document.querySelectorAll(interactiveSelector)

  const tooSmall: Element[] = []
  const MIN_SIZE = 44

  for (const element of elements) {
    const rect = element.getBoundingClientRect()
    if (rect.width < MIN_SIZE || rect.height < MIN_SIZE) {
      // Ignore hidden elements
      const computed = window.getComputedStyle(element)
      if (computed.display !== 'none' && computed.visibility !== 'hidden') {
        tooSmall.push(element)
      }
    }
  }

  if (tooSmall.length > 0) {
    return {
      capability: 'Touch Target Size',
      status: 'fail',
      message: `${tooSmall.length} interactive element(s) below ${MIN_SIZE}px minimum`,
      elements: tooSmall,
      details: { totalInteractive: elements.length, minimum: MIN_SIZE },
    }
  }

  return {
    capability: 'Touch Target Size',
    status: 'pass',
    message: `All ${elements.length} interactive elements meet ${MIN_SIZE}px minimum`,
    details: { totalInteractive: elements.length, minimum: MIN_SIZE },
  }
}

/**
 * Audit: Focus rings must be visible on focusable elements
 */
function auditFocusRings(): AuditResult {
  const focusableSelector = 'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  const elements = document.querySelectorAll(focusableSelector)

  const missingRing: Element[] = []
  const activeElement = document.activeElement

  for (const element of elements) {
    // Skip disabled and hidden elements
    if ((element as HTMLButtonElement).disabled) continue
    const computed = window.getComputedStyle(element)
    if (computed.display === 'none' || computed.visibility === 'hidden') continue

    // Focus and check for visible ring
    if (element instanceof HTMLElement) {
      element.focus({ preventScroll: true })
    }

    const focusedStyle = window.getComputedStyle(element)
    const hasOutline = focusedStyle.outline !== 'none' && focusedStyle.outlineWidth !== '0px'
    const hasShadowRing = focusedStyle.boxShadow !== 'none'

    if (!hasOutline && !hasShadowRing) {
      missingRing.push(element)
    }
  }

  // Restore focus
  if (activeElement instanceof HTMLElement) {
    activeElement.focus({ preventScroll: true })
  }

  if (missingRing.length > 0) {
    return {
      capability: 'Focus Ring Visibility',
      status: 'fail',
      message: `${missingRing.length} focusable element(s) missing visible focus indicator`,
      elements: missingRing,
      details: { totalFocusable: elements.length },
    }
  }

  return {
    capability: 'Focus Ring Visibility',
    status: 'pass',
    message: `All ${elements.length} focusable elements have visible focus indicators`,
    details: { totalFocusable: elements.length },
  }
}

/**
 * Audit: Loading states should not hide critical UI
 */
function auditLoadingStates(): AuditResult {
  // Find loading indicators
  const loadingSelectors = [
    '[data-loading]',
    '.loading',
    '.spinner',
    '[aria-busy="true"]',
    '.skeleton',
  ]

  const loadingElements = document.querySelectorAll(loadingSelectors.join(', '))

  if (loadingElements.length === 0) {
    return {
      capability: 'Loading State Safety',
      status: 'pass',
      message: 'No loading states currently displayed',
    }
  }

  const issues: Element[] = []

  for (const loading of loadingElements) {
    // Check if cancel buttons are hidden during loading
    const container = loading.closest('form, [role="dialog"], .modal') || loading.parentElement
    if (!container) continue

    const cancelButton = findButtonByText(container, ['cancel', 'close', 'back'])
    if (cancelButton) {
      const computed = window.getComputedStyle(cancelButton)
      if (computed.display === 'none' || computed.visibility === 'hidden' ||
          (cancelButton as HTMLButtonElement).disabled) {
        issues.push(cancelButton)
      }
    }
  }

  if (issues.length > 0) {
    return {
      capability: 'Loading State Safety',
      status: 'fail',
      message: `${issues.length} cancel button(s) hidden or disabled during loading`,
      elements: issues,
      details: { loadingStates: loadingElements.length },
    }
  }

  return {
    capability: 'Loading State Safety',
    status: 'pass',
    message: 'Cancel buttons remain accessible during loading states',
    details: { loadingStates: loadingElements.length },
  }
}

/**
 * Helper: Find button by text content
 */
function findButtonByText(container: Element, texts: string[]): Element | null {
  const buttons = container.querySelectorAll('button, a, [role="button"]')

  for (const button of buttons) {
    const buttonText = button.textContent?.toLowerCase() || ''
    for (const text of texts) {
      if (buttonText.includes(text)) {
        return button
      }
    }
  }

  return null
}
