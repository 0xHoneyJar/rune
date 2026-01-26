---
name: physics-reference
description: Full physics tables and timing rationale
user-invocable: false
invoked-by:
  - crafting (L4)
  - fating
---

# Physics Reference

Provides detailed physics tables when user asks "why?".

## Physics Table (Complete)

| Effect | Sync | Timing | Confirmation | Animation |
|--------|------|--------|--------------|-----------|
| Financial | Pessimistic | 800ms | Required | ease-out, spring(200, 30) |
| Destructive | Pessimistic | 600ms | Required | ease-out, spring(200, 30) |
| Soft Delete | Optimistic | 200ms | Toast + Undo | spring(500, 30) |
| Standard | Optimistic | 200ms | None | spring(500, 30) |
| Navigation | Immediate | 150ms | None | ease-out |
| Local State | Immediate | 100ms | None | spring(700, 35) |

## Timing Rationale

### 800ms for Financial

Minimum time for users to:
- Read the amount displayed
- Mentally commit to the action
- Feel the weight of an irreversible decision

Research shows sub-500ms confirmation for financial actions increases accidental transactions.

### 600ms for Destructive

Slightly faster than financial because:
- Often reversible (soft delete) or less severe
- Users expect faster response for non-money actions
- Still provides cognitive pause

### 200ms for Standard

Perceived as "instant" while allowing:
- Visual feedback to register
- Animation to complete
- User to notice the change

Faster than 100ms = users miss confirmation
Slower than 300ms = feels laggy

### 100ms for Local

No network latency to hide:
- Pure client state changes
- Users expect immediate response
- Matches native app feel

## Sync Strategy Details

### Pessimistic

```
User Action → Loading State → Server Confirms → UI Updates
```

Use when:
- Operations cannot be undone
- Money or tokens involved
- Data integrity critical

Implementation:
- NO `onMutate` callback
- Show loading/pending state
- Update UI only after server confirms

### Optimistic

```
User Action → UI Updates Immediately → Server Confirms (background)
                                    ↳ Rollback on failure
```

Use when:
- Operations are reversible
- Low stakes
- Speed perception matters

Implementation:
- `onMutate` for instant update
- `onError` for rollback
- `onSettled` for cleanup

### Immediate

```
User Action → UI Updates (no server)
```

Use when:
- Pure client state
- Theme, toggles, local preferences

Implementation:
- Direct state update
- No loading states
- No mutation hooks

## Spring Presets

| Name | Stiffness | Damping | Use For |
|------|-----------|---------|---------|
| Snappy | 700 | 35 | Local state, toggles |
| Responsive | 500 | 30 | Standard mutations |
| Organic | 300 | 25 | Drag gestures, morphs |
| Deliberate | 200 | 30 | Financial, important |

## Protected Capabilities (Non-Negotiable)

| Capability | Rule | Why |
|------------|------|-----|
| Withdraw | Always reachable | Users must always access funds |
| Cancel | Always visible | Every flow needs escape |
| Balance | Always accurate | Stale financial data harms |
| Touch target | ≥44px | Apple HIG, accessibility |
| Focus ring | Always visible | Keyboard navigation |

## Token Budget

~500 tokens when loaded.

## Load Trigger

Only loaded when:
- User asks "why?" during generation
- User invokes `/glyph --analyze`
- User runs `/wyrd test`
