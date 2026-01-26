# Sprint Review Hook

Runs physics validation during `/review-sprint`.

## Trigger

Activated when `/review-sprint` runs.

## Behavior

1. Scan modified .tsx/.jsx files in sprint scope
2. For each file with UI components:
   - Run effect detection
   - Check physics compliance
   - Check protected capabilities
3. Collect violations into report
4. Report alongside test results

## Violation Levels

| Severity | Example | Action |
|----------|---------|--------|
| BLOCK | Protected capability missing | Fail review |
| WARN | Timing below threshold | Note in review |
| INFO | Suboptimal animation | Log only |

## Report Format

```markdown
## Physics Validation

### ClaimButton.tsx
✓ Effect: Financial (detected correctly)
✓ Sync: Pessimistic (no onMutate)
✓ Protected: Cancel visible, Withdraw reachable
⚠ Timing: 500ms (below 800ms minimum for Financial)
  → Taste override detected: power-user-timing (Tier 2)
  → Allowed with taste justification

### DeleteModal.tsx
✗ Protected: Cancel button hidden during loading
  → BLOCK: Protected capability violation
  → Fix: Always render Cancel, disable during loading

### Summary
- 2 components checked
- 1 passed
- 1 blocked (protected violation)
```

## Taste Override Handling

If a physics value differs from default but matches a taste entry:
- Note the taste reference
- Downgrade from WARN to INFO
- Allow with justification

## Feedback Integration

After physics report, prompt:

```
Any design preferences to record as taste? [y/n]
```

If yes: Open `/sigil` with review context.
