/**
 * @sigil-tier gold
 * Sigil v6.0 — Auditing Cohesion Tests
 *
 * Tests for visual consistency checks.
 *
 * @module __tests__/process/auditing-cohesion
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  // Constants
  DEFAULT_THRESHOLDS,
  PROPERTY_PATTERNS,
  // Property extraction
  parseNumericValue,
  extractProperties,
  extractDeviations,
  extractTier,
  extractZone,
  extractComponentName,
  parseComponent,
  // Baseline calculation
  calculateAverage,
  buildTierBaseline,
  // Variance calculation
  calculateVariance,
  checkThreshold,
  compareToBaseline,
  // Audit execution
  auditComponent,
  // Formatting
  formatVarianceTable,
  formatFlaggedItems,
  formatJustifiedDeviations,
  formatAuditReport,
  formatQuickSummary,
  // Types
  PropertyValue,
  ComponentMeta,
  DeviationAnnotation,
} from '../../process/auditing-cohesion';

// =============================================================================
// CONSTANTS TESTS
// =============================================================================

describe('Constants', () => {
  it('has default thresholds', () => {
    expect(DEFAULT_THRESHOLDS.shadow).toBe(20);
    expect(DEFAULT_THRESHOLDS['border-radius']).toBe(10);
    expect(DEFAULT_THRESHOLDS.spacing).toBe(15);
    expect(DEFAULT_THRESHOLDS.colors).toBe(10);
  });

  it('has property patterns', () => {
    expect(PROPERTY_PATTERNS['border-radius']).toBeDefined();
    expect(PROPERTY_PATTERNS.shadow).toBeDefined();
    expect(PROPERTY_PATTERNS.opacity).toBeDefined();
  });
});

// =============================================================================
// NUMERIC VALUE PARSING TESTS
// =============================================================================

describe('parseNumericValue', () => {
  it('parses pixel values', () => {
    const result = parseNumericValue('8px');
    expect(result?.numeric).toBe(8);
    expect(result?.unit).toBe('px');
  });

  it('parses rem values', () => {
    const result = parseNumericValue('1.5rem');
    expect(result?.numeric).toBe(1.5);
    expect(result?.unit).toBe('rem');
  });

  it('parses plain numbers', () => {
    const result = parseNumericValue('0.5');
    expect(result?.numeric).toBe(0.5);
    expect(result?.unit).toBe('');
  });

  it('parses bold font weight', () => {
    const result = parseNumericValue('bold');
    expect(result?.numeric).toBe(700);
  });

  it('parses normal font weight', () => {
    const result = parseNumericValue('normal');
    expect(result?.numeric).toBe(400);
  });

  it('returns null for complex values', () => {
    const result = parseNumericValue('rgba(0,0,0,0.5)');
    expect(result).toBeNull();
  });
});

// =============================================================================
// PROPERTY EXTRACTION TESTS
// =============================================================================

describe('extractProperties', () => {
  it('extracts border-radius', () => {
    const code = 'borderRadius: "8px"';
    const props = extractProperties(code);
    expect(props.some((p) => p.property === 'border-radius')).toBe(true);
  });

  it('extracts opacity', () => {
    const code = 'opacity: 0.5';
    const props = extractProperties(code);
    expect(props.some((p) => p.value === '0.5')).toBe(true);
  });

  it('extracts padding', () => {
    const code = 'padding: "16px"';
    const props = extractProperties(code);
    expect(props.some((p) => p.property === 'padding')).toBe(true);
  });

  it('extracts font-size', () => {
    const code = 'fontSize: "14px"';
    const props = extractProperties(code);
    expect(props.some((p) => p.property === 'fontSize')).toBe(true);
  });

  it('handles multiple properties', () => {
    const code = `
      borderRadius: "8px",
      padding: "16px",
      opacity: 0.8
    `;
    const props = extractProperties(code);
    expect(props.length).toBeGreaterThanOrEqual(3);
  });
});

describe('extractDeviations', () => {
  it('extracts deviation annotations', () => {
    const code = `
      /**
       * @sigil-deviation border-radius "Sharp corners for legal feel"
       */
    `;
    const deviations = extractDeviations(code);
    expect(deviations).toHaveLength(1);
    expect(deviations[0].property).toBe('border-radius');
    expect(deviations[0].reason).toBe('Sharp corners for legal feel');
  });

  it('extracts multiple deviations', () => {
    const code = `
      /**
       * @sigil-deviation border-radius "Legal feel"
       * @sigil-deviation opacity "Needs emphasis"
       */
    `;
    const deviations = extractDeviations(code);
    expect(deviations).toHaveLength(2);
  });

  it('returns empty for no deviations', () => {
    const code = 'const Button = () => {}';
    const deviations = extractDeviations(code);
    expect(deviations).toHaveLength(0);
  });
});

describe('extractTier', () => {
  it('extracts tier from JSDoc', () => {
    const code = '/** @sigil-tier gold */';
    expect(extractTier(code)).toBe('gold');
  });

  it('returns unknown for missing tier', () => {
    const code = 'const Button = () => {}';
    expect(extractTier(code)).toBe('unknown');
  });
});

describe('extractZone', () => {
  it('extracts zone from JSDoc', () => {
    const code = '/** @sigil-zone critical */';
    expect(extractZone(code)).toBe('critical');
  });

  it('returns undefined for missing zone', () => {
    const code = 'const Button = () => {}';
    expect(extractZone(code)).toBeUndefined();
  });
});

describe('extractComponentName', () => {
  it('extracts name from path', () => {
    expect(extractComponentName('/src/ClaimButton.tsx')).toBe('ClaimButton');
    expect(extractComponentName('Card.tsx')).toBe('Card');
  });
});

describe('parseComponent', () => {
  it('parses complete component', () => {
    const code = `
      /**
       * @sigil-tier gold
       * @sigil-zone critical
       */
      export const Button = () => {
        return <button style={{ borderRadius: "8px", padding: "16px" }} />;
      };
    `;

    const meta = parseComponent('/src/Button.tsx', code);

    expect(meta.name).toBe('Button');
    expect(meta.tier).toBe('gold');
    expect(meta.zone).toBe('critical');
    expect(meta.properties.length).toBeGreaterThan(0);
  });
});

// =============================================================================
// BASELINE CALCULATION TESTS
// =============================================================================

describe('calculateAverage', () => {
  it('calculates average of numeric values', () => {
    const values: PropertyValue[] = [
      { property: 'border-radius', value: '8px', numericValue: 8, unit: 'px' },
      { property: 'border-radius', value: '12px', numericValue: 12, unit: 'px' },
      { property: 'border-radius', value: '10px', numericValue: 10, unit: 'px' },
    ];

    const avg = calculateAverage(values);

    expect(avg?.numericValue).toBe(10);
    expect(avg?.unit).toBe('px');
  });

  it('returns null for no numeric values', () => {
    const values: PropertyValue[] = [
      { property: 'shadow', value: 'complex-value' },
    ];

    const avg = calculateAverage(values);
    expect(avg).toBeNull();
  });
});

describe('buildTierBaseline', () => {
  it('builds baseline for tier', () => {
    const components: ComponentMeta[] = [
      {
        name: 'Button1',
        path: '/a.tsx',
        tier: 'gold',
        properties: [
          { property: 'border-radius', value: '8px', numericValue: 8, unit: 'px' },
        ],
        deviations: [],
      },
      {
        name: 'Button2',
        path: '/b.tsx',
        tier: 'gold',
        properties: [
          { property: 'border-radius', value: '12px', numericValue: 12, unit: 'px' },
        ],
        deviations: [],
      },
    ];

    const baseline = buildTierBaseline(components, 'gold');

    expect(baseline.componentCount).toBe(2);
    expect(baseline.averages['border-radius']?.numericValue).toBe(10);
  });

  it('returns empty for no matching tier', () => {
    const components: ComponentMeta[] = [
      {
        name: 'Button1',
        path: '/a.tsx',
        tier: 'silver',
        properties: [],
        deviations: [],
      },
    ];

    const baseline = buildTierBaseline(components, 'gold');
    expect(baseline.componentCount).toBe(0);
  });
});

// =============================================================================
// VARIANCE CALCULATION TESTS
// =============================================================================

describe('calculateVariance', () => {
  it('calculates variance percentage', () => {
    expect(calculateVariance(12, 10)).toBe(20);
    expect(calculateVariance(10, 10)).toBe(0);
    expect(calculateVariance(8, 10)).toBe(20);
  });

  it('handles zero expected value', () => {
    expect(calculateVariance(5, 0)).toBe(100);
    expect(calculateVariance(0, 0)).toBe(0);
  });
});

describe('checkThreshold', () => {
  it('passes within threshold', () => {
    expect(checkThreshold('border-radius', 5)).toBe(true);
    expect(checkThreshold('shadow', 15)).toBe(true);
  });

  it('fails above threshold', () => {
    expect(checkThreshold('border-radius', 15)).toBe(false);
    expect(checkThreshold('shadow', 25)).toBe(false);
  });

  it('maps padding/margin to spacing', () => {
    expect(checkThreshold('padding', 10)).toBe(true);
    expect(checkThreshold('margin', 10)).toBe(true);
    expect(checkThreshold('padding', 20)).toBe(false);
  });
});

describe('compareToBaseline', () => {
  it('compares component to baseline', () => {
    const component: ComponentMeta = {
      name: 'TestButton',
      path: '/test.tsx',
      tier: 'gold',
      properties: [
        { property: 'border-radius', value: '12px', numericValue: 12, unit: 'px' },
      ],
      deviations: [],
    };

    const baseline = {
      tier: 'gold',
      componentCount: 3,
      averages: {
        'border-radius': { property: 'border-radius', value: '10px', numericValue: 10, unit: 'px' },
      },
    };

    const results = compareToBaseline(component, baseline);

    expect(results).toHaveLength(1);
    expect(results[0].variance).toBe(20);
    expect(results[0].passed).toBe(false);
  });

  it('marks justified deviations as passed', () => {
    const component: ComponentMeta = {
      name: 'TestButton',
      path: '/test.tsx',
      tier: 'gold',
      properties: [
        { property: 'border-radius', value: '20px', numericValue: 20, unit: 'px' },
      ],
      deviations: [
        { property: 'border-radius', reason: 'Intentionally large' },
      ],
    };

    const baseline = {
      tier: 'gold',
      componentCount: 1,
      averages: {
        'border-radius': { property: 'border-radius', value: '10px', numericValue: 10, unit: 'px' },
      },
    };

    const results = compareToBaseline(component, baseline);

    expect(results[0].passed).toBe(true);
    expect(results[0].justified).toBe(true);
  });
});

// =============================================================================
// AUDIT EXECUTION TESTS
// =============================================================================

describe('auditComponent', () => {
  it('returns pass for all within threshold', () => {
    const component: ComponentMeta = {
      name: 'Button',
      path: '/btn.tsx',
      tier: 'gold',
      properties: [
        { property: 'border-radius', value: '10px', numericValue: 10, unit: 'px' },
      ],
      deviations: [],
    };

    const sanctuary: ComponentMeta[] = [
      {
        name: 'Other',
        path: '/other.tsx',
        tier: 'gold',
        properties: [
          { property: 'border-radius', value: '10px', numericValue: 10, unit: 'px' },
        ],
        deviations: [],
      },
    ];

    const result = auditComponent(component, sanctuary);

    expect(result.overall).toBe('pass');
    expect(result.flagged).toHaveLength(0);
  });

  it('returns warn for minor variance', () => {
    const component: ComponentMeta = {
      name: 'Button',
      path: '/btn.tsx',
      tier: 'gold',
      properties: [
        { property: 'border-radius', value: '15px', numericValue: 15, unit: 'px' },
      ],
      deviations: [],
    };

    const sanctuary: ComponentMeta[] = [
      {
        name: 'Other',
        path: '/other.tsx',
        tier: 'gold',
        properties: [
          { property: 'border-radius', value: '10px', numericValue: 10, unit: 'px' },
        ],
        deviations: [],
      },
    ];

    const result = auditComponent(component, sanctuary);

    expect(result.overall).toBe('warn');
    expect(result.flagged.length).toBeGreaterThan(0);
  });

  it('returns fail for major variance', () => {
    const component: ComponentMeta = {
      name: 'Button',
      path: '/btn.tsx',
      tier: 'gold',
      properties: [
        { property: 'border-radius', value: '100px', numericValue: 100, unit: 'px' },
      ],
      deviations: [],
    };

    const sanctuary: ComponentMeta[] = [
      {
        name: 'Other',
        path: '/other.tsx',
        tier: 'gold',
        properties: [
          { property: 'border-radius', value: '10px', numericValue: 10, unit: 'px' },
        ],
        deviations: [],
      },
    ];

    const result = auditComponent(component, sanctuary);

    expect(result.overall).toBe('fail');
  });
});

// =============================================================================
// FORMATTING TESTS
// =============================================================================

describe('formatVarianceTable', () => {
  it('formats variance table', () => {
    const variances = [
      { property: 'border-radius', expected: '10px', actual: '12px', variance: 20, passed: false },
      { property: 'opacity', expected: '0.8', actual: '0.8', variance: 0, passed: true },
    ];

    const table = formatVarianceTable(variances);

    expect(table).toContain('| Property | Expected | Actual | Variance | Status |');
    expect(table).toContain('border-radius');
    expect(table).toContain('FLAG');
    expect(table).toContain('PASS');
  });

  it('handles empty variances', () => {
    const table = formatVarianceTable([]);
    expect(table).toContain('No properties to compare');
  });
});

describe('formatFlaggedItems', () => {
  it('formats flagged items', () => {
    const flagged = [
      { property: 'border-radius', expected: '10px', actual: '15px', variance: 50, passed: false },
    ];

    const result = formatFlaggedItems(flagged);

    expect(result).toContain('border-radius');
    expect(result).toContain('Expected 10px, got 15px');
    expect(result).toContain('50%');
  });

  it('handles no flagged items', () => {
    const result = formatFlaggedItems([]);
    expect(result).toContain('No flagged items');
  });
});

describe('formatJustifiedDeviations', () => {
  it('formats deviations', () => {
    const deviations: DeviationAnnotation[] = [
      { property: 'border-radius', reason: 'Legal feel' },
    ];

    const result = formatJustifiedDeviations(deviations);

    expect(result).toContain('border-radius');
    expect(result).toContain('Legal feel');
  });

  it('handles no deviations', () => {
    const result = formatJustifiedDeviations([]);
    expect(result).toBe('(none)');
  });
});

describe('formatAuditReport', () => {
  it('formats full report', () => {
    const result = {
      componentName: 'Button',
      tier: 'gold',
      zone: 'critical',
      date: '2026-01-08',
      variances: [],
      flagged: [],
      justified: [],
      overall: 'pass' as const,
    };

    const report = formatAuditReport(result);

    expect(report).toContain('# Cohesion Audit: Button');
    expect(report).toContain('Tier: gold');
    expect(report).toContain('Zone: critical');
    expect(report).toContain('PASS');
  });
});

describe('formatQuickSummary', () => {
  it('formats pass summary', () => {
    const result = {
      componentName: 'Button',
      tier: 'gold',
      date: '2026-01-08',
      variances: [
        { property: 'a', expected: '1', actual: '1', variance: 0, passed: true },
      ],
      flagged: [],
      justified: [],
      overall: 'pass' as const,
    };

    const summary = formatQuickSummary(result);
    expect(summary).toContain('PASS');
    expect(summary).toContain('1 properties');
  });

  it('formats warn summary', () => {
    const result = {
      componentName: 'Button',
      tier: 'gold',
      date: '2026-01-08',
      variances: [],
      flagged: [
        { property: 'a', expected: '1', actual: '2', variance: 100, passed: false },
      ],
      justified: [],
      overall: 'warn' as const,
    };

    const summary = formatQuickSummary(result);
    expect(summary).toContain('1 property flagged');
  });
});

// =============================================================================
// PERFORMANCE TESTS
// =============================================================================

describe('Performance', () => {
  it('property extraction in <50ms', () => {
    const code = `
      const styles = {
        borderRadius: "8px",
        padding: "16px",
        margin: "8px",
        opacity: 0.8,
        fontSize: "14px",
        fontWeight: "bold"
      };
    `.repeat(10);

    const start = performance.now();
    extractProperties(code);
    const elapsed = performance.now() - start;

    expect(elapsed).toBeLessThan(50);
  });

  it('audit in <200ms', () => {
    const component: ComponentMeta = {
      name: 'Test',
      path: '/test.tsx',
      tier: 'gold',
      properties: Array(20).fill(null).map((_, i) => ({
        property: 'border-radius',
        value: `${8 + i}px`,
        numericValue: 8 + i,
        unit: 'px',
      })),
      deviations: [],
    };

    const sanctuary: ComponentMeta[] = Array(10).fill(null).map((_, i) => ({
      name: `Comp${i}`,
      path: `/${i}.tsx`,
      tier: 'gold',
      properties: [
        { property: 'border-radius', value: '10px', numericValue: 10, unit: 'px' },
      ],
      deviations: [],
    }));

    const start = performance.now();
    auditComponent(component, sanctuary);
    const elapsed = performance.now() - start;

    expect(elapsed).toBeLessThan(200);
  });
});
