---
name: reset-seed
version: "6.1.0"
description: Restore Virtual Sanctuary from seed template after eviction
agent: seeding-sanctuary
agent_path: .claude/skills/seeding-sanctuary/SKILL.md
preflight:
  - sigil_mark_exists
---

# /reset-seed

Restore virtual components from seed template after hard eviction.

## v6.1 Hard Eviction Context

In v6.1, when ANY real component is detected in the Sanctuary, ALL virtual
components are immediately evicted (hard delete). This prevents ghost components
from polluting the design context.

However, there are scenarios where you may want to restore virtual components:
- Deleted all real components and want seed guidance back
- Testing seed behavior
- Switching to a different seed taste

## Usage

```
/reset-seed                    # Restore current seed (if evicted)
/reset-seed linear             # Reset to Linear-like seed
/reset-seed vercel             # Reset to Vercel-like seed
/reset-seed stripe             # Reset to Stripe-like seed
/reset-seed blank              # Reset to blank seed
/reset-seed --status           # Check eviction status
/reset-seed --force            # Force reset even if real components exist
```

## Available Seeds

| Seed | Feel | Physics |
|------|------|---------|
| `linear` | Minimal, monochrome | snappy (150ms) |
| `vercel` | Bold, high-contrast | sharp (100ms) |
| `stripe` | Soft gradients | smooth (300ms) |
| `blank` | No preset | default |

## Workflow

### Check Status

```
/reset-seed --status

EVICTION STATUS
═══════════════════════════════════════════════════════════
Status: EVICTED
Evicted at: 2026-01-08T12:00:00Z
Original component count: 12
Reason: Real components detected in Sanctuary

Real components found:
- src/sanctuary/Button.tsx (@sigil-tier gold)
- src/sanctuary/Card.tsx (@sigil-tier silver)
```

### Reset After Cleanup

```
# After deleting real components
/reset-seed linear

SEED RESET
═══════════════════════════════════════════════════════════
Seed: linear
Virtual components restored: 12
Status: ACTIVE

Virtual Sanctuary ready for guidance.
```

### Force Reset (Dangerous)

```
/reset-seed --force linear

WARNING: Real components exist in Sanctuary.
Force resetting will not delete them, but virtual components
will be immediately re-evicted on next agent action.

Proceed? [y/N]
```

## Error Handling

| Error | Cause | Resolution |
|-------|-------|------------|
| "Not evicted" | Seed is active | No reset needed |
| "Real components exist" | Can't restore while real exist | Delete real components first |
| "Seed not found" | Invalid seed ID | Use linear/vercel/stripe/blank |
| "No seed configured" | Never selected a seed | Run /sigil-setup |

## Implementation

Uses functions from `sigil-mark/process/seed-manager.ts`:

```typescript
import {
  resetSeed,
  getEvictionStatus,
  isSanctuaryEmpty,
  loadSeedFromLibrary,
  SEED_OPTIONS,
} from 'sigil-mark/process/seed-manager';
```

## Eviction Lifecycle

```
Initial state (cold start):
  → No real components
  → Virtual components from seed ACTIVE

User creates first real component:
  → Real component detected
  → ALL virtual components EVICTED
  → Seed marked as evicted

User deletes all real components:
  → Sanctuary empty again
  → /reset-seed restores virtual components
  → Virtual components ACTIVE again
```

## Safety Checks

1. **Pre-reset validation**: Confirms Sanctuary is empty
2. **Seed library verification**: Confirms seed template exists
3. **Eviction status check**: Warns if not evicted
4. **Force flag required**: For reset with real components

## Outputs

| Path | Description |
|------|-------------|
| `.sigil/seed.yaml` | Updated with restored virtual components |

## Next Step

After `/reset-seed`:
- Virtual components available for `/craft` queries
- First real component will trigger re-eviction
- Use `/garden` to see virtual component coverage
