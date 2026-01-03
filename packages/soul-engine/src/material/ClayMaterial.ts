/**
 * Clay Material
 *
 * Warm, tactile, weighted.
 * Inspired by Airbnb, OSRS, physical objects.
 * Best for critical zones, trust-building, and marketing.
 */

import type {
  MaterialPhysics,
  CSSProperties,
  AnimationConfig,
  SpringConfig,
} from './types.js';

/**
 * Clay Material Physics Implementation
 *
 * Characteristics:
 * - Warm, tactile surfaces
 * - Soft, multi-layer shadows
 * - Spring motion with bounce
 * - Generous border radius
 *
 * Forbidden patterns:
 * - Flat design (no depth)
 * - Instant state changes
 * - Sharp corners
 * - Cold color palettes
 */
export class ClayMaterial implements MaterialPhysics {
  readonly name = 'clay' as const;
  readonly description = 'Warm, tactile, weighted. For critical and marketing zones.';

  readonly forbidden = [
    'flat-design',
    'instant-transition',
    'sharp-corners',
    'zero-shadow',
    'cold-palette',
  ];

  /**
   * Get surface CSS properties
   * Clay uses warm gradients with soft edges
   */
  getSurfaceCSS(): CSSProperties {
    return {
      background: 'linear-gradient(135deg, #FAFAF9 0%, #F5F5F4 100%)',
      borderRadius: '16px',
      border: 'none',
    };
  }

  /**
   * Get shadow CSS
   * Clay uses multi-layer soft shadows for depth
   */
  getShadowCSS(): string {
    return '0 1px 2px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.08)';
  }

  /**
   * Get lighting CSS
   * Clay uses warm gradients that suggest depth
   */
  getLightingCSS(): string {
    return 'linear-gradient(180deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 100%)';
  }

  /**
   * Get entrance animation
   * Clay uses spring motion with gentle bounce
   */
  getEntranceAnimation(): AnimationConfig {
    return {
      keyframes: [
        {
          opacity: 0,
          transform: 'translateY(8px) scale(0.96)',
        },
        {
          opacity: 1,
          transform: 'translateY(-2px) scale(1.01)',
          offset: 0.6,
        },
        {
          opacity: 1,
          transform: 'translateY(0) scale(1)',
        },
      ],
      options: {
        duration: 300,
        easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)', // Spring-like overshoot
        fill: 'forwards',
      },
    };
  }

  /**
   * Get hover effect
   * Clay lifts slightly on hover with enhanced shadow
   */
  getHoverEffect(): CSSProperties {
    return {
      transform: 'translateY(-2px)',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06), 0 8px 20px rgba(0, 0, 0, 0.1)',
    };
  }

  /**
   * Get active/pressed effect
   * Clay presses down with compressed shadow
   */
  getActiveEffect(): CSSProperties {
    return {
      transform: 'translateY(1px) scale(0.98)',
      boxShadow: '0 0px 2px rgba(0, 0, 0, 0.04), 0 2px 6px rgba(0, 0, 0, 0.06)',
    };
  }

  /**
   * Get spring configuration
   * Clay uses a warm, bouncy spring
   */
  getSpringConfig(): SpringConfig {
    return {
      tension: 170,
      friction: 26,
      mass: 1,
    };
  }

  /**
   * Get transition duration
   * Clay uses deliberate transitions
   */
  getTransitionDuration(): number {
    return 300;
  }

  /**
   * Get feedback delay
   * Clay has slight feedback delay for weight
   */
  getFeedbackDelay(): number {
    return 50;
  }

  /**
   * Check if a pattern is forbidden
   */
  checkForbidden(pattern: string): string | null {
    const normalizedPattern = pattern.toLowerCase().replace(/[_\s-]/g, '-');

    for (const forbidden of this.forbidden) {
      if (normalizedPattern.includes(forbidden)) {
        return `Pattern "${pattern}" is not recommended for Clay material. ` +
          `Clay material emphasizes warmth, depth, and tactile feedback. ` +
          `Consider using soft shadows, spring animations, and warm colors instead.`;
      }
    }

    return null;
  }
}

/**
 * Singleton instance
 */
export const clayMaterial = new ClayMaterial();
