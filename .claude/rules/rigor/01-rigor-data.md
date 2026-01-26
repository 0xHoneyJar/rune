# Rigor: Data Sources

Data sources should be intentional, not fallback chains.

## The Decision Table

| Use Case | Source | Why |
|----------|--------|-----|
| Display (read-only) | Indexed | Faster UX, acceptable staleness |
| Transaction amounts | On-chain | Must be accurate for tx |
| Button enabled state | On-chain | Prevents failed tx |
| Historical queries | Indexed | Optimized for aggregation |
| Balance display | On-chain | Users verify before tx |

**Default:** When in doubt, use on-chain. Indexed is optimization, not truth.

## Anti-Patterns

### Fallback Chains

```tsx
// BAD: Hides which source is used
vaultShares={envio ?? onChain ?? 0n}

// GOOD: Explicit per use case
const displayShares = envioData?.vaultShares ?? '—'  // Display: indexed OK
const txShares = useReadContract({...})              // Transaction: on-chain
const canWithdraw = (txShares.data ?? 0n) > 0n      // Button: on-chain
```

### Stale Button State

```tsx
// BAD: Button enabled from indexed data (could be stale)
<button disabled={!envioData?.hasBalance}>Withdraw</button>

// GOOD: Button enabled from on-chain
const { data: balance } = useReadContract({...})
<button disabled={!balance || balance === 0n}>Withdraw</button>
```

## Explicit Data Sources

```tsx
// Display: Indexed OK (acceptable staleness)
const { data: displayData } = useEnvioQuery(...)

// Transaction: On-chain required (must be accurate)
const { data: txData } = useReadContract({
  address: VAULT,
  abi: vaultAbi,
  functionName: 'balanceOf',
  args: [userAddress]
})

// Button state: On-chain required (prevent failed tx)
const canAct = (txData ?? 0n) > 0n
```

## Simplest Fix

When debugging data issues, use on-chain for everything:

```tsx
const { data } = useReadContract({
  address: VAULT,
  abi: vaultAbi,
  functionName: 'balanceOf',
  args: [userAddress],
  query: { refetchInterval: 5000 }  // Poll every 5s
})

// Use for display, tx, AND button state
const shares = data ?? 0n
const canAct = shares > 0n
```

Indexed is an optimization. Don't optimize until basic flow works.

## Checklist

Before generating web3 components:

- [ ] Transaction amounts from on-chain, not indexer
- [ ] Button states use on-chain data
- [ ] Data source is explicit, not hidden behind `??` chains
