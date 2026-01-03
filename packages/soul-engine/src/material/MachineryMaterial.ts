/**
 * Machinery Material
 *
 * Instant, precise, zero-latency.
 * Inspired by Linear, Teenage Engineering, command palettes.
 * Best for data tables, admin tools, and power-user interfaces.
 */

import type {
  MaterialPhysics,
  CSSProperties,
  AnimationConfig,
  SpringConfig,
} from './types.js';

/**
 * Machinery Material Physics Implementation
 *
 * Characteristics:
 * - Instant, precise feedback
 * - Zero transition delay
 * - Step-based state changes
 * - Minimal decoration
 *
 * Forbidden patterns:
 * - Fade-in animations
 * - Bounce effects
 * - Loading spinners (use skeleton or progress)
 * - Rounded corners (minimal only)
 * - Decorative shadows
 */
export class MachineryMaterial implements MaterialPhysics {
  readonly name = 'machinery' as const;
  readonly description = 'Instant, precise, zero-latency. For command palettes and data.';

  readonly forbidden = [
    'fade-animation',
    'bounce-effect',
    'loading-spinner',
    'decorative-shadow',
    'spring-motion',
    'transition-delay',
    'rounded-corners',
  ];

  /**
   * Get surface CSS properties
   * Machinery uses flat, precise surfaces
   */
  getSurfaceCSS(): CSSProperties {
    return {
      background: '#0A0A0A',
      color: '#FAFAFA',
      borderRadius: '6px',
      border: '1px solid #2A2A2A',
    };
  }

  /**
   * Get shadow CSS
   * Machinery uses no decorative shadows
   */
  getShadowCSS(): string {
    return 'none';
  }

  /**
   * Get lighting CSS
   * Machinery uses no gradients
   */
  getLightingCSS(): string {
    return 'none';
  }

  /**
   * Get entrance animation
   * Machinery appears instantly or with minimal reveal
   */
  getEntranceAnimation(): AnimationConfig {
    return {
      keyframes: [
        { opacity: 0.8 },
        { opacity: 1 },
      ],
      options: {
        duration: 50, // Near-instant
        easing: 'linear',
        fill: 'forwards',
      },
    };
  }

  /**
   * Get hover effect
   * Machinery shows instant feedback via background change
   */
  getHoverEffect(): CSSProperties {
    return {
      background: '#1A1A1A',
      borderColor: '#3A3A3A',
    };
  }

  /**
   * Get active/pressed effect
   * Machinery shows instant selection state
   */
  getActiveEffect(): CSSProperties {
    return {
      background: '#2A2A2A',
      borderColor: '#4A4A4A',
    };
  }

  /**
   * Get spring configuration
   * Machinery uses no spring (instant transitions)
   */
  getSpringConfig(): SpringConfig | null {
    return null;
  }

  /**
   * Get transition duration
   * Machinery uses near-zero transitions
   */
  getTransitionDuration(): number {
    return 0;
  }

  /**
   * Get feedback delay
   * Machinery has zero feedback delay
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
        return `Pattern "${pattern}" is not recommended for Machinery material. ` +
          `Machinery material emphasizes instant feedback and precision. ` +
          `Consider using step transitions and immediate state changes instead.`;
      }
    }

    return null;
  }
}

/**
 * Singleton instance
 */
export const machineryMaterial = new MachineryMaterial();
