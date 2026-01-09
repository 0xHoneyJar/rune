# Sigil

[![Version](https://img.shields.io/badge/version-5.0.0-blue.svg)](CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

> *"Physics, not opinions. Constraints, not debates."*

Design Context Framework for AI-assisted development. Captures product soul, defines zone physics, and guides agents toward consistent design decisions—without blocking human creativity.

## v5.0 "The Lucid Flow"

The constitutional framework that makes physics binding:

```
CAPTURE              CREATE               GOVERN
───────              ──────               ──────
/envision            /craft               /garden
/codify              /polish              /amend

THE SEVEN LAWS
──────────────
1. Filesystem is Truth        — Live grep, no caches
2. Type Dictates Physics      — Constitution binding
3. Zone is Layout             — Feel, not business logic
4. Status Propagates          — Tier(C) = min(Declared, Dependencies)
5. One Good Reason            — Capture bypasses, don't block
6. Never Refuse Outright      — COMPLY / BYPASS / AMEND
7. Let Artists Stay in Flow   — Never auto-fix
```

**What's new in v5.0:**
- **Constitutional Kernel** — YAML-defined physics binding (constitution.yaml, fidelity.yaml)
- **Live Grep Discovery** — No cache, filesystem is truth (scanning-sanctuary skill)
- **JIT Polish Workflow** — `/polish` standardizes on demand, never auto-fixes
- **Governance System** — `/amend` for constitution changes, justification logging
- **6 Skills Complete** — scanning, analyzing, polishing, negotiating, auditing, simulating

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
├── .claude/skills/sigil/     # Agent skills (/envision, /craft, etc.)
├── sigil-mark/               # Runtime components & state
│   ├── kernel/               # Constitution, fidelity, vocabulary, workflow
│   ├── skills/               # 6 skill YAMLs
│   ├── providers/            # SigilProvider
│   ├── hooks/                # useSigilMutation, physics-resolver
│   ├── layouts/              # CriticalZone, GlassLayout, MachineryLayout
│   ├── process/              # Agent-time utilities (scanner, polish, garden)
│   ├── governance/           # Justifications log, amendments
│   └── components/           # Scanned component inventory
├── .sigilrc.yaml             # Zone configuration
└── .sigil-version.json       # Version tracking
```

---

## The Seven Laws

### 1. Filesystem is Truth
No caches. No stale maps. Live grep discovers components every time.

### 2. Type Dictates Physics
Data types determine behavior. `financial` data requires server-authoritative physics. Constitution binds type to physics.

### 3. Zone is Layout, Not Business Logic
Zones define *feel*, not behavior. A critical zone feels deliberate. A glass zone feels smooth. Logic lives elsewhere.

### 4. Status Propagates
Component tier = minimum of declared tier and dependency tiers. Gold component importing bronze code = bronze tier.

### 5. One Good Reason > 15% Silent Mutiny
When rules block work, capture the bypass with justification. Don't force workarounds that create shadow patterns.

### 6. Never Refuse Outright
Three paths always available: COMPLY, BYPASS (with reason), or AMEND (propose change).

### 7. Let Artists Stay in Flow
Never auto-fix. `/polish` suggests, human decides. Respect creative momentum.

---

## Philosophy

### The Problem

AI agents generate UI without understanding your product's soul. Every generation is a coin flip—sometimes it matches your vision, sometimes it doesn't. Design systems help, but they're too abstract for AI to reason about.

### The Insight: Physics vs Opinions

Sigil treats design decisions like physics, not opinions:

| Physics | Opinions |
|---------|----------|
| Can't be argued with | Invite debate |
| "Server data MUST show pending states" | "I think this should be faster" |
| Ends the conversation | Starts bikeshedding |

### Core Principles

**1. Feel Before Form**
Design is about how things *feel*, not how they *look*. A checkout button and browse button might be visually identical—same color, same size. But they *behave* differently because they're in different physics zones.

**2. Context Over Components**
The same component behaves differently based on where it lives. Zone is determined by context, not component type.

**3. Constraints Enable Creativity**
Unlimited options produce paralysis. Physics constraints free you to focus on what matters.

**4. Diagnose Before Prescribe**
When something feels wrong, don't jump to solutions. "Why does it feel slow?" reveals the root cause.

**5. Entropy Is Inevitable**
Products drift. Sigil treats this as physics: entropy is real, gardens need tending.

---

## Commands

| Command | Purpose | Output |
|---------|---------|--------|
| `/envision` | Capture product moodboard | `sigil-mark/moodboard.md` |
| `/codify` | Define design rules | `sigil-mark/rules.md` |
| `/craft` | Get design guidance | Context-aware suggestions |
| `/polish` | JIT standardization | Diff proposals (never auto-fix) |
| `/garden` | System health check | Health score, issues by severity |
| `/amend` | Propose constitution change | Amendment YAML |

### /garden

System health monitoring:

```bash
/garden              # Full health check
/garden --drift      # Visual drift only
```

Returns:
- Health score (100 - errors*10 - warnings*2)
- Issues grouped by severity (error, warning, info)
- Fidelity violations, status propagation issues, timing checks

### /polish

JIT standardization (respects Law 7):

```bash
/polish              # Staged files
/polish src/Button.tsx
```

Returns:
- Pragma standardization suggestions
- Never auto-applies changes
- Human reviews and accepts

### /amend

Constitution amendment workflow:

```bash
/amend constitution.financial.forbidden[0] --change "Allow useOptimistic for demo accounts" --reason "Demo accounts have no real funds"
```

Creates amendment proposal in `governance/amendments/AMEND-YYYY-NNN.yaml`.

---

## Runtime Integration

### SigilProvider

Wrap your app to enable zone context:

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

The core hook with simulation flow:

```tsx
import { useSigilMutation } from 'sigil-mark';

function ClaimButton({ poolId }) {
  const {
    execute,
    simulate,
    confirm,
    state,
    preview,
    physics
  } = useSigilMutation({
    mutation: () => api.claim(poolId),
    dataType: 'financial',  // From constitution.yaml
  });

  // Simulation flow: simulate → preview → confirm → execute
  const handleClick = async () => {
    const preview = await simulate();
    if (userConfirms(preview)) {
      confirm();
      await execute();
    }
  };

  return (
    <button onClick={handleClick} disabled={state === 'pending'}>
      {state === 'pending' ? 'Claiming...' : 'Claim Rewards'}
    </button>
  );
}
```

### Zone Layouts

Pre-built layout components that set zone context:

```tsx
import { CriticalZone, GlassLayout, MachineryLayout } from 'sigil-mark';

// Critical zone: deliberate physics, server-authoritative
<CriticalZone financial>
  <ClaimButton />
</CriticalZone>

// Glass layout: smooth physics, exploratory feel
<GlassLayout>
  <BrowsePanel />
</GlassLayout>

// Machinery layout: instant physics, admin efficiency
<MachineryLayout>
  <AdminDashboard />
</MachineryLayout>
```

---

## Kernel Structure

The constitutional core of Sigil v5.0:

```
sigil-mark/kernel/
├── constitution.yaml    # Data type → physics binding
├── fidelity.yaml        # Visual + ergonomic ceilings
├── vocabulary.yaml      # Term → physics mapping
└── workflow.yaml        # Team methodology rules
```

### constitution.yaml

Defines what's IMPOSSIBLE, BLOCKED, or WARNED:

```yaml
# Financial data physics
financial:
  physics: server_authoritative
  forbidden:
    - useOptimistic     # IMPOSSIBLE
    - staleWhileRevalidate
  required:
    - pendingState      # MUST show pending
    - confirmationStep  # MUST confirm before execute
```

### fidelity.yaml

Visual and ergonomic constraints:

```yaml
ceilings:
  animation:
    max_concurrent: 3
    max_duration_ms: 2000
  shadows:
    max_layers: 2
  typography:
    max_weights_per_view: 3
```

---

## Architecture

### State Zone Structure

```
sigil-mark/
├── kernel/                   # Constitutional core
│   ├── constitution.yaml     # Type → physics binding
│   ├── fidelity.yaml         # Visual ceilings
│   ├── vocabulary.yaml       # Term mapping
│   └── workflow.yaml         # Team rules
├── skills/                   # 6 skill YAMLs
│   ├── scanning-sanctuary.yaml
│   ├── analyzing-data-risk.yaml
│   ├── polishing-code.yaml
│   ├── negotiating-integrity.yaml
│   ├── auditing-cohesion.yaml
│   └── simulating-interaction.yaml
├── process/                  # Agent-time utilities
│   ├── component-scanner.ts  # Live grep discovery
│   ├── polish-command.ts     # JIT standardization
│   ├── garden-command.ts     # Health monitoring
│   ├── amend-command.ts      # Amendment proposals
│   └── governance-logger.ts  # Justification logging
├── governance/               # Audit trail
│   ├── justifications.log    # Append-only bypass log
│   └── amendments/           # Amendment proposals
├── providers/                # Runtime context
│   └── sigil-provider.tsx
├── hooks/                    # React hooks
│   ├── use-sigil-mutation.ts
│   └── physics-resolver.ts
└── layouts/                  # Zone layouts
    ├── critical-zone.tsx
    ├── glass-layout.tsx
    └── machinery-layout.tsx
```

### The 6 Skills

| Skill | Purpose | Trigger |
|-------|---------|---------|
| scanning-sanctuary | Live grep discovery | Component lookup |
| analyzing-data-risk | Type → physics resolution | Data type detection |
| polishing-code | JIT standardization | /polish, pre-commit |
| negotiating-integrity | Constitution violations | Rule conflicts |
| auditing-cohesion | Visual consistency | /garden, generation |
| simulating-interaction | Timing verification | /garden, /craft --simulate |

---

## Migration from v4.1

```bash
# Run migration script
./sigil-mark/scripts/migrate-v5.sh --dry-run  # Preview
./sigil-mark/scripts/migrate-v5.sh            # Apply

# What it does:
# 1. Deletes sigil.map and .sigil-cache (Law 1: Filesystem is truth)
# 2. Creates v5 directory structure
# 3. Initializes governance/justifications.log
# 4. Updates .sigil-version.json
```

### Key Changes

| v4.1 | v5.0 |
|------|------|
| Cache-based discovery | Live grep (scanning-sanctuary) |
| Auto-fix patterns | JIT polish (never auto-fix) |
| Silent workarounds | Justification logging |
| Fixed rules | Constitutional amendments |

---

## Best Practices

### 1. Start with Soul, Not Rules

Run `/envision` before anything else. Rules without soul produce soulless output.

### 2. Define Zones Early

Zones are your biggest lever. Most products have 3-5:

```yaml
# .sigilrc.yaml
zones:
  critical:
    paths: ["**/checkout/**", "**/claim/**"]
    physics: deliberate
  exploratory:
    paths: ["**/browse/**"]
    physics: playful
```

### 3. Use /garden Regularly

Run `/garden` to catch drift:
- Fidelity violations (animation budget exceeded)
- Status propagation issues (gold importing bronze)
- Timing threshold violations

### 4. Capture Bypasses

When you need to break a rule, use BYPASS with justification:
- Logged to `governance/justifications.log`
- Creates audit trail
- Better than silent workarounds

### 5. Propose Amendments

When a rule is consistently wrong, use `/amend`:
- Creates formal proposal
- Requires justification
- Reviewed and merged (or rejected)

---

## Why "Sigil"?

A sigil is a symbolic representation of intent—a mark that carries meaning beyond its form. Sigil captures your product's design intent and makes it available to AI agents, ensuring every generated component carries the same soul.

---

## Documentation

- **[CLAUDE.md](CLAUDE.md)** — Agent protocol and quick reference
- **[ARCHITECTURE-V5.md](ARCHITECTURE-V5.md)** — v5.0 architecture details
- **[CHANGELOG.md](CHANGELOG.md)** — Version history

---

## License

[MIT](LICENSE)

## Links

- [Claude Code](https://claude.ai/code)
- [Loa Framework](https://github.com/0xHoneyJar/loa)
- [Repository](https://github.com/0xHoneyJar/sigil)
- [Issues](https://github.com/0xHoneyJar/sigil/issues)
