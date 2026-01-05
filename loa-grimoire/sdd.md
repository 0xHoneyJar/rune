# Software Design Document: Sigil v4

**Version:** 1.0
**Status:** Draft
**Date:** 2026-01-04
**Based on:** PRD v1.0

---

## Executive Summary

Sigil v4 is a Design Physics Engine implemented as a Claude Code skill framework. It provides 8 specialized skills that give AI agents physics constraints for consistent design decisions. Sigil coexists with Loa (workflow framework) via a handoff protocol for structural issues.

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         SIGIL v4                                     │
│                   Design Physics Engine                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │
│  │   COMMANDS  │  │   SKILLS    │  │   STATE     │                 │
│  │   (8 total) │  │   (8 total) │  │ sigil-mark/ │                 │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘                 │
│         │                │                │                         │
│         └────────────────┼────────────────┘                         │
│                          │                                          │
│  ┌───────────────────────┴───────────────────────┐                 │
│  │              PHYSICS ENGINE                    │                 │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐         │                 │
│  │  │Temporal │ │ Budget  │ │Fidelity │         │                 │
│  │  │Governor │ │ Engine  │ │ Ceiling │         │                 │
│  │  └─────────┘ └─────────┘ └─────────┘         │                 │
│  └───────────────────────────────────────────────┘                 │
│                          │                                          │
│                          ▼                                          │
│  ┌───────────────────────────────────────────────┐                 │
│  │              LOA HANDOFF                       │                 │
│  │  When issue is structural → generate context   │                 │
│  └───────────────────────────────────────────────┘                 │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 1. System Architecture

### 1.1 Layer Model

```
┌─────────────────────────────────────────────────────────────────────┐
│                         TASTE KEY                                    │
│  Single holder with absolute authority over visual execution.       │
│  Can override: Budgets, Fidelity. Cannot override: Physics.         │
└─────────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────────┐
│                         MEMORY                                       │
│  Era-versioned decisions. Mutations sandbox. Graveyard archive.      │
└─────────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────────┐
│                        RESONANCE                                     │
│  Product tuning: Essence, Materials, Zones, Tensions.                │
└─────────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────────┐
│                          CORE                                        │
│  Immutable physics: Sync, Budgets, Fidelity, Lens.                  │
│  CANNOT be overridden. Violations are IMPOSSIBLE.                    │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.2 Coexistence with Loa

Sigil and Loa are separate frameworks that coexist:

| Aspect | Sigil | Loa |
|--------|-------|-----|
| Domain | Design physics | Development workflow |
| State Zone | `sigil-mark/` | `loa-grimoire/` |
| Config | `.sigilrc.yaml` | `.loa.config.yaml` |
| Skills | 8 design-focused | Workflow-focused |
| Commands | 8 design commands | Workflow commands |

**Handoff Protocol:** When Sigil diagnoses a structural issue (not UI), it generates context for Loa.

---

## 2. Component Design

### 2.1 The 8 Skills

| # | Skill | Command | Purpose |
|---|-------|---------|---------|
| 1 | `envisioning-soul` | `/envision` | Capture product essence via interview |
| 2 | `codifying-materials` | `/codify` | Define material physics (clay/machinery/glass) |
| 3 | `mapping-zones` | `/map` | Define zones and path patterns |
| 4 | `crafting-components` | `/craft` | Generate with Hammer/Chisel toolkit |
| 5 | `validating-fidelity` | `/validate` | Check physics/budget/fidelity violations |
| 6 | `gardening-entropy` | `/garden` | Detect drift, stale decisions, mutations |
| 7 | `approving-patterns` | `/approve` | Taste Key rulings on patterns |
| 8 | `greenlighting-concepts` | `/greenlight` | Concept approval before building |

### 2.2 Skill Structure

Each skill follows Claude Code conventions:

```
.claude/skills/{skill-name}/
├── index.yaml          # Metadata (~100 tokens)
├── SKILL.md            # Instructions (~2000 tokens)
└── tools/              # Sub-tools (optional)
    └── *.md
```

**Example: crafting-components**
```
.claude/skills/crafting-components/
├── index.yaml
├── SKILL.md
└── tools/
    ├── hammer.md       # Diagnose + Route
    └── chisel.md       # Execute aesthetics
```

### 2.3 Command Structure

Each command is a markdown file:

```
.claude/commands/{command}.md
```

**Example: craft.md**
```markdown
# Craft

## Purpose
Generate and refine UI components within physics constraints.

## Agent
Launches `crafting-components` skill.

## Workflow
1. Load physics context from sigil-mark/
2. Select tool (Hammer or Chisel)
3. Generate/refine component
4. Validate against constraints
```

---

## 3. Physics Engine

### 3.1 Temporal Governor

**Implementation:** `sigil-mark/core/sync.yaml`

```yaml
temporal_governor:
  zone_mapping:
    critical:
      tick: discrete
      rate_ms: 600
      authority: server_authoritative

    transactional:
      tick: continuous
      rate_ms: 0
      authority: client_authoritative
```

**Agent Behavior:**
```python
def check_temporal_physics(zone, proposed_ui):
    if zone.authority == "server_authoritative":
        if proposed_ui.uses_optimistic_updates:
            return PhysicsViolation(
                type="IMPOSSIBLE",
                message="Cannot use optimistic UI in server_authoritative zone"
            )
    return Valid()
```

### 3.2 Budget Engine

**Implementation:** `sigil-mark/core/budgets.yaml`

```yaml
budgets:
  cognitive:
    interactive_elements:
      critical: 5
      transactional: 12
      exploratory: 20
      admin: 30
```

**Agent Behavior:**
```python
def check_budget(zone, component):
    budget = load_budget(zone)
    if component.interactive_elements > budget.interactive_elements:
        return BudgetViolation(
            type="BLOCK",
            message=f"Exceeds {zone} budget: {component.interactive_elements}/{budget.interactive_elements}",
            override_available=True  # Taste Key can override
        )
    return Valid()
```

### 3.3 Fidelity Ceiling

**Implementation:** `sigil-mark/core/fidelity.yaml`

```yaml
fidelity:
  ceiling:
    constraints:
      gradients: { max_stops: 2 }
      shadows: { max_layers: 3 }
      animation: { max_duration_ms: 800 }
      blur: { max_radius_px: 16 }
      border_radius: { max_px: 24 }
```

**Agent Behavior:**
```python
def check_fidelity(component):
    ceiling = load_fidelity_ceiling()
    violations = []

    if component.gradient_stops > ceiling.gradients.max_stops:
        violations.append(CeilingViolation("gradients"))
    if component.shadow_layers > ceiling.shadows.max_layers:
        violations.append(CeilingViolation("shadows"))
    # ... etc

    return violations
```

### 3.4 Violation Hierarchy

```python
class ViolationType(Enum):
    PHYSICS = "IMPOSSIBLE"      # Cannot generate
    BUDGET = "BLOCK"            # Taste Key can override
    FIDELITY = "BLOCK"          # Taste Key can override
    DRIFT = "WARN"              # Proceed, flagged
```

---

## 4. Data Architecture

### 4.1 State Zone Structure

```
sigil-mark/
├── core/                       # Immutable physics (version controlled)
│   ├── sync.yaml              # Temporal Governor + Authority
│   ├── budgets.yaml           # Cognitive, Visual, Complexity
│   ├── fidelity.yaml          # Mod Ghost Rule
│   └── lens.yaml              # Rendering layers
│
├── resonance/                  # Product tuning (editable)
│   ├── essence.yaml           # Product soul (from /envision)
│   ├── materials.yaml         # Clay, Machinery, Glass
│   ├── zones.yaml             # Critical, Transactional, Exploratory
│   └── tensions.yaml          # Tuning sliders (0-100)
│
├── memory/                     # Era-versioned history
│   ├── eras/                  # Era definitions
│   │   └── era-{n}.yaml
│   ├── decisions/             # Era-versioned decisions
│   │   └── {decision-id}.yaml
│   ├── mutations/             # Experimental sandbox
│   │   └── active/
│   │       └── {mutation-id}.yaml
│   └── graveyard/             # Failed experiments
│       └── {mutation-id}.yaml
│
├── taste-key/                  # Authority
│   ├── holder.yaml            # Who holds the key
│   └── rulings/               # Taste Key decisions
│       └── {ruling-id}.yaml
│
└── .sigil/                     # Framework (symlinked)
    ├── commands/
    ├── skills/
    └── scripts/
```

### 4.2 YAML Schemas

**Zone Definition:**
```yaml
# resonance/zones.yaml
zones:
  critical:
    description: "High-stakes, irreversible actions"
    physics:
      sync: server_authoritative
      tick: discrete
      material: clay
    rules:
      - "Server confirms before state changes"
      - "No optimistic updates"
    paths:
      - "**/checkout/**"
      - "**/claim/**"
    budgets:
      interactive_elements: 5
      animations: 1
    tension_overrides:
      weight: 80
      speed: 30
```

**Material Definition:**
```yaml
# resonance/materials.yaml
materials:
  clay:
    physics:
      light: diffuse
      weight: heavy
      motion: spring
      feedback: depress
    spring_config:
      stiffness: 120
      damping: 14
    css_implications:
      box_shadow: "0 2px 4px rgba(0,0,0,0.1)"
      transition: "transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)"
```

**Era Definition:**
```yaml
# memory/eras/era-1.yaml
era:
  id: 1
  name: "The Flat Era"
  started: "2024-01-01"
  ended: null
  truths:
    - statement: "Animation is latency"
      evidence: "Bundle size constraints"
  deprecated: []
  transition:
    triggers: |
      This era ends when user base matures,
      device performance allows richer animation,
      industry shifts toward warmth/depth.
```

**Mutation Definition:**
```yaml
# memory/mutations/active/bouncy-claim.yaml
mutation:
  id: "bouncy-claim-button"
  breaks: "deliberate-timing decision"
  status: "dogfooding"
  created: "2026-01-01"
  expires: "2026-01-12"
  success_criteria:
    - metric: "completion_rate"
      threshold: ">= 94%"
    - metric: "trust_score"
      threshold: ">= 4.0"
```

---

## 5. Craft Toolkit Design

### 5.1 Tool Selection Algorithm

```python
def select_tool(user_input: str) -> Tool:
    """Select Hammer or Chisel based on input patterns."""

    # Chisel patterns (explicit, measurable)
    chisel_patterns = [
        r'\d+px',           # "4px", "16px"
        r'\d+ms',           # "200ms", "800ms"
        r'\d+%',            # "50%", "100%"
        'padding', 'margin', 'shadow', 'border',
        'lighter', 'darker', 'bigger', 'smaller',
    ]

    # Hammer patterns (ambiguous, feeling-based)
    hammer_patterns = [
        'feels', 'seems', 'looks',
        'trustworthy', 'heavy', 'light', 'fast', 'slow',
        'how should', 'what if', 'should we',
        "doesn't feel right", "something's off",
    ]

    if any(re.search(p, user_input, re.I) for p in chisel_patterns):
        return Chisel()
    if any(re.search(p, user_input, re.I) for p in hammer_patterns):
        return Hammer()

    # Default to Hammer for ambiguous input
    return Hammer()
```

### 5.2 Hammer Workflow

```
INPUT: Ambiguous symptom
         │
         ▼
┌─────────────────────────────────────┐
│  1. CLARIFYING QUESTION             │
│  "What kind of slow?"               │
│  a) Response time                   │
│  b) Animation speed                 │
│  c) Confirmation delay              │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  2. DIAGNOSTIC QUESTION             │
│  "How long is 'too long'?"          │
│  "Is it consistent?"                │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  3. ROOT CAUSE DETERMINATION        │
│  ├─ Aesthetic → Route to Chisel     │
│  ├─ Structural → Generate Loa handoff│
│  ├─ Taste → Route to /approve       │
│  └─ Physics → Explain constraint    │
└─────────────────────────────────────┘
```

### 5.3 Chisel Workflow

```
INPUT: Clear aesthetic fix
         │
         ▼
┌─────────────────────────────────────┐
│  1. LOAD PHYSICS CONTEXT            │
│  Zone: critical                     │
│  Material: clay                     │
│  Constraints: max 800ms animation   │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  2. CHECK CONSTRAINTS               │
│  ├─ Within limits → Execute         │
│  └─ Exceeds limits → Offer options  │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  3. EXECUTE                         │
│  Quick change, minimal ceremony     │
│  Show before/after                  │
└─────────────────────────────────────┘
```

### 5.4 Loa Handoff Protocol

When Hammer diagnoses a structural issue:

```yaml
# Generated handoff context
handoff:
  from: sigil
  to: loa
  timestamp: "2026-01-04T12:00:00Z"

  problem:
    symptom: "Claim button feels laggy"
    diagnosis: "Envio indexer latency (3-4s)"

  investigation:
    questions_asked:
      - q: "What kind of lag?"
        a: "Takes too long to confirm"
      - q: "How long?"
        a: "3-4 seconds consistently"
      - q: "Where is time spent?"
        a: "Envio indexer"

  constraints:
    zone: "critical"
    sync: "server_authoritative"
    physics_note: "Cannot use optimistic UI in this zone"

  target:
    current: "3-4s confirmation"
    goal: "<500ms confirmation"

  sigil_constraints: |
    Whatever solution Loa implements, Sigil requires:
    - No optimistic UI (server must confirm first)
    - Pending state must be visible
    - If latency cannot be fixed, make wait feel intentional
```

---

## 6. Lens Architecture

### 6.1 Layer Separation

```
┌─────────────────────────────────────────────────────────────────────┐
│                      LENS LAYER                                      │
│  Optional rendering enhancements (user opt-in)                       │
│  - Lighting, shadows, post-processing                               │
│  - Can exceed fidelity ceiling                                       │
│  - Togglable without breaking functionality                         │
└─────────────────────────────────────────────────────────────────────┘
                              │
                        (renders on top of)
                              │
┌─────────────────────────────────────────────────────────────────────┐
│                      CORE LAYER                                      │
│  The "truth" - geometry, colors, logic, state                       │
│  - At fidelity ceiling (never above)                                │
│  - Server-authoritative in critical zones                           │
│  - Must work with lens disabled                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 6.2 Lens Types

```yaml
# core/lens.yaml
lens:
  types:
    vanilla:
      is_default: true
      description: "Gold standard. Core fidelity."
      rendering:
        lighting: baked
        shadows: none

    high_fidelity:
      requires_opt_in: true
      description: "117HD style. Visual enhancement."
      constraint: "Cannot change geometry"
      rendering:
        lighting: dynamic
        shadows: real_time

    utility:
      requires_opt_in: true
      description: "RuneLite style. Overlays, markers."
      constraint: "Additive only"

    accessibility:
      priority: highest
      description: "High contrast, reduced motion."
      rendering:
        contrast: high
        motion: reduced
```

### 6.3 CSS Implementation

```css
/* Core layer (vanilla) */
:root {
  --shadow: none;
  --border-radius: 4px;
  --animation-duration: 300ms;
}

/* Lens: high_fidelity */
:root[data-lens="high_fidelity"] {
  --shadow: 0 4px 12px rgba(0,0,0,0.15);
  --border-radius: 8px;
  --animation-duration: 400ms;
}

/* Lens: accessibility (highest priority) */
:root[data-lens="accessibility"] {
  --shadow: none;
  --animation-duration: 0ms;
  --focus-outline: 3px solid blue;
}
```

---

## 7. Zone Detection

### 7.1 Path Matching Algorithm

```python
def detect_zone(file_path: str) -> Zone:
    """Detect zone from file path using glob patterns."""

    zones = load_yaml("resonance/zones.yaml")

    # Priority order: critical > transactional > exploratory > marketing > default
    for zone_name in ["critical", "transactional", "exploratory", "marketing"]:
        zone = zones.get(zone_name)
        if not zone:
            continue

        for pattern in zone.get("paths", []):
            if fnmatch.fnmatch(file_path, pattern):
                return Zone(
                    name=zone_name,
                    physics=zone["physics"],
                    budgets=zone.get("budgets", {}),
                    tension_overrides=zone.get("tension_overrides", {})
                )

    return zones.get("default", DEFAULT_ZONE)
```

### 7.2 Zone Context Loading

```python
def load_physics_context(file_path: str) -> PhysicsContext:
    """Load complete physics context for a file path."""

    # 1. Detect zone
    zone = detect_zone(file_path)

    # 2. Load zone physics
    sync = load_yaml("core/sync.yaml")
    budgets = load_yaml("core/budgets.yaml")
    fidelity = load_yaml("core/fidelity.yaml")

    # 3. Load material
    materials = load_yaml("resonance/materials.yaml")
    material = materials.get(zone.physics.material)

    # 4. Load tensions (with zone overrides)
    tensions = load_yaml("resonance/tensions.yaml")
    for key, value in zone.tension_overrides.items():
        tensions[key] = value

    return PhysicsContext(
        zone=zone,
        sync=sync,
        material=material,
        budgets=budgets,
        fidelity=fidelity,
        tensions=tensions
    )
```

---

## 8. Memory System

### 8.1 Era Versioning

Decisions are tagged with era context:

```yaml
# memory/decisions/loading-states.yaml
decision:
  id: "loading-states"
  rulings:
    - era: 1
      verdict: "skeleton"
      rationale: "Fast perceived performance"

    - era: 2
      verdict: "text-pending-in-critical"
      rationale: "Skeletons confused users in critical zones"
      context: "User trust more important than perceived speed"
```

### 8.2 Mutation Lifecycle

```
┌─────────────┐
│  PROPOSED   │ ← Breaks existing decision/pattern
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  DOGFOODING │ ← Internal testing
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   EXPIRES   │ ← Success criteria evaluated
└──────┬──────┘
       │
   ┌───┴───┐
   │       │
   ▼       ▼
┌─────┐  ┌─────────┐
│CANON│  │GRAVEYARD│
└─────┘  └─────────┘
  ↓           ↓
Promoted  Training data
to truth  for future
```

### 8.3 Graveyard as Training Data

Failed mutations become training data:

```yaml
# memory/graveyard/bouncy-claim.yaml
mutation:
  id: "bouncy-claim-button"
  status: "failed"
  failure_reason: "Trust score dropped to 3.2 (threshold: 4.0)"
  lessons:
    - "Playful animations reduce trust in critical zones"
    - "Even subtle bounce reads as 'unserious'"
  archived: "2026-01-12"
```

---

## 9. Mount System

### 9.1 Mount Script

```bash
#!/usr/bin/env bash
# mount-sigil.sh - Mount Sigil v4 on a repository

SIGIL_HOME="${SIGIL_HOME:-$HOME/.sigil/sigil}"
SIGIL_SKILLS=(
  "envisioning-soul"
  "codifying-materials"
  "mapping-zones"
  "crafting-components"
  "validating-fidelity"
  "gardening-entropy"
  "approving-patterns"
  "greenlighting-concepts"
)

# Create .claude directories
mkdir -p .claude/skills .claude/commands

# Symlink Sigil skills
for skill in "${SIGIL_SKILLS[@]}"; do
  ln -sf "$SIGIL_HOME/.claude/skills/$skill" ".claude/skills/$skill"
done

# Symlink Sigil commands
for cmd in envision codify map craft validate garden approve greenlight; do
  ln -sf "$SIGIL_HOME/.claude/commands/${cmd}.md" ".claude/commands/${cmd}.md"
done

# Create sigil-mark if not exists
mkdir -p sigil-mark/{core,resonance,memory,taste-key}

echo "Sigil v4 mounted. Run /envision to start."
```

### 9.2 Version Tracking

```json
// .sigil-version.json
{
  "version": "4.0.0",
  "mounted_at": "2026-01-04T12:00:00Z",
  "updated_at": "2026-01-04T12:00:00Z",
  "sigil_home": "/Users/soju/.sigil/sigil",
  "branch": "main"
}
```

---

## 10. Integration Points

### 10.1 Sigil ↔ Loa Boundary

| Scenario | Handler | Handoff |
|----------|---------|---------|
| UI feels slow | Sigil (Hammer) | If structural → Loa |
| Animation timing | Sigil (Chisel) | None |
| API latency | Loa | None |
| Component styling | Sigil (Craft) | None |
| Database query | Loa | None |
| Zone physics question | Sigil | None |

### 10.2 Agent Protocol

Before generating any UI code:

```python
def agent_protocol(file_path: str, user_request: str):
    # 1. Check for Sigil setup
    if not exists("sigil-mark/"):
        return "Run /sigil-setup first"

    # 2. Load physics context
    context = load_physics_context(file_path)

    # 3. Select tool
    tool = select_tool(user_request)

    # 4. If Hammer, diagnose first
    if isinstance(tool, Hammer):
        diagnosis = tool.diagnose(user_request)
        if diagnosis.is_structural:
            return generate_loa_handoff(diagnosis)
        if diagnosis.is_aesthetic:
            tool = Chisel()

    # 5. Check violations before generating
    violations = check_all_violations(context, proposed_output)
    if violations.has_physics_violation:
        return block_with_explanation(violations)
    if violations.has_budget_violation:
        return offer_override_or_alternatives(violations)

    # 6. Generate with physics context header
    return generate_with_context(context, tool, user_request)
```

---

## 11. Output Formats

### 11.1 Physics Context Header

```
🎛️ SIGIL RESONANCE
═══════════════════════════════════════════════════════════════

PHYSICS CONTEXT
Zone: critical
Material: clay (heavy, spring, depress)
Temporal: discrete tick (600ms) — delay is intentional
Sync: server_authoritative (NO optimistic)
Tensions: weight=80, speed=30, playfulness=20

BUDGETS
Cognitive: 3/5 interactive elements ✓
Visual: 1/1 animations ✓

─────────────────────────────────────────────────────────────────

GENERATING...
```

### 11.2 Violation Output

**Physics Violation (IMPOSSIBLE):**
```
❌ PHYSICS VIOLATION — IMPOSSIBLE
═══════════════════════════════════════════════════════════════

VIOLATION: Optimistic UI in server_authoritative zone

This is not a style preference. It is a physics violation.
You cannot exceed the speed of light.
You cannot show state before the server confirms in this zone.

Zone: critical
Sync: server_authoritative
Constraint: "Server confirms before state changes"

─────────────────────────────────────────────────────────────────

The delay IS the trust.
This violation CANNOT be overridden.
```

**Budget Violation (Override Available):**
```
⚠️ BUDGET VIOLATION — COGNITIVE OVERLOAD
═══════════════════════════════════════════════════════════════

Zone: critical
Budget: 5 interactive elements max
Found: 12 interactive elements

"A screen with 50 perfect buttons is still bad design."

─────────────────────────────────────────────────────────────────

OPTIONS:
[Remove elements] [Request Taste Key override]
```

---

## 12. Development Workflow

### 12.1 Sigil Setup Flow

```
/sigil-setup
     │
     ▼
Creates sigil-mark/ structure
     │
     ▼
/envision (interview for product soul)
     │
     ▼
Creates resonance/essence.yaml
     │
     ▼
/codify (define materials)
     │
     ▼
Updates resonance/materials.yaml
     │
     ▼
/map (define zones)
     │
     ▼
Updates resonance/zones.yaml
     │
     ▼
Ready for /craft
```

### 12.2 Build Flow

```
/greenlight (concept approval)
     │
     ▼
/craft (generate component)
     │
     ├─ Hammer (if ambiguous)
     │      │
     │      ▼
     │   Diagnose → Route
     │
     └─ Chisel (if clear)
            │
            ▼
       Execute quickly
            │
            ▼
/validate (check violations)
     │
     ▼
/approve (Taste Key sign-off)
```

### 12.3 Maintain Flow

```
/garden
     │
     ├─ Detect drift
     │
     ├─ Review mutations
     │      │
     │      ├─ Promote to canon
     │      └─ Archive to graveyard
     │
     └─ Flag stale decisions
```

---

## 13. Success Criteria Validation

| Criterion | Implementation |
|-----------|----------------|
| Temporal Governor enforced | `check_temporal_physics()` blocks violations |
| Budgets enforced | `check_budget()` with Taste Key override |
| Hammer investigates | `select_tool()` routes ambiguous to Hammer |
| Chisel executes fast | Direct execution for clear aesthetic input |
| Loa handoffs work | `generate_loa_handoff()` with context |
| Physics block impossible | IMPOSSIBLE violations cannot be overridden |
| 8 commands only | Strict command list in mount script |
| Single Taste Key | `holder.yaml` defines single owner |
| Era-versioned | All decisions tagged with era |

---

## 14. File Manifest

### Commands (8)
```
.claude/commands/
├── envision.md
├── codify.md
├── map.md
├── craft.md
├── validate.md
├── garden.md
├── approve.md
└── greenlight.md
```

### Skills (8)
```
.claude/skills/
├── envisioning-soul/
├── codifying-materials/
├── mapping-zones/
├── crafting-components/
│   └── tools/
│       ├── hammer.md
│       └── chisel.md
├── validating-fidelity/
├── gardening-entropy/
├── approving-patterns/
└── greenlighting-concepts/
```

### State Zone
```
sigil-mark/
├── core/
│   ├── sync.yaml
│   ├── budgets.yaml
│   ├── fidelity.yaml
│   └── lens.yaml
├── resonance/
│   ├── essence.yaml
│   ├── materials.yaml
│   ├── zones.yaml
│   └── tensions.yaml
├── memory/
│   ├── eras/
│   ├── decisions/
│   ├── mutations/active/
│   └── graveyard/
└── taste-key/
    ├── holder.yaml
    └── rulings/
```

---

## Next Step

`/sprint-plan` to break down implementation into sprints
