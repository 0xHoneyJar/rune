/**
 * @sigil-tier gold
 * @file v61-integration.test.ts
 * @description End-to-end integration tests for Sigil v6.1 "Agile Muse"
 *
 * Tests the v6.1 quality gate features:
 * - Vocabulary integration (vocabulary.yaml instead of hardcoded terms)
 * - Taste-key curation (canonical-candidate status, approval workflow)
 * - Hard eviction for Virtual Sanctuary
 * - Cache coherence across processes
 *
 * @module __tests__/e2e/v61-integration
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

// Import v6.1 modules
import {
  // Curated promotion
  determineStatusWithCuration,
  loadTasteKeyConfig,
  saveTasteKeyConfig,
  isPatternApproved,
  isPatternRejected,
  isPatternPending,
  addPendingPromotion,
  approvePromotion,
  rejectPromotion,
  getPendingPromotions,
  TASTE_KEY_PATH,
  // Existing survival functions
  loadSurvivalIndex,
  saveSurvivalIndex,
  SURVIVAL_PATH,
} from '../../process/survival-observer';

import {
  // Hard eviction
  loadSeedWithEviction,
  isSeedEvicted,
  queryVirtualComponentWithEviction,
  resetSeed,
  getEvictionStatus,
  // Existing seed functions
  loadSeed,
  saveSeed,
  isSanctuaryEmpty,
  DEFAULT_SEED_PATH,
} from '../../process/seed-manager';

import {
  // Vocabulary integration
  loadVocabulary,
  clearVocabularyCache,
  extractVocabularyTerms,
  resolveZoneFromVocabulary,
  resolvePhysicsFromVocabulary,
} from '../../process/agent-orchestration';

// =============================================================================
// TEST SETUP
// =============================================================================

const TEST_DIR = path.join(process.cwd(), '.test-v61-integration');

function createTestStructure() {
  // Create directories
  fs.mkdirSync(path.join(TEST_DIR, '.sigil'), { recursive: true });
  fs.mkdirSync(path.join(TEST_DIR, 'sigil-mark', 'vocabulary'), { recursive: true });
  fs.mkdirSync(path.join(TEST_DIR, '.claude', 'skills', 'seeding-sanctuary', 'seeds'), {
    recursive: true,
  });

  // Create vocabulary.yaml
  const vocabulary = {
    version: '6.1.0',
    zones: {
      critical: {
        terms: [
          { id: 'claim', user_facing: 'Claim', physics: 'deliberate' },
          { id: 'deposit', user_facing: 'Deposit', physics: 'deliberate' },
          { id: 'withdraw', user_facing: 'Withdraw', physics: 'deliberate' },
        ],
      },
      standard: {
        terms: [
          { id: 'browse', user_facing: 'Browse', physics: 'warm' },
          { id: 'search', user_facing: 'Search', physics: 'warm' },
        ],
      },
      marketing: {
        terms: [{ id: 'explore', user_facing: 'Explore', physics: 'playful' }],
      },
    },
  };
  fs.writeFileSync(
    path.join(TEST_DIR, 'sigil-mark', 'vocabulary', 'vocabulary.yaml'),
    yaml.dump(vocabulary)
  );

  // Create seed template
  const seedTemplate = {
    seed: 'linear',
    physics: {
      critical: 'deliberate',
      marketing: 'playful',
      default: 'warm',
    },
    materials: {
      primary: '#0066FF',
      background: '#FFFFFF',
    },
    typography: {
      family: 'Inter',
      base_size: 14,
    },
    spacing: {
      scale: [4, 8, 12, 16, 24, 32, 48],
    },
    virtual_components: {
      Button: {
        tier: 'gold',
        zone: 'critical',
        vocabulary: ['claim', 'submit'],
      },
      Card: {
        tier: 'silver',
        zone: 'standard',
        vocabulary: ['browse'],
      },
      Hero: {
        tier: 'silver',
        zone: 'marketing',
        vocabulary: ['explore'],
      },
    },
  };
  fs.writeFileSync(
    path.join(TEST_DIR, '.claude', 'skills', 'seeding-sanctuary', 'seeds', 'linear.yaml'),
    yaml.dump(seedTemplate)
  );
}

beforeEach(() => {
  if (fs.existsSync(TEST_DIR)) {
    fs.rmSync(TEST_DIR, { recursive: true });
  }
  createTestStructure();
  clearVocabularyCache();
});

afterEach(() => {
  if (fs.existsSync(TEST_DIR)) {
    fs.rmSync(TEST_DIR, { recursive: true });
  }
  clearVocabularyCache();
});

// =============================================================================
// VOCABULARY INTEGRATION TESTS (S2-T1)
// =============================================================================

describe('Vocabulary Integration', () => {
  describe('loadVocabulary', () => {
    it('loads vocabulary from vocabulary.yaml', () => {
      const vocabulary = loadVocabulary(TEST_DIR);

      expect(vocabulary).toBeDefined();
      expect(vocabulary.zones).toBeDefined();
      expect(vocabulary.zones.critical).toBeDefined();
      expect(vocabulary.zones.critical.terms.length).toBe(3);
    });

    it('caches vocabulary for repeated calls', () => {
      const vocab1 = loadVocabulary(TEST_DIR);
      const vocab2 = loadVocabulary(TEST_DIR);

      // Same reference = cached
      expect(vocab1).toBe(vocab2);
    });

    it('clears cache properly', () => {
      const vocab1 = loadVocabulary(TEST_DIR);
      clearVocabularyCache();
      const vocab2 = loadVocabulary(TEST_DIR);

      // Different references after cache clear
      expect(vocab1).not.toBe(vocab2);
      // But same content
      expect(vocab1.version).toBe(vocab2.version);
    });
  });

  describe('extractVocabularyTerms', () => {
    it('extracts terms from prompt using vocabulary.yaml', () => {
      const terms = extractVocabularyTerms('create a claim button', TEST_DIR);

      expect(terms).toContain('claim');
    });

    it('matches user-facing terms case-insensitively', () => {
      const terms = extractVocabularyTerms('let user DEPOSIT funds', TEST_DIR);

      expect(terms).toContain('deposit');
    });

    it('extracts multiple terms', () => {
      const terms = extractVocabularyTerms('claim and withdraw actions', TEST_DIR);

      expect(terms).toContain('claim');
      expect(terms).toContain('withdraw');
    });

    it('returns empty for no matches', () => {
      const terms = extractVocabularyTerms('random text with no terms', TEST_DIR);

      expect(terms).toHaveLength(0);
    });
  });

  describe('resolveZoneFromVocabulary', () => {
    it('resolves zone from vocabulary terms', () => {
      const zone = resolveZoneFromVocabulary(['claim', 'deposit'], TEST_DIR);

      expect(zone).toBe('critical');
    });

    it('resolves marketing zone', () => {
      const zone = resolveZoneFromVocabulary(['explore'], TEST_DIR);

      expect(zone).toBe('marketing');
    });

    it('returns standard for unknown terms', () => {
      const zone = resolveZoneFromVocabulary(['unknown'], TEST_DIR);

      expect(zone).toBe('standard');
    });

    it('prioritizes critical over other zones', () => {
      // When terms from multiple zones, critical wins
      const zone = resolveZoneFromVocabulary(['claim', 'browse'], TEST_DIR);

      expect(zone).toBe('critical');
    });
  });

  describe('resolvePhysicsFromVocabulary', () => {
    it('resolves physics from term', () => {
      const physics = resolvePhysicsFromVocabulary('claim', TEST_DIR);

      expect(physics).toBe('deliberate');
    });

    it('resolves playful physics for marketing', () => {
      const physics = resolvePhysicsFromVocabulary('explore', TEST_DIR);

      expect(physics).toBe('playful');
    });

    it('returns warm for unknown terms', () => {
      const physics = resolvePhysicsFromVocabulary('unknown', TEST_DIR);

      expect(physics).toBe('warm');
    });
  });
});

// =============================================================================
// TASTE-KEY CURATION TESTS (S2-T2 through S2-T6)
// =============================================================================

describe('Taste-Key Curation', () => {
  describe('determineStatusWithCuration', () => {
    it('returns experimental for 1-2 occurrences', () => {
      expect(determineStatusWithCuration(1)).toBe('experimental');
      expect(determineStatusWithCuration(2)).toBe('experimental');
    });

    it('returns surviving for 3-4 occurrences', () => {
      expect(determineStatusWithCuration(3)).toBe('surviving');
      expect(determineStatusWithCuration(4)).toBe('surviving');
    });

    it('returns canonical-candidate for 5+ without approval', () => {
      expect(determineStatusWithCuration(5, false)).toBe('canonical-candidate');
      expect(determineStatusWithCuration(10, false)).toBe('canonical-candidate');
    });

    it('returns canonical for 5+ with approval', () => {
      expect(determineStatusWithCuration(5, true)).toBe('canonical');
      expect(determineStatusWithCuration(10, true)).toBe('canonical');
    });
  });

  describe('Taste-Key Config', () => {
    it('creates default config when none exists', () => {
      const config = loadTasteKeyConfig(TEST_DIR);

      expect(config).toBeDefined();
      expect(config.version).toBe('6.1.0');
      expect(config.pending_promotions).toEqual([]);
      expect(config.approved).toEqual([]);
      expect(config.rejected).toEqual([]);
    });

    it('saves and loads config', () => {
      const config = {
        version: '6.1.0',
        holder: 'test-user',
        pending_promotions: [],
        approved: [{ pattern: 'test-pattern', approved_by: 'user', approved_at: '2026-01-08' }],
        rejected: [],
      };

      saveTasteKeyConfig(config, TEST_DIR);
      const loaded = loadTasteKeyConfig(TEST_DIR);

      expect(loaded.holder).toBe('test-user');
      expect(loaded.approved).toHaveLength(1);
      expect(loaded.approved[0].pattern).toBe('test-pattern');
    });
  });

  describe('Pattern Approval Workflow', () => {
    it('adds pending promotion', () => {
      const entry = {
        occurrences: 5,
        first_seen: '2026-01-01',
        last_seen: '2026-01-08',
        files: ['Button.tsx', 'Card.tsx'],
        status: 'canonical-candidate' as const,
      };

      const result = addPendingPromotion('spring-animation', entry, TEST_DIR);

      expect(result).toBe(true);

      const config = loadTasteKeyConfig(TEST_DIR);
      expect(config.pending_promotions).toHaveLength(1);
      expect(config.pending_promotions[0].pattern).toBe('spring-animation');
      expect(config.pending_promotions[0].occurrences).toBe(5);
    });

    it('gets pending promotions', () => {
      const entry = {
        occurrences: 6,
        first_seen: '2026-01-01',
        last_seen: '2026-01-08',
        files: ['Modal.tsx'],
        status: 'canonical-candidate' as const,
      };
      addPendingPromotion('fade-animation', entry, TEST_DIR);

      const pending = getPendingPromotions(TEST_DIR);

      expect(pending).toHaveLength(1);
      expect(pending[0].pattern).toBe('fade-animation');
    });

    it('checks if pattern is pending', () => {
      addPendingPromotion(
        'test-pattern',
        { occurrences: 5, first_seen: '', last_seen: '', files: [], status: 'canonical-candidate' },
        TEST_DIR
      );

      expect(isPatternPending('test-pattern', TEST_DIR)).toBe(true);
      expect(isPatternPending('other-pattern', TEST_DIR)).toBe(false);
    });

    it('approves pending promotion', () => {
      addPendingPromotion(
        'spring-animation',
        { occurrences: 7, first_seen: '', last_seen: '', files: [], status: 'canonical-candidate' },
        TEST_DIR
      );

      const result = approvePromotion('spring-animation', 'taste-key-holder', 'Great pattern', TEST_DIR);

      expect(result).toBe(true);

      const config = loadTasteKeyConfig(TEST_DIR);
      expect(config.pending_promotions).toHaveLength(0);
      expect(config.approved).toHaveLength(1);
      expect(config.approved[0].pattern).toBe('spring-animation');
      expect(config.approved[0].approved_by).toBe('taste-key-holder');
    });

    it('rejects pending promotion', () => {
      addPendingPromotion(
        'bad-pattern',
        { occurrences: 5, first_seen: '', last_seen: '', files: [], status: 'canonical-candidate' },
        TEST_DIR
      );

      const result = rejectPromotion('bad-pattern', 'taste-key-holder', 'Not aligned', TEST_DIR);

      expect(result).toBe(true);

      const config = loadTasteKeyConfig(TEST_DIR);
      expect(config.pending_promotions).toHaveLength(0);
      expect(config.rejected).toHaveLength(1);
      expect(config.rejected[0].pattern).toBe('bad-pattern');
      expect(config.rejected[0].reason).toBe('Not aligned');
    });

    it('checks if pattern is approved', () => {
      addPendingPromotion(
        'approved-pattern',
        { occurrences: 5, first_seen: '', last_seen: '', files: [], status: 'canonical-candidate' },
        TEST_DIR
      );
      approvePromotion('approved-pattern', 'user', undefined, TEST_DIR);

      expect(isPatternApproved('approved-pattern', TEST_DIR)).toBe(true);
      expect(isPatternApproved('unapproved-pattern', TEST_DIR)).toBe(false);
    });

    it('checks if pattern is rejected', () => {
      addPendingPromotion(
        'rejected-pattern',
        { occurrences: 5, first_seen: '', last_seen: '', files: [], status: 'canonical-candidate' },
        TEST_DIR
      );
      rejectPromotion('rejected-pattern', 'user', 'Bad', TEST_DIR);

      expect(isPatternRejected('rejected-pattern', TEST_DIR)).toBe(true);
      expect(isPatternRejected('other-pattern', TEST_DIR)).toBe(false);
    });
  });

  describe('Full Promotion Lifecycle', () => {
    it('experimental → surviving → canonical-candidate → canonical', () => {
      // Create survival index with experimental pattern
      const survivalPath = path.join(TEST_DIR, SURVIVAL_PATH);
      const initialIndex = {
        era: 'v1',
        era_started: '2026-01-01',
        patterns: {
          survived: {
            'spring-animation': {
              occurrences: 2,
              first_seen: '2026-01-01',
              last_seen: '2026-01-08',
              files: ['Button.tsx'],
              status: 'experimental',
            },
          },
          canonical: [],
          rejected: [],
        },
      };
      fs.writeFileSync(survivalPath, JSON.stringify(initialIndex, null, 2));

      // Step 1: Status is experimental at 2 occurrences
      let status = determineStatusWithCuration(2);
      expect(status).toBe('experimental');

      // Step 2: Status becomes surviving at 3-4 occurrences
      status = determineStatusWithCuration(4);
      expect(status).toBe('surviving');

      // Step 3: Status becomes canonical-candidate at 5+ (no approval)
      status = determineStatusWithCuration(5, false);
      expect(status).toBe('canonical-candidate');

      // Step 4: Add to pending promotions
      addPendingPromotion(
        'spring-animation',
        { occurrences: 5, first_seen: '', last_seen: '', files: [], status: 'canonical-candidate' },
        TEST_DIR
      );
      expect(isPatternPending('spring-animation', TEST_DIR)).toBe(true);

      // Step 5: Approve promotion
      approvePromotion('spring-animation', 'taste-key', undefined, TEST_DIR);
      expect(isPatternApproved('spring-animation', TEST_DIR)).toBe(true);

      // Step 6: Status is now canonical with approval
      status = determineStatusWithCuration(5, true);
      expect(status).toBe('canonical');
    });
  });
});

// =============================================================================
// HARD EVICTION TESTS (S2-T7)
// =============================================================================

describe('Hard Eviction for Virtual Sanctuary', () => {
  beforeEach(() => {
    // Create seed file
    const seedPath = path.join(TEST_DIR, DEFAULT_SEED_PATH);
    const seed = {
      seed: 'linear',
      physics: { critical: 'deliberate', default: 'warm' },
      materials: { primary: '#0066FF' },
      typography: { family: 'Inter', base_size: 14 },
      spacing: { scale: [4, 8, 16] },
      virtual_components: {
        Button: { tier: 'gold', zone: 'critical', vocabulary: ['claim'] },
        Card: { tier: 'silver', zone: 'standard', vocabulary: ['browse'] },
      },
    };
    fs.writeFileSync(seedPath, yaml.dump(seed));
  });

  describe('loadSeedWithEviction', () => {
    it('returns seed normally when Sanctuary is empty', () => {
      const seed = loadSeedWithEviction(TEST_DIR);

      expect(seed).toBeDefined();
      expect(Object.keys(seed!.virtual_components).length).toBe(2);
    });

    it('evicts ALL virtual components when ANY real component exists', () => {
      // Create a real component
      const sanctuaryPath = path.join(TEST_DIR, 'src', 'sanctuary');
      fs.mkdirSync(sanctuaryPath, { recursive: true });
      fs.writeFileSync(
        path.join(sanctuaryPath, 'Button.tsx'),
        '// @sigil-tier gold\nexport const Button = () => <button>Click</button>;'
      );

      const seed = loadSeedWithEviction(TEST_DIR);

      expect(seed).toBeDefined();
      expect(isSeedEvicted(seed!)).toBe(true);
      expect(Object.keys(seed!.virtual_components).length).toBe(0);
    });

    it('persists eviction status to seed.yaml', () => {
      // Create real component
      const sanctuaryPath = path.join(TEST_DIR, 'src', 'sanctuary');
      fs.mkdirSync(sanctuaryPath, { recursive: true });
      fs.writeFileSync(
        path.join(sanctuaryPath, 'Card.tsx'),
        '// @sigil-tier silver\nexport const Card = () => <div>Card</div>;'
      );

      loadSeedWithEviction(TEST_DIR);

      // Reload seed directly to verify persistence
      const reloaded = loadSeed(TEST_DIR);
      expect((reloaded as any).status).toBe('evicted');
      expect((reloaded as any).original_component_count).toBe(2);
    });
  });

  describe('isSeedEvicted', () => {
    it('returns true for evicted seed', () => {
      const evictedSeed = {
        seed: 'linear',
        physics: {},
        materials: {},
        typography: {},
        spacing: { scale: [] },
        virtual_components: {},
        status: 'evicted',
        evicted_at: '2026-01-08T12:00:00Z',
        original_component_count: 3,
      };

      expect(isSeedEvicted(evictedSeed as any)).toBe(true);
    });

    it('returns false for normal seed', () => {
      const normalSeed = {
        seed: 'linear',
        physics: {},
        materials: {},
        typography: {},
        spacing: { scale: [] },
        virtual_components: { Button: { tier: 'gold', zone: 'critical', vocabulary: [] } },
      };

      expect(isSeedEvicted(normalSeed as any)).toBe(false);
    });
  });

  describe('queryVirtualComponentWithEviction', () => {
    it('returns virtual component when not evicted', () => {
      const result = queryVirtualComponentWithEviction(TEST_DIR, 'Button');

      expect(result.found).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data!.tier).toBe('gold');
    });

    it('returns not found when evicted', () => {
      // Create real component to trigger eviction
      const sanctuaryPath = path.join(TEST_DIR, 'src', 'sanctuary');
      fs.mkdirSync(sanctuaryPath, { recursive: true });
      fs.writeFileSync(path.join(sanctuaryPath, 'Button.tsx'), '// @sigil-tier gold\nexport const Button = () => <button/>;');

      const result = queryVirtualComponentWithEviction(TEST_DIR, 'Button');

      expect(result.found).toBe(false);
      expect(result.faded).toBe(true);
    });
  });

  describe('getEvictionStatus', () => {
    it('returns not evicted for normal seed', () => {
      const status = getEvictionStatus(TEST_DIR);

      expect(status.evicted).toBe(false);
    });

    it('returns eviction details when evicted', () => {
      // Create real component
      const sanctuaryPath = path.join(TEST_DIR, 'src', 'sanctuary');
      fs.mkdirSync(sanctuaryPath, { recursive: true });
      fs.writeFileSync(path.join(sanctuaryPath, 'Button.tsx'), '// @sigil-tier gold\nexport const Button = () => <button/>;');

      // Trigger eviction
      loadSeedWithEviction(TEST_DIR);

      const status = getEvictionStatus(TEST_DIR);

      expect(status.evicted).toBe(true);
      expect(status.originalCount).toBe(2);
      expect(status.evictedAt).toBeDefined();
    });
  });

  describe('resetSeed', () => {
    it('restores virtual components after cleanup', () => {
      // First, trigger eviction
      const sanctuaryPath = path.join(TEST_DIR, 'src', 'sanctuary');
      fs.mkdirSync(sanctuaryPath, { recursive: true });
      fs.writeFileSync(path.join(sanctuaryPath, 'Button.tsx'), '// @sigil-tier gold\nexport const Button = () => <button/>;');
      loadSeedWithEviction(TEST_DIR);

      // Remove real component
      fs.rmSync(sanctuaryPath, { recursive: true });

      // Reset seed
      const result = resetSeed('linear', TEST_DIR);

      expect(result.success).toBe(true);

      // Check virtual components restored
      const seed = loadSeed(TEST_DIR);
      expect(Object.keys(seed!.virtual_components).length).toBe(2);
    });

    it('fails to reset when real components exist', () => {
      const sanctuaryPath = path.join(TEST_DIR, 'src', 'sanctuary');
      fs.mkdirSync(sanctuaryPath, { recursive: true });
      fs.writeFileSync(path.join(sanctuaryPath, 'Button.tsx'), '// @sigil-tier gold\nexport const Button = () => <button/>;');

      const result = resetSeed('linear', TEST_DIR);

      expect(result.success).toBe(false);
      expect(result.warning).toContain('Real components exist');
    });

    it('allows force reset even with real components', () => {
      const sanctuaryPath = path.join(TEST_DIR, 'src', 'sanctuary');
      fs.mkdirSync(sanctuaryPath, { recursive: true });
      fs.writeFileSync(path.join(sanctuaryPath, 'Button.tsx'), '// @sigil-tier gold\nexport const Button = () => <button/>;');

      // Force reset
      const result = resetSeed('linear', TEST_DIR, true);

      expect(result.success).toBe(true);
    });

    it('fails for non-existent seed', () => {
      const result = resetSeed('nonexistent' as any, TEST_DIR);

      expect(result.success).toBe(false);
      expect(result.warning).toContain('not found');
    });
  });
});

// =============================================================================
// CACHE COHERENCE TESTS (S2-T9)
// =============================================================================

describe('Cache Coherence', () => {
  describe('Vocabulary Cache', () => {
    it('maintains coherence across multiple calls', () => {
      const vocab1 = loadVocabulary(TEST_DIR);
      const vocab2 = loadVocabulary(TEST_DIR);

      // Should be same reference (cached)
      expect(vocab1).toBe(vocab2);

      // Modifications to one affect the other (same object)
      const terms1 = extractVocabularyTerms('claim action', TEST_DIR);
      const terms2 = extractVocabularyTerms('claim action', TEST_DIR);

      expect(terms1).toEqual(terms2);
    });

    it('invalidates cache when path changes', () => {
      const vocab1 = loadVocabulary(TEST_DIR);

      // Create different vocabulary in different path
      const altDir = path.join(TEST_DIR, 'alt');
      fs.mkdirSync(path.join(altDir, 'sigil-mark', 'vocabulary'), { recursive: true });
      fs.writeFileSync(
        path.join(altDir, 'sigil-mark', 'vocabulary', 'vocabulary.yaml'),
        yaml.dump({ version: '6.1.1', zones: {} })
      );

      const vocab2 = loadVocabulary(altDir);

      // Different objects for different paths
      expect(vocab1).not.toBe(vocab2);
      expect(vocab1.version).toBe('6.1.0');
      expect(vocab2.version).toBe('6.1.1');
    });
  });

  describe('Survival Index Coherence', () => {
    it('maintains coherence when loaded multiple times', () => {
      // Create initial index
      const survivalPath = path.join(TEST_DIR, SURVIVAL_PATH);
      const initialIndex = {
        era: 'v1',
        patterns: {
          survived: { test: { occurrences: 3, files: [], status: 'surviving' } },
          canonical: [],
          rejected: [],
        },
      };
      fs.writeFileSync(survivalPath, JSON.stringify(initialIndex));

      const index1 = loadSurvivalIndex(TEST_DIR);
      const index2 = loadSurvivalIndex(TEST_DIR);

      // Same data (loaded from same file)
      expect(index1.patterns.survived.test.occurrences).toBe(
        index2.patterns.survived.test.occurrences
      );
    });
  });

  describe('Taste-Key Config Coherence', () => {
    it('maintains coherence between save and load', () => {
      const config = {
        version: '6.1.0',
        holder: 'test',
        pending_promotions: [
          { pattern: 'test', occurrences: 5, files: [], first_seen: '', last_seen: '' },
        ],
        approved: [],
        rejected: [],
      };

      saveTasteKeyConfig(config, TEST_DIR);
      const loaded = loadTasteKeyConfig(TEST_DIR);

      expect(loaded.pending_promotions).toHaveLength(1);
      expect(loaded.pending_promotions[0].pattern).toBe('test');
    });
  });
});

// =============================================================================
// FULL CRAFT FLOW WITH v6.1 FEATURES
// =============================================================================

describe('Full Craft Flow with v6.1 Features', () => {
  it('complete flow: vocabulary → context → validation → curation', () => {
    // Step 1: Extract vocabulary from prompt
    const terms = extractVocabularyTerms('create a claim button for deposits', TEST_DIR);
    expect(terms).toContain('claim');
    expect(terms).toContain('deposit');

    // Step 2: Resolve zone from vocabulary
    const zone = resolveZoneFromVocabulary(terms, TEST_DIR);
    expect(zone).toBe('critical');

    // Step 3: Resolve physics from term
    const physics = resolvePhysicsFromVocabulary('claim', TEST_DIR);
    expect(physics).toBe('deliberate');

    // Step 4: Check if pattern is canonical-candidate
    const status = determineStatusWithCuration(5, false);
    expect(status).toBe('canonical-candidate');

    // Step 5: Add to pending if needed
    if (status === 'canonical-candidate') {
      addPendingPromotion(
        'claim-button-pattern',
        {
          occurrences: 5,
          first_seen: '2026-01-01',
          last_seen: '2026-01-08',
          files: ['ClaimButton.tsx'],
          status: 'canonical-candidate',
        },
        TEST_DIR
      );
    }

    // Step 6: Verify pending
    expect(isPatternPending('claim-button-pattern', TEST_DIR)).toBe(true);

    // Step 7: Approve via taste-key
    approvePromotion('claim-button-pattern', 'taste-key-holder', 'Approved', TEST_DIR);

    // Step 8: Verify canonical
    expect(isPatternApproved('claim-button-pattern', TEST_DIR)).toBe(true);
    const finalStatus = determineStatusWithCuration(5, true);
    expect(finalStatus).toBe('canonical');
  });

  it('cold start → eviction lifecycle', () => {
    // Step 1: Cold start with seed
    expect(isSanctuaryEmpty(TEST_DIR)).toBe(true);

    // Step 2: Load seed with virtual components
    const seedPath = path.join(TEST_DIR, DEFAULT_SEED_PATH);
    const seed = {
      seed: 'linear',
      physics: { critical: 'deliberate', default: 'warm' },
      materials: { primary: '#0066FF' },
      typography: { family: 'Inter', base_size: 14 },
      spacing: { scale: [4, 8, 16] },
      virtual_components: {
        Button: { tier: 'gold', zone: 'critical', vocabulary: ['claim'] },
        Card: { tier: 'silver', zone: 'standard', vocabulary: ['browse'] },
      },
    };
    fs.writeFileSync(seedPath, yaml.dump(seed));

    // Step 3: Query virtual component (available)
    let result = queryVirtualComponentWithEviction(TEST_DIR, 'Button');
    expect(result.found).toBe(true);

    // Step 4: Create first real component
    const sanctuaryPath = path.join(TEST_DIR, 'src', 'sanctuary');
    fs.mkdirSync(sanctuaryPath, { recursive: true });
    fs.writeFileSync(
      path.join(sanctuaryPath, 'Button.tsx'),
      '// @sigil-tier gold\nexport const Button = () => <button>Real</button>;'
    );

    // Step 5: Query again - eviction triggered
    result = queryVirtualComponentWithEviction(TEST_DIR, 'Button');
    expect(result.found).toBe(false);
    expect(result.faded).toBe(true);

    // Step 6: Check eviction status
    const status = getEvictionStatus(TEST_DIR);
    expect(status.evicted).toBe(true);
    expect(status.originalCount).toBe(2);

    // Step 7: Remove real components
    fs.rmSync(sanctuaryPath, { recursive: true });

    // Step 8: Reset seed
    const resetResult = resetSeed('linear', TEST_DIR);
    expect(resetResult.success).toBe(true);

    // Step 9: Virtual components restored
    result = queryVirtualComponentWithEviction(TEST_DIR, 'Button');
    expect(result.found).toBe(true);
  });
});

// =============================================================================
// PERFORMANCE TESTS
// =============================================================================

describe('Performance', () => {
  it('vocabulary lookup in <5ms', () => {
    const iterations = 100;
    const start = performance.now();

    for (let i = 0; i < iterations; i++) {
      extractVocabularyTerms('claim deposit withdraw', TEST_DIR);
    }

    const elapsed = performance.now() - start;
    const avgTime = elapsed / iterations;

    expect(avgTime).toBeLessThan(5);
  });

  it('zone resolution in <2ms', () => {
    // Pre-warm cache
    loadVocabulary(TEST_DIR);

    const iterations = 100;
    const start = performance.now();

    for (let i = 0; i < iterations; i++) {
      resolveZoneFromVocabulary(['claim', 'deposit'], TEST_DIR);
    }

    const elapsed = performance.now() - start;
    const avgTime = elapsed / iterations;

    expect(avgTime).toBeLessThan(2);
  });

  it('taste-key lookup in <5ms', () => {
    // Setup some data
    addPendingPromotion(
      'test-pattern',
      { occurrences: 5, first_seen: '', last_seen: '', files: [], status: 'canonical-candidate' },
      TEST_DIR
    );
    approvePromotion('test-pattern', 'user', undefined, TEST_DIR);

    const iterations = 100;
    const start = performance.now();

    for (let i = 0; i < iterations; i++) {
      isPatternApproved('test-pattern', TEST_DIR);
    }

    const elapsed = performance.now() - start;
    const avgTime = elapsed / iterations;

    expect(avgTime).toBeLessThan(5);
  });

  it('eviction check in <10ms', () => {
    const iterations = 50;
    const start = performance.now();

    for (let i = 0; i < iterations; i++) {
      loadSeedWithEviction(TEST_DIR);
    }

    const elapsed = performance.now() - start;
    const avgTime = elapsed / iterations;

    expect(avgTime).toBeLessThan(10);
  });
});
