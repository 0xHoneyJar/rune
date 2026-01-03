/**
 * Material Core Tests
 *
 * Comprehensive tests for material physics system.
 */

import { describe, it, expect } from 'vitest';
import {
  // Types and classes
  GlassMaterial,
  ClayMaterial,
  MachineryMaterial,
  glassMaterial,
  clayMaterial,
  machineryMaterial,
  // Core functions
  getMaterialPhysics,
  getAllMaterialTypes,
  isValidMaterialType,
  getMaterialDescription,
  materialToCSSVariables,
  materialToCSSString,
  getMaterialSurfaceStyles,
  getMaterialInteractiveStyles,
  checkMaterialForbidden,
  getMaterialForbiddenPatterns,
  compareMaterials,
  // Detection
  detectMaterial,
  getZoneByName,
  getMaterialForZone,
  listZoneMaterials,
  validateZoneConfig,
  findOverlappingZones,
} from './index.js';
import type { MaterialType, MaterialPhysics } from './types.js';
import type { SigilConfig, ZoneConfig } from '../lib/config.js';

// Mock config for testing
const mockConfig: SigilConfig = {
  version: '0.4',
  zones: [
    {
      name: 'critical',
      material: 'clay',
      sync: 'server_tick',
      paths: ['src/features/checkout/**', 'src/features/claim/**'],
    },
    {
      name: 'transactional',
      material: 'machinery',
      sync: 'lww',
      paths: ['src/features/dashboard/**'],
    },
    {
      name: 'exploratory',
      material: 'glass',
      sync: 'lww',
      paths: ['src/features/discovery/**'],
    },
  ],
  tensions: {
    current: { playfulness: 50, weight: 50, density: 50, speed: 50 },
    presets: [],
  },
  gardener: {
    paper_cut_threshold: 10,
    three_to_one_rule: true,
    enforcement: 'advisory',
  },
  founder_mode: {
    pair_required: true,
    invariant_protection: ['accessibility', 'security'],
  },
};

describe('Material Types', () => {
  describe('getAllMaterialTypes', () => {
    it('returns all three material types', () => {
      const types = getAllMaterialTypes();
      expect(types).toHaveLength(3);
      expect(types).toContain('glass');
      expect(types).toContain('clay');
      expect(types).toContain('machinery');
    });
  });

  describe('isValidMaterialType', () => {
    it('returns true for valid material types', () => {
      expect(isValidMaterialType('glass')).toBe(true);
      expect(isValidMaterialType('clay')).toBe(true);
      expect(isValidMaterialType('machinery')).toBe(true);
    });

    it('returns false for invalid material types', () => {
      expect(isValidMaterialType('wood')).toBe(false);
      expect(isValidMaterialType('metal')).toBe(false);
      expect(isValidMaterialType('')).toBe(false);
    });
  });

  describe('getMaterialDescription', () => {
    it('returns correct descriptions', () => {
      expect(getMaterialDescription('glass')).toContain('translucent');
      expect(getMaterialDescription('clay')).toContain('tactile');
      expect(getMaterialDescription('machinery').toLowerCase()).toContain('instant');
    });
  });
});

describe('Glass Material', () => {
  const material: MaterialPhysics = glassMaterial;

  it('has correct name and description', () => {
    expect(material.name).toBe('glass');
    expect(material.description).toContain('translucent');
  });

  it('returns valid surface CSS', () => {
    const css = material.getSurfaceCSS();
    expect(css.background).toContain('rgba');
    expect(css.backdropFilter).toContain('blur');
    expect(css.borderRadius).toBe('12px');
  });

  it('returns subtle shadow', () => {
    const shadow = material.getShadowCSS();
    expect(shadow).toContain('0 0 0 1px');
    expect(shadow).toContain('rgba');
  });

  it('has no spring config', () => {
    expect(material.getSpringConfig()).toBeNull();
  });

  it('has moderate transition duration', () => {
    expect(material.getTransitionDuration()).toBe(200);
  });

  it('has forbidden patterns', () => {
    expect(material.forbidden).toContain('solid-background');
    expect(material.forbidden).toContain('hard-shadow');
  });

  it('detects forbidden patterns', () => {
    expect(material.checkForbidden('solid-background')).not.toBeNull();
    expect(material.checkForbidden('blur-overlay')).toBeNull();
  });
});

describe('Clay Material', () => {
  const material: MaterialPhysics = clayMaterial;

  it('has correct name and description', () => {
    expect(material.name).toBe('clay');
    expect(material.description).toContain('tactile');
  });

  it('returns warm surface CSS', () => {
    const css = material.getSurfaceCSS();
    expect(css.background).toContain('gradient');
    expect(css.borderRadius).toBe('16px');
  });

  it('returns multi-layer shadow', () => {
    const shadow = material.getShadowCSS();
    expect(shadow).toContain('rgba');
    expect(shadow.split(',').length).toBeGreaterThan(1);
  });

  it('has spring config for bounce', () => {
    const spring = material.getSpringConfig();
    expect(spring).not.toBeNull();
    expect(spring!.tension).toBeGreaterThan(0);
    expect(spring!.friction).toBeGreaterThan(0);
  });

  it('has deliberate transition duration', () => {
    expect(material.getTransitionDuration()).toBe(300);
  });

  it('has forbidden patterns', () => {
    expect(material.forbidden).toContain('flat-design');
    expect(material.forbidden).toContain('instant-transition');
  });
});

describe('Machinery Material', () => {
  const material: MaterialPhysics = machineryMaterial;

  it('has correct name and description', () => {
    expect(material.name).toBe('machinery');
    expect(material.description.toLowerCase()).toContain('instant');
  });

  it('returns precise surface CSS', () => {
    const css = material.getSurfaceCSS();
    expect(css.background).toBe('#0A0A0A');
    expect(css.borderRadius).toBe('6px');
    expect(css.border).toContain('#2A2A2A');
  });

  it('returns no shadow', () => {
    expect(material.getShadowCSS()).toBe('none');
  });

  it('has no spring config', () => {
    expect(material.getSpringConfig()).toBeNull();
  });

  it('has zero transition duration', () => {
    expect(material.getTransitionDuration()).toBe(0);
  });

  it('has forbidden patterns', () => {
    expect(material.forbidden).toContain('bounce-effect');
    expect(material.forbidden).toContain('loading-spinner');
  });
});

describe('getMaterialPhysics', () => {
  it('returns correct physics for each material', () => {
    expect(getMaterialPhysics('glass').name).toBe('glass');
    expect(getMaterialPhysics('clay').name).toBe('clay');
    expect(getMaterialPhysics('machinery').name).toBe('machinery');
  });

  it('returns same instances as singletons', () => {
    expect(getMaterialPhysics('glass')).toBe(glassMaterial);
    expect(getMaterialPhysics('clay')).toBe(clayMaterial);
    expect(getMaterialPhysics('machinery')).toBe(machineryMaterial);
  });
});

describe('CSS Variable Generation', () => {
  describe('materialToCSSVariables', () => {
    it('generates CSS variables for glass', () => {
      const vars = materialToCSSVariables('glass');
      expect(vars['--sigil-material-border-radius']).toBe('12px');
      expect(vars['--sigil-material-transition']).toBe('200ms');
      expect(vars['--sigil-material-backdrop-filter']).toContain('blur');
    });

    it('generates CSS variables for clay', () => {
      const vars = materialToCSSVariables('clay');
      expect(vars['--sigil-material-border-radius']).toBe('16px');
      expect(vars['--sigil-material-transition']).toBe('300ms');
      expect(vars['--sigil-material-shadow']).toContain('rgba');
    });

    it('generates CSS variables for machinery', () => {
      const vars = materialToCSSVariables('machinery');
      expect(vars['--sigil-material-border-radius']).toBe('6px');
      expect(vars['--sigil-material-transition']).toBe('0ms');
      expect(vars['--sigil-material-shadow']).toBe('none');
    });
  });

  describe('materialToCSSString', () => {
    it('generates valid CSS string', () => {
      const css = materialToCSSString('clay');
      expect(css).toContain('--sigil-material-border-radius:');
      expect(css).toContain('--sigil-material-shadow:');
      expect(css).toContain(';');
    });
  });
});

describe('Surface and Interactive Styles', () => {
  describe('getMaterialSurfaceStyles', () => {
    it('includes surface, shadow, and transition', () => {
      const styles = getMaterialSurfaceStyles('clay');
      expect(styles.background).toBeDefined();
      expect(styles.boxShadow).toBeDefined();
      expect(styles.transition).toContain('300ms');
    });

    it('handles zero transition for machinery', () => {
      const styles = getMaterialSurfaceStyles('machinery');
      expect(styles.transition).toBe('none');
    });
  });

  describe('getMaterialInteractiveStyles', () => {
    it('returns hover and active states', () => {
      const states = getMaterialInteractiveStyles('clay');
      expect(states.hover).toBeDefined();
      expect(states.active).toBeDefined();
      expect(states.hover.transform).toContain('translateY');
    });
  });
});

describe('Forbidden Pattern Checking', () => {
  describe('checkMaterialForbidden', () => {
    it('detects forbidden patterns', () => {
      const warning = checkMaterialForbidden('glass', 'solid-background');
      expect(warning).not.toBeNull();
      expect(warning).toContain('Glass material');
    });

    it('allows valid patterns', () => {
      expect(checkMaterialForbidden('glass', 'blur-effect')).toBeNull();
      expect(checkMaterialForbidden('clay', 'spring-bounce')).toBeNull();
      expect(checkMaterialForbidden('machinery', 'instant-feedback')).toBeNull();
    });

    it('normalizes pattern names', () => {
      expect(checkMaterialForbidden('glass', 'solid_background')).not.toBeNull();
      expect(checkMaterialForbidden('glass', 'solidBackground')).toBeNull(); // camelCase not matched
    });
  });

  describe('getMaterialForbiddenPatterns', () => {
    it('returns arrays of forbidden patterns', () => {
      expect(getMaterialForbiddenPatterns('glass')).toContain('solid-background');
      expect(getMaterialForbiddenPatterns('clay')).toContain('flat-design');
      expect(getMaterialForbiddenPatterns('machinery')).toContain('bounce-effect');
    });
  });
});

describe('Material Comparison', () => {
  it('detects transition duration differences', () => {
    const diff = compareMaterials('clay', 'machinery');
    expect(diff.transitionDurationDiff).toBe(-300);
  });

  it('detects shadow changes', () => {
    const diff = compareMaterials('clay', 'machinery');
    expect(diff.shadowChange).toBe(true);
  });

  it('detects spring changes', () => {
    const diff = compareMaterials('clay', 'glass');
    expect(diff.springChange).toBe(true);
  });

  it('shows border radius changes', () => {
    const diff = compareMaterials('glass', 'machinery');
    expect(diff.borderRadiusDiff).toContain('12px');
    expect(diff.borderRadiusDiff).toContain('6px');
  });
});

describe('Zone Detection', () => {
  describe('detectMaterial', () => {
    it('detects critical zone', () => {
      const result = detectMaterial(mockConfig, 'src/features/checkout/Button.tsx');
      expect(result.material).toBe('clay');
      expect(result.zone).toBe('critical');
      expect(result.sync).toBe('server_tick');
      expect(result.isDefault).toBe(false);
    });

    it('detects exploratory zone', () => {
      const result = detectMaterial(mockConfig, 'src/features/discovery/Hero.tsx');
      expect(result.material).toBe('glass');
      expect(result.zone).toBe('exploratory');
    });

    it('detects transactional zone', () => {
      const result = detectMaterial(mockConfig, 'src/features/dashboard/Chart.tsx');
      expect(result.material).toBe('machinery');
      expect(result.zone).toBe('transactional');
    });

    it('returns default for unknown paths', () => {
      const result = detectMaterial(mockConfig, 'src/components/Header.tsx');
      expect(result.material).toBe('clay');
      expect(result.zone).toBeNull();
      expect(result.isDefault).toBe(true);
    });

    it('handles deep paths', () => {
      const result = detectMaterial(
        mockConfig,
        'src/features/checkout/forms/payment/CreditCard.tsx'
      );
      expect(result.material).toBe('clay');
      expect(result.zone).toBe('critical');
    });
  });

  describe('getZoneByName', () => {
    it('returns zone config by name', () => {
      const zone = getZoneByName(mockConfig, 'critical');
      expect(zone).not.toBeNull();
      expect(zone!.material).toBe('clay');
    });

    it('returns null for unknown zone', () => {
      expect(getZoneByName(mockConfig, 'unknown')).toBeNull();
    });
  });

  describe('getMaterialForZone', () => {
    it('returns correct material for zone', () => {
      expect(getMaterialForZone(mockConfig, 'critical')).toBe('clay');
      expect(getMaterialForZone(mockConfig, 'exploratory')).toBe('glass');
    });

    it('returns clay for unknown zone', () => {
      expect(getMaterialForZone(mockConfig, 'unknown')).toBe('clay');
    });
  });

  describe('listZoneMaterials', () => {
    it('lists all zones with materials', () => {
      const list = listZoneMaterials(mockConfig);
      expect(list).toHaveLength(3);
      expect(list.find(z => z.zone === 'critical')?.material).toBe('clay');
    });
  });
});

describe('Zone Validation', () => {
  describe('validateZoneConfig', () => {
    it('validates correct config', () => {
      const errors = validateZoneConfig(mockConfig.zones);
      expect(errors).toHaveLength(0);
    });

    it('detects duplicate zone names', () => {
      const zones: ZoneConfig[] = [
        { name: 'test', material: 'clay', sync: 'lww', paths: ['src/**'] },
        { name: 'test', material: 'glass', sync: 'lww', paths: ['lib/**'] },
      ];
      const errors = validateZoneConfig(zones);
      expect(errors.some(e => e.includes('Duplicate zone name'))).toBe(true);
    });

    it('detects invalid materials', () => {
      const zones: ZoneConfig[] = [
        { name: 'test', material: 'wood' as MaterialType, sync: 'lww', paths: ['src/**'] },
      ];
      const errors = validateZoneConfig(zones);
      expect(errors.some(e => e.includes('Invalid material'))).toBe(true);
    });

    it('detects empty paths', () => {
      const zones: ZoneConfig[] = [
        { name: 'test', material: 'clay', sync: 'lww', paths: [] },
      ];
      const errors = validateZoneConfig(zones);
      expect(errors.some(e => e.includes('no paths'))).toBe(true);
    });
  });

  describe('findOverlappingZones', () => {
    it('detects overlapping paths', () => {
      const zones: ZoneConfig[] = [
        { name: 'zone1', material: 'clay', sync: 'lww', paths: ['src/features/**'] },
        { name: 'zone2', material: 'glass', sync: 'lww', paths: ['src/features/checkout/**'] },
      ];
      const overlaps = findOverlappingZones(zones);
      expect(overlaps.length).toBeGreaterThan(0);
    });

    it('handles non-overlapping zones', () => {
      const zones: ZoneConfig[] = [
        { name: 'zone1', material: 'clay', sync: 'lww', paths: ['src/**'] },
        { name: 'zone2', material: 'glass', sync: 'lww', paths: ['lib/**'] },
      ];
      const overlaps = findOverlappingZones(zones);
      expect(overlaps).toHaveLength(0);
    });
  });
});

describe('Animation Configs', () => {
  it('glass has fade entrance', () => {
    const anim = glassMaterial.getEntranceAnimation();
    expect(anim.keyframes[0].opacity).toBe(0);
    expect(anim.options.duration).toBe(200);
    expect(anim.options.easing).toBe('ease-out');
  });

  it('clay has spring entrance', () => {
    const anim = clayMaterial.getEntranceAnimation();
    expect(anim.keyframes.length).toBeGreaterThan(2);
    expect(anim.options.duration).toBe(300);
    expect(anim.options.easing).toContain('cubic-bezier');
  });

  it('machinery has instant entrance', () => {
    const anim = machineryMaterial.getEntranceAnimation();
    expect(anim.options.duration).toBe(50);
    expect(anim.options.easing).toBe('linear');
  });
});

describe('Class Instantiation', () => {
  it('can create new instances if needed', () => {
    const glass = new GlassMaterial();
    const clay = new ClayMaterial();
    const machinery = new MachineryMaterial();

    expect(glass.name).toBe('glass');
    expect(clay.name).toBe('clay');
    expect(machinery.name).toBe('machinery');
  });
});
