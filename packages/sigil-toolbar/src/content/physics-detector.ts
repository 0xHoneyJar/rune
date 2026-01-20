/**
 * Sigil Toolbar - Physics Detector
 * Detects Sigil physics configuration from DOM elements
 */

import type { PhysicsConfig, EffectType, SyncStrategy } from '../shared/types'

// Data attribute name
const PHYSICS_ATTR = 'data-sigil-physics'

/**
 * Detect physics configuration from an element
 * Priority: data attribute > CSS inference > null
 */
export function detectPhysics(element: Element): PhysicsConfig | null {
  // Try data attribute first
  const attrPhysics = parseDataAttribute(element)
  if (attrPhysics) return attrPhysics

  // Fall back to CSS inference
  return inferFromCSS(element)
}

/**
 * Parse physics from data-sigil-physics attribute
 */
function parseDataAttribute(element: Element): PhysicsConfig | null {
  const attr = element.getAttribute(PHYSICS_ATTR)
  if (!attr) return null

  try {
    const parsed = JSON.parse(attr)
    return validatePhysicsConfig(parsed)
  } catch (error) {
    console.warn('[Sigil] Malformed physics attribute:', error)
    return null
  }
}

/**
 * Validate and normalize a physics config object
 */
function validatePhysicsConfig(obj: unknown): PhysicsConfig | null {
  if (!obj || typeof obj !== 'object') return null

  const config = obj as Record<string, unknown>

  // Require effect type
  if (!isValidEffect(config.effect)) return null

  const effect = config.effect as EffectType

  // Build validated config
  const result: PhysicsConfig = {
    effect,
    behavioral: {
      sync: getSync(config.behavioral),
      timing: getTiming(config.behavioral) || getDefaultTiming(effect),
      confirmation: getConfirmation(config.behavioral) || getDefaultConfirmation(effect),
    },
  }

  // Optional animation
  if (config.animation && typeof config.animation === 'object') {
    const anim = config.animation as Record<string, unknown>
    result.animation = {
      easing: typeof anim.easing === 'string' ? anim.easing : 'ease-out',
      duration: typeof anim.duration === 'string' ? anim.duration : undefined,
    }
  }

  // Optional material
  if (config.material && typeof config.material === 'object') {
    const mat = config.material as Record<string, unknown>
    result.material = {
      surface: typeof mat.surface === 'string' ? mat.surface : 'elevated',
      shadow: typeof mat.shadow === 'string' ? mat.shadow : 'soft',
      radius: typeof mat.radius === 'string' ? mat.radius : '8px',
    }
  }

  return result
}

function isValidEffect(value: unknown): value is EffectType {
  const validEffects: EffectType[] = ['Financial', 'Destructive', 'SoftDelete', 'Standard', 'Local', 'Navigation', 'Query']
  return typeof value === 'string' && validEffects.includes(value as EffectType)
}

function getSync(behavioral: unknown): SyncStrategy {
  if (!behavioral || typeof behavioral !== 'object') return 'optimistic'
  const b = behavioral as Record<string, unknown>
  if (b.sync === 'pessimistic' || b.sync === 'optimistic' || b.sync === 'immediate') {
    return b.sync
  }
  return 'optimistic'
}

function getTiming(behavioral: unknown): string | null {
  if (!behavioral || typeof behavioral !== 'object') return null
  const b = behavioral as Record<string, unknown>
  return typeof b.timing === 'string' ? b.timing : null
}

function getConfirmation(behavioral: unknown): 'required' | 'toast' | 'none' | null {
  if (!behavioral || typeof behavioral !== 'object') return null
  const b = behavioral as Record<string, unknown>
  if (b.confirmation === 'required' || b.confirmation === 'toast' || b.confirmation === 'none') {
    return b.confirmation
  }
  return null
}

function getDefaultTiming(effect: EffectType): string {
  switch (effect) {
    case 'Financial': return '800ms'
    case 'Destructive': return '600ms'
    case 'SoftDelete': return '200ms'
    case 'Standard': return '200ms'
    case 'Local': return '100ms'
    case 'Navigation': return '150ms'
    case 'Query': return '150ms'
    default: return '200ms'
  }
}

function getDefaultConfirmation(effect: EffectType): 'required' | 'toast' | 'none' {
  switch (effect) {
    case 'Financial': return 'required'
    case 'Destructive': return 'required'
    case 'SoftDelete': return 'toast'
    default: return 'none'
  }
}

/**
 * Infer physics from CSS transitions/animations
 */
function inferFromCSS(element: Element): PhysicsConfig | null {
  const computed = window.getComputedStyle(element)

  const transition = computed.transition
  const animation = computed.animation

  // No transitions or animations = no detectable physics
  if (transition === 'none' && animation === 'none') {
    return null
  }

  // Extract timing from transition
  const timing = extractTimingFromTransition(transition)
  const easing = extractEasingFromTransition(transition)

  if (!timing) return null

  // Infer effect type from timing
  const effect = inferEffectFromTiming(timing)

  return {
    effect,
    behavioral: {
      sync: effect === 'Financial' || effect === 'Destructive' ? 'pessimistic' : 'optimistic',
      timing: `${timing}ms`,
      confirmation: getDefaultConfirmation(effect),
    },
    animation: easing ? { easing } : undefined,
  }
}

/**
 * Extract duration in ms from CSS transition string
 */
function extractTimingFromTransition(transition: string): number | null {
  // Match patterns like "0.3s" or "300ms"
  const match = transition.match(/(\d+(?:\.\d+)?)(s|ms)/)
  if (!match) return null

  const value = parseFloat(match[1])
  const unit = match[2]

  return unit === 's' ? value * 1000 : value
}

/**
 * Extract easing from CSS transition string
 */
function extractEasingFromTransition(transition: string): string | null {
  // Common easing functions
  const easings = ['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear']

  for (const easing of easings) {
    if (transition.includes(easing)) {
      return easing
    }
  }

  // Check for cubic-bezier
  const bezierMatch = transition.match(/cubic-bezier\([^)]+\)/)
  if (bezierMatch) {
    return bezierMatch[0]
  }

  return null
}

/**
 * Infer effect type from timing duration
 */
function inferEffectFromTiming(ms: number): EffectType {
  if (ms >= 700) return 'Financial'
  if (ms >= 500) return 'Destructive'
  if (ms >= 150) return 'Standard'
  return 'Local'
}

/**
 * Generate CSS selector for an element
 */
export function getSelector(element: Element): string {
  // Try ID first
  if (element.id) {
    return `#${CSS.escape(element.id)}`
  }

  // Try unique class combination
  const classes = Array.from(element.classList)
  if (classes.length > 0) {
    const classSelector = '.' + classes.map(c => CSS.escape(c)).join('.')
    const matches = document.querySelectorAll(classSelector)
    if (matches.length === 1) {
      return classSelector
    }
  }

  // Build path from root
  const path: string[] = []
  let current: Element | null = element

  while (current && current !== document.body) {
    let selector = current.tagName.toLowerCase()

    if (current.id) {
      selector = `#${CSS.escape(current.id)}`
      path.unshift(selector)
      break
    }

    // Add nth-child if needed
    const parent = current.parentElement
    if (parent) {
      const siblings = Array.from(parent.children)
      const sameTag = siblings.filter(s => s.tagName === current!.tagName)
      if (sameTag.length > 1) {
        const index = sameTag.indexOf(current) + 1
        selector += `:nth-of-type(${index})`
      }
    }

    path.unshift(selector)
    current = parent
  }

  return path.join(' > ')
}
