/**
 * Sigil Toolbar - Offscreen Document
 * Handles canvas operations for screenshot cropping (MV3 requirement)
 */

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.target !== 'offscreen') return false

  if (message.action === 'crop') {
    cropImage(message.data)
      .then(result => sendResponse(result))
      .catch(error => sendResponse({ error: error.message }))
    return true // Keep channel open for async
  }

  return false
})

/**
 * Crop image using canvas
 */
async function cropImage({ imageData, bounds, maxSize }) {
  try {
    // Create image element
    const img = new Image()
    await new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = reject
      img.src = imageData
    })

    // Create canvas for cropping
    const canvas = document.createElement('canvas')
    canvas.width = bounds.width
    canvas.height = bounds.height
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      throw new Error('Failed to get canvas context')
    }

    // Draw cropped region
    ctx.drawImage(
      img,
      bounds.x,
      bounds.y,
      bounds.width,
      bounds.height,
      0,
      0,
      bounds.width,
      bounds.height
    )

    // Export with compression
    let quality = 0.92
    let dataUrl = canvas.toDataURL('image/jpeg', quality)

    // Compress further if needed
    while (dataUrl.length * 0.75 > maxSize && quality > 0.3) {
      quality -= 0.1
      dataUrl = canvas.toDataURL('image/jpeg', quality)
    }

    // If still too large, reduce dimensions
    if (dataUrl.length * 0.75 > maxSize) {
      const scale = Math.sqrt(maxSize / (dataUrl.length * 0.75))
      canvas.width = Math.floor(bounds.width * scale)
      canvas.height = Math.floor(bounds.height * scale)

      ctx.drawImage(
        img,
        bounds.x,
        bounds.y,
        bounds.width,
        bounds.height,
        0,
        0,
        canvas.width,
        canvas.height
      )

      dataUrl = canvas.toDataURL('image/jpeg', 0.8)
    }

    return { data: dataUrl }
  } catch (error) {
    console.error('[Sigil Offscreen] Crop error:', error)
    return { error: error.message }
  }
}
