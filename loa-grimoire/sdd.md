# Software Design Document: Sigil v3 — Constitutional Design Framework

**Version:** 1.0
**Date:** 2026-01-02
**Author:** Architecture Designer Agent
**Status:** Draft
**PRD Reference:** loa-grimoire/prd.md

---

## Table of Contents

1. [Project Architecture](#1-project-architecture)
2. [Software Stack](#2-software-stack)
3. [State Architecture](#3-state-architecture)
4. [Skill Design](#4-skill-design)
5. [Command Specifications](#5-command-specifications)
6. [Agent Behavior Specifications](#6-agent-behavior-specifications)
7. [Error Handling Strategy](#7-error-handling-strategy)
8. [Testing Strategy](#8-testing-strategy)
9. [Development Phases](#9-development-phases)
10. [Known Risks and Mitigation](#10-known-risks-and-mitigation)
11. [Open Questions](#11-open-questions)
12. [Appendix](#12-appendix)

---

## 1. Project Architecture

### 1.1 System Overview

Sigil v3 is a **Constitutional Design Framework** implemented as a Claude Code skill ecosystem. Unlike traditional applications with APIs and databases, Sigil v3 is a governance system that operates through:

- **Skills**: SKILL.md files that define agent behavior for specific tasks
- **Commands**: Entry points that map user invocations to skills
- **State Files**: YAML/Markdown files that persist design decisions
- **Helper Scripts**: Bash utilities for deterministic operations

The framework protects both **intended soul** (Immutable Values) and **emergent soul** (Canon of Flaws) through four architectural pillars.

### 1.2 Architectural Pattern

**Pattern:** Skill-Based Agent Architecture (File-Driven State Machine)

**Justification:**
> From prd.md: "Configuration in YAML/Markdown (universal formats)" and "Works with any tech stack (framework-agnostic)"

Sigil v3 is not a web application or API—it's a **design governance layer** that runs within Claude Code. The architecture:

1. **No runtime server**: All state persists in files
2. **Agent-driven execution**: Skills guide Claude's behavior
3. **Interview-generated config**: Commands conduct discovery, not data entry
4. **Human-in-the-loop**: All critical decisions require explicit approval

This pattern was chosen because:
- Sigil must work offline after setup
- Configuration must be human-readable and version-controllable
- The framework governs, doesn't execute (no business logic)

### 1.3 System Component Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            SIGIL v3 FRAMEWORK                               │
│              "Culture is the Reality. Code is Just the Medium."             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                              COMMANDS LAYER                                 │
│                                                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │ /setup   │ │/envision │ │ /codify  │ │ /craft   │ │ /approve │          │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘          │
│       │            │            │            │            │                 │
│  ┌────┴─────┐ ┌────┴─────┐ ┌────┴─────┐ ┌────┴─────┐ ┌────┴─────┐          │
│  │/canonize │ │ /consult │ │ /prove   │ │/graduate │ │ /inherit │          │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              SKILLS LAYER                                   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        SOUL BINDER SKILLS                            │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │   │
│  │  │ envisioning  │  │  canonizing  │  │   grit-      │               │   │
│  │  │  -moodboard  │  │   -flaws     │  │  checking    │               │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        LENS ARRAY SKILLS                             │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │   │
│  │  │  defining-   │  │  validating- │  │  resolving-  │               │   │
│  │  │   lenses     │  │    lenses    │  │   conflicts  │               │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    CONSULTATION CHAMBER SKILLS                       │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │   │
│  │  │  consulting- │  │   locking-   │  │  unlocking-  │               │   │
│  │  │  decisions   │  │  decisions   │  │  decisions   │               │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      PROVING GROUNDS SKILLS                          │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │   │
│  │  │   proving-   │  │  monitoring- │  │ graduating-  │               │   │
│  │  │   features   │  │   features   │  │  features    │               │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                          CORE SKILLS                                 │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │   │
│  │  │initializing- │  │  crafting-   │  │  approving-  │               │   │
│  │  │    sigil     │  │  guidance    │  │  patterns    │               │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              STATE LAYER                                    │
│                                                                             │
│  ┌───────────────────────────────┐    ┌───────────────────────────────┐    │
│  │         sigil-mark/           │    │       .sigilrc.yaml           │    │
│  │                               │    │                               │    │
│  │  ├── moodboard.md             │    │  version: "3.0"               │    │
│  │  ├── rules.md                 │    │  strictness: "guiding"        │    │
│  │  ├── inventory.md             │    │  taste_owners: {...}          │    │
│  │  │                            │    │  domains: [...]               │    │
│  │  ├── soul-binder/             │    │  consultation: {...}          │    │
│  │  │   ├── immutable-values.yaml│    │  proving: {...}               │    │
│  │  │   ├── canon-of-flaws.yaml  │    │                               │    │
│  │  │   └── visual-soul.yaml     │    └───────────────────────────────┘    │
│  │  │                            │                                         │
│  │  ├── lens-array/              │    ┌───────────────────────────────┐    │
│  │  │   └── lenses.yaml          │    │  .sigil-setup-complete        │    │
│  │  │                            │    │  .sigil-version.json          │    │
│  │  ├── consultation-chamber/    │    └───────────────────────────────┘    │
│  │  │   ├── config.yaml          │                                         │
│  │  │   └── decisions/           │                                         │
│  │  │                            │                                         │
│  │  ├── proving-grounds/         │                                         │
│  │  │   ├── config.yaml          │                                         │
│  │  │   └── active/              │                                         │
│  │  │                            │                                         │
│  │  └── canon/                   │                                         │
│  │      └── graduated/           │                                         │
│  │                               │                                         │
│  └───────────────────────────────┘                                         │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           HELPER SCRIPTS LAYER                              │
│                                                                             │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐          │
│  │   get-lens.sh    │  │ check-flaw.sh    │  │ get-strictness.sh│          │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘          │
│                                                                             │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐          │
│  │ detect-values.sh │  │check-decision.sh │  │ get-monitors.sh  │          │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘          │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.4 System Components

#### Commands Layer
- **Purpose:** Entry points for user interactions
- **Location:** `.claude/commands/`
- **Format:** Markdown with YAML frontmatter
- **Responsibility:** Define triggers, arguments, pre-flight checks, outputs

#### Skills Layer
- **Purpose:** Define agent behavior for specific governance tasks
- **Location:** `.claude/skills/`
- **Format:** index.yaml + SKILL.md + optional scripts/
- **Responsibility:** Guide Claude through interviews, validations, and file updates

#### State Layer
- **Purpose:** Persist design decisions and governance state
- **Location:** `sigil-mark/`, `.sigilrc.yaml`, marker files
- **Format:** YAML for structured data, Markdown for human-readable context
- **Responsibility:** Store values, flaws, lenses, decisions, and proving status

#### Helper Scripts Layer
- **Purpose:** Provide deterministic utilities for common operations
- **Location:** `.claude/scripts/`
- **Format:** POSIX-compliant shell scripts
- **Responsibility:** Lens detection, flaw checking, strictness evaluation

### 1.5 Data Flow

```
USER INVOCATION
      │
      ▼
┌─────────────────┐
│  /command args  │ ──────────────────────────────────────────┐
└────────┬────────┘                                            │
         │                                                     │
         ▼                                                     │
┌─────────────────┐     ┌─────────────────┐                   │
│ Command Parser  │────▶│ Pre-Flight Check │                   │
│ (read .md file) │     │ (files exist?)   │                   │
└────────┬────────┘     └────────┬────────┘                   │
         │                       │                             │
         ▼                       ▼                             │
┌─────────────────┐     ┌─────────────────┐                   │
│  Load SKILL.md  │────▶│ Check Strictness │                   │
│ (agent guidance)│     │ (get-strictness) │                   │
└────────┬────────┘     └────────┬────────┘                   │
         │                       │                             │
         ▼                       ▼                             │
┌─────────────────────────────────────────────────────┐       │
│              PILLAR-SPECIFIC LOGIC                   │       │
│                                                      │       │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────┐│       │
│  │ Soul Binder  │  │ Lens Array   │  │Consultation││       │
│  │ Check Values │  │ Check Lenses │  │Check Locked ││       │
│  │ Check Flaws  │  │ Validate     │  │Decisions   ││       │
│  └──────────────┘  └──────────────┘  └────────────┘│       │
│                                                      │       │
│  ┌──────────────────────────────────────────────────┐│       │
│  │                Proving Grounds                    ││       │
│  │  Check proving status, monitors, graduation       ││       │
│  └──────────────────────────────────────────────────┘│       │
└──────────────────────────┬──────────────────────────┘       │
                           │                                   │
                           ▼                                   │
                  ┌─────────────────┐                         │
                  │  Interview User │ (if needed)              │
                  │ AskUserQuestion │                         │
                  └────────┬────────┘                         │
                           │                                   │
                           ▼                                   │
                  ┌─────────────────┐                         │
                  │  Update State   │                         │
                  │ (sigil-mark/)   │                         │
                  └────────┬────────┘                         │
                           │                                   │
                           ▼                                   │
                  ┌─────────────────┐                         │
                  │  Report Result  │◀────────────────────────┘
                  │  (to user)      │
                  └─────────────────┘
```

### 1.6 Progressive Strictness Architecture

> From prd.md: "Progressive strictness allows greenfield projects to grow without friction"

The framework adjusts behavior based on project maturity:

```
┌─────────────────────────────────────────────────────────────────────┐
│                    STRICTNESS LEVELS                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  DISCOVERY ──────▶ GUIDING ──────▶ ENFORCING ──────▶ STRICT         │
│                                                                      │
│  All suggestions   Warnings on     Blocks on        Blocks on all   │
│  No blocks         violations      protected flaws  violations      │
│                    Optional blocks + immutable      Approval for    │
│                    on critical     values           overrides       │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

Implementation in .sigilrc.yaml:
  strictness: "discovery" | "guiding" | "enforcing" | "strict"

Agent Behavior Matrix:
┌───────────────┬──────────────┬──────────────┬──────────────┬──────────┐
│ Violation     │ discovery    │ guiding      │ enforcing    │ strict   │
├───────────────┼──────────────┼──────────────┼──────────────┼──────────┤
│ Immutable Val │ Suggest      │ Warn         │ BLOCK        │ BLOCK    │
│ Protected Flaw│ Suggest      │ Warn         │ BLOCK        │ BLOCK    │
│ Lens Failure  │ Suggest      │ Warn         │ Warn         │ BLOCK    │
│ Grit Issue    │ Suggest      │ Suggest      │ Warn         │ Warn     │
│ Pattern Warn  │ Suggest      │ Suggest      │ Suggest      │ Warn     │
└───────────────┴──────────────┴──────────────┴──────────────┴──────────┘
```

### 1.7 Human Accountability Architecture

> From prd.md: "All validation results in human review, not pure automation"

Every blocking action has an escape hatch:

```
┌─────────────────────────────────────────────────────────────────────┐
│                    HUMAN OVERRIDE PATTERN                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  AGENT DETECTS VIOLATION                                            │
│       │                                                              │
│       ▼                                                              │
│  ┌─────────────────────────────────────────────┐                    │
│  │  ⚠️ VIOLATION DETECTED                      │                    │
│  │                                              │                    │
│  │  {Violation Type}: {Details}                 │                    │
│  │  Context: {Why this matters}                 │                    │
│  │                                              │                    │
│  │  Options:                                    │                    │
│  │  [Fix Issue] [Override with Reasoning]       │                    │
│  │  [Request De-Canonization] [Abandon]         │                    │
│  └─────────────────────────────────────────────┘                    │
│       │                                                              │
│       ▼                                                              │
│  IF user chooses "Override with Reasoning"                          │
│       │                                                              │
│       ▼                                                              │
│  ┌─────────────────────────────────────────────┐                    │
│  │  Agent: "Please provide reasoning for       │                    │
│  │         this override. This will be         │                    │
│  │         logged for audit purposes."         │                    │
│  └─────────────────────────────────────────────┘                    │
│       │                                                              │
│       ▼                                                              │
│  LOG TO: sigil-mark/audit/overrides.yaml                            │
│  - timestamp: ...                                                   │
│  - violation: ...                                                   │
│  - reasoning: ...                                                   │
│  - user: ...                                                        │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Software Stack

### 2.1 Framework Technologies

| Category | Technology | Version | Justification |
|----------|------------|---------|---------------|
| Agent Runtime | Claude Code | Latest | Primary execution environment for skills |
| Skill Format | SKILL.md (Markdown) | - | Human-readable, version-controllable |
| Config Format | YAML 1.2 | - | Universal, comment-friendly, structured |
| Human Context | Markdown | CommonMark | Git-friendly, readable without tooling |
| Scripts | POSIX Shell | sh | Universal availability, no dependencies |
| YAML Parser | yq 4.x | 4.40+ | Optional; bash fallback for portability |

### 2.2 File Formats by Purpose

| Purpose | Format | Location | Notes |
|---------|--------|----------|-------|
| Command Definition | YAML frontmatter + Markdown | `.claude/commands/` | Pre-flight, args, outputs |
| Skill Definition | YAML + Markdown | `.claude/skills/*/` | Zones, workflow, examples |
| Design Context | Markdown | `sigil-mark/*.md` | Moodboard, rules, inventory |
| Structured Config | YAML | `sigil-mark/**/*.yaml` | Values, flaws, lenses, decisions |
| Framework Config | YAML | `.sigilrc.yaml` | Strictness, taste owners, domains |
| Helper Scripts | Shell | `.claude/scripts/` | Zone detection, validation |

### 2.3 External Dependencies

**Required:**
- Git (version control for state files)
- Claude Code or compatible Claude-powered tool

**Optional:**
- yq 4.x (faster YAML parsing; bash fallback exists)

**Explicitly NOT Required:**
- Node.js, Python, or any runtime
- Databases or external APIs
- Cloud services or network connectivity (after setup)

---

## 3. State Architecture

### 3.1 State Directory Structure

```
sigil-mark/
├── moodboard.md                     # Product feel, references, anti-patterns
├── rules.md                         # Design rules by category
├── inventory.md                     # Component inventory
│
├── soul-binder/
│   ├── immutable-values.yaml        # Core values (intended soul)
│   ├── canon-of-flaws.yaml          # Protected flaws (emergent soul)
│   └── visual-soul.yaml             # Grit signatures
│
├── lens-array/
│   └── lenses.yaml                  # User persona definitions
│
├── consultation-chamber/
│   ├── config.yaml                  # Consultation process settings
│   └── decisions/                   # Recorded decisions with locks
│       ├── {decision-id}.yaml       # Individual decision records
│       └── ...
│
├── proving-grounds/
│   ├── config.yaml                  # Monitor configuration
│   └── active/                      # Features currently proving
│       ├── {feature-id}.yaml        # Proving status and metrics
│       └── ...
│
├── canon/
│   └── graduated/                   # Features that passed proving
│       ├── {feature-id}.yaml        # Graduation records
│       └── ...
│
└── audit/
    └── overrides.yaml               # Human override log
```

### 3.2 Schema: immutable-values.yaml

```yaml
# sigil-mark/soul-binder/immutable-values.yaml
version: "1.0"
generated_by: "/envision"
generated_at: "2026-01-02T00:00:00Z"

values:
  security:
    name: "Security First"
    description: "No compromises on user safety"
    type: "shared"  # shared | project-specific
    enforcement:
      level: "block"  # block | warn | review
      constraints:
        - name: "no_exposed_keys"
          description: "API keys and secrets must not appear in code"
          pattern: "(?i)(api[_-]?key|secret|password|token)\\s*[:=]"
          scope: ["**/*.ts", "**/*.js", "**/*.yaml"]

        - name: "no_unsafe_patterns"
          description: "Known unsafe code patterns"
          patterns:
            - "eval\\("
            - "dangerouslySetInnerHTML"
          scope: ["**/*.tsx", "**/*.jsx"]

  accessibility:
    name: "Accessible by Default"
    description: "All users can interact with the product"
    type: "shared"
    enforcement:
      level: "warn"
      constraints:
        - name: "semantic_html"
          description: "Use semantic HTML elements"
          check_type: "lint_rule"

  # Project-specific values added through /envision
  performance:
    name: "Fast First Render"
    description: "No blocking operations in critical path"
    type: "project-specific"
    enforcement:
      level: "review"
      constraints:
        - name: "no_sync_fetch"
          description: "Avoid synchronous data fetching"
          pattern: "fetchSync|await.*in.*render"
```

### 3.3 Schema: canon-of-flaws.yaml

```yaml
# sigil-mark/soul-binder/canon-of-flaws.yaml
version: "1.0"
generated_by: "/canonize"
last_updated: "2026-01-02T00:00:00Z"

flaws:
  - id: "FLAW-001"
    name: "Double-Click Submit"
    status: "PROTECTED"  # PROTECTED | UNDER_REVIEW | DE_CANONIZED
    canonized_date: "2026-01-02"
    canonized_by: "Design Lead"

    description: |
      Users discovered that double-clicking the submit button
      creates a satisfying animation and became expected behavior.

    intended_behavior: |
      Single click submits form. Double click prevented.

    emergent_behavior: |
      Double click triggers celebratory ripple effect.
      Users expect and enjoy this interaction.

    why_protected: |
      - 40% of users double-click intentionally
      - Creates signature feel for the product
      - Removal would feel "broken" to existing users

    affected_code_patterns:
      - "*submit*button*"
      - "*form*handler*"
      - "*click*debounce*"

    protection_rule: |
      Any change that prevents the double-click ripple effect
      or adds standard debouncing must be BLOCKED.

    de_canonization:
      requires_threshold: 70  # percent approval
      cooldown_days: 180

canonization_criteria:
  usage_threshold_percent: 5
  requires_community_attachment: true
  requires_skill_expression: false  # Unlike games, most apps don't need this

de_canonization_valid_reasons:
  - "Creates security vulnerability"
  - "Blocks critical accessibility need"
  - "Technical necessity (stability/security)"

de_canonization_invalid_reasons:
  - "It wasn't intended"
  - "It's inconsistent with new patterns"
  - "It's too unusual"
```

### 3.4 Schema: lenses.yaml

```yaml
# sigil-mark/lens-array/lenses.yaml
version: "1.0"
generated_by: "/envision"
last_updated: "2026-01-02T00:00:00Z"

lenses:
  power_user:
    name: "Power User"
    description: "Experienced users optimizing for efficiency"
    priority: 1  # Lower = more constrained = truth test

    target_audience:
      - "Daily active users"
      - "Keyboard-first users"
      - "High-volume transaction users"

    constraints:
      - id: "keyboard_shortcuts"
        description: "All actions accessible via keyboard"
        required: true

      - id: "dense_display"
        description: "Information-dense layouts preferred"
        required: false

      - id: "batch_operations"
        description: "Bulk actions available"
        required: true

    validation:
      - "All interactive elements have tabindex"
      - "No hover-only interactions"
      - "Shortcuts documented in UI"

  newcomer:
    name: "Newcomer"
    description: "First-time users needing guidance"
    priority: 2

    target_audience:
      - "New signups"
      - "Infrequent users"
      - "Users from competing products"

    constraints:
      - id: "clear_onboarding"
        description: "Guided first experience"
        required: true

      - id: "contextual_help"
        description: "Tooltips and help available"
        required: true

      - id: "forgiving_interactions"
        description: "Undo available for destructive actions"
        required: true

    validation:
      - "Help button visible on every screen"
      - "No jargon without explanation"
      - "Confirmation for destructive actions"

  mobile:
    name: "Mobile"
    description: "Touch-first, limited screen users"
    priority: 3

    target_audience:
      - "iOS users"
      - "Android users"
      - "Tablet users"

    constraints:
      - id: "touch_targets"
        description: "Minimum 44x44px touch targets"
        required: true

      - id: "responsive_layout"
        description: "Adapts to screen size"
        required: true

      - id: "reduced_data"
        description: "Optimized for mobile bandwidth"
        required: false

    validation:
      - "Touch targets >= 44px"
      - "No horizontal scroll on mobile"
      - "Images have mobile variants"

  accessibility:
    name: "Accessibility"
    description: "Users with assistive technology"
    priority: 4

    constraints:
      - id: "screen_reader"
        description: "Full screen reader support"
        required: true

      - id: "high_contrast"
        description: "Meets WCAG AA contrast ratios"
        required: true

      - id: "reduced_motion"
        description: "Respects prefers-reduced-motion"
        required: true

    validation:
      - "ARIA labels on all interactive elements"
      - "Color not sole indicator of state"
      - "Focus visible on all elements"

immutable_properties:
  description: |
    These properties MUST be identical across all lenses.
    Lenses only affect presentation, never core behavior.

  properties:
    - name: "core_logic"
      description: "Business rules and calculations"

    - name: "security"
      description: "Authentication, authorization, encryption"

    - name: "data_integrity"
      description: "Validation rules, constraints"

    - name: "api_contracts"
      description: "Request/response shapes"

stacking:
  description: "Lenses can be combined for specific scenarios"
  allowed_combinations:
    - ["power_user"]
    - ["newcomer"]
    - ["mobile"]
    - ["accessibility"]
    - ["power_user", "accessibility"]
    - ["newcomer", "mobile"]
    - ["mobile", "accessibility"]

  conflict_resolution:
    priority_order: ["accessibility", "power_user", "newcomer", "mobile"]
    rule: "When lenses conflict, higher priority wins"
```

### 3.5 Schema: decisions/{id}.yaml

```yaml
# sigil-mark/consultation-chamber/decisions/DEC-2026-001.yaml
id: "DEC-2026-001"
created_at: "2026-01-02T10:00:00Z"
created_by: "/consult"

decision:
  title: "Primary Action Button Color"
  scope: "direction"  # strategic | direction | execution

description: |
  Whether to use blue or green for primary action buttons.

options:
  - id: "blue"
    label: "Blue (#3B82F6)"
    description: "Trust, reliability, standard"

  - id: "green"
    label: "Green (#22C55E)"
    description: "Action, success, energy"

consultation:
  method: "sentiment_gathering"  # poll | sentiment_gathering | none
  duration_days: 7
  started_at: "2026-01-02T10:00:00Z"
  ended_at: "2026-01-09T10:00:00Z"

  sentiment:
    blue:
      positive: 45
      negative: 20
      neutral: 35
    green:
      positive: 55
      negative: 25
      neutral: 20

  key_themes:
    positive:
      - "Green feels more energetic"
      - "Matches our brand direction"
    negative:
      - "Green might clash with error states"
      - "Blue is more universal"

outcome:
  decision: "green"
  decided_by: "Design Lead"
  decided_at: "2026-01-09T12:00:00Z"

  reasoning: |
    Community prefers green (55% positive vs 45% for blue).
    Aligns with our energetic brand direction.
    Error states will use red, not green, avoiding clash.

  override_sentiment: false

lock:
  locked: true
  locked_at: "2026-01-09T12:00:00Z"
  unlock_date: "2026-04-09T12:00:00Z"  # 90 days

  message: |
    Direction was consulted. Decision was made.
    Execution details (specific shade, hover states) are
    Taste Owner decisions, not subject to further polling.
```

### 3.6 Schema: proving-grounds/active/{id}.yaml

```yaml
# sigil-mark/proving-grounds/active/PROVE-2026-001.yaml
id: "PROVE-2026-001"
feature: "new-checkout-flow"
started_at: "2026-01-02T00:00:00Z"
started_by: "/prove"

config:
  duration_days: 7
  environment: "testnet"  # testnet | staging | beta

monitors:
  - id: "error_rate"
    type: "threshold"
    metric: "checkout_errors_per_hour"
    threshold: 5
    action: "alert"

  - id: "completion_rate"
    type: "threshold"
    metric: "checkout_completion_percent"
    threshold: 85
    comparison: "gte"
    action: "alert"

  - id: "latency"
    type: "threshold"
    metric: "checkout_p99_ms"
    threshold: 2000
    action: "warn"

status:
  current: "proving"  # proving | passed | failed | graduated
  days_elapsed: 3
  days_remaining: 4

  monitor_status:
    error_rate: "green"
    completion_rate: "green"
    latency: "yellow"  # warning, not failure

  violations:
    - timestamp: "2026-01-03T14:00:00Z"
      monitor: "latency"
      value: 2100
      threshold: 2000
      severity: "warning"
      resolved: true
      resolution: "Cache warming improved latency"

graduation:
  eligible: false  # becomes true when duration complete + all green
  requires:
    - "All monitors green for 7 days"
    - "No unresolved P1 violations"
    - "Taste Owner sign-off"
```

### 3.7 Configuration: .sigilrc.yaml

```yaml
# .sigilrc.yaml
version: "3.0"
strictness: "guiding"  # discovery | guiding | enforcing | strict

taste_owners:
  design:
    name: "Design Lead"
    placeholder: "@design-lead"
    scope:
      - "sigil-mark/**"
      - "src/components/**"
      - "src/styles/**"

  security:
    name: "Security Lead"
    placeholder: "@security-lead"
    scope:
      - "**/*.sol"
      - "src/auth/**"
      - "src/crypto/**"

  product:
    name: "Product Lead"
    placeholder: "@product-lead"
    scope:
      - "src/features/**"
      - "src/pages/**"

domains:
  - "defi"  # Enables DeFi-specific monitors and values

consultation:
  internal_tool: "linear"  # Where direction discussions happen
  community_channels:
    - type: "discord"
      server: "Our Discord"
      channel: "#design-feedback"
    - type: "reddit"
      subreddit: "r/ourproduct"

proving:
  default_duration_days: 7
  environments:
    testnet: true
    staging: true
    beta: true
  monitors:
    - "error_rate"
    - "completion_rate"
    - "latency"
  graduation_requires:
    - "all_monitors_green"
    - "no_p1_violations"
    - "taste_owner_signoff"

lens_detection:
  method: "explicit"  # explicit | path-based | user-profile
  default_lens: "power_user"
```

---

## 4. Skill Design

### 4.1 Skill Architecture Pattern

Each skill follows the established v2 pattern:

```
.claude/skills/{skill-name}/
├── index.yaml           # Metadata (triggers, inputs, outputs)
├── SKILL.md             # Agent guidance document
└── scripts/             # Optional helper scripts
    └── *.sh
```

### 4.2 Skill Inventory

#### Core Skills (From Sigil v2, Updated)

| Skill | Trigger | Purpose |
|-------|---------|---------|
| `initializing-sigil` | `/setup` | Initialize Sigil v3 framework |
| `envisioning-moodboard` | `/envision` | Capture product soul + values |
| `codifying-rules` | `/codify` | Define design rules |
| `crafting-guidance` | `/craft` | Provide contextual design guidance |
| `approving-patterns` | `/approve` | Human review and sign-off |
| `inheriting-design` | `/inherit` | Bootstrap from existing codebase |
| `updating-framework` | `/update` | Pull framework updates |

#### Soul Binder Skills (New)

| Skill | Trigger | Purpose |
|-------|---------|---------|
| `canonizing-flaws` | `/canonize` | Register protected emergent behavior |
| `checking-values` | (internal) | Validate against immutable values |
| `checking-flaws` | (internal) | Detect changes affecting protected flaws |
| `checking-grit` | `/grit-check` | Visual soul validation |

#### Lens Array Skills (New)

| Skill | Trigger | Purpose |
|-------|---------|---------|
| `defining-lenses` | (via /envision) | Create lens definitions |
| `validating-lenses` | (internal) | Validate asset across lenses |
| `resolving-conflicts` | (internal) | Handle lens stacking conflicts |

#### Consultation Chamber Skills (New)

| Skill | Trigger | Purpose |
|-------|---------|---------|
| `consulting-decisions` | `/consult` | Start consultation process |
| `locking-decisions` | (internal) | Lock decision after outcome |
| `unlocking-decisions` | (internal) | Check/allow time-based unlock |

#### Proving Grounds Skills (New)

| Skill | Trigger | Purpose |
|-------|---------|---------|
| `proving-features` | `/prove` | Register feature for validation |
| `monitoring-features` | (internal) | Track proving status |
| `graduating-features` | `/graduate` | Promote proven features |

### 4.3 Skill Template: canonizing-flaws

```yaml
# .claude/skills/canonizing-flaws/index.yaml
name: "canonizing-flaws"
description: "Register and protect emergent behaviors in the Canon of Flaws"
version: "3.0.0"
triggers:
  - "/canonize"
  - "/canonise"  # British spelling

examples:
  - input: "/canonize double-click-submit"
    description: "Protect the double-click submit animation"

inputs:
  - name: behavior_name
    type: string
    required: false
    description: "Name of the emergent behavior to protect"

outputs:
  - path: sigil-mark/soul-binder/canon-of-flaws.yaml
    description: "Updated Canon of Flaws with new entry"
```

```markdown
<!-- .claude/skills/canonizing-flaws/SKILL.md -->
---
zones:
  state:
    paths: [sigil-mark/soul-binder/canon-of-flaws.yaml]
    permission: read-write
  config:
    paths: [.sigilrc.yaml, .sigil-setup-complete]
    permission: read
---

# Canonizing Flaws

<objective>
Interview the user about an emergent behavior that has become beloved or expected,
and register it in the Canon of Flaws for protection against "optimization."
</objective>

## Pre-Flight Checks

1. **Sigil Setup**: Verify `.sigil-setup-complete` exists
2. **Canon File**: Check `sigil-mark/soul-binder/canon-of-flaws.yaml` exists
   - If missing, create with empty flaws array
3. **Strictness Level**: Load from `.sigilrc.yaml`

## Workflow

### Step 1: Identify the Behavior

If behavior_name not provided, ask:

```
What emergent behavior would you like to protect?

This should be something that:
- Was not originally intended
- Users have come to expect or enjoy
- Removing would cause confusion or complaints

Examples:
- A UI quirk that became a feature
- An interaction pattern that emerged from user behavior
- A "bug" that users now rely on
```

### Step 2: Interview - Intended vs Emergent

Ask structured questions:

**Question 1: Intended Behavior**
```
What was the INTENDED behavior?
What should have happened according to the original design?
```

**Question 2: Emergent Behavior**
```
What ACTUALLY happens (that became beloved)?
Describe the behavior users have come to expect.
```

**Question 3: Discovery**
```
How did you discover this behavior was valued?
- User complaints when it changed?
- Community discussion?
- Usage analytics?
```

### Step 3: Interview - Protection Criteria

**Question 4: Usage**
```
Approximately what percentage of users rely on this behavior?
- < 5%: May not meet threshold for canonization
- 5-20%: Meets threshold
- > 20%: Strong candidate for protection
```

**Question 5: Community Attachment**
```
How would users react if this behavior was "fixed"?
- Mild confusion: Low attachment
- Complaints: Moderate attachment
- Outrage/backlash: High attachment
```

**Question 6: Skill Expression (Optional)**
```
Does this behavior reward skill or expertise?
For example: Timing-based, requires learning, separates novice from expert
```

### Step 4: Define Protection

**Question 7: Affected Code**
```
What code patterns might accidentally "fix" this behavior?
Provide glob patterns that should trigger protection checks.

Examples:
- *submit*handler*
- *debounce*click*
- *animation*duration*
```

**Question 8: Protection Rule**
```
Complete this sentence:
"Any change that __________ must be BLOCKED."

Example: "Any change that prevents the double-click animation must be BLOCKED."
```

### Step 5: Generate Entry

Create the flaw entry:

```yaml
- id: "FLAW-{next_id}"
  name: "{behavior_name}"
  status: "PROTECTED"
  canonized_date: "{today}"
  canonized_by: "{user}"

  description: |
    {description}

  intended_behavior: |
    {intended}

  emergent_behavior: |
    {emergent}

  why_protected: |
    - {reason_1}
    - {reason_2}
    - {reason_3}

  affected_code_patterns:
    - "{pattern_1}"
    - "{pattern_2}"

  protection_rule: |
    {protection_rule}
```

### Step 6: Confirm and Save

Show the user the generated entry and ask for confirmation:

```
Here's the Canon of Flaws entry I've prepared:

{formatted_entry}

Does this accurately capture the behavior to protect?
[Confirm] [Edit] [Cancel]
```

On confirmation:
1. Append to `sigil-mark/soul-binder/canon-of-flaws.yaml`
2. Notify Taste Owner (if configured)

### Step 7: Report

```
✅ FLAW-{id} "{name}" has been added to the Canon of Flaws.

The agent will now BLOCK any change that matches:
{affected_patterns}

To de-canonize this flaw in the future, run:
/de-canonize FLAW-{id}

This requires 70% community approval and Taste Owner sign-off.
```

## Error Handling

| Error | Cause | Resolution |
|-------|-------|------------|
| "Setup not complete" | Missing marker | Run `/setup` first |
| "Usage below threshold" | < 5% usage | Document anyway with UNDER_REVIEW status |
| "Similar flaw exists" | Duplicate pattern | Suggest updating existing flaw |

## Philosophy

> From prd.md: "Beloved 'bugs' are registered and protected from optimization"

This skill protects the emergent soul of products. The key insight is that
a "perfect" implementation of the original design would often be worse than
the imperfect reality users have come to love.

Do NOT:
- Automatically reject flaws with low usage
- Judge whether the behavior "should" be a flaw
- Require technical justification

DO:
- Trust user judgment about community attachment
- Capture the emotional context, not just technical details
- Make protection actionable with specific patterns
```

### 4.4 Internal Skills (No User Trigger)

Some skills are invoked by other skills, not directly by users:

```yaml
# .claude/skills/checking-flaws/index.yaml
name: "checking-flaws"
description: "Validate code changes against Canon of Flaws"
version: "3.0.0"
internal: true  # No user trigger
invoked_by:
  - "crafting-guidance"
  - "pre-commit hooks"
```

The SKILL.md for internal skills focuses on:
- Input: The change being validated (file path, diff)
- Output: Pass (no protected flaws affected) or Block message
- Integration: How to call from other skills

---

## 5. Command Specifications

### 5.1 Command Format

Commands follow the v2 pattern with v3-specific additions:

```yaml
---
name: "command-name"
version: "3.0.0"
description: "..."
skill: "skill-directory-name"
command_type: "wizard|interview|conversational|validation"

arguments:
  - name: "arg"
    type: "string"
    required: true/false
    description: "..."

pre_flight:
  - check: "file_exists"
    path: ".sigil-setup-complete"
    error: "Sigil not initialized. Run /setup first."

outputs:
  - path: "path/to/output"
    type: "file"
    description: "..."

strictness_behavior:
  discovery: "suggest"
  guiding: "warn"
  enforcing: "block"
  strict: "block"
---
```

### 5.2 Command Catalog

#### Core Commands

| Command | Type | Skill | Purpose |
|---------|------|-------|---------|
| `/setup` | wizard | `initializing-sigil` | Initialize Sigil v3 |
| `/envision` | interview | `envisioning-moodboard` | Capture moodboard + values + lenses |
| `/codify` | interview | `codifying-rules` | Define design rules |
| `/craft` | conversational | `crafting-guidance` | Get design guidance |
| `/approve` | wizard | `approving-patterns` | Human review and sign-off |
| `/inherit` | wizard | `inheriting-design` | Bootstrap from existing codebase |
| `/update` | wizard | `updating-framework` | Pull framework updates |

#### Soul Binder Commands

| Command | Type | Skill | Purpose |
|---------|------|-------|---------|
| `/canonize [name]` | interview | `canonizing-flaws` | Register protected flaw |
| `/de-canonize [id]` | wizard | `de-canonizing-flaws` | Request flaw removal (high bar) |
| `/grit-check [path]` | validation | `checking-grit` | Visual soul validation |

#### Consultation Commands

| Command | Type | Skill | Purpose |
|---------|------|-------|---------|
| `/consult [topic]` | interview | `consulting-decisions` | Start consultation |

#### Proving Commands

| Command | Type | Skill | Purpose |
|---------|------|-------|---------|
| `/prove [feature]` | wizard | `proving-features` | Register for proving |
| `/graduate [feature]` | wizard | `graduating-features` | Check/complete graduation |

### 5.3 Command: /canonize

```yaml
---
name: "canonize"
version: "3.0.0"
description: "Register an emergent behavior in the Canon of Flaws"
skill: "canonizing-flaws"
command_type: "interview"

arguments:
  - name: "behavior"
    type: "string"
    required: false
    description: "Name of the behavior to protect"

pre_flight:
  - check: "file_exists"
    path: ".sigil-setup-complete"
    error: "Sigil not initialized. Run /setup first."

outputs:
  - path: "sigil-mark/soul-binder/canon-of-flaws.yaml"
    type: "file"
    description: "Updated Canon of Flaws"

strictness_behavior:
  # Canonization is always allowed regardless of strictness
  discovery: "allow"
  guiding: "allow"
  enforcing: "allow"
  strict: "allow"
---

# Canonize

Register an emergent behavior in the Canon of Flaws. Protected flaws
cannot be accidentally "fixed" by well-meaning optimizations.

## Usage

```
/canonize
/canonize "double-click submit"
```

## What Gets Protected

Emergent behaviors that:
- Were not originally intended
- Users have come to expect or rely on
- Removing would cause confusion or complaints

## Example

```
/canonize "keyboard shortcut timing"

Agent: "Let me interview you about this behavior..."
[Interview follows canonizing-flaws skill]
```

## See Also

- `/de-canonize` - Remove protection (requires high approval threshold)
- `/craft` - Guidance that respects Canon of Flaws
```

### 5.4 Command: /consult

```yaml
---
name: "consult"
version: "3.0.0"
description: "Start a consultation process for a design decision"
skill: "consulting-decisions"
command_type: "interview"

arguments:
  - name: "topic"
    type: "string"
    required: false
    description: "Topic to consult on"

pre_flight:
  - check: "file_exists"
    path: ".sigil-setup-complete"
    error: "Sigil not initialized. Run /setup first."

  - check: "file_exists"
    path: "sigil-mark/consultation-chamber/config.yaml"
    error: "Consultation not configured. Run /envision first."

outputs:
  - path: "sigil-mark/consultation-chamber/decisions/*.yaml"
    type: "directory"
    description: "Decision record"

strictness_behavior:
  discovery: "allow"
  guiding: "allow"
  enforcing: "allow"
  strict: "allow"
---

# Consult

Start a consultation process for a design decision. The process follows
three tiers based on decision scope:

## Decision Layers

| Layer | Scope | Process | Authority |
|-------|-------|---------|-----------|
| **Strategic** | New features, major changes | Community poll | Binding vote |
| **Direction** | Visual style A vs B, tone | Sentiment gathering | Taste Owner |
| **Execution** | Pixel-level details | None | Taste Owner dictates |

## Usage

```
/consult
/consult "button color"
/consult "new onboarding flow"
```

## What Happens

1. Agent determines appropriate layer (strategic/direction/execution)
2. For Strategic: Creates poll format for community channels
3. For Direction: Creates comparison format, gathers sentiment
4. For Execution: Informs user this is a Taste Owner decision

## After Decision

Direction and Execution layers **LOCK** after decision:
- No further polling on details
- Time-based unlock allows future revisitation

## Example

```
/consult "primary CTA color"

Agent: "Is this a strategic, direction, or execution decision?"
[Interview determines layer: direction]

Agent: "I'll prepare a comparison for sentiment gathering..."
[Creates decision record, guidance for gathering sentiment]
```
```

### 5.5 Command: /prove

```yaml
---
name: "prove"
version: "3.0.0"
description: "Register a feature for scale validation in Proving Grounds"
skill: "proving-features"
command_type: "wizard"

arguments:
  - name: "feature"
    type: "string"
    required: true
    description: "Feature identifier to prove"

pre_flight:
  - check: "file_exists"
    path: ".sigil-setup-complete"
    error: "Sigil not initialized. Run /setup first."

  - check: "file_exists"
    path: "sigil-mark/proving-grounds/config.yaml"
    error: "Proving Grounds not configured. Check .sigilrc.yaml."

outputs:
  - path: "sigil-mark/proving-grounds/active/*.yaml"
    type: "directory"
    description: "Proving status record"

strictness_behavior:
  discovery: "allow"
  guiding: "allow"
  enforcing: "allow"
  strict: "allow"
---

# Prove

Register a feature for scale validation in the Proving Grounds.
Features must prove themselves before graduating to production.

## Usage

```
/prove checkout-v2
/prove "new-header-design"
```

## What Happens

1. Feature registered in `proving-grounds/active/`
2. Monitors configured based on domain (DeFi, Creative, etc.)
3. Duration timer starts (default: 7 days)
4. Status tracked: proving → passed/failed → graduated

## Monitors

Domain-specific monitors run throughout proving:

| Domain | Monitors |
|--------|----------|
| DeFi | TVL changes, transaction patterns, exploit detection |
| Creative | Performance, crash rates, export success |
| Community | Engagement, report spikes, load patterns |

## Graduation

After clean run:
```
/graduate checkout-v2
```

Requires:
- All monitors green for duration
- No unresolved P1 violations
- Taste Owner sign-off
```

---

## 6. Agent Behavior Specifications

### 6.1 Behavior by Strictness Level

The agent adjusts its behavior based on the `strictness` setting in `.sigilrc.yaml`:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      AGENT RESPONSE MATRIX                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Violation Type          │ discovery │ guiding  │ enforcing │ strict       │
│  ────────────────────────┼───────────┼──────────┼───────────┼──────────    │
│  Immutable Value         │ "Consider"│ ⚠️ WARN  │ ⛔ BLOCK  │ ⛔ BLOCK     │
│  Protected Flaw          │ "Consider"│ ⚠️ WARN  │ ⛔ BLOCK  │ ⛔ BLOCK     │
│  Lens Failure            │ "Consider"│ ⚠️ WARN  │ ⚠️ WARN   │ ⛔ BLOCK     │
│  Grit Issue              │ "FYI"     │ "Consider"│ ⚠️ WARN  │ ⚠️ WARN      │
│  Decision Locked         │ "FYI"     │ ⚠️ WARN  │ ⛔ BLOCK  │ ⛔ BLOCK     │
│  Pattern Warning         │ "FYI"     │ "Consider"│ "Consider"│ ⚠️ WARN     │
│                                                                             │
│  Legend:                                                                    │
│  "FYI" = Informational, no action required                                 │
│  "Consider" = Suggestion with explanation                                  │
│  ⚠️ WARN = Warning with escape hatch                                       │
│  ⛔ BLOCK = Blocks action, requires override                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Block Message Format

When the agent blocks an action:

```
⛔ {VIOLATION_TYPE} VIOLATION

{Violation description}

CONTEXT:
{Why this matters - reference to value/flaw/lens}

DETAILS:
- Affected: {what triggered the block}
- Rule: {specific constraint violated}
- Strictness: {current level}

OPTIONS:
[Fix Issue] [Override with Reasoning] [Escalate to Taste Owner] [Abandon]

If you believe this is a false positive, choose "Override with Reasoning"
and provide justification. This will be logged for audit purposes.
```

### 6.3 Warning Message Format

When the agent warns about an issue:

```
⚠️ {ISSUE_TYPE} WARNING

{Issue description}

CONCERN:
{Why this might be problematic}

SUGGESTION:
{Alternative approach}

You can proceed anyway—this is a warning, not a block.
If you proceed, consider documenting why this deviation is acceptable.

[Proceed] [Follow Suggestion] [Get More Context]
```

### 6.4 Suggestion Message Format

When the agent makes a suggestion:

```
💡 DESIGN CONSIDERATION

{Suggestion}

Based on:
- {Reference to moodboard/rules/values}

This is purely informational. Your judgment takes precedence.
```

### 6.5 Protected Flaw Detection Algorithm

```python
# Pseudocode for flaw detection

def check_protected_flaws(change: FileChange) -> Optional[BlockMessage]:
    """
    Check if a code change would affect a protected flaw.

    Args:
        change: The file change being evaluated

    Returns:
        BlockMessage if flaw affected, None otherwise
    """
    canon = load_yaml("sigil-mark/soul-binder/canon-of-flaws.yaml")
    strictness = get_strictness()

    for flaw in canon.flaws:
        if flaw.status != "PROTECTED":
            continue

        for pattern in flaw.affected_code_patterns:
            if matches_pattern(change.file_path, pattern):
                if change_would_break_flaw(change, flaw):
                    if strictness in ["enforcing", "strict"]:
                        return BlockMessage(
                            type="PROTECTED_FLAW",
                            flaw=flaw,
                            options=["Rewrite", "De-Canonize", "Abandon"]
                        )
                    elif strictness == "guiding":
                        return WarningMessage(
                            type="PROTECTED_FLAW",
                            flaw=flaw
                        )
                    else:  # discovery
                        return SuggestionMessage(
                            type="PROTECTED_FLAW",
                            flaw=flaw
                        )

    return None
```

### 6.6 Lens Validation Algorithm

```python
# Pseudocode for lens validation

def validate_across_lenses(asset: Asset) -> ValidationResult:
    """
    Validate an asset across all defined lenses.
    Most constrained lens (lowest priority number) is the truth test.

    Args:
        asset: The asset being validated

    Returns:
        ValidationResult with pass/fail per lens
    """
    lenses = load_yaml("sigil-mark/lens-array/lenses.yaml")
    results = {}

    # Sort by priority (lower = more constrained)
    sorted_lenses = sorted(lenses.lenses, key=lambda l: l.priority)

    for lens in sorted_lenses:
        result = validate_in_lens(asset, lens)
        results[lens.name] = result

        # If most constrained lens fails, entire validation fails
        if lens == sorted_lenses[0] and not result.passed:
            return ValidationResult(
                passed=False,
                blocking_lens=lens.name,
                message=f"Asset fails in {lens.name} (truth test lens)",
                results=results
            )

    return ValidationResult(
        passed=True,
        results=results
    )
```

### 6.7 Consultation Layer Detection

```python
# Pseudocode for determining consultation layer

def determine_consultation_layer(decision: Decision) -> Layer:
    """
    Determine whether a decision is strategic, direction, or execution.

    Args:
        decision: The decision being consulted

    Returns:
        Layer enum: STRATEGIC, DIRECTION, or EXECUTION
    """

    # Strategic indicators
    strategic_keywords = [
        "new feature", "major change", "pivot",
        "add", "remove", "replace", "deprecate"
    ]

    # Direction indicators
    direction_keywords = [
        "style", "visual", "approach", "tone",
        "look", "feel", "direction"
    ]

    # Execution indicators
    execution_keywords = [
        "pixel", "shade", "specific", "exact",
        "implementation", "detail", "polish"
    ]

    # Score each layer
    decision_lower = decision.description.lower()

    strategic_score = sum(1 for k in strategic_keywords if k in decision_lower)
    direction_score = sum(1 for k in direction_keywords if k in decision_lower)
    execution_score = sum(1 for k in execution_keywords if k in decision_lower)

    # Return highest scoring layer
    if strategic_score >= direction_score and strategic_score >= execution_score:
        return Layer.STRATEGIC
    elif direction_score >= execution_score:
        return Layer.DIRECTION
    else:
        return Layer.EXECUTION
```

---

## 7. Error Handling Strategy

### 7.1 Error Categories

| Category | Cause | Agent Response |
|----------|-------|----------------|
| Setup Error | Missing framework files | Guide to `/setup` |
| Config Error | Invalid YAML/Markdown | Show specific syntax issue |
| Validation Error | Constraint violation | Show violation with context |
| State Error | Corrupted state files | Suggest recovery steps |
| User Error | Invalid command usage | Show correct usage |

### 7.2 Error Message Format

```
❌ {ERROR_CATEGORY}

{Clear description of what went wrong}

DETAILS:
{Specific information about the error}

RESOLUTION:
{Step-by-step fix}

If this error persists, check:
- {common cause 1}
- {common cause 2}
```

### 7.3 Graceful Degradation

When optional components are missing, the framework continues with reduced functionality:

| Missing Component | Behavior |
|-------------------|----------|
| `yq` not installed | Fall back to bash YAML parsing |
| `canon-of-flaws.yaml` empty | Skip flaw checking, continue |
| `lenses.yaml` missing | Use default lens, warn user |
| Decision locked | Explain lock, offer unlock check |
| Proving config missing | Skip proving, warn user |

### 7.4 Recovery Procedures

**Corrupted State File:**
```bash
# Agent guidance
The file {path} appears corrupted. Options:

1. Restore from git:
   git checkout HEAD -- {path}

2. Regenerate (loses customizations):
   Run /{relevant_command} again

3. Manual fix:
   Edit {path} to correct the issue at line {line}
```

**Conflicting Decisions:**
```
Two decisions conflict:

DEC-001: {description}
DEC-002: {description}

Both cannot be active. Options:
[Keep DEC-001] [Keep DEC-002] [Escalate to Taste Owner]
```

---

## 8. Testing Strategy

### 8.1 Testing Approach

Sigil v3 is a **documentation-driven framework**—the SKILL.md files ARE the implementation. Testing focuses on:

1. **Skill Validation**: SKILL.md files parse correctly and guide expected behavior
2. **Schema Validation**: YAML files conform to expected schemas
3. **Script Testing**: Helper scripts produce expected outputs
4. **Integration Testing**: Commands → Skills → State changes work end-to-end

### 8.2 Test Types

| Type | Purpose | Method |
|------|---------|--------|
| Schema Tests | YAML files valid | JSON Schema validation |
| Script Tests | Helpers work correctly | Unit tests per script |
| Flow Tests | Commands work e2e | Recorded sessions |
| Regression Tests | Changes don't break existing | Snapshot testing |

### 8.3 Schema Validation

Each YAML schema has a corresponding JSON Schema:

```yaml
# test/schemas/immutable-values.schema.json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["version", "values"],
  "properties": {
    "version": { "type": "string" },
    "values": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "required": ["name", "description", "enforcement"],
        "properties": {
          "name": { "type": "string" },
          "description": { "type": "string" },
          "type": { "enum": ["shared", "project-specific"] },
          "enforcement": {
            "type": "object",
            "required": ["level"],
            "properties": {
              "level": { "enum": ["block", "warn", "review"] }
            }
          }
        }
      }
    }
  }
}
```

### 8.4 Script Testing

Helper scripts include test cases:

```bash
#!/bin/bash
# .claude/scripts/test-get-lens.sh

# Test: Default lens when no match
result=$(./get-lens.sh "src/unknown/file.ts")
expected="power_user"  # Default from config
[[ "$result" == "$expected" ]] || echo "FAIL: default lens"

# Test: Explicit lens match
result=$(./get-lens.sh "src/mobile/component.tsx")
expected="mobile"
[[ "$result" == "$expected" ]] || echo "FAIL: mobile lens"

echo "All tests passed"
```

### 8.5 Integration Test Recording

Commands are tested via recorded sessions:

```yaml
# test/sessions/canonize-flow.yaml
name: "Canonize Double-Click"
command: "/canonize double-click"
steps:
  - agent_asks: "What was the INTENDED behavior?"
    user_responds: "Single click submits"

  - agent_asks: "What ACTUALLY happens?"
    user_responds: "Double click shows ripple"

  - agent_asks: "Usage percentage?"
    user_responds: "40%"

  - agent_asks: "Community attachment?"
    user_responds: "High - users complained when it broke"

expected_output:
  file: "sigil-mark/soul-binder/canon-of-flaws.yaml"
  contains:
    - "FLAW-"
    - "double-click"
    - "PROTECTED"
```

---

## 9. Development Phases

### Phase 1: Foundation (Sprint 1-2)

**Goal:** Core framework setup and Soul Binder pillar

- [ ] Update `/setup` for v3 directory structure
- [ ] Update `/envision` to capture immutable values
- [ ] Implement `canonizing-flaws` skill
- [ ] Implement `checking-flaws` internal skill
- [ ] Create `immutable-values.yaml` schema
- [ ] Create `canon-of-flaws.yaml` schema
- [ ] Implement progressive strictness in all skills
- [ ] Update `/craft` to check values and flaws

**Deliverables:**
- Soul Binder pillar functional
- Protected flaws blocking in enforcing/strict modes
- `/canonize` command working

### Phase 2: Lens Array (Sprint 3)

**Goal:** Multi-lens validation system

- [ ] Extend `/envision` to define lenses
- [ ] Create `lenses.yaml` schema
- [ ] Implement `validating-lenses` internal skill
- [ ] Implement `resolving-conflicts` internal skill
- [ ] Update `/craft` to respect current lens
- [ ] Add lens detection helper script

**Deliverables:**
- Lens Array pillar functional
- Assets validated across all lenses
- Constrained lens as truth test

### Phase 3: Consultation Chamber (Sprint 4)

**Goal:** Layered decision authority

- [ ] Implement `consulting-decisions` skill
- [ ] Implement `locking-decisions` internal skill
- [ ] Create decision record schema
- [ ] Implement time-based unlock
- [ ] Add `/consult` command
- [ ] Integrate with `/craft` for locked decisions

**Deliverables:**
- Consultation Chamber pillar functional
- Three-tier authority working
- Decision locking and unlock

### Phase 4: Proving Grounds (Sprint 5)

**Goal:** Scale validation before graduation

- [ ] Implement `proving-features` skill
- [ ] Implement `monitoring-features` internal skill
- [ ] Implement `graduating-features` skill
- [ ] Create proving status schema
- [ ] Add domain-specific monitors
- [ ] Add `/prove` and `/graduate` commands

**Deliverables:**
- Proving Grounds pillar functional
- Features track proving status
- Graduation requires sign-off

### Phase 5: Polish & Documentation (Sprint 6)

**Goal:** Production-ready release

- [ ] Complete documentation for all commands
- [ ] Add schema validation tests
- [ ] Add script tests
- [ ] Add integration test recordings
- [ ] Performance optimization
- [ ] Error message refinement
- [ ] Migration guide from v2

**Deliverables:**
- All tests passing
- Documentation complete
- Migration path clear

---

## 10. Known Risks and Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Over-complex configuration | Medium | High | Interview-generated config; start simple |
| Users skip interviews | Medium | Medium | Show value immediately; progressive disclosure |
| Protected flaws block legitimate work | Low | High | Clear de-canonization path; human override |
| Lens array too complex | Medium | Medium | Default to single lens; add complexity gradually |
| Strictness feels arbitrary | Low | Medium | Clear documentation; user controls level |
| State file corruption | Low | High | Git-based recovery; validation on load |
| Skill behavior inconsistent | Medium | Medium | Extensive testing; recorded sessions |

### Assumptions

1. Teams have a designated Taste Owner
2. Projects use Git for version control
3. Claude Code (or compatible) is the agent runtime
4. Users will engage with interview flows
5. Strictness escalation is gradual, not sudden

### Technical Debt Awareness

- v2 → v3 migration requires manual intervention
- Some v2 concepts (zones) deprecated in favor of lenses
- Helper scripts need comprehensive testing
- Schema versioning needs long-term strategy

---

## 11. Open Questions

| Question | Owner | Status |
|----------|-------|--------|
| How to handle multi-repo shared soul? | Architecture | Open |
| Should lenses support inheritance? | Architecture | Open |
| What's the de-canonization approval mechanism? | Product | Open |
| How to visualize proving status? | Design | Open |
| Should strictness auto-escalate based on maturity? | Product | Open |

---

## 12. Appendix

### A. Glossary

| Term | Definition |
|------|------------|
| **Canon of Flaws** | Registry of protected emergent behaviors |
| **Immutable Value** | Core principle that triggers enforcement |
| **Lens** | User perspective that interprets the same core |
| **Proving Grounds** | Scale validation environment |
| **Taste Owner** | Person with final authority in a domain |
| **Soul Binder** | System protecting intended + emergent soul |
| **Progressive Strictness** | Framework behavior that tightens over time |
| **Consultation Chamber** | Layered authority for decisions |
| **Graduation** | Promotion from proving to production |

### B. File Path Reference

| Path | Purpose |
|------|---------|
| `.sigilrc.yaml` | Framework configuration |
| `.sigil-setup-complete` | Setup marker |
| `.sigil-version.json` | Version tracking |
| `sigil-mark/moodboard.md` | Product feel and references |
| `sigil-mark/rules.md` | Design rules |
| `sigil-mark/inventory.md` | Component list |
| `sigil-mark/soul-binder/` | Values, flaws, grit |
| `sigil-mark/lens-array/` | Lens definitions |
| `sigil-mark/consultation-chamber/` | Decisions and locks |
| `sigil-mark/proving-grounds/` | Proving status |
| `sigil-mark/canon/` | Graduated features |
| `sigil-mark/audit/` | Override log |

### C. Migration from v2

1. Backup existing `sigil-mark/` directory
2. Run `/setup` to create v3 structure
3. Existing `moodboard.md` and `rules.md` are preserved
4. Run `/envision` to add immutable values
5. Zones in `.sigilrc.yaml` become suggested lenses
6. Manual review of deprecated zone references

### D. References

**Internal:**
- PRD: `loa-grimoire/prd.md`
- Reality Engine Spec: `loa-grimoire/context/reality-engine/`
- Sigil v2 Skills: `.claude/skills/`

**External:**
- Claude Code Documentation: https://docs.anthropic.com/claude-code
- YAML 1.2 Spec: https://yaml.org/spec/1.2.2/
- CommonMark Spec: https://commonmark.org/

### E. Change Log

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-01-02 | Initial SDD for Sigil v3 | Architecture Designer |

---

*Generated by Architecture Designer Agent*
*Sigil v3: Culture is the Reality. Code is Just the Medium.*
