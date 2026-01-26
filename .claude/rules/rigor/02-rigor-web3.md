# Rigor: Web3 Patterns

Patterns that prevent $100k bugs. Non-negotiable for transaction flows.

## BigInt Safety

JavaScript BigInt has a critical footgun: `0n` is falsy.

```javascript
if (0n) console.log('true')   // Never prints!
if (0n == false) // true
```

### Safe Patterns

```tsx
// Check existence AND positive
if (amount != null && amount > 0n) { ... }

// Check existence only
if (amount !== undefined && amount !== null) { ... }

// With default (OK for display)
const shares = data ?? 0n
const canAct = (data ?? 0n) > 0n
```

### Anti-Pattern

```tsx
// BROKEN: 0n shares is valid but falsy
if (shares) { ... }
```

## Receipt Guard

Prevent re-execution when receipt updates trigger effects.

```tsx
function useReceiptGuard(receipt, onReceipt) {
  const lastHashRef = useRef<string>()

  useEffect(() => {
    if (!receipt) return
    if (receipt.transactionHash === lastHashRef.current) return
    lastHashRef.current = receipt.transactionHash
    onReceipt(receipt)
  }, [receipt, onReceipt])
}

// Usage
useReceiptGuard(txReceipt, (r) => handleSuccess(r))
```

### Anti-Pattern

```tsx
// BAD: No guard, may trigger multiple times
useEffect(() => {
  if (receipt) handleSuccess(receipt)
}, [receipt])
```

## Stale Closure Prevention

useEffect callbacks capture state at creation time.

### Anti-Pattern

```tsx
// BAD: currentAmount is stale
useEffect(() => {
  if (receipt) processReceipt(currentAmount)
}, [receipt])
```

### Safe Patterns

```tsx
// Option 1: Ref
const amountRef = useRef(currentAmount)
amountRef.current = currentAmount

useEffect(() => {
  if (receipt) processReceipt(amountRef.current)
}, [receipt])

// Option 2: Callback with deps
const handleReceipt = useCallback((r) => {
  processReceipt(currentAmount)  // Fresh here
}, [currentAmount])

useEffect(() => {
  if (receipt) handleReceipt(receipt)
}, [receipt, handleReceipt])
```

## Multi-Step Flows

For approve → execute patterns:

```tsx
type TxState = 'idle' | 'approve_pending' | 'approve_success' |
               'execute_pending' | 'success' | 'error'

const [txState, setTxState] = useState<TxState>('idle')
const [lastApproveHash, setLastApproveHash] = useState<string>()

// Guard approve receipt
useEffect(() => {
  if (!approveReceipt) return
  if (approveReceipt.transactionHash === lastApproveHash) return
  setLastApproveHash(approveReceipt.transactionHash)
  setTxState('approve_success')
}, [approveReceipt])

// Read amount on-chain at execution time (not from indexer)
const { data: currentBalance } = useReadContract({
  // ...
  query: { enabled: txState === 'approve_success' }
})
```

## Common Bugs by Symptom

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| Button never enables | BigInt falsy check | `!= null && > 0n` |
| Same tx triggers twice | Missing receipt guard | Add hash comparison |
| Wrong amount in tx | Using indexed data | On-chain read |
| Callback uses old data | Stale closure | Use ref or useCallback |

## Checklist

Before generating transaction flows:

- [ ] BigInt checks use `!= null && > 0n`
- [ ] Receipt processing has hash guard
- [ ] Transaction amounts from on-chain
- [ ] Stale closure risk addressed
- [ ] Multi-step flows have state machine
