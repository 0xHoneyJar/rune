# Sigil v3: Operational Infrastructure - Software Design Document

```
    ╔═══════════════════════════════════════════════════════════╗
    ║  SIGIL v3.0 - SOFTWARE DESIGN DOCUMENT                    ║
    ║                                                           ║
    ║  "Architecture for Production-Grade Agent Infrastructure" ║
    ╚═══════════════════════════════════════════════════════════╝
```

**Version**: 1.0.0
**Created**: 2026-01-20
**PRD Reference**: `grimoires/loa/prd-v3-operational-infrastructure.md`
**Status**: Ready for Implementation

---

## Executive Summary

This SDD defines the technical architecture for upgrading Sigil from a domain-specific framework to a production-grade agent infrastructure. The design preserves Sigil's design physics excellence while adding operational capabilities inspired by Loa Framework, Compound Engineering, and Claude Code system patterns.

**Key Architectural Decisions**:
1. **Layered State Architecture**: NOTES.md (session) → craft-state.md (iteration) → taste.md (learning)
2. **Subagent Composition**: Extend existing subagents/ with physics-validator
3. **Feature Flags**: Enable gradual rollout via constitution.yaml
4. **Minimal craft.md Changes**: Inject hooks rather than refactor monolith

---

## 1. System Architecture

### 1.1 High-Level Component Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SIGIL v3 ARCHITECTURE                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        COMMAND LAYER                                 │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐    │   │
│  │  │ /craft   │  │ /ward    │  │/checkpoint│  │ /skill-audit    │    │   │
│  │  │ (v2.2)   │  │ (v1.1)   │  │ (NEW)    │  │ (NEW)            │    │   │
│  │  └────┬─────┘  └────┬─────┘  └─────┬────┘  └────────┬─────────┘    │   │
│  └───────┼─────────────┼──────────────┼────────────────┼──────────────┘   │
│          │             │              │                │                    │
│  ┌───────▼─────────────▼──────────────▼────────────────▼──────────────┐   │
│  │                      ORCHESTRATION LAYER                            │   │
│  │  ┌────────────────────────────────────────────────────────────┐    │   │
│  │  │                   WORKFLOW ENGINE                           │    │   │
│  │  │  Step -1: Feedback Check ──► Step 0: State Load            │    │   │
│  │  │       │                            │                        │    │   │
│  │  │       ▼                            ▼                        │    │   │
│  │  │  Step 1-11: Standard Workflow ◄── RLM Rule Loading         │    │   │
│  │  │       │                                                     │    │   │
│  │  │       ▼                                                     │    │   │
│  │  │  Step 5.5: Validation Gate ──► Step 12: State Update       │    │   │
│  │  │       │                            │                        │    │   │
│  │  │       ▼                            ▼                        │    │   │
│  │  │  Step 12.5: Learning Extract ─► Trajectory Log             │    │   │
│  │  └────────────────────────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                       VALIDATION LAYER                              │   │
│  │  ┌──────────────────┐  ┌──────────────────┐  ┌─────────────────┐   │   │
│  │  │ physics-validator │  │codebase-validator│  │(existing: arch, │   │   │
│  │  │ (NEW)            │  │ (NEW)            │  │ security, test) │   │   │
│  │  └────────┬─────────┘  └────────┬─────────┘  └────────┬────────┘   │   │
│  │           │                     │                     │             │   │
│  │           └─────────────────────┴─────────────────────┘             │   │
│  │                               │                                      │   │
│  │                    ┌──────────▼──────────┐                          │   │
│  │                    │   VERDICT ENGINE    │                          │   │
│  │                    │ COMPLIANT/DRIFT/    │                          │   │
│  │                    │ CRITICAL_VIOLATION  │                          │   │
│  │                    └─────────────────────┘                          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         STATE LAYER                                  │   │
│  │                                                                      │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────────┐  │   │
│  │  │  NOTES.md   │  │craft-state  │  │  taste.md   │  │trajectory/│  │   │
│  │  │  (session)  │  │ (iteration) │  │ (learning)  │  │ (audit)   │  │   │
│  │  │             │  │             │  │             │  │           │  │   │
│  │  │ - Focus     │  │ - Session   │  │ - Signals   │  │ - Input   │  │   │
│  │  │ - Decisions │  │ - Iterations│  │ - Patterns  │  │ - Decision│  │   │
│  │  │ - Blockers  │  │ - Loop Det. │  │ - Learnings │  │ - Outcome │  │   │
│  │  │ - Learnings │  │ - Context   │  │             │  │           │  │   │
│  │  │ - Continuity│  │             │  │             │  │           │  │   │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └─────┬─────┘  │   │
│  │         │                │                │                │        │   │
│  │         └────────────────┴────────────────┴────────────────┘        │   │
│  │                              │                                       │   │
│  │                    ┌─────────▼─────────┐                            │   │
│  │                    │  TRUTH HIERARCHY  │                            │   │
│  │                    │ Code > taste.md > │                            │   │
│  │                    │ craft-state > NOTES│                            │   │
│  │                    └───────────────────┘                            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                       LEARNING LAYER                                │   │
│  │  ┌──────────────────┐       ┌──────────────────┐                    │   │
│  │  │ pending-learnings│ ────► │  /skill-audit    │                    │   │
│  │  │ (extraction)     │       │  (approval)      │                    │   │
│  │  └────────┬─────────┘       └────────┬─────────┘                    │   │
│  │           │                          │                               │   │
│  │           │                          ▼                               │   │
│  │           │              ┌──────────────────────┐                   │   │
│  │           │              │ Promotion to:        │                   │   │
│  │           └────────────► │ - taste.md pattern   │                   │   │
│  │                          │ - rule update        │                   │   │
│  │                          │ - constitution.yaml  │                   │   │
│  │                          └──────────────────────┘                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Zone Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      ZONE ARCHITECTURE                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  SYSTEM ZONE (.claude/)                                          │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  Owner: Sigil Framework                                     ││
│  │  Write: /update only                                        ││
│  │  Read: Always allowed                                       ││
│  │                                                              ││
│  │  .claude/                                                    ││
│  │  ├── rules/              # Physics laws (RLM loaded)        ││
│  │  ├── commands/           # Slash commands                   ││
│  │  ├── skills/             # Agent skills                     ││
│  │  ├── subagents/          # Validation subagents [EXTEND]    ││
│  │  │   ├── physics-validator.md    [NEW]                      ││
│  │  │   ├── codebase-validator.md   [NEW]                      ││
│  │  │   └── (existing validators)                              ││
│  │  ├── overrides/          # Local overrides [NEW]            ││
│  │  │   └── README.md                                          ││
│  │  └── settings.json       # Permissions                      ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  STATE ZONE (grimoires/)                                         │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  Owner: Project (versioned in git)                          ││
│  │  Write: Sigil (automated), User (manual)                    ││
│  │  Read: Always allowed                                       ││
│  │                                                              ││
│  │  grimoires/sigil/                                            ││
│  │  ├── NOTES.md            # Session memory [NEW]             ││
│  │  ├── craft-state.md      # Iteration state [EXTEND]         ││
│  │  ├── taste.md            # Accumulated signals              ││
│  │  ├── constitution.yaml   # Project physics + features       ││
│  │  ├── pending-learnings.md # Learning queue [NEW]            ││
│  │  ├── trajectory/         # Decision logs [NEW]              ││
│  │  │   └── {date}-{component}.md                              ││
│  │  ├── context/            # Project context                  ││
│  │  │   └── archive/        # Archived sessions                ││
│  │  └── moodboard/          # Visual references                ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  APP ZONE (src/, components/, etc.)                             │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  Owner: Developer                                           ││
│  │  Write: Requires confirmation                               ││
│  │  Read: Always allowed                                       ││
│  │                                                              ││
│  │  (Developer-owned code - Sigil generates into this zone)    ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack

### 2.1 Stack Overview

| Layer | Technology | Justification |
|-------|------------|---------------|
| State Format | YAML frontmatter + Markdown | Human-readable, git-friendly, existing pattern |
| Schema Validation | Manual + runtime checks | No external deps, matches current approach |
| Feature Flags | constitution.yaml | Centralized, existing pattern extended |
| File Operations | Claude Code native tools | Read, Write, Edit - no shell scripts |
| Subagent Pattern | Markdown skill files | Matches existing .claude/subagents/ |

### 2.2 No New Dependencies

This design explicitly avoids:
- External schema validators (no JSON Schema, no Zod)
- Database systems (file-based state only)
- Build tools (pure markdown/yaml)
- External APIs (self-contained)

**Rationale**: Sigil should remain a prompt-only framework. All logic lives in markdown instructions parsed by Claude.

---

## 3. Component Design

### 3.1 NOTES.md - Session Memory (FR-2)

**Location**: `grimoires/sigil/NOTES.md`

**Purpose**: Structured session memory that survives context clears

**Schema**:
```yaml
---
# NOTES.md Schema v1.0
last_updated: "2026-01-20T14:30:00Z"
session_id: "20260120-ClaimButton-a1b2"
---
```

```markdown
# Sigil Session Memory

## Current Focus

**Component**: ClaimButton
**Craft Type**: refine
**Target File**: src/components/ClaimButton.tsx
**Started**: 2026-01-20T14:00:00Z

## Physics Decisions

| Decision | Value | Rationale |
|----------|-------|-----------|
| Effect | Financial | Keyword "claim" + involves tokens |
| Timing | 500ms | Taste pattern: 3 MODIFY signals for faster timing |
| Animation | spring(400, 25) | Taste pattern: preference for springs |
| Confirmation | Required | Protected capability: financial ops |

## Blockers

- [ ] Need to verify data source: envio vs on-chain for amount display
- [ ] Unclear if button should show pending transaction count

## Learnings

1. **Discovery**: Codebase uses `usePrepareContractWrite` before `useWriteContract`
   - Evidence: src/hooks/useStake.ts:45
   - Implication: All financial buttons need two-step pattern

2. **Discovery**: Toast component expects { title, description, action } shape
   - Evidence: src/components/ui/toast.tsx:12
   - Implication: Error toasts must include retry action

## Session Continuity

**Last Action**: Applied animation physics (iteration 2)
**Next Action**: Verify visual output, collect feedback
**Context Needed**:
- URL for visual verification (user should provide)
- Confirmation that amount display is correct
```

**Integration Points**:
- **Read**: craft.md Step 0 (before anything else)
- **Write**: craft.md Step 12 (after feedback collection)
- **Recovery**: Used by truth hierarchy when context is lost

### 3.2 Lossless State Protocol (FR-1)

**Location**: Add to `CLAUDE.md` and `00-sigil-core.md`

**Truth Hierarchy Definition**:
```markdown
<truth_hierarchy>
## Truth Hierarchy

When information conflicts, trust sources in this order:

1. **Code** — What's actually in files (immutable truth)
   - If code says X and memory says Y, code wins
   - Verify claims by reading actual files

2. **taste.md** — Accumulated signals (verified by diffs)
   - Signals are append-only, can be audited
   - Patterns are derived from signals, trust signals over patterns

3. **craft-state.md** — Current session state
   - Iteration history is reliable
   - Loop detection patterns are trustworthy

4. **NOTES.md** — Session memory
   - Human-readable summary, may be stale
   - Use as recovery starting point, verify before trusting

5. **Context window** — Ephemeral
   - Don't trust conversation history for state
   - Always read files to verify claims
</truth_hierarchy>
```

**Grounding Enforcement**:
```markdown
<grounding>
## Grounding Enforcement

Claims must cite sources:

| Claim Type | Required Citation |
|------------|-------------------|
| Physics rule | Rule file and section: `01-sigil-physics.md:financial` |
| User preference | taste.md signal: `taste.md:signal-15` |
| Code behavior | File and line: `src/hooks/useStake.ts:45` |
| Codebase pattern | Example file: `src/components/Button.tsx` |
| Detection result | Detection signals: `Keywords: "claim"` |

**Format**: "X because Y (source: Z)"

**Example**:
"Using 500ms timing because taste.md shows 3 MODIFY signals for faster timing (source: taste.md signals 12-14)"
</grounding>
```

**Recovery Protocol**:
```markdown
<recovery_protocol>
## Recovery Protocol

When resuming after context clear:

1. **Read NOTES.md** (~50 tokens)
   - Get: component, craft type, last action, next action
   - Get: physics decisions, blockers

2. **Read craft-state.md** (~30 tokens)
   - Get: session ID, iteration count, loop detection state
   - Get: rules loaded in previous iterations

3. **Read target file** (variable)
   - Verify current state matches NOTES.md description
   - Identify what actually exists vs. what was planned

4. **Resume from last action**
   - Continue workflow from NOTES.md "Next Action"
   - Don't re-do completed steps

**Token Budget**: <100 tokens for state recovery
</recovery_protocol>
```

### 3.3 Feedback-First Check (FR-6)

**Location**: Add to craft.md as Step -1

**Implementation**:
```markdown
<step_minus_1>
### Step -1: Feedback-First Check (Mandatory)

Before starting ANY craft work, check for unaddressed feedback.

**Check 1: Recent Signals for Same Component**
```
Read: grimoires/sigil/taste.md (last 10 signals)
Filter: component.name matches current target (fuzzy)
Look for: REJECT or MODIFY signals
```

If found:
```
┌─ Prior Feedback Detected ──────────────────────────────────┐
│                                                            │
│  Component: {component name} has recent feedback:          │
│                                                            │
│  {timestamp}: MODIFY                                       │
│  Changed: {from} → {to}                                    │
│  Learning: {inference}                                     │
│                                                            │
│  [a] Apply learnings automatically                         │
│  [i] Ignore and proceed fresh                              │
│  [r] Review all signals for this component                 │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Check 2: Loop Detection State**
```
Read: grimoires/sigil/craft-state.md
Check: loop_detection.triggered == true
```

If triggered:
```
┌─ Loop Detection Active ────────────────────────────────────┐
│                                                            │
│  Previous session detected pattern: {pattern}              │
│  Escalation was offered: {yes/no}                          │
│  User chose: {choice}                                      │
│                                                            │
│  Consider a different approach this time.                  │
│                                                            │
│  [c] Continue with fresh approach                          │
│  [e] View escalation options again                         │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Check 3: Pending Learnings**
```
Read: grimoires/sigil/pending-learnings.md
Filter: effect_type matches current detection
Look for: Unapproved learnings with evidence
```

If relevant:
```
┌─ Pending Learning Available ───────────────────────────────┐
│                                                            │
│  There's an unapproved learning relevant to this:          │
│                                                            │
│  Discovery: {discovery}                                    │
│  Evidence: {file:line}                                     │
│                                                            │
│  [a] Apply this learning                                   │
│  [s] Skip for now                                          │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Skip Conditions**:
- User says "fresh start" or "ignore feedback"
- No signals, no loop state, no learnings found
</step_minus_1>
```

### 3.4 Physics Validator Subagent (FR-3)

**Location**: `.claude/subagents/physics-validator.md`

**Schema**:
```yaml
---
name: physics-validator
version: 1.0.0
description: Validate generated components match Sigil design physics
triggers:
  - after: craft-step-5 (apply changes)
  - before: craft-step-6 (visual verification)
  - command: /validate physics
severity_levels:
  - COMPLIANT
  - DRIFT_DETECTED
  - CRITICAL_VIOLATION
output_path: grimoires/sigil/validation-reports/physics-{date}.md
---
```

**Validation Checks**:
```markdown
## Physics Validation Checks

<effect_validation>
### Effect Detection Validation

| Check | Verify | Severity |
|-------|--------|----------|
| Effect matches keywords | Generated effect aligns with detected keywords | DRIFT if mismatch |
| Effect matches types | If Currency/Wei/Token type present, effect is Financial | CRITICAL if Financial missed |
| Context modifiers applied | "with undo" → Soft Delete, etc. | DRIFT if missed |

**How to check**:
1. Re-detect effect from generated component
2. Compare to analysis box effect
3. Flag any mismatch
</effect_validation>

<timing_validation>
### Timing Validation

| Check | Verify | Severity |
|-------|--------|----------|
| Timing matches physics table | Financial=800ms, Destructive=600ms, etc. | DRIFT if off by >100ms |
| Taste override applied | If taste.md has 3+ signals, override should apply | DRIFT if not applied |
| Animation duration consistent | CSS/spring duration matches behavioral timing | DRIFT if misaligned |

**How to check**:
1. Extract timing from generated code (transition, spring duration)
2. Compare to physics table for detected effect
3. Check taste.md for applicable overrides
</timing_validation>

<protected_validation>
### Protected Capability Validation

| Check | Verify | Severity |
|-------|--------|----------|
| Cancel visible | Financial/Destructive has cancel button | CRITICAL if missing |
| Cancel always clickable | Cancel not disabled during pending | CRITICAL if disabled |
| Balance accuracy | Financial ops invalidate balance queries | CRITICAL if stale |
| Touch target size | Interactive elements ≥44px | DRIFT if smaller |
| Focus ring present | Keyboard focus visible | DRIFT if missing |

**How to check**:
1. For Financial/Destructive: search for cancel/back button
2. Check cancel is not conditionally hidden during isPending
3. For mutations: verify query invalidation
4. Check min-height/min-width on buttons
5. Check :focus-visible styles present
</protected_validation>

<sync_validation>
### Sync Strategy Validation

| Check | Verify | Severity |
|-------|--------|----------|
| Pessimistic for Financial | No onMutate optimistic update | CRITICAL if optimistic |
| Optimistic has rollback | onError includes rollback logic | DRIFT if missing |
| Loading states present | Pessimistic shows pending state | DRIFT if missing |

**How to check**:
1. For Financial: verify NO onMutate handler
2. For Optimistic: verify onMutate + onError rollback pattern
3. Check for isPending/isLoading usage
</sync_validation>
```

**Verdict Logic**:
```markdown
## Verdict Determination

| Verdict | Criteria |
|---------|----------|
| COMPLIANT | All checks pass |
| DRIFT_DETECTED | Only DRIFT-level issues found |
| CRITICAL_VIOLATION | Any CRITICAL issue found |

**Blocking Behavior**:
- CRITICAL_VIOLATION: Show warning, require acknowledgment before proceeding
- DRIFT_DETECTED: Show warning, allow proceeding
- COMPLIANT: Silent pass, continue workflow
```

### 3.5 Codebase Validator Subagent (FR-3)

**Location**: `.claude/subagents/codebase-validator.md`

**Schema**:
```yaml
---
name: codebase-validator
version: 1.0.0
description: Validate generated code matches discovered codebase conventions
triggers:
  - after: physics-validator
  - command: /validate codebase
severity_levels:
  - COMPLIANT
  - DRIFT_DETECTED
  - CRITICAL_VIOLATION
output_path: grimoires/sigil/validation-reports/codebase-{date}.md
---
```

**Validation Checks**:
```markdown
## Codebase Validation Checks

<import_validation>
### Import Style Validation

| Check | Verify | Severity |
|-------|--------|----------|
| Animation library | Uses library from package.json | CRITICAL if wrong library |
| Data fetching | Uses project's fetching pattern | DRIFT if inconsistent |
| Component imports | Follows project's import ordering | DRIFT if disordered |

**How to check**:
1. Read package.json for animation/data libraries
2. Compare generated imports to existing components
3. Flag inconsistencies
</import_validation>

<pattern_validation>
### Pattern Validation

| Check | Verify | Severity |
|-------|--------|----------|
| Hook pattern | Matches existing custom hooks | DRIFT if different structure |
| Error handling | Matches project error boundaries | DRIFT if inconsistent |
| File structure | Matches project component structure | DRIFT if different |

**How to check**:
1. Read one existing component of similar type
2. Compare structure: exports, props interface, hooks order
3. Flag structural differences
</pattern_validation>

<naming_validation>
### Naming Validation

| Check | Verify | Severity |
|-------|--------|----------|
| File naming | Matches project convention (PascalCase, kebab, etc.) | DRIFT if wrong |
| Function naming | Matches convention (camelCase handlers, etc.) | DRIFT if wrong |
| CSS classes | Matches styling convention (tailwind, modules, etc.) | DRIFT if wrong |

**How to check**:
1. Analyze existing file names in target directory
2. Compare generated naming
3. Flag mismatches
</naming_validation>
```

### 3.6 Continuous Learning (FR-4)

**Location**: `grimoires/sigil/pending-learnings.md` + extend `.claude/skills/continuous-learning/`

**pending-learnings.md Schema**:
```markdown
# Pending Learnings

Discoveries awaiting approval. Review with `/skill-audit`.

---

## Learning: L-20260120-001

**Status**: pending
**Discovered**: 2026-01-20T14:30:00Z
**Session**: 20260120-ClaimButton-a1b2

### Context
- Component: ClaimButton
- Effect: Financial
- Iteration: 3 (loop detected)

### Discovery
Codebase uses `usePrepareContractWrite` before `useWriteContract` for all transaction buttons. This is a wagmi v2 pattern for simulating transactions before execution.

### Evidence
- File: `src/hooks/useStake.ts:42-55`
- File: `src/hooks/useWithdraw.ts:38-48`
- Pattern: prepare → write → wait sequence

### Recommendation
Add to Web3 flow patterns: When generating transaction buttons, always include prepare step.

### Approval
- [ ] Approved by maintainer
- Promotion target: [ ] taste.md pattern [ ] rule update [ ] constitution.yaml

---
```

**Extraction Triggers** (add to craft.md Step 12.5):
```markdown
<step_12_5>
### Step 12.5: Learning Extraction Check

**Trigger Conditions** (any of):
1. `iterations.length >= 3` AND any iteration.result == "PARTIAL"
2. Discovery of undocumented codebase pattern during context discovery
3. Novel Web3 footgun encountered (BigInt check, stale data, etc.)

**Extraction Process**:
1. Generate learning entry with:
   - Context: component, effect, iteration count
   - Discovery: What was learned
   - Evidence: File:line citations (minimum 2)
   - Recommendation: How to apply this learning

2. Append to `grimoires/sigil/pending-learnings.md`

3. Show notification:
```
┌─ Learning Captured ────────────────────────────────────────┐
│                                                            │
│  Discovered: {brief summary}                               │
│  Evidence: {file count} files cited                        │
│                                                            │
│  Run /skill-audit to review and approve.                   │
│                                                            │
└────────────────────────────────────────────────────────────┘
```
</step_12_5>
```

**/skill-audit Command** (new command):
```yaml
---
name: skill-audit
version: 1.0.0
description: Review and approve pending learnings
---
```

```markdown
# /skill-audit

Review pending learnings and approve or reject.

## Workflow

1. Read `grimoires/sigil/pending-learnings.md`
2. For each pending learning:
   - Show discovery and evidence
   - Ask: Approve? [y/n/e=edit]
3. If approved:
   - Ask: Promote to? [t=taste.md / r=rule update / c=constitution]
   - Execute promotion
   - Mark learning as approved
4. If rejected:
   - Ask: Reason?
   - Archive to `pending-learnings-archive.md`

## Promotion Actions

**To taste.md**:
- Append as a pattern entry with evidence
- Format: Learning inference as `recommendation`

**To rule update**:
- Identify relevant rule file
- Generate suggested edit
- Show diff, ask for confirmation

**To constitution.yaml**:
- Add to `conventions` section
- Or extend `vocabulary` mapping
```

### 3.7 Context Hygiene (FR-5)

**Location**: Add to `CLAUDE.md`

**Attention Budget**:
```markdown
<attention_budget>
## Attention Budget

Context usage determines response behavior:

| Zone | Usage | Behavior |
|------|-------|----------|
| 🟢 Green | 0-60% | Full exploration, verbose analysis, include examples |
| 🟡 Yellow | 60-80% | Compact mode, skip optional context, no examples |
| 🟠 Orange | 80-90% | Essential physics only, single-line confirmations |
| 🔴 Red | 90-100% | Direct action, no analysis, trust prior decisions |

**Response Length Targets**:

| Output | Target |
|--------|--------|
| Analysis box | 15-20 lines max |
| Confirmation prompt | 1 line |
| Error message | 3 lines max |
| Explanation | Only when asked |
| Code comments | Only for physics overrides |

**Detection**:
- Claude Code provides token usage
- Map to percentage of 200k context
- Adjust behavior accordingly
</attention_budget>
```

**craft.md Refactor Strategy**:

Rather than splitting craft.md (high risk), inject mode-specific references:

```markdown
<mode_references>
## Mode-Specific Instructions

When mode is detected, load additional instructions:

| Mode | Reference | Token Cost |
|------|-----------|------------|
| Hammer | `.claude/skills/crafting-physics/modes/hammer.md` | ~2000 |
| Debug | `.claude/skills/crafting-physics/modes/debug.md` | ~1500 |
| Explore | `.claude/skills/crafting-physics/modes/explore.md` | ~1000 |
| Chisel | (inline, default) | 0 |

**Loading Logic**:
- Detect mode in Step 0.5
- If not Chisel: Read mode file, append to context
- Chisel remains inline (most common case)
</mode_references>
```

### 3.8 Trajectory Logging (FR-10)

**Location**: `grimoires/sigil/trajectory/`

**File Naming**: `{YYYY-MM-DD}-{component-name}.md`

**Schema**:
```markdown
# Craft Trajectory: {ComponentName}

**Date**: 2026-01-20
**Session**: 20260120-ClaimButton-a1b2

---

## Entry 1: 14:00:00Z

### Input
```
User: "claim button"
Context files read:
- package.json (animation: framer-motion, data: @tanstack/react-query)
- src/components/Button.tsx (existing pattern)
- taste.md (3 signals for 500ms timing)
```

### Detection
```
Craft type: generate (signals: no existing file, "claim" is new)
Effect: Financial (signals: keyword "claim", no type override)
Physics: Pessimistic, 800ms→500ms (taste override), spring (taste pattern)
```

### Decision
```
Target: src/components/ClaimButton.tsx (new file)
Physics applied:
- Behavioral: pessimistic, 500ms, confirmation required
- Animation: spring(400, 25) per taste pattern
- Material: elevated, soft shadow, 8px radius

Alternatives considered:
- 800ms default timing (rejected: taste pattern)
- ease-out animation (rejected: taste pattern for springs)
```

### Outcome
```
Signal: ACCEPT
Duration: 3m 45s
Iterations: 1
Notes: User confirmed immediately
```

---

## Entry 2: 14:15:00Z

### Input
```
User: "make it snappier"
Context: Continuing session, iteration 2
```

### Detection
```
Craft type: refine (signals: existing file, "snappier" = adjustment)
Effect: Financial (inherited from session)
Layer focus: Animation (keyword "snappier")
```

### Decision
```
Target: src/components/ClaimButton.tsx (edit)
Changes:
- spring(400, 25) → spring(500, 28) for snappier feel
- transition duration 500ms → 400ms
```

### Outcome
```
Signal: MODIFY
Change: User adjusted to spring(600, 30)
Learning extracted: L-20260120-002
```
```

**Integration**:
- Write after Step 3 (physics analysis)
- Update after Step 11 (feedback collection)
- Read by /skill-audit for context

### 3.9 Anti-Patterns Documentation (FR-9)

**Location**: Add to `00-sigil-core.md`

```markdown
<anti_patterns>
## Craft Anti-Patterns (Never Do)

### Code Generation Anti-Patterns

| Anti-Pattern | Why It's Bad | Correct Approach |
|--------------|--------------|------------------|
| Generate partial code | User can't use it | Always complete, working code |
| "Here's a skeleton..." | Forces user to finish | Include all logic |
| Add explanatory comments | Clutters code | Self-documenting names |
| Add type annotations to unchanged code | Unnecessary changes | Only touch what's needed |
| Create utility for one-time use | Over-engineering | Inline the logic |
| Import unlisted libraries | Breaks the build | Check package.json first |

### User Interaction Anti-Patterns

| Anti-Pattern | Why It's Bad | Correct Approach |
|--------------|--------------|------------------|
| "Would you like me to generate this?" | Wastes a turn | Just generate after confirmation |
| Ask 3+ clarifying questions | Frustrating | Max 2 questions, then default |
| Verbose analysis after 5+ accepts | User knows the flow | Switch to compact mode |
| Repeat physics rules in explanation | User has seen them | Reference only |
| Show analysis without action | User wants results | Analysis → confirm → apply |

### State Management Anti-Patterns

| Anti-Pattern | Why It's Bad | Correct Approach |
|--------------|--------------|------------------|
| Trust context over grimoire | Context can be wrong | Always read files |
| Skip taste.md check | Miss preferences | Always check taste patterns |
| Skip feedback-first check | Repeat mistakes | Always run Step -1 |
| Continue after loop detection | Waste iterations | Offer escalation |
| Modify taste.md without signal | Corrupts learning | Only append on signal |
</anti_patterns>
```

### 3.10 Run Mode Safety (FR-8)

**Location**: Add to `craft.md` Hammer section

```markdown
<hammer_safety>
## Hammer Mode Safety Defense

### Circuit Breaker

```
hammer_state.failures = 0

On any Loa command failure:
  hammer_state.failures += 1

  If hammer_state.failures >= 2:
    STOP hammer mode
    Show:
    ┌─ Circuit Breaker Triggered ────────────────────────────┐
    │                                                        │
    │  Two consecutive failures detected.                    │
    │  Last error: {error message}                           │
    │                                                        │
    │  Options:                                              │
    │  [r] Retry last command                                │
    │  [s] Skip to next phase                                │
    │  [a] Abort hammer mode                                 │
    │                                                        │
    └────────────────────────────────────────────────────────┘
```

### Opt-In Confirmation

Before entering hammer mode:
```
┌─ Hammer Mode Confirmation ─────────────────────────────────┐
│                                                            │
│  Hammer mode will run the full Loa sequence:               │
│  1. /plan-and-analyze (PRD generation)                     │
│  2. /architect (SDD generation)                            │
│  3. /sprint-plan (Task breakdown)                          │
│  4. Review cycle                                           │
│                                                            │
│  This may take 10-20 minutes of extended execution.        │
│                                                            │
│  Proceed? [y/n]                                            │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Phase Checkpoints

After each Loa command:
```
✓ Phase complete: {phase name}
  Artifact: {file path}

  Continue to {next phase}? [y/n/r=review artifact]
```

### Duration Warning

```
hammer_state.started_at = now()

Every 10 minutes during hammer mode:
  elapsed = now() - hammer_state.started_at

  If elapsed >= 30 minutes:
    Show warning:
    ┌─ Extended Execution Warning ───────────────────────────┐
    │                                                        │
    │  Hammer mode has been running for {elapsed} minutes.   │
    │                                                        │
    │  [c] Continue                                          │
    │  [p] Pause and checkpoint                              │
    │  [a] Abort                                             │
    │                                                        │
    └────────────────────────────────────────────────────────┘
```
</hammer_safety>
```

### 3.11 Zone Architecture Documentation (FR-7)

**Location**: Add to `CLAUDE.md`

```markdown
<zone_architecture>
## Zone Architecture

Sigil organizes files into three zones with distinct ownership:

### System Zone (.claude/)

**Owner**: Sigil Framework
**Write Access**: Via `/update` command only
**Read Access**: Always allowed

**Contents**:
- `rules/` — Physics laws (loaded by RLM)
- `commands/` — Slash command definitions
- `skills/` — Agent skill implementations
- `subagents/` — Validation subagents
- `scripts/` — Utility scripts
- `settings.json` — Permissions config

**Customization**: Use `.claude/overrides/` for local modifications

### State Zone (grimoires/)

**Owner**: Project (tracked in git)
**Write Access**:
- Sigil writes: NOTES.md, craft-state.md, taste.md, trajectory/, pending-learnings.md
- User writes: moodboard/, context/, constitution.yaml

**Read Access**: Always allowed

**Contents**:
- `sigil/` — Sigil-specific state
- `loa/` — Loa framework state (if Loa installed)

### App Zone (src/, components/, lib/, etc.)

**Owner**: Developer
**Write Access**: Requires user confirmation
**Read Access**: Always allowed

**Sigil Behavior**:
- Reads to discover conventions
- Generates into this zone on confirmation
- Never modifies without explicit approval
- Never deletes without explicit request

### Override Mechanism

Create `.claude/overrides/{rule-number}-override.md` to customize:

```markdown
# Override: 01-sigil-physics

## Custom Timings

For this project, use faster timings:

| Effect | Default | Override |
|--------|---------|----------|
| Financial | 800ms | 500ms |
| Destructive | 600ms | 400ms |

## Rationale
Power user audience prefers snappier interactions.
```

Overrides are loaded after base rules and take precedence.
</zone_architecture>
```

---

## 4. Data Architecture

### 4.1 State File Relationships

```
┌─────────────────────────────────────────────────────────────────┐
│                    STATE FILE FLOW                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  User Request                                                    │
│       │                                                          │
│       ▼                                                          │
│  ┌─────────────────┐                                            │
│  │   Step -1       │──────────────────────────────────┐         │
│  │ Feedback Check  │                                  │         │
│  └────────┬────────┘                                  │         │
│           │                                           │         │
│           │ reads                                     │         │
│           ▼                                           ▼         │
│  ┌─────────────────┐    ┌─────────────────┐    ┌──────────────┐│
│  │    taste.md     │    │  craft-state.md │    │pending-      ││
│  │                 │    │                 │    │learnings.md  ││
│  │ Recent signals  │    │ Loop detection  │    │ Relevant     ││
│  │ for component   │    │ state           │    │ learnings    ││
│  └────────┬────────┘    └────────┬────────┘    └──────┬───────┘│
│           │                      │                    │         │
│           └──────────────────────┴────────────────────┘         │
│                                  │                               │
│                                  ▼                               │
│                         ┌─────────────────┐                      │
│                         │    Step 0       │                      │
│                         │  State Load     │                      │
│                         └────────┬────────┘                      │
│                                  │                               │
│                                  │ reads                         │
│                                  ▼                               │
│                         ┌─────────────────┐                      │
│                         │    NOTES.md     │                      │
│                         │                 │                      │
│                         │ Session memory  │                      │
│                         │ Decisions       │                      │
│                         │ Continuity      │                      │
│                         └────────┬────────┘                      │
│                                  │                               │
│                                  ▼                               │
│                         ┌─────────────────┐                      │
│                         │  Steps 1-11     │                      │
│                         │  Normal Flow    │                      │
│                         └────────┬────────┘                      │
│                                  │                               │
│                                  │ writes                        │
│                                  ▼                               │
│  ┌─────────────────┐    ┌─────────────────┐    ┌──────────────┐│
│  │  trajectory/    │    │   NOTES.md      │    │  taste.md    ││
│  │  {date}.md      │    │   (updated)     │    │  (signal     ││
│  │                 │    │                 │    │   appended)  ││
│  │ Decision log    │    │ Last/Next       │    │              ││
│  │ for debugging   │    │ action          │    │              ││
│  └─────────────────┘    └─────────────────┘    └──────────────┘│
│           │                      │                    │         │
│           └──────────────────────┴────────────────────┘         │
│                                  │                               │
│                                  ▼                               │
│                         ┌─────────────────┐                      │
│                         │   Step 12.5     │                      │
│                         │ Learning Check  │                      │
│                         └────────┬────────┘                      │
│                                  │                               │
│                                  │ if triggered                  │
│                                  ▼                               │
│                         ┌─────────────────┐                      │
│                         │ pending-        │                      │
│                         │ learnings.md    │                      │
│                         │ (appended)      │                      │
│                         └─────────────────┘                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Feature Flag Schema

**Location**: `grimoires/sigil/constitution.yaml`

**Addition**:
```yaml
# =============================================================================
# FEATURE FLAGS
# =============================================================================
# Enable/disable v3 operational features.
# Gradual rollout: enable one at a time, validate, then enable next.

features:
  # Phase 1 (MVP)
  lossless_state: true          # Truth hierarchy, grounding, recovery
  notes_memory: true            # NOTES.md session memory
  feedback_first: true          # Step -1 feedback check
  anti_patterns: true           # Anti-pattern documentation (no runtime impact)

  # Phase 2
  subagent_validators: false    # Physics and codebase validators
  attention_budget: false       # Context-aware response sizing
  zone_architecture: false      # Zone documentation (no runtime impact)

  # Phase 3
  continuous_learning: false    # Automatic learning extraction
  trajectory_logging: false     # Decision trajectory logs
  run_mode_safety: false        # Hammer mode circuit breaker
```

**Usage in craft.md**:
```markdown
<feature_check>
## Feature Flag Check

At workflow start, read constitution.yaml features:

```
features = read(grimoires/sigil/constitution.yaml).features

If features.feedback_first:
  Execute Step -1

If features.notes_memory:
  Read/write NOTES.md

If features.subagent_validators:
  Run validators after Step 5

If features.continuous_learning:
  Execute Step 12.5

If features.trajectory_logging:
  Write to trajectory/
```
</feature_check>
```

---

## 5. Integration Points

### 5.1 craft.md Integration Map

| Step | FR | Action |
|------|-----|--------|
| -1 | FR-6 | Feedback-first check |
| 0 | FR-2, FR-1 | Read NOTES.md, apply truth hierarchy |
| 0.1 | FR-1 | Load craft-state.md, verify against code |
| 3b | FR-10 | Write trajectory log (input, detection, decision) |
| 5.5 | FR-3 | Run physics-validator, codebase-validator |
| 12 | FR-2 | Update NOTES.md (last/next action) |
| 12.5 | FR-4 | Check learning extraction triggers |
| 12 | FR-10 | Update trajectory log (outcome) |

### 5.2 Existing Subagent Integration

The new validators follow the existing pattern:
- YAML frontmatter with triggers
- Markdown body with checks
- Verdict levels matching existing validators
- Output to grimoires/

No changes needed to existing subagents.

### 5.3 RLM Integration

No changes to RLM. Feature implementations are in:
- craft.md (workflow steps)
- CLAUDE.md (documentation)
- 00-sigil-core.md (anti-patterns)
- constitution.yaml (feature flags)

RLM continues loading rules based on detected patterns.

---

## 6. Deployment Architecture

### 6.1 Rollout Strategy

```
Week 1: Enable MVP features
├── Set features.lossless_state: true
├── Set features.notes_memory: true
├── Set features.feedback_first: true
├── Set features.anti_patterns: true
├── Test: Session recovery, feedback surfacing
└── Validate: Loop triggers < 10%

Week 3: Enable Phase 2 features
├── Set features.subagent_validators: true
├── Set features.attention_budget: true
├── Set features.zone_architecture: true
├── Test: Validation verdicts, response sizing
└── Validate: 95% first-pass validation

Week 5: Enable Phase 3 features
├── Set features.continuous_learning: true
├── Set features.trajectory_logging: true
├── Set features.run_mode_safety: true
├── Test: Learning extraction, trajectory logs
└── Validate: 2 learnings/week extracted
```

### 6.2 Rollback Procedure

If issues arise:
1. Set relevant `features.*: false` in constitution.yaml
2. Old behavior is immediately restored
3. State files (NOTES.md, trajectory/) can be ignored/deleted
4. No code changes needed for rollback

---

## 7. Development Workflow

### 7.1 Implementation Order

**Sprint 1 (Week 1-2): MVP**
```
Task 1.1: Add truth hierarchy to CLAUDE.md
Task 1.2: Add recovery protocol to CLAUDE.md
Task 1.3: Create NOTES.md template
Task 1.4: Add Step 0 NOTES.md read to craft.md
Task 1.5: Add Step 12 NOTES.md write to craft.md
Task 1.6: Add Step -1 feedback check to craft.md
Task 1.7: Add anti-patterns to 00-sigil-core.md
Task 1.8: Add feature flags to constitution.yaml
```

**Sprint 2 (Week 3-4): Quality**
```
Task 2.1: Create physics-validator.md subagent
Task 2.2: Create codebase-validator.md subagent
Task 2.3: Add Step 5.5 validation to craft.md
Task 2.4: Add attention budget to CLAUDE.md
Task 2.5: Create mode reference files (hammer, debug, explore)
Task 2.6: Add zone architecture to CLAUDE.md
Task 2.7: Create .claude/overrides/ with README
```

**Sprint 3 (Week 5-6): Intelligence**
```
Task 3.1: Create pending-learnings.md template
Task 3.2: Add Step 12.5 learning extraction to craft.md
Task 3.3: Create /skill-audit command
Task 3.4: Create trajectory/ directory structure
Task 3.5: Add Step 3b trajectory write to craft.md
Task 3.6: Add hammer safety to craft.md
```

### 7.2 Testing Strategy

| Feature | Test Method |
|---------|-------------|
| NOTES.md | Manual: /clear, /craft same component, verify recovery |
| Feedback-first | Manual: Create REJECT signal, /craft same component |
| Validators | Manual: Generate component with missing protected capability |
| Learning extraction | Manual: 3+ iterations on component, verify pending-learnings.md |
| Trajectory | Manual: /craft, verify trajectory file created |

---

## 8. Technical Risks & Mitigation

### 8.1 Risk Matrix

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| NOTES.md becomes stale | Medium | Medium | Auto-update on every craft end |
| Validators too strict | Low | Medium | Start with DRIFT only, graduate to CRITICAL |
| Learning extraction noise | Medium | Low | Approval workflow filters |
| craft.md changes break flow | Medium | High | Feature flags, incremental changes |
| Trajectory files grow large | Low | Low | One file per component per day |

### 8.2 Mitigation Details

**Stale NOTES.md**:
- Always write NOTES.md in Step 12, even on error
- Include timestamp in YAML frontmatter
- Recovery protocol checks timestamp age

**Strict Validators**:
- Phase 1: All checks return DRIFT (warnings only)
- Phase 2: Promote protected capability checks to CRITICAL
- Phase 3: Promote remaining checks based on accuracy data

**Learning Extraction Noise**:
- Require 2+ file citations as evidence
- Require approval before promotion
- Track promotion success rate

---

## 9. Success Criteria

### 9.1 Technical Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Session recovery tokens | <100 | Count tokens to resume |
| NOTES.md write latency | <1s | Time to append |
| Validator runtime | <2s | Time for both validators |
| Trajectory file size | <5KB/day | File size monitoring |

### 9.2 User-Facing Metrics

| Metric | Baseline | Target | Method |
|--------|----------|--------|--------|
| Avg iterations | 3.2 | 2.0 | craft-state.md analysis |
| Loop triggers | 15% | 5% | taste.md audit |
| Recovery time | 5+ min | 30 sec | User feedback |
| Learning rate | 0/week | 2/week | pending-learnings.md count |

---

## 10. Appendix

### A. File Templates

#### NOTES.md Template
```markdown
---
last_updated: null
session_id: null
---

# Sigil Session Memory

## Current Focus

**Component**: (none)
**Craft Type**: (none)
**Target File**: (none)
**Started**: (none)

## Physics Decisions

(No decisions yet)

## Blockers

(No blockers)

## Learnings

(No learnings yet)

## Session Continuity

**Last Action**: (none)
**Next Action**: (none)
**Context Needed**: (none)
```

#### pending-learnings.md Template
```markdown
# Pending Learnings

Discoveries awaiting approval. Review with `/skill-audit`.

---

(No pending learnings)
```

### B. Glossary

| Term | Definition |
|------|------------|
| Truth Hierarchy | Priority order for conflicting information sources |
| Grounding | Requirement that claims cite source files |
| Session Memory | NOTES.md content tracking current work |
| Trajectory | Decision log for debugging and evaluation |
| Learning Extraction | Automatic capture of discoveries |
| Circuit Breaker | Safety mechanism stopping on repeated failures |
| Attention Budget | Context-aware response sizing |

### C. Change Log

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-01-20 | Initial SDD from PRD analysis |

---

**Next Step**: `/sprint-plan` to break down into implementable tasks.
