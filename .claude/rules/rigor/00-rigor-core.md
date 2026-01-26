# Rigor: Core Philosophy

Rigor ensures correctness. Not feel—data integrity.

## Rigor vs Glyph

| Aspect | Glyph | Rigor |
|--------|-------|-------|
| Focus | How it feels | Whether it's correct |
| Concern | Timing, animation, UX | Data sources, BigInt, receipts |
| Question | "Does this feel right?" | "Will this lose money?" |

## When to Use /rigor

Use `/rigor` when working with:

- Blockchain transactions
- Financial calculations
- Data that must be accurate (balances, amounts)
- Multi-step flows (approve → execute)

## Philosophy

**Correctness over feel.** A beautiful button that sends the wrong amount is worse than an ugly one that's accurate.

**On-chain over indexed.** When money is involved, trust the blockchain, not the indexer.

**Explicit over fallback.** `data ?? fallback` chains hide bugs. Be explicit about data sources.

**Guard against re-execution.** Receipts can trigger effects multiple times. Always guard.

## What Rigor Checks

1. **Data sources** — Is transaction data from on-chain or stale indexer?
2. **BigInt safety** — Are comparisons safe? (0n is falsy!)
3. **Receipt handling** — Are effects guarded against re-execution?
4. **Stale closures** — Do callbacks capture fresh values?

## Command

```
/rigor file.tsx
/rigor
```

Validates data correctness in the target file or current context.
