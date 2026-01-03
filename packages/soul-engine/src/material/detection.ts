/**
 * Zone Detection
 *
 * Maps file paths to materials based on zone configuration.
 * Supports glob pattern matching for flexible zone definitions.
 */

import type { MaterialType } from './types.js';
import type { ZoneConfig, SigilConfig } from '../lib/config.js';

/**
 * Detection result with material and zone info
 */
export interface MaterialDetectionResult {
  /** Detected material type */
  material: MaterialType;

  /** Zone name if detected, null for default */
  zone: string | null;

  /** Sync strategy from zone config */
  sync: string | null;

  /** Whether this is a default fallback */
  isDefault: boolean;
}

/**
 * Cached zone-to-regex mappings
 */
const zoneRegexCache = new WeakMap<ZoneConfig, RegExp[]>();

/**
 * Convert glob pattern to regex
 * Supports ** (any path) and * (single segment)
 */
function globToRegex(pattern: string): RegExp {
  const escaped = pattern
    .replace(/[.+^${}()|[\]\\]/g, '\\$&') // Escape special regex chars
    .replace(/\*\*/g, '<<DOUBLE_STAR>>') // Temporary placeholder
    .replace(/\*/g, '[^/]*') // Single star = any within segment
    .replace(/<<DOUBLE_STAR>>/g, '.*'); // Double star = any path

  return new RegExp(`^${escaped}$`);
}

/**
 * Get or create regex patterns for a zone
 */
function getZoneRegexes(zone: ZoneConfig): RegExp[] {
  if (zoneRegexCache.has(zone)) {
    return zoneRegexCache.get(zone)!;
  }

  const regexes = zone.paths.map(globToRegex);
  zoneRegexCache.set(zone, regexes);
  return regexes;
}

/**
 * Check if a file path matches a zone
 */
function matchesZone(zone: ZoneConfig, filePath: string): boolean {
  const regexes = getZoneRegexes(zone);
  return regexes.some(regex => regex.test(filePath));
}

/**
 * Detect material from file path using config zones
 *
 * @param config - Sigil configuration with zones
 * @param filePath - File path to check
 * @returns Detection result with material and zone info
 *
 * @example
 * ```ts
 * const result = detectMaterial(config, 'src/features/checkout/Button.tsx');
 * // { material: 'clay', zone: 'critical', sync: 'server_tick', isDefault: false }
 * ```
 */
export function detectMaterial(
  config: SigilConfig,
  filePath: string
): MaterialDetectionResult {
  // Normalize path separators
  const normalizedPath = filePath.replace(/\\/g, '/');

  // Check each zone
  for (const zone of config.zones) {
    if (matchesZone(zone, normalizedPath)) {
      return {
        material: zone.material,
        zone: zone.name,
        sync: zone.sync,
        isDefault: false,
      };
    }
  }

  // Default fallback to clay
  return {
    material: 'clay',
    zone: null,
    sync: null,
    isDefault: true,
  };
}

/**
 * Get zone by name from config
 */
export function getZoneByName(
  config: SigilConfig,
  zoneName: string
): ZoneConfig | null {
  return config.zones.find(z => z.name === zoneName) ?? null;
}

/**
 * Get material for a zone name
 */
export function getMaterialForZone(
  config: SigilConfig,
  zoneName: string
): MaterialType {
  const zone = getZoneByName(config, zoneName);
  return zone?.material ?? 'clay';
}

/**
 * List all zones with their materials
 */
export function listZoneMaterials(
  config: SigilConfig
): Array<{ zone: string; material: MaterialType; paths: string[] }> {
  return config.zones.map(zone => ({
    zone: zone.name,
    material: zone.material,
    paths: zone.paths,
  }));
}

/**
 * Validate zone configuration
 * Returns array of validation errors
 */
export function validateZoneConfig(
  zones: ZoneConfig[]
): string[] {
  const errors: string[] = [];
  const zoneNames = new Set<string>();

  for (const zone of zones) {
    // Check for duplicate zone names
    if (zoneNames.has(zone.name)) {
      errors.push(`Duplicate zone name: "${zone.name}"`);
    }
    zoneNames.add(zone.name);

    // Check for valid material
    const validMaterials = ['glass', 'clay', 'machinery'];
    if (!validMaterials.includes(zone.material)) {
      errors.push(
        `Invalid material "${zone.material}" for zone "${zone.name}". ` +
        `Valid materials: ${validMaterials.join(', ')}`
      );
    }

    // Check for empty paths
    if (zone.paths.length === 0) {
      errors.push(`Zone "${zone.name}" has no paths defined`);
    }

    // Validate path patterns
    for (const path of zone.paths) {
      if (!path || typeof path !== 'string') {
        errors.push(`Invalid path in zone "${zone.name}": ${path}`);
      }
    }
  }

  return errors;
}

/**
 * Check for overlapping zones
 * Returns pairs of zones that might conflict
 */
export function findOverlappingZones(
  zones: ZoneConfig[]
): Array<[string, string, string]> {
  const overlaps: Array<[string, string, string]> = [];

  for (let i = 0; i < zones.length; i++) {
    for (let j = i + 1; j < zones.length; j++) {
      const zone1 = zones[i];
      const zone2 = zones[j];

      // Check if any paths might overlap
      for (const path1 of zone1.paths) {
        for (const path2 of zone2.paths) {
          if (patternsCouldOverlap(path1, path2)) {
            overlaps.push([zone1.name, zone2.name, `${path1} <-> ${path2}`]);
          }
        }
      }
    }
  }

  return overlaps;
}

/**
 * Simple check if two glob patterns could match the same path
 */
function patternsCouldOverlap(pattern1: string, pattern2: string): boolean {
  // If one pattern is a prefix of the other with **, they might overlap
  const base1 = pattern1.replace(/\*\*.*$/, '');
  const base2 = pattern2.replace(/\*\*.*$/, '');

  return base1.startsWith(base2) || base2.startsWith(base1);
}
