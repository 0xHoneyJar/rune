/**
 * @sigil-tier gold
 * Sigil v6.0 — Era Manager Tests
 *
 * Tests for era versioning and design direction shifts.
 *
 * @module __tests__/process/era-manager
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  // Constants
  DEFAULT_ERA,
  ERAS_DIRECTORY,
  SURVIVAL_PATH,
  // Era reading
  getCurrentEra,
  getCurrentEraName,
  eraExists,
  // Era archiving
  archiveEra,
  loadEraArchive,
  listArchivedEras,
  // Era transition
  transitionToNewEra,
  initializeDefaultEra,
  // Craft log integration
  addEraToLogEntry,
  filterLogsByEra,
  getErasFromLogs,
  // Rules.md markers
  formatEraSection,
  // Validation
  isValidEraName,
  canTransitionToEra,
  // Formatting
  formatEraTransitionMessage,
  formatEraSummary,
} from '../../process/era-manager';

// =============================================================================
// TEST SETUP
// =============================================================================

const TEST_DIR = path.join(process.cwd(), '.test-era-manager');

beforeEach(() => {
  // Create test directory
  if (fs.existsSync(TEST_DIR)) {
    fs.rmSync(TEST_DIR, { recursive: true });
  }
  fs.mkdirSync(TEST_DIR, { recursive: true });
  fs.mkdirSync(path.join(TEST_DIR, '.sigil'), { recursive: true });
});

afterEach(() => {
  // Clean up test directory
  if (fs.existsSync(TEST_DIR)) {
    fs.rmSync(TEST_DIR, { recursive: true });
  }
});

// Helper to create test survival.json
function createTestSurvival(era: string, patterns = {}) {
  const survivalPath = path.join(TEST_DIR, SURVIVAL_PATH);
  const content = {
    era,
    era_started: '2026-01-01T00:00:00Z',
    patterns: {
      survived: {},
      canonical: [],
      rejected: [],
      ...patterns,
    },
  };
  fs.writeFileSync(survivalPath, JSON.stringify(content, null, 2));
}

// =============================================================================
// CONSTANTS TESTS
// =============================================================================

describe('Constants', () => {
  it('has correct default era', () => {
    expect(DEFAULT_ERA).toBe('v1');
  });

  it('has correct eras directory', () => {
    expect(ERAS_DIRECTORY).toBe('.sigil/eras');
  });

  it('has correct survival path', () => {
    expect(SURVIVAL_PATH).toBe('.sigil/survival.json');
  });
});

// =============================================================================
// ERA READING TESTS
// =============================================================================

describe('Era Reading', () => {
  describe('getCurrentEra', () => {
    it('returns era from survival.json', () => {
      createTestSurvival('Flat');
      const era = getCurrentEra(TEST_DIR);
      expect(era).not.toBeNull();
      expect(era?.name).toBe('Flat');
    });

    it('returns null when no survival.json', () => {
      const era = getCurrentEra(TEST_DIR);
      expect(era).toBeNull();
    });

    it('returns null when no era field', () => {
      const survivalPath = path.join(TEST_DIR, SURVIVAL_PATH);
      fs.writeFileSync(survivalPath, JSON.stringify({}));
      const era = getCurrentEra(TEST_DIR);
      expect(era).toBeNull();
    });
  });

  describe('getCurrentEraName', () => {
    it('returns era name', () => {
      createTestSurvival('Tactile');
      expect(getCurrentEraName(TEST_DIR)).toBe('Tactile');
    });

    it('returns default era when none set', () => {
      expect(getCurrentEraName(TEST_DIR)).toBe('v1');
    });
  });

  describe('eraExists', () => {
    it('returns true for current era', () => {
      createTestSurvival('Current');
      expect(eraExists('Current', TEST_DIR)).toBe(true);
    });

    it('returns true for archived era', () => {
      const erasDir = path.join(TEST_DIR, ERAS_DIRECTORY);
      fs.mkdirSync(erasDir, { recursive: true });
      fs.writeFileSync(
        path.join(erasDir, 'Old.json'),
        JSON.stringify({ name: 'Old' })
      );
      expect(eraExists('Old', TEST_DIR)).toBe(true);
    });

    it('returns false for non-existent era', () => {
      expect(eraExists('NonExistent', TEST_DIR)).toBe(false);
    });
  });
});

// =============================================================================
// ERA ARCHIVING TESTS
// =============================================================================

describe('Era Archiving', () => {
  describe('archiveEra', () => {
    it('creates archive file', () => {
      createTestSurvival('ToArchive', {
        survived: { button: 5 },
        canonical: ['button'],
      });

      const archivePath = archiveEra(TEST_DIR);
      expect(archivePath).not.toBeNull();
      expect(fs.existsSync(archivePath!)).toBe(true);
    });

    it('includes patterns in archive', () => {
      createTestSurvival('WithPatterns', {
        survived: { card: 3 },
        canonical: ['card'],
        rejected: ['spinner'],
      });

      const archivePath = archiveEra(TEST_DIR);
      const archive = JSON.parse(fs.readFileSync(archivePath!, 'utf-8'));

      expect(archive.patterns.survived).toEqual({ card: 3 });
      expect(archive.patterns.canonical).toContain('card');
      expect(archive.patterns.rejected).toContain('spinner');
    });

    it('adds ended timestamp', () => {
      createTestSurvival('Ending');
      const archivePath = archiveEra(TEST_DIR);
      const archive = JSON.parse(fs.readFileSync(archivePath!, 'utf-8'));

      expect(archive.ended).toBeDefined();
    });

    it('returns null when no survival.json', () => {
      const result = archiveEra(TEST_DIR);
      expect(result).toBeNull();
    });
  });

  describe('loadEraArchive', () => {
    it('loads archived era', () => {
      createTestSurvival('ToLoad');
      archiveEra(TEST_DIR);

      const archive = loadEraArchive('ToLoad', TEST_DIR);
      expect(archive).not.toBeNull();
      expect(archive?.name).toBe('ToLoad');
    });

    it('returns null for non-existent archive', () => {
      const archive = loadEraArchive('Missing', TEST_DIR);
      expect(archive).toBeNull();
    });
  });

  describe('listArchivedEras', () => {
    it('returns empty array when no archives', () => {
      const eras = listArchivedEras(TEST_DIR);
      expect(eras).toEqual([]);
    });

    it('lists all archived eras', () => {
      createTestSurvival('First');
      archiveEra(TEST_DIR);

      createTestSurvival('Second');
      archiveEra(TEST_DIR);

      const eras = listArchivedEras(TEST_DIR);
      expect(eras).toHaveLength(2);
    });

    it('sorts by start date', () => {
      const erasDir = path.join(TEST_DIR, ERAS_DIRECTORY);
      fs.mkdirSync(erasDir, { recursive: true });

      fs.writeFileSync(
        path.join(erasDir, 'Old.json'),
        JSON.stringify({ name: 'Old', started: '2025-01-01T00:00:00Z' })
      );
      fs.writeFileSync(
        path.join(erasDir, 'New.json'),
        JSON.stringify({ name: 'New', started: '2026-01-01T00:00:00Z' })
      );

      const eras = listArchivedEras(TEST_DIR);
      expect(eras[0].name).toBe('Old');
      expect(eras[1].name).toBe('New');
    });
  });
});

// =============================================================================
// ERA TRANSITION TESTS
// =============================================================================

describe('Era Transition', () => {
  describe('transitionToNewEra', () => {
    it('creates new era', () => {
      const result = transitionToNewEra('Tactile', 'Touch-focused', TEST_DIR);

      expect(result.success).toBe(true);
      expect(result.newEra).toBe('Tactile');
    });

    it('archives previous era', () => {
      createTestSurvival('Old', { survived: { button: 5 } });
      const result = transitionToNewEra('New', undefined, TEST_DIR);

      expect(result.success).toBe(true);
      expect(result.previousEra).toBe('Old');
      expect(result.archivePath).toBeDefined();
    });

    it('resets patterns but keeps rejected', () => {
      createTestSurvival('Old', {
        survived: { button: 5 },
        canonical: ['button'],
        rejected: ['spinner'],
      });

      transitionToNewEra('New', undefined, TEST_DIR);

      const survivalPath = path.join(TEST_DIR, SURVIVAL_PATH);
      const survival = JSON.parse(fs.readFileSync(survivalPath, 'utf-8'));

      expect(survival.patterns.survived).toEqual({});
      expect(survival.patterns.canonical).toEqual([]);
      expect(survival.patterns.rejected).toContain('spinner');
    });

    it('updates era fields', () => {
      transitionToNewEra('Modern', 'Clean design', TEST_DIR);

      const survivalPath = path.join(TEST_DIR, SURVIVAL_PATH);
      const survival = JSON.parse(fs.readFileSync(survivalPath, 'utf-8'));

      expect(survival.era).toBe('Modern');
      expect(survival.era_started).toBeDefined();
      expect(survival.era_description).toBe('Clean design');
    });
  });

  describe('initializeDefaultEra', () => {
    it('creates default era when none exists', () => {
      const result = initializeDefaultEra(TEST_DIR);

      expect(result.success).toBe(true);
      expect(result.newEra).toBe('v1');
    });

    it('returns existing era when one exists', () => {
      createTestSurvival('Existing');
      const result = initializeDefaultEra(TEST_DIR);

      expect(result.success).toBe(true);
      expect(result.newEra).toBe('Existing');
    });
  });
});

// =============================================================================
// CRAFT LOG INTEGRATION TESTS
// =============================================================================

describe('Craft Log Integration', () => {
  describe('addEraToLogEntry', () => {
    it('adds era to log entry', () => {
      createTestSurvival('Current');
      const entry = { action: 'craft', component: 'Button' };
      const result = addEraToLogEntry(entry, TEST_DIR);

      expect(result.era).toBe('Current');
      expect(result.action).toBe('craft');
    });

    it('uses default era when none set', () => {
      const entry = { action: 'craft' };
      const result = addEraToLogEntry(entry, TEST_DIR);

      expect(result.era).toBe('v1');
    });
  });

  describe('filterLogsByEra', () => {
    const logs = [
      { era: 'v1', timestamp: '2025-01-01', content: 'first' },
      { era: 'v2', timestamp: '2026-01-01', content: 'second' },
      { era: 'v1', timestamp: '2025-06-01', content: 'third' },
    ];

    it('filters logs by era', () => {
      const v1Logs = filterLogsByEra(logs, 'v1');
      expect(v1Logs).toHaveLength(2);
    });

    it('returns empty for non-existent era', () => {
      const v3Logs = filterLogsByEra(logs, 'v3');
      expect(v3Logs).toHaveLength(0);
    });
  });

  describe('getErasFromLogs', () => {
    it('extracts unique eras', () => {
      const logs = [
        { era: 'v1', timestamp: '', content: '' },
        { era: 'v2', timestamp: '', content: '' },
        { era: 'v1', timestamp: '', content: '' },
      ];

      const eras = getErasFromLogs(logs);
      expect(eras).toContain('v1');
      expect(eras).toContain('v2');
      expect(eras).toHaveLength(2);
    });
  });
});

// =============================================================================
// RULES.MD MARKERS TESTS
// =============================================================================

describe('Rules.md Era Markers', () => {
  describe('formatEraSection', () => {
    it('includes current era', () => {
      createTestSurvival('Active');
      const section = formatEraSection(TEST_DIR);

      expect(section).toContain('## Eras');
      expect(section).toContain('Current: Active');
    });

    it('includes historical eras', () => {
      createTestSurvival('First');
      archiveEra(TEST_DIR);
      createTestSurvival('Second');

      const section = formatEraSection(TEST_DIR);
      expect(section).toContain('Historical');
      expect(section).toContain('First');
    });

    it('shows default era when none set', () => {
      const section = formatEraSection(TEST_DIR);
      expect(section).toContain('v1 (default)');
    });
  });
});

// =============================================================================
// VALIDATION TESTS
// =============================================================================

describe('Validation', () => {
  describe('isValidEraName', () => {
    it('accepts valid names', () => {
      expect(isValidEraName('v1')).toBe(true);
      expect(isValidEraName('Flat')).toBe(true);
      expect(isValidEraName('v2-Tactile')).toBe(true);
    });

    it('rejects empty names', () => {
      expect(isValidEraName('')).toBe(false);
    });

    it('rejects names starting with dash', () => {
      expect(isValidEraName('-invalid')).toBe(false);
    });

    it('rejects names over 50 chars', () => {
      expect(isValidEraName('a'.repeat(51))).toBe(false);
    });
  });

  describe('canTransitionToEra', () => {
    it('allows valid transition', () => {
      const result = canTransitionToEra('NewEra', TEST_DIR);
      expect(result.valid).toBe(true);
    });

    it('rejects invalid name', () => {
      const result = canTransitionToEra('-invalid', TEST_DIR);
      expect(result.valid).toBe(false);
      expect(result.reason).toContain('alphanumeric');
    });

    it('rejects current era name', () => {
      createTestSurvival('Current');
      const result = canTransitionToEra('Current', TEST_DIR);
      expect(result.valid).toBe(false);
      expect(result.reason).toContain('Already in era');
    });

    it('rejects archived era name', () => {
      createTestSurvival('Old');
      archiveEra(TEST_DIR);
      createTestSurvival('New');

      const result = canTransitionToEra('Old', TEST_DIR);
      expect(result.valid).toBe(false);
      expect(result.reason).toContain('already exists');
    });
  });
});

// =============================================================================
// FORMATTING TESTS
// =============================================================================

describe('Formatting', () => {
  describe('formatEraTransitionMessage', () => {
    it('formats successful transition', () => {
      const result = {
        success: true,
        previousEra: 'Old',
        newEra: 'New',
        archivePath: '.sigil/eras/Old.json',
      };

      const message = formatEraTransitionMessage(result);
      expect(message).toContain('Era Transition Complete');
      expect(message).toContain('Old');
      expect(message).toContain('New');
    });

    it('formats failed transition', () => {
      const result = {
        success: false,
        newEra: 'Failed',
        error: 'Something went wrong',
      };

      const message = formatEraTransitionMessage(result);
      expect(message).toContain('failed');
      expect(message).toContain('Something went wrong');
    });
  });

  describe('formatEraSummary', () => {
    it('includes current era', () => {
      createTestSurvival('Summary');
      const summary = formatEraSummary(TEST_DIR);

      expect(summary).toContain('Era Summary');
      expect(summary).toContain('Summary');
    });

    it('includes archive count', () => {
      createTestSurvival('First');
      archiveEra(TEST_DIR);
      createTestSurvival('Second');

      const summary = formatEraSummary(TEST_DIR);
      expect(summary).toContain('Archived eras: 1');
    });
  });
});

// =============================================================================
// PERFORMANCE TESTS
// =============================================================================

describe('Performance', () => {
  it('era transition in <50ms', () => {
    createTestSurvival('Old', { survived: { button: 5 } });

    const start = performance.now();
    transitionToNewEra('New', undefined, TEST_DIR);
    const elapsed = performance.now() - start;

    expect(elapsed).toBeLessThan(50);
  });

  it('era listing in <10ms', () => {
    // Create some archived eras
    for (let i = 0; i < 5; i++) {
      createTestSurvival(`Era${i}`);
      archiveEra(TEST_DIR);
    }

    const start = performance.now();
    listArchivedEras(TEST_DIR);
    const elapsed = performance.now() - start;

    expect(elapsed).toBeLessThan(10);
  });
});
