---
name: validate
version: "2.0.0"
description: Check v2.0 Layout, Lens, and time authority compliance
agent: null
preflight:
  - sigil_mark_exists
context_injection: true
---

# /validate

Check v2.0 compliance across the codebase. Reports Layout usage, Lens enforcement, and time authority patterns.

## Usage

```
/validate               # Validate all components
/validate [path]        # Validate specific file/directory
/validate --summary     # Show summary only
/validate --report      # Generate detailed report
```

## What Gets Checked

### 1. Layout Usage (Required for UI Actions)

Components with critical actions should use appropriate Layouts:

**Passes:**
```tsx
import { CriticalZone, useLens } from 'sigil-mark';

<CriticalZone financial>
  <Lens.CriticalButton state={payment.state} />
</CriticalZone>
```

**Fails:**
```tsx
<button onClick={() => api.pay(amount)}>Pay</button>
```

### 2. Lens Enforcement (CriticalZone)

`CriticalZone` with `financial={true}` must use Lens components:

**Passes:**
```tsx
<CriticalZone financial>
  <Lens.CriticalButton state={action.state} />
</CriticalZone>
```

**Fails:**
```tsx
<CriticalZone financial>
  <button>Pay</button>  {/* Raw button in financial zone */}
</CriticalZone>
```

### 3. Time Authority (useCriticalAction)

Critical actions should use appropriate time authority:

**Passes:**
```tsx
useCriticalAction({
  mutation: () => api.pay(amount),
  timeAuthority: 'server-tick',  // Financial = server-tick
});
```

**Fails:**
```tsx
useCriticalAction({
  mutation: () => api.pay(amount),
  timeAuthority: 'optimistic',  // Wrong for payments
});
```

### 4. Deprecated Patterns (v1.2.5)

Warns on deprecated v1.2.5 patterns:

- `SigilZone` → Use `CriticalZone`, `MachineryLayout`, or `GlassLayout`
- `useServerTick` → Use `useCriticalAction({ timeAuthority: 'server-tick' })`
- `useSigilPhysics` → Use `useLens()`
- `@sigil/recipes/*` imports → Use Lens components

## Output Format

```
/validate

VALIDATING CODEBASE...

Layout Coverage: 92% (23/25 action components)

PASSING (23):
  ✓ src/checkout/PaymentForm.tsx (CriticalZone + StrictLens)
  ✓ src/checkout/ConfirmDialog.tsx (CriticalZone + StrictLens)
  ✓ src/admin/UserList.tsx (MachineryLayout + DefaultLens)
  ✓ src/marketing/ProductCard.tsx (GlassLayout + DefaultLens)
  ...

VIOLATIONS (2):
  ✗ src/features/QuickBuy.tsx
    Line 23: Raw button in CriticalZone
    Fix: Use Lens.CriticalButton instead of <button>

  ✗ src/features/DeleteAccount.tsx
    Line 45: optimistic time authority for destructive action
    Fix: Use timeAuthority: 'server-tick'

DEPRECATED (3):
  ⚠ src/legacy/OldCheckout.tsx
    Line 12: SigilZone (deprecated)
    Migration: Use CriticalZone instead

  ⚠ src/legacy/AdminPanel.tsx
    Line 8: useServerTick (deprecated)
    Migration: Use useCriticalAction({ timeAuthority: 'server-tick' })

SUMMARY:
  Passing: 23
  Violations: 2
  Deprecated: 3
  Coverage: 92%

NEXT STEPS:
  - Fix violations: Replace raw buttons with Lens components
  - Migrate deprecated: See sigil-mark/MIGRATION.md
```

## Violation Types

| Type | Level | Resolution |
|------|-------|------------|
| Raw button in Layout | BLOCK | Use Lens component |
| Wrong time authority | BLOCK | Match to action type |
| Missing Layout | WARN | Wrap in appropriate Layout |
| Deprecated pattern | WARN | Migrate to v2.0 |

## Report Output

With `--report`, writes to `sigil-mark/reports/validate-{date}.md`:

```markdown
# Validation Report

**Date:** 2026-01-06
**Coverage:** 92%

## Files by Layout

### CriticalZone
| File | Lens | Time Authority | Status |
|------|------|----------------|--------|
| PaymentForm.tsx | StrictLens | server-tick | PASS |
| ... |

### MachineryLayout
| File | Lens | Status |
|------|------|--------|
| UserList.tsx | DefaultLens | PASS |
| ... |

### GlassLayout
| File | Lens | Status |
|------|------|--------|
| ProductCard.tsx | DefaultLens | PASS |
| ... |

## Violations

[Detailed list with line numbers and fixes]

## Deprecated Patterns

[List with migration paths]
```

## Error Handling

| Error | Resolution |
|-------|------------|
| No components found | Check component paths |
| sigil-mark not found | Run /setup first |
| Missing imports | Add sigil-mark imports |

## Next Steps

After validate:
- Fix violations with `/craft`
- Migrate deprecated patterns (see MIGRATION.md)
- Check `/garden` for health report
