# Development Process

This document outlines the Sigil v1.2.4 workflow for capturing and maintaining design context in AI-assisted development.

> "Engineers learn by seeing diffs and feeling the physics."

## Philosophy: Diff + Feel

Sigil v1.2.4 is a design context framework built on one insight: **engineers learn by doing, not reading**. Instead of abstract guidelines, Sigil provides:

- **TSX Recipes** — Real components with embedded spring physics
- **Zone Resolution** — Automatic context based on file path
- **Sandbox Mode** — Unconstrained experimentation with raw physics
- **History System** — Pattern extraction from refinement decisions
- **Human Accountability** — All validation is human approval, not automation

Systems that block will be bypassed. Systems that enable will be adopted.

---

## Overview

Sigil's workflow has two paths:

### New Project Path
```
/setup → /envision → /codify → (build) → /craft → /garden
```

### Existing Codebase Path
```
/setup → /inherit → /envision → /codify → (build) → /craft
```

---

## Command Decision Tree

Use this to quickly find the right command:

```
┌─ Starting a project?
│  ├─ New project → /setup → /envision → /codify
│  └─ Existing code → /setup → /inherit → /envision
│
├─ During development?
│  ├─ Need design guidance → /craft
│  ├─ Experiment with physics → /sandbox
│  └─ Check compliance → /validate
│
├─ Maintenance?
│  ├─ Detect drift/entropy → /garden
│  └─ Get framework updates → /update
│
└─ Zone configuration?
   └─ Define zones/recipes → /codify
```

---

## Commands (6 Total)

### `/craft` — Design Guidance

**Skill**: `crafting-guidance`

**Goal**: Get design guidance with zone context

**Modes**:

1. **Zone Detection**: Which zone is this file in?
   ```bash
   /craft src/features/checkout/PaymentForm.tsx
   ```

2. **Recipe Suggestion**: What recipe fits this context?
   ```bash
   /craft "loading state for checkout"
   ```

3. **Physics Lookup**: What are the physics values?
   ```bash
   /craft "button spring values"
   ```

**Output**: Conversational guidance with zone context and recipe suggestions

---

### `/sandbox` — Raw Physics Experimentation

**Skill**: `sandboxing-physics`

**Goal**: Experiment with physics without constraints

**When to Use**:
- Exploring new motion patterns
- Testing physics values before committing to a recipe
- Prototyping without zone restrictions

**Command**:
```bash
/sandbox
/sandbox "bouncy entrance animation"
```

**What Happens**:
1. Creates file in `sigil-mark/sandbox/`
2. No recipe enforcement
3. No zone constraints
4. ESLint warns after 7 days (stale sandbox)

**Output**: Raw physics component for experimentation

---

### `/codify` — Define Zone Rules

**Skill**: `codifying-rules`

**Goal**: Define explicit design rules and zone configuration

**Process**:
1. **Zones**: Map paths to recipe sets
2. **Recipes**: Define or customize physics values
3. **Rejections**: Patterns to warn about
4. **Motion**: Zone-specific motion recipes

**Command**:
```bash
/codify
```

**Output**: Updated `.sigilrc.yaml` and `sigil-mark/rules.md`

---

### `/inherit` — Bootstrap from Existing Code

**Skill**: `inheriting-design`

**Goal**: Bootstrap design context from existing codebase

**Process**:
1. Scans codebase for components
2. Detects color tokens, typography, spacing
3. Identifies motion patterns in use
4. Generates draft moodboard and rules
5. Creates component inventory

**Command**:
```bash
/inherit
```

**Outputs**:
- `sigil-mark/moodboard.md` (draft, needs review)
- `sigil-mark/rules.md` (draft, needs review)
- `sigil-mark/inventory.md` (component list)

**Note**: After `/inherit`, run `/envision` to refine with intent.

---

### `/validate` — Check Physics Compliance

**Skill**: `validating-physics`

**Goal**: Verify physics compliance across codebase

**What It Checks**:
- Recipe usage in zone-mapped files
- Raw physics values that should use recipes
- Optimistic UI in server-authoritative zones
- Stale sandbox files

**Command**:
```bash
/validate
/validate src/features/checkout/
```

**Output**: Compliance report with violations and suggestions

---

### `/garden` — Entropy Detection

**Skill**: `gardening-entropy`

**Goal**: Detect drift and maintain design health

**What It Catches**:
- **Drift**: Components straying from recipes
- **Stale Sandbox**: Experiments older than 7 days
- **Zone Conflicts**: Files in wrong zones
- **Recipe Deviation**: Modified physics values

**Command**:
```bash
/garden
/garden drift
/garden stale
```

**Output**: Entropy report with actionable items

---

## Recipe System

### Three Recipe Sets

| Set | Spring | Feel | Zone Affinity |
|-----|--------|------|---------------|
| **Decisive** | `spring(180, 12)` | Heavy, deliberate | Critical, Transactional |
| **Machinery** | `spring(400, 30)` | Instant, efficient | Admin |
| **Glass** | `spring(200, 20)` | Smooth, delightful | Marketing, Exploratory |

### Recipe Structure

Recipes are TSX components with exported physics:

```tsx
// sigil-mark/recipes/decisive/ConfirmButton.tsx
import { motion } from 'framer-motion';

export const physics = {
  spring: { tension: 180, friction: 12 },
  duration: '800ms+',
  feel: 'heavy, deliberate'
};

export const ConfirmButton = ({ children, onClick }) => (
  <motion.button
    whileTap={{ scale: 0.98 }}
    transition={{ type: 'spring', ...physics.spring }}
    onClick={onClick}
  >
    {children}
  </motion.button>
);
```

### Using Recipes

Import physics from recipe files:

```tsx
import { physics } from 'sigil-mark/recipes/decisive/ConfirmButton';

// Use in your component
<motion.div transition={{ type: 'spring', ...physics.spring }}>
```

---

## Zone System

Zones define design context by file path. Configured in `.sigilrc.yaml`:

```yaml
zones:
  critical:
    paths: ["src/features/checkout/**", "src/features/claim/**"]
    recipe: decisive
    sync: server_authoritative
    patterns:
      prefer: ["deliberate-entrance", "confirmation-flow"]
      warn: ["instant-transition", "playful-bounce"]

  admin:
    paths: ["src/admin/**"]
    recipe: machinery
    patterns:
      prefer: ["snappy-transition"]

  marketing:
    paths: ["src/features/marketing/**"]
    recipe: glass
    patterns:
      prefer: ["playful-bounce", "attention-grab"]
```

### Zone Resolution

When working in a file:

1. Agent gets current file path
2. Matches against zone patterns in `.sigilrc.yaml`
3. Returns zone name (or "default" if no match)
4. Applies zone-appropriate recipe

### Per-Directory Configuration

`.sigilrc.yaml` can exist at any directory level:

```
project/
├── .sigilrc.yaml              # Project-wide zones
├── src/
│   ├── features/
│   │   └── checkout/
│   │       └── .sigilrc.yaml  # Checkout-specific overrides
```

Child configurations merge with parent (child wins on conflict).

---

## Three Laws of Enforcement

| Level | Behavior | Override |
|-------|----------|----------|
| **IMPOSSIBLE** | Physics violations. Never generated. | None |
| **BLOCK** | Budget/fidelity violations. Sandbox allowed. | Taste Key ruling |
| **WARN** | Drift from essence. Advisory only. | Human decides |

### Examples

**IMPOSSIBLE** (no override):
- Optimistic UI in `server_authoritative` zone
- Missing pending state in critical zone

**BLOCK** (Taste Key can override):
- Raw physics values instead of recipe
- Exceeding element budget

**WARN** (advisory only):
- Using `glass` recipe in critical zone
- Pattern in rejection list

---

## Rejections

Rejections are patterns to avoid, but **not blocked**:

```yaml
rejections:
  - pattern: "Spinner"
    reason: "Creates anxiety in critical zones"
    exceptions: ["admin/**"]
```

When a user wants a rejected pattern, agents:
1. Explain the concern
2. Offer alternatives
3. Allow override if user insists

---

## Workbench

3-pane tmux environment for design iteration:

```bash
sigil-workbench.sh
```

### Layout

```
┌─────────────────────────────────────────────┐
│                                             │
│              Physics Diff                   │
│              (Pane 0)                       │
│                                             │
├──────────────────────┬──────────────────────┤
│                      │                      │
│   Browser Preview    │   Claude Code        │
│   (Pane 1)           │   (Pane 2)           │
│                      │                      │
└──────────────────────┴──────────────────────┘
```

### A/B Toggle

Two modes for comparing recipes:

**Hot-swap mode**: CSS variable swap
```typescript
ABToggle.swap('decisive', 'glass');
```

**Iframe mode**: Side-by-side
```typescript
ABToggle.iframe('/checkout', [
  { recipe: 'decisive', label: 'Current' },
  { recipe: 'glass', label: 'Proposed' }
]);
```

---

## ESLint Enforcement

Install the plugin:

```bash
npm install sigil-mark-eslint-plugin --save-dev
```

Configure in `.eslintrc`:

```json
{
  "plugins": ["sigil-mark"],
  "rules": {
    "sigil-mark/no-raw-physics": "error",
    "sigil-mark/require-recipe": "warn",
    "sigil-mark/no-optimistic-in-decisive": "error",
    "sigil-mark/sandbox-stale": "warn"
  }
}
```

### Rules

| Rule | Description |
|------|-------------|
| `no-raw-physics` | Must use recipe, not raw spring values |
| `require-recipe` | Zone-mapped files need recipe import |
| `no-optimistic-in-decisive` | Block optimistic UI in critical zones |
| `sandbox-stale` | Warn on sandbox files >7 days old |

---

## History System

Track refinement decisions in `sigil-mark/history/`:

```markdown
# Refinement: Checkout Motion

## Context
Checkout button felt too light for monetary transactions.

## Before
- Recipe: glass
- Spring: 200/20
- User feedback: "Doesn't feel serious"

## After
- Recipe: decisive
- Spring: 180/12
- User feedback: "Feels trustworthy"

## Pattern
heavy_spring_for_money: When handling transactions, use decisive recipe.
```

### Pattern Extraction

The history system extracts patterns:

```typescript
import { extractPatterns } from 'sigil-mark/core/history';

const patterns = extractPatterns();
// Returns: { heavy_spring_for_money: "When handling transactions..." }
```

---

## State Zone Structure

All design context lives in `sigil-mark/`:

```
sigil-mark/
├── moodboard.md              # Product feel + references
├── rules.md                  # Design rules by category
├── inventory.md              # Component list
│
├── recipes/                  # TSX components with physics
│   ├── decisive/             # Heavy spring (180/12)
│   ├── machinery/            # Instant (400/30)
│   └── glass/                # Smooth (200/20)
│
├── hooks/                    # React hooks
│   └── useServerTick.ts      # Server-authoritative tick
│
├── sandbox/                  # Unconstrained experiments
│
├── history/                  # Refinement log
│
├── eslint-plugin/            # Enforcement rules
│
├── workbench/                # A/B comparison tools
│
└── __tests__/                # Test suite
```

---

## Example Workflow

### New Project

```bash
# 1. Initialize Sigil
/setup

# 2. Capture product feel through interview
/envision
# → Answer questions about references, feel, anti-patterns
# → Review sigil-mark/moodboard.md

# 3. Define zone rules and recipes
/codify
# → Configure zones in .sigilrc.yaml
# → Review sigil-mark/rules.md

# 4. Build your product (your work)
# Agents automatically load design context

# 5. Get guidance during implementation
/craft src/features/checkout/PaymentForm.tsx
# → Zone detected: critical
# → Recipe: decisive
# → Physics: spring(180, 12)

# 6. Experiment with alternatives
/sandbox "lighter checkout button"
# → Creates sandbox file
# → No constraints applied

# 7. Check compliance
/validate

# 8. Detect entropy
/garden
```

### Existing Codebase

```bash
# 1. Initialize Sigil
/setup

# 2. Scan codebase to bootstrap context
/inherit
# → Generates draft moodboard, rules, inventory

# 3. Refine moodboard with intent
/envision

# 4. Define zones for existing paths
/codify

# 5. Continue with craft/sandbox/validate as needed
```

---

## Best Practices

### Capturing Feel

- Be specific about contexts (checkout feels different than marketing)
- Include anti-patterns with reasons
- Reference real products, not abstract concepts

### Using Recipes

- Always import from recipe files, not raw values
- Use sandbox for experimentation, then graduate to recipe
- Match recipe to zone (decisive for critical, etc.)

### Zone Configuration

- Start with 3 zones: critical, admin, default
- Add zones as patterns emerge
- Use per-directory `.sigilrc.yaml` for exceptions

### Enforcement

- Run `/validate` before commits
- Use ESLint plugin in CI
- Review `/garden` output weekly

---

## Related Documentation

- **[README.md](README.md)** - Quick start guide
- **[CLAUDE.md](CLAUDE.md)** - Agent protocol reference
- **[CHANGELOG.md](CHANGELOG.md)** - Version history
- **[MIGRATION.md](MIGRATION.md)** - Migration from previous versions
