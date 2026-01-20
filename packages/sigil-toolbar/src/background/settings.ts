/**
 * Sigil Toolbar - Settings Management
 * Chrome storage persistence with migration support
 */

import type { ToolbarSettings } from '../shared/types'

const SETTINGS_KEY = 'sigil-settings'
const SETTINGS_VERSION = 1

/**
 * Default settings
 */
export const DEFAULT_SETTINGS: ToolbarSettings = {
  // Linear integration
  linearApiKey: '',
  linearTeamId: '',
  linearLabelIds: [],

  // Custom feedback API
  feedbackApiUrl: '',

  // Keyboard shortcuts
  keyboardShortcuts: {
    toggleToolbar: 'Alt+Shift+T',
    annotate: 'Alt+Shift+N',
    pauseAnimations: 'Alt+Shift+A',
    audit: 'Alt+Shift+C',
  },

  // UI preferences
  defaultPosition: 'top-left',

  // Enabled tools
  enabledTools: {
    physicsDetector: true,
    animationInspector: true,
    capabilityAudit: true,
    screenshot: true,
    annotate: true,
  },
}

interface StoredSettings {
  version: number
  data: ToolbarSettings
}

/**
 * Get settings from storage
 */
export async function getSettings(): Promise<ToolbarSettings> {
  try {
    const stored = await chrome.storage.local.get(SETTINGS_KEY)
    const settings = stored[SETTINGS_KEY] as StoredSettings | undefined

    if (!settings) {
      // First run - initialize defaults
      await saveSettings(DEFAULT_SETTINGS)
      return DEFAULT_SETTINGS
    }

    // Migrate if needed
    if (settings.version < SETTINGS_VERSION) {
      const migrated = migrateSettings(settings)
      await saveSettings(migrated)
      return migrated
    }

    // Merge with defaults to handle any new fields
    return { ...DEFAULT_SETTINGS, ...settings.data }
  } catch (error) {
    console.error('[Sigil] Failed to load settings:', error)
    return DEFAULT_SETTINGS
  }
}

/**
 * Save settings to storage
 */
export async function saveSettings(settings: ToolbarSettings): Promise<void> {
  const stored: StoredSettings = {
    version: SETTINGS_VERSION,
    data: settings,
  }

  await chrome.storage.local.set({ [SETTINGS_KEY]: stored })
}

/**
 * Update partial settings
 */
export async function updateSettings(
  updates: Partial<ToolbarSettings>
): Promise<ToolbarSettings> {
  const current = await getSettings()
  const updated = { ...current, ...updates }
  await saveSettings(updated)
  return updated
}

/**
 * Reset settings to defaults
 */
export async function resetSettings(): Promise<ToolbarSettings> {
  await saveSettings(DEFAULT_SETTINGS)
  return DEFAULT_SETTINGS
}

/**
 * Export settings for backup
 */
export async function exportSettings(): Promise<string> {
  const settings = await getSettings()
  return JSON.stringify(settings, null, 2)
}

/**
 * Import settings from backup
 */
export async function importSettings(json: string): Promise<ToolbarSettings> {
  try {
    const parsed = JSON.parse(json) as Partial<ToolbarSettings>
    const merged = { ...DEFAULT_SETTINGS, ...parsed }
    await saveSettings(merged)
    return merged
  } catch (error) {
    throw new Error('Invalid settings format')
  }
}

/**
 * Migrate settings from older versions
 */
function migrateSettings(stored: StoredSettings): ToolbarSettings {
  let data = stored.data

  // Version 0 -> 1: Add linearLabelIds
  if (stored.version < 1) {
    data = {
      ...data,
      linearLabelIds: [],
    }
  }

  // Future migrations here...

  return { ...DEFAULT_SETTINGS, ...data }
}

/**
 * Watch for settings changes
 */
export function watchSettings(
  callback: (settings: ToolbarSettings) => void
): () => void {
  const listener = (
    changes: { [key: string]: chrome.storage.StorageChange },
    areaName: string
  ) => {
    if (areaName !== 'local') return
    if (changes[SETTINGS_KEY]) {
      const newSettings = changes[SETTINGS_KEY].newValue as StoredSettings
      callback(newSettings?.data || DEFAULT_SETTINGS)
    }
  }

  chrome.storage.onChanged.addListener(listener)

  return () => {
    chrome.storage.onChanged.removeListener(listener)
  }
}
