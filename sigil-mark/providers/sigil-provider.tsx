/**
 * @sigil-tier gold
 * Sigil v5.0 - SigilProvider Context
 *
 * Main context provider that holds zone, persona, and vibes state.
 * This enables runtime enforcement of design rules by providing context
 * that hooks like useSigilMutation can consume.
 *
 * v5.0 Changes:
 * - Unified SigilZone type ('critical' | 'glass' | 'machinery' | 'standard')
 * - SigilPersona type ('default' | 'power_user' | 'cautious')
 * - SigilVibes for runtime configuration
 * - Physics resolution based on zone context
 *
 * v4.1 Legacy:
 * - RemoteSoulContext integration with useRemoteSoul hook
 * - Support for LaunchDarkly/Statsig adapters
 * - 100ms timeout with local fallback (NFR-3)
 *
 * @module providers/sigil-provider
 */

'use client';

import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  type ReactNode,
} from 'react';
import {
  useRemoteSoul,
  validateVibes,
  DEFAULT_VIBES,
  type VibeConfig,
  type RemoteSoulState,
  type UseRemoteSoulOptions,
} from './remote-soul';

// =============================================================================
// TYPES
// =============================================================================

/**
 * Persona identifier.
 * Defines user archetypes that affect UI behavior.
 */
export type PersonaId = 'power_user' | 'newcomer' | 'accessibility' | string;

/**
 * Zone identifier.
 * Maps to layout zones defined in .sigilrc.yaml.
 */
export type ZoneId = 'critical' | 'admin' | 'marketing' | 'default' | string;

/**
 * Motion timing name.
 * Maps to physics timing definitions.
 */
export type MotionName =
  | 'instant'
  | 'snappy'
  | 'warm'
  | 'deliberate'
  | 'reassuring'
  | 'celebratory'
  | 'reduced';

// Re-export VibeConfig from remote-soul for convenience
export type { VibeConfig } from './remote-soul';

/**
 * Persona traits derived from persona ID.
 */
export interface PersonaTraits {
  /** Preferred density level */
  density?: 'low' | 'medium' | 'high';
  /** Help visibility preference */
  help?: 'always' | 'contextual' | 'on_demand' | 'never';
  /** Whether to show inline help */
  show_help?: boolean;
  /** Preferred motion style */
  motion?: MotionName;
}

/**
 * Zone context value for layout wrappers to set.
 */
export interface SigilZoneContextValue {
  /** Current zone ID */
  current: ZoneId | null;
  /** Set the current zone (called by layout wrappers) */
  setZone: (zone: ZoneId | null) => void;
}

/**
 * Persona context value.
 */
export interface SigilPersonaContextValue {
  /** Current persona ID */
  current: PersonaId;
  /** Set the current persona */
  setPersona: (persona: PersonaId) => void;
  /** Derived traits for the current persona */
  traits: PersonaTraits;
}

/**
 * Remote soul context value.
 * Full implementation in v4.1 with LaunchDarkly/Statsig support.
 */
export interface SigilRemoteSoulContextValue {
  /** Current vibes from remote config (always has defaults) */
  vibes: VibeConfig;
  /** Whether initial fetch is in progress */
  isLoading: boolean;
  /** Error from remote config */
  error: Error | null;
  /** Whether using fallback (remote unavailable) */
  isFallback: boolean;
  /** Timestamp of last successful update */
  lastUpdated: number | null;
}

/**
 * SigilProvider props.
 */
export interface SigilProviderProps {
  /** Child components */
  children: ReactNode;
  /** Initial persona (default: 'power_user') */
  persona?: PersonaId;
  /** Remote config provider key (for LaunchDarkly/Statsig) */
  remoteConfigKey?: string;
  /** Provider type (default: 'local') */
  remoteConfigProvider?: 'launchdarkly' | 'statsig' | 'local';
  /** Fallback vibes if remote config unavailable */
  localVibes?: Partial<VibeConfig>;
  /** Timeout for remote config fetch in ms (default: 100) */
  remoteConfigTimeout?: number;
  /** User context for remote config targeting */
  remoteConfigUser?: {
    key: string;
    anonymous?: boolean;
    custom?: Record<string, unknown>;
  };
}

// =============================================================================
// PERSONA TRAITS MAPPING
// =============================================================================

/**
 * Get persona traits from persona ID.
 * @internal
 */
function getPersonaTraits(persona: PersonaId): PersonaTraits {
  const traits: Record<PersonaId, PersonaTraits> = {
    power_user: {
      density: 'high',
      help: 'on_demand',
      show_help: false,
      motion: 'snappy',
    },
    newcomer: {
      density: 'low',
      help: 'always',
      show_help: true,
      motion: 'warm',
    },
    accessibility: {
      density: 'low',
      help: 'always',
      show_help: true,
      motion: 'reduced',
    },
  };

  return traits[persona] ?? traits.power_user;
}

// =============================================================================
// CONTEXT DEFINITIONS
// =============================================================================

/**
 * Zone context for layout wrappers.
 * @internal
 */
const SigilZoneContext = createContext<SigilZoneContextValue>({
  current: null,
  setZone: () => {},
});
SigilZoneContext.displayName = 'SigilZoneContext';

/**
 * Persona context.
 * @internal
 */
const SigilPersonaContext = createContext<SigilPersonaContextValue>({
  current: 'power_user',
  setPersona: () => {},
  traits: getPersonaTraits('power_user'),
});
SigilPersonaContext.displayName = 'SigilPersonaContext';

/**
 * Remote soul context.
 * Full implementation in v4.1 with real adapter support.
 * @internal
 */
const SigilRemoteSoulContext = createContext<SigilRemoteSoulContextValue>({
  vibes: DEFAULT_VIBES,
  isLoading: false,
  error: null,
  isFallback: true,
  lastUpdated: null,
});
SigilRemoteSoulContext.displayName = 'SigilRemoteSoulContext';

// =============================================================================
// PROVIDER IMPLEMENTATION
// =============================================================================

/**
 * SigilProvider - Main context provider for Sigil v4.1.
 *
 * Provides:
 * - Zone context: Current zone set by layout wrappers
 * - Persona context: User archetype for UI adaptation
 * - Remote soul context: Marketing-controlled vibes (stub for Sprint 5)
 *
 * @example Basic usage
 * ```tsx
 * import { SigilProvider } from 'sigil-mark/providers';
 *
 * function App() {
 *   return (
 *     <SigilProvider persona="newcomer">
 *       <YourApp />
 *     </SigilProvider>
 *   );
 * }
 * ```
 *
 * @example With remote config (LaunchDarkly)
 * ```tsx
 * <SigilProvider
 *   persona={detectUserPersona()}
 *   remoteConfigKey={process.env.LAUNCHDARKLY_CLIENT_ID}
 *   remoteConfigProvider="launchdarkly"
 *   localVibes={{ seasonal_theme: 'summer', timing_modifier: 1.0 }}
 *   remoteConfigUser={{ key: userId }}
 * >
 *   <YourApp />
 * </SigilProvider>
 * ```
 *
 * @example Development with local vibes
 * ```tsx
 * <SigilProvider
 *   persona="newcomer"
 *   localVibes={{ celebration_intensity: 'triumphant' }}
 * >
 *   <YourApp />
 * </SigilProvider>
 * ```
 */
export function SigilProvider({
  children,
  persona: initialPersona = 'power_user',
  remoteConfigKey,
  remoteConfigProvider = 'local',
  localVibes,
  remoteConfigTimeout = 100,
  remoteConfigUser,
}: SigilProviderProps) {
  // Zone state (set by layout wrappers)
  const [zone, setZone] = useState<ZoneId | null>(null);

  // Persona state
  const [persona, setPersona] = useState<PersonaId>(initialPersona);
  const traits = useMemo(() => getPersonaTraits(persona), [persona]);

  // Remote soul - uses useRemoteSoul hook for real adapter integration
  const remoteSoulState = useRemoteSoul({
    configKey: remoteConfigKey,
    provider: remoteConfigProvider,
    fallback: localVibes,
    timeout: remoteConfigTimeout,
    user: remoteConfigUser,
  });

  // Zone context value
  const zoneContextValue = useMemo<SigilZoneContextValue>(
    () => ({
      current: zone,
      setZone,
    }),
    [zone]
  );

  // Persona context value
  const personaContextValue = useMemo<SigilPersonaContextValue>(
    () => ({
      current: persona,
      setPersona,
      traits,
    }),
    [persona, traits]
  );

  // Remote soul context value - directly from useRemoteSoul
  const remoteSoulContextValue = useMemo<SigilRemoteSoulContextValue>(
    () => ({
      vibes: remoteSoulState.vibes,
      isLoading: remoteSoulState.isLoading,
      error: remoteSoulState.error,
      isFallback: remoteSoulState.isFallback,
      lastUpdated: remoteSoulState.lastUpdated,
    }),
    [remoteSoulState]
  );

  return (
    <SigilZoneContext.Provider value={zoneContextValue}>
      <SigilPersonaContext.Provider value={personaContextValue}>
        <SigilRemoteSoulContext.Provider value={remoteSoulContextValue}>
          {children}
        </SigilRemoteSoulContext.Provider>
      </SigilPersonaContext.Provider>
    </SigilZoneContext.Provider>
  );
}

SigilProvider.displayName = 'SigilProvider';

// =============================================================================
// HOOKS
// =============================================================================

/**
 * Get the zone context from SigilProvider.
 *
 * @returns Zone context with current zone and setZone function
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { current, setZone } = useSigilZoneContext();
 *   // current: 'critical' | 'admin' | 'marketing' | 'default' | null
 * }
 * ```
 */
export function useSigilZoneContext(): SigilZoneContextValue {
  return useContext(SigilZoneContext);
}

/**
 * Get the persona context from SigilProvider.
 *
 * @returns Persona context with current persona, setPersona, and traits
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { current, traits, setPersona } = useSigilPersonaContext();
 *   // current: 'power_user' | 'newcomer' | 'accessibility'
 *   // traits.density: 'low' | 'medium' | 'high'
 *   // traits.motion: 'snappy' | 'warm' | 'deliberate' | etc.
 * }
 * ```
 */
export function useSigilPersonaContext(): SigilPersonaContextValue {
  return useContext(SigilPersonaContext);
}

/**
 * Get the remote soul context from SigilProvider.
 *
 * Full implementation in v4.1 with LaunchDarkly/Statsig adapter support.
 *
 * @returns Remote soul context with vibes, isLoading, and error
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { vibes, isLoading, error, isFallback } = useSigilRemoteSoulContext();
 *   // vibes.timing_modifier: number (always defined with defaults)
 *   // vibes.seasonal_theme: 'summer' | 'winter' | 'default' | 'spring' | 'fall'
 *   // isFallback: true if using local fallback (remote unavailable)
 * }
 * ```
 *
 * @example Conditionally render based on vibe
 * ```tsx
 * function Hero() {
 *   const { vibes } = useSigilRemoteSoulContext();
 *
 *   return (
 *     <div
 *       data-energy={vibes.hero_energy}
 *       data-theme={vibes.seasonal_theme}
 *     >
 *       <HeroContent intensity={vibes.celebration_intensity} />
 *     </div>
 *   );
 * }
 * ```
 */
export function useSigilRemoteSoulContext(): SigilRemoteSoulContextValue {
  return useContext(SigilRemoteSoulContext);
}

// =============================================================================
// CONVENIENCE ALIASES (backwards compatibility with existing layouts)
// =============================================================================

/**
 * Alias for useSigilZoneContext (compatibility with layouts).
 */
export const useZoneContext = useSigilZoneContext;

/**
 * Alias for useSigilPersonaContext.
 */
export const usePersonaContext = useSigilPersonaContext;

/**
 * Alias for useSigilRemoteSoulContext.
 */
export const useRemoteSoulContext = useSigilRemoteSoulContext;

// =============================================================================
// EXPORTS
// =============================================================================

export {
  SigilZoneContext,
  SigilPersonaContext,
  SigilRemoteSoulContext,
  getPersonaTraits,
};

// Re-export remote-soul utilities for convenience
export {
  DEFAULT_VIBES,
  validateVibes,
  useRemoteSoul,
  LocalAdapter,
  LaunchDarklyAdapter,
  StatsigAdapter,
} from './remote-soul';
export type {
  RemoteSoulState,
  RemoteConfigAdapter,
  UseRemoteSoulOptions,
  SeasonalTheme,
  HeroEnergy,
  WarmthLevel,
  CelebrationIntensity,
  ColorTemp,
} from './remote-soul';

// =============================================================================
// V5 EXPORTS & ALIASES
// =============================================================================

// Import v5 types from types module
import type {
  SigilZone,
  SigilPersona,
  SigilVibes,
  SigilContextValue,
  SigilProviderProps as V5SigilProviderProps,
  PhysicsClass,
  ResolvedPhysics,
} from '../types';

// Re-export v5 types for convenience
export type {
  SigilZone,
  SigilPersona,
  SigilVibes,
  SigilContextValue,
  PhysicsClass,
  ResolvedPhysics,
};

// Export DEFAULT_PHYSICS for physics resolution
export { DEFAULT_PHYSICS, MOTION_PROFILES } from '../types';

/**
 * Get current vibes from context (v5 alias).
 * Returns the vibes object for runtime configuration.
 */
export function useSigilVibes(): SigilVibes | undefined {
  const { vibes } = useSigilRemoteSoulContext();
  return vibes as unknown as SigilVibes;
}
