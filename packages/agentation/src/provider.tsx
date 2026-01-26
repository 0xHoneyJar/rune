/**
 * Agentation Provider
 *
 * Context provider for agentation state and configuration.
 */

import { createContext, useContext, useMemo, useEffect } from 'react'
import type { AgentationProviderProps, AgentationConfig, ToolbarState, LensState, ToolbarTab, ToolbarPosition } from './types'
import { DEFAULT_CONFIG } from './types'
import { useToolbarStore } from './store/toolbar'
import { useLensStore } from './store/lens'

/**
 * Agentation context value
 */
export interface AgentationContextValue {
  // Config
  config: Required<AgentationConfig>
  // Toolbar state
  isOpen: boolean
  activeTab: ToolbarTab
  position: ToolbarPosition
  // Toolbar actions
  open: () => void
  close: () => void
  toggle: () => void
  setActiveTab: (tab: ToolbarTab) => void
  setPosition: (position: ToolbarPosition) => void
  // Lens state
  lensEnabled: boolean
  impersonatedAddress: string | null
  realAddress: string | null
  // Lens actions
  setImpersonatedAddress: (address: `0x${string}`) => void
  clearImpersonation: () => void
}

/**
 * Context
 */
const AgentationContext = createContext<AgentationContextValue | null>(null)

/**
 * Agentation Provider component
 */
export function AgentationProvider({
  children,
  config = {},
}: AgentationProviderProps) {
  // Merge config with defaults
  const mergedConfig: Required<AgentationConfig> = useMemo(
    () => ({
      ...DEFAULT_CONFIG,
      ...config,
    }),
    [config]
  )

  // Toolbar store
  const isOpen = useToolbarStore((s) => s.isOpen)
  const activeTab = useToolbarStore((s) => s.activeTab)
  const position = useToolbarStore((s) => s.position)
  const open = useToolbarStore((s) => s.open)
  const close = useToolbarStore((s) => s.close)
  const toggle = useToolbarStore((s) => s.toggle)
  const setActiveTab = useToolbarStore((s) => s.setActiveTab)
  const setPosition = useToolbarStore((s) => s.setPosition)

  // Lens store
  const lensEnabled = useLensStore((s) => s.enabled)
  const impersonatedAddress = useLensStore((s) => s.impersonatedAddress)
  const realAddress = useLensStore((s) => s.realAddress)
  const setImpersonatedAddress = useLensStore((s) => s.setImpersonatedAddress)
  const clearImpersonation = useLensStore((s) => s.clearImpersonation)

  // Initialize position from config if different
  useEffect(() => {
    if (mergedConfig.position !== position) {
      setPosition(mergedConfig.position)
    }
  }, []) // Only on mount

  // Keyboard shortcuts
  useEffect(() => {
    if (!mergedConfig.shortcuts) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Shift+D to toggle
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault()
        toggle()
        return
      }

      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault()
        close()
        return
      }

      // 1/2 to switch tabs when open
      if (isOpen) {
        if (e.key === '1') {
          e.preventDefault()
          setActiveTab('lens')
        } else if (e.key === '2') {
          e.preventDefault()
          setActiveTab('inspector')
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mergedConfig.shortcuts, isOpen, toggle, close, setActiveTab])

  // Build context value
  const value: AgentationContextValue = useMemo(
    () => ({
      config: mergedConfig,
      isOpen,
      activeTab,
      position,
      open,
      close,
      toggle,
      setActiveTab,
      setPosition,
      lensEnabled,
      impersonatedAddress,
      realAddress,
      setImpersonatedAddress,
      clearImpersonation,
    }),
    [
      mergedConfig,
      isOpen,
      activeTab,
      position,
      open,
      close,
      toggle,
      setActiveTab,
      setPosition,
      lensEnabled,
      impersonatedAddress,
      realAddress,
      setImpersonatedAddress,
      clearImpersonation,
    ]
  )

  return (
    <AgentationContext.Provider value={value}>
      {children}
    </AgentationContext.Provider>
  )
}

/**
 * Hook to access agentation context
 *
 * @throws Error if used outside AgentationProvider
 */
export function useAgentation(): AgentationContextValue {
  const context = useContext(AgentationContext)
  if (!context) {
    throw new Error('useAgentation must be used within an AgentationProvider')
  }
  return context
}

/**
 * Hook to access agentation context (returns null if not in provider)
 */
export function useAgentationOptional(): AgentationContextValue | null {
  return useContext(AgentationContext)
}
