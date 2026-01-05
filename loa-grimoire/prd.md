# Product Requirements Document: Sigil v1.0

> "Physics, not opinions. Constraints, not debates."

**Version**: 1.0.0
**Date**: 2026-01-04
**Status**: Draft

---

## Executive Summary

Sigil v1.0 is a Design Physics Engine that gives AI agents physics constraints for consistent design decisions. This version introduces the Sigil Workbench—a real-time design environment that eliminates tab-switching and provides instant feedback on physics compliance.

**Target User**: Solo developer using Claude Code for AI-assisted UI development.

**Core Value Proposition**: Every UI generation respects your product's physics automatically. No more correction cycles. No more design debates.

---

## 1. Problem Statement

### The Pain

When building UI with AI agents, design consistency breaks down because:

1. **No component visibility** — Hard to discover what exists
2. **Design knowledge loss** — Why decisions were made gets forgotten
3. **Inconsistent patterns** — Same problems solved differently
4. **Agent-human context loss** — AI lacks design context
5. **Single-developer drift** — Inconsistency even with one person
6. **Endless correction cycles** — AI generates, human corrects, repeat

### Why Now

- AI-assisted development is mainstream (Claude Code, Cursor, etc.)
- Design systems are too abstract for AI to reason about
- No existing tool provides "physics" (immutable constraints) vs "preferences"

### Why Sigil

Sigil treats design decisions like physics, not opinions:
- **Physics can't be argued with.** Gravity doesn't care about your feelings.
- **"Server-authoritative data MUST show pending states"** is a constraint, not a preference.
- When constraints are framed as physics, AI agents follow them without question.

> Source: SIGIL-COMPLETE-ARCHITECTURE.md §2.1

---

## 2. Goals & Success Metrics

### Primary Goals

| Goal | Metric | Target |
|------|--------|--------|
| Reduce correction cycles | Generations accepted without modification | >80% |
| Enforce physics | IMPOSSIBLE violations generated | 0 |
| Enable real-time feedback | Time from code change to validation | <1s |
| Simplify adoption | Time from clone to first /craft | <5 min |

### Secondary Goals

| Goal | Metric | Target |
|------|--------|--------|
| Community adoption | GitHub stars | 500 in 6 months |
| Documentation quality | Users complete setup without help | >90% |
| Clean removal | `rm -rf sigil-mark/` removes everything | 100% |

### Anti-Goals (The Anti-Beads Promise)

Sigil will NEVER:
- Run a background daemon
- Hijack git hooks
- Use a database (SQLite, etc.)
- Require migrations
- Auto-delete content
- Create hidden branches

> Source: SIGIL-COMPLETE-ARCHITECTURE.md §1 "Anti-Beads Promise"

---

## 3. User Persona

### Primary: Solo Dev with AI

**Name**: Alex
**Role**: Solo developer building a web3 DeFi app
**Tools**: Claude Code, VS Code, Chrome

**Context**:
- Building checkout/claim flows with real money
- Needs UI to feel trustworthy and deliberate
- Uses AI to generate components quickly
- Frustrated by inconsistent AI outputs
- Doesn't have a designer on the team

**Jobs to Be Done**:
1. Generate UI components that match my product's feel
2. Know immediately when something violates design constraints
3. Focus on building, not correcting AI outputs
4. Maintain consistency as the product grows

**Pain Points**:
- AI generates bounce animations when I need deliberate weight
- No way to tell AI "checkout is server-authoritative"
- Every generation is a coin flip
- Spend more time correcting than creating

---

## 4. Functional Requirements

### 4.1 Four-Layer Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         TASTE KEY                                    │
│  Single holder with authority over visual execution.                 │
└─────────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────────┐
│                         MEMORY                                       │
│  Era-versioned decisions. Historical record that informs.            │
└─────────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────────┐
│                        RESONANCE                                     │
│  Product-specific tuning. Materials, zones, tensions.                │
└─────────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────────┐
│                          CORE                                        │
│  Immutable physics. Tick rate. Sync model. Budgets. Fidelity.        │
└─────────────────────────────────────────────────────────────────────┘
```

> Source: SIGIL-COMPLETE-ARCHITECTURE.md §4

### 4.2 Core Layer (Immutable)

| Component | Purpose | Enforcement |
|-----------|---------|-------------|
| **Temporal Governor** | Time as design material (discrete 600ms vs continuous 0ms) | IMPOSSIBLE |
| **Sync Authority** | Server vs client truth | IMPOSSIBLE |
| **Budgets** | Cognitive, visual, complexity limits | BLOCK |
| **Fidelity Ceiling** | Max visual complexity (Mod Ghost Rule) | BLOCK |
| **Lens Registry** | HD/SD coexistence | N/A |

**Temporal Governor**:
```yaml
discrete:
  rate_ms: 600
  feel: "Heavy, rhythmic, ceremonial"
  rule: "The delay IS the trust"

continuous:
  rate_ms: 0
  feel: "Instant, fluid, seamless"
  rule: "The lie IS the speed"
```

**Sync Authority**:
- `server_authoritative`: Server is truth. NO optimistic updates. MUST show pending.
- `client_authoritative`: Client is truth. Optimistic updates allowed.

> Source: SIGIL-COMPLETE-ARCHITECTURE.md §5

### 4.3 Resonance Layer (Tunable)

| Component | Purpose | Source |
|-----------|---------|--------|
| **Essence** | Product soul (references, anti-patterns, key moments) | /envision interview |
| **Materials** | Physics configs (clay, glass, machinery) | /codify |
| **Zones** | Path-based physics contexts | /map |
| **Tensions** | Continuous tuning sliders (0-100) | Team vote |

**Materials**:

| Material | Weight | Motion | Feedback | Zone Affinity |
|----------|--------|--------|----------|---------------|
| **Clay** | Heavy | Spring (120/14) | Depress | Critical, Transactional |
| **Glass** | Weightless | Ease (200ms) | Glow | Exploratory, Marketing |
| **Machinery** | None | Instant | Highlight | Admin |

**Zones**:

| Zone | Sync | Material | Elements | Decisions |
|------|------|----------|----------|-----------|
| Critical | server_authoritative | clay | 5 | 2 |
| Transactional | server_authoritative | clay | 8 | 3 |
| Exploratory | client_authoritative | glass | 20 | 10 |
| Marketing | client_authoritative | glass | 15 | 8 |
| Admin | client_authoritative | machinery | 25 | 15 |

> Source: SIGIL-COMPLETE-ARCHITECTURE.md §6

### 4.4 Memory Layer (Versioned)

| Component | Purpose |
|-----------|---------|
| **Eras** | Time-bounded design contexts |
| **Decisions** | Era-versioned rulings |
| **Mutations** | Experimental sandbox |
| **Graveyard** | Failed experiments (training data) |

### 4.5 Taste Key (Authority)

| Authority | Scope |
|-----------|-------|
| **CAN override** | Budgets, fidelity, colors, typography |
| **CANNOT override** | Physics (sync, tick), security, accessibility |
| **MUST respect** | Tension bounds (community-voted) |

### 4.6 Eight Commands

| # | Command | Purpose | Output |
|---|---------|---------|--------|
| 1 | `/envision` | Capture product essence | essence.yaml |
| 2 | `/codify` | Define material physics | materials.yaml |
| 3 | `/map` | Define zones and paths | zones.yaml |
| 4 | `/craft` | Generate with Hammer/Chisel | Code + guidance |
| 5 | `/validate` | Check violations | Report |
| 6 | `/garden` | Detect entropy | Drift report |
| 7 | `/approve` | Taste Key rulings | Ruling record |
| 8 | `/greenlight` | Concept approval | Greenlight record |

**Workflow**:
```
SETUP:    /envision → /codify → /map
BUILD:    /greenlight → /craft → /validate → /approve
MAINTAIN: /garden
```

> Source: SIGIL-COMPLETE-ARCHITECTURE.md §9

### 4.7 Hammer/Chisel Toolkit

**Hammer (Diagnose + Route)**:
- Find ROOT CAUSE before solving
- AskUserQuestion loop to investigate
- Routes to: Chisel (UI fix), Loa (structural), /approve (taste decision)

**Chisel (Execute)**:
- Quick aesthetic execution
- No investigation for clearly aesthetic tasks
- Applies physics constraints automatically

**The Linear Test**:
```
User: "The claim button feels slow"

❌ FAIL: Immediately add skeleton loader
❌ FAIL: Add optimistic UI without checking zone
✓ PASS: Ask "What kind of slow?"
✓ PASS: Diagnose root cause (UI vs infra)
✓ PASS: Check zone temporal physics
✓ PASS: Route correctly (Chisel vs Loa)
```

> Source: SIGIL-COMPLETE-ARCHITECTURE.md §10

### 4.8 Violation Hierarchy

| Type | Severity | Override | Example |
|------|----------|----------|---------|
| Physics | IMPOSSIBLE | None | Optimistic UI in server_authoritative |
| Budget | BLOCK | Taste Key | 12 elements in critical zone (max 5) |
| Fidelity | BLOCK | Taste Key | 4 gradient stops (max 2) |
| Drift | WARN | None needed | Clay physics in transactional zone |

> Source: SIGIL-COMPLETE-ARCHITECTURE.md §11

### 4.9 Sigil Workbench (MVP)

A tmux-based real-time design environment with four panels:

```
┌─────────────────────────────┬───────────────────────────────────────┐
│      CLAUDE PANEL           │         CHROME VIEW                   │
│  /craft commands            │    [Live Preview of Component]        │
│  Hammer/Chisel feedback     │                                       │
├─────────────────────────────┼───────────────────────────────────────┤
│      TENSIONS PANEL         │         VALIDATION PANEL              │
│  Visual sliders             │  Physics: PASS/FAIL                   │
│  [Reset Zone] [Override]    │  Budgets: 3/5 elements                │
└─────────────────────────────┴───────────────────────────────────────┘
```

**Real-Time Feedback Loop**:
1. Developer types in Claude panel
2. Claude generates/modifies component
3. Chrome view updates live (hot reload)
4. Tensions panel shows current values
5. Validation panel shows violations
6. Developer adjusts via Chisel
7. Repeat until approved

**Component Scoring**:
```
Physics Alignment     ████████████████████ 100%
Budget Compliance     ████████████░░░░░░░░  60%
Fidelity Ceiling      ████████████████████ 100%
Material Resonance    ██████████████████░░  90%
Zone Appropriateness  ████████████████████ 100%

OVERALL: 90/100 — Ready for /approve
```

> Source: SIGIL-COMPLETE-ARCHITECTURE.md §17

---

## 5. Technical Requirements

### 5.1 State Zone Structure

```
sigil-mark/
├── core/                    # IMMUTABLE
│   ├── sync.yaml            # Temporal Governor + Authority
│   ├── budgets.yaml         # Cognitive, Visual, Complexity
│   ├── fidelity.yaml        # Mod Ghost Rule (ceiling)
│   └── lens.yaml            # Rendering layers (HD/SD)
│
├── resonance/               # TUNABLE
│   ├── essence.yaml         # Product soul
│   ├── materials.yaml       # Clay, Machinery, Glass
│   ├── zones.yaml           # Zone definitions + paths
│   └── tensions.yaml        # Tuning sliders
│
├── memory/                  # VERSIONED
│   ├── eras/                # Era definitions
│   ├── decisions/           # Era-versioned decisions
│   ├── mutations/active/    # Current experiments
│   └── graveyard/           # Failed experiments
│
└── taste-key/               # AUTHORITY
    ├── holder.yaml          # Who holds the key
    └── rulings/             # Recorded rulings
```

### 5.2 Technology Constraints

| Constraint | Rationale |
|------------|-----------|
| YAML only | Human-readable, no migrations |
| No database | Clean removal guarantee |
| No daemon | No background processes |
| No git hooks | Developer owns their workflow |
| File-based state | `rm -rf sigil-mark/` removes everything |

### 5.3 Integration Points

| Integration | Method |
|-------------|--------|
| **Claude Code** | Skills + Commands in `.claude/` |
| **Loa** | Handoff via `loa-grimoire/context/sigil-handoff.md` |
| **Chrome** | MCP tool for live preview (Workbench) |
| **Hot Reload** | Vite/Next.js dev server integration |

### 5.4 Workbench Technical Requirements

| Requirement | Implementation |
|-------------|----------------|
| Layout | tmux with 4 panes |
| Claude Panel | Claude Code CLI |
| Chrome View | Chrome MCP extension |
| Tensions Panel | Terminal-based sliders |
| Validation Panel | Real-time file watching |
| Hot Reload | Dev server websocket |

---

## 6. Scope & Prioritization

### v1.0 MVP (This Release)

| Feature | Priority | Status |
|---------|----------|--------|
| Four-layer architecture | P0 | Required |
| 8 commands | P0 | Required |
| Hammer/Chisel toolkit | P0 | Required |
| Physics enforcement | P0 | Required |
| Workbench (4-panel) | P0 | Required |
| Real-time validation | P0 | Required |
| Component scoring | P1 | Required |
| Loa handoff | P1 | Required |

### v1.1 (Future)

| Feature | Priority |
|---------|----------|
| Cross-context integration (GTM/MRD) | P2 |
| Territory-specific handoffs | P2 |
| Loa Constructs distribution | P3 |
| Community contributions model | P3 |

### Out of Scope (v1.0)

- Multi-user collaboration features
- Real-time sync between developers
- Visual GUI for configuration
- CI/CD integration
- VSCode extension
- Cursor integration

---

## 7. User Stories

### Setup Flow

```
US-1: As a solo dev, I want to initialize Sigil on my repo so that AI
      generates consistent UI.

      Acceptance:
      - Run mount-sigil.sh completes in <30s
      - Creates sigil-mark/ with all required files
      - Creates .claude/commands/ and .claude/skills/
      - Shows next steps clearly
```

```
US-2: As a solo dev, I want to capture my product's soul via interview
      so that AI understands my design intent.

      Acceptance:
      - /envision asks about reference products
      - /envision asks about anti-patterns
      - /envision asks about key moments (claim, success, error)
      - Generates essence.yaml with all captured information
```

### Build Flow

```
US-3: As a solo dev, I want to generate a component with physics
      so that it matches my product's feel automatically.

      Acceptance:
      - /craft resolves zone from file path
      - /craft applies material physics
      - /craft enforces sync constraints
      - /craft stays within budgets
      - Output includes zone resolution, physics applied, code
```

```
US-4: As a solo dev, I want to see violations in real-time
      so that I can fix them before committing.

      Acceptance:
      - Validation panel updates within 1s of code change
      - Shows IMPOSSIBLE/BLOCK/WARN with causal explanation
      - Offers fix suggestions
```

### Workbench Flow

```
US-5: As a solo dev, I want to see my component live while crafting
      so that I can iterate quickly.

      Acceptance:
      - Chrome view updates on code change
      - No manual refresh needed
      - Shows current tensions visually
```

```
US-6: As a solo dev, I want to see my component's physics score
      so that I know when it's ready.

      Acceptance:
      - Shows 5 metrics (Physics, Budget, Fidelity, Material, Zone)
      - Shows overall score 0-100
      - Indicates "Ready for /approve" at 85+
```

### Maintenance Flow

```
US-7: As a solo dev, I want to detect design drift over time
      so that my product doesn't decay.

      Acceptance:
      - /garden shows inflation metrics
      - Alerts when growth exceeds thresholds
      - Recommends review before next release
```

---

## 8. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Workbench complexity delays MVP | High | High | Ship core engine first, add panels incrementally |
| tmux learning curve for users | Medium | Medium | Provide alternative non-Workbench mode |
| Hot reload integration issues | Medium | High | Support manual refresh as fallback |
| Chrome MCP extension reliability | Medium | Medium | Design for graceful degradation |
| Adoption friction | Medium | High | One-command install, <5 min to first /craft |

---

## 9. Success Criteria

### Launch Criteria (v1.0)

- [ ] `mount-sigil.sh` works on macOS and Linux
- [ ] All 8 commands implemented and documented
- [ ] Hammer investigates (never jumps to solution)
- [ ] Physics violations are IMPOSSIBLE (cannot generate)
- [ ] Workbench launches with 4 panels
- [ ] Live preview updates in <1s
- [ ] Component scoring visible
- [ ] Clean removal via `rm -rf sigil-mark/`
- [ ] README has <5 min quickstart
- [ ] No daemon, no database, no hooks

### The Final Test

```bash
# To install Sigil:
./mount-sigil.sh

# To use Sigil:
/envision → /codify → /map → /craft → /validate → /approve

# To remove Sigil:
rm -rf sigil-mark/
# Done.
```

---

## Appendix A: Key Quotes

> "The delay IS the trust." — OSRS Temporal Philosophy

> "The lie IS the speed." — Linear Optimistic UI

> "Quality doesn't come from committees... it comes from individuals with taste." — Karri Saarinen

> "Technical superiority is NOT justification for breaking resonance." — Mod Ghost Rule

> "A screen with 50 perfect buttons is still bad design." — Budget Philosophy

> "470,000 lines of Go vs `mkdir .tickets && vim`" — Anti-Beads Principle

---

## Appendix B: Source Tracing

| Section | Sources |
|---------|---------|
| Problem Statement | SIGIL-COMPLETE-ARCHITECTURE.md §1 |
| Philosophy | SIGIL-COMPLETE-ARCHITECTURE.md §2 |
| Four Layers | SIGIL-COMPLETE-ARCHITECTURE.md §4-8 |
| Commands | SIGIL-COMPLETE-ARCHITECTURE.md §9 |
| Hammer/Chisel | SIGIL-COMPLETE-ARCHITECTURE.md §10 |
| Violation Hierarchy | SIGIL-COMPLETE-ARCHITECTURE.md §11 |
| Directory Structure | SIGIL-COMPLETE-ARCHITECTURE.md §12 |
| Workbench | SIGIL-COMPLETE-ARCHITECTURE.md §17 |
| Agent Instructions | SIGIL-PROMPT.md |
| Reference Implementation | SIGIL-REFERENCE.md |
| Scope Decisions | User clarification (2026-01-04) |

---

*End of PRD*
