/**
 * Sigil Toolbar - Content Script Entry Point
 */

import './styles.css'
import { createToolbar, destroyToolbar, toggleToolbar } from '../ui/toolbar'

// Initialize toolbar
let initialized = false

function init() {
  if (initialized) return
  initialized = true

  // Create toolbar UI
  createToolbar()

  console.log('[Sigil Toolbar] Content script initialized')
}

// Listen for messages from background
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'TOGGLE_TOOLBAR') {
    toggleToolbar()
    sendResponse({ success: true })
  }
  return true
})

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}

// Cleanup on unload
window.addEventListener('unload', () => {
  destroyToolbar()
})
