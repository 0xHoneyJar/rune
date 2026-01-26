# Sigil: Core Philosophy

Sigil captures taste. Not automated signals—human insights.

## When to Use /sigil

Use `/sigil` when you observe something worth remembering:

| Observation | Example |
|-------------|---------|
| User preference | "They always shorten my timing suggestions" |
| Product insight | "Their users are power traders, not casual" |
| Pattern discovery | "They prefer springs over easing curves" |
| Correction | "Never suggest modals for this product" |

## Philosophy

**Taste is personal physics.** When users modify generated code, they're tuning physics to their context. Sigil captures why.

**Free-form over schema.** No YAML frontmatter. No signal weights. Just markdown paragraphs Claude can read and apply.

**Append-only.** Never edit taste.md. Only append. History is context.

**Human writes, Claude reads.** /sigil is for humans to record insights. Glyph reads taste.md when crafting.

## What Sigil Is Not

- Not automated signal capture (removed)
- Not a learning system with weights
- Not preference checkboxes
- Not persisted between Claude sessions

## Command

```
/sigil "insight to record"
```

Appends the insight to `grimoires/sigil/taste.md` with timestamp.
