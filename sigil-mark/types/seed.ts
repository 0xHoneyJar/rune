/**
 * @sigil-tier gold
 * Sigil v6.0 — Seed Types
 *
 * TypeScript interfaces for virtual Sanctuary seeds.
 *
 * @module types/seed
 */

import { ComponentTier } from './workshop';

// =============================================================================
// SEED SCHEMA
// =============================================================================

/**
 * Complete seed definition.
 */
export interface Seed {
  /** Seed identifier */
  seed: string;
  /** Seed version */
  version: string;
  /** Human-readable description */
  description: string;
  /** Physics profiles */
  physics: SeedPhysics;
  /** Material definitions (colors, surfaces) */
  materials: SeedMaterials;
  /** Typography settings */
  typography: SeedTypography;
  /** Spacing scale */
  spacing: SeedSpacing;
  /** Virtual component definitions */
  virtual_components: Record<string, VirtualComponent>;
}

/**
 * Physics profile assignments.
 */
export interface SeedPhysics {
  /** Default physics for unspecified zones */
  default: string;
  /** Physics for critical zone */
  critical: string;
  /** Physics for marketing zone */
  marketing: string;
  /** Physics for admin zone */
  admin?: string;
}

/**
 * Material color palette.
 */
export interface SeedMaterials {
  /** Primary background color */
  background: string;
  /** Surface color (cards, panels) */
  surface: string;
  /** Primary text color */
  text: string;
  /** Muted text color */
  muted: string;
  /** Accent color */
  accent: string;
  /** Secondary accent (optional) */
  accent_secondary?: string;
  /** Error state color */
  error?: string;
  /** Success state color */
  success?: string;
  /** Warning state color */
  warning?: string;
}

/**
 * Typography settings.
 */
export interface SeedTypography {
  /** Primary font family */
  font_family: string;
  /** Base font size */
  base_size: string;
  /** Type scale multiplier */
  scale: number;
  /** Mono font family (optional) */
  mono_family?: string;
}

/**
 * Spacing scale.
 */
export interface SeedSpacing {
  /** Base unit */
  unit: string;
  /** Scale values */
  scale: number[];
}

/**
 * Virtual component definition.
 */
export interface VirtualComponent {
  /** Component tier */
  tier: ComponentTier;
  /** Target zone */
  zone: string;
  /** Physics profile */
  physics: string;
  /** Vocabulary terms */
  vocabulary: string[];
  /** Whether this component has faded (real exists) */
  faded?: boolean;
}

// =============================================================================
// SEED METADATA
// =============================================================================

/**
 * Available seed identifiers.
 */
export type SeedId = 'linear-like' | 'vercel-like' | 'stripe-like' | 'blank';

/**
 * Seed metadata for selection UI.
 */
export interface SeedOption {
  id: SeedId;
  name: string;
  description: string;
  preview?: string;
}

/**
 * Available seed options.
 */
export const SEED_OPTIONS: SeedOption[] = [
  {
    id: 'linear-like',
    name: 'Linear-like',
    description: 'Minimal, monochrome, snappy animations',
  },
  {
    id: 'vercel-like',
    name: 'Vercel-like',
    description: 'Bold, high-contrast, sharp transitions',
  },
  {
    id: 'stripe-like',
    name: 'Stripe-like',
    description: 'Soft gradients, smooth animations, premium feel',
  },
  {
    id: 'blank',
    name: 'Blank',
    description: 'No opinions, just physics constraints',
  },
];

// =============================================================================
// QUERY RESULTS
// =============================================================================

/**
 * Result of querying a virtual component.
 */
export interface VirtualComponentQueryResult {
  found: boolean;
  data: VirtualComponent | null;
  source: 'seed';
  faded: boolean;
}
