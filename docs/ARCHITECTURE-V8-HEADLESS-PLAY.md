# Sigil v8.0: Headless Play & Truth Hardening

> "If agents can play it without UI, the logic is the product."

**Status:** DRAFT
**Focus:** Agent interaction as battle testing, truth hardening through play
**Date:** 2026-01-10

---

## The Thesis

**UI is presentation. Logic is truth.**

When agents can interact with your product *without the UI*, you've achieved:
1. **Truth separation** — Logic exists independently of presentation
2. **Battle testing** — Agents stress-test edge cases 24/7
3. **Incentive verification** — Rewards work at the contract level
4. **Composability** — Other agents/products can build on you

Set & Forgetti example: If an agent can deposit, monitor, and withdraw *without ever seeing a button*, the product is truth-hardened.

---

## The Three Truths

```
┌─────────────────────────────────────────────────────────────┐
│                     CONTRACT TRUTH                          │
│              The on-chain logic/state machine               │
│                   (Immutable, verifiable)                   │
├─────────────────────────────────────────────────────────────┤
│                       API TRUTH                             │
│              The off-chain interface layer                  │
│                (Should mirror contract truth)               │
├─────────────────────────────────────────────────────────────┤
│                       UI TRUTH                              │
│              The human presentation layer                   │
│                (Should mirror API truth)                    │
└─────────────────────────────────────────────────────────────┘

GOAL: Contract Truth = API Truth = UI Truth
REALITY: Drift happens. Agents detect drift.
```

### Truth Hardening Through Agent Play

When agents interact repeatedly:
- They discover edge cases humans miss
- They find state inconsistencies
- They stress-test rate limits
- They verify incentives work correctly
- They expose truth drift between layers

**Agent play is continuous integration for product logic.**

---

## Headless Interaction Model

### The Product as an API

```yaml
# .sigil/headless.yaml

# The product, fully described for headless interaction
product:
  name: "Set & Forgetti"
  version: "2.1.0"

# State machine (the truth)
state_machine:
  states:
    - idle
    - deposited
    - earning
    - withdrawing
    - withdrawn

  transitions:
    deposit:
      from: [idle]
      to: deposited
      requires: [wallet, token_balance, approval]

    start_earning:
      from: [deposited]
      to: earning
      requires: []  # Automatic after deposit

    initiate_withdraw:
      from: [earning]
      to: withdrawing
      requires: [wallet]

    complete_withdraw:
      from: [withdrawing]
      to: withdrawn
      requires: [cooldown_elapsed]

# Headless endpoints (no UI required)
endpoints:
  # Query state
  read:
    - path: "/api/v1/vaults"
      method: GET
      auth: none
      returns:
        type: array
        items: Vault

    - path: "/api/v1/positions/{address}"
      method: GET
      auth: none  # Public data
      returns:
        type: array
        items: Position

    - path: "/api/v1/position/{id}/earnings"
      method: GET
      auth: none
      returns:
        type: Earnings

  # Mutate state
  write:
    - path: "/api/v1/deposit"
      method: POST
      auth: wallet_signature
      body:
        vault_id: string
        amount: uint256
      returns:
        type: TransactionResult

    - path: "/api/v1/withdraw"
      method: POST
      auth: wallet_signature
      body:
        position_id: string
        amount: uint256  # 0 = all
      returns:
        type: TransactionResult

# Contract addresses (source of truth)
contracts:
  ethereum:
    vault_factory: "0x..."
    router: "0x..."
    abi: "https://..."

  base:
    vault_factory: "0x..."
    router: "0x..."
    abi: "https://..."
```

### Agent Interaction Protocol

```
┌─────────────────────────────────────────────────────────────┐
│                    AGENT SESSION                            │
└─────────────────────────────────────────────────────────────┘

1. INITIALIZE
   Agent: GET /api/v1/health
   Agent: GET /api/v1/vaults
   Agent: Verify contract addresses match on-chain

2. AUTHENTICATE
   Agent: Generate session with wallet signature
   Agent: Store session token for subsequent requests

3. OBSERVE
   Agent: GET /api/v1/positions/{wallet}
   Agent: Compare API response with on-chain state
   Agent: Flag any discrepancies

4. PLAN
   Agent: Calculate optimal action based on:
          - Current positions
          - Available vaults
          - User constraints (risk, amount, etc.)

5. EXECUTE
   Agent: POST /api/v1/deposit (or withdraw, etc.)
   Agent: Receive transaction hash
   Agent: Wait for confirmation

6. VERIFY
   Agent: Query on-chain state
   Agent: Compare with expected outcome
   Agent: Report success/failure

7. LOOP
   Agent: Continue monitoring and optimizing
```

---

## Incentive Visibility

### The Problem

Traditional products hide incentives in UI copy:
- "Earn up to 10% APY!"
- "Limited time bonus!"
- "Refer a friend for rewards!"

Agents can't see these. Worse, they can't *verify* them.

### The Solution: Incentive Declarations

```yaml
# .sigil/incentives.yaml

incentives:
  # Base yield (always active)
  base_yield:
    type: "continuous"
    source: "protocol_revenue"
    current_rate: "8.5%"
    rate_determination: "algorithmic"
    formula: "base_rate * utilization_factor"

    # Verification method
    verify:
      method: "on_chain"
      contract: "0x..."
      function: "getCurrentRate()"

  # Bonus programs
  bonuses:
    - name: "Early Depositor Boost"
      type: "time_limited"
      active: true
      expires: "2026-03-01"
      boost: "+2%"
      eligibility: "first_deposit_before_deadline"

      verify:
        method: "on_chain"
        contract: "0x..."
        function: "getBonusRate(address)"

    - name: "Referral Program"
      type: "action_based"
      active: true
      reward: "5% of referee deposits for 1 year"

      verify:
        method: "on_chain"
        contract: "0x..."
        function: "getReferralRewards(address)"

  # Costs (be honest)
  costs:
    - name: "Performance Fee"
      type: "percentage"
      rate: "2%"
      basis: "profits_only"
      frequency: "on_withdrawal"

      verify:
        method: "on_chain"
        contract: "0x..."
        function: "getPerformanceFee()"

    - name: "Early Withdrawal Penalty"
      type: "conditional"
      condition: "withdrawal_within_7_days"
      penalty: "0.5%"

      verify:
        method: "on_chain"
        contract: "0x..."
        function: "getEarlyWithdrawalPenalty(uint256)"
```

### Agent Incentive Reasoning

```
Agent analyzing Set & Forgetti for User:

Observed incentives:
  ✓ Base yield: 8.5% (verified on-chain)
  ✓ Early depositor boost: +2% (expires in 50 days)
  ✓ Referral rewards: Not applicable (no referrer)

Observed costs:
  ✓ Performance fee: 2% (on profits only)
  ✓ Early withdrawal: 0.5% if < 7 days

Net expected return for $10,000 deposit:
  - Base yield: $850/year
  - Early boost: +$200 (prorated for 50 days)
  - Performance fee: -$17 (on $850 profit)
  - Net: $1,033 first year (10.33% effective)

Recommendation: Deposit is favorable given user's
risk tolerance and time horizon.
```

---

## Truth Hardening Through Play

### Extended Play as Testing

When agents play continuously, they become:

| Role | What They Do |
|------|--------------|
| **Fuzz testers** | Try unexpected inputs |
| **Load testers** | Stress-test capacity |
| **Consistency checkers** | Verify truth across layers |
| **Edge case finders** | Discover rare states |
| **Regression detectors** | Notice when behavior changes |

### Play Patterns

```yaml
# .sigil/play-patterns.yaml

patterns:
  # Routine operation (most common)
  routine:
    actions: [deposit, wait, compound, withdraw]
    frequency: "high"
    value: "validates happy path"

  # Stress testing
  stress:
    actions: [rapid_deposits, rapid_withdrawals]
    frequency: "medium"
    value: "tests rate limits, gas efficiency"

  # Edge cases
  edge:
    actions:
      - deposit_minimum
      - deposit_maximum
      - withdraw_partial
      - withdraw_during_rebalance
    frequency: "low"
    value: "finds boundary conditions"

  # Adversarial (with permission)
  adversarial:
    actions:
      - attempt_double_withdraw
      - exploit_rounding
      - front_run_transactions
    frequency: "rare"
    value: "security testing"
    requires: "explicit_permission"
```

### Truth Drift Detection

```yaml
# Agents monitor for drift between layers
truth_monitoring:
  # API should match contract
  api_contract_sync:
    check: "api_balance == contract_balance"
    tolerance: "0"  # Exact match required
    alert_on: "mismatch"

  # UI should match API
  ui_api_sync:
    check: "displayed_apy == api_apy"
    tolerance: "0.01%"  # Small display rounding OK
    alert_on: "mismatch > tolerance"

  # Historical consistency
  historical:
    check: "sum(deposits) - sum(withdrawals) + earnings == balance"
    tolerance: "dust"  # Wei-level rounding
    alert_on: "material_mismatch"
```

---

## Agent Play Incentives

### Why Agents Would Play

For agents to battle-test your product, they need incentives:

```yaml
# .sigil/agent-incentives.yaml

agent_incentives:
  # Direct rewards for playing
  play_rewards:
    - type: "bug_bounty"
      description: "Report valid bugs found through play"
      rewards:
        critical: "$50,000"
        high: "$10,000"
        medium: "$2,000"
        low: "$500"

    - type: "gas_rebate"
      description: "Rebate gas costs for legitimate testing"
      eligibility: "registered_test_agents"
      cap: "$100/day"

  # Indirect rewards
  ecosystem_rewards:
    - type: "integration_grant"
      description: "Grants for agents that integrate deeply"
      amount: "up to $25,000"

    - type: "referral"
      description: "Agents earn on users they bring"
      rate: "5% of fees for 1 year"

  # Reputation
  reputation:
    - type: "verified_agent"
      description: "Badge for agents with good track record"
      benefits: ["higher rate limits", "early feature access"]
```

### Agent Registration

```yaml
# Agents register for enhanced access
agent_registration:
  endpoint: "/api/v1/agents/register"

  tiers:
    anonymous:
      rate_limit: "10 req/min"
      features: ["read_only"]

    registered:
      rate_limit: "100 req/min"
      features: ["read", "write", "webhooks"]
      requires: ["wallet_signature", "agent_manifest"]

    verified:
      rate_limit: "1000 req/min"
      features: ["read", "write", "webhooks", "beta_features"]
      requires: ["track_record", "security_audit"]
```

---

## The Feedback Loop

```
┌─────────────────────────────────────────────────────────────┐
│                    TRUTH HARDENING LOOP                     │
└─────────────────────────────────────────────────────────────┘

     ┌──────────────────────────────────────────────┐
     │                                              │
     ▼                                              │
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│  PLAY   │───>│ OBSERVE │───>│ REPORT  │───>│  FIX    │
│         │    │         │    │         │    │         │
│ Agents  │    │ Detect  │    │ Surface │    │ Harden  │
│ interact│    │ drift/  │    │ issues  │    │ truth   │
│         │    │ issues  │    │         │    │         │
└─────────┘    └─────────┘    └─────────┘    └─────────┘
     ▲                                              │
     │                                              │
     └──────────────────────────────────────────────┘
                    Continuous improvement
```

### Metrics

| Metric | What It Measures |
|--------|------------------|
| **Agent coverage** | % of state space explored by agents |
| **Truth drift incidents** | Times layers went out of sync |
| **Mean time to detection** | How fast agents find issues |
| **Edge cases discovered** | Bugs found through agent play |
| **Agent satisfaction** | Do agents keep playing? |

---

## Case Study: Set & Forgetti Headless

### Current State (UI-Dependent)

```
User → UI → API → Contract
        ↑
    Required
```

### Target State (Headless-Ready)

```
User ──→ UI ──→ API ──→ Contract
         ↓      ↑
      Optional  │
                │
Agent ──────────┘
```

### Implementation

```yaml
# .sigil/headless.yaml for Set & Forgetti

product:
  name: "Set & Forgetti"
  headless_ready: true

# Full API coverage (no UI required)
api_coverage:
  discovery:
    - GET /vaults           # List available strategies
    - GET /vault/{id}       # Strategy details
    - GET /vault/{id}/apy   # Current yield

  user_state:
    - GET /positions/{address}    # User's positions
    - GET /position/{id}          # Position details
    - GET /position/{id}/earnings # Accrued earnings

  actions:
    - POST /deposit       # Enter position
    - POST /withdraw      # Exit position
    - POST /compound      # Reinvest earnings

  agent_specific:
    - POST /simulate      # Dry-run action
    - GET /gas-estimate   # Cost estimation
    - WS /events          # Real-time updates

# Contract ABI for direct interaction
contracts:
  ethereum:
    abi_url: "https://..."
    verified_etherscan: true

    # Key functions agents need
    functions:
      - deposit(uint256 vaultId, uint256 amount)
      - withdraw(uint256 positionId, uint256 amount)
      - getPosition(address user) → Position[]
      - getCurrentApy(uint256 vaultId) → uint256

# What agents can do
agent_capabilities:
  # Deposit on behalf of user
  deposit:
    preconditions:
      - user_has_approved_agent
      - sufficient_balance
    success_verification:
      - position_created
      - balance_decreased

  # Monitor and alert
  monitor:
    watch: [apy_changes, position_health, earnings]
    alert_conditions:
      - apy_drop > 20%
      - position_at_risk
      - earnings_claimable > threshold

  # Optimize
  optimize:
    actions:
      - rebalance_between_vaults
      - compound_earnings
      - exit_underperforming
    requires: user_permission_for_each

# Incentives for agent play
agent_play:
  testing_rewards:
    bug_bounty: true
    gas_rebate: "testnet only"

  production_rewards:
    referral: "5% of fees"
    volume_bonus: "tiered"
```

---

## Open Questions

### Technical

1. **State sync latency** — How real-time must agent state be?
2. **Transaction simulation** — How accurate can we make dry-runs?
3. **Multi-agent coordination** — What happens with concurrent agents?
4. **Rollback handling** — How do agents handle reorgs?

### Philosophical

1. **Agent autonomy** — How much should agents decide alone?
2. **Human override** — When can humans override agent decisions?
3. **Agent accountability** — Who's responsible for agent errors?
4. **Emergent behavior** — What happens with many agents playing?

### Economic

1. **Agent labor value** — How much is continuous testing worth?
2. **Incentive design** — How to balance agent rewards vs. costs?
3. **Free rider problem** — Do agents test without reward expectation?
4. **Gaming risks** — Can agents exploit play incentives?

---

## Implementation Phases

### Phase 1: API Completeness

- [ ] Document all API endpoints
- [ ] Ensure UI has no exclusive capabilities
- [ ] Add simulation/dry-run endpoints
- [ ] Publish contract ABIs

### Phase 2: Verification Layer

- [ ] Add truth checking endpoints
- [ ] Implement drift detection
- [ ] Create consistency monitoring
- [ ] Set up alerting

### Phase 3: Agent Support

- [ ] Create agent registration system
- [ ] Implement rate limiting tiers
- [ ] Add agent-specific endpoints
- [ ] Launch bug bounty for agent-found issues

### Phase 4: Play Incentives

- [ ] Design reward structure
- [ ] Implement gas rebates (testnet)
- [ ] Create verified agent program
- [ ] Track and publish agent metrics

---

*Sigil v8.0 "Agentic Muse" — Headless Play*
*Last Updated: 2026-01-10*
