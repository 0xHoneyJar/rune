# Crafting Physics Skill

Apply design physics to any UX-affecting change. Three layers: Behavioral + Animation + Material = Feel.

---

## Core Principle

```
Effect → Physics → Code
```

Detect the effect from keywords and types, apply the physics, generate the code.

---

## Craft Types

| Signal | Craft Type | Output |
|--------|------------|--------|
| "new", "create", "build" | **Generate** | New component file |
| "refine", "polish", "improve" | **Refine** | Edit existing code |
| "theme", "colors", "mode" | **Configure** | Edit config/theme |
| "loading", "data", "fetch" | **Pattern** | Hook or utility |
| "hover", "focus", multiple files | **Polish** | Batch edits |

---

## Workflow

### Step 1: Discover Context

**1a. Read project context** (if exists):
- `grimoires/sigil/context/` — Personas, brand, domain
- `grimoires/sigil/moodboard/` — Visual references
- `grimoires/sigil/taste.md` — Accumulated preferences

**1b. Discover codebase conventions**:
```bash
Read package.json
```
Extract:
- Animation: `framer-motion` | `react-spring` | CSS
- Data: `@tanstack/react-query` | `swr` | `fetch`
- Styling: `tailwindcss` | `styled-components` | `@emotion`

### Step 2: Detect Craft Type and Effect

**Effect Detection Priority**:
1. Types in props (`Currency`, `Wei`, `Token`) → Always Financial
2. Keywords (`claim`, `delete`, `like`, `toggle`) → See lexicon
3. Context (`with undo`, `for wallet`) → Modifies effect

### Step 3: Show Physics Analysis

```
┌─ Craft Analysis ───────────────────────────────────────┐
│                                                        │
│  Target:       [what's being crafted]                  │
│  Craft Type:   [generate/refine/configure/pattern]    │
│  Effect:       [Financial/Destructive/Standard/Local]  │
│                                                        │
│  Behavioral    [Sync] | [Timing] | [Confirmation]      │
│  Animation     [Easing] | [Spring/duration] | [Freq]   │
│  Material      [Surface] | [Shadow] | [Radius]         │
│                                                        │
│  Codebase:     [styling] + [animation] + [data]        │
│  Output:       [file(s) to create/modify]              │
│                                                        │
│  Protected (if applicable):                            │
│  [✓/✗] Cancel  [✓/✗] Recovery  [✓/✗] Touch  [✓/✗] Focus│
│                                                        │
└────────────────────────────────────────────────────────┘

Proceed? (yes / or describe what's different)
```

### Step 4: Get Confirmation

Wait for user response:
- **"yes", "y", "proceed"** → Apply immediately
- **Correction provided** → Update analysis, show again

### Step 5: Apply Changes

IMMEDIATELY apply changes based on craft type:
- **Generate**: Write complete new file with all three physics layers
- **Refine**: Use Edit tool to modify existing code
- **Configure**: Edit config file with physics-informed values
- **Pattern**: Write hook or utility with physics baked in
- **Polish**: Apply batch edits across identified files

### Step 6: Collect Feedback

Ask user to reflect on feel:
> "Does this feel right? Think about your user in the moment of clicking."

**Signal detection**:
- ACCEPT: "yes", "looks good", "perfect"
- MODIFY: Describes what's off ("too slow", "needs more contrast")
- REJECT: "no", "wrong", "start over"

### Step 7: Log Taste Signal

Append to `grimoires/sigil/taste.md`:

```markdown
## [YYYY-MM-DD HH:MM] | [SIGNAL]
Target: [what was crafted]
Craft Type: [type]
Effect: [if applicable]
Physics: [key values applied]
[If MODIFY: Changed: ..., Learning: ...]
---
```

---

## Physics Quick Reference

| Effect | Sync | Timing | Confirmation |
|--------|------|--------|--------------|
| Financial | Pessimistic | 800ms | Required |
| Destructive | Pessimistic | 600ms | Required |
| Soft Delete | Optimistic | 200ms | Toast+Undo |
| Standard | Optimistic | 200ms | None |
| Local State | Immediate | 100ms | None |

---

## When NOT to Use /craft

- **Only animation wrong**: Use `/animate`
- **Only styling wrong**: Use `/style`
- **Only timing wrong**: Use `/behavior`
- **1-3 line change**: Use Edit tool directly
- **Non-UX code**: Backend logic, tests — physics don't apply

Rule: If it doesn't affect what users feel, don't use /craft.
