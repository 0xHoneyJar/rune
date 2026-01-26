/**
 * Agentation Types
 *
 * Shared types for the agentation package.
 */

import type { ReactNode } from 'react'

/**
 * Address type (0x-prefixed hex string)
 */
export type Address = `0x${string}`

/**
 * Toolbar position
 */
export type ToolbarPosition =
  | 'bottom-right'
  | 'bottom-left'
  | 'top-right'
  | 'top-left'

/**
 * Active tab in toolbar
 */
export type ToolbarTab = 'lens' | 'inspector'

/**
 * Agentation configuration
 */
export interface AgentationConfig {
  /** Default position (default: 'bottom-right') */
  position?: ToolbarPosition
  /** Enable keyboard shortcuts (default: true) */
  shortcuts?: boolean
  /** Persist state to localStorage (default: true) */
  persist?: boolean
  /** Default tab (default: 'lens') */
  defaultTab?: ToolbarTab
}

/**
 * Saved address entry
 */
export interface SavedAddress {
  address: Address
  label: string
  addedAt: number
}

/**
 * Lens state for address impersonation
 */
export interface LensState {
  /** Whether lens impersonation is enabled */
  enabled: boolean
  /** Currently impersonated address */
  impersonatedAddress: Address | null
  /** The real connected wallet address */
  realAddress: Address | null
  /** Saved addresses for quick selection */
  savedAddresses: SavedAddress[]
}

/**
 * Toolbar state
 */
export interface ToolbarState {
  /** Whether toolbar is open */
  isOpen: boolean
  /** Current active tab */
  activeTab: ToolbarTab
  /** Toolbar position */
  position: ToolbarPosition
}

/**
 * Annotation category
 */
export type AnnotationCategory =
  | 'bug'
  | 'suggestion'
  | 'ux'
  | 'layout'
  | 'accessibility'
  | 'performance'
  | 'other'

/**
 * Inspected element info
 */
export interface InspectedElement {
  /** CSS selector for the element */
  selector: string
  /** Element tag name */
  tagName: string
  /** CSS classes */
  classes: string[]
  /** Data attributes */
  dataAttributes: Record<string, string>
  /** React component name (if detectable) */
  componentName?: string
  /** Element bounding rect */
  rect: DOMRect
}

/**
 * Annotation entry
 */
export interface Annotation {
  id: string
  element: InspectedElement
  note: string
  category: AnnotationCategory
  timestamp: number
}

/**
 * Agentation provider props
 */
export interface AgentationProviderProps {
  children: ReactNode
  config?: AgentationConfig
}

/**
 * Agentation component props
 */
export interface AgentationProps {
  /** Override trigger button content */
  triggerContent?: ReactNode
  /** Override position */
  position?: ToolbarPosition
}

/**
 * Default configuration
 */
export const DEFAULT_CONFIG: Required<AgentationConfig> = {
  position: 'bottom-right',
  shortcuts: true,
  persist: true,
  defaultTab: 'lens',
}

/**
 * Default toolbar state
 */
export const DEFAULT_TOOLBAR_STATE: ToolbarState = {
  isOpen: false,
  activeTab: 'lens',
  position: 'bottom-right',
}

/**
 * Default lens state
 */
export const DEFAULT_LENS_STATE: LensState = {
  enabled: false,
  impersonatedAddress: null,
  realAddress: null,
  savedAddresses: [],
}
