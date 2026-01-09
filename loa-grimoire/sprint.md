# Sigil v6.1.0 Sprint Plan

> *"Code is precedent. Survival is curated. Flow is sacred."*

**Version:** 6.1.0
**Codename:** Agile Muse
**Generated:** 2026-01-08
**Sources:** PRD v6.1.0, SDD v6.1.0
**Supersedes:** Sprint Plan v6.0.0 "Native Muse"

---

## Sprint Overview

### Team Structure
- **Agent:** Claude (AI implementation)
- **Human:** @zksoju (review, approval, taste-key holder)

### Sprint Duration
- **Cycle length:** 1 week per sprint
- **Total sprints:** 3 sprints (v6.1 fixes complete)
- **Methodology:** Cycles (Linear Method)

### v6.1 Objective

Fix critical implementation gaps identified in v6.0 review:

| Priority | Count | Focus |
|----------|-------|-------|
| **P0** | 4 | Make it work (hook scripts, query fix, verify-on-read, sentinel rebuild) |
| **P1** | 4 | Make it safe (vocabulary, taste-key, hard eviction, tests) |
| **P2** | 5 | Make it fast (optimistic divergence, merge gardening, docs) |

### Evolution from v6.0

| Aspect | v6.0 Issue | v6.1 Fix |
|--------|-----------|----------|
| Hook scripts | Missing (0% execution) | Created (100% execution) |
| Cache verification | None (trusts stale data) | Verify-on-read |
| Pattern promotion | Pure democracy (mob rule) | Taste-key curation |
| Precedent breaking | /forge command (interrupts flow) | Optimistic divergence |
| Gardening | Weekly cron (6-day gap) | Merge-driven CI |

---

## Sprint 1: Make It Work (P0)

**Goal:** Fix critical blockers that prevent core lifecycle from functioning

**Duration:** 1 week

**Exit Criteria:** All hooks fire, cache verified, workshop rebuilds

---

### S1-T1: Create validate.sh Hook Script

**Description:** Create the PreToolUse hook script that bridges Claude Code to physics-validator.ts

**File:** `.claude/skills/validating-physics/scripts/validate.sh`

**Acceptance Criteria:**
- [ ] Script is executable (`chmod +x`)
- [ ] Receives code content as $1, file path as $2
- [ ] Calls `npx tsx` to invoke TypeScript module
- [ ] Returns JSON to stdout with `valid`, `violations`, `divergent` fields
- [ ] Exit code 0 = allow, 1 = block
- [ ] Uses `set -euo pipefail` for safety

**Dependencies:** None
**Effort:** Small

---

### S1-T2: Create observe.sh Hook Script

**Description:** Create the PostToolUse hook script that bridges Claude Code to survival-observer.ts

**File:** `.claude/skills/observing-survival/scripts/observe.sh`

**Acceptance Criteria:**
- [ ] Script is executable
- [ ] Receives file path as $1, code content as $2
- [ ] Calls `npx tsx` to invoke TypeScript module
- [ ] Returns JSON with `patternsDetected`, `patternsUpdated`, `candidatesCreated`
- [ ] Always exits 0 (non-blocking)
- [ ] Updates survival.json silently

**Dependencies:** None
**Effort:** Small

---

### S1-T3: Create ensure-log.sh Hook Script

**Description:** Create the Stop hook script that bridges Claude Code to chronicling-rationale.ts

**File:** `.claude/skills/chronicling-rationale/scripts/ensure-log.sh`

**Acceptance Criteria:**
- [ ] Script is executable
- [ ] Reads pending session from `.sigil/.pending-session.json`
- [ ] Calls `npx tsx` to invoke TypeScript module
- [ ] Returns JSON with `logPath`, `written`
- [ ] Always exits 0 (non-blocking)
- [ ] Cleans up pending session file

**Dependencies:** None
**Effort:** Small

---

### S1-T4: Add Hook TypeScript Exports

**Description:** Add `validateForHook()`, `observeForHook()`, `ensureSessionLog()` exports to TypeScript modules

**Files:**
- `sigil-mark/process/physics-validator.ts`
- `sigil-mark/process/survival-observer.ts`
- `sigil-mark/process/chronicling-rationale.ts`

**Acceptance Criteria:**
- [ ] `validateForHook(code, filePath)` returns `HookValidationResult`
- [ ] `observeForHook(filePath, code)` returns `HookObservationResult`
- [ ] `ensureSessionLog(projectRoot)` returns `SessionLogResult`
- [ ] All functions handle errors gracefully
- [ ] Functions are exported for bash script invocation

**Dependencies:** S1-T1, S1-T2, S1-T3
**Effort:** Medium

---

### S1-T5: Fix queryMaterial Parameter Order

**Description:** Fix wrong argument order in agent-orchestration.ts

**File:** `sigil-mark/process/agent-orchestration.ts`

**Current (Broken):**
```typescript
queryMaterial('framer-motion', workshop);  // WRONG
```

**Fixed:**
```typescript
queryMaterial(workshop, 'framer-motion');  // CORRECT
```

**Acceptance Criteria:**
- [ ] All `queryMaterial` calls use correct order `(workshop, name)`
- [ ] TypeScript compilation succeeds
- [ ] Unit test verifies correct behavior
- [ ] No other parameter order bugs in file

**Dependencies:** None
**Effort:** Small

---

### S1-T6: Add Verify-on-Read to Workshop Queries

**Description:** Implement filesystem verification before trusting cached component data

**File:** `sigil-mark/process/workshop-query.ts`

**Acceptance Criteria:**
- [ ] `queryComponentVerified()` function added
- [ ] Checks file existence via `fs.statSync()`
- [ ] Compares mtime or hash to detect modifications
- [ ] Auto-reindexes if file changed
- [ ] Removes component if file deleted
- [ ] Logs cache misses for observability
- [ ] Performance: <6ms (5ms lookup + 1ms stat)

**Dependencies:** S1-T7
**Effort:** Medium

---

### S1-T7: Add hash and indexed_at to ComponentEntry

**Description:** Extend ComponentEntry interface for verification fields

**File:** `sigil-mark/types/workshop.ts`

**Acceptance Criteria:**
- [ ] `hash?: string` field added (MD5 of file content)
- [ ] `indexed_at?: string` field added (ISO timestamp)
- [ ] Workshop builder populates these fields on index
- [ ] Existing code handles missing fields gracefully

**Dependencies:** None
**Effort:** Small

---

### S1-T8: Implement Workshop Rebuild in Startup Sentinel

**Description:** Actually call `buildWorkshop()` when staleness detected

**File:** `sigil-mark/process/startup-sentinel.ts`

**Current (Broken):**
```typescript
if (staleness.stale) {
  return { stale: true, reason: staleness.reason };  // No rebuild!
}
```

**Fixed:**
```typescript
if (staleness.stale) {
  const buildResult = await buildWorkshop({ projectRoot });
  return { fresh: true, rebuilt: true, rebuildMetrics: {...} };
}
```

**Acceptance Criteria:**
- [ ] `runSentinel()` calls `buildWorkshop()` on staleness
- [ ] Returns rebuild metrics (material/component counts)
- [ ] Acquires lock to prevent concurrent rebuilds
- [ ] Falls back to JIT grep on rebuild failure
- [ ] Rebuild completes in <2s

**Dependencies:** None
**Effort:** Medium

---

### Sprint 1 Deliverables

| File | Type | Description |
|------|------|-------------|
| `.claude/skills/validating-physics/scripts/validate.sh` | Create | PreToolUse hook bridge |
| `.claude/skills/observing-survival/scripts/observe.sh` | Create | PostToolUse hook bridge |
| `.claude/skills/chronicling-rationale/scripts/ensure-log.sh` | Create | Stop hook bridge |
| `sigil-mark/process/physics-validator.ts` | Modify | Add `validateForHook()` |
| `sigil-mark/process/survival-observer.ts` | Modify | Add `observeForHook()` |
| `sigil-mark/process/chronicling-rationale.ts` | Modify | Add `ensureSessionLog()` |
| `sigil-mark/process/agent-orchestration.ts` | Modify | Fix queryMaterial order |
| `sigil-mark/process/workshop-query.ts` | Modify | Add `queryComponentVerified()` |
| `sigil-mark/types/workshop.ts` | Modify | Add hash, indexed_at fields |
| `sigil-mark/process/startup-sentinel.ts` | Modify | Add rebuild logic |

### Sprint 1 Success Metrics

| Metric | Target |
|--------|--------|
| Hook execution rate | 100% (was 0%) |
| PreToolUse fires on Write/Edit | Yes |
| PostToolUse fires on Write/Edit | Yes |
| Stop hook fires on session end | Yes |
| Cache verification overhead | <5ms |
| Stale workshop triggers rebuild | Yes |

---

## Sprint 2: Make It Safe (P1)

**Goal:** Add quality gates to prevent bad patterns and ghost components

**Duration:** 1 week

**Exit Criteria:** Vocabulary integrated, taste-key curation working, no ghost components, E2E tests pass

---

### S2-T1: Integrate Vocabulary Reader into Agent Orchestration

**Description:** Replace hardcoded vocabulary terms with vocabulary-reader.ts

**File:** `sigil-mark/process/agent-orchestration.ts`

**Current (Broken):**
```typescript
const VOCABULARY_TERMS = ['claim', 'confirm', 'cancel', ...];  // HARDCODED
```

**Fixed:**
```typescript
import { loadVocabulary, getAllTerms } from './vocabulary-reader';
const vocab = loadVocabulary(projectRoot);
const terms = getAllTerms(vocab);
```

**Acceptance Criteria:**
- [x] Import vocabulary-reader functions
- [x] Remove hardcoded VOCABULARY_TERMS array
- [x] Use `extractVocabularyTerms()` for term extraction
- [x] Use `resolveZoneFromVocabulary()` for zone resolution
- [x] Use `resolvePhysicsFromVocabulary()` for physics selection
- [x] Cache vocabulary to avoid repeated file reads
- [x] Add `clearVocabularyCache()` for testing

**Dependencies:** None
**Effort:** Medium

---

### S2-T2: Add canonical-candidate Status

**Description:** Add new status between "surviving" and "canonical" for taste-key approval

**File:** `sigil-mark/process/survival-observer.ts`

**Acceptance Criteria:**
- [x] `PatternStatus` type includes `'canonical-candidate'`
- [x] `determineStatusWithCuration()` function added
- [x] 5+ occurrences → `canonical-candidate` (not auto-canonical)
- [x] Taste-key approval required for `canonical` promotion
- [x] Log when pattern becomes candidate

**Dependencies:** None
**Effort:** Medium

---

### S2-T3: Create taste-key.yaml Configuration

**Description:** Create configuration file for taste-key holder and pending promotions

**File:** `.sigil/taste-key.yaml`

**Acceptance Criteria:**
- [x] File created with holder email/identifier
- [x] `pending_promotions` array for candidates
- [x] `approved` array with approval records
- [x] `rejected` array with rejection records
- [x] Auto-approve settings (optional, disabled by default)

**Dependencies:** S2-T2
**Effort:** Small

---

### S2-T4: Implement addPendingPromotion()

**Description:** Add function to register patterns as canonical candidates

**File:** `sigil-mark/process/survival-observer.ts`

**Acceptance Criteria:**
- [x] `addPendingPromotion(pattern, entry)` function added
- [x] Writes to `.sigil/taste-key.yaml`
- [x] Avoids duplicate entries
- [x] Includes occurrences, first_seen, files, detected_at
- [x] Log when adding pending promotion

**Dependencies:** S2-T2, S2-T3
**Effort:** Small

---

### S2-T5: Implement isPatternApproved()

**Description:** Check if pattern has been approved by taste-key holder

**File:** `sigil-mark/process/survival-observer.ts`

**Acceptance Criteria:**
- [x] `isPatternApproved(pattern)` function added
- [x] Reads from `.sigil/taste-key.yaml`
- [x] Returns true if pattern in approved array
- [x] Returns false if missing or not approved

**Dependencies:** S2-T3
**Effort:** Small

---

### S2-T6: Create /approve Command

**Description:** Command for taste-key holder to approve canonical candidates

**File:** `.claude/commands/approve.md`

**Acceptance Criteria:**
- [x] `/approve [pattern]` command defined
- [x] Moves pattern from pending to approved
- [x] Updates survival.json status to `canonical`
- [x] Records approver and timestamp
- [x] Returns confirmation message

**Dependencies:** S2-T3, S2-T4, S2-T5
**Effort:** Medium

---

### S2-T7: Implement Hard Eviction for Virtual Sanctuary

**Description:** Delete (not fade) virtual components when real ones exist

**File:** `sigil-mark/process/seed-manager.ts`

**Current (Broken):**
```typescript
if (realComponentExists) {
  virtualComponent.status = 'faded';  // Still in memory!
}
```

**Fixed:**
```typescript
if (realComponents.length > 0) {
  seed.components = {};  // Hard delete all virtual
  seed.status = 'evicted';
}
```

**Acceptance Criteria:**
- [x] `loadSeedWithEviction()` function added
- [x] If ANY real component exists, ALL virtual components deleted
- [x] No ghost components in memory
- [x] `queryVirtualComponent()` returns null if evicted
- [x] Log eviction events

**Dependencies:** None
**Effort:** Medium

---

### S2-T8: Create /reset-seed Command

**Description:** Command to restore virtual components from template

**File:** `.claude/commands/reset-seed.md`

**Acceptance Criteria:**
- [x] `/reset-seed` command defined
- [x] Copies from `.sigil/seed-template.yaml`
- [x] Warns if real components exist
- [x] Returns confirmation message

**Dependencies:** S2-T7
**Effort:** Small

---

### S2-T9: Create E2E Test Suite

**Description:** End-to-end tests for full craft flow

**Files:**
- `sigil-mark/__tests__/e2e/full-craft-flow.test.ts`
- `sigil-mark/__tests__/process/cache-coherence.test.ts`
- `sigil-mark/__tests__/integration/hook-execution.test.ts`

**Acceptance Criteria:**
- [x] E2E test covers startup → discovery → context → validation → observation → chronicling
- [x] Cache coherence tests cover deletion detection, modification detection
- [x] Hook execution tests verify script invocation
- [x] Survival promotion tests cover experimental → surviving → canonical-candidate
- [x] All tests pass in CI

**Coverage Targets:**

| Area | Current | Target |
|------|---------|--------|
| Hook Integration | 0% | 70% |
| Cache Coherence | 0% | 90% |
| Agent Orchestration | ~40% | 80% |

**Dependencies:** Sprint 1
**Effort:** Large

---

### Sprint 2 Deliverables

| File | Type | Description |
|------|------|-------------|
| `sigil-mark/process/agent-orchestration.ts` | Modify | Vocabulary integration |
| `sigil-mark/process/survival-observer.ts` | Modify | Curated promotion |
| `.sigil/taste-key.yaml` | Create | Curation config |
| `.claude/commands/approve.md` | Create | Taste-key approval |
| `sigil-mark/process/seed-manager.ts` | Modify | Hard eviction |
| `.claude/commands/reset-seed.md` | Create | Seed reset |
| `sigil-mark/__tests__/e2e/full-craft-flow.test.ts` | Create | E2E tests |
| `sigil-mark/__tests__/process/cache-coherence.test.ts` | Create | Cache tests |

### Sprint 2 Success Metrics

| Metric | Target |
|--------|--------|
| Vocabulary terms from file | 100% (no hardcoded) |
| 5+ patterns auto-canonical | 0 (requires approval) |
| Ghost components | 0 |
| E2E test coverage | 70%+ |
| Cache coherence coverage | 90%+ |

---

## Sprint 3: Make It Fast (P2)

**Goal:** Eliminate flow interruptions and reduce feedback latency

**Duration:** 1 week

**Exit Criteria:** /forge removed, optimistic divergence working, merge-driven gardening, docs aligned

---

### S3-T1: Implement Optimistic Divergence

**Description:** Allow taste violations with tagging instead of blocking

**File:** `sigil-mark/process/physics-validator.ts`

**Acceptance Criteria:**
- [x] `validatePhysicsOptimistic()` function added
- [x] Physics violations → BLOCK (safety)
- [x] Taste violations → TAG with `@sigil-status divergent`
- [x] Returns `{ allow, violations, divergent, tag }`
- [x] Divergent code allowed but marked

**Divergence Classification:**
- Survives 2+ weeks with 3+ occurrences → Innovation
- 0 occurrences after 2 weeks → Mistake

**Dependencies:** Sprint 1 (hooks working)
**Effort:** Medium

---

### S3-T2: Remove /forge Command

**Description:** Delete forge mode entirely, replaced by optimistic divergence

**Files:**
- `sigil-mark/process/forge-mode.ts` (delete or gut)
- `.claude/commands/forge.md` (delete if exists)
- `CLAUDE.md` (remove references)
- `sigil-mark/process/agent-orchestration.ts` (remove forge detection)

**Acceptance Criteria:**
- [x] No `/forge` command available
- [x] No `--forge` flag detection
- [x] All forge references removed from docs
- [x] Optimistic divergence handles all cases

**Dependencies:** S3-T1
**Effort:** Medium

---

### S3-T3: Create GitHub Actions Gardener Workflow

**Description:** Merge-driven gardening instead of weekly cron

**File:** `.github/workflows/sigil-gardener.yaml`

**Acceptance Criteria:**
- [x] Triggers on push to main
- [x] Triggers on merged PRs to main
- [x] Runs `npx tsx sigil-mark/process/garden-command.ts`
- [x] Auto-commits survival.json with `[skip ci]`
- [x] No CI loops from gardener commits
- [x] Checks for changes before committing

**Dependencies:** None
**Effort:** Medium

---

### S3-T4: Create garden-command.ts

**Description:** CLI entry point for gardener invocation

**File:** `sigil-mark/process/garden-command.ts`

**Acceptance Criteria:**
- [x] Executable via `npx tsx`
- [x] Scans `src/` for @sigil-pattern tags
- [x] Updates survival.json with pattern counts
- [x] Creates canonical-candidate for 5+ patterns
- [x] Logs scan results

**Dependencies:** S3-T3
**Effort:** Small

---

### S3-T5: Standardize Version Numbers

**Description:** Update all version references to 6.1.0

**Files:**
- `sigil-mark/package.json`
- `CLAUDE.md`
- `sigil-mark/process/vocabulary-reader.ts` (header comment)
- `CHANGELOG.md`

**Acceptance Criteria:**
- [x] package.json version is 6.1.0
- [x] CLAUDE.md says v6.1.0
- [x] vocabulary-reader.ts header says v6.1.0
- [x] CHANGELOG.md has v6.1.0 entry
- [x] No version mismatches

**Dependencies:** None
**Effort:** Small

---

### S3-T6: Replace YAML Regex with Parser

**Description:** Use yaml package instead of fragile regex

**File:** `sigil-mark/process/workshop-builder.ts`

**Current (Fragile):**
```typescript
const physicsMatch = content.match(/physics:\s*\n((?:\s+\w+:[\s\S]*?(?=\n\w|\n$|$))+)/);
```

**Fixed:**
```typescript
import YAML from 'yaml';
const config = YAML.parse(content);
const physics = config.physics;
```

**Acceptance Criteria:**
- [x] Import `yaml` package (already dependency)
- [x] Replace regex patterns with YAML.parse()
- [x] Handle comments and multi-line values
- [x] Error handling for malformed YAML
- [x] Unit tests for edge cases

**Dependencies:** None
**Effort:** Medium

---

### S3-T7: Align craft.md with Implementation

**Description:** Update skill documentation to match actual behavior

**File:** `.claude/commands/craft.md`

**Acceptance Criteria:**
- [x] Remove references to Constitution checking
- [x] Remove references to Locked decisions
- [x] Document actual 7-phase flow
- [x] Match agent-orchestration.ts behavior
- [x] Remove unimplemented features

**Dependencies:** Sprint 1, Sprint 2
**Effort:** Medium

---

### S3-T8: Update CLAUDE.md

**Description:** Update main documentation with v6.1 changes

**File:** `CLAUDE.md`

**Acceptance Criteria:**
- [x] Version updated to 6.1.0 "Agile Muse"
- [x] /forge command removed from reference
- [x] /approve command added
- [x] /reset-seed command added
- [x] Three Laws updated (Survival is curated)
- [x] Optimistic divergence explained
- [x] Merge-driven gardening documented

**Dependencies:** S3-T1, S3-T2, S3-T3
**Effort:** Medium

---

### Sprint 3 Deliverables

| File | Type | Description |
|------|------|-------------|
| `sigil-mark/process/physics-validator.ts` | Modify | Optimistic divergence |
| `sigil-mark/process/forge-mode.ts` | Delete/Modify | Remove forge mode |
| `.github/workflows/sigil-gardener.yaml` | Create | Merge-driven CI |
| `sigil-mark/process/garden-command.ts` | Create | Gardener CLI |
| `sigil-mark/package.json` | Modify | Version 6.1.0 |
| `sigil-mark/process/workshop-builder.ts` | Modify | YAML parser |
| `.claude/commands/craft.md` | Modify | Align with implementation |
| `CLAUDE.md` | Modify | v6.1 documentation |
| `CHANGELOG.md` | Modify | v6.1.0 entry |

### Sprint 3 Success Metrics

| Metric | Target |
|--------|--------|
| /forge command available | No (removed) |
| Flow interruptions | 0 |
| Gardener latency | <5 min (per merge) |
| Version mismatches | 0 |
| craft.md accuracy | 100% |

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Hook scripts fail silently | Medium | High | `set -euo pipefail`, error logging |
| Verify-on-read adds latency | Low | Medium | Use mtime first, hash on mismatch |
| Taste-key bottleneck | Medium | Medium | Auto-approve after 14 days (optional) |
| Optimistic divergence spam | Low | Low | Rate limit: max 3 divergent tags per file |
| Merge-driven gardening conflicts | Low | Medium | `[skip ci]`, rebase strategy |
| Breaking changes from /forge removal | Low | Low | Optimistic divergence covers use cases |

---

## Dependencies & Blockers

### External Dependencies
- ripgrep installed on system
- Node.js 20+ for scripts
- GitHub Actions for merge-driven gardening
- `yaml` package (already in package.json)

### Internal Dependencies
```
Sprint 1: Make It Work (P0)
├── S1-T1 (validate.sh) ──────────┐
├── S1-T2 (observe.sh) ───────────┼──► S1-T4 (Hook TS exports)
├── S1-T3 (ensure-log.sh) ────────┘
│
├── S1-T5 (queryMaterial fix) ────────► Independent
│
├── S1-T7 (ComponentEntry hash) ──────► S1-T6 (verify-on-read)
│
└── S1-T8 (sentinel rebuild) ─────────► Independent

Sprint 2: Make It Safe (P1)
├── S2-T1 (vocabulary integration) ───► Independent
│
├── S2-T2 (canonical-candidate) ──┬──► S2-T4 (addPendingPromotion)
│                                 └──► S2-T5 (isPatternApproved)
├── S2-T3 (taste-key.yaml) ───────────► S2-T4, S2-T5
│
├── S2-T4 + S2-T5 ────────────────────► S2-T6 (/approve command)
│
├── S2-T7 (hard eviction) ────────────► S2-T8 (/reset-seed)
│
└── Sprint 1 ─────────────────────────► S2-T9 (E2E tests)

Sprint 3: Make It Fast (P2)
├── S3-T1 (optimistic divergence) ────► S3-T2 (remove /forge)
│
├── S3-T3 (GitHub Actions) ───────────► S3-T4 (garden-command.ts)
│
├── S3-T5 (versions) ─────────────────► Independent
│
├── S3-T6 (YAML parser) ──────────────► Independent
│
└── Sprint 1 + Sprint 2 ──────────────► S3-T7, S3-T8 (docs)
```

---

## Success Metrics Summary

| Metric | v6.0 Actual | v6.1 Target | Sprint |
|--------|-------------|-------------|--------|
| Hook execution rate | 0% | 100% | 1 |
| Cache verification | None | Every query | 1 |
| Pattern curation | 0 taste-key | 100% canonical | 2 |
| Vocabulary source | Hardcoded | vocabulary.yaml | 2 |
| Ghost components | Unknown | 0 | 2 |
| E2E test coverage | Low | 70%+ | 2 |
| Gardener latency | 7 days | <5 min | 3 |
| Flow interruptions | 1 (/forge) | 0 | 3 |
| Version consistency | 4 mismatches | 0 | 3 |

---

## Command Reference (v6.1)

| Command | Purpose | Status |
|---------|---------|--------|
| `/craft "description"` | Generate from feel | Unchanged |
| `/inspire [url]` | One-time fetch | Unchanged |
| `/sanctify "pattern"` | Promote ephemeral | Unchanged |
| `/garden` | Run survival scan | Unchanged |
| `/audit [component]` | Check cohesion | Unchanged |
| `/new-era "name"` | Start fresh epoch | Unchanged |
| `/approve [pattern]` | Taste-key approval | **NEW** (Sprint 2) |
| `/reset-seed` | Restore virtual | **NEW** (Sprint 2) |
| `/forge` | Break precedent | **REMOVED** (Sprint 3) |

---

*Sprint Plan Generated: 2026-01-08*
*Based on: PRD v6.1.0, SDD v6.1.0*
*Next Step: `/implement v6.1-sprint-1`*
