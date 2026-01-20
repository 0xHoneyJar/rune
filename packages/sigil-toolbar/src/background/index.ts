/**
 * Sigil Toolbar - Background Service Worker
 * Handles screenshot capture, Linear API, and settings storage
 */

import type { Message, ScreenshotRequest, FeedbackRequest, ToolbarSettings } from '../shared/types'
import { captureScreenshot } from './screenshot'
import { createLinearIssue, verifyLinearCredentials } from './linear'
import { getSettings, updateSettings, resetSettings, exportSettings, importSettings } from './settings'

// Initialize extension
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    // First install - settings will be initialized on first get
    console.log('[Sigil Toolbar] Extension installed')
  } else if (details.reason === 'update') {
    console.log('[Sigil Toolbar] Extension updated')
  }
})

// Handle messages from content script
chrome.runtime.onMessage.addListener((message: Message, _sender, sendResponse) => {
  handleMessage(message).then(sendResponse)
  return true // Keep channel open for async response
})

async function handleMessage(message: Message): Promise<unknown> {
  switch (message.type) {
    case 'CAPTURE_SCREENSHOT':
      return captureScreenshot(message.payload as ScreenshotRequest)

    case 'SUBMIT_FEEDBACK':
      return submitFeedback(message.payload as FeedbackRequest)

    case 'GET_SETTINGS':
      return getSettings()

    case 'UPDATE_SETTINGS':
      return updateSettings(message.payload as Partial<ToolbarSettings>)

    case 'RESET_SETTINGS':
      return resetSettings()

    case 'EXPORT_SETTINGS':
      return exportSettings()

    case 'IMPORT_SETTINGS':
      return importSettings(message.payload as string)

    case 'VERIFY_LINEAR':
      return verifyLinear(message.payload as { apiKey: string; teamId: string })

    default:
      console.warn('[Sigil Toolbar] Unknown message type:', message.type)
      return { error: 'Unknown message type' }
  }
}

async function submitFeedback(request: FeedbackRequest): Promise<{ success: boolean; issueUrl?: string; error?: string }> {
  const settings = await getSettings()

  // If Linear is configured, create issue there
  if (settings.linearApiKey && settings.linearTeamId) {
    return createLinearIssue(request, settings)
  }

  // Otherwise use custom feedback API
  if (!settings.feedbackApiUrl) {
    return { success: false, error: 'No feedback destination configured (Linear API or custom URL)' }
  }

  try {
    const response = await fetch(settings.feedbackApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const result = await response.json()
    return { success: true, issueUrl: result.issueUrl }
  } catch (error) {
    console.error('[Sigil Toolbar] Feedback submission error:', error)
    return { success: false, error: String(error) }
  }
}

async function verifyLinear(
  credentials: { apiKey: string; teamId: string }
): Promise<{ valid: boolean; error?: string; teamName?: string }> {
  return verifyLinearCredentials(credentials.apiKey, credentials.teamId)
}

// Action click handler - toggle toolbar
chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) return

  await chrome.tabs.sendMessage(tab.id, {
    type: 'TOGGLE_TOOLBAR',
    payload: {},
  })
})

// Keyboard command handler
chrome.commands.onCommand.addListener(async (command, tab) => {
  if (!tab?.id) return

  switch (command) {
    case 'toggle-toolbar':
      await chrome.tabs.sendMessage(tab.id, { type: 'TOGGLE_TOOLBAR', payload: {} })
      break
    case 'start-annotation':
      await chrome.tabs.sendMessage(tab.id, { type: 'START_ANNOTATION', payload: {} })
      break
    case 'toggle-animations':
      await chrome.tabs.sendMessage(tab.id, { type: 'TOGGLE_ANIMATIONS', payload: {} })
      break
    case 'run-audit':
      await chrome.tabs.sendMessage(tab.id, { type: 'RUN_AUDIT', payload: {} })
      break
  }
})

export {}
