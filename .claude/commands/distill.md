---
name: "distill"
description: |
  Distill a task into craft-able components.
  Bridge between architecture (Loa) and physics (Sigil).
---

# /distill

Extract the component essences from a broader task. Get a list of components with physics hints ready for `/craft`.

## Input

User provides a task, feature, or requirement. Examples:
- "implement mobile view"
- "add checkout flow"
- "redesign settings page"

## Process

### Step 1: Identify UI Touchpoints

Read the task. List every user-facing interaction:

```
Task: "implement mobile view"

Touchpoints:
1. Navigation — how users move between sections
2. Actions — primary buttons, CTAs
3. Content — cards, lists, data display
4. Input — forms, search, filters
5. Feedback — toasts, modals, loading states
```

### Step 2: Detect Effects

For each touchpoint, detect the effect using Sigil's lexicon:

```
┌─ Touchpoint Analysis ─────────────────────────────────┐
│                                                       │
│  Navigation drawer    → Local State (toggle, expand)  │
│  Action bar buttons   → Standard (save, share)        │
│  Checkout CTA         → Financial (purchase, pay)     │
│  Delete items         → Soft Delete (with undo)       │
│  Search/filter        → Query (fetch, filter)         │
│                                                       │
└───────────────────────────────────────────────────────┘
```

### Step 3: Extract Physics Hints

For each component, note the physics cues from the task context:

| Component | Effect | Hints from Context |
|-----------|--------|-------------------|
| Mobile nav | Local | touch-friendly, collapsible |
| Action bar | Standard | thumb-reachable, snappy |
| Card grid | Query | responsive, swipeable |

### Step 4: Generate Component List

Output components with physics hints:

```markdown
## Components

1. **mobile nav drawer** — local, touch-friendly, collapsible, 44px targets
2. **mobile action bar** — standard, thumb-reachable, snappy
3. **responsive card grid** — query, swipeable, optimistic loading
4. **pull-to-refresh** — query, immediate feedback, spring animation
5. **bottom sheet modal** — local, gesture-dismissible, elevated
```

### Step 5: Priority Sort

Reorder by:
1. **Blocking** — Components others depend on (nav, layout)
2. **Financial/Destructive** — High-stakes need most attention
3. **Frequency** — High-use components benefit most from physics
4. **Complexity** — Simpler first builds momentum

## Output Format

```
┌─ Distilled: [Task Name] ──────────────────────────────┐
│                                                       │
│  Touchpoints found:  [N]                              │
│  Components extracted:  [N]                           │
│                                                       │
│  Effect Distribution:                                 │
│    Financial:    [N] components                       │
│    Destructive:  [N] components                       │
│    Standard:     [N] components                       │
│    Local:        [N] components                       │
│    Query:        [N] components                       │
│                                                       │
└───────────────────────────────────────────────────────┘

## Components (ready for /craft)

1. [component] — [effect], [physics hints]
2. [component] — [effect], [physics hints]
...

Start with: /craft "[first component] — [hints]"
```

## Integration with Loa

If Loa artifacts exist, read them for context:

1. **PRD** → User stories reveal touchpoints
2. **SDD** → Architecture reveals data flow (optimistic vs pessimistic)
3. **Sprint Plan** → Tasks may already list components

Distill enriches Loa's architecture with Sigil's physics lens.

## Example

```
User: /distill "implement mobile checkout flow"

┌─ Distilled: Mobile Checkout Flow ─────────────────────┐
│                                                       │
│  Touchpoints found:  8                                │
│  Components extracted:  6                             │
│                                                       │
│  Effect Distribution:                                 │
│    Financial:    2 components (cart total, pay CTA)   │
│    Standard:     2 components (address, shipping)     │
│    Local:        1 component (payment method toggle)  │
│    Query:        1 component (order summary)          │
│                                                       │
└───────────────────────────────────────────────────────┘

## Components (ready for /craft)

1. **cart total display** — financial, always accurate, pessimistic
2. **pay now button** — financial, 800ms, confirmation required, elevated
3. **address form** — standard, optimistic, inline validation
4. **shipping selector** — standard, radio group, immediate feedback
5. **payment method toggle** — local, accordion, touch-friendly
6. **order summary** — query, skeleton loading, pull-to-refresh

Start with: /craft "cart total display — financial, always accurate"
```

## When to Use

| Situation | Use |
|-----------|-----|
| Loa sprint task → components | `/distill` |
| Vague feature request | `/distill` |
| "Make mobile work" | `/distill` |
| Single known component | `/craft` directly |
| Material-only changes | `/style` |
