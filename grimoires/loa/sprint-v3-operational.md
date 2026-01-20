# Sigil v3: Operational Infrastructure - Sprint Plan

```
    ╔═══════════════════════════════════════════════════════════╗
    ║  SIGIL v3.0 - SPRINT PLAN                                 ║
    ║                                                           ║
    ║  "Actionable Tasks for Production-Grade Infrastructure"   ║
    ╚═══════════════════════════════════════════════════════════╝
```

**Version**: 2.0.0
**Created**: 2026-01-20
**Updated**: 2026-01-20 (post-/ride analysis)
**PRD Reference**: `grimoires/loa/prd-v3-operational-infrastructure.md`
**SDD Reference**: `grimoires/loa/sdd-v3-operational-infrastructure.md`
**Status**: ✅ FEATURES IMPLEMENTED - Documentation Sync Pending

---

## /ride Analysis Summary (2026-01-20)

The `/ride` command analysis revealed that **most v3 features are already implemented**:

| Phase | Status | Evidence |
|-------|--------|----------|
| Phase 1 (MVP) | ✅ Complete | Truth hierarchy in CLAUDE.md, NOTES.md exists |
| Phase 2 | ✅ Available | Feature flags in constitution.yaml |
| Phase 3 | ✅ Available | continuous-learning skill, run-mode protocol |

**Current Drift Score**: 8/100 (healthy, was 35/100)
**Governance Score**: 85/100

### Remaining Work: Documentation Sync

Only documentation gaps remain:
- 3 Ghosts (documented but missing)
- 5 Shadows (in code but undocumented)
- CODEOWNERS file missing

---

## ACTIVE SPRINT: Documentation Sync

**Goal**: Close drift gaps, achieve drift score 0/100
**Duration**: ~1 hour
**Priority**: Documentation only (no code changes)

### Task DS-1: Create CODEOWNERS File

**ID**: DS-T01
**Priority**: P1
**Effort**: XS (5 min)
**Status**: pending

**Description**:
Create GitHub CODEOWNERS file for automatic PR reviewer assignment.

**Acceptance Criteria**:
- [ ] CODEOWNERS file exists at repository root
- [ ] Physics rules assigned to maintainers
- [ ] Commands assigned to maintainers

**File to Create**: `CODEOWNERS`
```
# Sigil CODEOWNERS
* @0xHoneyJar/sigil-maintainers
.claude/rules/ @0xHoneyJar/sigil-physics
.claude/commands/ @0xHoneyJar/sigil-maintainers
grimoires/sigil/constitution.yaml @0xHoneyJar/sigil-maintainers
```

---

### Task DS-2: Add v2.5.0 CHANGELOG Entry

**ID**: DS-T02
**Priority**: P1
**Effort**: S (15 min)
**Status**: pending

**Description**:
Document the v2.5.0 release features in CHANGELOG.md.

**Acceptance Criteria**:
- [ ] v2.5.0 entry added to CHANGELOG.md
- [ ] Lists Data Physics as new feature
- [ ] Lists Web3 Flow Validation patterns
- [ ] Follows Keep a Changelog format

**Content**:
```markdown
## [2.5.0] - 2026-01-20 "Web3 Flow Validation"

### Added
- **Data Physics Layer** (rule 19): Explicit data source selection for Web3
- **Web3 Flow Patterns** (rule 20): Multi-step transaction patterns
- **Run Mode Commands**: /run, /run-status, /run-halt, /run-resume, /snapshot, /test-flow
- **/observe diagnose mode**: Blockchain state inspection

### Changed
- `/craft` analysis box shows Data Physics guidance for Web3 components

### Fixed
- BigInt falsy check patterns (`0n` is falsy in JavaScript)
- Stale closure issues in transaction receipt callbacks
```

---

### Task DS-3: Update README Physics Diagram

**ID**: DS-T03
**Priority**: P1
**Effort**: S (10 min)
**Status**: pending

**Description**:
Update README.md to show 5 physics layers instead of 3 (add Data Physics).

**Acceptance Criteria**:
- [ ] Physics model shows 5 layers: Behavioral, Animation, Material, Voice, Data
- [ ] Data Physics brief description added
- [ ] Links to rule 19 for details

---

### Task DS-4: Document Run Mode Commands

**ID**: DS-T04
**Priority**: P2
**Effort**: S (15 min)
**Status**: pending

**Description**:
Add Run Mode section to README.md documenting the 7 run mode commands.

**Acceptance Criteria**:
- [ ] Run Mode section added to README commands table
- [ ] Brief description of autonomous execution
- [ ] Links to relevant command files

---

### Task DS-5: Fix Ghost References

**ID**: DS-T05
**Priority**: P2
**Effort**: XS (10 min)
**Status**: pending

**Description**:
Address the 3 ghost items:
1. Voice Physics: Document as embedded in /craft (no separate rule file)
2. `loa install sigil`: Update to `git clone` as install method
3. sigil-toolbar: Mark as "Planned" in CHANGELOG

**Acceptance Criteria**:
- [ ] Ghost items addressed or removed
- [ ] No false documentation claims remain

---

### Task DS-6: Document Feature Flags

**ID**: DS-T06
**Priority**: P3
**Effort**: XS (5 min)
**Status**: pending

**Description**:
Verify constitution.yaml feature flags have explanatory comments.

**Acceptance Criteria**:
- [ ] Each feature flag has descriptive comment
- [ ] Phase groupings labeled

---

## Documentation Sprint Summary

| Task | Priority | Effort | Status |
|------|----------|--------|--------|
| DS-1 Create CODEOWNERS | P1 | XS | ✅ Complete |
| DS-2 Add v2.5.0 CHANGELOG | P1 | S | ✅ Complete |
| DS-3 Update README Physics | P1 | S | ✅ Already done |
| DS-4 Document Run Mode | P2 | S | ✅ Complete |
| DS-5 Fix Ghost References | P2 | XS | ✅ Complete |
| DS-6 Document Feature Flags | P3 | XS | ✅ Complete |

**Total Effort**: ~1 hour
**Actual Effort**: ~15 minutes
**Outcome**: All tasks completed

### Implementation Summary (Run 2026-01-20)

**Files Created**:
- `CODEOWNERS` — GitHub code owners for PR reviews

**Files Modified**:
- `CHANGELOG.md` — Added v2.5.0 entry with Data Physics, Web3 Flow Patterns, Run Mode
- `README.md` — Fixed install instructions (removed ghost `loa install`), added Run Mode commands
- `grimoires/sigil/constitution.yaml` — Enhanced feature flag documentation

**Ghosts Resolved**:
- `loa install sigil` → Changed to `git clone` + `/mount` instructions
- Voice Physics rule file → Already documented as embedded in /craft (no action needed)
- sigil-toolbar → Noted as planned feature (no false claim)

---

## Success Criteria

After completing documentation sprint:
1. Run `/ride` - Should show 0 Ghosts, 0 Shadows
2. CODEOWNERS present in governance audit
3. v2.5.0 documented in CHANGELOG

---

## Implementation Command

```
/implement documentation-sync
```

---

## ARCHIVED: Original v3 Implementation Plan

> The following sprint plan was created before `/ride` analysis revealed
> that v3 features are already implemented. Kept for reference.

---

---

## Sprint Overview

| Sprint | Theme | Duration | Goal |
|--------|-------|----------|------|
| Sprint 1 | MVP - Prevent Loops | Week 1-2 | Session recovery, feedback-first, anti-patterns |
| Sprint 2 | Quality - Ship Clean | Week 3-4 | Validators, attention budget, zone docs |
| Sprint 3 | Intelligence - Self-Improve | Week 5-6 | Learning loop, trajectory, safety |

**Team Size**: 1 developer (AI-assisted)
**Velocity**: ~8 tasks per sprint

---

## Sprint 1: MVP - Prevent Loops

**Goal**: Enable session recovery in <100 tokens, reduce loop triggers to <10%

**Features Delivered**:
- FR-1: Lossless State Protocol
- FR-2: Structured Agentic Memory (NOTES.md)
- FR-6: Feedback-First Implementation
- FR-9: Explicit Anti-Patterns Documentation

### Task 1.1: Add Truth Hierarchy to CLAUDE.md

**ID**: S1-T01
**Priority**: P0
**Effort**: Small (1-2 hours)
**Dependencies**: None
**Status**: pending

**Description**:
Add the truth hierarchy section to CLAUDE.md establishing the priority order for conflicting information sources.

**Acceptance Criteria**:
- [ ] `<truth_hierarchy>` section added to CLAUDE.md
- [ ] Hierarchy defined: Code > taste.md > craft-state.md > NOTES.md > context window
- [ ] Each level explains when to trust and verify
- [ ] Examples provided for conflict resolution

**Files to Modify**:
- `CLAUDE.md`

**Testing**:
- Manual: Read CLAUDE.md, verify section is clear and complete
- Verify XML tags properly nested

---

### Task 1.2: Add Grounding Enforcement to CLAUDE.md

**ID**: S1-T02
**Priority**: P0
**Effort**: Small (1-2 hours)
**Dependencies**: S1-T01
**Status**: pending

**Description**:
Add grounding enforcement rules requiring claims to cite sources with specific formats.

**Acceptance Criteria**:
- [ ] `<grounding>` section added to CLAUDE.md
- [ ] Citation formats defined for: physics rules, taste signals, code behavior, patterns, detection
- [ ] Format template: "X because Y (source: Z)"
- [ ] Example citations provided

**Files to Modify**:
- `CLAUDE.md`

**Testing**:
- Manual: Verify section follows existing CLAUDE.md style
- Verify examples are accurate file references

---

### Task 1.3: Add Recovery Protocol to CLAUDE.md

**ID**: S1-T03
**Priority**: P0
**Effort**: Small (1-2 hours)
**Dependencies**: S1-T01, S1-T02
**Status**: pending

**Description**:
Add the recovery protocol for resuming after context clears with <100 token budget.

**Acceptance Criteria**:
- [ ] `<recovery_protocol>` section added to CLAUDE.md
- [ ] 4-step recovery process documented
- [ ] Token budget target stated (<100 tokens)
- [ ] Each step specifies what to read and extract

**Files to Modify**:
- `CLAUDE.md`

**Testing**:
- Manual: Simulate recovery by reading files in order
- Verify token count estimate is realistic

---

### Task 1.4: Create NOTES.md Template

**ID**: S1-T04
**Priority**: P0
**Effort**: Small (1 hour)
**Dependencies**: None
**Status**: pending

**Description**:
Create the initial NOTES.md file with all required sections for session memory.

**Acceptance Criteria**:
- [ ] `grimoires/sigil/NOTES.md` created
- [ ] YAML frontmatter with `last_updated` and `session_id`
- [ ] Sections: Current Focus, Physics Decisions, Blockers, Learnings, Session Continuity
- [ ] Placeholder content for empty state

**Files to Create**:
- `grimoires/sigil/NOTES.md`

**Testing**:
- Manual: Verify file parses as valid markdown with YAML frontmatter
- Verify all sections from SDD template are present

---

### Task 1.5: Add NOTES.md Read to craft.md Step 0

**ID**: S1-T05
**Priority**: P0
**Effort**: Medium (2-3 hours)
**Dependencies**: S1-T04
**Status**: pending

**Description**:
Modify craft.md to read NOTES.md at the start of the workflow for session recovery.

**Acceptance Criteria**:
- [ ] Step 0 includes NOTES.md read instruction
- [ ] Session continuity extracted: last action, next action, context needed
- [ ] Physics decisions surfaced if same component
- [ ] Blockers checked for unresolved items
- [ ] Feature flag check: `features.notes_memory`

**Files to Modify**:
- `.claude/commands/craft.md`

**Testing**:
- Manual: Run /craft, verify NOTES.md is read
- Verify session recovery works after simulated context clear

---

### Task 1.6: Add NOTES.md Write to craft.md Step 12

**ID**: S1-T06
**Priority**: P0
**Effort**: Medium (2-3 hours)
**Dependencies**: S1-T05
**Status**: pending

**Description**:
Modify craft.md to update NOTES.md at the end of the workflow with session state.

**Acceptance Criteria**:
- [ ] Step 12 includes NOTES.md write instruction
- [ ] Updates: Current Focus, Physics Decisions, Session Continuity
- [ ] Last action set to completed action
- [ ] Next action set based on workflow outcome
- [ ] Timestamp updated in YAML frontmatter
- [ ] Feature flag check: `features.notes_memory`

**Files to Modify**:
- `.claude/commands/craft.md`

**Testing**:
- Manual: Run /craft to completion, verify NOTES.md updated
- Verify all sections have accurate content

---

### Task 1.7: Add Step -1 Feedback-First Check to craft.md

**ID**: S1-T07
**Priority**: P1
**Effort**: Medium (3-4 hours)
**Dependencies**: S1-T06
**Status**: pending

**Description**:
Add the feedback-first check as Step -1 before any craft work begins.

**Acceptance Criteria**:
- [ ] Step -1 added before Step 0 in craft.md
- [ ] Check 1: Recent taste.md signals for same component
- [ ] Check 2: craft-state.md loop_detection.triggered
- [ ] Check 3: pending-learnings.md relevant entries
- [ ] Interactive prompts for each check type
- [ ] Skip conditions documented
- [ ] Feature flag check: `features.feedback_first`

**Files to Modify**:
- `.claude/commands/craft.md`

**Testing**:
- Manual: Create REJECT signal in taste.md, run /craft same component
- Verify feedback is surfaced with options

---

### Task 1.8: Add Anti-Patterns to 00-sigil-core.md

**ID**: S1-T08
**Priority**: P2
**Effort**: Small (1-2 hours)
**Dependencies**: None
**Status**: pending

**Description**:
Add the anti-patterns section documenting "Never Do" patterns for code generation, user interaction, and state management.

**Acceptance Criteria**:
- [ ] `<anti_patterns>` section added to 00-sigil-core.md
- [ ] Three categories: Code Generation, User Interaction, State Management
- [ ] Each anti-pattern has: pattern, why bad, correct approach
- [ ] At least 5 anti-patterns per category

**Files to Modify**:
- `.claude/rules/00-sigil-core.md`

**Testing**:
- Manual: Review section for completeness
- Verify anti-patterns align with reference frameworks

---

### Task 1.9: Add Feature Flags to constitution.yaml

**ID**: S1-T09
**Priority**: P0
**Effort**: Small (1 hour)
**Dependencies**: None
**Status**: pending

**Description**:
Add the features section to constitution.yaml with all v3 feature flags.

**Acceptance Criteria**:
- [ ] `features:` section added to constitution.yaml
- [ ] Phase 1 flags: `lossless_state`, `notes_memory`, `feedback_first`, `anti_patterns` (all true)
- [ ] Phase 2 flags: `subagent_validators`, `attention_budget`, `zone_architecture` (all false)
- [ ] Phase 3 flags: `continuous_learning`, `trajectory_logging`, `run_mode_safety` (all false)
- [ ] Comments explaining each flag

**Files to Modify**:
- `grimoires/sigil/constitution.yaml`

**Testing**:
- Manual: Verify YAML parses correctly
- Verify feature flags are readable by craft.md

---

### Task 1.10: Add Feature Flag Check to craft.md

**ID**: S1-T10
**Priority**: P0
**Effort**: Small (1-2 hours)
**Dependencies**: S1-T09
**Status**: pending

**Description**:
Add feature flag checking logic to craft.md workflow start.

**Acceptance Criteria**:
- [ ] Feature flag read at workflow start
- [ ] Conditional execution based on flag values
- [ ] Step -1 gated by `features.feedback_first`
- [ ] NOTES.md operations gated by `features.notes_memory`
- [ ] Documentation of flag → step mapping

**Files to Modify**:
- `.claude/commands/craft.md`

**Testing**:
- Manual: Toggle flags, verify behavior changes
- Verify disabled features skip cleanly

---

### Sprint 1 Completion Criteria

- [ ] All 10 tasks completed
- [ ] Feature flags all enabled (Phase 1)
- [ ] Session recovery demonstrated in <100 tokens
- [ ] Feedback-first check working for recent signals
- [ ] Anti-patterns documented and referenceable

**Estimated Total Effort**: 15-20 hours

---

## Sprint 2: Quality - Ship Clean

**Goal**: 95% first-pass validation, context-aware responses

**Features Delivered**:
- FR-3: Subagent Validation Architecture
- FR-5: Context Hygiene & Attention Budget
- FR-7: Three-Zone Architecture Documentation

### Task 2.1: Create physics-validator.md Subagent

**ID**: S2-T01
**Priority**: P1
**Effort**: Large (4-5 hours)
**Dependencies**: Sprint 1 complete
**Status**: pending

**Description**:
Create the physics validator subagent that validates generated components match Sigil design physics.

**Acceptance Criteria**:
- [ ] `.claude/subagents/physics-validator.md` created
- [ ] YAML frontmatter with triggers, severity levels, output path
- [ ] Effect validation checks
- [ ] Timing validation checks
- [ ] Protected capability validation checks (CRITICAL level)
- [ ] Sync strategy validation checks
- [ ] Verdict determination logic

**Files to Create**:
- `.claude/subagents/physics-validator.md`

**Testing**:
- Manual: Generate component with missing cancel button
- Verify CRITICAL_VIOLATION raised

---

### Task 2.2: Create codebase-validator.md Subagent

**ID**: S2-T02
**Priority**: P1
**Effort**: Large (4-5 hours)
**Dependencies**: S2-T01
**Status**: pending

**Description**:
Create the codebase validator subagent that validates generated code matches discovered codebase conventions.

**Acceptance Criteria**:
- [ ] `.claude/subagents/codebase-validator.md` created
- [ ] YAML frontmatter with triggers, severity levels, output path
- [ ] Import style validation
- [ ] Pattern validation
- [ ] Naming convention validation
- [ ] How to check instructions for each

**Files to Create**:
- `.claude/subagents/codebase-validator.md`

**Testing**:
- Manual: Generate component with wrong import style
- Verify DRIFT_DETECTED raised

---

### Task 2.3: Add Step 5.5 Validation Gate to craft.md

**ID**: S2-T03
**Priority**: P1
**Effort**: Medium (2-3 hours)
**Dependencies**: S2-T01, S2-T02
**Status**: pending

**Description**:
Add validation step after applying changes that runs both validators.

**Acceptance Criteria**:
- [ ] Step 5.5 added between Step 5 and Step 6
- [ ] Runs physics-validator first, then codebase-validator
- [ ] CRITICAL_VIOLATION blocks with acknowledgment prompt
- [ ] DRIFT_DETECTED shows warning, allows proceed
- [ ] COMPLIANT silent pass
- [ ] Feature flag check: `features.subagent_validators`

**Files to Modify**:
- `.claude/commands/craft.md`

**Testing**:
- Manual: Generate component, verify validators run
- Verify blocking behavior on CRITICAL

---

### Task 2.4: Add Attention Budget to CLAUDE.md

**ID**: S2-T04
**Priority**: P1
**Effort**: Medium (2-3 hours)
**Dependencies**: None
**Status**: pending

**Description**:
Add attention budget section with zone definitions and response length targets.

**Acceptance Criteria**:
- [ ] `<attention_budget>` section added to CLAUDE.md
- [ ] Four zones defined: Green (0-60%), Yellow (60-80%), Orange (80-90%), Red (90-100%)
- [ ] Behavior described for each zone
- [ ] Response length targets: analysis 15-20 lines, confirmation 1 line, etc.
- [ ] Detection method documented

**Files to Modify**:
- `CLAUDE.md`

**Testing**:
- Manual: Verify section is clear and actionable
- Verify targets align with minimal output principle

---

### Task 2.5: Create Mode Reference Files

**ID**: S2-T05
**Priority**: P2
**Effort**: Large (4-5 hours)
**Dependencies**: None
**Status**: pending

**Description**:
Extract mode-specific instructions to separate files to reduce craft.md size.

**Acceptance Criteria**:
- [ ] `.claude/skills/crafting-physics/modes/hammer.md` created
- [ ] `.claude/skills/crafting-physics/modes/debug.md` created
- [ ] `.claude/skills/crafting-physics/modes/explore.md` created
- [ ] Token cost estimate for each (~1000-2000 tokens)
- [ ] Loading logic documented

**Files to Create**:
- `.claude/skills/crafting-physics/modes/hammer.md`
- `.claude/skills/crafting-physics/modes/debug.md`
- `.claude/skills/crafting-physics/modes/explore.md`

**Testing**:
- Manual: Verify files load correctly when mode detected
- Verify craft.md references work

---

### Task 2.6: Add Zone Architecture to CLAUDE.md

**ID**: S2-T06
**Priority**: P2
**Effort**: Small (1-2 hours)
**Dependencies**: None
**Status**: pending

**Description**:
Add zone architecture documentation defining System, State, and App zones.

**Acceptance Criteria**:
- [ ] `<zone_architecture>` section added to CLAUDE.md
- [ ] System Zone (.claude/) documented with write restrictions
- [ ] State Zone (grimoires/) documented with ownership
- [ ] App Zone (src/) documented with confirmation requirement
- [ ] Override mechanism documented

**Files to Modify**:
- `CLAUDE.md`

**Testing**:
- Manual: Verify section is clear
- Verify zone boundaries match actual structure

---

### Task 2.7: Create .claude/overrides/ Directory

**ID**: S2-T07
**Priority**: P2
**Effort**: Small (1 hour)
**Dependencies**: S2-T06
**Status**: pending

**Description**:
Create the overrides directory with README explaining the mechanism.

**Acceptance Criteria**:
- [ ] `.claude/overrides/` directory created
- [ ] `README.md` with override naming convention
- [ ] Example override template
- [ ] Explanation of when overrides are loaded

**Files to Create**:
- `.claude/overrides/README.md`

**Testing**:
- Manual: Verify README is clear
- Verify override example is valid

---

### Task 2.8: Enable Phase 2 Feature Flags

**ID**: S2-T08
**Priority**: P1
**Effort**: Small (30 mins)
**Dependencies**: S2-T01 through S2-T07
**Status**: pending

**Description**:
Enable Phase 2 feature flags after all tasks complete.

**Acceptance Criteria**:
- [ ] `features.subagent_validators: true`
- [ ] `features.attention_budget: true`
- [ ] `features.zone_architecture: true`

**Files to Modify**:
- `grimoires/sigil/constitution.yaml`

**Testing**:
- Manual: Run /craft, verify validators execute
- Verify attention budget affects responses

---

### Sprint 2 Completion Criteria

- [ ] All 8 tasks completed
- [ ] Phase 2 feature flags enabled
- [ ] Validators producing verdicts
- [ ] Attention budget affecting response sizes
- [ ] Zone architecture documented

**Estimated Total Effort**: 20-25 hours

---

## Sprint 3: Intelligence - Self-Improve

**Goal**: 2 learnings/week extracted automatically, safe hammer mode

**Features Delivered**:
- FR-4: Continuous Learning Loop
- FR-8: Run Mode Safety Defense
- FR-10: Decision Trajectory Logging

### Task 3.1: Create pending-learnings.md Template

**ID**: S3-T01
**Priority**: P1
**Effort**: Small (1 hour)
**Dependencies**: Sprint 2 complete
**Status**: pending

**Description**:
Create the pending learnings file for storing extracted discoveries.

**Acceptance Criteria**:
- [ ] `grimoires/sigil/pending-learnings.md` created
- [ ] Header explaining purpose and review command
- [ ] Empty state content
- [ ] Learning entry template in comments

**Files to Create**:
- `grimoires/sigil/pending-learnings.md`

**Testing**:
- Manual: Verify file is valid markdown
- Verify template is complete

---

### Task 3.2: Add Step 12.5 Learning Extraction to craft.md

**ID**: S3-T02
**Priority**: P1
**Effort**: Medium (3-4 hours)
**Dependencies**: S3-T01
**Status**: pending

**Description**:
Add learning extraction check after feedback collection.

**Acceptance Criteria**:
- [ ] Step 12.5 added after Step 12
- [ ] Trigger conditions: 3+ iterations with PARTIAL, undocumented pattern, Web3 footgun
- [ ] Extraction process: generate entry with context, discovery, evidence, recommendation
- [ ] Append to pending-learnings.md
- [ ] Notification shown
- [ ] Feature flag check: `features.continuous_learning`

**Files to Modify**:
- `.claude/commands/craft.md`

**Testing**:
- Manual: Trigger 3+ iterations, verify learning extracted
- Verify entry format matches schema

---

### Task 3.3: Create /skill-audit Command

**ID**: S3-T03
**Priority**: P1
**Effort**: Medium (3-4 hours)
**Dependencies**: S3-T02
**Status**: pending

**Description**:
Create the command for reviewing and approving pending learnings.

**Acceptance Criteria**:
- [ ] `.claude/commands/skill-audit.md` created
- [ ] Workflow: read pending-learnings, show each, ask approve/reject
- [ ] Promotion options: taste.md pattern, rule update, constitution.yaml
- [ ] Archive rejected learnings
- [ ] Mark approved learnings

**Files to Create**:
- `.claude/commands/skill-audit.md`

**Testing**:
- Manual: Add test learning, run /skill-audit
- Verify approval workflow works

---

### Task 3.4: Create trajectory/ Directory Structure

**ID**: S3-T04
**Priority**: P2
**Effort**: Small (1 hour)
**Dependencies**: None
**Status**: pending

**Description**:
Create the trajectory logging directory with README.

**Acceptance Criteria**:
- [ ] `grimoires/sigil/trajectory/` directory created
- [ ] `README.md` explaining purpose and file naming
- [ ] Example trajectory entry
- [ ] Retention policy documented

**Files to Create**:
- `grimoires/sigil/trajectory/README.md`

**Testing**:
- Manual: Verify directory structure
- Verify README is clear

---

### Task 3.5: Add Step 3b Trajectory Write to craft.md

**ID**: S3-T05
**Priority**: P2
**Effort**: Medium (2-3 hours)
**Dependencies**: S3-T04
**Status**: pending

**Description**:
Add trajectory logging after physics analysis.

**Acceptance Criteria**:
- [ ] Step 3b added after Step 3
- [ ] Write trajectory entry with: input, detection, decision
- [ ] File naming: `{YYYY-MM-DD}-{component-name}.md`
- [ ] Append if file exists for same day/component
- [ ] Feature flag check: `features.trajectory_logging`

**Files to Modify**:
- `.claude/commands/craft.md`

**Testing**:
- Manual: Run /craft, verify trajectory file created
- Verify entry format matches schema

---

### Task 3.6: Add Trajectory Outcome Update to craft.md

**ID**: S3-T06
**Priority**: P2
**Effort**: Small (1-2 hours)
**Dependencies**: S3-T05
**Status**: pending

**Description**:
Update trajectory entry with outcome after feedback collection.

**Acceptance Criteria**:
- [ ] Step 12 includes trajectory update
- [ ] Outcome section filled: signal, changes (if MODIFY), notes
- [ ] Feature flag check: `features.trajectory_logging`

**Files to Modify**:
- `.claude/commands/craft.md`

**Testing**:
- Manual: Complete /craft workflow, verify outcome filled
- Verify MODIFY changes recorded

---

### Task 3.7: Add Hammer Mode Safety to craft.md

**ID**: S3-T07
**Priority**: P2
**Effort**: Medium (3-4 hours)
**Dependencies**: None
**Status**: pending

**Description**:
Add safety mechanisms for hammer mode execution.

**Acceptance Criteria**:
- [ ] Circuit breaker: stop on 2 consecutive failures
- [ ] Opt-in confirmation before hammer mode
- [ ] Phase checkpoints after each Loa command
- [ ] Duration warning at 30 minutes
- [ ] Feature flag check: `features.run_mode_safety`

**Files to Modify**:
- `.claude/commands/craft.md` (hammer section)

**Testing**:
- Manual: Start hammer mode, verify confirmation shown
- Simulate failure, verify circuit breaker triggers

---

### Task 3.8: Enable Phase 3 Feature Flags

**ID**: S3-T08
**Priority**: P1
**Effort**: Small (30 mins)
**Dependencies**: S3-T01 through S3-T07
**Status**: pending

**Description**:
Enable Phase 3 feature flags after all tasks complete.

**Acceptance Criteria**:
- [ ] `features.continuous_learning: true`
- [ ] `features.trajectory_logging: true`
- [ ] `features.run_mode_safety: true`

**Files to Modify**:
- `grimoires/sigil/constitution.yaml`

**Testing**:
- Manual: Trigger learning extraction, verify works
- Verify trajectory files created
- Verify hammer mode safety active

---

### Sprint 3 Completion Criteria

- [ ] All 8 tasks completed
- [ ] Phase 3 feature flags enabled
- [ ] Learning extraction working
- [ ] /skill-audit command functional
- [ ] Trajectory logging active
- [ ] Hammer mode safety implemented

**Estimated Total Effort**: 18-23 hours

---

## Risk Assessment

### High Risk Tasks

| Task | Risk | Mitigation |
|------|------|------------|
| S1-T05, S1-T06 | craft.md changes may break flow | Feature flags, test each step |
| S2-T01, S2-T02 | Validators may be too strict | Start with DRIFT only |
| S3-T07 | Hammer safety may interrupt valid workflows | User can skip with confirmation |

### Dependencies

```
Sprint 1:
T01 ─► T02 ─► T03
T04 ─► T05 ─► T06 ─► T07
T09 ─► T10
T08 (independent)

Sprint 2:
T01 ─► T02 ─► T03
T04, T05, T06, T07 (independent)
All ─► T08

Sprint 3:
T01 ─► T02 ─► T03
T04 ─► T05 ─► T06
T07 (independent)
All ─► T08
```

---

## Success Metrics

### Per-Sprint Targets

| Metric | Sprint 1 | Sprint 2 | Sprint 3 |
|--------|----------|----------|----------|
| Avg iterations | 2.5 | 2.2 | 2.0 |
| Loop triggers | <10% | <7% | <5% |
| Recovery time | <30s | <30s | <30s |
| Validation pass | N/A | 95% | 95% |
| Learning rate | 0/week | 1/week | 2/week |

### Final Validation

- [ ] Session recovery in <100 tokens demonstrated
- [ ] Feedback surfaced before repeated work
- [ ] Validators catching physics drift
- [ ] Learnings extracted and promotable
- [ ] Trajectory logs enabling debugging
- [ ] Hammer mode running safely

---

## Implementation Notes

### Getting Started

1. Start with S1-T01 (truth hierarchy)
2. Work through Sprint 1 sequentially (dependencies)
3. Test each feature before moving to next
4. Enable feature flags only after testing

### File Change Summary

| Sprint | Files Created | Files Modified |
|--------|---------------|----------------|
| Sprint 1 | 1 (NOTES.md) | 4 (CLAUDE.md, craft.md, constitution.yaml, 00-sigil-core.md) |
| Sprint 2 | 5 (validators, modes, overrides) | 2 (CLAUDE.md, craft.md) |
| Sprint 3 | 3 (pending-learnings, trajectory, skill-audit) | 2 (craft.md, constitution.yaml) |

### Next Step

```
/implement sprint-1
```

---

**Document Version**: 1.0.0
**Last Updated**: 2026-01-20
