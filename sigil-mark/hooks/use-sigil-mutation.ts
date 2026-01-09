/**
 * @sigil-tier gold
 * Sigil v5.0 - useSigilMutation Hook
 *
 * Zone+Persona-aware mutation hook with full simulation flow.
 * This is the core hook for all mutations in Sigil v5.
 *
 * v5.0 Changes:
 * - Full simulation flow: idle → simulating → confirming → committing → done
 * - SimulationPreview interface for previewing mutations
 * - simulate(variables) → confirm() two-step flow for server-tick physics
 * - execute(variables) direct path for local-first/crdt physics
 * - Zone-based physics resolution from context
 *
 * v4.1 Legacy:
 * - Remote soul integration with timing_modifier support
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
  useSigilVibes,
} from '../providers/sigil-provider';
import type {
  SigilZone,
  SigilPersona,
  SigilState,
  ResolvedPhysics,
  SimulationPreview,
  UseSigilMutationOptions,
  UseSigilMutationResult,
  SigilVibes,
} from '../types';
import { resolvePhysicsV5, createPhysicsStyleV5, type DataTypeConfig } from './physics-resolver';

// =============================================================================
// HOOK IMPLEMENTATION
// =============================================================================

/**
 * useSigilMutation - Zone+Persona-aware mutation hook with simulation flow.
 *
 * Auto-resolves physics based on:
 * 1. Zone context (from layout wrappers or explicit override)
 * 2. Persona context (from SigilProvider or explicit override)
 * 3. Vibes (from remote config or feature flags)
 *
 * @template TData - Type of data returned by mutation
 * @template TVariables - Type of variables passed to mutation
 *
 * @param options - Mutation configuration
 * @returns Mutation result with state, physics, and actions
 *
 * @example Basic usage with execute (crdt/local-first physics)
 * ```tsx
 * function SaveButton() {
 *   const { execute, isPending, disabled, cssVars } = useSigilMutation({
 *     mutation: (data) => api.save(data),
 *     onSuccess: () => toast.success('Saved!'),
 *   });
 *
 *   return (
 *     <button
 *       onClick={() => execute({ name: 'test' })}
 *       disabled={disabled}
 *       style={cssVars}
 *     >
 *       {isPending ? 'Saving...' : 'Save'}
 *     </button>
 *   );
 * }
 * ```
 *
 * @example Simulation flow (server-tick physics in CriticalZone)
 * ```tsx
 * function PaymentButton() {
 *   const { simulate, confirm, cancel, preview, isSimulating, isConfirming, cssVars } = useSigilMutation({
 *     mutation: (amount) => api.pay(amount),
 *     simulate: async (amount) => ({
 *       predictedResult: { success: true },
 *       fees: { estimated: '0.001', currency: 'ETH' },
 *       warnings: amount > 100 ? ['Large transaction'] : [],
 *     }),
 *     onSuccess: () => toast.success('Payment complete!'),
 *   });
 *
 *   if (isConfirming && preview) {
 *     return (
 *       <div>
 *         <p>Fee: {preview.fees?.estimated} {preview.fees?.currency}</p>
 *         {preview.warnings?.map(w => <p key={w}>{w}</p>)}
 *         <button onClick={confirm}>Confirm</button>
 *         <button onClick={cancel}>Cancel</button>
 *       </div>
 *     );
 *   }
 *
 *   return (
 *     <button onClick={() => simulate(100)} disabled={isSimulating} style={cssVars}>
 *       {isSimulating ? 'Simulating...' : 'Pay $100'}
 *     </button>
 *   );
 * }
 * ```
 *
 * @example Zone context from layout
 * ```tsx
 * // Parent layout
 * <CriticalZone>
 *   <PaymentForm />
 * </CriticalZone>
 *
 * // Inside PaymentForm, physics auto-resolves to server-tick:
 * // - class: 'server-tick'
 * // - timing: { min_ms: 600, recommended_ms: 800, max_ms: 1200 }
 * // - requires: ['simulation', 'confirmation', 'explicit-pending']
 * ```
 */
export function useSigilMutation<TData = unknown, TVariables = void>(
  options: UseSigilMutationOptions<TData, TVariables>
): UseSigilMutationResult<TData, TVariables> {
  const {
    mutation,
    simulate: simulateFn,
    zone: explicitZone,
    persona: explicitPersona,
    dataType,
    dataTypes,
    unsafe_override_physics,
    unsafe_override_reason,
    onSuccess,
    onError,
    onSimulationComplete,
  } = options;

  // Get context values
  const zoneContext = useSigilZoneContext();
  const personaContext = useSigilPersonaContext();
  const vibes = useSigilVibes();

  // Resolve zone (explicit > layout-detected > default)
  const zone: SigilZone = (explicitZone ?? zoneContext.current ?? 'standard') as SigilZone;

  // Resolve persona (explicit > context > default)
  const persona: SigilPersona = (explicitPersona ?? personaContext.current ?? 'default') as SigilPersona;

  // Build data type config if provided
  const dataTypeConfig: DataTypeConfig | undefined =
    dataType || dataTypes?.length
      ? { dataType, dataTypes }
      : undefined;

  // Resolve physics from zone + persona + data type
  // Priority: dataType > zone > defaults
  const physics = resolvePhysicsV5(
    zone,
    persona,
    vibes,
    unsafe_override_physics,
    unsafe_override_reason,
    dataTypeConfig
  );

  // ==========================================================================
  // STATE MACHINE (S3-T3)
  // ==========================================================================

  const [state, setState] = useState<SigilState>('idle');
  const [data, setData] = useState<TData | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [preview, setPreview] = useState<SimulationPreview<TData> | null>(null);

  // Store pending variables for confirm step
  const pendingVariablesRef = useRef<TVariables | null>(null);

  // Track if override warning has been logged
  const overrideWarningLoggedRef = useRef(false);

  // Log override warning once
  useEffect(() => {
    if (
      unsafe_override_physics &&
      !unsafe_override_reason &&
      !overrideWarningLoggedRef.current
    ) {
      console.warn(
        `[Sigil] useSigilMutation: Physics override in ${zone} zone without reason.`,
        '\nProvide unsafe_override_reason for audit trail.',
        '\nOverrides:',
        unsafe_override_physics
      );
      overrideWarningLoggedRef.current = true;
    }
  }, [unsafe_override_physics, unsafe_override_reason, zone]);

  // ==========================================================================
  // COMPUTED UI STATE (S3-T7)
  // ==========================================================================

  const isSimulating = state === 'simulating';
  const isConfirming = state === 'confirming';
  const isPending = state === 'committing';

  // Disabled when not in idle or confirming state
  const disabled = state !== 'idle' && state !== 'confirming';

  // Create CSS custom properties
  const cssVars = createPhysicsStyleV5(physics);

  // ==========================================================================
  // SIMULATE FUNCTION (S3-T4)
  // ==========================================================================

  const simulate = useCallback(
    async (variables: TVariables): Promise<void> => {
      // Only simulate from idle state
      if (state !== 'idle') {
        console.warn('[Sigil] simulate() called when not in idle state');
        return;
      }

      // Store variables for confirm step
      pendingVariablesRef.current = variables;

      setState('simulating');
      setError(null);

      try {
        let simulationPreview: SimulationPreview<TData>;

        if (simulateFn) {
          // Use provided simulate function
          simulationPreview = await simulateFn(variables);
        } else {
          // Create default preview (no actual simulation)
          simulationPreview = {
            predictedResult: null as unknown as TData,
            estimatedDuration: physics.timing.recommended_ms ?? physics.timing.max_ms ?? 800,
          };
        }

        setPreview(simulationPreview);
        setState('confirming');
        onSimulationComplete?.(simulationPreview);
      } catch (err) {
        const simulationError = err instanceof Error ? err : new Error(String(err));
        setError(simulationError);
        setState('error');
        onError?.(simulationError);
      }
    },
    [state, simulateFn, physics.timing.recommended_ms, physics.timing.max_ms, onSimulationComplete, onError]
  );

  // ==========================================================================
  // CONFIRM FUNCTION (S3-T5)
  // ==========================================================================

  const confirm = useCallback(async (): Promise<void> => {
    // Only confirm from confirming state
    if (state !== 'confirming') {
      console.warn('[Sigil] confirm() called when not in confirming state');
      return;
    }

    const variables = pendingVariablesRef.current;
    if (variables === null) {
      console.error('[Sigil] confirm() called but no pending variables');
      setState('error');
      setError(new Error('No pending variables for confirmation'));
      return;
    }

    setState('committing');

    try {
      const result = await mutation(variables);
      setData(result);
      setState('done');
      onSuccess?.(result);
    } catch (err) {
      const mutationError = err instanceof Error ? err : new Error(String(err));
      setError(mutationError);
      setState('error');
      onError?.(mutationError);
    }
  }, [state, mutation, onSuccess, onError]);

  // ==========================================================================
  // CANCEL FUNCTION
  // ==========================================================================

  const cancel = useCallback((): void => {
    if (state === 'confirming') {
      pendingVariablesRef.current = null;
      setPreview(null);
      setState('idle');
    }
  }, [state]);

  // ==========================================================================
  // EXECUTE FUNCTION (S3-T6)
  // ==========================================================================

  const execute = useCallback(
    async (variables: TVariables): Promise<void> => {
      // Only execute from idle state
      if (state !== 'idle') {
        console.warn('[Sigil] execute() called when not in idle state');
        return;
      }

      // Warn if using execute on server-tick physics
      if (physics.class === 'server-tick') {
        console.warn(
          '[Sigil] execute() called on server-tick physics. ' +
            'Consider using simulate() → confirm() flow for better UX.'
        );
      }

      setState('committing');
      setError(null);

      try {
        const result = await mutation(variables);
        setData(result);
        setState('done');
        onSuccess?.(result);
      } catch (err) {
        const mutationError = err instanceof Error ? err : new Error(String(err));
        setError(mutationError);
        setState('error');
        onError?.(mutationError);
      }
    },
    [state, physics.class, mutation, onSuccess, onError]
  );

  // ==========================================================================
  // RESET FUNCTION
  // ==========================================================================

  const reset = useCallback((): void => {
    setState('idle');
    setData(null);
    setError(null);
    setPreview(null);
    pendingVariablesRef.current = null;
  }, []);

  // ==========================================================================
  // RETURN RESULT (S3-T8)
  // ==========================================================================

  return {
    // State
    state,
    data,
    error,
    preview,

    // Resolved physics
    physics,

    // Computed UI state
    disabled,
    isPending,
    isSimulating,
    isConfirming,

    // CSS variables
    cssVars,

    // Actions
    simulate,
    confirm,
    cancel,
    execute,
    reset,
  };
}

// =============================================================================
// EXPORTS
// =============================================================================

export type {
  SigilState,
  SimulationPreview,
  UseSigilMutationOptions,
  UseSigilMutationResult,
  ResolvedPhysics,
} from '../types';

export { resolvePhysicsV5, createPhysicsStyleV5, type DataTypeConfig } from './physics-resolver';
