# Product Requirements Document: Sigil v6.0.0 "Native Muse"

> *"Code is precedent. Survival is approval. Creativity needs no permission."*

**Version:** 6.0.0
**Codename:** Native Muse
**Status:** PRD Complete
**Date:** 2026-01-08
**Sources:** sigil-v3.1.zip context

---

## 1. Executive Summary

Sigil v6.0.0 "Native Muse" evolves the v5.0 constitutional framework into a survival-based design context system. Artists describe feel, agents handle implementation, and flow is never interrupted.

**Key Evolution from v5.0:**
- Pre-computed workshop index (5ms lookups vs JIT grep)
- Survival-based approval (code existence = precedent)
- Virtual Sanctuary for cold starts
- Context forking for ephemeral exploration
- No approval dialogs — silent observation

**The Three Laws (extending Seven Laws):**
1. **Code is precedent** — Existence is approval, deletion is rejection
2. **Survival is the vote** — Patterns that persist become canonical
3. **Never interrupt flow** — No approval dialogs, silent observation

> Source: sigil-v3.1/ARCHITECTURE.md:1-20

---

## 2. Problem Statement

### 2.1 Core Problem

Artists context-switch between "feel-thinking" and "implementation-thinking" dozens of times per session. Every switch breaks creative flow.

```
┌─────────────────────────────────────────────────────────┐
│                    FEEL MODE                            │
│  "This should feel deliberate and trustworthy"          │
│  "Loading should reduce anxiety, not create it"         │
└──────────────────────────┬──────────────────────────────┘
                           │
            Context switch (flow broken)
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                IMPLEMENTATION MODE                      │
│  "How does shadcn Button handle loading?"               │
│  "What's the Radix pattern for dialogs?"                │
│  "How did I do this in the other component?"            │
└─────────────────────────────────────────────────────────┘
```

**Current Pain Points (even in v5.0):**
- JIT grep operations add latency (200ms thinking spinners)
- Approval dialogs interrupt creative momentum
- Cold starts have no taste reference (empty room problem)
- New patterns flagged as concerning when innovation is the job

### 2.2 Why v6.0 Now

v5.0 established the Seven Laws and governance system. v6.0 optimizes for:

| Aspect | v5.0 Approach | v6.0 Solution |
|--------|---------------|---------------|
| Discovery | JIT grep (200ms) | Pre-computed workshop (5ms) |
| Approval | Governance dialogs | Survival observation |
| Cold start | Empty room | Virtual Sanctuary |
| Novelty | Constitutional blocking | Physics-only validation |

> Source: sigil-v3.1/ARCHITECTURE.md:18-40

---

## 3. Vision & Goals

### 3.1 Vision

```
Artists think in feel. Agents handle implementation. Flow is preserved.
```

### 3.2 Goals

| Goal | Success Metric |
|------|----------------|
| Eliminate thinking spinners | Workshop query <5ms |
| Zero flow interruptions | 0 approval dialogs during /craft |
| Cold start taste | Virtual Sanctuary provides context in <1s |
| Pattern survival tracking | Canonical patterns identified within 2 weeks |
| Physics validation | Block violations, not novelty |

### 3.3 Non-Goals

- Replacing React runtime components (SigilProvider, useSigilMutation)
- Changing the Seven Laws kernel files
- Automated code refactoring
- Real-time collaboration features

---

## 4. User Personas

### 4.1 Primary: The Artist

**Profile:** Designer or developer who thinks in feel, not implementation details.

**Needs:**
- Describe "trustworthy claim button" and get correct physics
- Never leave feel-thinking to worry about timing values
- Explore external inspiration without polluting codebase
- Break from precedent when innovation is needed

**Journey:**
```
/craft "trustworthy claim button"
  → Agent resolves: claim → critical zone → deliberate physics
  → Generates with correct timing, no questions asked
  → Artist iterates on feel, not implementation
```

### 4.2 Secondary: The Maintainer

**Profile:** Team lead or senior developer who curates the design system.

**Needs:**
- See which patterns are surviving
- Understand why decisions were made (craft logs)
- Start new design eras when direction shifts
- Sanctify ephemeral patterns into permanent rules

---

## 5. Features & Requirements

### 5.1 Feature 1: Pre-Computed Workshop Index

**Problem:** JIT grep on node_modules takes 200ms. Creates thinking spinner.

**Solution:** Background-maintained index queried in 5ms.

**Requirements:**
- F1.1: Generate `.sigil/workshop.json` with framework exports
- F1.2: Hash-based staleness detection (package.json hash)
- F1.3: Incremental updates via PostToolUse hooks
- F1.4: Query API for framework exports, types, versions
- F1.5: Component signatures from Sanctuary

**Schema:**
```json
{
  "indexed_at": "2026-01-08T14:30:00Z",
  "package_hash": "a1b2c3...",
  "materials": {
    "framer-motion": {
      "version": "11.0.0",
      "exports": ["motion", "AnimatePresence", "useAnimation"],
      "types_available": true
    }
  },
  "components": {
    "ClaimButton": {
      "path": "src/sanctuary/gold/ClaimButton.tsx",
      "tier": "gold",
      "zone": "critical"
    }
  }
}
```

**Acceptance Criteria:**
- [ ] Workshop query returns in <5ms
- [ ] Index rebuilds in <2s on package.json change
- [ ] All imported packages indexed (from src/ imports only)

> Source: sigil-v3.1/ARCHITECTURE.md:185-250

### 5.2 Feature 2: Virtual Sanctuary (Seeding)

**Problem:** New project, empty src/. Agent has no taste reference.

**Solution:** Virtual components until real ones exist.

**Requirements:**
- F2.1: Seed selection UI (Linear-like, Vercel-like, Stripe-like, Blank)
- F2.2: Virtual component definitions in `.sigil/seed.yaml`
- F2.3: Fade behavior when real component created
- F2.4: Seed libraries with physics, materials, components

**Seed Structure:**
```yaml
seed: linear-like
version: 2026.01
virtual_components:
  Button:
    tier: gold
    physics: snappy
    timing: 150ms
    zones: [standard, critical]
  Card:
    tier: gold
    physics: smooth
    timing: 300ms
    zones: [standard]
```

**Acceptance Criteria:**
- [ ] New project has taste from minute zero
- [ ] Virtual components match real component schema
- [ ] Seed fades when real component exists at same path

> Source: sigil-v3.1/ARCHITECTURE.md:120-175

### 5.3 Feature 3: Physics Validation (Not Novelty)

**Problem:** Previous versions flagged new patterns as concerning. Innovation is the job.

**Solution:** Block physics violations only. New patterns are expected.

**What Gets Validated:**
| Check | Example | Action |
|-------|---------|--------|
| API correctness | `motion.div` exists? | Block if invalid |
| Zone constraints | Critical + playful? | Block |
| Material constraints | Clay + 0ms? | Block |
| Fidelity ceiling | 3D in standard? | Block |

**What Does NOT Get Validated:**
| Non-Check | Why |
|-----------|-----|
| Pattern existence | New patterns are the job |
| Style novelty | Experimentation encouraged |
| Component precedent | Survival decides |

**Requirements:**
- F3.1: PreToolUse hook for validation
- F3.2: Zone constraint checking
- F3.3: Material constraint checking
- F3.4: API correctness verification (from workshop)
- F3.5: Never block for pattern novelty

**Acceptance Criteria:**
- [ ] Critical zone with bounce → BLOCK
- [ ] New pattern in critical zone with deliberate physics → ALLOW
- [ ] Invalid API call (motion.animate) → BLOCK with suggestion

> Source: sigil-v3.1/ARCHITECTURE.md:244-295

### 5.4 Feature 4: Survival-Based Precedent

**Problem:** YAML precedent files rot and drift from code.

**Solution:** Code existence IS precedent. grep count = approval level.

**The Rule:**
```
Approved    = exists in src/
Rejected    = doesn't exist in src/
Canonical   = exists 3+ times
Experimental = exists 1 time, < 2 weeks old
```

**Requirements:**
- F4.1: Pattern tagging via JSDoc comments (`@sigil-pattern`)
- F4.2: Gardener script for survival scanning
- F4.3: Survival index at `.sigil/survival.json`
- F4.4: Promotion rules (1 occurrence → experimental, 3+ → canonical)
- F4.5: Rejection detection (was >0, now 0)

**Survival Index:**
```json
{
  "patterns": {
    "useClaimAnimation": {
      "first_seen": "2026-01-08",
      "occurrences": 3,
      "status": "canonical"
    },
    "bouncySpring": {
      "first_seen": "2026-01-05",
      "occurrences": 0,
      "status": "rejected",
      "deleted_at": "2026-01-07"
    }
  }
}
```

**Acceptance Criteria:**
- [ ] New patterns tagged with `@sigil-pattern` and date
- [ ] Gardener detects canonical patterns (3+ occurrences)
- [ ] Deleted patterns marked as rejected
- [ ] Agent prefers canonical over experimental

> Source: sigil-v3.1/ARCHITECTURE.md:420-485

### 5.5 Feature 5: Ephemeral Inspiration

**Problem:** Designers want to reference external sites without polluting codebase.

**Solution:** One-time fetch in forked context. Use it, discard it.

**Flow:**
```
/craft "make it feel like stripe.com"
  ↓
Fork context (Claude Code 2.1)
  ↓
[Forked] Fetch stripe.com
  ↓
[Forked] Extract: gradients, spacing, typography
  ↓
[Forked] Apply to generation
  ↓
Return to main context with generated code only
  ↓
Fetched content discarded (never enters Sanctuary)
```

**Requirements:**
- F5.1: Trigger on "like [url]", "inspired by [url]"
- F5.2: Context fork for isolation
- F5.3: Style extraction (gradients, spacing, typography)
- F5.4: Code generation in main context
- F5.5: Fetched content discarded after use

**Acceptance Criteria:**
- [ ] `/craft "like stripe.com"` fetches and extracts
- [ ] Fetched content never persists
- [ ] Generated code returns to main context
- [ ] `/sanctify` can promote ephemeral to permanent

> Source: sigil-v3.1/ARCHITECTURE.md:296-360

### 5.6 Feature 6: Forge Mode

**Problem:** Precedent creates echo chambers. Sometimes you need to break the pattern.

**Solution:** Explicit mode that ignores survival history.

**Requirements:**
- F6.1: Trigger on `/craft --forge` or `/forge`
- F6.2: Context fork for isolation
- F6.3: Ignore survival patterns, learned constraints
- F6.4: Respect physics only (API correctness, zone rules)
- F6.5: Era versioning for design direction shifts

**Era Transition:**
```
/new-era "Tactile"
  ↓
Archives current patterns as "Era: v1-Flat"
  ↓
Starts fresh precedent tracking
  ↓
Old patterns don't block new exploration
```

**Acceptance Criteria:**
- [ ] Forge mode ignores rejected patterns
- [ ] Forge mode still validates physics
- [ ] `/new-era` archives old patterns
- [ ] User decides keep or discard

> Source: sigil-v3.1/ARCHITECTURE.md:360-420

### 5.7 Feature 7: Streamlined Craft Logs

**Problem:** Approval gates disguised as logs.

**Solution:** Lightweight documentation, no blocking.

**Log Structure:**
```markdown
# Craft: claim-button (2026-01-08)

## Request
"trustworthy claim button"

## Decisions
- Zone: critical (vocabulary "claim")
- Physics: deliberate (critical zone)
- Component: ClaimButton (Gold)

## New Patterns
None (all canonical)

## Physics Validated
- ✓ Zone constraint
- ✓ Material constraint
- ✓ API correctness
```

**Requirements:**
- F7.1: Stop hook for log generation
- F7.2: Minimal structure: request, decisions, patterns, validation
- F7.3: No approval checklists
- F7.4: Storage in `.sigil/craft-log/`
- F7.5: 30-day retention by default

**Acceptance Criteria:**
- [ ] Log generated at end of /craft
- [ ] No blocking prompts during generation
- [ ] Logs available for Loa integration

> Source: sigil-v3.1/ARCHITECTURE.md:486-525

### 5.8 Feature 8: Cohesion Auditing

**Problem:** Generated components may drift from design system.

**Solution:** Visual consistency checks on demand.

**Requirements:**
- F8.1: Property comparison (shadows, borders, colors, spacing)
- F8.2: Variance thresholds by property type
- F8.3: Justifiable deviation annotations (`@sigil-deviation`)
- F8.4: On-demand via `/audit [component]`
- F8.5: Optional auto-audit after /craft

**Acceptance Criteria:**
- [ ] Audit compares against Sanctuary average
- [ ] Report shows variance with percentages
- [ ] Deviations with `@sigil-deviation` not flagged

> Source: sigil-v3.1/skills/auditing-cohesion/SKILL.md

---

## 6. Technical Requirements

### 6.1 Skills Architecture

10 skills with lifecycle hooks:

| Skill | Purpose | Trigger |
|-------|---------|---------|
| scanning-sanctuary | Find components | ripgrep search |
| seeding-sanctuary | Cold start taste | Empty Sanctuary |
| graphing-imports | Map src/ deps | Startup |
| querying-workshop | Fast API lookup | /craft |
| validating-physics | Constraint check | PreToolUse |
| inspiring-ephemerally | External fetch | "like [url]" |
| forging-patterns | Break precedent | --forge flag |
| observing-survival | Pattern tracking | PostToolUse |
| chronicling-rationale | Craft logs | Stop |
| auditing-cohesion | Visual check | /audit |

### 6.2 File Structure

```
.sigil/
├── workshop.json         # Pre-computed index
├── seed.yaml             # Virtual Sanctuary (fades)
├── survival.json         # Pattern tracking
├── imports.yaml          # Scanned dependencies
├── knowledge/            # Cached docs (fallback)
└── craft-log/            # Rationale artifacts

sigil.yaml                # Configuration
rules.md                  # Design constitution
```

### 6.3 Hook Integration

```yaml
hooks:
  PreToolUse:
    - validate_physics
    - check_workshop_index
  PostToolUse:
    - observe_patterns
    - update_workshop
  Stop:
    - ensure_craft_log
    - mark_survival
```

### 6.4 Performance Targets

| Operation | Target |
|-----------|--------|
| Workshop query | <5ms |
| Sanctuary scan | <50ms |
| Index rebuild | <2s |
| Pattern observation | <10ms |
| Craft log generation | <100ms |

### 6.5 Evolution from v5.0

**Kept from v5.0:**
- Seven Laws kernel (constitution.yaml, fidelity.yaml, vocabulary.yaml, workflow.yaml)
- SigilProvider runtime context
- useSigilMutation hook
- Zone layouts (CriticalZone, GlassLayout, MachineryLayout)
- Governance structure (justifications.log for bypass audit)

**Added in v6.0:**
- Workshop index (.sigil/workshop.json)
- Survival tracking (.sigil/survival.json)
- Virtual Sanctuary (.sigil/seed.yaml)
- 10 Claude Code skills
- Context forking for isolation
- Lifecycle hooks (Pre/PostToolUse, Stop)

**Changed in v6.0:**
- Discovery: JIT grep → Pre-computed workshop
- Approval: Governance dialogs → Survival observation
- Validation: Constitutional blocking → Physics-only validation
- Cold start: Empty room → Virtual Sanctuary

---

## 7. Testing Strategy

### 7.1 Test Layers

| Layer | What's Tested | Method |
|-------|---------------|--------|
| Mechanics | Scanning, graphing, querying, validation | Unit tests |
| Craft Flow | Context resolution, pattern selection | Integration tests |
| Taste | Does the pattern work? | Survival (codebase as test) |

> The codebase is the final test suite. Deletion is a failing test.

### 7.2 Coverage Targets

| Area | Target |
|------|--------|
| Validation | 100% |
| Vocabulary resolution | 100% |
| Workshop queries | 90% |
| Scanning | 80% |
| Craft flow | 70% |
| Survival | 60% |

### 7.3 Test Structure

```
tests/
├── unit/
│   ├── scanning.test.ts
│   ├── graphing.test.ts
│   ├── querying.test.ts
│   ├── validation.test.ts
│   └── vocabulary.test.ts
├── integration/
│   └── craft-flow.test.ts
├── survival/
│   └── promotion.test.ts
└── fixtures/
    ├── workshop.json
    ├── survival.json
    └── sigil.yaml
```

> Source: sigil-v3.1/tests/README.md

---

## 8. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Workshop query latency | <5ms | Benchmark test |
| Flow interruptions | 0 per /craft | Count of approval dialogs |
| Cold start time | <1s to taste | Time from init to first /craft |
| Pattern survival rate | >60% at 2 weeks | Gardener metrics |
| Physics violation catch rate | 100% | Validation tests |

---

## 9. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Workshop index staleness | Stale API info | Hash-based freshness check, incremental updates |
| Survival false positives | Wrong pattern promoted | 2-week waiting period, 3+ occurrence threshold |
| Context fork complexity | Memory/state issues | Clear fork boundaries, explicit cleanup |
| Seed library maintenance | Outdated virtual components | Version seeds, allow user customization |

---

## 10. Out of Scope

- Real-time collaboration
- Git integration beyond pattern tagging
- Automated refactoring
- IDE plugins
- CI/CD integration (future phase)

---

## 11. Sprint Plan (High Level)

### Phase 1: Foundation (Sprints 1-3)
- Workshop index schema and builder
- Startup Sentinel (hash check)
- Graphing Imports skill
- Scanning Sanctuary skill

### Phase 2: Intelligence (Sprints 4-6)
- Querying Workshop skill
- Validating Physics skill
- Seeding Sanctuary skill
- Seed libraries (Linear, Vercel, Stripe)

### Phase 3: Evolution (Sprints 7-9)
- Inspiring Ephemerally skill (context fork)
- Forging Patterns skill
- Era versioning

### Phase 4: Verification (Sprints 10-12)
- Observing Survival skill + Gardener
- Chronicling Rationale skill
- Auditing Cohesion skill
- sigil-craft agent

### Phase 5: Integration (Sprint 13)
- End-to-end testing
- Documentation update
- Migration guide from v5.0

---

## 12. Commands Reference

| Command | Purpose |
|---------|---------|
| `/craft "description"` | Generate from feel description |
| `/craft --forge "desc"` | Break precedent, explore |
| `/inspire [url]` | One-time fetch, ephemeral |
| `/sanctify "pattern"` | Promote ephemeral to rule |
| `/garden` | Run survival scan |
| `/audit [component]` | Check visual cohesion |
| `/new-era "name"` | Start fresh precedent epoch |

---

## 13. Appendix

### A. Source Documents

| Document | Path |
|----------|------|
| Architecture | sigil-v3.1.zip/ARCHITECTURE.md |
| README | sigil-v3.1.zip/README.md |
| CLAUDE.md | sigil-v3.1.zip/CLAUDE.md |
| Skills | sigil-v3.1.zip/skills/*/SKILL.md |
| Tests | sigil-v3.1.zip/tests/README.md |
| Agent | sigil-v3.1.zip/agents/sigil-craft.md |

### B. Seed Library Preview

**Linear-like:**
- Physics: snappy (150ms)
- Material: minimal, monochrome
- Components: Button, Card, Input, Dialog

**Vercel-like:**
- Physics: sharp (100ms)
- Material: bold, high-contrast
- Components: Button, Card, Badge, Modal

**Stripe-like:**
- Physics: smooth (300ms)
- Material: soft gradients, generous spacing
- Components: Button, Card, Input, Toast

### C. The Three Laws + Seven Laws

**The Three Laws (v6.0):**
1. Code is precedent — Existence is approval
2. Survival is the vote — Patterns that persist are canonical
3. Never interrupt flow — No approval dialogs

**The Seven Laws (v5.0, still valid):**
1. Filesystem is Truth
2. Type Dictates Physics
3. Zone is Layout, Not Business Logic
4. Status Propagates
5. One Good Reason > 15% Silent Mutiny
6. Never Refuse Outright
7. Let Artists Stay in Flow

---

*PRD Generated: 2026-01-08*
*Sources: sigil-v3.1.zip context*
*Next Step: `/architect` for Software Design Document*
