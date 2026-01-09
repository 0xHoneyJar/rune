---
name: approve
version: "6.1.0"
description: Taste Key holder sign-off for canonical-candidate patterns
agent: approving-patterns
agent_path: .claude/skills/approving-patterns/SKILL.md
preflight:
  - sigil_mark_exists
---

# /approve

Taste Key holder approval for canonical-candidate patterns.

## v6.1 Curated Promotion

In v6.1, patterns no longer auto-promote to canonical at 5+ occurrences.
Instead, they become `canonical-candidate` and require taste-key approval.

## Usage

```
/approve [pattern]             # Approve a canonical-candidate pattern
/approve --pending             # List pending promotions
/approve --list                # List approved patterns
/approve --reject [pattern]    # Reject a pattern
/approve --ruling [name]       # Create override ruling
/approve --history             # Show approval history
/approve --revoke [id]         # Revoke a ruling
```

## Authority Boundaries

### Taste Key CAN Override

| Category | Examples |
|----------|----------|
| Budgets | Element count, animation count, color count |
| Fidelity | Gradient stops, shadow layers, animation duration |
| Taste | Colors, typography, spacing, motion |

### Taste Key CANNOT Override

| Category | Why |
|----------|-----|
| Physics | Sync authority, tick modes are product integrity |
| Security | Auth, validation are non-negotiable |
| Accessibility | Contrast, keyboard nav are requirements |

## Ruling Types

| Type | Description |
|------|-------------|
| `pattern_approval` | Lock a visual pattern |
| `budget_override` | Exception to budget limit |
| `fidelity_override` | Exception to fidelity ceiling |

## Examples

### Pattern Approval

```
/approve "Primary button style"

Pattern: Primary button style
Material: clay
Physics: ✓ PASS

As Taste Key holder, approve this pattern?
[approve] [modify] [reject]
```

### Override Ruling

```
/approve --ruling "animation-exception"

RULING CREATED
ID: RULING-2026-001
Type: fidelity_override (animation_duration)
Scope: src/features/checkout/ClaimButton.tsx

Justification: Celebration moment requires longer animation.
```

### Physics Override Blocked

```
/approve --ruling "optimistic-checkout"

BLOCKED: PHYSICS OVERRIDE ATTEMPTED

Optimistic updates in server_authoritative zones
cannot be overridden. This is physics, not taste.

Route to Loa for structural change: /consult
```

## Outputs

Rulings saved to: `sigil-mark/taste-key/rulings/*.yaml`

## Integration

- `/validate` checks for rulings before blocking
- Rulings allow exceptions without changing constraints
- Rulings can be revoked via `--revoke`

## v6.1 Pattern Approval Flow

### Promotion Lifecycle

```
experimental (1-2 occurrences)
    ↓
surviving (3-4 occurrences)
    ↓
canonical-candidate (5+ occurrences) ← Requires /approve
    ↓
canonical (after taste-key approval)
```

### List Pending Patterns

```
/approve --pending

Pending Promotions:
1. spring-animation (7 occurrences, since 2026-01-01)
   Files: Button.tsx, Modal.tsx, Tooltip.tsx
2. glass-effect (5 occurrences, since 2026-01-05)
   Files: Header.tsx, Card.tsx
```

### Approve Pattern

```
/approve spring-animation

Pattern 'spring-animation' approved.
Status: canonical
Updated: .sigil/survival.json
Updated: .sigil/taste-key.yaml
```

### Reject Pattern

```
/approve --reject glass-effect "Not aligned with product direction"

Pattern 'glass-effect' rejected.
Reason: Not aligned with product direction
Updated: .sigil/survival.json (status: rejected)
Updated: .sigil/taste-key.yaml
```

## Implementation

The `/approve` command uses these functions from `survival-observer.ts`:

```typescript
import {
  getPendingPromotions,
  approvePromotion,
  rejectPromotion,
  isPatternApproved,
  isPatternPending,
} from 'sigil-mark/process/survival-observer';
```

## Next Step

After `/approve`:
- Pattern is locked as canonical
- Pattern is preferred in future `/craft` generations
- `/garden` includes pattern in canonical list
