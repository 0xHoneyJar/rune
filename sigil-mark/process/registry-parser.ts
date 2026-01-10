/**
 * @sigil-tier gold
 * Sigil v7.5 — Registry Parser
 *
 * Parses Gold/Silver/Draft registry files to extract exports and annotations.
 * Used by Sentinel validator and nomination generator.
 *
 * Performance target: <5ms per registry
 *
 * @module process/registry-parser
 */

import * as fs from 'fs';
import * as path from 'path';

// =============================================================================
// TYPES
// =============================================================================

/**
 * Registry tier.
 */
export type RegistryTier = 'gold' | 'silver' | 'draft';

/**
 * Parsed export from a registry.
 */
export interface RegistryExport {
  /** Export name */
  name: string;
  /** Source path (from '../components/...' or '../...' pattern) */
  sourcePath: string;
  /** Zone annotation if present */
  zone?: string;
  /** Physics annotation if present */
  physics?: string;
  /** Whether this is a type export */
  isType: boolean;
}

/**
 * Registry file state.
 */
export interface RegistryState {
  /** Registry tier */
  tier: RegistryTier;
  /** Path to registry file */
  path: string;
  /** Whether file exists */
  exists: boolean;
  /** Parse timestamp */
  parsedAt: string;
  /** Exports from this registry */
  exports: RegistryExport[];
  /** File-level annotations */
  annotations: {
    zone?: string;
    physics?: string;
  };
  /** Parse errors if any */
  errors: string[];
}

/**
 * Combined state of all registries.
 */
export interface AllRegistriesState {
  gold: RegistryState;
  silver: RegistryState;
  draft: RegistryState;
  /** All export names by tier for quick lookup */
  exportsByTier: {
    gold: Set<string>;
    silver: Set<string>;
    draft: Set<string>;
  };
}

// =============================================================================
// PARSING
// =============================================================================

/**
 * Extract exports from registry file content.
 */
export function parseExports(content: string): RegistryExport[] {
  const exports: RegistryExport[] = [];

  // Match: export { Name } from '../path';
  // Match: export { Name as Alias } from '../path';
  const namedExportRegex = /export\s+\{\s*(\w+)(?:\s+as\s+\w+)?\s*\}\s+from\s+['"]([^'"]+)['"]/g;
  let match;

  while ((match = namedExportRegex.exec(content)) !== null) {
    exports.push({
      name: match[1],
      sourcePath: match[2],
      isType: false,
    });
  }

  // Match: export type { Name } from '../path';
  const typeExportRegex = /export\s+type\s+\{\s*(\w+)(?:\s+as\s+\w+)?\s*\}\s+from\s+['"]([^'"]+)['"]/g;

  while ((match = typeExportRegex.exec(content)) !== null) {
    exports.push({
      name: match[1],
      sourcePath: match[2],
      isType: true,
    });
  }

  return exports;
}

/**
 * Extract annotations from comments.
 */
export function parseAnnotations(content: string): { zone?: string; physics?: string } {
  const annotations: { zone?: string; physics?: string } = {};

  // Match @sigil-zone annotation
  const zoneMatch = content.match(/@sigil-zone\s+(\w+)/);
  if (zoneMatch) {
    annotations.zone = zoneMatch[1];
  }

  // Match @sigil-physics annotation
  const physicsMatch = content.match(/@sigil-physics\s+(\w+)/);
  if (physicsMatch) {
    annotations.physics = physicsMatch[1];
  }

  return annotations;
}

/**
 * Extract zone from comment above an export.
 * Looks for zone comment within 3 lines above the export.
 */
export function extractExportAnnotations(
  content: string,
  exportName: string
): { zone?: string; physics?: string } {
  const lines = content.split('\n');
  const annotations: { zone?: string; physics?: string } = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check if this line contains the export
    if (line.includes(`export`) && line.includes(exportName)) {
      // Look at preceding 3 lines for annotations
      for (let j = Math.max(0, i - 3); j < i; j++) {
        const commentLine = lines[j];

        const zoneMatch = commentLine.match(/@sigil-zone\s+(\w+)/);
        if (zoneMatch) {
          annotations.zone = zoneMatch[1];
        }

        const physicsMatch = commentLine.match(/@sigil-physics\s+(\w+)/);
        if (physicsMatch) {
          annotations.physics = physicsMatch[1];
        }
      }
      break;
    }
  }

  return annotations;
}

/**
 * Parse a single registry file.
 */
export function parseRegistry(
  filePath: string,
  tier: RegistryTier
): RegistryState {
  const state: RegistryState = {
    tier,
    path: filePath,
    exists: false,
    parsedAt: new Date().toISOString(),
    exports: [],
    annotations: {},
    errors: [],
  };

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    state.errors.push(`Registry file not found: ${filePath}`);
    return state;
  }

  state.exists = true;

  try {
    const content = fs.readFileSync(filePath, 'utf-8');

    // Parse file-level annotations
    state.annotations = parseAnnotations(content);

    // Parse exports
    const rawExports = parseExports(content);

    // Enrich exports with per-export annotations
    state.exports = rawExports.map(exp => ({
      ...exp,
      ...extractExportAnnotations(content, exp.name),
    }));
  } catch (error) {
    state.errors.push(`Failed to parse registry: ${error}`);
  }

  return state;
}

// =============================================================================
// REGISTRY DISCOVERY
// =============================================================================

/**
 * Default registry paths relative to project root.
 */
export const DEFAULT_REGISTRY_PATHS = {
  gold: 'src/gold/index.ts',
  silver: 'src/silver/index.ts',
  draft: 'src/draft/index.ts',
} as const;

/**
 * Get registry file path.
 */
export function getRegistryPath(
  projectRoot: string,
  tier: RegistryTier
): string {
  return path.join(projectRoot, DEFAULT_REGISTRY_PATHS[tier]);
}

/**
 * Parse all registries.
 */
export function parseAllRegistries(projectRoot: string): AllRegistriesState {
  const gold = parseRegistry(getRegistryPath(projectRoot, 'gold'), 'gold');
  const silver = parseRegistry(getRegistryPath(projectRoot, 'silver'), 'silver');
  const draft = parseRegistry(getRegistryPath(projectRoot, 'draft'), 'draft');

  // Build quick lookup sets
  const exportsByTier = {
    gold: new Set(gold.exports.filter(e => !e.isType).map(e => e.name)),
    silver: new Set(silver.exports.filter(e => !e.isType).map(e => e.name)),
    draft: new Set(draft.exports.filter(e => !e.isType).map(e => e.name)),
  };

  return {
    gold,
    silver,
    draft,
    exportsByTier,
  };
}

// =============================================================================
// QUERIES
// =============================================================================

/**
 * Check if a component is in a specific tier.
 */
export function isInTier(
  registries: AllRegistriesState,
  componentName: string,
  tier: RegistryTier
): boolean {
  return registries.exportsByTier[tier].has(componentName);
}

/**
 * Get the tier of a component.
 */
export function getTier(
  registries: AllRegistriesState,
  componentName: string
): RegistryTier | null {
  if (registries.exportsByTier.gold.has(componentName)) return 'gold';
  if (registries.exportsByTier.silver.has(componentName)) return 'silver';
  if (registries.exportsByTier.draft.has(componentName)) return 'draft';
  return null;
}

/**
 * Get all components in a tier.
 */
export function getComponentsInTier(
  registries: AllRegistriesState,
  tier: RegistryTier
): string[] {
  return Array.from(registries.exportsByTier[tier]);
}

/**
 * Get export details for a component.
 */
export function getExportDetails(
  registries: AllRegistriesState,
  componentName: string
): RegistryExport | null {
  for (const tier of ['gold', 'silver', 'draft'] as RegistryTier[]) {
    const exp = registries[tier].exports.find(e => e.name === componentName);
    if (exp) return exp;
  }
  return null;
}

// =============================================================================
// CONTAGION CHECKS
// =============================================================================

/**
 * Allowed import tiers for each tier.
 */
export const ALLOWED_IMPORTS: Record<RegistryTier, RegistryTier[]> = {
  gold: ['gold'],
  silver: ['gold', 'silver'],
  draft: ['gold', 'silver', 'draft'],
};

/**
 * Check if an import is allowed based on contagion rules.
 */
export function isImportAllowed(
  fromTier: RegistryTier,
  toTier: RegistryTier
): boolean {
  return ALLOWED_IMPORTS[fromTier].includes(toTier);
}

/**
 * Validate imports in a file against contagion rules.
 */
export function validateContagion(
  registries: AllRegistriesState,
  fileTier: RegistryTier,
  importedComponents: string[]
): Array<{ component: string; tier: RegistryTier; allowed: boolean }> {
  return importedComponents.map(component => {
    const tier = getTier(registries, component);
    if (!tier) {
      // Unknown component, allow (might be external)
      return { component, tier: 'draft' as RegistryTier, allowed: true };
    }
    return {
      component,
      tier,
      allowed: isImportAllowed(fileTier, tier),
    };
  });
}

// =============================================================================
// CACHE
// =============================================================================

let cachedRegistries: AllRegistriesState | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL_MS = 5000; // 5 seconds

/**
 * Get registries with caching.
 */
export function getRegistries(
  projectRoot: string,
  forceRefresh = false
): AllRegistriesState {
  const now = Date.now();

  if (!forceRefresh && cachedRegistries && (now - cacheTimestamp) < CACHE_TTL_MS) {
    return cachedRegistries;
  }

  cachedRegistries = parseAllRegistries(projectRoot);
  cacheTimestamp = now;
  return cachedRegistries;
}

/**
 * Clear registry cache.
 */
export function clearRegistryCache(): void {
  cachedRegistries = null;
  cacheTimestamp = 0;
}
