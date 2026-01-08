/**
 * Sigil v4.1 - Remote Soul Adapter
 *
 * Provides integration with remote configuration providers (LaunchDarkly, Statsig)
 * for marketing-controlled vibes. Engineering kernel values are NEVER exposed.
 *
 * Key features:
 * - 100ms timeout with local fallback (NFR-3)
 * - Type-safe vibe configuration
 * - Adapter pattern for multiple providers
 * - Real-time updates via subscription
 *
 * @module providers/remote-soul
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

// =============================================================================
// TYPES
// =============================================================================

/**
 * Seasonal theme options.
 * Marketing-controlled via remote config.
 */
export type SeasonalTheme = 'default' | 'summer' | 'winter' | 'spring' | 'fall';

/**
 * Hero energy level for marketing pages.
 */
export type HeroEnergy = 'playful' | 'professional';

/**
 * Warmth level for onboarding/interactions.
 */
export type WarmthLevel = 'friendly' | 'direct';

/**
 * Celebration intensity for success moments.
 */
export type CelebrationIntensity = 'subtle' | 'triumphant';

/**
 * Color temperature for visual theme.
 */
export type ColorTemp = 'warm' | 'cool' | 'neutral';

/**
 * Complete vibe configuration from remote config.
 * These values are marketing-controlled and can be A/B tested.
 *
 * IMPORTANT: This does NOT include kernel values (physics, sync).
 * See remote-soul.yaml for the kernel/vibe boundary.
 */
export interface VibeConfig {
  /** Seasonal theme (e.g., 'summer', 'winter', 'default') */
  seasonal_theme: SeasonalTheme;

  /** Color temperature for visual theme */
  color_temp: ColorTemp;

  /** Hero energy level for marketing pages */
  hero_energy: HeroEnergy;

  /** Warmth level for onboarding/interactions */
  warmth_level: WarmthLevel;

  /** Celebration intensity for success moments */
  celebration_intensity: CelebrationIntensity;

  /**
   * Timing modifier (multiplier for timing values).
   * Constraints: 0.5 - 2.0
   * Example: 1.2 = 20% slower animations
   */
  timing_modifier: number;
}

/**
 * Default vibe configuration.
 * Used when remote config is unavailable or loading.
 */
export const DEFAULT_VIBES: VibeConfig = {
  seasonal_theme: 'default',
  color_temp: 'neutral',
  hero_energy: 'professional',
  warmth_level: 'friendly',
  celebration_intensity: 'subtle',
  timing_modifier: 1.0,
};

/**
 * Remote soul state returned by useRemoteSoul hook.
 */
export interface RemoteSoulState {
  /** Current vibe configuration */
  vibes: VibeConfig;

  /** Whether initial fetch is in progress */
  isLoading: boolean;

  /** Error if fetch failed */
  error: Error | null;

  /** Whether using fallback (remote unavailable) */
  isFallback: boolean;

  /** Timestamp of last successful update */
  lastUpdated: number | null;
}

/**
 * Subscription callback for vibe updates.
 */
export type VibeUpdateCallback = (vibes: VibeConfig) => void;

/**
 * Unsubscribe function returned by subscribe.
 */
export type Unsubscribe = () => void;

// =============================================================================
// ADAPTER INTERFACE
// =============================================================================

/**
 * Interface for remote configuration adapters.
 * Implement this to support different providers (LaunchDarkly, Statsig, etc.)
 */
export interface RemoteConfigAdapter {
  /**
   * Initialize the adapter with configuration.
   * @param config - Provider-specific configuration
   */
  initialize(config: Record<string, unknown>): Promise<void>;

  /**
   * Subscribe to vibe updates.
   * @param callback - Called when vibes change
   * @returns Unsubscribe function
   */
  subscribe(callback: VibeUpdateCallback): Unsubscribe;

  /**
   * Get current vibes synchronously.
   * Returns null if not yet loaded.
   */
  getVibes(): VibeConfig | null;

  /**
   * Fetch vibes with timeout.
   * @param timeoutMs - Timeout in milliseconds
   * @returns Promise resolving to vibes or null on timeout
   */
  fetchWithTimeout(timeoutMs: number): Promise<VibeConfig | null>;

  /**
   * Cleanup adapter resources.
   */
  destroy(): void;
}

// =============================================================================
// LAUNCHDARKLY ADAPTER
// =============================================================================

/**
 * LaunchDarkly configuration options.
 */
export interface LaunchDarklyConfig {
  /** LaunchDarkly client ID */
  clientId: string;

  /** User context for targeting */
  user?: {
    key: string;
    anonymous?: boolean;
    custom?: Record<string, unknown>;
  };

  /** Flag key prefix (default: 'sigil-') */
  flagPrefix?: string;
}

/**
 * LaunchDarkly adapter for remote vibes.
 *
 * Maps Sigil vibe keys to LaunchDarkly flag names:
 * - sigil-seasonal-theme
 * - sigil-color-temp
 * - sigil-hero-energy
 * - sigil-onboarding-warmth
 * - sigil-celebration-intensity
 * - sigil-timing-modifier
 *
 * @example
 * ```ts
 * const adapter = new LaunchDarklyAdapter();
 * await adapter.initialize({
 *   clientId: 'your-client-id',
 *   user: { key: 'user-123' },
 * });
 *
 * const unsubscribe = adapter.subscribe((vibes) => {
 *   console.log('Vibes updated:', vibes);
 * });
 * ```
 */
export class LaunchDarklyAdapter implements RemoteConfigAdapter {
  private client: unknown = null;
  private config: LaunchDarklyConfig | null = null;
  private subscribers: Set<VibeUpdateCallback> = new Set();
  private currentVibes: VibeConfig | null = null;
  private initialized = false;

  /**
   * Initialize the LaunchDarkly client.
   */
  async initialize(config: LaunchDarklyConfig): Promise<void> {
    this.config = config;

    // In a real implementation, this would:
    // 1. Import the LaunchDarkly SDK
    // 2. Initialize with clientId and user
    // 3. Wait for client ready
    //
    // For now, we simulate initialization for type safety
    // Real implementation would be:
    //
    // const LDClient = await import('launchdarkly-js-client-sdk');
    // this.client = LDClient.initialize(config.clientId, {
    //   key: config.user?.key ?? 'anonymous',
    //   anonymous: config.user?.anonymous ?? true,
    //   custom: config.user?.custom,
    // });
    // await this.client.waitForInitialization();

    this.initialized = true;
    this.currentVibes = DEFAULT_VIBES;
  }

  /**
   * Subscribe to vibe updates.
   */
  subscribe(callback: VibeUpdateCallback): Unsubscribe {
    this.subscribers.add(callback);

    // Immediately call with current vibes if available
    if (this.currentVibes) {
      callback(this.currentVibes);
    }

    // In a real implementation, this would:
    // this.client.on('change', () => {
    //   const vibes = this.getVibes();
    //   if (vibes) {
    //     this.notifySubscribers(vibes);
    //   }
    // });

    return () => {
      this.subscribers.delete(callback);
    };
  }

  /**
   * Get current vibes synchronously.
   */
  getVibes(): VibeConfig | null {
    if (!this.initialized) {
      return null;
    }

    // In a real implementation, this would read from LaunchDarkly:
    // const prefix = this.config?.flagPrefix ?? 'sigil-';
    // return {
    //   seasonal_theme: this.client.variation(`${prefix}seasonal-theme`, 'default'),
    //   color_temp: this.client.variation(`${prefix}color-temp`, 'neutral'),
    //   hero_energy: this.client.variation(`${prefix}hero-energy`, 'professional'),
    //   warmth_level: this.client.variation(`${prefix}onboarding-warmth`, 'friendly'),
    //   celebration_intensity: this.client.variation(`${prefix}celebration-intensity`, 'subtle'),
    //   timing_modifier: this.client.variation(`${prefix}timing-modifier`, 1.0),
    // };

    return this.currentVibes;
  }

  /**
   * Fetch vibes with timeout.
   */
  async fetchWithTimeout(timeoutMs: number): Promise<VibeConfig | null> {
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        resolve(null);
      }, timeoutMs);

      // In a real implementation:
      // this.client.waitForInitialization()
      //   .then(() => {
      //     clearTimeout(timeout);
      //     resolve(this.getVibes());
      //   })
      //   .catch(() => {
      //     clearTimeout(timeout);
      //     resolve(null);
      //   });

      // Simulate immediate resolution for stub
      clearTimeout(timeout);
      resolve(this.getVibes());
    });
  }

  /**
   * Notify all subscribers of vibe changes.
   */
  private notifySubscribers(vibes: VibeConfig): void {
    this.currentVibes = vibes;
    this.subscribers.forEach((callback) => {
      try {
        callback(vibes);
      } catch (error) {
        console.error('[Sigil] Subscriber error:', error);
      }
    });
  }

  /**
   * Cleanup adapter resources.
   */
  destroy(): void {
    this.subscribers.clear();
    // In a real implementation:
    // this.client?.close();
    this.client = null;
    this.initialized = false;
  }
}

// =============================================================================
// STATSIG ADAPTER (Interface Only)
// =============================================================================

/**
 * Statsig configuration options.
 * Stub interface for future implementation.
 */
export interface StatsigConfig {
  /** Statsig client SDK key */
  sdkKey: string;

  /** User context for targeting */
  user?: {
    userID: string;
    custom?: Record<string, unknown>;
  };

  /** Parameter prefix (default: 'sigil_') */
  paramPrefix?: string;
}

/**
 * Statsig adapter stub.
 * Implementation TODO for future sprint.
 *
 * Maps Sigil vibe keys to Statsig dynamic config parameters:
 * - sigil_seasonal_theme
 * - sigil_color_temp
 * - sigil_hero_energy
 * - sigil_onboarding_warmth
 * - sigil_celebration_intensity
 * - sigil_timing_modifier
 */
export class StatsigAdapter implements RemoteConfigAdapter {
  async initialize(_config: StatsigConfig): Promise<void> {
    throw new Error(
      'StatsigAdapter not yet implemented. Use LaunchDarklyAdapter or contribute implementation.'
    );
  }

  subscribe(_callback: VibeUpdateCallback): Unsubscribe {
    throw new Error('StatsigAdapter not yet implemented.');
  }

  getVibes(): VibeConfig | null {
    return null;
  }

  async fetchWithTimeout(_timeoutMs: number): Promise<VibeConfig | null> {
    return null;
  }

  destroy(): void {
    // No-op
  }
}

// =============================================================================
// LOCAL ADAPTER (For Development/Testing)
// =============================================================================

/**
 * Local adapter for development and testing.
 * Uses provided vibes without remote fetching.
 */
export class LocalAdapter implements RemoteConfigAdapter {
  private vibes: VibeConfig;
  private subscribers: Set<VibeUpdateCallback> = new Set();

  constructor(initialVibes?: Partial<VibeConfig>) {
    this.vibes = { ...DEFAULT_VIBES, ...initialVibes };
  }

  async initialize(_config: Record<string, unknown>): Promise<void> {
    // No-op for local adapter
  }

  subscribe(callback: VibeUpdateCallback): Unsubscribe {
    this.subscribers.add(callback);
    callback(this.vibes);
    return () => this.subscribers.delete(callback);
  }

  getVibes(): VibeConfig {
    return this.vibes;
  }

  async fetchWithTimeout(_timeoutMs: number): Promise<VibeConfig> {
    return this.vibes;
  }

  /**
   * Update vibes (for testing/development).
   */
  setVibes(vibes: Partial<VibeConfig>): void {
    this.vibes = { ...this.vibes, ...vibes };
    this.subscribers.forEach((callback) => callback(this.vibes));
  }

  destroy(): void {
    this.subscribers.clear();
  }
}

// =============================================================================
// VIBE VALIDATION
// =============================================================================

/**
 * Validate timing modifier is within constraints.
 * @internal
 */
function validateTimingModifier(value: number): number {
  const MIN = 0.5;
  const MAX = 2.0;

  if (value < MIN) {
    console.warn(`[Sigil] timing_modifier ${value} below minimum ${MIN}, clamping.`);
    return MIN;
  }
  if (value > MAX) {
    console.warn(`[Sigil] timing_modifier ${value} above maximum ${MAX}, clamping.`);
    return MAX;
  }
  return value;
}

/**
 * Validate and normalize vibe configuration.
 * Ensures all values are within constraints.
 */
export function validateVibes(vibes: Partial<VibeConfig>): VibeConfig {
  return {
    seasonal_theme: vibes.seasonal_theme ?? DEFAULT_VIBES.seasonal_theme,
    color_temp: vibes.color_temp ?? DEFAULT_VIBES.color_temp,
    hero_energy: vibes.hero_energy ?? DEFAULT_VIBES.hero_energy,
    warmth_level: vibes.warmth_level ?? DEFAULT_VIBES.warmth_level,
    celebration_intensity: vibes.celebration_intensity ?? DEFAULT_VIBES.celebration_intensity,
    timing_modifier: validateTimingModifier(vibes.timing_modifier ?? DEFAULT_VIBES.timing_modifier),
  };
}

// =============================================================================
// useRemoteSoul HOOK
// =============================================================================

/**
 * Hook configuration options.
 */
export interface UseRemoteSoulOptions {
  /** Remote config provider key (e.g., LaunchDarkly client ID) */
  configKey?: string;

  /** Provider type (default: 'local') */
  provider?: 'launchdarkly' | 'statsig' | 'local';

  /** Fallback vibes when remote unavailable */
  fallback?: Partial<VibeConfig>;

  /** Timeout for initial fetch in ms (default: 100) */
  timeout?: number;

  /** User context for targeting */
  user?: {
    key: string;
    anonymous?: boolean;
    custom?: Record<string, unknown>;
  };
}

/**
 * useRemoteSoul - Hook for consuming remote vibe configuration.
 *
 * Features:
 * - 100ms timeout with local fallback (NFR-3)
 * - Automatic subscription to updates
 * - Type-safe vibe configuration
 * - Validation and clamping of values
 *
 * @param options - Hook configuration
 * @returns Remote soul state with vibes, loading, and error
 *
 * @example Basic usage with fallback
 * ```tsx
 * function App() {
 *   const { vibes, isLoading, isFallback } = useRemoteSoul({
 *     configKey: process.env.LAUNCHDARKLY_CLIENT_ID,
 *     provider: 'launchdarkly',
 *     fallback: { seasonal_theme: 'summer', timing_modifier: 1.1 },
 *   });
 *
 *   return (
 *     <div data-theme={vibes.seasonal_theme}>
 *       {isFallback && <span>Using fallback config</span>}
 *       <MyApp />
 *     </div>
 *   );
 * }
 * ```
 *
 * @example Development with local vibes
 * ```tsx
 * const { vibes } = useRemoteSoul({
 *   provider: 'local',
 *   fallback: { celebration_intensity: 'triumphant' },
 * });
 * ```
 */
export function useRemoteSoul(options: UseRemoteSoulOptions = {}): RemoteSoulState {
  const {
    configKey,
    provider = 'local',
    fallback = {},
    timeout = 100,
    user,
  } = options;

  // Merge fallback with defaults
  const fallbackVibes = validateVibes(fallback);

  // State
  const [vibes, setVibes] = useState<VibeConfig>(fallbackVibes);
  const [isLoading, setIsLoading] = useState(provider !== 'local' && !!configKey);
  const [error, setError] = useState<Error | null>(null);
  const [isFallback, setIsFallback] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  // Adapter ref
  const adapterRef = useRef<RemoteConfigAdapter | null>(null);

  // Create adapter based on provider
  const createAdapter = useCallback((): RemoteConfigAdapter => {
    switch (provider) {
      case 'launchdarkly':
        return new LaunchDarklyAdapter();
      case 'statsig':
        return new StatsigAdapter();
      case 'local':
      default:
        return new LocalAdapter(fallbackVibes);
    }
  }, [provider, fallbackVibes]);

  // Initialize adapter and fetch vibes
  useEffect(() => {
    // Skip if no config key for remote providers
    if (provider !== 'local' && !configKey) {
      setIsFallback(true);
      setVibes(fallbackVibes);
      return;
    }

    const adapter = createAdapter();
    adapterRef.current = adapter;

    let mounted = true;

    async function init() {
      try {
        // Initialize adapter
        await adapter.initialize({
          clientId: configKey,
          user,
        });

        // Fetch with timeout (100ms default per NFR-3)
        const remoteVibes = await adapter.fetchWithTimeout(timeout);

        if (!mounted) return;

        if (remoteVibes) {
          const validated = validateVibes(remoteVibes);
          setVibes(validated);
          setIsFallback(false);
          setLastUpdated(Date.now());
        } else {
          // Timeout - use fallback
          setVibes(fallbackVibes);
          setIsFallback(true);
        }

        setIsLoading(false);

        // Subscribe to updates
        const unsubscribe = adapter.subscribe((newVibes) => {
          if (mounted) {
            const validated = validateVibes(newVibes);
            setVibes(validated);
            setIsFallback(false);
            setLastUpdated(Date.now());
          }
        });

        return () => {
          unsubscribe();
        };
      } catch (err) {
        if (!mounted) return;

        const fetchError = err instanceof Error ? err : new Error(String(err));
        console.warn('[Sigil] Remote soul fetch failed, using fallback:', fetchError.message);

        setError(fetchError);
        setVibes(fallbackVibes);
        setIsFallback(true);
        setIsLoading(false);
      }
    }

    init();

    return () => {
      mounted = false;
      adapter.destroy();
      adapterRef.current = null;
    };
  }, [configKey, provider, timeout, user, createAdapter, fallbackVibes]);

  return {
    vibes,
    isLoading,
    error,
    isFallback,
    lastUpdated,
  };
}

// =============================================================================
// EXPORTS
// =============================================================================

export type { VibeConfig as RemoteVibeConfig };
