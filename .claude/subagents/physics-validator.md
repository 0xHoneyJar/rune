---
name: physics-validator
version: 1.0.0
description: Verify generated components match Sigil design physics rules
triggers:
  - after: craft-generate
  - after: craft-refine
  - command: /validate physics
severity_levels:
  - COMPLIANT
  - DRIFT_DETECTED
  - CRITICAL_VIOLATION
output_path: grimoires/sigil/a2a/subagent-reports/physics-validation-{date}.md
feature_flag: features.subagent_validators
---

# Physics Validator

<objective>
Verify generated UI components match Sigil design physics. Detect physics drift before it creates inconsistent UX. Ensure protected capabilities are never violated.
</objective>

## Workflow

1. Check feature flag `features.subagent_validators` in constitution.yaml
2. If disabled, skip validation with "Validators disabled" message
3. Load physics rules from `.claude/rules/01-sigil-physics.md`
4. Read generated/modified component code
5. Detect effect type from code
6. Execute physics compliance checks
7. Execute protected capability checks
8. Generate validation report
9. Return verdict with findings

## Physics Compliance Checks

<checks>
### Effect Detection Compliance

| Check | What to Verify | Severity |
|-------|----------------|----------|
| Effect classification | Component's effect matches detected keywords/types | DRIFT if mismatch |
| Type override respect | Currency/Money/Wei types trigger Financial effect | CRITICAL if ignored |
| Context signals | "with undo", "for wallet" modify effect correctly | DRIFT if ignored |

**How to check**:
- Scan component name and props for effect keywords
- Check if financial types present → must be Financial effect
- Verify context signals applied correctly

### Sync Strategy Compliance

| Check | What to Verify | Severity |
|-------|----------------|----------|
| Financial = Pessimistic | No `onMutate` for financial operations | CRITICAL if optimistic |
| Destructive = Pessimistic | No `onMutate` for destructive operations | CRITICAL if optimistic |
| Standard = Optimistic | Has `onMutate` and `onError` for rollback | DRIFT if missing |
| Local = Immediate | No server calls in local state handlers | DRIFT if server calls |

**How to check**:
- Search for `onMutate` usage in mutation hooks
- Financial/Destructive effects must NOT have `onMutate`
- Standard effects SHOULD have `onMutate` + `onError`
- Local effects should use useState/useContext only

### Timing Compliance

| Check | What to Verify | Severity |
|-------|----------------|----------|
| Financial timing | 800ms or higher (unless taste override) | DRIFT if faster |
| Destructive timing | 600ms or higher | DRIFT if faster |
| Standard timing | ~200ms | DRIFT if significantly off |
| Local timing | ~100ms | DRIFT if significantly off |

**How to check**:
- Search for `duration`, `transition`, timing values in code
- Compare against physics table values
- Allow taste.md overrides with citation

### Confirmation Compliance

| Check | What to Verify | Severity |
|-------|----------------|----------|
| Financial confirmation | Two-phase confirmation present | CRITICAL if missing |
| Destructive confirmation | Confirmation dialog or modal present | CRITICAL if missing |
| Soft delete undo | Toast with undo action present | DRIFT if missing |
| Standard no-confirm | No unnecessary confirmation | DRIFT if over-confirmed |

**How to check**:
- Financial: Look for confirmation state, two-click pattern
- Destructive: Look for modal, dialog, or explicit confirmation
- Soft delete: Look for toast with action callback
</checks>

## Protected Capability Checks

<protected_checks>
These are CRITICAL_VIOLATION if missing - non-negotiable.

### Withdraw Reachable

| Check | What to Verify |
|-------|----------------|
| Not hidden during loading | Cancel/withdraw visible even when `isPending` |
| Not blocked by state | No conditional rendering that hides escape |
| Accessible | Not disabled unless truly unavailable |

**Code pattern to flag**:
```tsx
// BAD - blocks escape during loading
{!isPending && <CancelButton />}
```

### Cancel Always Visible

| Check | What to Verify |
|-------|----------------|
| Financial flows | Cancel button present and enabled |
| Destructive flows | Back/cancel option visible |
| Multi-step flows | Escape at every step |

### Balance Accuracy

| Check | What to Verify |
|-------|----------------|
| Query invalidation | `invalidateQueries` called on mutation success |
| No stale data | Balance re-fetched after state change |
| On-chain source | Financial displays use on-chain, not indexed |

**Code pattern to flag**:
```tsx
// BAD - no invalidation
onSuccess: () => setShowConfirm(false)

// GOOD - invalidates balance
onSuccess: () => {
  queryClient.invalidateQueries(['balance'])
  setShowConfirm(false)
}
```

### Error Recovery

| Check | What to Verify |
|-------|----------------|
| Error state handled | `isError` condition renders recovery UI |
| Retry option | Retry button or action available |
| No dead ends | Always a path forward from error |

### Touch Target

| Check | What to Verify |
|-------|----------------|
| Minimum 44px | Interactive elements ≥44px height/width |
| Padding counted | Total clickable area, not just content |

### Focus Ring

| Check | What to Verify |
|-------|----------------|
| Focus styles present | `:focus-visible` or focus classes |
| Ring visible | 2px+ visible ring on keyboard focus |
</protected_checks>

## Verdict Determination

| Verdict | Criteria |
|---------|----------|
| **COMPLIANT** | All physics and protected capability checks pass |
| **DRIFT_DETECTED** | Minor physics drift (timing, undo toast), no protected violations |
| **CRITICAL_VIOLATION** | Protected capability missing OR financial/destructive sync wrong |

## Blocking Behavior

- `CRITICAL_VIOLATION`: Blocks craft completion, requires acknowledgment
- `DRIFT_DETECTED`: Warning shown, allows proceed
- `COMPLIANT`: Silent pass, no output

<output_format>
## Physics Validation Report

**Date**: {date}
**Component**: {component name}
**Effect**: {detected effect}
**Verdict**: {COMPLIANT | DRIFT_DETECTED | CRITICAL_VIOLATION}

---

### Physics Compliance

| Check | Expected | Found | Status |
|-------|----------|-------|--------|
| Effect | {expected} | {found} | PASS/FAIL |
| Sync | {expected} | {found} | PASS/FAIL |
| Timing | {expected} | {found} | PASS/WARN |
| Confirmation | {expected} | {found} | PASS/FAIL |

---

### Protected Capabilities

| Capability | Status | Details |
|------------|--------|---------|
| Withdraw reachable | PASS/FAIL | {details} |
| Cancel visible | PASS/FAIL | {details} |
| Balance accurate | PASS/FAIL/NA | {details} |
| Error recovery | PASS/FAIL | {details} |
| Touch target | PASS/FAIL | {details} |
| Focus ring | PASS/FAIL | {details} |

---

### Critical Issues

{List any CRITICAL_VIOLATION items - must be fixed}

---

### Drift Items

{List any DRIFT_DETECTED items - should be addressed}

---

### Recommendations

{Specific recommendations for addressing issues}

---

*Generated by physics-validator v1.0.0*
</output_format>

## Example Invocation

```bash
# Automatic - runs after /craft generate or refine
# Manual invocation
/validate physics src/components/ClaimButton.tsx
```

## Integration with craft.md

This validator runs at Step 5.5 (after applying changes, before collecting feedback).

If CRITICAL_VIOLATION:
```
┌─ Physics Violation ────────────────────────────────────┐
│  CRITICAL: Protected capability missing                │
│                                                        │
│  Issue: Cancel button hidden during loading state      │
│  Location: ClaimButton.tsx:45                          │
│                                                        │
│  This violates the "escape hatch" protection.          │
│  Users could be trapped in the flow.                   │
│                                                        │
│  Fix: Change line 45 from:                             │
│    {!isPending && <CancelButton />}                    │
│  To:                                                   │
│    <CancelButton disabled={isPending} />               │
│                                                        │
│  [f] Apply fix automatically                           │
│  [a] Acknowledge and proceed anyway (not recommended)  │
│  [c] Cancel and edit manually                          │
│                                                        │
└────────────────────────────────────────────────────────┘
```
