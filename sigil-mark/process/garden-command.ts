// AGENT-ONLY: Do not import in browser code
// This module uses Node.js fs and will crash in browser environments.

/**
 * Garden Command Handler
 *
 * @sigil-tier gold
 * @sigil-zone machinery
 * @server-only
 *
 * System health check that runs all audits:
 * - Auditing Cohesion (visual drift)
 * - Simulating Interaction (timing verification)
 * - Status Propagation (tier consistency)
 * - Violation Scanning (fidelity ceiling)
 *
 * Usage:
 * - /garden - Run all audits
 * - /garden --drift - Focus on visual drift only
 *
 * @module process/garden-command
 */

import { scanFiles, formatViolations, formatSummary, type ScanResult } from './violation-scanner';
import { scanStatusPropagation, formatPropagationSummary, type StatusAnalysis } from './status-propagation';
import { findAllSigilComponents, parsePragmas, type ComponentMatch } from './component-scanner';

// =============================================================================
// TYPES
// =============================================================================

/** Severity level for issues */
export type IssueSeverity = 'error' | 'warning' | 'info';

/** A single issue in the garden report */
export interface GardenIssue {
  category: 'cohesion' | 'timing' | 'propagation' | 'fidelity';
  severity: IssueSeverity;
  file: string;
  line?: number;
  message: string;
  suggestion?: string;
}

/** Options for the garden command */
export interface GardenOptions {
  /** Focus on visual drift only */
  drift?: boolean;
  /** Include timing checks */
  timing?: boolean;
  /** Check status propagation */
  propagation?: boolean;
  /** Base path for scanning */
  basePath?: string;
}

/** Result of the garden command */
export interface GardenResult {
  /** Total components scanned */
  componentCount: number;
  /** Issues by severity */
  issues: GardenIssue[];
  /** Count by severity */
  errorCount: number;
  warningCount: number;
  infoCount: number;
  /** Health score (0-100) */
  healthScore: number;
  /** Scan timestamp */
  timestamp: Date;
}

// =============================================================================
// GARDEN COMMAND
// =============================================================================

/**
 * Run full garden health check
 *
 * @example
 * ```typescript
 * import { garden } from 'sigil-mark/process';
 *
 * const result = await garden();
 * console.log(`Health: ${result.healthScore}%`);
 * console.log(`Issues: ${result.issues.length}`);
 * ```
 */
export async function garden(options: GardenOptions = {}): Promise<GardenResult> {
  const basePath = options.basePath || process.cwd();
  const issues: GardenIssue[] = [];

  // 1. Find all Sigil components
  const components = findAllSigilComponents(basePath);
  const componentCount = components.length;

  // 2. Run fidelity violation scan
  const filePaths = components.map(c => c.path);
  const scanResults = scanFiles(filePaths, basePath);

  for (const result of scanResults) {
    for (const violation of result.violations) {
      issues.push({
        category: 'fidelity',
        severity: violation.severity,
        file: result.file,
        line: violation.line,
        message: violation.message,
        suggestion: violation.suggestion,
      });
    }
  }

  // 3. Run status propagation check (unless drift-only)
  if (!options.drift && options.propagation !== false) {
    const propagationIssues = scanStatusPropagation(basePath);
    for (const analysis of propagationIssues) {
      if (analysis.downgrade) {
        for (const warning of analysis.warnings) {
          issues.push({
            category: 'propagation',
            severity: 'warning',
            file: analysis.file,
            message: warning,
            suggestion: `Consider upgrading dependencies or downgrading declared tier`,
          });
        }
      }
    }
  }

  // 4. Run timing analysis (static patterns only)
  if (!options.drift && options.timing !== false) {
    for (const component of components) {
      const timingIssues = analyzeTimingPatterns(component);
      issues.push(...timingIssues);
    }
  }

  // Calculate counts
  const errorCount = issues.filter(i => i.severity === 'error').length;
  const warningCount = issues.filter(i => i.severity === 'warning').length;
  const infoCount = issues.filter(i => i.severity === 'info').length;

  // Calculate health score
  // 100 - (errors * 10 + warnings * 2 + info * 0.5), min 0
  const healthScore = Math.max(0, Math.round(
    100 - (errorCount * 10 + warningCount * 2 + infoCount * 0.5)
  ));

  return {
    componentCount,
    issues,
    errorCount,
    warningCount,
    infoCount,
    healthScore,
    timestamp: new Date(),
  };
}

/**
 * Run drift-focused garden check (visual only)
 *
 * @example
 * ```typescript
 * import { gardenDrift } from 'sigil-mark/process';
 *
 * const result = await gardenDrift();
 * console.log(formatGardenResult(result));
 * ```
 */
export function gardenDrift(basePath?: string): Promise<GardenResult> {
  return garden({
    drift: true,
    timing: false,
    propagation: false,
    basePath,
  });
}

// =============================================================================
// TIMING PATTERN ANALYSIS
// =============================================================================

/**
 * Analyze component for timing anti-patterns
 * Uses static analysis to detect potential timing issues
 */
function analyzeTimingPatterns(component: ComponentMatch): GardenIssue[] {
  const issues: GardenIssue[] = [];
  const content = component.context || '';

  // Pattern 1: async without pending state
  if (content.includes('async') && content.includes('await')) {
    if (!content.includes('isPending') && !content.includes('isLoading') && !content.includes('setLoading')) {
      issues.push({
        category: 'timing',
        severity: 'warning',
        file: component.path,
        message: 'Async handler without visible pending state',
        suggestion: 'Add isPending or isLoading state for immediate feedback',
      });
    }
  }

  // Pattern 2: onClick with await but no immediate state
  const onClickPattern = /onClick\s*=\s*\{?\s*async[^}]+await/;
  if (onClickPattern.test(content)) {
    if (!content.includes('disabled') && !content.includes('isPending')) {
      issues.push({
        category: 'timing',
        severity: 'warning',
        file: component.path,
        message: 'Click handler has await without disable/pending pattern',
        suggestion: 'Add disabled={isPending} to prevent double-clicks and show feedback',
      });
    }
  }

  // Pattern 3: Server action without optimistic update
  if (content.includes('useTransition') || content.includes('startTransition')) {
    // useTransition is good, but check if there's optimistic state
    if (!content.includes('optimistic') && !content.includes('Optimistic')) {
      issues.push({
        category: 'timing',
        severity: 'info',
        file: component.path,
        message: 'Using transitions without optimistic updates',
        suggestion: 'Consider useOptimistic for immediate feedback on server actions',
      });
    }
  }

  return issues;
}

// =============================================================================
// FORMATTERS
// =============================================================================

/**
 * Format garden result as human-readable report
 */
export function formatGardenResult(result: GardenResult): string {
  const lines: string[] = [];

  lines.push('# Garden Health Report');
  lines.push('');
  lines.push(`**Scanned:** ${result.componentCount} components`);
  lines.push(`**Timestamp:** ${result.timestamp.toISOString()}`);
  lines.push('');
  lines.push(`## Health Score: ${result.healthScore}%`);
  lines.push('');

  if (result.issues.length === 0) {
    lines.push('All systems healthy. No issues detected.');
    return lines.join('\n');
  }

  lines.push(`## Summary`);
  lines.push('');
  lines.push(`- Errors: ${result.errorCount}`);
  lines.push(`- Warnings: ${result.warningCount}`);
  lines.push(`- Info: ${result.infoCount}`);
  lines.push('');

  // Group by category
  const byCategory = new Map<string, GardenIssue[]>();
  for (const issue of result.issues) {
    const existing = byCategory.get(issue.category) || [];
    existing.push(issue);
    byCategory.set(issue.category, existing);
  }

  for (const [category, issues] of byCategory) {
    lines.push(`## ${capitalize(category)} Issues`);
    lines.push('');

    // Sort by severity
    const sorted = [...issues].sort((a, b) => {
      const order = { error: 0, warning: 1, info: 2 };
      return order[a.severity] - order[b.severity];
    });

    for (const issue of sorted) {
      const location = issue.line ? `${issue.file}:${issue.line}` : issue.file;
      lines.push(`- [${issue.severity.toUpperCase()}] ${location}`);
      lines.push(`  ${issue.message}`);
      if (issue.suggestion) {
        lines.push(`  *Fix: ${issue.suggestion}*`);
      }
      lines.push('');
    }
  }

  return lines.join('\n');
}

/**
 * Format garden result as short summary
 */
export function formatGardenSummary(result: GardenResult): string {
  const status = result.healthScore >= 80 ? 'HEALTHY' :
                 result.healthScore >= 50 ? 'NEEDS ATTENTION' : 'CRITICAL';

  return `Garden: ${status} (${result.healthScore}%) - ${result.errorCount} errors, ${result.warningCount} warnings`;
}

// =============================================================================
// CLI
// =============================================================================

/**
 * Run garden command from CLI
 *
 * @example
 * ```bash
 * npx sigil garden
 * npx sigil garden --drift
 * ```
 */
export async function runGardenCLI(args: string[] = []): Promise<void> {
  const drift = args.includes('--drift');

  console.log(drift ? 'Running drift analysis...' : 'Running full garden check...');
  console.log('');

  const result = drift
    ? await gardenDrift()
    : await garden();

  console.log(formatGardenResult(result));

  // Exit with error code if errors found
  if (result.errorCount > 0) {
    process.exit(1);
  }
}

// =============================================================================
// HELPERS
// =============================================================================

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
