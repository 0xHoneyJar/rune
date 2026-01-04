/**
 * useMaterial Hook
 *
 * React hook for accessing and overriding material state.
 * Detects zone from current path and returns material physics.
 */

import { useState, useCallback, useMemo } from 'react';
import type { MaterialType, UseMaterialResult } from '../types.js';

/**
 * Material physics definitions.
 * These map to the kernel physics.yaml primitives.
 */
const MATERIAL_PHYSICS: Record<
  MaterialType,
  { weight: number; friction: number; bounce: number }
> = {
  clay: { weight: 0.8, friction: 0.6, bounce: 0.2 },
  glass: { weight: 0.3, friction: 0.1, bounce: 0.4 },
  machinery: { weight: 0.9, friction: 0.8, bounce: 0.1 },
  paper: { weight: 0.2, friction: 0.4, bounce: 0.3 },
  fabric: { weight: 0.4, friction: 0.7, bounce: 0.5 },
};

/**
 * Hook to access material state with zone detection.
 *
 * @param zoneMaterial - The default material for the current zone
 * @returns Material state and controls
 *
 * @example
 * ```tsx
 * function MaterialDisplay() {
 *   const { material, physics, setMaterial } = useMaterial('clay');
 *
 *   return (
 *     <div style={{ opacity: physics.weight }}>
 *       Current material: {material}
 *     </div>
 *   );
 * }
 * ```
 */
export function useMaterial(
  zoneMaterial: MaterialType = 'clay'
): UseMaterialResult {
  const [overrideMaterial, setOverrideMaterial] = useState<MaterialType | null>(
    null
  );

  // Use override if set, otherwise use zone material
  const material = overrideMaterial ?? zoneMaterial;

  // Get physics for current material
  const physics = useMemo(() => MATERIAL_PHYSICS[material], [material]);

  // Set material override
  const setMaterial = useCallback((newMaterial: MaterialType) => {
    setOverrideMaterial(newMaterial);
  }, []);

  // Reset to zone default
  const resetToZone = useCallback(() => {
    setOverrideMaterial(null);
  }, []);

  return {
    material,
    physics,
    setMaterial,
    resetToZone,
  };
}

/**
 * Get physics for a material type (non-hook version).
 */
export function getMaterialPhysics(material: MaterialType) {
  return MATERIAL_PHYSICS[material];
}

export default useMaterial;
