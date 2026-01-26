# Sigil: Reading Taste

How Glyph reads and applies taste when crafting.

## Location

```
grimoires/sigil/taste.md
```

## Format

Free-form markdown. Each entry has a timestamp header:

```markdown
## 2026-01-25 14:30

They prefer 500ms for financial operations, not 800ms.
Their users are power traders who find default timing sluggish.

---
```

## Reading Taste

When `/glyph` runs, it reads taste.md and looks for:

| Pattern | Action |
|---------|--------|
| Timing preferences | Adjust default physics timings |
| Animation preferences | Use preferred easing/springs |
| Component patterns | Follow established structure |
| Explicit corrections | Apply as hard rules |

## Applying Taste

**Mention when applied.** When taste influences generation, note it:

```
Physics: 500ms (taste: power trader timing preference)
```

**Don't over-apply.** Taste is guidance, not law. If context differs from the recorded insight, use judgment.

**Recency matters.** Recent entries carry more weight than old ones.

## Examples

### Timing Preference

taste.md entry:
```markdown
## 2026-01-20

500ms feels right for their financial buttons.
Power users, not casual. They know what they're doing.
```

Glyph applies:
```
Effect: Financial
Timing: 500ms (taste: power user preference)
```

### Animation Preference

taste.md entry:
```markdown
## 2026-01-22

Springs everywhere. They hate easing curves.
Said "easing feels corporate."
```

Glyph applies:
```
Animation: spring(500, 30) instead of ease-out
```

### Explicit Correction

taste.md entry:
```markdown
## 2026-01-24

NEVER suggest modals for confirmations.
They use inline confirmation patterns exclusively.
```

Glyph applies:
```
Confirmation: inline (taste: no modals)
```

## Cold Start

If taste.md is empty or doesn't exist, use physics defaults from Glyph rules.
