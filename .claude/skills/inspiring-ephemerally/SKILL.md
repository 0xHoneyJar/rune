# Inspiring Ephemerally

## Purpose

One-time external reference for design inspiration.
Fetches external content, extracts styles, generates code, then discards.

## Trigger

Detected patterns in user prompt:
- "like stripe.com"
- "inspired by [url]"
- "reference [url]"
- "style of [url]"

## Philosophy

> "Borrow taste. Don't copy content."

External references provide inspiration for color, typography, and spacing.
The fetched content is ephemeral - it exists only during generation,
then is discarded. Only the generated code remains.

## Flow

```
1. Detect inspiration trigger in prompt
2. Fork context (isolated from survival.json)
3. Fetch URL (if user approved)
4. Extract style tokens (colors, typography, spacing)
5. Generate component using extracted styles
6. Return generated code to main context
7. Discard fetched content
```

## Context Fork Behavior

Forked context:
- Preserves: Physics constraints, zone rules, fidelity limits
- Ignores: Survival patterns, rejected patterns, canonical patterns
- Cannot: Write to Sanctuary, update survival.json
- Can: Generate ephemeral code for review

## Style Extraction

Extracted from fetched content:

| Category | Tokens |
|----------|--------|
| Colors | Background, surface, text, accent |
| Typography | Font family, sizes, weights |
| Spacing | Unit, scale |
| Gradients | Definitions if present |

## What Gets Discarded

After generation:
- Fetched HTML/CSS content
- Extracted raw styles
- Any cached images
- URL references

What remains:
- Generated component code
- Style tokens embedded in code
- Physics applied correctly

## /sanctify Command

After seeing generated output, user can:
```
/sanctify "gradient-button"
```

This:
1. Extracts the pattern from recent generation
2. Adds to sigil-mark/rules.md
3. Makes pattern permanent (no longer ephemeral)
4. Logs sanctification

## Safety

- Never stores fetched content permanently
- Never includes URLs in generated code
- Never copies content verbatim
- Always applies physics constraints
- Respects fidelity limits

## Performance

- URL detection: <1ms
- Style extraction: <100ms (after fetch)
- Code generation: standard /craft timing
- Cleanup: immediate after generation
