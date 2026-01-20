# Web3 Flow Validation - Product Requirements Document

```
    ╔═══════════════════════════════════════════════════════════╗
    ║  WEB3 FLOW VALIDATION                                     ║
    ║  "RLM-first architecture for iterative debugging"         ║
    ║                                                           ║
    ║  Issue: #24 - /craft context exhaustion + debug loops     ║
    ╚═══════════════════════════════════════════════════════════╝
```

**Version**: 2.0.0
**Created**: 2026-01-20
**Status**: Architecture Phase
**Owner**: THJ Team
**Source**: [GitHub Issue #24](https://github.com/0xHoneyJar/sigil/issues/24)

---

## Executive Summary

The `/craft` command exhausts context in 2-3 invocations (~10k tokens each), making iterative debugging impossible. A 6+ fix chain on a staking flow revealed that without proper diagnostics and planning, debugging loops create more confusion than they solve.

**Architecture Principle**: RLM first. Everything else is blocked without context efficiency for `/craft`.

**UNIX Principle**: Three tools, each doing one thing well:
- `/craft` — Do (generate, debug, fix)
- `/observe` — Understand (user truth, diagnostics)
- `/ward` — Verify (validation, audits)

---

## 1. Problem Statement

### 1.1 The Core Blocker: Context Exhaustion

| Metric | Current | Impact |
|--------|---------|--------|
| Context per /craft | ~10k tokens | 2-3 invocations max |
| Rule loading | All rules, every time | ~8-10k overhead |
| Debug iterations needed | 6+ | Impossible in one session |
| Investigation state | Lost on /clear | Must re-explain everything |

**Without RLM, nothing else matters.** We can't iterate on web3 flows if we can't call `/craft` more than twice.

### 1.2 The Debug Loop Problem

From Issue #24, a staking flow required 6+ iterations:

```
Fix 1 → Stale closure
Fix 2 → Stale receipt
Fix 3 → Wrong data source (Envio vs on-chain)
Fix 4 → Envio was stale
Fix 5 → 0n is falsy
Fix 6+ → Still debugging...
```

**Key insight from user**:
> "This bug fix ran in loops and had me more confused than when we started."

The problem isn't just bugs—it's that debugging without diagnostics or planning creates spiraling confusion. Each fix reveals the next issue with no map of the territory.

### 1.3 Missing Capabilities

| Capability | Status | Impact |
|------------|--------|--------|
| Context-efficient /craft | ❌ Missing | Can't iterate |
| On-chain diagnostics | ❌ Missing | Can't prove root cause |
| Loop detection | ❌ Missing | Can't escalate to planning |
| Data Physics guidance | ❌ Missing | Intent unclear |

---

## 2. Architecture

### 2.1 UNIX Principle

Three commands, each doing one thing well:

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│   /craft (DO)              /observe (UNDERSTAND)   /ward (VERIFY)
│   ════════════             ════════════════════   ══════════════
│                                                                │
│   Generate code            Capture user truth     Audit physics
│   Debug issues             Diagnose state         Validate code
│   Apply physics            Research domain        Check protected
│   Fix bugs                 Inspect on-chain       Report health
│                                                                │
│   MAIN ENTRY POINT         SECONDARY              SECONDARY    │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

Other commands (`/style`, `/animate`, `/behavior`) are **modes of /craft**, not separate tools.

### 2.2 /craft as Universal Entry Point

From README.md:
> `/craft` adapts to whatever you bring: UI work, debug work, explore work, full features.

This PRD reinforces `/craft` as THE entry point. RLM makes it sustainable for iterative work.

### 2.3 Escalation Protocol

When `/craft` detects debugging loops:

```
/craft iteration 1 → Fix attempt
/craft iteration 2 → Fix attempt
/craft iteration 3 → LOOP DETECTED
                    │
                    ▼
┌─ Escalation Protocol ──────────────────────────────────┐
│                                                        │
│  Detected: 3+ iterations on same component             │
│  Pattern: Each fix reveals new issue                   │
│                                                        │
│  Recommendation: Escalate to Loa for planning          │
│                                                        │
│  [y] Invoke /understand for diagnostics                │
│  [p] Invoke Loa /plan-and-analyze for architecture    │
│  [c] Continue /craft (I know what I'm doing)          │
│                                                        │
└────────────────────────────────────────────────────────┘
```

This prevents the "more confused than when we started" outcome.

---

## 3. Requirements

### 3.1 Phase 1: RLM for /craft (P0 - CRITICAL)

**Goal**: Reduce `/craft` context to ~2k tokens, enabling 10+ iterations per session.

#### 3.1.1 Core Requirements

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| R1-01 | Skill summarization | Core /craft decision tree in ~1k tokens |
| R1-02 | On-demand rule retrieval | Load rules only when pattern detected |
| R1-03 | Investigation state persistence | Save to `grimoires/sigil/craft-state.md` |
| R1-04 | Compact mode | Iterations 2+ use minimal prompt |
| R1-05 | Loop detection | Detect 3+ iterations on same component |

#### 3.1.2 RLM Architecture

Based on [Recursive Language Models paper](https://arxiv.org/html/2512.24601v1):

```
┌─ SigilEnvironment ─────────────────────────────────────┐
│                                                        │
│  Instead of loading all rules (~50k tokens):           │
│                                                        │
│  sigil_env = SigilEnvironment("rules/")                │
│                                                        │
│  # Query only what's needed:                           │
│  effect = sigil_env.detect_effect("claim")  # "Financial"
│  physics = sigil_env.get_physics("Financial")  # subset
│  web3 = sigil_env.get_web3_rules("stake")  # if detected
│                                                        │
│  # Cache across invocations:                           │
│  Variable buffering for frequently-used rules          │
│                                                        │
└────────────────────────────────────────────────────────┘
```

#### 3.1.3 Craft State Persistence

```yaml
# grimoires/sigil/craft-state.md
---
session_id: "2026-01-20-stake-debug"
component: "StakeButton"
iterations: 3
findings:
  - iteration: 1
    fix: "useCallback wrapper"
    result: "Still stuck - stale receipt"
  - iteration: 2
    fix: "Receipt hash guard"
    result: "Wrong data source"
  - iteration: 3
    fix: "On-chain data"
    result: "Pending - needs verification"
hypothesis: "Envio vs on-chain mismatch"
next_action: "Diagnose with /observe"
---
```

#### 3.1.4 Compact /craft (Iteration 2+)

```
/craft "fix stake button" (iteration 3)

[Loaded: craft-state.md, previous findings]
[Skipped: full physics, material, animation]

Previous: Receipt hash guard → wrong data source
Hypothesis: Envio stale

Quick options:
[d] Diagnose on-chain state (/observe)
[f] Fix with on-chain data
[p] Plan with Loa (architecture needed)
```

### 3.2 Phase 2: Data Physics Rule (P0)

**Goal**: Add Data Physics as a Sigil rule that guides `/craft` intent.

#### 3.2.1 New Rule File

Location: `.claude/rules/19-sigil-data-physics.md`

```markdown
# Sigil: Data Physics

Data sources should be intentional, not fallback chains.

## The Data Physics Table

| Use Case | Source | Rationale |
|----------|--------|-----------|
| Display (read-only) | Envio | Faster UX, acceptable staleness |
| Transactions | On-chain | Must be accurate |
| Button visibility | On-chain | Prevents failed actions |
| Historical queries | Envio | Optimized for aggregation |

## Anti-Pattern: Fallback Chains

❌ `vaultShares={envio ?? onChain ?? 0n}` — Hides which source is used

✅ Explicit sources:
- `displayValue={envio}` — For showing to user
- `txAmount={onChain}` — For transactions
- `canAct={onChain > 0n}` — For button states

## Detection

When /craft detects web3 flow, show Data Physics guidance:

"This involves transaction amounts. Using on-chain data for:
- Transaction values (accuracy required)
- Button states (prevent failed actions)

Using Envio for:
- Display values (acceptable staleness)"

## Simplest Fix

When in doubt: **use on-chain for everything**.
Envio is optimization, not source of truth.
```

#### 3.2.2 Web3 Flow Patterns Rule

Location: `.claude/rules/20-sigil-web3-flows.md`

```markdown
# Sigil: Web3 Flow Patterns

Patterns learned from web3 debugging. Applied when /craft detects
transaction flows (stake, claim, bridge, swap, approve).

## Risky Patterns

| Pattern | Risk | Guidance |
|---------|------|----------|
| `if (amount)` with BigInt | 0n is falsy | Use `amount != null` |
| Indexed data in tx | Stale amounts | Use on-chain reads |
| Missing receipt guard | Re-execution | Check hash changed |
| `??` fallback chains | Ambiguous source | Explicit per use case |
| Optimistic financial | Can't rollback | Pessimistic sync |

## Flow Detection

Keywords: stake, claim, withdraw, bridge, swap, approve, mint, burn
Hooks: useWriteContract, usePrepareContractWrite, useContractWrite

## Multi-Step Flows

When detecting approve→execute patterns:
1. Show state machine (idle → approve → execute → success)
2. Note: Each step needs receipt guard
3. Note: Amount from on-chain at execution time
```

### 3.3 Phase 3: Diagnostics + Loa Escalation (P1)

**Goal**: Enable `/observe` to diagnose on-chain state; `/craft` to escalate to Loa when loops detected.

#### 3.3.1 /observe Enhancements

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| R3-01 | On-chain reads | balanceOf, allowance, state vars |
| R3-02 | Source comparison | Envio vs on-chain diff |
| R3-03 | Diagnostic format | Structured output for /craft |

#### 3.3.2 Diagnostic Output

```
/observe diagnose StakeButton

┌─ On-Chain State ───────────────────────────────────────┐
│                                                        │
│  User: 0x79092...                                      │
│  Vault: 0x3bEC4...                                     │
│                                                        │
│  Contract Reads:                                       │
│  ├─ vault.balanceOf(user):        0                   │
│  ├─ multiRewards.balanceOf(user): 8.25e18             │
│                                                        │
│  Source Comparison:                                    │
│  ├─ On-chain vaultShares:  0                          │
│  ├─ Envio vaultShares:     8.25e18                    │
│  └─ ⚠️ MISMATCH                                       │
│                                                        │
│  Diagnosis: Shares are STAKED (in MultiRewards)       │
│  but Envio shows UNSTAKED (in vault)                  │
│                                                        │
└────────────────────────────────────────────────────────┘
```

#### 3.3.3 Loa Escalation Protocol

When `/craft` detects loop (3+ iterations, same component):

```
function detectLoop(craftState):
  if craftState.iterations >= 3:
    if craftState.findings show "each fix reveals new issue":
      return ESCALATE

  return CONTINUE

ESCALATE options:
1. /observe diagnose [component] — Get facts before fixing
2. /understand [domain] — Research before acting
3. Loa /plan-and-analyze — Architecture-level planning
```

### 3.4 Phase 4: Blockchain Inspection Skill (P1)

**Goal**: Viem/Cast skill for `/observe` to read on-chain state.

#### 3.4.1 Skill Definition

Location: `.claude/skills/blockchain-inspector/SKILL.md`

```markdown
# Blockchain Inspector Skill

Read-only on-chain state inspection for debugging.

## Capabilities

| Capability | Method |
|------------|--------|
| Read contract state | viem publicClient.readContract |
| Batch reads | multicall |
| Compare sources | Envio query + on-chain read |
| Decode values | ABI-aware formatting |

## Usage

Invoked by /observe when debugging web3 components.

## Implementation

Uses viem (already in most web3 projects) or falls back to
raw JSON-RPC via curl.
```

#### 3.4.2 Cast Fallback

If viem unavailable, use Foundry cast:

```bash
cast call $VAULT "balanceOf(address)(uint256)" $USER --rpc-url $RPC
```

---

## 4. Implementation Plan

### 4.1 Phase Order (RLM First)

```
Phase 1: RLM for /craft (CRITICAL - unblocks everything)
    │
    ├── Skill summarization (~1k core)
    ├── On-demand rule retrieval
    ├── craft-state.md persistence
    ├── Compact mode for iterations
    └── Loop detection
    │
    ▼
Phase 2: Data Physics + Web3 Flow Rules
    │
    ├── .claude/rules/19-sigil-data-physics.md
    ├── .claude/rules/20-sigil-web3-flows.md
    └── /craft guidance integration
    │
    ▼
Phase 3: Diagnostics + Loa Escalation
    │
    ├── /observe on-chain inspection
    ├── Source comparison (Envio vs on-chain)
    ├── Loop detection → escalation protocol
    └── Loa integration for multi-window work
    │
    ▼
Phase 4: Blockchain Inspector Skill
    │
    ├── Viem-based contract reads
    ├── Cast fallback
    └── Diagnostic output format
```

### 4.2 Timeline

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| Phase 1 | Days 1-5 | RLM, compact /craft, state persistence |
| Phase 2 | Days 6-8 | Data Physics rule, web3 flow patterns |
| Phase 3 | Days 9-12 | /observe enhancements, Loa escalation |
| Phase 4 | Days 13-15 | Blockchain inspector skill |

### 4.3 Success Criteria

| Metric | Current | Target |
|--------|---------|--------|
| Context per /craft | ~10k tokens | ~2k tokens |
| Max iterations per session | 2-3 | 10+ |
| Debug loops before escalation | ∞ | 3 max |
| On-chain diagnostic capability | None | Full read access |
| Investigation state persistence | None | Automatic |

---

## 5. Technical Details

### 5.1 RLM Implementation Options

| Option | Approach | Recommendation |
|--------|----------|----------------|
| Python REPL | Per paper, rules as Python objects | More complex |
| TypeScript module | Rules as TS exports | Matches codebase |
| YAML index | Rules indexed, loaded on demand | Simplest |

**Recommendation**: YAML index for simplicity. Each rule file gets an index entry with:
- Trigger patterns (keywords, hooks)
- Token count
- Dependencies

```yaml
# .claude/rules/index.yaml
rules:
  - file: 01-sigil-physics.md
    triggers: ["sync", "timing", "confirmation", "optimistic", "pessimistic"]
    tokens: 2500

  - file: 19-sigil-data-physics.md
    triggers: ["envio", "indexed", "on-chain", "web3", "??"]
    tokens: 800

  - file: 20-sigil-web3-flows.md
    triggers: ["stake", "claim", "approve", "withdraw", "bridge", "swap"]
    tokens: 1200
```

### 5.2 Craft State Schema

```yaml
# grimoires/sigil/craft-state.md
---
version: "1.0"
session:
  id: "uuid"
  started: "ISO8601"
  component: "ComponentName"

iterations:
  - number: 1
    action: "description"
    result: "outcome"
    hypothesis: "what we thought"

  - number: 2
    action: "description"
    result: "outcome"

loop_detected: false
escalation_offered: false

context:
  loaded_rules: ["01-sigil-physics.md"]
  tokens_used: 2400

next:
  recommendation: "diagnose" | "fix" | "escalate"
  reason: "why"
---
```

### 5.3 Ward Integration

Web3 patterns from rules also power `/ward` checks:

```
/ward file:src/components/StakeButton.tsx

┌─ Ward Report ──────────────────────────────────────────┐
│                                                        │
│  Web3 Flow Patterns (from rules/20-sigil-web3-flows):  │
│                                                        │
│  ⚠ Line 45: `if (amount)` — 0n is falsy               │
│    → Use `amount != null`                              │
│                                                        │
│  ⚠ Line 62: Fallback chain detected                   │
│    → See Data Physics: explicit sources per use case   │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

## 6. Migration Path

### 6.1 From Current State

```
Current:
├── /craft loads ~10k tokens every time
├── No state persistence between invocations
├── No web3-specific patterns
├── No escalation protocol
└── /observe, /ward are underutilized

Target:
├── /craft loads ~2k tokens (RLM)
├── craft-state.md persists investigation
├── Data Physics + Web3 Flows as rules
├── Loop detection → Loa escalation
└── /observe for diagnostics, /ward for validation
```

### 6.2 Backwards Compatibility

- Existing `/craft` usage unchanged
- New capabilities are additive
- Rules auto-loaded when patterns detected
- Escalation is recommendation, not requirement

---

## 7. Open Questions

1. **RLM index format**: YAML vs TypeScript module vs Python REPL?
2. **Escalation threshold**: 3 iterations, or configurable?
3. **Diagnostic depth**: How much on-chain inspection in Phase 3 vs Phase 4?

---

## 8. Appendices

### A. Issue #24 Bug Chain

```
Iteration 1: useCallback wrapper
  → Result: Stale receipt still triggers

Iteration 2: Receipt hash guard
  → Result: Wrong data source

Iteration 3: Fallback to Envio
  → Result: Envio was stale

Iteration 4: On-chain only
  → Result: Works for amounts

Iteration 5: if (depositedShares)
  → Result: 0n is falsy, broke check

Iteration 6+: Still debugging...
  → User: "More confused than when we started"
```

### B. Data Physics Quick Reference

| Use Case | Source | Why |
|----------|--------|-----|
| Display | Envio | Fast, acceptable stale |
| Transactions | On-chain | Must be accurate |
| Button states | On-chain | Prevent failed actions |
| History | Envio | Query optimized |

### C. UNIX Command Mapping

| Command | Purpose | Frequency |
|---------|---------|-----------|
| `/craft` | Do (generate, debug, fix) | Primary |
| `/observe` | Understand (truth, diagnostics) | Secondary |
| `/ward` | Verify (audit, validate) | Secondary |

Other commands are modes/aliases:
- `/style` → `/craft` material mode
- `/animate` → `/craft` animation mode
- `/behavior` → `/craft` behavioral mode

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-01-20 | Claude | Initial PRD |
| 1.1.0 | 2026-01-20 | Claude | Added Data Physics, RLM, Blockchain Inspection |
| 2.0.0 | 2026-01-20 | Claude | **Architecture rewrite**: RLM first, UNIX principle, patterns as rules |

---

*"RLM first. Everything else is blocked without context efficiency for /craft."*

```
    ╔═══════════════════════════════════════════════════════════╗
    ║  PRD v2.0.0 - ARCHITECTURE COMPLETE                       ║
    ║  Ready for /architect                                     ║
    ╚═══════════════════════════════════════════════════════════╝
```
