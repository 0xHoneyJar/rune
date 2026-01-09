# Software Design Document: Sigil v6.1 "Agile Muse"

> *"Code is precedent. Survival is curated. Flow is sacred."*

**Version:** 6.1.0
**Codename:** Agile Muse
**Status:** SDD Complete
**Date:** 2026-01-09
**Supersedes:** SDD v6.0.0 "Native Muse"
**Based On:** PRD v6.1.0

---

## 1. Executive Summary

This SDD details the technical architecture for implementing 13 requirements across P0, P1, and P2 priorities to evolve Sigil from v6.0 "Native Muse" to v6.1 "Agile Muse".

**Key Architectural Changes:**
1. **Hook Bridge Layer** — Bash scripts bridging Claude Code hooks to TypeScript modules
2. **Verified Query System** — Filesystem verification on cache reads
3. **Curated Survival Pipeline** — Taste-key approval gate before canonical promotion
4. **Optimistic Divergence Engine** — Tag-not-block approach for taste violations
5. **Merge-Driven Gardening** — GitHub Actions for immediate pattern updates

**Technology Stack:**
- Runtime: Node.js 20+ (LTS)
- Language: TypeScript 5.x (strict mode)
- Testing: Vitest + @testing-library
- CI: GitHub Actions
- Package Manager: npm

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         Claude Code CLI                                  │
│                                                                          │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                  │
│  │ PreToolUse  │    │ PostToolUse │    │    Stop     │                  │
│  │    Hook     │    │    Hook     │    │    Hook     │                  │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘                  │
│         │                  │                   │                         │
└─────────┼──────────────────┼───────────────────┼─────────────────────────┘
          │                  │                   │
          ▼                  ▼                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      Hook Bridge Layer (NEW)                             │
│                                                                          │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                  │
│  │ validate.sh │    │ observe.sh  │    │ensure-log.sh│                  │
│  │   (P0-1.1)  │    │   (P0-1.2)  │    │   (P0-1.3)  │                  │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘                  │
│         │                  │                   │                         │
│         │    npx tsx       │    npx tsx        │    npx tsx              │
│         ▼                  ▼                   ▼                         │
└─────────────────────────────────────────────────────────────────────────┘
          │                  │                   │
          ▼                  ▼                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      Process Layer (TypeScript)                          │
│                                                                          │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────┐   │
│  │ physics-validator│  │survival-observer │  │chronicling-rationale │   │
│  │     + Optimistic │  │    + Taste-Key   │  │                      │   │
│  │     Divergence   │  │    Curation      │  │                      │   │
│  │     (P2-1)       │  │    (P1-2)        │  │                      │   │
│  └────────┬─────────┘  └────────┬─────────┘  └──────────┬───────────┘   │
│           │                     │                        │               │
│           ▼                     ▼                        ▼               │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                    Verified Query System (P0-3)                   │   │
│  │                                                                    │   │
│  │   workshop-query.ts → queryComponentVerified() → fs.stat()        │   │
│  │                                                                    │   │
│  └────────────────────────────────┬─────────────────────────────────┘   │
│                                   │                                      │
│                                   ▼                                      │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                    Workshop Index (.sigil/workshop.json)          │   │
│  │                                                                    │   │
│  │   startup-sentinel.ts → buildWorkshop() (P0-4)                    │   │
│  │                                                                    │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────┐   │
│  │ vocabulary-reader│  │   seed-manager   │  │   agent-orchestration│   │
│  │    (Integrated)  │  │ + Hard Eviction  │  │  + Vocab Integration │   │
│  │     (P1-1)       │  │     (P1-3)       │  │       (P1-1)         │   │
│  └──────────────────┘  └──────────────────┘  └──────────────────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      Persistence Layer                                   │
│                                                                          │
│  .sigil/                                                                 │
│  ├── workshop.json      # Pre-computed index (+ hash, indexed_at)       │
│  ├── survival.json      # Pattern tracking (+ canonical-candidate)      │
│  ├── taste-key.yaml     # Curation config (NEW - P1-2)                  │
│  ├── seed.yaml          # Virtual Sanctuary                             │
│  ├── craft-log/         # Session logs                                  │
│  └── eras/              # Archived eras                                 │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      CI/CD Layer (P2-2)                                  │
│                                                                          │
│  .github/workflows/sigil-gardener.yaml                                  │
│  ├── Trigger: push to main, merged PRs                                  │
│  ├── Action: npx tsx garden-command.ts                                  │
│  └── Commit: survival.json [skip ci]                                    │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Component Interaction Diagram

```
                              /craft "trustworthy claim button"
                                           │
                                           ▼
                              ┌────────────────────────┐
                              │  agent-orchestration   │
                              │    runCraftFlow()      │
                              └───────────┬────────────┘
                                          │
            ┌─────────────────────────────┼─────────────────────────────┐
            │                             │                             │
            ▼                             ▼                             ▼
    ┌───────────────┐           ┌───────────────┐             ┌───────────────┐
    │    Phase 1    │           │    Phase 3    │             │    Phase 4    │
    │    Startup    │           │    Context    │             │  Validation   │
    │               │           │               │             │               │
    │ runSentinel() │           │ vocabulary-   │             │ PreToolUse    │
    │      │        │           │ reader        │             │ Hook fires    │
    │      ▼        │           │ integration   │             │      │        │
    │ Workshop      │           │ (P1-1)        │             │      ▼        │
    │ rebuild if    │           │               │             │ validate.sh   │
    │ stale (P0-4)  │           │ loadVocab()   │             │      │        │
    └───────────────┘           │ getTermFeel() │             │      ▼        │
                                │ getRecommend- │             │ physics-      │
                                │ edPhysics()   │             │ validator.ts  │
                                └───────────────┘             │      │        │
                                                              │      ▼        │
                                                              │ Optimistic    │
                                                              │ Divergence    │
                                                              │ (P2-1)        │
                                                              └───────────────┘
                                                                     │
                    ┌────────────────────────────────────────────────┘
                    │
                    ▼
    ┌───────────────────────────────────────────────────────────────────────┐
    │                           Pattern Selection                           │
    │                                                                       │
    │   queryComponentVerified() ─────────────────────────────────────────┐ │
    │          │                                                          │ │
    │          ▼                                                          │ │
    │   ┌─────────────────┐                                               │ │
    │   │ Workshop Lookup │ ──────────────────────────────────────────┐   │ │
    │   │    (<5ms)       │                                           │   │ │
    │   └────────┬────────┘                                           │   │ │
    │            │                                                    │   │ │
    │            ▼                                                    ▼   │ │
    │   ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐ │ │
    │   │  fs.stat()      │ →  │ mtime check     │ →  │ Re-index if     │ │ │
    │   │  Verify-on-Read │    │ or hash compare │    │ changed (P0-3)  │ │ │
    │   │    (+1ms)       │    │                 │    │                 │ │ │
    │   └─────────────────┘    └─────────────────┘    └─────────────────┘ │ │
    │                                                                     │ │
    └─────────────────────────────────────────────────────────────────────┘ │
                                                                            │
                    ┌───────────────────────────────────────────────────────┘
                    │
                    ▼
            ┌───────────────┐
            │    Phase 5    │
            │  Generation   │
            │               │
            │  Code written │
            │  with physics │
            │  + patterns   │
            └───────┬───────┘
                    │
                    ▼
    ┌───────────────────────────────────────────────────────────────────────┐
    │                          PostToolUse Hook                             │
    │                                                                       │
    │   observe.sh ─────────────────────────────────────────────────────┐   │
    │        │                                                          │   │
    │        ▼                                                          │   │
    │   survival-observer.ts                                            │   │
    │        │                                                          │   │
    │        ├──→ detectPatterns()                                      │   │
    │        │                                                          │   │
    │        ├──→ updatePattern() (increment occurrences)               │   │
    │        │                                                          │   │
    │        └──→ determineStatusWithCuration() (P1-2)                  │   │
    │                    │                                              │   │
    │                    ├──→ 1-2 occurrences: "experimental"           │   │
    │                    ├──→ 3-4 occurrences: "surviving"              │   │
    │                    └──→ 5+  occurrences: "canonical-candidate"    │   │
    │                              (NOT auto-canonical!)                │   │
    │                                                                   │   │
    └───────────────────────────────────────────────────────────────────┘   │
                                                                            │
                    ┌───────────────────────────────────────────────────────┘
                    │
                    ▼
            ┌───────────────┐
            │    Phase 7    │
            │  Chronicling  │
            │               │
            │ Stop Hook     │
            │ ensure-log.sh │
            │      │        │
            │      ▼        │
            │ writeCraftLog │
            └───────────────┘
```

---

## 3. Component Design

### 3.1 P0-1: Hook Bridge Layer

#### 3.1.1 validate.sh

**Location:** `.claude/skills/validating-physics/scripts/validate.sh`

**Purpose:** Bridge Claude Code PreToolUse hook to physics-validator.ts

**Interface:**
```bash
#!/bin/bash
# Input: $1 = code content (from hook)
#        $2 = file path (optional)
# Output: JSON to stdout
# Exit: 0 = valid, 1 = invalid (blocks write)

set -euo pipefail

CODE="${1:-}"
FILE_PATH="${2:-}"

# Invoke TypeScript validator
npx tsx --eval "
import { validateForHook } from './sigil-mark/process/physics-validator.js';

const code = process.argv[1];
const filePath = process.argv[2] || '';

const result = validateForHook(code, filePath);
console.log(JSON.stringify(result));
process.exit(result.valid ? 0 : 1);
" "$CODE" "$FILE_PATH"
```

**TypeScript Addition (physics-validator.ts):**
```typescript
export interface HookValidationResult {
  valid: boolean;
  violations: Violation[];
  divergent: boolean;
  divergentTag?: string;
  suggestion?: string;
}

export function validateForHook(
  code: string,
  filePath: string,
  workshopPath: string = '.sigil/workshop.json'
): HookValidationResult {
  // Load workshop for API validation
  const workshop = loadWorkshopSafe(workshopPath);

  // Run optimistic validation (P2-1)
  const result = validatePhysicsOptimistic(code, { workshop });

  return {
    valid: result.allow,
    violations: result.violations || [],
    divergent: result.divergent || false,
    divergentTag: result.tag,
    suggestion: result.suggestion,
  };
}
```

#### 3.1.2 observe.sh

**Location:** `.claude/skills/observing-survival/scripts/observe.sh`

**Purpose:** Bridge Claude Code PostToolUse hook to survival-observer.ts

**Interface:**
```bash
#!/bin/bash
# Input: $1 = file path
#        $2 = code content
# Output: JSON to stdout (patterns observed)
# Exit: Always 0 (non-blocking)

set -euo pipefail

FILE_PATH="${1:-}"
CODE="${2:-}"

npx tsx --eval "
import { observeForHook } from './sigil-mark/process/survival-observer.js';

const filePath = process.argv[1];
const code = process.argv[2];

const result = observeForHook(filePath, code);
console.log(JSON.stringify(result));
" "$FILE_PATH" "$CODE"

exit 0  # Never block
```

**TypeScript Addition (survival-observer.ts):**
```typescript
export interface HookObservationResult {
  patternsDetected: string[];
  patternsUpdated: string[];
  newPatterns: string[];
  candidatesCreated: string[];  // NEW: patterns at 5+ that need taste-key
}

export function observeForHook(
  filePath: string,
  code: string,
  projectRoot: string = process.cwd()
): HookObservationResult {
  const detected = detectPatterns(code);
  const updated: string[] = [];
  const newPatterns: string[] = [];
  const candidatesCreated: string[] = [];

  const survival = loadSurvivalIndex(projectRoot);

  for (const pattern of detected) {
    const entry = survival.patterns[pattern];

    if (!entry) {
      // New pattern
      survival.patterns[pattern] = {
        status: 'experimental',
        first_seen: new Date().toISOString().split('T')[0],
        occurrences: 1,
        files: [filePath],
      };
      newPatterns.push(pattern);
    } else {
      // Existing pattern
      entry.occurrences++;
      if (!entry.files.includes(filePath)) {
        entry.files.push(filePath);
      }

      // Curated promotion (P1-2)
      const newStatus = determineStatusWithCuration(entry.occurrences);
      if (newStatus !== entry.status) {
        if (newStatus === 'canonical-candidate') {
          candidatesCreated.push(pattern);
        }
        entry.status = newStatus;
      }
      updated.push(pattern);
    }
  }

  saveSurvivalIndex(projectRoot, survival);

  return {
    patternsDetected: detected,
    patternsUpdated: updated,
    newPatterns,
    candidatesCreated,
  };
}
```

#### 3.1.3 ensure-log.sh

**Location:** `.claude/skills/chronicling-rationale/scripts/ensure-log.sh`

**Purpose:** Bridge Claude Code Stop hook to chronicling-rationale.ts

**Interface:**
```bash
#!/bin/bash
# Input: Environment variables from Claude Code session
# Output: Path to generated log
# Exit: Always 0 (non-blocking)

set -euo pipefail

npx tsx --eval "
import { ensureSessionLog } from './sigil-mark/process/chronicling-rationale.js';

const result = ensureSessionLog(process.cwd());
console.log(JSON.stringify(result));
"

exit 0  # Never block
```

**TypeScript Addition (chronicling-rationale.ts):**
```typescript
export interface SessionLogResult {
  logPath: string | null;
  written: boolean;
  reason?: string;
}

export function ensureSessionLog(projectRoot: string): SessionLogResult {
  // Check for pending session
  const sessionPath = path.join(projectRoot, '.sigil/.pending-session.json');

  if (!fs.existsSync(sessionPath)) {
    return { logPath: null, written: false, reason: 'no_pending_session' };
  }

  try {
    const session = JSON.parse(fs.readFileSync(sessionPath, 'utf-8'));
    const logPath = writeCraftLog(session, projectRoot);

    // Cleanup pending session
    fs.unlinkSync(sessionPath);

    return { logPath, written: true };
  } catch (err) {
    return { logPath: null, written: false, reason: String(err) };
  }
}
```

---

### 3.2 P0-2: queryMaterial Parameter Fix

**File:** `sigil-mark/process/agent-orchestration.ts`

**Current (Broken):**
```typescript
// Line 484
queryMaterial('framer-motion', workshop);  // WRONG ORDER
```

**Fixed:**
```typescript
import { queryMaterial } from './workshop-builder';

// Use named parameters to prevent future issues
const material = queryMaterial(workshop, 'framer-motion');
```

**Prevention Strategy:**
```typescript
// workshop-builder.ts - Add branded type
type WorkshopBrand = { readonly __brand: 'Workshop' };
export type BrandedWorkshop = Workshop & WorkshopBrand;

export function queryMaterial(
  workshop: BrandedWorkshop,  // First param must be Workshop
  name: string
): MaterialEntry | null;
```

---

### 3.3 P0-3: Verify-on-Read System

**File:** `sigil-mark/process/workshop-query.ts`

#### 3.3.1 Enhanced ComponentEntry Interface

**File:** `sigil-mark/types/workshop.ts`

```typescript
export interface ComponentEntry {
  /** File path relative to project root */
  path: string;
  /** Component tier (gold/silver/bronze/draft) */
  tier: ComponentTier;
  /** Optional zone assignment */
  zone?: string;
  /** Optional physics assignment */
  physics?: string;
  /** Vocabulary terms this component handles */
  vocabulary?: string[];
  /** Package imports used by this component */
  imports: string[];

  // NEW: Verification fields (P0-3)
  /** Content hash for modification detection */
  hash?: string;
  /** ISO timestamp when indexed */
  indexed_at?: string;
}
```

#### 3.3.2 Verified Query Function

```typescript
// workshop-query.ts

import * as crypto from 'crypto';

/**
 * Query component with filesystem verification.
 * Performance: <6ms (5ms lookup + 1ms stat)
 */
export function queryComponentVerified(
  workshop: Workshop,
  name: string,
  projectRoot: string = process.cwd()
): WorkshopQueryResult<ComponentEntry> {
  const entry = workshop.components[name];

  if (!entry) {
    return { found: false, source: 'workshop' };
  }

  const fullPath = path.join(projectRoot, entry.path);

  try {
    const stat = fs.statSync(fullPath);

    // Option 1: mtime comparison (faster)
    if (entry.indexed_at) {
      const indexedDate = new Date(entry.indexed_at);
      if (stat.mtime > indexedDate) {
        console.warn(`[Workshop] Component ${name} modified, re-indexing`);
        return reindexComponent(workshop, name, fullPath, projectRoot);
      }
    }

    // Option 2: hash comparison (more reliable)
    if (entry.hash) {
      const currentHash = getFileHash(fullPath);
      if (currentHash !== entry.hash) {
        console.warn(`[Workshop] Component ${name} hash mismatch, re-indexing`);
        return reindexComponent(workshop, name, fullPath, projectRoot);
      }
    }

    return {
      found: true,
      data: entry,
      source: 'workshop',
    };
  } catch (err) {
    // File no longer exists
    console.warn(`[Workshop] Component ${name} deleted from ${entry.path}`);
    delete workshop.components[name];

    // Persist the deletion
    saveWorkshopUpdate(workshop, projectRoot);

    return { found: false, source: 'workshop', reason: 'file_deleted' };
  }
}

function getFileHash(filePath: string): string {
  const content = fs.readFileSync(filePath);
  return crypto.createHash('md5').update(content).digest('hex');
}

function reindexComponent(
  workshop: Workshop,
  name: string,
  fullPath: string,
  projectRoot: string
): WorkshopQueryResult<ComponentEntry> {
  // Re-extract component metadata
  const newEntry = extractComponent(fullPath, projectRoot);

  if (newEntry) {
    newEntry.hash = getFileHash(fullPath);
    newEntry.indexed_at = new Date().toISOString();
    workshop.components[name] = newEntry;

    // Persist update
    saveWorkshopUpdate(workshop, projectRoot);

    return { found: true, data: newEntry, source: 'workshop' };
  }

  // Component no longer parseable
  delete workshop.components[name];
  saveWorkshopUpdate(workshop, projectRoot);

  return { found: false, source: 'workshop', reason: 'parse_failed' };
}

function saveWorkshopUpdate(workshop: Workshop, projectRoot: string): void {
  const workshopPath = path.join(projectRoot, '.sigil/workshop.json');
  fs.writeFileSync(workshopPath, JSON.stringify(workshop, null, 2));
}
```

---

### 3.4 P0-4: Startup Sentinel Rebuild

**File:** `sigil-mark/process/startup-sentinel.ts`

```typescript
export interface SentinelResult {
  fresh: boolean;
  rebuilt: boolean;
  fallback: boolean;
  reason?: string;
  durationMs?: number;

  // NEW: Rebuild metrics (P0-4)
  rebuildMetrics?: {
    materialCount: number;
    componentCount: number;
    physicsCount: number;
    zonesCount: number;
  };
}

export async function runSentinel(
  options: SentinelOptions = {}
): Promise<SentinelResult> {
  const { projectRoot = process.cwd(), forceRebuild = false } = options;
  const start = performance.now();

  const staleness = checkWorkshopStaleness(projectRoot);

  if (!staleness.stale && !forceRebuild) {
    return {
      fresh: true,
      rebuilt: false,
      fallback: false,
      durationMs: performance.now() - start,
    };
  }

  // FIXED: Actually rebuild when stale (P0-4)
  try {
    // Acquire lock to prevent concurrent rebuilds
    const lockAcquired = await acquireLock(projectRoot);

    if (!lockAcquired) {
      // Another process is rebuilding, wait or fallback
      const waitResult = await waitForRebuild(projectRoot, { timeout: 30000 });
      if (waitResult.success) {
        return {
          fresh: true,
          rebuilt: false,
          fallback: false,
          reason: 'waited_for_other_rebuild',
          durationMs: performance.now() - start,
        };
      } else {
        return {
          fresh: false,
          rebuilt: false,
          fallback: true,
          reason: 'rebuild_timeout_fallback_to_jit',
          durationMs: performance.now() - start,
        };
      }
    }

    // Perform rebuild
    const buildResult = await buildWorkshop({ projectRoot });

    releaseLock(projectRoot);

    return {
      fresh: true,
      rebuilt: true,
      fallback: false,
      reason: staleness.reason,
      durationMs: performance.now() - start,
      rebuildMetrics: {
        materialCount: Object.keys(buildResult.workshop.materials).length,
        componentCount: Object.keys(buildResult.workshop.components).length,
        physicsCount: Object.keys(buildResult.workshop.physics).length,
        zonesCount: Object.keys(buildResult.workshop.zones).length,
      },
    };
  } catch (err) {
    releaseLock(projectRoot);

    console.error('[Sentinel] Rebuild failed:', err);

    return {
      fresh: false,
      rebuilt: false,
      fallback: true,
      reason: `rebuild_failed: ${String(err)}`,
      durationMs: performance.now() - start,
    };
  }
}
```

---

### 3.5 P1-1: Vocabulary Reader Integration

**File:** `sigil-mark/process/agent-orchestration.ts`

```typescript
import {
  loadVocabulary,
  getAllTerms,
  getTermFeel,
  getRecommendedPhysics,
  Vocabulary,
  VocabularyTerm,
} from './vocabulary-reader';

// Module-level cache
let cachedVocabulary: Vocabulary | null = null;

/**
 * Extract vocabulary terms from prompt using vocabulary-reader.
 * Replaces hardcoded VOCABULARY_TERMS array.
 */
export function extractVocabularyTerms(
  prompt: string,
  projectRoot: string = process.cwd()
): string[] {
  if (!cachedVocabulary) {
    cachedVocabulary = loadVocabulary(projectRoot);
  }

  const allTerms = getAllTerms(cachedVocabulary);
  const promptLower = prompt.toLowerCase();

  return allTerms
    .filter(term =>
      promptLower.includes(term.id.toLowerCase()) ||
      promptLower.includes(term.user_facing.toLowerCase())
    )
    .map(term => term.id);
}

/**
 * Resolve zone from vocabulary terms.
 * Uses semantic feel mapping instead of hardcoded logic.
 */
export function resolveZoneFromVocabulary(
  terms: string[],
  projectRoot: string = process.cwd()
): string {
  if (!cachedVocabulary) {
    cachedVocabulary = loadVocabulary(projectRoot);
  }

  // Priority: critical > marketing > admin > standard
  const zonePriority = ['critical', 'marketing', 'admin', 'standard'];

  for (const zone of zonePriority) {
    for (const termId of terms) {
      const term = cachedVocabulary.terms[termId];
      if (term?.zones?.includes(zone)) {
        return zone;
      }
    }
  }

  return 'standard';
}

/**
 * Resolve physics from vocabulary terms.
 * Uses vocabulary-reader's getRecommendedPhysics.
 */
export function resolvePhysicsFromVocabulary(
  terms: string[],
  zone: string,
  projectRoot: string = process.cwd()
): string {
  if (!cachedVocabulary) {
    cachedVocabulary = loadVocabulary(projectRoot);
  }

  // Try to get physics from first matching term
  for (const termId of terms) {
    const physics = getRecommendedPhysics(cachedVocabulary, termId);
    if (physics?.motion) {
      return physics.motion;
    }
  }

  // Fallback to zone default
  const zonePhysicsMap: Record<string, string> = {
    critical: 'deliberate',
    marketing: 'playful',
    admin: 'snappy',
    standard: 'warm',
  };

  return zonePhysicsMap[zone] || 'warm';
}

/**
 * Clear vocabulary cache (for testing).
 */
export function clearVocabularyCache(): void {
  cachedVocabulary = null;
}
```

---

### 3.6 P1-2: Taste-Key Curation Layer

#### 3.6.1 New File: .sigil/taste-key.yaml

```yaml
# Taste-Key Configuration
# Controls promotion from canonical-candidate to canonical

# The taste-key holder (email or identifier)
holder: "design-lead@company.com"

# Auto-approval settings
auto_approve:
  # Auto-approve if pattern has 10+ occurrences and 2+ weeks old
  enabled: false
  min_occurrences: 10
  min_age_days: 14

# Pending promotions (managed by system)
pending_promotions: []

# Approved patterns log
approved:
  - pattern: "animation:spring-entrance"
    approved_by: "design-lead@company.com"
    approved_at: "2026-01-08T12:00:00Z"
    reason: "Aligns with product feel"

# Rejected patterns log
rejected:
  - pattern: "spinner-infinite"
    rejected_by: "design-lead@company.com"
    rejected_at: "2026-01-08T12:00:00Z"
    reason: "Creates anxiety, prefer skeleton"
```

#### 3.6.2 Enhanced survival-observer.ts

```typescript
// New types
export type PatternStatus =
  | 'experimental'
  | 'surviving'
  | 'canonical-candidate'  // NEW
  | 'canonical'
  | 'rejected';

export interface PromotionConfig {
  survivalThreshold: number;         // 3
  candidateThreshold: number;        // 5
  requireTasteKeyForCanonical: boolean;  // true
}

const DEFAULT_CONFIG: PromotionConfig = {
  survivalThreshold: 3,
  candidateThreshold: 5,
  requireTasteKeyForCanonical: true,
};

/**
 * Determine pattern status with curated promotion.
 * 5+ occurrences = canonical-candidate, NOT canonical.
 */
export function determineStatusWithCuration(
  occurrences: number,
  config: PromotionConfig = DEFAULT_CONFIG,
  tasteKeyApproved: boolean = false
): PatternStatus {
  if (occurrences >= config.candidateThreshold) {
    // Curated promotion gate
    return tasteKeyApproved ? 'canonical' : 'canonical-candidate';
  }

  if (occurrences >= config.survivalThreshold) {
    return 'surviving';
  }

  return 'experimental';
}

/**
 * Check if pattern is taste-key approved.
 */
export function isPatternApproved(
  pattern: string,
  projectRoot: string = process.cwd()
): boolean {
  const tasteKeyPath = path.join(projectRoot, '.sigil/taste-key.yaml');

  if (!fs.existsSync(tasteKeyPath)) {
    return false;
  }

  const tasteKey = YAML.parse(fs.readFileSync(tasteKeyPath, 'utf-8'));

  return tasteKey.approved?.some((a: any) => a.pattern === pattern) ?? false;
}

/**
 * Add pattern to pending promotions.
 */
export function addPendingPromotion(
  pattern: string,
  entry: PatternEntry,
  projectRoot: string = process.cwd()
): void {
  const tasteKeyPath = path.join(projectRoot, '.sigil/taste-key.yaml');

  let tasteKey: any = {
    holder: '',
    pending_promotions: [],
    approved: [],
    rejected: [],
  };

  if (fs.existsSync(tasteKeyPath)) {
    tasteKey = YAML.parse(fs.readFileSync(tasteKeyPath, 'utf-8'));
  }

  // Check if already pending
  const alreadyPending = tasteKey.pending_promotions?.some(
    (p: any) => p.pattern === pattern
  );

  if (!alreadyPending) {
    tasteKey.pending_promotions = tasteKey.pending_promotions || [];
    tasteKey.pending_promotions.push({
      pattern,
      occurrences: entry.occurrences,
      first_seen: entry.first_seen,
      files: entry.files,
      status: 'canonical-candidate',
      detected_at: new Date().toISOString(),
    });

    fs.writeFileSync(tasteKeyPath, YAML.stringify(tasteKey));
  }
}
```

---

### 3.7 P1-3: Hard Eviction for Virtual Sanctuary

**File:** `sigil-mark/process/seed-manager.ts`

```typescript
/**
 * Load seed with hard eviction of real components.
 * If a real component exists, the virtual one is DELETED, not faded.
 */
export function loadSeedWithEviction(
  projectRoot: string = process.cwd()
): Seed | null {
  const seed = loadRawSeed(projectRoot);
  if (!seed) return null;

  const sanctuaryPath = path.join(projectRoot, 'src/sanctuary');

  // Check if sanctuary has any real components
  const realComponents = scanRealComponents(sanctuaryPath);

  if (realComponents.length > 0) {
    // Hard evict ALL virtual components if ANY real exist
    seed.components = {};
    seed.status = 'evicted';

    console.log(
      `[Seed] Virtual Sanctuary evicted: ${realComponents.length} real components found`
    );

    return seed;
  }

  return seed;
}

/**
 * Scan for real components in sanctuary.
 */
function scanRealComponents(sanctuaryPath: string): string[] {
  if (!fs.existsSync(sanctuaryPath)) {
    return [];
  }

  const components: string[] = [];

  const scanDir = (dir: string) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
        // Check for @sigil-tier pragma
        const content = fs.readFileSync(fullPath, 'utf-8');
        if (content.includes('@sigil-tier')) {
          components.push(entry.name.replace(/\.(tsx?|ts)$/, ''));
        }
      }
    }
  };

  scanDir(sanctuaryPath);
  return components;
}

/**
 * Query virtual component (only if sanctuary is empty).
 */
export function queryVirtualComponent(
  name: string,
  projectRoot: string = process.cwd()
): VirtualComponentEntry | null {
  const seed = loadSeedWithEviction(projectRoot);

  if (!seed || seed.status === 'evicted') {
    return null;  // No ghosts allowed
  }

  return seed.components?.[name] ?? null;
}

/**
 * Reset seed from template.
 * Used by /reset-seed command.
 */
export function resetSeedFromTemplate(
  projectRoot: string = process.cwd()
): void {
  const seedPath = path.join(projectRoot, '.sigil/seed.yaml');
  const templatePath = path.join(projectRoot, '.sigil/seed-template.yaml');

  if (!fs.existsSync(templatePath)) {
    throw new Error('No seed template found at .sigil/seed-template.yaml');
  }

  fs.copyFileSync(templatePath, seedPath);
  console.log('[Seed] Reset from template');
}
```

---

### 3.8 P2-1: Optimistic Divergence

**File:** `sigil-mark/process/physics-validator.ts`

```typescript
export interface OptimisticValidationResult {
  allow: boolean;
  violations: Violation[];
  divergent: boolean;
  tag?: string;
  suggestion?: string;
}

/**
 * Validate with optimistic divergence.
 * Physics violations BLOCK. Taste violations TAG.
 */
export function validatePhysicsOptimistic(
  code: string,
  options: ValidationOptions = {}
): OptimisticValidationResult {
  const { workshop, zone, strict = false } = options;

  // 1. Validate physics constraints (BLOCKING)
  const physicsViolations = validatePhysicsConstraints(code, zone, workshop);

  if (physicsViolations.length > 0 && physicsViolations.some(v => v.severity === 'error')) {
    return {
      allow: false,
      violations: physicsViolations,
      divergent: false,
      suggestion: generateSuggestion(physicsViolations[0]),
    };
  }

  // 2. Validate taste/style (TAGGING, not blocking)
  const tasteViolations = validateTasteConstraints(code, options);

  if (tasteViolations.length > 0) {
    const reasons = tasteViolations.map(v => v.message).join(', ');

    return {
      allow: true,  // Allow the code
      violations: tasteViolations,
      divergent: true,  // But mark as divergent
      tag: `/** @sigil-status divergent: ${reasons} */`,
    };
  }

  // 3. All good
  return {
    allow: true,
    violations: [],
    divergent: false,
  };
}

/**
 * Validate physics constraints (zone, material, API, fidelity).
 * These are BLOCKING errors.
 */
function validatePhysicsConstraints(
  code: string,
  zone: string | undefined,
  workshop: Workshop | undefined
): Violation[] {
  const violations: Violation[] = [];

  // Zone constraint
  const zoneViolation = validateZoneConstraint(code, zone);
  if (zoneViolation) violations.push(zoneViolation);

  // Material constraint
  const materialViolation = validateMaterialConstraint(code);
  if (materialViolation) violations.push(materialViolation);

  // API correctness
  if (workshop) {
    const apiViolations = validateApiExports(code, workshop);
    violations.push(...apiViolations);
  }

  // Fidelity ceiling
  const fidelityViolation = validateFidelityConstraint(code, zone);
  if (fidelityViolation) violations.push(fidelityViolation);

  return violations;
}

/**
 * Validate taste constraints (patterns, style).
 * These result in divergent TAGGING, not blocking.
 */
function validateTasteConstraints(
  code: string,
  options: ValidationOptions
): Violation[] {
  const violations: Violation[] = [];

  // Check against rejected patterns
  const survival = loadSurvivalIndexSafe(options.projectRoot);
  if (survival) {
    const rejectedPatterns = Object.entries(survival.patterns)
      .filter(([, entry]) => entry.status === 'rejected')
      .map(([pattern]) => pattern);

    for (const pattern of rejectedPatterns) {
      if (codeMatchesPattern(code, pattern)) {
        violations.push({
          type: 'taste',
          severity: 'warning',
          message: `Uses rejected pattern: ${pattern}`,
          pattern,
        });
      }
    }
  }

  return violations;
}
```

---

### 3.9 P2-2: Merge-Driven Gardening

**File:** `.github/workflows/sigil-gardener.yaml`

```yaml
name: Sigil Gardener

on:
  push:
    branches: [main]
  pull_request:
    types: [closed]
    branches: [main]

jobs:
  garden:
    # Only run on merged PRs or direct pushes to main
    if: >
      github.event_name == 'push' ||
      (github.event_name == 'pull_request' && github.event.pull_request.merged == true)

    runs-on: ubuntu-latest

    permissions:
      contents: write

    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
          token: ${{ secrets.GITHUB_TOKEN }}

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Run Gardener
        run: npx tsx sigil-mark/process/garden-command.ts
        env:
          CI: true

      - name: Check for Changes
        id: changes
        run: |
          if git diff --quiet .sigil/survival.json; then
            echo "changed=false" >> $GITHUB_OUTPUT
          else
            echo "changed=true" >> $GITHUB_OUTPUT
          fi

      - name: Commit Survival Index
        if: steps.changes.outputs.changed == 'true'
        run: |
          git config user.name "Sigil Gardener"
          git config user.email "gardener@sigil.dev"
          git add .sigil/survival.json
          git commit -m "chore(sigil): update survival index [skip ci]"
          git push
```

**File:** `sigil-mark/process/garden-command.ts`

```typescript
#!/usr/bin/env npx tsx

/**
 * Gardener command for CI execution.
 * Scans codebase and updates survival.json.
 */

import { runGardener } from './survival-observer';

async function main() {
  const projectRoot = process.cwd();

  console.log('[Gardener] Starting pattern scan...');
  const start = performance.now();

  const result = await runGardener({
    projectRoot,
    scanPaths: ['src/'],
    promotionRules: {
      survivalThreshold: 3,
      candidateThreshold: 5,
      requireTasteKeyForCanonical: true,
    },
  });

  const duration = performance.now() - start;

  console.log(`[Gardener] Scan complete in ${duration.toFixed(0)}ms`);
  console.log(`  Patterns scanned: ${result.patternsScanned}`);
  console.log(`  New patterns: ${result.newPatterns}`);
  console.log(`  Promotions: ${result.promotions}`);
  console.log(`  Candidates created: ${result.candidatesCreated}`);

  if (result.candidatesCreated > 0) {
    console.log('\n[Gardener] New canonical candidates require taste-key approval:');
    result.candidatePatterns.forEach(p => console.log(`  - ${p}`));
  }
}

main().catch(err => {
  console.error('[Gardener] Failed:', err);
  process.exit(1);
});
```

---

## 4. Data Architecture

### 4.1 Enhanced Schemas

#### 4.1.1 survival.json

```json
{
  "era": "v1",
  "era_started": "2026-01-08",
  "last_scan": "2026-01-09T12:00:00Z",
  "scan_source": "merge-driven",
  "patterns": {
    "animation:spring-entrance": {
      "status": "canonical",
      "first_seen": "2026-01-01",
      "occurrences": 12,
      "files": ["Button.tsx", "Card.tsx", "Modal.tsx"],
      "approved_at": "2026-01-05T10:00:00Z",
      "approved_by": "design-lead@company.com"
    },
    "animation:fade-exit": {
      "status": "canonical-candidate",
      "first_seen": "2026-01-07",
      "occurrences": 6,
      "files": ["Tooltip.tsx", "Dropdown.tsx"],
      "candidate_at": "2026-01-09T08:00:00Z"
    },
    "spinner-loading": {
      "status": "surviving",
      "first_seen": "2026-01-08",
      "occurrences": 3,
      "files": ["LoadingState.tsx"]
    },
    "experimental-glow": {
      "status": "experimental",
      "first_seen": "2026-01-09",
      "occurrences": 1,
      "files": ["NewComponent.tsx"],
      "divergent": true,
      "divergent_reason": "Uses rejected pattern: infinite-animation"
    }
  }
}
```

#### 4.1.2 workshop.json (Enhanced)

```json
{
  "indexed_at": "2026-01-09T12:00:00Z",
  "package_hash": "a1b2c3d4e5f6",
  "imports_hash": "f6e5d4c3b2a1",
  "materials": {
    "framer-motion": {
      "version": "11.15.0",
      "exports": ["motion", "AnimatePresence", "useAnimation"],
      "types_available": true,
      "readme_available": true,
      "signatures": {
        "motion.div": "MotionComponent<'div'>",
        "useAnimation": "() => AnimationControls"
      }
    }
  },
  "components": {
    "Button": {
      "path": "src/sanctuary/Button.tsx",
      "tier": "gold",
      "zone": "standard",
      "physics": "snappy",
      "vocabulary": ["submit", "cancel"],
      "imports": ["framer-motion", "react"],
      "hash": "d4c3b2a1e5f6",
      "indexed_at": "2026-01-09T12:00:00Z"
    }
  },
  "physics": {
    "deliberate": {
      "timing": "800ms",
      "easing": "ease-out",
      "description": "Thoughtful, measured interactions for critical actions"
    },
    "snappy": {
      "timing": "150ms",
      "easing": "ease-out",
      "description": "Quick, responsive feedback"
    }
  },
  "zones": {
    "critical": {
      "physics": "deliberate",
      "timing": "800ms",
      "description": "Financial and irreversible actions"
    }
  }
}
```

---

## 5. API Design

### 5.1 Hook Script Interfaces

All hook scripts communicate via JSON to stdout:

#### PreToolUse (validate.sh)

**Input:** Arguments from Claude Code
```
$1 = code content
$2 = file path (optional)
```

**Output:**
```json
{
  "valid": true,
  "violations": [],
  "divergent": false
}
```

**Exit Code:**
- 0 = valid (allow write)
- 1 = invalid (block write)

#### PostToolUse (observe.sh)

**Input:**
```
$1 = file path
$2 = code content
```

**Output:**
```json
{
  "patternsDetected": ["animation:spring-entrance"],
  "patternsUpdated": ["animation:spring-entrance"],
  "newPatterns": [],
  "candidatesCreated": []
}
```

**Exit Code:** Always 0 (non-blocking)

#### Stop (ensure-log.sh)

**Input:** None (reads from .sigil/.pending-session.json)

**Output:**
```json
{
  "logPath": ".sigil/craft-log/2026-01-09-Button.md",
  "written": true
}
```

**Exit Code:** Always 0 (non-blocking)

---

## 6. Testing Strategy

### 6.1 Test Structure

```
sigil-mark/__tests__/
├── unit/
│   ├── physics-validator.test.ts      # P0-3, P2-1
│   ├── survival-observer.test.ts      # P1-2
│   ├── seed-manager.test.ts           # P1-3
│   ├── vocabulary-reader.test.ts      # P1-1
│   └── workshop-query.test.ts         # P0-3
├── integration/
│   ├── hook-execution.test.ts         # P0-1
│   ├── cache-coherence.test.ts        # P0-3
│   └── startup-sentinel.test.ts       # P0-4
├── e2e/
│   └── full-craft-flow.test.ts        # P1-4
└── fixtures/
    ├── workshop.json
    ├── survival.json
    ├── taste-key.yaml
    └── sample-components/
```

### 6.2 Coverage Targets

| Area | Current | Target |
|------|---------|--------|
| Physics Validator | ~95% | 100% |
| Survival Observer | ~80% | 90% |
| Workshop Builder | ~70% | 85% |
| Agent Orchestration | ~40% | 80% |
| Hook Integration | 0% | 70% |
| Cache Coherence | 0% | 90% |

---

## 7. Implementation Order

### Sprint 1: Make It Work (P0)

| Day | Task | Files |
|-----|------|-------|
| 1 | Create hook bridge scripts | `.claude/skills/*/scripts/*.sh` |
| 2 | Add hook TypeScript exports | `sigil-mark/process/*.ts` |
| 3 | Fix queryMaterial parameter order | `agent-orchestration.ts` |
| 4 | Implement queryComponentVerified | `workshop-query.ts` |
| 5 | Implement sentinel rebuild | `startup-sentinel.ts` |

### Sprint 2: Make It Safe (P1)

| Day | Task | Files |
|-----|------|-------|
| 1 | Integrate vocabulary-reader | `agent-orchestration.ts` |
| 2-3 | Implement taste-key curation | `survival-observer.ts` |
| 4 | Implement hard eviction | `seed-manager.ts` |
| 5 | Create E2E test suite | `__tests__/e2e/` |

### Sprint 3: Make It Fast (P2)

| Day | Task | Files |
|-----|------|-------|
| 1 | Implement optimistic divergence | `physics-validator.ts` |
| 2 | Create GitHub Actions workflow | `.github/workflows/` |
| 3 | Standardize versions | Multiple files |
| 4-5 | Documentation alignment | `craft.md`, `CLAUDE.md` |

---

## 8. Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Hook scripts fail silently | Add `set -euo pipefail`, log errors |
| fs.stat adds latency | Use mtime first, hash on mismatch |
| Taste-key bottleneck | Auto-approve after 14 days |
| Divergence tag spam | Rate limit: max 3 per file |
| Gardener git conflicts | Use `[skip ci]`, rebase strategy |

---

## 9. Success Criteria

| Metric | Target | Validation |
|--------|--------|------------|
| All hooks execute | 100% | CI tests |
| Cache verification overhead | <5ms | Benchmark |
| No auto-canonical promotion | 0 patterns | Audit |
| Gardener runs on merge | <5 min | CI logs |
| Zero flow interruptions | 0 prompts | Manual |

---

## 10. Appendix

### A. File Creation Checklist

```
[ ] .claude/skills/validating-physics/scripts/validate.sh
[ ] .claude/skills/observing-survival/scripts/observe.sh
[ ] .claude/skills/chronicling-rationale/scripts/ensure-log.sh
[ ] .github/workflows/sigil-gardener.yaml
[ ] .sigil/taste-key.yaml
[ ] .claude/commands/approve.md
[ ] .claude/commands/reset-seed.md
[ ] sigil-mark/process/garden-command.ts
[ ] sigil-mark/__tests__/e2e/full-craft-flow.test.ts
[ ] sigil-mark/__tests__/process/cache-coherence.test.ts
```

### B. File Modification Checklist

```
[ ] sigil-mark/types/workshop.ts (hash, indexed_at fields)
[ ] sigil-mark/process/physics-validator.ts (validateForHook, optimistic)
[ ] sigil-mark/process/survival-observer.ts (observeForHook, curation)
[ ] sigil-mark/process/chronicling-rationale.ts (ensureSessionLog)
[ ] sigil-mark/process/workshop-query.ts (queryComponentVerified)
[ ] sigil-mark/process/startup-sentinel.ts (rebuild logic)
[ ] sigil-mark/process/agent-orchestration.ts (vocabulary, queryMaterial)
[ ] sigil-mark/process/seed-manager.ts (hard eviction)
[ ] sigil-mark/package.json (version 6.1.0)
[ ] CLAUDE.md (version, /forge removal)
```

### C. Commands Reference (v6.1)

| Command | Purpose | Status |
|---------|---------|--------|
| `/craft` | Generate from feel | Unchanged |
| `/inspire` | One-time fetch | Unchanged |
| `/sanctify` | Promote ephemeral | Unchanged |
| `/garden` | Run survival scan | Unchanged |
| `/audit` | Check cohesion | Unchanged |
| `/new-era` | Start fresh epoch | Unchanged |
| `/approve` | Taste-key approval | **NEW** |
| `/reset-seed` | Restore virtual | **NEW** |
| `/forge` | Break precedent | **REMOVED** |

---

*SDD Generated: 2026-01-09*
*Based on: PRD v6.1.0 "Agile Muse"*
*Next Step: `/sprint-plan` for implementation breakdown*
