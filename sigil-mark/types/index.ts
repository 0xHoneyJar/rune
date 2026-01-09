/**
 * @sigil-tier gold
 * Sigil v6.0 — Shared Types
 *
 * Core type definitions for the Sigil Design Context Framework.
 * Includes types for SigilProvider, hooks, zone layouts, and workshop index.
 *
 * @module types
 */

// Re-export workshop types
export * from './workshop';

// =============================================================================
// TIME AUTHORITY
// =============================================================================

/**
 * Who owns the clock.
 *
 * - `optimistic` — Client owns clock. Instant update. Silent rollback.
 * - `server-tick` — Server owns clock. Must show pending. Visible rollback.
 * - `hybrid` — Optimistic with sync indicator. Visible rollback.
 */
export type TimeAuthority = 'optimistic' | 'server-tick' | 'hybrid';

// =============================================================================
// ACTION STATUS
// =============================================================================

/**
 * Status of a critical action.
 *
 * Flow:
 * - idle → confirming (optional) → pending → confirmed | failed
 */
export type CriticalActionStatus =
  | 'idle'
  | 'confirming'
  | 'pending'
  | 'confirmed'
  | 'failed';

// =============================================================================
// RISK LEVELS
// =============================================================================

/**
 * Risk level of an action.
 *
 * Used for UI treatment (e.g., high risk shows warnings).
 */
export type Risk = 'low' | 'medium' | 'high';

// =============================================================================
// PROPRIOCEPTION
// =============================================================================

/**
 * Position prediction render mode.
 *
 * - `ghost` — Show transparent prediction
 * - `solid` — Show solid prediction
 * - `hidden` — Don't render prediction
 */
export type PositionRenderMode = 'ghost' | 'solid' | 'hidden';

/**
 * Position reconciliation strategy.
 *
 * - `snap` — Instantly correct to server position
 * - `lerp` — Smoothly interpolate to server position
 * - `ignore` — Don't reconcile (client is truth)
 */
export type ReconcileStrategy = 'snap' | 'lerp' | 'ignore';

/**
 * Self-prediction state (legal lies for responsive feel).
 */
export interface SelfPredictionState {
  /** Predicted position with confidence */
  position: {
    predicted: unknown;
    confidence: number;
    render: PositionRenderMode;
  } | null;
  /** Predicted rotation (instant) */
  rotation: number | null;
  /** Predicted animation state */
  animation: string | null;
}

/**
 * World truth state (server-only, no lies).
 */
export interface WorldTruthState {
  /** Whether server has confirmed the action */
  confirmed: boolean;
  /** Server-confirmed position */
  position?: unknown;
}

/**
 * Self-prediction configuration.
 */
export interface SelfPredictionConfig {
  /** Face target immediately (legal lie) */
  rotation?: { instant: boolean };
  /** Start animation immediately (legal lie) */
  animation?: { optimistic: boolean };
  /** Position prediction config */
  position?: {
    enabled: boolean;
    render: PositionRenderMode;
    reconcile: ReconcileStrategy;
    /** Max ms prediction can diverge before forced reconcile */
    maxDrift: number;
  };
}

/**
 * World truth configuration.
 */
export interface WorldTruthConfig {
  /** HP changes — server only */
  damage?: 'server-only';
  /** Money changes — server only */
  balance?: 'server-only';
  /** Other players — server only */
  otherEntities?: 'server-only';
}

/**
 * Proprioceptive configuration.
 *
 * Separates self-predictions (legal lies) from world-truth (server-only).
 *
 * @example Game-style movement
 * ```ts
 * proprioception: {
 *   self: {
 *     rotation: { instant: true },
 *     animation: { optimistic: true },
 *     position: { enabled: true, render: 'ghost', reconcile: 'lerp', maxDrift: 600 },
 *   },
 *   world: {
 *     damage: 'server-only',
 *     balance: 'server-only',
 *   },
 * }
 * ```
 */
export interface ProprioceptiveConfig {
  /** Self predictions (legal lies) */
  self: SelfPredictionConfig;
  /** World truth (server-only) */
  world: WorldTruthConfig;
}

// =============================================================================
// ZONE TYPES
// =============================================================================

/**
 * Zone type for layout context.
 */
export type ZoneType = 'critical' | 'admin' | 'marketing' | 'default';

/**
 * Lens classification.
 *
 * - `cosmetic` — Colors, fonts, animations (safe everywhere)
 * - `utility` — Overlays, highlights (warning in critical)
 * - `gameplay` — Input hints (blocked in critical/financial)
 */
export type LensClassification = 'cosmetic' | 'utility' | 'gameplay';

// =============================================================================
// SIGIL V5 ZONE TYPES
// =============================================================================

/**
 * Zone types determine physics class and interaction patterns.
 * - critical: Financial/health flows → server-tick physics
 * - glass: Marketing/exploration → local-first physics
 * - machinery: Admin/power-user → local-first (snappy) physics
 * - standard: Default → crdt physics
 */
export type SigilZone = 'critical' | 'glass' | 'machinery' | 'standard';

/**
 * Persona types affect timing and interaction patterns.
 * - default: Standard user experience
 * - power_user: Faster interactions, less hand-holding
 * - cautious: More confirmations, clearer feedback
 */
export type SigilPersona = 'default' | 'power_user' | 'cautious';

// =============================================================================
// SIGIL V5 PHYSICS TYPES
// =============================================================================

/**
 * Physics class determines the state machine and timing requirements.
 */
export type PhysicsClass = 'server-tick' | 'crdt' | 'local-first';

/**
 * State machine states for useSigilMutation.
 */
export type SigilState =
  | 'idle'
  | 'simulating'
  | 'confirming'
  | 'committing'
  | 'done'
  | 'error';

/**
 * CRDT-specific states.
 */
export type CRDTState = 'idle' | 'pending' | 'syncing' | 'done' | 'conflict';

/**
 * Local-first states (simple).
 */
export type LocalFirstState = 'idle' | 'done';

// =============================================================================
// SIGIL V5 VIBE TYPES
// =============================================================================

/**
 * Vibes allow runtime configuration adjustments.
 * These can be set via remote config or feature flags.
 */
export interface SigilVibes {
  /** Multiplier for animation durations (0.5 = faster, 2 = slower) */
  timing_modifier?: number;
  /** Seasonal theme identifier */
  seasonal_theme?: string;
  /** Feature flags */
  features?: Record<string, boolean>;
}

// =============================================================================
// SIGIL V5 CONTEXT TYPES
// =============================================================================

/**
 * The main Sigil context value provided by SigilProvider.
 */
export interface SigilContextValue {
  /** Current zone - determines physics class */
  zone: SigilZone;
  /** Current persona - affects timing and confirmations */
  persona: SigilPersona;
  /** Runtime configuration vibes */
  vibes?: SigilVibes;
}

/**
 * Props for SigilProvider component.
 */
export interface SigilProviderProps {
  children: React.ReactNode;
  /** Override the default zone */
  zone?: SigilZone;
  /** Override the default persona */
  persona?: SigilPersona;
  /** Runtime vibes configuration */
  vibes?: SigilVibes;
}

// =============================================================================
// SIGIL V5 ZONE LAYOUT PROPS
// =============================================================================

/**
 * Base props for zone layout components.
 */
export interface ZoneLayoutProps {
  children: React.ReactNode;
  /** Additional CSS class name */
  className?: string;
}

/**
 * Props for CriticalZone layout.
 */
export interface CriticalZoneProps extends ZoneLayoutProps {
  /** Mark this zone as handling financial data */
  financial?: boolean;
}

// =============================================================================
// SIGIL V5 PHYSICS RESOLUTION TYPES
// =============================================================================

/**
 * Resolved physics configuration for a mutation.
 */
export interface ResolvedPhysics {
  /** The physics class to use */
  class: PhysicsClass;
  /** Timing configuration */
  timing: {
    min_ms?: number;
    recommended_ms?: number;
    max_ms?: number;
    feedback_ms?: number;
  };
  /** Easing function */
  easing: string;
  /** Required patterns */
  requires: string[];
  /** Forbidden patterns */
  forbidden: string[];
  /** Override reason (if physics was overridden) */
  override_reason?: string;
}

/**
 * Default physics configurations by class.
 */
export const DEFAULT_PHYSICS: Record<PhysicsClass, ResolvedPhysics> = {
  'server-tick': {
    class: 'server-tick',
    timing: {
      min_ms: 600,
      recommended_ms: 800,
      max_ms: 1200,
    },
    easing: 'ease-out',
    requires: ['simulation', 'confirmation', 'explicit-pending'],
    forbidden: ['useOptimistic', 'instant-commit', 'hiding-loading'],
  },
  crdt: {
    class: 'crdt',
    timing: {
      feedback_ms: 50,
    },
    easing: 'ease-in-out',
    requires: ['conflict-resolution', 'background-sync'],
    forbidden: ['blocking-save', 'full-page-refresh'],
  },
  'local-first': {
    class: 'local-first',
    timing: {
      max_ms: 50,
    },
    easing: 'linear',
    requires: ['instant-feedback'],
    forbidden: ['loading-spinner-on-local', 'server-round-trip'],
  },
};

// =============================================================================
// SIGIL V5 MOTION TYPES
// =============================================================================

/**
 * Motion profile for animations.
 */
export interface MotionProfile {
  duration_ms: number;
  easing: string;
}

/**
 * Predefined motion profiles from vocabulary.
 */
export const MOTION_PROFILES: Record<string, MotionProfile> = {
  instant: { duration_ms: 0, easing: 'linear' },
  snappy: { duration_ms: 150, easing: 'ease-out' },
  warm: { duration_ms: 300, easing: 'ease-in-out' },
  deliberate: { duration_ms: 800, easing: 'ease-out' },
  reassuring: { duration_ms: 600, easing: 'ease-in-out' },
  celebratory: { duration_ms: 1200, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
};

// =============================================================================
// SIGIL V5 SIMULATION TYPES
// =============================================================================

/**
 * Preview result from simulation step.
 * Contains predicted result and metadata for user confirmation.
 *
 * @template T - Type of the predicted result
 */
export interface SimulationPreview<T = unknown> {
  /** Predicted result of the mutation */
  predictedResult: T;
  /** Estimated duration in milliseconds */
  estimatedDuration?: number;
  /** Warning messages to display */
  warnings?: string[];
  /** Fee information (for financial operations) */
  fees?: {
    estimated: string;
    currency: string;
  };
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

// =============================================================================
// SIGIL V5 MUTATION HOOK TYPES
// =============================================================================

/**
 * Options for useSigilMutation hook.
 *
 * @template TData - Type of mutation result
 * @template TVariables - Type of mutation variables
 */
export interface UseSigilMutationOptions<TData = unknown, TVariables = void> {
  /**
   * The mutation function to execute.
   */
  mutation: (variables: TVariables) => Promise<TData>;

  /**
   * Optional simulation function for server-tick physics.
   * Returns a preview for user confirmation.
   */
  simulate?: (variables: TVariables) => Promise<SimulationPreview<TData>>;

  /**
   * Zone override (defaults to context zone).
   */
  zone?: SigilZone;

  /**
   * Persona override (defaults to context persona).
   */
  persona?: SigilPersona;

  /**
   * Data type hint for physics resolution.
   * When provided, overrides zone-based physics resolution.
   *
   * @example
   * ```ts
   * useSigilMutation({
   *   mutation: (amount) => api.transfer(amount),
   *   dataType: 'Money',  // Forces server-tick physics
   * });
   * ```
   */
  dataType?: string;

  /**
   * Multiple data type hints for physics resolution.
   * Uses highest-risk physics class when multiple types present.
   *
   * @example
   * ```ts
   * useSigilMutation({
   *   mutation: (data) => api.process(data),
   *   dataTypes: ['Money', 'Task'],  // Uses server-tick (Money > Task)
   * });
   * ```
   */
  dataTypes?: string[];

  /**
   * Explicit physics override.
   * Requires unsafe_ prefix to indicate intentional override.
   */
  unsafe_override_physics?: Partial<ResolvedPhysics>;

  /**
   * Reason for physics override.
   * Required when using unsafe_override_physics.
   */
  unsafe_override_reason?: string;

  /**
   * Callback on successful mutation.
   */
  onSuccess?: (data: TData) => void;

  /**
   * Callback on mutation error.
   */
  onError?: (error: Error) => void;

  /**
   * Callback when simulation completes.
   */
  onSimulationComplete?: (preview: SimulationPreview<TData>) => void;
}

/**
 * Result returned by useSigilMutation hook.
 *
 * @template TData - Type of mutation result
 * @template TVariables - Type of mutation variables
 */
export interface UseSigilMutationResult<TData = unknown, TVariables = void> {
  // State
  /** Current state in the mutation lifecycle */
  state: SigilState;
  /** Mutation result data (when done) */
  data: TData | null;
  /** Error (when in error state) */
  error: Error | null;
  /** Simulation preview (when confirming) */
  preview: SimulationPreview<TData> | null;

  // Resolved physics
  /** Resolved physics configuration */
  physics: ResolvedPhysics;

  // Computed UI state
  /** Whether the trigger should be disabled */
  disabled: boolean;
  /** Whether mutation is pending (committing) */
  isPending: boolean;
  /** Whether simulation is in progress */
  isSimulating: boolean;
  /** Whether awaiting confirmation */
  isConfirming: boolean;

  // CSS variables
  /** CSS custom properties for styling */
  cssVars: {
    '--sigil-duration': string;
    '--sigil-easing': string;
  };

  // Actions
  /**
   * Start simulation flow (server-tick physics).
   * Transitions: idle → simulating → confirming
   */
  simulate: (variables: TVariables) => Promise<void>;

  /**
   * Confirm after simulation (server-tick physics).
   * Transitions: confirming → committing → done/error
   */
  confirm: () => Promise<void>;

  /**
   * Cancel simulation and return to idle.
   * Transitions: confirming → idle
   */
  cancel: () => void;

  /**
   * Direct execution (bypasses simulation).
   * For crdt/local-first physics.
   * Transitions: idle → committing → done/error
   */
  execute: (variables: TVariables) => Promise<void>;

  /**
   * Reset to idle state.
   */
  reset: () => void;
}
