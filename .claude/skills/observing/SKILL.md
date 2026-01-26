---
name: observing
description: Capture taste insights from user conversations
user-invocable: true
disable-model-invocation: true
allowed-tools:
  - Read
  - Write
---

# Observing

Append taste insights to `grimoires/sigil/taste.md`.

## Usage

```
/sigil "insight to record"
```

## Workflow

1. Read current taste.md
2. Append new entry with timestamp header
3. Confirm what was recorded

## Entry Format

```markdown
## YYYY-MM-DD HH:MM

{insight}

---
```

## Rules

- Append only, never edit existing entries
- Use current timestamp
- Keep insights concise but complete
- Include context that explains "why"
