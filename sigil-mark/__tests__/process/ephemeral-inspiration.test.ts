/**
 * @sigil-tier gold
 * Sigil v6.0 — Ephemeral Inspiration Tests
 *
 * Tests for ephemeral inspiration and context forking.
 *
 * @module __tests__/process/ephemeral-inspiration
 */

import {
  // Trigger detection
  detectInspirationTrigger,
  extractUrl,
  // Context forking
  createForkedContext,
  getForkedContext,
  updateForkedContext,
  discardForkedContext,
  isContextActive,
  getActiveContextIds,
  clearAllContexts,
  // Style extraction
  extractColors,
  extractTypography,
  extractSpacing,
  extractGradients,
  extractStylesFromCSS,
  // Sanctification
  storeRecentGeneration,
  getRecentGeneration,
  getMostRecentGeneration,
  formatSanctifyEntry,
  clearRecentGenerations,
  // Integration
  createEphemeralFlow,
} from '../../process/ephemeral-inspiration';

// =============================================================================
// TRIGGER DETECTION TESTS
// =============================================================================

describe('Trigger Detection', () => {
  describe('detectInspirationTrigger', () => {
    it('detects "like stripe.com" pattern', () => {
      const result = detectInspirationTrigger('Create a button like stripe.com');
      expect(result.detected).toBe(true);
      expect(result.type).toBe('like');
      expect(result.url).toBe('https://stripe.com');
    });

    it('detects "inspired by" pattern', () => {
      const result = detectInspirationTrigger('Make it inspired by linear.app');
      expect(result.detected).toBe(true);
      expect(result.type).toBe('inspired-by');
      expect(result.url).toBe('https://linear.app');
    });

    it('detects "reference" pattern', () => {
      const result = detectInspirationTrigger('Use reference vercel.com/design');
      expect(result.detected).toBe(true);
      expect(result.type).toBe('reference');
      expect(result.url).toBe('https://vercel.com/design');
    });

    it('detects full URL patterns', () => {
      const result = detectInspirationTrigger('like https://example.com/page');
      expect(result.detected).toBe(true);
      expect(result.url).toBe('https://example.com/page');
    });

    it('returns not detected for no trigger', () => {
      const result = detectInspirationTrigger('Create a blue button');
      expect(result.detected).toBe(false);
    });

    it('includes original phrase', () => {
      const result = detectInspirationTrigger('like stripe.com');
      expect(result.phrase).toBe('like stripe.com');
    });
  });

  describe('extractUrl', () => {
    it('extracts simple domain', () => {
      const url = extractUrl('check out stripe.com');
      expect(url).toBe('https://stripe.com');
    });

    it('extracts full URL', () => {
      const url = extractUrl('see https://example.com/path');
      expect(url).toBe('https://example.com/path');
    });

    it('returns null for no URL', () => {
      const url = extractUrl('just some text');
      expect(url).toBeNull();
    });
  });
});

// =============================================================================
// CONTEXT FORKING TESTS
// =============================================================================

describe('Context Forking', () => {
  beforeEach(() => {
    clearAllContexts();
  });

  describe('createForkedContext', () => {
    it('creates context with unique ID', () => {
      const context1 = createForkedContext();
      const context2 = createForkedContext();
      expect(context1.forkId).not.toBe(context2.forkId);
    });

    it('includes source URL', () => {
      const context = createForkedContext('https://stripe.com');
      expect(context.sourceUrl).toBe('https://stripe.com');
    });

    it('starts as active', () => {
      const context = createForkedContext();
      expect(context.active).toBe(true);
    });

    it('includes creation timestamp', () => {
      const context = createForkedContext();
      expect(context.createdAt).toBeDefined();
    });
  });

  describe('getForkedContext', () => {
    it('retrieves created context', () => {
      const created = createForkedContext();
      const retrieved = getForkedContext(created.forkId);
      expect(retrieved).toEqual(created);
    });

    it('returns null for unknown ID', () => {
      const result = getForkedContext('unknown-id');
      expect(result).toBeNull();
    });
  });

  describe('updateForkedContext', () => {
    it('updates context with styles', () => {
      const context = createForkedContext();
      const styles = {
        colors: { accent: '#5E6AD2' },
        typography: { fontFamily: 'Inter' },
        spacing: {},
      };

      const success = updateForkedContext(context.forkId, styles);
      expect(success).toBe(true);

      const updated = getForkedContext(context.forkId);
      expect(updated?.styles).toEqual(styles);
    });

    it('returns false for unknown context', () => {
      const styles = { colors: {}, typography: {}, spacing: {} };
      const success = updateForkedContext('unknown', styles);
      expect(success).toBe(false);
    });
  });

  describe('discardForkedContext', () => {
    it('removes context', () => {
      const context = createForkedContext();
      discardForkedContext(context.forkId);

      const retrieved = getForkedContext(context.forkId);
      expect(retrieved).toBeNull();
    });

    it('clears styles on discard', () => {
      const context = createForkedContext();
      updateForkedContext(context.forkId, {
        colors: { accent: '#000' },
        typography: {},
        spacing: {},
      });

      discardForkedContext(context.forkId);
      expect(getForkedContext(context.forkId)).toBeNull();
    });
  });

  describe('isContextActive', () => {
    it('returns true for active context', () => {
      const context = createForkedContext();
      expect(isContextActive(context.forkId)).toBe(true);
    });

    it('returns false after discard', () => {
      const context = createForkedContext();
      discardForkedContext(context.forkId);
      expect(isContextActive(context.forkId)).toBe(false);
    });
  });

  describe('getActiveContextIds', () => {
    it('returns all active IDs', () => {
      const c1 = createForkedContext();
      const c2 = createForkedContext();

      const ids = getActiveContextIds();
      expect(ids).toContain(c1.forkId);
      expect(ids).toContain(c2.forkId);
    });
  });
});

// =============================================================================
// STYLE EXTRACTION TESTS
// =============================================================================

describe('Style Extraction', () => {
  describe('extractColors', () => {
    it('extracts background color', () => {
      const css = 'body { background-color: #0A0A0B; }';
      const colors = extractColors(css);
      expect(colors.background).toBe('#0A0A0B');
    });

    it('extracts text color', () => {
      const css = 'p { color: #FFFFFF; }';
      const colors = extractColors(css);
      expect(colors.text).toBe('#FFFFFF');
    });

    it('extracts accent from CSS variable', () => {
      const css = ':root { --primary-color: #5E6AD2; }';
      const colors = extractColors(css);
      expect(colors.accent).toBe('#5E6AD2');
    });
  });

  describe('extractTypography', () => {
    it('extracts font family', () => {
      const css = 'body { font-family: "Inter", sans-serif; }';
      const typography = extractTypography(css);
      expect(typography.fontFamily).toBe('Inter');
    });

    it('extracts base font size', () => {
      const css = 'body { font-size: 14px; }';
      const typography = extractTypography(css);
      expect(typography.baseFontSize).toBe('14px');
    });

    it('extracts font weights', () => {
      const css = '.bold { font-weight: 700; } .normal { font-weight: 400; }';
      const typography = extractTypography(css);
      expect(typography.fontWeights).toContain(400);
      expect(typography.fontWeights).toContain(700);
    });
  });

  describe('extractSpacing', () => {
    it('extracts spacing unit', () => {
      const css = ':root { --spacing-unit: 4px; }';
      const spacing = extractSpacing(css);
      expect(spacing.unit).toBe('4px');
    });

    it('extracts spacing scale from padding', () => {
      const css = '.a { padding: 8px; } .b { padding: 16px; } .c { padding: 24px; }';
      const spacing = extractSpacing(css);
      expect(spacing.scale).toContain(8);
      expect(spacing.scale).toContain(16);
      expect(spacing.scale).toContain(24);
    });
  });

  describe('extractGradients', () => {
    it('extracts linear gradients', () => {
      const css = 'background: linear-gradient(135deg, #5E6AD2, #8B5CF6);';
      const gradients = extractGradients(css);
      expect(gradients).toHaveLength(1);
      expect(gradients[0]).toContain('linear-gradient');
    });

    it('extracts multiple gradients', () => {
      const css = `
        .a { background: linear-gradient(to right, #000, #fff); }
        .b { background: radial-gradient(circle, #000, #fff); }
      `;
      const gradients = extractGradients(css);
      expect(gradients).toHaveLength(2);
    });
  });

  describe('extractStylesFromCSS', () => {
    it('extracts complete style object', () => {
      const css = `
        body {
          background-color: #000;
          color: #fff;
          font-family: Inter;
          font-size: 14px;
        }
      `;
      const styles = extractStylesFromCSS(css);
      expect(styles.colors.background).toBe('#000');
      expect(styles.colors.text).toBe('#fff');
      expect(styles.typography.fontFamily).toBe('Inter');
      expect(styles.typography.baseFontSize).toBe('14px');
    });
  });
});

// =============================================================================
// SANCTIFICATION TESTS
// =============================================================================

describe('Sanctification', () => {
  beforeEach(() => {
    clearRecentGenerations();
  });

  describe('storeRecentGeneration', () => {
    it('stores generation', () => {
      const styles = { colors: { accent: '#000' }, typography: {}, spacing: {} };
      storeRecentGeneration('test-1', 'const Button = () => {}', styles);

      const result = getRecentGeneration('test-1');
      expect(result).not.toBeNull();
      expect(result?.code).toBe('const Button = () => {}');
    });

    it('limits to 5 generations', () => {
      const styles = { colors: {}, typography: {}, spacing: {} };
      for (let i = 0; i < 10; i++) {
        storeRecentGeneration(`test-${i}`, 'code', styles);
      }

      // First ones should be evicted
      expect(getRecentGeneration('test-0')).toBeNull();
      expect(getRecentGeneration('test-9')).not.toBeNull();
    });
  });

  describe('getMostRecentGeneration', () => {
    it('returns most recent', () => {
      const styles = { colors: {}, typography: {}, spacing: {} };
      storeRecentGeneration('first', 'code1', styles);
      storeRecentGeneration('second', 'code2', styles);

      const result = getMostRecentGeneration();
      expect(result?.id).toBe('second');
    });

    it('returns null when empty', () => {
      const result = getMostRecentGeneration();
      expect(result).toBeNull();
    });
  });

  describe('formatSanctifyEntry', () => {
    it('formats entry with colors', () => {
      const entry = formatSanctifyEntry('gradient-button', {
        colors: { accent: '#5E6AD2' },
      });

      expect(entry).toContain('### gradient-button');
      expect(entry).toContain('accent: `#5E6AD2`');
    });

    it('formats entry with gradients', () => {
      const entry = formatSanctifyEntry('fancy-bg', {
        gradients: ['linear-gradient(135deg, #000, #fff)'],
      });

      expect(entry).toContain('**Gradients:**');
      expect(entry).toContain('linear-gradient');
    });
  });
});

// =============================================================================
// INTEGRATION TESTS
// =============================================================================

describe('Ephemeral Flow', () => {
  beforeEach(() => {
    clearAllContexts();
    clearRecentGenerations();
  });

  describe('createEphemeralFlow', () => {
    it('starts flow with context', () => {
      const flow = createEphemeralFlow();
      const context = flow.start('https://stripe.com');

      expect(context.forkId).toBeDefined();
      expect(context.active).toBe(true);
    });

    it('updates and retrieves styles', () => {
      const flow = createEphemeralFlow();
      const context = flow.start('https://stripe.com');

      const styles = {
        colors: { accent: '#635BFF' },
        typography: {},
        spacing: {},
      };
      flow.updateStyles(context.forkId, styles);

      const retrieved = flow.getStyles(context.forkId);
      expect(retrieved?.colors.accent).toBe('#635BFF');
    });

    it('completes flow and stores generation', () => {
      const flow = createEphemeralFlow();
      const context = flow.start('https://stripe.com');

      const styles = {
        colors: { accent: '#635BFF' },
        typography: {},
        spacing: {},
      };
      flow.updateStyles(context.forkId, styles);
      flow.complete(context.forkId, 'const Button = () => {}');

      // Context should be discarded
      expect(isContextActive(context.forkId)).toBe(false);

      // Generation should be stored
      const recent = getMostRecentGeneration();
      expect(recent?.code).toBe('const Button = () => {}');
    });

    it('discards without storing', () => {
      const flow = createEphemeralFlow();
      const context = flow.start('https://stripe.com');

      flow.discard(context.forkId);

      expect(isContextActive(context.forkId)).toBe(false);
      expect(getMostRecentGeneration()).toBeNull();
    });
  });
});

// =============================================================================
// PERFORMANCE TESTS
// =============================================================================

describe('Performance', () => {
  beforeEach(() => {
    clearAllContexts();
  });

  it('trigger detection in <1ms', () => {
    const start = performance.now();
    detectInspirationTrigger('like stripe.com with blue buttons');
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(1);
  });

  it('100 context operations in <10ms', () => {
    const start = performance.now();

    for (let i = 0; i < 100; i++) {
      const context = createForkedContext();
      updateForkedContext(context.forkId, {
        colors: {},
        typography: {},
        spacing: {},
      });
      discardForkedContext(context.forkId);
    }

    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(10);
  });
});
