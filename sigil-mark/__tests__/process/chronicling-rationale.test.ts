/**
 * @sigil-tier gold
 * Sigil v6.0 — Chronicling Rationale Tests
 *
 * Tests for craft log generation.
 *
 * @module __tests__/process/chronicling-rationale
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  // Constants
  CRAFT_LOG_DIR,
  // Types
  CraftSession,
  CraftDecision,
  PatternUsage,
  PhysicsCheck,
  // Log generation
  generateLogFilename,
  formatDecisionsTable,
  formatNewPatterns,
  formatPhysicsChecks,
  formatVocabulary,
  generateCraftLog,
  ensureLogDirectory,
  writeCraftLog,
  // Session collection
  createSession,
  addDecision,
  addPattern,
  addPhysicsCheck,
  setContext,
  // Log reading
  listCraftLogs,
  readCraftLog,
  filterLogsByEra,
  filterLogsByComponent,
  // Formatting
  formatLogResult,
  formatLogList,
} from '../../process/chronicling-rationale';

// =============================================================================
// TEST SETUP
// =============================================================================

const TEST_DIR = path.join(process.cwd(), '.test-chronicling');

beforeEach(() => {
  if (fs.existsSync(TEST_DIR)) {
    fs.rmSync(TEST_DIR, { recursive: true });
  }
  fs.mkdirSync(TEST_DIR, { recursive: true });
});

afterEach(() => {
  if (fs.existsSync(TEST_DIR)) {
    fs.rmSync(TEST_DIR, { recursive: true });
  }
});

// =============================================================================
// CONSTANTS TESTS
// =============================================================================

describe('Constants', () => {
  it('has correct craft log directory', () => {
    expect(CRAFT_LOG_DIR).toBe('.sigil/craft-log');
  });
});

// =============================================================================
// FILENAME GENERATION TESTS
// =============================================================================

describe('generateLogFilename', () => {
  it('generates filename with date and component', () => {
    const filename = generateLogFilename('ClaimButton', '2026-01-08');
    expect(filename).toBe('2026-01-08-ClaimButton.md');
  });

  it('sanitizes component name', () => {
    const filename = generateLogFilename('Claim Button (v2)', '2026-01-08');
    expect(filename).toBe('2026-01-08-Claim-Button--v2-.md');
  });

  it('uses current date if not provided', () => {
    const filename = generateLogFilename('Button');
    expect(filename).toMatch(/^\d{4}-\d{2}-\d{2}-Button\.md$/);
  });
});

// =============================================================================
// FORMATTING TESTS
// =============================================================================

describe('formatDecisionsTable', () => {
  it('formats decisions as table', () => {
    const decisions: CraftDecision[] = [
      { type: 'zone', choice: 'critical', reasoning: 'Contains claim term' },
      { type: 'physics', choice: 'deliberate', reasoning: 'Zone requires it' },
    ];

    const table = formatDecisionsTable(decisions);

    expect(table).toContain('| Decision | Choice | Reasoning |');
    expect(table).toContain('| zone | critical | Contains claim term |');
    expect(table).toContain('| physics | deliberate | Zone requires it |');
  });

  it('returns message for empty decisions', () => {
    const table = formatDecisionsTable([]);
    expect(table).toBe('(No decisions recorded)');
  });
});

describe('formatNewPatterns', () => {
  it('formats new patterns', () => {
    const patterns: PatternUsage[] = [
      { name: 'spring-entrance', status: 'canonical', isNew: false },
      { name: 'fade-exit', status: 'experimental', isNew: true },
    ];

    const result = formatNewPatterns(patterns);

    expect(result).toContain('fade-exit (experimental)');
    expect(result).not.toContain('spring-entrance');
  });

  it('returns message for no new patterns', () => {
    const patterns: PatternUsage[] = [
      { name: 'existing', status: 'canonical', isNew: false },
    ];

    const result = formatNewPatterns(patterns);
    expect(result).toBe('(No new patterns)');
  });
});

describe('formatPhysicsChecks', () => {
  it('formats checks with checkboxes', () => {
    const checks: PhysicsCheck[] = [
      { constraint: 'Zone constraint', passed: true, details: 'critical → deliberate' },
      { constraint: 'Material constraint', passed: false },
    ];

    const result = formatPhysicsChecks(checks);

    expect(result).toContain('[x] Zone constraint: critical → deliberate');
    expect(result).toContain('[ ] Material constraint');
  });

  it('returns message for empty checks', () => {
    const result = formatPhysicsChecks([]);
    expect(result).toBe('(No physics checks recorded)');
  });
});

describe('formatVocabulary', () => {
  it('formats vocabulary array', () => {
    const result = formatVocabulary(['claim', 'trustworthy', 'confirm']);
    expect(result).toBe('["claim", "trustworthy", "confirm"]');
  });

  it('returns none for empty array', () => {
    const result = formatVocabulary([]);
    expect(result).toBe('(none)');
  });
});

// =============================================================================
// LOG GENERATION TESTS
// =============================================================================

describe('generateCraftLog', () => {
  it('generates complete log', () => {
    const session: CraftSession = {
      componentName: 'ClaimButton',
      date: '2026-01-08',
      era: 'v1',
      request: 'Create a trustworthy claim button',
      context: {
        zone: 'critical',
        physics: 'deliberate',
        vocabulary: ['claim', 'trustworthy'],
      },
      decisions: [
        { type: 'zone', choice: 'critical', reasoning: 'Claim term detected' },
      ],
      patterns: [
        { name: 'spring-entrance', status: 'canonical', isNew: false },
      ],
      physicsChecks: [
        { constraint: 'Zone constraint', passed: true },
      ],
    };

    const log = generateCraftLog(session);

    expect(log).toContain('# Craft Log: ClaimButton');
    expect(log).toContain('Date: 2026-01-08');
    expect(log).toContain('Era: v1');
    expect(log).toContain('## Request');
    expect(log).toContain('Create a trustworthy claim button');
    expect(log).toContain('Zone: critical');
    expect(log).toContain('Physics: deliberate');
    expect(log).toContain('## Decisions');
    expect(log).toContain('## Physics Validated');
  });
});

// =============================================================================
// FILE OPERATIONS TESTS
// =============================================================================

describe('ensureLogDirectory', () => {
  it('creates directory if not exists', () => {
    const logDir = path.join(TEST_DIR, CRAFT_LOG_DIR);
    expect(fs.existsSync(logDir)).toBe(false);

    ensureLogDirectory(TEST_DIR);

    expect(fs.existsSync(logDir)).toBe(true);
  });

  it('does not error if directory exists', () => {
    const logDir = path.join(TEST_DIR, CRAFT_LOG_DIR);
    fs.mkdirSync(logDir, { recursive: true });

    expect(() => ensureLogDirectory(TEST_DIR)).not.toThrow();
  });
});

describe('writeCraftLog', () => {
  it('writes log to file', () => {
    const session: CraftSession = {
      componentName: 'TestButton',
      date: '2026-01-08',
      era: 'v1',
      request: 'Test request',
      context: { zone: 'standard', physics: 'default', vocabulary: [] },
      decisions: [],
      patterns: [],
      physicsChecks: [],
    };

    const result = writeCraftLog(session, TEST_DIR);

    expect(result.success).toBe(true);
    expect(result.path).toBeDefined();
    expect(fs.existsSync(result.path!)).toBe(true);
  });
});

// =============================================================================
// SESSION COLLECTION TESTS
// =============================================================================

describe('createSession', () => {
  it('creates empty session', () => {
    const session = createSession('Button', 'Create button');

    expect(session.componentName).toBe('Button');
    expect(session.request).toBe('Create button');
    expect(session.era).toBe('v1');
    expect(session.decisions).toEqual([]);
    expect(session.patterns).toEqual([]);
  });

  it('accepts custom era', () => {
    const session = createSession('Button', 'Create', 'v2-Tactile');
    expect(session.era).toBe('v2-Tactile');
  });
});

describe('addDecision', () => {
  it('adds decision to session', () => {
    const session = createSession('Button', 'Create');
    addDecision(session, 'zone', 'critical', 'Contains claim');

    expect(session.decisions).toHaveLength(1);
    expect(session.decisions[0].type).toBe('zone');
    expect(session.decisions[0].choice).toBe('critical');
  });
});

describe('addPattern', () => {
  it('adds pattern to session', () => {
    const session = createSession('Button', 'Create');
    addPattern(session, 'spring-entrance', 'canonical', false);

    expect(session.patterns).toHaveLength(1);
    expect(session.patterns[0].name).toBe('spring-entrance');
    expect(session.patterns[0].isNew).toBe(false);
  });
});

describe('addPhysicsCheck', () => {
  it('adds physics check to session', () => {
    const session = createSession('Button', 'Create');
    addPhysicsCheck(session, 'Zone constraint', true, 'critical → deliberate');

    expect(session.physicsChecks).toHaveLength(1);
    expect(session.physicsChecks[0].constraint).toBe('Zone constraint');
    expect(session.physicsChecks[0].passed).toBe(true);
  });
});

describe('setContext', () => {
  it('sets context on session', () => {
    const session = createSession('Button', 'Create');
    setContext(session, 'critical', 'deliberate', ['claim']);

    expect(session.context.zone).toBe('critical');
    expect(session.context.physics).toBe('deliberate');
    expect(session.context.vocabulary).toEqual(['claim']);
  });
});

// =============================================================================
// LOG READING TESTS
// =============================================================================

describe('listCraftLogs', () => {
  it('returns empty for no logs', () => {
    ensureLogDirectory(TEST_DIR);
    const logs = listCraftLogs(TEST_DIR);
    expect(logs).toEqual([]);
  });

  it('lists logs in reverse order', () => {
    ensureLogDirectory(TEST_DIR);
    const logDir = path.join(TEST_DIR, CRAFT_LOG_DIR);

    fs.writeFileSync(path.join(logDir, '2026-01-07-A.md'), 'log');
    fs.writeFileSync(path.join(logDir, '2026-01-08-B.md'), 'log');
    fs.writeFileSync(path.join(logDir, '2026-01-06-C.md'), 'log');

    const logs = listCraftLogs(TEST_DIR);

    expect(logs[0]).toBe('2026-01-08-B.md');
    expect(logs[1]).toBe('2026-01-07-A.md');
    expect(logs[2]).toBe('2026-01-06-C.md');
  });
});

describe('readCraftLog', () => {
  it('reads log content', () => {
    ensureLogDirectory(TEST_DIR);
    const logDir = path.join(TEST_DIR, CRAFT_LOG_DIR);
    fs.writeFileSync(path.join(logDir, 'test.md'), 'Test content');

    const content = readCraftLog('test.md', TEST_DIR);
    expect(content).toBe('Test content');
  });

  it('returns null for missing log', () => {
    ensureLogDirectory(TEST_DIR);
    const content = readCraftLog('missing.md', TEST_DIR);
    expect(content).toBeNull();
  });
});

describe('filterLogsByEra', () => {
  it('filters by era name', () => {
    ensureLogDirectory(TEST_DIR);
    const logDir = path.join(TEST_DIR, CRAFT_LOG_DIR);

    fs.writeFileSync(path.join(logDir, 'a.md'), 'Era: v1\ncontent');
    fs.writeFileSync(path.join(logDir, 'b.md'), 'Era: v2\ncontent');

    const v1Logs = filterLogsByEra('v1', TEST_DIR);

    expect(v1Logs).toHaveLength(1);
    expect(v1Logs[0]).toBe('a.md');
  });
});

describe('filterLogsByComponent', () => {
  it('filters by component name', () => {
    ensureLogDirectory(TEST_DIR);
    const logDir = path.join(TEST_DIR, CRAFT_LOG_DIR);

    fs.writeFileSync(path.join(logDir, '2026-01-08-Button.md'), 'log');
    fs.writeFileSync(path.join(logDir, '2026-01-08-Card.md'), 'log');
    fs.writeFileSync(path.join(logDir, '2026-01-07-Button.md'), 'log');

    const buttonLogs = filterLogsByComponent('Button', TEST_DIR);

    expect(buttonLogs).toHaveLength(2);
  });
});

// =============================================================================
// RESULT FORMATTING TESTS
// =============================================================================

describe('formatLogResult', () => {
  it('formats success result', () => {
    const result = { success: true, path: '/path/to/log.md' };
    const message = formatLogResult(result);
    expect(message).toContain('Craft log written to');
    expect(message).toContain('/path/to/log.md');
  });

  it('formats error result', () => {
    const result = { success: false, error: 'Permission denied' };
    const message = formatLogResult(result);
    expect(message).toContain('Failed');
    expect(message).toContain('Permission denied');
  });
});

describe('formatLogList', () => {
  it('formats log list', () => {
    const logs = ['2026-01-08-A.md', '2026-01-07-B.md'];
    const message = formatLogList(logs);

    expect(message).toContain('Craft Logs:');
    expect(message).toContain('2026-01-08-A.md');
    expect(message).toContain('2026-01-07-B.md');
  });

  it('handles empty list', () => {
    const message = formatLogList([]);
    expect(message).toContain('No craft logs found');
  });
});

// =============================================================================
// PERFORMANCE TESTS
// =============================================================================

describe('Performance', () => {
  it('log generation in <100ms', () => {
    const session: CraftSession = {
      componentName: 'ComplexComponent',
      date: '2026-01-08',
      era: 'v1',
      request: 'Create complex component with many decisions',
      context: {
        zone: 'critical',
        physics: 'deliberate',
        vocabulary: ['term1', 'term2', 'term3'],
      },
      decisions: Array(10)
        .fill(null)
        .map((_, i) => ({
          type: 'pattern' as const,
          choice: `pattern-${i}`,
          reasoning: `Reasoning for pattern ${i}`,
        })),
      patterns: Array(5)
        .fill(null)
        .map((_, i) => ({
          name: `pattern-${i}`,
          status: 'canonical' as const,
          isNew: i > 3,
        })),
      physicsChecks: Array(5)
        .fill(null)
        .map((_, i) => ({
          constraint: `Constraint ${i}`,
          passed: true,
        })),
    };

    const start = performance.now();
    generateCraftLog(session);
    const elapsed = performance.now() - start;

    expect(elapsed).toBeLessThan(100);
  });
});
