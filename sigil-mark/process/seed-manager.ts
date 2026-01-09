/**
 * @sigil-tier gold
 * Sigil v6.0 — Seed Manager
 *
 * Manages virtual Sanctuary seeds for cold start projects.
 * Provides design context when no real components exist yet.
 *
 * @module process/seed-manager
 */

import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import {
  Seed,
  SeedId,
  VirtualComponent,
  VirtualComponentQueryResult,
  SEED_OPTIONS,
} from '../types/seed';
import { ComponentTier } from '../types/workshop';

// =============================================================================
// CONSTANTS
// =============================================================================

/**
 * Default path for seed configuration.
 */
export const DEFAULT_SEED_PATH = '.sigil/seed.yaml';

/**
 * Path to seed library.
 */
export const SEED_LIBRARY_PATH = '.claude/skills/seeding-sanctuary/seeds';

// =============================================================================
// SEED LOADING
// =============================================================================

/**
 * Load seed from .sigil/seed.yaml.
 */
export function loadSeed(projectRoot: string = process.cwd()): Seed | null {
  const seedPath = path.join(projectRoot, DEFAULT_SEED_PATH);

  if (!fs.existsSync(seedPath)) {
    return null;
  }

  try {
    const content = fs.readFileSync(seedPath, 'utf-8');
    return yaml.load(content) as Seed;
  } catch {
    return null;
  }
}

/**
 * Load seed from library by ID.
 */
export function loadSeedFromLibrary(
  seedId: SeedId,
  projectRoot: string = process.cwd()
): Seed | null {
  const libraryPath = path.join(projectRoot, SEED_LIBRARY_PATH, `${seedId}.yaml`);

  if (!fs.existsSync(libraryPath)) {
    return null;
  }

  try {
    const content = fs.readFileSync(libraryPath, 'utf-8');
    return yaml.load(content) as Seed;
  } catch {
    return null;
  }
}

/**
 * Save seed to .sigil/seed.yaml.
 */
export function saveSeed(seed: Seed, projectRoot: string = process.cwd()): boolean {
  const seedPath = path.join(projectRoot, DEFAULT_SEED_PATH);
  const sigilDir = path.dirname(seedPath);

  try {
    if (!fs.existsSync(sigilDir)) {
      fs.mkdirSync(sigilDir, { recursive: true });
    }
    fs.writeFileSync(seedPath, yaml.dump(seed), 'utf-8');
    return true;
  } catch {
    return false;
  }
}

/**
 * Select and save a seed from the library.
 */
export function selectSeed(
  seedId: SeedId,
  projectRoot: string = process.cwd()
): boolean {
  const seed = loadSeedFromLibrary(seedId, projectRoot);
  if (!seed) {
    return false;
  }
  return saveSeed(seed, projectRoot);
}

// =============================================================================
// SANCTUARY DETECTION
// =============================================================================

/**
 * Check if Sanctuary is empty (no real components).
 */
export function isSanctuaryEmpty(projectRoot: string = process.cwd()): boolean {
  const sanctuaryPaths = [
    path.join(projectRoot, 'src/sanctuary'),
    path.join(projectRoot, 'src/components'),
  ];

  for (const sanctuaryPath of sanctuaryPaths) {
    if (fs.existsSync(sanctuaryPath)) {
      // Check for any .tsx files with @sigil-tier pragma
      const hasComponents = checkForSigilComponents(sanctuaryPath);
      if (hasComponents) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Recursively check for Sigil components.
 */
function checkForSigilComponents(dir: string): boolean {
  if (!fs.existsSync(dir)) {
    return false;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (checkForSigilComponents(fullPath)) {
        return true;
      }
    } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
      try {
        const content = fs.readFileSync(fullPath, 'utf-8');
        if (content.includes('@sigil-tier')) {
          return true;
        }
      } catch {
        // Skip unreadable files
      }
    }
  }

  return false;
}

// =============================================================================
// VIRTUAL COMPONENT QUERIES
// =============================================================================

/**
 * In-memory cache for faded components.
 */
const fadedComponents = new Set<string>();

/**
 * Mark a virtual component as faded (real exists).
 */
export function markAsFaded(componentName: string): void {
  fadedComponents.add(componentName);
}

/**
 * Check if a virtual component is faded.
 */
export function isFaded(componentName: string): boolean {
  return fadedComponents.has(componentName);
}

/**
 * Clear faded components cache.
 */
export function clearFadedCache(): void {
  fadedComponents.clear();
}

/**
 * Query virtual component from seed.
 */
export function queryVirtualComponent(
  seed: Seed,
  componentName: string
): VirtualComponentQueryResult {
  const component = seed.virtual_components[componentName];

  if (!component) {
    return {
      found: false,
      data: null,
      source: 'seed',
      faded: false,
    };
  }

  const faded = isFaded(componentName);

  return {
    found: true,
    data: component,
    source: 'seed',
    faded,
  };
}

/**
 * Get all virtual components from seed.
 */
export function getAllVirtualComponents(
  seed: Seed,
  includeFaded: boolean = false
): Array<{ name: string; component: VirtualComponent }> {
  const components: Array<{ name: string; component: VirtualComponent }> = [];

  for (const [name, component] of Object.entries(seed.virtual_components)) {
    if (includeFaded || !isFaded(name)) {
      components.push({ name, component });
    }
  }

  return components;
}

/**
 * Find virtual components by tier.
 */
export function findVirtualByTier(
  seed: Seed,
  tier: ComponentTier
): string[] {
  return Object.entries(seed.virtual_components)
    .filter(([name, comp]) => comp.tier === tier && !isFaded(name))
    .map(([name]) => name);
}

/**
 * Find virtual components by zone.
 */
export function findVirtualByZone(
  seed: Seed,
  zone: string
): string[] {
  return Object.entries(seed.virtual_components)
    .filter(([name, comp]) => comp.zone === zone && !isFaded(name))
    .map(([name]) => name);
}

/**
 * Find virtual components by vocabulary.
 */
export function findVirtualByVocabulary(
  seed: Seed,
  term: string
): string[] {
  return Object.entries(seed.virtual_components)
    .filter(
      ([name, comp]) =>
        comp.vocabulary.some(v => v.toLowerCase().includes(term.toLowerCase())) &&
        !isFaded(name)
    )
    .map(([name]) => name);
}

// =============================================================================
// SEED METADATA
// =============================================================================

/**
 * Get physics profile for zone from seed.
 */
export function getSeedPhysics(seed: Seed, zone: string): string {
  switch (zone) {
    case 'critical':
      return seed.physics.critical;
    case 'marketing':
      return seed.physics.marketing;
    case 'admin':
      return seed.physics.admin || seed.physics.default;
    default:
      return seed.physics.default;
  }
}

/**
 * Get material color from seed.
 */
export function getSeedMaterial(
  seed: Seed,
  key: keyof typeof seed.materials
): string | undefined {
  return seed.materials[key];
}

/**
 * Get typography setting from seed.
 */
export function getSeedTypography(
  seed: Seed,
  key: keyof typeof seed.typography
): string | number | undefined {
  return seed.typography[key];
}

/**
 * Get spacing value from seed.
 */
export function getSeedSpacing(seed: Seed, index: number): number {
  if (index < 0 || index >= seed.spacing.scale.length) {
    return seed.spacing.scale[0];
  }
  return seed.spacing.scale[index];
}

// =============================================================================
// INTEGRATION
// =============================================================================

/**
 * Check if seed is needed and load it.
 */
export function ensureSeedContext(
  projectRoot: string = process.cwd()
): { useSeed: boolean; seed: Seed | null; reason?: string } {
  // Check if Sanctuary has real components
  if (!isSanctuaryEmpty(projectRoot)) {
    return { useSeed: false, seed: null, reason: 'Sanctuary has real components' };
  }

  // Try to load existing seed
  const seed = loadSeed(projectRoot);
  if (seed) {
    return { useSeed: true, seed };
  }

  // No seed selected yet
  return { useSeed: false, seed: null, reason: 'No seed selected' };
}

/**
 * Get available seed options for selection UI.
 */
export function getSeedOptions(): typeof SEED_OPTIONS {
  return SEED_OPTIONS;
}
