# Product Requirements Document: Sigil v7.5 "The Reference Studio"

> *"Control the patterns, not the files."*

**Version:** 7.5.0
**Codename:** The Reference Studio
**Status:** PRD Draft
**Date:** 2026-01-09
**Supersedes:** Sigil v6.1.0 "Agile Muse" PRD
**Sources:**
- `loa-grimoire/context/sigil-v7.5-reference/` (Architecture spec)
- `.sigil/feedback-notes.md` (Real-world learnings from S&F)
- Vercel blog: "We removed 80% of our agent's tools"

---

## 1. Executive Summary

Sigil v7.5 "The Reference Studio" evolves from v6.1's survival-based tracking to **registry-based authority** with **contagion rules**. The key insight: don't control file state, control pattern flow.

**What v6.1 Got Right:**
- Pre-computed workshop index (<5ms)
- Non-blocking observation
- Survival-based pattern tracking
- Flow preservation

**What v6.1 Lacks:**
- Enforcement teeth (tracking without action)
- Contagion protection (Draft can infect Gold)
- Design tooling expertise (agent fumbles CLI tools)
- Performance optimization (4-10 min batch processing)

**The v7.5 Solution:**

| v6.1 Gap | v7.5 Fix |
|----------|----------|
| Pattern tracking without enforcement | Registry-based authority + ESLint |
| No contagion rules | Gold → Gold only, Draft quarantined |
| Manual promotion via `/approve` | Nomination PRs, human merges |
| Missing CLI expertise | `principles/` knowledge layer |
| Sequential execution | Parallel + background by default |

**Projected Impact:**

| Metric | v6.1 | v7.5 Target |
|--------|------|-------------|
| Promotion friction | Low (1 command) | Zero (1 line change) |
| Contagion violations | Untracked | 0 in Gold |
| Image processing success | ~70% | >95% |
| Batch processing time | 4-10 min | <1 min |
| Stream latency | N/A | <100ms |

---

## 2. Problem Statement

### 2.1 The v7.4 Fatal Error

Before arriving at v7.5, we must understand what v7.4 got wrong:

> "Moving a file changes its identity (path). In a large repo, moving a foundational component requires updating potentially thousands of imports."
> — Staff Design Engineer

v7.4 proposed directory-based authority:
- `src/draft/Button.tsx` → `src/silver/Button.tsx` → `src/gold/Button.tsx`
- **Fatal flaw:** Each promotion requires codebase-wide refactoring

v7.4 also proposed:
- 500ms atomic wait before streaming → feels dead
- Auto-evolve >95% confidence → destroys trust
- Subagent swarms → fragments context
- CI-block Draft → forces bypass

### 2.2 Current v6.1 Gaps (from S&F Usage)

Real-world usage on Set & Forgetti revealed:

**Performance:**
- 143 frames × 5 tiers animated WebP: 4-10 minutes
- Sequential execution blocks flow
- No background processing for long operations

**Design Tooling:**
- Agent fumbles through ImageMagick flags
- SVG transparency issues took multiple iterations
- ffmpeg vs ImageMagick for animated WebP not known
- OKLCH color space expertise missing

**Architecture:**
- Pattern tracking in survival.json has no enforcement
- No protection against Draft patterns infecting Gold
- Nomination requires explicit `/approve` command

**User Experience:**
- Skills feel like commands, not natural language
- Reference capture is ephemeral (Uniswap, Family examples lost)
- No design variant storage (Figma-like)

---

## 3. Vision & Goals

### 3.1 Vision

Sigil becomes the **complete design workflow assistant**:

1. **Design System Guardian** — Physics, zones, patterns (existing)
2. **Design Tooling Expert** — ImageMagick, SVG, color, motion
3. **Performance Optimizer** — Parallel, background, vips
4. **Human Sovereignty Protector** — Nomination, not automation

### 3.2 Goals

| Goal | Metric | Target |
|------|--------|--------|
| Zero refactoring on promotion | Files modified | 0 (1-line registry change) |
| Instant response | Stream start latency | <100ms |
| Human sovereignty | Auto-promotions | Never |
| Flow preservation | Blocking operations | Background by default |
| Design expertise | Image processing success | >95% first attempt |
| Batch performance | 143 frames × 5 tiers | <1 minute |

### 3.3 Non-Goals

- Replacing design teams
- Full CI/CD integration (v8.0)
- Multi-tenant workflows (v8.0)
- Design variant storage (captured, deferred)

---

## 4. Core Architecture Changes

### 4.1 Registry-Based Authority

**Before (v6.1):** Pattern status in survival.json
**After (v7.5):** Registry files define authority

```
src/
├── components/              # ALL components (stable paths, never move)
│   ├── Button.tsx
│   ├── CriticalButton.tsx
│   └── ExperimentalNav.tsx
├── gold/
│   └── index.ts            # Registry: exports blessed components
├── silver/
│   └── index.ts            # Registry: exports proven components
└── draft/
    └── index.ts            # Registry: exports experimental
```

**Gold Registry Example:**
```typescript
// src/gold/index.ts — THE CANON
// This file is the ONLY thing that defines "Gold"

export { CriticalButton } from '../components/CriticalButton';
export { Button } from '../components/Button';
export { Card } from '../components/Card';

// To promote: Add export line (1 line change)
// To demote: Remove export line (1 line change)
// Components NEVER move
```

**Benefits:**
- Zero refactoring on promotion/demotion
- Imports never break
- Git blame stays clean
- TypeScript enforces the graph

### 4.2 Contagion Rules

**The Model:**

| From ↓ / To → | Gold | Silver | Draft | Features |
|---------------|------|--------|-------|----------|
| **Gold** | ✅ | ❌ | ❌ | ✅ |
| **Silver** | ✅ | ✅ | ❌ | ✅ |
| **Draft** | ✅ | ✅ | ✅ | ✅ |
| **Features** | ✅ | ✅ | ✅ | ✅ |

**Principle:** Draft can exist and be merged. But Gold cannot depend on Draft. Quarantine, not blockade.

**Enforcement:**
```javascript
// eslint-plugin-sigil
module.exports = {
  rules: {
    'sigil/gold-imports-only': 'error',
    'sigil/no-gold-imports-draft': 'error',
  },
};
```

### 4.3 Speculative Streaming

**Before:** Agent thinks, validates, then outputs
**After:** Agent streams immediately, validates in parallel

**Protocol:**
1. Start streaming at 0ms (no wait)
2. Sentinel validates in parallel
3. If violation detected mid-stream:
   - Insert rollback marker
   - Continue with corrected version

```typescript
// User sees:
export function ClaimButton() {
  return <button onClick={...  // ← Sentinel detects violation

<!-- Sigil: Reverting to Gold pattern -->

export function ClaimButton() {
  return <CriticalButton onClick={...  // ← Corrected
```

**Why:** Movement feels faster than stalling, even when correcting.

### 4.4 Nomination Pattern

**Before (v6.1):** survival.json tracks, `/approve` promotes
**After (v7.5):** Agent nominates via PR, human merges

**Flow:**
1. Agent identifies pattern: >95% score, 5+ uses, 0 mutinies
2. Agent opens Nomination PR with evidence
3. Human reviews and merges (approve) or closes (reject)

**Auto-Demotion:**
- Gold component modified without `sanctify` label
- Automatically demoted to Silver
- Must re-earn Gold through stability

**Principle:** Human remains sovereign. Agent nominates, never promotes.

---

## 5. Design Tooling Expertise

### 5.1 Rationale

Per Vercel's "80% tools removed" insight:
- Fewer skills, better data structures
- Agent reasons over good documentation
- Skills are thin orchestration, not complex logic

### 5.2 Principles Layer

```
sigil-mark/principles/
├── motion-implementation.md   # CSS-first (Emil), Framer when needed
├── image-tooling.md           # ImageMagick, animated WebP, composition
├── color-oklch.md             # OKLCH, palette generation, Tailwind
└── svg-patterns.md            # ClipPath gotchas, viewBox, transparency
```

### 5.3 Key Knowledge to Encode

**Image Tooling:**
```markdown
## Animated WebP with Transparency

WRONG: ffmpeg (corrupts alpha → white flash)
RIGHT: ImageMagick all the way

# Workflow that works:
1. Composite frames: magick -compose Over
2. Resize frames: magick -resize 400x
3. Encode WebP: magick -delay 4 -loop 0 frames/*.png output.webp
```

**Motion Implementation:**
```markdown
## Decision Tree

Simple state change (hover, focus)? → CSS transitions
Needs orchestration (stagger)? → Framer Motion
Needs spring physics? → Framer Motion
Exit animation? → Framer Motion (AnimatePresence)
Everything else? → CSS first (90% of cases)
```

**Color (OKLCH):**
```markdown
## When to Use OKLCH

- Generating palettes (perceptually uniform)
- Lightness/darkness scales
- Accessible contrast calculations
- Tailwind: oklch(var(--l) var(--c) var(--h))
```

---

## 6. Performance Optimization

### 6.1 Parallel by Default

**Before:** Sequential loops
**After:** GNU parallel for batch operations

```bash
# Slow: sequential
for f in *.png; do magick "$f" -resize 400x "out/$f"; done

# Fast: parallel
parallel magick {} -resize 400x out/{/} ::: *.png
```

### 6.2 Background for Long Operations

Operations >30s should run in background:
- `run_in_background: true`
- Notify when done
- Don't block flow

### 6.3 Tool Selection

| Operation | Tool | Speed |
|-----------|------|-------|
| Basic resize/crop | ImageMagick | Baseline |
| Batch operations | ImageMagick + parallel | 2-4x |
| Heavy image work | vips (libvips) | 5-10x |
| Video/real-time | Rust + Metal | 50x+ (overkill for most) |

**Default:** Bash + parallel covers 90% of cases.

---

## 7. Implementation Phases

### Phase 1: Registry Authority (Week 1)

- [ ] Create registry files: `src/gold/index.ts`, `src/silver/index.ts`, `src/draft/index.ts`
- [ ] Update CLAUDE.md: Read registry first
- [ ] ESLint plugin: `gold-imports-only`, `no-gold-imports-draft`
- [ ] Migrate existing Gold components to registry

### Phase 2: Design Tooling (Week 2)

- [ ] `principles/image-tooling.md`
- [ ] `principles/color-oklch.md`
- [ ] `principles/svg-patterns.md`
- [ ] Update agent to reference principles contextually

### Phase 3: Performance (Week 3)

- [ ] Default to `parallel` for batch operations
- [ ] Background execution for >30s operations
- [ ] Document vips as alternative
- [ ] Optimize frame processing workflow

### Phase 4: Streaming & Nomination (Week 4)

- [ ] Speculative streaming protocol
- [ ] Sentinel validation in parallel
- [ ] Rollback markers
- [ ] Nomination PR generation
- [ ] Auto-demotion on modification

---

## 8. File Structure (Final)

```
.sigil/
├── taste-profile.yaml       # Physics, zones, vocabulary
├── workshop.json            # Pre-computed index
├── survival.json            # Pattern tracking (historical)
└── feedback-notes.md        # Ongoing observations

src/
├── components/              # ALL components (stable paths)
├── gold/index.ts            # Gold registry
├── silver/index.ts          # Silver registry
└── draft/index.ts           # Draft registry

sigil-mark/
├── moodboard/               # Visual references
├── principles/              # Expert knowledge
│   ├── motion-implementation.md
│   ├── image-tooling.md
│   ├── color-oklch.md
│   └── svg-patterns.md
├── context/                 # Drop-in research
└── rules.md                 # Design rules

eslint-plugin-sigil/
├── index.js
└── rules/
    ├── gold-imports-only.js
    └── no-gold-imports-draft.js

CLAUDE.md                    # Agent instructions
```

---

## 9. Success Metrics

| Metric | v6.1 | v7.5 Target | How to Measure |
|--------|------|-------------|----------------|
| Promotion refactoring | N/A | 0 files | Count files changed |
| Stream latency | N/A | <100ms | Time to first token |
| Auto-promotions | 0 | 0 | Should stay 0 |
| Image success rate | ~70% | >95% | First-attempt success |
| Batch time | 4-10 min | <1 min | Wall clock |
| Contagion violations | Unknown | 0 | ESLint errors in Gold |

---

## 10. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Registry migration breaks imports | Medium | High | Incremental, test each step |
| ESLint too strict | Low | Medium | Start warnings, escalate |
| Streaming complexity | Medium | Medium | Simple rollback first |
| Principles bloat | Medium | Low | Keep focused, prune |

---

## 11. Open Questions

1. **Survival.json fate:** Keep for history, or fully replace?
2. **Sanctify label:** GitHub label or comment?
3. **Nomination PR format:** What evidence most useful?
4. **Principles organization:** One file per topic?

---

## 12. Appendix: Key Quotes

> "Stop trying to control the state of the code. Control the flow of the patterns."
> — Principal Engineer

> "The best agents might be the ones with the fewest tools."
> — Vercel Engineering

> "Moving a file changes its identity. Promoting Button could touch hundreds of files."
> — Staff Design Engineer

> "Movement is better than stalling. Even seeing correction feels faster than blank screen."
> — v7.5 Architecture

---

*PRD generated with Loa /plan-and-analyze*
*Synthesized from v7.5 reference architecture and real-world S&F feedback*
*Date: 2026-01-09*
