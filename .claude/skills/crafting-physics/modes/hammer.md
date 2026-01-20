# Hammer Mode

Autonomous execution mode for multi-file craft operations. Use when applying physics across multiple components or when systematic changes are needed.

## When to Activate

- User says "hammer mode" or "autonomous"
- Multiple components need physics alignment
- Systematic refactoring of physics values
- Polish operations across many files

## Behavior

```
┌─ HAMMER MODE ──────────────────────────────────────────┐
│  Autonomous multi-file craft operation                 │
│                                                        │
│  Scope: {files in scope}                               │
│  Operation: {what will be applied}                     │
│  Safety: Validators enabled, can rollback              │
│                                                        │
│  [y] Begin autonomous operation                        │
│  [n] Cancel and craft individually                     │
│                                                        │
└────────────────────────────────────────────────────────┘
```

## Execution Pattern

1. **Scope Definition**: Identify all files to modify
2. **Physics Analysis**: Detect effect for each component
3. **Batch Preview**: Show consolidated analysis
4. **User Confirmation**: Single confirmation for all changes
5. **Batch Apply**: Apply changes sequentially
6. **Validation Gate**: Run validators after batch
7. **Rollback Ready**: Track changes for potential rollback

## Safety Constraints

- Maximum 10 files per hammer operation
- Validators always run (cannot skip)
- CRITICAL_VIOLATION stops entire batch
- Git status check before starting
- Auto-commit checkpoint before changes

## Progress Display

```
Hammer Progress: [████████░░] 8/10 files
  ✓ ClaimButton.tsx - Financial physics applied
  ✓ WithdrawButton.tsx - Financial physics applied
  ✓ LikeButton.tsx - Standard physics applied
  → StakeButton.tsx - Processing...
  ○ TransferButton.tsx - Pending
  ○ SwapButton.tsx - Pending
```

## Rollback Protocol

If validation fails mid-batch:
```
┌─ Hammer Rollback ──────────────────────────────────────┐
│  Validation failed at file 6/10                        │
│                                                        │
│  5 files successfully modified                         │
│  1 file failed validation                              │
│  4 files not yet processed                             │
│                                                        │
│  [r] Rollback all 5 successful changes                 │
│  [k] Keep successful, skip failed                      │
│  [f] Fix failed, continue remaining                    │
│                                                        │
└────────────────────────────────────────────────────────┘
```

## Token Budget

Estimated: ~1,200 tokens when loaded
