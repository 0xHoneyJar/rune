# Product Requirements Document: Sigil v11 — Soul Engine

**Version:** 3.0
**Date:** 2026-01-03
**Author:** PRD Architect Agent (v11 Update)
**Status:** Draft
**Branch:** feature/constitutional-design-framework

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Problem Statement](#problem-statement)
3. [The Three Laws](#the-three-laws)
4. [Goals & Success Metrics](#goals--success-metrics)
5. [User Personas & Use Cases](#user-personas--use-cases)
6. [Functional Requirements](#functional-requirements)
7. [The 8 Agents](#the-8-agents)
8. [Non-Functional Requirements](#non-functional-requirements)
9. [Architecture Overview](#architecture-overview)
10. [The Kernel](#the-kernel)
11. [Command Design](#command-design)
12. [Configuration System](#configuration-system)
13. [Scope & Prioritization](#scope--prioritization)
14. [Success Criteria](#success-criteria)
15. [Risks & Mitigation](#risks--mitigation)
16. [Interview Findings](#interview-findings)
17. [Appendix](#appendix)

---

## Executive Summary

Sigil v11 is the **Soul Engine** — a design craft framework that gives AI agents the physics, constraints, and taste authority needed to generate UI with soul. It is **not** a governance bureaucracy—it is a workshop.

> **Philosophy:** "Studio OS, Not Sovereign."
>
> *"You are an apprentice in 2007. You do not know what Ambient Occlusion is."*

The Soul Engine addresses a fundamental insight: design systems fail because they create **bureaucracy** instead of **craft**. Sigil v11 provides:
- **Immutable Kernel**: Physics primitives that cannot be changed after lock
- **Fidelity Ceiling**: "Better" is often "worse" — block improvements that exceed the Gold Standard
- **8 Specialized Agents**: Each with clear role and command
- **Taste Owner Authority**: Visuals dictated, never polled
- **Challenge Period**: 24hr window with Trust Score governance

**Key Evolution from v0.4:**
- **Kernel Layer**: Immutable physics.yaml, sync.yaml, fidelity-ceiling.yaml
- **Fidelity Ceiling**: The "Mod Ghost Rule" — protects the jank that constitutes soul
- **8 Named Agents**: Soul Keeper, Material Smith, Zone Architect, Apprentice Smith, Fidelity Guardian, Gardener, Taste Owner, Pollster
- **Challenge Period**: Integrity changes auto-deploy but can be challenged
- **Trust Score**: Earned/lost based on deployment accuracy
- **HUD instead of Workbench**: Lightweight overlay instead of standalone app

**Core Principle:** Poll concepts, dictate pixels. Community votes on "should this exist?" — never "what color?"

---

## Problem Statement

### The Problem

Design systems fail because they create **bureaucracy** instead of **workshops**. Traditional approaches assume:

| Wrong (Bureaucracy) | Right (Workshop) |
|---------------------|------------------|
| Poll everything | Poll concepts only |
| Committees decide visuals | Taste Owner dictates visuals |
| Flag "low quality" as bad | Flag "high fidelity" as bad |
| Advisory feedback | Context injection |
| 26 commands | 10 commands |
| "Integrity" bypass loophole | 24hr Challenge Period |

### The Mod Ghost Rule

When Mod Ghost joined Jagex, he created objectively "better" assets:
- Smoother gradients
- Higher polygon counts
- More detailed textures

**The community rejected them because they didn't look like 2007.**

The Fidelity Ceiling protects the "jank" that constitutes the soul. An AI optimizing for "quality" will destroy the soul.

### User Pain Points

- **AI generates "too good" output**: Modern gradients, 3D effects — wrong for the product
- **No physics-based constraints**: Buttons "feel" wrong despite correct colors
- **Design by committee**: Polling pixels destroys craft
- **Sync strategy mismatch**: Optimistic UI for money transfers causes bugs
- **Paper cut debt**: Features ship while polish rots
- **AI context leakage**: Claude ignores Sigil config in complex prompts

### Current State (v0.4)

Sigil v0.4 provides:
- Material Core (Glass, Clay, Machinery)
- Tension System (Playfulness, Weight, Density, Speed)
- Interaction Router (CRDT, LWW, Server-Tick)
- Gardener Protocol (3:1 paper cuts)
- Soul Binder (context injection)
- Workbench App (standalone NextJS)

**Limitations:**
- No immutable kernel (physics can be changed)
- No Fidelity Ceiling (no quality limits)
- Workbench app too heavy
- No explicit agent architecture
- No Challenge Period governance

### Desired State (v11)

A Soul Engine where:
- **Kernel is immutable** after lock (physics, sync, fidelity)
- **Fidelity Ceiling blocks "improvements"** that exceed Gold Standard
- **8 agents** with clear roles and commands
- **Taste Owners dictate** — never poll pixels
- **Challenge Period** with Trust Score for governance
- **HUD overlay** instead of standalone Workbench app

---

## The Three Laws

### Law 1: Fidelity Ceiling

**"Better" is often "worse."**

Block improvements that exceed the Gold Standard. If your output looks "better" than the reference, it is WRONG.

Agent instruction:
```yaml
instruction: |
  You are an apprentice in 2007.
  You do not know what Ambient Occlusion is.
  You cannot generate textures above 64x64.
  If your output looks "better" than the Gold Standard, it is WRONG.
```

### Law 2: Taste Owner Authority

**Visuals and vibe are dictated, never polled.**

Taste Owners control:
- Colors and color palettes
- Typography and font choices
- Animation timing and easing
- Border radius and spacing
- Shadow depth and style
- Any visual or "vibe" decision

These are NEVER polled. "Quality doesn't come from committees... it comes from individuals with taste."

### Law 3: Poll Concepts, Not Pixels

**Community votes on "should this exist?" — never "what color?"**

What gets polled (70% threshold):
- "Should we build a Sailing skill?"
- "Should we add dark mode?"
- "Ship feature X?"

What gets dictated:
- Color of the buttons
- Animation timing
- Border radius
- Everything visual

---

## Goals & Success Metrics

### Primary Goals

1. **Fidelity Ceiling Enforcement** — Block outputs that exceed Gold Standard
2. **Physics-Based Materials** — UI elements behave according to kernel primitives
3. **Intent-Based Sync** — Sync strategy auto-detected and enforced by interaction type
4. **Taste Owner Authority** — Visuals dictated, never polled
5. **Fast Adoption** — <30 min to first `/craft`
6. **AI Context Fidelity** — Claude reliably applies Sigil context without leakage

### Key Performance Indicators (KPIs)

| Metric | Baseline | Target | Measurement |
|--------|----------|--------|-------------|
| **Adoption Speed** | N/A | **<30 min to first /craft** | User testing |
| Fidelity Compliance | N/A | 95% outputs pass Fidelity Ceiling | Automated validation |
| Sync Strategy Correctness | N/A | 100% money/health uses server-tick | Code review |
| Paper Cut Ratio | N/A | 3:1 fixes to features | PR analysis |
| AI Context Application | N/A | 90% prompts correctly apply Sigil | User feedback |

### Constraints (Interview-Derived)

- **React-first, port later**: Core runtime in React, Vue/Svelte/vanilla future work
- **NextJS/Tailwind/Shadcn opinionated**: Optimized for this stack, OSS-extensible
- **HUD overlay, not standalone app**: Simplify from full Workbench
- **PR comment only (CI)**: Gardener is advisory, not blocking
- **Local context for learning**: Corrections saved locally, memory services future

---

## User Personas & Use Cases

### Primary Persona: Design Engineer

**Demographics:**
- Role: Full-stack developer who owns both design and engineering
- Technical Proficiency: High—React, TypeScript, Tailwind daily
- Goals: Ship craft without context-switching between "designer mode" and "engineer mode"

**Behaviors:**
- Uses AI to generate UI with proper physics constraints
- Tunes tensions while coding (via HUD)
- Fixes paper cuts before features
- Expects AI to respect Fidelity Ceiling

**Pain Points:**
- AI generating "too polished" output
- No physics-based constraints
- Context bleeding between materials

---

### Secondary Persona: Taste Owner

**Demographics:**
- Role: Founder or design lead with final authority
- Technical Proficiency: Medium—comfortable with config files
- Goals: Maintain soul without being a bottleneck

**Behaviors:**
- Dictates visual decisions (never polls)
- Approves patterns via `/approve`
- Challenges integrity claims via Challenge Period
- Has Trust Score affecting deployment privileges

**Pain Points:**
- Design-by-committee on execution details
- "Integrity" claims that are actually content changes
- Losing context when decisions need revisiting

---

### Tertiary Persona: Non-Technical Stakeholder

**Demographics:**
- Role: PM, exec, or community manager
- Technical Proficiency: Low—views, doesn't edit
- Goals: Participate in concept polls without breaking things

**Behaviors:**
- Votes on Greenlight polls (concepts only)
- Views but doesn't modify visual decisions
- Provides qualitative feedback

**Pain Points:**
- Being asked about pixel-level decisions
- Not understanding why visuals aren't polled

---

### Use Cases

#### UC-1: Mount Soul Engine on Existing Codebase

**Actor:** Design Engineer
**Preconditions:** Existing NextJS project
**Flow:**
1. Run mounting procedure (CLI or script)
2. System creates `sigil-mark/` with kernel files
3. System creates `.sigilrc.yaml` with detected zone mappings
4. User runs `/envision` to capture soul
5. System generates Claude context (CLAUDE.md update)

**Postconditions:** Project has Soul Engine active with immutable kernel
**Acceptance Criteria:**
- [ ] Kernel files (physics.yaml, sync.yaml, fidelity-ceiling.yaml) created
- [ ] Claude context correctly injected
- [ ] 8 agent skills available

---

#### UC-2: Generate UI with Fidelity Ceiling

**Actor:** Design Engineer
**Preconditions:** Soul Engine mounted, Fidelity Ceiling defined
**Flow:**
1. Run `/craft "Create a checkout button"`
2. Crafting agent receives kernel constraints
3. Agent generates button matching Gold Standard
4. If output exceeds fidelity (too polished), validation warns
5. User approves or requests adjustment

**Postconditions:** Button matches soul, not "better" than reference
**Acceptance Criteria:**
- [ ] Generated output respects Fidelity Ceiling
- [ ] Validation agent flags violations
- [ ] No mesh gradients, 3D transforms, or forbidden techniques

---

#### UC-3: Validate Fidelity Compliance

**Actor:** Design Engineer
**Preconditions:** UI generated, Fidelity Ceiling defined
**Flow:**
1. Run `/validate`
2. Validating agent checks against Gold Standard
3. Agent flags any violations (too many gradient stops, excessive animation)
4. User reviews violations
5. Fix or request exception via Taste Owner

**Postconditions:** Fidelity compliance verified
**Acceptance Criteria:**
- [ ] All constraint violations flagged
- [ ] Forbidden techniques blocked
- [ ] Exception path available for approved cases

---

#### UC-4: Challenge an Integrity Claim

**Actor:** Taste Owner
**Preconditions:** Change deployed claiming "Integrity" status
**Flow:**
1. Change auto-deploys (Integrity claims are fast-tracked)
2. Change appears in Challenge Dashboard
3. Taste Owner reviews and flags as "Content" (not Integrity)
4. Change immediately reverts
5. Deployer loses Trust Score

**Postconditions:** False Integrity claim reverted, Trust Score adjusted
**Acceptance Criteria:**
- [ ] Challenge Period active for 24 hours
- [ ] Taste Owner can flag Content vs Integrity
- [ ] Trust Score decreases on false claims
- [ ] Immediate revert on Content flag

---

## Functional Requirements

### FR-1: Kernel Layer (Immutable)

**Priority:** P0 (Must Have)
**Description:** Immutable physics primitives that define the laws of the UI universe. Cannot be changed after `/codify --lock`.

**Files:**
- `sigil-mark/kernel/physics.yaml` — Light, Weight, Motion, Feedback primitives
- `sigil-mark/kernel/sync.yaml` — CRDT, LWW, Server-Tick definitions
- `sigil-mark/kernel/fidelity-ceiling.yaml` — Gold Standard constraints

**Physics Primitives:**

| Category | Primitives |
|----------|------------|
| **Light** | refract, diffuse, flat, reflect |
| **Weight** | weightless, light, heavy, none |
| **Motion** | instant, linear, ease, spring, step, deliberate |
| **Feedback** | none, highlight, lift, depress, glow, ripple, pulse, xp_drop |
| **Surface** | transparent, translucent, solid, textured |

**Behavior:**
- Kernel is **IMMUTABLE** after `/codify --lock`
- Materials compose kernel primitives (cannot create new physics)
- Lock timestamp and locker recorded

**Acceptance Criteria:**
- [ ] Physics primitives defined with CSS templates
- [ ] Sync strategies defined with UI behavior
- [ ] Fidelity constraints block forbidden techniques
- [ ] Lock mechanism prevents modification

---

### FR-2: Fidelity Ceiling

**Priority:** P0 (Must Have)
**Description:** Block outputs that exceed the Gold Standard. "Better" is often "worse."

**Constraints:**

| Category | Limit | Forbidden |
|----------|-------|-----------|
| **Gradients** | Max 2 stops | Mesh, conic with >3 stops |
| **Shadows** | Max 3 layers | Colored shadows, inset on buttons |
| **Animation** | Max 800ms | 3D transforms, particles, confetti (unless approved) |
| **Typography** | Max 2 font families | Decorative fonts in UI, <12px fonts |
| **Borders** | Max 2px width | Dashed, dotted, gradient borders |
| **Border Radius** | Max 16px | Asymmetric radius |

**Agent Instruction:**
```yaml
instruction: |
  You are an apprentice in {{era}}.
  You do not know what {{forbidden_techniques}} are.
  If your output looks "better" than the Gold Standard, it is WRONG.
```

**Forbidden Techniques:**
- Ambient Occlusion
- Mesh Gradients
- 3D Transforms
- Particle Systems
- Motion Blur
- Morphing Animations
- Glassmorphism with grain
- Claymorphism
- Neumorphism

**Acceptance Criteria:**
- [ ] Agent instruction injected with forbidden techniques
- [ ] Validation detects constraint violations
- [ ] Forbidden patterns blocked, not just warned
- [ ] Marketing zone has relaxed constraints

---

### FR-3: Material Core

**Priority:** P0 (Must Have)
**Description:** Three materials that compose kernel primitives.

**Materials:**

| Material | Primitives | Use For |
|----------|------------|---------|
| **Glass** | light: refract, weight: weightless, motion: ease, feedback: glow | Exploratory, discovery |
| **Clay** | light: diffuse, weight: heavy, motion: spring, feedback: lift/depress | Critical actions, marketing |
| **Machinery** | light: flat, weight: none, motion: instant, feedback: highlight | Command palettes, data tables |

**Behavior:**
- Materials compose kernel primitives (not custom physics)
- Zone-to-material mapping in `.sigilrc.yaml`
- Each material has forbidden patterns
- Custom materials via `/material` register

**Acceptance Criteria:**
- [ ] Three materials with distinct physics compositions
- [ ] Zone-to-material mapping configurable
- [ ] Forbidden patterns enforced per material
- [ ] Custom material registration available

---

### FR-4: Interaction Router

**Priority:** P0 (Must Have)
**Description:** Map sync strategy to interaction intent, not data type.

**Strategies:**

| Strategy | Use Case | UI Behavior |
|----------|----------|-------------|
| **server_tick** | Money, trades, inventory | NEVER optimistic, show pending |
| **crdt** | Documents, chat, comments | Optimistic, show presence |
| **lww** | Preferences, toggles, positions | Instant local, background sync |
| **local_only** | Modals, dropdowns, hover | No sync needed |

**Keyword Classification:**

| Strategy | Keywords |
|----------|----------|
| server_tick | trade, transfer, buy, sell, claim, money, wallet, health, inventory, payment |
| crdt | edit, type, write, comment, message, document, collaborative |
| lww | move, toggle, select, preference, position, setting |

**Behavior:**
- Unknown interactions require explicit declaration (no guessing)
- Server-tick NEVER uses optimistic UI
- Confirmation animation is material-dependent

**Acceptance Criteria:**
- [ ] Common patterns auto-classified by keywords
- [ ] Unknown patterns prompt for explicit declaration
- [ ] Server-tick never uses optimistic UI
- [ ] Confirmation style varies by material

---

### FR-5: Tension System

**Priority:** P0 (Must Have)
**Description:** Real-time adjustable feel parameters.

**Tensions (0-100 each):**

| Tension | Low | High | Affects |
|---------|-----|------|---------|
| **Playfulness** | Serious, professional | Playful, fun | Animation bounce, color saturation |
| **Weight** | Light, airy | Heavy, grounded | Shadow depth, font weight |
| **Density** | Spacious, minimal | Dense, rich | Spacing, information per screen |
| **Speed** | Deliberate, measured | Instant, snappy | Transition duration |

**Behavior:**
- Tensions affect CSS variables in real-time
- Allow weird states for innovation
- Presets for established products (Linear, Airbnb, Nintendo, OSRS)

**Acceptance Criteria:**
- [ ] Four tension sliders with 0-100 range
- [ ] CSS variables update in real-time
- [ ] Weird combinations allowed
- [ ] Presets available

---

### FR-6: Gardener Protocol

**Priority:** P1 (Should Have)
**Description:** Maintain quality through continuous polish. 3:1 paper cuts to features.

**Paper Cut Categories:**
- Spacing drift
- Color drift
- Animation inconsistency
- Component duplication
- Accessibility gaps

**Behavior:**
- Gardener bot posts PR comment with analysis
- Advisory, not blocking
- Design engineers adjudicate cross-boundary paper cuts

**Acceptance Criteria:**
- [ ] Paper cuts detected automatically
- [ ] PR comment shows 3:1 ratio analysis
- [ ] Suggestions link to specific issues
- [ ] No merge blocking

---

### FR-7: Taste Owner Governance

**Priority:** P0 (Must Have)
**Description:** Visual decisions dictated by Taste Owners, never polled.

**Taste Owner Controls:**
- All visual and "vibe" decisions
- Material selection
- Tension presets
- Pattern approvals
- Challenge Period flags

**Challenge Period:**
- Integrity changes auto-deploy
- 24hr challenge window
- Taste Owner can flag as "Content" → immediate revert
- False Integrity claims reduce Trust Score

**Trust Score:**
- Initial: 100
- On false Integrity: -10
- On successful Integrity: +1
- Minimum to deploy: 50

**Acceptance Criteria:**
- [ ] Taste Owners registered with scope
- [ ] Challenge Period active for 24 hours
- [ ] Trust Score system functional
- [ ] Content flag causes immediate revert

---

### FR-8: Greenlight Polling (Concepts Only)

**Priority:** P1 (Should Have)
**Description:** Community polls for concepts, never pixels.

**What Gets Polled:**
- "Should we build feature X?" (70% threshold)
- "Should we ship feature X?" (70% threshold)
- Major direction changes

**What NEVER Gets Polled:**
- Colors, fonts, animation timing
- Border radius, spacing, shadows
- Any visual decision

**Acceptance Criteria:**
- [ ] Poll command available for concepts
- [ ] 70% threshold enforced
- [ ] Visual decisions blocked from polling
- [ ] Poll results recorded

---

### FR-9: HUD Overlay

**Priority:** P0 (Must Have)
**Description:** Lightweight overlay for tension controls and material preview. Replaces standalone Workbench app.

**Features:**
- Tension sliders with immediate effect
- Material selection override
- Fidelity validation status
- Paper cut indicator
- Sandbox mode for stakeholders

**Behavior:**
- Overlay on existing app (not separate app)
- Toggleable via keyboard shortcut
- Changes persist or sandbox (configurable)

**Acceptance Criteria:**
- [ ] HUD overlay toggleable
- [ ] Tension sliders functional
- [ ] Sandbox mode available
- [ ] No separate app required

---

## The 8 Agents

| # | Agent | Role | Command |
|---|-------|------|---------|
| 1 | envisioning-soul | Soul Keeper | `/envision` |
| 2 | codifying-materials | Material Smith | `/codify`, `/material` |
| 3 | mapping-zones | Zone Architect | `/zone` |
| 4 | crafting-components | Apprentice Smith | `/craft` |
| 5 | validating-fidelity | Fidelity Guardian | `/validate` |
| 6 | gardening-entropy | Gardener | `/garden` |
| 7 | approving-patterns | Taste Owner | `/approve` |
| 8 | greenlighting-concepts | Pollster | `/greenlight` |

### Agent Descriptions

**1. envisioning-soul (Soul Keeper)**
Captures product soul through interview. Defines essence, anti-patterns, key moments.

**2. codifying-materials (Material Smith)**
Defines materials by composing kernel primitives. Locks kernel when ready.

**3. mapping-zones (Zone Architect)**
Configures path-based design zones. Maps zones to materials and sync strategies.

**4. crafting-components (Apprentice Smith)**
Generates UI components with context injection. Respects Fidelity Ceiling.

**5. validating-fidelity (Fidelity Guardian)**
Checks generated output against Gold Standard. Blocks violations.

**6. gardening-entropy (Gardener)**
Tracks paper cuts and enforces 3:1 rule. Posts PR analysis.

**7. approving-patterns (Taste Owner)**
Signs off on patterns. Dictates visual decisions.

**8. greenlighting-concepts (Pollster)**
Runs community polls for concepts only. Never polls pixels.

---

## Non-Functional Requirements

### Performance
- Tension slider updates in <16ms (60fps)
- HUD overlay hot reload in <100ms
- Material detection in <100ms
- Fidelity validation in <500ms

### Scalability
- Support projects with 1000+ components
- Tension system works with any component library
- Custom materials via register command

### Security
- No secrets in configuration files
- Sandbox mode prevents accidental changes
- Audit trail for all Taste Owner actions
- Trust Score prevents abuse

### Reliability
- Framework works offline after initial setup
- Graceful degradation if HUD unavailable
- Local context survives Claude session restarts

### Compatibility
- **React-first**: Core runtime in React
- **NextJS/Tailwind/Shadcn opinionated**: Optimized for this stack
- **OSS-extensible**: Community can add Vue/Svelte/vanilla ports
- **Claude-powered**: Built for Claude Code, Cursor

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        SIGIL SOUL ENGINE v11                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│  AGENTS (8)                                                                  │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐               │
│  │envisioning │ │codifying   │ │mapping     │ │crafting    │               │
│  │-soul       │ │-materials  │ │-zones      │ │-components │               │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘               │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐               │
│  │validating  │ │gardening   │ │approving   │ │greenlighting│              │
│  │-fidelity   │ │-entropy    │ │-patterns   │ │-concepts   │               │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘               │
├─────────────────────────────────────────────────────────────────────────────┤
│  SOUL LAYER                                                                  │
│  Materials │ Zones │ Sync Router │ Context Injector │ Tensions              │
├─────────────────────────────────────────────────────────────────────────────┤
│  KERNEL (Immutable)                                                          │
│  Physics Primitives │ Sync Primitives │ Fidelity Ceiling                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  GOVERNANCE                                                                  │
│  Taste Owner (dictates) │ Greenlight (polls concepts) │ Challenge Period    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## The Kernel

The Kernel is the immutable foundation of Sigil. After `/codify --lock`, these files cannot be modified.

### Zone Model

| Zone | Path | Owner | Permission |
|------|------|-------|------------|
| **Kernel** | `sigil-mark/kernel/` | Framework | IMMUTABLE after lock |
| **Soul** | `sigil-mark/soul/` | Project | Read/Write |
| **Workbench** | `sigil-mark/workbench/` | Project | Read/Write |
| **Governance** | `sigil-mark/governance/` | Taste Owner | Dictate only |

### Kernel Files

**physics.yaml** — The laws of physics
```yaml
light:
  refract: { blur: 20, opacity: 0.7 }
  diffuse: { shadow_layers: 3 }
  flat: { background: "#0A0A0A" }

weight:
  weightless: { hover: "translateY(-1px)" }
  heavy: { hover: "translateY(-3px)", shadow_scale: 1.3 }
  none: { }

motion:
  instant: { duration_ms: 0, easing: "step-end" }
  spring: { duration_ms: 300, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)" }
  deliberate: { duration_ms: 800 }

feedback:
  highlight: { background: "rgba(255,255,255,0.05)" }
  lift: { transform: "translateY(-2px)" }
  xp_drop: { animation: "rise 1500ms ease-out" }
```

**sync.yaml** — Sync strategies
```yaml
server_tick:
  keywords: [trade, transfer, buy, sell, money, wallet, health]
  ui_behavior: "pending_state"
  optimistic: false

crdt:
  keywords: [edit, type, write, comment, document]
  ui_behavior: "presence_cursors"
  optimistic: true

lww:
  keywords: [move, toggle, select, preference]
  ui_behavior: "instant"
  optimistic: true
```

**fidelity-ceiling.yaml** — Quality limits
```yaml
constraints:
  gradients:
    max_stops: 2
    forbidden: ["mesh", "conic with >3 stops"]
  shadows:
    max_layers: 3
    forbidden: ["colored shadows"]
  animation:
    max_duration_ms: 800
    forbidden: ["3D transforms", "particles", "confetti"]

forbidden_techniques:
  - "Ambient Occlusion"
  - "Mesh Gradients"
  - "3D Transforms"
  - "Particle Systems"
  - "Neumorphism"
```

---

## Command Design

### The 10 Commands

| Command | Agent | Purpose |
|---------|-------|---------|
| `/setup` | - | Initialize Sigil |
| `/envision` | envisioning-soul | Capture product soul |
| `/codify` | codifying-materials | Define materials, lock kernel |
| `/material` | codifying-materials | Register custom material |
| `/zone` | mapping-zones | Configure zones |
| `/craft` | crafting-components | Generate with injection |
| `/validate` | validating-fidelity | Check Fidelity Ceiling |
| `/garden` | gardening-entropy | Manage paper cuts |
| `/approve` | approving-patterns | Taste Owner sign-off |
| `/greenlight` | greenlighting-concepts | Community polling |

### Progressive Disclosure

```
┌─ Starting a project?
│  └─ /setup → /envision → /codify
│
├─ During development?
│  ├─ /craft → Generate with context injection
│  ├─ /zone → Configure design zones
│  └─ /validate → Check Fidelity Ceiling
│
├─ Quality maintenance?
│  ├─ /garden → See paper cut debt
│  └─ /approve → Sign off on patterns
│
└─ Governance?
   └─ /greenlight → Poll concepts (never pixels)
```

---

## Configuration System

### Directory Structure

```
project/
├── CLAUDE.md                        # Claude context (auto-updated)
├── .sigilrc.yaml                    # Soul Engine configuration
├── .sigil-setup-complete            # Setup marker
│
└── sigil-mark/                      # Soul state
    ├── kernel/                      # IMMUTABLE after lock
    │   ├── physics.yaml            # Light, weight, motion, feedback
    │   ├── sync.yaml               # CRDT, LWW, Server-Tick
    │   └── fidelity-ceiling.yaml   # Gold Standard constraints
    ├── soul/
    │   ├── essence.yaml            # Soul statement, invariants
    │   ├── materials.yaml          # Material compositions
    │   ├── zones.yaml              # Path-based zones
    │   └── tensions.yaml           # Current tension state
    ├── workbench/
    │   ├── paper-cuts.yaml         # Entropy tracking
    │   └── fidelity-report.yaml    # Validation results
    ├── governance/
    │   ├── taste-owners.yaml       # Named authorities
    │   ├── approvals.yaml          # Sign-off records
    │   ├── polls.yaml              # Greenlight polls
    │   └── archaeology.yaml        # Rejection history
    ├── moodboard.md                # References, anti-patterns
    └── gold-standard/              # Reference assets
```

### Configuration Format

**`.sigilrc.yaml`:**
```yaml
version: "11"

# Design zones
zones:
  critical:
    material: "clay"
    sync: "server_tick"
    paths:
      - "src/features/checkout/**"
      - "src/features/claim/**"

  transactional:
    material: "machinery"
    sync: "lww"
    paths:
      - "src/features/dashboard/**"

  exploratory:
    material: "glass"
    sync: "lww"
    paths:
      - "src/features/discovery/**"

  marketing:
    material: "clay"
    sync: "local_only"
    paths:
      - "src/features/landing/**"

# Tension defaults
tensions:
  default:
    playfulness: 50
    weight: 50
    density: 50
    speed: 50

# Gardener settings
gardener:
  paper_cut_threshold: 10
  three_to_one_rule: true
  enforcement: "advisory"

# Governance
governance:
  challenge_period_hours: 24
  polling_threshold: 70
  trust_score_initial: 100
```

---

## Scope & Prioritization

### Sprint 0: Kernel + Skills (First Build)

**Priority:** P0 — This is the first thing to build.

1. **Kernel files** — physics.yaml, sync.yaml, fidelity-ceiling.yaml
2. **8 agent skills** — Each with index.yaml and SKILL.md
3. **Claude context update** — CLAUDE.md with Soul Engine prompt
4. **Mount script** — Bootstrap onto existing repo

### In Scope (v11 MVP)

1. **Kernel Layer** — Immutable physics primitives
2. **Fidelity Ceiling** — Gold Standard constraints
3. **Material Core** — Three materials composing kernel
4. **Interaction Router** — CRDT, LWW, Server-Tick
5. **Tension System** — Four axes with CSS variables
6. **8 Agent Skills** — Full agent architecture
7. **Taste Owner Governance** — Challenge Period + Trust Score
8. **HUD Overlay** — Lightweight alternative to Workbench

### In Scope (v12 Future)

- **Greenlight Polling** — Full community polling system
- **Memory Services** — Cross-session learning
- **Framework Ports** — Vue, Svelte, vanilla

### Explicitly Out of Scope

- **Standalone Workbench app**: Replaced by HUD overlay
- **Figma sync**: Code is source of truth
- **Automated blocking CI**: Advisory only
- **Non-Claude agents**: Built for Claude
- **Mobile native**: Web-first

### Priority Matrix

| Feature | Priority | Effort | Impact |
|---------|----------|--------|--------|
| Kernel Files | P0 | M | Critical |
| 8 Agent Skills | P0 | L | Critical |
| Claude Integration | P0 | S | Critical |
| Fidelity Ceiling | P0 | M | High |
| Material Core | P0 | M | High |
| Tension System | P0 | M | High |
| HUD Overlay | P0 | M | High |
| Taste Owner Governance | P1 | M | Medium |
| Gardener Protocol | P1 | M | Medium |
| Greenlight Polling | P2 | M | Medium |

---

## Success Criteria

### Launch Criteria

- [ ] Kernel files created and lockable
- [ ] 8 agent skills functional
- [ ] Claude context correctly applies Material + Tension + Zone
- [ ] Fidelity Ceiling blocks forbidden techniques
- [ ] HUD overlay functional with tension sliders
- [ ] <30 min to first `/craft`

### Failure Modes to Avoid

1. **AI ignores Fidelity Ceiling** — Context must include constraints
2. **Too complex to adopt** — Progressive disclosure essential
3. **Pixels get polled** — Strict separation of concept vs visual
4. **Kernel not immutable** — Lock mechanism must work

### Post-Launch Success (30 days)

- [ ] 3+ projects using Soul Engine
- [ ] **<30 min time to first /craft** (primary KPI)
- [ ] 95% outputs pass Fidelity Ceiling
- [ ] 3:1 paper cut ratio maintained

---

## Risks & Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| AI ignores Fidelity Ceiling | Medium | High | Robust context injection, validation agent |
| Fidelity Ceiling too restrictive | Medium | Medium | Exceptions for marketing zone |
| Challenge Period slows deployment | Low | Medium | Trust Score fast-tracks experienced deployers |
| Complexity overwhelming adoption | High | High | Progressive disclosure, 10 commands only |
| React-only limits adoption | Medium | Low | OSS-extensible for community ports |

---

## Interview Findings

### v11 Update Decisions (2026-01-03)

1. **Primary KPI**: Adoption speed (<30 min to first /craft)
2. **Stack**: React/NextJS/Tailwind/Shadcn opinionated (same as v0.4)
3. **Workbench**: Simplified to HUD overlay (not standalone app)
4. **Sprint 0**: Kernel files + 8 agent skills

### Retained from v0.4

- Material physics (Glass, Clay, Machinery)
- Tension system (Playfulness, Weight, Density, Speed)
- Interaction Router (CRDT, LWW, Server-Tick)
- Gardener Protocol (3:1 paper cuts)
- React-first, port later

### New in v11

- **Kernel Layer**: Immutable physics.yaml, sync.yaml, fidelity-ceiling.yaml
- **Fidelity Ceiling**: "Mod Ghost Rule" — block outputs exceeding Gold Standard
- **8 Named Agents**: Explicit agent architecture
- **Challenge Period**: 24hr window with Trust Score
- **HUD Overlay**: Replaces standalone Workbench app
- **The Three Laws**: Fidelity Ceiling, Taste Owner Authority, Poll Concepts Not Pixels

---

## Appendix

### A. Material Physics Reference

**Glass:**
```
Light: refract │ Weight: weightless │ Motion: ease │ Feedback: glow
```
Forbidden: Solid backgrounds, hard shadows, spring animations

**Clay:**
```
Light: diffuse │ Weight: heavy │ Motion: spring │ Feedback: lift, depress
```
Forbidden: Flat design, instant transitions, pure gray backgrounds

**Machinery:**
```
Light: flat │ Weight: none │ Motion: instant │ Feedback: highlight
```
Forbidden: Fade-in, bounce, spinners, gradients, shadows

### B. Tension Presets

| Preset | Playfulness | Weight | Density | Speed |
|--------|-------------|--------|---------|-------|
| Linear | 20 | 30 | 70 | 95 |
| Airbnb | 50 | 60 | 40 | 50 |
| Nintendo | 80 | 50 | 30 | 60 |
| OSRS | 30 | 70 | 60 | 40 |

### C. Fidelity Ceiling Constraints

| Category | Max | Forbidden |
|----------|-----|-----------|
| Gradient stops | 2 | Mesh, conic >3 stops |
| Shadow layers | 3 | Colored, inset on buttons |
| Animation duration | 800ms | 3D, particles, confetti |
| Font families | 2 | Decorative in UI |
| Border width | 2px | Dashed, dotted, gradient |
| Border radius | 16px | Asymmetric |

### D. Sync Strategy Keywords

**server_tick (highest priority):**
trade, transfer, buy, sell, attack, claim, money, currency, balance, wallet, health, hp, inventory, item, withdraw, deposit, payment, transaction, combat, competitive

**crdt:**
edit, type, write, comment, message, document, text, draft, note, content, collaborative, shared

**lww:**
move, toggle, select, preference, status, position, state, setting, config, option

**local_only:**
modal, dropdown, hover, tooltip, menu, popup

### E. References

**Product Inspirations:**
- OSRS: Tick-based physics, community governance, Mod Ghost Rule
- Linear: Taste Owners, gardening over roadmaps
- Airbnb: Skeuomorphism as functional navigation, tactile warmth
- Teenage Engineering: Muscle memory, analog friction

**The Green Pixel Incident:**
OSRS players once rioted over a single green pixel. This is why visuals are NEVER polled. Taste Owners absorb the neuroticism so the product can ship.

---

*Generated by PRD Architect Agent*
*v11 Update: 2026-01-03*
*Sigil v11: Studio OS, Not Sovereign. Poll concepts, dictate pixels.*
