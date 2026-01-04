/**
 * useZone Hook
 *
 * React hook for detecting and managing zone state based on file paths.
 * Matches current path against zone configuration to determine active zone.
 */

import { useState, useCallback, useMemo } from 'react';
import type { ZoneConfig, UseZoneResult } from '../types.js';

/**
 * Default zone configurations.
 * These would normally be loaded from zones.yaml.
 */
const DEFAULT_ZONES: ZoneConfig[] = [
  {
    name: 'critical',
    paths: ['**/checkout/**', '**/payment/**', '**/claim/**'],
    material: 'clay',
    motion: 'deliberate',
  },
  {
    name: 'transactional',
    paths: ['**/cart/**', '**/inventory/**', '**/trade/**'],
    material: 'machinery',
    motion: 'snappy',
  },
  {
    name: 'marketing',
    paths: ['**/landing/**', '**/marketing/**', '**/promo/**'],
    material: 'glass',
    motion: 'playful',
  },
  {
    name: 'default',
    paths: ['**/*'],
    material: 'clay',
    motion: 'deliberate',
  },
];

/**
 * Simple glob pattern matching.
 * Supports ** (any path) and * (any segment).
 */
function matchPath(pattern: string, path: string): boolean {
  // Convert glob to regex
  const regexPattern = pattern
    .replace(/\*\*/g, '.*')
    .replace(/\*/g, '[^/]*')
    .replace(/\//g, '\\/');

  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(path);
}

/**
 * Find the best matching zone for a path.
 */
function findZone(path: string, zones: ZoneConfig[]): ZoneConfig | null {
  // Sort by specificity (fewer wildcards = more specific)
  const sortedZones = [...zones].sort((a, b) => {
    const aWildcards = a.paths.join('').match(/\*/g)?.length ?? 0;
    const bWildcards = b.paths.join('').match(/\*/g)?.length ?? 0;
    return aWildcards - bWildcards;
  });

  for (const zone of sortedZones) {
    for (const pattern of zone.paths) {
      if (matchPath(pattern, path)) {
        return zone;
      }
    }
  }

  return null;
}

/**
 * Hook to detect and manage zone state.
 *
 * @param currentPath - The current file path to detect zone for
 * @param zones - Optional custom zone configurations
 * @returns Zone state and detection controls
 *
 * @example
 * ```tsx
 * function ZoneDisplay() {
 *   const { zone, zoneName } = useZone('/src/features/checkout/Button.tsx');
 *
 *   return (
 *     <div>
 *       Zone: {zoneName}
 *       Material: {zone?.material}
 *     </div>
 *   );
 * }
 * ```
 */
export function useZone(
  currentPath: string = '',
  zones: ZoneConfig[] = DEFAULT_ZONES
): UseZoneResult {
  const [path, setPath] = useState(currentPath);
  const [isLoading, setIsLoading] = useState(false);

  // Find zone for current path
  const zone = useMemo(() => findZone(path, zones), [path, zones]);

  // Zone name (fallback to 'default')
  const zoneName = zone?.name ?? 'default';

  // Detect zone for a new path
  const detectZone = useCallback((newPath: string) => {
    setIsLoading(true);
    // Simulate async detection (in real implementation, might load from file)
    requestAnimationFrame(() => {
      setPath(newPath);
      setIsLoading(false);
    });
  }, []);

  return {
    zone,
    zoneName,
    isLoading,
    detectZone,
  };
}

/**
 * Get zone for a path (non-hook version).
 */
export function getZoneForPath(
  path: string,
  zones: ZoneConfig[] = DEFAULT_ZONES
): ZoneConfig | null {
  return findZone(path, zones);
}

export default useZone;
