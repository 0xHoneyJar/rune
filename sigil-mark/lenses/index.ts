/**
 * Sigil v2.0 — Lenses Layer
 *
 * Interchangeable UI renderers (Experience layer).
 * Lenses consume the same physics but render differently.
 *
 * @module lenses
 */

// =============================================================================
// PROVIDER
// =============================================================================

export { LensProvider, useLensPreference, useUserLens } from './LensProvider';
export type { LensProviderProps } from './LensProvider';

// =============================================================================
// HOOK
// =============================================================================

export {
  useLens,
  registerDefaultLens,
  registerStrictLens,
  getDefaultLens,
  getStrictLens,
} from './useLens';
export type { UseLensOptions } from './useLens';

// =============================================================================
// TYPES
// =============================================================================

export type {
  Lens,
  CriticalButtonProps,
  GlassButtonProps,
  MachineryItemProps,
  LensPreference,
  LensClassification,
} from './types';
