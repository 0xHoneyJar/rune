# Sigil-Mark Cleanup Proposal

> "Clarity over legacy. If it's not used, it's confusion."

**Status:** PROPOSAL
**Date:** 2026-01-10
**Problem:** sigil-mark/ has 30+ directories from multiple architecture versions, making it confusing for users

---

## Current State Analysis

### Directory Inventory (30 directories)

| Directory | Files | Status | Verdict |
|-----------|-------|--------|---------|
| `.archive-v1.0` | 28 | **Archived** | ✅ Keep (clearly labeled) |
| `.sigil-observations` | ? | **Unknown** | 🔴 Archive or delete |
| `__examples__` | 4 | **Active** | ✅ Keep |
| `__tests__` | 42 | **Active** | ✅ Keep |
| `canon` | 0 (empty subdirs) | **Empty** | 🔴 Delete |
| `codebase` | 0 | **Empty** | 🔴 Delete |
| `components` | 1 | **Legacy v3** | 🟡 Archive |
| `constitution` | 2 | **Active** | ✅ Keep (schemas) |
| `consultation-chamber` | 2 | **Legacy v4** | 🟡 Archive |
| `core` | 11 | **Active** | ✅ Keep (runtime) |
| `evidence` | 2 | **Legacy v4** | 🟡 Archive |
| `governance` | 1 (empty) | **Legacy v5** | 🟡 Archive |
| `hooks` | 5 | **Active** | ✅ Keep (runtime) |
| `kernel` | 6 | **Active** | ✅ Keep (agent config) |
| `knowledge` | 0 | **Empty** | 🔴 Delete |
| `layouts` | 5 | **Active** | ✅ Keep (runtime) |
| `lens-array` | 2 | **Legacy v3** | 🟡 Archive |
| `lenses` | 16 | **Active** | ✅ Keep (runtime) |
| `moodboard` | 11 | **Active** | ✅ Keep (user content) |
| `node_modules` | 4356 | **Deps** | ✅ Keep (gitignored) |
| `personas` | 2 | **Legacy v4** | 🟡 Archive |
| `process` | 37 | **Active** | ✅ Keep (agent) |
| `providers` | 3 | **Active** | ✅ Keep (runtime) |
| `remote-config` | 2 | **Legacy v4** | 🟡 Archive |
| `scripts` | 3 | **Utilities** | ✅ Keep |
| `sigil-mark` | 0 (nested) | **Empty** | 🔴 Delete |
| `skills` | 6 | **Legacy?** | 🟡 Review |
| `soul-binder` | 2 | **Legacy v3** | 🟡 Archive |
| `surveys` | 2 | **Legacy v4** | 🟡 Archive |
| `types` | 3 | **Active** | ✅ Keep (shared types) |
| `vocabulary` | 2 | **Active** | ✅ Keep (agent config) |
| `zones` | 1 | **Legacy v3** | 🟡 Archive |

---

## Verdict Summary

| Action | Count | Directories |
|--------|-------|-------------|
| **Keep (Active)** | 15 | core, hooks, layouts, lenses, providers, types, process, kernel, vocabulary, constitution, moodboard, __tests__, __examples__, scripts, .archive-v1.0 |
| **Archive (Legacy)** | 11 | components, consultation-chamber, evidence, governance, lens-array, personas, remote-config, skills, soul-binder, surveys, zones, .sigil-observations |
| **Delete (Empty)** | 4 | canon, codebase, knowledge, sigil-mark (nested) |

---

## Proposed Structure

```
sigil-mark/
├── .archive/                    # All legacy versions in one place
│   ├── v1.0/                   # Original architecture
│   ├── v3.0/                   # Lens-array, soul-binder era
│   └── v4.0/                   # Consultation-chamber, surveys era
│
├── agent/                       # Agent-time (generation)
│   ├── kernel/                 # Constitution, fidelity, vocabulary, workflow
│   ├── process/                # Workshop, survival, physics validation
│   └── skills/                 # If still needed
│
├── runtime/                     # Browser runtime
│   ├── core/                   # useCriticalAction, proprioception
│   ├── hooks/                  # useServerTick
│   ├── layouts/                # CriticalZone, MachineryLayout, GlassLayout
│   ├── lenses/                 # DefaultLens, StrictLens, A11yLens
│   ├── providers/              # SigilProvider
│   └── types/                  # Shared types
│
├── moodboard/                   # User-curated design references
│   ├── sandbox/                # Local experimentation (gitignored)
│   ├── references/             # Curated inspiration
│   └── anti-patterns/          # What to avoid
│
├── __examples__/               # Usage examples
├── __tests__/                  # Test suite
├── scripts/                    # Build utilities
│
├── index.ts                    # Main exports
├── package.json
└── README.md
```

### Key Changes

1. **Single archive directory** — All legacy versions under `.archive/`
2. **Clear agent/runtime split** — Two top-level concerns
3. **Moodboard stays top-level** — The core "user work" you mentioned
4. **Delete empty directories** — No confusion from ghost folders

---

## User Mental Model

After cleanup, users understand:

```
sigil-mark/
├── moodboard/     ← "My design taste goes here"
├── agent/         ← "Agent reads this during generation"
├── runtime/       ← "My app imports from here"
└── .archive/      ← "Old stuff, ignore"
```

---

## Migration Impact

### Import Changes

```typescript
// Before (confusing)
import { useCriticalAction } from 'sigil-mark/core';
import { CriticalZone } from 'sigil-mark/layouts';
import { readConstitution } from 'sigil-mark/process';

// After (clear)
import { useCriticalAction } from 'sigil-mark/runtime/core';
import { CriticalZone } from 'sigil-mark/runtime/layouts';
import { readConstitution } from 'sigil-mark/agent/process';

// OR: Keep main index.ts as facade
import { useCriticalAction, CriticalZone } from 'sigil-mark';
```

### Recommended: Facade Pattern

Keep `index.ts` as the primary export surface. Internal restructuring doesn't break imports:

```typescript
// sigil-mark/index.ts (facade)
export * from './runtime/core';
export * from './runtime/layouts';
export * from './runtime/lenses';
// Process exports only for agent context
export type { Constitution } from './agent/process';
```

---

## Implementation Plan

### Sprint 1: Archive Legacy

1. Create `.archive/v3.0/` and `.archive/v4.0/`
2. Move legacy directories
3. Delete empty directories
4. Update .gitignore if needed

### Sprint 2: Restructure Active

1. Create `agent/` and `runtime/` directories
2. Move active code
3. Update internal imports
4. Verify tests pass

### Sprint 3: Update Exports

1. Update `index.ts` facade
2. Add path aliases in tsconfig
3. Update CLAUDE.md documentation
4. Update README

### Sprint 4: Verification

1. Run full test suite
2. Build and verify bundle
3. Test imports from consuming projects
4. Update any external documentation

---

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| Breaking imports | Facade pattern, path aliases |
| Missing active code | Comprehensive grep for imports before moving |
| Archive needed code | Keep .archive tracked, easy to restore |
| Documentation drift | Update CLAUDE.md in same PR |

---

## Decision Points

Before proceeding, confirm:

1. **Archive vs Delete legacy?** — Proposal keeps archive for safety
2. **agent/runtime naming?** — Alternative: `generation/` and `browser/`
3. **Moodboard location?** — Keep top-level or move under user/ ?
4. **Timeline?** — Do all sprints or just Sprint 1 (archive only)?

---

## Appendix: File-by-File Audit

### Directories to Archive

```
consultation-chamber/
├── config.yaml          # Consultation settings
├── decisions/           # Empty
└── schemas/             # JSON schemas

evidence/
├── evidence-schema.json
└── README.md

governance/
├── amendments/          # Empty
└── justifications.log   # Empty file

lens-array/
├── lens-array.schema.json
└── README.md

personas/
├── personas.yaml
└── README.md

remote-config/
├── remote-soul.yaml
└── README.md

soul-binder/
├── philosophy.yaml
└── schemas/

surveys/
├── surveys.yaml
└── README.md

zones/
└── zones.yaml

.sigil-observations/
└── (unknown contents)
```

### Directories to Delete

```
canon/
├── components/          # Empty
└── patterns/            # Empty

codebase/                # Empty

knowledge/               # Empty

sigil-mark/              # Empty (nested duplicate)
```

---

*Sigil Cleanup Proposal v1.0*
*Ready for review*
