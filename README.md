# Sigil

[![Version](https://img.shields.io/badge/version-0.5.0-blue.svg)](CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

> *"Physics, not opinions. Constraints, not debates."*

Design Physics Engine for AI-assisted development. Gives AI agents physics constraints for consistent design decisions—materials, zones, fidelity ceilings, and human authority.

## Philosophy

### The Problem

AI agents generate UI without understanding your product's soul. Every generation is a coin flip—sometimes it matches your vision, sometimes it doesn't. Design systems help, but they're too abstract for AI to reason about. You end up spending more time correcting than creating.

Meanwhile, design debates consume hours. "Should this button be blue or green?" "Is this animation too slow?" These aren't physics problems—they're taste problems. But without a framework, every decision becomes a debate.

### The Insight: Physics vs Opinions

Sigil treats design decisions like physics, not opinions:

- **Physics can't be argued with.** Gravity doesn't care about your feelings. Server-authoritative data MUST show pending states—this isn't a preference, it's a constraint.
- **Opinions invite debate.** "I think this should be faster" leads to bikeshedding. "This violates discrete tick physics" ends the conversation.

When you frame constraints as physics, AI agents follow them without question. Humans stop debating and start building.

### The Mental Model: Zones

Think of your app like a video game with different physics zones:

| Zone | Feel | Why |
|------|------|-----|
| **Checkout/Trading** | Heavy, deliberate, slow | Money is at stake. Users need to feel the weight of their actions. Server must confirm before UI updates. |
| **Browse/Discover** | Light, fluid, fast | Exploration should feel effortless. Optimistic updates are fine—low stakes. |
| **Admin/Dashboard** | Precise, instant, mechanical | Power users want speed and accuracy. No flourishes, just function. |

This isn't about "looks"—it's about "feels". A button in checkout and a button in browse might look identical, but they *behave* differently because they're in different physics zones.

### The Hierarchy

Not all constraints are equal:

1. **IMPOSSIBLE** — Physics violations. Cannot be generated. Ever. No override exists. (e.g., optimistic updates in server-authoritative zones)
2. **BLOCK** — Budget/fidelity violations. Blocked by default, but the Taste Key holder can create a ruling to override. (e.g., exceeding element count)
3. **WARN** — Drift from essence. Suggestions only. Human decides. (e.g., using a color outside the palette)

This hierarchy eliminates debate: physics is physics, taste is taste.

## Best Practices

### 1. Start with Soul, Not Rules

Run `/envision` before anything else. The soul interview captures *why* your product feels the way it does—reference products, anti-patterns, key moments. Rules without soul produce soulless output.

**Bad**: "Use blue buttons with 8px radius"
**Good**: "We want the confidence of Linear with the warmth of Notion. Checkout should feel like confirming a bank transfer—heavy and deliberate."

### 2. Zones Are Your Biggest Lever

Most products have 3-5 zones. Define them early:

```yaml
zones:
  critical:    # Money, trades, claims
    paths: ["src/features/checkout/**", "src/features/claim/**"]
    material: clay
    sync: server_authoritative

  exploratory: # Browse, discover, social
    paths: ["src/features/browse/**", "src/features/social/**"]
    material: glass
    sync: client_authoritative
```

Once zones are set, every file inherits the right physics automatically. No per-component decisions needed.

### 3. Use /craft Diagnostically

When something "feels wrong," don't ask for a fix—ask for diagnosis:

**Bad**: `/craft "make the button faster"`
**Good**: `/craft "the claim button feels slow, diagnose why"`

The Hammer tool will identify root causes. Often, "feels slow" isn't a design problem—it's a physics constraint (server-authoritative = discrete tick = intentional delay). Fixing the symptom breaks the system.

### 4. One Taste Key Holder

Design by committee produces mediocrity. Designate ONE person as the Taste Key holder. They can:
- Override budget/fidelity violations with rulings
- Make final calls on aesthetic decisions
- But they CANNOT override physics

This isn't dictatorship—it's clarity. Everyone knows who decides taste.

### 5. Garden Regularly

Entropy is real. Run `/garden` monthly to:
- Detect drift from essence
- Review stale mutations
- Archive obsolete decisions
- Prepare for era transitions

Products evolve. Your design physics should evolve with them—deliberately, not accidentally.

## Quick Start

### Mount onto Existing Repository (Recommended)

```bash
# One-liner install
curl -fsSL https://raw.githubusercontent.com/0xHoneyJar/sigil/main/.claude/scripts/mount-sigil.sh | bash

# Start Claude Code
claude

# Initialize and capture soul
/sigil-setup
/envision
```

### Clone and Mount

```bash
git clone https://github.com/0xHoneyJar/sigil.git ~/.sigil/sigil
~/.sigil/sigil/.claude/scripts/mount-sigil.sh
```

## Architecture: State Zone Model

Sigil uses a **state zone** architecture for design context:

| Zone | Path | Purpose |
|------|------|---------|
| **Core** | `sigil-mark/core/` | Physics (immutable after lock) |
| **Resonance** | `sigil-mark/resonance/` | Product tuning (materials, zones, tensions) |
| **Memory** | `sigil-mark/memory/` | History (eras, decisions, mutations) |
| **Taste Key** | `sigil-mark/taste-key/` | Human authority (holder, rulings) |

**Key principle**: Physics violations are IMPOSSIBLE. Budget/fidelity violations are BLOCK (Taste Key can override). Drift is WARN (suggestions only).

## The Workflow

| Phase | Command | Agent | Output |
|-------|---------|-------|--------|
| 0 | `/sigil-setup` | initializing-sigil | State zone structure |
| 1 | `/envision` | envisioning-soul | `resonance/essence.yaml` |
| 2 | `/codify` | codifying-materials | `resonance/materials.yaml` |
| 3 | `/map` | mapping-zones | `resonance/zones.yaml` |
| 4 | `/craft` | crafting-components | Design guidance (Hammer/Chisel) |
| 5 | `/validate` | validating-fidelity | Violation report |
| 6 | `/approve` | approving-patterns | Taste Key rulings |
| 7 | `/greenlight` | greenlighting-concepts | Concept approval |
| 8 | `/garden` | gardening-entropy | Entropy management |

## The Three Laws

1. **Physics violations are IMPOSSIBLE** — No override for server authority, tick modes
2. **Budget/fidelity violations are BLOCK** — Taste Key can create rulings to override
3. **Drift warnings are WARN** — Suggestions only, human decides

## Materials

Materials define physics, not just styles:

| Material | Light | Weight | Motion | Feedback | Zone Affinity |
|----------|-------|--------|--------|----------|---------------|
| **Clay** | Diffuse | Heavy | Spring (120/14) | Depress | Critical, Transactional |
| **Machinery** | Flat | None | Instant | Highlight | Admin |
| **Glass** | Refract | Weightless | Ease (200ms) | Glow | Exploratory, Marketing |

## Zones

Zones determine physics by file path:

| Zone | Material | Sync | Elements | Decisions |
|------|----------|------|----------|-----------|
| Critical | clay | server_authoritative | 5 max | 2 max |
| Transactional | clay | client_authoritative | 12 max | 5 max |
| Exploratory | glass | client_authoritative | 20 max | 10 max |
| Marketing | glass | client_authoritative | 15 max | 8 max |

## Hammer/Chisel Toolkit

The `/craft` command uses a diagnostic-first approach:

**Hammer** (Diagnosis): Load zone physics → Analyze complaint → Identify root cause → Suggest fix

**Chisel** (Execution): Generate with context → Check constraints → Route structural issues to Loa

```
/craft "checkout feels slow"

DIAGNOSIS: Physics conflict detected.
The claim button is in critical zone (server_authoritative).
Physics requires pending state and discrete tick (600ms).

This is NOT a design problem. This is architecture.

Handoff to Loa:
/consult "Evaluate if checkout should remain server_authoritative"
```

## Repository Structure

```
.claude/                        # System Zone (framework-managed)
├── skills/                     # 9 agent skills
├── commands/                   # 9 slash commands
└── scripts/                    # Helper scripts
    └── mount-sigil.sh          # One-command install

sigil-mark/                     # State Zone (design context)
├── core/                       # Physics (immutable)
│   ├── sync.yaml               # Temporal Governor
│   ├── budgets.yaml            # Cognitive/visual limits
│   ├── fidelity.yaml           # Fidelity Ceiling
│   └── lens.yaml               # Rendering layers
├── resonance/                  # Tuning (product-specific)
│   ├── materials.yaml          # Material definitions
│   ├── zones.yaml              # Zone mappings
│   ├── tensions.yaml           # 4-axis tuning
│   └── essence.yaml            # Soul statement
├── memory/                     # History
│   ├── eras/                   # Era snapshots
│   ├── decisions/              # Greenlight records
│   ├── mutations/active/       # Active changes
│   └── graveyard/              # Archived items
└── taste-key/                  # Authority
    ├── holder.yaml             # Current Taste Key holder
    └── rulings/                # Override records

.sigilrc.yaml                   # Configuration
.sigil-version.json             # Version manifest
.sigil-setup-complete           # Setup marker
```

## Configuration

`.sigilrc.yaml` is user-owned:

```yaml
version: "0.5"

component_paths:
  - "components/"
  - "src/components/"

zones:
  critical:
    paths: ["src/features/checkout/**", "src/features/claim/**"]
    material: clay
    sync: server_authoritative

taste_key:
  holder:
    name: "Design Lead"
    email: "lead@example.com"

physics:
  enforcement: "physics"  # IMPOSSIBLE/BLOCK/WARN
```

## Taste Key Authority

### CAN Override
- Budgets (element count, animation count)
- Fidelity (gradient stops, shadow layers)
- Taste (colors, typography, spacing)

### CANNOT Override
- Physics (sync authority, tick modes)
- Security (auth, validation)
- Accessibility (contrast, keyboard nav)

## Coexistence with Loa

Sigil and Loa coexist with different responsibilities:

| Aspect | Sigil | Loa |
|--------|-------|-----|
| Domain | Design physics | Product architecture |
| State zone | `sigil-mark/` | `loa-grimoire/` |
| Handoff | Physics issues → Loa | Structural decisions |

## Documentation

- **[CLAUDE.md](CLAUDE.md)** - Agent instructions
- **[CHANGELOG.md](CHANGELOG.md)** - Version history

## Why "Sigil"?

A sigil is a symbolic representation of intent—a mark that carries meaning beyond its form. Sigil captures your product's design intent and makes it available to AI agents, ensuring every generated component carries the same soul.

## Requirements

- Git
- Claude Code CLI
- jq (optional, for better JSON handling)

## Version History

| Version | Codename | Description |
|---------|----------|-------------|
| v0.3.x | Constitutional Design Framework | Four pillars, progressive strictness |
| v0.4.x | Soul Engine | npm package, React hooks, workbench |
| v0.5.0 | Design Physics Engine | Simplified architecture, physics focus |

## License

[MIT](LICENSE)

## Links

- [Claude Code](https://claude.ai/code)
- [Repository](https://github.com/0xHoneyJar/sigil)
- [Issues](https://github.com/0xHoneyJar/sigil/issues)
