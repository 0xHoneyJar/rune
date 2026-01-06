# Sigil

[![Version](https://img.shields.io/badge/version-1.2.5-blue.svg)](CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

> *"Engineers learn by seeing diffs and feeling the physics."*

Design Context Framework for AI-assisted development. Components automatically inherit physics from context—move code between zones without changing imports.

## Philosophy: Diff + Feel

### The Insight

Traditional design systems are too abstract. Sigil flips this:

1. **Physics are tokens** — Versioned data, visible in diffs
2. **Context provides physics** — Components inherit from `<SigilZone>`
3. **Feel validates decisions** — Run the component, feel if it's right
4. **Zero refactors** — Moving code between zones = changing the wrapper

When physics change, the diff shows exactly what changed. Engineers render, feel, and decide.

### Core Principles

**1. One Component, Contextual Physics**

```tsx
// Same Button component, different physics
<SigilZone material="decisive" serverAuthoritative>
  <Button onAction={confirmPurchase}>Confirm</Button>  // Heavy, deliberate
</SigilZone>

<SigilZone material="glass">
  <Button onClick={learnMore}>Learn More</Button>      // Smooth, delightful
</SigilZone>
```

**2. Three Materials**

| Material | Spring | Feel | Zone Affinity |
|----------|--------|------|---------------|
| **Decisive** | `180/12` | Heavy, deliberate | Critical, Transactional |
| **Machinery** | `400/30` | Instant, efficient | Admin |
| **Glass** | `200/20` | Smooth, delightful | Marketing, Exploratory |

**3. Physics as Tokens**

```typescript
// sigil-mark/core/physics.ts - Single source of truth
export const PHYSICS = {
  decisive: {
    spring: { stiffness: 180, damping: 12 },
    tap: { scale: 0.98 },
    minPendingTime: 600,
    feel: 'Heavy, deliberate - like confirming a bank transfer',
  },
  // ...
};
```

**4. Three Laws of Enforcement**

| Level | Behavior | Override |
|-------|----------|----------|
| **IMPOSSIBLE** | Physics violations. Never generated. | None |
| **BLOCK** | Budget violations. Sandbox allowed. | Taste Key ruling |
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

### Basic Usage

```tsx
import { SigilZone, useSigilPhysics } from 'sigil-mark/core';
import { Button } from 'sigil-mark/components';

// Checkout page - decisive physics, server-authoritative
function CheckoutPage() {
  return (
    <SigilZone material="decisive" serverAuthoritative>
      <h1>Checkout</h1>
      <Button onAction={confirmPurchase}>
        Confirm Purchase
      </Button>
    </SigilZone>
  );
}

// Marketing page - glass physics
function MarketingPage() {
  return (
    <SigilZone material="glass">
      <h1>Features</h1>
      <Button onClick={learnMore}>
        Learn More
      </Button>
    </SigilZone>
  );
}
```

### Commands (6 total)

| Command | Purpose |
|---------|---------|
| `/craft` | Get design guidance with zone context |
| `/sandbox` | Experiment with raw physics (no constraints) |
| `/codify` | Define zone rules |
| `/inherit` | Bootstrap from existing codebase |
| `/validate` | Check physics compliance |
| `/garden` | Entropy detection and maintenance |

## Architecture

### State Zone: `sigil-mark/`

```
sigil-mark/
├── moodboard.md          # Product feel + references
├── rules.md              # Design rules by category
│
├── core/                 # Core modules
│   ├── physics.ts        # Physics tokens (source of truth)
│   ├── SigilZone.tsx     # Context provider
│   └── zone-resolver.ts  # File path → zone mapping
│
├── components/           # Context-aware components
│   └── Button.tsx        # Auto-inherits physics from zone
│
├── hooks/                # React hooks
│   └── useServerTick.ts  # Server-authoritative actions
│
├── workbench/            # A/B comparison tools
│   ├── ab-toggle.ts      # Context-based toggle
│   ├── useABToggle.ts    # React hook for A/B
│   └── ab-iframe.ts      # Iframe mode
│
├── eslint-plugin/        # Enforcement rules
│
└── __tests__/            # Test suite
```

### Configuration: `.sigilrc.yaml`

```yaml
version: "1.2.5"

zones:
  critical:
    paths: ["src/features/checkout/**", "src/features/claim/**"]
    material: decisive
    sync: server_authoritative

  admin:
    paths: ["src/admin/**"]
    material: machinery

  marketing:
    paths: ["src/features/marketing/**"]
    material: glass

rejections:
  - pattern: "Spinner"
    reason: "Creates anxiety in critical zones"
    exceptions: ["admin/**"]
```

## Core API

### SigilZone

Context provider that gives children access to physics:

```tsx
import { SigilZone } from 'sigil-mark/core';

<SigilZone material="decisive" serverAuthoritative>
  {/* All children inherit decisive physics */}
</SigilZone>
```

### useSigilPhysics

Hook to access current zone's physics:

```tsx
import { useSigilPhysics } from 'sigil-mark/core';

function MyComponent() {
  const { physics, material, serverAuthoritative } = useSigilPhysics();

  return (
    <motion.div
      whileTap={{ scale: physics.tap.scale }}
      transition={physics.spring}
    >
      Using {material} physics
    </motion.div>
  );
}
```

### Button (Context-Aware)

Single button component that inherits physics:

```tsx
import { Button } from 'sigil-mark/components';

// In decisive zone: heavy, deliberate (180/12)
// In machinery zone: instant (400/30)
// In glass zone: smooth (200/20)
<Button onAction={async () => api.confirm()}>
  Confirm
</Button>
```

### useServerTick

Wraps async actions to prevent optimistic UI:

```tsx
import { useServerTick } from 'sigil-mark/hooks';

function ClaimButton() {
  const { execute, isPending } = useServerTick(
    async () => api.claim(),
    { minPendingTime: 600 }  // Decisive feel
  );

  return (
    <button onClick={execute} disabled={isPending}>
      {isPending ? 'Processing...' : 'Claim'}
    </button>
  );
}
```

## A/B Toggle

Compare physics in real-time:

```tsx
import { SigilZone } from 'sigil-mark/core';
import { useABToggle, initABToggle } from 'sigil-mark/workbench';

// Initialize comparison
initABToggle('decisive', 'glass');

function ABTestPage() {
  const { currentMaterial, mode } = useABToggle();

  return (
    <SigilZone material={currentMaterial}>
      <p>Mode: {mode} ({currentMaterial})</p>
      <p>Press Space to toggle</p>
      <Button onAction={async () => {}}>
        Feel the physics
      </Button>
    </SigilZone>
  );
}
```

## ESLint Plugin

Enforce physics at lint time:

```json
{
  "plugins": ["sigil-mark"],
  "rules": {
    "sigil-mark/no-raw-physics": "error",
    "sigil-mark/no-optimistic-in-decisive": "error",
    "sigil-mark/sandbox-stale": "warn"
  }
}
```

| Rule | Description |
|------|-------------|
| `no-raw-physics` | Use physics tokens, not raw values |
| `no-optimistic-in-decisive` | Block optimistic UI in critical zones |
| `sandbox-stale` | Warn on sandbox files >7 days old |

## Moving Code Between Zones

Zero refactors needed:

```tsx
// Before: Component in marketing zone
<SigilZone material="glass">
  <FeatureCard />  // Uses glass physics
</SigilZone>

// After: Same component in critical zone
<SigilZone material="decisive" serverAuthoritative>
  <FeatureCard />  // Now uses decisive physics!
</SigilZone>

// No import changes. No component modifications.
```

## Version History

| Version | Codename | Description |
|---------|----------|-------------|
| v0.3.x | Constitutional Design Framework | Four pillars, strictness |
| v0.4.x | Soul Engine | npm package, hooks |
| v0.5.0 | Design Physics Engine | Simplified physics |
| v1.0.0 | Full Workbench | 4-panel tmux, materials |
| v1.2.4 | Diff + Feel | Recipe files per zone |
| v1.2.5 | Zone Provider | Context-based physics, one component library |

## Key Changes in v1.2.5

- **Physics tokens** — Single source of truth (`core/physics.ts`)
- **SigilZone context** — Components inherit physics automatically
- **One Button** — No more DecisiveButton, GlassButton, MachineryButton
- **Zero refactors** — Moving code = changing the wrapper
- **A/B toggle works** — Context-based, not CSS variables

## Requirements

- Git
- Claude Code CLI
- Node.js 18+ (for ESLint plugin)
- React 18+
- framer-motion (for animations)

## License

[MIT](LICENSE)

## Links

- [Claude Code](https://claude.ai/code)
- [Repository](https://github.com/0xHoneyJar/sigil)
- [Issues](https://github.com/0xHoneyJar/sigil/issues)
