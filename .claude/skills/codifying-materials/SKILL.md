# Sigil Agent: Codifying Materials

> "You are a Material Smith. You define the physics of how things feel."

## Role

**Material Smith** — Defines physics primitives, materials, and sync strategies. Locks the kernel when complete.

## Commands

```
/codify
/codify --lock        # Lock kernel (irreversible without hard fork)
/material register    # Register custom material
/material list        # List available materials
```

## Outputs

| Path | Description |
|------|-------------|
| `sigil-mark/kernel/physics.yaml` | Physics primitives (lockable) |
| `sigil-mark/kernel/sync.yaml` | Sync strategies (lockable) |
| `sigil-mark/kernel/fidelity-ceiling.yaml` | Gold Standard constraints (lockable) |
| `sigil-mark/soul/materials.yaml` | Material compositions |

## Prerequisites

- Run `/envision` first (need essence.yaml)

## Workflow

### Phase 1: Load Essence

Read `sigil-mark/soul/essence.yaml` to understand:
- Soul statement
- Invariants
- Feel descriptors
- Reference products

### Phase 2: Configure Kernel Defaults

Review and optionally customize kernel files:

**physics.yaml** — Usually unchanged. Physics are physics.

**sync.yaml** — May need customization:
```
"Which data paths in your product are SACRED (server-authoritative)?"

Examples:
- player.balance
- player.inventory
- trade.*
- transaction.*

"These will use server_tick sync (never optimistic)"
```

**fidelity-ceiling.yaml** — Customize based on essence:
```
"Looking at your reference products, what's the fidelity ceiling?"

For OSRS-inspired products:
- Enable retro_mode
- Set low poly/texture limits

For Linear-inspired products:
- Strict animation limits
- No decorative elements

For Airbnb-inspired products:
- Allow longer animations
- Allow gradients
```

### Phase 3: Select Default Material

Based on essence, recommend default material:

```
Based on your soul statement and references:

IF essence mentions "fast", "instant", "keyboard" → machinery
IF essence mentions "trust", "weight", "deliberate" → clay
IF essence mentions "light", "floating", "modern" → glass

Recommended default material: [recommendation]

Do you want to use this? Or should we customize?
```

### Phase 4: Configure Zone-Material Mapping

Review `sigil-mark/soul/zones.yaml` and set material per zone:

```
Let's map materials to zones:

CRITICAL (checkout, trade, claim):
  Recommended: clay (trust requires weight)
  Material: [confirm or override]

TRANSACTIONAL (admin, settings, dashboard):
  Recommended: machinery (speed over emotion)
  Material: [confirm or override]

EXPLORATORY (browse, search, discover):
  Recommended: glass (lightness encourages exploration)
  Material: [confirm or override]

MARKETING (landing, home):
  Recommended: clay (emotion converts)
  Material: [confirm or override]
```

### Phase 5: Define Sync Mappings

Map data paths to sync strategies:

```
Based on your product, let's map sync strategies:

Which data involves MONEY or ASSETS?
→ These get server_tick (NEVER optimistic)

Which data is COLLABORATIVE (multiple editors)?
→ These get crdt

Which data is PREFERENCE/SETTINGS?
→ These get lww (local-first)

Current mappings:
[show detected mappings]

Add or modify?
```

### Phase 6: Custom Material (Optional)

If user needs custom material:

```
/material register

Name: [material-name]
Extends (optional): [base-material]

Primitives:
  Light: refract | diffuse | flat | reflect
  Weight: weightless | light | heavy | none
  Motion: instant | linear | ease | spring | step
  Feedback: [highlight, lift, depress, glow, ripple, pulse]

Config overrides:
  [key]: [value]

Forbidden patterns:
  - [pattern]
```

### Phase 7: Lock Kernel

```
⚠️  KERNEL LOCK

Locking the kernel makes physics IMMUTABLE.
After lock, changes require a HARD FORK.

This locks:
- physics.yaml (light, weight, motion, feedback, surface)
- sync.yaml (crdt, lww, server_tick, local_only)
- fidelity-ceiling.yaml (gold standard constraints)

Only lock if you're confident in your physics.

Type 'LOCK KERNEL' to confirm, or 'skip' to leave unlocked.
```

## Lock Mechanism Implementation

When user confirms lock with `/codify --lock`:

1. **Validate kernel files exist:**
   ```bash
   ls sigil-mark/kernel/{physics,sync,fidelity-ceiling}.yaml
   ```

2. **Update each kernel file with lock metadata:**
   ```yaml
   # At top of each kernel file
   locked: true
   locked_at: "2026-01-03T12:00:00Z"  # ISO timestamp
   locked_by: "username"
   ```

3. **Update .sigil-version.json:**
   ```json
   {
     "sigil_version": "11.0.0",
     "kernel_locked": true,
     "kernel_locked_at": "2026-01-03T12:00:00Z",
     "kernel_locked_by": "username"
   }
   ```

4. **Enforcement:** Before any kernel modification, check:
   ```typescript
   function validateKernelIntegrity(filePath: string): void {
     if (filePath.includes('sigil-mark/kernel/')) {
       const content = readYamlSync(filePath);
       if (content.locked) {
         throw new Error(
           `Kernel file ${filePath} is locked and cannot be modified. ` +
           `Locked at ${content.locked_at} by ${content.locked_by}.`
         );
       }
     }
   }
   ```

## Lock Verification

To check lock status:
```bash
# Quick check
grep "locked:" sigil-mark/kernel/*.yaml

# Full status
cat .sigil-version.json | jq '.kernel_locked'
```

## Unlocking (Hard Fork)

The kernel can ONLY be unlocked through:
1. Manual removal of `locked: true` from all 3 kernel files
2. Updating `.sigil-version.json` to reflect unlock
3. Git commit with message containing "HARD FORK: Kernel Unlock"
4. Review by Taste Owner

This is intentionally difficult to prevent accidental unlocks.

## Material Registration API

```yaml
# Custom material definition
name: "paper"
extends: "clay"  # Inherit from base

overrides:
  weight: "light"
  feedback: ["fold", "crinkle"]

config:
  texture: "paper-grain.svg"
  fold_angle: 5

forbidden:
  - "3D transforms"
  - "Glass effects"
```

Validation rules:
1. All primitives must exist in kernel/physics.yaml
2. If `extends`, base must exist
3. `forbidden` patterns are additive to base

## Success Criteria

- [ ] essence.yaml exists (from /envision)
- [ ] sync.yaml has explicit mappings for all Sacred data
- [ ] fidelity-ceiling.yaml matches product era/feel
- [ ] zones.yaml has material assigned to each zone
- [ ] materials.yaml has default material set
- [ ] Custom materials (if any) validate against kernel
- [ ] If --lock used, all kernel files show locked: true

## Error Handling

| Situation | Response |
|-----------|----------|
| No essence.yaml | Prompt to run /envision first |
| Unknown primitive | List valid primitives from kernel |
| Circular material extends | Reject, explain issue |
| Invalid sync mapping | Show valid strategies |
| Attempt to modify locked kernel | Reject with lock details |

## Next Step

After `/codify`: Run `/zone` to configure design zones.
