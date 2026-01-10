# Sigil v8.0: Agentic Discovery & Search

> "If agents can't find you, you don't exist. If agents don't trust you, you don't matter."

**Status:** DRAFT
**Focus:** Marketing/Discovery optimization for agentic search
**Date:** 2026-01-10

---

## The Shift

| Era | Discovery Mechanism | Optimization Target |
|-----|---------------------|---------------------|
| **Web 1.0** | Directories, links | Get listed |
| **Web 2.0** | Search engines (Google) | Keywords, backlinks, SEO |
| **Web 3.0** | Social, algorithmic | Engagement, virality |
| **Agentic** | AI evaluation | Trust, clarity, operability |

Traditional SEO games search engines. Agentic discovery requires *genuine quality* because agents can:
- Understand context, not just keywords
- Verify claims against reality
- Test operability directly
- Compare alternatives systematically

**You can't fake it. The product IS the marketing.**

---

## How Agents Discover

### The Agent's Decision Process

```
User: "Find me a good staking platform for ETH"

Agent Mental Model:
1. DISCOVER — What options exist?
   └── Search, crawl, query APIs, check registries

2. EVALUATE — Which are trustworthy?
   └── Verify claims, check audits, assess risk

3. COMPARE — Which is best for this user?
   └── APY, lock periods, fees, UX quality

4. RECOMMEND — Present options with reasoning
   └── Summary, tradeoffs, confidence level

5. OPERATE (if authorized) — Execute on user's behalf
   └── Connect wallet, stake, verify success
```

### What Agents Look For

| Signal | Weight | Why |
|--------|--------|-----|
| **Structured declarations** | Very High | Agents parse this directly |
| **Verifiable claims** | Very High | Can be checked on-chain/API |
| **Consistent behavior** | High | UI matches API matches contract |
| **Clear error handling** | High | Agent can recover from failures |
| **Historical reliability** | Medium | Track record matters |
| **Community signals** | Medium | What do other agents/users say? |
| **UI quality** | Low | Agents may not even use UI |

---

## Discovery Schema

### Product Identity

```yaml
# .sigil/discovery.yaml

# Who are you?
identity:
  name: "Set & Forgetti"
  tagline: "Automated DeFi strategies that run themselves"
  type: "defi-automation"
  category: "yield-optimization"

  # Machine-readable classification
  taxonomy:
    primary: "defi/yield/automated"
    secondary:
      - "defi/staking"
      - "defi/farming"

  # Natural language for agent reasoning
  description: |
    Set & Forgetti automates DeFi yield strategies. Users deposit once,
    the protocol handles rebalancing, compounding, and optimization.
    No active management required.

# What chains/networks?
networks:
  - chain: "ethereum"
    contracts:
      vault: "0x..."
      strategy: "0x..."

  - chain: "base"
    contracts:
      vault: "0x..."
      strategy: "0x..."
```

### Capability Declaration

```yaml
# What can agents do here?
capabilities:
  # Read operations (no auth required)
  public_read:
    - endpoint: "/api/v1/vaults"
      returns: "list of available vaults with APY"

    - endpoint: "/api/v1/vault/{id}/performance"
      returns: "historical performance data"

    - endpoint: "/api/v1/user/{address}/positions"
      returns: "user's current positions"

  # Write operations (wallet required)
  authenticated_write:
    - action: "deposit"
      requires: ["wallet_signature", "token_approval"]
      reversible: true
      reversal_action: "withdraw"

    - action: "withdraw"
      requires: ["wallet_signature"]
      reversible: false
      constraints:
        - "may incur early exit fee if < 7 days"

  # What agents CANNOT do
  limitations:
    - "Cannot withdraw to address other than depositor"
    - "Cannot modify strategy parameters (admin only)"
    - "Rate limited to 10 requests/second"
```

### Trust Signals

```yaml
# Why should agents trust you?
trust:
  # Verifiable on-chain
  contracts:
    verified_source: true
    audit_reports:
      - auditor: "OpenZeppelin"
        date: "2025-11-15"
        url: "https://..."
        findings: "0 critical, 2 medium (resolved)"

    bug_bounty:
      active: true
      max_payout: "$500,000"
      url: "https://immunefi.com/..."

  # Verifiable off-chain
  team:
    public: true
    doxxed: true
    previous_projects:
      - name: "OtherProtocol"
        outcome: "successful"

  # Historical
  track_record:
    launched: "2025-06-01"
    tvl_current: "$50M"
    tvl_ath: "$75M"
    incidents: 0
    uptime: "99.95%"

  # Third-party signals
  integrations:
    - name: "DeFiLlama"
      url: "https://defillama.com/protocol/set-and-forgetti"
    - name: "DeBank"
      url: "https://..."
```

### Comparison Axes

```yaml
# How should agents compare you to alternatives?
comparison:
  # Primary metrics (agents will rank by these)
  primary_axes:
    - metric: "apy"
      current: "8.5%"
      type: "higher_is_better"
      volatility: "low"  # stable vs variable

    - metric: "risk_score"
      current: "B+"  # or numeric
      type: "higher_is_better"
      methodology: "https://..."

  # Secondary considerations
  secondary_axes:
    - metric: "min_deposit"
      value: "$100"
      type: "lower_is_better"

    - metric: "lock_period"
      value: "none"
      type: "lower_is_better"

    - metric: "fees"
      value: "2% performance fee"
      type: "lower_is_better"

  # Qualitative differentiators
  differentiators:
    - "Fully automated rebalancing"
    - "No lock-up period"
    - "Multi-chain support"

  # Honest limitations
  limitations:
    - "Lower APY than riskier alternatives"
    - "Only supports stablecoins currently"
```

### Agent Instructions

```yaml
# How should agents present you to humans?
presentation:
  # Short summary for quick decisions
  one_liner: "Automated {apy}% yield on {supported_tokens}, no lock-up, audited by {auditor}"

  # Structured summary
  summary_template: |
    **{name}** - {tagline}

    📈 Current APY: {apy}%
    🔒 Lock period: {lock_period}
    💰 Min deposit: {min_deposit}
    ⚡ Risk level: {risk_score}
    ✅ Audited: {audit_status}

  # For comparison tables
  comparison_card:
    title: "{name}"
    metrics:
      - "APY: {apy}%"
      - "Risk: {risk_score}"
      - "Lock: {lock_period}"
    cta: "Deposit {supported_tokens}"

  # Warnings agents should surface
  warnings:
    - condition: "user_risk_tolerance == 'low' && risk_score < 'A'"
      message: "Higher risk than your stated preference"

    - condition: "deposit_amount > tvl * 0.01"
      message: "Large deposit relative to protocol size"
```

---

## Discovery Protocol

### Registration

Products register with discovery aggregators:

```yaml
# POST to discovery.sigil.dev/register
registration:
  manifest_url: "https://setandforgetti.com/.well-known/sigil-discovery.yaml"
  verify_ownership: true  # DNS TXT record or on-chain registration

# Verification methods
verification:
  dns:
    type: "TXT"
    record: "_sigil-verify.setandforgetti.com"
    value: "sigil-verify=abc123"

  onchain:
    contract: "0x..."
    method: "sigilManifest()"
    returns: "https://..."
```

### Freshness

```yaml
# How often should agents re-fetch?
freshness:
  manifest: "24h"      # Schema changes rarely
  metrics: "1h"        # APY, TVL change frequently
  status: "5m"         # Uptime, incidents

# Webhooks for real-time updates
webhooks:
  events:
    - "apy_changed"
    - "incident_started"
    - "incident_resolved"
    - "new_vault_added"
```

### Agent Query Protocol

```
Agent → Discovery Service:
  "Find yield protocols on Base with >5% APY, audited, <$1k min deposit"

Discovery Service → Agent:
  [
    {
      "name": "Set & Forgetti",
      "match_score": 0.95,
      "apy": "8.5%",
      "audited": true,
      "min_deposit": "$100",
      "manifest": "https://..."
    },
    ...
  ]

Agent → Product:
  GET /.well-known/sigil-discovery.yaml

Agent → Human:
  "I found 3 options matching your criteria..."
```

---

## Marketing Implications

### What Changes

| Old Marketing | Agentic Marketing |
|---------------|-------------------|
| Catchy headlines | Clear capability declarations |
| Beautiful landing pages | Structured data |
| Testimonials | Verifiable track record |
| "Trust us" | "Verify us" |
| SEO keywords | Semantic accuracy |
| Call-to-action buttons | Agent-operable endpoints |

### What Stays

- Brand still matters (agents may surface brand to humans)
- UX still matters (humans still use products directly)
- Community still matters (social signals)
- Content still matters (agents read documentation)

### New Marketing Channels

1. **Discovery registries** — Get listed in agent-queryable databases
2. **Comparison aggregators** — Structured comparison sites for agents
3. **Agent testimonials** — "This agent uses X successfully"
4. **Capability showcases** — "Here's what agents can do with us"
5. **Integration partnerships** — "Works with Agent Y out of the box"

---

## Implementation Checklist

### Phase 1: Basic Discovery

- [ ] Create `.sigil/discovery.yaml` with identity
- [ ] Add `/.well-known/sigil-discovery.yaml` endpoint
- [ ] Declare basic capabilities (read operations)
- [ ] Add trust signals (audits, track record)

### Phase 2: Rich Metadata

- [ ] Add comparison axes
- [ ] Add presentation templates
- [ ] Add warnings and limitations
- [ ] Implement freshness webhooks

### Phase 3: Verification

- [ ] Add DNS verification
- [ ] Add on-chain manifest pointer
- [ ] Register with discovery aggregators
- [ ] Set up monitoring for manifest accuracy

### Phase 4: Optimization

- [ ] A/B test presentation templates
- [ ] Track agent conversion rates
- [ ] Optimize comparison positioning
- [ ] Build agent-specific landing experiences

---

## Metrics

### Agent Discovery Metrics

| Metric | Description |
|--------|-------------|
| **Agent impressions** | How often agents discover you |
| **Agent recommendations** | How often agents recommend you |
| **Agent conversions** | How often recommendations lead to action |
| **Agent retention** | Do agents keep recommending you? |
| **Verification success rate** | How often agent verification passes |

### Quality Signals

| Signal | Target |
|--------|--------|
| Manifest validation | 100% valid |
| Claim verification | 100% verifiable |
| API consistency | UI = API = Contract |
| Uptime | >99.9% |
| Freshness | <1h stale metrics |

---

*Next: [ARCHITECTURE-V8-HEADLESS-PLAY.md](./ARCHITECTURE-V8-HEADLESS-PLAY.md)*
