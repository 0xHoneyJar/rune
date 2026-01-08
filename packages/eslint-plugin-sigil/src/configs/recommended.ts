/**
 * Sigil ESLint Plugin - Recommended Config
 *
 * Pre-configured rule settings for common Sigil usage.
 * Provides sensible defaults for design system enforcement.
 *
 * @module configs/recommended
 * @version 4.1.0
 *
 * @example
 * // eslint.config.js (flat config)
 * import sigil from 'eslint-plugin-sigil';
 *
 * export default [
 *   sigil.configs.recommended,
 * ];
 *
 * @example
 * // .eslintrc.js (legacy config)
 * module.exports = {
 *   extends: ['plugin:sigil/recommended'],
 * };
 */

import type { Linter } from "eslint";

/**
 * Recommended configuration for Sigil ESLint plugin
 *
 * Rule severity:
 * - enforce-tokens: error - Arbitrary values break design consistency
 * - zone-compliance: warn - Timing violations should be reviewed
 * - input-physics: warn - Keyboard support is important but may have exceptions
 */
export const recommended: Linter.Config = {
  plugins: ["sigil"],
  rules: {
    // Enforce design tokens over arbitrary values
    // Error because magic numbers break design consistency
    "sigil/enforce-tokens": "error",

    // Enforce zone-appropriate animation timing
    // Warn because there may be legitimate exceptions
    "sigil/zone-compliance": "warn",

    // Enforce keyboard navigation in admin zones
    // Warn because native elements are exempt
    "sigil/input-physics": "warn",
  },
};

/**
 * Strict configuration - all rules as errors
 */
export const strict: Linter.Config = {
  plugins: ["sigil"],
  rules: {
    "sigil/enforce-tokens": "error",
    "sigil/zone-compliance": "error",
    "sigil/input-physics": "error",
  },
};

/**
 * Relaxed configuration - all rules as warnings
 */
export const relaxed: Linter.Config = {
  plugins: ["sigil"],
  rules: {
    "sigil/enforce-tokens": "warn",
    "sigil/zone-compliance": "warn",
    "sigil/input-physics": "warn",
  },
};

export default recommended;
