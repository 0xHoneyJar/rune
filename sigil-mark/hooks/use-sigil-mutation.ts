/**
 * Sigil v4.1 - useSigilMutation Hook
 *
 * Zone+Persona-aware mutation hook that auto-resolves physics from context.
 * This is the recommended hook for all mutations in Sigil v4.1+.
 *
 * Replaces useCriticalAction with a simpler API that automatically resolves
 * physics based on:
 * 1. Zone context (from layout wrappers)
 * 2. Persona context (from SigilProvider)
 * 3. Remote soul vibes (from LaunchDarkly/Statsig)
 *
 * v4.1 Changes:
 * - Full remote soul integration with timing_modifier support
 * - Vibes exposed in physics for component use
 * - Base timing preserved for debugging
 *
 * @module hooks/use-sigil-mutation
 */

'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  useSigilZoneContext,
  useSigilPersonaContext,
  useSigilRemoteSoulContext,
  type ZoneId,
  type PersonaId,
} from '../providers/sigil-provider';
import {
  resolvePhysics,
  createPhysicsStyle,
  type ResolvedPhysics,
  type SyncStrategy,
} from './physics-resolver';

// =============================================================================
// TYPES
// =============================================================================

/**
 * Mutation status.
 */
export type MutationStatus = 'idle' | 'pending' | 'confirmed' | 'failed';

/**
 * Configuration for useSigilMutation hook.
 *
 * @template TData - Type of data returned by mutation
 * @template TVariables - Type of variables passed to mutation
 */
export interface SigilMutationConfig<TData = unknown, TVariables = void> {
  /**
   * The async mutation function.
   * @param variables - Variables to pass to the mutation
   * @returns Promise resolving to the mutation result
   */
  mutation: (variables: TVariables) => Promise<TData>;

  /**
   * Optional zone override.
   * If not provided, auto-detected from ZoneContext (layout wrapper).
   * @default auto-detected from context
   */
  zone?: ZoneId;

  /**
   * Optional persona override.
   * If not provided, auto-detected from PersonaContext.
   * @default auto-detected from context
   */
  persona?: PersonaId;

  /**
   * Explicit physics override.
   * Requires unsafe_ prefix to indicate intentional override.
   * Will log a console warning when used.
   */
  unsafe_override_physics?: Partial<ResolvedPhysics>;

  /**
   * Reason for physics override.
   * Required when using unsafe_override_physics.
   * Logged to console for friction tracking.
   */
  unsafe_override_reason?: string;

  /**
   * Callback invoked on successful mutation.
   * @param data - The mutation result
   */
  onSuccess?: (data: TData) => void;

  /**
   * Callback invoked on mutation error.
   * @param error - The error that occurred
   */
  onError?: (error: Error) => void;
}

/**
 * CSS custom properties for styling.
 */
export interface SigilMutationStyle {
  '--sigil-duration': string;
  '--sigil-easing': string;
}

/**
 * Result returned by useSigilMutation hook.
 *
 * @template TData - Type of data returned by mutation
 * @template TVariables - Type of variables passed to mutation
 */
export interface SigilMutationResult<TData = unknown, TVariables = void> {
  // State
  /** Current mutation status */
  status: MutationStatus;
  /** Mutation result data (when confirmed) */
  data: TData | null;
  /** Error (when failed) */
  error: Error | null;

  // Resolved physics
  /** Resolved physics configuration */
  physics: ResolvedPhysics;

  // Computed UI state
  /** Whether the trigger should be disabled (pessimistic sync + pending) */
  disabled: boolean;
  /** Whether mutation is pending */
  isPending: boolean;

  // CSS variables
  /** CSS custom properties for styling */
  style: SigilMutationStyle;

  // Actions
  /** Execute the mutation */
  execute: (variables: TVariables) => Promise<void>;
  /** Reset to idle state */
  reset: () => void;
}

// =============================================================================
// HOOK IMPLEMENTATION
// =============================================================================

/**
 * useSigilMutation - Zone+Persona-aware mutation hook.
 *
 * Auto-resolves physics based on:
 * 1. Zone context (from layout wrappers or explicit override)
 * 2. Persona context (from SigilProvider or explicit override)
 * 3. Remote soul vibes (from LaunchDarkly/Statsig)
 *
 * @template TData - Type of data returned by mutation
 * @template TVariables - Type of variables passed to mutation
 *
 * @param config - Mutation configuration
 * @returns Mutation result with state, physics, and actions
 *
 * @example Basic usage (physics auto-resolved)
 * ```tsx
 * function PaymentButton() {
 *   const { execute, isPending, disabled, style, physics } = useSigilMutation({
 *     mutation: (amount) => api.pay(amount),
 *     onSuccess: () => toast.success('Payment complete!'),
 *   });
 *
 *   return (
 *     <button
 *       onClick={() => execute(100)}
 *       disabled={disabled}
 *       style={style}
 *     >
 *       {isPending ? 'Processing...' : 'Pay $100'}
 *     </button>
 *   );
 * }
 * ```
 *
 * @example With zone+persona in CriticalZone
 * ```tsx
 * // Parent component
 * <CriticalZone>
 *   <PaymentForm />
 * </CriticalZone>
 *
 * // Inside PaymentForm, physics auto-resolves to:
 * // - sync: 'pessimistic' (server owns clock)
 * // - timing: 800ms (deliberate)
 * // - disabled_while_pending: true
 * ```
 *
 * @example With explicit overrides
 * ```tsx
 * const mutation = useSigilMutation({
 *   mutation: (data) => api.save(data),
 *   zone: 'critical',  // Override zone
 *   persona: 'newcomer', // Override persona
 *   unsafe_override_physics: { timing: 1500 },
 *   unsafe_override_reason: 'Extended timing for complex animation',
 * });
 * ```
 *
 * @example Using remote vibes for styling
 * ```tsx
 * function HeroAction() {
 *   const { physics, execute, isPending, style } = useSigilMutation({
 *     mutation: () => api.subscribe(),
 *   });
 *
 *   // Access vibes for conditional styling
 *   const { vibes } = physics;
 *
 *   return (
 *     <button
 *       onClick={() => execute()}
 *       disabled={isPending}
 *       style={style}
 *       data-energy={vibes?.hero_energy}
 *       data-theme={vibes?.seasonal_theme}
 *     >
 *       {isPending ? 'Subscribing...' : 'Subscribe'}
 *     </button>
 *   );
 * }
 * ```
 */
export function useSigilMutation<TData = unknown, TVariables = void>(
  config: SigilMutationConfig<TData, TVariables>
): SigilMutationResult<TData, TVariables> {
  const {
    mutation,
    zone: explicitZone,
    persona: explicitPersona,
    unsafe_override_physics,
    unsafe_override_reason,
    onSuccess,
    onError,
  } = config;

  // Get context values
  const zoneContext = useSigilZoneContext();
  const personaContext = useSigilPersonaContext();
  const remoteSoulContext = useSigilRemoteSoulContext();

  // Resolve zone (explicit > layout-detected > default)
  const zone: ZoneId = explicitZone ?? zoneContext.current ?? 'default';

  // Resolve persona (explicit > context > default)
  const persona: PersonaId = explicitPersona ?? personaContext.current ?? 'power_user';

  // Resolve physics from zone + persona matrix
  const basePhysics = resolvePhysics(zone, persona, remoteSoulContext);

  // Apply unsafe overrides if present
  const physics: ResolvedPhysics = unsafe_override_physics
    ? { ...basePhysics, ...unsafe_override_physics }
    : basePhysics;

  // State
  const [status, setStatus] = useState<MutationStatus>('idle');
  const [data, setData] = useState<TData | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // Track if override warning has been logged (once per hook instance)
  const overrideWarningLoggedRef = useRef(false);

  // Log override warning (once per hook instance)
  useEffect(() => {
    if (
      unsafe_override_physics &&
      unsafe_override_reason &&
      !overrideWarningLoggedRef.current
    ) {
      console.warn(
        `[Sigil] Physics override in ${zone} zone:`,
        unsafe_override_reason,
        '\nOverrides:',
        unsafe_override_physics
      );
      overrideWarningLoggedRef.current = true;
    }
  }, [unsafe_override_physics, unsafe_override_reason, zone]);

  // Compute disabled state
  const isPending = status === 'pending';
  const disabled = physics.disabled_while_pending && isPending;

  // Create CSS custom properties
  const style = createPhysicsStyle(physics);

  // Execute mutation
  const execute = useCallback(
    async (variables: TVariables): Promise<void> => {
      // Prevent double execution
      if (status === 'pending') {
        return;
      }

      setStatus('pending');
      setError(null);

      try {
        const result = await mutation(variables);
        setData(result);
        setStatus('confirmed');
        onSuccess?.(result);
      } catch (err) {
        const mutationError = err instanceof Error ? err : new Error(String(err));
        setError(mutationError);
        setStatus('failed');
        onError?.(mutationError);
      }
    },
    [status, mutation, onSuccess, onError]
  );

  // Reset to idle
  const reset = useCallback(() => {
    setStatus('idle');
    setData(null);
    setError(null);
  }, []);

  return {
    // State
    status,
    data,
    error,

    // Resolved physics
    physics,

    // Computed UI state
    disabled,
    isPending,

    // CSS variables
    style,

    // Actions
    execute,
    reset,
  };
}

// =============================================================================
// EXPORTS
// =============================================================================

export { type ResolvedPhysics, type SyncStrategy } from './physics-resolver';
