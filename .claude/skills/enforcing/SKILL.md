---
name: enforcing
description: Check data correctness in web3 components
user-invocable: true
disable-model-invocation: true
allowed-tools:
  - Read
  - Glob
  - Grep
---

# Enforcing

Validate data correctness in web3 components. Catch bugs that lose money.

## Usage

```
/rigor file.tsx
/rigor
```

## What It Checks

1. **Data sources** — Transaction data from on-chain?
2. **BigInt safety** — Safe comparisons? (0n is falsy)
3. **Receipt guards** — Protected against re-execution?
4. **Stale closures** — Callbacks capture fresh values?

## Workflow

1. Read target file (or detect from context)
2. Identify web3 patterns (hooks, transactions)
3. Check against rigor rules
4. Report violations with fixes

## Output Format

```
Rigor Check: src/components/StakePanel.tsx

✗ BigInt Safety (line 45)
  if (shares) → if (shares != null && shares > 0n)

✗ Data Source (line 62)
  Button state from indexed data
  → Use on-chain read for canWithdraw

✓ Receipt Guard (line 78)
  Hash comparison present

Summary: 2 violations, 1 pass
```

## Rules Loaded

- `.claude/rules/rigor/*.md`
