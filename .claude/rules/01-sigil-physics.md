# Sigil: Design Physics

You generate UI components with correct physics. Physics are determined by **effect** (what the code does), not preferences.

## Physics Table

| Effect | Sync | Timing | Confirmation | Animation | Interruptible |
|--------|------|--------|--------------|-----------|---------------|
| Financial | Pessimistic | 800ms | Required | ease-out | No |
| Destructive | Pessimistic | 600ms | Required | ease-out | No |
| Soft Delete | Optimistic | 200ms | Toast + Undo | spring(500, 30) | Yes |
| Standard | Optimistic | 200ms | None | spring(500, 30) | Yes |
| Navigation | Immediate | 150ms | None | ease | Yes |
| Query | Optimistic | 150ms | None | fade-in | Yes |
| Local State | Immediate | 100ms | None | spring(700, 35) | Yes |
| High-freq | Immediate | 0ms | None | none | N/A |

**See 05-sigil-animation.md** for detailed animation physics (easing blueprint, timing by frequency, spring values, entrance/exit asymmetry).

## Why These Physics

**Financial (800ms, pessimistic):** Users need time to verify amounts and mentally commit to irreversible value transfer. Faster timing creates anxiety. Server must confirm before UI updates because rollback is impossible.

**Destructive (600ms, pessimistic):** Permanent deletions require deliberation. The slower timing signals gravity. Confirmation prevents accidents that cannot be undone.

**Soft Delete (200ms, optimistic):** When undo exists, we can be fast. The toast with undo provides a safety net without friction. Users feel in control.

**Standard (200ms, optimistic):** Reversible actions should feel snappy. UI updates immediately, rolls back on error. Low stakes = fast feedback.

**Local State (100ms, immediate):** No server round-trip. Users expect instant feedback for toggles and client-only state.

## Automatic Inference

Infer these from effect type without asking the user:
- **Sync strategy** → from physics table above
- **Timing** → from physics table above
- **Confirmation** → from physics table above
- **Animation easing** → from physics table above
- **Interruptibility** → from physics table above
- **Animation library** → discover from codebase (check package.json)
- **Data fetching** → discover from codebase (check for tanstack-query, swr)

Animation frequency is inferred from component type:
- **High-freq (50+/day)**: Command palettes, keyboard nav, frequent hovers → 0ms
- **Medium (multi/session)**: Dropdowns, tooltips, tabs → 150-200ms
- **Low (occasional)**: Modals, dialogs, confirmations → 200-300ms
- **Rare (once/session)**: Onboarding, celebrations → 300-500ms

## Output Format

Before generating code, show physics analysis in this exact format:

```
┌─ Physics Analysis ─────────────────────────────────────┐
│                                                        │
│  Component:    [ComponentName]                         │
│  Effect:       [Effect type]                           │
│  Detected by:  [keyword or type that triggered]        │
│                                                        │
│  ┌─ Applied Physics ────────────────────────────────┐  │
│  │  Sync:         [Pessimistic/Optimistic/Immediate]│  │
│  │  Timing:       [Xms] [description]               │  │
│  │  Confirmation: [Required/None/Toast+Undo]        │  │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
│  ┌─ Animation ─────────────────────────────────────┐   │
│  │  Easing:       [ease-out/spring/ease-in-out]    │   │
│  │  Spring:       [stiffness, damping] (if spring) │   │
│  │  Entrance:     [Xms, curve]                     │   │
│  │  Exit:         [Xms, curve] (asymmetric)        │   │
│  │  Frequency:    [high/medium/low/rare]           │   │
│  │  Interruptible: [Yes/No]                        │   │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
│  Protected: [checklist of verified capabilities]       │
│                                                        │
└────────────────────────────────────────────────────────┘

Proceed with these physics? (yes / or describe what's different)
```

Wait for user confirmation before generating code.
