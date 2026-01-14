# CRAFT.md

Ralph-style prompt for Sigil. Run in a loop, tune until consistent.

```bash
while :; do cat CRAFT.md | claude-code ; done
```

---

## Context

Read and apply:
- `.claude/rules/00-sigil-core.md` — Priority hierarchy
- `.claude/rules/01-sigil-physics.md` — Behavioral physics
- `.claude/rules/02-sigil-detection.md` — Effect detection
- `.claude/rules/05-sigil-animation.md` — Animation physics
- `.claude/rules/07-sigil-material.md` — Material physics
- `.claude/rules/08-sigil-lexicon.md` — Keyword lookups
- `grimoires/sigil/taste.md` — Accumulated preferences

---

## Task

Generate the following components:

### 1. [Component Name]
```
Description: [what it does]
Effect hint: [financial/destructive/standard/local]
Feel: [adjectives - trustworthy, snappy, playful, etc.]
Material: [surface hints - glass, elevated, minimal, etc.]
```

### 2. [Component Name]
```
Description: [what it does]
Effect hint: [financial/destructive/standard/local]
Feel: [adjectives]
Material: [surface hints]
```

<!-- Add more components as needed -->

---

## Acceptance

Before marking complete:

- [ ] Physics analysis shown for each component
- [ ] Effect correctly detected from keywords/context
- [ ] Timing matches effect (800ms financial, 200ms standard, etc.)
- [ ] Animation matches frequency (springs for interactive, ease for deliberate)
- [ ] Material matches feel adjectives
- [ ] Protected capabilities verified (cancel visible, 44px targets, etc.)
- [ ] Matches existing codebase conventions
- [ ] No TypeScript errors
- [ ] Runs without runtime errors

---

## Tuning Notes

<!--
Operator: Add learnings here after each loop iteration.
These notes persist and refine future generations.
Format: YYYY-MM-DD: observation → correction
-->

### Physics Tuning
<!-- Wrong effect detected? Note the correction. -->

### Timing Tuning
<!-- Wrong duration? Note preferred values. -->

### Animation Tuning
<!-- Wrong easing? Note preferred springs/curves. -->

### Material Tuning
<!-- Wrong surface? Note preferred treatments. -->

### Codebase Tuning
<!-- Wrong patterns? Note conventions to follow. -->

---

## Example (delete after customizing)

### 1. ClaimRewardsButton
```
Description: Claims staking rewards from a DeFi pool
Effect hint: financial
Feel: trustworthy, deliberate
Material: elevated, solid
```

### 2. QuickLikeButton
```
Description: Likes a post in the feed
Effect hint: standard
Feel: snappy, playful
Material: minimal, flat
```

### 3. ThemeSwitch
```
Description: Toggles dark/light mode
Effect hint: local
Feel: instant, smooth
Material: minimal
```

### Tuning Notes (example)

#### Physics Tuning
- 2026-01-13: "claim" detected as financial ✓
- 2026-01-13: "like" detected as standard ✓

#### Timing Tuning
- 2026-01-13: Reduced financial timing to 600ms (team preference)

#### Animation Tuning
- 2026-01-13: Using spring(500,25) instead of spring(500,30) — bouncier feel

#### Material Tuning
- 2026-01-13: All buttons use 8px radius (design system)
- 2026-01-13: No shadows on standard buttons (minimal aesthetic)
