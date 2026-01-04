/**
 * Sigil HUD Types
 *
 * Type definitions for HUD overlay components and hooks.
 */

export type HUDPosition =
  | 'bottom-right'
  | 'bottom-left'
  | 'top-right'
  | 'top-left';

export type HUDTab = 'tensions' | 'material' | 'fidelity';

export interface SigilHUDProps {
  /** Position of the HUD toggle button */
  position?: HUDPosition;
  /** Initial tab to show when opened */
  defaultTab?: HUDTab;
  /** Whether the HUD starts expanded */
  defaultExpanded?: boolean;
  /** Custom CSS class for styling */
  className?: string;
}

export interface HUDPanelProps {
  /** Whether the panel is visible */
  isOpen: boolean;
  /** Callback to close the panel */
  onClose: () => void;
  /** Position of the panel */
  position: HUDPosition;
  /** Active tab */
  activeTab: HUDTab;
  /** Callback when tab changes */
  onTabChange: (tab: HUDTab) => void;
}

export interface TensionSliderProps {
  /** Tension name (playfulness, density, etc.) */
  name: string;
  /** Current value (0-100) */
  value: number;
  /** Callback when value changes */
  onChange: (value: number) => void;
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Step increment */
  step?: number;
}

export type MaterialType = 'clay' | 'glass' | 'machinery' | 'paper' | 'fabric';

export interface MaterialPickerProps {
  /** Current material */
  value: MaterialType;
  /** Callback when material changes */
  onChange: (material: MaterialType) => void;
  /** Current zone name */
  zoneName?: string;
}

export type FidelityLevel = 'pass' | 'warn' | 'error';

export interface FidelityViolation {
  file: string;
  line?: number;
  type: string;
  message: string;
  severity: FidelityLevel;
}

export interface FidelityStatusProps {
  /** Overall fidelity status */
  status: FidelityLevel;
  /** Number of files checked */
  filesChecked: number;
  /** List of violations */
  violations: FidelityViolation[];
  /** Callback to run validation */
  onValidate?: () => void;
}

export interface ZoneConfig {
  name: string;
  paths: string[];
  material: MaterialType;
  motion: 'deliberate' | 'snappy' | 'playful';
}

export interface UseMaterialResult {
  material: MaterialType;
  physics: {
    weight: number;
    friction: number;
    bounce: number;
  };
  setMaterial: (material: MaterialType) => void;
  resetToZone: () => void;
}

export interface UseZoneResult {
  zone: ZoneConfig | null;
  zoneName: string;
  isLoading: boolean;
  detectZone: (path: string) => void;
}
