/**
 * Sigil Component Types
 *
 * Type definitions for component taste data exported from Sigil.
 */

export type Tier = 'gold' | 'silver' | 'uncaptured'

export interface SigilComponent {
  /** Component name (from filename) */
  name: string

  /** Tier level: gold (production proven), silver (captured), uncaptured */
  tier: Tier

  /** Source file path */
  file: string

  /** Problem this component solves */
  description: string

  /** How the component should feel */
  feel: string

  /** Patterns explicitly rejected */
  rejected: string[]

  /** Design inspiration sources */
  inspiration: string[]

  /** JTBD intent label */
  intent: string

  /** Taste owner (Gold only) */
  owner?: string

  /** Physics/animation parameters (Gold only) */
  physics?: string

  /** When taste was captured */
  capturedAt?: string

  /** When graduated to Gold */
  graduatedAt?: string
}

export interface ComponentExport {
  /** All exported components */
  components: SigilComponent[]

  /** Tier statistics */
  tiers: {
    total: number
    gold: number
    silver: number
    uncaptured: number
  }

  /** Export timestamp */
  exportedAt: string
}

/** JTBD Categories from Eileen's vocabulary */
export type JTBDCategory = 'functional' | 'personal' | 'social'

/** JTBD Intent Labels */
export interface JTBDLabel {
  label: string
  category: JTBDCategory
  description: string
}

/** Filter options for component queries */
export interface ComponentFilter {
  tier?: Tier | 'all'
  intent?: string
  search?: string
}

/** Moodboard types */
export type MoodboardStatus = 'draft' | 'active' | 'deprecated'

export interface NorthStars {
  games: string[]
  products: string[]
}

export interface CoreFeel {
  context: string
  feel: string
  reference?: string
}

export interface ProductMoodboard {
  type: 'product'
  product: string
  created: string
  northStars: NorthStars
  coreFeels: CoreFeel[]
  antiPatterns: string[]
  features: FeatureMoodboardRef[]
  exportedAt: string
}

export interface FeatureMoodboardRef {
  name: string
  status: MoodboardStatus
  file: string
}

export interface FeatureMoodboard {
  type: 'feature'
  feature: string
  product: string
  status: MoodboardStatus
  created: string
  primaryFeel: string
  antiFeels: string[]
  components?: string[]
  exportedAt: string
}

export type Moodboard = ProductMoodboard | FeatureMoodboard
