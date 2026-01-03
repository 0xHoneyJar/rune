/**
 * Glass Material
 *
 * Light, translucent, refractive.
 * Inspired by VisionOS, iOS glass effects.
 * Best for exploratory zones and discovery experiences.
 */

import type {
  MaterialPhysics,
  CSSProperties,
  AnimationConfig,
  SpringConfig,
} from './types.js';

/**
 * Glass Material Physics Implementation
 *
 * Characteristics:
 * - Light and translucent backgrounds
 * - Blur and refraction effects
 * - Depth parallax
 * - Subtle, elegant transitions
 *
 * Forbidden patterns:
 * - Solid opaque backgrounds
 * - Hard shadows
 * - Instant state changes
 */
export class GlassMaterial implements MaterialPhysics {
  readonly name = 'glass' as const;
  readonly description = 'Light, translucent, refractive. For exploratory zones.';

  readonly forbidden = [
    'solid-background',
    'hard-shadow',
    'opaque-overlay',
    'bounce-animation',
    'heavy-border',
  ];

  /**
   * Get surface CSS properties
   * Glass uses translucent backgrounds with blur
   */
  getSurfaceCSS(): CSSProperties {
    return {
      background: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    };
  }

  /**
   * Get shadow CSS
   * Glass uses very subtle, diffuse shadows
   */
  getShadowCSS(): string {
    return '0 0 0 1px rgba(0, 0, 0, 0.05)';
  }

  /**
   * Get lighting CSS
   * Glass uses subtle inner glows and gradients
   */
  getLightingCSS(): string {
    return 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%)';
  }

  /**
   * Get entrance animation
   * Glass fades in with subtle scale
   */
  getEntranceAnimation(): AnimationConfig {
    return {
      keyframes: [
        { opacity: 0, transform: 'scale(0.98)', backdropFilter: 'blur(0px)' },
        { opacity: 1, transform: 'scale(1)', backdropFilter: 'blur(20px)' },
      ],
      options: {
        duration: 200,
        easing: 'ease-out',
        fill: 'forwards',
      },
    };
  }

  /**
   * Get hover effect
   * Glass brightens slightly on hover
   */
  getHoverEffect(): CSSProperties {
    return {
      background: 'rgba(255, 255, 255, 0.8)',
      boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.08)',
    };
  }

  /**
   * Get active/pressed effect
   * Glass compresses slightly when pressed
   */
  getActiveEffect(): CSSProperties {
    return {
      transform: 'scale(0.98)',
      background: 'rgba(255, 255, 255, 0.9)',
    };
  }

  /**
   * Get spring configuration
   * Glass uses no spring (smooth ease transitions)
   */
  getSpringConfig(): SpringConfig | null {
    return null;
  }

  /**
   * Get transition duration
   * Glass uses moderate transitions
   */
  getTransitionDuration(): number {
    return 200;
  }

  /**
   * Get feedback delay
   * Glass has no feedback delay
   */
  getFeedbackDelay(): number {
    return 0;
  }

  /**
   * Check if a pattern is forbidden
   */
  checkForbidden(pattern: string): string | null {
    const normalizedPattern = pattern.toLowerCase().replace(/[_\s-]/g, '-');

    for (const forbidden of this.forbidden) {
      if (normalizedPattern.includes(forbidden)) {
        return `Pattern "${pattern}" is not recommended for Glass material. ` +
          `Glass material emphasizes translucency and light effects. ` +
          `Consider using blur overlays or translucent backgrounds instead.`;
      }
    }

    return null;
  }
}

/**
 * Singleton instance
 */
export const glassMaterial = new GlassMaterial();
