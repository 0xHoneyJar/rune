/**
 * Toolbar Store
 *
 * Zustand store for toolbar state management.
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ToolbarState, ToolbarPosition, ToolbarTab } from '../types'
import { DEFAULT_TOOLBAR_STATE } from '../types'

/**
 * Toolbar store actions
 */
interface ToolbarActions {
  open: () => void
  close: () => void
  toggle: () => void
  setActiveTab: (tab: ToolbarTab) => void
  setPosition: (position: ToolbarPosition) => void
}

/**
 * Combined toolbar store type
 */
export type ToolbarStore = ToolbarState & ToolbarActions

/**
 * Create the toolbar store
 */
export const useToolbarStore = create<ToolbarStore>()(
  persist(
    (set) => ({
      ...DEFAULT_TOOLBAR_STATE,

      open: () => set({ isOpen: true }),

      close: () => set({ isOpen: false }),

      toggle: () => set((state) => ({ isOpen: !state.isOpen })),

      setActiveTab: (tab: ToolbarTab) => set({ activeTab: tab }),

      setPosition: (position: ToolbarPosition) => set({ position }),
    }),
    {
      name: 'agentation-toolbar',
      // Only persist position (user preference)
      partialize: (state) => ({
        position: state.position,
      }),
    }
  )
)

/**
 * Get toolbar state (for non-React contexts)
 */
export function getToolbarState(): ToolbarState {
  const state = useToolbarStore.getState()
  return {
    isOpen: state.isOpen,
    activeTab: state.activeTab,
    position: state.position,
  }
}
