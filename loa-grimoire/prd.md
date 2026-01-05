# Product Requirements Document: Sigil v4

**Version:** 1.0
**Status:** Draft
**Date:** 2026-01-04
**Author:** AI-Generated from sigil-v4.zip context

---

## Executive Summary

Sigil v4 is a Design Physics Engine that gives AI agents the constraints they need to make consistent design decisions. Unlike traditional design systems that document patterns, Sigil enforces physics — immutable laws that cannot be violated.

> "Physics, not opinions. Constraints, not debates."

### Evolution

| Version | Metaphor | Problem |
|---------|----------|---------|
| Canon | Philosophy | Debate without resolution |
| Codex | Legal System | Precedent blocks innovation |
| Resonance v3 | Physics Engine | Laws of nature, not laws of man |
| **Platform v4** | **Physics + Economy** | Adds budgets, temporal governor, lens |

---

## 1. Problem Statement

### The Core Problem

AI agents generating UI code make inconsistent design decisions because:

1. **No physics constraints** — Design treated as preference, not law
2. **No temporal awareness** — Agents don't know when delay is intentional
3. **No budget enforcement** — Individual components pass, but composition fails
4. **No fidelity ceiling** — "Better" graphics break product soul
5. **No diagnosis protocol** — Symptoms treated without finding root cause

### The Linear Test (Failure Mode)

```
User: "The claim button feels slow"

FAIL: Immediately add skeleton loader (bandaid)
FAIL: Add optimistic UI without checking zone
FAIL: Change animation timing without investigation

PASS: Ask "What kind of slow?"
PASS: Diagnose root cause (UI vs infra)
PASS: Check zone temporal physics
PASS: Route correctly (Chisel vs Loa)
```

> Sources: ARCHITECTURE.md:439-449, CLAUDE.md:44-51

---

## 2. Goals & Success Metrics

### Primary Goals

1. **Enforce physics, not opinions** — Violations are impossible, not just discouraged
2. **Design latency, not hide it** — Temporal Governor makes delay intentional
3. **Prevent "too much"** — Budgets stop composition failures
4. **Diagnose before solving** — Hammer investigates, Chisel executes

### Success Criteria

| Criterion | Measurement |
|-----------|-------------|
| Temporal Governor enforced | Discrete tick zones wait; continuous zones lie |
| Budgets enforced | Cognitive budget blocks "too many elements" |
| Hammer investigates | Never jumps to solution without diagnosis |
| Chisel executes fast | No investigation for clearly aesthetic input |
| Loa handoffs work | Structural issues generate proper context |
| Physics block impossible | Cannot generate violations |
| 8 commands only | No command creep |
| Single Taste Key | No committee language |
| Era-versioned | Decisions tagged with era |

> Sources: ARCHITECTURE.md:426-436

---

## 3. User & Stakeholder Context

### Primary User: AI Agent

The AI agent (Claude) generating or refining UI code. The agent:
- Loads physics context before generating
- Checks zone physics from file path
- Applies material, tension, and budget constraints
- Routes ambiguous input through Hammer diagnosis
- Executes clear aesthetic input through Chisel

### Secondary User: Developer

The developer receiving physics-constrained output. They:
- Trust that generated code respects product soul
- Understand violations when they occur
- Can request Taste Key overrides when needed

### Authority: Taste Key Holder

Single person with absolute authority over visual execution:
- **Absolute:** Visual execution, animation, color, styling, budget overrides
- **Cannot override:** Core physics, fidelity ceiling, greenlighted concepts

> Sources: holder.yaml:1-88, CLAUDE.md:1-171

---

## 4. Functional Requirements

### 4.1 The 8 Commands

| # | Command | Agent | Purpose |
|---|---------|-------|---------|
| 1 | `/envision` | envisioning-soul | Capture product essence |
| 2 | `/codify` | codifying-materials | Define material physics |
| 3 | `/map` | mapping-zones | Define zones and paths |
| 4 | `/craft` | crafting-components | Generate with Hammer/Chisel |
| 5 | `/validate` | validating-fidelity | Check violations |
| 6 | `/garden` | gardening-entropy | Detect drift, mutations |
| 7 | `/approve` | approving-patterns | Taste Key rulings |
| 8 | `/greenlight` | greenlighting-concepts | Concept approval |

**Workflow:**
```
SETUP:    /envision → /codify → /map
BUILD:    /greenlight → /craft → /validate → /approve
MAINTAIN: /garden
```

> Sources: ARCHITECTURE.md:314-335

### 4.2 Temporal Governor

Time is a design material, not just a technical constraint.

**Modes:**

| Mode | Rate | Feel | UI Behavior |
|------|------|------|-------------|
| Discrete | 600ms | Heavy, rhythmic, ceremonial | UI waits for tick. Delay validates. |
| Continuous | 0ms | Instant, fluid, seamless | Optimistic updates. UI lies. |

**Key Insight:** OSRS 600ms tick isn't latency to hide — it's the rhythm. Linear's "instant" isn't fast — it's a lie (optimistic) that creates flow.

**Authority:**

| Type | Meaning | UI Constraint |
|------|---------|---------------|
| Server-authoritative | Server is truth | NO optimistic updates. Ever. |
| Client-authoritative | Client is truth | Optimistic updates expected. |
| Collaborative | Merged truth (CRDT) | Conflict resolution visible |

> Sources: sync.yaml:1-138

### 4.3 Materials

Materials are physics configurations, not themes.

| Material | Light | Weight | Motion | Feedback | Zone Affinity |
|----------|-------|--------|--------|----------|---------------|
| Clay | Diffuse | Heavy | Spring | Depress | Critical, Celebration |
| Machinery | Flat | None | Instant | Highlight | Transactional, Admin |
| Glass | Refract | Weightless | Ease | Glow | Exploratory, Marketing |

**Selection Guide:**
- Irreversible actions → Clay
- Frequent actions → Machinery
- Exploratory actions → Glass

> Sources: materials.yaml:1-151

### 4.4 Zones

Zones define physics context for file paths.

| Zone | Sync | Tick | Material | Budget | Key Rule |
|------|------|------|----------|--------|----------|
| Critical | Server | Discrete | Clay | 5 elements | No optimistic UI |
| Transactional | Client | Continuous | Machinery | 12 elements | Instant feedback |
| Exploratory | Client | Continuous | Glass | 20 elements | Delight allowed |
| Marketing | Client | Continuous | Glass | 15 elements | Animation for impact |

**Detection:** Path-based matching via glob patterns in zones.yaml

> Sources: zones.yaml:1-188

### 4.5 Budgets

Fidelity ceiling prevents "too good." Budgets prevent "too much."

**Cognitive Budget:**
- Interactive elements: 5 (critical) → 30 (admin)
- Decisions required: 2 (critical) → 10 (exploratory)
- Text density: 50 words (critical) → 300 words (exploratory)

**Visual Budget:**
- Color count: 5 distinct hues max
- Animation count: 1 (critical) → 5 (exploratory)
- Depth layers: 4 max

**Complexity Budget:**
- Props per component: 10 max
- Variants per component: 12 max
- Dependencies per component: 8 max

> Sources: budgets.yaml:1-123

### 4.6 Fidelity Ceiling (Mod Ghost Rule)

Technical superiority is NOT justification for breaking resonance.

**Constraints:**
| Property | Ceiling | Violation |
|----------|---------|-----------|
| Gradients | 2 stops max | CEILING_VIOLATION |
| Shadows | 3 layers max | CEILING_VIOLATION |
| Animation | 800ms max | CEILING_VIOLATION |
| Blur | 16px radius max | CEILING_VIOLATION |
| Border radius | 24px max | CEILING_VIOLATION |

**Agent Rule:** Generate at ceiling, not above. Simpler is often better.

> Sources: fidelity.yaml:1-102

### 4.7 Lens Registry

HD and SD coexist without fighting.

| Lens | Description | Constraint |
|------|-------------|------------|
| Vanilla | Gold standard, core fidelity | Default |
| High-fidelity | 117HD style, enhanced | Cannot change geometry |
| Utility | RuneLite style, overlays | Additive only |
| Accessibility | High contrast, reduced motion | Highest priority |

**Rule:** "NEVER bake lens features into core assets. Core is truth. Lens is experience."

> Sources: lens.yaml:1-156

### 4.8 Craft Toolkit (Hammer/Chisel)

**Hammer (Diagnose + Route):**
- **When:** Ambiguous symptoms, questions about approach
- **Method:** AskUserQuestion loop to find root cause
- **Outcomes:** Route to Chisel (aesthetic), Loa (structural), or /approve (taste)

**Chisel (Execute):**
- **When:** Clear aesthetic fix, explicit values
- **Method:** Quick execution, minimal ceremony
- **Precondition:** Root cause already understood

**Tool Selection:**
```
Contains measurements? ("4px", "200ms") → Chisel
Contains properties? ("padding", "shadow") → Chisel
Contains feel-words? ("trustworthy", "heavy") → Hammer
Questions approach? ("how should we") → Hammer
Ambiguous symptom? ("feels slow") → Hammer
```

> Sources: SKILL.md:1-299, hammer.md:1-117, chisel.md:1-162

### 4.9 Loa Handoff

When issue is structural (not UI), generate handoff context:

```yaml
handoff:
  from: sigil
  to: loa
  problem:
    symptom: "Claim feels slow"
    diagnosis: "Envio indexer (3-4s)"
  constraints:
    zone: critical
    physics: "Cannot use optimistic UI"
  target: "<500ms confirmation"
```

> Sources: ARCHITECTURE.md:362-376

### 4.10 Memory (Era-Versioned)

Decisions are versioned by era. What was true then may be false now.

**Era Structure:**
- Context (industry, product, technology shifts)
- Truths (what's true in this era)
- Deprecated (what was true in previous eras)
- Transition triggers

**Mutations:** Experimental sandbox for breaking precedent
- Survivors → promoted to canon
- Failures → graveyard (training data)

> Sources: era-1.yaml:1-63, ARCHITECTURE.md:240-288

---

## 5. Technical Requirements

### 5.1 Directory Structure

```
sigil-mark/
├── core/
│   ├── sync.yaml           # Temporal Governor + Authority
│   ├── budgets.yaml        # Cognitive, Visual, Complexity
│   ├── fidelity.yaml       # Mod Ghost Rule
│   └── lens.yaml           # Rendering layers
│
├── resonance/
│   ├── essence.yaml        # Product soul
│   ├── materials.yaml      # Clay, Machinery, Glass
│   ├── zones.yaml          # Critical, Transactional, Exploratory
│   └── tensions.yaml       # Tuning sliders
│
├── memory/
│   ├── eras/               # Era definitions
│   ├── decisions/          # Era-versioned decisions
│   ├── mutations/active/   # Current experiments
│   └── graveyard/          # Failed experiments
│
├── taste-key/
│   ├── holder.yaml         # Who holds the key
│   └── rulings/            # Taste Key decisions
│
└── .sigil/
    ├── commands/           # The 8 commands
    ├── skills/             # Agent skills
    └── scripts/            # mount.sh, etc.
```

### 5.2 Violation Hierarchy

| Type | Severity | Override |
|------|----------|----------|
| Physics Violation | IMPOSSIBLE | None. Cannot exceed speed of light. |
| Budget Violation | BLOCK | Taste Key can override with justification |
| Fidelity Violation | BLOCK | Taste Key can override |
| Resonance Drift | WARN | Proceed, flagged for review |

### 5.3 Agent Protocol

Before generating UI code:
1. Detect zone from file path
2. Load zone physics (sync, tick, material)
3. Load budgets and fidelity ceiling
4. Load tensions from zone overrides
5. Check for violations before generating
6. Include physics context in output

> Sources: ARCHITECTURE.md:391-421

---

## 6. Scope & Prioritization

### In Scope (v4)

| Feature | Priority | Status |
|---------|----------|--------|
| Temporal Governor | P0 | New in v4 |
| Budgets (cognitive, visual, complexity) | P0 | New in v4 |
| Lens Registry | P0 | New in v4 |
| Hammer/Chisel toolkit | P0 | New in v4 |
| Loa handoff protocol | P0 | New in v4 |
| Era-versioned memory | P1 | New in v4 |
| 8 commands (setup/build/maintain) | P0 | Refined |
| Materials (clay, machinery, glass) | P0 | From v3 |
| Zones (critical, transactional, exploratory) | P0 | From v3 |

### Out of Scope

- Pure logic/backend work → Use Loa directly
- Infrastructure issues → Hand off to Loa
- Security/auth concerns → Not Sigil's domain
- Content writing → Not Sigil's domain

### MVP Definition

1. Temporal Governor with discrete/continuous modes
2. Budget enforcement with Taste Key override
3. Hammer diagnosis before Chisel execution
4. Loa handoff for structural issues
5. 8 commands only (no creep)

---

## 7. Risks & Dependencies

### Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Over-constraint | Blocks creativity | Taste Key override + mutations |
| Era confusion | Stale truths | Explicit era transitions |
| Loa integration | Handoff failures | Clear protocol, context transfer |
| Command creep | Scope bloat | Strict 8-command limit |

### Dependencies

| Dependency | Type | Notes |
|------------|------|-------|
| Loa Framework | Optional | For structural handoffs |
| Taste Key holder | Required | Must be designated |
| Zone path patterns | Required | Must match project structure |

---

## 8. Key Insights

### From OSRS
- The 600ms tick isn't lag — it's rhythm
- 117HD as Lens, not replacement
- Mod Ghost Rule: "Better" can be worse
- Poll concepts, dictate execution

### From Linear
- "Spinners mean broken architecture"
- Local-first = optimistic lies
- Quality is removing, not adding
- Individuals with taste, not committees

### From Uniswap
- Immutable core, extensible hooks
- Protocol vs Interface separation
- Abstraction as design

### From Airbnb
- Materials as physics
- Era transitions happen
- Skeuomorphism returns

---

## Appendix: Delta from Current v11

### Current State (v11)
- 32 skills (Loa + Sigil merged)
- 35 commands
- Integrated workflow

### v4 Proposal
- 8 skills (Sigil only)
- 8 commands (setup/build/maintain)
- Separated from Loa (handoff protocol)

### New in v4
- Temporal Governor
- Budgets
- Lens Registry
- Hammer/Chisel
- Era-versioned memory

---

## Next Step

`/architect` to create Software Design Document
