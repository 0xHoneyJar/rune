/**
 * Material Type Definitions
 *
 * Materials define physics, not just styles.
 * Glass refracts. Clay has weight. Machinery clicks.
 */

/**
 * The three core material types
 */
export type MaterialType = 'glass' | 'clay' | 'machinery';

/**
 * CSS property record type
 */
export type CSSProperties = Record<string, string | number>;

/**
 * Animation keyframe configuration
 */
export interface AnimationConfig {
  keyframes: Keyframe[];
  options: KeyframeAnimationOptions;
}

/**
 * Spring animation parameters
 */
export interface SpringConfig {
  tension: number;
  friction: number;
  mass: number;
}

/**
 * Material physics interface
 * Defines how a material behaves, not just how it looks
 */
export interface MaterialPhysics {
  /** Material identifier */
  readonly name: MaterialType;

  /** Human-readable description */
  readonly description: string;

  // === CSS Generation ===

  /** Get surface styling (background, border-radius, etc.) */
  getSurfaceCSS(): CSSProperties;

  /** Get shadow styling as CSS string */
  getShadowCSS(): string;

  /** Get lighting/gradient effects */
  getLightingCSS(): string;

  // === Animation Configs ===

  /** Get entrance animation configuration */
  getEntranceAnimation(): AnimationConfig;

  /** Get hover state effects */
  getHoverEffect(): CSSProperties;

  /** Get active/pressed state effects */
  getActiveEffect(): CSSProperties;

  /** Get spring configuration for animations */
  getSpringConfig(): SpringConfig | null;

  // === Timing ===

  /** Get transition duration in milliseconds */
  getTransitionDuration(): number;

  /** Get feedback delay in milliseconds */
  getFeedbackDelay(): number;

  // === Constraints ===

  /** Patterns that should not be used with this material */
  readonly forbidden: string[];

  /**
   * Check if a pattern is forbidden for this material
   * Returns warning message if forbidden, null if allowed
   */
  checkForbidden(pattern: string): string | null;
}

/**
 * Material context for React context
 */
export interface MaterialContext {
  /** Current material type */
  material: MaterialType;

  /** Physics implementation for current material */
  physics: MaterialPhysics;

  /** Set new material */
  setMaterial: (material: MaterialType) => void;

  /** Current zone name (if detected) */
  zone: string | null;
}

/**
 * Material physics lookup table
 */
export interface MaterialPhysicsTable {
  borderRadius: string;
  shadow: string;
  motion: string;
  feedback: string;
  transition: string;
}

/**
 * CSS Variables generated from material
 */
export interface MaterialCSSVariables {
  '--sigil-material-border-radius': string;
  '--sigil-material-shadow': string;
  '--sigil-material-transition': string;
  '--sigil-material-background': string;
  '--sigil-material-border': string;
  '--sigil-material-backdrop-filter': string;
}
