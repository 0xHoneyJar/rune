---
name: approve
description: Taste Owner sign-off on patterns
agent: approving-patterns
agent_path: .claude/skills/approving-patterns/SKILL.md
preflight:
  - sigil_setup_complete
---

# /approve

Taste Owner approval for visual patterns.

## Usage

```
/approve [pattern]         # Approve pattern
/approve --list            # List pending
/approve --history         # Show history
/approve --challenge [id]  # Challenge integrity change
/approve --unlock [id]     # Unlock for modification
```

## Taste Owner Authority

Taste Owners DICTATE:
- Colors, fonts, spacing
- Animation timing
- Border radius
- Shadows
- All visual decisions

Taste Owners do NOT control (requires poll):
- New features
- Feature removal
- Product direction

## Trust Score

Actions affect trust score:
- False integrity claim: -10
- Successful integrity: +1
- Approved pattern reverted: -5

## Challenge Period

Integrity changes auto-deploy but can be challenged within 24 hours.

If challenged as Content (not Integrity), change reverts immediately.

## Outputs

- `sigil-mark/governance/taste-owners.yaml`
- `sigil-mark/governance/approvals.yaml`
