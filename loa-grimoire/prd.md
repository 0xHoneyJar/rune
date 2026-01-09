# Product Requirements Document: Sigil v6.1 "Agile Muse"

> *"Code is precedent. Survival is curated. Flow is sacred."*

**Version:** 6.1.0
**Codename:** Agile Muse
**Status:** PRD Complete
**Date:** 2026-01-09
**Supersedes:** Sigil v6.0.0 "Native Muse" PRD
**Sources:** SIGIL_V6_COMPREHENSIVE_REVIEW.md (Technical, Principal Engineer, Staff Design Reviews)

---

## 1. Executive Summary

Sigil v6.1 "Agile Muse" addresses critical implementation gaps identified in v6.0 "Native Muse" while preserving the architectural pivot from governance to ecological survival.

**The Problem with v6.0:**
- Core hook scripts don't exist (lifecycle is non-functional)
- Workshop cache can drift from filesystem reality
- Survival system has no curation layer ("Mob Rule" risk)
- `/forge` command breaks flow state
- Weekly gardener creates 6-day feedback gap

**The v6.1 Solution:**
- **Verify-on-Read**: Use workshop for discovery (<5ms), verify filesystem for truth
- **Curated Promotion**: Survival generates candidates, Taste Owner approves canon
- **Optimistic Divergence**: Let users break rules, classify post-hoc (delete `/forge`)
- **Merge-Driven Gardening**: Update survival on PR merge, not weekly cron

**Ratings from Review:**

| Dimension | v6.0 Score | v6.1 Target |
|-----------|-----------|-------------|
| Architecture | 9.5/10 | 9.5/10 (unchanged) |
| Implementation | 7/10 | 9/10 |
| Philosophy | A | A |
| Production Readiness | B+ | A |

> Source: SIGIL_V6_COMPREHENSIVE_REVIEW.md:12-23

---

## 2. Problem Statement

### 2.1 v6.0 Implementation Gaps

The v6.0 architecture is sound. The v6.0 implementation has critical gaps:

```
┌─────────────────────────────────────────────────────────────┐
│                    v6.0 PROMISED                            │
│  PreToolUse → Physics Validation                            │
│  PostToolUse → Survival Observation                         │
│  Stop → Craft Log Generation                                │
└────────────────────────┬────────────────────────────────────┘
                         │
          Scripts don't exist (hooks never fire)
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    v6.0 REALITY                             │
│  Lifecycle is disconnected                                  │
│  Agent generates code with no validation                    │
│  Patterns never observed, logs never written                │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Why v6.1 Now

| Gap | Impact | Evidence |
|-----|--------|----------|
| Missing hook scripts | Core lifecycle broken | sigil-craft.yaml references non-existent files |
| Cache trust issues | Stale data served | loadWorkshop() has no verification |
| No taste-key curation | Bad patterns canonized | determineStatus() is pure democracy |
| /forge breaks flow | Innovation taxed | Explicit mode switch required |
| Weekly gardener | 6-day feedback gap | Team fights agent for 6 days |

> Source: SIGIL_V6_COMPREHENSIVE_REVIEW.md:49-112

---

## 3. Vision & Goals

### 3.1 Vision

```
From "Native Muse" (Cached/Passive) to "Agile Muse" (Verified/Active)
```

### 3.2 The Corrected Mental Model

**Before (v6.0):**
```
User Prompt
    ↓
[Cached Workshop] → [Pattern Selection] → [Generate] → [Observe]
    ↓                     ↓
 May be stale      Pure democracy (5 = canonical)
```

**After (v6.1):**
```
User Prompt
    ↓
[Vocabulary Reader] → [Zone/Physics Resolution]
    ↓
[Cached Workshop] → [VERIFY ON READ] → [Pattern Selection]
    ↓                     ↓
 Self-healing       Curated promotion
    ↓                     ↓
[Generate (optimistic)] → [Tag divergent if needed]
    ↓
[Observe] → [Merge-driven Gardener] → [Taste Key Approval]
```

> Source: SIGIL_V6_COMPREHENSIVE_REVIEW.md:806-830

### 3.3 Success Metrics

| Metric | v6.0 Actual | v6.1 Target |
|--------|-------------|-------------|
| Hook execution rate | 0% (missing scripts) | 100% |
| Workshop verification | None | On every component query |
| Canonical promotion | Pure democracy | Taste-key curated |
| Gardener latency | 7 days | Per-merge |
| Flow interruptions | 1 (/forge prompt) | 0 |

---

## 4. Requirements by Priority

### 4.1 P0 — Critical (Blocks Core Functionality)

#### P0-1: Create Hook Integration Scripts

**Problem:** sigil-craft.yaml references scripts that don't exist.

**Current State:**
```yaml
# sigil-craft.yaml references:
PreToolUse:
  script: ".claude/skills/validating-physics/scripts/validate.sh"  # MISSING
PostToolUse:
  script: ".claude/skills/observing-survival/scripts/observe.sh"   # MISSING
Stop:
  script: ".claude/skills/chronicling-rationale/scripts/ensure-log.sh"  # MISSING
```

**Requirements:**
- P0-1.1: Create `validate.sh` that invokes `physics-validator.ts`
- P0-1.2: Create `observe.sh` that invokes `survival-observer.ts`
- P0-1.3: Create `ensure-log.sh` that invokes `chronicling-rationale.ts`
- P0-1.4: Scripts must handle argument passing (CODE, ZONE, FILE_PATH)
- P0-1.5: Scripts must return JSON for Claude Code hook integration

**Acceptance Criteria:**
- [ ] PreToolUse hook fires and validates physics
- [ ] PostToolUse hook fires and observes patterns
- [ ] Stop hook fires and generates craft log
- [ ] All scripts are executable and tested

> Source: SIGIL_V6_COMPREHENSIVE_REVIEW.md:51-111

---

#### P0-2: Fix queryMaterial Parameter Order

**Problem:** `queryMaterial` called with wrong argument order.

**Current State:**
```typescript
// agent-orchestration.ts line 484
queryMaterial('framer-motion', workshop);  // WRONG

// workshop-builder.ts line 637 — actual signature
export function queryMaterial(workshop: Workshop, name: string): MaterialEntry | null
```

**Requirements:**
- P0-2.1: Swap argument order in all `queryMaterial` calls
- P0-2.2: Add TypeScript strict checking to prevent future issues
- P0-2.3: Add unit test for parameter order

**Acceptance Criteria:**
- [ ] `queryMaterial(workshop, name)` is the only call pattern
- [ ] TypeScript compilation catches future ordering errors
- [ ] Unit test validates correct behavior

> Source: SIGIL_V6_COMPREHENSIVE_REVIEW.md:179-196

---

#### P0-3: Implement Verify-on-Read for Workshop Cache

**Problem:** Workshop index can drift from filesystem reality.

**Scenarios:**
1. Git pull in another terminal changes files
2. External editor modifies file while Claude runs
3. Component deleted but workshop still lists it

**Current State:**
```typescript
// workshop-builder.ts — TRUSTS CACHE
export function loadWorkshop(workshopPath: string): Workshop {
  const content = fs.readFileSync(workshopPath, 'utf-8');
  return JSON.parse(content);  // No verification
}
```

**Requirements:**
- P0-3.1: Add `hash` field to ComponentEntry interface
- P0-3.2: Implement `queryComponentVerified()` that checks file existence
- P0-3.3: Detect file modification via mtime or hash comparison
- P0-3.4: Auto-reindex if file changed, remove if file deleted
- P0-3.5: Log cache misses for observability

**Schema Change:**
```typescript
export interface ComponentEntry {
  path: string;
  tier: ComponentTier;
  zone?: string;
  physics?: string;
  vocabulary?: string[];
  imports: string[];
  hash?: string;      // NEW: Content hash for verification
  indexed_at?: string; // NEW: Timestamp for mtime comparison
}
```

**Acceptance Criteria:**
- [ ] Deleted files return null (not stale data)
- [ ] Modified files trigger re-index
- [ ] Cache verification adds <5ms overhead
- [ ] Log warns on cache misses

> Source: SIGIL_V6_COMPREHENSIVE_REVIEW.md:317-387

---

#### P0-4: Implement Workshop Rebuild in Startup Sentinel

**Problem:** `runSentinel` checks staleness but doesn't rebuild.

**Current State:**
```typescript
// startup-sentinel.ts — INCOMPLETE
export async function runSentinel(options: SentinelOptions): Promise<SentinelResult> {
  const staleness = checkWorkshopStaleness(projectRoot);
  if (staleness.stale) {
    return { stale: true, reason: staleness.reason };  // No rebuild!
  }
}
```

**CLAUDE.md Promise:**
```
if (package_hash changed || imports_hash changed) {
  quickRebuild()  // <2s incremental
}
```

**Requirements:**
- P0-4.1: Call `buildWorkshop()` when staleness detected
- P0-4.2: Return rebuild metrics (duration, material count, component count)
- P0-4.3: Handle rebuild failures gracefully
- P0-4.4: Log rebuild activity

**Acceptance Criteria:**
- [ ] Stale workshop triggers automatic rebuild
- [ ] Rebuild completes in <2s for typical projects
- [ ] Rebuild failures don't crash the agent
- [ ] Metrics available for observability

> Source: SIGIL_V6_COMPREHENSIVE_REVIEW.md:198-243

---

### 4.2 P1 — High (Significant Quality/Safety Issues)

#### P1-1: Integrate Vocabulary Reader into Agent Orchestration

**Problem:** `agent-orchestration.ts` has hardcoded vocabulary instead of using `vocabulary-reader.ts`.

**Current State:**
```typescript
// agent-orchestration.ts — HARDCODED
const VOCABULARY_TERMS = [
  'claim', 'confirm', 'cancel', 'send', 'submit', 'delete',
  'trustworthy', 'critical', 'urgent', 'marketing', 'admin', 'dashboard',
];

// vocabulary-reader.ts — EXISTS but UNUSED
// 671 lines of sophisticated term-to-feel mapping
```

**Requirements:**
- P1-1.1: Import and use `loadVocabulary()` from vocabulary-reader
- P1-1.2: Replace hardcoded terms with `getAllTerms()` call
- P1-1.3: Use `getTermFeel()` for zone resolution
- P1-1.4: Use `getRecommendedPhysics()` for physics selection
- P1-1.5: Cache vocabulary to avoid repeated file reads

**Acceptance Criteria:**
- [ ] Vocabulary loaded from `sigil-mark/vocabulary.yaml`
- [ ] Zone resolution uses semantic term mapping
- [ ] Physics selection respects vocabulary feel
- [ ] No hardcoded term lists in agent-orchestration.ts

> Source: SIGIL_V6_COMPREHENSIVE_REVIEW.md:114-175

---

#### P1-2: Implement Taste-Key Curation Layer

**Problem:** Survival measures virality, not quality. "Mob Rule" risk.

**Scenario:**
1. Junior engineer copies bad pattern
2. 4 others copy that pattern
3. v6.0 promotes to "Canonical" (5 occurrences)
4. Bad code enshrined as "Gold Standard"

**Current State:**
```typescript
// survival-observer.ts — PURE DEMOCRACY
export function determineStatus(occurrences: number): PatternStatus {
  if (occurrences >= 5) return 'canonical';
  if (occurrences >= 3) return 'surviving';
  return 'experimental';
}
```

**Requirements:**
- P1-2.1: Add `canonical-candidate` status for patterns at 5+ occurrences
- P1-2.2: Create `.sigil/taste-key.yaml` for approval workflow
- P1-2.3: Require taste-key approval for `canonical` promotion
- P1-2.4: Add `/approve [pattern]` command for taste-key holder
- P1-2.5: Log pending promotions for visibility

**Schema:**
```yaml
# .sigil/taste-key.yaml
holder: "design-lead@company.com"
pending_promotions:
  - pattern: "spinner-loading"
    occurrences: 7
    first_seen: "2026-01-05"
    status: "canonical-candidate"
    files: ["Button.tsx", "Card.tsx", "Modal.tsx"]
```

**Acceptance Criteria:**
- [ ] 5+ occurrences → `canonical-candidate` (not auto-canonical)
- [ ] Taste-key holder can approve/reject candidates
- [ ] Approved patterns become `canonical`
- [ ] Rejected patterns stay `surviving`

> Source: SIGIL_V6_COMPREHENSIVE_REVIEW.md:443-504

---

#### P1-3: Implement Hard Eviction for Virtual Sanctuary

**Problem:** Virtual Sanctuary "fading" creates ghost components.

**Scenario:**
1. User asks for Button
2. Agent sees Virtual Button AND Real Button
3. Which wins? Ambiguous.

**Current State:**
```typescript
// seed-manager.ts — FADING CREATES GHOSTS
if (realComponentExists) {
  virtualComponent.status = 'faded';  // Still in memory!
}
```

**Requirements:**
- P1-3.1: Hard delete virtual component when real exists (not fade)
- P1-3.2: Disable Virtual Sanctuary if `src/sanctuary/` is non-empty
- P1-3.3: Add `/reset-seed` command to restore virtual components
- P1-3.4: Log eviction events for debugging

**Rule:** If `src/sanctuary/` is non-empty, disable Virtual Sanctuary entirely for that subdirectory.

**Acceptance Criteria:**
- [ ] Virtual components deleted (not faded) when real exists
- [ ] Non-empty sanctuary disables virtual components
- [ ] `/reset-seed` restores from template
- [ ] No ghost components in memory

> Source: SIGIL_V6_COMPREHENSIVE_REVIEW.md:392-437

---

#### P1-4: Add Integration Tests

**Problem:** No E2E tests for full craft flow.

**Requirements:**
- P1-4.1: Full craft flow test (startup → discovery → context → validation → observation → chronicling)
- P1-4.2: Cache coherence tests (deletion detection, modification detection)
- P1-4.3: Hook execution tests (validate.sh, observe.sh, ensure-log.sh)
- P1-4.4: Survival promotion tests (experimental → surviving → canonical-candidate)

**Test Structure:**
```
sigil-mark/__tests__/
├── e2e/
│   └── full-craft-flow.test.ts
├── process/
│   ├── cache-coherence.test.ts
│   └── hook-execution.test.ts
└── survival/
    └── promotion.test.ts
```

**Coverage Targets:**

| Area | Current | Target |
|------|---------|--------|
| Hook Integration | 0% | 70% |
| Cache Coherence | 0% | 90% |
| Agent Orchestration | ~40% | 80% |

**Acceptance Criteria:**
- [ ] E2E test passes with real filesystem
- [ ] Cache coherence tests cover deletion and modification
- [ ] Hook tests verify script execution
- [ ] CI runs tests on every PR

> Source: SIGIL_V6_COMPREHENSIVE_REVIEW.md:616-687

---

### 4.3 P2 — Medium (Technical Debt)

#### P2-1: Convert /forge to Optimistic Divergence

**Problem:** Explicit `/forge` command taxes innovation. Creativity is rarely premeditated.

**Current State:**
```typescript
// forge-mode.ts — EXPLICIT MODE SWITCH
export function detectForgeTrigger(prompt: string): ForgeTrigger | null {
  if (prompt.includes('/forge') || prompt.includes('--forge')) {
    return { active: true };
  }
  return null;
}
```

**Requirements:**
- P2-1.1: Remove `/forge` command entirely
- P2-1.2: Implement optimistic divergence in physics-validator
- P2-1.3: Tag divergent code with `@sigil-status divergent`
- P2-1.4: Gardener classifies divergence as `mistake` or `innovation`
- P2-1.5: Update documentation to remove /forge references

**Optimistic Divergence Logic:**
```typescript
export function validatePhysicsOptimistic(code: string): ValidationResult {
  const physicsResult = validatePhysics(code);
  const tasteResult = validateTaste(code);

  if (!physicsResult.valid) {
    // Physics violations are BLOCKING (safety)
    return { allow: false, reason: physicsResult.reason };
  }

  if (!tasteResult.valid) {
    // Taste violations are TAGGING (observation)
    return {
      allow: true,
      divergent: true,
      tag: `/** @sigil-status divergent: ${tasteResult.reason} */`,
    };
  }

  return { allow: true };
}
```

**Divergence Classification:**
- Survives 2+ weeks with 3+ occurrences → Innovation
- 0 occurrences after existing → Mistake

**Acceptance Criteria:**
- [ ] `/forge` command removed
- [ ] Divergent code allowed but tagged
- [ ] Gardener classifies divergence
- [ ] Documentation updated

> Source: SIGIL_V6_COMPREHENSIVE_REVIEW.md:507-566

---

#### P2-2: Implement Merge-Driven Gardening

**Problem:** Weekly gardener creates 6-day feedback gap.

**Scenario:**
1. Engineer builds new pattern on Monday
2. Team adopts it on Tuesday
3. Agent thinks it's anomaly until Sunday
4. For 6 days, agent fights team's new direction

**Requirements:**
- P2-2.1: Create GitHub Actions workflow for gardening
- P2-2.2: Trigger on push to main and merged PRs
- P2-2.3: Auto-commit survival.json updates
- P2-2.4: Skip CI on gardener commits to prevent loops

**GitHub Actions Workflow:**
```yaml
# .github/workflows/sigil-gardener.yaml
name: Sigil Gardener
on:
  push:
    branches: [main]
  pull_request:
    types: [closed]
    branches: [main]

jobs:
  garden:
    if: github.event.pull_request.merged == true || github.event_name == 'push'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Gardener
        run: npx tsx sigil-mark/process/garden-command.ts
      - name: Commit Survival Index
        run: |
          git add .sigil/survival.json
          git commit -m "chore(sigil): update survival index [skip ci]" || true
          git push
```

**Acceptance Criteria:**
- [ ] Gardener runs on every merge to main
- [ ] Survival index updated within minutes of merge
- [ ] No CI loops from gardener commits
- [ ] Weekly cron removed (optional fallback)

> Source: SIGIL_V6_COMPREHENSIVE_REVIEW.md:568-613, 926-966

---

#### P2-3: Standardize Version Numbers

**Problem:** Version inconsistencies across files.

**Current State:**

| File | Version | Should Be |
|------|---------|-----------|
| sigil-mark/package.json | 4.1.0 | 6.1.0 |
| CLAUDE.md | v6.0.0 | v6.1.0 |
| vocabulary-reader.ts header | v4.1 | v6.1.0 |
| CHANGELOG.md | 6.0.0 | 6.1.0 |

**Requirements:**
- P2-3.1: Update sigil-mark/package.json to 6.1.0
- P2-3.2: Update CLAUDE.md version reference
- P2-3.3: Update vocabulary-reader.ts header comment
- P2-3.4: Add CHANGELOG.md entry for v6.1.0

**Acceptance Criteria:**
- [ ] All version references show 6.1.0
- [ ] CHANGELOG documents v6.1.0 changes

> Source: SIGIL_V6_COMPREHENSIVE_REVIEW.md:247-258

---

#### P2-4: Replace YAML Regex with Parser

**Problem:** `workshop-builder.ts` uses fragile regex for YAML parsing.

**Current State:**
```typescript
// workshop-builder.ts — FRAGILE
const physicsMatch = content.match(/physics:\s*\n((?:\s+\w+:[\s\S]*?(?=\n\w|\n$|$))+)/);
```

**Breaks on:** Comments, multi-line values, anchors/aliases, non-standard indentation.

**Requirements:**
- P2-4.1: Replace regex with `yaml` package (already a dependency)
- P2-4.2: Add error handling for malformed YAML
- P2-4.3: Add unit tests for edge cases

**Acceptance Criteria:**
- [ ] YAML parsed with official parser
- [ ] Comments and multi-line values handled
- [ ] Malformed YAML fails gracefully

> Source: SIGIL_V6_COMPREHENSIVE_REVIEW.md:260-292

---

#### P2-5: Align craft.md with Implementation

**Problem:** `/craft` command describes v2.6 features that don't exist.

**craft.md describes:**
- Constitution checking
- Locked decisions surfacing
- Persona physics application
- 7-step workflow with Process Context

**agent-orchestration.ts implements:**
- Different 7-phase flow without Constitution/Decisions

**Requirements:**
- P2-5.1: Update craft.md to match current implementation
- P2-5.2: Remove references to unimplemented features
- P2-5.3: Document actual 7-phase flow

**Acceptance Criteria:**
- [ ] craft.md describes actual behavior
- [ ] No references to Constitution/Decisions (unless implemented)
- [ ] Phase descriptions match agent-orchestration.ts

> Source: SIGIL_V6_COMPREHENSIVE_REVIEW.md:294-315

---

## 5. Files to Create

| File | Purpose |
|------|---------|
| `.claude/skills/validating-physics/scripts/validate.sh` | PreToolUse hook bridge |
| `.claude/skills/observing-survival/scripts/observe.sh` | PostToolUse hook bridge |
| `.claude/skills/chronicling-rationale/scripts/ensure-log.sh` | Stop hook bridge |
| `.github/workflows/sigil-gardener.yaml` | Merge-driven gardening |
| `.sigil/taste-key.yaml` | Taste-key approval config |
| `sigil-mark/__tests__/e2e/full-craft-flow.test.ts` | E2E integration test |
| `sigil-mark/__tests__/process/cache-coherence.test.ts` | Cache verification tests |

## 6. Files to Modify

| File | Changes |
|------|---------|
| `sigil-mark/process/agent-orchestration.ts` | Vocabulary integration, queryMaterial fix |
| `sigil-mark/process/startup-sentinel.ts` | Add rebuild logic |
| `sigil-mark/process/workshop-builder.ts` | YAML parsing, hash generation |
| `sigil-mark/process/workshop-query.ts` | Verify-on-read |
| `sigil-mark/process/survival-observer.ts` | Taste-key curation |
| `sigil-mark/process/seed-manager.ts` | Hard eviction |
| `sigil-mark/process/forge-mode.ts` | Optimistic divergence (or delete) |
| `sigil-mark/process/physics-validator.ts` | Optimistic divergence |
| `sigil-mark/package.json` | Version bump |
| `CLAUDE.md` | Version bump, /forge removal |
| `.claude/commands/craft.md` | Align with implementation |

---

## 7. Implementation Phases

### Phase 1: Make It Work (P0 fixes)
**Sprint 1**

1. Create hook scripts (validate.sh, observe.sh, ensure-log.sh)
2. Fix queryMaterial parameter order
3. Implement workshop rebuild in startup-sentinel.ts
4. Add verify-on-read to workshop queries

**Exit Criteria:** Core lifecycle functional, hooks fire, cache verified.

### Phase 2: Make It Safe (P1 fixes)
**Sprint 2**

5. Integrate vocabulary-reader into agent-orchestration
6. Add taste-key curation layer to survival
7. Implement hard eviction for Virtual Sanctuary
8. Add E2E integration tests

**Exit Criteria:** Quality patterns promoted, bad patterns blocked, no ghosts.

### Phase 3: Make It Fast (P2 fixes)
**Sprint 3**

9. Convert /forge to optimistic divergence
10. Set up merge-driven gardening CI
11. Standardize versions to 6.1.0
12. Replace YAML regex with yaml package
13. Align craft.md with implementation

**Exit Criteria:** Zero flow interruptions, immediate feedback, clean docs.

---

## 8. Test Coverage Targets

| Area | v6.0 Actual | v6.1 Target |
|------|-------------|-------------|
| Physics Validator | ~95% | 100% |
| Survival Observer | ~80% | 90% |
| Workshop Builder | ~70% | 85% |
| Agent Orchestration | ~40% | 80% |
| Hook Integration | 0% | 70% |
| Cache Coherence | 0% | 90% |

---

## 9. Success Metrics

| Metric | v6.0 Actual | v6.1 Target | Measurement |
|--------|-------------|-------------|-------------|
| Hook execution | 0% | 100% | CI hook tests |
| Cache verification | None | Every query | Log analysis |
| Pattern curation | 0 taste-key | 100% canonical | survival.json audit |
| Gardener latency | 7 days | <1 hour | PR merge to index update |
| Flow interruptions | 1 | 0 | No /forge, no prompts |
| Version consistency | 4 mismatches | 0 | grep scan |

---

## 10. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Hook scripts fail silently | Lifecycle broken | Add health checks, error logging |
| Verify-on-read adds latency | Slow queries | Profile, optimize stat() calls |
| Taste-key bottleneck | Promotion backlog | Allow bulk approval, fallback timeout |
| Optimistic divergence spam | Too many tags | Rate limit divergence detection |
| Merge-driven gardening conflicts | Git conflicts | Rebase strategy, skip-ci commits |

---

## 11. Out of Scope (P3 Items for Future)

- Skill count documentation fix (10 → 11)
- Architecture diagrams
- Error recovery documentation
- IDE plugins
- CI/CD integration beyond gardening

---

## 12. The Linear Standard

> "Linear prioritizes the daily experience of the 'Maker' over the reporting needs of the 'Buyer.'"

**Application to Sigil v6.1:**
- The "Maker" is the developer in flow state
- The "Buyer" is the governance system requesting compliance
- Sigil must prioritize the Maker
- Therefore: Delete /forge, use optimistic divergence, merge-driven gardening

---

## 13. Appendix

### A. The Three Laws (Evolved for v6.1)

1. **Code is Precedent** — Existence is approval, deletion is rejection
2. **Survival is Curated** — Patterns that persist become candidates; Taste Owner makes canon
3. **Never Interrupt Flow** — No blocking dialogs, optimistic divergence, immediate feedback

### B. Review Sources

| Source | Focus | Key Contribution |
|--------|-------|------------------|
| Technical Implementation Review | Code quality | Missing hooks, wrong params, YAML fragility |
| Principal Engineer (Systems) | Cache coherence | Verify-on-read, merge-driven gardening |
| Staff Design Engineer | Architecture | Taste-key curation, optimistic divergence |

### C. Command Reference (v6.1)

| Command | Purpose | Status |
|---------|---------|--------|
| `/craft "description"` | Generate from feel | Unchanged |
| `/inspire [url]` | One-time fetch | Unchanged |
| `/sanctify "pattern"` | Promote ephemeral | Unchanged |
| `/garden` | Run survival scan | Unchanged |
| `/audit [component]` | Check cohesion | Unchanged |
| `/new-era "name"` | Start fresh epoch | Unchanged |
| `/approve [pattern]` | Taste-key approval | **NEW** |
| `/reset-seed` | Restore virtual | **NEW** |
| `/forge` | Break precedent | **REMOVED** |

---

*PRD Generated: 2026-01-09*
*Sources: SIGIL_V6_COMPREHENSIVE_REVIEW.md*
*Next Step: `/architect` for Software Design Document*
