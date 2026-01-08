/**
 * Sigil ESLint Plugin - Config Loader
 *
 * Loads and caches .sigilrc.yaml configuration for zone-aware linting.
 * This module provides fast access to Sigil configuration during linting.
 *
 * @module config-loader
 * @version 4.1.0
 */

import * as fs from "fs";
import * as path from "path";
import * as yaml from "yaml";

/**
 * Motion timing constraints for zone compliance
 */
export interface MotionConstraints {
  min: number;
  max: number;
}

/**
 * Zone configuration from .sigilrc.yaml
 */
export interface ZoneConfig {
  layout?: string;
  timeAuthority?: string;
  lens?: string;
  motion?: string;
  default_physics?: {
    sync?: string;
    timing?: string;
    motion?: string;
  };
  constraints?: Record<string, string>;
  persona_overrides?: Record<
    string,
    {
      lens?: string;
      help?: string;
      density?: string;
      motion?: string;
      timing?: string;
      show_help?: boolean;
    }
  >;
  paths?: string[];
}

/**
 * Physics configuration from .sigilrc.yaml
 */
export interface PhysicsConfig {
  motion_timings: Record<string, number>;
  motion_easings: Record<string, string>;
}

/**
 * Full Sigil configuration
 */
export interface SigilConfig {
  sigil: string;
  codename?: string;
  project?: {
    name?: string;
  };
  zones: Record<string, ZoneConfig>;
  physics: PhysicsConfig;
  lenses?: Record<string, unknown>;
}

/**
 * Default motion timing constraints (ms)
 */
export const MOTION_CONSTRAINTS: Record<string, MotionConstraints> = {
  instant: { min: 0, max: 50 },
  snappy: { min: 100, max: 200 },
  warm: { min: 200, max: 400 },
  deliberate: { min: 500, max: 1000 },
  reassuring: { min: 800, max: 1500 },
};

/**
 * Default configuration when .sigilrc.yaml is not found
 */
const DEFAULT_CONFIG: SigilConfig = {
  sigil: "4.1.0",
  zones: {
    default: {
      motion: "warm",
      default_physics: {
        sync: "optimistic",
        timing: "warm",
        motion: "warm",
      },
    },
  },
  physics: {
    motion_timings: {
      instant: 0,
      snappy: 150,
      warm: 300,
      deliberate: 800,
      reassuring: 1200,
      celebratory: 1200,
      reduced: 0,
    },
    motion_easings: {
      instant: "linear",
      snappy: "ease-out",
      warm: "ease-in-out",
      deliberate: "ease-out",
      reassuring: "ease-in-out",
      celebratory: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      reduced: "linear",
    },
  },
};

// Cache for loaded configuration
let configCache: SigilConfig | null = null;
let configPath: string | null = null;
let configMtime: number | null = null;

/**
 * Find .sigilrc.yaml by walking up from the given directory
 */
function findConfigFile(startDir: string): string | null {
  let currentDir = startDir;

  while (currentDir !== path.dirname(currentDir)) {
    const configFile = path.join(currentDir, ".sigilrc.yaml");
    if (fs.existsSync(configFile)) {
      return configFile;
    }
    currentDir = path.dirname(currentDir);
  }

  return null;
}

/**
 * Load Sigil configuration from .sigilrc.yaml
 *
 * @param cwd - Current working directory to start search from
 * @returns Parsed configuration or default if not found
 */
export function loadConfig(cwd: string = process.cwd()): SigilConfig {
  const foundPath = findConfigFile(cwd);

  if (!foundPath) {
    return DEFAULT_CONFIG;
  }

  // Check cache validity
  if (configPath === foundPath && configCache) {
    try {
      const stats = fs.statSync(foundPath);
      if (configMtime === stats.mtimeMs) {
        return configCache;
      }
    } catch {
      // File might have been deleted, return default
      return DEFAULT_CONFIG;
    }
  }

  // Load and parse config
  try {
    const content = fs.readFileSync(foundPath, "utf-8");
    const parsed = yaml.parse(content) as SigilConfig;

    // Validate required fields
    if (!parsed.zones) {
      parsed.zones = DEFAULT_CONFIG.zones;
    }
    if (!parsed.physics) {
      parsed.physics = DEFAULT_CONFIG.physics;
    }

    // Update cache
    configCache = parsed;
    configPath = foundPath;
    configMtime = fs.statSync(foundPath).mtimeMs;

    return parsed;
  } catch (error) {
    console.warn(
      `[eslint-plugin-sigil] Failed to load ${foundPath}:`,
      error instanceof Error ? error.message : error
    );
    return DEFAULT_CONFIG;
  }
}

/**
 * Get motion constraints for a given motion type
 *
 * @param motion - Motion type name (e.g., 'deliberate', 'snappy')
 * @returns Min/max timing constraints in milliseconds
 */
export function getMotionConstraints(motion: string): MotionConstraints {
  return MOTION_CONSTRAINTS[motion] || MOTION_CONSTRAINTS.warm;
}

/**
 * Get the default timing for a motion type from config
 *
 * @param config - Sigil configuration
 * @param motion - Motion type name
 * @returns Default timing in milliseconds
 */
export function getMotionTiming(config: SigilConfig, motion: string): number {
  return config.physics.motion_timings[motion] ?? 300;
}

/**
 * Clear the configuration cache (useful for testing)
 */
export function clearConfigCache(): void {
  configCache = null;
  configPath = null;
  configMtime = null;
}
