/**
 * @sigil-tier gold
 * Sigil v5.0 - Physics Resolution Algorithm
 *
 * Resolves physics configuration from zone + persona + remote soul context.
 * This is the core algorithm that determines motion timing, easing, and sync
 * behavior based on the current context.
 *
 * v5.0 Changes:
 * - Zone mapping: critical → server-tick, machinery → local-first, glass → local-first, standard → crdt
 * - resolvePhysicsV5() returns full ResolvedPhysics with class, timing, requires, forbidden
 * - Override warning if no reason provided
 *
 * v4.1 Legacy (preserved for backwards compat):
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

// =============================================================================
// V5 PHYSICS RESOLUTION
// =============================================================================

import type {
  SigilZone,
  SigilPersona,
  PhysicsClass,
  ResolvedPhysics as ResolvedPhysicsV5,
  SigilVibes,
} from '../types';
import { DEFAULT_PHYSICS, MOTION_PROFILES } from '../types';

/**
 * Zone to physics class mapping.
 * @internal
 */
const ZONE_TO_PHYSICS: Record<SigilZone, PhysicsClass> = {
  critical: 'server-tick',
  glass: 'local-first',
  machinery: 'local-first',
  standard: 'crdt',
};

/**
 * Data type configuration for physics resolution.
 */
export interface DataTypeConfig {
  /** Single data type hint */
  dataType?: string;
  /** Multiple data type hints (highest risk wins) */
  dataTypes?: string[];
}

/**
 * Look up physics class from data type via constitution.
 *
 * @internal
 */
function resolvePhysicsFromDataType(dataTypes: string[]): {
  physicsClass: PhysicsClass | null;
  warning?: string;
} {
  // Map of known types to physics classes (from constitution)
  const DATA_TYPE_PHYSICS: Record<string, PhysicsClass> = {
    // Financial → server-tick
    Money: 'server-tick',
    Balance: 'server-tick',
    Transfer: 'server-tick',
    Withdrawal: 'server-tick',
    Deposit: 'server-tick',
    Payment: 'server-tick',
    Subscription: 'server-tick',
    Invoice: 'server-tick',
    Fee: 'server-tick',
    Stake: 'server-tick',
    Reward: 'server-tick',
    Claim: 'server-tick',
    // Health → server-tick
    Health: 'server-tick',
    HP: 'server-tick',
    Hardcore: 'server-tick',
    Permadeath: 'server-tick',
    Lives: 'server-tick',
    Damage: 'server-tick',
    Healing: 'server-tick',
    // Collaborative → crdt
    Task: 'crdt',
    Document: 'crdt',
    Comment: 'crdt',
    Thread: 'crdt',
    Note: 'crdt',
    Canvas: 'crdt',
    Whiteboard: 'crdt',
    Project: 'crdt',
    Team: 'crdt',
    // Local → local-first
    Preference: 'local-first',
    Draft: 'local-first',
    Toggle: 'local-first',
    UI_State: 'local-first',
    Theme: 'local-first',
    Layout: 'local-first',
    Filter: 'local-first',
    Sort: 'local-first',
    Bookmark: 'local-first',
    History: 'local-first',
  };

  // Risk hierarchy (lower = higher risk)
  const RISK_LEVELS: Record<PhysicsClass, number> = {
    'server-tick': 1,
    'crdt': 2,
    'local-first': 3,
  };

  let highestRiskPhysics: PhysicsClass | null = null;
  let highestRiskLevel = Infinity;

  for (const dataType of dataTypes) {
    const physics = DATA_TYPE_PHYSICS[dataType];
    if (physics) {
      const riskLevel = RISK_LEVELS[physics];
      if (riskLevel < highestRiskLevel) {
        highestRiskLevel = riskLevel;
        highestRiskPhysics = physics;
      }
    }
  }

  // Check for multiple types with warning
  let warning: string | undefined;
  if (dataTypes.length > 1 && highestRiskPhysics) {
    warning = `Multiple data types: ${dataTypes.join(', ')}. Using ${highestRiskPhysics} (highest risk).`;
  }

  return { physicsClass: highestRiskPhysics, warning };
}

/**
 * Resolve physics configuration for v5 zones.
 *
 * Resolution priority:
 * 1. Data type (if provided) - overrides zone
 * 2. Zone determines base physics class
 * 3. Persona can adjust timing (power_user = faster, cautious = slower)
 * 4. Vibes can apply timing_modifier
 * 5. Overrides applied last with warning
 *
 * @param zone - Current zone
 * @param persona - Current persona
 * @param vibes - Runtime vibes (optional)
 * @param override - Physics override (optional)
 * @param overrideReason - Reason for override (required if override provided)
 * @param dataTypeConfig - Data type configuration (optional)
 * @returns Resolved physics configuration
 *
 * @example Basic usage
 * ```ts
 * const physics = resolvePhysicsV5('critical', 'power_user');
 * // { class: 'server-tick', timing: { min_ms: 600, recommended_ms: 800 }, ... }
 * ```
 *
 * @example With data type override
 * ```ts
 * const physics = resolvePhysicsV5('glass', 'default', undefined, undefined, undefined, {
 *   dataType: 'Money',  // Overrides glass zone → server-tick
 * });
 * ```
 *
 * @example With override
 * ```ts
 * const physics = resolvePhysicsV5('glass', 'default', undefined, {
 *   class: 'server-tick',
 * }, 'Payment flow in marketing zone');
 * ```
 */
export function resolvePhysicsV5(
  zone: SigilZone,
  persona: SigilPersona,
  vibes?: SigilVibes,
  override?: Partial<ResolvedPhysicsV5>,
  overrideReason?: string,
  dataTypeConfig?: DataTypeConfig
): ResolvedPhysicsV5 {
  // 1. Check for data type override first
  let physicsClass: PhysicsClass;
  let dataTypeWarning: string | undefined;

  if (dataTypeConfig?.dataType || dataTypeConfig?.dataTypes?.length) {
    const dataTypes = dataTypeConfig.dataTypes ?? (dataTypeConfig.dataType ? [dataTypeConfig.dataType] : []);
    const dataTypeResult = resolvePhysicsFromDataType(dataTypes);

    if (dataTypeResult.physicsClass) {
      physicsClass = dataTypeResult.physicsClass;
      dataTypeWarning = dataTypeResult.warning;

      // Warn if data type conflicts with zone
      const zonePhysics = ZONE_TO_PHYSICS[zone];
      if (zonePhysics !== physicsClass) {
        console.warn(
          `[Sigil] Data type ${dataTypes.join(', ')} (${physicsClass}) overrides zone ${zone} (${zonePhysics}).`
        );
      }
    } else {
      // Data type not found, fall back to zone
      physicsClass = ZONE_TO_PHYSICS[zone];
    }
  } else {
    // No data type, use zone
    physicsClass = ZONE_TO_PHYSICS[zone];
  }

  // 2. Get default physics for this class
  const basePhysics = { ...DEFAULT_PHYSICS[physicsClass] };

  // 3. Apply persona adjustments
  if (persona === 'power_user' && physicsClass === 'server-tick') {
    // Power users get slightly faster timing in critical zones
    if (basePhysics.timing.recommended_ms) {
      basePhysics.timing = {
        ...basePhysics.timing,
        recommended_ms: Math.round(basePhysics.timing.recommended_ms * 0.9),
      };
    }
  } else if (persona === 'cautious') {
    // Cautious users get slower timing
    if (basePhysics.timing.recommended_ms) {
      basePhysics.timing = {
        ...basePhysics.timing,
        recommended_ms: Math.round(basePhysics.timing.recommended_ms * 1.2),
      };
    }
    if (basePhysics.timing.max_ms) {
      basePhysics.timing = {
        ...basePhysics.timing,
        max_ms: Math.round(basePhysics.timing.max_ms * 1.2),
      };
    }
  }

  // 4. Apply vibes timing modifier
  if (vibes?.timing_modifier && vibes.timing_modifier !== 1) {
    const modifier = vibes.timing_modifier;
    basePhysics.timing = {
      min_ms: basePhysics.timing.min_ms
        ? Math.round(basePhysics.timing.min_ms * modifier)
        : undefined,
      recommended_ms: basePhysics.timing.recommended_ms
        ? Math.round(basePhysics.timing.recommended_ms * modifier)
        : undefined,
      max_ms: basePhysics.timing.max_ms
        ? Math.round(basePhysics.timing.max_ms * modifier)
        : undefined,
      feedback_ms: basePhysics.timing.feedback_ms
        ? Math.round(basePhysics.timing.feedback_ms * modifier)
        : undefined,
    };
  }

  // 5. Apply overrides with warning
  if (override) {
    if (!overrideReason) {
      console.warn(
        `[Sigil] Physics override in ${zone} zone without reason. ` +
          `Provide unsafe_override_reason for audit trail.`
      );
    }

    return {
      ...basePhysics,
      ...override,
      override_reason: overrideReason,
    };
  }

  return basePhysics;
}

/**
 * Create CSS custom properties from v5 physics.
 *
 * @param physics - Resolved physics configuration
 * @returns CSS custom properties object
 */
export function createPhysicsStyleV5(physics: ResolvedPhysicsV5): {
  '--sigil-duration': string;
  '--sigil-easing': string;
} {
  // Use recommended_ms, then max_ms, then feedback_ms, then default 300ms
  const duration =
    physics.timing.recommended_ms ??
    physics.timing.max_ms ??
    physics.timing.feedback_ms ??
    300;

  return {
    '--sigil-duration': `${duration}ms`,
    '--sigil-easing': physics.easing,
  };
}

/**
 * Get motion profile timing for v5.
 *
 * @param profileName - Motion profile name (e.g., 'deliberate', 'snappy')
 * @returns Duration in milliseconds
 */
export function getMotionProfileTiming(profileName: string): number {
  return MOTION_PROFILES[profileName]?.duration_ms ?? 300;
}

/**
 * Get motion profile easing for v5.
 *
 * @param profileName - Motion profile name (e.g., 'deliberate', 'snappy')
 * @returns CSS easing string
 */
export function getMotionProfileEasing(profileName: string): string {
  return MOTION_PROFILES[profileName]?.easing ?? 'ease-in-out';
}
