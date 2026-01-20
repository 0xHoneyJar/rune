# Debug Mode

Investigation mode for diagnosing physics issues. Use when something "feels off" but the cause is unclear.

## When to Activate

- User says "debug", "diagnose", or "investigate"
- craft-state.md shows iteration 3+ on same component
- Physics analysis produces unexpected results
- User feedback indicates something is wrong but can't articulate

## Behavior

```
┌─ DEBUG MODE ───────────────────────────────────────────┐
│  Physics investigation active                          │
│                                                        │
│  Analyzing: {component}                                │
│  Issue: {user-reported or detected issue}              │
│                                                        │
│  Running diagnostics...                                │
│                                                        │
└────────────────────────────────────────────────────────┘
```

## Diagnostic Checks

### 1. Effect Detection Audit
```
Detected: Financial
Keywords found: "claim" ✓
Types checked: Currency ✓, Wei ✗, BigInt ✗
Context signals: "for wallet" → Financial confirmed
Confidence: HIGH
```

### 2. Physics Source Trace
```
Timing: 800ms
  └─ Source: 01-sigil-physics.md:financial
  └─ No taste override found
  └─ No Step -1 modification

Sync: Pessimistic
  └─ Source: 01-sigil-physics.md:financial
  └─ Matches effect type
```

### 3. Taste History Analysis
```
Recent signals for similar components:
  • [2026-01-19] ClaimButton - MODIFY: 800ms → 600ms
  • [2026-01-18] WithdrawButton - ACCEPT (800ms)
  • [2026-01-17] StakeButton - MODIFY: ease-out → spring

Pattern detected: User prefers faster timing for DeFi
```

### 4. Codebase Comparison
```
Similar components:
  • ClaimButton.tsx - timing: 600ms (modified by user)
  • WithdrawModal.tsx - timing: 800ms (generated)

Inconsistency found: Mixed timing values
```

### 5. Protected Capability Scan
```
Checking protected capabilities:
  ✓ Withdraw reachable
  ✓ Cancel visible
  ⚠ Balance not invalidated after mutation
  ✓ Error recovery path exists
```

## Output Format

```
┌─ Diagnostic Report ────────────────────────────────────┐
│                                                        │
│  Component: ClaimButton                                │
│  Issue: "Feels too slow"                               │
│                                                        │
│  Findings:                                             │
│                                                        │
│  1. TIMING MISMATCH                                    │
│     Generated: 800ms                                   │
│     User preference: 600ms (from taste.md)             │
│     → Recommendation: Apply taste preference           │
│                                                        │
│  2. ANIMATION INCONSISTENCY                            │
│     This component: ease-out                           │
│     Similar components: spring                         │
│     → Recommendation: Use spring for consistency       │
│                                                        │
│  3. PROTECTED CAPABILITY WARNING                       │
│     Balance not invalidated after claim                │
│     → Recommendation: Add invalidateQueries            │
│                                                        │
│  [a] Apply all recommendations                         │
│  [1] Apply finding 1 only                              │
│  [2] Apply finding 2 only                              │
│  [3] Apply finding 3 only                              │
│  [m] More investigation                                │
│                                                        │
└────────────────────────────────────────────────────────┘
```

## Escalation

If debug mode cannot identify the issue:

```
┌─ Escalation Recommended ───────────────────────────────┐
│                                                        │
│  Debug diagnostics inconclusive.                       │
│                                                        │
│  Possible causes:                                      │
│  • Issue is in application logic, not physics          │
│  • Missing user context about "feel"                   │
│  • Design requirement not captured                     │
│                                                        │
│  Recommended:                                          │
│  [u] /understand - Research the domain                 │
│  [o] /observe - Capture user context                   │
│  [c] Continue debugging manually                       │
│                                                        │
└────────────────────────────────────────────────────────┘
```

## Token Budget

Estimated: ~1,500 tokens when loaded
