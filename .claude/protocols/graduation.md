# Graduation Protocol

> *"Apprentice → Journeyman → Master. Silver → Gold."*

## Purpose

Graduation is the process of promoting a Silver component to Gold tier. It marks a component as production-proven with assigned ownership and captured physics.

---

## Tier Definitions

| Tier | Meaning | Requirements |
|------|---------|--------------|
| Uncaptured | No interview done | - |
| **Silver** | Taste captured | 4 questions answered |
| **Gold** | Production proven | Silver + survival + owner + physics |

---

## Gold Requirements

A component can graduate to Gold when ALL of these are met:

### 1. Silver Status

Component must already have:
- `@description` - Problem solved
- `@feel` - How it feels
- `@rejected` - What was refused
- `@inspiration` - References
- `@intent` - JTBD label
- `@tier silver`

### 2. Production Survival

The component has been in production for at least 2 weeks without:
- Major bugs
- Reversion to rejected patterns
- User complaints about the feel

This is confirmed via interview, not automated.

### 3. Taste Owner

Someone is responsible for this component's taste:
- The person who captured it, OR
- A designer who approved it, OR
- The product owner

Maps to: `@tasteOwner`

### 4. Physics (if interactive)

For components with motion/animation:
- Spring parameters captured
- Timing/easing documented
- States defined (hover, loading, success, error)

Maps to: `@physics`

---

## Graduation Interview

### Command

```
/sigil taste graduate ClaimButton
```

### Pre-flight Check

1. Component exists
2. Component is Silver
3. Not already Gold

### Interview Questions

#### Question 1: Production Survival

```
Has ClaimButton been in production for 2+ weeks without issues?

Options:
- Yes, it's battle-tested
- No, still too new
- Unsure, let me check
```

If "No" or "Unsure": Exit with suggestion to wait.

#### Question 2: Taste Owner

```
Who owns the taste for ClaimButton?

This person is responsible for maintaining the feel.

Options:
- [Name from team]
- I own it
- Shared ownership
```

#### Question 3: Physics (if interactive)

```
Let's capture the physics parameters.

ClaimButton has motion. What are the spring values?

Options:
- Heavy/deliberate (stiffness: 80-120, damping: 15-20)
- Snappy/responsive (stiffness: 200-300, damping: 20-25)
- Bouncy/playful (stiffness: 150-180, damping: 10-12)
- Custom values
```

If "Custom values": Follow up for specific numbers.

### Physics Defaults by Feel

| Feel | Stiffness | Damping | Delay |
|------|-----------|---------|-------|
| Heavy, deliberate | 100-140 | 14-18 | 150-250ms |
| Snappy, responsive | 200-300 | 20-25 | 0-50ms |
| Bouncy, playful | 150-180 | 8-12 | 50-100ms |
| Smooth, elegant | 120-160 | 18-22 | 100-150ms |
| Subtle, invisible | 250-350 | 25-30 | 0ms |

---

## JSDoc Changes

### Before Graduation (Silver)

```typescript
/**
 * @tier silver
 * @capturedAt 2024-01-15
 */
```

### After Graduation (Gold)

```typescript
/**
 * @tier gold
 * @tasteOwner soju
 * @physics {"type":"spring","stiffness":120,"damping":14,"delay":200}
 * @capturedAt 2024-01-15
 * @graduatedAt 2024-02-01
 */
```

---

## Physics Format

The `@physics` tag supports:

### Spring Animation

```json
{
  "type": "spring",
  "stiffness": 120,
  "damping": 14,
  "delay": 200
}
```

### Timing Animation

```json
{
  "type": "timing",
  "duration": 300,
  "easing": "ease-out"
}
```

### Multiple States

```json
{
  "hover": {"type": "spring", "stiffness": 200, "damping": 20},
  "loading": {"type": "spring", "stiffness": 80, "damping": 12},
  "success": {"type": "spring", "stiffness": 150, "damping": 15, "delay": 100}
}
```

---

## Reverting Gold → Silver

If a Gold component:
- Has a regression
- Needs significant changes
- Loses its taste owner

It should be reverted:

```
/sigil taste demote ClaimButton
```

This:
1. Changes `@tier gold` → `@tier silver`
2. Removes `@graduatedAt`
3. Keeps other tags for context

---

## Agent Behavior

During graduation, the agent should:

1. **Verify eligibility** - Check all Silver tags present
2. **Confirm survival** - Ask about production experience
3. **Capture physics** - Suggest defaults based on feel
4. **Assign ownership** - Record taste owner
5. **Celebrate** - This is a milestone!

### Success Message

```
✓ ClaimButton graduated to Gold!

Taste Owner: soju
Physics: spring(120, 14, 200ms)
Graduated: 2024-02-01

The guild has marked this work as approved.
```

---

## Related Protocols

- [taste-interview.md](taste-interview.md) - Initial capture
- [vocabulary-governance.md](vocabulary-governance.md) - JTBD labels
