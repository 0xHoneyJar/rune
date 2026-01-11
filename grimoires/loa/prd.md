# Product Requirements Document: Sigil v7.6 "The Living Canon"

> *"Stop asking for permission to be great. If the code survives and is clean, it is Gold."*

**Version:** 7.6.0
**Codename:** The Living Canon
**Status:** PRD Complete
**Date:** 2026-01-10
**Supersedes:** Sigil v7.5.0 "The Reference Studio" PRD
**Sources:** SIGIL_LIVING_CANON_ARCHITECTURE.md (3 Reviewer Consensus)

---

## 1. Executive Summary

Sigil v7.6 "The Living Canon" addresses 6 fatal flaws identified in v7.5 implementation by 3 independent reviewers (Principal Engineer, Staff Design Engineer, Senior Agent Architect).

**The Problem with v7.5:**
- Nomination PRs = bureaucracy (governance over flow)
- Markdown principles = dead knowledge (essays, not physics)
- Contagion rules = deadlock (can't iterate on Gold)
- Registry parsing = overhead (build step for simple lookup)
- Usage = quality (mob rule promotes bad patterns)
- Background execution = flow interruption (30s blocks)

**The v7.6 Solution:**
- **Survival Engine**: Auto-promote based on survival + cleanliness (human vetoes, not approves)
- **Executable Principles**: Hooks and utilities, not markdown essays
- **Slot-Based Composition**: Gold frames accept Draft content via children
- **Filesystem as Database**: Path IS the API (`ls src/components/gold`)
- **Linter Gate**: Usage generates candidacy, cleanliness generates promotion
- **Offload to CI/CD**: Agent writes intent, CI executes heavy ops

**Ratings from Review:**

| Reviewer | v7.5 Score | v7.6 Target |
|----------|-----------|-------------|
| Senior Agent Architect | 9/10 | 10/10 |
| Principal Engineer | 7/10 | 9.9/10 |
| Staff Design Engineer | A- | A |

> Source: SIGIL_LIVING_CANON_ARCHITECTURE.md:662-668

---

## 2. Problem Statement

### 2.1 The Six Fatal Flaws

All three reviewers converged on the same critical issues:

#### Flaw 1: Nomination PRs are Bureaucracy

> "If a pattern is used 5 times without reverting, it IS the standard. We do not need a ceremony to confirm reality."
> — Principal Engineer

**v7.5 Error**: `nomination-generator.ts` creates PRs requiring human approval.

**Impact**: Governance interrupts flow. Engineers wait for approval instead of shipping.

> Source: SIGIL_LIVING_CANON_ARCHITECTURE.md:24-33

---

#### Flaw 2: Markdown Principles are Dead Knowledge

> "You are teaching the agent to read Essays, not Physics."
> — Staff Design Engineer

**v7.5 Error**: `principles/*.md` files that the agent reads and interprets.

**Impact**: Principles become opinions. Opinions are ignored under pressure.

> Source: SIGIL_LIVING_CANON_ARCHITECTURE.md:37-47

---

#### Flaw 3: Contagion Creates Deadlock

> "To change a leaf node, you have to burn down the entire tree."
> — Staff Design Engineer

**Scenario**:
1. You have a Gold Button
2. You want to test a Draft animation inside it
3. ESLint blocks (contagion rule)
4. You must downgrade Button to Silver
5. Now Header (Gold) can't import SilverButton → cascade failure

**Impact**: Experimentation requires dismantling stable components.

> Source: SIGIL_LIVING_CANON_ARCHITECTURE.md:50-63

---

#### Flaw 4: Registry Parsing is Overhead

> "The Agent shouldn't need to parse a registry to know if a component is Gold. It should just look at the path."
> — Principal Engineer

**v7.5 Error**: `registry-parser.ts` adds build step / runtime calculation.

**Impact**: Simple lookups require complex parsing. Maintenance burden.

> Source: SIGIL_LIVING_CANON_ARCHITECTURE.md:66-73

---

#### Flaw 5: Usage Equals Quality (Mob Rule)

> "If a Junior copy-pastes a button with hardcoded z-index: 9999 five times, your agent will nominate this pattern for Gold status. You are automating the canonization of technical debt."
> — Staff Design Engineer

**v7.5 Error**: 5 uses = canonical, regardless of code quality.

**Impact**: Bad patterns get enshrined. Technical debt becomes "standard."

> Source: SIGIL_LIVING_CANON_ARCHITECTURE.md:76-82

---

#### Flaw 6: Background Execution Blocks Flow

> "If your agent needs 30 seconds, you have failed Flow State."
> — Principal Engineer

**v7.5 Error**: Heavy operations (image processing) block agent loop.

**Impact**: Engineer waits 30+ seconds. Flow state destroyed.

> Source: SIGIL_LIVING_CANON_ARCHITECTURE.md:345-350

---

## 3. Vision & Goals

### 3.1 Vision

```
From "Reference Studio" (Bureaucracy) to "Living Canon" (Survival + Execution)
```

### 3.2 The Corrected Mental Model

**Before (v7.5):**
```
Pattern Used 5 Times
    ↓
[Nomination Generator] → [Create PR] → [Human Approval] → [Merge]
    ↓                         ↓
 Ceremony required      Flow interrupted
```

**After (v7.6):**
```
Pattern Used 5 Times
    ↓
[Survival Engine] → [Linter Gate Check]
    ↓                     ↓
 Auto-promote        If fails: notify, don't promote
    ↓
[Notification] → [Human can VETO within 24h]
    ↓
 Gold (if no veto)
```

### 3.3 The Three Laws (Evolved for v7.6)

1. **Survival is the vote** — But cleanliness is the gate
2. **Human vetoes, not approves** — Invert the control
3. **Executable, not descriptive** — Hooks > Markdown

### 3.4 Success Metrics

| Metric | v7.5 Actual | v7.6 Target |
|--------|-------------|-------------|
| PRs for promotion | Required | **0 (auto + veto)** |
| Markdown principles | 4+ files | **0 files** |
| Registry parsing | Yes | **No (filesystem)** |
| Contagion deadlock | Possible | **Impossible (slots)** |
| Usage → Quality gate | None | **Linter required** |
| Background ops in agent | Yes | **No (CI/CD)** |

---

## 4. Requirements by Priority

### 4.1 P0 — Critical (Core Architecture Changes)

#### P0-1: Implement Survival Engine (Replace Nomination Generator)

**Delete**: `sigil-mark/process/nomination-generator.ts`

**Create**: `sigil-mark/process/survival-engine.ts`

**Requirements:**
- P0-1.1: Auto-promote when survival + cleanliness criteria met
- P0-1.2: Survival criteria: 5+ Gold imports, 2+ weeks stable, 0 mutinies
- P0-1.3: Cleanliness criteria: ESLint 0 warnings, TSC strict, no hardcoded values
- P0-1.4: Send notification with 24h veto window
- P0-1.5: Auto-confirm if no veto after 24h
- P0-1.6: Auto-demote on modification or 3+ mutinies (immediate, no waiting)

**Interface:**
```typescript
interface SurvivalEngine {
  trigger: 'git-push' | 'weekly-cron';

  promotion: {
    survivalCriteria: {
      goldImports: '>= 5',
      stabilityWeeks: '>= 2',
      mutinies: '0',
    };
    cleanlinessCriteria: {
      eslint: 'max-warnings 0',
      typescript: 'strict',
      noHardcoded: true,
    };
    action: 'auto-promote';
    vetoWindow: '24h';
  };

  demotion: {
    criteria: 'modified OR 3+ mutinies';
    action: 'auto-demote';
    immediate: true;
  };
}
```

**Acceptance Criteria:**
- [ ] `nomination-generator.ts` deleted
- [ ] `survival-engine.ts` created
- [ ] Promotion requires survival AND cleanliness
- [ ] Notification sent with veto option
- [ ] Auto-confirm after 24h with no veto
- [ ] Demotion is immediate (no waiting)

> Source: SIGIL_LIVING_CANON_ARCHITECTURE.md:98-176

---

#### P0-2: Implement Linter Gate

**Create**: `sigil-mark/process/linter-gate.ts`

**Requirements:**
- P0-2.1: ESLint check with `sigil/no-hardcoded-values` rule
- P0-2.2: ESLint check with `sigil/use-tokens` rule
- P0-2.3: TypeScript strict mode check
- P0-2.4: No `any` types allowed
- P0-2.5: No `console.log` statements
- P0-2.6: JSDoc required for exported functions
- P0-2.7: Return boolean `canPromote()` result

**Interface:**
```typescript
interface LinterGate {
  checks: {
    eslint: { maxWarnings: 0, rules: string[] };
    typescript: { strict: true, noAny: true };
    sigil: { noConsoleLogs: true, hasDocstring: true };
  };

  canPromote(component: string): Promise<boolean>;
}
```

**Acceptance Criteria:**
- [ ] `linter-gate.ts` created
- [ ] All checks implemented
- [ ] Returns false if any check fails
- [ ] Logs specific failures for debugging

> Source: SIGIL_LIVING_CANON_ARCHITECTURE.md:386-439

---

#### P0-3: Convert Markdown Principles to Executable Code

**Delete**: `sigil-mark/principles/*.md` (all 4 files)

**Create**: Executable hooks and utilities in `src/components/gold/`

**Requirements:**
- P0-3.1: Create `src/components/gold/hooks/useMotion.ts` (replaces motion-implementation.md)
- P0-3.2: Create `src/components/gold/utils/colors.ts` (replaces color-oklch.md)
- P0-3.3: Create `src/components/gold/utils/spacing.ts` (spacing scale)
- P0-3.4: Physics values as TypeScript constants, not markdown prose
- P0-3.5: Type-safe enforcement at compile time

**useMotion.ts:**
```typescript
export function useMotion(physics: PhysicsName): MotionStyle {
  const PHYSICS = {
    'server-tick': { duration: 600, easing: 'ease-out' },
    'deliberate': { duration: 800, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
    'snappy': { duration: 150, easing: 'ease-out' },
    'smooth': { duration: 300, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
  } as const;

  return {
    transition: `all ${PHYSICS[physics].duration}ms ${PHYSICS[physics].easing}`,
  };
}
```

**colors.ts:**
```typescript
export function oklch(l: number, c: number, h: number, a = 1): string {
  if (l < 0 || l > 1) throw new Error('Lightness must be 0-1');
  if (c < 0 || c > 0.4) throw new Error('Chroma must be 0-0.4');
  if (h < 0 || h > 360) throw new Error('Hue must be 0-360');

  return `oklch(${l * 100}% ${c} ${h} / ${a})`;
}

export const palette = {
  primary: oklch(0.5, 0.2, 250),
  success: oklch(0.6, 0.2, 145),
  danger: oklch(0.5, 0.25, 25),
} as const;
```

**Acceptance Criteria:**
- [ ] `principles/*.md` deleted (4 files)
- [ ] `useMotion.ts` created with physics constants
- [ ] `colors.ts` created with OKLCH enforcement
- [ ] `spacing.ts` created with scale
- [ ] All hooks/utils are type-safe
- [ ] Agent instruction: "Use useMotion for all motion"

> Source: SIGIL_LIVING_CANON_ARCHITECTURE.md:179-236

---

#### P0-4: Implement Slot-Based Composition (Fix Contagion Deadlock)

**Modify**: ESLint rules to allow Draft content via children

**Requirements:**
- P0-4.1: Gold components accept `React.ReactNode` for content slots
- P0-4.2: ESLint allows Draft→Gold when passed as children (not imported)
- P0-4.3: Update `gold-imports-only` rule to exclude children props
- P0-4.4: Document slot pattern in CLAUDE.md

**Pattern:**
```typescript
// Gold component defines frame
export function Button({ children, icon }: ButtonProps) {
  return (
    <button>
      {icon && <span className="icon-slot">{icon}</span>}
      {children}
    </button>
  );
}

// Feature code composes Draft into Gold
import { Button } from '@/gold';
import { DraftAnimation } from '@/draft';

export function ClaimButton() {
  return (
    <Button>
      <DraftAnimation />  {/* Draft as child, not import in Gold */}
      Claim Rewards
    </Button>
  );
}
```

**Rule**: "Gold defines the frame. The content can be Draft."

**Acceptance Criteria:**
- [ ] Gold components use `ReactNode` for content slots
- [ ] ESLint allows Draft content as children
- [ ] No cascade failure when iterating
- [ ] Pattern documented in CLAUDE.md

> Source: SIGIL_LIVING_CANON_ARCHITECTURE.md:240-288

---

#### P0-5: Replace Registry Parsing with Filesystem Lookup

**Delete**: `sigil-mark/process/registry-parser.ts`

**Create**: `sigil-mark/process/filesystem-registry.ts`

**Requirements:**
- P0-5.1: Tier determined by path: `src/components/gold/Button.tsx` = Gold
- P0-5.2: No parsing required, just `fs.existsSync()`
- P0-5.3: Auto-generate `index.ts` files from directory contents
- P0-5.4: Index regeneration on file change

**Implementation:**
```typescript
function getTier(componentName: string): RegistryTier | null {
  if (fs.existsSync(`src/components/gold/${componentName}.tsx`)) return 'gold';
  if (fs.existsSync(`src/components/silver/${componentName}.tsx`)) return 'silver';
  if (fs.existsSync(`src/components/draft/${componentName}.tsx`)) return 'draft';
  return null;
}

async function regenerateIndex(tier: RegistryTier): Promise<void> {
  const files = await fs.readdir(`src/components/${tier}`);
  const exports = files
    .filter(f => f.endsWith('.tsx') && f !== 'index.ts')
    .map(f => `export * from './${f.replace('.tsx', '')}';`)
    .join('\n');

  await fs.writeFile(`src/components/${tier}/index.ts`, exports);
}
```

**Acceptance Criteria:**
- [ ] `registry-parser.ts` deleted
- [ ] `filesystem-registry.ts` created
- [ ] Path lookup replaces parsing
- [ ] Index files auto-generated
- [ ] Agent instruction: "To check tier, check path exists"

> Source: SIGIL_LIVING_CANON_ARCHITECTURE.md:294-342

---

#### P0-6: Offload Heavy Operations to CI/CD

**Modify**: Heavy operations write intent, CI executes

**Requirements:**
- P0-6.1: Create `.sigil/pending-ops.json` for queued operations
- P0-6.2: Agent writes intent instead of executing
- P0-6.3: GitHub Actions workflow processes pending ops
- P0-6.4: Notification when ops complete

**Agent behavior:**
```typescript
// BEFORE (v7.5): Agent performs heavy operation
async function optimizeImages(files: string[]): Promise<void> {
  // 30+ seconds of image processing... ❌
}

// AFTER (v7.6): Agent writes intent
async function requestImageOptimization(files: string[]): Promise<void> {
  await appendToConfig('.sigil/pending-ops.json', {
    operation: 'optimize-images',
    files,
    requestedAt: new Date().toISOString(),
  });

  console.log(`Queued ${files.length} images for optimization on next build.`);
}
```

**GitHub Actions:**
```yaml
# .github/workflows/sigil-ops.yml
on:
  push:
    branches: [main]
jobs:
  process-pending-ops:
    runs-on: ubuntu-latest
    steps:
      - run: npx sigil process-pending-ops
```

**Rule**: "The Agent is an orchestrator, not a worker node."

**Acceptance Criteria:**
- [ ] Pending ops config created
- [ ] Agent writes intent for heavy ops
- [ ] CI workflow processes ops
- [ ] No 30s+ blocks in agent loop

> Source: SIGIL_LIVING_CANON_ARCHITECTURE.md:345-383

---

### 4.2 P1 — High (Supporting Infrastructure)

#### P1-1: Update Sentinel Validator for Slot Composition

**Modify**: `sigil-mark/process/sentinel-validator.ts`

**Requirements:**
- P1-1.1: Allow Draft content passed as children to Gold
- P1-1.2: Block direct imports of Draft into Gold (unchanged)
- P1-1.3: Detect slot pattern and allow

**Acceptance Criteria:**
- [ ] Slot pattern recognized
- [ ] Direct imports still blocked
- [ ] Children composition allowed

---

#### P1-2: Update PreToolUse Hook for Filesystem Registry

**Modify**: `.claude/hooks/pre-tool-use.yaml` and `sentinel-validate.sh`

**Requirements:**
- P1-2.1: Use filesystem lookup instead of registry parsing
- P1-2.2: Faster validation (<20ms target)
- P1-2.3: Remove registry cache (not needed)

**Acceptance Criteria:**
- [ ] Hook uses filesystem lookup
- [ ] Validation faster than v7.5
- [ ] No registry caching overhead

---

#### P1-3: Create Survival Stats Tracker

**Create**: `.sigil/survival-stats.json`

**Requirements:**
- P1-3.1: Track usage count per component
- P1-3.2: Track mutation history (modifications)
- P1-3.3: Track mutiny count (overrides/reverts)
- P1-3.4: Track stability duration

**Schema:**
```json
{
  "components": {
    "Button": {
      "tier": "silver",
      "goldImports": 7,
      "lastModified": "2026-01-01",
      "stabilityWeeks": 3,
      "mutinies": 0
    }
  }
}
```

**Acceptance Criteria:**
- [ ] Stats tracked per component
- [ ] Updated on git push
- [ ] Used by survival engine

---

### 4.3 P2 — Medium (Polish)

#### P2-1: Update CLAUDE.md for v7.6

**Modify**: `CLAUDE.md`

**Requirements:**
- P2-1.1: Remove nomination workflow section
- P2-1.2: Add survival engine documentation
- P2-1.3: Add slot composition pattern
- P2-1.4: Update filesystem registry docs
- P2-1.5: Remove background execution section (offloaded to CI)

---

#### P2-2: Update Version Numbers

**Modify**: All version references to 7.6.0

---

#### P2-3: Clean Up Deleted Files

**Delete**:
- `sigil-mark/process/nomination-generator.ts`
- `sigil-mark/process/registry-parser.ts`
- `sigil-mark/principles/motion-implementation.md`
- `sigil-mark/principles/color-oklch.md`
- `sigil-mark/principles/svg-patterns.md`
- `sigil-mark/principles/image-tooling.md`
- `sigil-mark/principles/README.md`

---

## 5. File Changes Summary

### Files to Delete

| File | Reason |
|------|--------|
| `sigil-mark/process/nomination-generator.ts` | Replaced by survival engine |
| `sigil-mark/process/registry-parser.ts` | Replaced by filesystem lookup |
| `sigil-mark/principles/*.md` (5 files) | Replaced by executable code |

### Files to Create

| File | Purpose |
|------|---------|
| `sigil-mark/process/survival-engine.ts` | Auto-promote/demote with veto |
| `sigil-mark/process/linter-gate.ts` | Cleanliness gate for promotion |
| `sigil-mark/process/filesystem-registry.ts` | Path-based tier lookup |
| `src/components/gold/hooks/useMotion.ts` | Motion physics as code |
| `src/components/gold/utils/colors.ts` | OKLCH colors as code |
| `src/components/gold/utils/spacing.ts` | Spacing scale as code |
| `.sigil/survival-stats.json` | Usage/stability tracking |
| `.sigil/pending-ops.json` | Heavy ops queue for CI |
| `.github/workflows/sigil-ops.yml` | Process pending ops |

### Files to Modify

| File | Changes |
|------|---------|
| `sigil-mark/process/sentinel-validator.ts` | Slot composition support |
| `.claude/hooks/pre-tool-use.yaml` | Filesystem registry |
| `.claude/hooks/scripts/sentinel-validate.sh` | Filesystem registry |
| `packages/eslint-plugin-sigil/src/rules/gold-imports-only.ts` | Allow children |
| `CLAUDE.md` | v7.6 documentation |
| `.claude/agents/sigil-craft.yaml` | Version 7.6.0 |

---

## 6. Implementation Phases

### Sprint 1: Core Architecture (P0-1 to P0-3)
1. Delete nomination-generator.ts, create survival-engine.ts
2. Create linter-gate.ts
3. Delete principles/*.md, create executable hooks/utils

**Exit Criteria**: Survival engine running, principles executable.

### Sprint 2: Composition & Registry (P0-4 to P0-5)
4. Implement slot-based composition
5. Delete registry-parser.ts, create filesystem-registry.ts
6. Auto-generate index files

**Exit Criteria**: No contagion deadlock, filesystem as database.

### Sprint 3: CI/CD & Polish (P0-6, P1, P2)
7. Offload heavy ops to CI
8. Update sentinel and hooks
9. Clean up deleted files, update docs

**Exit Criteria**: No flow interruption, clean codebase.

---

## 7. Success Metrics

| Metric | v7.5 | v7.6 Target | Measurement |
|--------|------|-------------|-------------|
| PRs for promotion | Required | 0 | Count PRs |
| Markdown principles | 4 files | 0 files | File count |
| Registry parsing | Yes | No | Code audit |
| Contagion deadlock | Possible | Impossible | Try slot pattern |
| Linter gate | None | Required | Promotion logs |
| Background ops | In agent | In CI | Timing audit |

---

## 8. The Final Principles

1. **Survival is the vote** — But cleanliness is the gate
2. **Human vetoes, not approves** — Invert the control
3. **Executable, not descriptive** — Hooks > Markdown
4. **Gold frames, Draft content** — Slot-based composition
5. **Filesystem is the registry** — Path IS the API
6. **Offload heavy ops** — Agent writes intent, CI executes
7. **Auto-generate indexes** — No manual registry maintenance
8. **Zero warnings to promote** — Lint gate required
9. **No parsing overhead** — Directory lookup only
10. **Stop asking for permission** — If it survives, it's Gold

---

## 9. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Veto window too short | Promoted bad code | Configurable window (24h default) |
| Linter gate too strict | Nothing promotes | Configurable rules |
| Filesystem race conditions | Incorrect tier | Atomic operations |
| CI queue backlog | Delayed ops | Priority queue |
| Index generation conflicts | Git merge issues | Deterministic ordering |

---

## 10. Out of Scope

- Multi-repo support
- Custom veto workflows
- Alternative linters (only ESLint)
- Non-TypeScript projects

---

*PRD Generated: 2026-01-10*
*Sources: SIGIL_LIVING_CANON_ARCHITECTURE.md*
*Next Step: `/architect` for Software Design Document*

---

# Addendum: Sigil Grimoire Migration (v7.7)

**Date:** 2026-01-11
**Depends on:** v7.6 implementation
**Trigger:** Loa v0.12.0 grimoire restructure

---

## A1. Problem Statement

Following Loa v0.12.0's `grimoires/` restructure, Sigil's design context is now scattered across incompatible locations:

| Current Location | Issue |
|------------------|-------|
| `sigil-mark/` | Mixes public framework with private state |
| `.sigil/` | Runtime state in hidden directory |
| `.sigilrc.yaml` | Config at root (fine) |
| `.claude/skills/sigil-core/` | Skill definition (fine) |

The Loa pattern provides a clean model:
- `grimoires/loa/` - Private project state (gitignored)
- `grimoires/pub/` - Public shareable content (tracked)

Sigil should adopt `grimoires/sigil/` with the same public/private separation.

---

## A2. Goals

1. **Consolidate Sigil context** into `grimoires/sigil/`
2. **Separate public (framework) from private (state)**
3. **Coexist cleanly** with `grimoires/loa/` and `grimoires/pub/`
4. **Enable distribution** - Sigil can be mounted onto other repos

---

## A3. Directory Structure

```
grimoires/
├── sigil/                      # NEW: Sigil grimoire
│   │
│   │── # PUBLIC (tracked in git)
│   ├── constitution/           # Core design laws
│   │   ├── physics.yaml        # Motion, timing, easing
│   │   ├── zones.yaml          # Zone definitions
│   │   ├── lenses.yaml         # Lens configurations
│   │   ├── fidelity.yaml       # From kernel/
│   │   └── laws.md             # The Seven Laws
│   ├── moodboard/              # Visual references
│   │   ├── references/         # Inspiration images
│   │   ├── palettes/           # Color systems
│   │   └── moodboard.md        # Overall feel document
│   ├── vocabulary/             # Term definitions
│   │   └── vocabulary.yaml
│   ├── seeds/                  # Virtual Sanctuary seeds
│   │   ├── linear-like.yaml
│   │   ├── vercel-like.yaml
│   │   └── stripe-like.yaml
│   ├── process/                # Agent-time utilities
│   │   ├── survival-engine.ts
│   │   ├── linter-gate.ts
│   │   ├── filesystem-registry.ts
│   │   └── ...
│   │
│   │── # PRIVATE (gitignored)
│   ├── state/                  # Runtime state
│   │   ├── workshop.json       # Pre-computed index
│   │   ├── survival-stats.json
│   │   ├── pending-ops.json
│   │   ├── survival.json       # Pattern tracking
│   │   └── craft-log/          # Session logs
│   └── archive/                # Historical data
│       ├── eras/               # Era snapshots
│       └── sigil/              # Sprint history (already migrated)
│
├── loa/                        # Loa grimoire (existing)
└── pub/                        # Public documents (existing)
```

---

## A4. Public vs Private Classification

### A4.1 PUBLIC (Tracked in Git)

| Category | Path | Rationale |
|----------|------|-----------|
| Constitution | `grimoires/sigil/constitution/` | Core design laws are the framework |
| Moodboard | `grimoires/sigil/moodboard/` | Visual references are shareable |
| Vocabulary | `grimoires/sigil/vocabulary/` | Term definitions are the framework |
| Seeds | `grimoires/sigil/seeds/` | Starter templates for new projects |
| Process | `grimoires/sigil/process/` | Agent utilities are the framework |

### A4.2 PRIVATE (Gitignored)

| Category | Path | Rationale |
|----------|------|-----------|
| State | `grimoires/sigil/state/` | Per-project runtime data |
| Workshop | `grimoires/sigil/state/workshop.json` | Generated index, project-specific |
| Survival | `grimoires/sigil/state/survival-stats.json` | Project usage tracking |
| Craft Logs | `grimoires/sigil/state/craft-log/` | Session-specific logs |
| Archive | `grimoires/sigil/archive/` | Historical project data |

---

## A5. Migration Mapping

### A5.1 From sigil-mark/ to grimoires/sigil/

| Source | Destination | Notes |
|--------|-------------|-------|
| `sigil-mark/constitution/` | `grimoires/sigil/constitution/` | Direct move |
| `sigil-mark/moodboard/` | `grimoires/sigil/moodboard/` | Direct move |
| `sigil-mark/vocabulary/` | `grimoires/sigil/vocabulary/` | Direct move |
| `sigil-mark/kernel/` | `grimoires/sigil/constitution/` | Merge into constitution |
| `sigil-mark/process/` | `grimoires/sigil/process/` | Direct move |
| `sigil-mark/lenses/` | `src/sigil/lenses/` | Runtime code to src |
| `sigil-mark/hooks/` | `src/sigil/hooks/` | Runtime code to src |
| `sigil-mark/layouts/` | `src/sigil/layouts/` | Runtime code to src |
| `sigil-mark/providers/` | `src/sigil/providers/` | Runtime code to src |
| `sigil-mark/core/` | `src/sigil/core/` | Runtime code to src |
| `sigil-mark/types/` | `src/sigil/types/` | Runtime code to src |
| `sigil-mark/index.ts` | `src/sigil/index.ts` | Package entry |
| `sigil-mark/__tests__/` | `src/sigil/__tests__/` | With runtime code |
| `sigil-mark/__examples__/` | `grimoires/sigil/examples/` | Public examples |

### A5.2 From .sigil/ to grimoires/sigil/state/

| Source | Destination |
|--------|-------------|
| `.sigil/workshop.json` | `grimoires/sigil/state/workshop.json` |
| `.sigil/survival-stats.json` | `grimoires/sigil/state/survival-stats.json` |
| `.sigil/pending-ops.json` | `grimoires/sigil/state/pending-ops.json` |
| `.sigil/survival.json` | `grimoires/sigil/state/survival.json` |
| `.sigil/craft-log/` | `grimoires/sigil/state/craft-log/` |
| `.sigil/eras/` | `grimoires/sigil/archive/eras/` |
| `.sigil/seed.yaml` | `grimoires/sigil/state/seed.yaml` |

### A5.3 Stays in Place

| Location | Reason |
|----------|--------|
| `.sigilrc.yaml` | Root project config (like `.loa.config.yaml`) |
| `src/**/.sigilrc.yaml` | Zone-specific overrides, collocated with code |
| `.claude/skills/sigil-core/` | Skill definition, Loa pattern |
| `.claude/commands/` | Sigil commands, Loa pattern |

---

## A6. Runtime Code Separation

The key insight: **grimoires hold design context, src holds runtime code**.

### A6.1 Design Context (grimoires/sigil/)

Files read by agents at design-time:
- Physics constants
- Zone definitions
- Moodboard references
- Vocabulary terms

### A6.2 Runtime Code (src/sigil/)

Files imported by application at runtime:
- React hooks (`useMotion`, `useSigilMutation`)
- Layout components (`CriticalZone`, `GlassLayout`)
- Lens implementations (`DefaultLens`, `StrictLens`)
- Provider components (`SigilProvider`)

### A6.3 Package Structure

```typescript
// src/sigil/index.ts - Main entry point
export * from './hooks';
export * from './layouts';
export * from './providers';
export * from './lenses';
export * from './core';
export type * from './types';
```

---

## A7. Gitignore Updates

Add to `.gitignore`:

```gitignore
# Sigil grimoire state (private, per-project)
grimoires/sigil/state/*
!grimoires/sigil/state/README.md
grimoires/sigil/archive/*
!grimoires/sigil/archive/README.md
```

---

## A8. Skill Updates

Update `.claude/skills/sigil-core/SKILL.md`:

```diff
- Read design context from sigil-mark/
+ Read design context from grimoires/sigil/
+ Fall back to sigil-mark/ during transition (deprecated)
```

Update paths in `index.yaml`:

```yaml
context_files:
  - grimoires/sigil/constitution/physics.yaml
  - grimoires/sigil/constitution/zones.yaml
  - grimoires/sigil/moodboard/moodboard.md
  - grimoires/sigil/vocabulary/vocabulary.yaml
```

---

## A9. Backwards Compatibility

### Phase 1: Dual Support
- Both paths work during transition
- Deprecation warnings when legacy paths used
- `sigil-mark/` becomes symlink to `grimoires/sigil/`

### Phase 2: Legacy Removal (v8.0)
- Remove symlink
- Remove legacy path support
- Clean migration completed

---

## A10. Implementation Plan

### Sprint 1: Directory Structure
1. Create `grimoires/sigil/` directory structure
2. Update `.gitignore` for private state
3. Create README files for each directory

### Sprint 2: Public Migration
4. Move constitution files
5. Move moodboard files
6. Move vocabulary files
7. Move process files
8. Move seeds

### Sprint 3: Runtime Code Migration
9. Create `src/sigil/` directory
10. Move hooks, layouts, providers, lenses, core
11. Update package.json exports
12. Update import paths throughout codebase

### Sprint 4: State Migration
13. Move .sigil/* to grimoires/sigil/state/
14. Update skill to read from new locations
15. Add symlink for backwards compatibility
16. Remove .sigil/ directory

---

## A11. Open Questions

### Q1: Runtime Code Package?

Should `src/sigil/` be a separate package?

**Option A: Directory with Path Aliases (Recommended)**
```json
{
  "paths": {
    "@sigil/*": ["src/sigil/*"]
  }
}
```
- Simpler, no package management
- Works with existing monorepo setup

**Option B: Workspace Package**
```
packages/sigil-core/
├── package.json
└── src/
```
- Better for external distribution
- More complex setup

**Recommendation**: Start with Option A, migrate to Option B if external distribution needed.

### Q2: sigil-workbench and sigil-hud?

Current packages:
- `packages/sigil-hud/` - Debug overlay
- `sigil-workbench/` - Development playground

**Recommendation**: Keep as separate packages, read from `grimoires/sigil/` for context.

### Q3: Zone Configs Location?

Current: `src/**/.sigilrc.yaml` (zone-specific overrides)

**Options:**
- A: Keep collocated with code (current)
- B: Consolidate to `grimoires/sigil/zones/`

**Recommendation**: Option A - Keep collocated. Zone overrides are part of the application code, not the framework.

---

## A12. Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Sigil context locations | 4 (sigil-mark, .sigil, skills, configs) | 2 (grimoires/sigil, src/sigil) |
| Clear public/private separation | No | Yes |
| Agent context discovery | Multiple paths | Single grimoire path |
| Framework distributable | No | Yes (mount grimoires/sigil) |

---

*Addendum Generated: 2026-01-11*
*Sources: Loa v0.12.0 release notes, filesystem analysis*

---

# Sigil v9.0 "Core Scaffold" PRD

**Version:** 9.0.0
**Codename:** Core Scaffold
**Status:** PRD Draft
**Date:** 2026-01-11
**Supersedes:** v7.6-7.7 addendums (scope reduction, depth focus)
**Source:** sigil-v9-package/PHASE_1_SCAFFOLD.md
**Reference:** [SIGIL_CURRENT_STATE.md](context/SIGIL_CURRENT_STATE.md)

---

## 1. Executive Summary

v9.0 is a **migration and consolidation**, not a rebuild. Sigil v7.7 is already substantially complete:
- **2,650 lines** runtime code (core, layouts, lenses, providers)
- **22,137 lines** process layer (39 agent-time modules)
- **548 lines** executable principles (useMotion, colors, spacing)
- **47 Claude skills** for design workflows

**The Core Insight:**
> "Using Sigil IS the experience. Everything else is invisible."

v9.0 **migrates and focuses** existing code to deliver ONE thing well: **`/craft` working with physics and Gold patterns.**

**What exists:** Physics, skills, process modules, configuration
**What v9.0 does:** Migrate to grimoire structure, consolidate skills, ensure clean `/craft` flow

---

## 2. Philosophy

### 2.1 The Inviolable Constraint

Every feature must pass this test:

> "Does this require the designer to DO, ANSWER, CONFIGURE, or MAINTAIN anything?"
>
> **If yes → Cut it or make it invisible**
> **If no → It can stay**

### 2.2 What Gets Cut (vs v7.6)

| Feature | Why It's Cut |
|---------|--------------|
| Survival Engine | Phase 2 - needs usage patterns first |
| Linter Gate | Phase 2 - tied to survival engine |
| Context Accumulation | Phase 2 - manual defaults work initially |
| Diagnostician | Phase 2 - needs observability |
| Gardener | Phase 2 - needs survival engine |
| Vercel Drains | Phase 2 - observability focus |
| Chrome DevTools MCP | Phase 2 - observability focus |
| Grimoire Migration | Phase 2 - structure follows usage |

### 2.3 What Survives

| Feature | Why It Survives |
|---------|-----------------|
| `/craft` command | The interface — just use it |
| Physics system | Core constraint — type dictates feel |
| Gold/Draft registry | Component organization — path IS tier |
| Mason skill | Generation — produces code |
| CLAUDE.md prompt | Agent instruction — invisible to designer |

---

## 3. Scope: Phase 1 Migration

### 3.1 What Already Exists (DO NOT REBUILD)

| Component | Location | Status |
|-----------|----------|--------|
| `useMotion` hook | `src/components/gold/hooks/useMotion.ts` | ✅ 229 lines, working |
| `colors` utility | `src/components/gold/utils/colors.ts` | ✅ 280 lines, OKLCH |
| `spacing` utility | `src/components/gold/utils/spacing.ts` | ✅ 248 lines, 4px scale |
| Gold/Draft registry | `src/components/gold/`, `src/components/draft/` | ✅ Structure exists |
| Tier lookup | `sigil-mark/process/filesystem-registry.ts` | ✅ 150 lines |
| Physics validation | `sigil-mark/process/physics-validator.ts` | ✅ 700 lines |
| 47 Claude skills | `.claude/skills/` | ✅ Defined |
| Kernel configs | `sigil-mark/kernel/` | ✅ Complete |
| Zone config | `.sigilrc.yaml` | ✅ v4.1.0 |

### 3.2 Phase 1 IS (Migration Tasks)

1. **Migrate to Grimoire** — Move kernel, moodboard, process to `grimoires/sigil/`
2. **Consolidate Skills** — Focus on `crafting-components` for `/craft`
3. **Update Paths** — New path aliases for grimoire structure
4. **Verify /craft Flow** — Ensure physics → zone → generation works

### 3.3 Phase 1 IS NOT

| Deferred Feature | Why Deferred | Exists Already? |
|------------------|--------------|-----------------|
| Context accumulation | Phase 2 focus | Infrastructure exists |
| Survival engine activation | Phase 2 focus | Code exists (dormant) |
| Diagnostician | Phase 2 observability | Not built |
| Gardener | Phase 2 after survival | Not built |
| Full 47-skill support | Focus on /craft first | All defined |

---

## 4. Requirements

### 4.1 P0: Grimoire Migration

**Migrate kernel to grimoire:**
```
sigil-mark/kernel/          →  grimoires/sigil/constitution/
├── constitution.yaml           ├── constitution.yaml
├── physics.yaml                ├── physics.yaml
├── vocabulary.yaml             ├── vocabulary.yaml
├── workflow.yaml               ├── workflow.yaml
└── fidelity.yaml               └── fidelity.yaml
```

**Migrate moodboard:**
```
sigil-mark/moodboard/       →  grimoires/sigil/moodboard/
```

**Migrate process layer:**
```
sigil-mark/process/         →  grimoires/sigil/process/
(39 modules, ~22K lines)
```

**Migrate runtime state:**
```
.sigil/                     →  grimoires/sigil/state/
├── survival-stats.json         ├── survival-stats.json
├── pending-ops.json            ├── pending-ops.json
└── (generated files)           └── (generated files)
```

### 4.2 P0: Physics System (ALREADY EXISTS)

**Existing:** `src/components/gold/hooks/useMotion.ts` (229 lines)

**Physics Types (already implemented):**

| Physics | Duration | Easing | Use Case |
|---------|----------|--------|----------|
| `server-tick` | 600ms | `ease-out` | Critical: deposits, claims, stakes |
| `deliberate` | 800ms | `ease-out` | Important: confirmations, settings |
| `snappy` | 150ms | `ease-out` | Casual: navigation, tooltips |
| `smooth` | 300ms | `ease-in-out` | Standard transitions |
| `instant` | 0ms | `linear` | No transition |

**Zone Mapping:**

| Zone | Physics | Examples |
|------|---------|----------|
| critical | server-tick | Deposit, Withdraw, Claim, Stake |
| important | deliberate | Settings, Profile, Preferences |
| casual | snappy | Navigation, Info, Tooltips |

**Implementation:**

```typescript
// src/lib/sigil/physics.ts
import { CSSProperties } from 'react';

export type PhysicsName = 'server-tick' | 'deliberate' | 'snappy' | 'smooth';
export type ZoneName = 'critical' | 'important' | 'casual';

const PHYSICS: Record<PhysicsName, { duration: number; easing: string }> = {
  'server-tick': { duration: 600, easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)' },
  'deliberate': { duration: 800, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
  'snappy': { duration: 150, easing: 'cubic-bezier(0.4, 0, 1, 1)' },
  'smooth': { duration: 300, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
} as const;

const ZONE_PHYSICS: Record<ZoneName, PhysicsName> = {
  'critical': 'server-tick',
  'important': 'deliberate',
  'casual': 'snappy',
} as const;

export interface MotionStyle extends CSSProperties {
  '--sigil-duration': string;
  '--sigil-easing': string;
}

export function useMotion(physics: PhysicsName): MotionStyle {
  const config = PHYSICS[physics];
  return {
    transition: `all ${config.duration}ms ${config.easing}`,
    '--sigil-duration': `${config.duration}ms`,
    '--sigil-easing': config.easing,
  };
}

export function useZoneMotion(zone: ZoneName): MotionStyle {
  return useMotion(ZONE_PHYSICS[zone]);
}

export function getPhysics(physics: PhysicsName) {
  return PHYSICS[physics];
}
```

**Action Required:** Verify existing implementation works with grimoire structure.

**Acceptance Criteria:**
- [ ] Existing `useMotion` hook works (already at `src/components/gold/hooks/useMotion.ts`)
- [ ] Physics types match constitution (compare with `grimoires/sigil/constitution/physics.yaml`)
- [ ] CLAUDE.md references correct import path

---

### 4.3 P0: Component Registry (ALREADY EXISTS)

**Existing structure:**
```
src/components/
├── gold/                    # ✅ EXISTS with 3 utilities
│   ├── hooks/
│   │   ├── useMotion.ts     # 229 lines
│   │   └── index.ts
│   ├── utils/
│   │   ├── colors.ts        # 280 lines
│   │   ├── spacing.ts       # 248 lines
│   │   └── index.ts
│   └── index.ts
├── silver/                  # ✅ EXISTS (empty, reserved)
└── draft/                   # ✅ EXISTS (empty, reserved)
```

**Tier lookup exists:** `sigil-mark/process/filesystem-registry.ts` (150 lines)

**Action Required:** Migrate `filesystem-registry.ts` to `grimoires/sigil/process/`

**Acceptance Criteria:**
- [ ] Existing Gold tier exports work
- [ ] Tier lookup works from new grimoire path
- [ ] No changes needed to existing component code

---

### 4.4 P0: Skill Consolidation (SKILLS ALREADY EXIST)

**Existing skills:** 47 in `.claude/skills/`

Key Sigil skills already defined:
- `crafting-components/` - Component generation ✅
- `crafting-guidance/` - Design guidance ✅
- `validating-physics/` - Physics validation ✅
- `sigil-core/` - Core functionality ✅

**Action Required:**
1. Update `crafting-components` skill to use grimoire paths
2. Ensure skill reads from `grimoires/sigil/constitution/physics.yaml`
3. Update CLAUDE.md to focus on `/craft` command

**Physics Selection Rules (already in skills):**

```
Financial action (deposit, claim, stake) → server-tick (600ms)
Settings/config → deliberate (800ms)
Navigation/info → snappy (150ms)
```

**Generation Template:**

```tsx
import { useMotion } from '@/hooks/useMotion';

export function ClaimButton({ amount, onClaim }) {
  const motion = useMotion('server-tick');

  return (
    <button
      onClick={onClaim}
      style={motion}
      className="bg-primary text-white px-6 py-3 rounded-lg"
    >
      Collect Your Earnings
      <span className="text-sm opacity-80 block">
        ${amount} ready to withdraw
      </span>
    </button>
  );
}
```

**Skill File:**

```markdown
# Mason Skill

> Generation skill. Produces UI + copy with correct physics.

## Trigger

- `/craft` command
- Intent to build/create UI

## Physics Reference

| Physics | Duration | Use Case |
|---------|----------|----------|
| server-tick | 600ms | Critical: deposits, claims, stakes |
| deliberate | 800ms | Important: confirmations, settings |
| snappy | 150ms | Casual: navigation, tooltips |
| smooth | 300ms | Standard transitions |

## Generation Rules

1. **Always use physics hooks**
   ```tsx
   import { useMotion } from '@/hooks/useMotion';
   const motion = useMotion('server-tick');
   ```

2. **Check Gold registry first**
   ```tsx
   import { Button } from '@/components/gold';
   ```

3. **Match physics to action type**
   - Financial action → server-tick
   - Settings/config → deliberate
   - Navigation/info → snappy
```

**Acceptance Criteria:**
- [ ] `.sigil/skills/mason/SKILL.md` exists
- [ ] Physics reference table complete
- [ ] Generation rules documented
- [ ] Example output shows correct patterns

---

### 4.4 P0: CLAUDE.md Integration

**Update:** Project `CLAUDE.md` with `/craft` instructions

**Key Sections:**

```markdown
## /craft Command

When designer uses `/craft` or asks to build UI:

1. **Use physics hooks** (never raw transitions)
   ```tsx
   import { useMotion } from '@/hooks/useMotion';
   const motion = useMotion('server-tick');
   ```

2. **Check Gold components first**
   ```tsx
   import { ComponentName } from '@/components/gold';
   ```

3. **Match physics to zone**
   | Zone | Physics | Actions |
   |------|---------|---------|
   | critical | server-tick | deposit, withdraw, claim, stake |
   | important | deliberate | settings, profile |
   | casual | snappy | navigation, tooltips |

## Rules

1. Never ask designer to configure anything
2. Never ask which physics to use (infer from context)
3. Always use hooks, never raw CSS transitions
4. Check Gold registry before creating new components
```

**Acceptance Criteria:**
- [ ] CLAUDE.md updated with /craft section
- [ ] Physics reference included
- [ ] Zone mapping documented
- [ ] Rules section enforces invisible operation

---

## 5. File Changes Summary

### Files to Migrate

| From | To | Size |
|------|----|------|
| `sigil-mark/kernel/*` | `grimoires/sigil/constitution/` | 5 YAML files |
| `sigil-mark/moodboard/*` | `grimoires/sigil/moodboard/` | ~10 files |
| `sigil-mark/process/*` | `grimoires/sigil/process/` | 39 modules, ~22K lines |
| `.sigil/*` | `grimoires/sigil/state/` | 2+ JSON files |

### Files to Update

| File | Changes |
|------|---------|
| `.claude/skills/crafting-components/index.yaml` | Update context paths to grimoire |
| `CLAUDE.md` | Focus on /craft, update imports |
| `tsconfig.json` | Add grimoire path aliases |
| `.gitignore` | Add `grimoires/sigil/state/*` |

### Directories to Create

| Directory | Purpose |
|-----------|---------|
| `grimoires/sigil/` | Sigil grimoire root |
| `grimoires/sigil/constitution/` | Design laws (from kernel) |
| `grimoires/sigil/moodboard/` | Visual references |
| `grimoires/sigil/process/` | Agent-time modules |
| `grimoires/sigil/state/` | Runtime state (gitignored) |

### Files Already Exist (No Changes)

| File | Status |
|------|--------|
| `src/components/gold/hooks/useMotion.ts` | ✅ Keep as-is |
| `src/components/gold/utils/colors.ts` | ✅ Keep as-is |
| `src/components/gold/utils/spacing.ts` | ✅ Keep as-is |
| `src/components/gold/index.ts` | ✅ Keep as-is |
| `src/components/draft/index.ts` | ✅ Keep as-is |

---

## 6. Implementation Checklist

### Day 1: Grimoire Structure

- [ ] Create grimoire directories
  - [ ] `grimoires/sigil/constitution/`
  - [ ] `grimoires/sigil/moodboard/`
  - [ ] `grimoires/sigil/process/`
  - [ ] `grimoires/sigil/state/`

- [ ] Migrate kernel configs
  - [ ] `sigil-mark/kernel/constitution.yaml` → `grimoires/sigil/constitution/`
  - [ ] `sigil-mark/kernel/physics.yaml` → `grimoires/sigil/constitution/`
  - [ ] `sigil-mark/kernel/vocabulary.yaml` → `grimoires/sigil/constitution/`
  - [ ] `sigil-mark/kernel/workflow.yaml` → `grimoires/sigil/constitution/`
  - [ ] `sigil-mark/kernel/fidelity.yaml` → `grimoires/sigil/constitution/`

- [ ] Migrate moodboard
  - [ ] `sigil-mark/moodboard/*` → `grimoires/sigil/moodboard/`

### Day 2: Process Migration + Skills

- [ ] Migrate process layer
  - [ ] `sigil-mark/process/*` → `grimoires/sigil/process/` (39 modules)

- [ ] Migrate runtime state
  - [ ] `.sigil/*` → `grimoires/sigil/state/`

- [ ] Update skill paths
  - [ ] `.claude/skills/crafting-components/index.yaml` → grimoire paths
  - [ ] Verify skill reads constitution from new location

- [ ] Update .gitignore
  - [ ] Add `grimoires/sigil/state/*`
  - [ ] Keep `!grimoires/sigil/state/README.md`

### Day 3: Integration + Verification

- [ ] Update tsconfig.json
  - [ ] Add `@sigil-context/*` for grimoire paths

- [ ] Update CLAUDE.md
  - [ ] Focus on /craft command
  - [ ] Reference grimoire constitution

- [ ] Verify existing components work
  - [ ] `src/components/gold/hooks/useMotion.ts` still works
  - [ ] `src/components/gold/utils/*` still work
  - [ ] Import paths unchanged

- [ ] Test /craft
  - [ ] `/craft "deposit button for critical action"`
  - [ ] Verify uses `useMotion('server-tick')`
  - [ ] Verify reads physics from grimoire

---

## 7. Success Criteria

### Migration Success

| Check | Status |
|-------|--------|
| `grimoires/sigil/constitution/` has 5 YAML files | |
| `grimoires/sigil/moodboard/` has reference files | |
| `grimoires/sigil/process/` has 39 modules | |
| `grimoires/sigil/state/` is gitignored | |
| `sigil-mark/kernel/` is empty or symlinked | |
| `.sigil/` is empty or symlinked | |

### Functional (Existing Features Still Work)

| Test | Expected |
|------|----------|
| `/craft "deposit button"` | Uses server-tick physics |
| `/craft "tooltip on hover"` | Uses snappy physics |
| `/craft "settings panel"` | Uses deliberate physics |
| Agent checks Gold first | Yes, before generating new |
| Agent uses hooks not raw CSS | Yes, always useMotion |
| Existing `useMotion` import works | Yes, no changes needed |

### Structural (Existing + New)

| Check | Status |
|-------|--------|
| `src/components/gold/hooks/useMotion.ts` exists | ✅ Already exists |
| `src/components/gold/utils/*` exist | ✅ Already exists |
| `grimoires/sigil/constitution/physics.yaml` exists | |
| Skills read from grimoire paths | |
| CLAUDE.md has /craft section | |

---

## 8. What Comes After (NOT in v9.0)

| Phase | Feature | Trigger |
|-------|---------|---------|
| Phase 2 | Observability | After Phase 1 stable |
| Phase 2 | Diagnostician | With observability |
| Phase 2 | Context accumulation | After usage patterns emerge |
| Phase 2 | Survival engine | After context accumulation |
| Phase 2 | Gardener | After survival engine |
| Phase 2 | Grimoire migration | After structure settles |

**Rule:** Do not implement Phase 2 features until Phase 1 is working well.

---

## 9. Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Scope creep | PRD explicitly lists what's NOT included |
| Feature requests | Point to Phase 2 list |
| Premature optimization | "Manual promotion is fine initially" |
| Over-engineering | "Use defaults, designer corrects naturally" |

---

## 10. Version Promise

```
Designer uses /craft.
Designer ships.
That's it.

Everything else — taste, persona, project knowledge, diagnostics,
observability, governance — happens BEHIND THE SCENES.

The designer never sees the architecture.
The designer never maintains the system.
The designer never leaves flow state.

Using Sigil IS the experience.
There is no other experience.
```

---

*PRD Generated: 2026-01-11*
*Source: sigil-v9-package/PHASE_1_SCAFFOLD.md*
*Reference: [SIGIL_CURRENT_STATE.md](context/SIGIL_CURRENT_STATE.md)*
*Key Insight: v9.0 is MIGRATION, not rebuild. Existing code: 25K+ lines.*
*Philosophy: Depth over breadth. Migrate and focus on /craft.*
