/**
 * eslint-plugin-sigil
 *
 * ESLint plugin for Sigil design system enforcement.
 * Part of Sigil v7.5 "The Reference Studio" - compile-time enforcement + contagion rules.
 *
 * @version 7.5.0
 *
 * Rules:
 * - enforce-tokens: Disallow arbitrary Tailwind values (use design tokens)
 * - zone-compliance: Enforce zone-appropriate animation timing
 * - input-physics: Enforce keyboard navigation in admin zones
 * - gold-imports-only: Gold can only import from Gold (contagion)
 * - no-gold-imports-draft: Gold cannot import Draft (quarantine)
 *
 * @example
 * // eslint.config.js (flat config)
 * import sigil from 'eslint-plugin-sigil';
 *
 * export default [
 *   sigil.configs.recommended,
 *   // For contagion enforcement:
 *   sigil.configs.contagion,
 *   // or manually configure:
 *   {
 *     plugins: { sigil },
 *     rules: {
 *       'sigil/enforce-tokens': 'error',
 *       'sigil/zone-compliance': 'warn',
 *       'sigil/input-physics': 'warn',
 *       'sigil/gold-imports-only': 'error',
 *       'sigil/no-gold-imports-draft': 'error',
 *     },
 *   },
 * ];
 */

import { enforceTokens } from "./rules/enforce-tokens";
import { zoneCompliance } from "./rules/zone-compliance";
import { inputPhysics } from "./rules/input-physics";
import { goldImportsOnly } from "./rules/gold-imports-only";
import { noGoldImportsDraft } from "./rules/no-gold-imports-draft";
import { recommended, strict, relaxed, contagion, contagionWarn } from "./configs/recommended";

// Re-export utilities for external use
export { loadConfig, clearConfigCache } from "./config-loader";
export type { SigilConfig, ZoneConfig, PhysicsConfig } from "./config-loader";
export { resolveZone, isInZone, getAllZones } from "./zone-resolver";
export type { ResolvedZone } from "./zone-resolver";

// Re-export rule option types
export type { EnforceTokensOptions } from "./rules/enforce-tokens";
export type { ZoneComplianceOptions } from "./rules/zone-compliance";
export type { InputPhysicsOptions } from "./rules/input-physics";
export type { GoldImportsOnlyOptions } from "./rules/gold-imports-only";
export type { NoGoldImportsDraftOptions } from "./rules/no-gold-imports-draft";

/**
 * Plugin rules
 */
export const rules = {
  "enforce-tokens": enforceTokens,
  "zone-compliance": zoneCompliance,
  "input-physics": inputPhysics,
  "gold-imports-only": goldImportsOnly,
  "no-gold-imports-draft": noGoldImportsDraft,
};

/**
 * Plugin configurations
 */
export const configs = {
  recommended,
  strict,
  relaxed,
  contagion,
  contagionWarn,
};

/**
 * Plugin meta information
 */
export const meta = {
  name: "eslint-plugin-sigil",
  version: "7.5.0",
};

/**
 * Default export for ESLint flat config compatibility
 */
const plugin = {
  meta,
  rules,
  configs,
};

export default plugin;
