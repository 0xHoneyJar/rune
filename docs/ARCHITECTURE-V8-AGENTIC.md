# Sigil v8.0 Architecture: Agentic Experience Layer

> "Design for humans. Optimize for agents. Let agents serve humans better."

**Status:** DRAFT
**Author:** Human + Claude
**Date:** 2026-01-10

---

## Executive Summary

Sigil v7.x optimizes AI agents generating UI for humans. Sigil v8.0 extends this to AI agents *consuming and operating* products on behalf of humans.

The internet is transitioning from:
- **Human-operated** → Humans click, read, decide
- **Agent-facilitated** → Agents browse, evaluate, execute; humans approve

Sigil v8.0 introduces **Agentic Physics**: constraints and patterns that make products not just *visually consistent* but *agent-operable*.

---

## The Three Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    LAYER 3: AGENTIC PLAY                    │
│         Games, simulations, creative environments           │
│              Physics for agent entertainment                │
├─────────────────────────────────────────────────────────────┤
│                  LAYER 2: AGENTIC USABILITY                 │
│         Agents operating products on behalf of humans       │
│           Physics for reliable agent interaction            │
├─────────────────────────────────────────────────────────────┤
│                  LAYER 1: AGENTIC DISCOVERY                 │
│         Agents finding, evaluating, recommending            │
│              Physics for trust and clarity                  │
├─────────────────────────────────────────────────────────────┤
│                   LAYER 0: HUMAN EXPERIENCE                 │
│              (Current Sigil v7.x - UI Physics)              │
└─────────────────────────────────────────────────────────────┘
```

---

## Layer 1: Agentic Discovery

**Problem:** How do agents find, evaluate, and recommend your product?

### Current State (SEO)

Traditional SEO optimizes for crawlers that index keywords. Agentic search is different:
- Agents *understand* content, not just index it
- Agents evaluate *trustworthiness*, not just relevance
- Agents consider *operability*, not just information

### Discovery Physics

| Principle | Human Equivalent | Agent Equivalent |
|-----------|------------------|------------------|
| **Clarity** | Clear headlines | Unambiguous intent declarations |
| **Trust** | Professional design | Verifiable claims, structured data |
| **Completeness** | FAQ sections | Complete action schemas |
| **Predictability** | Consistent navigation | Deterministic interaction paths |

### Proposed Schema: `.sigil/discovery.yaml`

```yaml
version: "8.0"

# What is this product?
identity:
  type: "financial-application"
  domain: "defi-staking"
  actions:
    - stake
    - unstake
    - claim-rewards

# How should agents evaluate trust?
trust_signals:
  # Verifiable on-chain
  contracts:
    - address: "0x..."
      verified: true
      audit: "https://..."

  # Verifiable off-chain
  team:
    public: true
    doxxed: false

  # Historical
  uptime: "99.9%"
  incident_history: "https://status.example.com"

# What can agents do here?
capabilities:
  read:
    - portfolio_balance
    - reward_estimates
    - historical_performance

  write:
    - stake_tokens
    - unstake_tokens
    - claim_rewards

  constraints:
    - requires_wallet_signature
    - irreversible_after: "unstake_tokens"

# How should agents present this to humans?
presentation:
  summary_template: |
    {name} offers {apy}% APY on {token} staking.
    {risk_level} risk. {tvl} TVL.

  comparison_axes:
    - apy
    - risk_level
    - lock_period
    - audit_status
```

### Discovery Signals

| Signal | Weight | Verification |
|--------|--------|--------------|
| Structured capability declarations | High | Schema validation |
| On-chain contract verification | High | Blockchain query |
| Consistent UI ↔ API behavior | Medium | Agent testing |
| Historical reliability | Medium | Uptime monitoring |
| Clear error messaging | Medium | Semantic analysis |
| Accessibility compliance | Low | Automated audit |

---

## Layer 2: Agentic Usability

**Problem:** How do agents reliably operate your product on behalf of humans?

### The Usability Gap

A human can:
- Interpret ambiguous UI
- Recover from unexpected states
- Make judgment calls
- Adapt to changes

An agent needs:
- Deterministic interaction paths
- Predictable state machines
- Clear success/failure signals
- Stable selectors and APIs

### Usability Physics

```
┌─────────────────────────────────────────────────────────────┐
│                    AGENTIC USABILITY                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. DETERMINISM                                             │
│     Same input → Same output                                │
│     No hidden state affecting behavior                      │
│                                                             │
│  2. OBSERVABILITY                                           │
│     Agent can verify current state                          │
│     Agent can verify action succeeded                       │
│                                                             │
│  3. RECOVERABILITY                                          │
│     Clear paths from error states                           │
│     Graceful degradation                                    │
│                                                             │
│  4. EXPLAINABILITY                                          │
│     Why did this action fail?                               │
│     What are the prerequisites?                             │
│                                                             │
│  5. BOUNDARIES                                              │
│     What requires human approval?                           │
│     What is reversible vs irreversible?                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Proposed: Action Contracts

Like Sigil's Constitution protects human capabilities, **Action Contracts** define agent-operable actions:

```yaml
# .sigil/actions/stake.yaml
action: stake
version: "1.0"

# Prerequisites (agent must verify before attempting)
preconditions:
  - wallet_connected: true
  - token_balance: ">= amount"
  - allowance: ">= amount"

# The action itself
parameters:
  amount:
    type: uint256
    validation: "> 0 && <= balance"
  lock_period:
    type: enum
    options: [7d, 30d, 90d]
    default: 30d

# What the agent should observe
effects:
  - staked_balance: "+= amount"
  - liquid_balance: "-= amount"
  - rewards_accruing: true

# How to verify success
success_criteria:
  - transaction_confirmed: true
  - staked_balance_increased: true
  - event_emitted: "Staked(address, amount)"

# What can go wrong
failure_modes:
  insufficient_balance:
    recoverable: true
    action: "acquire more tokens"

  slippage_exceeded:
    recoverable: true
    action: "retry with higher slippage"

  contract_paused:
    recoverable: false
    action: "wait for unpause"

# Human approval requirements
approval:
  required: true
  timeout: 300s
  display:
    summary: "Stake {amount} {token} for {lock_period}"
    warnings:
      - "Tokens locked for {lock_period}"
      - "Early unstake incurs {penalty}% penalty"
```

### Agent Interaction Protocol

```
Agent                          Product                         Human
  │                               │                               │
  ├─── discover capabilities ────>│                               │
  │<── action contracts ──────────│                               │
  │                               │                               │
  ├─── verify preconditions ─────>│                               │
  │<── precondition status ───────│                               │
  │                               │                               │
  ├─── prepare action ───────────>│                               │
  │<── preview + approval request─│                               │
  │                               │                               │
  ├─────────────────── request approval ─────────────────────────>│
  │<────────────────── human approves ────────────────────────────│
  │                               │                               │
  ├─── execute action ───────────>│                               │
  │<── result + verification ─────│                               │
  │                               │                               │
  ├─────────────────── report result ────────────────────────────>│
```

---

## Layer 3: Agentic Play

**Problem:** How do agents participate in games, simulations, and creative environments?

### Why Games Matter

Games are the frontier of agentic interaction because they require:
- Real-time decision making
- Strategic reasoning
- Resource management
- Social coordination
- Creative expression

If Sigil can handle games, it can handle anything.

### Crypto Games: The Perfect Testbed

Crypto games combine:
- **Financial stakes** (Sigil's critical zone)
- **Agent operability** (on-chain actions)
- **Discovery** (which games are worth playing?)
- **Real-time interaction** (gameplay)
- **Social coordination** (guilds, markets)

### Game Physics

```yaml
# .sigil/game-physics.yaml

game:
  type: "strategy-rpg"
  blockchain: "base"

# Rhythm of the game
tempo:
  tick_rate: "1 block"  # ~2 seconds
  decision_window: "3 blocks"

# What agents can perceive
observability:
  public:
    - game_state
    - player_positions
    - resource_counts

  private:
    - own_inventory
    - own_strategy

  hidden:
    - other_player_strategies
    - upcoming_events

# Agent decision space
action_space:
  move:
    type: instant
    reversible: false

  attack:
    type: committed
    reversible: false
    commitment_window: "1 block"

  trade:
    type: negotiated
    reversible: true
    timeout: "10 blocks"

  craft:
    type: delayed
    reversible: false
    duration: "5 blocks"

# Stakes and approval
stakes:
  low:  # < $10 equivalent
    approval: none
    auto_execute: true

  medium:  # $10-$100
    approval: batch
    auto_execute: false

  high:  # > $100
    approval: individual
    human_override: always

# Agent capabilities
agent_modes:
  autopilot:
    description: "Agent plays autonomously within constraints"
    constraints:
      max_loss_per_session: "$50"
      forbidden_actions: [sell_rare_items]

  advisor:
    description: "Agent suggests, human executes"
    latency: "acceptable up to 30s"

  hybrid:
    description: "Agent handles routine, human handles strategic"
    routine: [gather, defend, trade_commodities]
    strategic: [attack, trade_rares, alliance]
```

### Unknown Territories

These are areas we don't fully understand yet:

#### 1. Agent Creativity
- Can agents generate novel game strategies?
- How do we evaluate "good" agent play?
- What's the role of randomness/exploration?

#### 2. Agent Social Dynamics
- How do agents coordinate in guilds?
- Can agents build reputation?
- What's the trust model between agents?

#### 3. Agent Entertainment Value
- If agents play games for humans, what makes it entertaining?
- Is the human spectating? Coaching? Co-piloting?
- New game genres designed for agent-human teams?

#### 4. Economic Implications
- Agents grinding games 24/7 affects economy
- How do games balance for agent participation?
- New economic models (agent labor markets?)

---

## Cross-Layer Considerations

### The Trust Stack

```
┌─────────────────────────────────────────────────────────────┐
│                    HUMAN TRUST IN AGENT                     │
│     "I trust this agent to act in my interest"              │
├─────────────────────────────────────────────────────────────┤
│                   AGENT TRUST IN PRODUCT                    │
│     "This product behaves predictably"                      │
├─────────────────────────────────────────────────────────────┤
│                  PRODUCT TRUST IN AGENT                     │
│     "This agent represents a legitimate user"               │
├─────────────────────────────────────────────────────────────┤
│                   HUMAN TRUST IN PRODUCT                    │
│     "This product is safe to use"                           │
└─────────────────────────────────────────────────────────────┘
```

Each layer needs its own trust mechanisms:
- **Human → Agent:** Permission scopes, spending limits, audit logs
- **Agent → Product:** Action contracts, success verification, failure recovery
- **Product → Agent:** Rate limits, capability verification, abuse detection
- **Human → Product:** Current Sigil (constitutional kernel, zones, physics)

### The Approval Spectrum

```
AUTONOMOUS ◄─────────────────────────────────────────► SUPERVISED

  Agent acts          Agent acts with        Human approves      Human acts
  independently       constraints            each action         directly
       │                   │                      │                  │
       ▼                   ▼                      ▼                  ▼

  Low stakes         Medium stakes          High stakes        Critical
  Reversible         Bounded loss           Irreversible       Protected
  Routine            Strategic              Exceptional        Constitutional
```

### State Synchronization

When agents operate products:
- Agent's model of state may diverge from actual state
- Products must provide reliable state queries
- Agents must handle stale state gracefully

```yaml
state_sync:
  polling_interval: "1s"

  consistency:
    eventually_consistent:
      - reward_estimates
      - leaderboards

    strongly_consistent:
      - balances
      - positions
      - pending_transactions

  staleness_tolerance:
    display: "30s"
    decision: "5s"
    execution: "0s"  # Always fresh for execution
```

---

## Implementation Phases

### Phase 1: Discovery Foundation (v8.0)

**Goal:** Products can declare capabilities; agents can discover them.

Deliverables:
- [ ] `.sigil/discovery.yaml` schema
- [ ] Discovery validation CLI
- [ ] Agent-readable capability manifest
- [ ] Trust signal aggregation

### Phase 2: Action Contracts (v8.1)

**Goal:** Products can define agent-operable actions with contracts.

Deliverables:
- [ ] `.sigil/actions/*.yaml` schema
- [ ] Action contract validation
- [ ] Precondition verification helpers
- [ ] Success/failure verification helpers

### Phase 3: Approval Flows (v8.2)

**Goal:** Seamless human-in-the-loop for agent actions.

Deliverables:
- [ ] Approval request protocol
- [ ] Batch approval for low-stakes
- [ ] Audit logging
- [ ] Spending limits and constraints

### Phase 4: Game Physics (v8.3)

**Goal:** Framework for agent participation in games.

Deliverables:
- [ ] Game physics schema
- [ ] Tempo and rhythm definitions
- [ ] Stakes classification
- [ ] Agent mode definitions

### Phase 5: Unknown Exploration (v8.x)

**Goal:** Research and experimentation on frontier problems.

Areas:
- Agent creativity and strategy
- Agent social coordination
- Agent entertainment value
- Economic balancing

---

## Open Questions

### Technical

1. **State verification:** How do agents verify on-chain state matches UI state?
2. **Selector stability:** How do we ensure DOM selectors remain stable for agent interaction?
3. **API versioning:** How do we handle breaking changes for agent-integrated products?
4. **Latency budgets:** What latencies are acceptable for different action types?

### Philosophical

1. **Agent identity:** Should agents have persistent identity? Reputation?
2. **Agent liability:** Who's responsible when an agent makes a bad decision?
3. **Agent rights:** Can a product ban an agent? Under what conditions?
4. **Human agency:** How do we ensure humans remain in control?

### Economic

1. **Agent labor:** If agents can work, how does this affect human labor?
2. **Agent markets:** Will there be markets for agent services?
3. **Agent costs:** Who pays for agent computation? Token costs?
4. **Value capture:** How do products capture value from agent interactions?

### Creative

1. **Agent art:** Can agents create? Should they?
2. **Agent play:** What does "fun" mean for an agent?
3. **Agent stories:** Can agents participate in narrative experiences?
4. **Human-agent collaboration:** New creative forms?

---

## Appendix: Crypto Game Case Study

### HoneyJar: Agent-Ready Design

Imagine applying Sigil v8.0 to a crypto game like HoneyJar:

```yaml
# .sigil/discovery.yaml
identity:
  type: "crypto-game"
  genre: "strategy-collection"
  blockchain: "berachain"

capabilities:
  read:
    - jar_contents
    - honey_balance
    - leaderboard_position
    - upcoming_drops

  write:
    - collect_honey
    - open_jar
    - trade_nft
    - stake_honey

# .sigil/actions/collect_honey.yaml
action: collect_honey
preconditions:
  - wallet_connected: true
  - honey_available: "> 0"
  - cooldown_complete: true

effects:
  - honey_balance: "+= claimable_amount"
  - last_claim: now()
  - next_claim: now() + cooldown

approval:
  required: false  # Low stakes, routine

# .sigil/game-physics.yaml
tempo:
  honey_generation: "1 HONEY per hour per jar"
  collection_cooldown: "4 hours"

agent_modes:
  honey_farmer:
    auto_actions: [collect_honey]
    schedule: "every 4 hours"
    max_gas_per_day: "0.01 ETH"

  jar_hunter:
    auto_actions: [monitor_drops, alert_human]
    notify_on: [new_jar_available, price_below_threshold]
```

This enables:
- Agents collecting honey on schedule
- Agents alerting humans to opportunities
- Agents managing routine while humans decide strategy

---

## Next Steps

1. **Validate with real products:** Apply these concepts to HoneyJar, set-and-forgetti
2. **Build discovery schema:** Start with `.sigil/discovery.yaml`
3. **Prototype action contracts:** One critical action end-to-end
4. **Gather unknowns:** Document what we don't know yet
5. **Community input:** What do builders need?

---

*Sigil v8.0 "Agentic Muse" — DRAFT*
*Last Updated: 2026-01-10*
