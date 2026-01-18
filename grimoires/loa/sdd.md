# Sigil - Software Design Document

```
    ╔═══════════════════════════════════════════════╗
    ║  ✦ SIGIL                                      ║
    ║  Software Design Document                     ║
    ║                                               ║
    ║  Loa Construct Migration Architecture         ║
    ╚═══════════════════════════════════════════════╝
```

**Version**: 2.0.0
**Last Updated**: 2026-01-16
**Status**: Architecture Complete
**Based On**: PRD v2.0.0
**Supersedes**: v10.1 "Usage Reality" SDD

---

## 1. Executive Summary

This SDD defines the architecture for migrating Sigil from an internal framework to a Loa Construct. The key architectural decision is **separation of concerns**:

- **Pack Distribution** (manifest.json): Only Sigil-specific functionality
- **Development Tooling** (repo): Loa commands/skills for maintaining Sigil

This allows Sigil users to get a focused design physics toolkit while Sigil maintainers retain full Loa development capabilities.

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         SIGIL REPOSITORY                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                    PACK DISTRIBUTION                         │    │
│  │                    (manifest.json)                           │    │
│  │                                                              │    │
│  │  Skills (11)          Commands (12)         Rules (18)       │    │
│  │  ├─ crafting-physics  ├─ /craft             ├─ sigil-core   │    │
│  │  ├─ styling-material  ├─ /style             ├─ sigil-physics│    │
│  │  ├─ animating-motion  ├─ /animate           ├─ sigil-detect │    │
│  │  ├─ applying-behavior ├─ /behavior          ├─ ...          │    │
│  │  ├─ validating-physics├─ /ward              └─ react-js     │    │
│  │  ├─ surveying-patterns├─ /garden                             │    │
│  │  ├─ inscribing-taste  ├─ /inscribe                           │    │
│  │  ├─ distilling-comps  ├─ /distill                            │    │
│  │  ├─ mounting-sigil    ├─ /mount                              │    │
│  │  ├─ updating-sigil    ├─ /update                             │    │
│  │  └─ agent-browser     ├─ /setup                              │    │
│  │                       └─ /feedback                           │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                 DEVELOPMENT TOOLING                          │    │
│  │                 (NOT in manifest.json)                       │    │
│  │                                                              │    │
│  │  Loa Skills           Loa Commands          Protocols        │    │
│  │  ├─ auditing-security ├─ /architect         ├─ grounding    │    │
│  │  ├─ designing-arch    ├─ /audit             ├─ session      │    │
│  │  ├─ discovering-req   ├─ /implement         ├─ citations    │    │
│  │  ├─ implementing      ├─ /sprint-plan       └─ ...          │    │
│  │  ├─ planning-sprints  ├─ /plan-and-analyze                   │    │
│  │  ├─ reviewing-code    ├─ /review-sprint                      │    │
│  │  ├─ riding-codebase   ├─ /ride                               │    │
│  │  └─ translating       ├─ /translate                          │    │
│  │                       └─ ...                                 │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.2 Component Interaction

```
┌─────────────────────────────────────────────────────────────────────┐
│                        USER WORKFLOW                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   User Request                                                       │
│       │                                                              │
│       ▼                                                              │
│   ┌───────────┐    ┌──────────────┐    ┌─────────────────┐          │
│   │  Command  │───▶│    Skill     │───▶│  Physics Rules  │          │
│   │  /craft   │    │  crafting-   │    │  00-sigil-core  │          │
│   └───────────┘    │  physics     │    │  01-sigil-phys  │          │
│                    └──────────────┘    │  02-sigil-det   │          │
│                           │            └─────────────────┘          │
│                           │                     │                    │
│                           ▼                     │                    │
│                    ┌──────────────┐             │                    │
│                    │   Context    │◀────────────┘                    │
│                    │  taste.md    │                                  │
│                    │  constitution│                                  │
│                    └──────────────┘                                  │
│                           │                                          │
│                           ▼                                          │
│                    ┌──────────────┐                                  │
│                    │   Output     │                                  │
│                    │  Component   │                                  │
│                    │  with Physics│                                  │
│                    └──────────────┘                                  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. Pack Structure

### 3.1 Directory Layout

```
sigil/
├── manifest.json                    # Pack metadata (Sigil-specific only)
├── README.md                        # Pack documentation
├── LICENSE.md                       # MIT License
├── CLAUDE.md                        # Development documentation
│
├── .claude/
│   ├── commands/                    # All commands (Loa + Sigil)
│   │   ├── craft.md                # ✓ In manifest
│   │   ├── style.md                # ✓ In manifest
│   │   ├── animate.md              # ✓ In manifest
│   │   ├── behavior.md             # ✓ In manifest
│   │   ├── ward.md                 # ✓ In manifest
│   │   ├── garden.md               # ✓ In manifest
│   │   ├── inscribe.md             # ✓ In manifest
│   │   ├── distill.md              # ✓ In manifest
│   │   ├── mount.md                # ✓ In manifest
│   │   ├── update.md               # ✓ In manifest
│   │   ├── setup.md                # ✓ In manifest
│   │   ├── feedback.md             # ✓ In manifest
│   │   │
│   │   │── architect.md            # ✗ Dev tooling (not in manifest)
│   │   │── audit.md                # ✗ Dev tooling
│   │   │── audit-deployment.md     # ✗ Dev tooling
│   │   │── audit-sprint.md         # ✗ Dev tooling
│   │   │── implement.md            # ✗ Dev tooling
│   │   │── plan-and-analyze.md     # ✗ Dev tooling
│   │   │── review-sprint.md        # ✗ Dev tooling
│   │   │── ride.md                 # ✗ Dev tooling
│   │   │── sprint-plan.md          # ✗ Dev tooling
│   │   │── translate.md            # ✗ Dev tooling
│   │   └── ...                     # ✗ Other Loa commands
│   │
│   ├── skills/
│   │   ├── crafting-physics/       # ✓ In manifest (NEW)
│   │   │   ├── index.yaml
│   │   │   ├── SKILL.md
│   │   │   └── resources/
│   │   ├── styling-material/       # ✓ In manifest (NEW)
│   │   ├── animating-motion/       # ✓ In manifest (NEW)
│   │   ├── applying-behavior/      # ✓ In manifest (NEW)
│   │   ├── validating-physics/     # ✓ In manifest (NEW)
│   │   ├── surveying-patterns/     # ✓ In manifest (NEW)
│   │   ├── inscribing-taste/       # ✓ In manifest (NEW)
│   │   ├── distilling-components/  # ✓ In manifest (NEW)
│   │   ├── mounting-sigil/         # ✓ In manifest (rename)
│   │   ├── updating-sigil/         # ✓ In manifest (rename)
│   │   │
│   │   ├── auditing-security/      # ✗ Dev tooling (keep, not in manifest)
│   │   ├── designing-architecture/ # ✗ Dev tooling
│   │   ├── discovering-requirements/# ✗ Dev tooling
│   │   ├── implementing-tasks/     # ✗ Dev tooling
│   │   ├── planning-sprints/       # ✗ Dev tooling
│   │   ├── reviewing-code/         # ✗ Dev tooling
│   │   ├── riding-codebase/        # ✗ Dev tooling
│   │   ├── translating-for-execs/  # ✗ Dev tooling
│   │   └── agent-browser/          # ✓ In manifest (visual validation)
│   │
│   ├── rules/                       # All rules (all in manifest)
│   │   ├── 00-sigil-core.md        # ✓ In manifest
│   │   ├── 01-sigil-physics.md     # ✓ In manifest
│   │   ├── 02-sigil-detection.md   # ✓ In manifest
│   │   ├── 03-sigil-patterns.md    # ✓ In manifest
│   │   ├── 04-sigil-protected.md   # ✓ In manifest
│   │   ├── 05-sigil-animation.md   # ✓ In manifest
│   │   ├── 06-sigil-taste.md       # ✓ In manifest
│   │   ├── 07-sigil-material.md    # ✓ In manifest
│   │   ├── 08-sigil-lexicon.md     # ✓ In manifest
│   │   ├── 10-react-core.md        # ✓ In manifest
│   │   ├── 11-react-async.md       # ✓ In manifest
│   │   ├── 12-react-bundle.md      # ✓ In manifest
│   │   ├── 13-react-rendering.md   # ✓ In manifest
│   │   ├── 14-react-rerender.md    # ✓ In manifest
│   │   ├── 15-react-server.md      # ✓ In manifest
│   │   ├── 16-react-js.md          # ✓ In manifest
│   │   └── 17-semantic-search.md   # ✓ In manifest
│   │
│   └── protocols/                   # Keep all (not in manifest)
│
└── grimoires/
    └── sigil/
        ├── taste.md                 # User state (created on install)
        ├── constitution.yaml        # Physics config
        └── context/                 # User context
```

### 3.2 What Goes In manifest.json

**Principle**: Only Sigil-specific functionality that users installing the pack need.

| Category | Included | Count |
|----------|----------|-------|
| **Skills** | crafting-physics, styling-material, animating-motion, applying-behavior, validating-physics, surveying-patterns, inscribing-taste, distilling-components, mounting-sigil, updating-sigil, agent-browser | 11 |
| **Commands** | /craft, /style, /animate, /behavior, /ward, /garden, /inscribe, /distill, /mount, /update, /setup, /feedback | 12 |
| **Rules** | All 00-17 Sigil rules | 18 |

**Excluded from manifest.json** (dev tooling):
- Loa skills: auditing-security, designing-architecture, etc.
- Loa commands: /architect, /audit, /implement, /sprint-plan, etc.
- Protocols: These are internal agent behavior, not user-facing

---

## 4. Skill Architecture

### 4.1 Skill 3-Level Structure

Each Sigil skill follows the Loa Constructs 3-level architecture:

```
skill-name/
├── index.yaml      # Level 1: Metadata (~100 tokens)
├── SKILL.md        # Level 2: Instructions (~2000 tokens)
└── resources/      # Level 3: Templates, references (on-demand)
    ├── templates/
    └── references/
```

### 4.2 Core Skill Definitions

#### 4.2.1 crafting-physics (Primary Skill)

**Purpose**: Generate components with full 3-layer physics

```yaml
# .claude/skills/crafting-physics/index.yaml
name: "crafting-physics"
version: "1.0.0"
model: "sonnet"
color: "purple"

description: |
  Apply design physics to any UX-affecting change. Three layers:
  Behavioral + Animation + Material = Feel. Use for new components,
  refinements, configurations, data patterns, and polish passes.

triggers:
  - "/craft"
  - "create component"
  - "build a button"
  - "generate UI"

inputs:
  - name: description
    type: string
    required: true
    description: "What to craft"
  - name: url
    type: string
    required: false
    description: "URL for visual verification"

outputs:
  - path: "src/components/*.tsx"
    description: "Generated component"
  - path: "grimoires/sigil/taste.md"
    description: "Updated taste signals"

context_files:
  - path: ".claude/rules/00-sigil-core.md"
    required: true
  - path: ".claude/rules/01-sigil-physics.md"
    required: true
  - path: ".claude/rules/02-sigil-detection.md"
    required: true
  - path: ".claude/rules/03-sigil-patterns.md"
    required: true
  - path: ".claude/rules/04-sigil-protected.md"
    required: true
  - path: ".claude/rules/05-sigil-animation.md"
    required: true
  - path: ".claude/rules/06-sigil-taste.md"
    required: true
  - path: ".claude/rules/07-sigil-material.md"
    required: true
  - path: ".claude/rules/08-sigil-lexicon.md"
    required: true
  - path: "grimoires/sigil/taste.md"
    required: false
  - path: "grimoires/sigil/constitution.yaml"
    required: false

protocols:
  required:
    - name: "grounding-enforcement"
      path: ".claude/protocols/grounding-enforcement.md"
```

#### 4.2.2 styling-material

**Purpose**: Material physics only (surface, shadow, typography)

```yaml
name: "styling-material"
version: "1.0.0"
model: "sonnet"

description: |
  Apply material physics only. Use when looks are wrong but behavior
  is fine. For full physics (behavioral + animation + material), use /craft.

triggers:
  - "/style"
  - "fix the styling"
  - "change the look"

context_files:
  - path: ".claude/rules/07-sigil-material.md"
    required: true
  - path: ".claude/rules/08-sigil-lexicon.md"
    required: true
```

#### 4.2.3 animating-motion

**Purpose**: Animation physics only (timing, easing, springs)

```yaml
name: "animating-motion"
version: "1.0.0"
model: "sonnet"

description: |
  Apply animation physics only. Use when movement feels off but behavior
  and looks are fine. For full physics, use /craft.

triggers:
  - "/animate"
  - "fix the animation"
  - "movement feels off"

context_files:
  - path: ".claude/rules/05-sigil-animation.md"
    required: true
```

#### 4.2.4 applying-behavior

**Purpose**: Behavioral physics only (sync, confirmation, timing)

```yaml
name: "applying-behavior"
version: "1.0.0"
model: "sonnet"

description: |
  Apply behavioral physics only. Use when timing/sync is wrong but
  looks and animation are fine. For full physics, use /craft.

triggers:
  - "/behavior"
  - "fix the timing"
  - "sync is wrong"

context_files:
  - path: ".claude/rules/01-sigil-physics.md"
    required: true
  - path: ".claude/rules/02-sigil-detection.md"
    required: true
```

#### 4.2.5 validating-physics

**Purpose**: Ward against physics violations

```yaml
name: "validating-physics"
version: "1.0.0"
model: "sonnet"

description: |
  Protective barrier check against Sigil design physics. Reveals
  violations before they harm users. Checks physics compliance,
  performance patterns, protected capabilities, material constraints.

triggers:
  - "/ward"
  - "check for physics violations"
  - "validate the design"

context_files:
  - path: ".claude/rules/00-sigil-core.md"
    required: true
  - path: ".claude/rules/04-sigil-protected.md"
    required: true
```

#### 4.2.6 surveying-patterns

**Purpose**: Garden authority across codebase

```yaml
name: "surveying-patterns"
version: "1.0.0"
model: "sonnet"

description: |
  Health report on pattern authority and component usage. Shows which
  components are canonical (Gold), established (Silver), or experimental
  (Draft).

triggers:
  - "/garden"
  - "show pattern authority"
  - "which components are canonical"
```

#### 4.2.7 inscribing-taste

**Purpose**: Record learnings into Sigil rules

```yaml
name: "inscribing-taste"
version: "1.0.0"
model: "sonnet"

description: |
  Inscribe learnings from taste.md into Sigil's rules. Closes the
  feedback loop — learnings become permanent marks.

triggers:
  - "/inscribe"
  - "save these preferences"
  - "make this permanent"

outputs:
  - path: ".claude/rules/*.md"
    description: "Updated rules with learned preferences"
```

#### 4.2.8 distilling-components

**Purpose**: Bridge architecture to physics

```yaml
name: "distilling-components"
version: "1.0.0"
model: "sonnet"

description: |
  Distill a task into craft-able components. Bridge between
  architecture (Loa) and physics (Sigil).

triggers:
  - "/distill"
  - "break this down into components"
```

---

## 5. Command Routing

### 5.1 Command → Skill Mapping

| Command | Skill | Physics Layer |
|---------|-------|---------------|
| `/craft` | crafting-physics | All three |
| `/style` | styling-material | Material |
| `/animate` | animating-motion | Animation |
| `/behavior` | applying-behavior | Behavioral |
| `/ward` | validating-physics | Validation |
| `/garden` | surveying-patterns | Meta |
| `/inscribe` | inscribing-taste | Taste |
| `/distill` | distilling-components | Bridge |
| `/mount` | mounting-sigil | Setup |
| `/update` | updating-sigil | Maintenance |
| `/setup` | setup-sigil | Onboarding |
| `/feedback` | feedback-sigil | Feedback |

### 5.2 Command Frontmatter Format

Each command needs YAML frontmatter for routing:

```yaml
---
agent: "crafting-physics"
agent_path: ".claude/skills/crafting-physics"
description: "Generate component with full design physics"

context_files:
  - path: "grimoires/sigil/taste.md"
    optional: true
    description: "User taste preferences"
  - path: "grimoires/sigil/constitution.yaml"
    optional: false
    description: "Physics rules"

outputs:
  - path: "grimoires/sigil/taste.md"
    description: "Updated taste signals"

mode:
  default: foreground
  background: false
---
```

---

## 6. manifest.json Specification

```json
{
  "$schema": "https://constructs.network/schemas/pack-manifest.json",
  "name": "sigil",
  "version": "2.0.0",
  "description": "Design physics framework for AI-generated UI components. Three-layer physics: Behavioral + Animation + Material = Feel.",
  "longDescription": "Sigil teaches Claude how to generate UI components with correct design physics. It detects effect from keywords and types, applies timing/sync/confirmation based on physics rules, and accumulates user taste preferences without configuration.",
  "author": {
    "name": "THJ Team",
    "url": "https://thehoneyjar.xyz"
  },
  "repository": "https://github.com/0xHoneyJar/sigil",
  "homepage": "https://sigil.design",
  "license": "MIT",
  "tier": "free",
  "keywords": [
    "design-system",
    "ui-components",
    "physics",
    "animation",
    "react",
    "frontend",
    "ux",
    "accessibility",
    "framer-motion"
  ],
  "skills": [
    {
      "name": "crafting-physics",
      "path": ".claude/skills/crafting-physics",
      "description": "Generate components with full 3-layer design physics"
    },
    {
      "name": "styling-material",
      "path": ".claude/skills/styling-material",
      "description": "Apply material physics only (surface, shadow, typography)"
    },
    {
      "name": "animating-motion",
      "path": ".claude/skills/animating-motion",
      "description": "Apply animation physics only (timing, easing, springs)"
    },
    {
      "name": "applying-behavior",
      "path": ".claude/skills/applying-behavior",
      "description": "Apply behavioral physics only (sync, confirmation, timing)"
    },
    {
      "name": "validating-physics",
      "path": ".claude/skills/validating-physics",
      "description": "Ward against physics violations"
    },
    {
      "name": "surveying-patterns",
      "path": ".claude/skills/surveying-patterns",
      "description": "Survey pattern authority across codebase"
    },
    {
      "name": "inscribing-taste",
      "path": ".claude/skills/inscribing-taste",
      "description": "Inscribe learnings into permanent rules"
    },
    {
      "name": "distilling-components",
      "path": ".claude/skills/distilling-components",
      "description": "Bridge architecture to physics-ready components"
    },
    {
      "name": "mounting-sigil",
      "path": ".claude/skills/mounting-sigil",
      "description": "Mount Sigil onto existing repositories"
    },
    {
      "name": "updating-sigil",
      "path": ".claude/skills/updating-sigil",
      "description": "Update Sigil from upstream"
    },
    {
      "name": "agent-browser",
      "path": ".claude/skills/agent-browser",
      "description": "Visual validation of generated components"
    }
  ],
  "commands": [
    {
      "name": "/craft",
      "path": ".claude/commands/craft.md",
      "description": "Generate component with full design physics"
    },
    {
      "name": "/style",
      "path": ".claude/commands/style.md",
      "description": "Apply material physics only"
    },
    {
      "name": "/animate",
      "path": ".claude/commands/animate.md",
      "description": "Apply animation physics only"
    },
    {
      "name": "/behavior",
      "path": ".claude/commands/behavior.md",
      "description": "Apply behavioral physics only"
    },
    {
      "name": "/ward",
      "path": ".claude/commands/ward.md",
      "description": "Check for physics violations"
    },
    {
      "name": "/garden",
      "path": ".claude/commands/garden.md",
      "description": "Survey pattern authority"
    },
    {
      "name": "/inscribe",
      "path": ".claude/commands/inscribe.md",
      "description": "Inscribe taste learnings permanently"
    },
    {
      "name": "/distill",
      "path": ".claude/commands/distill.md",
      "description": "Distill tasks into craft-able components"
    },
    {
      "name": "/mount",
      "path": ".claude/commands/mount.md",
      "description": "Mount Sigil onto a repository"
    },
    {
      "name": "/update",
      "path": ".claude/commands/update.md",
      "description": "Update Sigil from upstream"
    },
    {
      "name": "/setup",
      "path": ".claude/commands/setup.md",
      "description": "First-time Sigil setup"
    },
    {
      "name": "/feedback",
      "path": ".claude/commands/feedback.md",
      "description": "Submit feedback about Sigil"
    }
  ],
  "rules": [
    {
      "name": "sigil-core",
      "path": ".claude/rules/00-sigil-core.md",
      "description": "Core physics principles and action defaults"
    },
    {
      "name": "sigil-physics",
      "path": ".claude/rules/01-sigil-physics.md",
      "description": "Behavioral physics - sync, timing, confirmation"
    },
    {
      "name": "sigil-detection",
      "path": ".claude/rules/02-sigil-detection.md",
      "description": "Effect detection from keywords and types"
    },
    {
      "name": "sigil-patterns",
      "path": ".claude/rules/03-sigil-patterns.md",
      "description": "Golden pattern implementations"
    },
    {
      "name": "sigil-protected",
      "path": ".claude/rules/04-sigil-protected.md",
      "description": "Non-negotiable protected capabilities"
    },
    {
      "name": "sigil-animation",
      "path": ".claude/rules/05-sigil-animation.md",
      "description": "Animation physics - easing, springs, frequency"
    },
    {
      "name": "sigil-taste",
      "path": ".claude/rules/06-sigil-taste.md",
      "description": "Taste accumulation system"
    },
    {
      "name": "sigil-material",
      "path": ".claude/rules/07-sigil-material.md",
      "description": "Material physics - surface, fidelity, grit"
    },
    {
      "name": "sigil-lexicon",
      "path": ".claude/rules/08-sigil-lexicon.md",
      "description": "Keyword and adjective lookup tables"
    },
    {
      "name": "react-core",
      "path": ".claude/rules/10-react-core.md",
      "description": "React implementation patterns"
    },
    {
      "name": "react-async",
      "path": ".claude/rules/11-react-async.md",
      "description": "Async patterns and waterfalls"
    },
    {
      "name": "react-bundle",
      "path": ".claude/rules/12-react-bundle.md",
      "description": "Bundle optimization"
    },
    {
      "name": "react-rendering",
      "path": ".claude/rules/13-react-rendering.md",
      "description": "Rendering optimization"
    },
    {
      "name": "react-rerender",
      "path": ".claude/rules/14-react-rerender.md",
      "description": "Re-render prevention"
    },
    {
      "name": "react-server",
      "path": ".claude/rules/15-react-server.md",
      "description": "Server-side patterns"
    },
    {
      "name": "react-js",
      "path": ".claude/rules/16-react-js.md",
      "description": "JavaScript micro-optimizations"
    },
    {
      "name": "semantic-search",
      "path": ".claude/rules/17-semantic-search.md",
      "description": "Semantic code search integration"
    }
  ],
  "minLoaVersion": "1.0.0"
}
```

---

## 7. Implementation Plan

### 7.1 Phase 1: Pack Foundation (Day 1)

| Task | File | Action |
|------|------|--------|
| Create manifest.json | `manifest.json` | NEW |
| Validate against schema | - | TEST |
| Update README for pack | `README.md` | UPDATE |

### 7.2 Phase 2: Skill Creation (Days 2-3)

| Task | From | To | Action |
|------|------|-----|--------|
| Create crafting-physics | craft.md logic | skills/crafting-physics/ | NEW |
| Create styling-material | style.md logic | skills/styling-material/ | NEW |
| Create animating-motion | animate.md logic | skills/animating-motion/ | NEW |
| Create applying-behavior | behavior.md logic | skills/applying-behavior/ | NEW |
| Create validating-physics | ward.md logic | skills/validating-physics/ | NEW |
| Create surveying-patterns | garden.md logic | skills/surveying-patterns/ | NEW |
| Create inscribing-taste | inscribe.md logic | skills/inscribing-taste/ | NEW |
| Create distilling-components | distill.md logic | skills/distilling-components/ | NEW |
| Rename mounting-framework | skills/mounting-framework/ | skills/mounting-sigil/ | RENAME |
| Rename updating-framework | skills/updating-framework/ | skills/updating-sigil/ | RENAME |

### 7.3 Phase 3: Command Routing (Day 4)

| Task | Files | Action |
|------|-------|--------|
| Add frontmatter to /craft | craft.md | UPDATE |
| Add frontmatter to /style | style.md | UPDATE |
| Add frontmatter to /animate | animate.md | UPDATE |
| Add frontmatter to /behavior | behavior.md | UPDATE |
| Add frontmatter to /ward | ward.md | UPDATE |
| Add frontmatter to /garden | garden.md | UPDATE |
| Add frontmatter to /inscribe | inscribe.md | UPDATE |
| Add frontmatter to /distill | distill.md | UPDATE |
| Add frontmatter to /mount | mount.md | UPDATE |
| Add frontmatter to /update | update.md | UPDATE |
| Add frontmatter to /setup | setup.md | UPDATE |
| Add frontmatter to /feedback | feedback.md | UPDATE |

### 7.4 Phase 4: Validation & Submission (Day 5)

| Task | Action |
|------|--------|
| Validate manifest.json | Run schema validation |
| Test skill invocation | Test each /command |
| Test rule loading | Verify rules load in session |
| Create PACK-SUBMISSION.md | Document submission |
| Submit to constructs.network | Upload pack |

---

## 8. File Changes Summary

### 8.1 Files to Create

| File | Purpose |
|------|---------|
| `manifest.json` | Pack metadata |
| `.claude/skills/crafting-physics/index.yaml` | Skill metadata |
| `.claude/skills/crafting-physics/SKILL.md` | Skill instructions |
| `.claude/skills/styling-material/index.yaml` | Skill metadata |
| `.claude/skills/styling-material/SKILL.md` | Skill instructions |
| `.claude/skills/animating-motion/index.yaml` | Skill metadata |
| `.claude/skills/animating-motion/SKILL.md` | Skill instructions |
| `.claude/skills/applying-behavior/index.yaml` | Skill metadata |
| `.claude/skills/applying-behavior/SKILL.md` | Skill instructions |
| `.claude/skills/validating-physics/index.yaml` | Skill metadata |
| `.claude/skills/validating-physics/SKILL.md` | Skill instructions |
| `.claude/skills/surveying-patterns/index.yaml` | Skill metadata |
| `.claude/skills/surveying-patterns/SKILL.md` | Skill instructions |
| `.claude/skills/inscribing-taste/index.yaml` | Skill metadata |
| `.claude/skills/inscribing-taste/SKILL.md` | Skill instructions |
| `.claude/skills/distilling-components/index.yaml` | Skill metadata |
| `.claude/skills/distilling-components/SKILL.md` | Skill instructions |
| `PACK-SUBMISSION.md` | Submission documentation |

### 8.2 Files to Update

| File | Changes |
|------|---------|
| `README.md` | Add installation instructions, pack documentation |
| `.claude/commands/craft.md` | Add agent routing frontmatter |
| `.claude/commands/style.md` | Add agent routing frontmatter |
| `.claude/commands/animate.md` | Add agent routing frontmatter |
| `.claude/commands/behavior.md` | Add agent routing frontmatter |
| `.claude/commands/ward.md` | Add agent routing frontmatter |
| `.claude/commands/garden.md` | Add agent routing frontmatter |
| `.claude/commands/inscribe.md` | Add agent routing frontmatter |
| `.claude/commands/distill.md` | Add agent routing frontmatter |
| `.claude/commands/mount.md` | Add agent routing frontmatter |
| `.claude/commands/update.md` | Add agent routing frontmatter |
| `.claude/commands/setup.md` | Add agent routing frontmatter |
| `.claude/commands/feedback.md` | Add agent routing frontmatter |

### 8.3 Files to Rename

| From | To |
|------|-----|
| `.claude/skills/mounting-framework/` | `.claude/skills/mounting-sigil/` |
| `.claude/skills/updating-framework/` | `.claude/skills/updating-sigil/` |

### 8.4 Files to Keep Unchanged

| File | Reason |
|------|--------|
| `.claude/rules/*` | Already complete, all go in manifest |
| `.claude/protocols/*` | Dev tooling, not in manifest |
| `.claude/skills/auditing-security/*` | Dev tooling, not in manifest |
| `.claude/skills/designing-architecture/*` | Dev tooling, not in manifest |
| `.claude/skills/discovering-requirements/*` | Dev tooling, not in manifest |
| `.claude/skills/implementing-tasks/*` | Dev tooling, not in manifest |
| `.claude/skills/planning-sprints/*` | Dev tooling, not in manifest |
| `.claude/skills/reviewing-code/*` | Dev tooling, not in manifest |
| `.claude/skills/riding-codebase/*` | Dev tooling, not in manifest |
| `.claude/skills/translating-for-executives/*` | Dev tooling, not in manifest |
| `.claude/skills/agent-browser/*` | In manifest, already structured |
| `.claude/commands/architect.md` | Dev tooling, not in manifest |
| `.claude/commands/audit*.md` | Dev tooling, not in manifest |
| `.claude/commands/implement.md` | Dev tooling, not in manifest |
| `.claude/commands/plan-and-analyze.md` | Dev tooling, not in manifest |
| `.claude/commands/review-sprint.md` | Dev tooling, not in manifest |
| `.claude/commands/ride.md` | Dev tooling, not in manifest |
| `.claude/commands/sprint-plan.md` | Dev tooling, not in manifest |
| `.claude/commands/translate*.md` | Dev tooling, not in manifest |

---

## 9. Validation Checklist

Before submission:

- [ ] manifest.json validates against pack-manifest.json schema
- [ ] All skills in manifest have index.yaml + SKILL.md
- [ ] All commands in manifest have agent routing frontmatter
- [ ] All rules in manifest exist at specified paths
- [ ] README has installation instructions
- [ ] No hardcoded paths or secrets
- [ ] MIT License confirmed
- [ ] PACK-SUBMISSION.md created

---

## 10. Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Skill extraction complex | Delay | Extract SKILL.md from existing command logic |
| Command frontmatter breaks existing use | User friction | Test thoroughly before merge |
| Manifest validation fails | Submission blocked | Validate against schema early |
| Dev tooling confusion | Contributor confusion | Document separation clearly in CLAUDE.md |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-01-11 | Claude | v10.1 SDD |
| 2.0.0 | 2026-01-16 | Claude | Loa Construct migration SDD |

---

*"Effect is truth. What the code does determines its physics."* — Sigil

```
    ╔═══════════════════════════════════════════════╗
    ║  SDD COMPLETE                                 ║
    ║  Ready for /sprint-plan                       ║
    ╚═══════════════════════════════════════════════╝
```
