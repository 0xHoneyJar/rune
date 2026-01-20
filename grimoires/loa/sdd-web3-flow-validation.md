# Web3 Flow Validation - Software Design Document

```
    ╔═══════════════════════════════════════════════════════════╗
    ║  SOFTWARE DESIGN DOCUMENT                                 ║
    ║  Web3 Flow Validation v2.0                                ║
    ║                                                           ║
    ║  "RLM-first architecture for iterative debugging"         ║
    ╚═══════════════════════════════════════════════════════════╝
```

**Version**: 1.0.0
**Created**: 2026-01-20
**Status**: Design Complete
**PRD Reference**: `grimoires/loa/prd-web3-flow-validation.md` v2.0.0

---

## 1. Executive Summary

This SDD addresses the context exhaustion problem that prevents iterative debugging of web3 flows. The solution implements Retrieval-Localized Memory (RLM) for `/craft`, reducing context consumption from ~10k tokens to ~2k tokens per invocation, enabling 10+ iterations per session.

**Key Architectural Decisions**:

| Decision | Choice | Rationale |
|----------|--------|-----------|
| RLM Index Format | YAML + TypeScript loader | Simple, type-safe, matches existing patterns |
| State Persistence | Markdown with YAML frontmatter | Human-readable, git-friendly, existing pattern |
| On-Chain Reads | Viem with cast fallback | Already in most web3 projects |
| Escalation Threshold | 3 iterations (configurable) | Balance between iteration freedom and loop detection |

**Phase Deliverables**:

| Phase | Core Deliverable | Token Impact |
|-------|------------------|--------------|
| Phase 1 | RLM for /craft | 10k → 2k per invocation |
| Phase 2 | Data Physics rules | +800 tokens when web3 detected |
| Phase 3 | /observe diagnostics | Separate command, no /craft impact |
| Phase 4 | Blockchain inspector skill | On-demand loading |

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           SIGIL FRAMEWORK                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐    │
│  │     /craft       │   │    /observe      │   │     /ward        │    │
│  │    (DO)          │   │  (UNDERSTAND)    │   │   (VERIFY)       │    │
│  │                  │   │                  │   │                  │    │
│  │  • Generate      │   │  • Diagnostics   │   │  • Audit         │    │
│  │  • Debug         │   │  • User truth    │   │  • Validate      │    │
│  │  • Fix           │   │  • On-chain      │   │  • Protected     │    │
│  └────────┬─────────┘   └────────┬─────────┘   └────────┬─────────┘    │
│           │                      │                      │              │
│           ▼                      ▼                      ▼              │
│  ┌────────────────────────────────────────────────────────────────┐   │
│  │                      RLM RULE LOADER                            │   │
│  │                                                                  │   │
│  │   ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐    │   │
│  │   │ Core Summary │  │ Rule Index  │  │ On-Demand Loader    │    │   │
│  │   │ (~1k tokens) │  │ (YAML)      │  │                     │    │   │
│  │   └─────────────┘  └─────────────┘  └─────────────────────┘    │   │
│  │                                                                  │   │
│  └────────────────────────────────────────────────────────────────┘   │
│           │                                                            │
│           ▼                                                            │
│  ┌────────────────────────────────────────────────────────────────┐   │
│  │                    STATE PERSISTENCE                            │   │
│  │                                                                  │   │
│  │   craft-state.md          taste.md           context/           │   │
│  │   (investigation)         (learning)         (domain)           │   │
│  │                                                                  │   │
│  └────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Component Interaction

```
User Request: "/craft fix stake button"
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│ Step 1: Load Core Summary (~1k tokens)                          │
│         - Effect detection keywords                             │
│         - Physics lookup table (compact)                        │
│         - Protected capabilities (non-negotiable)               │
└─────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│ Step 2: Check craft-state.md                                    │
│         - Is this a continuation? (same component)              │
│         - What iteration is this? (1, 2, 3+?)                   │
│         - What did we learn? (previous findings)                │
└─────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│ Step 3: Detect Patterns → Load Rules On-Demand                  │
│         - "stake" detected → load 19-data-physics.md            │
│         - "button" detected → load 03-sigil-patterns.md         │
│         - NOT detected → skip React rules (10-16)               │
└─────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│ Step 4: Loop Detection                                          │
│         - iterations >= 3 AND same component?                   │
│         - Yes → Show escalation protocol                        │
│         - No → Continue with compact mode if iteration 2+       │
└─────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│ Step 5: Execute Fix / Generate Code                             │
│         - Apply physics from loaded rules                       │
│         - Match codebase conventions                            │
│         - Save state to craft-state.md                          │
└─────────────────────────────────────────────────────────────────┘
```

### 2.3 Escalation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    ESCALATION PROTOCOL                           │
│                                                                  │
│   Iteration 1 ─────────────────────────────────────┐            │
│                                                     │ Normal    │
│   Iteration 2 ─────────────────────────────────────┤ /craft    │
│                                                     │            │
│   Iteration 3 ──────┬───────────────────────────────┘            │
│                     │                                            │
│                     ▼                                            │
│         ┌─────────────────────┐                                 │
│         │   LOOP DETECTED     │                                 │
│         │                     │                                 │
│         │   Same component?   │                                 │
│         │   Each fix reveals  │                                 │
│         │   new issue?        │                                 │
│         └──────────┬──────────┘                                 │
│                    │                                            │
│                    ▼                                            │
│         ┌─────────────────────────────────────────────┐        │
│         │                                             │        │
│         │   [d] /observe diagnose (facts first)       │        │
│         │   [u] /understand (research domain)         │        │
│         │   [p] /plan-and-analyze (architecture)      │        │
│         │   [c] Continue /craft (override)            │        │
│         │                                             │        │
│         └─────────────────────────────────────────────┘        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Technology Stack

### 3.1 Core Technologies

| Component | Technology | Version | Justification |
|-----------|------------|---------|---------------|
| Rule Index | YAML | - | Human-readable, easy to edit, existing pattern |
| Type Safety | TypeScript | 5.x | Matches codebase, type inference |
| State Format | Markdown + YAML | - | Human-readable, git-friendly |
| On-Chain Reads | Viem | 2.x | Already in most web3 projects |
| Fallback CLI | Foundry cast | - | Universal, no dependencies |
| Indexer | Envio | - | Already integrated in target projects |

### 3.2 File Structure

```
.claude/
├── rules/
│   ├── index.yaml                    # NEW: Rule index for RLM
│   ├── 00-sigil-core.md              # Unchanged
│   ├── 01-sigil-physics.md           # Unchanged
│   ├── ...
│   ├── 19-sigil-data-physics.md      # NEW: Data Physics rule
│   └── 20-sigil-web3-flows.md        # NEW: Web3 Flow Patterns
│
├── commands/
│   ├── craft.md                      # MODIFIED: RLM integration
│   └── observe.md                    # MODIFIED: Diagnostics
│
├── skills/
│   ├── crafting-physics/
│   │   └── SKILL.md                  # MODIFIED: Compact mode
│   └── blockchain-inspector/         # NEW: On-chain reads
│       ├── SKILL.md
│       └── index.yaml
│
└── protocols/
    └── rlm-loader.md                 # NEW: RLM loading protocol

grimoires/sigil/
├── craft-state.md                    # NEW: Investigation persistence
├── taste.md                          # Unchanged (append-only)
└── context/
    └── web3/                         # NEW: Web3-specific context
        └── contracts.yaml
```

---

## 4. Component Design

### 4.1 RLM Rule Loader

**Purpose**: Load only the rules needed for current context, reducing token consumption from ~10k to ~2k.

#### 4.1.1 Rule Index Schema

**File**: `.claude/rules/index.yaml`

```yaml
# RLM Rule Index
# Maps detection patterns to rule files for on-demand loading

version: "1.0"

# Core summary always loaded (~1k tokens)
core_summary:
  file: ".claude/rules/rlm-core-summary.md"
  tokens: 1000
  always_load: true

# Rules loaded based on pattern detection
rules:
  # Behavioral Physics
  - file: "01-sigil-physics.md"
    triggers:
      keywords: ["sync", "timing", "confirmation", "optimistic", "pessimistic"]
      effects: ["Financial", "Destructive", "Standard", "Local"]
    tokens: 2500
    priority: 1

  # Effect Detection
  - file: "02-sigil-detection.md"
    triggers:
      keywords: ["claim", "deposit", "withdraw", "delete", "like", "toggle"]
      types: ["Currency", "Money", "Balance", "Wei", "Token"]
    tokens: 1200
    priority: 1

  # Golden Patterns
  - file: "03-sigil-patterns.md"
    triggers:
      keywords: ["button", "modal", "form", "component"]
      craft_type: ["generate", "refine"]
    tokens: 2000
    priority: 2

  # Protected Capabilities
  - file: "04-sigil-protected.md"
    triggers:
      effects: ["Financial", "Destructive"]
      keywords: ["withdraw", "cancel", "balance"]
    tokens: 1000
    priority: 1
    always_check: true  # Non-negotiable

  # Animation Physics
  - file: "05-sigil-animation.md"
    triggers:
      keywords: ["animation", "transition", "motion", "spring", "easing"]
      commands: ["/animate"]
    tokens: 2000
    priority: 2

  # Material Physics
  - file: "07-sigil-material.md"
    triggers:
      keywords: ["style", "surface", "shadow", "glass", "material"]
      commands: ["/style"]
    tokens: 2200
    priority: 2

  # Data Physics (NEW)
  - file: "19-sigil-data-physics.md"
    triggers:
      keywords: ["envio", "indexed", "on-chain", "web3", "??", "fallback"]
      hooks: ["useReadContract", "useWriteContract", "useQuery"]
    tokens: 800
    priority: 1

  # Web3 Flow Patterns (NEW)
  - file: "20-sigil-web3-flows.md"
    triggers:
      keywords: ["stake", "claim", "withdraw", "bridge", "swap", "approve", "mint", "burn"]
      hooks: ["useWriteContract", "usePrepareContractWrite"]
    tokens: 1200
    priority: 1

  # React Rules (conditional)
  - file: "10-react-core.md"
    triggers:
      project_has: ["react", "next"]
      patterns: ["useState", "useEffect", "useMemo"]
    tokens: 2200
    priority: 3
    conditional: true

  # Async Patterns
  - file: "11-react-async.md"
    triggers:
      keywords: ["waterfall", "Promise.all", "Suspense"]
      patterns: ["async", "await", "fetch"]
    tokens: 1500
    priority: 3
    conditional: true

# Loading strategy
loading:
  # Maximum tokens to load (soft limit)
  max_tokens: 4000

  # Priority order for loading
  priority_order: [1, 2, 3]

  # Stop loading when limit reached
  stop_on_limit: true

  # Always include these regardless of limit
  required:
    - "04-sigil-protected.md"  # Protected capabilities
```

#### 4.1.2 Core Summary

**File**: `.claude/rules/rlm-core-summary.md` (~1000 tokens)

```markdown
# Sigil Core Summary (RLM)

Condensed decision tree for /craft. Full rules loaded on-demand.

## Effect → Physics (Quick Reference)

| Effect | Sync | Timing | Confirmation |
|--------|------|--------|--------------|
| Financial | Pessimistic | 800ms | Required |
| Destructive | Pessimistic | 600ms | Required |
| Soft Delete | Optimistic | 200ms | Toast+Undo |
| Standard | Optimistic | 200ms | None |
| Local | Immediate | 100ms | None |

## Detection Priority

1. Types override keywords: `Currency`, `Wei`, `Token` → Always Financial
2. Keywords: claim, deposit, delete, like, toggle, etc.
3. Context: "with undo", "for wallet", modifies effect

## Protected (Non-Negotiable)

- Withdraw: Always reachable
- Cancel: Always visible
- Balance: Always accurate
- Touch target: ≥44px
- Focus ring: Always visible

## RLM Triggers

If detecting web3 keywords (stake, claim, approve, swap, bridge):
→ Load 19-sigil-data-physics.md
→ Load 20-sigil-web3-flows.md

If generating button/modal/form:
→ Load 03-sigil-patterns.md

If project has React:
→ Load 10-react-core.md (conditionally)

## Action Default

After analysis, generate/apply changes immediately.
Do not describe what you would build.
Match codebase conventions exactly.
```

#### 4.1.3 Loading Algorithm

```typescript
interface RuleIndex {
  core_summary: { file: string; tokens: number; always_load: true };
  rules: RuleEntry[];
  loading: LoadingConfig;
}

interface RuleEntry {
  file: string;
  triggers: {
    keywords?: string[];
    effects?: string[];
    types?: string[];
    hooks?: string[];
    commands?: string[];
    patterns?: string[];
    project_has?: string[];
  };
  tokens: number;
  priority: number;
  conditional?: boolean;
  always_check?: boolean;
}

interface LoadingConfig {
  max_tokens: number;
  priority_order: number[];
  stop_on_limit: boolean;
  required: string[];
}

function loadRulesForContext(
  userInput: string,
  craftState: CraftState | null,
  projectContext: ProjectContext
): LoadedRules {
  const index = parseYaml('.claude/rules/index.yaml') as RuleIndex;
  const loaded: LoadedRules = {
    files: [],
    totalTokens: 0
  };

  // 1. Always load core summary
  loaded.files.push(index.core_summary.file);
  loaded.totalTokens += index.core_summary.tokens;

  // 2. Always load required rules (protected capabilities)
  for (const requiredFile of index.loading.required) {
    const rule = index.rules.find(r => r.file === requiredFile);
    if (rule) {
      loaded.files.push(rule.file);
      loaded.totalTokens += rule.tokens;
    }
  }

  // 3. Detect patterns in user input
  const detectedKeywords = detectKeywords(userInput);
  const detectedTypes = detectTypes(userInput, craftState);
  const detectedHooks = detectHooks(craftState?.component);

  // 4. Load rules by priority order
  for (const priority of index.loading.priority_order) {
    const rulesAtPriority = index.rules
      .filter(r => r.priority === priority)
      .filter(r => !loaded.files.includes(r.file));

    for (const rule of rulesAtPriority) {
      // Skip conditional rules if project doesn't match
      if (rule.conditional && rule.triggers.project_has) {
        if (!rule.triggers.project_has.some(dep => projectContext.dependencies.includes(dep))) {
          continue;
        }
      }

      // Check if rule is triggered
      const triggered =
        matchesAny(rule.triggers.keywords, detectedKeywords) ||
        matchesAny(rule.triggers.effects, detectEffect(userInput)) ||
        matchesAny(rule.triggers.types, detectedTypes) ||
        matchesAny(rule.triggers.hooks, detectedHooks);

      if (triggered) {
        // Check token limit
        if (index.loading.stop_on_limit &&
            loaded.totalTokens + rule.tokens > index.loading.max_tokens) {
          continue; // Skip this rule, try lower priority
        }

        loaded.files.push(rule.file);
        loaded.totalTokens += rule.tokens;
      }
    }
  }

  return loaded;
}
```

### 4.2 Craft State Persistence

**Purpose**: Save investigation context across /craft invocations to enable iterative debugging without re-explaining context.

#### 4.2.1 State Schema

**File**: `grimoires/sigil/craft-state.md`

```yaml
---
version: "1.0"
session:
  id: "2026-01-20-stake-debug-a1b2c3"
  started: "2026-01-20T14:30:00Z"
  last_updated: "2026-01-20T15:45:00Z"
  component: "StakeButton"
  file: "src/components/StakeButton.tsx"

iterations:
  - number: 1
    timestamp: "2026-01-20T14:30:00Z"
    action: "Added useCallback wrapper"
    result: "PARTIAL - Stale closure fixed, but stale receipt"
    hypothesis: "Receipt re-triggers effect"
    tokens_used: 2400
    rules_loaded:
      - "01-sigil-physics.md"
      - "19-sigil-data-physics.md"

  - number: 2
    timestamp: "2026-01-20T15:00:00Z"
    action: "Added receipt hash guard"
    result: "PARTIAL - Guard works, but wrong data source"
    hypothesis: "Envio returns stale data"
    tokens_used: 1800
    rules_loaded:
      - "19-sigil-data-physics.md"

  - number: 3
    timestamp: "2026-01-20T15:45:00Z"
    action: "Switched to on-chain data"
    result: "PENDING - Needs verification"
    hypothesis: "On-chain should be accurate"
    tokens_used: 1600
    rules_loaded:
      - "20-sigil-web3-flows.md"

loop_detection:
  triggered: true
  pattern: "each_fix_reveals_new_issue"
  escalation_offered: true
  user_choice: "continue"

context:
  effect: "Financial"
  sync: "pessimistic"
  data_sources:
    envio: "stale for vault shares"
    on_chain: "accurate but slower"
  findings:
    - "Envio indexed events lag by ~30 blocks"
    - "0n is falsy in JavaScript"
    - "Receipt hash changes on each tx"

next:
  recommendation: "diagnose"
  reason: "3 iterations without resolution, need on-chain verification"
  suggested_command: "/observe diagnose StakeButton"
---

# Investigation: StakeButton

## Summary

Debugging stake button that triggers multiple times. Each fix reveals
a new underlying issue related to data freshness and source selection.

## Current Hypothesis

Envio returns stale vault shares. Need to verify on-chain state matches
what user sees before applying another fix.

## Recommended Next Step

```
/observe diagnose StakeButton
```

This will:
1. Read on-chain state for user's address
2. Compare with Envio response
3. Identify source of truth mismatch
```

#### 4.2.2 State Operations

```typescript
interface CraftState {
  version: string;
  session: {
    id: string;
    started: string;
    last_updated: string;
    component: string;
    file: string;
  };
  iterations: Iteration[];
  loop_detection: {
    triggered: boolean;
    pattern: string;
    escalation_offered: boolean;
    user_choice: string;
  };
  context: {
    effect: string;
    sync: string;
    data_sources: Record<string, string>;
    findings: string[];
  };
  next: {
    recommendation: 'fix' | 'diagnose' | 'escalate';
    reason: string;
    suggested_command: string;
  };
}

// Load existing state or create new
function loadCraftState(component: string): CraftState | null {
  const statePath = 'grimoires/sigil/craft-state.md';

  if (!exists(statePath)) {
    return null;
  }

  const content = readFile(statePath);
  const state = parseYamlFrontmatter(content);

  // Check if this is the same component
  if (state.session.component !== component) {
    // Different component, archive old state
    archiveState(state);
    return null;
  }

  // Check if session is stale (>1 hour since last update)
  const lastUpdate = new Date(state.session.last_updated);
  if (Date.now() - lastUpdate.getTime() > 60 * 60 * 1000) {
    archiveState(state);
    return null;
  }

  return state;
}

// Save state after each iteration
function saveCraftState(state: CraftState): void {
  const statePath = 'grimoires/sigil/craft-state.md';

  state.session.last_updated = new Date().toISOString();

  const content = generateMarkdown(state);
  writeFile(statePath, content);
}

// Detect if we're in a loop
function detectLoop(state: CraftState): boolean {
  if (state.iterations.length < 3) {
    return false;
  }

  // Check if each fix reveals a new issue
  const recentIterations = state.iterations.slice(-3);
  const allPartial = recentIterations.every(i =>
    i.result.startsWith('PARTIAL') || i.result.includes('reveals')
  );

  return allPartial;
}
```

### 4.3 Data Physics Rule

**Purpose**: Guide `/craft` in choosing the correct data source for web3 operations.

#### 4.3.1 Rule Content

**File**: `.claude/rules/19-sigil-data-physics.md`

```markdown
# Sigil: Data Physics

Data sources should be intentional, not fallback chains.

<data_physics_table>
## The Data Physics Table

| Use Case | Source | Rationale |
|----------|--------|-----------|
| Display (read-only) | Envio/Indexer | Faster UX, acceptable staleness |
| Transaction amounts | On-chain | Must be accurate for tx |
| Button visibility | On-chain | Prevents failed tx |
| Historical queries | Envio/Indexer | Optimized for aggregation |
| Real-time updates | On-chain + poll | Accuracy over speed |
| Balance display | On-chain | Users verify before tx |

**Default rule**: When in doubt, use on-chain. Envio is optimization, not truth.
</data_physics_table>

<anti_patterns>
## Anti-Patterns

### Fallback Chains

❌ BAD: `vaultShares={envio ?? onChain ?? 0n}`

Why: Hides which source is used. Debugging nightmare when envio is stale.

✅ GOOD: Explicit per use case
```typescript
// Display: Envio OK (acceptable staleness)
const displayShares = envioData?.vaultShares ?? '—'

// Transaction: On-chain required (must be accurate)
const txShares = useReadContract({
  address: VAULT,
  abi: vaultAbi,
  functionName: 'balanceOf',
  args: [userAddress]
})

// Button state: On-chain required (prevent failed tx)
const canWithdraw = (txShares.data ?? 0n) > 0n
```

### BigInt Falsy Check

❌ BAD: `if (amount)` — 0n is falsy!

✅ GOOD: `if (amount != null && amount > 0n)`

### Missing Receipt Guard

❌ BAD: No check if tx already processed

✅ GOOD:
```typescript
const [lastTxHash, setLastTxHash] = useState<string>()

useEffect(() => {
  if (receipt?.transactionHash === lastTxHash) return
  setLastTxHash(receipt?.transactionHash)
  // Process receipt...
}, [receipt])
```
</anti_patterns>

<detection>
## When to Apply

Load this rule when detecting:
- Keywords: envio, indexed, on-chain, web3, `??` fallback
- Hooks: useReadContract, useWriteContract, useQuery (with blockchain endpoints)
- Patterns: `data ?? fallback`, `envio.`, `.balanceOf`

## Guidance Display

When web3 data flow detected, show in physics analysis:

```
┌─ Data Physics ─────────────────────────────────────────┐
│                                                        │
│  This involves transaction amounts.                    │
│                                                        │
│  Using ON-CHAIN for:                                   │
│  • Transaction values (accuracy required)              │
│  • Button states (prevent failed tx)                   │
│                                                        │
│  Using ENVIO for:                                      │
│  • Display values (acceptable staleness)               │
│  • Historical queries                                  │
│                                                        │
└────────────────────────────────────────────────────────┘
```
</detection>

<simplest_fix>
## When Debugging Data Issues

The simplest fix: **use on-chain for everything**.

```typescript
// Instead of mixing sources:
const { data } = useReadContract({
  address: VAULT,
  abi: vaultAbi,
  functionName: 'balanceOf',
  args: [userAddress],
  query: {
    refetchInterval: 5000, // Poll every 5s
  }
})

// Use for display, tx, and button state
const shares = data ?? 0n
const canAct = shares > 0n
```

Envio is an optimization. Don't optimize until the basic flow works.
</simplest_fix>
```

### 4.4 Web3 Flow Patterns Rule

**Purpose**: Capture risky patterns learned from web3 debugging.

#### 4.4.1 Rule Content

**File**: `.claude/rules/20-sigil-web3-flows.md`

```markdown
# Sigil: Web3 Flow Patterns

Patterns learned from web3 debugging. Applied when /craft detects
transaction flows (stake, claim, bridge, swap, approve).

<risky_patterns>
## Risky Patterns

| Pattern | Risk | Fix |
|---------|------|-----|
| `if (amount)` with BigInt | 0n is falsy | `amount != null && amount > 0n` |
| Indexed data in tx | Stale amounts | Use on-chain reads |
| Missing receipt guard | Re-execution | Check hash changed |
| `??` fallback chains | Ambiguous source | Explicit per use case |
| Optimistic financial | Can't rollback | Pessimistic sync |
| useEffect on receipt | Stale closure | useCallback + deps |
</risky_patterns>

<flow_detection>
## Flow Detection

**Keywords**: stake, claim, withdraw, bridge, swap, approve, mint, burn, deposit, redeem

**Hooks**:
- `useWriteContract` / `useContractWrite`
- `usePrepareContractWrite`
- `useWaitForTransaction` / `useWaitForTransactionReceipt`
- `useSendTransaction`

**When detected**: Load this rule + 19-sigil-data-physics.md
</flow_detection>

<multi_step_flows>
## Multi-Step Flows

When detecting approve→execute patterns:

```
┌─ Multi-Step Transaction ───────────────────────────────┐
│                                                        │
│  State Machine:                                        │
│  idle → approve_pending → approve_success →            │
│  execute_pending → success                             │
│                                                        │
│  Each step needs:                                      │
│  1. Receipt guard (don't re-trigger)                   │
│  2. Error handling (rollback to previous state)        │
│  3. Amount from on-chain at execution time             │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Pattern**:
```typescript
type TxState = 'idle' | 'approve_pending' | 'approve_success' |
               'execute_pending' | 'success' | 'error'

const [txState, setTxState] = useState<TxState>('idle')
const [lastApproveHash, setLastApproveHash] = useState<string>()
const [lastExecuteHash, setLastExecuteHash] = useState<string>()

// Approve step
const { writeContract: approve } = useWriteContract()
const { data: approveReceipt } = useWaitForTransactionReceipt({
  hash: approveTxHash,
})

// Guard: only process once
useEffect(() => {
  if (!approveReceipt) return
  if (approveReceipt.transactionHash === lastApproveHash) return
  setLastApproveHash(approveReceipt.transactionHash)
  setTxState('approve_success')
}, [approveReceipt])

// Execute step - read amount on-chain at execution time
const { data: currentBalance } = useReadContract({
  // ... get fresh balance
  query: { enabled: txState === 'approve_success' }
})
```
</multi_step_flows>

<bigint_safety>
## BigInt Safety

JavaScript BigInt has a critical footgun: `0n` is falsy.

```javascript
if (0n) console.log('true')   // Never prints!
if (0n == false) // true - loose equality
if (0n === false) // false - strict equality
```

**Safe patterns**:
```typescript
// Check for existence AND positive
if (amount != null && amount > 0n) { ... }

// Check for existence only
if (amount !== undefined && amount !== null) { ... }

// With default
const shares = data ?? 0n  // OK for display
const canAct = (data ?? 0n) > 0n  // OK for boolean
```

**Anti-pattern**:
```typescript
if (shares) { ... }  // BROKEN: 0n shares is valid but falsy
```
</bigint_safety>

<receipt_guard>
## Receipt Guard Pattern

Prevent re-execution when receipt updates:

```typescript
function useReceiptGuard<T>(
  receipt: T | undefined,
  hashFn: (r: T) => string,
  onReceipt: (r: T) => void
) {
  const lastHashRef = useRef<string>()

  useEffect(() => {
    if (!receipt) return
    const hash = hashFn(receipt)
    if (hash === lastHashRef.current) return
    lastHashRef.current = hash
    onReceipt(receipt)
  }, [receipt, hashFn, onReceipt])
}

// Usage
useReceiptGuard(
  txReceipt,
  r => r.transactionHash,
  r => handleSuccess(r)
)
```
</receipt_guard>
```

### 4.5 /observe Diagnostics Enhancement

**Purpose**: Enable on-chain state verification to prove root cause before fixing.

#### 4.5.1 Diagnostic Command Extension

**Modifications to**: `.claude/commands/observe.md`

Add new section for blockchain diagnostics:

```markdown
## Blockchain Diagnostics Mode

When invoked as `/observe diagnose [ComponentName]`:

### Step 1: Identify Component Data Needs

Read the component file and extract:
- Contract addresses referenced
- Data hooks (useReadContract, useQuery)
- Data sources (Envio queries, on-chain reads)

### Step 2: Execute On-Chain Reads

Use blockchain-inspector skill to:
1. Get current block number
2. Read contract state for relevant addresses
3. Compare with Envio/cached data

### Step 3: Source Comparison

```
┌─ Diagnostic Report ────────────────────────────────────┐
│                                                        │
│  Component: StakeButton                                │
│  User: 0x79092...                                      │
│  Block: 15,899,150                                     │
│                                                        │
│  ┌─ Source Comparison ─────────────────────────────┐  │
│  │                                                  │  │
│  │  Field          On-Chain    Envio    Match?     │  │
│  │  ─────────────────────────────────────────────  │  │
│  │  vaultShares    0           8.25e18  ❌ NO      │  │
│  │  stakedShares   8.25e18     8.25e18  ✓ Yes     │  │
│  │  allowance      MAX         MAX      ✓ Yes     │  │
│  │                                                  │  │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
│  Diagnosis: User has STAKED shares (in MultiRewards)   │
│  but component shows VAULT shares (Envio).             │
│                                                        │
│  Root Cause: Wrong contract address or field queried   │
│                                                        │
│  Suggested Fix:                                        │
│  Query multiRewards.balanceOf() not vault.balanceOf()  │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### Step 4: Update craft-state.md

Save diagnostic findings to craft-state.md for next /craft iteration.
```

### 4.6 Blockchain Inspector Skill

**Purpose**: Provide read-only on-chain state inspection for debugging.

#### 4.6.1 Skill Definition

**File**: `.claude/skills/blockchain-inspector/SKILL.md`

```markdown
# Blockchain Inspector Skill

Read-only on-chain state inspection for debugging web3 components.

## Capabilities

| Capability | Method | Fallback |
|------------|--------|----------|
| Read contract state | viem publicClient.readContract | cast call |
| Batch reads | multicall | Sequential cast |
| Get block number | eth_blockNumber | cast block-number |
| Compare sources | Envio query + on-chain | Manual |

## Invocation

Invoked by `/observe diagnose` when debugging web3 components.

## Implementation

### Option 1: Viem (if in project)

```typescript
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(process.env.RPC_URL)
})

const balance = await client.readContract({
  address: VAULT_ADDRESS,
  abi: vaultAbi,
  functionName: 'balanceOf',
  args: [userAddress]
})
```

### Option 2: Cast (fallback)

```bash
# Get balance
cast call $VAULT "balanceOf(address)(uint256)" $USER --rpc-url $RPC

# Get multiple values
cast call $VAULT "name()(string)" --rpc-url $RPC
cast call $VAULT "symbol()(string)" --rpc-url $RPC
cast call $VAULT "totalSupply()(uint256)" --rpc-url $RPC
```

### Option 3: Raw JSON-RPC

```bash
curl -X POST "$RPC_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "eth_call",
    "params": [{
      "to": "'$CONTRACT'",
      "data": "'$CALLDATA'"
    }, "latest"],
    "id": 1
  }'
```

## Output Format

```yaml
diagnostic:
  block: 15899150
  timestamp: "2026-01-20T15:45:00Z"
  reads:
    - contract: "0x3bEC4..."
      function: "balanceOf"
      args: ["0x79092..."]
      result: "0"
      decoded: "0 shares"
    - contract: "0x8d15E..."
      function: "balanceOf"
      args: ["0x79092..."]
      result: "8250000000000000000"
      decoded: "8.25 shares"
  comparison:
    on_chain:
      vault_shares: "0"
      staked_shares: "8.25e18"
    envio:
      vault_shares: "8.25e18"
    mismatch: ["vault_shares"]
  diagnosis: "User has staked, but component queries vault"
```

## Configuration

Reads RPC URL from:
1. Environment variable: `RPC_URL` or `VITE_RPC_URL`
2. Project config: `envio.config.ts` networks
3. Hardcoded fallback: Public RPC (rate limited)

## Limitations

- Read-only (no state changes)
- Requires ABI for complex decoding
- Rate limited on public RPCs
```

#### 4.6.2 Skill Index

**File**: `.claude/skills/blockchain-inspector/index.yaml`

```yaml
name: blockchain-inspector
version: "1.0"
description: Read-only on-chain state inspection for web3 debugging

triggers:
  - "/observe diagnose"
  - "compare on-chain"
  - "verify contract state"

context_files:
  - path: "envio.config.ts"
    required: false
    purpose: "Get RPC URLs and contract addresses"
  - path: ".env"
    required: false
    purpose: "Get RPC_URL environment variable"

zones:
  read:
    - "src/**/*.tsx"
    - "src/**/*.ts"
    - "envio.config.ts"
    - ".env"
  write:
    - "grimoires/sigil/craft-state.md"
    - "grimoires/loa/context/domain/"

outputs:
  - type: "diagnostic_report"
    format: "yaml"
    destination: "stdout"
  - type: "craft_state_update"
    format: "yaml"
    destination: "grimoires/sigil/craft-state.md"
```

---

## 5. Data Architecture

### 5.1 State Files

| File | Purpose | Format | Persistence |
|------|---------|--------|-------------|
| `craft-state.md` | Investigation context | YAML frontmatter + MD | Session (1 hour TTL) |
| `taste.md` | Learning signals | YAML entries | Permanent |
| `rules/index.yaml` | RLM rule index | YAML | Static |
| `context/web3/contracts.yaml` | Known contracts | YAML | Per-project |

### 5.2 Session Lifecycle

```
┌─────────────────────────────────────────────────────────────────┐
│                    SESSION LIFECYCLE                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  First /craft (component X)                                     │
│  ├── Create new craft-state.md                                  │
│  ├── Session ID: timestamp-component-random                     │
│  └── Iteration: 1                                               │
│                                                                  │
│  Second /craft (same component X)                               │
│  ├── Load existing craft-state.md                               │
│  ├── Check TTL (< 1 hour since last update?)                    │
│  ├── Add iteration 2                                            │
│  └── Save state                                                 │
│                                                                  │
│  Third /craft (same component X)                                │
│  ├── Load existing craft-state.md                               │
│  ├── Iteration 3 → LOOP DETECTION                               │
│  ├── Show escalation options                                    │
│  └── Save state with loop_detection.triggered = true            │
│                                                                  │
│  /craft (different component Y)                                 │
│  ├── Archive old session to context/archive/                    │
│  ├── Create new craft-state.md for component Y                  │
│  └── Start fresh                                                │
│                                                                  │
│  Session Timeout (> 1 hour)                                     │
│  ├── Archive expired session                                    │
│  └── Next /craft starts fresh                                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 5.3 Archive Structure

```
grimoires/sigil/
├── craft-state.md                    # Current session
└── context/
    └── archive/
        ├── 2026-01-20-stake-debug-a1b2c3.md
        ├── 2026-01-19-claim-button-d4e5f6.md
        └── ...
```

---

## 6. API Design

### 6.1 Command Interface

#### /craft (Modified)

**Input**:
```
/craft "fix stake button"
/craft "add claim rewards feature"
/craft debug StakeButton
```

**New Behavior**:
1. Load core summary (~1k tokens)
2. Load craft-state.md if exists for component
3. Detect patterns → load rules on-demand
4. If iteration 3+, show escalation protocol
5. Execute fix/generate
6. Save state

**Output (Iteration 1)**:
```
┌─ Physics Analysis ─────────────────────────────────────┐
│                                                        │
│  Component:   StakeButton                              │
│  Effect:      Financial                                │
│  Iteration:   1 (new session)                          │
│                                                        │
│  Behavioral:  pessimistic, 800ms, confirmation         │
│  Animation:   ease-out, deliberate                     │
│                                                        │
│  ┌─ Data Physics ──────────────────────────────────┐  │
│  │  Transaction amounts → on-chain                  │  │
│  │  Button states → on-chain                        │  │
│  │  Display values → Envio OK                       │  │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
│  Rules loaded: 01-physics, 19-data-physics             │
│  Tokens: 2,400                                         │
│                                                        │
│  Proceed? (y/n)                                        │
└────────────────────────────────────────────────────────┘
```

**Output (Iteration 3+ - Loop Detected)**:
```
┌─ Loop Detected ────────────────────────────────────────┐
│                                                        │
│  Component:   StakeButton                              │
│  Iteration:   3                                        │
│                                                        │
│  Pattern: Each fix reveals new issue                   │
│                                                        │
│  Previous fixes:                                       │
│  1. useCallback wrapper → stale receipt                │
│  2. Receipt hash guard → wrong data source             │
│                                                        │
│  Recommendation: Diagnose before fixing                │
│                                                        │
│  [d] /observe diagnose StakeButton                     │
│  [u] /understand "envio vs on-chain data"              │
│  [p] /plan-and-analyze (architecture)                  │
│  [c] Continue /craft (I know what I'm doing)           │
│                                                        │
└────────────────────────────────────────────────────────┘
```

#### /observe diagnose (New Mode)

**Input**:
```
/observe diagnose StakeButton
/observe diagnose src/components/StakeButton.tsx
```

**Output**:
```
┌─ Diagnostic Report ────────────────────────────────────┐
│                                                        │
│  Component: StakeButton                                │
│  File: src/components/StakeButton.tsx                  │
│  Block: 15,899,150                                     │
│                                                        │
│  ┌─ Data Sources Detected ─────────────────────────┐  │
│  │                                                  │  │
│  │  Envio Query: vaultShares (line 45)             │  │
│  │  On-Chain:    None                               │  │
│  │                                                  │  │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
│  ┌─ On-Chain Verification ─────────────────────────┐  │
│  │                                                  │  │
│  │  vault.balanceOf(user):        0                │  │
│  │  multiRewards.balanceOf(user): 8.25e18          │  │
│  │                                                  │  │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
│  ┌─ Source Comparison ─────────────────────────────┐  │
│  │                                                  │  │
│  │  Field         On-Chain   Envio    Match?       │  │
│  │  ───────────────────────────────────────────    │  │
│  │  vaultShares   0          8.25e18  ❌ MISMATCH  │  │
│  │                                                  │  │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
│  Diagnosis:                                            │
│  User shares are STAKED (in multiRewards contract)    │
│  but component queries VAULT (where shares = 0)       │
│                                                        │
│  Root Cause: Wrong contract queried                    │
│                                                        │
│  Suggested Fix:                                        │
│  Query multiRewards.balanceOf() instead of vault      │
│                                                        │
│  [Findings saved to craft-state.md]                   │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

## 7. Security Architecture

### 7.1 Read-Only Diagnostics

The blockchain inspector skill is **read-only**:
- No private key access
- No transaction signing
- No state modifications
- Only `eth_call` and `eth_blockNumber` RPC methods

### 7.2 RPC Security

| Risk | Mitigation |
|------|------------|
| RPC URL exposure | Read from environment, never log |
| Rate limiting | Use project's existing RPC, fallback to public |
| Incorrect data | Always show block number for verification |

### 7.3 State Persistence

| Risk | Mitigation |
|------|------------|
| Sensitive data in state | Only store component names, not user addresses |
| State tampering | State is informational, not authoritative |
| Stale state | 1 hour TTL, automatic archival |

---

## 8. Integration Points

### 8.1 Existing Sigil Commands

| Command | Integration |
|---------|-------------|
| `/craft` | RLM loading, state persistence, loop detection |
| `/observe` | New diagnose mode with blockchain inspector |
| `/ward` | Uses web3 flow patterns for validation |
| `/style`, `/animate`, `/behavior` | Unchanged (modes of /craft) |

### 8.2 Loa Integration

| Loa Command | Escalation Path |
|-------------|-----------------|
| `/understand` | Research domain when context needed |
| `/plan-and-analyze` | Architecture when pattern unclear |
| `/architect` | Design when feature scope large |

### 8.3 External Services

| Service | Usage |
|---------|-------|
| RPC Provider | On-chain reads (viem/cast) |
| Envio | Indexed data comparison |
| GitHub | Issue #24 tracking |

---

## 9. Deployment Architecture

### 9.1 File Deployment

All changes are file-based within the Sigil repository:

```
Phase 1:
├── .claude/rules/index.yaml           # NEW
├── .claude/rules/rlm-core-summary.md  # NEW
├── .claude/commands/craft.md          # MODIFIED
└── grimoires/sigil/craft-state.md     # NEW (created at runtime)

Phase 2:
├── .claude/rules/19-sigil-data-physics.md  # NEW
└── .claude/rules/20-sigil-web3-flows.md    # NEW

Phase 3:
├── .claude/commands/observe.md        # MODIFIED
└── .claude/skills/blockchain-inspector/  # NEW directory
    ├── SKILL.md
    └── index.yaml

Phase 4:
└── (skill implementation details)
```

### 9.2 Migration Path

1. **Phase 1**: Deploy RLM files, modify craft.md
   - Backwards compatible: existing /craft still works
   - New behavior: reduced token consumption

2. **Phase 2**: Deploy new rule files
   - Auto-loaded when web3 patterns detected
   - No breaking changes

3. **Phase 3**: Deploy observe modifications + skill
   - New command mode: `/observe diagnose`
   - Existing `/observe` unchanged

4. **Phase 4**: Enhance skill with more capabilities
   - Iterative improvement

---

## 10. Development Workflow

### 10.1 Testing Strategy

| Phase | Test Approach |
|-------|---------------|
| Phase 1 | Token counting: verify <2k per invocation |
| Phase 2 | Pattern detection: verify rules load correctly |
| Phase 3 | Diagnostic accuracy: verify on-chain reads match |
| Phase 4 | E2E: debug real web3 issue with full flow |

### 10.2 Success Metrics

| Metric | Measurement | Target |
|--------|-------------|--------|
| Tokens per /craft | Count in output | ≤2,500 |
| Max iterations | Count before context full | ≥10 |
| Loop detection accuracy | Manual review | 90% |
| Diagnostic usefulness | User feedback | Positive |

---

## 11. Technical Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| RLM doesn't reduce tokens enough | Medium | High | Aggressive summarization, measure early |
| Loop detection false positives | Medium | Medium | Configurable threshold, easy override |
| On-chain reads fail | Low | Medium | Cast fallback, graceful degradation |
| State file corruption | Low | Low | Archive before overwrite, recovery |
| User ignores escalation | Medium | Medium | Clear value proposition, not blocking |

---

## 12. Future Considerations

### 12.1 Post-MVP Enhancements

| Enhancement | Value | Complexity |
|-------------|-------|------------|
| Auto-fix suggestions from diagnostics | High | Medium |
| Historical diagnostic comparison | Medium | Low |
| Cross-project pattern learning | High | High |
| IDE integration (VS Code) | Medium | High |

### 12.2 Technical Debt

| Item | Priority | Notes |
|------|----------|-------|
| Rule token counts need measurement | P1 | Estimates in index.yaml |
| Cast installation check | P2 | Assume foundry available |
| Envio schema detection | P2 | Manual for now |

---

## 13. Appendices

### A. Token Budget Breakdown

```
Current /craft invocation: ~10,000 tokens
├── Core rules (00-08):      ~8,000 tokens
├── React rules (10-16):     ~6,000 tokens (conditional)
├── Command prompt:          ~1,500 tokens
└── Overhead:                ~500 tokens

Target /craft invocation: ~2,500 tokens
├── Core summary:            ~1,000 tokens
├── On-demand rules:         ~1,000 tokens (average)
├── State context:           ~300 tokens
└── Command prompt (compact): ~200 tokens
```

### B. Rule Loading Examples

**Example 1**: `/craft "like button"`
```
Loaded:
- rlm-core-summary.md (1000 tokens)
- 04-sigil-protected.md (1000 tokens) - always check
- 03-sigil-patterns.md (2000 tokens) - "button" keyword

Total: 4,000 tokens
```

**Example 2**: `/craft "fix stake button"` (iteration 2)
```
Loaded:
- rlm-core-summary.md (1000 tokens)
- 04-sigil-protected.md (1000 tokens)
- craft-state.md context (300 tokens)
- 19-sigil-data-physics.md (800 tokens) - "stake" keyword
- 20-sigil-web3-flows.md (1200 tokens) - "stake" keyword

Skipped (already applied in iteration 1):
- 03-sigil-patterns.md
- 01-sigil-physics.md

Total: 4,300 tokens (with reuse discount)
```

### C. Loop Detection Algorithm

```typescript
function detectLoop(state: CraftState): LoopResult {
  // Not enough iterations
  if (state.iterations.length < 3) {
    return { triggered: false };
  }

  // Check last 3 iterations
  const recent = state.iterations.slice(-3);

  // Pattern 1: Each fix reveals new issue
  const allPartial = recent.every(i =>
    i.result.includes('PARTIAL') ||
    i.result.includes('reveals') ||
    i.result.includes('but')
  );

  if (allPartial) {
    return {
      triggered: true,
      pattern: 'each_fix_reveals_new_issue',
      recommendation: 'diagnose'
    };
  }

  // Pattern 2: Same fix attempted multiple times
  const actions = recent.map(i => i.action.toLowerCase());
  const duplicates = actions.filter((a, i) =>
    actions.indexOf(a) !== i
  );

  if (duplicates.length > 0) {
    return {
      triggered: true,
      pattern: 'repeated_fix_attempt',
      recommendation: 'understand'
    };
  }

  // Pattern 3: Hypothesis unchanged across iterations
  const hypotheses = recent.map(i => i.hypothesis);
  const sameHypothesis = hypotheses.every(h => h === hypotheses[0]);

  if (sameHypothesis) {
    return {
      triggered: true,
      pattern: 'stuck_hypothesis',
      recommendation: 'plan'
    };
  }

  return { triggered: false };
}
```

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-01-20 | Claude | Initial SDD |

---

```
    ╔═══════════════════════════════════════════════════════════╗
    ║  SDD v1.0.0 - DESIGN COMPLETE                             ║
    ║  Ready for /sprint-plan                                   ║
    ╚═══════════════════════════════════════════════════════════╝
```
