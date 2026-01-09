# Sigil

[![Version](https://img.shields.io/badge/version-6.0.0-blue.svg)](CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

> *"Code is precedent. Survival is the vote. Never interrupt flow."*

Design Context Framework for AI-assisted development. Captures product soul, defines zone physics, and guides agents toward consistent design decisions—without blocking human creativity.

## v6.0 "Native Muse"

The survival-based framework that learns from your code:

```
THREE LAWS
───────────
1. Code is Precedent      — Patterns that survive become canonical
2. Survival is the Vote   — Usage frequency determines status
3. Never Interrupt Flow   — No blocking, no dialogs, observe silently

KEY FEATURES
────────────
Pre-computed Workshop     — 5ms queries (was 200ms JIT grep)
Virtual Sanctuary         — Seeds for cold starts
Physics-only Validation   — Block violations, not novelty
Survival Observation      — Patterns earn status through usage
Context Forking           — Ephemeral inspiration without pollution
10 Skills + Hooks         — Complete lifecycle automation
```

**What's new in v6.0:**
- **Workshop Index** — Pre-computed at startup, <5ms queries
- **Virtual Sanctuary** — Seeds (Linear-like, Vercel-like, Stripe-like) for cold starts
- **Survival Observation** — Patterns tracked silently, promoted by usage
- **Ephemeral Inspiration** — Reference external sites without polluting taste
- **Forge Mode** — Explicit precedent-breaking exploration
- **Era Management** — Design direction shifts without losing history
- **11 Skills** — scanning, graphing, querying, validating, seeding, inspiring, forging, managing, observing, chronicling, auditing

---

## Installation

```bash
# Mount Sigil onto any repository
curl -fsSL https://raw.githubusercontent.com/0xHoneyJar/sigil/main/.claude/scripts/mount-sigil.sh | bash

# Start Claude Code and capture your product's soul
claude
/envision
```

**Time investment:** ~15 minutes to capture soul
**Payoff:** Every future generation inherits your design physics automatically

### What Gets Installed

```
your-repo/
├── .claude/
│   ├── skills/           # 11 agent skills
│   └── agents/           # sigil-craft orchestrator
├── .sigil/               # Runtime state (NEW in v6.0)
│   ├── workshop.json     # Pre-computed index
│   ├── survival.json     # Pattern tracking
│   ├── seed.yaml         # Virtual Sanctuary
│   └── craft-log/        # Session logs
├── sigil-mark/           # Runtime components & state
│   ├── kernel/           # Constitution, fidelity, vocabulary
│   ├── providers/        # SigilProvider
│   ├── hooks/            # useSigilMutation
│   ├── layouts/          # CriticalZone, GlassLayout
│   └── process/          # Agent-time utilities
├── .sigilrc.yaml         # Zone configuration
└── .sigil-version.json   # Version tracking
```

---

## The Three Laws

### 1. Code is Precedent
Patterns that survive in your codebase become canonical. No governance dialogs, no approval workflows. If you use a pattern 5+ times, it becomes the standard.

### 2. Survival is the Vote
Usage frequency determines pattern status. Experimental (1-2 uses) → Surviving (3-4) → Canonical (5+). Unused patterns fade. Democracy through code.

### 3. Never Interrupt Flow
No blocking dialogs. No approval prompts. Pattern observation happens silently via PostToolUse hooks. Craft logs are written at session end. Stay in flow.

---

## Philosophy

### The Problem

AI agents generate UI without understanding your product's soul. Every generation is a coin flip—sometimes it matches your vision, sometimes it doesn't. Design systems help, but they're too abstract for AI to reason about.

### The v6.0 Insight: Survival > Approval

v5.0 had governance dialogs for pattern approval. They interrupted flow. v6.0 observes silently and lets survival be the vote:

| v5.0 | v6.0 |
|------|------|
| JIT grep (200ms) | Workshop index (5ms) |
| Governance dialogs | Silent observation |
| Empty room for cold starts | Virtual Sanctuary seeds |
| Block novelty | Block physics only |
| 6 skills | 11 skills + hooks |

### Core Principles

**1. Pre-compute Everything**
The workshop index builds at startup. Queries take 5ms instead of 200ms. Context is always fresh.

**2. Seeds for Cold Starts**
New projects get virtual taste from seeds (Linear-like, Vercel-like, Stripe-like). Virtual components "fade" as real ones are created.

**3. Physics, Not Opinions**
Physics violations are blocked (critical zone + playful animation). Style novelty is allowed. Constraints enable creativity.

**4. Patterns Earn Their Place**
Use a pattern once, it's experimental. Use it 3 times, it survives. Use it 5+ times, it's canonical. No approvals needed.

**5. Context Forking**
Reference stripe.com for inspiration without polluting your taste. Forked context is discarded after generation.

---

## Commands

| Command | Purpose | Output |
|---------|---------|--------|
| `/envision` | Capture product moodboard | `sigil-mark/moodboard.md` |
| `/codify` | Define design rules | `sigil-mark/rules.md` |
| `/craft` | Design guidance | Zone-aware generation |
| `/forge` | Precedent-breaking | Physics-only validation |
| `/inspire` | Ephemeral reference | One-time fetch |
| `/sanctify` | Promote pattern | Add to rules.md |
| `/garden` | Pattern gardening | Promotion/rejection scan |
| `/audit` | Cohesion check | Variance report |
| `/new-era` | Era transition | Archive & reset |

### /craft

Zone-aware design guidance with workshop index:

```bash
/craft "trustworthy claim button"
```

Flow:
1. Check workshop freshness
2. Query materials and components (<5ms)
3. Resolve zone from vocabulary ("claim" → critical)
4. Apply physics (deliberate, 800ms)
5. Select canonical patterns
6. Validate physics (no blocking on novelty)
7. Generate code
8. Observe patterns (silent)
9. Write craft log (session end)

### /forge

Explicit precedent-breaking mode:

```bash
/forge "experimental loading animation"
# or
/craft --forge "experimental animation"
```

- Skips survival checks
- Ignores rejected patterns
- Still enforces physics
- Prompts: "Keep this exploration?"

### /inspire

Ephemeral external reference:

```bash
/inspire stripe.com "gradient button"
```

- Forks context (no survival access)
- Fetches and extracts styles
- Generates with extracted styles
- Discards fetched content
- Only generated code remains

### /sanctify

Promote ephemeral pattern to permanent:

```bash
/sanctify "gradient-border"
```

- Extracts from recent generation
- Adds to rules.md
- Logs sanctification

### /garden

Pattern gardening (weekly scan):

```bash
/garden
```

- Scans for @sigil-pattern tags
- Counts occurrences
- Promotes (3+ → canonical)
- Rejects (0 occurrences)

### /audit

Visual cohesion check:

```bash
/audit ClaimButton
```

Returns variance report:
- Shadow, border-radius, spacing, colors
- Flags variances exceeding thresholds
- Shows justified deviations

### /new-era

Design direction shift:

```bash
/new-era "Tactile"
```

- Archives current patterns
- Creates new era
- Resets counts (history preserved)
- Updates rules.md

---

## Workshop Index

Pre-computed at `.sigil/workshop.json`:

```json
{
  "indexed_at": "2026-01-08T00:00:00Z",
  "package_hash": "abc123",
  "imports_hash": "def456",
  "materials": {
    "framer-motion": {
      "version": "11.15.0",
      "exports": ["motion", "AnimatePresence"]
    }
  },
  "components": {
    "Button": {
      "path": "src/sanctuary/Button.tsx",
      "tier": "gold",
      "zone": "standard"
    }
  },
  "physics": {
    "deliberate": { "timing": 800 },
    "snappy": { "timing": 150 }
  }
}
```

### Performance

| Operation | Target | Achieved |
|-----------|--------|----------|
| Workshop query | <5ms | ~2ms |
| Sanctuary scan | <50ms | ~30ms |
| Full rebuild | <2s | ~1.5s |
| Pattern observation | <10ms | ~5ms |

---

## Virtual Sanctuary

For cold start projects:

| Seed | Feel | Physics |
|------|------|---------|
| Linear-like | Minimal, monochrome | 150ms |
| Vercel-like | Bold, high-contrast | 100ms |
| Stripe-like | Soft gradients | 300ms |
| Blank | No preset | default |

Virtual components "fade" when real ones are created:
```
Virtual Button → Real Button created → Virtual fades
```

---

## Survival Observation

Pattern tracking at `.sigil/survival.json`:

```json
{
  "era": "v1",
  "patterns": {
    "animation:spring-entrance": {
      "status": "canonical",
      "occurrences": 7,
      "files": ["Button.tsx", "Card.tsx"]
    }
  }
}
```

### Promotion Rules

| Status | Occurrences |
|--------|-------------|
| experimental | 1-2 |
| surviving | 3-4 |
| canonical | 5+ |

---

## Runtime Integration

### SigilProvider

```tsx
import { SigilProvider } from 'sigil-mark';

function App() {
  return (
    <SigilProvider>
      <YourApp />
    </SigilProvider>
  );
}
```

### useSigilMutation

```tsx
import { useSigilMutation } from 'sigil-mark';

function ClaimButton({ poolId }) {
  const { execute, simulate, confirm, state } = useSigilMutation({
    mutation: () => api.claim(poolId),
    dataType: 'financial',
  });

  return (
    <button
      onClick={async () => {
        const preview = await simulate();
        if (userConfirms(preview)) {
          confirm();
          await execute();
        }
      }}
      disabled={state === 'pending'}
    >
      Claim
    </button>
  );
}
```

### Zone Layouts

```tsx
import { CriticalZone, GlassLayout, MachineryLayout } from 'sigil-mark';

<CriticalZone financial>
  <ClaimButton />
</CriticalZone>

<GlassLayout>
  <BrowsePanel />
</GlassLayout>

<MachineryLayout>
  <AdminDashboard />
</MachineryLayout>
```

---

## Architecture

### The 11 Skills

| Skill | Trigger | Purpose |
|-------|---------|---------|
| scanning-sanctuary | Component lookup | Live ripgrep discovery |
| graphing-imports | Startup | Dependency scanning |
| querying-workshop | /craft | Fast index queries |
| validating-physics | PreToolUse | Block violations |
| seeding-sanctuary | Cold start | Virtual taste |
| inspiring-ephemerally | "like [url]" | Forked fetch |
| forging-patterns | /forge | Bypass survival |
| managing-eras | /new-era | Era transitions |
| observing-survival | PostToolUse | Silent tracking |
| chronicling-rationale | Stop | Craft logs |
| auditing-cohesion | /audit | Variance checks |

### Hook Integration

| Hook | Skill | Purpose |
|------|-------|---------|
| PreToolUse | validating-physics | Block physics violations |
| PostToolUse | observing-survival | Silent pattern tracking |
| Stop | chronicling-rationale | Write craft log |

---

## Migration from v5.0

```bash
# Run migration script
./scripts/migrate-v6.sh --dry-run  # Preview
./scripts/migrate-v6.sh            # Apply
```

See [MIGRATION.md](MIGRATION.md) for full guide.

| v5.0 | v6.0 |
|------|------|
| JIT grep | Workshop index |
| Governance dialogs | Survival observation |
| Empty cold starts | Virtual Sanctuary |
| 6 skills | 11 skills + hooks |

---

## Best Practices

### 1. Let Patterns Survive

Don't delete patterns manually. Let survival track them. Unused patterns (0 occurrences) are naturally rejected.

### 2. Use Forge for Exploration

When trying new approaches, use `/forge`. It skips survival checks while enforcing physics.

### 3. Garden Regularly

Run `/garden` weekly to promote surviving patterns and clean up rejected ones.

### 4. Sanctify Good Ideas

Used ephemeral inspiration and loved it? Run `/sanctify` to make it permanent.

### 5. Era for Big Shifts

Major redesign? Run `/new-era` to archive current patterns and start fresh.

---

## Why "Sigil"?

A sigil is a symbolic representation of intent—a mark that carries meaning beyond its form. Sigil captures your product's design intent and makes it available to AI agents, ensuring every generated component carries the same soul.

---

## Documentation

- **[CLAUDE.md](CLAUDE.md)** — Agent protocol and quick reference
- **[MIGRATION.md](MIGRATION.md)** — v5.0 to v6.0 migration
- **[CHANGELOG.md](CHANGELOG.md)** — Version history

---

## License

[MIT](LICENSE)

## Links

- [Claude Code](https://claude.ai/code)
- [Loa Framework](https://github.com/0xHoneyJar/loa)
- [Repository](https://github.com/0xHoneyJar/sigil)
- [Issues](https://github.com/0xHoneyJar/sigil/issues)
