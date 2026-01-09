/**
 * @file v6-integration.test.ts
 * @description End-to-end integration tests for Sigil v6.0 "Native Muse"
 *
 * Tests the complete craft flow including:
 * - Workshop index building and querying
 * - Startup sentinel freshness checks
 * - Physics validation
 * - Virtual Sanctuary seeds
 * - Survival observation
 * - Ephemeral inspiration
 * - Forge mode
 * - Era management
 * - Craft log generation
 * - Cohesion auditing
 * - Agent orchestration
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

// Import all v6.0 modules
import {
  buildWorkshop,
  getPackageHash,
  getImportsHash,
} from '../../process/workshop-builder';

import {
  queryMaterial,
  queryComponent,
  queryPhysics,
  queryZone,
} from '../../process/workshop-query';

import {
  runStartupSentinel,
  quickRebuild,
  acquireRebuildLock,
  releaseRebuildLock,
} from '../../process/startup-sentinel';

import {
  findByTier,
  findByZone,
  findByVocabulary,
} from '../../process/sanctuary-scanner';

import {
  validateZoneConstraints,
  validateMaterialConstraints,
  validateApiCorrectness,
  validateFidelityCeiling,
} from '../../process/physics-validator';

import {
  loadSeed,
  selectSeed,
  checkFadedStatus,
  getVirtualComponent,
  AVAILABLE_SEEDS,
} from '../../process/seed-manager';

import {
  createEphemeralContext,
  extractStyles,
  generateWithInspiration,
  discardEphemeralContent,
} from '../../process/ephemeral-inspiration';

import {
  enableForgeMode,
  isForgeMode,
  disableForgeMode,
  validateInForgeMode,
} from '../../process/forge-mode';

import {
  createNewEra,
  archiveCurrentEra,
  getCurrentEra,
  getEraHistory,
} from '../../process/era-manager';

import {
  detectPatterns,
  updateSurvivalIndex,
  getPatternStatus,
  applyPromotionRules,
  PROMOTION_THRESHOLDS,
} from '../../process/survival-observer';

import {
  createSession,
  addDecision,
  addPhysicsCheck,
  writeCraftLog,
} from '../../process/chronicling-rationale';

import {
  extractProperties,
  calculateVariance,
  auditComponent,
  checkDeviationAnnotation,
  DEFAULT_THRESHOLDS,
} from '../../process/auditing-cohesion';

import {
  runCraftFlow,
  resolveContext,
  extractVocabularyTerms,
  resolveZoneFromVocabulary,
  resolvePhysicsFromZone,
} from '../../process/agent-orchestration';

// Mock file system
vi.mock('fs', async () => {
  const actual = await vi.importActual('fs');
  return {
    ...actual,
    existsSync: vi.fn(),
    readFileSync: vi.fn(),
    writeFileSync: vi.fn(),
    mkdirSync: vi.fn(),
    unlinkSync: vi.fn(),
  };
});

describe('Sigil v6.0 "Native Muse" Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ============================================================
  // Workshop Index Tests (Sprint 1)
  // ============================================================
  describe('Workshop Index', () => {
    it('builds workshop with all required sections', async () => {
      const mockPackageJson = JSON.stringify({
        dependencies: {
          'framer-motion': '^11.15.0',
        },
      });

      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue(mockPackageJson);
      vi.mocked(fs.writeFileSync).mockImplementation(() => {});

      const workshop = await buildWorkshop();

      expect(workshop).toHaveProperty('indexed_at');
      expect(workshop).toHaveProperty('package_hash');
      expect(workshop).toHaveProperty('imports_hash');
      expect(workshop).toHaveProperty('materials');
      expect(workshop).toHaveProperty('components');
      expect(workshop).toHaveProperty('physics');
      expect(workshop).toHaveProperty('zones');
    });

    it('queries workshop in <5ms', async () => {
      const mockWorkshop = {
        materials: {
          'framer-motion': { version: '11.15.0', exports: ['motion'] },
        },
      };

      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify(mockWorkshop));

      const start = performance.now();
      const result = queryMaterial('framer-motion');
      const elapsed = performance.now() - start;

      expect(elapsed).toBeLessThan(5);
      expect(result).toBeDefined();
    });

    it('detects staleness via package hash', () => {
      vi.mocked(fs.readFileSync).mockReturnValue('{"name":"test"}');

      const hash1 = getPackageHash();
      const hash2 = getPackageHash();

      expect(hash1).toBe(hash2);
      expect(hash1).toMatch(/^[a-f0-9]{32}$/);
    });
  });

  // ============================================================
  // Startup Sentinel Tests (Sprint 2)
  // ============================================================
  describe('Startup Sentinel', () => {
    it('skips rebuild when workshop is fresh', async () => {
      const mockWorkshop = {
        indexed_at: new Date().toISOString(),
        package_hash: 'abc123',
        imports_hash: 'def456',
      };

      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync)
        .mockReturnValueOnce(JSON.stringify(mockWorkshop))
        .mockReturnValueOnce('{"name":"test"}'); // package.json returns same hash

      const result = await runStartupSentinel();

      expect(result.rebuilt).toBe(false);
      expect(result.reason).toBe('fresh');
    });

    it('triggers rebuild when package hash changes', async () => {
      const mockWorkshop = {
        indexed_at: new Date().toISOString(),
        package_hash: 'old-hash',
        imports_hash: 'def456',
      };

      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync)
        .mockReturnValueOnce(JSON.stringify(mockWorkshop))
        .mockReturnValueOnce('{"name":"new-package"}'); // Different package.json

      const result = await runStartupSentinel();

      expect(result.rebuilt).toBe(true);
      expect(result.reason).toContain('package_hash');
    });

    it('handles rebuild locking', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(false);
      vi.mocked(fs.writeFileSync).mockImplementation(() => {});

      const acquired = await acquireRebuildLock();
      expect(acquired).toBe(true);

      releaseRebuildLock();
      expect(vi.mocked(fs.unlinkSync)).toHaveBeenCalled();
    });
  });

  // ============================================================
  // Discovery Skills Tests (Sprint 3)
  // ============================================================
  describe('Discovery Skills', () => {
    it('finds components by tier in <50ms', async () => {
      const start = performance.now();
      const results = await findByTier('gold');
      const elapsed = performance.now() - start;

      expect(elapsed).toBeLessThan(50);
      expect(Array.isArray(results)).toBe(true);
    });

    it('finds components by zone', async () => {
      const results = await findByZone('critical');
      expect(Array.isArray(results)).toBe(true);
    });

    it('finds components by vocabulary', async () => {
      const results = await findByVocabulary('claim');
      expect(Array.isArray(results)).toBe(true);
    });
  });

  // ============================================================
  // Physics Validation Tests (Sprint 5)
  // ============================================================
  describe('Physics Validation', () => {
    it('blocks critical zone with playful physics', () => {
      const result = validateZoneConstraints('critical', 'playful');

      expect(result.valid).toBe(false);
      expect(result.error).toContain('zone');
    });

    it('allows critical zone with deliberate physics', () => {
      const result = validateZoneConstraints('critical', 'deliberate');

      expect(result.valid).toBe(true);
    });

    it('blocks clay material with 0ms timing', () => {
      const result = validateMaterialConstraints('clay', 0);

      expect(result.valid).toBe(false);
    });

    it('validates API correctness', () => {
      const result = validateApiCorrectness('motion.animate');

      expect(result.valid).toBe(false);
      expect(result.suggestion).toContain('motion.div');
    });

    it('checks fidelity ceiling', () => {
      const result = validateFidelityCeiling('standard', { has3D: true });

      expect(result.valid).toBe(false);
      expect(result.error).toContain('fidelity');
    });
  });

  // ============================================================
  // Virtual Sanctuary Tests (Sprint 6)
  // ============================================================
  describe('Virtual Sanctuary', () => {
    it('has three available seeds', () => {
      expect(AVAILABLE_SEEDS).toContain('linear-like');
      expect(AVAILABLE_SEEDS).toContain('vercel-like');
      expect(AVAILABLE_SEEDS).toContain('stripe-like');
    });

    it('loads seed definition', () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue(`
seed: linear-like
physics:
  snappy:
    timing: 150
`);

      const seed = loadSeed('linear-like');

      expect(seed).toBeDefined();
      expect(seed.name).toBe('linear-like');
    });

    it('checks faded status for virtual components', () => {
      vi.mocked(fs.existsSync).mockReturnValue(true); // Real component exists

      const isFaded = checkFadedStatus('Button');

      expect(isFaded).toBe(true);
    });
  });

  // ============================================================
  // Ephemeral Inspiration Tests (Sprint 7)
  // ============================================================
  describe('Ephemeral Inspiration', () => {
    it('creates ephemeral context', () => {
      const context = createEphemeralContext();

      expect(context).toHaveProperty('forked');
      expect(context.forked).toBe(true);
      expect(context).toHaveProperty('survivalAccess');
      expect(context.survivalAccess).toBe(false);
    });

    it('extracts styles from content', () => {
      const mockContent = `
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        font-family: Inter, sans-serif;
      `;

      const styles = extractStyles(mockContent);

      expect(styles).toHaveProperty('colors');
      expect(styles).toHaveProperty('typography');
    });

    it('discards ephemeral content after use', () => {
      const context = createEphemeralContext();
      discardEphemeralContent(context);

      expect(context.discarded).toBe(true);
    });
  });

  // ============================================================
  // Forge Mode Tests (Sprint 8)
  // ============================================================
  describe('Forge Mode', () => {
    it('enables forge mode', () => {
      enableForgeMode();

      expect(isForgeMode()).toBe(true);
    });

    it('disables forge mode', () => {
      enableForgeMode();
      disableForgeMode();

      expect(isForgeMode()).toBe(false);
    });

    it('skips survival checks in forge mode', () => {
      enableForgeMode();

      const result = validateInForgeMode({
        checkSurvival: true,
        checkPhysics: true,
      });

      expect(result.survivalChecked).toBe(false);
      expect(result.physicsChecked).toBe(true);

      disableForgeMode();
    });
  });

  // ============================================================
  // Era Management Tests (Sprint 9)
  // ============================================================
  describe('Era Management', () => {
    it('creates new era', () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify({
        era: 'v1',
        patterns: {},
      }));
      vi.mocked(fs.writeFileSync).mockImplementation(() => {});
      vi.mocked(fs.mkdirSync).mockImplementation(() => undefined);

      const era = createNewEra('Tactile');

      expect(era.name).toBe('Tactile');
      expect(era.started).toBeDefined();
    });

    it('archives current era patterns', () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify({
        era: 'v1',
        patterns: {
          'animation:spring': { status: 'canonical', occurrences: 5 },
        },
      }));
      vi.mocked(fs.writeFileSync).mockImplementation(() => {});
      vi.mocked(fs.mkdirSync).mockImplementation(() => undefined);

      const archive = archiveCurrentEra();

      expect(archive.era).toBe('v1');
      expect(archive.patterns).toHaveProperty('animation:spring');
    });

    it('gets era history', () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify({
        era: 'v1',
        era_started: '2026-01-01',
      }));

      const history = getEraHistory();

      expect(Array.isArray(history)).toBe(true);
    });
  });

  // ============================================================
  // Survival Observation Tests (Sprint 10)
  // ============================================================
  describe('Survival Observation', () => {
    it('detects patterns in code', () => {
      const code = `
        const spring = useSpring({ from: 0, to: 1 });
        // @sigil-pattern: animation:spring-entrance (2026-01-08)
      `;

      const patterns = detectPatterns(code);

      expect(patterns).toContainEqual(expect.objectContaining({
        name: 'animation:spring-entrance',
      }));
    });

    it('applies promotion thresholds correctly', () => {
      expect(PROMOTION_THRESHOLDS.surviving).toBe(3);
      expect(PROMOTION_THRESHOLDS.canonical).toBe(5);
    });

    it('promotes patterns by occurrence count', () => {
      const patterns = {
        'animation:spring': { occurrences: 2, status: 'experimental' },
        'animation:fade': { occurrences: 4, status: 'experimental' },
        'animation:slide': { occurrences: 6, status: 'experimental' },
      };

      const promoted = applyPromotionRules(patterns);

      expect(promoted['animation:spring'].status).toBe('experimental');
      expect(promoted['animation:fade'].status).toBe('surviving');
      expect(promoted['animation:slide'].status).toBe('canonical');
    });
  });

  // ============================================================
  // Chronicling Rationale Tests (Sprint 11)
  // ============================================================
  describe('Chronicling Rationale', () => {
    it('creates craft session', () => {
      const session = createSession('Button', 'trustworthy button');

      expect(session).toHaveProperty('component');
      expect(session.component).toBe('Button');
      expect(session).toHaveProperty('request');
      expect(session).toHaveProperty('decisions');
    });

    it('adds decisions to session', () => {
      const session = createSession('Button', 'trustworthy button');
      addDecision(session, 'zone', 'critical', 'vocabulary: claim');

      expect(session.decisions).toHaveLength(1);
      expect(session.decisions[0].choice).toBe('critical');
    });

    it('generates craft log markdown', () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.writeFileSync).mockImplementation(() => {});
      vi.mocked(fs.mkdirSync).mockImplementation(() => undefined);

      const session = createSession('Button', 'trustworthy button');
      addDecision(session, 'zone', 'critical', 'vocabulary');
      addPhysicsCheck(session, 'zone_constraint', true);

      const log = writeCraftLog(session);

      expect(log).toContain('Button');
      expect(log).toContain('critical');
      expect(log).toContain('Physics Validated');
    });
  });

  // ============================================================
  // Auditing Cohesion Tests (Sprint 11)
  // ============================================================
  describe('Auditing Cohesion', () => {
    it('extracts visual properties', () => {
      const code = `
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        borderRadius: '8px',
        padding: '16px',
      `;

      const props = extractProperties(code);

      expect(props).toHaveProperty('shadow');
      expect(props).toHaveProperty('borderRadius');
      expect(props).toHaveProperty('spacing');
    });

    it('calculates variance correctly', () => {
      const variance = calculateVariance(10, 12);

      expect(variance).toBe(20); // 2/10 = 20%
    });

    it('uses default thresholds', () => {
      expect(DEFAULT_THRESHOLDS.shadow).toBe(20);
      expect(DEFAULT_THRESHOLDS['border-radius']).toBe(10);
      expect(DEFAULT_THRESHOLDS.spacing).toBe(15);
    });

    it('respects deviation annotations', () => {
      const code = `
        /**
         * @sigil-deviation shadow
         * Reason: Modal needs stronger shadow
         */
      `;

      const deviation = checkDeviationAnnotation(code, 'shadow');

      expect(deviation.hasDeviation).toBe(true);
      expect(deviation.reason).toContain('Modal');
    });
  });

  // ============================================================
  // Agent Orchestration Tests (Sprint 12)
  // ============================================================
  describe('Agent Orchestration', () => {
    it('extracts vocabulary terms from prompt', () => {
      const terms = extractVocabularyTerms('create a trustworthy claim button');

      expect(terms).toContain('claim');
    });

    it('resolves zone from vocabulary', () => {
      const zone = resolveZoneFromVocabulary(['claim', 'deposit']);

      expect(zone).toBe('critical');
    });

    it('resolves physics from zone', () => {
      const physics = resolvePhysicsFromZone('critical');

      expect(physics).toBe('deliberate');
    });

    it('resolves full context chain', () => {
      const context = resolveContext(
        'create a trustworthy claim button',
        'ClaimButton'
      );

      expect(context).toHaveProperty('vocabularyTerms');
      expect(context).toHaveProperty('zone');
      expect(context).toHaveProperty('physics');
    });

    it('runs complete craft flow', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify({
        indexed_at: new Date().toISOString(),
        package_hash: 'test',
        imports_hash: 'test',
        materials: {},
        components: {},
        physics: { deliberate: { timing: 800 } },
        zones: { critical: { physics: 'deliberate' } },
      }));
      vi.mocked(fs.writeFileSync).mockImplementation(() => {});
      vi.mocked(fs.mkdirSync).mockImplementation(() => undefined);

      const result = await runCraftFlow(
        'trustworthy claim button',
        'ClaimButton',
        { skipGeneration: true }
      );

      expect(result).toHaveProperty('phases');
      expect(result.phases).toHaveProperty('startup');
      expect(result.phases).toHaveProperty('discovery');
      expect(result.phases).toHaveProperty('context');
      expect(result.phases).toHaveProperty('validation');
    });
  });

  // ============================================================
  // Performance Benchmarks
  // ============================================================
  describe('Performance Benchmarks', () => {
    it('workshop query completes in <5ms', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify({
        materials: { test: { version: '1.0.0' } },
      }));

      const iterations = 100;
      const start = performance.now();

      for (let i = 0; i < iterations; i++) {
        queryMaterial('test');
      }

      const elapsed = performance.now() - start;
      const avgTime = elapsed / iterations;

      expect(avgTime).toBeLessThan(5);
    });

    it('context resolution completes in <5ms', () => {
      const iterations = 100;
      const start = performance.now();

      for (let i = 0; i < iterations; i++) {
        resolveContext('test prompt', 'TestComponent');
      }

      const elapsed = performance.now() - start;
      const avgTime = elapsed / iterations;

      expect(avgTime).toBeLessThan(5);
    });
  });

  // ============================================================
  // Integration Flow Tests
  // ============================================================
  describe('Full Integration Flow', () => {
    it('cold start with seed → craft → observe pattern', async () => {
      // Setup mocks for full flow
      vi.mocked(fs.existsSync)
        .mockReturnValueOnce(false)  // No sanctuary
        .mockReturnValueOnce(true)   // Seed exists
        .mockReturnValue(true);      // Other checks
      vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify({
        seed: 'linear-like',
        physics: { snappy: { timing: 150 } },
      }));
      vi.mocked(fs.writeFileSync).mockImplementation(() => {});
      vi.mocked(fs.mkdirSync).mockImplementation(() => undefined);

      // Load seed for cold start
      const seed = loadSeed('linear-like');
      expect(seed).toBeDefined();

      // Run craft flow
      const craftResult = await runCraftFlow(
        'minimal button',
        'Button',
        { skipGeneration: true }
      );
      expect(craftResult.phases.context).toBeDefined();

      // Observe pattern
      const code = '// @sigil-pattern: animation:snappy-click (2026-01-08)';
      const patterns = detectPatterns(code);
      expect(patterns.length).toBeGreaterThan(0);
    });

    it('forge mode → explore → keep/discard', async () => {
      // Enable forge mode
      enableForgeMode();
      expect(isForgeMode()).toBe(true);

      // Validate skips survival
      const validation = validateInForgeMode({
        checkSurvival: true,
        checkPhysics: true,
      });
      expect(validation.survivalChecked).toBe(false);
      expect(validation.physicsChecked).toBe(true);

      // Disable forge mode (simulating "keep")
      disableForgeMode();
      expect(isForgeMode()).toBe(false);
    });

    it('new era → archive → fresh tracking', () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify({
        era: 'v1',
        patterns: {
          'animation:spring': { status: 'canonical', occurrences: 7 },
        },
      }));
      vi.mocked(fs.writeFileSync).mockImplementation(() => {});
      vi.mocked(fs.mkdirSync).mockImplementation(() => undefined);

      // Archive current era
      const archive = archiveCurrentEra();
      expect(archive.patterns).toHaveProperty('animation:spring');

      // Create new era
      const newEra = createNewEra('Tactile');
      expect(newEra.name).toBe('Tactile');
    });
  });
});
