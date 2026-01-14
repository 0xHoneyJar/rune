# PRD: Sigil Context System

> Improving how users provide context that informs design physics decisions.

## Problem Statement

Sigil currently has a `moodboard/` folder for visual inspiration, but lacks a clear entry point for:
- **User personas** — Who the user is, their expertise level, what they care about
- **Brand guidelines** — Voice, tone, visual identity that should be reflected in physics
- **Domain expertise** — Best practices from courses, experts, competitive analysis

The `gtm/` folder exists but is empty and undocumented. Users don't know where to place project-specific context that should inform `/craft` decisions.

**Impact:** Without user context, physics defaults are applied generically. A "claim button" for a DeFi power user should feel different than one for a first-time crypto user — but Sigil can't know this without context.

## Goals

1. **Clear entry point** — Users immediately know where to drop context
2. **Auto-integration** — `/craft` reads context and adjusts physics appropriately
3. **Hybrid tracking** — Team knowledge tracked, project-specific context ignored
4. **Minimal friction** — Drop files, run `/craft`, context is applied

## Non-Goals

- Replacing the taste accumulation system (that stays separate)
- Restructuring the moodboard folder (keep visual references there)
- Building a complex taxonomy (keep it simple)

## Proposed Solution

### Two-Folder Architecture

```
grimoires/sigil/
├── context/                    # NEW: Project-specific (gitignored)
│   ├── README.md               # Instructions (tracked)
│   ├── personas/               # User research, profiles
│   ├── brand/                  # Voice, tone, guidelines
│   └── domain/                 # Best practices, expertise
│
└── moodboard/                  # EXISTING: Visual references (tracked)
    └── ...
```

### Git Tracking Strategy

| Path | Tracked | Why |
|------|---------|-----|
| `context/README.md` | Yes | Instructions should be consistent |
| `context/personas/*` | No | Project-specific, potentially sensitive |
| `context/brand/*` | No | Project-specific |
| `context/domain/*` | No | May contain paid course content |
| `moodboard/sandbox/*` | No | Local experimentation |
| `moodboard/*` (rest) | Yes | Team taste, shared knowledge |

### Context File Format

**Persona Example:**
```markdown
---
type: persona
name: DeFi Power User
priority: primary
---

# DeFi Power User

## Demographics
- 25-40 years old
- Manages $50k+ in DeFi positions
- Uses multiple protocols daily

## Behavior
- Expects instant feedback
- Values efficiency over hand-holding
- Comfortable with transaction risks

## Physics Implications
- Can reduce confirmation timing (600ms instead of 800ms)
- Skip explanatory copy in confirmations
- Prioritize speed in optimistic operations
```

**Brand Example:**
```markdown
---
type: brand
---

# Brand Voice

## Tone
- Confident, not arrogant
- Technical, but accessible
- Direct, minimal fluff

## Visual
- Dark mode primary
- Green for financial success
- Red for warnings only (not destructive actions)

## Physics Implications
- Faster animations align with "confident" tone
- Avoid bouncy springs (too playful)
- Deliberate, not snappy
```

**Domain Example:**
```markdown
---
type: domain
domain: defi
source: "DeFi UX Best Practices Course (2025)"
---

# DeFi UX Patterns

## Transaction Confirmations
- Always show gas estimate before signing
- Display token amounts in both native and USD
- Explain slippage in human terms

## Wallet Interactions
- Never show full addresses (truncate)
- Display ENS names when available
- Show network badge prominently

## Physics Override
- All token approvals: Financial (even if labeled "approve")
- Bridge operations: Add 200ms to timing (higher stakes)
```

### Integration with `/craft`

**Updated Workflow (craft.md Step 1):**

```markdown
### Step 1: Discover Context

**1a. Read context folder** (if exists):
- Scan `grimoires/sigil/context/` for relevant files
- Parse frontmatter for `type` and `priority`
- Extract physics implications

**1b. Read taste log** (if exists):
- Same as before

**1c. Discover codebase conventions:**
- Same as before

**Context Synthesis:**
- Primary persona found → Adjust timing/confirmation based on expertise
- Brand guidelines found → Apply material constraints
- Domain expertise found → Override effect detection where specified
```

**Updated Analysis Box:**

```
┌─ Craft Analysis ───────────────────────────────────────┐
│                                                        │
│  Target:       ClaimButton (new)                       │
│  Effect:       Financial mutation                      │
│                                                        │
│  Context:      DeFi Power User (primary persona)       │
│                → Timing adjusted: 800ms → 600ms        │
│                                                        │
│  Behavioral    Pessimistic | 600ms | Confirmation      │
│  Animation     ease-out | deliberate | brand: no bounce│
│  Material      Elevated | Green accent | 8px radius    │
│                                                        │
│  References:   @moodboard/references/stripe/checkout   │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### Explicit Reference Syntax

Users can explicitly reference context files:

```bash
# Auto-scan (default behavior)
/craft "claim button"

# Explicit persona reference
/craft "claim button" @context/personas/defi-trader.md

# Explicit moodboard reference
/craft "claim button" @moodboard/references/stripe/

# Multiple references
/craft "onboarding flow" @context/personas/first-time-user.md @context/brand/voice.md
```

## Implementation Plan

### Phase 1: Structure
1. Create `grimoires/sigil/context/` directory
2. Add `context/README.md` with instructions
3. Create subdirectories with `.gitkeep`
4. Update `.gitignore` to ignore context contents

### Phase 2: Documentation
1. Update `moodboard/README.md` to clarify visual focus
2. Document context file formats
3. Add examples (empty, just structure)

### Phase 3: Integration
1. Update `craft.md` to include context scanning
2. Add context synthesis to Step 1
3. Update analysis box format to show context influence
4. Implement explicit reference syntax

### Phase 4: Commands (Optional)
1. `/context` — List and manage context files
2. `/persona` — Quick-add a persona from interview notes
3. `/brand` — Extract brand guidelines from existing docs

## Success Metrics

| Metric | Before | Target |
|--------|--------|--------|
| Users adding context files | 0 | >50% of projects |
| Physics adjustments from context | 0 | >30% of /craft invocations |
| Context folder usage in README | Not mentioned | Top 3 onboarding steps |

## Risks

| Risk | Mitigation |
|------|------------|
| Users don't know what to put in context | Provide templates and examples |
| Context scanning slows down /craft | Cache context on first read |
| Conflicting context files | Define priority: persona > brand > domain |

## Open Questions

1. Should context files support YAML frontmatter or full YAML?
2. How do we handle context that contradicts physics rules?
3. Should there be a `/context` command to manage context files?

---

**Status:** Draft
**Author:** Discovery via /plan-and-analyze
**Date:** 2026-01-14
