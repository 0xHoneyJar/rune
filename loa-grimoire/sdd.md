# Software Design Document: Sigil v1.0

**Version:** 1.0
**Status:** Draft
**Date:** 2026-01-04
**Based on:** PRD v1.0

---

## Executive Summary

Sigil v1.0 is a Design Physics Engine implemented as a Claude Code skill framework with a real-time Workbench environment. It provides 8 specialized commands that give AI agents physics constraints for consistent design decisions. The Workbench enables live preview, real-time validation, and visual tension monitoring.

### Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Workbench launch | Standalone script | Simplicity, no Claude Code integration complexity |
| Tensions panel | Simple text (ASCII) | Minimal dependencies, works everywhere |
| Scoring | Pass/Fail only | Reduces complexity, clear actionable output |

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         SIGIL WORKBENCH                              │
│                    tmux with 4 panes                                 │
├─────────────────────────────┬───────────────────────────────────────┤
│      CLAUDE PANEL           │         CHROME VIEW                   │
│  Claude Code CLI            │    Chrome MCP live preview            │
├─────────────────────────────┼───────────────────────────────────────┤
│      TENSIONS PANEL         │         VALIDATION PANEL              │
│  ASCII progress bars        │    Real-time file watcher             │
└─────────────────────────────┴───────────────────────────────────────┘
                                        │
┌───────────────────────────────────────┴───────────────────────────────┐
│                         SIGIL ENGINE                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │   COMMANDS  │  │   SKILLS    │  │   STATE     │  │  VALIDATOR  │  │
│  │   (8 total) │  │   (8 total) │  │ sigil-mark/ │  │   (watcher) │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  │
└───────────────────────────────────────────────────────────────────────┘
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

**Handoff Protocol:** When Sigil diagnoses a structural issue (not UI), it generates context for Loa via `loa-grimoire/context/sigil-handoff.md`.

---

## 2. Workbench Architecture

### 2.1 Overview

The Workbench is a tmux-based environment launched via `sigil-workbench.sh`:

```
┌─────────────────────────────────────────────────────────────────────┐
│  SIGIL WORKBENCH v1.0                                     [session] │
├─────────────────────────────┬───────────────────────────────────────┤
│                             │                                       │
│  $ claude                   │                                       │
│                             │         [Chrome MCP Preview]          │
│  /craft ConfirmButton       │                                       │
│  src/features/checkout/     │    ┌───────────────────────────┐      │
│                             │    │                           │      │
│  🔨 Loading physics...      │    │    [ Claim 1,234 TOKENS ] │      │
│                             │    │                           │      │
│  Zone: critical             │    │    Pending...             │      │
│  Material: clay             │    │                           │      │
│  Sync: server_authoritative │    └───────────────────────────┘      │
│                             │                                       │
├─────────────────────────────┼───────────────────────────────────────┤
│  TENSIONS [critical zone]   │  VALIDATION                           │
│                             │                                       │
│  Weight      ████████░░ 80  │  Physics:   ✓ PASS                    │
│  Speed       ███░░░░░░░ 30  │  Sync:      ✓ server_authoritative    │
│  Playfulness ██░░░░░░░░ 20  │  Budgets:   ✓ 3/5 elements            │
│  Density     █████░░░░░ 50  │  Fidelity:  ✓ within ceiling          │
│                             │  Material:  ✓ clay physics            │
│  [Auto-refresh: ON]         │                                       │
│                             │  Status: READY FOR /approve           │
└─────────────────────────────┴───────────────────────────────────────┘
```

### 2.2 Panel Architecture

#### Claude Panel (Top-Left)

**Purpose:** Claude Code CLI for `/craft` commands

**Implementation:**
```bash
# Pane 0: Claude Code
tmux send-keys -t sigil:0.0 'claude' Enter
```

**Features:**
- Full Claude Code CLI
- All 8 Sigil commands available
- Hammer/Chisel toolkit
- Zone context in output

#### Chrome Panel (Top-Right)

**Purpose:** Live preview via Chrome MCP

**Implementation:**
```bash
# Pane 1: Chrome preview
# Uses existing claude-in-chrome MCP connection
# Hot reload via dev server websocket
```

**Features:**
- Live component preview
- Auto-refresh on file change
- Uses existing Chrome MCP extension
- Falls back to manual refresh if MCP unavailable

#### Tensions Panel (Bottom-Left)

**Purpose:** Display current zone tensions as ASCII progress bars

**Implementation:**
```bash
#!/usr/bin/env bash
# sigil-tensions.sh - Display tensions in terminal

while true; do
  clear
  echo "TENSIONS [$(get_current_zone) zone]"
  echo ""

  # Read tensions from zone or defaults
  tensions=$(yq '.zones.'$(get_current_zone)'.tension_overrides // .zones.default.tensions' sigil-mark/resonance/zones.yaml)

  # Display as ASCII bars
  for tension in weight speed playfulness density; do
    value=$(echo "$tensions" | yq ".$tension // 50")
    bar=$(printf '█%.0s' $(seq 1 $((value / 10))))
    empty=$(printf '░%.0s' $(seq 1 $((10 - value / 10))))
    printf "%-12s %s%s %d\n" "$tension" "$bar" "$empty" "$value"
  done

  echo ""
  echo "[Auto-refresh: ON]"

  # Refresh every 2 seconds
  sleep 2
done
```

**Output Format:**
```
TENSIONS [critical zone]

Weight      ████████░░ 80
Speed       ███░░░░░░░ 30
Playfulness ██░░░░░░░░ 20
Density     █████░░░░░ 50

[Auto-refresh: ON]
```

#### Validation Panel (Bottom-Right)

**Purpose:** Real-time physics validation via file watcher

**Implementation:**
```bash
#!/usr/bin/env bash
# sigil-validate.sh - Real-time validation watcher

# Watch for file changes
fswatch -o src/ components/ app/ | while read; do
  clear
  echo "VALIDATION"
  echo ""

  # Get current file (most recently modified)
  current_file=$(find src components app -name "*.tsx" -mmin -1 2>/dev/null | head -1)

  if [ -z "$current_file" ]; then
    echo "Watching for changes..."
    continue
  fi

  # Detect zone
  zone=$(sigil-detect-zone "$current_file")

  # Run validation
  result=$(sigil-validate "$current_file")

  # Display results
  echo "File: $(basename $current_file)"
  echo "Zone: $zone"
  echo ""

  # Physics check
  if echo "$result" | grep -q "physics:pass"; then
    echo "Physics:   ✓ PASS"
  else
    echo "Physics:   ✗ IMPOSSIBLE VIOLATION"
  fi

  # Sync check
  sync_mode=$(echo "$result" | grep "sync:" | cut -d: -f2)
  echo "Sync:      ✓ $sync_mode"

  # Budget check
  elements=$(echo "$result" | grep "elements:" | cut -d: -f2)
  max=$(echo "$result" | grep "max_elements:" | cut -d: -f2)
  if [ "$elements" -le "$max" ]; then
    echo "Budgets:   ✓ $elements/$max elements"
  else
    echo "Budgets:   ✗ $elements/$max elements (BLOCK)"
  fi

  # Fidelity check
  if echo "$result" | grep -q "fidelity:pass"; then
    echo "Fidelity:  ✓ within ceiling"
  else
    echo "Fidelity:  ⚠ exceeds ceiling (BLOCK)"
  fi

  # Material check
  material=$(echo "$result" | grep "material:" | cut -d: -f2)
  echo "Material:  ✓ $material physics"

  echo ""

  # Overall status
  if echo "$result" | grep -q "status:pass"; then
    echo "Status: READY FOR /approve"
  elif echo "$result" | grep -q "status:block"; then
    echo "Status: BLOCKED - needs Taste Key ruling"
  else
    echo "Status: IMPOSSIBLE - physics violation"
  fi
done
```

### 2.3 Launch Script

```bash
#!/usr/bin/env bash
# sigil-workbench.sh - Launch Sigil Workbench

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(pwd)"

# Check prerequisites
check_prerequisites() {
  command -v tmux >/dev/null 2>&1 || { echo "tmux required"; exit 1; }
  command -v claude >/dev/null 2>&1 || { echo "Claude Code required"; exit 1; }
  command -v fswatch >/dev/null 2>&1 || { echo "fswatch required (brew install fswatch)"; exit 1; }
  [ -f ".sigil-setup-complete" ] || { echo "Run /sigil-setup first"; exit 1; }
}

# Create tmux session
create_session() {
  # Kill existing session if present
  tmux kill-session -t sigil 2>/dev/null || true

  # Create new session with 4 panes
  tmux new-session -d -s sigil -n workbench

  # Split into 4 panes (2x2 grid)
  tmux split-window -h -t sigil:workbench
  tmux split-window -v -t sigil:workbench.0
  tmux split-window -v -t sigil:workbench.1

  # Pane 0 (top-left): Claude Code
  tmux send-keys -t sigil:workbench.0 'claude' Enter

  # Pane 1 (top-right): Chrome placeholder (MCP handles this)
  tmux send-keys -t sigil:workbench.1 'echo "Chrome preview via MCP. Run /craft to see component."' Enter

  # Pane 2 (bottom-left): Tensions display
  tmux send-keys -t sigil:workbench.2 "$SCRIPT_DIR/sigil-tensions.sh" Enter

  # Pane 3 (bottom-right): Validation watcher
  tmux send-keys -t sigil:workbench.3 "$SCRIPT_DIR/sigil-validate.sh" Enter

  # Select Claude pane
  tmux select-pane -t sigil:workbench.0
}

# Main
check_prerequisites
create_session

echo "Sigil Workbench started. Attaching..."
tmux attach-session -t sigil
```

### 2.4 File Watcher (Validation)

**Tool:** `fswatch` (cross-platform)

**Installation:**
```bash
# macOS
brew install fswatch

# Linux
sudo apt-get install fswatch
```

**Watched Paths:**
- `src/`
- `components/`
- `app/`
- Any paths in `.sigilrc.yaml` component_paths

**Debounce:** 500ms to avoid rapid refreshes

---

## 3. Component Design

### 3.1 The 8 Skills

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

### 3.2 Skill Structure

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

### 3.3 Command Structure

Each command is a markdown file:

```
.claude/commands/{command}.md
```

---

## 4. Physics Engine

### 4.1 Temporal Governor

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

**Validation Logic:**
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

### 4.2 Budget Engine

**Implementation:** `sigil-mark/core/budgets.yaml`

```yaml
budgets:
  cognitive:
    interactive_elements:
      critical: 5
      transactional: 8
      exploratory: 20
      marketing: 15
      admin: 25
```

**Validation Logic:**
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

### 4.3 Fidelity Ceiling

**Implementation:** `sigil-mark/core/fidelity.yaml`

```yaml
fidelity:
  ceiling:
    gradients: { max_stops: 2 }
    shadows: { max_layers: 3 }
    animation: { max_duration_ms: 800 }
    blur: { max_radius_px: 16 }
    border_radius: { max_px: 24 }
```

### 4.4 Violation Hierarchy

| Type | Severity | Override | Workbench Display |
|------|----------|----------|-------------------|
| Physics | IMPOSSIBLE | None | ✗ IMPOSSIBLE VIOLATION |
| Budget | BLOCK | Taste Key | ✗ X/Y elements (BLOCK) |
| Fidelity | BLOCK | Taste Key | ⚠ exceeds ceiling (BLOCK) |
| Drift | WARN | None needed | ⚠ drift detected |

---

## 5. Data Architecture

### 5.1 State Zone Structure

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
│   ├── eras/
│   ├── decisions/
│   ├── mutations/active/
│   └── graveyard/
│
└── taste-key/                  # Authority
    ├── holder.yaml
    └── rulings/
```

### 5.2 YAML Schemas

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
    paths:
      - "**/checkout/**"
      - "**/claim/**"
    budgets:
      interactive_elements: 5
      animations: 1
    tension_overrides:
      weight: 80
      speed: 30
      playfulness: 20
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
```

---

## 6. Craft Toolkit Design

### 6.1 Tool Selection Algorithm

```python
def select_tool(user_input: str) -> Tool:
    """Select Hammer or Chisel based on input patterns."""

    # Chisel patterns (explicit, measurable)
    chisel_patterns = [
        r'\d+px',           # "4px", "16px"
        r'\d+ms',           # "200ms", "800ms"
        'padding', 'margin', 'shadow', 'border',
    ]

    # Hammer patterns (ambiguous, feeling-based)
    hammer_patterns = [
        'feels', 'seems', 'looks',
        'trustworthy', 'heavy', 'fast', 'slow',
        "doesn't feel right", "something's off",
    ]

    if any(re.search(p, user_input, re.I) for p in chisel_patterns):
        return Chisel()
    if any(re.search(p, user_input, re.I) for p in hammer_patterns):
        return Hammer()

    # Default to Hammer for ambiguous input
    return Hammer()
```

### 6.2 Hammer Workflow

```
INPUT: Ambiguous symptom
         │
         ▼
┌─────────────────────────────────────┐
│  1. CLARIFYING QUESTION             │
│  "What kind of slow?"               │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  2. ROOT CAUSE DETERMINATION        │
│  ├─ Aesthetic → Route to Chisel     │
│  ├─ Structural → Generate Loa handoff│
│  ├─ Taste → Route to /approve       │
│  └─ Physics → Explain constraint    │
└─────────────────────────────────────┘
```

### 6.3 Loa Handoff Protocol

When Hammer diagnoses a structural issue:

```yaml
# loa-grimoire/context/sigil-handoff.md
---
from: sigil
to: loa
timestamp: "2026-01-04T12:00:00Z"
---

## Problem

**Symptom:** Claim button feels laggy
**Diagnosis:** Envio indexer latency (3-4s)

## Investigation

| Question | Answer |
|----------|--------|
| What kind of lag? | Takes too long to confirm |
| How long? | 3-4 seconds consistently |

## Sigil Constraints

- Zone: critical
- Sync: server_authoritative
- Physics note: Cannot use optimistic UI

## Target

- Current: 3-4s confirmation
- Goal: <500ms confirmation

## Requirements

Whatever solution Loa implements, Sigil requires:
- No optimistic UI (server must confirm first)
- Pending state must be visible
- If latency cannot be fixed, make wait feel intentional
```

---

## 7. Zone Detection

### 7.1 Path Matching Algorithm

```python
def detect_zone(file_path: str) -> Zone:
    """Detect zone from file path using glob patterns."""

    zones = load_yaml("resonance/zones.yaml")

    # Priority order
    for zone_name in ["critical", "transactional", "exploratory", "marketing", "admin"]:
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

### 7.2 Zone CLI Tool

```bash
#!/usr/bin/env bash
# sigil-detect-zone.sh - Detect zone for a file path

FILE_PATH="$1"

# Load zones
ZONES_FILE="sigil-mark/resonance/zones.yaml"

# Check each zone's patterns
for zone in critical transactional exploratory marketing admin; do
  patterns=$(yq ".zones.$zone.paths[]" "$ZONES_FILE" 2>/dev/null)

  for pattern in $patterns; do
    # Convert glob to regex
    regex=$(echo "$pattern" | sed 's/\*\*/.*/' | sed 's/\*/.*/g')

    if echo "$FILE_PATH" | grep -qE "$regex"; then
      echo "$zone"
      exit 0
    fi
  done
done

echo "default"
```

---

## 8. Output Formats

### 8.1 Physics Context Header

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
```

### 8.2 Validation Output (Workbench)

**Pass:**
```
VALIDATION

File: ConfirmButton.tsx
Zone: critical

Physics:   ✓ PASS
Sync:      ✓ server_authoritative
Budgets:   ✓ 3/5 elements
Fidelity:  ✓ within ceiling
Material:  ✓ clay physics

Status: READY FOR /approve
```

**Block:**
```
VALIDATION

File: ConfirmButton.tsx
Zone: critical

Physics:   ✓ PASS
Sync:      ✓ server_authoritative
Budgets:   ✗ 8/5 elements (BLOCK)
Fidelity:  ✓ within ceiling
Material:  ✓ clay physics

Status: BLOCKED - needs Taste Key ruling
```

**Impossible:**
```
VALIDATION

File: ConfirmButton.tsx
Zone: critical

Physics:   ✗ IMPOSSIBLE VIOLATION
           Optimistic UI in server_authoritative zone

Status: IMPOSSIBLE - physics violation
```

---

## 9. Scripts Manifest

### 9.1 Core Scripts

| Script | Purpose | Location |
|--------|---------|----------|
| `mount-sigil.sh` | Initialize Sigil on repo | `.claude/scripts/` |
| `sigil-workbench.sh` | Launch Workbench | `.claude/scripts/` |
| `sigil-tensions.sh` | Display tensions panel | `.claude/scripts/` |
| `sigil-validate.sh` | Real-time validation | `.claude/scripts/` |
| `sigil-detect-zone.sh` | Zone detection CLI | `.claude/scripts/` |

### 9.2 Mount Script

```bash
#!/usr/bin/env bash
# mount-sigil.sh - Mount Sigil v1.0 on a repository

SIGIL_HOME="${SIGIL_HOME:-$HOME/.sigil/sigil}"

# Create directories
mkdir -p .claude/skills .claude/commands .claude/scripts
mkdir -p sigil-mark/{core,resonance,memory/{eras,decisions,mutations/active,graveyard},taste-key/rulings}

# Symlink skills
for skill in envisioning-soul codifying-materials mapping-zones crafting-components \
             validating-fidelity gardening-entropy approving-patterns greenlighting-concepts; do
  ln -sf "$SIGIL_HOME/.claude/skills/$skill" ".claude/skills/$skill"
done

# Symlink commands
for cmd in envision codify map craft validate garden approve greenlight; do
  ln -sf "$SIGIL_HOME/.claude/commands/${cmd}.md" ".claude/commands/${cmd}.md"
done

# Symlink scripts
for script in sigil-workbench.sh sigil-tensions.sh sigil-validate.sh sigil-detect-zone.sh; do
  ln -sf "$SIGIL_HOME/.claude/scripts/$script" ".claude/scripts/$script"
done

# Create version marker
echo "Sigil v1.0 setup completed at $(date -u +%Y-%m-%dT%H:%M:%SZ)" > .sigil-setup-complete

cat << 'EOF'
Sigil v1.0 mounted.

Next steps:
  1. Run /envision to capture product soul
  2. Run /codify to define materials
  3. Run /map to configure zones
  4. Run sigil-workbench.sh to launch Workbench

Or start crafting: /craft
EOF
```

---

## 10. Dependencies

### 10.1 Required

| Dependency | Purpose | Install |
|------------|---------|---------|
| Claude Code | AI agent CLI | `npm i -g @anthropic-ai/claude-code` |
| tmux | Workbench layout | `brew install tmux` |
| yq | YAML parsing | `brew install yq` |

### 10.2 Optional

| Dependency | Purpose | Install |
|------------|---------|---------|
| fswatch | File watching | `brew install fswatch` |
| Chrome MCP | Live preview | Already installed |

### 10.3 Fallbacks

| If Missing | Fallback |
|------------|----------|
| fswatch | Manual `/validate` command |
| Chrome MCP | Manual browser refresh |
| tmux | Run commands individually |

---

## 11. File Manifest

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

### Scripts (5)
```
.claude/scripts/
├── mount-sigil.sh
├── sigil-workbench.sh
├── sigil-tensions.sh
├── sigil-validate.sh
└── sigil-detect-zone.sh
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

## 12. Success Criteria Validation

| Criterion | Implementation |
|-----------|----------------|
| Workbench launches | `sigil-workbench.sh` creates 4-pane tmux |
| Tensions panel works | `sigil-tensions.sh` shows ASCII bars |
| Validation is real-time | `sigil-validate.sh` with fswatch |
| Pass/Fail output | Clear status in validation panel |
| Physics block impossible | IMPOSSIBLE violations cannot override |
| Budget violations block | BLOCK with Taste Key option |
| 8 commands only | Strict command list |
| Clean removal | `rm -rf sigil-mark/` removes all state |

---

## 13. Development Workflow

### 13.1 Setup Flow

```
./mount-sigil.sh
     │
     ▼
/envision (interview for product soul)
     │
     ▼
/codify (define materials)
     │
     ▼
/map (define zones)
     │
     ▼
sigil-workbench.sh (launch Workbench)
```

### 13.2 Build Flow (in Workbench)

```
Claude Panel:
/craft ConfirmButton src/features/checkout/
     │
     ▼
Validation Panel:
Real-time feedback on physics compliance
     │
     ▼
Chrome Panel:
Live preview of component
     │
     ▼
When Status: READY FOR /approve
     │
     ▼
Claude Panel:
/approve ConfirmButton
```

---

## Next Step

`/sprint-plan` to break down implementation into sprints
