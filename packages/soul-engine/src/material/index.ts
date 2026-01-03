/**
 * Material Core
 *
 * Materials define physics, not just styles.
 * Glass refracts. Clay has weight. Machinery clicks.
 *
 * @packageDocumentation
 */

// Type exports
export type {
  MaterialType,
  CSSProperties,
  AnimationConfig,
  SpringConfig,
  MaterialPhysics,
  MaterialContext,
  MaterialPhysicsTable,
  MaterialCSSVariables,
} from './types.js';

// Material class exports
export { GlassMaterial, glassMaterial } from './GlassMaterial.js';
export { ClayMaterial, clayMaterial } from './ClayMaterial.js';
export { MachineryMaterial, machineryMaterial } from './MachineryMaterial.js';

// Core function exports
export {
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
  MATERIAL_DESCRIPTIONS,
} from './MaterialCore.js';

// Detection exports
export {
  detectMaterial,
  getZoneByName,
  getMaterialForZone,
  listZoneMaterials,
  validateZoneConfig,
  findOverlappingZones,
} from './detection.js';
export type { MaterialDetectionResult } from './detection.js';

// Legacy compatibility exports
export const MATERIALS: Record<
  import('./types.js').MaterialType,
  string
> = {
  glass: 'Light, translucent, refractive',
  clay: 'Warm, tactile, weighted',
  machinery: 'Instant, precise, zero-latency',
};
