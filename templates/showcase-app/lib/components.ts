/**
 * Sigil Component Registry
 *
 * Functions for querying and filtering exported component data.
 */

import type { SigilComponent, ComponentExport, ComponentFilter, Tier } from './types'

// Import component data - in production, this would be synced from exports
let componentData: ComponentExport | null = null

/**
 * Load component export data
 * Falls back to empty data if file doesn't exist
 */
async function loadComponentData(): Promise<ComponentExport> {
  if (componentData) {
    return componentData
  }

  try {
    // Try to load from public directory
    const response = await fetch('/components.json')
    if (response.ok) {
      componentData = await response.json()
      return componentData!
    }
  } catch {
    // Fallback to empty data
  }

  // Return empty data structure
  componentData = {
    components: [],
    tiers: { total: 0, gold: 0, silver: 0, uncaptured: 0 },
    exportedAt: new Date().toISOString(),
  }

  return componentData
}

/**
 * Get all components
 */
export async function getComponents(): Promise<SigilComponent[]> {
  const data = await loadComponentData()
  return data.components
}

/**
 * Get component by name
 */
export async function getComponentByName(
  name: string
): Promise<SigilComponent | undefined> {
  const components = await getComponents()
  return components.find(
    (c) => c.name.toLowerCase() === name.toLowerCase()
  )
}

/**
 * Get components by tier
 */
export async function getComponentsByTier(
  tier: Tier
): Promise<SigilComponent[]> {
  const components = await getComponents()
  return components.filter((c) => c.tier === tier)
}

/**
 * Get Gold tier components
 */
export async function getGoldComponents(): Promise<SigilComponent[]> {
  return getComponentsByTier('gold')
}

/**
 * Get Silver tier components
 */
export async function getSilverComponents(): Promise<SigilComponent[]> {
  return getComponentsByTier('silver')
}

/**
 * Get components by JTBD intent
 */
export async function getComponentsByIntent(
  intent: string
): Promise<SigilComponent[]> {
  const components = await getComponents()
  return components.filter((c) =>
    c.intent.toLowerCase().includes(intent.toLowerCase())
  )
}

/**
 * Get components by feel
 */
export async function getComponentsByFeel(
  feel: string
): Promise<SigilComponent[]> {
  const components = await getComponents()
  return components.filter((c) =>
    c.feel.toLowerCase().includes(feel.toLowerCase())
  )
}

/**
 * Search components by name or description
 */
export async function searchComponents(
  query: string
): Promise<SigilComponent[]> {
  const components = await getComponents()
  const lowerQuery = query.toLowerCase()

  return components.filter(
    (c) =>
      c.name.toLowerCase().includes(lowerQuery) ||
      c.description.toLowerCase().includes(lowerQuery) ||
      c.feel.toLowerCase().includes(lowerQuery)
  )
}

/**
 * Filter components with multiple criteria
 */
export async function filterComponents(
  filter: ComponentFilter
): Promise<SigilComponent[]> {
  let components = await getComponents()

  // Filter by tier
  if (filter.tier && filter.tier !== 'all') {
    components = components.filter((c) => c.tier === filter.tier)
  }

  // Filter by intent
  if (filter.intent) {
    components = components.filter((c) =>
      c.intent.toLowerCase().includes(filter.intent!.toLowerCase())
    )
  }

  // Filter by search query
  if (filter.search) {
    const query = filter.search.toLowerCase()
    components = components.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query) ||
        c.feel.toLowerCase().includes(query)
    )
  }

  return components
}

/**
 * Get tier statistics
 */
export async function getTierStats(): Promise<ComponentExport['tiers']> {
  const data = await loadComponentData()
  return data.tiers
}

/**
 * Get unique intents from all components
 */
export async function getUniqueIntents(): Promise<string[]> {
  const components = await getComponents()
  const intents = new Set(components.map((c) => c.intent).filter(Boolean))
  return Array.from(intents).sort()
}

/**
 * Get unique feels from all components
 */
export async function getUniqueFeels(): Promise<string[]> {
  const components = await getComponents()
  const feels = new Set(components.map((c) => c.feel).filter(Boolean))
  return Array.from(feels).sort()
}

/**
 * Check if component data is loaded
 */
export async function hasComponents(): Promise<boolean> {
  const components = await getComponents()
  return components.length > 0
}

/**
 * Get export metadata
 */
export async function getExportMetadata(): Promise<{
  exportedAt: string
  componentCount: number
}> {
  const data = await loadComponentData()
  return {
    exportedAt: data.exportedAt,
    componentCount: data.components.length,
  }
}
