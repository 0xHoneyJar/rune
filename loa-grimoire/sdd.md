# Software Design Document: Sigil v6.0.0 "Native Muse"

> *"Code is precedent. Survival is approval. Creativity needs no permission."*

**Version:** 6.0.0
**Codename:** Native Muse
**Generated:** 2026-01-08
**Architect:** Claude
**Sources:** PRD v6.0.0, sigil-v3.1.zip context

---

## 1. Executive Summary

Sigil v6.0.0 "Native Muse" evolves the v5.0 constitutional framework into a survival-based design context system with pre-computed indexes, silent pattern observation, and context forking for ephemeral exploration.

### Key Architectural Goals

1. **5ms Workshop Queries** — Pre-computed index replaces JIT grep
2. **Survival-Based Precedent** — Code existence determines approval
3. **Zero Flow Interruption** — No approval dialogs, silent observation
4. **Cold Start Taste** — Virtual Sanctuary for new projects
5. **Context Isolation** — Forked contexts for ephemeral exploration

### Architecture Evolution

```
v5.0 "The Lucid Flow"              v6.0 "Native Muse"
─────────────────────              ───────────────────
JIT grep (200ms)           →       Workshop index (5ms)
Governance dialogs         →       Survival observation
Constitutional blocking    →       Physics-only validation
Empty room cold start      →       Virtual Sanctuary
6 skills                   →       10 skills + hooks
```

---

## 2. System Architecture

### 2.1 High-Level Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        SIGIL V6.0 "NATIVE MUSE"                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                     AGENT INTERFACE LAYER                            │   │
│  │  /craft  /forge  /inspire  /sanctify  /garden  /audit  /new-era    │   │
│  └──────────────────────────────┬──────────────────────────────────────┘   │
│                                 │                                           │
│  ┌──────────────────────────────▼──────────────────────────────────────┐   │
│  │                      LIFECYCLE HOOKS                                 │   │
│  │  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐              │   │
│  │  │ PreToolUse  │    │ PostToolUse │    │    Stop     │              │   │
│  │  │ validate_   │    │ observe_    │    │ ensure_     │              │   │
│  │  │ physics     │    │ patterns    │    │ craft_log   │              │   │
│  │  └─────────────┘    └─────────────┘    └─────────────┘              │   │
│  └──────────────────────────────┬──────────────────────────────────────┘   │
│                                 │                                           │
│  ┌──────────────────────────────▼──────────────────────────────────────┐   │
│  │                         10 SKILLS                                    │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐    │   │
│  │  │  Scanning   │ │   Seeding   │ │  Graphing   │ │  Querying   │    │   │
│  │  │  Sanctuary  │ │  Sanctuary  │ │   Imports   │ │  Workshop   │    │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘    │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐    │   │
│  │  │ Validating  │ │  Inspiring  │ │   Forging   │ │  Observing  │    │   │
│  │  │   Physics   │ │ Ephemerally │ │   Patterns  │ │  Survival   │    │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘    │   │
│  │  ┌─────────────┐ ┌─────────────┐                                    │   │
│  │  │ Chronicling │ │  Auditing   │                                    │   │
│  │  │  Rationale  │ │  Cohesion   │                                    │   │
│  │  └─────────────┘ └─────────────┘                                    │   │
│  └──────────────────────────────┬──────────────────────────────────────┘   │
│                                 │                                           │
│  ┌──────────────────────────────▼──────────────────────────────────────┐   │
│  │                    KERNEL (FROM V5.0 — UNCHANGED)                    │   │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────────┐  │   │
│  │  │ constitution │ │   fidelity   │ │   workflow   │ │ vocabulary │  │   │
│  │  │    .yaml     │ │    .yaml     │ │    .yaml     │ │   .yaml    │  │   │
│  │  └──────────────┘ └──────────────┘ └──────────────┘ └────────────┘  │   │
│  └──────────────────────────────┬──────────────────────────────────────┘   │
│                                 │                                           │
│  ┌──────────────────────────────▼──────────────────────────────────────┐   │
│  │                      INDEX LAYER (NEW IN V6)                         │   │
│  │  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐        │   │
│  │  │    Workshop     │ │    Survival     │ │      Seed       │        │   │
│  │  │  .sigil/work-   │ │  .sigil/surv-   │ │  .sigil/seed.   │        │   │
│  │  │   shop.json     │ │   ival.json     │ │     yaml        │        │   │
│  │  └─────────────────┘ └─────────────────┘ └─────────────────┘        │   │
│  └──────────────────────────────┬──────────────────────────────────────┘   │
│                                 │                                           │
│  ┌──────────────────────────────▼──────────────────────────────────────┐   │
│  │                    RUNTIME LAYER (FROM V5.0)                         │   │
│  │  ┌─────────────────────────────┐ ┌───────────────────────────────┐  │   │
│  │  │     SigilProvider           │ │      useSigilMutation         │  │   │
│  │  │  (Zone + Persona Context)   │ │  (Type-Driven Physics Hook)   │  │   │
│  │  └─────────────────────────────┘ └───────────────────────────────┘  │   │
│  │  ┌─────────────────────────────────────────────────────────────┐    │   │
│  │  │              Zone Layout Components                          │    │   │
│  │  │  CriticalZone | GlassLayout | MachineryLayout               │    │   │
│  │  └─────────────────────────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                   GOVERNANCE LAYER (FROM V5.0)                       │   │
│  │  justifications.log | amendments/ | craft-log/                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Layer Responsibilities

| Layer | Responsibility | Key Components |
|-------|----------------|----------------|
| **Agent Interface** | Command parsing, mode detection | `/craft`, `/forge`, `/garden`, etc. |
| **Lifecycle Hooks** | Pre/Post processing, validation | PreToolUse, PostToolUse, Stop |
| **10 Skills** | Specialized capabilities | Discovery, validation, observation |
| **Kernel** | Core rules (unchanged from v5.0) | constitution, fidelity, workflow, vocabulary |
| **Index Layer** | Pre-computed fast lookups (NEW) | workshop.json, survival.json, seed.yaml |
| **Runtime** | React integration (unchanged) | SigilProvider, useSigilMutation |
| **Governance** | Audit trail (unchanged) | justifications.log, amendments/ |

---

## 3. Technology Stack

### 3.1 Core Technologies

| Category | Technology | Justification |
|----------|------------|---------------|
| **Skills Runtime** | Claude Code Skills | Native skill system with hooks |
| **Indexing** | JSON files | Fast parsing, no external deps |
| **Discovery** | ripgrep (rg) | <50ms file search |
| **Schema** | YAML | Human-readable config |
| **React Runtime** | React 18+ | Unchanged from v5.0 |
| **Testing** | Vitest | Fast, ESM-native |

### 3.2 File Formats

| File | Format | Purpose |
|------|--------|---------|
| `.sigil/workshop.json` | JSON | Pre-computed framework/component index |
| `.sigil/survival.json` | JSON | Pattern survival tracking |
| `.sigil/seed.yaml` | YAML | Virtual Sanctuary for cold starts |
| `.sigil/imports.yaml` | YAML | Scanned dependency list |
| `sigil.yaml` | YAML | Configuration |
| `rules.md` | Markdown | Design constitution |

---

## 4. Component Design

### 4.1 Workshop Index

The workshop index provides 5ms lookups for framework APIs and component signatures.

#### Schema

```typescript
interface Workshop {
  // Metadata
  indexed_at: string;        // ISO timestamp
  package_hash: string;      // MD5 of package.json
  imports_hash: string;      // MD5 of .sigil/imports.yaml

  // Framework materials
  materials: Record<string, MaterialEntry>;

  // Sanctuary components
  components: Record<string, ComponentEntry>;

  // Physics definitions (from sigil.yaml)
  physics: Record<string, PhysicsDefinition>;

  // Zone definitions (from sigil.yaml)
  zones: Record<string, ZoneDefinition>;
}

interface MaterialEntry {
  version: string;
  exports: string[];
  types_available: boolean;
  readme_available: boolean;
  signatures?: Record<string, string>;
}

interface ComponentEntry {
  path: string;
  tier: 'gold' | 'silver' | 'bronze';
  zone?: string;
  physics?: string;
  vocabulary?: string[];
  imports: string[];
}

interface PhysicsDefinition {
  timing: string;
  easing: string;
  description: string;
}

interface ZoneDefinition {
  physics: string;
  timing: string;
  description: string;
}
```

#### Example

```json
{
  "indexed_at": "2026-01-08T14:30:00Z",
  "package_hash": "a1b2c3d4e5f6",
  "imports_hash": "f6e5d4c3b2a1",
  "materials": {
    "framer-motion": {
      "version": "11.0.0",
      "exports": ["motion", "AnimatePresence", "useAnimation", "useSpring"],
      "types_available": true,
      "signatures": {
        "motion": "MotionComponent",
        "useSpring": "(value: number, config?: SpringOptions) => MotionValue<number>"
      }
    }
  },
  "components": {
    "ClaimButton": {
      "path": "src/sanctuary/gold/ClaimButton.tsx",
      "tier": "gold",
      "zone": "critical",
      "physics": "deliberate",
      "vocabulary": ["claim", "withdraw"],
      "imports": ["framer-motion", "@radix-ui/react-dialog"]
    }
  },
  "physics": {
    "snappy": { "timing": "150ms", "easing": "ease-out", "description": "Quick feedback" },
    "smooth": { "timing": "300ms", "easing": "cubic-bezier(0.4, 0, 0.2, 1)", "description": "Standard" },
    "deliberate": { "timing": "800ms", "easing": "cubic-bezier(0.4, 0, 0.2, 1)", "description": "Weighty" }
  },
  "zones": {
    "critical": { "physics": "deliberate", "timing": "800ms", "description": "Irreversible actions" },
    "standard": { "physics": "smooth", "timing": "300ms", "description": "Normal interactions" }
  }
}
```

#### Builder Algorithm

```
buildWorkshop():
  1. Hash package.json → compare to stored hash
     └── Match → Skip rebuild, return cached
     └── Mismatch → Continue

  2. Read .sigil/imports.yaml (from Graphing Imports)

  3. For each import:
     a. Read node_modules/{pkg}/package.json → version
     b. Read node_modules/{pkg}/dist/index.d.ts → exports
     c. Check for README.md
     d. Extract key signatures

  4. Scan Sanctuary:
     rg "@sigil-tier" src/sanctuary/ -l
     For each file:
       - Parse JSDoc pragmas
       - Extract component metadata

  5. Merge with sigil.yaml (physics, zones)

  6. Write to .sigil/workshop.json
```

### 4.2 Survival Index

Tracks pattern adoption through code existence.

#### Schema

```typescript
interface SurvivalIndex {
  patterns: Record<string, PatternEntry>;
  last_scan: string;  // ISO timestamp
  era: string;        // Current era name
  era_started: string;
}

interface PatternEntry {
  first_seen: string;     // ISO date
  occurrences: number;
  status: 'experimental' | 'survived' | 'canonical' | 'rejected';
  files: string[];
  deleted_at?: string;    // If rejected
}
```

#### Promotion Rules

```
┌─────────────────────────────────────────────────────────┐
│                  SURVIVAL STATE MACHINE                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  NEW PATTERN                                            │
│       │                                                 │
│       ▼                                                 │
│  ┌───────────────┐                                     │
│  │ experimental  │──── 2 weeks ────▶ survived          │
│  │ (1 occurrence)│                                     │
│  └───────────────┘                                     │
│       │                                                │
│       │ 3+ occurrences                                 │
│       ▼                                                │
│  ┌───────────────┐                                     │
│  │   canonical   │                                     │
│  │ (3+ uses)     │                                     │
│  └───────────────┘                                     │
│       │                                                │
│       │ 0 occurrences (deleted)                        │
│       ▼                                                │
│  ┌───────────────┐                                     │
│  │   rejected    │                                     │
│  │ (deleted)     │                                     │
│  └───────────────┘                                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 4.3 Virtual Sanctuary (Seed)

Provides taste for cold start projects.

#### Schema

```typescript
interface Seed {
  seed: string;           // Seed name (e.g., 'linear-like')
  version: string;        // Seed version
  description: string;

  physics: Record<string, string>;  // Physics definitions
  materials: Record<string, MaterialDef>;
  virtual_components: Record<string, VirtualComponent>;
}

interface VirtualComponent {
  tier: 'gold' | 'silver' | 'bronze';
  physics: string;
  timing: string;
  zones: string[];
}
```

#### Fade Behavior

```
User creates: src/sanctuary/gold/Button.tsx

Seed Check:
  └── Virtual Button exists in seed.yaml?
      └── Yes → Mark as "faded", real Button takes precedence
      └── No → Normal component

Agent Query:
  └── Real Button exists?
      └── Yes → Return real Button
      └── No → Return virtual Button from seed
```

### 4.4 Lifecycle Hooks

#### PreToolUse Hooks

```yaml
hooks:
  PreToolUse:
    - name: validate_physics
      matcher: "Write|Edit|MultiEdit"
      checks:
        - zone_constraints
        - material_constraints
        - api_correctness
      blocks: true  # Can block generation

    - name: check_workshop_index
      matcher: "*"
      action: "Rebuild if stale"
      blocks: false
```

#### PostToolUse Hooks

```yaml
hooks:
  PostToolUse:
    - name: observe_patterns
      matcher: "Write|Edit|MultiEdit"
      action: "Tag new patterns with @sigil-pattern"
      blocks: false

    - name: update_workshop
      matcher: "Write|Edit|MultiEdit"
      action: "Incremental index update"
      blocks: false
```

#### Stop Hooks

```yaml
hooks:
  Stop:
    - name: ensure_craft_log
      action: "Generate craft log if missing"
      blocks: false

    - name: mark_survival
      action: "Update survival.json"
      blocks: false
```

---

## 5. Skill Specifications

### 5.1 Skills Overview

| # | Skill | Purpose | Trigger | Hook |
|---|-------|---------|---------|------|
| 1 | scanning-sanctuary | Find components | Search query | Manual |
| 2 | seeding-sanctuary | Cold start taste | Empty Sanctuary | Manual |
| 3 | graphing-imports | Map src/ deps | Startup | Manual |
| 4 | querying-workshop | Fast API lookup | /craft | Manual |
| 5 | validating-physics | Constraint check | Before write | PreToolUse |
| 6 | inspiring-ephemerally | External fetch | "like [url]" | Manual |
| 7 | forging-patterns | Break precedent | --forge flag | Manual |
| 8 | observing-survival | Pattern tracking | After write | PostToolUse |
| 9 | chronicling-rationale | Craft logs | End of craft | Stop |
| 10 | auditing-cohesion | Visual check | /audit | Manual |

### 5.2 Skill: Scanning Sanctuary

**Purpose:** Find components using ripgrep.

**Algorithm:**
```bash
# Find by tier
rg "@sigil-tier gold" src/sanctuary/ -l

# Find by zone
rg "@sigil-zone critical" src/ -l

# Find by vocabulary
rg "@sigil-vocabulary claim" src/ -l
```

**Output:** List of matching components with metadata.

### 5.3 Skill: Seeding Sanctuary

**Purpose:** Provide virtual taste for cold starts.

**Algorithm:**
```
1. Check if src/sanctuary/ is empty
2. If empty, offer seed selection:
   - Linear-like (minimal, keyboard-first)
   - Vercel-like (bold, high-contrast)
   - Stripe-like (soft gradients)
   - Blank (no seed)
3. Write selection to .sigil/seed.yaml
4. Virtual components available for /craft
```

### 5.4 Skill: Graphing Imports

**Purpose:** Scan src/ for actual dependencies.

**Algorithm:**
```bash
# ES imports
rg "from ['\"]([^'\"./][^'\"]*)['\"]" src/ -o --no-filename | \
  sed "s/from ['\"]//;s/['\"]$//" | \
  cut -d'/' -f1-2 | \
  sort -u > .sigil/imports.yaml
```

### 5.5 Skill: Querying Workshop

**Purpose:** Fast lookups from pre-computed index.

**Algorithm:**
```
1. Read .sigil/workshop.json
2. Query by key (e.g., materials["framer-motion"])
3. Return result in <5ms
4. If deeper info needed, read types directly from node_modules
```

### 5.6 Skill: Validating Physics

**Purpose:** Block physics violations, not novelty.

**Checks:**
| Check | Example | Action |
|-------|---------|--------|
| API correctness | motion.animate() | Block if invalid |
| Zone constraints | critical + playful | Block |
| Material constraints | clay + 0ms | Block |
| Fidelity ceiling | 3D in standard | Block |

**Not Checked:**
- Pattern existence (new patterns are the job)
- Style novelty (experimentation encouraged)
- Component precedent (survival decides)

### 5.7 Skill: Inspiring Ephemerally

**Purpose:** One-time external fetch in forked context.

**Algorithm:**
```
1. Detect trigger: "like [url]", "inspired by [url]"
2. Fork context (Claude Code 2.1)
3. [Forked] Fetch URL via Firecrawl/WebFetch
4. [Forked] Extract: gradients, spacing, typography, colors
5. [Forked] Apply to generation
6. Return to main context with code only
7. Fetched content discarded
```

### 5.8 Skill: Forging Patterns

**Purpose:** Explicit precedent-breaking mode.

**Algorithm:**
```
1. Detect trigger: /craft --forge or /forge
2. Fork context
3. Load:
   - Physics constraints (still enforced)
   - Zone definitions
   - Workshop API info
4. Ignore:
   - Survival patterns
   - Precedent history
   - Rejected patterns
5. Generate novel approach
6. User decides: keep or discard
```

### 5.9 Skill: Observing Survival

**Purpose:** Silent pattern tracking via PostToolUse hook.

**Algorithm:**
```
1. After file write, check for new patterns
2. Add JSDoc tag: // @sigil-pattern: patternName (2026-01-08)
3. Update .sigil/survival.json incrementally
4. No interruption, no approval dialog
```

**Gardener (Weekly):**
```bash
./scripts/gardener.sh

# 1. Scan for pattern tags
rg "@sigil-pattern" src/ --json

# 2. Count occurrences per pattern
# 3. Check age (first_seen date)
# 4. Apply promotion rules
# 5. Update survival.json
```

### 5.10 Skill: Chronicling Rationale

**Purpose:** Lightweight craft logs via Stop hook.

**Output Structure:**
```markdown
# Craft: [component] ([date])

## Request
"[original prompt]"

## Decisions
- Zone: [zone] ([reasoning])
- Physics: [physics] ([reasoning])
- Component: [component] ([tier])

## New Patterns
- [pattern]: [status]

## Physics Validated
- ✓ Zone constraint
- ✓ Material constraint
- ✓ API correctness
```

---

## 6. Data Architecture

### 6.1 File Structure

```
project/
├── .sigil/                      # NEW: Index layer
│   ├── workshop.json            # Pre-computed framework/component index
│   ├── survival.json            # Pattern survival tracking
│   ├── seed.yaml                # Virtual Sanctuary (fades)
│   ├── imports.yaml             # Scanned dependencies
│   ├── knowledge/               # Cached docs (fallback)
│   └── craft-log/               # Rationale artifacts
│       └── 2026-01-08-claim-button.md
│
├── sigil.yaml                   # Configuration
├── rules.md                     # Design constitution
│
├── sigil-mark/                  # UNCHANGED FROM V5.0
│   ├── kernel/                  # Core rules
│   │   ├── constitution.yaml
│   │   ├── fidelity.yaml
│   │   ├── workflow.yaml
│   │   └── vocabulary.yaml
│   ├── providers/               # React providers
│   │   └── sigil-provider.tsx
│   ├── hooks/                   # React hooks
│   │   └── use-sigil-mutation.ts
│   ├── layouts/                 # Zone layouts
│   │   ├── critical-zone.tsx
│   │   ├── glass-layout.tsx
│   │   └── machinery-layout.tsx
│   └── governance/              # Audit trail
│       ├── justifications.log
│       └── amendments/
│
├── .claude/
│   └── skills/                  # NEW: 10 Skills
│       ├── scanning-sanctuary/
│       │   └── SKILL.md
│       ├── seeding-sanctuary/
│       │   └── SKILL.md
│       ├── graphing-imports/
│       │   ├── SKILL.md
│       │   └── scripts/
│       │       └── scan-imports.sh
│       ├── querying-workshop/
│       │   ├── SKILL.md
│       │   └── WORKSHOP_SCHEMA.md
│       ├── validating-physics/
│       │   └── SKILL.md
│       ├── inspiring-ephemerally/
│       │   └── SKILL.md
│       ├── forging-patterns/
│       │   └── SKILL.md
│       ├── observing-survival/
│       │   ├── SKILL.md
│       │   └── scripts/
│       │       └── gardener.sh
│       ├── chronicling-rationale/
│       │   └── SKILL.md
│       └── auditing-cohesion/
│           └── SKILL.md
│
└── src/
    └── sanctuary/               # Component library
        ├── gold/
        └── silver/
```

### 6.2 Data Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                        /craft "trustworthy claim button"            │
└───────────────────────────────────┬─────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          STARTUP SENTINEL                            │
│  1. Compare package.json hash to workshop.json.package_hash         │
│     └── Match → Ready                                               │
│     └── Mismatch → Trigger rebuild                                  │
│  2. Check src/sanctuary/ for real components                        │
│     └── Empty → Load virtual Sanctuary from seed                    │
│     └── Populated → Ready                                           │
└───────────────────────────────────┬─────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          SKILL ORCHESTRATION                         │
│                                                                      │
│  1. graphing-imports → Verify deps in workshop                      │
│  2. scanning-sanctuary → Find ClaimButton (or virtual)              │
│  3. querying-workshop → Get framer-motion exports (5ms)             │
│  4. [PreToolUse] validating-physics → Check constraints             │
│     └── BLOCK if physics violation                                  │
│     └── ALLOW if clean (even if novel)                              │
│                                                                      │
└───────────────────────────────────┬─────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          CODE GENERATION                             │
│  Generate implementation with correct physics                       │
│  NO interruption, NO approval dialog                                │
└───────────────────────────────────┬─────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       POST-GENERATION HOOKS                          │
│                                                                      │
│  [PostToolUse] observing-survival → Tag new patterns silently       │
│  [PostToolUse] update-workshop → Incremental index update           │
│  [Stop] chronicling-rationale → Generate craft log                  │
│  [Stop] mark-survival → Update survival.json                        │
│                                                                      │
└───────────────────────────────────┬─────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                            OUTPUT                                    │
│  • Generated code with correct physics                              │
│  • Pattern tags for survival tracking                               │
│  • Craft log in .sigil/craft-log/                                   │
│  • Updated survival.json                                            │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 7. API Design

### 7.1 Commands

| Command | Arguments | Description |
|---------|-----------|-------------|
| `/craft` | `"description"` | Generate from feel description |
| `/craft --forge` | `"description"` | Break precedent, explore |
| `/inspire` | `[url]` | One-time fetch, ephemeral |
| `/sanctify` | `"pattern"` | Promote ephemeral to rule |
| `/garden` | — | Run survival scan |
| `/audit` | `[component]` | Check visual cohesion |
| `/new-era` | `"name"` | Start fresh precedent epoch |

### 7.2 Skill Interfaces

#### Scanning Sanctuary

```typescript
interface ScanResult {
  components: ComponentMatch[];
  total: number;
}

interface ComponentMatch {
  name: string;
  path: string;
  tier: 'gold' | 'silver' | 'bronze';
  zone?: string;
  physics?: string;
  vocabulary?: string[];
}
```

#### Querying Workshop

```typescript
interface WorkshopQuery {
  type: 'material' | 'component' | 'physics' | 'zone';
  key: string;
}

interface WorkshopResult {
  found: boolean;
  data: MaterialEntry | ComponentEntry | PhysicsDefinition | ZoneDefinition;
  source: 'workshop' | 'seed' | 'fallback';
}
```

#### Validating Physics

```typescript
interface ValidationResult {
  valid: boolean;
  violations: Violation[];
}

interface Violation {
  type: 'zone' | 'material' | 'api' | 'fidelity';
  message: string;
  suggestion?: string;
}
```

---

## 8. Performance Architecture

### 8.1 Performance Targets

| Operation | Target | Strategy |
|-----------|--------|----------|
| Workshop query | <5ms | Pre-computed JSON index |
| Sanctuary scan | <50ms | ripgrep with file limits |
| Index rebuild | <2s | Incremental updates |
| Pattern observation | <10ms | Append-only updates |
| Craft log generation | <100ms | Minimal template |

### 8.2 Caching Strategy

```
┌────────────────────────────────────────────────────────────────────┐
│                      CACHE ARCHITECTURE                            │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  PRIMARY CACHE: .sigil/workshop.json                              │
│  ├── Rebuilt when: package.json hash changes                      │
│  ├── Updated when: PostToolUse hook fires (incremental)           │
│  └── Query time: <5ms (JSON.parse + key lookup)                   │
│                                                                    │
│  SECONDARY CACHE: .sigil/survival.json                            │
│  ├── Updated when: Stop hook fires                                │
│  ├── Full scan: Weekly via gardener.sh                            │
│  └── Query time: <5ms                                             │
│                                                                    │
│  FALLBACK: node_modules/*.d.ts                                    │
│  ├── Used when: Workshop missing detailed signature               │
│  └── Query time: <50ms (targeted file read)                       │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### 8.3 Staleness Detection

```typescript
function isWorkshopStale(): boolean {
  const currentHash = md5(fs.readFileSync('package.json'));
  const storedHash = workshop.package_hash;
  return currentHash !== storedHash;
}
```

---

## 9. Security Architecture

### 9.1 Trust Model

```
┌─────────────────────────────────────────────────────────────────┐
│                        SOURCE OF TRUTH                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Type definitions (*.d.ts)     → LAW (compiler-enforced)    │
│  2. Code in src/                  → PRECEDENT (survival)       │
│  3. Workshop index                → Reference (cached)         │
│  4. Seed virtual components       → Fallback (cold start)      │
│                                                                 │
│  Rule: Code > Workshop > Seed                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 9.2 Context Isolation

**Ephemeral Inspiration:**
- Fetched content runs in forked context
- No persistence to Sanctuary
- Only generated code returns to main context

**Forge Mode:**
- Ignores survival patterns
- Experiments in forked context
- User explicitly decides to keep or discard

### 9.3 Governance (Unchanged from v5.0)

| File | Purpose |
|------|---------|
| `governance/justifications.log` | Append-only bypass audit trail |
| `governance/amendments/` | Amendment proposals |

---

## 10. Testing Strategy

### 10.1 Test Layers

| Layer | What's Tested | Method | Coverage |
|-------|---------------|--------|----------|
| Mechanics | Scanning, graphing, querying, validation | Unit tests | 90% |
| Craft Flow | Context resolution, pattern selection | Integration tests | 70% |
| Taste | Does the pattern work? | Survival (codebase as test) | N/A |

### 10.2 Test Structure

```
tests/
├── unit/
│   ├── scanning.test.ts       # Sanctuary search patterns
│   ├── graphing.test.ts       # Import extraction
│   ├── querying.test.ts       # Workshop index lookups
│   ├── validation.test.ts     # Physics constraint checking
│   └── vocabulary.test.ts     # Term → zone → physics
│
├── integration/
│   ├── craft-flow.test.ts     # Full /craft flow
│   └── context-fork.test.ts   # Ephemeral/forge isolation
│
├── survival/
│   ├── promotion.test.ts      # 3+ occurrences → canonical
│   └── gardener.test.ts       # Survival scanning
│
└── fixtures/
    ├── workshop.json          # Test workshop index
    ├── survival.json          # Test survival state
    ├── sigil.yaml             # Test configuration
    └── sanctuary/             # Mock components
        └── gold/
            └── ClaimButton.tsx
```

### 10.3 Key Test Cases

**Validation Tests (100% coverage):**
```typescript
it('blocks bounce in critical zone', () => {
  const result = validatePhysics(bouncySpring, { zone: 'critical' });
  expect(result.valid).toBe(false);
  expect(result.violations[0].type).toBe('zone');
});

it('allows novel pattern with correct physics', () => {
  const result = validatePhysics(newPattern, { zone: 'critical', physics: 'deliberate' });
  expect(result.valid).toBe(true);
});
```

**Survival Tests:**
```typescript
it('promotes patterns with 3+ occurrences to canonical', () => {
  const survival = runGardener(mockCodebase);
  expect(survival.patterns['useClaimAnimation'].status).toBe('canonical');
});

it('marks deleted patterns as rejected', () => {
  const survival = runGardener(mockCodebase);
  expect(survival.patterns['bouncySpring'].status).toBe('rejected');
});
```

---

## 11. Migration Path

### 11.1 From v5.0 to v6.0

**Kept (No Changes):**
- `sigil-mark/kernel/` — All YAML files unchanged
- `sigil-mark/providers/` — SigilProvider unchanged
- `sigil-mark/hooks/` — useSigilMutation unchanged
- `sigil-mark/layouts/` — Zone layouts unchanged
- `sigil-mark/governance/` — Justifications log unchanged

**Added:**
```bash
# Create .sigil/ directory
mkdir -p .sigil/craft-log .sigil/knowledge

# Create skills directory
mkdir -p .claude/skills

# Copy skills from package
cp -r sigil-v6/skills/* .claude/skills/

# Initialize workshop
npm run sigil:init

# Select seed (optional)
# Agent will prompt on first /craft if Sanctuary is empty
```

**Removed:**
```bash
# These v5.0 files are no longer needed
# (v6 uses pre-computed index instead)
rm sigil-mark/process/component-scanner.ts  # Replaced by workshop
rm sigil-mark/process/violation-scanner.ts  # Replaced by validating-physics skill
```

### 11.2 Migration Script

```bash
#!/bin/bash
# migrate-v6.sh

echo "Migrating Sigil v5.0 → v6.0..."

# 1. Create .sigil structure
mkdir -p .sigil/{craft-log,knowledge}

# 2. Create skills directory
mkdir -p .claude/skills

# 3. Build initial workshop
node scripts/build-workshop.js

# 4. Initialize survival index
echo '{"patterns":{},"last_scan":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","era":"v1","era_started":"'$(date -u +%Y-%m-%d)'"}' > .sigil/survival.json

# 5. Update version
echo '{"version":"6.0.0","codename":"Native Muse"}' > .sigil-version.json

echo "Migration complete!"
echo "Next: Run /craft to test the new flow"
```

---

## 12. Sprint Breakdown

### Phase 1: Foundation (Sprints 1-3)

**Sprint 1: Workshop Schema & Builder**
- [ ] Define workshop.json TypeScript interfaces
- [ ] Implement build-workshop.ts
- [ ] Implement hash-based staleness detection
- [ ] Unit tests for workshop builder

**Sprint 2: Startup Sentinel**
- [ ] Implement startup check flow
- [ ] Hash comparison logic
- [ ] Quick rebuild trigger
- [ ] Integration with /craft

**Sprint 3: Discovery Skills**
- [ ] scanning-sanctuary SKILL.md
- [ ] graphing-imports SKILL.md + scan-imports.sh
- [ ] Unit tests for scanning and graphing

### Phase 2: Intelligence (Sprints 4-6)

**Sprint 4: Querying Workshop**
- [ ] querying-workshop SKILL.md
- [ ] WORKSHOP_SCHEMA.md documentation
- [ ] Query API implementation
- [ ] Fallback to node_modules types

**Sprint 5: Validating Physics**
- [ ] validating-physics SKILL.md
- [ ] PreToolUse hook integration
- [ ] Zone constraint checking
- [ ] Material constraint checking
- [ ] API correctness verification
- [ ] 100% test coverage

**Sprint 6: Virtual Sanctuary**
- [ ] seeding-sanctuary SKILL.md
- [ ] Seed libraries (Linear, Vercel, Stripe)
- [ ] Fade behavior implementation
- [ ] Integration with scanning-sanctuary

### Phase 3: Evolution (Sprints 7-9)

**Sprint 7: Ephemeral Inspiration**
- [ ] inspiring-ephemerally SKILL.md
- [ ] Context fork implementation
- [ ] URL detection triggers
- [ ] Style extraction logic
- [ ] Cleanup after use

**Sprint 8: Forge Mode**
- [ ] forging-patterns SKILL.md
- [ ] --forge flag handling
- [ ] Era versioning
- [ ] /new-era command

**Sprint 9: Era Management**
- [ ] Era transition logic
- [ ] Pattern archiving
- [ ] rules.md era markers
- [ ] Integration tests

### Phase 4: Verification (Sprints 10-12)

**Sprint 10: Survival Observation**
- [ ] observing-survival SKILL.md
- [ ] PostToolUse hook integration
- [ ] @sigil-pattern tagging
- [ ] gardener.sh script

**Sprint 11: Chronicling & Auditing**
- [ ] chronicling-rationale SKILL.md
- [ ] Stop hook integration
- [ ] auditing-cohesion SKILL.md
- [ ] Variance threshold configuration

**Sprint 12: Agent Integration**
- [ ] sigil-craft agent definition
- [ ] Skill orchestration
- [ ] End-to-end craft flow
- [ ] Performance benchmarks

### Phase 5: Integration (Sprint 13)

**Sprint 13: Polish & Documentation**
- [ ] End-to-end testing
- [ ] CLAUDE.md update
- [ ] README.md update
- [ ] MIGRATION.md
- [ ] Performance validation (<5ms queries)

---

## 13. Appendix

### A. Seed Library Definitions

**Linear-like:**
```yaml
seed: linear-like
version: 2026.01
description: Minimal, keyboard-first, monochrome

physics:
  snappy: "150ms ease-out"
  smooth: "300ms cubic-bezier(0.4, 0, 0.2, 1)"

materials:
  default:
    shadows: minimal
    borders: subtle
    radii: 6px

virtual_components:
  Button:
    tier: gold
    physics: snappy
    zones: [standard, critical]
  Card:
    tier: gold
    physics: smooth
    zones: [standard]
  Input:
    tier: gold
    physics: snappy
    zones: [standard]
  Dialog:
    tier: gold
    physics: smooth
    zones: [standard, critical]
```

**Vercel-like:**
```yaml
seed: vercel-like
version: 2026.01
description: Bold, high-contrast, geometric

physics:
  sharp: "100ms ease-out"
  smooth: "200ms cubic-bezier(0.4, 0, 0.2, 1)"

materials:
  default:
    shadows: sharp
    borders: none
    radii: 8px

virtual_components:
  Button:
    tier: gold
    physics: sharp
    zones: [standard, critical]
  Card:
    tier: gold
    physics: smooth
    zones: [standard]
  Badge:
    tier: silver
    physics: sharp
    zones: [standard]
  Modal:
    tier: gold
    physics: smooth
    zones: [standard, critical]
```

**Stripe-like:**
```yaml
seed: stripe-like
version: 2026.01
description: Soft gradients, generous spacing

physics:
  smooth: "300ms cubic-bezier(0.4, 0, 0.2, 1)"
  deliberate: "500ms cubic-bezier(0.4, 0, 0.2, 1)"

materials:
  default:
    shadows: soft
    borders: subtle
    radii: 8px
    gradients: true

virtual_components:
  Button:
    tier: gold
    physics: smooth
    zones: [standard, critical]
  Card:
    tier: gold
    physics: smooth
    zones: [standard]
  Input:
    tier: gold
    physics: smooth
    zones: [standard]
  Toast:
    tier: silver
    physics: smooth
    zones: [standard]
```

### B. The Three Laws + Seven Laws

**The Three Laws (v6.0):**
1. **Code is precedent** — Existence is approval, deletion is rejection
2. **Survival is the vote** — Patterns that persist become canonical
3. **Never interrupt flow** — No approval dialogs, silent observation

**The Seven Laws (v5.0, still valid):**
1. Filesystem is Truth
2. Type Dictates Physics
3. Zone is Layout, Not Business Logic
4. Status Propagates
5. One Good Reason > 15% Silent Mutiny
6. Never Refuse Outright
7. Let Artists Stay in Flow

### C. Performance Benchmarks

| Operation | v5.0 | v6.0 Target | Strategy |
|-----------|------|-------------|----------|
| Framework lookup | 200ms (JIT grep) | <5ms | Pre-computed workshop |
| Component scan | 50ms | <50ms | ripgrep (unchanged) |
| Pattern observation | N/A | <10ms | PostToolUse hook |
| Index rebuild | N/A | <2s | Incremental updates |
| Cold start | Empty room | <1s | Virtual Sanctuary |

---

*SDD Generated: 2026-01-08*
*Sources: PRD v6.0.0, sigil-v3.1.zip context*
*Next Step: `/sprint-plan` for detailed sprint breakdown*
