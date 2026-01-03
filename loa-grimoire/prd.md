# Product Requirements Document: Sigil v3 — Constitutional Design Framework

**Version:** 1.0
**Date:** 2026-01-02
**Author:** PRD Architect Agent
**Status:** Draft
**Branch:** feature/constitutional-design-framework

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Problem Statement](#problem-statement)
3. [Goals & Success Metrics](#goals--success-metrics)
4. [User Personas & Use Cases](#user-personas--use-cases)
5. [Functional Requirements](#functional-requirements)
6. [Non-Functional Requirements](#non-functional-requirements)
7. [Architecture Overview](#architecture-overview)
8. [The Four Pillars](#the-four-pillars)
9. [Command Design](#command-design)
10. [Configuration System](#configuration-system)
11. [Scope & Prioritization](#scope--prioritization)
12. [Success Criteria](#success-criteria)
13. [Risks & Mitigation](#risks--mitigation)
14. [Appendix](#appendix)

---

## Executive Summary

Sigil v3 is a **Constitutional Design Framework** that addresses the root cause of design inconsistency: tacit knowledge and opinionated design that lives in people's heads rather than in enforceable systems. Unlike traditional design systems that document rules after they're broken, Sigil v3 provides governance that emerges from discovery interviews and evolves with the product.

This represents a complete replacement of Sigil v2, incorporating concepts from the Reality Engine specification and adapting them for an OSS-friendly, domain-agnostic framework. The core insight is that **culture is the reality—code is just the medium**. For high-affinity products (DeFi/Web3, creative tools, community platforms, games), the most important design constraints are often unwritten, emergent, and cultural.

Sigil v3 introduces four pillars: **Soul Binder** (protecting intended + emergent behavior), **Lens Array** (supporting multiple user truths), **Consultation Chamber** (layered authority for decisions), and **Proving Grounds** (scale validation before graduation). The framework uses progressive strictness—starting gentle with new projects and tightening as the product matures.

---

## Problem Statement

### The Problem

Design systems fail to prevent inconsistency because they treat the **symptom** (inconsistent outputs) rather than the **disease** (tacit knowledge trapped in people's heads). Traditional approaches assume:

| Assumption | Reality |
|------------|---------|
| Documentation = Governance | Writing rules doesn't enforce them |
| Consistency = Matching specs | Consistency = Matching the *feel* |
| Bugs should always be fixed | Some bugs become skill expression |
| Internal testing catches issues | Scale reveals what 50 people can't |
| Democratic polling ensures approval | Committees produce average; taste requires ownership |

### User Pain Points

- **Tacit knowledge drain**: When key designers leave, the "why" behind decisions leaves with them
- **Emergent behavior destruction**: Well-meaning optimizations break beloved "bugs" that became features
- **Design-by-committee paralysis**: Every visual decision becomes a poll, producing bland consensus
- **Zone confusion**: Developers don't know which rules apply where
- **Grit vs polish mismatch**: Assets pass technical checks but fail cultural checks ("Play-Doh" problem)
- **Scale surprises**: Features that worked in testing break at production scale

### Current State (Sigil v2)

Sigil v2 provides:
- Zone-based context (critical, marketing, admin)
- Moodboard capture through interviews
- Rule codification
- Pattern warnings (not blocks)

**Limitations:**
- Zones are static path-based, not user-perspective based
- No protection for emergent behaviors (Canon of Flaws)
- No scale validation (Proving Grounds)
- No layered consultation authority
- All enforcement is advisory, none is blocking

### Desired State (Sigil v3)

A constitutional framework where:
- **Core values** are defined through discovery and hard-block violations
- **Emergent behaviors** are protected in a Canon of Flaws
- **Multiple user truths** (lenses) coexist, with validation in the most constrained lens
- **Decisions are layered**: Poll strategic, consult direction, dictate execution
- **Scale validates features** before graduation to production
- **Progressive strictness** allows greenfield projects to grow without friction

---

## Goals & Success Metrics

### Primary Goals

1. **Constitutional Governance** — Design rules emerge from interviews and are enforced, not just documented
2. **Emergent Soul Protection** — Beloved "bugs" are registered and protected from optimization
3. **Multi-Truth Support** — Different user personas (lenses) see different interpretations of the same core
4. **Layered Authority** — Strategic decisions are polled, direction consulted, execution dictated
5. **Scale Validation** — Features prove themselves in public beta before graduating

### Key Performance Indicators (KPIs)

| Metric | Baseline | Target | Measurement |
|--------|----------|--------|-------------|
| Protected Flaw Violations | N/A | 0 blocked attempts | Agent logs |
| Lens Validation Pass Rate | N/A | 100% assets pass constrained lens | CI checks |
| Decision Lock Rate | N/A | 100% direction decisions lock execution | Consultation logs |
| Proving Grounds Graduation | N/A | 90% features graduate without rollback | Proving logs |
| Tacit Knowledge Captured | 0% | 80% of design decisions documented | Interview coverage |

### Constraints

- **OSS-friendly**: Framework must work without proprietary dependencies
- **Domain-agnostic**: Concepts must translate across DeFi, creative tools, games, community platforms
- **Interview-generated**: Configuration created through discovery, not manual YAML editing
- **Human accountability**: All validation results in human review, not automated blocking
- **Progressive strictness**: New projects start gentle, mature projects can be strict

---

## User Personas & Use Cases

### Primary Persona: Design Lead (Taste Owner)

**Demographics:**
- Role: Design lead, art director, or product owner with final visual authority
- Technical Proficiency: Medium—comfortable with design tools, config files
- Goals: Ship consistent products without being a bottleneck

**Behaviors:**
- Makes final calls on visual direction after gathering input
- Defines what "feels right" for the product
- Signs off on pattern approvals and deviations

**Pain Points:**
- Getting pulled into every micro-decision
- Losing context when decisions need revisiting
- Knowledge leaving with departing team members

---

### Secondary Persona: Product Engineer

**Demographics:**
- Role: Full-stack or frontend developer implementing UI
- Technical Proficiency: High—works in code daily
- Goals: Build features without violating design patterns

**Behaviors:**
- Implements UI from designs or specifications
- Needs quick guidance on pattern application
- Wants to know zone/lens before coding

**Pain Points:**
- Not knowing which rules apply in current context
- Breaking patterns unknowingly
- Getting design feedback late in implementation

---

### Tertiary Persona: Community/Product Manager

**Demographics:**
- Role: Manages community feedback and product direction
- Technical Proficiency: Low—uses tools, not code
- Goals: Channel community input without design-by-committee

**Behaviors:**
- Gathers sentiment through polls, forums, Discord
- Presents options to community
- Documents community response

**Pain Points:**
- Every decision becoming a poll
- Vocal minorities driving decisions
- Difficulty closing discussions after decisions

---

### Use Cases

#### UC-1: Initialize Framework on New Project

**Actor:** Design Lead
**Preconditions:** Empty or early-stage project with no Sigil setup
**Flow:**
1. Run `/setup` to initialize Sigil v3 framework
2. System creates `sigil-mark/` directory structure
3. System creates `.sigilrc.yaml` with default configuration
4. User is prompted to run `/envision` or `/inherit`

**Postconditions:** Project has Sigil v3 scaffolding ready for configuration
**Acceptance Criteria:**
- [ ] `sigil-mark/` directory created with subdirectories
- [ ] `.sigilrc.yaml` created with version and defaults
- [ ] `.sigil-setup-complete` marker file created

---

#### UC-2: Capture Product Soul (Moodboard + Values)

**Actor:** Design Lead
**Preconditions:** Sigil v3 initialized
**Flow:**
1. Run `/envision`
2. Agent interviews about reference products, feel descriptors, anti-patterns
3. Agent interviews about core values (shared + project-specific)
4. Agent generates `sigil-mark/moodboard.md` and `sigil-mark/soul-binder/immutable-values.yaml`
5. User reviews and `/approve`

**Postconditions:** Product soul captured in structured files
**Acceptance Criteria:**
- [ ] Moodboard contains references, feels, anti-patterns
- [ ] Immutable values defined with enforcement rules
- [ ] Files ready for agent consumption

---

#### UC-3: Register an Emergent Behavior (Canon of Flaws)

**Actor:** Design Lead or Engineer
**Preconditions:** An unintended behavior has become beloved/expected
**Flow:**
1. Run `/canonize <behavior>`
2. Agent interviews about intended vs emergent behavior
3. Agent asks about usage percentage, contexts, community attachment
4. Agent adds to `sigil-mark/soul-binder/canon-of-flaws.yaml`
5. User `/approve` the canonization

**Postconditions:** Behavior registered as protected flaw
**Acceptance Criteria:**
- [ ] Flaw added with ID, description, affected code patterns
- [ ] Protection rule defined
- [ ] Taste Owner notified

---

#### UC-4: Get Design Guidance During Implementation

**Actor:** Product Engineer
**Preconditions:** Working on UI code, Sigil v3 configured
**Flow:**
1. Run `/craft` with current file context
2. Agent detects current lens (from path or user profile)
3. Agent loads relevant moodboard, rules, and values
4. Agent provides contextual guidance
5. If pattern deviates, agent explains concern and offers alternatives
6. User can proceed anyway (warning) or follow suggestion

**Postconditions:** Engineer has context-aware guidance
**Acceptance Criteria:**
- [ ] Correct lens/context detected
- [ ] Relevant rules surfaced
- [ ] Deviations explained, not blocked
- [ ] Escape hatch always available

---

#### UC-5: Validate Feature in Proving Grounds

**Actor:** Design Lead
**Preconditions:** Feature ready for scale testing
**Flow:**
1. Run `/prove <feature>`
2. Agent registers feature in `sigil-mark/proving-grounds/active/`
3. Feature deploys to testnet/beta environment
4. Monitors run for configured duration (default 7 days)
5. On clean run, `/graduate` promotes to production

**Postconditions:** Feature validated at scale before production
**Acceptance Criteria:**
- [ ] Feature registered with monitors
- [ ] Duration tracked
- [ ] Violations flagged with context
- [ ] Graduation requires sign-off

---

## Functional Requirements

### FR-1: Soul Binder — Immutable Values

**Priority:** Must Have
**Description:** Define and enforce core product values that cannot be violated.

**Behavior:**
- Values defined through `/envision` interview
- Shared values (security, accessibility) + project-specific values
- Enforcement levels: `block`, `warn`, `review`
- Agent checks all changes against values before proceeding

**Acceptance Criteria:**
- [ ] Values captured in `sigil-mark/soul-binder/immutable-values.yaml`
- [ ] Agent surfaces violations with value name and constraint
- [ ] Block-level violations prevent agent from proceeding
- [ ] Warn-level violations explained with escape hatch

**Configuration:**
```yaml
values:
  security:
    name: "Security First"
    description: "No compromises on user safety"
    enforcement:
      type: "metric"
      constraints:
        - name: "no_exposed_keys"
          pattern: "*api*key*|*secret*"
          action: "block"
```

---

### FR-2: Soul Binder — Canon of Flaws

**Priority:** Must Have
**Description:** Register and protect emergent behaviors that became expected.

**Behavior:**
- Flaws registered through `/canonize` interview
- Each flaw has: ID, description, intended vs emergent behavior, affected patterns
- Agent checks code changes against affected patterns
- Matching changes are blocked with explanation

**Acceptance Criteria:**
- [ ] Flaws captured in `sigil-mark/soul-binder/canon-of-flaws.yaml`
- [ ] Agent detects changes affecting protected flaws
- [ ] Block message includes flaw context and options
- [ ] De-canonization requires explicit process

**Block Message Format:**
```
⚠️ PROTECTED FLAW AFFECTED

Your change would impact: {flaw_name} (FLAW-{id})

INTENDED: {intended_behavior}
EMERGENT: {emergent_behavior} ← This is protected

Context: {why_protected}

Options:
[Rewrite to Preserve] [Request De-Canonization] [Abandon]
```

---

### FR-3: Soul Binder — Visual Soul (Grit Validation)

**Priority:** Should Have
**Description:** Detect "Play-Doh" problem—assets that pass technical checks but fail cultural feel.

**Behavior:**
- Grit signatures defined per-project through interview
- Can be brand signature and/or anti-pattern detection
- For DeFi: includes safety-focused visual cues
- Validation produces visual comparison for human review

**Acceptance Criteria:**
- [ ] Grit signatures defined in `sigil-mark/soul-binder/visual-soul.yaml`
- [ ] Agent can compare assets against signatures
- [ ] Results are visual diffs, not automated scores
- [ ] Human makes final call on grit compliance

---

### FR-4: Lens Array — Multiple User Truths

**Priority:** Must Have
**Description:** Support multiple coexisting interpretations of the same core product.

**Behavior:**
- Lenses represent user perspectives/avatars (not static zones)
- Examples: Power User, Newcomer, Mobile, Accessibility
- All lenses validated simultaneously
- Most constrained lens is the truth test

**Acceptance Criteria:**
- [ ] Lenses defined in `sigil-mark/lens-array/lenses.yaml`
- [ ] Each lens has constraints and target audience
- [ ] Validation runs in most constrained lens first
- [ ] If constrained lens fails, asset is rejected

**Lens Definition:**
```yaml
lenses:
  power_user:
    name: "Power User"
    description: "Experienced users who want efficiency"
    priority: 1  # Truth test
    constraints:
      - "keyboard_shortcuts_available"
      - "dense_information_display"

  newcomer:
    name: "Newcomer"
    description: "First-time users who need guidance"
    priority: 2
    constraints:
      - "clear_onboarding_flow"
      - "contextual_help_available"
```

---

### FR-5: Lens Array — Immutable Properties

**Priority:** Must Have
**Description:** Define properties that remain constant across all lenses.

**Behavior:**
- Certain properties cannot change between lenses
- Examples: hitboxes, timing, security, core logic
- Agent blocks lens variations that modify immutable properties

**Acceptance Criteria:**
- [ ] Immutable properties defined in lens configuration
- [ ] Agent detects attempts to vary immutable properties
- [ ] Clear error explains what cannot vary

---

### FR-6: Consultation Chamber — Layered Authority

**Priority:** Must Have
**Description:** Implement three-tier decision authority to prevent design-by-committee.

**Layers:**

| Layer | Type | Process | Authority |
|-------|------|---------|-----------|
| Strategic | New features, major changes | Community poll | Binding vote |
| Direction | Visual style A vs B, tone | Sentiment gathering | Taste Owner decides |
| Execution | Pixel-level details | None | Taste Owner dictates |

**Behavior:**
- `/consult` starts consultation process
- Agent determines appropriate layer
- For Direction: generates comparison, gathers sentiment, presents to Taste Owner
- After decision: **LOCK** — no further polling on execution details

**Acceptance Criteria:**
- [ ] Layer determined by decision scope
- [ ] Direction layer produces sentiment summary
- [ ] Taste Owner decision recorded with reasoning
- [ ] Locked decisions cannot be reopened without explicit process

---

### FR-7: Consultation Chamber — Time-Based Unlock

**Priority:** Should Have
**Description:** Locked decisions can be reconsidered after configured duration.

**Behavior:**
- Each decision has a lock duration (default: per-feature configured)
- After duration, decision can be revisited
- Revisit requires new consultation, not automatic unlock

**Acceptance Criteria:**
- [ ] Lock duration configurable per decision
- [ ] System tracks decision dates
- [ ] Unlock prompts for new consultation, not automatic override

---

### FR-8: Proving Grounds — Scale Validation

**Priority:** Must Have
**Description:** Validate features at scale before production graduation.

**Behavior:**
- `/prove <feature>` registers feature for validation
- Monitors track metrics relevant to product type
- Duration configurable (default: 7 days)
- Clean run enables `/graduate`

**Monitors by Domain:**

| Domain | Monitors |
|--------|----------|
| DeFi/Web3 | TVL changes, transaction patterns, slippage anomalies, exploit detection |
| Creative Tools | Performance degradation, crash rates, export success |
| Community Platforms | Engagement drops, report spikes, load patterns |
| Games | Economy health, exploit radar, balance metrics |

**Acceptance Criteria:**
- [ ] Features registered in `sigil-mark/proving-grounds/active/`
- [ ] Monitors run throughout proving period
- [ ] Violations produce alerts with context
- [ ] Graduation requires sign-off from Taste Owner

---

### FR-9: Proving Grounds — Graduation

**Priority:** Must Have
**Description:** Promote proven features to production with sign-off.

**Behavior:**
- `/graduate <feature>` checks proving status
- Requires clean run + Taste Owner approval
- Successful graduation adds to Living Canon
- Failed features blocked from production

**Acceptance Criteria:**
- [ ] Graduation checks proving period complete
- [ ] All monitors must be green
- [ ] Taste Owner sign-off required
- [ ] Graduated features recorded in Canon

---

### FR-10: Progressive Strictness

**Priority:** Must Have
**Description:** Framework starts gentle with new projects and tightens as product matures.

**Behavior:**
- New projects begin in "discovery" mode—suggestions only
- As more decisions are made and locked, enforcement increases
- Mature projects can enable "strict" mode with hard blocks
- Strictness level configurable in `.sigilrc.yaml`

**Levels:**
1. **Discovery** — All suggestions, no blocks
2. **Guiding** — Warnings on violations, optional blocks on critical
3. **Enforcing** — Blocks on protected flaws and immutable values
4. **Strict** — Blocks on all violations, requires approval for overrides

**Acceptance Criteria:**
- [ ] Strictness level configurable
- [ ] Agent behavior adjusts to level
- [ ] Level can increase but requires explicit decrease

---

### FR-11: Interview-Generated Configuration

**Priority:** Must Have
**Description:** All configuration emerges from discovery interviews, not manual YAML editing.

**Behavior:**
- Commands like `/envision`, `/codify`, `/canonize` conduct interviews
- Agent generates YAML from interview responses
- User reviews and approves generated config
- Manual editing possible but not required

**Acceptance Criteria:**
- [ ] All core config can be generated through interviews
- [ ] Generated YAML is valid and complete
- [ ] User can edit manually if desired
- [ ] Changes tracked with authorship

---

### FR-12: Human Accountability

**Priority:** Must Have
**Description:** All validation results in human review, not pure automation.

**Behavior:**
- Blocks surface issues but don't prevent human override
- Approvals require explicit human sign-off
- Taste Owner has final authority with documented reasoning
- Audit trail captures all decisions

**Acceptance Criteria:**
- [ ] All blocks have escape hatch to human
- [ ] Approvals recorded with approver identity
- [ ] Override reasoning captured
- [ ] Audit log maintained

---

## Non-Functional Requirements

### Performance
- Agent response time < 3 seconds for guidance requests
- Validation runs < 30 seconds for typical projects
- No blocking on cold start

### Scalability
- Support projects with 1000+ components
- Support teams with 50+ contributors
- Configuration files remain human-readable at scale

### Security
- No secrets in configuration files
- Proving Grounds monitors don't expose sensitive data
- Security as Immutable Value, not optional lens

### Reliability
- Framework works offline after initial setup
- Graceful degradation if files missing
- Clear error messages on configuration issues

### Compatibility
- Works with any tech stack (framework-agnostic)
- Integrates with Claude Code, Cursor, other Claude-powered tools
- Configuration in YAML/Markdown (universal formats)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            SIGIL v3                                     │
│           "Culture is the Reality. Code is Just the Medium."           │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                    THE SOUL BINDER (Metaphysics)                        │
│                                                                         │
│   ┌─────────────────────────┬─────────────────────────┐                │
│   │    IMMUTABLE VALUES     │    CANON OF FLAWS       │                │
│   │    (Intended Soul)      │    (Emergent Soul)      │                │
│   └─────────────────────────┴─────────────────────────┘                │
│                                                                         │
│   + Visual Soul (Grit Signatures / Brand Safety)                       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                    THE LENS ARRAY (Interpretations)                     │
│                                                                         │
│   User Personas as Lenses (Power User, Newcomer, Mobile, A11y)         │
│   All validated simultaneously. Most constrained = truth test.         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                THE CONSULTATION CHAMBER (Soft Poll)                     │
│                                                                         │
│   Strategic (polled) → Direction (consulted) → Execution (dictated)    │
│   After decision → LOCK (time-based unlock available)                  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                  THE PROVING GROUNDS (Public Beta)                      │
│                                                                         │
│   Monitors: Domain-specific (DeFi, Creative, Community, Game)          │
│   Graduation: Duration clean + Taste Owner sign-off → Canon            │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                       THE LIVING CANON                                  │
│                                                                         │
│   Graduated features + Approved patterns + Cultural precedent          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## The Four Pillars

### Pillar 1: Soul Binder

**Purpose:** Protect both intended AND emergent product soul.

**Components:**

1. **Immutable Values** — Core principles that hard-block violations
   - Shared values (security, accessibility)
   - Project-specific values defined through interview
   - Enforcement: block / warn / review

2. **Canon of Flaws** — Emergent behaviors that became expected
   - Criteria: Community attachment, skill expression, removal causes backlash
   - Protection: Agent blocks "fixes" that would break protected flaws
   - De-canonization: Requires explicit high-bar process

3. **Visual Soul** — Cultural signatures beyond technical specs
   - Brand signature enforcement
   - Anti-pattern detection (Play-Doh, off-brand)
   - For DeFi: Safety-focused visual cues
   - Enforcement: Visual comparison for human review

**Key Insight:** A perfect recreation of the intended design would be soulless. The emergent "jank" IS the product.

---

### Pillar 2: Lens Array

**Purpose:** Support multiple coexisting user truths.

**Concept:**
- Lenses replace static zones
- Lenses represent user perspectives/avatars
- Users can literally switch lenses (via browser extension, config)
- All lenses validated simultaneously

**Lens Types (Examples):**

| Lens | Description | Constraints |
|------|-------------|-------------|
| Power User | Experienced, efficiency-focused | Keyboard shortcuts, dense display |
| Newcomer | First-time, needs guidance | Onboarding, contextual help |
| Mobile | Touch-first, limited screen | Touch targets, responsive |
| Accessibility | Assistive tech users | Screen reader, high contrast |

**Rules:**
- Lenses are **additive** (can combine)
- Lenses **cannot alter** core logic, security, immutable properties
- Most constrained lens = truth test
- If it breaks in constrained lens, it's rejected

---

### Pillar 3: Consultation Chamber

**Purpose:** Get stakeholder input without design-by-committee.

**The Spectrum:**

| Layer | Scope | Process | Authority |
|-------|-------|---------|-----------|
| **Strategic** | Major features, pivots | Community poll (Linear, Discord) | Binding vote |
| **Direction** | Visual style, tone | Sentiment gathering | Taste Owner decides |
| **Execution** | Pixel-level details | None | Taste Owner dictates |

**Process:**
1. Determine layer based on decision scope
2. For Direction: Generate comparison, gather sentiment
3. Present to Taste Owner with context
4. Decision made (can override sentiment with documented reasoning)
5. **LOCK** execution — no further polling on details
6. Time-based unlock allows future revisitation

**Key Insight:** You can't ignore sentiment, but you also can't poll every detail. The solution is layered authority.

---

### Pillar 4: Proving Grounds

**Purpose:** Catch issues that only emerge at scale.

**Why Internal Testing Fails:**
- 50 people can't simulate 1M user behavior
- Internal teams don't stress-test adversarially
- Scale reveals emergent behaviors

**Process:**
1. `/prove <feature>` registers for validation
2. Deploy to testnet/beta environment
3. Monitors run for configured duration
4. On clean run, `/graduate` promotes to production

**Domain-Specific Monitors:**

| Domain | Monitors |
|--------|----------|
| DeFi/Web3 | TVL changes, transaction patterns, slippage, exploit detection |
| Creative Tools | Performance, crash rates, export success |
| Community Platforms | Engagement, reports, load patterns |
| Games | Economy health, exploit radar, balance |

**Graduation:**
- Duration complete
- All monitors green
- Taste Owner sign-off
- Promoted to Living Canon

---

## Command Design

### Core Commands

| Command | Purpose | Output |
|---------|---------|--------|
| `/setup` | Initialize Sigil v3 on project | Directory structure, config files |
| `/envision` | Capture product soul (moodboard + values) | `moodboard.md`, `immutable-values.yaml` |
| `/codify` | Define design rules | `rules.md`, component patterns |
| `/craft` | Get design guidance | Contextual recommendations |
| `/approve` | Human review and sign-off | Approval record |

### Extended Commands

| Command | Purpose | Output |
|---------|---------|--------|
| `/canonize <behavior>` | Register protected flaw | Entry in `canon-of-flaws.yaml` |
| `/consult <decision>` | Start consultation process | Sentiment summary, decision record |
| `/prove <feature>` | Deploy to Proving Grounds | Monitor registration |
| `/graduate <feature>` | Check graduation status | Promotion or block |
| `/inherit` | Bootstrap from existing codebase | Initial configuration |
| `/update` | Pull framework updates | Updated skills/templates |

### Command Philosophy

Commands align with Sigil principles:
- **Interview-driven**: Configuration emerges from discovery
- **Progressive**: Start with `/setup`, grow with `/envision`, mature with `/prove`
- **Human-accountable**: All critical actions require `/approve`
- **Escapable**: Warnings explain concerns but don't prevent action

---

## Configuration System

### Directory Structure

```
project/
├── CLAUDE.md                        # Agent instructions
├── .sigilrc.yaml                    # Framework configuration
├── .sigil-setup-complete            # Setup marker
│
└── sigil-mark/
    │
    ├── moodboard.md                 # Product feel, references, anti-patterns
    ├── rules.md                     # Design rules by category
    ├── inventory.md                 # Component inventory
    │
    ├── soul-binder/
    │   ├── immutable-values.yaml    # Core values (intended soul)
    │   ├── canon-of-flaws.yaml      # Protected flaws (emergent soul)
    │   └── visual-soul.yaml         # Grit signatures
    │
    ├── lens-array/
    │   └── lenses.yaml              # Lens definitions
    │
    ├── consultation-chamber/
    │   ├── config.yaml              # Consultation process config
    │   └── decisions/               # Recorded decisions with locks
    │
    ├── proving-grounds/
    │   ├── config.yaml              # Monitor configuration
    │   └── active/                  # Features currently proving
    │
    └── canon/
        └── graduated/               # Features that passed proving
```

### Configuration Format

**`.sigilrc.yaml`:**
```yaml
version: "3.0"
strictness: "guiding"  # discovery | guiding | enforcing | strict

taste_owners:
  design:
    name: "Design Lead"
    scope: ["sigil-mark/**", "src/components/**"]
  security:
    name: "Security Lead"
    scope: ["**/*.sol", "src/auth/**"]

domains:
  - "defi"  # Enables DeFi-specific monitors

consultation:
  internal_tool: "linear"  # Where direction discussions happen
  community_channels:
    - type: "discord"
      channel: "#design-feedback"

proving:
  default_duration_days: 7
  monitors:
    - "tvl_changes"
    - "transaction_patterns"
    - "exploit_detection"
```

### Interview-Generated Files

All YAML configuration is generated through interview commands:
- `/envision` → `moodboard.md`, `immutable-values.yaml`
- `/codify` → `rules.md`, `visual-soul.yaml`
- `/canonize` → `canon-of-flaws.yaml`
- User reviews and approves; manual editing always available

---

## Scope & Prioritization

### In Scope (V1 - MVP)

1. **Soul Binder**
   - Immutable Values (interview-generated)
   - Canon of Flaws (registration + protection)
   - Visual Soul (basic grit detection)

2. **Lens Array**
   - Lens definitions (user personas)
   - Constrained lens validation
   - Immutable properties

3. **Consultation Chamber**
   - Three-tier authority model
   - Decision locking
   - Time-based unlock

4. **Proving Grounds**
   - Feature registration
   - Basic monitors (domain-configurable)
   - Graduation with sign-off

5. **Core Commands**
   - `/setup`, `/envision`, `/codify`, `/craft`, `/approve`
   - `/canonize`, `/consult`, `/prove`, `/graduate`

6. **Progressive Strictness**
   - Four levels: discovery → guiding → enforcing → strict
   - Level-appropriate enforcement

### In Scope (V2 - Future)

- **Motion Recipes**: Motion/animation by lens
- **Sound Guidance**: Audio design patterns
- **CI/CD Integration**: Automated checks in pipelines
- **Multi-Repo Governance**: Shared soul across monorepos
- **Analytics Dashboard**: Visualize decisions, violations, graduations

### Explicitly Out of Scope

- **Automated design generation**: Sigil governs, doesn't create
- **Image/asset generation**: Focus on rules, not pixels
- **Design tokens sync**: Use dedicated tools (Style Dictionary, etc.)
- **Figma integration**: V2 consideration
- **Non-Claude agents**: Built for Claude-powered tools

### Priority Matrix

| Feature | Priority | Effort | Impact |
|---------|----------|--------|--------|
| Immutable Values | P0 | M | High |
| Canon of Flaws | P0 | M | High |
| Lens Array | P0 | L | High |
| Consultation Chamber | P1 | M | High |
| Proving Grounds | P1 | L | Medium |
| Progressive Strictness | P0 | S | High |
| Visual Soul (Grit) | P1 | M | Medium |
| Time-Based Unlock | P2 | S | Low |

---

## Success Criteria

### Launch Criteria

- [ ] All P0 features implemented and tested
- [ ] `/setup` → `/envision` → `/craft` flow works end-to-end
- [ ] Canon of Flaws correctly blocks protected flaw violations
- [ ] Lens validation runs in most constrained lens first
- [ ] Progressive strictness adjusts agent behavior correctly
- [ ] Documentation covers all commands and concepts

### Post-Launch Success (30 days)

- [ ] 3+ projects using Sigil v3 in production
- [ ] 0 protected flaw violations in production
- [ ] 90%+ graduation rate for proven features
- [ ] Positive feedback on interview-generated config
- [ ] No critical bugs or breaking issues

### Long-term Success (90 days)

- [ ] 10+ projects adopted Sigil v3
- [ ] Canon of Flaws used to protect at least 1 emergent behavior per project
- [ ] Consultation Chamber reduced design-by-committee discussions
- [ ] Proving Grounds caught at least 1 issue before production
- [ ] Framework iterated based on real usage feedback

---

## Risks & Mitigation

| Risk | Probability | Impact | Mitigation Strategy |
|------|-------------|--------|---------------------|
| Over-engineering for edge cases | Medium | Medium | Start with MVP, iterate based on real usage |
| Configuration complexity overwhelming users | Medium | High | Interview-generated config, progressive disclosure |
| Protected flaws blocking legitimate improvements | Low | High | Clear de-canonization process, human override |
| Lens array too complex for simple projects | Medium | Medium | Single default lens for simple projects |
| Proving Grounds monitors too specific per domain | Medium | Medium | Configurable monitors, start with basics |
| Progressive strictness feels arbitrary | Low | Medium | Clear documentation on levels, configurable |

### Assumptions

- Teams have a designated Taste Owner (design lead equivalent)
- Projects benefit from explicit design governance
- Claude-powered tools remain the primary agent interface
- Users will complete interview flows rather than skip them

### Dependencies

- Claude Code / Cursor / Claude-powered IDE
- Git-based version control (for state tracking)
- YAML/Markdown editing capability

---

## Appendix

### A. Architectural Evolution

Sigil v3 incorporates learnings from 11 architectural iterations:

| # | Approach | Fatal Flaw |
|---|----------|------------|
| 1 | Documentation | Capture ≠ Governance |
| 2 | Democratic Voting | Voting ≠ Taste |
| 3 | Single Dictator | Bus factor |
| 4 | Dashboard | Out of sight = ignored |
| 5 | In-Context Cop | Reactive fear |
| 6 | Perfect Replication | Prevents evolution |
| 7 | AI Judgment | AI sees patterns, not soul |
| 8 | Single Canon | Multiple truths coexist |
| 9 | Archived Eras | Past is runtime, not history |
| 10 | Physics-Only | Forgot metaphysics |
| 11 | **Reality Engine** | Culture is the reality |

### B. Domain Adaptation

**DeFi/Web3:**
- Immutable Value: Security (no exposed keys, no unsafe patterns)
- Monitors: TVL, slippage, exploit detection
- Lens: Power User (dense), Newcomer (guided), Mobile (simplified)

**Creative Tools:**
- Immutable Value: Performance (no blocking operations)
- Monitors: Crash rate, export success, memory usage
- Lens: Pro (full features), Lite (streamlined), Mobile

**Community Platforms:**
- Immutable Value: Safety (moderation, reporting)
- Monitors: Engagement, report spikes, load patterns
- Lens: Creator, Consumer, Moderator

**Games:**
- Immutable Value: Balance (no pay-to-win)
- Monitors: Economy health, exploit radar, progression rates
- Lens: Competitive, Casual, Spectator

### C. Glossary

| Term | Definition |
|------|------------|
| **Canon of Flaws** | Registry of protected emergent behaviors |
| **Immutable Value** | Core principle that hard-blocks violations |
| **Lens** | User perspective/avatar that interprets the same core |
| **Proving Grounds** | Scale validation environment before production |
| **Taste Owner** | Person with final authority on design decisions in a domain |
| **Soul Binder** | System that protects intended + emergent soul |
| **Progressive Strictness** | Framework behavior that tightens as project matures |
| **Consultation Chamber** | Layered authority system for decisions |

### D. References

**Internal:**
- Reality Engine Spec v1.0.0: `loa-grimoire/context/reality-engine/`
- Sigil v2 Documentation: `CLAUDE.md`, `.claude/skills/`

**External:**
- Old School RuneScape: Polling system, Canon of Flaws examples
- Linear: Opinionated design, rejecting A/B testing
- Jagex Polling Charter: Visual direction authority

---

*Generated by PRD Architect Agent*
*Sigil v3: Culture is the Reality. Code is Just the Medium.*
