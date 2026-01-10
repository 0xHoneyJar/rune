/**
 * @sigil-tier gold
 * Sigil v7.5 — Sentinel Validator
 *
 * PreToolUse validation against registries.
 * Validates contagion rules and physics compliance.
 * Blocks errors, warns on issues.
 *
 * Performance target: <50ms
 *
 * @module process/sentinel-validator
 */

import * as path from 'path';
import {
  AllRegistriesState,
  RegistryTier,
  getRegistries,
  getTier,
  isImportAllowed,
  ALLOWED_IMPORTS,
} from './registry-parser';
import {
  validatePhysics,
  ValidationResult as PhysicsValidationResult,
  ValidationViolation as PhysicsViolation,
} from './physics-validator';

// =============================================================================
// TYPES
// =============================================================================

/**
 * Validation severity.
 */
export type ValidationSeverity = 'error' | 'warning' | 'info';

/**
 * Validation category.
 */
export type ValidationCategory = 'contagion' | 'physics' | 'nomination' | 'style';

/**
 * A single validation result.
 */
export interface ValidationResult {
  /** Validation category */
  category: ValidationCategory;
  /** Severity level */
  severity: ValidationSeverity;
  /** Human-readable message */
  message: string;
  /** Suggested fix */
  suggestion?: string;
  /** File path if relevant */
  filePath?: string;
  /** Line number if relevant */
  line?: number;
  /** Component name if relevant */
  component?: string;
}

/**
 * Sentinel validation response.
 */
export interface SentinelResponse {
  /** Whether to allow the operation */
  allow: boolean;
  /** All validation results */
  results: ValidationResult[];
  /** Blocking errors (severity: error) */
  errors: ValidationResult[];
  /** Non-blocking warnings */
  warnings: ValidationResult[];
  /** Validation duration in ms */
  durationMs: number;
}

/**
 * Code context for validation.
 */
export interface CodeContext {
  /** File path being written */
  filePath: string;
  /** File content */
  content: string;
  /** Project root */
  projectRoot: string;
}

// =============================================================================
// IMPORT EXTRACTION
// =============================================================================

/**
 * Extract imported component names from code.
 */
export function extractImports(content: string): Array<{
  name: string;
  source: string;
  line: number;
}> {
  const imports: Array<{ name: string; source: string; line: number }> = [];
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Match: import { Name } from '@/gold' or '@/silver' or '@/draft'
    const registryImportMatch = line.match(
      /import\s+\{\s*([^}]+)\s*\}\s+from\s+['"](@\/(?:gold|silver|draft))['"]/
    );
    if (registryImportMatch) {
      const names = registryImportMatch[1]
        .split(',')
        .map(s => s.trim().split(' as ')[0].trim())
        .filter(Boolean);
      const source = registryImportMatch[2];
      for (const name of names) {
        imports.push({ name, source, line: i + 1 });
      }
    }

    // Match: import { Name } from '../gold' or '../silver' or '../draft'
    const relativeImportMatch = line.match(
      /import\s+\{\s*([^}]+)\s*\}\s+from\s+['"](\.\.\/(gold|silver|draft))(?:\/index)?['"]/
    );
    if (relativeImportMatch) {
      const names = relativeImportMatch[1]
        .split(',')
        .map(s => s.trim().split(' as ')[0].trim())
        .filter(Boolean);
      const tier = relativeImportMatch[3];
      for (const name of names) {
        imports.push({ name, source: `@/${tier}`, line: i + 1 });
      }
    }
  }

  return imports;
}

/**
 * Determine the tier of a file based on its path.
 */
export function getFileTier(filePath: string): RegistryTier | null {
  if (filePath.includes('/gold/') || filePath.includes('src/gold')) {
    return 'gold';
  }
  if (filePath.includes('/silver/') || filePath.includes('src/silver')) {
    return 'silver';
  }
  if (filePath.includes('/draft/') || filePath.includes('src/draft')) {
    return 'draft';
  }
  return null;
}

/**
 * Get tier from import source.
 */
export function getTierFromSource(source: string): RegistryTier | null {
  if (source.includes('gold')) return 'gold';
  if (source.includes('silver')) return 'silver';
  if (source.includes('draft')) return 'draft';
  return null;
}

// =============================================================================
// CONTAGION VALIDATION
// =============================================================================

/**
 * Validate contagion rules for a file.
 */
export function validateContagion(
  context: CodeContext,
  registries: AllRegistriesState
): ValidationResult[] {
  const results: ValidationResult[] = [];
  const fileTier = getFileTier(context.filePath);

  // If not in a tier directory, skip contagion check
  if (!fileTier) {
    return results;
  }

  const imports = extractImports(context.content);

  for (const imp of imports) {
    const importTier = getTierFromSource(imp.source);

    if (!importTier) {
      continue;
    }

    // Check if import is allowed
    if (!isImportAllowed(fileTier, importTier)) {
      results.push({
        category: 'contagion',
        severity: 'error',
        message: `Contagion violation: ${fileTier} cannot import from ${importTier}`,
        suggestion: `${fileTier} can only import from: ${ALLOWED_IMPORTS[fileTier].join(', ')}`,
        filePath: context.filePath,
        line: imp.line,
        component: imp.name,
      });
    }
  }

  return results;
}

// =============================================================================
// PHYSICS VALIDATION
// =============================================================================

/**
 * Validate physics for a file.
 */
export function validatePhysicsConstraints(
  context: CodeContext
): ValidationResult[] {
  const results: ValidationResult[] = [];

  // Use existing physics validator
  const physicsResult = validatePhysics(context.content, {
    projectRoot: context.projectRoot,
    checkApi: false, // Skip API checks for now
    checkFidelity: true,
  });

  // Convert physics violations to sentinel results
  for (const violation of physicsResult.violations) {
    results.push({
      category: 'physics',
      severity: violation.severity,
      message: violation.message,
      suggestion: violation.suggestion,
      filePath: context.filePath,
      line: violation.location?.line,
    });
  }

  return results;
}

// =============================================================================
// NOMINATION CHECKS
// =============================================================================

/**
 * Check if a component should be nominated for promotion.
 * This is informational only (warnings/info), never blocking.
 */
export function checkNominationOpportunities(
  context: CodeContext,
  registries: AllRegistriesState
): ValidationResult[] {
  const results: ValidationResult[] = [];

  // Check for components in Draft that might be ready for Silver
  const imports = extractImports(context.content);
  const draftImports = imports.filter(i => getTierFromSource(i.source) === 'draft');

  if (draftImports.length > 0) {
    results.push({
      category: 'nomination',
      severity: 'info',
      message: `Using ${draftImports.length} Draft component(s): ${draftImports.map(i => i.name).join(', ')}`,
      suggestion: 'Consider promoting stable Draft components to Silver',
      filePath: context.filePath,
    });
  }

  return results;
}

// =============================================================================
// MAIN VALIDATOR
// =============================================================================

/**
 * Run all Sentinel validations.
 */
export function validate(context: CodeContext): SentinelResponse {
  const startTime = Date.now();
  const results: ValidationResult[] = [];

  // Load registries
  const registries = getRegistries(context.projectRoot);

  // Run validations
  results.push(...validateContagion(context, registries));
  results.push(...validatePhysicsConstraints(context));
  results.push(...checkNominationOpportunities(context, registries));

  // Separate errors and warnings
  const errors = results.filter(r => r.severity === 'error');
  const warnings = results.filter(r => r.severity === 'warning' || r.severity === 'info');

  const durationMs = Date.now() - startTime;

  return {
    allow: errors.length === 0,
    results,
    errors,
    warnings,
    durationMs,
  };
}

/**
 * Quick validation for PreToolUse hook.
 * Returns simplified response for bash integration.
 */
export function validateForHook(
  filePath: string,
  content: string,
  projectRoot: string = process.cwd()
): {
  allow: boolean;
  reason?: string;
  suggestion?: string;
  warnings?: string[];
} {
  const response = validate({
    filePath,
    content,
    projectRoot,
  });

  if (!response.allow) {
    const firstError = response.errors[0];
    return {
      allow: false,
      reason: firstError.message,
      suggestion: firstError.suggestion,
    };
  }

  const warningMessages = response.warnings
    .filter(w => w.severity === 'warning')
    .map(w => w.message);

  return {
    allow: true,
    warnings: warningMessages.length > 0 ? warningMessages : undefined,
  };
}

// =============================================================================
// REGISTRY-AWARE VALIDATION
// =============================================================================

/**
 * Check if modifying a Gold component without sanctify label.
 */
export function checkGoldModification(
  context: CodeContext,
  registries: AllRegistriesState
): ValidationResult | null {
  // Check if file is a Gold component source
  const fileTier = getFileTier(context.filePath);
  if (fileTier !== 'gold') {
    return null;
  }

  // Check for sanctify label in content
  const hasSanctifyLabel = context.content.includes('@sanctify') ||
    context.content.includes('sanctify:') ||
    context.content.includes('SANCTIFY');

  if (!hasSanctifyLabel) {
    return {
      category: 'contagion',
      severity: 'warning',
      message: 'Modifying Gold component without sanctify label',
      suggestion: 'Add @sanctify comment to preserve Gold status, or component will be demoted to Silver',
      filePath: context.filePath,
    };
  }

  return null;
}

/**
 * Full validation with Gold modification check.
 */
export function validateWithGoldCheck(context: CodeContext): SentinelResponse {
  const startTime = Date.now();
  const results: ValidationResult[] = [];

  // Load registries
  const registries = getRegistries(context.projectRoot);

  // Run standard validations
  results.push(...validateContagion(context, registries));
  results.push(...validatePhysicsConstraints(context));
  results.push(...checkNominationOpportunities(context, registries));

  // Check Gold modification
  const goldCheck = checkGoldModification(context, registries);
  if (goldCheck) {
    results.push(goldCheck);
  }

  // Separate errors and warnings
  const errors = results.filter(r => r.severity === 'error');
  const warnings = results.filter(r => r.severity === 'warning' || r.severity === 'info');

  const durationMs = Date.now() - startTime;

  return {
    allow: errors.length === 0,
    results,
    errors,
    warnings,
    durationMs,
  };
}

// =============================================================================
// EXPORTS FOR HOOK BRIDGE
// =============================================================================

/**
 * Entry point for bash hook.
 */
export function sentinelValidate(
  filePath: string,
  content: string,
  projectRoot?: string
): SentinelResponse {
  return validateWithGoldCheck({
    filePath,
    content,
    projectRoot: projectRoot || process.cwd(),
  });
}
