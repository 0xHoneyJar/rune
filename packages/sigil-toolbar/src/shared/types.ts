/**
 * Sigil Toolbar - Shared Types
 */

// Physics types matching Sigil's design physics
export type EffectType = 'Financial' | 'Destructive' | 'SoftDelete' | 'Standard' | 'Local' | 'Navigation' | 'Query'

export type SyncStrategy = 'pessimistic' | 'optimistic' | 'immediate'

export interface PhysicsConfig {
  effect: EffectType
  behavioral: {
    sync: SyncStrategy
    timing: string // e.g., "800ms"
    confirmation: 'required' | 'toast' | 'none'
  }
  animation?: {
    easing: string // e.g., "ease-out" or "spring(400, 25)"
    duration?: string
  }
  material?: {
    surface: string
    shadow: string
    radius: string
  }
}

// Violation types
export type ViolationSeverity = 'error' | 'warning' | 'info'

export interface Violation {
  id: string
  element: Element
  selector: string
  type: string
  severity: ViolationSeverity
  message: string
  recommendation: string
  details?: Record<string, unknown>
}

// Annotation types
export interface Annotation {
  id: string
  timestamp: string
  element: {
    selector: string
    tagName: string
    textContent?: string
  }
  physics: PhysicsConfig | null
  screenshot?: string // base64 or storage ref
  note: string
  url: string
  viewport: {
    width: number
    height: number
  }
}

// Feedback request for Linear/API
export interface FeedbackRequest {
  source: 'toolbar'
  annotation: Annotation
  violations?: Violation[]
  metadata: {
    extensionVersion: string
    userAgent: string
    timestamp: string
  }
}

// Settings
export interface ToolbarSettings {
  feedbackApiUrl: string
  keyboardShortcuts: {
    toggleToolbar: string
    annotate: string
    pauseAnimations: string
    audit: string
  }
  defaultPosition: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  enabledTools: {
    physicsDetector: boolean
    animationInspector: boolean
    capabilityAudit: boolean
    screenshot: boolean
    annotate: boolean
  }
}

// Message types for background <-> content communication
export type MessageType =
  | 'CAPTURE_SCREENSHOT'
  | 'SUBMIT_FEEDBACK'
  | 'GET_SETTINGS'
  | 'UPDATE_SETTINGS'
  | 'SCREENSHOT_CAPTURED'
  | 'FEEDBACK_SUBMITTED'

export interface Message<T = unknown> {
  type: MessageType
  payload: T
}

// Screenshot request/response
export interface ScreenshotRequest {
  bounds: {
    x: number
    y: number
    width: number
    height: number
  }
  padding?: number
}

export interface ScreenshotResponse {
  success: boolean
  data?: string // base64
  ref?: string // storage key
  error?: string
}
