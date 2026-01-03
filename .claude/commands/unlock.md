---
name: "unlock"
version: "0.3.0"
description: |
  Unlock a decision early, before its natural unlock date.
  Requires Taste Owner approval and documented reasoning.

command_type: "wizard"

arguments:
  - name: "decision_id"
    type: "string"
    required: true
    description: "The ID of the decision to unlock (e.g., DEC-2026-001)"

pre_flight:
  - check: "file_exists"
    path: ".sigil-setup-complete"
    error: "Sigil not set up. Run /setup first."

outputs: []

mode:
  default: "foreground"
  allow_background: false
---

# Unlock

## Purpose

Unlock a locked decision early, before its natural unlock date. This is an escape hatch for when:
- New information fundamentally changes the context
- The decision is causing clear harm
- External requirements mandate a change

## Invocation

```
/unlock DEC-2026-001
/unlock DEC-2026-002
```

## Prerequisites

- Sigil must be set up (`.sigil-setup-complete` exists)
- Decision must exist in `sigil-mark/consultation-chamber/decisions/`
- Decision must currently be locked

## Workflow

### Phase 1: Load Decision

Load the decision record from:
`sigil-mark/consultation-chamber/decisions/{decision_id}.yaml`

### Phase 2: Verify Lock Status

Check if decision is currently locked:
- If not locked: Inform user and exit
- If lock date has passed: Inform user the decision naturally unlocked
- If locked: Proceed to unlock flow

### Phase 3: Require Approval

Early unlock requires:
1. Taste Owner approval (who is approving)
2. Documented reason for early unlock

Valid reasons:
- New information fundamentally changes context
- Decision is causing clear harm
- External (regulatory, legal, partner) requirement

### Phase 4: Update Decision Record

Update the decision file with unlock information:
- Set `lock.locked: false`
- Set `lock.unlocked_early: true`
- Record unlocked_at timestamp
- Record who unlocked and why

### Phase 5: Confirm

Report success and next steps:
- Decision is now open for reconsideration
- Use `/consult` to start a new consultation on the topic

## Arguments

| Argument | Description | Required |
|----------|-------------|----------|
| `decision_id` | Decision ID to unlock (e.g., DEC-2026-001) | Yes |

## Outputs

Updates decision file in place.

## Examples

### Unlock a Decision

```
User: /unlock DEC-2026-001

Agent: Loading decision DEC-2026-001...

Decision: "Primary CTA Color"
Locked since: 2026-01-09
Unlock date: 2026-04-09 (73 days remaining)

Early unlock requires Taste Owner approval.

Who is approving this early unlock?
> Design Lead

Why is early unlock necessary?
[New information] [Causing harm] [External requirement] [Other]
```

### Decision Not Locked

```
User: /unlock DEC-2026-003

Agent: Decision DEC-2026-003 is not currently locked.
It can be modified freely through /consult.
```

### Decision Naturally Unlocked

```
User: /unlock DEC-2026-001

Agent: Decision DEC-2026-001 has naturally unlocked.
The unlock date (2026-04-09) has already passed.

You can reconsider this decision through: /consult "Primary CTA Color"
```

## Error Handling

| Error | Cause | Resolution |
|-------|-------|------------|
| "Sigil not set up" | Missing `.sigil-setup-complete` | Run `/setup` first |
| "Decision not found" | Invalid decision ID | Check decision ID |
| "Not locked" | Decision is already unlocked | No action needed |
| "Already expired" | Unlock date has passed | Use `/consult` normally |

## Philosophy

> "Locks protect against endless debates, not against genuine reconsideration."

Early unlock should be rare. If unlocking frequently:
- Lock durations may be set too long
- Decisions may be made without enough information
- Consider using Direction layer instead of Strategic

## See Also

- `/consult` - Start a consultation on a topic
- `/craft` - Get guidance (respects locked decisions)
