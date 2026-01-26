# Security Audit Hook

Runs Rigor checks during `/audit-sprint`.

## Trigger

Activated when `/audit-sprint` runs and files contain:
- Web3 patterns: useWriteContract, BigInt, transaction flows
- Financial types: Currency, Wei, Token, Amount

## Detection Patterns

```regex
useWriteContract|useReadContract|useSendTransaction
BigInt\(|0n|[0-9]+n
approve|transfer|claim|withdraw|stake|swap
```

## Behavior

1. Detect web3 files via pattern matching
2. For each detected file, run `/rigor` checks:
   - BigInt safety
   - Data source correctness
   - Receipt guards
   - Stale closures
3. Collect findings with severity classification
4. Report with blocking behavior

## Finding Categories

| Category | Severity | Examples |
|----------|----------|----------|
| Data Source | CRITICAL | Transaction amount from indexed data |
| BigInt Safety | HIGH | `if (amount)` for BigInt |
| Receipt Guard | HIGH | Missing hash comparison |
| Stale Closure | MEDIUM | Captured value in useEffect |

## Report Format

```markdown
## Rigor Validation (Web3 Safety)

### VaultWithdraw.tsx
CRITICAL: Transaction amount from indexed data (line 45)
  → Amount should come from useReadContract, not useEnvioQuery
  → Fix: Replace `envioData.shares` with on-chain read

HIGH: BigInt falsy check (line 67)
  → `if (shares)` fails when shares === 0n
  → Fix: `if (shares != null && shares > 0n)`

### StakingPanel.tsx
HIGH: Missing receipt guard (line 89)
  → useEffect may trigger multiple times
  → Fix: Add transactionHash comparison

### Summary
- 2 files checked
- 4 findings (1 CRITICAL, 2 HIGH, 1 MEDIUM)
- CRITICAL findings must be addressed before approval
```

## Blocking Behavior

| Severity | Action |
|----------|--------|
| CRITICAL | Block audit approval |
| HIGH | Require explicit acknowledgment |
| MEDIUM | Note for future attention |
| LOW | Log only |

## Override Protocol

If critical finding must be bypassed:

1. Require explicit user confirmation
2. Log override with reason
3. Add TODO comment in code
