# Sigil v5 Software Design Document

> *"Filesystem is truth. Agency stays with human. Rules evolve. Artists stay in flow."*

**Version:** 5.0
**Codename:** The Lucid Flow
**Generated:** 2026-01-08
**Architect:** Claude
**Sources:** PRD v5.0, sigil-v5.9.zip, ARCHITECTURE-V5.md

---

## 1. Executive Summary

Sigil v5 is a **Design Context Framework** that unifies two architectural evolutions:

1. **The Lucid Studio** (Infrastructure) — Transparent, fast, deferential architecture
2. **The Flow State Engine** (Knowledge) — Unified context that keeps artists in feel-thinking

This SDD defines the technical architecture to achieve:
- Zero cache drift (filesystem is truth)
- Type-driven physics (data types determine interaction physics)
- JIT polish (fix on demand, not on save)
- Status propagation (label reality, don't block)
- Amendment protocol (constitution evolves with evidence)
- Flow preservation (artists never leave feel-thinking)

---

## 2. System Architecture

### 2.1 High-Level Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              SIGIL V5 ARCHITECTURE                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        AGENT INTERFACE LAYER                         │   │
│  │  Commands: /craft, /polish, /garden, /amend, /envision, /codify     │   │
│  └──────────────────────────────┬──────────────────────────────────────┘   │
│                                 │                                           │
│  ┌──────────────────────────────▼──────────────────────────────────────┐   │
│  │                         SKILL ORCHESTRATOR                           │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐    │   │
│  │  │  Scanning   │ │  Analyzing  │ │  Auditing   │ │ Negotiating │    │   │
│  │  │  Sanctuary  │ │  Data Risk  │ │  Cohesion   │ │  Integrity  │    │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘    │   │
│  │  ┌─────────────┐ ┌─────────────┐                                    │   │
│  │  │ Simulating  │ │  Polishing  │                                    │   │
│  │  │ Interaction │ │    Code     │                                    │   │
│  │  └─────────────┘ └─────────────┘                                    │   │
│  └──────────────────────────────┬──────────────────────────────────────┘   │
│                                 │                                           │
│  ┌──────────────────────────────▼──────────────────────────────────────┐   │
│  │                          KERNEL (ALWAYS LOADED)                      │   │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────────┐  │   │
│  │  │ constitution │ │   fidelity   │ │   workflow   │ │ vocabulary │  │   │
│  │  │    .yaml     │ │    .yaml     │ │    .yaml     │ │   .yaml    │  │   │
│  │  └──────────────┘ └──────────────┘ └──────────────┘ └────────────┘  │   │
│  └──────────────────────────────┬──────────────────────────────────────┘   │
│                                 │                                           │
│  ┌──────────────────────────────▼──────────────────────────────────────┐   │
│  │                         CONTEXT LAYERS                               │   │
│  │  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐        │   │
│  │  │   Component     │ │    Codebase     │ │    Knowledge    │        │   │
│  │  │    Context      │ │     Context     │ │     Context     │        │   │
│  │  │ shadcn, radix   │ │  patterns, hook │ │  bugs, a11y     │        │   │
│  │  └─────────────────┘ └─────────────────┘ └─────────────────┘        │   │
│  └──────────────────────────────┬──────────────────────────────────────┘   │
│                                 │                                           │
│  ┌──────────────────────────────▼──────────────────────────────────────┐   │
│  │                       RUNTIME LAYER (React)                          │   │
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
│  │                      GOVERNANCE LAYER                                │   │
│  │  justifications.log | amendments/ | workflow-violations.log         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Layer Responsibilities

| Layer | Responsibility | Key Components |
|-------|----------------|----------------|
| **Agent Interface** | Command parsing, user interaction | `/craft`, `/polish`, `/garden`, `/amend` |
| **Skill Orchestrator** | Skill selection, execution, chaining | 6 skills, skill definitions |
| **Kernel** | Core rules, always in agent context | constitution, fidelity, workflow, vocabulary |
| **Context Layers** | JIT knowledge loading | component, codebase, knowledge |
| **Runtime** | React integration, physics execution | Provider, hooks, zone layouts |
| **Governance** | Evolution tracking, justification capture | logs, amendments |

---

## 3. Component Design

### 3.1 Kernel Layer

The Kernel is **always loaded** in the agent's context. It contains the immutable (but amendable) rules.

#### 3.1.1 Constitution (constitution.yaml)

**Purpose:** Maps data types to physics classes.

```yaml
# Core structure
data_physics:
  financial:
    types: [Money, Balance, Transfer, Withdrawal, Deposit]
    physics: server-tick
    requires: [simulation, confirmation, explicit-pending]
    forbidden: [useOptimistic, instant-commit]

  health:
    types: [Health, HP, Hardcore, Permadeath]
    physics: server-tick
    requires: [server-authoritative-state]
    forbidden: [optimistic-hp-updates]

  collaborative:
    types: [Task, Document, Comment, Thread]
    physics: crdt
    requires: [conflict-resolution, background-sync]
    forbidden: [blocking-save]

  local:
    types: [Preference, Draft, Toggle, UI_State]
    physics: local-first
    requires: [useOptimistic, instant-feedback]
    forbidden: [loading-spinner-on-local]

physics_profiles:
  server-tick:
    timing: { min: 600, recommended: 800, max: 1200 }
    states: [idle, simulating, confirming, committing, done, error]
    hook: useSigilMutation

  crdt:
    timing: { feedback: 50, sync_interval: 1000 }
    states: [idle, pending, syncing, done, conflict]
    hook: useSigilMutation

  local-first:
    timing: { max_feedback: 50 }
    states: [idle, done]
    hook: useOptimistic

risk_hierarchy: [server-tick, crdt, local-first]
resolution_rule: "Tier(Physics) = max(risk(Type1), risk(Type2), ...)"
```

#### 3.1.2 Fidelity (fidelity.yaml)

**Purpose:** Visual and ergonomic constraints.

```yaml
fidelity_ceiling:
  visual:
    animation:
      max_duration_ms: 200
      forbidden: [spring-bounce, elastic-easing, overshoot]
      allowed: [ease-out, ease-in-out, linear]

    gradients:
      max_stops: 2
      forbidden: [mesh-gradient, radial-gradient, conic-gradient]

    shadows:
      max_layers: 1
      max_blur_px: 8
      forbidden: [multi-layer-shadows, colored-shadows]

  ergonomic:
    input_latency:
      max_ms: 100
      enforcement: error

    hitbox:
      min_size_px: 44
      enforcement: error

    focus_ring:
      required: true
      min_contrast: "3:1"
      enforcement: error

cohesion:
  check_against_neighbors: true
  variance_thresholds:
    shadow: { same_container: 0, adjacent_section: 1 }
    border_radius: { same_container: 0, adjacent_section: 4px }
```

#### 3.1.3 Vocabulary (vocabulary.yaml)

**Purpose:** Maps user terminology to data types and physics.

```yaml
terms:
  claim:
    data_type: Money
    physics: server-tick
    user_facing: ["Claim", "Harvest", "Collect"]
    motion: deliberate
    requires: [simulation, confirmation]

  edit:
    data_type: Task
    physics: crdt
    user_facing: ["Edit", "Modify", "Update"]
    motion: warm
    requires: [conflict_resolution]

  toggle:
    data_type: Toggle
    physics: local-first
    user_facing: ["Toggle", "Switch"]
    motion: instant
    requires: [instant_feedback]

motion_profiles:
  instant: { duration_ms: 0, easing: linear }
  snappy: { duration_ms: 150, easing: ease-out }
  warm: { duration_ms: 300, easing: ease-in-out }
  deliberate: { duration_ms: 800, easing: ease-out }
```

#### 3.1.4 Workflow (workflow.yaml)

**Purpose:** Team methodology enforcement.

```yaml
method: cycles  # cycles | sprints | kanban

methods:
  cycles:
    duration: 2_weeks
    rules:
      no_backlogs:
        violation: "Creating a Backlog view"
        response: "REFUSE. Use Triage instead."
      no_story_points:
        violation: "Adding story point field"
        response: "REFUSE. Scope to fit cycle."
    terminology:
      sprint: cycle
      backlog: triage
      burndown: hill_chart

governance:
  log_violations: true
  override_allowed: true
  amendment_allowed: true
```

---

### 3.2 Skills Layer

Six skills that the agent uses to process requests:

#### 3.2.1 Scanning Sanctuary

**Purpose:** Live filesystem component discovery (replaces cache).

**Implementation:**
```bash
# Find Gold components
rg "@sigil-tier gold" -l --type ts

# Find by data type
rg "@sigil-data-type Money" -l --type ts

# Find by zone
rg "@sigil-zone critical" -l --type ts
```

**Performance:** < 50ms for typical codebase (ripgrep is fast).

**Key Principle:** Never use cached indexes. Filesystem is truth.

#### 3.2.2 Analyzing Data Risk

**Purpose:** Determine physics from function signatures.

**Algorithm:**
```
1. Parse function signature
   Input: "(amount: Money, task: Task) => Promise<void>"

2. Extract type annotations
   Output: [Money, Task]

3. Lookup each type in constitution
   Money → financial → server-tick
   Task → collaborative → crdt

4. Apply risk hierarchy
   server-tick > crdt → Use server-tick

5. Return physics requirements
   {
     physics: "server-tick",
     requires: ["simulation", "confirmation"],
     forbidden: ["useOptimistic"]
   }
```

#### 3.2.3 Auditing Cohesion

**Purpose:** Check visual consistency with context.

**Trigger:** New component generation or significant visual change.

**Process:**
1. Identify visual properties (shadows, borders, colors)
2. Compare against surrounding context components
3. Report variance if significant
4. Offer: match context / keep current / propose amendment

#### 3.2.4 Negotiating Integrity

**Purpose:** Handle constitution violations gracefully.

**Protocol:**
```
VIOLATION DETECTED:
  Article: {reference}
  Risk: {level}

OPTIONS:
  1. COMPLY - {compliant_alternative}
  2. BYPASS - Override with justification (logged)
  3. AMEND - Propose constitution change

Which do you prefer?
```

**Key Principle:** Never refuse outright. Always negotiate.

#### 3.2.5 Simulating Interaction

**Purpose:** Verify interaction timing meets physics requirements.

**Measurements:**
- click_to_feedback: < 100ms (error if exceeded)
- keypress_to_action: < 50ms
- hover_to_tooltip: < 200ms
- scroll_to_render: < 16ms (60fps budget)

#### 3.2.6 Polishing Code

**Purpose:** JIT standardization on demand.

**Triggers:**
- User runs `/polish`
- Pre-commit hook
- CI check

**Process:**
1. Scan for taste violations
2. Generate fix for each
3. Present diff to user
4. Apply ONLY on explicit approval

**Key Principle:** Never auto-fix on save. Let humans debug.

---

### 3.3 Context Layers (JIT Loaded)

These layers are loaded on-demand based on the current task.

#### 3.3.1 Component Context

**Purpose:** Library API knowledge (shadcn, Radix, Framer Motion).

**Structure:**
```
sigil-mark/components/
├── registry.yaml           # Libraries in use
├── shadcn/
│   ├── button.yaml         # Button variants, props, loading states
│   ├── alert-dialog.yaml   # Dialog patterns, accessibility
│   └── ...
├── radix/
│   └── primitives.yaml     # Primitive patterns
└── framer-motion/
    └── recipes.yaml        # Animation recipes
```

**Content per component:**
```yaml
# shadcn/button.yaml
component: Button
variants:
  - default
  - destructive
  - outline
  - secondary
  - ghost
  - link

props:
  asChild: boolean
  variant: string
  size: sm | default | lg | icon
  disabled: boolean

loading_pattern: |
  <Button disabled={isPending}>
    {isPending ? <Loader2 className="animate-spin" /> : null}
    {isPending ? "Loading..." : children}
  </Button>

accessibility:
  - Always use type="button" unless submitting
  - Include aria-label for icon-only buttons
  - Loading state should use aria-busy="true"
```

#### 3.3.2 Codebase Context

**Purpose:** THIS codebase's patterns and conventions.

**Structure:**
```
sigil-mark/codebase/
├── analysis.yaml           # Auto-generated codebase analysis
├── patterns/
│   ├── hooks.yaml          # Hook patterns (useSigilMutation usage)
│   ├── compositions.yaml   # Component composition patterns
│   └── conventions.yaml    # Naming, file structure
└── examples/
    └── *.yaml              # Reference implementations
```

**Content example:**
```yaml
# codebase/patterns/hooks.yaml
hook_patterns:
  mutation:
    preferred: useSigilMutation
    usage: |
      const { state, simulate, confirm, reset } = useSigilMutation({
        mutation: async (variables) => { ... },
        simulate: async (variables) => ({ predictedResult, estimatedDuration }),
        onSuccess: (data) => { ... },
        onError: (error) => { ... },
      });

  query:
    preferred: useQuery from @tanstack/react-query
    pattern: |
      const { data, isLoading, error } = useQuery({
        queryKey: ['entity', id],
        queryFn: () => fetchEntity(id),
      });

file_conventions:
  components: PascalCase.tsx
  hooks: use-kebab-case.ts
  utils: kebab-case.ts
  types: types/index.ts
```

#### 3.3.3 Knowledge Context

**Purpose:** Gotchas, bugs, accessibility requirements.

**Structure:**
```
sigil-mark/knowledge/
├── bugs/
│   ├── react.yaml          # React gotchas
│   └── nextjs.yaml         # Next.js boundaries
├── accessibility/
│   └── requirements.yaml   # A11y requirements
└── performance/
    └── patterns.yaml       # Performance patterns
```

**Content example:**
```yaml
# knowledge/bugs/react.yaml
bugs:
  double_click_prevention:
    description: "Buttons can be clicked multiple times during async operations"
    solution: |
      Disable button during pending state:
      <Button disabled={isPending} onClick={handleClick}>
        {isPending ? "Processing..." : "Submit"}
      </Button>
    auto_apply: true

  hydration_mismatch:
    description: "Server and client render different content"
    triggers:
      - Date/time rendering
      - Random values
      - window/document access
    solution: |
      Use useEffect for client-only content:
      const [mounted, setMounted] = useState(false);
      useEffect(() => setMounted(true), []);
      if (!mounted) return <Skeleton />;
```

---

### 3.4 Runtime Layer

React components and hooks for runtime physics execution.

#### 3.4.1 SigilProvider

**Purpose:** Provide zone and persona context to the component tree.

```typescript
// sigil-mark/providers/sigil-provider.tsx

interface SigilContextValue {
  zone: string;           // "critical" | "glass" | "machinery" | "standard"
  persona: string;        // "default" | "power_user" | "cautious"
  vibes?: {
    timing_modifier?: number;      // Remote adjustment
    seasonal_theme?: string;       // Feature flag themes
  };
}

export function SigilProvider({
  children,
  zone = 'standard',
  persona = 'default',
  vibes,
}: SigilProviderProps) {
  const value = useMemo(() => ({ zone, persona, vibes }), [zone, persona, vibes]);
  return (
    <SigilContext.Provider value={value}>
      {children}
    </SigilContext.Provider>
  );
}
```

#### 3.4.2 Zone Layout Components

**Purpose:** Set zone context for component subtrees.

```typescript
// CriticalZone - Forces server-tick physics
export function CriticalZone({ children, financial }: ZoneLayoutProps) {
  // Override parent zone to "critical"
  // All children inherit server-tick physics
}

// GlassLayout - Uses local-first physics
export function GlassLayout({ children }) {
  // Override parent zone to "glass"
  // Exploratory/marketing areas
}

// MachineryLayout - Uses snappy/instant physics
export function MachineryLayout({ children }) {
  // Override parent zone to "machinery"
  // Admin/power-user areas
}
```

#### 3.4.3 useSigilMutation Hook

**Purpose:** Type-driven physics execution with simulation flow.

```typescript
// sigil-mark/hooks/use-sigil-mutation.ts

export type SigilState =
  | 'idle'
  | 'simulating'
  | 'confirming'
  | 'committing'
  | 'done'
  | 'error';

interface UseSigilMutationOptions<TData, TVariables> {
  mutation: (variables: TVariables) => Promise<TData>;
  simulate?: (variables: TVariables) => Promise<SimulationPreview<TData>>;
  unsafe_override_physics?: Partial<ResolvedPhysics>;
  unsafe_override_reason?: string;  // Required if overriding
  onSuccess?: (data: TData) => void;
  onError?: (error: Error) => void;
}

interface UseSigilMutationResult<TData, TVariables> {
  // State
  state: SigilState;
  data: TData | null;
  error: Error | null;
  preview: SimulationPreview<TData> | null;

  // Resolved physics
  physics: ResolvedPhysics;

  // Computed UI state
  disabled: boolean;
  isPending: boolean;
  isSimulating: boolean;
  isConfirming: boolean;

  // CSS variables for styling
  cssVars: React.CSSProperties;

  // Actions
  simulate: (variables: TVariables) => Promise<void>;
  confirm: () => Promise<void>;
  execute: (variables: TVariables) => Promise<void>;
  reset: () => void;
}
```

**State Machine:**
```
              simulate()
    idle ──────────────────► simulating
                                 │
                                 ▼
                            confirming ◄──── User sees preview
                                 │
                            confirm()
                                 │
                                 ▼
                            committing
                              /     \
                             /       \
                            ▼         ▼
                          done      error
                                      │
                                 reset()
                                      │
                                      ▼
                                    idle
```

**Physics Resolution Algorithm:**
```typescript
function resolvePhysics(
  context: { zone?: string; persona?: string },
  override?: Partial<ResolvedPhysics>
): ResolvedPhysics {
  const zone = context.zone || 'standard';

  let basePhysics: ResolvedPhysics;

  switch (zone) {
    case 'critical':
      basePhysics = DEFAULT_PHYSICS['server-tick'];
      break;
    case 'machinery':
    case 'admin':
      basePhysics = DEFAULT_PHYSICS['local-first'];
      break;
    default:
      basePhysics = DEFAULT_PHYSICS['crdt'];
  }

  // Apply override if provided (with warning if no reason)
  if (override) {
    if (!override.reason) {
      console.warn('[Sigil] Physics override without reason.');
    }
    return { ...basePhysics, ...override };
  }

  return basePhysics;
}
```

---

### 3.5 Governance Layer

**Purpose:** Track evolution, capture justifications, enable amendments.

#### 3.5.1 Justifications Log

**Location:** `sigil-mark/governance/justifications.log`

**Format:**
```
[2026-01-08T10:30:00Z] BYPASS
  File: src/components/ClaimButton.tsx
  Article: constitution.financial.forbidden[0]
  Violation: Using useOptimistic with Money type
  Justification: "Demo mode for investor presentation, no real funds"
  Override: @sigil-override: useOptimistic-demo
  Author: @zksoju
```

#### 3.5.2 Amendments Directory

**Location:** `sigil-mark/governance/amendments/`

**Amendment Format:**
```yaml
# amendments/2026-01-08-allow-optimistic-demo.yaml
id: AMEND-2026-001
date: 2026-01-08
proposer: "@zksoju"
status: proposed  # proposed | approved | rejected | merged

article: constitution.financial.forbidden
current_rule: "useOptimistic forbidden for Money types"
proposed_change: |
  Add exception: useOptimistic allowed when:
  - Environment is demo/staging
  - No real funds involved
  - Clear visual indicator of demo mode

justification: |
  Investor demos need instant feedback to feel polished.
  Demo accounts use fake money with no real risk.

evidence:
  - 3 investor demos blocked by current rule
  - Zero safety incidents in demo environments

approval_required: 2  # Number of approvers needed
approvals: []
```

---

## 4. Data Architecture

### 4.1 File Structure

```
sigil-mark/
├── kernel/                   # Core truth (always in agent context)
│   ├── constitution.yaml     # Data type → physics binding
│   ├── fidelity.yaml         # Visual + ergonomic constraints
│   ├── workflow.yaml         # Process methodology
│   └── vocabulary.yaml       # Term → physics mapping
│
├── skills/                   # Skill definitions (agent reference)
│   ├── scanning-sanctuary.yaml
│   ├── analyzing-data-risk.yaml
│   ├── auditing-cohesion.yaml
│   ├── negotiating-integrity.yaml
│   ├── simulating-interaction.yaml
│   └── polishing-code.yaml
│
├── components/               # Component library context (JIT loaded)
│   ├── registry.yaml
│   ├── shadcn/
│   ├── radix/
│   └── framer-motion/
│
├── codebase/                 # Codebase patterns (JIT loaded)
│   ├── analysis.yaml
│   ├── patterns/
│   └── examples/
│
├── knowledge/                # Gotchas and tips (JIT loaded)
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
│   ├── workflow-violations.log
│   └── amendments/
│
├── hooks/                    # React hooks
│   └── use-sigil-mutation.ts
│
├── providers/                # React providers
│   └── sigil-provider.tsx
│
└── layouts/                  # Zone layout components
    ├── critical-zone.tsx
    ├── glass-layout.tsx
    └── machinery-layout.tsx
```

### 4.2 JSDoc Pragma System

Components declare their status via JSDoc comments:

```typescript
/**
 * @sigil-tier gold           # Maturity tier
 * @sigil-zone critical       # Default zone
 * @sigil-data-type Money     # Data type for physics
 */
export function TransferButton({ amount }: { amount: Money }) {
  // ...
}
```

**Discovery via ripgrep:**
```bash
# Find all Gold components
rg "@sigil-tier gold" -l --type ts

# Find components handling Money
rg "@sigil-data-type Money" -l --type ts
```

**Benefits:**
- Zero runtime cost (comments stripped by compiler)
- No cache to drift
- Human-readable in source
- Works with standard tooling

---

## 5. Integration Points

### 5.1 Editor Integration

**VS Code Extension (future):**
- Highlight zone boundaries
- Show physics class inline
- Warn on constitution violations
- Quick-fix suggestions

**Current (CLI-based):**
- Pre-commit hook for `/polish`
- CI check for violations

### 5.2 CI/CD Integration

**Pre-commit Hook:**
```bash
#!/bin/bash
# .husky/pre-commit

# Run polish check (diff only)
npx sigil polish --check

# Exit non-zero if violations found
if [ $? -ne 0 ]; then
  echo "Sigil violations detected. Run 'npx sigil polish' to fix."
  exit 1
fi
```

**GitHub Action:**
```yaml
# .github/workflows/sigil.yml
name: Sigil Check
on: [pull_request]

jobs:
  sigil:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Check Sigil compliance
        run: npx sigil garden --check
```

### 5.3 Agent Integration (Claude Code)

The agent loads Sigil context via CLAUDE.md:

```markdown
# CLAUDE.md

## Sigil Context

Before generating UI code:
1. Read sigil-mark/kernel/*.yaml
2. Determine zone from file path
3. Analyze data types for physics
4. Apply context from components/, codebase/, knowledge/

## Commands
- /craft: Generate with physics
- /polish: Standardize on demand
- /garden: System health check
- /amend: Propose constitution change
```

---

## 6. Security Considerations

### 6.1 Physics Enforcement

**Financial data (Money type) MUST use server-tick physics:**
- Simulation required before commit
- Explicit user confirmation
- No optimistic updates
- Clear pending states

**Health data (HP, Permadeath) MUST use server-tick:**
- Server authoritative
- No client prediction on damage
- No optimistic HP updates

### 6.2 Override Governance

All overrides are logged with:
- Timestamp
- File location
- Violated article
- Justification
- Author

This creates an audit trail for security review.

### 6.3 Amendment Protocol

Constitution changes require:
1. Written proposal with justification
2. Evidence of need
3. Multiple approvals (configurable)
4. Merge via PR process

---

## 7. Performance Requirements

| Operation | Requirement | Implementation |
|-----------|-------------|----------------|
| Component lookup | < 50ms | ripgrep (live grep) |
| Context loading | < 200ms | Selective YAML parsing |
| `/craft` generation | < 5s | Agent response time |
| `/polish` diff | < 1s | AST-based analysis |
| click_to_feedback | < 100ms | Physics enforcement |
| hitbox minimum | ≥ 44px | Fidelity enforcement |

---

## 8. Migration Strategy

### 8.1 From v4.x

**Breaking Changes:**

| v4.x | v5 |
|------|-----|
| `sigil.map` cache | Deleted (live grep) |
| Auto-fix on save | JIT polish on demand |
| Blocking contagion | Status propagation |
| Static constitution | Amendment protocol |
| Zone-based physics | Type-driven physics |

**Migration Steps:**

1. **Delete sigil.map**
   ```bash
   rm sigil.map
   ```

2. **Add JSDoc pragmas** to existing components:
   ```typescript
   /**
    * @sigil-tier gold
    * @sigil-zone critical
    * @sigil-data-type Money
    */
   ```

3. **Create kernel/** directory:
   ```bash
   mkdir -p sigil-mark/kernel
   # Copy constitution.yaml, fidelity.yaml, workflow.yaml, vocabulary.yaml
   ```

4. **Update useSigilMutation** for simulation flow:
   ```typescript
   // Old: execute(variables)
   // New: simulate(variables) → confirm()
   ```

5. **Configure pre-commit hook** for JIT polish:
   ```bash
   npx husky add .husky/pre-commit "npx sigil polish --check"
   ```

6. **Create context directories:**
   ```bash
   mkdir -p sigil-mark/{components,codebase,knowledge}
   ```

### 8.2 Migration Script

```bash
#!/bin/bash
# migrate-to-v5.sh

echo "Migrating to Sigil v5..."

# 1. Remove cache
rm -f sigil.map
rm -f .sigil-cache

# 2. Create new directory structure
mkdir -p sigil-mark/kernel
mkdir -p sigil-mark/skills
mkdir -p sigil-mark/components
mkdir -p sigil-mark/codebase/patterns
mkdir -p sigil-mark/codebase/examples
mkdir -p sigil-mark/knowledge/bugs
mkdir -p sigil-mark/knowledge/accessibility
mkdir -p sigil-mark/knowledge/performance
mkdir -p sigil-mark/governance/amendments

# 3. Initialize governance log
touch sigil-mark/governance/justifications.log

# 4. Copy kernel templates
# (User would populate these with their rules)

echo "Migration complete. Next steps:"
echo "1. Add JSDoc pragmas to components (@sigil-tier, @sigil-zone, @sigil-data-type)"
echo "2. Configure kernel/*.yaml with your rules"
echo "3. Update useSigilMutation calls to use simulation flow"
echo "4. Set up pre-commit hook: npx husky add .husky/pre-commit 'npx sigil polish --check'"
```

---

## 9. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| ripgrep too slow on large codebases | Benchmarked < 50ms; can add file limits if needed |
| JSDoc pragma migration effort | Provide migration script; pragmas optional initially |
| Component context maintenance | Auto-update from library versions or community-contributed |
| Context size exceeds token limits | Selective loading based on prompt analysis |
| Governance overhead | Keep justification simple; one sentence sufficient |
| Amendment abuse | Require multiple approvals; PR-based review |

---

## 10. Success Metrics

| Metric | v4.1 Baseline | v5 Target |
|--------|---------------|-----------|
| Cache-related hallucinations | ~15% | 0% |
| Engineers who disable auto-fix | ~40% | N/A (removed) |
| Context switches per task | 5-10 | 0-1 |
| Generated code works first try | 60% | 95% |
| Matches codebase patterns | 40% | 95% |
| "I had to look up docs" | Often | Never |

---

## 11. Future Considerations

### 11.1 Potential Enhancements

- **Visual regression testing** - Screenshot comparison for UI changes
- **Design-to-code from Figma** - Figma plugin for zone extraction
- **Multi-repo shared context** - Shared component/knowledge context
- **Real-time collaboration** - Multiple agents working on same codebase

### 11.2 Technical Debt Management

- Context files should be versioned
- Governance logs should be rotated
- Amendment history should be preserved

---

## 12. Appendix

### A. Command Reference

| Command | Description | Skills Used |
|---------|-------------|-------------|
| `/craft <prompt>` | Generate with physics | All |
| `/craft --simulate` | Force timing verification | Simulating Interaction |
| `/polish` | Standardize on demand | Polishing Code |
| `/polish --diff` | Show diff without applying | Polishing Code |
| `/garden` | Check system health | Scanning, Auditing |
| `/garden --drift` | Report visual drift | Auditing Cohesion |
| `/amend <rule>` | Propose constitution change | Negotiating Integrity |
| `/envision` | Capture product soul | (Moodboard skill) |
| `/codify` | Define design rules | (Codify skill) |

### B. Physics Quick Reference

| Data Type | Physics Class | States | Hook |
|-----------|--------------|--------|------|
| Money, Balance, Transfer | server-tick | idle→simulating→confirming→committing→done | useSigilMutation |
| Task, Document, Comment | crdt | idle→pending→syncing→done | useSigilMutation |
| Preference, Draft, Toggle | local-first | idle→done | useOptimistic |

### C. Zone Quick Reference

| Zone | Default Physics | Typical Use |
|------|----------------|-------------|
| critical | server-tick | Financial flows, health systems |
| glass | local-first | Marketing, exploration |
| machinery | local-first (snappy) | Admin, power users |
| standard | crdt | Default for most content |

---

*SDD Generated: 2026-01-08*
*Sources: PRD v5.0, sigil-v5.9.zip, ARCHITECTURE-V5.md*
