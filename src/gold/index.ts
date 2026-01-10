/**
 * GOLD REGISTRY — THE CANON
 *
 * This file defines what components are "blessed" (canonical).
 * If a component is exported from this file, it is Gold.
 *
 * RULES:
 * - Gold can ONLY import from Gold (no Silver, no Draft)
 * - Components in Gold have proven stability (5+ uses, 0 mutinies)
 * - To promote: Add export line here (1 line change)
 * - To demote: Remove export line (1 line change)
 * - Components NEVER move — only registry membership changes
 *
 * AGENT PROTOCOL:
 * - Read this file FIRST on any UI task
 * - Use Gold patterns as archetypes
 * - Copy exactly, adapt only content (labels, handlers)
 * - If no Gold archetype exists, use /forge to explore
 *
 * @sigil-zone registry
 * @sigil-physics N/A
 */

// =============================================================================
// CRITICAL ZONE — Money movement, irreversible actions
// Physics: server-tick (600ms), deliberate (800ms)
// =============================================================================

// Example: export { CriticalButton } from '../components/CriticalButton';
// Example: export { ConfirmDialog } from '../components/ConfirmDialog';

// =============================================================================
// IMPORTANT ZONE — Significant but reversible
// Physics: deliberate (800ms)
// =============================================================================

// Example: export { PrimaryButton } from '../components/PrimaryButton';
// Example: export { FormCard } from '../components/FormCard';

// =============================================================================
// CASUAL ZONE — Navigation, display, feedback
// Physics: snappy (150ms), smooth (300ms)
// =============================================================================

// Example: export { Button } from '../components/Button';
// Example: export { Card } from '../components/Card';
// Example: export { Link } from '../components/Link';

// =============================================================================
// TYPES — Type exports for all Gold components
// =============================================================================

// Example: export type { CriticalButtonProps } from '../components/CriticalButton';
// Example: export type { ButtonProps } from '../components/Button';
