/**
 * @sigil-tier gold
 * Sigil v6.0 — Workshop Index Types
 *
 * Type definitions for the pre-computed workshop index.
 * Workshop provides 5ms lookups for framework APIs and component signatures.
 *
 * @module types/workshop
 */

// =============================================================================
// WORKSHOP INDEX
// =============================================================================

/**
 * The main Workshop index structure.
 * Pre-computed index for fast lookups (target: <5ms).
 *
 * Stored at: .sigil/workshop.json
 */
export interface Workshop {
  // Metadata
  /** ISO timestamp of last indexing */
  indexed_at: string;
  /** MD5 hash of package.json for staleness detection */
  package_hash: string;
  /** MD5 hash of .sigil/imports.yaml for staleness detection */
  imports_hash: string;

  // Framework materials (from node_modules)
  /** Map of package name to material entry */
  materials: Record<string, MaterialEntry>;

  // Sanctuary components (from src/)
  /** Map of component name to component entry */
  components: Record<string, ComponentEntry>;

  // Physics definitions (from sigil.yaml)
  /** Map of physics name to definition */
  physics: Record<string, PhysicsDefinition>;

  // Zone definitions (from sigil.yaml)
  /** Map of zone name to definition */
  zones: Record<string, ZoneDefinition>;
}

// =============================================================================
// MATERIAL ENTRY
// =============================================================================

/**
 * Entry for a framework/library material in the workshop.
 * Extracted from node_modules.
 */
export interface MaterialEntry {
  /** Package version */
  version: string;
  /** Exported names from the package */
  exports: string[];
  /** Whether TypeScript types are available */
  types_available: boolean;
  /** Whether README.md exists */
  readme_available: boolean;
  /** Optional type signatures for key exports */
  signatures?: Record<string, string>;
}

// =============================================================================
// COMPONENT ENTRY
// =============================================================================

/**
 * Tier classification for Sanctuary components.
 */
export type ComponentTier = 'gold' | 'silver' | 'bronze' | 'draft';

/**
 * Entry for a Sanctuary component in the workshop.
 * Extracted from src/sanctuary/ via JSDoc pragmas.
 */
export interface ComponentEntry {
  /** File path relative to project root */
  path: string;
  /** Component tier (gold/silver/bronze/draft) */
  tier: ComponentTier;
  /** Optional zone assignment */
  zone?: string;
  /** Optional physics assignment */
  physics?: string;
  /** Vocabulary terms this component handles */
  vocabulary?: string[];
  /** Package imports used by this component */
  imports: string[];
}

// =============================================================================
// PHYSICS DEFINITION
// =============================================================================

/**
 * Physics definition from sigil.yaml.
 * Defines timing and easing for a physics profile.
 */
export interface PhysicsDefinition {
  /** Timing value (e.g., "150ms", "800ms") */
  timing: string;
  /** Easing function (e.g., "ease-out", "cubic-bezier(...)") */
  easing: string;
  /** Human-readable description */
  description: string;
}

// =============================================================================
// ZONE DEFINITION
// =============================================================================

/**
 * Zone definition from sigil.yaml.
 * Defines physics and timing for a zone.
 */
export interface ZoneDefinition {
  /** Physics profile to use in this zone */
  physics: string;
  /** Default timing for this zone */
  timing: string;
  /** Human-readable description */
  description: string;
}

// =============================================================================
// QUERY TYPES
// =============================================================================

/**
 * Query type for workshop lookups.
 */
export type WorkshopQueryType = 'material' | 'component' | 'physics' | 'zone';

/**
 * Query request for workshop.
 */
export interface WorkshopQuery {
  /** Type of query */
  type: WorkshopQueryType;
  /** Key to look up */
  key: string;
}

/**
 * Source of query result.
 */
export type WorkshopSource = 'workshop' | 'seed' | 'fallback';

/**
 * Result from a workshop query.
 */
export interface WorkshopQueryResult<T = unknown> {
  /** Whether the query found a result */
  found: boolean;
  /** The result data (if found) */
  data: T | null;
  /** Source of the result */
  source: WorkshopSource;
}

// =============================================================================
// BUILDER TYPES
// =============================================================================

/**
 * Options for building the workshop index.
 */
export interface WorkshopBuilderOptions {
  /** Project root directory */
  projectRoot: string;
  /** Path to package.json */
  packageJsonPath?: string;
  /** Path to .sigil/imports.yaml */
  importsPath?: string;
  /** Path to sigil.yaml */
  sigilConfigPath?: string;
  /** Path to src/sanctuary/ */
  sanctuaryPath?: string;
  /** Output path for workshop.json */
  outputPath?: string;
  /** Whether to include type signatures */
  includeSignatures?: boolean;
  /** Maximum number of signatures per package */
  maxSignaturesPerPackage?: number;
}

/**
 * Result from workshop build operation.
 */
export interface WorkshopBuildResult {
  /** Whether build succeeded */
  success: boolean;
  /** Path to output file */
  outputPath: string;
  /** Number of materials indexed */
  materialCount: number;
  /** Number of components indexed */
  componentCount: number;
  /** Build duration in milliseconds */
  durationMs: number;
  /** Any warnings during build */
  warnings: string[];
  /** Error if build failed */
  error?: Error;
}

/**
 * Staleness check result.
 */
export interface WorkshopStalenessResult {
  /** Whether workshop is stale */
  stale: boolean;
  /** Reason for staleness */
  reason?: 'package_changed' | 'imports_changed' | 'missing' | 'corrupted';
  /** Current package hash */
  currentPackageHash: string;
  /** Current imports hash */
  currentImportsHash: string;
  /** Stored package hash */
  storedPackageHash?: string;
  /** Stored imports hash */
  storedImportsHash?: string;
}

// =============================================================================
// EXPORTS
// =============================================================================

/**
 * Default workshop builder options.
 */
export const DEFAULT_WORKSHOP_OPTIONS: Partial<WorkshopBuilderOptions> = {
  packageJsonPath: 'package.json',
  importsPath: '.sigil/imports.yaml',
  sigilConfigPath: 'sigil.yaml',
  sanctuaryPath: 'src/sanctuary',
  outputPath: '.sigil/workshop.json',
  includeSignatures: true,
  maxSignaturesPerPackage: 10,
};

/**
 * Empty workshop for initialization.
 */
export const EMPTY_WORKSHOP: Workshop = {
  indexed_at: '',
  package_hash: '',
  imports_hash: '',
  materials: {},
  components: {},
  physics: {},
  zones: {},
};
