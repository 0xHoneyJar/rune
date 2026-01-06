# Product Requirements Document: Sigil v1.2.4

> "See the diff. Feel the result. Learn by doing."

**Version**: 1.2.4
**Date**: 2026-01-05
**Status**: Draft
**Evolution**: Iteration from v1.0, philosophy refined

---

## Executive Summary

Sigil v1.2.4 is a Design Physics Framework that enables lean teams to achieve world-class product craftsmanship through **apprenticeship learning**. Engineers learn spring physics by seeing diffs and feeling results in the browser—not through lectures or documentation.

**Target User**: Lean product teams (1-5 people) using Claude Code for AI-assisted UI development.

**Core Value Proposition**: Designer-engineer harmony at scale. Engineers develop taste for motion physics through hands-on iteration, not abstract study.

**North Star**: "We nailed it" = Designers and engineers speak the same language about motion/feel, with resonance in the craftsmanship process at scale.

---

## 1. Problem Statement

### The Pain

When building UI with AI agents, design consistency and craft quality break down because:

1. **Knowledge stays abstract** — Engineers read about spring physics but can't feel the difference between `stiffness: 180` and `stiffness: 300`
2. **Designer-engineer gap** — Designers say "more Nintendo Switch" and engineers don't know what that means in code
3. **Correction cycles burn time** — AI generates, designer rejects, engineer guesses at fix, repeat
4. **Physics scattered everywhere** — Spring values hardcoded across components with no consistency
5. **Learning doesn't compound** — Same mistakes repeat because there's no embodied knowledge

### Why Now

- AI-assisted development is mainstream (Claude Code, Cursor)
- Design systems are too abstract for AI AND humans to reason about
- Motion/animation is the frontier of craft—colors and typography are solved, physics is not
- Lean teams need world-class studio capabilities without the headcount

### Why Sigil

Sigil recognizes that craft is learned through **doing**, not reading:

- **Apprenticeship model**: See the diff (`stiffness: 180 → 300`), feel the snap, learn the number
- **Recipes encode knowledge**: Physics is in code form, using it guarantees compliance
- **Progressive disclosure**: Start with feelings ("snappier"), graduate to values
- **Claude's training IS the vibe map**: No dictionary needed—Claude knows what "Nintendo Switch" feels like

> "Blacksmiths don't read about hammer technique. They watch, then do, then FEEL the metal respond."

---

## 2. Philosophy Evolution

### From v1.0 to v1.2.4

| v1.0 | v1.2.4 |
|------|--------|
| Physics validation framework | Apprenticeship learning system |
| YAML configs define physics | TSX recipes ARE the physics |
| 8 commands, 8 skills | 6 commands, 1 core skill |
| vibes.yaml dictionary | Claude's training IS the vibe map |
| Taste Key authority | Trust the team |
| Memory/Era system | In-repo history (markdown) |
| Complex governance | Simple enforcement |

**This is iteration, not replacement.** The core essence is retained. Concepts may return when proven necessary. Philosophy evolved toward "diff + feel" as the primary learning mechanism.

### Three Pillars

1. **Recipes Over Raw Physics**
   - Engineers import recipes, not spring values
   - Using a recipe guarantees compliance
   - Raw physics only allowed in sandbox mode

2. **Diff + Feel**
   - Every adjustment shows the delta prominently
   - Workbench A/B toggle enables embodied comparison
   - Numbers gain meaning through fingers, not lectures

3. **Progressive Disclosure**
   - Designers start with feeling words ("snappier", "more Nintendo Switch")
   - Workbench shows the values Claude chose
   - Over time, designers learn to speak in values—that's the apprenticeship

---

## 3. Goals & Success Metrics

### Primary Goals

| Goal | Metric | Target |
|------|--------|--------|
| Designer-engineer harmony | First drafts approved without iteration | >60% |
| Learning outcomes | Engineers articulate "why 180 vs 300" | Qualitative |
| Craft quality | Designers say "this feels right" | >80% satisfaction |
| Developer velocity | Component creation time | 50% faster |

### Success Definition (3 months)

All of the following, enabling increased cognitive awareness and depth into the craft around building world-class products:

- **Craft quality**: Designers consistently approve first drafts
- **Learning outcomes**: Engineers develop opinions about spring physics
- **Adoption**: Teams actively using Sigil in production
- **Velocity**: Ship faster without sacrificing polish

### Anti-Goals (Preserved from v1.0)

Sigil will NEVER:
- Run a background daemon
- Hijack git hooks
- Use a database (SQLite, etc.)
- Require migrations
- Auto-delete content
- Create hidden branches

---

## 4. User Persona

### Primary: Lean Web3 Product Team

**Team**: 1-5 people (engineer, designer, founder)
**Product**: DeFi/web3 app with wallet-connected flows
**Tools**: Claude Code, VS Code, Chrome, Vercel

**Context**:
- Building checkout/claim flows with real money (crypto)
- Needs UI to feel trustworthy and deliberate
- Designer reviews on staging (testnet) with test wallet
- Some flows require real transactions, so use recording/playback for async review
- Doesn't have dedicated design engineer headcount

**Jobs to Be Done**:
1. Generate UI components that match our product's feel
2. Learn what makes motion "feel right" through doing
3. Speak the same language as our designer about physics
4. Maintain consistency as the product grows
5. Ship at world-class studio quality with lean team

**Pain Points**:
- Designer says "more Nintendo Switch" and I don't know what to adjust
- Spring values are magic numbers I don't understand
- Every generation is a coin flip
- Learning about animation feels overwhelming

---

## 5. Functional Requirements

### 5.1 Three-Layer Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           WORKBENCH                                      │
│  Diff + Feel learning environment. A/B toggle. Browser preview.          │
└─────────────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────────────┐
│                           RECIPES                                        │
│  Pre-validated physics implementations. TSX components with embedded     │
│  spring/timing values. Using a recipe guarantees compliance.             │
└─────────────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────────────┐
│                            ZONES                                         │
│  Directory = Zone. .sigilrc.yaml per folder. Cascading inheritance.      │
│  Determines which recipe set applies.                                    │
└─────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Recipe Sets

| Set | Physics | Feel | Zone Affinity |
|-----|---------|------|---------------|
| **decisive** | spring(180, 12), server-tick | Heavy, deliberate, trustworthy | checkout, transactions |
| **machinery** | instant, no animation | Efficient, precise, fast | admin, dashboards |
| **glass** | spring(200, 20), float/glow | Delightful, polished, inviting | marketing, landing |

**Recipe Anatomy**:
```tsx
/**
 * @sigil-recipe decisive/Button
 * @physics spring(180, 12), timing(150-250ms)
 * @zone checkout, transaction
 * @sync server_authoritative
 */

export function Button({ onAction, children }) {
  const { execute, isPending } = useServerTick(onAction);

  return (
    <motion.button
      onClick={execute}
      disabled={isPending}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 180, damping: 12 }}
    >
      {isPending ? 'Processing...' : children}
    </motion.button>
  );
}
```

**Variants**: Created through refinement, exploratory like Figma mockups:
```
sigil-mark/recipes/decisive/
├── Button.tsx              # Base: spring(180, 12)
├── Button.nintendo.tsx     # Variant: spring(300, 8) — snappier
├── Button.relaxed.tsx      # Variant: spring(140, 16) — less anxious
└── index.ts
```

Hierarchical variants supported (Button.nintendo.extra-snappy).

### 5.3 Zones

Directory = Zone. Configuration cascades from parent.

**Zone Config** (`.sigilrc.yaml`):
```yaml
sigil: "1.2.4"
recipes: decisive
sync: server_authoritative
tick: 600ms

constraints:
  optimistic_ui: forbidden
  loading_spinners: forbidden
```

**Resolution Algorithm**:
```
File: src/checkout/ConfirmButton.tsx
1. Check src/checkout/.sigilrc.yaml → recipes: decisive
2. Merge with src/.sigilrc.yaml → inherit defaults
3. Apply decisive zone rules
```

### 5.4 Six Commands

| # | Command | Purpose | MVP Priority |
|---|---------|---------|--------------|
| 1 | `/craft` | Generate component using zone-appropriate recipes | ESSENTIAL |
| 2 | `/sandbox` | Enable exploration mode (raw physics allowed) | ESSENTIAL |
| 3 | `/codify` | Extract physics from sandbox to recipe | ESSENTIAL |
| 4 | `/inherit` | Bootstrap from existing codebase (brownfield) | HIGH |
| 5 | `/validate` | Check compliance across codebase | MEDIUM |
| 6 | `/garden` | Health report (coverage, stale sandboxes) | MEDIUM |

**MVP Workflow**:
```
BROWNFIELD: /inherit → review analysis → create recipes manually
GREENFIELD: /craft → iterate → /sandbox for exploration → /codify
MAINTAIN:   /garden → /validate
```

### 5.5 Workbench

The core learning environment. Diff + browser side by side.

**Layout**:
```
┌─────────────────────────────────────────────────────────────────────────┐
│  sigil workbench                                      [checkout/decisive] │
├────────────────────────┬────────────────────────────────────────────────┤
│ DIFF                   │                                                │
│                        │  ┌──────────────────────────────────────────┐  │
│ - stiffness: 180       │  │                                          │  │
│ + stiffness: 300       │  │         [Confirm Purchase]               │  │
│ - damping: 12          │  │                                          │  │
│ + damping: 8           │  │         ← click to test                  │  │
│                        │  │                                          │  │
│ PHYSICS                │  └──────────────────────────────────────────┘  │
│ spring(300, 8)         │                                                │
│                        │  BROWSER (Chrome MCP / iframe)                 │
│ COMPARE                │  See the diff. Feel the diff.                  │
│ [A] Before  180/12     │                                                │
│ [B] After   300/8      │                                                │
├────────────────────────┴────────────────────────────────────────────────┤
│ CLAUDE CODE                                                             │
│                                                                         │
│ > More Nintendo Switch                                                  │
│ Adjusted: spring(180, 12) → spring(300, 8)                              │
│ [Toggle A/B to feel the difference]                                     │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│ [A] Before  [B] After  │  Space to toggle                    ● Learning │
└─────────────────────────────────────────────────────────────────────────┘
```

**A/B Toggle Implementation**:
- Hot-swap in browser for granular changes (CSS variables / re-render)
- iFrames for entire zone/user flow comparison
- The A/B toggle IS the learning mechanism

**Branding: Adhesion**:
- Own identity always (precision instrument, not product preview)
- Typeface: Adhesion (bundled in `assets/fonts/`)
- Colors: `#000000` background, `#FFFFFF` text
- No gradients, no shadows, no rounded corners
- Box-drawing characters for terminal aesthetic

### 5.6 PR-Native Refinement (Nice-to-Have)

Async feedback without CLI context switches:

```
1. Engineer: /craft → pushes PR
2. Vercel: Deploys preview (testnet for crypto flows)
3. Designer: Comments "More Nintendo Switch"
4. Claude: Reads comment + context → infers → commits
5. Engineer: Sees diff in GitHub
6. Preview: Rebuilds
7. Designer: Confirms
```

**Authority**: Anyone with comment access can trigger refinements. Trust the team.

**Commit Format**:
```
refine(CheckoutButton): Nintendo Switch feel - spring(180,12)→(300,8)
```

### 5.7 Refinement History

Learning from history: Claude should remember past refinements.

**Storage**: In-repo markdown at `sigil-mark/history/`
```
sigil-mark/history/
├── 2026-01-05.md    # "Nintendo Switch" → spring(300, 8)
├── 2026-01-04.md    # "too anxious" → spring(140, 16)
└── ...
```

Claude parses history to calibrate: "Last 5 times you said 'Nintendo Switch', we ended at spring(280-320)".

### 5.8 Three Laws (Simplified)

| Level | Meaning | Enforcement | Override |
|-------|---------|-------------|----------|
| **IMPOSSIBLE** | Violates trust model | Build fails (ESLint + CI) | Never |
| **BLOCK** | Requires explicit action | Sandbox or override | Allowed |
| **WARN** | Logged for review | /garden reports | N/A |

**Enforcement Strategy**: Keep it simple and effective.
- ESLint plugin catches early (`sigil/no-raw-physics`, `sigil/no-optimistic-in-decisive`)
- CI validation (`sigil validate`) as final gate
- Advisory sandbox warnings (>7 days) but nothing blocks

---

## 6. Technical Requirements

### 6.1 Technology Stack (Opinionated)

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Animation | React + Motion (Framer Motion) | Industry standard for React |
| CSS | CSS animations (Emil Kowalski principles) | Fallback, performance |
| Build | Vite / Next.js | Hot reload for workbench |
| State | File-based (YAML + markdown) | No database, clean removal |

**Other stacks can use the concepts but not the recipes.** Sigil ships with React + Motion implementations.

### 6.2 File Structure

```
project/
├── CLAUDE.md                  # Sigil prompt for Claude CLI
├── .sigilrc.yaml              # Root config
│
├── src/
│   ├── .sigilrc.yaml          # Default zone config
│   ├── checkout/
│   │   └── .sigilrc.yaml      # recipes: decisive
│   ├── admin/
│   │   └── .sigilrc.yaml      # recipes: machinery
│   └── marketing/
│       └── .sigilrc.yaml      # recipes: glass
│
├── sigil-mark/
│   ├── recipes/
│   │   ├── decisive/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.nintendo.tsx
│   │   │   ├── ConfirmFlow.tsx
│   │   │   └── index.ts
│   │   ├── machinery/
│   │   │   ├── Table.tsx
│   │   │   ├── Toggle.tsx
│   │   │   └── index.ts
│   │   └── glass/
│   │       ├── HeroCard.tsx
│   │       ├── Tooltip.tsx
│   │       └── index.ts
│   ├── history/               # Refinement history (markdown)
│   │   └── YYYY-MM-DD.md
│   └── reports/
│       └── garden-{date}.yaml
│
├── .claude/
│   ├── commands/
│   │   └── *.md
│   ├── skills/
│   │   └── sigil-core/
│   └── scripts/
│       └── *.sh
│
├── assets/
│   └── fonts/
│       └── Adhesion-Regular.otf
│
└── .sigil-version.json
```

### 6.3 Integration Points

| Integration | Method | Status |
|-------------|--------|--------|
| **Claude Code** | Skills + Commands in `.claude/` | Core |
| **Chrome MCP** | Live preview in workbench | Core |
| **Vercel** | Preview deployments, drains for telemetry | Enhanced |
| **ESLint** | `eslint-plugin-sigil` | Enforcement |
| **CI** | `sigil validate` command | Enforcement |

### 6.4 Crypto/Web3 Considerations

The primary use case is web3 product development with wallet-connected flows.

**Staging Review**:
- Testnet integration for staging (designer uses test wallet)
- Recording/playback for async review of flows requiring real transactions

**Crypto-Specific Patterns**: Generic core + optional `@sigil/crypto-recipes` package:
- AddressDisplay (truncation)
- GasEstimator (pulse/countdown)
- SlideToConfirm (dead man's switch)
- SimulationPreview (pre-sign)

**Archetype Support**: Sigil should flexibly support multiple physics models:
- HIGH_MASS_VAULT (Family-like): Heavy, overdamped, object permanence
- SPECTRAL_COMPANION (Phantom-like): Floating, tiered friction
- VISCOUS_FLOW (Matcha-like): Fluid dynamics, flow visualization

---

## 7. Scope & Prioritization

### MVP (1 Week)

| Feature | Priority | Status |
|---------|----------|--------|
| /craft + recipes | P0 | ESSENTIAL |
| /sandbox + /codify | P0 | ESSENTIAL |
| Workbench A/B toggle | P0 | ESSENTIAL |
| Recipe structure (decisive/machinery/glass) | P0 | ESSENTIAL |
| Zone resolution | P0 | ESSENTIAL |
| CLAUDE.md prompt | P0 | ESSENTIAL |

### v1.2.4 Full Release

| Feature | Priority |
|---------|----------|
| /inherit (brownfield) | P1 |
| /validate | P1 |
| /garden | P1 |
| Refinement history | P2 |
| PR-native refinement | P2 |
| ESLint plugin | P2 |

### Future (v1.3+)

| Feature | Priority |
|---------|----------|
| @sigil/crypto-recipes package | P3 |
| Cross-team learning (cloud) | P3 |
| Visual GUI for workbench | P3 |
| Multi-framework support | P4 |

### Out of Scope (v1.2.4)

- Multi-user real-time collaboration
- VSCode extension
- Cursor integration
- Visual configuration editor
- Framework-agnostic recipe format

---

## 8. User Stories

### Brownfield Flow (Priority)

```
US-1: As an engineer with an existing codebase, I want to analyze my
      scattered spring values so I can see what patterns exist.

      Acceptance:
      - /inherit scans component directories
      - Reports physics patterns found (e.g., "23 components with stiffness 140-200")
      - Flags files for human decision (does NOT auto-generate recipes)
      - Human creates recipes manually based on analysis
```

### Craft Flow

```
US-2: As an engineer, I want to generate a component using zone-appropriate
      physics so it matches my product's feel automatically.

      Acceptance:
      - /craft "confirmation button" in checkout/ uses decisive recipes
      - Output shows zone resolution and physics applied
      - Component imports from @sigil/recipes/decisive
      - No raw spring values in generated code
```

### Learning Flow

```
US-3: As an engineer, I want to feel the difference between spring values
      so I develop intuition for motion physics.

      Acceptance:
      - Workbench shows diff prominently (stiffness: 180 → 300)
      - A/B toggle lets me feel before and after
      - After 10+ adjustments, I can predict what "snappier" means in values
```

### Exploration Flow

```
US-4: As an engineer exploring new physics, I want a sandbox where I can
      experiment with raw values before committing to a recipe.

      Acceptance:
      - /sandbox marks file with // sigil-sandbox header
      - Raw spring values allowed (no ESLint errors)
      - /garden shows sandbox with age
      - /codify extracts to recipe when ready
      - Sandbox can stay open indefinitely (advisory only, team trusts)
```

### Refinement Flow

```
US-5: As a designer, I want to give feedback in my words ("more Nintendo Switch")
      and have it translated to physics automatically.

      Acceptance:
      - I comment on PR: "More Nintendo Switch"
      - Claude interprets based on context and history
      - Commit shows: spring(180, 12) → spring(300, 8)
      - I feel the change in preview
      - Over time, I learn what the numbers mean
```

---

## 9. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| "Claude's training" interpretation varies | High | Medium | Refinement history calibrates over time |
| Workbench complexity delays MVP | Medium | High | Ship A/B toggle first, add chrome integration incrementally |
| Recipe sprawl (too many variants) | Medium | Low | /garden reports, hierarchical naming |
| Hot-swap technically challenging | Medium | Medium | Fall back to iframes for full-flow comparison |
| Brownfield codebases too messy | Medium | High | /inherit flags only, human decides |
| Crypto flows hard to test | High | Medium | Testnet + recording/playback |

---

## 10. Success Criteria

### MVP Criteria

- [ ] /craft generates component using correct zone recipe
- [ ] /sandbox enables raw physics without ESLint errors
- [ ] /codify extracts sandbox to recipe
- [ ] Workbench A/B toggle works (hot-swap or iframe)
- [ ] Diff shown prominently after every adjustment
- [ ] Zone resolution from file path works
- [ ] Three recipe sets exist (decisive/machinery/glass)
- [ ] `rm -rf sigil-mark/` removes everything

### The Learning Test

```
DAY 1: Engineer doesn't know what stiffness means
DAY 7: Engineer has adjusted 20+ components
DAY 14: Engineer predicts "Nintendo Switch = ~stiffness 300"
DAY 30: Engineer teaches teammate about spring physics

The craft compounds through doing.
```

### The Harmony Test

```
BEFORE: Designer says "snappier", engineer guesses
AFTER: Designer says "snappier", engineer says "stiffness 200 → 280?"
       Designer says "yeah, maybe 300"
       They speak the same language.
```

---

## Appendix A: Interview Insights

### Crypto UX Physics Reference

The "Kinematics of Value" article provided deep context on crypto interface physics:

| Product | Archetype | Physics Model |
|---------|-----------|---------------|
| Family | HIGH_MASS_VAULT | Overdamped spring, heavy haptics, object permanence |
| Phantom | SPECTRAL_COMPANION | Floating oscillation, tiered friction, slide-to-confirm |
| Matcha | VISCOUS_FLOW | Sankey diagrams, ease-out curves, liquidity visualization |

Sigil should flexibly support all three models through zone configuration and recipe customization.

### Key Interview Answers

| Question | Answer |
|----------|--------|
| Recipe versioning | Global updates are intentional (zone determines physics) |
| PR refinement auth | Anyone with comment access, trust the team |
| Wallet flow testing | Testnet + recording/playback |
| Sandbox enforcement | Advisory only (trust the team) |
| Vibe calibration | Learning from history |
| Framework lock | React + Motion (opinionated) |
| A/B mechanics | Hot-swap for granular, iframes for flows |
| Variant management | Hierarchical, exploratory like Figma |
| /inherit quality | Flag only, human decides |
| Law enforcement | Simple and effective (ESLint + CI) |
| Crypto patterns | Generic core + optional package |
| v1.0 → v1.2.4 | Iteration, not replacement |
| History storage | In-repo markdown |
| Feedback mode | Progressive disclosure |
| Connectivity | Local-first + telemetry (Vercel, Chrome MCP) |
| Project type | Brownfield priority |
| North star | Designer-engineer harmony at scale |

---

## Appendix B: Source Tracing

| Section | Sources |
|---------|---------|
| Philosophy | sigil-v1.2.4/CLAUDE.md, Interview Phase 1-2 |
| Recipe architecture | sigil-v1.2.4/docs/ARCHITECTURE.md |
| Workbench design | sigil-v1.2.4/docs/ARCHITECTURE.md §Workbench |
| Crypto UX context | Interview (Kinematics of Value article) |
| Success metrics | Interview Phase 5 |
| MVP scope | Interview Phase 5 |
| Technical constraints | Interview Phase 3-4 |
| Zone resolution | sigil-v1.2.4/CLAUDE.md §Zone Resolution |
| Three Laws | sigil-v1.2.4/CLAUDE.md §Three Laws |
| Branding | sigil-v1.2.4/docs/BRANDING.md |

---

*End of PRD*
