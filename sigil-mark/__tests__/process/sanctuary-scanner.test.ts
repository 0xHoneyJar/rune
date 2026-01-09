/**
 * @sigil-tier gold
 * Sanctuary Scanner Tests
 *
 * Tests for component discovery functions.
 * Validates tier, zone, physics, and vocabulary lookup.
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  findByTier,
  findByZone,
  findByPhysics,
  findByVocabulary,
  findComponents,
  getComponentDetails,
  listAllComponents,
  getComponentStats,
} from '../../process/sanctuary-scanner';
import { buildWorkshop } from '../../process/workshop-builder';
import { Workshop } from '../../types/workshop';

// =============================================================================
// TEST FIXTURES
// =============================================================================

const FIXTURES_DIR = path.join(__dirname, 'fixtures', 'scanner');

function createTestFixtures() {
  const fixturesPath = FIXTURES_DIR;

  // Create directories
  fs.mkdirSync(path.join(fixturesPath, 'node_modules', 'test-pkg'), { recursive: true });
  fs.mkdirSync(path.join(fixturesPath, 'src', 'sanctuary', 'gold'), { recursive: true });
  fs.mkdirSync(path.join(fixturesPath, 'src', 'sanctuary', 'silver'), { recursive: true });
  fs.mkdirSync(path.join(fixturesPath, '.sigil'), { recursive: true });

  // Create package.json
  fs.writeFileSync(
    path.join(fixturesPath, 'package.json'),
    JSON.stringify({ name: 'test-project', version: '1.0.0' })
  );

  // Create imports.yaml
  fs.writeFileSync(
    path.join(fixturesPath, '.sigil', 'imports.yaml'),
    '- test-pkg\n'
  );

  // Create test package
  fs.writeFileSync(
    path.join(fixturesPath, 'node_modules', 'test-pkg', 'package.json'),
    JSON.stringify({ name: 'test-pkg', version: '1.0.0' })
  );

  // Create gold component
  fs.writeFileSync(
    path.join(fixturesPath, 'src', 'sanctuary', 'gold', 'ClaimButton.tsx'),
    `/**
 * @sigil-tier gold
 * @sigil-zone critical
 * @sigil-physics deliberate
 * @sigil-vocabulary claim, withdraw
 */
import React from 'react';
export function ClaimButton() { return null; }`
  );

  // Create silver component
  fs.writeFileSync(
    path.join(fixturesPath, 'src', 'sanctuary', 'silver', 'StatusBadge.tsx'),
    `/**
 * @sigil-tier silver
 * @sigil-zone standard
 * @sigil-physics snappy
 * @sigil-vocabulary status
 */
import React from 'react';
export function StatusBadge() { return null; }`
  );

  // Create another gold component
  fs.writeFileSync(
    path.join(fixturesPath, 'src', 'sanctuary', 'gold', 'WithdrawModal.tsx'),
    `/**
 * @sigil-tier gold
 * @sigil-zone critical
 * @sigil-physics deliberate
 * @sigil-vocabulary withdraw, claim
 */
import React from 'react';
export function WithdrawModal() { return null; }`
  );

  return fixturesPath;
}

function cleanupTestFixtures() {
  if (fs.existsSync(FIXTURES_DIR)) {
    fs.rmSync(FIXTURES_DIR, { recursive: true, force: true });
  }
}

// =============================================================================
// TIER LOOKUP TESTS
// =============================================================================

describe('Tier Lookup', () => {
  let fixturesPath: string;
  let workshop: Workshop;

  beforeAll(async () => {
    fixturesPath = createTestFixtures();
    await buildWorkshop({ projectRoot: fixturesPath });
    const workshopPath = path.join(fixturesPath, '.sigil', 'workshop.json');
    workshop = JSON.parse(fs.readFileSync(workshopPath, 'utf-8'));
  });

  afterAll(() => {
    cleanupTestFixtures();
  });

  describe('findByTier', () => {
    it('finds gold tier components', () => {
      const results = findByTier('gold', {
        projectRoot: fixturesPath,
        workshop,
      });

      expect(results.length).toBe(2);
      expect(results.some(r => r.includes('ClaimButton'))).toBe(true);
      expect(results.some(r => r.includes('WithdrawModal'))).toBe(true);
    });

    it('finds silver tier components', () => {
      const results = findByTier('silver', {
        projectRoot: fixturesPath,
        workshop,
      });

      expect(results.length).toBe(1);
      expect(results[0]).toContain('StatusBadge');
    });

    it('returns empty for non-existent tier', () => {
      const results = findByTier('bronze', {
        projectRoot: fixturesPath,
        workshop,
      });

      expect(results).toEqual([]);
    });

    it('completes in <50ms', () => {
      const start = Date.now();
      findByTier('gold', {
        projectRoot: fixturesPath,
        workshop,
      });
      const elapsed = Date.now() - start;

      expect(elapsed).toBeLessThan(50);
    });
  });
});

// =============================================================================
// ZONE LOOKUP TESTS
// =============================================================================

describe('Zone Lookup', () => {
  let fixturesPath: string;
  let workshop: Workshop;

  beforeAll(async () => {
    fixturesPath = createTestFixtures();
    await buildWorkshop({ projectRoot: fixturesPath });
    const workshopPath = path.join(fixturesPath, '.sigil', 'workshop.json');
    workshop = JSON.parse(fs.readFileSync(workshopPath, 'utf-8'));
  });

  afterAll(() => {
    cleanupTestFixtures();
  });

  describe('findByZone', () => {
    it('finds critical zone components', () => {
      const results = findByZone('critical', {
        projectRoot: fixturesPath,
        workshop,
      });

      expect(results.length).toBe(2);
    });

    it('finds standard zone components', () => {
      const results = findByZone('standard', {
        projectRoot: fixturesPath,
        workshop,
      });

      expect(results.length).toBe(1);
      expect(results[0]).toContain('StatusBadge');
    });

    it('completes in <50ms', () => {
      const start = Date.now();
      findByZone('critical', {
        projectRoot: fixturesPath,
        workshop,
      });
      const elapsed = Date.now() - start;

      expect(elapsed).toBeLessThan(50);
    });
  });
});

// =============================================================================
// PHYSICS LOOKUP TESTS
// =============================================================================

describe('Physics Lookup', () => {
  let fixturesPath: string;
  let workshop: Workshop;

  beforeAll(async () => {
    fixturesPath = createTestFixtures();
    await buildWorkshop({ projectRoot: fixturesPath });
    const workshopPath = path.join(fixturesPath, '.sigil', 'workshop.json');
    workshop = JSON.parse(fs.readFileSync(workshopPath, 'utf-8'));
  });

  afterAll(() => {
    cleanupTestFixtures();
  });

  describe('findByPhysics', () => {
    it('finds deliberate physics components', () => {
      const results = findByPhysics('deliberate', {
        projectRoot: fixturesPath,
        workshop,
      });

      expect(results.length).toBe(2);
    });

    it('finds snappy physics components', () => {
      const results = findByPhysics('snappy', {
        projectRoot: fixturesPath,
        workshop,
      });

      expect(results.length).toBe(1);
    });

    it('completes in <50ms', () => {
      const start = Date.now();
      findByPhysics('deliberate', {
        projectRoot: fixturesPath,
        workshop,
      });
      const elapsed = Date.now() - start;

      expect(elapsed).toBeLessThan(50);
    });
  });
});

// =============================================================================
// VOCABULARY LOOKUP TESTS
// =============================================================================

describe('Vocabulary Lookup', () => {
  let fixturesPath: string;
  let workshop: Workshop;

  beforeAll(async () => {
    fixturesPath = createTestFixtures();
    await buildWorkshop({ projectRoot: fixturesPath });
    const workshopPath = path.join(fixturesPath, '.sigil', 'workshop.json');
    workshop = JSON.parse(fs.readFileSync(workshopPath, 'utf-8'));
  });

  afterAll(() => {
    cleanupTestFixtures();
  });

  describe('findByVocabulary', () => {
    it('finds claim vocabulary components', () => {
      const results = findByVocabulary('claim', {
        projectRoot: fixturesPath,
        workshop,
      });

      expect(results.length).toBe(2);
    });

    it('finds withdraw vocabulary components', () => {
      const results = findByVocabulary('withdraw', {
        projectRoot: fixturesPath,
        workshop,
      });

      expect(results.length).toBe(2);
    });

    it('finds status vocabulary components', () => {
      const results = findByVocabulary('status', {
        projectRoot: fixturesPath,
        workshop,
      });

      expect(results.length).toBe(1);
    });

    it('completes in <50ms', () => {
      const start = Date.now();
      findByVocabulary('claim', {
        projectRoot: fixturesPath,
        workshop,
      });
      const elapsed = Date.now() - start;

      expect(elapsed).toBeLessThan(50);
    });
  });
});

// =============================================================================
// COMBINED SEARCH TESTS
// =============================================================================

describe('Combined Search', () => {
  let fixturesPath: string;
  let workshop: Workshop;

  beforeAll(async () => {
    fixturesPath = createTestFixtures();
    await buildWorkshop({ projectRoot: fixturesPath });
    const workshopPath = path.join(fixturesPath, '.sigil', 'workshop.json');
    workshop = JSON.parse(fs.readFileSync(workshopPath, 'utf-8'));
  });

  afterAll(() => {
    cleanupTestFixtures();
  });

  describe('findComponents', () => {
    it('finds by multiple criteria', () => {
      const results = findComponents(
        { tier: 'gold', zone: 'critical' },
        { projectRoot: fixturesPath, workshop }
      );

      expect(results.length).toBe(2);
    });

    it('narrows with additional criteria', () => {
      const results = findComponents(
        { tier: 'gold', vocabulary: 'withdraw' },
        { projectRoot: fixturesPath, workshop }
      );

      expect(results.length).toBe(2);
    });
  });
});

// =============================================================================
// COMPONENT DETAILS TESTS
// =============================================================================

describe('Component Details', () => {
  let fixturesPath: string;
  let workshop: Workshop;

  beforeAll(async () => {
    fixturesPath = createTestFixtures();
    await buildWorkshop({ projectRoot: fixturesPath });
    const workshopPath = path.join(fixturesPath, '.sigil', 'workshop.json');
    workshop = JSON.parse(fs.readFileSync(workshopPath, 'utf-8'));
  });

  afterAll(() => {
    cleanupTestFixtures();
  });

  describe('getComponentDetails', () => {
    it('returns component entry for known path', () => {
      const components = listAllComponents({
        projectRoot: fixturesPath,
        workshop,
      });
      const claimButton = components.find(c => c.path.includes('ClaimButton'));

      expect(claimButton).toBeDefined();
      expect(claimButton!.tier).toBe('gold');
      expect(claimButton!.zone).toBe('critical');
    });
  });

  describe('listAllComponents', () => {
    it('returns all components', () => {
      const components = listAllComponents({
        projectRoot: fixturesPath,
        workshop,
      });

      expect(components.length).toBe(3);
    });
  });

  describe('getComponentStats', () => {
    it('returns tier counts', () => {
      const stats = getComponentStats({
        projectRoot: fixturesPath,
        workshop,
      });

      expect(stats.gold).toBe(2);
      expect(stats.silver).toBe(1);
      expect(stats.bronze).toBe(0);
      expect(stats.draft).toBe(0);
    });
  });
});

// =============================================================================
// PERFORMANCE TESTS
// =============================================================================

describe('Performance', () => {
  let fixturesPath: string;
  let workshop: Workshop;

  beforeAll(async () => {
    fixturesPath = createTestFixtures();
    await buildWorkshop({ projectRoot: fixturesPath });
    const workshopPath = path.join(fixturesPath, '.sigil', 'workshop.json');
    workshop = JSON.parse(fs.readFileSync(workshopPath, 'utf-8'));
  });

  afterAll(() => {
    cleanupTestFixtures();
  });

  it('all lookups complete in <50ms', () => {
    const start = Date.now();

    findByTier('gold', { projectRoot: fixturesPath, workshop });
    findByZone('critical', { projectRoot: fixturesPath, workshop });
    findByPhysics('deliberate', { projectRoot: fixturesPath, workshop });
    findByVocabulary('claim', { projectRoot: fixturesPath, workshop });

    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(50);
  });
});
