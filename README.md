# Sigil

[![Version](https://img.shields.io/badge/version-1.2.4-blue.svg)](CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

> *"Engineers learn by seeing diffs and feeling the physics."*

Design Context Framework for AI-assisted development. Gives AI agents design context through TSX recipes with embedded physics—engineers see the diff, feel the component, decide what works.

## Philosophy: Diff + Feel

### The Insight

Traditional design systems are too abstract. Telling an AI "use deliberate motion in checkout" doesn't translate to code. Sigil flips this:

1. **Recipes are TSX components** — Real code with real spring physics
2. **Diffs show the physics** — Engineers see exactly what changed
3. **Feel validates decisions** — Run the component, feel if it's right
4. **Sandbox enables exploration** — Raw physics experimentation without constraints

When an engineer sees a recipe diff with `spring: { tension: 180, friction: 12 }`, they can render it, feel the weight, and understand *why* checkout buttons feel deliberate.

### Core Principles

**1. Diff + Feel > Documentation**

A TSX component with embedded physics values teaches more than paragraphs of guidelines. Engineers learn by doing:
- See the recipe diff
- Render in sandbox
- Feel the spring physics
- Apply or reject

**2. Three Recipe Sets**

| Set | Spring | Feel | Zone Affinity |
|-----|--------|------|---------------|
| **Decisive** | `spring(180, 12)` | Heavy, deliberate | Critical, Transactional |
| **Machinery** | `spring(400, 30)` | Instant, efficient | Admin |
| **Glass** | `spring(200, 20)` | Smooth, delightful | Marketing, Exploratory |

**3. Zone Resolution by Path**

Physics are automatic based on file location:
```
src/features/checkout/Button.tsx → zone: critical → recipe: decisive
src/admin/Dashboard.tsx → zone: admin → recipe: machinery
src/marketing/Hero.tsx → zone: marketing → recipe: glass
```

**4. Three Laws of Enforcement**

| Level | Behavior | Override |
|-------|----------|----------|
| **IMPOSSIBLE** | Physics violations. Never generated. | None |
| **BLOCK** | Budget/fidelity violations. Sandbox allowed. | Taste Key ruling |
| **WARN** | Drift from essence. Advisory only. | Human decides |

## Quick Start

### Install

```bash
# One-liner mount
curl -fsSL https://raw.githubusercontent.com/0xHoneyJar/sigil/main/.claude/scripts/mount-sigil.sh | bash

# Start Claude Code
claude

# Initialize
/setup
/envision
```

### Commands (6 total)

| Command | Purpose |
|---------|---------|
| `/craft` | Get design guidance with zone context |
| `/sandbox` | Experiment with raw physics (no constraints) |
| `/codify` | Define zone rules and recipes |
| `/inherit` | Bootstrap from existing codebase |
| `/validate` | Check physics compliance |
| `/garden` | Entropy detection and maintenance |

### Setup Flow

```
/setup → /envision → /codify → (build) → /craft → /garden
```

For existing codebases:
```
/setup → /inherit → /envision → /codify → (build) → /craft
```

## Architecture

### State Zone: `sigil-mark/`

```
sigil-mark/
├── moodboard.md          # Product feel + references
├── rules.md              # Design rules by category
├── inventory.md          # Component list
│
├── recipes/              # TSX components with physics
│   ├── decisive/         # Heavy spring (180/12)
│   │   ├── ConfirmButton.tsx
│   │   └── TransactionCard.tsx
│   ├── machinery/        # Instant (400/30)
│   │   └── AdminAction.tsx
│   └── glass/            # Smooth (200/20)
│       └── HeroReveal.tsx
│
├── hooks/                # React hooks
│   └── useServerTick.ts  # Server-authoritative tick
│
├── history/              # Refinement log
│   └── TEMPLATE.md
│
├── core/                 # Internal modules
│   └── history.ts
│
├── eslint-plugin/        # Enforcement rules
│   ├── package.json
│   ├── index.js
│   └── rules/
│       ├── no-raw-physics.js
│       ├── require-recipe.js
│       ├── no-optimistic-in-decisive.js
│       └── sandbox-stale.js
│
├── workbench/            # A/B comparison tools
│   ├── ab-toggle.ts      # Hot-swap mode
│   └── ab-iframe.ts      # Iframe mode
│
└── __tests__/            # Test suite
```

### Configuration: `.sigilrc.yaml`

Per-directory configuration with cascading merge:

```yaml
version: "1.2.4"

component_paths:
  - "components/"
  - "src/components/"

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

rejections:
  - pattern: "Spinner"
    reason: "Creates anxiety in critical zones"
    exceptions: ["admin/**"]
```

## Recipes

### Decisive Set (Critical Zones)

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

### Machinery Set (Admin Zones)

```tsx
// sigil-mark/recipes/machinery/AdminAction.tsx
export const physics = {
  spring: { tension: 400, friction: 30 },
  duration: '<200ms',
  feel: 'instant, efficient'
};
```

### Glass Set (Marketing Zones)

```tsx
// sigil-mark/recipes/glass/HeroReveal.tsx
export const physics = {
  spring: { tension: 200, friction: 20 },
  duration: '300-500ms',
  feel: 'smooth, delightful'
};
```

## Hooks

### useServerTick

Prevents optimistic updates in server-authoritative zones:

```tsx
import { useServerTick } from 'sigil-mark/hooks/useServerTick';

function ClaimButton() {
  const { tick, pending, sync } = useServerTick({
    tickRate: 600,
    sync: 'server_authoritative'
  });

  // Automatically enforces pending states
  // Blocks optimistic UI in critical zones
}
```

## Workbench

3-pane tmux environment for design iteration:

```bash
# Launch workbench
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

Compare recipe variants:
- **Hot-swap mode**: CSS variable swap for instant comparison
- **Iframe mode**: Side-by-side flow testing

```typescript
import { ABToggle } from 'sigil-mark/workbench';

// Hot-swap physics variables
ABToggle.swap('decisive', 'glass');

// Or render side-by-side
ABToggle.iframe('/checkout', [
  { recipe: 'decisive', label: 'Current' },
  { recipe: 'glass', label: 'Proposed' }
]);
```

## ESLint Plugin

Enforce physics at lint time:

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

## CI Integration

`.github/workflows/sigil.yml`:

```yaml
name: Sigil Validation
on: [push, pull_request]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run lint
      - run: npm run sigil:validate
```

## History System

Track refinement decisions:

```markdown
<!-- sigil-mark/history/2026-01-05-checkout-motion.md -->
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

## Coexistence with Loa

Sigil and Loa serve different purposes:

| Aspect | Sigil | Loa |
|--------|-------|-----|
| Domain | Design physics | Product architecture |
| State zone | `sigil-mark/` | `loa-grimoire/` |
| Config | `.sigilrc.yaml` | `.loa.config.yaml` |
| Focus | How it feels | How it works |

They coexist without conflict. When Sigil detects an architectural issue (e.g., "should checkout be optimistic?"), it generates a handoff document for Loa.

## Version History

| Version | Codename | Description |
|---------|----------|-------------|
| v0.3.x | Constitutional Design Framework | Four pillars, progressive strictness |
| v0.4.x | Soul Engine | npm package, React hooks |
| v0.5.0 | Design Physics Engine | Simplified physics focus |
| v1.0.0 | Full Workbench | 4-panel tmux, materials system |
| v1.2.4 | Diff + Feel | Recipe-based, 3-pane workbench, ESLint enforcement |

## Migration from v1.0

Key changes:
1. **Materials → Recipes**: Clay/Machinery/Glass become TSX components
2. **4-panel → 3-pane**: Simplified workbench layout
3. **8 commands → 6 commands**: Consolidated workflow
4. **zones.yaml → .sigilrc.yaml**: Per-directory configuration

See [MIGRATION.md](MIGRATION.md) for detailed upgrade guide.

## Requirements

- Git
- Claude Code CLI
- Node.js 18+ (for ESLint plugin)
- tmux (for workbench)

## License

[MIT](LICENSE)

## Links

- [Claude Code](https://claude.ai/code)
- [Repository](https://github.com/0xHoneyJar/sigil)
- [Issues](https://github.com/0xHoneyJar/sigil/issues)
