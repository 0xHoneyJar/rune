/**
 * Agentation Component
 *
 * Main component that composes Trigger and Toolbar.
 * Use inside AgentationProvider.
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

import type { ReactNode } from 'react'
import type { ToolbarPosition } from '../types'
import { Trigger } from './Trigger'
import { Toolbar } from './Toolbar'

/**
 * Props for Agentation component
 */
export interface AgentationComponentProps {
  /** Custom trigger button content */
  triggerContent?: ReactNode
  /** Override position */
  position?: ToolbarPosition
}

/**
 * Main Agentation component
 */
export function Agentation({ triggerContent, position }: AgentationComponentProps) {
  return (
    <>
      <Trigger position={position}>{triggerContent}</Trigger>
      <Toolbar />
    </>
  )
}
