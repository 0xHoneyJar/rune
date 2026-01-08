/**
 * Sigil v4.1 Hooks
 *
 * Shared React hooks for physics-aware UI patterns.
 *
 * Primary hook:
 * - useSigilMutation: Zone+Persona-aware mutation hook (recommended)
 *
 * Legacy hooks:
 * - useServerTick: Server-tick awareness hook
 *
 * Utilities:
 * - Physics resolver functions for timing/easing
 */

// =============================================================================
// PRIMARY HOOK (v4.1)
// =============================================================================

export {
  useSigilMutation,
  type SigilMutationConfig,
  type SigilMutationResult,
  type SigilMutationStyle,
  type MutationStatus,
} from './use-sigil-mutation';

// =============================================================================
// PHYSICS RESOLVER (v4.1)
// =============================================================================

export {
  resolvePhysics,
  getMotionTiming,
  getMotionEasing,
  getZoneConfig,
  createPhysicsStyle,
  type ResolvedPhysics,
  type SyncStrategy,
} from './physics-resolver';

// =============================================================================
// LEGACY HOOKS
// =============================================================================

export {
  useServerTick,
  type UseServerTickOptions,
  type UseServerTickResult,
} from './use-server-tick';
