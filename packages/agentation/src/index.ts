/**
 * @thehoneyjar/agentation
 *
 * Visual UI feedback toolbar for AI coding agents.
 * Address mocking and element annotation.
 *
 * @example
 * ```tsx
 * import { AgentationProvider, Agentation } from '@thehoneyjar/agentation'
 *
 * function App() {
 *   return (
 *     <AgentationProvider>
 *       <YourApp />
 *       <Agentation />
 *     </AgentationProvider>
 *   )
 * }
 * ```
 */

// Provider
export { AgentationProvider, useAgentation, useAgentationOptional } from './provider'
export type { AgentationContextValue } from './provider'

// Components
export { Agentation, Trigger, Toolbar, LensPanel, InspectorPanel } from './components'
export type { TriggerProps, AgentationComponentProps } from './components'

// Lens hooks
export {
  useLens,
  useLensContext,
  useIsImpersonating,
  useImpersonatedAddress,
  useRealAddress,
  useEffectiveAddress,
  useSavedAddresses,
  useLensActions,
} from './lens'
export type { LensContext, LensService } from './lens'

// Lens service (non-React)
export { createLensService, getLensService, resetLensService } from './lens'

// Inspector hooks
export { useElementInspector, useAnnotationSession, CATEGORY_INFO } from './inspector'
export type {
  UseElementInspectorOptions,
  UseElementInspectorReturn,
  UseAnnotationSessionOptions,
  UseAnnotationSessionReturn,
} from './inspector'

// Inspector components
export { ElementInspector, AnnotationMarker, AnnotationMarkerList } from './inspector'
export type {
  ElementInspectorProps,
  AnnotationMarkerProps,
  AnnotationMarkerListProps,
} from './inspector'

// Keyboard shortcuts
export { useKeyboardShortcuts, getShortcutHelp } from './hooks'
export type { UseKeyboardShortcutsProps } from './hooks'

// Stores (advanced usage)
export { useToolbarStore, getToolbarState } from './store/toolbar'
export { useLensStore, getLensState } from './store/lens'

// Theme
export { theme, colors, spacing, radii, shadows, zIndex } from './theme'

// Types
export type {
  Address,
  ToolbarPosition,
  ToolbarTab,
  AgentationConfig,
  AgentationProviderProps,
  AgentationProps,
  SavedAddress,
  LensState,
  ToolbarState,
  AnnotationCategory,
  InspectedElement,
  Annotation,
} from './types'

export { DEFAULT_CONFIG, DEFAULT_TOOLBAR_STATE, DEFAULT_LENS_STATE } from './types'
