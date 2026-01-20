/**
 * Sigil Toolbar - Screenshot Capture
 * MV3 compliant screenshot capture with OffscreenDocument cropping
 */

import type { ScreenshotRequest, ScreenshotResponse } from '../shared/types'

const OFFSCREEN_DOCUMENT_PATH = 'offscreen.html'
const MAX_SIZE_BYTES = 500 * 1024 // 500KB
const RETENTION_DAYS = 7

let creatingOffscreen: Promise<void> | null = null

/**
 * Ensure offscreen document exists for canvas operations
 */
async function ensureOffscreenDocument(): Promise<void> {
  // Check if already exists
  const existingContexts = await chrome.runtime.getContexts({
    contextTypes: [chrome.runtime.ContextType.OFFSCREEN_DOCUMENT],
    documentUrls: [chrome.runtime.getURL(OFFSCREEN_DOCUMENT_PATH)],
  })

  if (existingContexts.length > 0) {
    return
  }

  // Avoid race condition
  if (creatingOffscreen) {
    await creatingOffscreen
    return
  }

  creatingOffscreen = chrome.offscreen.createDocument({
    url: OFFSCREEN_DOCUMENT_PATH,
    reasons: [chrome.offscreen.Reason.DOM_PARSER],
    justification: 'Crop screenshots using canvas',
  })

  await creatingOffscreen
  creatingOffscreen = null
}

/**
 * Capture and crop screenshot for specific bounds
 */
export async function captureScreenshot(request: ScreenshotRequest): Promise<ScreenshotResponse> {
  try {
    // Get current tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (!tab?.id) {
      return { success: false, error: 'No active tab' }
    }

    // Capture full visible tab
    const fullScreenshot = await chrome.tabs.captureVisibleTab(undefined, {
      format: 'png',
    })

    // Calculate crop bounds with padding
    const padding = request.padding ?? 20
    const bounds = {
      x: Math.max(0, request.bounds.x - padding),
      y: Math.max(0, request.bounds.y - padding),
      width: request.bounds.width + padding * 2,
      height: request.bounds.height + padding * 2,
    }

    // Get device pixel ratio for HiDPI scaling
    const [{ result: devicePixelRatio }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => window.devicePixelRatio,
    })

    // Scale bounds for HiDPI
    const scaledBounds = {
      x: bounds.x * devicePixelRatio,
      y: bounds.y * devicePixelRatio,
      width: bounds.width * devicePixelRatio,
      height: bounds.height * devicePixelRatio,
    }

    // Ensure offscreen document for cropping
    await ensureOffscreenDocument()

    // Send to offscreen document for cropping
    const croppedDataUrl = await chrome.runtime.sendMessage({
      target: 'offscreen',
      action: 'crop',
      data: {
        imageData: fullScreenshot,
        bounds: scaledBounds,
        maxSize: MAX_SIZE_BYTES,
      },
    })

    if (!croppedDataUrl || croppedDataUrl.error) {
      return { success: false, error: croppedDataUrl?.error || 'Crop failed' }
    }

    // Store with expiration
    const ref = await storeScreenshot(croppedDataUrl.data)

    return {
      success: true,
      data: croppedDataUrl.data,
      ref,
    }
  } catch (error) {
    console.error('[Sigil] Screenshot error:', error)
    return { success: false, error: String(error) }
  }
}

/**
 * Store screenshot with expiration metadata
 */
async function storeScreenshot(dataUrl: string): Promise<string> {
  const ref = `screenshot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  const expiration = Date.now() + RETENTION_DAYS * 24 * 60 * 60 * 1000

  // Check size
  const sizeBytes = dataUrl.length * 0.75 // Approximate base64 to bytes
  if (sizeBytes > MAX_SIZE_BYTES) {
    console.warn(`[Sigil] Screenshot exceeds size limit: ${Math.round(sizeBytes / 1024)}KB`)
  }

  await chrome.storage.local.set({
    [ref]: {
      data: dataUrl,
      expiration,
      size: sizeBytes,
    },
  })

  // Trigger cleanup
  await cleanupExpiredScreenshots()

  return ref
}

/**
 * Retrieve screenshot by reference
 */
export async function getScreenshot(ref: string): Promise<string | null> {
  const stored = await chrome.storage.local.get(ref)
  if (!stored[ref]) return null

  const { data, expiration } = stored[ref]

  // Check expiration
  if (expiration < Date.now()) {
    await chrome.storage.local.remove(ref)
    return null
  }

  return data
}

/**
 * Clean up expired screenshots and manage quota
 */
export async function cleanupExpiredScreenshots(): Promise<number> {
  const all = await chrome.storage.local.get()
  const now = Date.now()
  const toRemove: string[] = []
  let totalSize = 0

  // Collect expired and calculate total size
  const screenshots: Array<{ key: string; expiration: number; size: number }> = []

  for (const [key, value] of Object.entries(all)) {
    if (!key.startsWith('screenshot-')) continue

    if (value?.expiration < now) {
      toRemove.push(key)
    } else {
      screenshots.push({
        key,
        expiration: value.expiration,
        size: value.size || 0,
      })
      totalSize += value.size || 0
    }
  }

  // If over quota (10MB), remove oldest
  const QUOTA_BYTES = 10 * 1024 * 1024
  if (totalSize > QUOTA_BYTES) {
    screenshots.sort((a, b) => a.expiration - b.expiration)
    while (totalSize > QUOTA_BYTES && screenshots.length > 0) {
      const oldest = screenshots.shift()!
      toRemove.push(oldest.key)
      totalSize -= oldest.size
    }
  }

  if (toRemove.length > 0) {
    await chrome.storage.local.remove(toRemove)
    console.log(`[Sigil] Cleaned up ${toRemove.length} screenshots`)
  }

  return toRemove.length
}
