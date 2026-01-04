# Software Design Document: Sigil v11 — Soul Engine

**Version:** 2.0
**Date:** 2026-01-03
**Author:** Architecture Agent
**Status:** Draft
**PRD Reference:** `loa-grimoire/prd.md` v3.0
**Supersedes:** Sigil v0.4 SDD v1.0

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [System Architecture](#system-architecture)
3. [Technology Stack](#technology-stack)
4. [Component Design](#component-design)
5. [Data Architecture](#data-architecture)
6. [Skill Architecture (8 Agents)](#skill-architecture-8-agents)
7. [HUD Overlay Design](#hud-overlay-design)
8. [Context Injection System](#context-injection-system)
9. [Fidelity Validation Engine](#fidelity-validation-engine)
10. [Integration Points](#integration-points)
11. [Development Workflow](#development-workflow)
12. [Technical Risks & Mitigation](#technical-risks--mitigation)
13. [Future Considerations](#future-considerations)

---

## Executive Summary

Sigil v11 is a **design craft framework** that enables AI agents to generate UI with soul through physics-based constraints, material systems, and fidelity ceilings.

### Key Evolution from v0.4

| v0.4 | v11 |
|------|-----|
| SQLite + Vite Workbench | YAML files only + HUD overlay |
| 6 systems | 8 named agents |
| No immutable kernel | Immutable kernel after lock |
| No fidelity ceiling | Fidelity Ceiling (Mod Ghost Rule) |
| Standalone Workbench app | Lightweight HUD overlay |

### Architecture Principles

1. **Zero Production Footprint**: HUD and dev tools only run in development
2. **YAML-First State**: All configuration and state in human-readable YAML files
3. **Context Injection Over Linting**: Constraints injected before generation, not linted after
4. **Claude Code Skills**: Each agent implemented as a `.claude/skills/` directory
5. **CSS Custom Properties**: Runtime tensions via CSS variables for <16ms updates

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SIGIL v11 ARCHITECTURE                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  CLAUDE CODE INTEGRATION                                             │    │
│  │  ┌─────────────┐                                                     │    │
│  │  │ CLAUDE.md   │ ← Context auto-injected from sigil-mark/           │    │
│  │  └─────────────┘                                                     │    │
│  │  ┌─────────────────────────────────────────────────────────────┐    │    │
│  │  │ .claude/skills/                                              │    │    │
│  │  │ 8 Agent Skills (envisioning, codifying, crafting, etc.)     │    │    │
│  │  └─────────────────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                              │                                               │
│                              │ reads/writes                                  │
│                              ▼                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  SIGIL STATE (sigil-mark/)                                          │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │    │
│  │  │ kernel/      │  │ soul/        │  │ governance/  │               │    │
│  │  │ (immutable)  │  │ (writable)   │  │ (dictated)   │               │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘               │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                              │                                               │
│                              │ dev only                                      │
│                              ▼                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  RUNTIME (Development Only)                                         │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │    │
│  │  │ HUD Overlay  │  │ CSS Variables│  │ File Watcher │               │    │
│  │  │ (React)      │  │ (Tensions)   │  │ (YAML sync)  │               │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘               │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## System Architecture

### Layer Model

| Layer | Responsibility | Mutability | Owner |
|-------|---------------|------------|-------|
| **Kernel** | Physics primitives, sync strategies, fidelity ceiling | IMMUTABLE after lock | Framework |
| **Soul** | Materials, zones, tensions, essence | Read/Write | Project |
| **Governance** | Taste owners, approvals, polls | Dictate only | Taste Owner |
| **Workbench** | Paper cuts, fidelity reports, temp state | Read/Write | System |

### Directory Structure

```
project/
├── CLAUDE.md                         # Auto-generated context injection
├── .sigilrc.yaml                     # Root configuration
├── .sigil-setup-complete             # Setup marker
├── .sigil-version.json               # Version tracking
│
├── .claude/
│   └── skills/                       # 8 Agent skills
│       ├── envisioning-soul/
│       │   ├── index.yaml
│       │   └── SKILL.md
│       ├── codifying-materials/
│       ├── mapping-zones/
│       ├── crafting-components/
│       ├── validating-fidelity/
│       ├── gardening-entropy/
│       ├── approving-patterns/
│       └── greenlighting-concepts/
│
├── sigil-mark/                       # Soul state
│   ├── kernel/                       # IMMUTABLE after /codify --lock
│   │   ├── physics.yaml             # Light, weight, motion, feedback
│   │   ├── sync.yaml                # CRDT, LWW, Server-Tick
│   │   └── fidelity-ceiling.yaml    # Gold Standard constraints
│   │
│   ├── soul/
│   │   ├── essence.yaml             # Soul statement, invariants
│   │   ├── materials.yaml           # Material compositions
│   │   ├── zones.yaml               # Path-based zones
│   │   └── tensions.yaml            # Current tension state
│   │
│   ├── governance/
│   │   ├── taste-owners.yaml        # Named authorities
│   │   ├── approvals.yaml           # Sign-off records
│   │   ├── polls.yaml               # Greenlight polls
│   │   └── archaeology.yaml         # Rejection history
│   │
│   ├── workbench/
│   │   ├── paper-cuts.yaml          # Entropy tracking
│   │   └── fidelity-report.yaml     # Validation results
│   │
│   ├── moodboard.md                 # References, anti-patterns
│   └── gold-standard/               # Reference assets
│
└── sigil-hud/                        # Optional: HUD overlay package
    ├── package.json
    └── src/
        ├── index.tsx                # <SigilHUD /> component
        ├── hooks/
        │   ├── useTensions.ts
        │   ├── useMaterial.ts
        │   └── useZone.ts
        └── components/
            ├── TensionSlider.tsx
            ├── MaterialPicker.tsx
            └── FidelityStatus.tsx
```

---

## Technology Stack

### Core Technologies

| Category | Technology | Justification |
|----------|------------|---------------|
| **State Format** | YAML | Human-readable, git-diffable, Claude-friendly |
| **Skills Runtime** | Claude Code Skills | Native integration, no external dependencies |
| **HUD Runtime** | React 18+ | Matches target stack (NextJS/React ecosystem) |
| **CSS Runtime** | CSS Custom Properties | Native, <16ms updates, no build step |
| **File Watching** | Node.js fs.watch | Native, no dependencies for simple YAML sync |
| **Validation** | TypeScript + RegExp | Fast pattern matching for fidelity checks |
| **Schema** | YAML + TypeScript types | Type-safe with zod for validation |

### Target Stack Compatibility

| Framework | Support Level | Notes |
|-----------|---------------|-------|
| **NextJS 14+** | Full | App Router, Server Components compatible |
| **React 18+** | Full | Concurrent features, Suspense compatible |
| **Tailwind CSS** | Full | Works with Tailwind utility classes |
| **Shadcn/UI** | Full | Component library compatible |
| **Vite** | Full | Dev server compatible |
| **Remix** | Partial | Requires manual HUD injection |

### Dependencies

```json
{
  "dependencies": {},
  "devDependencies": {
    "@sigil/hud": "^0.1.0",
    "yaml": "^2.3.0",
    "zod": "^3.22.0"
  },
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0"
  }
}
```

**Design Decision:** Minimal dependencies. YAML parsing and Zod validation are the only required packages. The HUD is optional and dev-only.

---

## Component Design

### 1. Kernel Layer

The Kernel contains immutable physics primitives. After `/codify --lock`, these files cannot be modified.

#### physics.yaml Schema

```typescript
interface PhysicsKernel {
  version: string;
  locked: boolean;
  locked_at?: string;
  locked_by?: string;

  light: {
    refract: { blur: number; opacity: number };
    diffuse: { shadow_layers: number };
    flat: { background: string };
    reflect: { gradient_angle: number };
  };

  weight: {
    weightless: { hover: string };
    light: { hover: string; shadow_scale: number };
    heavy: { hover: string; shadow_scale: number };
    none: Record<string, never>;
  };

  motion: {
    instant: { duration_ms: 0; easing: "step-end" };
    linear: { duration_ms: number; easing: "linear" };
    ease: { duration_ms: number; easing: string };
    spring: { duration_ms: number; easing: string };
    step: { duration_ms: number; easing: "steps(n)" };
    deliberate: { duration_ms: number; easing: string };
  };

  feedback: {
    none: Record<string, never>;
    highlight: { background: string };
    lift: { transform: string };
    depress: { transform: string };
    glow: { boxShadow: string };
    ripple: { animation: string };
    pulse: { animation: string };
    xp_drop: { animation: string };
  };

  surface: {
    transparent: { opacity: number };
    translucent: { opacity: number; blur: number };
    solid: { opacity: 1 };
    textured: { pattern: string };
  };
}
```

#### physics.yaml Example

```yaml
# sigil-mark/kernel/physics.yaml
version: "1.0"
locked: false

light:
  refract:
    blur: 20
    opacity: 0.7
    css: "backdrop-filter: blur(20px); opacity: 0.7;"
  diffuse:
    shadow_layers: 3
    css: |
      box-shadow:
        0 1px 2px rgba(0,0,0,0.05),
        0 4px 8px rgba(0,0,0,0.05),
        0 8px 16px rgba(0,0,0,0.05);
  flat:
    background: "#0A0A0A"
    css: "background: #0A0A0A; border: 1px solid #2A2A2A;"

weight:
  weightless:
    hover: "translateY(-1px)"
    shadow_scale: 0.8
  light:
    hover: "translateY(-2px)"
    shadow_scale: 1.0
  heavy:
    hover: "translateY(-3px)"
    shadow_scale: 1.3
  none:
    hover: "none"
    shadow_scale: 0

motion:
  instant:
    duration_ms: 0
    easing: "step-end"
    css: "transition: none;"
  linear:
    duration_ms: 200
    easing: "linear"
  ease:
    duration_ms: 200
    easing: "ease-out"
  spring:
    duration_ms: 300
    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)"
  deliberate:
    duration_ms: 800
    easing: "cubic-bezier(0.4, 0, 0.2, 1)"

feedback:
  none: {}
  highlight:
    background: "rgba(255,255,255,0.05)"
    css: "background: rgba(255,255,255,0.05);"
  lift:
    transform: "translateY(-2px)"
    css: "transform: translateY(-2px);"
  depress:
    transform: "translateY(1px) scale(0.98)"
    css: "transform: translateY(1px) scale(0.98);"
  glow:
    boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)"
  xp_drop:
    animation: "rise 1500ms ease-out"
    keyframes: |
      @keyframes rise {
        0% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(-50px); }
      }
```

#### sync.yaml Schema

```typescript
interface SyncKernel {
  version: string;
  locked: boolean;

  strategies: {
    server_tick: {
      keywords: string[];
      ui_behavior: "pending_state";
      optimistic: false;
      confirmation: "xp_drop" | "checkmark" | "fade";
      pending_ui: "skeleton" | "text" | "disabled";
    };
    crdt: {
      keywords: string[];
      ui_behavior: "presence_cursors";
      optimistic: true;
      presence_indicator: boolean;
    };
    lww: {
      keywords: string[];
      ui_behavior: "instant";
      optimistic: true;
      background_sync: boolean;
    };
    local_only: {
      keywords: string[];
      ui_behavior: "instant";
      sync: false;
    };
  };
}
```

#### sync.yaml Example

```yaml
# sigil-mark/kernel/sync.yaml
version: "1.0"
locked: false

strategies:
  server_tick:
    description: "High-stakes operations that MUST wait for server confirmation"
    keywords:
      - trade
      - transfer
      - buy
      - sell
      - money
      - wallet
      - balance
      - health
      - inventory
      - payment
      - transaction
    ui_behavior: pending_state
    optimistic: false
    rules:
      - "NEVER update UI optimistically"
      - "MUST show pending state (spinner forbidden, use text or skeleton)"
      - "MUST wait for server confirmation"
      - "MUST show success animation (xp_drop style)"
    pending_ui: disabled
    confirmation: xp_drop

  crdt:
    description: "Collaborative content that syncs in real-time"
    keywords:
      - edit
      - type
      - write
      - comment
      - message
      - document
      - collaborative
    ui_behavior: presence_cursors
    optimistic: true
    rules:
      - "Show presence cursors for other users"
      - "Optimistic updates allowed"
      - "Subtle sync indicator"

  lww:
    description: "Last-write-wins for simple state"
    keywords:
      - move
      - toggle
      - select
      - preference
      - position
      - setting
    ui_behavior: instant
    optimistic: true
    rules:
      - "Instant local update"
      - "Background sync"
      - "No confirmation needed"

  local_only:
    description: "UI state that doesn't sync"
    keywords:
      - modal
      - dropdown
      - hover
      - tooltip
      - menu
    ui_behavior: instant
    sync: false
```

#### fidelity-ceiling.yaml Schema

```typescript
interface FidelityCeiling {
  version: string;
  locked: boolean;

  era: string;  // "2007", "2024", etc.

  constraints: {
    visual: {
      gradients: { max_stops: number; forbidden: string[] };
      shadows: { max_layers: number; forbidden: string[] };
      borders: { max_width: number; forbidden: string[] };
      border_radius: { max_px: number; forbidden: string[] };
    };
    animation: {
      max_duration_ms: number;
      forbidden: string[];
    };
    typography: {
      max_font_families: number;
      min_font_size: number;
      forbidden: string[];
    };
  };

  forbidden_techniques: string[];

  detection: {
    reject_patterns: Array<{
      pattern: string;
      message: string;
      severity: "error" | "warn";
    }>;
  };

  zone_exceptions: {
    marketing: {
      animation: { max_duration_ms: number };
      confetti_allowed: boolean;
    };
  };
}
```

#### fidelity-ceiling.yaml Example

```yaml
# sigil-mark/kernel/fidelity-ceiling.yaml
version: "1.0"
locked: false

era: "2024"

agent_instruction: |
  You are an apprentice in {{era}}.
  You do not know what {{forbidden_techniques | join(", ")}} are.
  You cannot generate textures above 64x64.
  If your output looks "better" than the Gold Standard, it is WRONG.

constraints:
  visual:
    gradients:
      max_stops: 2
      forbidden:
        - "mesh gradient"
        - "conic-gradient with >3 stops"
    shadows:
      max_layers: 3
      forbidden:
        - "colored shadows"
        - "inset shadows on buttons"
    borders:
      max_width_px: 2
      forbidden:
        - "dashed"
        - "dotted"
        - "gradient borders"
    border_radius:
      max_px: 16
      forbidden:
        - "asymmetric radius"
  animation:
    max_duration_ms: 800
    forbidden:
      - "3D transforms"
      - "particles"
      - "confetti"
      - "morphing"
  typography:
    max_font_families: 2
    min_font_size_px: 12
    forbidden:
      - "decorative fonts in UI"
      - "variable font animations"

forbidden_techniques:
  - "Ambient Occlusion"
  - "Mesh Gradients"
  - "3D Transforms"
  - "Particle Systems"
  - "Motion Blur"
  - "Morphing Animations"
  - "Glassmorphism with grain"
  - "Claymorphism"
  - "Neumorphism"

detection:
  reject_patterns:
    - pattern: "rotate[XYZ]|perspective|transform3d"
      message: "3D transforms are forbidden"
      severity: error
    - pattern: "linear-gradient\\([^)]+,[^,]+,[^,]+,[^,]+"
      message: "Gradient has >2 stops"
      severity: warn
    - pattern: "mesh-gradient"
      message: "Mesh gradients are forbidden"
      severity: error

zone_exceptions:
  marketing:
    animation:
      max_duration_ms: 1500
    confetti_allowed: true
    gradients:
      max_stops: 4
```

### 2. Lock Mechanism

The kernel lock is enforced at the skill level:

```typescript
// In codifying-materials skill
async function lockKernel(): Promise<void> {
  const kernelPath = 'sigil-mark/kernel/';
  const files = ['physics.yaml', 'sync.yaml', 'fidelity-ceiling.yaml'];

  for (const file of files) {
    const content = await readYaml(`${kernelPath}${file}`);
    content.locked = true;
    content.locked_at = new Date().toISOString();
    content.locked_by = getCurrentUser();
    await writeYaml(`${kernelPath}${file}`, content);
  }

  // Record lock in version file
  const version = await readJson('.sigil-version.json');
  version.kernel_locked = true;
  version.kernel_locked_at = new Date().toISOString();
  await writeJson('.sigil-version.json', version);
}

// Validation on any kernel modification attempt
function validateKernelIntegrity(filePath: string): void {
  if (filePath.includes('sigil-mark/kernel/')) {
    const content = readYamlSync(filePath);
    if (content.locked) {
      throw new Error(
        `Kernel file ${filePath} is locked and cannot be modified. ` +
        `Locked at ${content.locked_at} by ${content.locked_by}.`
      );
    }
  }
}
```

---

## Data Architecture

### YAML File Schemas

All state is stored in YAML files. No database is used.

#### State Flow

```
User Action          YAML File                    Runtime Effect
───────────────────────────────────────────────────────────────────
/envision       →    soul/essence.yaml       →    CLAUDE.md updated
/codify         →    soul/materials.yaml     →    CLAUDE.md updated
/zone           →    soul/zones.yaml         →    CLAUDE.md updated
Tension slider  →    soul/tensions.yaml      →    CSS vars updated
/approve        →    governance/approvals.yaml
/garden         →    workbench/paper-cuts.yaml
/validate       →    workbench/fidelity-report.yaml
```

#### tensions.yaml

```yaml
# sigil-mark/soul/tensions.yaml
version: "1.0"
updated_at: "2026-01-03T10:00:00Z"

# Default tensions (0-100 scale)
default:
  playfulness: 50
  weight: 50
  density: 50
  speed: 50

# Current active tensions
current:
  playfulness: 45
  weight: 60
  density: 50
  speed: 70

  # Zone overrides
  zone_overrides:
    critical:
      speed: 40  # Slower for critical actions
    marketing:
      playfulness: 80  # More playful for marketing

# Named presets
presets:
  linear:
    playfulness: 20
    weight: 30
    density: 70
    speed: 95
  airbnb:
    playfulness: 50
    weight: 60
    density: 40
    speed: 50
  osrs:
    playfulness: 30
    weight: 70
    density: 60
    speed: 40
  nintendo:
    playfulness: 80
    weight: 50
    density: 30
    speed: 60
```

#### zones.yaml

```yaml
# sigil-mark/soul/zones.yaml
version: "1.0"

zones:
  critical:
    description: "High-stakes transactions"
    material: clay
    sync: server_tick
    motion:
      style: deliberate
      entrance_ms: 300
    patterns:
      prefer:
        - "confirmation-flow"
        - "pending-state"
      warn:
        - "instant-transition"
        - "optimistic-update"
    paths:
      - "src/features/checkout/**"
      - "src/features/trade/**"
      - "src/features/claim/**"

  transactional:
    description: "Data operations"
    material: machinery
    sync: lww
    motion:
      style: instant
      entrance_ms: 0
    paths:
      - "src/features/dashboard/**"
      - "src/features/admin/**"

  exploratory:
    description: "Discovery and browsing"
    material: glass
    sync: lww
    motion:
      style: ease
      entrance_ms: 200
    paths:
      - "src/features/browse/**"
      - "src/features/search/**"

  marketing:
    description: "Landing and promotional"
    material: clay
    sync: local_only
    motion:
      style: spring
      entrance_ms: 400
    fidelity_override:
      animation:
        max_duration_ms: 1500
      confetti_allowed: true
    paths:
      - "src/features/landing/**"
      - "src/marketing/**"

  default:
    description: "Fallback for unmatched paths"
    material: clay
    sync: lww
    motion:
      style: ease
      entrance_ms: 200
```

#### materials.yaml

```yaml
# sigil-mark/soul/materials.yaml
version: "1.0"

materials:
  glass:
    description: "Light, translucent, VisionOS-inspired"
    primitives:
      light: refract
      weight: weightless
      motion: ease
      feedback:
        - glow
    forbidden:
      - "solid backgrounds"
      - "hard shadows"
      - "spring animations"
    css_base: |
      backdrop-filter: blur(20px) saturate(180%);
      background: rgba(255, 255, 255, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.2);

  clay:
    description: "Warm, tactile, trust-inspiring"
    primitives:
      light: diffuse
      weight: heavy
      motion: spring
      feedback:
        - lift
        - depress
    forbidden:
      - "flat design"
      - "instant transitions"
      - "pure gray backgrounds"
    css_base: |
      background: linear-gradient(135deg, #FAFAF9 0%, #F5F5F4 100%);
      border-radius: 16px;
      box-shadow:
        0 1px 2px rgba(0,0,0,0.05),
        0 4px 12px rgba(0,0,0,0.08);
      transition: all 300ms cubic-bezier(0.34, 1.56, 0.64, 1);

  machinery:
    description: "Instant, precise, command-line feel"
    primitives:
      light: flat
      weight: none
      motion: instant
      feedback:
        - highlight
    forbidden:
      - "fade-in animations"
      - "bounce effects"
      - "loading spinners"
      - "gradients"
      - "shadows"
    css_base: |
      background: #0A0A0A;
      color: #FAFAFA;
      border: 1px solid #2A2A2A;
      font-family: 'JetBrains Mono', monospace;
```

### CLAUDE.md Generation

The `CLAUDE.md` file is auto-generated from sigil-mark/ state:

```typescript
async function generateClaudeMd(): Promise<string> {
  const essence = await readYaml('sigil-mark/soul/essence.yaml');
  const materials = await readYaml('sigil-mark/soul/materials.yaml');
  const zones = await readYaml('sigil-mark/soul/zones.yaml');
  const tensions = await readYaml('sigil-mark/soul/tensions.yaml');
  const fidelity = await readYaml('sigil-mark/kernel/fidelity-ceiling.yaml');
  const physics = await readYaml('sigil-mark/kernel/physics.yaml');

  return `
# Sigil: Design Context Framework

> "Make the right path easy. Make the wrong path visible."

## What is Sigil?

Sigil is a design context framework that helps AI agents make consistent design decisions.

## The Three Laws

### Law 1: Fidelity Ceiling
"Better" is often "worse." Block improvements that exceed the Gold Standard.

${fidelity.agent_instruction}

### Law 2: Taste Owner Authority
Visuals and vibe are dictated, never polled.

### Law 3: Poll Concepts, Not Pixels
Community votes on "should this exist?" — never "what color?"

## Materials

${Object.entries(materials.materials).map(([name, mat]) => `
### ${name}
${mat.description}
- Primitives: ${Object.entries(mat.primitives).map(([k,v]) => `${k}: ${v}`).join(', ')}
- Forbidden: ${mat.forbidden.join(', ')}
`).join('\n')}

## Zones

${Object.entries(zones.zones).map(([name, zone]) => `
### ${name}
- Material: ${zone.material}
- Sync: ${zone.sync}
- Paths: ${zone.paths.join(', ')}
`).join('\n')}

## Fidelity Ceiling Constraints

${fidelity.forbidden_techniques.map(t => `- ${t}`).join('\n')}

## Agent Protocol

Before generating UI code:
1. Detect zone from file path
2. Apply material physics
3. Respect fidelity ceiling
4. Follow sync strategy rules
`;
}
```

---

## Skill Architecture (8 Agents)

Each agent is implemented as a Claude Code skill in `.claude/skills/`.

### Skill Directory Structure

```
.claude/skills/{agent-name}/
├── index.yaml          # Metadata (~100 tokens)
└── SKILL.md            # Instructions (~2000 tokens)
```

### Agent Implementations

| # | Agent | Role | Command | Outputs |
|---|-------|------|---------|---------|
| 1 | envisioning-soul | Soul Keeper | `/envision` | essence.yaml, moodboard.md |
| 2 | codifying-materials | Material Smith | `/codify`, `/material` | materials.yaml, kernel/* |
| 3 | mapping-zones | Zone Architect | `/zone` | zones.yaml |
| 4 | crafting-components | Apprentice Smith | `/craft` | Generated code |
| 5 | validating-fidelity | Fidelity Guardian | `/validate` | fidelity-report.yaml |
| 6 | gardening-entropy | Gardener | `/garden` | paper-cuts.yaml |
| 7 | approving-patterns | Taste Owner | `/approve` | approvals.yaml |
| 8 | greenlighting-concepts | Pollster | `/greenlight` | polls.yaml |

### Example Skill: crafting-components

```yaml
# .claude/skills/crafting-components/index.yaml
name: crafting-components
description: Generate UI with context injection
command: craft
reads:
  - sigil-mark/kernel/*
  - sigil-mark/soul/*
```

```markdown
# .claude/skills/crafting-components/SKILL.md

# Sigil Agent: Crafting Components

> "You are an apprentice in {{era}}. You do not know what Ambient Occlusion is."

## Role

**Apprentice Smith** — Generates UI with context injection. Limited by Fidelity Ceiling.

## Command

```
/craft [prompt]
/craft [prompt] --zone [zone]
/craft [prompt] --material [material]
```

## Critical Behavior

**This agent INJECTS context before generation, not after.**

## Context Injection

Before ANY generation, inject this context:

<sigil_context version="11.0">
  <zone name="{{detected_zone}}">
    <material>{{zone.material}}</material>
    <sync_strategy>{{zone.sync}}</sync_strategy>
  </zone>

  <fidelity_ceiling>
    <era>{{fidelity.era}}</era>
    <forbidden_techniques>{{fidelity.forbidden_techniques}}</forbidden_techniques>
  </fidelity_ceiling>

  <instruction>
    You are an apprentice in {{fidelity.era}}.
    If your output looks "better" than the Gold Standard, it is WRONG.
  </instruction>
</sigil_context>

## Workflow

1. Detect zone from file path or prompt keywords
2. Load context (zone, material, tensions, fidelity)
3. Inject context XML
4. Generate component
5. Run constitution check (invariants, fidelity, sync)
6. Handle violations (block errors, warn suggestions)
```

---

## HUD Overlay Design

### Design Principles

1. **Dev-Only**: Zero production footprint
2. **Non-Intrusive**: Toggleable, doesn't block content
3. **React-Native**: Works with React DevTools patterns

### Component Architecture

```tsx
// sigil-hud/src/index.tsx
import { createPortal } from 'react-dom';

export function SigilHUD({
  position = 'bottom-right',
  defaultOpen = false
}: SigilHUDProps) {
  // Only render in development
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  const [isOpen, setIsOpen] = useState(defaultOpen);
  const tensions = useTensions();
  const zone = useZone();
  const fidelity = useFidelity();

  return createPortal(
    <div className={cn(
      "fixed z-[99999] font-mono text-xs",
      positionClasses[position]
    )}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 bg-neutral-900 text-white rounded-full shadow-lg"
        title="Toggle Sigil HUD"
      >
        ⚗️
      </button>

      {isOpen && (
        <HUDPanel
          tensions={tensions}
          zone={zone}
          fidelity={fidelity}
        />
      )}
    </div>,
    document.body
  );
}
```

### Hook: useTensions

```tsx
// sigil-hud/src/hooks/useTensions.ts
import { useState, useEffect, useCallback } from 'react';
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';

interface Tensions {
  playfulness: number;
  weight: number;
  density: number;
  speed: number;
}

export function useTensions() {
  const [tensions, setTensions] = useState<Tensions>({
    playfulness: 50,
    weight: 50,
    density: 50,
    speed: 50
  });

  useEffect(() => {
    // Initial load from YAML
    loadTensions().then(setTensions);
  }, []);

  const updateTension = useCallback((key: keyof Tensions, value: number) => {
    const newTensions = { ...tensions, [key]: value };
    setTensions(newTensions);

    // Update CSS variables immediately (<16ms)
    applyTensionVariables(newTensions);

    // Persist to YAML (debounced)
    debouncedSaveTensions(newTensions);
  }, [tensions]);

  return { tensions, updateTension };
}

function applyTensionVariables(tensions: Tensions) {
  const root = document.documentElement;

  // Playfulness: affects border-radius, bounce
  const radius = mapRange(tensions.playfulness, 0, 100, 4, 16);
  const bounce = mapRange(tensions.playfulness, 0, 100, 1, 1.5);
  root.style.setProperty('--sigil-radius', `${radius}px`);
  root.style.setProperty('--sigil-bounce', `${bounce}`);

  // Weight: affects shadows
  const shadowOpacity = mapRange(tensions.weight, 0, 100, 0.05, 0.2);
  const hoverLift = mapRange(tensions.weight, 0, 100, 1, 4);
  root.style.setProperty('--sigil-shadow-opacity', `${shadowOpacity}`);
  root.style.setProperty('--sigil-hover-lift', `${hoverLift}px`);

  // Density: affects spacing
  const spacing = mapRange(tensions.density, 0, 100, 24, 12);
  root.style.setProperty('--sigil-spacing', `${spacing}px`);

  // Speed: affects transitions
  const duration = mapRange(tensions.speed, 0, 100, 400, 100);
  root.style.setProperty('--sigil-duration', `${duration}ms`);
}

function mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}
```

### Integration with NextJS

```tsx
// app/layout.tsx
import { SigilHUD } from '@sigil/hud';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SigilHUD position="bottom-right" />
      </body>
    </html>
  );
}
```

### CSS Variable Contract

```css
/* Base CSS variables set by Sigil */
:root {
  /* Playfulness */
  --sigil-radius: 8px;
  --sigil-bounce: 1.2;

  /* Weight */
  --sigil-shadow-opacity: 0.1;
  --sigil-hover-lift: 2px;

  /* Density */
  --sigil-spacing: 16px;

  /* Speed */
  --sigil-duration: 200ms;

  /* Material (set by zone) */
  --sigil-material: clay;
}
```

---

## Context Injection System

### How Context Flows

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CONTEXT INJECTION FLOW                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. User runs /craft "create checkout button"                               │
│                              │                                               │
│                              ▼                                               │
│  2. crafting-components skill activates                                      │
│                              │                                               │
│                              ▼                                               │
│  3. Zone Detection                                                           │
│     ├─ Check --zone argument                                                 │
│     ├─ Match file path to zones.yaml patterns                              │
│     └─ Detect from prompt keywords                                          │
│                              │                                               │
│                              ▼                                               │
│  4. Context Loading                                                          │
│     ├─ Load zone config → zones.yaml                                        │
│     ├─ Load material → materials.yaml                                       │
│     ├─ Load physics → kernel/physics.yaml                                   │
│     ├─ Load tensions → tensions.yaml                                        │
│     ├─ Load fidelity → kernel/fidelity-ceiling.yaml                        │
│     └─ Load essence → essence.yaml                                          │
│                              │                                               │
│                              ▼                                               │
│  5. Context Injection                                                        │
│     Compile <sigil_context> XML and prepend to prompt                       │
│                              │                                               │
│                              ▼                                               │
│  6. Generation                                                               │
│     LLM generates with full context awareness                               │
│                              │                                               │
│                              ▼                                               │
│  7. Post-Generation Check                                                    │
│     ├─ Check invariants                                                      │
│     ├─ Check fidelity ceiling                                               │
│     └─ Check sync compliance                                                │
│                              │                                               │
│                              ▼                                               │
│  8. Output (with violations noted if any)                                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Zone Detection Algorithm

```typescript
function detectZone(
  prompt: string,
  filePath?: string,
  explicitZone?: string
): string {
  // 1. Check explicit --zone argument (highest priority)
  if (explicitZone) {
    return explicitZone;
  }

  // 2. Match file path against zone patterns
  if (filePath) {
    const zones = loadZones();
    for (const [zoneName, zone] of Object.entries(zones)) {
      for (const pattern of zone.paths) {
        if (minimatch(filePath, pattern)) {
          return zoneName;
        }
      }
    }
  }

  // 3. Detect from prompt keywords
  const keywordMap: Record<string, string[]> = {
    critical: ['checkout', 'trade', 'claim', 'buy', 'sell', 'transfer'],
    transactional: ['settings', 'admin', 'dashboard', 'manage'],
    exploratory: ['browse', 'search', 'explore', 'discover'],
    marketing: ['landing', 'marketing', 'hero', 'promo']
  };

  const promptLower = prompt.toLowerCase();
  for (const [zone, keywords] of Object.entries(keywordMap)) {
    if (keywords.some(kw => promptLower.includes(kw))) {
      return zone;
    }
  }

  // 4. Default fallback
  return 'default';
}
```

---

## Fidelity Validation Engine

### Validation Pipeline

```typescript
interface ValidationResult {
  file: string;
  violations: Violation[];
  summary: {
    pass: number;
    warn: number;
    error: number;
  };
}

interface Violation {
  line?: number;
  type: ViolationType;
  message: string;
  severity: 'error' | 'warn' | 'suggest';
  suggestion?: string;
}

type ViolationType =
  | 'gradient_complexity'
  | 'shadow_layers'
  | 'animation_duration'
  | 'forbidden_technique'
  | 'material_violation'
  | 'sync_violation'
  | 'invariant_violation';

async function validateFidelity(
  code: string,
  context: SigilContext
): Promise<ValidationResult> {
  const violations: Violation[] = [];

  // 1. Check gradient complexity
  violations.push(...checkGradients(code, context.fidelity));

  // 2. Check shadow layers
  violations.push(...checkShadows(code, context.fidelity));

  // 3. Check animation duration
  violations.push(...checkAnimations(code, context.fidelity));

  // 4. Check forbidden techniques
  violations.push(...checkForbiddenTechniques(code, context.fidelity));

  // 5. Check material compliance
  violations.push(...checkMaterial(code, context.material));

  // 6. Check sync compliance
  violations.push(...checkSync(code, context.sync));

  return {
    file: context.filePath,
    violations,
    summary: {
      pass: violations.length === 0 ? 1 : 0,
      warn: violations.filter(v => v.severity === 'warn').length,
      error: violations.filter(v => v.severity === 'error').length
    }
  };
}
```

### Pattern Matchers

```typescript
const techniquePatterns: Record<string, RegExp> = {
  'Ambient Occlusion': /ambient[._-]?occlusion/i,
  'Mesh Gradients': /mesh[._-]?gradient/i,
  '3D Transforms': /rotate[XYZ]|perspective|transform3d/i,
  'Particle Systems': /particle|confetti|sparkle/i,
  'Motion Blur': /motion[._-]?blur/i,
  'Glassmorphism with grain': /backdrop-filter.*noise|noise.*backdrop/i,
  'Neumorphism': /neumorphism|neomorphism/i,
};

function checkForbiddenTechniques(
  code: string,
  fidelity: FidelityCeiling
): Violation[] {
  const violations: Violation[] = [];

  for (const technique of fidelity.forbidden_techniques) {
    const pattern = techniquePatterns[technique];
    if (pattern && pattern.test(code)) {
      violations.push({
        type: 'forbidden_technique',
        message: `Forbidden technique: ${technique}`,
        severity: 'error',
        suggestion: `Remove ${technique}. The Fidelity Ceiling prohibits this.`
      });
    }
  }

  return violations;
}
```

### Fidelity Report Format

```yaml
# sigil-mark/workbench/fidelity-report.yaml
generated_at: "2026-01-03T10:30:00Z"
files_checked: 47
violations_found: 3

summary:
  pass: 44
  warn: 2
  error: 1

violations:
  - file: "src/components/Button.tsx"
    line: 23
    type: gradient_complexity
    message: "Gradient has 4 stops (max: 2)"
    severity: warn
    suggestion: "Simplify to 2-stop gradient"

  - file: "src/features/checkout/Confirm.tsx"
    line: 45
    type: animation_duration
    message: "Animation 1200ms exceeds max (800ms)"
    severity: warn
    suggestion: "Reduce to 800ms or request marketing zone exception"

  - file: "src/features/trade/TradeButton.tsx"
    line: 12
    type: sync_violation
    message: "Server-tick components must show pending state"
    severity: error
    suggestion: "Add isPending state and disable button while pending"
```

---

## Integration Points

### 1. Claude Code Integration

**CLAUDE.md Auto-Generation:**

The `/setup` command generates a CLAUDE.md file that Claude Code automatically loads.

### 2. Git Integration

Sigil state is git-tracked:

```gitignore
# .gitignore

# Include all sigil-mark files
!sigil-mark/

# Exclude temporary workbench state (optional)
sigil-mark/workbench/fidelity-report.yaml
```

### 3. CI/CD Integration (Future)

Advisory PR comments via GitHub Action:

```yaml
# .github/workflows/sigil.yml
name: Sigil Check
on: [pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: sigil-dev/validate-action@v1
        with:
          mode: comment  # advisory only, never block
```

---

## Development Workflow

### Initial Setup Flow

```
1. Clone repo
2. Run /setup (creates sigil-mark/, .sigilrc.yaml, skills/)
3. Run /envision (interview, creates essence.yaml)
4. Run /codify (define materials, optionally lock kernel)
5. Run /zone (configure path mappings)
6. Start development with /craft
```

### Daily Development Flow

```
1. Open project
2. HUD auto-loads (dev only)
3. Adjust tensions via sliders if needed
4. /craft to generate components
5. /validate to check fidelity
6. /garden to track paper cuts
7. /approve for sign-offs
```

### Git Strategy

```
main
  └── feature/xyz
        ├── sigil-mark/ changes (committed)
        └── src/ changes (committed)
```

All sigil-mark/ changes are committed alongside code changes, providing full history of design decisions.

---

## Technical Risks & Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **AI ignores context** | Medium | High | Robust context injection, validation agent, iteration |
| **YAML parsing errors** | Low | Medium | Zod schema validation, helpful error messages |
| **HUD performance** | Low | Low | React.lazy loading, portal rendering, throttled updates |
| **Kernel lock bypass** | Low | High | Skill-level enforcement, version file integrity check |
| **Large codebase scan** | Medium | Medium | Incremental validation, file-specific checks |
| **Fidelity Ceiling too restrictive** | Medium | Medium | Zone exceptions (marketing), Taste Owner override |

---

## Future Considerations

### v12 Roadmap

1. **Greenlight Polling**: Full community polling with Snapshot/governance integration
2. **Memory Services**: Cross-session learning via Claude memory
3. **Framework Ports**: Vue, Svelte, vanilla adapters
4. **Visual Regression**: Screenshot comparison against gold standard

### Technical Debt

| Item | Priority | Notes |
|------|----------|-------|
| YAML hot-reload | P2 | Currently requires manual reload |
| Tension interpolation | P3 | Smooth transitions between presets |
| Zone inheritance | P3 | Allow zones to extend other zones |

---

*Generated by Architecture Agent*
*Date: 2026-01-03*
*PRD Version: 3.0*
*Sigil v11: Studio OS, Not Sovereign. Poll concepts, dictate pixels.*
