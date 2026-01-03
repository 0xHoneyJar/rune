# Sigil 0.2 → 0.3 Migration Guide

This guide covers migrating from Sigil 0.2 (zone-based design context) to Sigil 0.3 (Constitutional Design Framework).

## Overview

Sigil 0.3 introduces the four-pillar architecture:

| Pillar | Purpose | 0.2 Equivalent |
|--------|---------|----------------|
| **Soul Binder** | Immutable values + Canon of Flaws | Moodboard (partial) |
| **Lens Array** | User persona validation | Zones (partial) |
| **Consultation Chamber** | Decision authority layers | New |
| **Proving Grounds** | Feature validation at scale | New |

## Prerequisites

- Backup your existing `sigil-mark/` directory
- Have access to your 0.2 `.sigilrc.yaml` and `sigil-mark/` state

## Migration Steps

### Step 1: Backup 0.2 State

```bash
# Create backup
cp -r sigil-mark sigil-mark-0.2-backup
cp .sigilrc.yaml .sigilrc-0.2-backup.yaml
```

### Step 2: Run 0.3 Setup

```
/setup
```

This creates the 0.3 directory structure without overwriting existing files:

```
sigil-mark/
├── soul-binder/           [NEW]
│   ├── immutable-values.yaml
│   ├── canon-of-flaws.yaml
│   └── visual-soul.yaml
├── lens-array/            [NEW]
│   └── lenses.yaml
├── consultation-chamber/  [NEW]
│   ├── config.yaml
│   └── decisions/
├── proving-grounds/       [NEW]
│   ├── config.yaml
│   └── active/
├── canon/                 [NEW]
│   └── graduated/
├── audit/                 [NEW]
│   └── overrides.yaml
├── moodboard.md          [PRESERVED]
├── rules.md              [PRESERVED]
└── inventory.md          [PRESERVED]
```

### Step 3: Run /envision Interview

```
/envision
```

The interview captures:

1. **Immutable Values** → `soul-binder/immutable-values.yaml`
   - Migrate key feelings from moodboard.md
   - Define enforcement levels (block/warn/suggest)

2. **User Lenses** → `lens-array/lenses.yaml`
   - Map 0.2 zones to user personas
   - Define constraints per lens

### Step 4: Map Zones to Lenses

0.2 zones become 0.3 lenses with persona context:

| 0.2 Zone | 0.3 Lens | Priority | Constraints |
|----------|----------|----------|-------------|
| `critical` | `power_user` | 1 (truth test) | Accessibility, performance |
| `marketing` | `new_visitor` | 3 | Visual appeal |
| `admin` | `admin_user` | 2 | Efficiency, density |

Example mapping in `.sigilrc.yaml`:

```yaml
# 0.2 (zones)
zones:
  critical:
    paths: ["src/features/checkout/**"]
    motion: "deliberate"

# 0.3 (lenses)
# Move to sigil-mark/lens-array/lenses.yaml
```

### Step 5: Configure Strictness

0.3 has progressive strictness levels:

| Level | Behavior |
|-------|----------|
| `discovery` | All suggestions, no blocks (default) |
| `guiding` | Warnings on violations |
| `enforcing` | Blocks on protected flaws/values |
| `strict` | Blocks on all violations |

Start with `discovery` and increase as needed:

```yaml
# .sigilrc.yaml
version: "0.3"
strictness: "discovery"
```

### Step 6: Migrate Rejections to Canon of Flaws

0.2 rejections become 0.3 protected behaviors:

```yaml
# 0.2 (.sigilrc.yaml)
rejections:
  - pattern: "Spinner"
    reason: "Creates anxiety in critical zones"

# 0.3 (sigil-mark/soul-binder/canon-of-flaws.yaml)
# Run: /canonize "spinner-free loading"
```

### Step 7: Define Taste Owners

New in 0.3 — define who owns design decisions:

```yaml
# .sigilrc.yaml
taste_owners:
  design:
    name: "Design Lead"
    placeholder: "@design-lead"
    scope:
      - "sigil-mark/**"
      - "src/components/**"
```

### Step 8: Configure Domains (Optional)

If using Proving Grounds, specify your domains:

```yaml
# .sigilrc.yaml
domains:
  - "defi"      # DeFi-specific monitors
  - "creative"  # Creative-specific monitors
```

## What Changes

### Commands

| 0.2 Command | 0.3 Command | Notes |
|-------------|-------------|-------|
| `/setup` | `/setup` | Creates 0.3 structure |
| `/envision` | `/envision` | Extended for values + lenses |
| `/codify` | `/codify` | Same (design rules) |
| `/craft` | `/craft` | Now respects flaws + lenses |
| — | `/canonize` | NEW: Protect emergent behaviors |
| — | `/consult` | NEW: Decision authority |
| — | `/prove` | NEW: Feature proving |
| — | `/graduate` | NEW: Feature graduation |

### Behavior Changes

1. **Craft now blocks** in enforcing/strict modes when:
   - Touching protected flaws
   - Violating immutable values
   - Modifying locked decisions

2. **Override logging** — All human overrides are logged to `sigil-mark/audit/overrides.yaml`

3. **Lens validation** — Most constrained lens is the truth test

## Rollback

If you need to rollback to 0.2:

```bash
# Restore 0.2 state
rm -rf sigil-mark
mv sigil-mark-0.2-backup sigil-mark
mv .sigilrc-0.2-backup.yaml .sigilrc.yaml

# Remove 0.3 markers
rm .sigil-setup-complete
rm .sigil-version.json
```

## Troubleshooting

### "Setup already complete"

Setup is idempotent. To refresh:
1. Delete `.sigil-setup-complete`
2. Run `/setup` again

### "Craft is blocking my changes"

Check strictness level:
```bash
.claude/scripts/get-strictness.sh
```

Lower to `discovery` or `guiding` if needed.

### "Lens validation failing"

The most constrained lens (lowest priority number) is the truth test. If an asset fails in that lens, it fails overall.

Review lens priorities:
```bash
cat sigil-mark/lens-array/lenses.yaml
```

## Support

For issues or questions:
- Open an issue on GitHub
- Reference the migration guide section

## Version History

| Version | Date | Notes |
|---------|------|-------|
| 0.3.0 | 2026-01-02 | Constitutional Design Framework |
| 0.2.0 | Previous | Zone-based design context |
