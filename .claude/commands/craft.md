---
name: craft
version: "2.0.0"
description: Get design guidance with zone and lens context
agent: crafting-components
agent_path: .claude/skills/crafting-components/SKILL.md
preflight:
  - sigil_mark_exists
context_injection: true
---

# /craft

Get design guidance with zone and lens context. Helps you select the right Layout, Lens, and time authority for your component.

## Usage

```
/craft [component_description]               # Get guidance
/craft [component_description] --file [path] # Specify target file
/craft [path]                                # Diagnose existing file
```

## Workflow

```
1. DETERMINE CONTEXT
   - Get file path (from --file or description)
   - Identify component purpose (critical, admin, marketing)
   - Map to appropriate Layout

2. SELECT LAYOUT
   - CriticalZone → High-stakes actions (payments, destructive)
   - MachineryLayout → Admin lists, keyboard-driven UIs
   - GlassLayout → Marketing, hover-driven showcases

3. DETERMINE TIME AUTHORITY
   - server-tick → Payments, irreversible actions
   - optimistic → Lists, reversible actions
   - hybrid → Collaborative, real-time sync

4. RECOMMEND LENS
   - CriticalZone + financial → StrictLens (forced)
   - Other zones → User preference (DefaultLens)
   - Accessibility mode → A11yLens

5. OUTPUT GUIDANCE
   - Show recommended pattern
   - Show code example
   - Note any physics constraints
```

## Output Format

```
CONTEXT: Payment confirmation button
LAYOUT: CriticalZone (financial=true)
TIME AUTHORITY: server-tick
LENS: StrictLens (forced by CriticalZone)

RECOMMENDED PATTERN:
┌─────────────────────────────────────────────────────────┐
│ import { useCriticalAction, CriticalZone, useLens }     │
│ from 'sigil-mark';                                      │
│                                                         │
│ const payment = useCriticalAction({                     │
│   mutation: () => api.pay(amount),                      │
│   timeAuthority: 'server-tick',                         │
│ });                                                     │
│                                                         │
│ const Lens = useLens();                                 │
│                                                         │
│ <CriticalZone financial>                                │
│   <Lens.CriticalButton state={payment.state} ... />    │
│ </CriticalZone>                                         │
└─────────────────────────────────────────────────────────┘

PHYSICS:
- Touch target: 48px (StrictLens)
- Animations: None (StrictLens)
- State machine: idle → confirming → pending → confirmed/failed
```

## Layout Selection Guide

| Use Case | Layout | Lens | Time Authority |
|----------|--------|------|----------------|
| Payment, checkout | CriticalZone | StrictLens (forced) | server-tick |
| Delete, destructive | CriticalZone | StrictLens (forced) | server-tick |
| Admin list, table | MachineryLayout | User preference | optimistic |
| Product card | GlassLayout | User preference | optimistic |
| Marketing hero | GlassLayout | User preference | optimistic |

## Lens Characteristics

| Lens | Touch Target | Contrast | Animations |
|------|-------------|----------|------------|
| DefaultLens | 44px | Standard | Yes |
| StrictLens | 48px | High | No |
| A11yLens | 56px | WCAG AAA | No |

## Examples

```
/craft "Create a confirm button for checkout"
→ LAYOUT: CriticalZone (financial=true)
→ LENS: StrictLens (forced)
→ TIME AUTHORITY: server-tick
→ Generates: useCriticalAction + CriticalZone + Lens.CriticalButton

/craft "Build a data table for admin"
→ LAYOUT: MachineryLayout
→ LENS: DefaultLens (user preference)
→ TIME AUTHORITY: optimistic
→ Generates: MachineryLayout + Lens.MachineryItem

/craft "Design a product card"
→ LAYOUT: GlassLayout (variant="card")
→ LENS: DefaultLens (user preference)
→ HOVER PHYSICS: scale 1.02, translateY -4px
→ Generates: GlassLayout + Lens.GlassButton
```

## Diagnostic Mode

When given a file path, diagnose current implementation:

```
/craft src/features/checkout/PaymentForm.tsx

DIAGNOSIS:
┌─────────────────────────────────────────────────────────┐
│ Current: Raw <button> with onClick                      │
│ Issue: Missing Layout context and Lens components       │
│                                                         │
│ Recommended:                                            │
│ - Wrap in CriticalZone (financial=true)                 │
│ - Use useCriticalAction with server-tick                │
│ - Use Lens.CriticalButton for proper state handling     │
└─────────────────────────────────────────────────────────┘
```

## Next Steps

- `/validate` — Check Layout and Lens compliance
- `/garden` — Detect drift and deprecated patterns
- `/codify` — Update zone preferences in .sigilrc.yaml
