/**
 * Keyboard Shortcuts Hook
 *
 * Handle keyboard shortcuts for toolbar navigation.
 */

import { useEffect, useCallback } from 'react'
import { useToolbarStore } from '../store/toolbar'
import type { ToolbarTab } from '../types'

/**
 * Props for useKeyboardShortcuts
 */
export interface UseKeyboardShortcutsProps {
  /** Whether shortcuts are enabled */
  enabled?: boolean
}

/**
 * Hook to handle keyboard shortcuts for toolbar
 *
 * Shortcuts:
 * - Ctrl+Shift+D: Toggle toolbar
 * - Escape: Close toolbar
 * - 1: Switch to Lens tab (when open)
 * - 2: Switch to Inspector tab (when open)
 */
export function useKeyboardShortcuts({ enabled = true }: UseKeyboardShortcutsProps = {}) {
  const toggle = useToolbarStore((state) => state.toggle)
  const close = useToolbarStore((state) => state.close)
  const setActiveTab = useToolbarStore((state) => state.setActiveTab)
  const isOpen = useToolbarStore((state) => state.isOpen)

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return

      // Ignore if typing in an input
      const target = event.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return
      }

      // Ctrl/Cmd + Shift + D: Toggle toolbar
      if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key.toLowerCase() === 'd') {
        event.preventDefault()
        toggle()
        return
      }

      // Only handle other shortcuts when toolbar is open
      if (!isOpen) return

      // Number keys for tabs when toolbar is open
      const tabMap: Record<string, ToolbarTab> = {
        '1': 'lens',
        '2': 'inspector',
      }

      if (tabMap[event.key]) {
        event.preventDefault()
        setActiveTab(tabMap[event.key])
        return
      }

      // Escape to close
      if (event.key === 'Escape') {
        event.preventDefault()
        close()
        return
      }
    },
    [enabled, toggle, close, setActiveTab, isOpen]
  )

  useEffect(() => {
    if (!enabled) return

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [enabled, handleKeyDown])
}

/**
 * Get keyboard shortcut help text
 */
export function getShortcutHelp(): Array<{ keys: string; description: string }> {
  return [
    { keys: '⌘⇧D / Ctrl+Shift+D', description: 'Toggle toolbar' },
    { keys: '1', description: 'Switch to Lens tab' },
    { keys: '2', description: 'Switch to Inspector tab' },
    { keys: 'Esc', description: 'Close toolbar' },
  ]
}
