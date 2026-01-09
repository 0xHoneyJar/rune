# Sigil v5 Product Requirements Document

> *"Filesystem is truth. Agency stays with human. Rules evolve. Artists stay in flow."*

**Version:** 5.0
**Codename:** The Lucid Flow
**Generated:** 2026-01-08
**Sources:** ARCHITECTURE-V5.md, sigil-v5.9.zip context

---

## 1. Executive Summary

Sigil v5 unifies two complementary evolutions:

1. **The Lucid Studio** (infrastructure) — Transparent, fast, deferential architecture
2. **The Flow State Engine** (knowledge) — Unified context that keeps artists in feel-thinking

### The Vision

```
Artist: /craft "claim button that feels trustworthy"

Agent:  [Infrastructure: Lucid]
        - Live grep finds components (no stale cache)
        - Type annotation reveals Money → server-tick physics
        - JIT polish respects debugging workflow

        [Knowledge: Flow State]
        - shadcn: Button + AlertDialog patterns
        - Codebase: your useSigilMutation convention
        - Gotchas: double-click prevention, a11y

        [Generates complete, working code]
        [Offers feel refinements, not implementation questions]

Artist: [Paste and refine feel]
```

> Sources: ARCHITECTURE-V5.md:11-25, sigil-v5.9/README.md:10-32

---

## 2. Problem Statement

### 2.1 Infrastructure Problems (from Lucid Studio analysis)

| Version | Approach | Fatal Flaw |
|---------|----------|------------|
| v4.1 | `sigil.map` cache | Branch switch = stale = hallucination |
| v4.x | Auto-fix on save | Engineers can't debug with red borders |
| v4.x | Blocking contagion | Copy-paste hacks to bypass |
| v4.x | Static constitution | Rules can't evolve |

> Source: sigil-v5.9/docs/ARCHITECTURE.md:27-35

### 2.2 Knowledge Problems (from Flow State Engine analysis)

Artists context-switch between two mental modes:

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

**Every context switch breaks flow.** This cycle repeats dozens of times per session.

> Source: ARCHITECTURE-V5.md:35-66

### 2.3 Combined Problem Statement

Sigil v4.x forces artists to:
1. Fight stale caches that hallucinate components
2. Disable auto-fix to debug properly
3. Copy-paste to bypass blocking rules
4. Accept static rules that block innovation
5. Leave feel-thinking to research library APIs
6. Look up how they did something in another file

**Result:** Broken flow, disabled tooling, frustrated artists.

---

## 3. Goals & Success Metrics

### 3.1 Primary Goals

| Goal | Description |
|------|-------------|
| **Zero Drift** | Filesystem is truth. No caches. |
| **Human Agency** | Polish when asked, not on save. |
| **Evolving Rules** | Amendment protocol for constitution. |
| **Flow State** | Artists never leave feel-thinking. |

### 3.2 Success Metrics

| Metric | v4.1 Baseline | v5 Target |
|--------|---------------|-----------|
| Cache-related hallucinations | ~15% of lookups | 0% |
| Engineers who disable auto-fix | ~40% | N/A (removed) |
| Context switches per task | 5-10 | 0-1 |
| Generated code works first try | 60% | 95% |
| Matches codebase patterns | 40% | 95% |
| "I had to look up docs" | Often | Never |

> Sources: sigil-v5.9/MIGRATION-v5.9.md, ARCHITECTURE-V5.md:808-831

---

## 4. User Personas

### 4.1 Primary: The Artist

**Description:** Frontend developer who thinks in feel, not implementation.

**Needs:**
- Stay in feel-thinking mode
- Generate code that just works
- Debug without fighting tooling
- Evolve rules as product evolves

**Pain Points:**
- Researching library APIs breaks flow
- Stale caches cause confusion
- Auto-fix prevents debugging
- Static rules block innovation

### 4.2 Secondary: The Team Lead

**Description:** Responsible for design consistency across team.

**Needs:**
- Clean commits (polish at gate, not on keystroke)
- Honest status propagation (not blocking hacks)
- Justification capture (why did we override?)
- Amendment protocol (rules evolve with evidence)

---

## 5. Functional Requirements

### 5.1 Infrastructure Layer (Lucid Studio)

#### FR-1: Live Grep Discovery

**Requirement:** Replace `sigil.map` cache with live filesystem search.

**Implementation:**
```bash
# Find Gold components
rg "@sigil-tier gold" -l --type ts

# Find by data type
rg "@sigil-data-type Money" -l --type ts
```

**Acceptance Criteria:**
- [ ] No `sigil.map` file exists
- [ ] Component lookup uses ripgrep
- [ ] Lookup completes in < 50ms
- [ ] Branch switch shows correct components immediately

> Source: sigil-v5.9/docs/ARCHITECTURE.md:74-87

#### FR-2: Type-Driven Physics

**Requirement:** Physics determined by data type, not button name.

**Implementation:**
```typescript
// Same word "Transfer" — different physics
function TransferTask({ task }: { task: Task }) { ... }    // CRDT
function TransferFunds({ amount }: { amount: Money }) { ... } // Server-tick
```

**Constitution Binding:**
```yaml
data_physics:
  financial:
    types: [Money, Balance, Transfer, Withdrawal]
    physics: server-tick
    requires: [simulation, confirmation]
    forbidden: [useOptimistic]
```

**Acceptance Criteria:**
- [ ] Agent reads type annotations from function signatures
- [ ] Types resolve to physics via constitution
- [ ] Highest-risk physics wins for mixed types
- [ ] Vocabulary terms map to data types

> Source: sigil-v5.9/sigil-mark/kernel/constitution.yaml

#### FR-3: JIT Polish

**Requirement:** Code fixing happens on demand, not on save.

**Triggers:**
- User runs `/polish`
- Pre-commit hook
- CI check

**Behavior:**
```
DURING COMPOSITION:
  Linter marks violations (subtle underline)
  Linter does NOT fix them

ON /polish:
  Agent shows diff
  User approves or rejects
```

**Acceptance Criteria:**
- [ ] No code changes on file save
- [ ] `/polish` command shows diff before applying
- [ ] Pre-commit hook enforces clean commits
- [ ] Engineers can use `border: 1px solid red` for debugging

> Source: sigil-v5.9/docs/ARCHITECTURE.md:503-526

#### FR-4: Status Propagation

**Requirement:** Import status propagates, doesn't block.

**Rule:**
```
Tier(Component) = min(DeclaredTier, Tier(Dependencies))

Gold imports Gold → stays Gold
Gold imports Draft → becomes Draft (warning, not error)
```

**Acceptance Criteria:**
- [ ] Gold can import Draft without error
- [ ] Status downgrades are reported
- [ ] Status restores when dependency upgrades
- [ ] No copy-paste needed to bypass rules

> Source: sigil-v5.9/docs/ARCHITECTURE.md:467-499

#### FR-5: Amendment Protocol

**Requirement:** Constitution can evolve with justification.

**Protocol:**
```
VIOLATION DETECTED → Negotiate:
  1. COMPLY (use compliant alternative)
  2. BYPASS (override with justification)
  3. AMEND (propose constitution change)
```

**Acceptance Criteria:**
- [ ] Agent never refuses outright
- [ ] BYPASS logs justification to `governance/justifications.log`
- [ ] AMEND creates PR to `governance/amendments/`
- [ ] Constitution can be updated via amendment

> Source: sigil-v5.9/docs/ARCHITECTURE.md:539-580

#### FR-6: JSDoc Pragmas

**Requirement:** Components declare status via JSDoc comments.

**Format:**
```typescript
/**
 * @sigil-tier gold
 * @sigil-zone critical
 * @sigil-data-type Money
 */
export function TransferButton({ amount }: { amount: Money }) { ... }
```

**Acceptance Criteria:**
- [ ] Discovery works via `rg "@sigil-tier gold"`
- [ ] Zero runtime cost (comments stripped)
- [ ] Non-annotated components inherit zone defaults

> Source: sigil-v5.9/docs/ARCHITECTURE.md:630-650

---

### 5.2 Knowledge Layer (Flow State Engine)

#### FR-7: Component Context

**Requirement:** Agent knows library APIs (shadcn, Radix, Framer Motion).

**Structure:**
```
sigil-mark/components/
├── registry.yaml           # Libraries in use
├── shadcn/
│   ├── button.yaml         # Button API, variants, props
│   └── alert-dialog.yaml   # AlertDialog patterns
├── radix/
│   └── primitives.yaml     # Primitive patterns
└── framer-motion/
    └── recipes.yaml        # Animation recipes
```

**Acceptance Criteria:**
- [ ] `/craft` suggests correct component APIs
- [ ] Loading states use correct shadcn patterns
- [ ] Accessibility follows Radix best practices
- [ ] Animation uses Framer Motion conventions

> Source: ARCHITECTURE-V5.md:216-296

#### FR-8: Codebase Context

**Requirement:** Agent knows THIS codebase's patterns.

**Structure:**
```
sigil-mark/codebase/
├── analysis.yaml           # Codebase analysis summary
├── patterns/
│   ├── hooks.yaml          # Hook patterns (useSigilMutation usage)
│   ├── compositions.yaml   # Component compositions
│   └── conventions.yaml    # Naming, file structure
└── examples/
    └── *.yaml              # Reference examples
```

**Acceptance Criteria:**
- [ ] Generated code matches existing patterns
- [ ] Uses project's hook conventions
- [ ] Follows file structure conventions
- [ ] References similar existing components

> Source: ARCHITECTURE-V5.md:315-409

#### FR-9: Knowledge Context

**Requirement:** Agent handles gotchas automatically.

**Structure:**
```
sigil-mark/knowledge/
├── bugs/
│   ├── react.yaml          # Double-click prevention, hydration
│   └── nextjs.yaml         # Server/client boundaries
├── accessibility/
│   └── requirements.yaml   # A11y requirements
└── performance/
    └── patterns.yaml       # Performance patterns
```

**Acceptance Criteria:**
- [ ] Double-click prevention included by default
- [ ] A11y requirements met (aria-busy, focus management)
- [ ] Known bugs handled without artist asking
- [ ] Performance patterns applied automatically

> Source: ARCHITECTURE-V5.md:413-494

---

### 5.3 Skills (Combined)

#### The Six Skills

| Skill | Purpose | Trigger |
|-------|---------|---------|
| **Scanning Sanctuary** | Find components via live grep | Any component lookup |
| **Analyzing Data Risk** | Type → physics lookup | Action handler generation |
| **Auditing Cohesion** | Visual context check | New component generation |
| **Negotiating Integrity** | Amendment protocol | Constitution violation |
| **Simulating Interaction** | Timing verification | Critical components |
| **Polishing Code** | JIT standardization | `/polish` or commit |

> Source: sigil-v5.9/README.md:310-358

---

## 6. Non-Functional Requirements

### NFR-1: Performance

| Operation | Requirement |
|-----------|-------------|
| Component lookup (ripgrep) | < 50ms |
| Context loading | < 200ms |
| `/craft` generation | < 5s |
| `/polish` diff | < 1s |

### NFR-2: Reliability

- Zero cache drift (filesystem is truth)
- Zero false positives (type-driven, not name-guessing)
- Graceful degradation if context missing

### NFR-3: Developer Experience

- Debugging allowed (no auto-fix on save)
- Clear violation messages with options
- Justification capture immediate, not threshold-based

---

## 7. Technical Architecture

### 7.1 File Structure

```
sigil-mark/
├── kernel/                   # Core truth (always in system prompt)
│   ├── constitution.yaml     # Data type → physics
│   ├── fidelity.yaml         # Visual + ergonomic ceiling
│   ├── workflow.yaml         # Process rules
│   └── vocabulary.yaml       # Term → physics mapping
│
├── skills/                   # Skill definitions
│   ├── scanning-sanctuary.yaml
│   ├── analyzing-data-risk.yaml
│   ├── auditing-cohesion.yaml
│   ├── negotiating-integrity.yaml
│   ├── simulating-interaction.yaml
│   └── polishing-code.yaml
│
├── components/               # Component library context
│   ├── registry.yaml
│   ├── shadcn/
│   ├── radix/
│   └── framer-motion/
│
├── codebase/                 # Inherited patterns
│   ├── analysis.yaml
│   ├── patterns/
│   └── examples/
│
├── knowledge/                # Gotchas and tips
│   ├── bugs/
│   ├── accessibility/
│   └── performance/
│
├── canon/                    # Gold implementations
│   ├── components/
│   └── patterns/
│
├── governance/               # Evolution tracking
│   ├── justifications.log
│   └── amendments/
│
├── hooks/                    # React hooks
│   └── use-sigil-mutation.ts
│
├── providers/                # Runtime context
│   └── sigil-provider.tsx
│
└── layouts/                  # Zone components
    ├── critical-zone.tsx
    ├── glass-layout.tsx
    └── machinery-layout.tsx
```

> Sources: sigil-v5.9/README.md:471-508, ARCHITECTURE-V5.md:746-800

### 7.2 Physics Resolution Algorithm

```
1. Parse user prompt for vocabulary terms
2. Extract data type from function signature (if available)
3. Look up type in constitution.yaml
4. Get required physics (server-tick | crdt | local-first)
5. Apply persona overrides if any
6. Load component context for that physics
7. Load codebase patterns for similar components
8. Load relevant gotchas
9. Generate with all context merged
```

---

## 8. Migration Path

### 8.1 Breaking Changes

| v4.1 | v5 |
|------|-----|
| `sigil.map` cache | Deleted (live grep) |
| Auto-fix on save | JIT polish on demand |
| Blocking contagion | Status propagation |
| Static constitution | Amendment protocol |
| Zone-based physics | Type-driven physics |

### 8.2 Migration Steps

1. Delete `sigil.map`
2. Add JSDoc pragmas to components
3. Create `kernel/` with constitution, fidelity, workflow, vocabulary
4. Update `useSigilMutation` for simulation flow
5. Configure pre-commit hook for JIT polish
6. Create `components/`, `codebase/`, `knowledge/` directories

> Source: sigil-v5.9/MIGRATION-v5.9.md

---

## 9. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| ripgrep too slow on large codebases | Benchmarked < 50ms; can add file limits if needed |
| JSDoc pragma migration effort | Provide migration script; pragmas optional |
| Component context maintenance | Auto-update from library versions or community-contributed |
| Context size exceeds token limits | Selective loading based on prompt analysis |

---

## 10. Out of Scope (v5)

- Visual regression testing
- Design-to-code from Figma
- Multi-repo shared context
- Real-time collaboration on context

---

## 11. Open Questions

1. **Component registry maintenance:** Auto-update from library versions or manual curation?
2. **Codebase analysis frequency:** On every `/craft` or cached with manual refresh?
3. **Knowledge base source:** Built-in to Sigil or community-contributed?
4. **Context size management:** How to keep unified context within token limits?

---

## 12. Success Definition

Sigil v5 succeeds when:

1. **Infrastructure is invisible:** No cache drift, no auto-fix fights, no blocking hacks
2. **Knowledge is complete:** Artists never look up library docs or check other files
3. **Flow is preserved:** Feel-thinking → working code → feel refinement
4. **Rules evolve:** Constitution adapts with evidence, not bureaucracy

---

*PRD Generated: 2026-01-08*
*Sources: ARCHITECTURE-V5.md, sigil-v5.9.zip*
