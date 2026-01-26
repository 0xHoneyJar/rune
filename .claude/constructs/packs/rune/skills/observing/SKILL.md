---
name: observing
description: Capture taste observations for design preferences
user-invocable: true
disable-model-invocation: true
allowed-tools:
  - Read
  - Write
---

# Observing

The Sigil construct: taste capture and preference learning.

## Usage

```
/sigil "insight to record"
/sigil --status
```

## Philosophy

**Taste is personal physics.** When users modify generated code, they're tuning physics to their context. Sigil captures why.

- **Free-form over schema** — No YAML frontmatter, just markdown paragraphs
- **Append-only** — Never edit taste.md, only append
- **Human writes, Claude reads** — /sigil is for humans to record insights

## Workflow: Record (`/sigil "insight"`)

1. Format insight with timestamp header
2. Append to `grimoires/rune/taste.md`:
   ```markdown
   ## 2026-01-25 14:30

   They prefer 500ms for financial operations, not 800ms.
   Their users are power traders who find default timing sluggish.

   ---
   ```
3. Confirm: "Recorded taste observation."

## Workflow: Status (`/sigil --status`)

1. Read `grimoires/rune/taste.md`
2. Count entries by approximate tier:
   - Tier 1 (Observation): Single mention
   - Tier 2 (Pattern): Referenced 3+ times in generation
   - Tier 3 (Rule): Explicitly promoted
3. Display summary:
   ```
   ## Taste Status

   Total entries: 12
   - Tier 1 (Observations): 8
   - Tier 2 (Patterns): 3
   - Tier 3 (Rules): 1

   Recent entries:
   - 2026-01-25: Power user timing preference (500ms)
   - 2026-01-24: Springs over easing curves
   - 2026-01-23: No modals for confirmations
   ```

## Integration with Glyph

When `/glyph` runs, it reads `taste.md` and applies:

| Pattern | Action |
|---------|--------|
| Timing preferences | Adjust default physics timings |
| Animation preferences | Use preferred easing/springs |
| Component patterns | Follow established structure |
| Explicit corrections | Apply as hard rules |

Glyph notes when taste is applied:
```
Timing: 500ms (taste: power user preference)
```

## State File

`grimoires/rune/taste.md` — Append-only markdown
