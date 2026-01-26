---
name: crafting
description: Generate or validate UI with design physics (Wyrd-integrated)
user-invocable: true
disable-model-invocation: true
allowed-tools:
  - Read
  - Write
  - Glob
---

# Crafting

Generate UI components with correct design physics, with Wyrd closed-loop integration.

## Usage

```
/glyph "component description"       # Generate mode (default)
/glyph --analyze "component"         # Analyze mode (physics only)
/glyph validate file.tsx             # Validate mode
/glyph --diagnose file.tsx           # Diagnose mode (suggest fixes)
```

## Philosophy

**Effect is truth.** What the code does determines its physics.

**Physics over preferences.** "Make it feel trustworthy" is not physics. "800ms pessimistic with confirmation" is physics.

## Workflow: Generate (Wyrd-Integrated)

### Phase 1: Hypothesis (Wyrd)

1. Read `grimoires/rune/taste.md` for user preferences
2. Detect effect from keywords/types (see Detection)
3. Look up physics from rules
4. Calculate confidence from `grimoires/rune/wyrd.md`
5. Present Hypothesis Box:

```
## Hypothesis

**Effect**: Financial (detected: "claim" keyword, Amount type)
**Physics**: Pessimistic sync, 800ms timing, confirmation required
**Taste Applied**: 500ms override (power user preference, Tier 2)
**Confidence**: 0.85

Does this match your intent? [y/n/adjust]
```

### Phase 2: Generation (on accept)

1. Generate complete React/TSX code
2. Apply physics rules:
   - Sync strategy (pessimistic/optimistic/immediate)
   - Timing (ms values)
   - Confirmation pattern
   - Animation physics
3. Match codebase conventions

### Phase 3: Self-Validation (Wyrd + Rigor)

1. Check physics compliance:
   - No `onMutate` for pessimistic sync
   - Loading states present
   - Timing values match
2. Check protected capabilities:
   - Cancel button not hidden during loading
   - Withdraw always reachable
   - Touch targets >= 44px
3. Run Rigor checks if web3 detected:
   - BigInt safety
   - Data source correctness
   - Receipt guards
4. Auto-repair if violations found
5. Show validation summary:

```
## Self-Validation
✓ Physics: Pessimistic sync implemented correctly
✓ Protected: Cancel button present and visible
✓ Rigor: BigInt checks use `!= null && > 0n`

[Auto-repaired: Added min-h-[44px] to button]
```

### Phase 4: Write and Log

1. Write component to file
2. Log decision to NOTES.md Design Physics section:
   ```
   | 2026-01-25 | ClaimButton | Financial | 500ms | power-user | Sprint-1 |
   ```
3. Start 30-minute edit monitoring

### Phase 5: Learn from Edits (Wyrd)

If user modifies file within 30 minutes:

1. Detect changes via git diff
2. Analyze for physics-relevant modifications
3. Prompt: "Record as taste? [y/n]"
4. Log to rejections.md
5. Update confidence calibration

## Detection

### Priority

1. **Types** — `Currency`, `Wei`, `Token` → Always Financial
2. **Keywords** — Match against effect lists
3. **Context** — Phrases like "with undo" modify effect

### Keywords by Effect

**Financial**: claim, deposit, withdraw, transfer, swap, send, pay, mint, burn, stake, unstake, bridge, approve

**Destructive**: delete, remove, destroy, revoke, terminate, purge, erase, wipe, clear, reset

**Soft Delete**: archive, hide, trash, dismiss, snooze, mute (with undo)

**Standard**: save, update, edit, create, add, like, follow, bookmark, favorite, star

**Local**: toggle, switch, expand, collapse, select, focus, show, hide, open, close, theme

## Physics Table

| Effect | Sync | Timing | Confirmation |
|--------|------|--------|--------------|
| Financial | Pessimistic | 800ms | Required |
| Destructive | Pessimistic | 600ms | Required |
| Soft Delete | Optimistic | 200ms | Toast + Undo |
| Standard | Optimistic | 200ms | None |
| Navigation | Immediate | 150ms | None |
| Local State | Immediate | 100ms | None |

## Protected Capabilities

| Capability | Rule |
|------------|------|
| Withdraw | Always reachable |
| Cancel | Always visible |
| Balance | Always accurate |
| Touch target | >= 44px |
| Focus ring | Always visible |

## Rules Loaded

- `.claude/constructs/packs/rune/rules/glyph/*.md` (always)
- `.claude/rules/glyph/*.md` (local overrides)
- `.claude/constructs/packs/rune/rules/sigil/01-sigil-taste.md` (for reading taste)
- `.claude/constructs/packs/rune/rules/wyrd/01-wyrd-hypothesis.md` (for confidence)

## Reference Skills (on-demand)

Load when detailed tables needed:
- `physics-reference` - Full physics tables with rationale
- `patterns-reference` - Golden implementations
