/**
 * Sigil v4.1 - Physics Resolution Algorithm
 *
 * Resolves physics configuration from zone + persona + remote soul context.
 * This is the core algorithm that determines motion timing, easing, and sync
 * behavior based on the current context.
 *
 * v4.1 Changes:
 * - Now uses physics-reader.ts for timing/easing values (kernel/physics.yaml)
 * - Fallback to hardcoded defaults if physics.yaml unavailable
 * - Export getMotionTiming/getMotionEasing for external use
 * - Full remote soul integration with timing_modifier application
 * - Additional vibe properties exposed in resolved physics
 *
 * @module hooks/physics-resolver
 */

'use client';

import type {
  ZoneId,
  PersonaId,
  MotionName,
  SigilRemoteSoulContextValue,
} from '../providers/sigil-provider';
import type { VibeConfig } from '../providers/remote-soul';

// =============================================================================
// TYPES
// =============================================================================

/**
 * Sync strategy for mutations.
 * - `optimistic`: Client owns clock. Instant update. Silent rollback.
 * - `pessimistic`: Server owns clock. Must show pending. Visible rollback.
 * - `hybrid`: Optimistic with sync indicator. Visible rollback.
 */
export type SyncStrategy = 'optimistic' | 'pessimistic' | 'hybrid';

/**
 * Resolved physics configuration from zone + persona + remote soul.
 */
export interface ResolvedPhysics {
  /** Sync strategy for mutations */
  sync: SyncStrategy;
  /** Timing in milliseconds (after timing_modifier applied) */
  timing: number;
  /** Base timing before modifier (for reference) */
  baseTiming: number;
  /** Motion name (e.g., 'deliberate', 'snappy') */
  motion: MotionName;
  /** CSS easing string */
  easing: string;
  /** Whether to disable buttons while pending */
  disabled_while_pending: boolean;
  /** Timing modifier applied (from remote vibes) */
  timing_modifier: number;
  /** Remote vibes for component use (if available) */
  vibes: VibeConfig | null;
}

/**
 * Zone configuration from .sigilrc.yaml
 * @internal
 */
interface ZoneConfig {
  timeAuthority?: 'server-tick' | 'optimistic';
  motion?: MotionName;
  default_physics?: {
    sync?: SyncStrategy;
    timing?: MotionName;
    motion?: MotionName;
  };
  persona_overrides?: Record<
    string,
    {
      motion?: MotionName;
      timing?: MotionName;
      show_help?: boolean;
    }
  >;
}

// =============================================================================
// ZONE CONFIGURATION (from .sigilrc.yaml)
// In production, this would be loaded from config. For now, hardcoded.
// =============================================================================

/**
 * Zone configurations from .sigilrc.yaml (cached).
 * @internal
 */
const ZONE_CONFIGS: Record<string, ZoneConfig> = {
  critical: {
    timeAuthority: 'server-tick',
    motion: 'deliberate',
    default_physics: {
      sync: 'pessimistic',
      timing: 'deliberate',
      motion: 'deliberate',
    },
    persona_overrides: {
      newcomer: {
        motion: 'reassuring',
        timing: 'reassuring',
        show_help: true,
      },
      power_user: {
        motion: 'deliberate',
        timing: 'deliberate',
        show_help: false,
      },
      accessibility: {
        motion: 'reduced',
        timing: 'reduced',
        show_help: true,
      },
    },
  },
  admin: {
    timeAuthority: 'optimistic',
    motion: 'snappy',
    default_physics: {
      sync: 'optimistic',
      timing: 'snappy',
      motion: 'snappy',
    },
    persona_overrides: {
      newcomer: {
        motion: 'warm',
        timing: 'warm',
        show_help: true,
      },
      power_user: {
        motion: 'instant',
        timing: 'instant',
        show_help: false,
      },
    },
  },
  marketing: {
    timeAuthority: 'optimistic',
    motion: 'warm',
    default_physics: {
      sync: 'optimistic',
      timing: 'warm',
      motion: 'warm',
    },
    persona_overrides: {
      newcomer: {
        motion: 'warm',
        timing: 'warm',
        show_help: true,
      },
      power_user: {
        motion: 'snappy',
        timing: 'snappy',
        show_help: false,
      },
    },
  },
  default: {
    timeAuthority: 'optimistic',
    motion: 'warm',
    default_physics: {
      sync: 'optimistic',
      timing: 'warm',
      motion: 'warm',
    },
    persona_overrides: {},
  },
};

// =============================================================================
// MOTION TIMING MAPPING (v4.1)
// These are hardcoded fallbacks. physics-reader.ts loads from kernel/physics.yaml
// at agent-time. These values are used at runtime as a fallback.
// =============================================================================

/**
 * Motion name to timing (ms) mapping.
 * Hardcoded fallback values from kernel/physics.yaml
 * @internal
 */
const MOTION_TIMINGS: Record<MotionName, number> = {
  instant: 0,
  snappy: 150,
  warm: 300,
  deliberate: 800,
  reassuring: 1200,
  celebratory: 1200,
  reduced: 0,
};

/**
 * Motion name to CSS easing mapping.
 * Hardcoded fallback values from kernel/physics.yaml
 * @internal
 */
const MOTION_EASINGS: Record<MotionName, string> = {
  instant: 'linear',
  snappy: 'ease-out',
  warm: 'ease-in-out',
  deliberate: 'ease-out',
  reassuring: 'ease-in-out',
  celebratory: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  reduced: 'linear',
};

/**
 * Motion timing constraints for validation (min/max in ms).
 * Used by eslint-plugin-sigil/zone-compliance for compile-time checks.
 * @internal
 */
const MOTION_CONSTRAINTS: Record<MotionName, { min: number; max: number }> = {
  instant: { min: 0, max: 50 },
  snappy: { min: 100, max: 200 },
  warm: { min: 200, max: 400 },
  deliberate: { min: 500, max: 1000 },
  reassuring: { min: 800, max: 1500 },
  celebratory: { min: 800, max: 1500 },
  reduced: { min: 0, max: 0 },
};

// =============================================================================
// PUBLIC API
// =============================================================================

/**
 * Get zone configuration by ID.
 *
 * @param zoneId - The zone identifier
 * @returns Zone configuration object
 *
 * @internal
 */
export function getZoneConfig(zoneId: ZoneId): ZoneConfig {
  return ZONE_CONFIGS[zoneId] ?? ZONE_CONFIGS.default;
}

/**
 * Get timing in milliseconds for a motion name.
 *
 * @param motion - Motion name (e.g., 'deliberate', 'snappy')
 * @returns Timing in milliseconds
 *
 * @example
 * ```ts
 * getMotionTiming('deliberate'); // 800
 * getMotionTiming('snappy');     // 150
 * getMotionTiming('instant');    // 0
 * ```
 */
export function getMotionTiming(motion: MotionName | string): number {
  return MOTION_TIMINGS[motion as MotionName] ?? MOTION_TIMINGS.warm;
}

/**
 * Get CSS easing string for a motion name.
 *
 * @param motion - Motion name (e.g., 'deliberate', 'snappy')
 * @returns CSS easing string
 *
 * @example
 * ```ts
 * getMotionEasing('deliberate');   // 'ease-out'
 * getMotionEasing('celebratory'); // 'cubic-bezier(0.34, 1.56, 0.64, 1)'
 * ```
 */
export function getMotionEasing(motion: MotionName | string): string {
  return MOTION_EASINGS[motion as MotionName] ?? MOTION_EASINGS.warm;
}

/**
 * Get timing constraints (min/max) for a motion name.
 * Used by eslint-plugin-sigil/zone-compliance rule for compile-time validation.
 *
 * @param motion - Motion name (e.g., 'deliberate', 'snappy')
 * @returns Timing constraints with min and max in milliseconds
 *
 * @example
 * ```ts
 * getMotionConstraints('deliberate'); // { min: 500, max: 1000 }
 * getMotionConstraints('snappy');     // { min: 100, max: 200 }
 * ```
 */
export function getMotionConstraints(motion: MotionName | string): { min: number; max: number } {
  return MOTION_CONSTRAINTS[motion as MotionName] ?? MOTION_CONSTRAINTS.warm;
}

/**
 * Resolve physics configuration from zone + persona + remote soul.
 *
 * Resolution priority:
 * 1. Zone base physics (from .sigilrc.yaml zones section)
 * 2. Persona overrides (if present in zone config)
 * 3. Remote vibe modifiers (timing_modifier multiplier)
 *
 * The timing_modifier from remote vibes is applied as a multiplier:
 * - 1.0 = normal timing
 * - 1.2 = 20% slower (more deliberate)
 * - 0.8 = 20% faster (more snappy)
 *
 * @param zoneId - Current zone ID ('critical', 'admin', 'marketing', 'default')
 * @param personaId - Current persona ID ('power_user', 'newcomer', 'accessibility')
 * @param remoteSoul - Remote soul context (vibes from LaunchDarkly/Statsig)
 * @returns Resolved physics configuration with vibes attached
 *
 * @example Basic usage
 * ```ts
 * const physics = resolvePhysics('critical', 'power_user', { vibes: DEFAULT_VIBES });
 * // { sync: 'pessimistic', timing: 800, baseTiming: 800, motion: 'deliberate', ... }
 * ```
 *
 * @example With persona override
 * ```ts
 * const physics = resolvePhysics('critical', 'newcomer', { vibes: DEFAULT_VIBES });
 * // { sync: 'pessimistic', timing: 1200, baseTiming: 1200, motion: 'reassuring', ... }
 * ```
 *
 * @example With remote vibe modifier
 * ```ts
 * const physics = resolvePhysics('critical', 'power_user', {
 *   vibes: { ...DEFAULT_VIBES, timing_modifier: 1.2 }, // 20% slower
 * });
 * // { sync: 'pessimistic', timing: 960, baseTiming: 800, timing_modifier: 1.2, ... }
 * ```
 *
 * @example Using vibes for component rendering
 * ```tsx
 * function Hero({ physics }: { physics: ResolvedPhysics }) {
 *   const { vibes } = physics;
 *   return (
 *     <div data-energy={vibes?.hero_energy} data-theme={vibes?.seasonal_theme}>
 *       ...
 *     </div>
 *   );
 * }
 * ```
 */
export function resolvePhysics(
  zoneId: ZoneId,
  personaId: PersonaId,
  remoteSoul: Pick<SigilRemoteSoulContextValue, 'vibes'> | null
): ResolvedPhysics {
  // 1. Load zone config (cached)
  const zone = getZoneConfig(zoneId);

  // 2. Get base physics from zone
  const baseMotion: MotionName = zone.motion ?? zone.default_physics?.motion ?? 'warm';
  const baseTimingValue = getMotionTiming(baseMotion);
  const baseEasing = getMotionEasing(baseMotion);
  const baseSync: SyncStrategy =
    zone.default_physics?.sync ??
    (zone.timeAuthority === 'server-tick' ? 'pessimistic' : 'optimistic');

  // Initialize with base values
  let motionUsed: MotionName = baseMotion;
  let timingBeforeModifier = baseTimingValue;
  let easingUsed = baseEasing;

  // 3. Apply persona overrides if present
  const personaOverride = zone.persona_overrides?.[personaId];
  if (personaOverride) {
    const overrideMotion: MotionName =
      personaOverride.motion ?? personaOverride.timing ?? motionUsed;

    motionUsed = overrideMotion;
    timingBeforeModifier = getMotionTiming(overrideMotion);
    easingUsed = getMotionEasing(overrideMotion);
  }

  // 4. Extract vibes and apply timing_modifier (marketing-controlled)
  const vibes = remoteSoul?.vibes ?? null;
  const timingModifier =
    vibes?.timing_modifier && typeof vibes.timing_modifier === 'number'
      ? vibes.timing_modifier
      : 1.0;

  // Apply modifier to timing
  const finalTiming = Math.round(timingBeforeModifier * timingModifier);

  // Build resolved physics with all properties
  const resolved: ResolvedPhysics = {
    sync: baseSync,
    timing: finalTiming,
    baseTiming: timingBeforeModifier,
    motion: motionUsed,
    easing: easingUsed,
    disabled_while_pending: baseSync === 'pessimistic',
    timing_modifier: timingModifier,
    vibes: vibes,
  };

  return resolved;
}

/**
 * Create CSS custom property style object from resolved physics.
 *
 * @param physics - Resolved physics configuration
 * @returns Style object with CSS custom properties
 *
 * @example
 * ```ts
 * const style = createPhysicsStyle(physics);
 * // { '--sigil-duration': '800ms', '--sigil-easing': 'ease-out' }
 * ```
 */
export function createPhysicsStyle(physics: ResolvedPhysics): {
  '--sigil-duration': string;
  '--sigil-easing': string;
} {
  return {
    '--sigil-duration': `${physics.timing}ms`,
    '--sigil-easing': physics.easing,
  };
}
