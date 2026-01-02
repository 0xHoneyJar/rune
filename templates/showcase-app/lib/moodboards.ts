/**
 * Sigil Moodboard Registry
 *
 * Functions for loading and querying moodboard data.
 */

import type {
  ProductMoodboard,
  FeatureMoodboard,
  Moodboard,
  FeatureMoodboardRef,
} from './types'

// Cache for loaded moodboard data
let productMoodboard: ProductMoodboard | null = null
let featureMoodboards: Map<string, FeatureMoodboard> = new Map()

/**
 * Load product moodboard from JSON
 */
async function loadProductMoodboard(): Promise<ProductMoodboard | null> {
  if (productMoodboard) {
    return productMoodboard
  }

  try {
    const response = await fetch('/moodboard.json')
    if (response.ok) {
      const data = await response.json()
      if (data.type === 'product') {
        productMoodboard = data
        return productMoodboard
      }
    }
  } catch {
    // Fallback: no moodboard available
  }

  return null
}

/**
 * Load feature moodboard by name
 */
async function loadFeatureMoodboard(
  name: string
): Promise<FeatureMoodboard | null> {
  if (featureMoodboards.has(name)) {
    return featureMoodboards.get(name)!
  }

  try {
    const response = await fetch(`/moodboards/${name}.json`)
    if (response.ok) {
      const data = await response.json()
      if (data.type === 'feature') {
        featureMoodboards.set(name, data)
        return data
      }
    }
  } catch {
    // Fallback: feature moodboard not available
  }

  return null
}

/**
 * Get product moodboard
 */
export async function getProductMoodboard(): Promise<ProductMoodboard | null> {
  return loadProductMoodboard()
}

/**
 * Get feature moodboard by name
 */
export async function getFeatureMoodboard(
  name: string
): Promise<FeatureMoodboard | null> {
  return loadFeatureMoodboard(name)
}

/**
 * Get all feature moodboard references from product
 */
export async function getFeatureRefs(): Promise<FeatureMoodboardRef[]> {
  const product = await loadProductMoodboard()
  return product?.features || []
}

/**
 * Get all north stars from product moodboard
 */
export async function getNorthStars(): Promise<{
  games: string[]
  products: string[]
} | null> {
  const product = await loadProductMoodboard()
  return product?.northStars || null
}

/**
 * Get all anti-patterns from product moodboard
 */
export async function getAntiPatterns(): Promise<string[]> {
  const product = await loadProductMoodboard()
  return product?.antiPatterns || []
}

/**
 * Get core feels from product moodboard
 */
export async function getCoreFeels(): Promise<
  { context: string; feel: string; reference?: string }[]
> {
  const product = await loadProductMoodboard()
  return product?.coreFeels || []
}

/**
 * Check if moodboard data is available
 */
export async function hasMoodboard(): Promise<boolean> {
  const product = await loadProductMoodboard()
  return product !== null
}

/**
 * Get moodboard stats
 */
export async function getMoodboardStats(): Promise<{
  hasProduct: boolean
  featureCount: number
  activeFeatures: number
}> {
  const product = await loadProductMoodboard()

  if (!product) {
    return { hasProduct: false, featureCount: 0, activeFeatures: 0 }
  }

  const features = product.features || []
  const activeFeatures = features.filter((f) => f.status === 'active').length

  return {
    hasProduct: true,
    featureCount: features.length,
    activeFeatures,
  }
}
