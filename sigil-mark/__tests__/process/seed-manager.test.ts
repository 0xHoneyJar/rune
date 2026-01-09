/**
 * @sigil-tier gold
 * Sigil v6.0 — Seed Manager Tests
 *
 * Tests for virtual Sanctuary seed management.
 *
 * @module __tests__/process/seed-manager
 */

import {
  loadSeed,
  loadSeedFromLibrary,
  saveSeed,
  selectSeed,
  isSanctuaryEmpty,
  markAsFaded,
  isFaded,
  clearFadedCache,
  queryVirtualComponent,
  getAllVirtualComponents,
  findVirtualByTier,
  findVirtualByZone,
  findVirtualByVocabulary,
  getSeedPhysics,
  getSeedMaterial,
  getSeedTypography,
  getSeedSpacing,
  ensureSeedContext,
  getSeedOptions,
} from '../../process/seed-manager';
import { Seed, VirtualComponent } from '../../types/seed';

// =============================================================================
// TEST FIXTURES
// =============================================================================

const createMockSeed = (): Seed => ({
  seed: 'test-seed',
  version: '1.0.0',
  description: 'Test seed for unit tests',
  physics: {
    default: 'smooth',
    critical: 'deliberate',
    marketing: 'playful',
    admin: 'snappy',
  },
  materials: {
    background: '#000000',
    surface: '#111111',
    text: '#FFFFFF',
    muted: '#666666',
    accent: '#0066CC',
  },
  typography: {
    font_family: 'Inter',
    base_size: '14px',
    scale: 1.25,
  },
  spacing: {
    unit: '4px',
    scale: [4, 8, 16, 24, 32, 48, 64],
  },
  virtual_components: {
    Button: {
      tier: 'gold',
      zone: 'standard',
      physics: 'snappy',
      vocabulary: ['action', 'submit', 'click'],
    },
    Card: {
      tier: 'silver',
      zone: 'standard',
      physics: 'smooth',
      vocabulary: ['container', 'group'],
    },
    Dialog: {
      tier: 'gold',
      zone: 'critical',
      physics: 'deliberate',
      vocabulary: ['modal', 'confirm'],
    },
    Banner: {
      tier: 'silver',
      zone: 'marketing',
      physics: 'playful',
      vocabulary: ['hero', 'promotion'],
    },
  },
});

// =============================================================================
// FADE BEHAVIOR TESTS
// =============================================================================

describe('Fade Behavior', () => {
  beforeEach(() => {
    clearFadedCache();
  });

  describe('markAsFaded', () => {
    it('marks component as faded', () => {
      markAsFaded('Button');
      expect(isFaded('Button')).toBe(true);
    });
  });

  describe('isFaded', () => {
    it('returns false for non-faded component', () => {
      expect(isFaded('Card')).toBe(false);
    });

    it('returns true for faded component', () => {
      markAsFaded('Card');
      expect(isFaded('Card')).toBe(true);
    });
  });

  describe('clearFadedCache', () => {
    it('clears all faded components', () => {
      markAsFaded('Button');
      markAsFaded('Card');
      clearFadedCache();
      expect(isFaded('Button')).toBe(false);
      expect(isFaded('Card')).toBe(false);
    });
  });
});

// =============================================================================
// VIRTUAL COMPONENT QUERY TESTS
// =============================================================================

describe('Virtual Component Queries', () => {
  const seed = createMockSeed();

  beforeEach(() => {
    clearFadedCache();
  });

  describe('queryVirtualComponent', () => {
    it('returns found component', () => {
      const result = queryVirtualComponent(seed, 'Button');
      expect(result.found).toBe(true);
      expect(result.data?.tier).toBe('gold');
      expect(result.source).toBe('seed');
      expect(result.faded).toBe(false);
    });

    it('returns not found for missing component', () => {
      const result = queryVirtualComponent(seed, 'NonExistent');
      expect(result.found).toBe(false);
      expect(result.data).toBeNull();
    });

    it('marks faded status correctly', () => {
      markAsFaded('Button');
      const result = queryVirtualComponent(seed, 'Button');
      expect(result.found).toBe(true);
      expect(result.faded).toBe(true);
    });
  });

  describe('getAllVirtualComponents', () => {
    it('returns all components', () => {
      const components = getAllVirtualComponents(seed, true);
      expect(components).toHaveLength(4);
    });

    it('excludes faded components by default', () => {
      markAsFaded('Button');
      const components = getAllVirtualComponents(seed, false);
      expect(components).toHaveLength(3);
      expect(components.find(c => c.name === 'Button')).toBeUndefined();
    });

    it('includes faded when requested', () => {
      markAsFaded('Button');
      const components = getAllVirtualComponents(seed, true);
      expect(components).toHaveLength(4);
    });
  });

  describe('findVirtualByTier', () => {
    it('finds gold tier components', () => {
      const result = findVirtualByTier(seed, 'gold');
      expect(result).toContain('Button');
      expect(result).toContain('Dialog');
      expect(result).not.toContain('Card');
    });

    it('finds silver tier components', () => {
      const result = findVirtualByTier(seed, 'silver');
      expect(result).toContain('Card');
      expect(result).toContain('Banner');
    });

    it('excludes faded components', () => {
      markAsFaded('Button');
      const result = findVirtualByTier(seed, 'gold');
      expect(result).not.toContain('Button');
      expect(result).toContain('Dialog');
    });
  });

  describe('findVirtualByZone', () => {
    it('finds critical zone components', () => {
      const result = findVirtualByZone(seed, 'critical');
      expect(result).toContain('Dialog');
      expect(result).not.toContain('Button');
    });

    it('finds marketing zone components', () => {
      const result = findVirtualByZone(seed, 'marketing');
      expect(result).toContain('Banner');
    });

    it('excludes faded components', () => {
      markAsFaded('Dialog');
      const result = findVirtualByZone(seed, 'critical');
      expect(result).not.toContain('Dialog');
    });
  });

  describe('findVirtualByVocabulary', () => {
    it('finds components by vocabulary term', () => {
      const result = findVirtualByVocabulary(seed, 'action');
      expect(result).toContain('Button');
    });

    it('finds components by partial match', () => {
      const result = findVirtualByVocabulary(seed, 'mod');
      expect(result).toContain('Dialog');
    });

    it('case insensitive search', () => {
      const result = findVirtualByVocabulary(seed, 'CONFIRM');
      expect(result).toContain('Dialog');
    });

    it('excludes faded components', () => {
      markAsFaded('Button');
      const result = findVirtualByVocabulary(seed, 'action');
      expect(result).not.toContain('Button');
    });
  });
});

// =============================================================================
// SEED METADATA TESTS
// =============================================================================

describe('Seed Metadata', () => {
  const seed = createMockSeed();

  describe('getSeedPhysics', () => {
    it('returns critical physics for critical zone', () => {
      expect(getSeedPhysics(seed, 'critical')).toBe('deliberate');
    });

    it('returns marketing physics for marketing zone', () => {
      expect(getSeedPhysics(seed, 'marketing')).toBe('playful');
    });

    it('returns admin physics for admin zone', () => {
      expect(getSeedPhysics(seed, 'admin')).toBe('snappy');
    });

    it('returns default physics for unknown zone', () => {
      expect(getSeedPhysics(seed, 'unknown')).toBe('smooth');
    });
  });

  describe('getSeedMaterial', () => {
    it('returns background color', () => {
      expect(getSeedMaterial(seed, 'background')).toBe('#000000');
    });

    it('returns accent color', () => {
      expect(getSeedMaterial(seed, 'accent')).toBe('#0066CC');
    });
  });

  describe('getSeedTypography', () => {
    it('returns font family', () => {
      expect(getSeedTypography(seed, 'font_family')).toBe('Inter');
    });

    it('returns base size', () => {
      expect(getSeedTypography(seed, 'base_size')).toBe('14px');
    });

    it('returns scale', () => {
      expect(getSeedTypography(seed, 'scale')).toBe(1.25);
    });
  });

  describe('getSeedSpacing', () => {
    it('returns spacing at index', () => {
      expect(getSeedSpacing(seed, 0)).toBe(4);
      expect(getSeedSpacing(seed, 3)).toBe(24);
    });

    it('returns first value for negative index', () => {
      expect(getSeedSpacing(seed, -1)).toBe(4);
    });

    it('returns first value for out of range index', () => {
      expect(getSeedSpacing(seed, 100)).toBe(4);
    });
  });
});

// =============================================================================
// SEED OPTIONS TESTS
// =============================================================================

describe('Seed Options', () => {
  describe('getSeedOptions', () => {
    it('returns available seed options', () => {
      const options = getSeedOptions();
      expect(options).toHaveLength(4);
    });

    it('includes linear-like option', () => {
      const options = getSeedOptions();
      const linear = options.find(o => o.id === 'linear-like');
      expect(linear).toBeDefined();
      expect(linear?.name).toBe('Linear-like');
    });

    it('includes vercel-like option', () => {
      const options = getSeedOptions();
      const vercel = options.find(o => o.id === 'vercel-like');
      expect(vercel).toBeDefined();
    });

    it('includes stripe-like option', () => {
      const options = getSeedOptions();
      const stripe = options.find(o => o.id === 'stripe-like');
      expect(stripe).toBeDefined();
    });

    it('includes blank option', () => {
      const options = getSeedOptions();
      const blank = options.find(o => o.id === 'blank');
      expect(blank).toBeDefined();
      expect(blank?.description).toContain('No opinions');
    });
  });
});

// =============================================================================
// PERFORMANCE TESTS
// =============================================================================

describe('Performance', () => {
  const seed = createMockSeed();

  beforeEach(() => {
    clearFadedCache();
  });

  it('queries virtual component in <1ms', () => {
    const start = performance.now();
    queryVirtualComponent(seed, 'Button');
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(1);
  });

  it('100 queries in <10ms', () => {
    const start = performance.now();
    for (let i = 0; i < 100; i++) {
      queryVirtualComponent(seed, 'Button');
      findVirtualByTier(seed, 'gold');
      findVirtualByZone(seed, 'critical');
    }
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(10);
  });
});
