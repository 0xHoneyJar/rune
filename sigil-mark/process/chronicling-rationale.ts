/**
 * @sigil-tier gold
 * Sigil v6.0 — Chronicling Rationale
 *
 * Lightweight craft documentation via Stop hook.
 * Creates decision logs without blocking generation.
 *
 * @module process/chronicling-rationale
 */

import * as fs from 'fs';
import * as path from 'path';

// =============================================================================
// CONSTANTS
// =============================================================================

export const CRAFT_LOG_DIR = '.sigil/craft-log';

// =============================================================================
// TYPES
// =============================================================================

/**
 * Decision made during craft session
 */
export interface CraftDecision {
  type: 'zone' | 'physics' | 'pattern' | 'material' | 'fidelity';
  choice: string;
  reasoning: string;
}

/**
 * Context resolved for craft session
 */
export interface CraftContext {
  zone: string;
  physics: string;
  vocabulary: string[];
  era?: string;
}

/**
 * Pattern created or used during session
 */
export interface PatternUsage {
  name: string;
  status: 'experimental' | 'surviving' | 'canonical';
  isNew: boolean;
}

/**
 * Physics validation check
 */
export interface PhysicsCheck {
  constraint: string;
  passed: boolean;
  details?: string;
}

/**
 * Full craft session data
 */
export interface CraftSession {
  componentName: string;
  date: string;
  era: string;
  request: string;
  context: CraftContext;
  decisions: CraftDecision[];
  patterns: PatternUsage[];
  physicsChecks: PhysicsCheck[];
}

/**
 * Result of log generation
 */
export interface CraftLogResult {
  success: boolean;
  path?: string;
  error?: string;
}

// =============================================================================
// CRAFT LOG GENERATION
// =============================================================================

/**
 * Generate craft log filename
 */
export function generateLogFilename(
  componentName: string,
  date: string = new Date().toISOString().split('T')[0]
): string {
  const safeName = componentName.replace(/[^a-zA-Z0-9]/g, '-');
  return `${date}-${safeName}.md`;
}

/**
 * Format decisions table
 */
export function formatDecisionsTable(decisions: CraftDecision[]): string {
  if (decisions.length === 0) {
    return '(No decisions recorded)';
  }

  const header = '| Decision | Choice | Reasoning |';
  const separator = '|----------|--------|-----------|';
  const rows = decisions.map(
    (d) => `| ${d.type} | ${d.choice} | ${d.reasoning} |`
  );

  return [header, separator, ...rows].join('\n');
}

/**
 * Format new patterns list
 */
export function formatNewPatterns(patterns: PatternUsage[]): string {
  const newPatterns = patterns.filter((p) => p.isNew);

  if (newPatterns.length === 0) {
    return '(No new patterns)';
  }

  return newPatterns
    .map((p) => `- ${p.name} (${p.status}) — first appearance`)
    .join('\n');
}

/**
 * Format physics validation checklist
 */
export function formatPhysicsChecks(checks: PhysicsCheck[]): string {
  if (checks.length === 0) {
    return '(No physics checks recorded)';
  }

  return checks
    .map((c) => {
      const icon = c.passed ? '[x]' : '[ ]';
      const details = c.details ? `: ${c.details}` : '';
      return `- ${icon} ${c.constraint}${details}`;
    })
    .join('\n');
}

/**
 * Format vocabulary list
 */
export function formatVocabulary(vocabulary: string[]): string {
  if (vocabulary.length === 0) {
    return '(none)';
  }
  return `["${vocabulary.join('", "')}"]`;
}

/**
 * Generate full craft log content
 */
export function generateCraftLog(session: CraftSession): string {
  const lines: string[] = [
    `# Craft Log: ${session.componentName}`,
    `Date: ${session.date}`,
    `Era: ${session.era}`,
    '',
    '## Request',
    session.request,
    '',
    '## Context Resolution',
    `- Zone: ${session.context.zone}`,
    `- Physics: ${session.context.physics}`,
    `- Vocabulary: ${formatVocabulary(session.context.vocabulary)}`,
    '',
    '## Decisions',
    formatDecisionsTable(session.decisions),
    '',
    '## New Patterns',
    formatNewPatterns(session.patterns),
    '',
    '## Physics Validated',
    formatPhysicsChecks(session.physicsChecks),
    '',
  ];

  return lines.join('\n');
}

/**
 * Ensure craft log directory exists
 */
export function ensureLogDirectory(projectRoot: string = process.cwd()): void {
  const logDir = path.join(projectRoot, CRAFT_LOG_DIR);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
}

/**
 * Write craft log to file
 */
export function writeCraftLog(
  session: CraftSession,
  projectRoot: string = process.cwd()
): CraftLogResult {
  try {
    ensureLogDirectory(projectRoot);

    const filename = generateLogFilename(session.componentName, session.date);
    const logPath = path.join(projectRoot, CRAFT_LOG_DIR, filename);
    const content = generateCraftLog(session);

    fs.writeFileSync(logPath, content, 'utf-8');

    return {
      success: true,
      path: logPath,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// =============================================================================
// SESSION COLLECTION
// =============================================================================

/**
 * Create empty session
 */
export function createSession(
  componentName: string,
  request: string,
  era: string = 'v1'
): CraftSession {
  return {
    componentName,
    date: new Date().toISOString().split('T')[0],
    era,
    request,
    context: {
      zone: 'standard',
      physics: 'default',
      vocabulary: [],
    },
    decisions: [],
    patterns: [],
    physicsChecks: [],
  };
}

/**
 * Add decision to session
 */
export function addDecision(
  session: CraftSession,
  type: CraftDecision['type'],
  choice: string,
  reasoning: string
): void {
  session.decisions.push({ type, choice, reasoning });
}

/**
 * Add pattern to session
 */
export function addPattern(
  session: CraftSession,
  name: string,
  status: PatternUsage['status'],
  isNew: boolean = false
): void {
  session.patterns.push({ name, status, isNew });
}

/**
 * Add physics check to session
 */
export function addPhysicsCheck(
  session: CraftSession,
  constraint: string,
  passed: boolean,
  details?: string
): void {
  session.physicsChecks.push({ constraint, passed, details });
}

/**
 * Set context for session
 */
export function setContext(
  session: CraftSession,
  zone: string,
  physics: string,
  vocabulary: string[]
): void {
  session.context = { zone, physics, vocabulary, era: session.era };
}

// =============================================================================
// LOG READING
// =============================================================================

/**
 * List all craft logs
 */
export function listCraftLogs(projectRoot: string = process.cwd()): string[] {
  const logDir = path.join(projectRoot, CRAFT_LOG_DIR);

  if (!fs.existsSync(logDir)) {
    return [];
  }

  return fs
    .readdirSync(logDir)
    .filter((f) => f.endsWith('.md'))
    .sort()
    .reverse(); // Most recent first
}

/**
 * Read craft log by filename
 */
export function readCraftLog(
  filename: string,
  projectRoot: string = process.cwd()
): string | null {
  const logPath = path.join(projectRoot, CRAFT_LOG_DIR, filename);

  if (!fs.existsSync(logPath)) {
    return null;
  }

  return fs.readFileSync(logPath, 'utf-8');
}

/**
 * Filter logs by era
 */
export function filterLogsByEra(
  era: string,
  projectRoot: string = process.cwd()
): string[] {
  const logs = listCraftLogs(projectRoot);

  return logs.filter((filename) => {
    const content = readCraftLog(filename, projectRoot);
    if (!content) return false;
    return content.includes(`Era: ${era}`);
  });
}

/**
 * Filter logs by component
 */
export function filterLogsByComponent(
  componentName: string,
  projectRoot: string = process.cwd()
): string[] {
  const logs = listCraftLogs(projectRoot);
  const safeName = componentName.replace(/[^a-zA-Z0-9]/g, '-');

  return logs.filter((filename) => filename.includes(safeName));
}

// =============================================================================
// FORMATTING
// =============================================================================

/**
 * Format log result message
 */
export function formatLogResult(result: CraftLogResult): string {
  if (result.success) {
    return `📝 Craft log written to: ${result.path}`;
  }
  return `❌ Failed to write craft log: ${result.error}`;
}

/**
 * Format log list for display
 */
export function formatLogList(logs: string[]): string {
  if (logs.length === 0) {
    return 'No craft logs found.';
  }

  const lines = ['📚 Craft Logs:', '', ...logs.map((l) => `  - ${l}`)];

  return lines.join('\n');
}
