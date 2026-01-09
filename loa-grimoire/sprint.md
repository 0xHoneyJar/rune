# Sigil v5 Sprint Plan

> *"Filesystem is truth. Agency stays with human. Rules evolve. Artists stay in flow."*

**Version:** 5.0
**Codename:** The Lucid Flow
**Generated:** 2026-01-08
**Sources:** PRD v5.0, SDD v5.0

---

## Sprint Overview

### Team Structure
- **Agent:** Claude (AI implementation)
- **Human:** @zksoju (review, approval, direction)

### Sprint Duration
- **Cycle length:** 1 week per sprint
- **Total sprints:** 8 sprints (MVP complete)
- **Methodology:** Cycles (Linear Method)

### MVP Definition

The MVP delivers:
1. Kernel layer (constitution, fidelity, workflow, vocabulary)
2. Core runtime (SigilProvider, useSigilMutation with simulation)
3. Live grep discovery (no cache)
4. JIT polish workflow
5. Basic governance (justification logging)

Post-MVP:
- Component context population
- Codebase pattern extraction
- Knowledge base curation
- Amendment protocol UI

---

## Sprint Breakdown

---

## Sprint 1: Foundation & Kernel Setup

**Goal:** Establish directory structure and kernel YAML files

**Duration:** 1 week

### Tasks

#### S1-T1: Directory Structure Creation
**Description:** Create the v5 sigil-mark directory structure per SDD spec.

**Acceptance Criteria:**
- [x] `sigil-mark/kernel/` exists with 4 empty YAML files
- [x] `sigil-mark/skills/` exists with 6 empty YAML stubs
- [x] `sigil-mark/components/` structure created
- [x] `sigil-mark/codebase/` structure created
- [x] `sigil-mark/knowledge/` structure created
- [x] `sigil-mark/governance/` with justifications.log
- [x] `sigil-mark/hooks/` exists
- [x] `sigil-mark/providers/` exists
- [x] `sigil-mark/layouts/` exists

**Dependencies:** None
**Effort:** Small

---

#### S1-T2: Constitution YAML
**Description:** Create `kernel/constitution.yaml` with data physics binding.

**Acceptance Criteria:**
- [x] Financial types mapped to server-tick physics
- [x] Health types mapped to server-tick physics
- [x] Collaborative types mapped to crdt physics
- [x] Local types mapped to local-first physics
- [x] Physics profiles defined with timing, states, hooks
- [x] Risk hierarchy defined
- [x] Resolution rule documented

**Dependencies:** S1-T1
**Effort:** Medium

---

#### S1-T3: Fidelity YAML
**Description:** Create `kernel/fidelity.yaml` with visual/ergonomic constraints.

**Acceptance Criteria:**
- [x] Visual constraints: animation, gradients, shadows, borders, typography
- [x] Ergonomic constraints: input_latency, hitbox, focus_ring, keyboard_support
- [x] Interaction budgets defined
- [x] Cohesion rules with variance thresholds
- [x] Enforcement levels (error/warning) specified

**Dependencies:** S1-T1
**Effort:** Medium

---

#### S1-T4: Vocabulary YAML
**Description:** Create `kernel/vocabulary.yaml` with term→physics mapping.

**Acceptance Criteria:**
- [x] Financial terms mapped (claim, deposit, withdraw, transfer, swap, approve)
- [x] Destructive terms mapped (delete, cancel)
- [x] Collaborative terms mapped (edit, comment, assign)
- [x] Local terms mapped (toggle, filter, sort, save)
- [x] Motion profiles defined (instant, snappy, warm, deliberate, reassuring, celebratory)
- [x] Lookup protocol documented

**Dependencies:** S1-T1
**Effort:** Medium

---

#### S1-T5: Workflow YAML
**Description:** Create `kernel/workflow.yaml` with methodology rules.

**Acceptance Criteria:**
- [x] Cycles method defined with rules (no_backlogs, no_story_points, hill_charts)
- [x] Sprints method defined as alternative
- [x] Kanban method defined as alternative
- [x] Terminology translations specified
- [x] Agent behavior rules documented
- [x] Governance integration configured

**Dependencies:** S1-T1
**Effort:** Small

---

### Sprint 1 Deliverables
- Complete sigil-mark directory structure
- All 4 kernel YAML files populated
- Ready for runtime implementation

---

## Sprint 2: Runtime Provider & Context

**Goal:** Implement SigilProvider and zone context system

**Duration:** 1 week

### Tasks

#### S2-T1: SigilProvider Implementation
**Description:** Create the React context provider for zones and personas.

**Acceptance Criteria:**
- [x] `SigilContext` created with zone, persona, vibes
- [x] `SigilProvider` component accepts zone, persona, vibes props
- [x] Context memoized correctly
- [x] Default values: zone='standard', persona='default'
- [x] TypeScript types exported

**Dependencies:** Sprint 1 complete
**Effort:** Medium

---

#### S2-T2: Zone Context Hooks
**Description:** Create hooks for accessing zone context.

**Acceptance Criteria:**
- [x] `useSigilZoneContext()` returns current zone
- [x] `useSigilPersonaContext()` returns current persona
- [x] `useSigilVibes()` returns vibes object
- [x] All hooks handle missing provider gracefully

**Dependencies:** S2-T1
**Effort:** Small

---

#### S2-T3: CriticalZone Layout
**Description:** Create zone layout component that forces critical zone.

**Acceptance Criteria:**
- [x] `CriticalZone` component overrides parent zone to 'critical'
- [x] Renders `data-sigil-zone="critical"` attribute
- [x] Accepts `financial` prop for data-sigil-financial attribute
- [x] Children inherit critical zone context
- [x] TypeScript types defined

**Dependencies:** S2-T1
**Effort:** Small

---

#### S2-T4: GlassLayout Component
**Description:** Create zone layout for exploratory/marketing areas.

**Acceptance Criteria:**
- [x] `GlassLayout` component overrides zone to 'glass'
- [x] Renders `data-sigil-zone="glass"` attribute
- [x] Children inherit glass zone context

**Dependencies:** S2-T1
**Effort:** Small

---

#### S2-T5: MachineryLayout Component
**Description:** Create zone layout for admin/power-user areas.

**Acceptance Criteria:**
- [x] `MachineryLayout` component overrides zone to 'machinery'
- [x] Renders `data-sigil-zone="machinery"` attribute
- [x] Children inherit machinery zone context

**Dependencies:** S2-T1
**Effort:** Small

---

#### S2-T6: Provider Tests
**Description:** Test suite for provider and zone components.

**Acceptance Criteria:**
- [x] Test context propagation
- [x] Test zone override nesting
- [x] Test default values
- [x] Test TypeScript types

**Dependencies:** S2-T1 through S2-T5
**Effort:** Medium

---

### Sprint 2 Deliverables
- `sigil-mark/providers/sigil-provider.tsx`
- `sigil-mark/layouts/critical-zone.tsx`
- `sigil-mark/layouts/glass-layout.tsx`
- `sigil-mark/layouts/machinery-layout.tsx`
- Test coverage for provider layer

---

## Sprint 3: useSigilMutation Core

**Goal:** Implement the type-driven physics hook

**Duration:** 1 week

### Tasks

#### S3-T1: Physics Types & Interfaces
**Description:** Define TypeScript types for physics system.

**Acceptance Criteria:**
- [x] `SigilState` type: idle | simulating | confirming | committing | done | error
- [x] `PhysicsClass` type: server-tick | crdt | local-first
- [x] `SimulationPreview<T>` interface with predictedResult, estimatedDuration, warnings, fees
- [x] `ResolvedPhysics` interface with class, timing, requires, forbidden
- [x] `UseSigilMutationOptions<TData, TVariables>` interface
- [x] `UseSigilMutationResult<TData, TVariables>` interface

**Dependencies:** Sprint 2 complete
**Effort:** Medium

---

#### S3-T2: Physics Resolution Function
**Description:** Implement physics resolution from zone context.

**Acceptance Criteria:**
- [x] `resolvePhysics(context, override)` function
- [x] Maps 'critical' zone → server-tick
- [x] Maps 'machinery'/'admin' zone → local-first
- [x] Maps default zone → crdt
- [x] Applies overrides with warning if no reason provided
- [x] Returns complete `ResolvedPhysics` object

**Dependencies:** S3-T1
**Effort:** Medium

---

#### S3-T3: State Machine Implementation
**Description:** Implement the mutation state machine.

**Acceptance Criteria:**
- [x] State transitions: idle→simulating→confirming→committing→done
- [x] Error state reachable from simulating/committing
- [x] Reset returns to idle
- [x] State is reactive (useState)

**Dependencies:** S3-T1
**Effort:** Medium

---

#### S3-T4: Simulate Function
**Description:** Implement simulation flow for server-tick physics.

**Acceptance Criteria:**
- [x] `simulate(variables)` transitions to 'simulating' state
- [x] Calls user-provided simulate function if available
- [x] Creates default preview if no simulate function
- [x] Transitions to 'confirming' on success
- [x] Transitions to 'error' on failure
- [x] Stores pending variables for confirm step

**Dependencies:** S3-T3
**Effort:** Medium

---

#### S3-T5: Confirm Function
**Description:** Implement confirmation step after simulation.

**Acceptance Criteria:**
- [x] `confirm()` only works in 'confirming' state
- [x] Transitions to 'committing' state
- [x] Executes mutation with stored variables
- [x] Transitions to 'done' on success
- [x] Transitions to 'error' on failure
- [x] Calls onSuccess/onError callbacks

**Dependencies:** S3-T4
**Effort:** Medium

---

#### S3-T6: Execute Function
**Description:** Implement direct execution (bypasses simulation).

**Acceptance Criteria:**
- [x] `execute(variables)` for non-server-tick physics
- [x] Logs warning if used on server-tick physics
- [x] Transitions through committing→done/error
- [x] Calls mutation directly

**Dependencies:** S3-T3
**Effort:** Small

---

#### S3-T7: Computed UI State
**Description:** Implement computed properties for UI binding.

**Acceptance Criteria:**
- [x] `disabled` = not idle and not confirming
- [x] `isPending` = state is 'committing'
- [x] `isSimulating` = state is 'simulating'
- [x] `isConfirming` = state is 'confirming'
- [x] `cssVars` object with --sigil-duration, --sigil-easing

**Dependencies:** S3-T3
**Effort:** Small

---

#### S3-T8: Hook Assembly & Export
**Description:** Assemble complete useSigilMutation hook.

**Acceptance Criteria:**
- [x] Hook uses SigilContext for zone/persona
- [x] Returns complete result object
- [x] Exported from sigil-mark/hooks/
- [x] JSDoc documented with @sigil-tier gold

**Dependencies:** S3-T1 through S3-T7
**Effort:** Medium

---

### Sprint 3 Deliverables
- `sigil-mark/hooks/use-sigil-mutation.ts` (complete)
- `sigil-mark/types/index.ts` (physics types)
- Full simulation flow working

---

## Sprint 4: Live Grep Discovery

**Goal:** Implement Scanning Sanctuary skill with ripgrep

**Duration:** 1 week

### Tasks

#### S4-T1: JSDoc Pragma Specification
**Description:** Document the JSDoc pragma system for component discovery.

**Acceptance Criteria:**
- [x] `@sigil-tier` pragma: gold | silver | bronze | draft
- [x] `@sigil-zone` pragma: critical | glass | machinery | standard
- [x] `@sigil-data-type` pragma: type name for physics resolution
- [x] Documented in skills/scanning-sanctuary.yaml

**Dependencies:** Sprint 1 complete
**Effort:** Small

---

#### S4-T2: Scanning Sanctuary Skill Definition
**Description:** Create skill YAML with ripgrep patterns.

**Acceptance Criteria:**
- [x] Skill definition in `skills/scanning-sanctuary.yaml`
- [x] ripgrep patterns for tier lookup
- [x] ripgrep patterns for zone lookup
- [x] ripgrep patterns for data-type lookup
- [x] Performance target: < 50ms documented

**Dependencies:** S4-T1
**Effort:** Small

---

#### S4-T3: Component Lookup Utility
**Description:** Create utility function for component discovery.

**Acceptance Criteria:**
- [x] `findComponentsByTier(tier)` function
- [x] `findComponentsByZone(zone)` function
- [x] `findComponentsByDataType(type)` function
- [x] Uses ripgrep via shell execution
- [x] Returns file paths array
- [x] Performance: < 50ms on typical codebase

**Dependencies:** S4-T2
**Effort:** Medium

---

#### S4-T4: Remove sigil.map Cache
**Description:** Delete any existing cache infrastructure.

**Acceptance Criteria:**
- [x] `sigil.map` file deleted if exists
- [x] `.sigil-cache` directory deleted if exists
- [x] Any cache-related code removed
- [x] Migration note added to MIGRATION.md

**Dependencies:** S4-T3
**Effort:** Small

---

#### S4-T5: Agent Integration Documentation
**Description:** Document how agent uses Scanning Sanctuary.

**Acceptance Criteria:**
- [x] CLAUDE.md updated with scanning instructions
- [x] Example ripgrep commands documented
- [x] "Never use cached index" rule emphasized
- [x] Fallback behavior documented

**Dependencies:** S4-T2
**Effort:** Small

---

### Sprint 4 Deliverables
- `sigil-mark/skills/scanning-sanctuary.yaml`
- Component lookup utilities
- Cache infrastructure removed
- Agent documentation updated

---

## Sprint 5: Analyzing Data Risk Skill

**Goal:** Implement type-to-physics resolution skill

**Duration:** 1 week

### Tasks

#### S5-T1: Skill Definition YAML
**Description:** Create Analyzing Data Risk skill definition.

**Acceptance Criteria:**
- [x] Skill YAML in `skills/analyzing-data-risk.yaml`
- [x] Type extraction patterns documented
- [x] Constitution lookup process defined
- [x] Risk hierarchy applied
- [x] Error handling for unknown types

**Dependencies:** Sprint 1 kernel complete
**Effort:** Medium

---

#### S5-T2: Type Extraction Parser
**Description:** Parse TypeScript function signatures for types.

**Acceptance Criteria:**
- [x] Extract parameter types from function signature
- [x] Extract return type
- [x] Extract generic parameters
- [x] Handle import context for type lookup
- [x] Return array of type names

**Dependencies:** S5-T1
**Effort:** Large

---

#### S5-T3: Constitution Lookup
**Description:** Map extracted types to physics via constitution.

**Acceptance Criteria:**
- [x] Load constitution.yaml
- [x] Lookup type in data_physics categories
- [x] Return physics class, requires, forbidden
- [x] Handle unknown types (ask user)

**Dependencies:** S5-T2, Sprint 1 kernel
**Effort:** Medium

---

#### S5-T4: Risk Hierarchy Resolution
**Description:** Apply highest-risk physics when multiple types detected.

**Acceptance Criteria:**
- [x] server-tick > crdt > local-first hierarchy
- [x] When Money + Task → use server-tick
- [x] Log when multiple high-risk types detected
- [x] Return single resolved physics

**Dependencies:** S5-T3
**Effort:** Small

---

#### S5-T5: Integration with useSigilMutation
**Description:** Connect data risk analysis to hook.

**Acceptance Criteria:**
- [x] Hook can receive data type hints
- [x] Physics resolution considers data type
- [x] Data type overrides zone-based defaults
- [x] Warning if data type conflicts with zone

**Dependencies:** Sprint 3, S5-T4
**Effort:** Medium

---

### Sprint 5 Deliverables
- `sigil-mark/skills/analyzing-data-risk.yaml`
- Type extraction utilities
- Constitution lookup integrated with hook
- Data type hints working in useSigilMutation

---

## Sprint 6: JIT Polish Workflow

**Goal:** Implement Polishing Code skill with on-demand standardization

**Duration:** 1 week

### Tasks

#### S6-T1: Skill Definition YAML
**Description:** Create Polishing Code skill definition.

**Acceptance Criteria:**
- [x] Skill YAML in `skills/polishing-code.yaml`
- [x] Triggers: /polish, pre-commit, CI
- [x] Process: scan → diff → approve → apply
- [x] Never auto-fix on save (documented)

**Dependencies:** Sprint 1
**Effort:** Small

---

#### S6-T2: Violation Scanner
**Description:** Scan files for taste violations.

**Acceptance Criteria:**
- [x] Check fidelity constraints (animation, shadows, etc.)
- [x] Check constitution requirements
- [x] Return list of violations with file:line references
- [x] Severity levels: error, warning, info

**Dependencies:** S6-T1, Sprint 1 kernel
**Effort:** Large

---

#### S6-T3: Diff Generator
**Description:** Generate fix diffs for violations.

**Acceptance Criteria:**
- [x] For each violation, generate suggested fix
- [x] Output unified diff format
- [x] Show before/after context
- [x] Group by file

**Dependencies:** S6-T2
**Effort:** Medium

---

#### S6-T4: /polish Command Handler
**Description:** Implement /polish command for agent.

**Acceptance Criteria:**
- [x] `/polish` scans and shows diff
- [x] `/polish --diff` shows diff without applying
- [x] `/polish --apply` applies after confirmation
- [x] Returns summary of changes

**Dependencies:** S6-T3
**Effort:** Medium

---

#### S6-T5: Pre-commit Hook Script
**Description:** Create pre-commit hook for polish check.

**Acceptance Criteria:**
- [x] Script in `.husky/pre-commit`
- [x] Runs `sigil polish --check`
- [x] Exits non-zero if violations found
- [x] Clear error message with fix instructions

**Dependencies:** S6-T2
**Effort:** Small

---

#### S6-T6: Remove Auto-fix on Save
**Description:** Ensure no auto-fix behavior exists.

**Acceptance Criteria:**
- [x] No ESLint auto-fix on save for Sigil rules
- [x] No Prettier integration that auto-fixes
- [x] Documented: "Let humans debug with messy code"

**Dependencies:** None
**Effort:** Small

---

### Sprint 6 Deliverables
- `sigil-mark/skills/polishing-code.yaml`
- Violation scanner
- Diff generator
- `/polish` command working
- Pre-commit hook script

---

## Sprint 7: Status Propagation & Negotiation

**Goal:** Implement status propagation and integrity negotiation

**Duration:** 1 week

### Tasks

#### S7-T1: Status Propagation Rule
**Description:** Implement tier downgrade on import.

**Acceptance Criteria:**
- [x] `Tier(Component) = min(DeclaredTier, Tier(Dependencies))`
- [x] Gold imports Draft → becomes Draft
- [x] Warning displayed, not error
- [x] Status restores when dependency upgrades

**Dependencies:** Sprint 4 (scanning)
**Effort:** Medium

---

#### S7-T2: Import Analyzer
**Description:** Analyze imports to detect tier conflicts.

**Acceptance Criteria:**
- [x] Parse import statements
- [x] Lookup imported component tier via ripgrep
- [x] Compare with current component tier
- [x] Return list of downgrades

**Dependencies:** S7-T1
**Effort:** Medium

---

#### S7-T3: Negotiating Integrity Skill
**Description:** Create skill for handling violations.

**Acceptance Criteria:**
- [x] Skill YAML in `skills/negotiating-integrity.yaml`
- [x] COMPLY option with compliant alternative
- [x] BYPASS option with justification capture
- [x] AMEND option for constitution change proposal
- [x] Never refuse outright

**Dependencies:** Sprint 1 kernel
**Effort:** Medium

---

#### S7-T4: Justification Logger
**Description:** Log overrides to governance file.

**Acceptance Criteria:**
- [x] Write to `governance/justifications.log`
- [x] Format: timestamp, file, article, justification, author
- [x] Append-only log
- [x] Human-readable format

**Dependencies:** S7-T3
**Effort:** Small

---

#### S7-T5: Amendment Proposal Creator
**Description:** Create amendment YAML from AMEND requests.

**Acceptance Criteria:**
- [x] Create file in `governance/amendments/`
- [x] Include: id, date, proposer, status, article, proposed_change, justification
- [x] Status: proposed
- [x] Template for evidence and approvals

**Dependencies:** S7-T3
**Effort:** Small

---

### Sprint 7 Deliverables
- Status propagation working
- `sigil-mark/skills/negotiating-integrity.yaml`
- Justification logging
- Amendment proposal flow

---

## Sprint 8: Remaining Skills & Integration

**Goal:** Complete Auditing Cohesion, Simulating Interaction, and integration

**Duration:** 1 week

### Tasks

#### S8-T1: Auditing Cohesion Skill
**Description:** Create visual cohesion checking skill.

**Acceptance Criteria:**
- [x] Skill YAML in `skills/auditing-cohesion.yaml`
- [x] Compare visual properties against context
- [x] Report variance with options
- [x] Trigger on new component generation

**Dependencies:** Sprint 1 fidelity.yaml
**Effort:** Medium

---

#### S8-T2: Simulating Interaction Skill
**Description:** Create timing verification skill.

**Acceptance Criteria:**
- [x] Skill YAML in `skills/simulating-interaction.yaml`
- [x] Verify click_to_feedback < 100ms
- [x] Verify keypress_to_action < 50ms
- [x] Verify hover_to_tooltip < 200ms
- [x] Report failures with suggestions

**Dependencies:** Sprint 1 fidelity.yaml
**Effort:** Medium

---

#### S8-T3: /garden Command
**Description:** Implement system health check command.

**Acceptance Criteria:**
- [x] `/garden` runs all audits
- [x] `/garden --drift` focuses on visual drift
- [x] Returns health summary
- [x] Lists issues by severity

**Dependencies:** S8-T1, S8-T2, Sprint 4-7
**Effort:** Medium

---

#### S8-T4: /amend Command
**Description:** Implement constitution amendment command.

**Acceptance Criteria:**
- [x] `/amend <rule>` creates amendment proposal
- [x] Prompts for justification
- [x] Creates amendment YAML
- [x] Returns proposal ID

**Dependencies:** Sprint 7 (amendment flow)
**Effort:** Small

---

#### S8-T5: CLAUDE.md Integration
**Description:** Update CLAUDE.md with complete v5 protocol.

**Acceptance Criteria:**
- [x] All commands documented
- [x] All skills referenced
- [x] Seven Laws stated
- [x] Quick reference table
- [x] Anti-patterns listed

**Dependencies:** All previous sprints
**Effort:** Medium

---

#### S8-T6: Migration Script
**Description:** Create migration script from v4.x.

**Acceptance Criteria:**
- [x] Delete sigil.map and cache
- [x] Create v5 directory structure
- [x] Initialize governance logs
- [x] Print next steps

**Dependencies:** All previous sprints
**Effort:** Small

---

### Sprint 8 Deliverables
- All 6 skills complete
- `/garden` and `/amend` commands working
- CLAUDE.md v5 protocol
- Migration script
- **MVP COMPLETE**

---

## Post-MVP Sprints

### Sprint 9: Component Context Population
- shadcn component documentation
- Radix primitive patterns
- Framer Motion recipes

### Sprint 10: Codebase Pattern Extraction
- Automatic pattern detection
- Hook usage analysis
- Convention extraction

### Sprint 11: Knowledge Base Curation
- React gotchas
- Next.js boundaries
- Accessibility requirements
- Performance patterns

### Sprint 12: Amendment Protocol UI
- Amendment review workflow
- Approval tracking
- Merge automation

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| ripgrep performance on large codebases | Low | Medium | Add file limits, benchmark early |
| Type extraction complexity | Medium | High | Start simple, iterate on edge cases |
| Token limit with full context | Medium | Medium | Selective loading, compression |
| JSDoc pragma adoption | Low | Low | Make optional, provide migration script |

---

## Success Metrics per Sprint

| Sprint | Key Metric |
|--------|------------|
| Sprint 1 | All kernel YAML valid and parseable |
| Sprint 2 | Zone context propagates correctly in tests |
| Sprint 3 | Simulation flow works end-to-end |
| Sprint 4 | Component lookup < 50ms |
| Sprint 5 | Data type → physics resolution accurate |
| Sprint 6 | /polish produces valid diffs |
| Sprint 7 | Justifications logged correctly |
| Sprint 8 | All commands functional, CLAUDE.md complete |

---

## Dependencies & Blockers

### External Dependencies
- ripgrep installed on system
- React 18+ for hooks
- TypeScript for type extraction

### Internal Dependencies
```
Sprint 1 (Kernel) ──────┬──► Sprint 2 (Provider)
                        │
                        ├──► Sprint 3 (Hook) ──────► Sprint 5 (Data Risk)
                        │
                        ├──► Sprint 4 (Scanning)
                        │
                        ├──► Sprint 6 (Polish)
                        │
                        └──► Sprint 7 (Status/Negotiation)
                                      │
                                      ▼
                                Sprint 8 (Integration)
```

---

*Sprint Plan Generated: 2026-01-08*
*Based on: PRD v5.0, SDD v5.0*
