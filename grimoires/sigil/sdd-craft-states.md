# SDD: Craft States — Hammer vs Chisel

```
    +===============================================+
    |  CRAFT STATES                                 |
    |  Software Design Document                     |
    |                                               |
    |  Version 1.0.0                                |
    +===============================================+
```

**Created**: 2026-01-19
**PRD Reference**: `grimoires/sigil/prd-craft-states.md`
**Status**: Draft

---

## 1. Executive Summary

This document describes the architecture for adding **Hammer mode** to `/craft`, enabling it to orchestrate complete feature implementations by invoking Loa's planning commands (`/plan-and-analyze`, `/architect`, `/sprint-plan`) and executing the full implementation sequence with physics.

### Key Architecture Decisions

1. **Command file enhancement** — Modify `/craft` command spec, not create new commands
2. **Skill-based Loa invocation** — Use Claude Code's Skill tool to invoke Loa commands
3. **State file for hammer progress** — Track multi-phase execution in `grimoires/sigil/hammer-state.json`
4. **Context seeding** — Pre-populate Loa commands with Sigil observations and taste

---

## 2. System Architecture

### 2.1 High-Level Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           /craft Entry Point                             │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         Scope Detection Module                           │
│  ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐       │
│  │ Keyword Scanner │ → │ Signal Scorer   │ → │ Mode Selector   │       │
│  └─────────────────┘   └─────────────────┘   └─────────────────┘       │
│                                                       │                  │
│                              ┌────────────────────────┼──────────────┐  │
│                              ▼                        ▼              │  │
│                         CHISEL                    HAMMER             │  │
└─────────────────────────────────────────────────────────────────────────┘
          │                                              │
          ▼                                              ▼
┌─────────────────────┐                    ┌─────────────────────────────┐
│  Current /craft     │                    │  Hammer Orchestrator        │
│  (unchanged)        │                    │                             │
│                     │                    │  1. Check existing artifacts│
│  - Physics analysis │                    │  2. Seed Loa context        │
│  - Generation       │                    │  3. Invoke /plan-and-analyze│
│  - Feedback loop    │                    │  4. Invoke /architect       │
│  - Taste logging    │                    │  5. Invoke /sprint-plan     │
└─────────────────────┘                    │  6. Present plan for review │
                                           │  7. Execute via /run        │
                                           └─────────────────────────────┘
```

### 2.2 Component Overview

| Component | Location | Responsibility |
|-----------|----------|----------------|
| **Scope Detector** | `.claude/commands/craft.md` | Analyze input for hammer/chisel signals |
| **Context Aggregator** | `.claude/commands/craft.md` | Gather Sigil context for Loa seeding |
| **Hammer Orchestrator** | `.claude/commands/craft.md` | Coordinate Loa command invocations |
| **State Manager** | `grimoires/sigil/hammer-state.json` | Track progress, enable resume |
| **Artifact Reader** | `.claude/commands/craft.md` | Read existing PRD/SDD if present |

---

## 3. Detailed Component Design

### 3.1 Scope Detection Module

**Purpose**: Determine if user input requires hammer (full-stack) or chisel (single-component) mode.

#### Detection Algorithm

```yaml
# Embedded in craft.md workflow

scope_detection:
  hammer_signals:
    keywords:
      - "feature"
      - "system"
      - "flow"
      - "pipeline"
      - "integrate"
      - "build"      # as in "build X feature"
      - "implement"  # as in "implement X"
      - "create"     # as in "create X system"

    references:
      - contract_names: /\b(contract|vault|pool|token|staking)\b/i
      - event_names: /\b(event|emit|log)\b/i
      - api_patterns: /\b(endpoint|api|GET|POST|fetch.*backend)\b/i
      - indexer_patterns: /\b(indexer|index|sync|historical)\b/i

    multi_component_indicators:
      - mentions_frontend_and_backend: true
      - mentions_data_pipeline: true
      - scope_word_count: "> 5 words describing scope"

  chisel_signals:
    keywords:
      - "button"
      - "modal"
      - "animation"
      - "hover"
      - "style"
      - "improve"
      - "fix"
      - "polish"
      - "adjust"
      - "tweak"
      - "refine"

    single_component_indicators:
      - single_noun_target: true
      - existing_file_reference: true
      - physics_only_language: true

  scoring:
    - each_hammer_signal: +1
    - each_chisel_signal: -1
    - threshold_for_hammer: ">= 2"

  override:
    - user_can_force: "--chisel" or "--hammer" flag
    - user_can_choose: prompt with options if ambiguous
```

#### Output Format

```typescript
interface ScopeDetection {
  mode: "hammer" | "chisel";
  confidence: "high" | "medium" | "low";
  signals: {
    hammer: string[];  // Which signals triggered
    chisel: string[];  // Which signals triggered
  };
  recommendation: string;  // Human-readable explanation
}
```

### 3.2 Context Aggregator

**Purpose**: Gather Sigil context (observations, taste, diagnostics) to seed Loa commands.

#### Context Sources (Priority Order)

```yaml
context_sources:
  1_observations:
    path: "grimoires/sigil/observations/"
    files:
      - "*.diagnostic.md"  # Open user diagnostics
      - "user-insights.md" # Validated findings
    extract:
      - user_quotes
      - user_types
      - gap_classifications
      - physics_implications

  2_taste:
    path: "grimoires/sigil/taste.md"
    extract:
      - timing_patterns
      - animation_preferences
      - recent_signals (last 10)

  3_existing_artifacts:
    paths:
      - "grimoires/loa/prd.md"
      - "grimoires/loa/sdd.md"
      - "grimoires/loa/sprint.md"
    check:
      - exists: boolean
      - age_days: number
      - relevance: "match title/topic to current request"
```

#### Context Seeding Format

When invoking `/plan-and-analyze`, prepend this context:

```markdown
## Pre-seeded Context from Sigil

### User Observations
[Extracted from grimoires/sigil/observations/]

- @papa_flavio (decision-maker): "I need to see my claimable amount before clicking"
  → Physics implication: Amount should be prominent, confirmation required

- @builder_dan (builder): "The claim flow is too slow for power users"
  → Physics implication: Consider faster timing for repeat users

### Taste Patterns
[Extracted from grimoires/sigil/taste.md]

- Financial buttons: 600ms preferred (3 MODIFY signals)
- Spring animations preferred over ease-out (5 MODIFY signals)

### Physics Requirements
Based on Sigil's physics rules:
- Financial operations: Pessimistic sync, confirmation required
- Protected capabilities: Cancel always visible, error recovery available
```

### 3.3 Hammer Orchestrator

**Purpose**: Coordinate the full Loa sequence and track progress.

#### Orchestration Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                      Hammer Orchestrator                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Phase 0: Artifact Check                                             │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ Check grimoires/loa/prd.md exists?                          │    │
│  │ → Yes + fresh: Skip to Phase 2                              │    │
│  │ → Yes + stale: Offer regenerate or use existing             │    │
│  │ → No: Proceed to Phase 1                                    │    │
│  │                                                              │    │
│  │ Check grimoires/loa/sdd.md exists?                          │    │
│  │ → Yes + fresh: Skip to Phase 3                              │    │
│  │ → Yes + stale: Offer regenerate or use existing             │    │
│  │ → No: Proceed to Phase 2                                    │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                              │                                       │
│                              ▼                                       │
│  Phase 1: Requirements (if needed)                                   │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ 1. Aggregate Sigil context                                  │    │
│  │ 2. Invoke: Skill tool → "plan-and-analyze"                  │    │
│  │    - Args: feature description + seeded context             │    │
│  │ 3. Wait for PRD completion                                  │    │
│  │ 4. Update hammer-state.json: phase = "prd_complete"         │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                              │                                       │
│                              ▼                                       │
│  Phase 2: Architecture                                               │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ 1. Read grimoires/loa/prd.md                                │    │
│  │ 2. Invoke: Skill tool → "architect"                         │    │
│  │ 3. Wait for SDD completion                                  │    │
│  │ 4. Update hammer-state.json: phase = "sdd_complete"         │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                              │                                       │
│                              ▼                                       │
│  Phase 3: Sprint Planning                                            │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ 1. Read grimoires/loa/sdd.md                                │    │
│  │ 2. Invoke: Skill tool → "sprint-plan"                       │    │
│  │ 3. Wait for sprint.md completion                            │    │
│  │ 4. Update hammer-state.json: phase = "sprint_complete"      │    │
│  │ 5. Display plan summary to user                             │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                              │                                       │
│                              ▼                                       │
│  Phase 4: User Review (CHECKPOINT)                                   │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ Present complete plan:                                      │    │
│  │ - PRD summary                                               │    │
│  │ - SDD component list                                        │    │
│  │ - Sprint tasks with physics hints                           │    │
│  │                                                              │    │
│  │ "Ready to implement. Run `/run sprint-plan` when ready."    │    │
│  │                                                              │    │
│  │ Update hammer-state.json: phase = "awaiting_execution"      │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                              │                                       │
│                              ▼                                       │
│  Phase 5: Execution (via Loa's /run)                                 │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ User runs: /run sprint-plan                                 │    │
│  │                                                              │    │
│  │ For each task:                                              │    │
│  │   - If UI component: Apply Sigil physics                    │    │
│  │   - If backend: Standard implementation                     │    │
│  │   - Track progress in .run/state.json (Loa's mechanism)     │    │
│  │                                                              │    │
│  │ On completion:                                              │    │
│  │   - Clear hammer-state.json                                 │    │
│  │   - Log completion to taste.md                              │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

#### Loa Command Invocation

Sigil invokes Loa commands using Claude Code's Skill tool:

```typescript
// Invoking /plan-and-analyze
{
  skill: "plan-and-analyze",
  args: `${featureDescription}

## Sigil Context (Pre-seeded)
${aggregatedContext}`
}

// Invoking /architect
{
  skill: "architect"
  // No args needed - reads PRD from grimoires/loa/prd.md
}

// Invoking /sprint-plan
{
  skill: "sprint-plan"
  // No args needed - reads PRD and SDD
}
```

### 3.4 State Manager

**Purpose**: Track hammer mode progress, enable resume on interruption.

#### State File Schema

```json
// grimoires/sigil/hammer-state.json
{
  "active": true,
  "feature": "rewards claiming feature",
  "started_at": "2026-01-19T14:00:00Z",
  "phase": "sdd_complete",
  "phases_completed": [
    {
      "phase": "prd",
      "completed_at": "2026-01-19T14:15:00Z",
      "artifact": "grimoires/loa/prd.md"
    },
    {
      "phase": "sdd",
      "completed_at": "2026-01-19T14:30:00Z",
      "artifact": "grimoires/loa/sdd.md"
    }
  ],
  "context_seeded": {
    "observations": 3,
    "taste_patterns": 5
  },
  "components_identified": [
    {
      "name": "RewardsClaimed handler",
      "type": "indexer",
      "physics": null
    },
    {
      "name": "ClaimButton",
      "type": "frontend",
      "physics": "financial"
    }
  ]
}
```

#### Resume Behavior

On `/craft` invocation, check for existing hammer state:

```
if (hammer-state.json exists && active == true) {
  Show: "Hammer mode in progress: '{feature}' at phase '{phase}'"
  Options:
    1. Resume from current phase
    2. Abandon and start fresh
    3. Switch to chisel mode for quick work
}
```

### 3.5 Artifact Reader

**Purpose**: Check for and read existing Loa artifacts to skip phases.

#### Staleness Detection

```yaml
artifact_freshness:
  prd:
    path: "grimoires/loa/prd.md"
    stale_after_days: 7
    relevance_check: "title matches current feature request"

  sdd:
    path: "grimoires/loa/sdd.md"
    stale_after_days: 7
    dependency: "prd"  # If PRD changed, SDD is stale

  sprint:
    path: "grimoires/loa/sprint.md"
    stale_after_days: 3
    dependency: "sdd"  # If SDD changed, sprint is stale
```

#### User Options When Artifacts Exist

```
┌─ Existing Artifacts Detected ────────────────────────────┐
│                                                          │
│  PRD: grimoires/loa/prd.md (2 days old)                 │
│  SDD: grimoires/loa/sdd.md (2 days old)                 │
│                                                          │
│  Options:                                                │
│  1. Use existing → Skip to sprint planning               │
│  2. Regenerate PRD → Full sequence                       │
│  3. Regenerate SDD only → Keep PRD, redo architecture    │
│  4. Chisel anyway → UI only                              │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## 4. Integration Points

### 4.1 Integration with Existing /craft

Hammer mode **extends** current `/craft`, not replaces:

```
/craft workflow:
  Step 0: Track Progress (unchanged)
  Step 0.5: Scope Detection (NEW)
    → If CHISEL: Continue to Step 1
    → If HAMMER: Branch to Hammer Orchestrator
  Step 1: Discover Context (unchanged for chisel)
  Step 2: Detect Craft Type (unchanged for chisel)
  ...
```

### 4.2 Integration with Loa Commands

Sigil reads Loa outputs, never modifies Loa commands:

| Sigil Does | Sigil Does Not |
|------------|----------------|
| Read `grimoires/loa/prd.md` | Modify `/plan-and-analyze` command |
| Read `grimoires/loa/sdd.md` | Modify `/architect` command |
| Invoke via Skill tool | Directly execute Loa code |
| Seed context as args | Change Loa's internal behavior |

### 4.3 Integration with /run

Hammer mode's execution phase uses Loa's existing `/run sprint-plan`:

```
Hammer Phase 4 (Review) completes
  → User runs: /run sprint-plan
  → Loa handles execution
  → Each UI task triggers Sigil physics
  → Completion clears hammer-state.json
```

### 4.4 Integration with /observe

Observations feed into hammer mode context:

```
/observe → Creates diagnostic in grimoires/sigil/observations/
  ↓
/craft (hammer) → Reads observations, seeds /plan-and-analyze
  ↓
PRD reflects user insights from observations
```

---

## 5. Data Architecture

### 5.1 New Files

| File | Purpose | Created By | Read By |
|------|---------|------------|---------|
| `grimoires/sigil/hammer-state.json` | Track hammer progress | Hammer Orchestrator | /craft |
| (No new Loa files) | — | — | — |

### 5.2 Modified Files

| File | Modification |
|------|--------------|
| `.claude/commands/craft.md` | Add scope detection, hammer orchestration |

### 5.3 Read-Only Files (from Loa)

| File | How Used |
|------|----------|
| `grimoires/loa/prd.md` | Check existence, freshness, read content |
| `grimoires/loa/sdd.md` | Check existence, freshness, read content |
| `grimoires/loa/sprint.md` | Check existence, read tasks |
| `.run/state.json` | Check Loa's execution state |

---

## 6. Workflow Additions to craft.md

### 6.1 New Step 0.5: Scope Detection

```markdown
<step_0_5>
### Step 0.5: Scope Detection

Before discovering context, determine if this is hammer or chisel work.

**Scan for hammer signals:**
- Keywords: "feature", "system", "flow", "pipeline", "build", "implement"
- References: contract names, event names, API endpoints, indexer mentions
- Scope: Multi-word description of functionality

**Scan for chisel signals:**
- Keywords: "button", "modal", "improve", "fix", "polish", "tweak"
- References: Single component name, existing file
- Scope: Single-word or simple phrase target

**Scoring:**
- Each hammer signal: +1
- Each chisel signal: -1
- Score >= 2: HAMMER mode
- Score < 2: CHISEL mode

**If HAMMER detected:**

```
┌─ Scope Detection ─────────────────────────────────────────┐
│                                                           │
│  This looks like HAMMER work:                             │
│  • [list detected hammer signals]                         │
│                                                           │
│  I'll run the complete sequence:                          │
│  1. /plan-and-analyze → Requirements (PRD)                │
│  2. /architect → Design (SDD)                             │
│  3. /sprint-plan → Tasks                                  │
│  4. /run sprint-plan → Implementation                     │
│                                                           │
│  [Proceed] [Chisel anyway (UI only)]                      │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

**If user chooses "Proceed":**
- Branch to Hammer Orchestrator (Step H1)
- Skip regular craft workflow

**If user chooses "Chisel anyway":**
- Log decision to taste.md
- Continue with regular craft workflow (Step 1)
- Warn: "Note: This will create UI only. Supporting infrastructure not included."
</step_0_5>
```

### 6.2 New Hammer Steps (H1-H5)

```markdown
<hammer_workflow>
### Hammer Workflow

When user confirms hammer mode, execute this sequence:

<step_h1>
#### Step H1: Check Existing Artifacts

Check for existing Loa artifacts:

```
Read grimoires/loa/prd.md (if exists)
Read grimoires/loa/sdd.md (if exists)
Read grimoires/loa/sprint.md (if exists)
```

**If artifacts exist:**
- Check freshness (< 7 days for PRD/SDD, < 3 days for sprint)
- Check relevance (title/topic matches current feature)
- Present options:
  1. Use existing → Skip to appropriate phase
  2. Regenerate → Start from scratch
  3. Chisel anyway → UI only

**If no artifacts:**
- Initialize hammer-state.json
- Proceed to H2
</step_h1>

<step_h2>
#### Step H2: Invoke /plan-and-analyze

1. **Aggregate Sigil context:**
   - Read grimoires/sigil/observations/*.diagnostic.md
   - Read grimoires/sigil/observations/user-insights.md
   - Read grimoires/sigil/taste.md (recent patterns)

2. **Seed context and invoke:**
   ```
   Use Skill tool:
     skill: "plan-and-analyze"
     args: "{feature description}

     ## Sigil Context (Pre-seeded)
     {aggregated context}"
   ```

3. **Wait for PRD completion**

4. **Update state:**
   ```json
   {
     "phase": "prd_complete",
     "phases_completed": [{"phase": "prd", ...}]
   }
   ```

5. **Proceed to H3**
</step_h2>

<step_h3>
#### Step H3: Invoke /architect

1. **Invoke:**
   ```
   Use Skill tool:
     skill: "architect"
   ```

2. **Wait for SDD completion**

3. **Update state:**
   ```json
   {
     "phase": "sdd_complete",
     "phases_completed": [..., {"phase": "sdd", ...}]
   }
   ```

4. **Proceed to H4**
</step_h3>

<step_h4>
#### Step H4: Invoke /sprint-plan

1. **Invoke:**
   ```
   Use Skill tool:
     skill: "sprint-plan"
   ```

2. **Wait for sprint.md completion**

3. **Extract components and physics hints:**
   - Parse sprint.md for tasks
   - Identify UI components
   - Assign physics types (financial, destructive, standard, etc.)

4. **Update state:**
   ```json
   {
     "phase": "sprint_complete",
     "components_identified": [...]
   }
   ```

5. **Proceed to H5**
</step_h4>

<step_h5>
#### Step H5: Present Plan for Review

Display complete plan summary:

```
┌─ Hammer Plan Complete ────────────────────────────────────┐
│                                                           │
│  Feature: {feature description}                           │
│                                                           │
│  PRD: grimoires/loa/prd.md                               │
│  SDD: grimoires/loa/sdd.md                               │
│  Sprint: grimoires/loa/sprint.md                         │
│                                                           │
│  Components to implement:                                 │
│  1. [Backend] RewardsClaimed indexer handler              │
│  2. [Backend] GET /rewards/:address endpoint              │
│  3. [Frontend] useRewards hook                            │
│  4. [Frontend] RewardsList (standard physics)             │
│  5. [Frontend] ClaimButton (financial physics)            │
│                                                           │
│  Ready to implement.                                      │
│  Run `/run sprint-plan` when ready.                       │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

**Update state:**
```json
{
  "phase": "awaiting_execution"
}
```

**User action:**
- User reviews artifacts, makes any manual adjustments
- User runs `/run sprint-plan` to begin implementation
- Loa handles execution, Sigil applies physics to UI tasks
</step_h5>
</hammer_workflow>
```

---

## 7. Error Handling

### 7.1 Loa Command Failures

| Failure | Detection | Recovery |
|---------|-----------|----------|
| /plan-and-analyze fails | Skill tool returns error | Offer retry or chisel fallback |
| /architect fails | Skill tool returns error | Offer retry with different approach |
| /sprint-plan fails | Skill tool returns error | Offer manual breakdown |

### 7.2 State Corruption

| Issue | Detection | Recovery |
|-------|-----------|----------|
| hammer-state.json invalid | JSON parse error | Delete and start fresh |
| Phase mismatch | Artifact exists but state says earlier | Trust artifacts, update state |
| Orphaned state | Active=true but no recent activity | Offer resume or abandon |

### 7.3 Artifact Conflicts

| Conflict | Detection | Resolution |
|----------|-----------|------------|
| PRD exists but different topic | Title doesn't match request | Ask user: use existing or regenerate |
| SDD references stale PRD | PRD modified after SDD | Regenerate SDD |
| Sprint partially complete | .run/state.json has progress | Offer resume via Loa |

---

## 8. Testing Strategy

### 8.1 Scope Detection Tests

| Input | Expected Mode | Signals |
|-------|---------------|---------|
| "claim button" | CHISEL | "button" keyword |
| "build rewards claiming feature" | HAMMER | "build", "feature", "claiming" |
| "improve hover states" | CHISEL | "improve" keyword |
| "implement notification system" | HAMMER | "implement", "system" |
| "fix the modal animation" | CHISEL | "fix", "modal", "animation" |

### 8.2 Context Seeding Tests

| Observations | Expected Seed |
|--------------|---------------|
| 2 diagnostics, 1 insight | All 3 included in context |
| No observations | Context section omitted |
| 5 taste patterns | Top 5 by frequency included |

### 8.3 Integration Tests

| Scenario | Test |
|----------|------|
| Fresh start | Hammer runs full sequence |
| PRD exists | Skips /plan-and-analyze |
| SDD exists | Skips /architect |
| Resume interrupted | Picks up from saved phase |
| User chooses chisel | Falls back to normal /craft |

---

## 9. Migration Path

### 9.1 /distill Absorption

Current `/distill` functionality absorbed into hammer mode:

| /distill Feature | Hammer Equivalent |
|------------------|-------------------|
| Component breakdown | Post-SDD analysis in H4 |
| Physics hints | Extracted from SDD component types |
| Output list | Displayed in H5 summary |

**Recommendation**: Keep `/distill` as standalone for users who want breakdown without implementation, but don't require it in hammer flow.

### 9.2 Backward Compatibility

| Behavior | Before | After |
|----------|--------|-------|
| `/craft "button"` | Generate button | CHISEL: Generate button (unchanged) |
| `/craft "feature"` | Generate partial UI | HAMMER: Full sequence (new) |
| Explicit flags | N/A | `--chisel` or `--hammer` to force |

---

## 10. Security Considerations

### 10.1 Loa Command Trust

- Sigil trusts Loa command outputs as authoritative
- No validation of PRD/SDD content (Loa's responsibility)
- State file contains no sensitive data

### 10.2 Context Seeding

- Observations may contain user quotes
- Taste patterns are aggregated, not individual
- No PII passed to Loa beyond what user explicitly provided

---

## 11. Future Considerations

### 11.1 Multi-Repo Support

Current: User specifies `--repo ../backend` manually

Future (Hivemind construct):
- Auto-detect related repos
- Coordinate execution across repos
- Unified state tracking

### 11.2 Parallel Execution

Current: Sequential phase execution

Future:
- Independent components in parallel
- Backend and frontend simultaneous when no dependency

### 11.3 Incremental Hammer

Current: All-or-nothing hammer mode

Future:
- Partial hammer (just PRD, then chisel)
- Scope expansion (start chisel, escalate to hammer)

---

## 12. Appendix: craft.md Diff Summary

### Additions Required

1. **Step 0.5**: Scope detection (new section)
2. **Hammer workflow**: Steps H1-H5 (new section)
3. **Context seeding format**: Documentation for Loa context (new section)
4. **State file schema**: hammer-state.json documentation (new section)
5. **Examples**: Hammer mode examples (add to existing examples)

### Unchanged

- Step 0: Track Progress
- Step 1-7: All chisel mode steps
- Physics analysis format
- Taste logging format
- Error recovery (for chisel)

---

*SDD generated for Sigil Craft States v1.0.0*
