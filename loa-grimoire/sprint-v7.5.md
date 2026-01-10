# Sprint Plan: Sigil v7.5 "The Reference Studio"

> *"Control the patterns, not the files."*

**Version:** 1.0
**Date:** 2026-01-09
**PRD:** `loa-grimoire/prd-v7.5.md`
**SDD:** `loa-grimoire/sdd-v7.5.md`

---

## Overview

| Attribute | Value |
|-----------|-------|
| Team | Solo (developer + Claude) |
| Duration | Flexible (continuous) |
| MVP Scope | All 4 phases |
| Sequence | Phase 1 → 2 → 3 → 4 |

### Sprint Summary

| Sprint | Focus | Tasks | Critical Path |
|--------|-------|-------|---------------|
| **1** | Registry Authority | 6 | Yes (foundation) |
| **2** | Design Tooling | 5 | No |
| **3** | Performance | 4 | No |
| **4** | Streaming & Nomination | 5 | Depends on Sprint 1 |

---

## Sprint 1: Registry Authority

> **Goal:** Establish registry-based authority with ESLint enforcement

### S1-T1: Create Registry Directory Structure

**Description:** Create the `src/gold/`, `src/silver/`, and `src/draft/` directories with initial `index.ts` files.

**Acceptance Criteria:**
- [ ] `src/gold/index.ts` exists with documented structure
- [ ] `src/silver/index.ts` exists with documented structure
- [ ] `src/draft/index.ts` exists with documented structure
- [ ] Each registry has header comment explaining purpose
- [ ] TypeScript compiles without errors

**Files to Create:**
- `src/gold/index.ts`
- `src/silver/index.ts`
- `src/draft/index.ts`

**Dependencies:** None

---

### S1-T2: Configure Path Aliases

**Description:** Update TypeScript and bundler config to support `@/gold`, `@/silver`, `@/draft` imports.

**Acceptance Criteria:**
- [ ] `tsconfig.json` has paths for `@/gold`, `@/silver`, `@/draft`
- [ ] Bundler config (if applicable) supports aliases
- [ ] Import `from '@/gold'` resolves correctly
- [ ] IDE autocomplete works for registry imports

**Files to Modify:**
- `tsconfig.json`
- `next.config.js` or bundler config (if needed)

**Dependencies:** S1-T1

---

### S1-T3: Populate Gold Registry with Existing Components

**Description:** Identify existing canonical components and export them from Gold registry.

**Acceptance Criteria:**
- [ ] Audit existing components for Gold candidates
- [ ] Add exports for canonical components to `src/gold/index.ts`
- [ ] Each export has JSDoc with `@sigil-zone` and `@sigil-physics`
- [ ] Type exports included for each component
- [ ] No circular dependencies

**Process:**
1. List all components in `src/components/`
2. Identify which are canonical (used widely, stable)
3. Add exports to Gold registry
4. Add JSDoc annotations

**Dependencies:** S1-T1, S1-T2

---

### S1-T4: Create ESLint Plugin

**Description:** Create `eslint-plugin-sigil` with contagion rules.

**Acceptance Criteria:**
- [ ] `eslint-plugin-sigil/` directory exists
- [ ] `package.json` with correct metadata
- [ ] `index.js` exports rules and recommended config
- [ ] `rules/gold-imports-only.js` implemented
- [ ] `rules/no-gold-imports-draft.js` implemented
- [ ] Plugin installable via `npm install ./eslint-plugin-sigil`

**Files to Create:**
- `eslint-plugin-sigil/package.json`
- `eslint-plugin-sigil/index.js`
- `eslint-plugin-sigil/rules/gold-imports-only.js`
- `eslint-plugin-sigil/rules/no-gold-imports-draft.js`

**Dependencies:** S1-T1

---

### S1-T5: Integrate ESLint Plugin

**Description:** Install and configure ESLint plugin in project.

**Acceptance Criteria:**
- [ ] Plugin installed as dev dependency
- [ ] `.eslintrc.js` includes `sigil` plugin
- [ ] Rules `sigil/gold-imports-only` and `sigil/no-gold-imports-draft` enabled
- [ ] `npm run lint` catches contagion violations
- [ ] No false positives on valid imports

**Files to Modify:**
- `package.json` (add dependency)
- `.eslintrc.js` or `eslint.config.js`

**Dependencies:** S1-T4

---

### S1-T6: Update CLAUDE.md with Registry Instructions

**Description:** Add registry-first instructions to CLAUDE.md.

**Acceptance Criteria:**
- [ ] "Read `src/gold/index.ts` first" instruction added
- [ ] Authority hierarchy documented (Gold > Silver > Draft)
- [ ] Contagion rules documented
- [ ] Example workflow added
- [ ] Nomination protocol documented

**Files to Modify:**
- `CLAUDE.md`

**Dependencies:** S1-T1

---

### Sprint 1 Completion Criteria

- [ ] All 6 tasks completed
- [ ] `npm run lint` passes with no contagion violations
- [ ] Agent reads Gold registry first on UI tasks
- [ ] Promotion is 1-line change (add export)
- [ ] Gold cannot import Silver or Draft (enforced)

---

## Sprint 2: Design Tooling

> **Goal:** Establish expert knowledge layer for design CLI tools

### S2-T1: Create Image Tooling Principles

**Description:** Document ImageMagick recipes, animated WebP patterns, composition workflows.

**Acceptance Criteria:**
- [ ] `sigil-mark/principles/image-tooling.md` created
- [ ] ImageMagick transparency patterns documented
- [ ] Animated WebP workflow documented (magick, not ffmpeg)
- [ ] Composition patterns documented
- [ ] Batch processing with `parallel` documented
- [ ] vips mentioned as high-performance alternative

**Key Content:**
```markdown
## Animated WebP with Transparency
- WRONG: ffmpeg (corrupts alpha)
- RIGHT: magick -delay X -loop 0 frames/*.png output.webp

## Batch Processing
- parallel magick {} -resize 400x out/{/} ::: *.png
```

**Files to Create:**
- `sigil-mark/principles/image-tooling.md`

**Dependencies:** None

---

### S2-T2: Create OKLCH Color Principles

**Description:** Document OKLCH color space usage, palette generation, Tailwind integration.

**Acceptance Criteria:**
- [ ] `sigil-mark/principles/color-oklch.md` created
- [ ] OKLCH vs HSL vs RGB comparison
- [ ] Palette generation patterns
- [ ] Lightness/chroma relationships
- [ ] Tailwind CSS integration patterns
- [ ] Browser support notes

**Key Content:**
```markdown
## When to Use OKLCH
- Generating palettes (perceptually uniform)
- Lightness scales
- Accessible contrast calculations
```

**Files to Create:**
- `sigil-mark/principles/color-oklch.md`

**Dependencies:** None

---

### S2-T3: Create SVG Patterns Principles

**Description:** Document SVG gotchas, clipPath issues, viewBox patterns.

**Acceptance Criteria:**
- [ ] `sigil-mark/principles/svg-patterns.md` created
- [ ] ClipPath fill gotchas documented
- [ ] viewBox best practices
- [ ] Stroke vs fill patterns
- [ ] Transparency preservation
- [ ] Optimization with svgo

**Key Content:**
```markdown
## Common SVG Gotchas
- clipPath with fill="white" causes transparency loss
- viewBox must match actual dimensions
- Use currentColor for themeable icons
```

**Files to Create:**
- `sigil-mark/principles/svg-patterns.md`

**Dependencies:** None

---

### S2-T4: Enhance Motion Implementation Principles

**Description:** Expand existing motion-implementation.md with more patterns.

**Acceptance Criteria:**
- [ ] Review existing `motion-implementation.md`
- [ ] Add more CSS patterns (keyframes, transitions)
- [ ] Add Framer Motion patterns (variants, gestures)
- [ ] Add performance tips (will-change, compositor)
- [ ] Add reduced motion handling

**Files to Modify:**
- `sigil-mark/principles/motion-implementation.md`

**Dependencies:** None

---

### S2-T5: Create Principles Index

**Description:** Create index file documenting all principles and when to use them.

**Acceptance Criteria:**
- [ ] `sigil-mark/principles/README.md` created (or index)
- [ ] Lists all principle files
- [ ] Describes when agent should load each
- [ ] Provides quick reference for each topic

**Files to Create:**
- `sigil-mark/principles/README.md`

**Dependencies:** S2-T1, S2-T2, S2-T3, S2-T4

---

### Sprint 2 Completion Criteria

- [ ] All 5 tasks completed
- [ ] 4 principle files exist with comprehensive content
- [ ] Index documents when to use each
- [ ] Agent can reference principles contextually

---

## Sprint 3: Performance

> **Goal:** Establish performance defaults for batch operations

### S3-T1: Document Parallel Processing Patterns

**Description:** Create reference for GNU parallel usage in image/file operations.

**Acceptance Criteria:**
- [ ] Parallel patterns added to `image-tooling.md`
- [ ] Examples for common operations (resize, convert, composite)
- [ ] Comparison: sequential vs parallel timing
- [ ] Installation notes for `parallel`

**Key Content:**
```bash
# Install
brew install parallel

# Pattern
parallel magick {} -resize 400x out/{/} ::: *.png
```

**Files to Modify:**
- `sigil-mark/principles/image-tooling.md`

**Dependencies:** S2-T1

---

### S3-T2: Document Background Execution

**Description:** Document when and how to use background execution for long operations.

**Acceptance Criteria:**
- [ ] Background execution guidance in CLAUDE.md
- [ ] Threshold documented (>30s → background)
- [ ] `run_in_background: true` usage documented
- [ ] Notification pattern documented

**Content to Add:**
```markdown
## Background Execution
Operations >30s should run in background:
- Use `run_in_background: true`
- Notify user when complete
- Don't block flow
```

**Files to Modify:**
- `CLAUDE.md`

**Dependencies:** None

---

### S3-T3: Document vips as Alternative

**Description:** Add vips (libvips) documentation for high-performance image processing.

**Acceptance Criteria:**
- [ ] vips section added to `image-tooling.md`
- [ ] Installation instructions
- [ ] Common operations in vips
- [ ] When to use vips vs ImageMagick
- [ ] Performance comparison (5-10x faster)

**Key Content:**
```bash
# Install
brew install vips

# Usage
vips resize input.png output.png 0.5
vips webpsave input.png output.webp
```

**Files to Modify:**
- `sigil-mark/principles/image-tooling.md`

**Dependencies:** S2-T1

---

### S3-T4: Create Performance Quick Reference

**Description:** Create quick reference card for performance patterns.

**Acceptance Criteria:**
- [ ] Performance section in CLAUDE.md or separate file
- [ ] Tool selection guide (ImageMagick vs parallel vs vips)
- [ ] Operation thresholds (when to background)
- [ ] Common optimizations listed

**Content:**
```markdown
## Performance Quick Reference

| Operation | Tool | When |
|-----------|------|------|
| Single image | magick | Always |
| Batch (<10) | magick loop | Simple cases |
| Batch (>10) | parallel | Default |
| Heavy work | vips | Large files, many ops |
| >30 seconds | background | Always |
```

**Files to Modify:**
- `CLAUDE.md`

**Dependencies:** S3-T1, S3-T2, S3-T3

---

### Sprint 3 Completion Criteria

- [ ] All 4 tasks completed
- [ ] Agent uses `parallel` for batch by default
- [ ] Long operations run in background
- [ ] vips documented as alternative
- [ ] Quick reference available

---

## Sprint 4: Streaming & Nomination

> **Goal:** Implement nomination workflow and Sentinel validation

### S4-T1: Create Registry Parser

**Description:** Implement TypeScript utility to parse registry files.

**Acceptance Criteria:**
- [ ] `sigil-mark/process/registry-parser.ts` created
- [ ] Parses exports from registry files
- [ ] Extracts JSDoc annotations (@sigil-zone, @sigil-physics)
- [ ] Returns typed `RegistryState` object
- [ ] Handles missing files gracefully
- [ ] Unit tests pass

**Files to Create:**
- `sigil-mark/process/registry-parser.ts`

**Dependencies:** Sprint 1 complete

---

### S4-T2: Create Sentinel Validator

**Description:** Implement PreToolUse validation against registries.

**Acceptance Criteria:**
- [ ] `sigil-mark/process/sentinel-validator.ts` created
- [ ] Validates contagion rules
- [ ] Validates physics compliance
- [ ] Returns typed `ValidationResult[]`
- [ ] Distinguishes error vs warning severity
- [ ] Unit tests pass

**Files to Create:**
- `sigil-mark/process/sentinel-validator.ts`

**Dependencies:** S4-T1

---

### S4-T3: Create PreToolUse Hook

**Description:** Integrate Sentinel into Claude Code hooks.

**Acceptance Criteria:**
- [ ] `.claude/hooks/pre-tool-use.yaml` created
- [ ] Hook triggers on Write/Edit tools
- [ ] Loads registries and validates
- [ ] Blocks on contagion errors
- [ ] Warns on physics issues
- [ ] Hook executes in <50ms

**Files to Create:**
- `.claude/hooks/pre-tool-use.yaml`

**Dependencies:** S4-T2

---

### S4-T4: Create Nomination Generator

**Description:** Implement nomination identification and PR generation.

**Acceptance Criteria:**
- [ ] `sigil-mark/process/nomination-generator.ts` created
- [ ] Identifies patterns meeting criteria (5+ uses, 95%+ score, 0 mutinies)
- [ ] Generates nomination PR body
- [ ] Includes evidence (uses, files, score)
- [ ] PR body is well-formatted markdown

**Files to Create:**
- `sigil-mark/process/nomination-generator.ts`

**Dependencies:** S4-T1

---

### S4-T5: Document Nomination Workflow

**Description:** Add nomination and demotion workflow to CLAUDE.md.

**Acceptance Criteria:**
- [ ] Nomination protocol documented
- [ ] "Never auto-promote" rule emphasized
- [ ] Evidence requirements listed
- [ ] Demotion triggers documented
- [ ] Sanctify label explained

**Content:**
```markdown
## Nomination (Never Auto-Promote)

When you identify a pattern ready for promotion:
1. Collect evidence: Uses, consistency, files
2. Propose nomination: Suggest adding to registry
3. Wait for human approval: Never modify registry yourself

## Auto-Demotion

Gold components modified without `sanctify` label → demoted to Silver
```

**Files to Modify:**
- `CLAUDE.md`

**Dependencies:** S4-T4

---

### Sprint 4 Completion Criteria

- [ ] All 5 tasks completed
- [ ] Registry parser works correctly
- [ ] Sentinel validates before writes
- [ ] Contagion violations blocked
- [ ] Nomination workflow documented
- [ ] Agent never auto-promotes

---

## MVP Definition

### Included in MVP (All 4 Sprints)

| Feature | Sprint | Status |
|---------|--------|--------|
| Registry-based authority | 1 | Required |
| ESLint contagion enforcement | 1 | Required |
| Path aliases (@/gold) | 1 | Required |
| Image tooling principles | 2 | Required |
| Color (OKLCH) principles | 2 | Required |
| SVG patterns principles | 2 | Required |
| Motion principles | 2 | Required |
| Parallel processing | 3 | Required |
| Background execution | 3 | Required |
| vips documentation | 3 | Required |
| Registry parser | 4 | Required |
| Sentinel validator | 4 | Required |
| PreToolUse hook | 4 | Required |
| Nomination generator | 4 | Required |

### Deferred (Post-MVP)

| Feature | Reason |
|---------|--------|
| Design variant storage | Captured in feedback, lower priority |
| Reference capture workflow | Needs more design |
| CI/CD integration | v8.0 scope |
| Multi-tenant workflows | v8.0 scope |

---

## Success Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Promotion friction | 0 files changed | Count files on promotion |
| Contagion violations | 0 in Gold | ESLint errors |
| Image success rate | >95% | First-attempt success |
| Batch time | <1 min | Wall clock for 143×5 frames |
| Sentinel latency | <50ms | Hook execution time |

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Registry migration breaks imports | Medium | High | Incremental, test each component |
| ESLint false positives | Low | Medium | Start with warnings |
| Hook performance | Low | Medium | Keep validation simple |
| Principles bloat | Medium | Low | Review and prune regularly |

---

## Execution Order

```
Sprint 1 (Foundation)
    │
    ├── S1-T1: Registry directories
    ├── S1-T2: Path aliases
    ├── S1-T3: Populate Gold registry
    ├── S1-T4: ESLint plugin
    ├── S1-T5: Integrate ESLint
    └── S1-T6: Update CLAUDE.md
    │
    ▼
Sprint 2 (Design Tooling) ─────────────────┐
    │                                       │
    ├── S2-T1: Image tooling               │
    ├── S2-T2: OKLCH colors                │ Can run in
    ├── S2-T3: SVG patterns                │ parallel with
    ├── S2-T4: Motion principles           │ Sprint 3
    └── S2-T5: Principles index            │
    │                                       │
    ▼                                       │
Sprint 3 (Performance) ◄───────────────────┘
    │
    ├── S3-T1: Parallel patterns
    ├── S3-T2: Background execution
    ├── S3-T3: vips documentation
    └── S3-T4: Performance reference
    │
    ▼
Sprint 4 (Streaming & Nomination)
    │
    ├── S4-T1: Registry parser
    ├── S4-T2: Sentinel validator
    ├── S4-T3: PreToolUse hook
    ├── S4-T4: Nomination generator
    └── S4-T5: Nomination workflow docs
    │
    ▼
MVP COMPLETE
```

---

## Quick Start

To begin implementation:

```
/implement sprint-1
```

---

*Sprint plan generated with Loa /sprint-plan*
*Based on PRD and SDD for Sigil v7.5*
*Date: 2026-01-09*
