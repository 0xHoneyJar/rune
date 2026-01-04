/**
 * @sigil/hud
 *
 * Lightweight HUD overlay for Sigil Soul Engine.
 * Provides tension sliders, material picker, and fidelity status.
 *
 * Only renders in development mode (NODE_ENV !== 'production').
 *
 * @example
 * ```tsx
 * import { SigilHUD } from '@sigil/hud';
 *
 * function App() {
 *   return (
 *     <>
 *       <YourApp />
 *       <SigilHUD position="bottom-right" />
 *     </>
 *   );
 * }
 * ```
 *
 * @packageDocumentation
 */

// ============ TYPES ============
export type {
  HUDPosition,
  HUDTab,
  SigilHUDProps,
  HUDPanelProps,
  TensionSliderProps,
  MaterialType,
  MaterialPickerProps,
  FidelityLevel,
  FidelityViolation,
  FidelityStatusProps,
  ZoneConfig,
  UseMaterialResult,
  UseZoneResult,
} from './types.js';

// ============ COMPONENTS ============
export {
  SigilHUD,
  HUDPanel,
  TensionSlider,
  MaterialPicker,
  FidelityStatus,
} from './components/index.js';

// ============ HOOKS ============
export {
  useMaterial,
  getMaterialPhysics,
  useZone,
  getZoneForPath,
} from './hooks/index.js';

// ============ DEFAULT EXPORT ============
export { SigilHUD as default } from './components/SigilHUD.js';
