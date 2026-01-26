# Applying Behavior Skill

Apply behavioral physics to components. Behavior = how it responds.

---

## Core Principle

```
Effect → Sync strategy + Timing + Confirmation → Response pattern
```

Behavioral physics determine how interactions respond — not how they look or move.

---

## Workflow

### Step 1: Read Component

Identify:
- Current sync strategy (optimistic/pessimistic/immediate)
- Timing values (loading state duration, delays)
- Confirmation step (present/absent)
- Data fetching library (tanstack-query, swr, fetch)
- Effect type from mutation/action

### Step 2: Parse Behavioral Intent

| Keyword | Action |
|---------|--------|
| too slow | Reduce timing, consider optimistic |
| too fast | Increase timing, consider pessimistic |
| snappier | Reduce timing |
| needs confirmation | Add confirmation step |
| should be optimistic | Switch to optimistic sync |
| feels dangerous | Add confirmation, increase timing |

### Step 3: Show Behavioral Analysis

```
┌─ Behavioral Analysis ──────────────────────────────────┐
│                                                        │
│  Component:    [ComponentName]                         │
│  Effect:       [Financial/Destructive/Standard/Local]  │
│                                                        │
│  Current:                                              │
│  Sync:         [Optimistic/Pessimistic/Immediate]      │
│  Timing:       [Xms]                                   │
│  Confirmation: [Yes/No/Toast+Undo]                     │
│                                                        │
│  Proposed:                                             │
│  Sync:         [new value]                             │
│  Timing:       [new value]                             │
│  Confirmation: [new value]                             │
│                                                        │
│  Protected:                                            │
│  [✓/✗] Cancel always visible                          │
│  [✓/✗] Error recovery path                            │
│  [✓/✗] Balance accurate (if financial)               │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### Step 4: Check Protected Capabilities

**For Financial:**
- Cancel button present and always clickable
- Amount displayed before confirmation
- Balance shown and current
- NO optimistic updates

**For Destructive:**
- Confirmation step present
- Clear description of what will be deleted

If violation would occur → STOP and explain.

### Step 5: Apply Behavioral Changes

Only modify behavior-related code:
- `onMutate` / `onSuccess` / `onError` handlers
- Loading state management
- Confirmation modal/dialog logic
- Toast notifications
- Timing delays

Do NOT modify:
- Animation timing/easing
- Styling
- Component structure (unless adding confirmation)

### Step 6: Collect Feedback

> "Does the timing match the stakes of this action?"

Listen for behavioral language:
- "feels risky" → add confirmation, slow down
- "feels slow" → speed up, consider optimistic
- "users might misclick" → add confirmation
- "users do this constantly" → make faster

### Step 7: Log Taste Signal

```markdown
## [YYYY-MM-DD HH:MM] | [SIGNAL]
Component: [name]
Layer: Behavioral
Effect: [type]
Values: [Sync] [Xms] Confirm:[Yes/No]
---
```

---

## Behavioral Quick Reference

| Effect | Sync | Timing | Confirm | Min Timing |
|--------|------|--------|---------|------------|
| Financial | Pessimistic | 800ms | Required | 600ms |
| Destructive | Pessimistic | 600ms | Required | 400ms |
| Soft Delete | Optimistic | 200ms | Toast+Undo | 100ms |
| Standard | Optimistic | 200ms | None | 100ms |
| Local State | Immediate | 100ms | None | 0ms |

---

## Sync Strategies

**Pessimistic**: Server confirms → UI updates
- Use when operations cannot be undone
- User sees loading state → success/failure

**Optimistic**: UI updates → rollback on failure
- Use when operations are reversible
- Requires `onMutate` and `onError` rollback

**Immediate**: No server round-trip
- Pure client state (theme, toggles)
- Instant response expected

---

## Protected Capability Rules

NEVER (even if asked):
- Remove confirmation from financial operations
- Make destructive operations optimistic
- Hide cancel button during pending state
- Create dead-end error states

---

## When NOT to Use /behavior

- **Animation is wrong**: Use `/animate`
- **Styling is wrong**: Use `/style`
- **Everything is wrong**: Use `/craft`
- **Single value change**: Use Edit tool directly

Rule: /behavior is for sync, timing, and confirmation only.
