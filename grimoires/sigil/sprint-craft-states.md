# Sprint Plan: Craft States — Hammer vs Chisel

```
    +===============================================+
    |  CRAFT STATES                                 |
    |  Sprint Implementation Plan                   |
    |                                               |
    |  Version 1.0.0                                |
    +===============================================+
```

**Created**: 2026-01-19
**PRD Reference**: `grimoires/sigil/prd-craft-states.md`
**SDD Reference**: `grimoires/sigil/sdd-craft-states.md`
**Status**: Ready for Implementation

---

## Sprint Overview

**Goal**: Add Hammer vs Chisel scope detection to `/craft`, enabling full-stack feature implementation by orchestrating Loa commands.

**Estimated Scope**: Single sprint (orderly process, not massive scope)

**Key Deliverable**: Modified `.claude/commands/craft.md` with scope detection and hammer orchestration

---

## Task Breakdown

### Task 1: Add Scope Detection Algorithm (Step 0.5)
**Priority**: P0 (Critical Path)
**Type**: Feature Addition

**Description**:
Implement scope detection that analyzes user input for hammer vs chisel signals, scoring and presenting the mode recommendation.

**Acceptance Criteria**:
- [ ] Detects hammer signals: "feature", "system", "flow", "pipeline", "build", "implement", "create"
- [ ] Detects reference patterns: contract names, event names, API endpoints, indexer mentions
- [ ] Detects chisel signals: "button", "modal", "animation", "hover", "style", "improve", "fix", "polish", "adjust", "tweak"
- [ ] Scoring algorithm: +1 per hammer signal, -1 per chisel signal, threshold >= 2 for HAMMER
- [ ] Displays scope detection box with signals found
- [ ] Offers user choice: [Proceed with Hammer] [Chisel anyway]
- [ ] Supports `--chisel` and `--hammer` flags to force mode

**Files Modified**:
- `.claude/commands/craft.md` — Add `<step_0_5>` section after Step 0

**Test Cases**:
| Input | Expected Mode |
|-------|---------------|
| "claim button" | CHISEL |
| "build rewards claiming feature" | HAMMER |
| "improve hover states" | CHISEL |
| "implement notification system" | HAMMER |
| "fix the modal animation" | CHISEL |
| "create user authentication flow" | HAMMER |

---

### Task 2: Implement Hammer Phase H1 — Artifact Check
**Priority**: P0 (Critical Path)
**Type**: Feature Addition

**Description**:
Check for existing Loa artifacts (PRD, SDD, sprint) before starting hammer sequence. Detect staleness and relevance.

**Acceptance Criteria**:
- [ ] Checks existence of `grimoires/loa/prd.md`
- [ ] Checks existence of `grimoires/loa/sdd.md`
- [ ] Checks existence of `grimoires/loa/sprint.md`
- [ ] Detects artifact age (stale if PRD/SDD > 7 days, sprint > 3 days)
- [ ] Checks relevance (title/topic matches current feature request)
- [ ] Presents options when artifacts exist:
  1. Use existing → Skip to appropriate phase
  2. Regenerate → Start from scratch
  3. Chisel anyway → UI only
- [ ] Initializes `grimoires/sigil/hammer-state.json` if no artifacts

**Files Modified**:
- `.claude/commands/craft.md` — Add `<step_h1>` section

**Dependencies**: Task 1 (scope detection must detect HAMMER first)

---

### Task 3: Implement Hammer Phase H2 — Context Aggregation & /plan-and-analyze
**Priority**: P0 (Critical Path)
**Type**: Feature Addition

**Description**:
Aggregate Sigil context (observations, taste patterns) and invoke `/plan-and-analyze` with seeded context.

**Acceptance Criteria**:
- [ ] Reads `grimoires/sigil/observations/*.diagnostic.md` if exists
- [ ] Reads `grimoires/sigil/observations/user-insights.md` if exists
- [ ] Reads `grimoires/sigil/taste.md` for recent patterns (last 10 signals)
- [ ] Formats context seeding block:
  ```markdown
  ## Sigil Context (Pre-seeded)
  ### User Observations
  [extracted observations]
  ### Taste Patterns
  [extracted patterns]
  ### Physics Requirements
  [relevant physics rules]
  ```
- [ ] Invokes `Skill tool` with `skill: "plan-and-analyze"` and seeded args
- [ ] Updates `hammer-state.json` with `phase: "prd_complete"`
- [ ] Proceeds to H3

**Files Modified**:
- `.claude/commands/craft.md` — Add `<step_h2>` section

**Dependencies**: Task 2 (must have passed artifact check)

---

### Task 4: Implement Hammer Phase H3 — /architect
**Priority**: P0 (Critical Path)
**Type**: Feature Addition

**Description**:
Invoke `/architect` to generate SDD from PRD.

**Acceptance Criteria**:
- [ ] Invokes `Skill tool` with `skill: "architect"`
- [ ] Waits for SDD completion
- [ ] Updates `hammer-state.json` with `phase: "sdd_complete"`
- [ ] Proceeds to H4

**Files Modified**:
- `.claude/commands/craft.md` — Add `<step_h3>` section

**Dependencies**: Task 3 (PRD must exist)

---

### Task 5: Implement Hammer Phase H4 — /sprint-plan & Component Extraction
**Priority**: P0 (Critical Path)
**Type**: Feature Addition

**Description**:
Invoke `/sprint-plan` and extract components with physics hints for the summary.

**Acceptance Criteria**:
- [ ] Invokes `Skill tool` with `skill: "sprint-plan"`
- [ ] Waits for sprint.md completion
- [ ] Parses sprint.md for tasks
- [ ] Identifies UI components from task list
- [ ] Assigns physics types based on component analysis:
  - Financial: claim, withdraw, transfer, payment
  - Destructive: delete, remove, revoke
  - Standard: save, update, create, like
  - Local: toggle, theme, filter
- [ ] Updates `hammer-state.json` with `phase: "sprint_complete"` and `components_identified`
- [ ] Proceeds to H5

**Files Modified**:
- `.claude/commands/craft.md` — Add `<step_h4>` section

**Dependencies**: Task 4 (SDD must exist)

---

### Task 6: Implement Hammer Phase H5 — Plan Summary & Handoff
**Priority**: P0 (Critical Path)
**Type**: Feature Addition

**Description**:
Display complete plan summary and hand off to user for `/run sprint-plan`.

**Acceptance Criteria**:
- [ ] Displays summary box:
  ```
  ┌─ Hammer Plan Complete ────────────────────────────────────┐
  │  Feature: {description}                                   │
  │  PRD: grimoires/loa/prd.md                               │
  │  SDD: grimoires/loa/sdd.md                               │
  │  Sprint: grimoires/loa/sprint.md                         │
  │                                                           │
  │  Components to implement:                                 │
  │  [numbered list with type and physics]                    │
  │                                                           │
  │  Ready to implement.                                      │
  │  Run `/run sprint-plan` when ready.                       │
  └───────────────────────────────────────────────────────────┘
  ```
- [ ] Updates `hammer-state.json` with `phase: "awaiting_execution"`
- [ ] Workflow stops here (user manually runs `/run sprint-plan`)

**Files Modified**:
- `.claude/commands/craft.md` — Add `<step_h5>` section

**Dependencies**: Task 5 (sprint must exist)

---

### Task 7: Implement State File Management
**Priority**: P1 (Required for Resume)
**Type**: Feature Addition

**Description**:
Manage `grimoires/sigil/hammer-state.json` for tracking progress and enabling resume.

**Acceptance Criteria**:
- [ ] Schema documented:
  ```json
  {
    "active": boolean,
    "feature": string,
    "started_at": ISO timestamp,
    "phase": "prd_complete" | "sdd_complete" | "sprint_complete" | "awaiting_execution",
    "phases_completed": [{phase, completed_at, artifact}],
    "context_seeded": {observations: number, taste_patterns: number},
    "components_identified": [{name, type, physics}]
  }
  ```
- [ ] On `/craft` start, checks for existing active state
- [ ] If active state exists, offers:
  1. Resume from current phase
  2. Abandon and start fresh
  3. Switch to chisel mode
- [ ] Clears state after `/run sprint-plan` completes (coordination with Loa's run mode)

**Files Modified**:
- `.claude/commands/craft.md` — Add state management logic
- `grimoires/sigil/hammer-state.json` — Runtime file (not created until first hammer run)

**Dependencies**: Task 1 (integrated into scope detection check)

---

### Task 8: Add Hammer Mode Examples
**Priority**: P2 (Documentation)
**Type**: Documentation

**Description**:
Add examples section showing hammer mode workflow.

**Acceptance Criteria**:
- [ ] Example 1: Fresh hammer start (no existing artifacts)
- [ ] Example 2: Hammer with existing PRD (skips /plan-and-analyze)
- [ ] Example 3: User chooses "Chisel anyway"
- [ ] Example 4: Resume interrupted hammer session
- [ ] Each example shows detection → orchestration → handoff

**Files Modified**:
- `.claude/commands/craft.md` — Add to examples section

**Dependencies**: Tasks 1-7 complete

---

### Task 9: Add Error Handling
**Priority**: P1 (Reliability)
**Type**: Feature Addition

**Description**:
Handle failures in Loa command invocation and state corruption.

**Acceptance Criteria**:
- [ ] Loa command failures:
  - `/plan-and-analyze` fails → Offer retry or chisel fallback
  - `/architect` fails → Offer retry with different approach
  - `/sprint-plan` fails → Offer manual breakdown
- [ ] State corruption:
  - Invalid JSON → Delete and start fresh
  - Phase mismatch → Trust artifacts, update state
  - Orphaned state (>24h old) → Offer resume or abandon
- [ ] Each error shows clear recovery path

**Files Modified**:
- `.claude/commands/craft.md` — Add error handling sections within hammer workflow

**Dependencies**: Tasks 1-7 complete

---

### Task 10: Integration Testing
**Priority**: P1 (Quality)
**Type**: Testing

**Description**:
Verify hammer mode works end-to-end with Loa commands.

**Acceptance Criteria**:
- [ ] Test: Fresh hammer start completes full sequence
- [ ] Test: Existing PRD skips /plan-and-analyze correctly
- [ ] Test: Existing SDD skips /architect correctly
- [ ] Test: Resume from interrupted state works
- [ ] Test: "Chisel anyway" falls back to normal /craft
- [ ] Test: Scope detection edge cases (ambiguous inputs)

**Method**: Manual testing with real `/craft` invocations

**Dependencies**: All implementation tasks complete

---

### Task 11: Update README and CHANGELOG (Release Quality)
**Priority**: P0 (Release Requirement)
**Type**: Documentation

**Description**:
Update README.md and CHANGELOG.md with release-quality documentation matching Loa's structure and grounded in the actual workflow (craft-first, hammer/chisel detection, Loa orchestration).

**Acceptance Criteria**:
- [ ] README.md updated:
  - Version badge updated to 2.4.0
  - "What's New" section reflects Craft States feature
  - Commands table updated with workflow clarity
  - Usage section shows hammer vs chisel workflow
  - Clear explanation of Sigil as Loa Construct relationship
  - Pair Design section reflects actual workflow (craft → discover complexity → plan)
- [ ] CHANGELOG.md updated:
  - New version entry: 2.4.0 "Craft States"
  - Feature list with hammer/chisel modes
  - Breaking changes (if any)
  - Migration notes from previous workflow
- [ ] Structure matches Loa's documentation quality:
  - Clear mental model diagrams
  - Practical usage examples
  - Philosophy grounded in real workflow
- [ ] PR/Release description drafted

**Files Modified**:
- `README.md`
- `CHANGELOG.md`

**Dependencies**: Tasks 1-10 complete (feature must be implemented first)

---

## Task Dependency Graph

```
                    ┌─────────────────┐
                    │   Task 1        │
                    │ Scope Detection │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
       ┌──────────┐   ┌──────────┐   ┌──────────┐
       │ Task 7   │   │ Task 2   │   │(chisel)  │
       │  State   │   │   H1     │   │unchanged │
       │  Mgmt    │   │ Artifact │   │          │
       └──────────┘   │  Check   │   └──────────┘
              │       └────┬─────┘
              │            │
              │            ▼
              │      ┌──────────┐
              │      │ Task 3   │
              │      │   H2     │
              │      │ Context  │
              │      │+ p-and-a │
              │      └────┬─────┘
              │            │
              │            ▼
              │      ┌──────────┐
              │      │ Task 4   │
              │      │   H3     │
              │      │/architect│
              │      └────┬─────┘
              │            │
              │            ▼
              │      ┌──────────┐
              │      │ Task 5   │
              │      │   H4     │
              │      │ sprint   │
              │      └────┬─────┘
              │            │
              │            ▼
              │      ┌──────────┐
              └─────►│ Task 6   │
                     │   H5     │
                     │ Summary  │
                     └────┬─────┘
                          │
              ┌───────────┼───────────┐
              │           │           │
              ▼           ▼           ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐
        │ Task 8   │ │ Task 9   │ │ Task 10  │
        │ Examples │ │  Errors  │ │  Testing │
        └──────────┘ └──────────┘ └──────────┘
              │           │           │
              └───────────┼───────────┘
                          │
                          ▼
                    ┌──────────┐
                    │ Task 11  │
                    │  README  │
                    │CHANGELOG │
                    └──────────┘
```

---

## Implementation Sequence

| Order | Task | Rationale |
|-------|------|-----------|
| 1 | Task 1: Scope Detection | Entry point for all hammer functionality |
| 2 | Task 7: State Management | Needed before hammer phases for progress tracking |
| 3 | Task 2: H1 Artifact Check | First hammer phase |
| 4 | Task 3: H2 Context + p-and-a | Second hammer phase |
| 5 | Task 4: H3 /architect | Third hammer phase |
| 6 | Task 5: H4 /sprint-plan | Fourth hammer phase |
| 7 | Task 6: H5 Summary | Final hammer phase |
| 8 | Task 9: Error Handling | Reliability before release |
| 9 | Task 8: Examples | Documentation |
| 10 | Task 10: Testing | Validation |
| 11 | Task 11: README + CHANGELOG | Release documentation (Loa-style quality) |

---

## Artifacts Produced

| Artifact | Created By | Location |
|----------|------------|----------|
| Modified craft.md | Implementation | `.claude/commands/craft.md` |
| hammer-state.json (runtime) | First hammer run | `grimoires/sigil/hammer-state.json` |
| PRD (via Loa) | /plan-and-analyze | `grimoires/loa/prd.md` |
| SDD (via Loa) | /architect | `grimoires/loa/sdd.md` |
| Sprint (via Loa) | /sprint-plan | `grimoires/loa/sprint.md` |
| Updated README | Task 11 | `README.md` |
| Updated CHANGELOG | Task 11 | `CHANGELOG.md` |

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Loa commands unavailable | Error handling with fallback to chisel |
| State file corruption | Auto-recovery, trust artifacts over state |
| User interrupts mid-sequence | State tracking enables resume |
| Scope detection false positives | User can always choose "Chisel anyway" |
| Long-running sequences | Clear progress indicators, phase checkpoints |

---

## Success Criteria

| Metric | Target |
|--------|--------|
| Scope detection accuracy | 90% correct (user override < 10%) |
| Hammer completion rate | 80% of started sequences complete |
| Resume success rate | 100% of interrupted sessions resumable |
| Loa integration | 100% correct command invocation |
| Backward compatibility | Chisel mode unchanged |

---

## Post-Sprint

After implementation:
1. Monitor hammer vs chisel usage patterns in taste.md
2. Gather feedback on scope detection accuracy
3. Consider incremental hammer mode (partial planning)
4. Evaluate multi-repo support priority

---

*Sprint plan generated for Sigil Craft States v1.0.0*
*Ready to implement. Run `/run sprint-plan` when ready.*
