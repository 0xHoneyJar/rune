# Implementation Hook

Suggests Glyph invocation for UI tasks during `/implement`.

## Trigger

Activated when `/implement` works on a task that:
- Has "UI", "component", "button", "modal", "form" in title/description
- References a .tsx or .jsx file
- Contains physics requirements in acceptance criteria

## Behavior

1. Detect UI task from keywords
2. Prompt user:
   ```
   This appears to be a UI component task.
   Generate with /glyph? [y/n]

   Physics Requirements (from sprint):
   - Effect: Financial
   - Sync: Pessimistic
   - Timing: 800ms
   ```
3. If yes: Invoke `/glyph` with task description
4. Taste from `grimoires/rune/taste.md` auto-applied
5. Log decision to NOTES.md Design Physics section

## NOTES.md Update

After generation, append to Design Physics section:

```markdown
### Physics Decisions
| Date | Component | Effect | Timing | Taste Override | Rationale |
|------|-----------|--------|--------|----------------|-----------|
| 2026-01-25 | ClaimButton | Financial | 500ms | power-user-timing | Sprint-1 |
```

## Skip Conditions

Don't prompt if:
- Task is explicitly non-UI (e.g., "API endpoint", "database migration")
- User has disabled Rune hooks in config
- /glyph was already invoked this task
