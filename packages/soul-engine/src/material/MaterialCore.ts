/**
 * Material Core
 *
 * Central module for material physics management.
 * Provides getMaterialPhysics, CSS variable generation,
 * and zone-to-material mapping.
 */

import type {
  MaterialType,
  MaterialPhysics,
  MaterialCSSVariables,
  CSSProperties,
} from './types.js';
import { glassMaterial } from './GlassMaterial.js';
import { clayMaterial } from './ClayMaterial.js';
import { machineryMaterial } from './MachineryMaterial.js';

/**
 * Material physics lookup table
 * Maps material type to physics implementation
 */
const MATERIALS: Record<MaterialType, MaterialPhysics> = {
  glass: glassMaterial,
  clay: clayMaterial,
  machinery: machineryMaterial,
};

/**
 * Material descriptions for display
 */
export const MATERIAL_DESCRIPTIONS: Record<MaterialType, string> = {
  glass: 'Light, translucent, refractive',
  clay: 'Warm, tactile, weighted',
  machinery: 'Instant, precise, zero-latency',
};

/**
 * Get material physics implementation
 *
 * @param material - The material type
 * @returns MaterialPhysics implementation
 *
 * @example
 * ```ts
 * const physics = getMaterialPhysics('clay');
 * const surface = physics.getSurfaceCSS();
 * ```
 */
export function getMaterialPhysics(material: MaterialType): MaterialPhysics {
  const physics = MATERIALS[material];
  if (!physics) {
    console.warn(`Unknown material "${material}", falling back to clay`);
    return MATERIALS.clay;
  }
  return physics;
}

/**
 * Get all material types
 */
export function getAllMaterialTypes(): MaterialType[] {
  return ['glass', 'clay', 'machinery'];
}

/**
 * Check if a string is a valid material type
 */
export function isValidMaterialType(value: string): value is MaterialType {
  return value === 'glass' || value === 'clay' || value === 'machinery';
}

/**
 * Get material description
 */
export function getMaterialDescription(material: MaterialType): string {
  return MATERIAL_DESCRIPTIONS[material] ?? 'Unknown material';
}

/**
 * Generate CSS variables from material physics
 *
 * @param material - The material type
 * @returns CSS variables object
 *
 * @example
 * ```ts
 * const vars = materialToCSSVariables('clay');
 * // Apply to element: Object.assign(element.style, vars);
 * ```
 */
export function materialToCSSVariables(
  material: MaterialType
): MaterialCSSVariables {
  const physics = getMaterialPhysics(material);
  const surface = physics.getSurfaceCSS();

  return {
    '--sigil-material-border-radius': String(surface.borderRadius || '12px'),
    '--sigil-material-shadow': physics.getShadowCSS(),
    '--sigil-material-transition': `${physics.getTransitionDuration()}ms`,
    '--sigil-material-background': String(surface.background || 'transparent'),
    '--sigil-material-border': String(surface.border || 'none'),
    '--sigil-material-backdrop-filter': String(surface.backdropFilter || 'none'),
  };
}

/**
 * Generate CSS variable string for style injection
 *
 * @param material - The material type
 * @returns CSS string with variable declarations
 *
 * @example
 * ```ts
 * const css = materialToCSSString('glass');
 * // Inject into style tag
 * ```
 */
export function materialToCSSString(material: MaterialType): string {
  const vars = materialToCSSVariables(material);
  return Object.entries(vars)
    .map(([key, value]) => `${key}: ${value};`)
    .join('\n');
}

/**
 * Get combined surface styles with shadow and transitions
 *
 * @param material - The material type
 * @returns Complete CSS properties for a surface
 */
export function getMaterialSurfaceStyles(material: MaterialType): CSSProperties {
  const physics = getMaterialPhysics(material);
  const surface = physics.getSurfaceCSS();

  return {
    ...surface,
    boxShadow: physics.getShadowCSS(),
    transition: physics.getTransitionDuration() > 0
      ? `all ${physics.getTransitionDuration()}ms ease-out`
      : 'none',
  };
}

/**
 * Get interactive state styles (hover + active)
 *
 * @param material - The material type
 * @returns Object with hover and active style states
 */
export function getMaterialInteractiveStyles(material: MaterialType): {
  hover: CSSProperties;
  active: CSSProperties;
} {
  const physics = getMaterialPhysics(material);
  return {
    hover: physics.getHoverEffect(),
    active: physics.getActiveEffect(),
  };
}

/**
 * Check if a pattern is forbidden for a material
 *
 * @param material - The material type
 * @param pattern - The pattern to check
 * @returns Warning message if forbidden, null otherwise
 */
export function checkMaterialForbidden(
  material: MaterialType,
  pattern: string
): string | null {
  const physics = getMaterialPhysics(material);
  return physics.checkForbidden(pattern);
}

/**
 * Get forbidden patterns for a material
 *
 * @param material - The material type
 * @returns Array of forbidden pattern names
 */
export function getMaterialForbiddenPatterns(material: MaterialType): string[] {
  const physics = getMaterialPhysics(material);
  return [...physics.forbidden];
}

/**
 * Compare two materials and get differences
 *
 * @param from - Source material
 * @param to - Target material
 * @returns Object describing material differences
 */
export function compareMaterials(
  from: MaterialType,
  to: MaterialType
): {
  transitionDurationDiff: number;
  borderRadiusDiff: string;
  shadowChange: boolean;
  springChange: boolean;
} {
  const fromPhysics = getMaterialPhysics(from);
  const toPhysics = getMaterialPhysics(to);

  const fromSurface = fromPhysics.getSurfaceCSS();
  const toSurface = toPhysics.getSurfaceCSS();

  return {
    transitionDurationDiff:
      toPhysics.getTransitionDuration() - fromPhysics.getTransitionDuration(),
    borderRadiusDiff: `${fromSurface.borderRadius} -> ${toSurface.borderRadius}`,
    shadowChange: fromPhysics.getShadowCSS() !== toPhysics.getShadowCSS(),
    springChange:
      (fromPhysics.getSpringConfig() !== null) !==
      (toPhysics.getSpringConfig() !== null),
  };
}
