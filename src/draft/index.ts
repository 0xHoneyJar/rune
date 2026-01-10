/**
 * DRAFT REGISTRY — EXPERIMENTAL PATTERNS
 *
 * Quarantined experimental components. Draft code CAN exist and CAN
 * be merged to main. But Gold code CANNOT depend on Draft.
 *
 * RULES:
 * - Draft can import from Gold, Silver, and Draft
 * - Draft is quarantined — Gold cannot import Draft (contagion rule)
 * - Use for prototypes, experiments, deadline pressure
 * - Mark with @draft JSDoc tag
 *
 * QUARANTINE MODEL:
 * Draft components are allowed to exist and merge.
 * The contagion rule prevents Draft from infecting Gold.
 * Features can safely use Draft patterns.
 *
 * PROMOTION PATH:
 * 1. Draft pattern proves useful (3+ uses)
 * 2. Stabilize and move to Silver
 * 3. After 5+ uses with 0 mutinies, nominate for Gold
 *
 * AGENT PROTOCOL:
 * - Use /draft mode for quick experiments
 * - Tag all Draft code with @draft
 * - Remind user: "Draft cannot infect Gold"
 *
 * @sigil-zone registry
 * @sigil-physics N/A
 */

// =============================================================================
// EXPERIMENTAL — Prototypes and experiments
// =============================================================================

// Example: export { ExperimentalNav } from '../components/ExperimentalNav';
// Example: export { BetaFeatureCard } from '../components/BetaFeatureCard';

// =============================================================================
// DEADLINE PRESSURE — Quick hacks (mark for cleanup)
// =============================================================================

// Example: export { QuickFixButton } from '../components/QuickFixButton';

// =============================================================================
// TYPES
// =============================================================================

// Example: export type { ExperimentalNavProps } from '../components/ExperimentalNav';
