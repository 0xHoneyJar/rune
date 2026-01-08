/**
 * Sigil v4.1 - Providers Module
 *
 * Exports all context providers and hooks for Sigil runtime.
 *
 * v4.1 Changes:
 * - Full RemoteSoul implementation with adapter support
 * - LaunchDarkly and Statsig adapter classes
 * - useRemoteSoul hook for standalone use
 *
 * @module providers
 */

// =============================================================================
// SIGIL PROVIDER
// =============================================================================

export {
  // Main provider
  SigilProvider,

  // Hooks
  useSigilZoneContext,
  useSigilPersonaContext,
  useSigilRemoteSoulContext,

  // Aliases (backwards compatibility)
  useZoneContext,
  usePersonaContext,
  useRemoteSoulContext,

  // Internal contexts (for advanced use)
  SigilZoneContext,
  SigilPersonaContext,
  SigilRemoteSoulContext,

  // Utilities
  getPersonaTraits,

  // Types
  type PersonaId,
  type ZoneId,
  type MotionName,
  type VibeConfig,
  type PersonaTraits,
  type SigilZoneContextValue,
  type SigilPersonaContextValue,
  type SigilRemoteSoulContextValue,
  type SigilProviderProps,
} from './sigil-provider';

// =============================================================================
// REMOTE SOUL (v4.1)
// =============================================================================

export {
  // Standalone hook (can be used without SigilProvider)
  useRemoteSoul,

  // Adapters
  LocalAdapter,
  LaunchDarklyAdapter,
  StatsigAdapter,

  // Utilities
  DEFAULT_VIBES,
  validateVibes,

  // Types
  type RemoteSoulState,
  type RemoteConfigAdapter,
  type UseRemoteSoulOptions,
  type SeasonalTheme,
  type HeroEnergy,
  type WarmthLevel,
  type CelebrationIntensity,
  type ColorTemp,
} from './remote-soul';
