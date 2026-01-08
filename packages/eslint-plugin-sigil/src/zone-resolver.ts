/**
 * Sigil ESLint Plugin - Zone Resolver
 *
 * Resolves file paths to Sigil zones using minimatch patterns.
 * This enables path-based zone detection for ESLint rules.
 *
 * @module zone-resolver
 * @version 4.1.0
 */

import { minimatch } from "minimatch";
import { loadConfig, type SigilConfig, type ZoneConfig } from "./config-loader";

/**
 * Resolved zone information
 */
export interface ResolvedZone {
  /** Zone name (e.g., 'critical', 'admin', 'marketing', 'default') */
  name: string;
  /** Zone configuration */
  config: ZoneConfig;
  /** Motion type for this zone */
  motion: string;
  /** Whether the zone enforces input physics (keyboard nav) */
  requiresInputPhysics: boolean;
}

/**
 * Path patterns for common zone detection
 * These are fallbacks when paths are not defined in .sigilrc.yaml
 */
const DEFAULT_ZONE_PATTERNS: Record<string, string[]> = {
  critical: [
    "**/checkout/**",
    "**/claim/**",
    "**/payment/**",
    "**/transfer/**",
    "**/withdraw/**",
    "**/deposit/**",
    "**/critical/**",
  ],
  admin: [
    "**/admin/**",
    "**/dashboard/**",
    "**/settings/**",
    "**/machinery/**",
  ],
  marketing: [
    "**/marketing/**",
    "**/landing/**",
    "**/showcase/**",
    "**/glass/**",
  ],
};

/**
 * Zones that require input physics (keyboard navigation)
 */
const INPUT_PHYSICS_ZONES = new Set(["admin"]);

/**
 * Resolve a file path to its Sigil zone
 *
 * @param filePath - Absolute or relative file path
 * @param config - Optional Sigil configuration (will load if not provided)
 * @returns Resolved zone information
 */
export function resolveZone(
  filePath: string,
  config?: SigilConfig
): ResolvedZone {
  const sigilConfig = config || loadConfig();

  // Normalize file path for matching
  const normalizedPath = filePath.replace(/\\/g, "/");

  // Check each zone for path match
  for (const [zoneName, zoneConfig] of Object.entries(sigilConfig.zones)) {
    if (zoneName === "default") continue;

    // Check explicit paths from config
    const patterns = zoneConfig.paths || DEFAULT_ZONE_PATTERNS[zoneName] || [];

    for (const pattern of patterns) {
      if (minimatch(normalizedPath, pattern, { dot: true })) {
        return {
          name: zoneName,
          config: zoneConfig,
          motion: zoneConfig.motion || zoneConfig.default_physics?.motion || "warm",
          requiresInputPhysics: INPUT_PHYSICS_ZONES.has(zoneName),
        };
      }
    }
  }

  // Fallback to default zone
  const defaultZone = sigilConfig.zones.default || {
    motion: "warm",
    default_physics: { motion: "warm" },
  };

  return {
    name: "default",
    config: defaultZone,
    motion: defaultZone.motion || defaultZone.default_physics?.motion || "warm",
    requiresInputPhysics: false,
  };
}

/**
 * Check if a file path matches a specific zone
 *
 * @param filePath - File path to check
 * @param zoneName - Zone name to match against
 * @param config - Optional Sigil configuration
 * @returns True if the file is in the specified zone
 */
export function isInZone(
  filePath: string,
  zoneName: string,
  config?: SigilConfig
): boolean {
  const resolved = resolveZone(filePath, config);
  return resolved.name === zoneName;
}

/**
 * Get all zones from configuration
 *
 * @param config - Optional Sigil configuration
 * @returns Map of zone names to their configurations
 */
export function getAllZones(
  config?: SigilConfig
): Record<string, ZoneConfig> {
  const sigilConfig = config || loadConfig();
  return sigilConfig.zones;
}

/**
 * Check if a zone requires input physics (keyboard navigation)
 *
 * @param zoneName - Zone name to check
 * @returns True if the zone requires input physics
 */
export function zoneRequiresInputPhysics(zoneName: string): boolean {
  return INPUT_PHYSICS_ZONES.has(zoneName);
}
