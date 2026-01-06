/**
 * Sigil v1.2.4 - Core Module
 *
 * Physics tokens, zone context, and resolution utilities.
 *
 * @example Basic usage
 * ```tsx
 * import { SigilZone, useSigilPhysics, PHYSICS } from 'sigil-mark/core';
 *
 * // Wrap components in a zone
 * <SigilZone material="decisive" serverAuthoritative>
 *   <Button>Confirm Purchase</Button>
 * </SigilZone>
 *
 * // Components read physics from context
 * function MyComponent() {
 *   const { physics, material } = useSigilPhysics();
 *   // physics.spring, physics.tap, etc.
 * }
 * ```
 */

// Physics tokens (the source of truth for physics values)
export {
  PHYSICS,
  getPhysics,
  DEFAULT_MATERIAL,
  type Material,
  type SpringConfig,
  type TapConfig,
  type PhysicsToken,
} from './physics';

// Zone context provider and hooks
export {
  SigilZone,
  useSigilPhysics,
  useServerAuthoritative,
  withSigilPhysics,
  type SigilZoneProps,
  type SigilZoneContextValue,
} from './SigilZone';

// Zone resolution utilities (file path → zone)
export {
  resolveZone,
  isConstraintViolation,
  getRecipesPath,
  type ZoneConfig,
  type RecipeSet,
  type SyncMode,
  type ZoneConstraints,
  type ConstraintLevel,
} from './zone-resolver';

// History utilities
export {
  logRefinement,
  parseRefinementLog,
  extractPatterns,
  suggestPattern,
  type RefinementEntry,
  type RefinementPattern,
} from './history';
