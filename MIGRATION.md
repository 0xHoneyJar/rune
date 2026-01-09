# Migration Guide: v5.0 → v6.0

This guide covers migrating from Sigil v5.0 "The Lucid Flow" to v6.0 "Native Muse".

## Quick Migration

```bash
# Preview changes
./scripts/migrate-v6.sh --dry-run

# Apply migration
./scripts/migrate-v6.sh
```

## What's New in v6.0

### The Three Laws

v6.0 introduces three guiding principles:

1. **Code is Precedent** — Patterns that survive become canonical
2. **Survival is the Vote** — Usage frequency determines status
3. **Never Interrupt Flow** — No blocking, no dialogs, observe silently

### Key Changes

| Aspect | v5.0 | v6.0 |
|--------|------|------|
| Discovery | JIT grep (200ms) | Workshop index (5ms) |
| Approval | Governance dialogs | Survival observation |
| Cold start | Empty room | Virtual Sanctuary seeds |
| Novelty | Constitutional blocking | Physics-only validation |
| Skills | 6 skills | 11 skills + hooks |

---

## Migration Steps

### Step 1: Create .sigil Directory

v6.0 introduces a new `.sigil/` directory for runtime state:

```bash
mkdir -p .sigil/craft-log
mkdir -p .sigil/eras
```

### Step 2: Build Workshop Index

The workshop index replaces JIT grep:

```bash
# The migration script handles this automatically
# Manual: run the workshop builder
npx ts-node sigil-mark/process/workshop-builder.ts
```

Creates `.sigil/workshop.json` with:
- Package hash for staleness detection
- Imports hash for dependency tracking
- Materials (framework packages)
- Components (Sanctuary inventory)
- Physics definitions
- Zone mappings

### Step 3: Initialize Survival Tracking

Pattern tracking replaces governance dialogs:

```bash
# Creates .sigil/survival.json
```

Initial structure:
```json
{
  "era": "v1",
  "era_started": "2026-01-08",
  "last_scan": null,
  "patterns": {}
}
```

Patterns are populated automatically via PostToolUse hooks.

### Step 4: Update .sigilrc.yaml (Optional)

Add physics definitions if not present:

```yaml
# .sigilrc.yaml
version: "6.0"

zones:
  critical:
    paths: ["src/features/claim/**"]
    physics: deliberate  # NEW: explicit physics

physics:  # NEW section
  deliberate:
    timing: 800
    easing: "ease-out"
  snappy:
    timing: 150
    easing: "ease-out"
  warm:
    timing: 300
    easing: "ease-in-out"
```

### Step 5: Update Version Files

```bash
# VERSION file
echo "6.0.0" > VERSION

# .sigil-version.json
cat > .sigil-version.json << 'EOF'
{
  "version": "6.0.0",
  "codename": "Native Muse",
  "migrated_from": "5.0.0",
  "migration_date": "2026-01-08"
}
EOF
```

---

## What's Kept from v5.0

These components remain unchanged:

### Kernel Files

```
sigil-mark/kernel/
├── constitution.yaml    # Type → physics binding
├── fidelity.yaml        # Visual ceilings
├── vocabulary.yaml      # Term mapping
└── workflow.yaml        # Team rules
```

### Runtime Components

- SigilProvider
- useSigilMutation hook
- Zone layouts (CriticalZone, GlassLayout, MachineryLayout)

### Governance Structure

```
sigil-mark/governance/
├── justifications.log   # Bypass audit trail
└── amendments/          # Amendment proposals
```

---

## What's Added in v6.0

### .sigil Directory

New runtime state directory:

```
.sigil/
├── workshop.json       # Pre-computed index
├── survival.json       # Pattern tracking
├── seed.yaml           # Virtual Sanctuary (cold starts)
├── workshop.lock       # Rebuild locking
├── craft-log/          # Session logs
│   └── {date}-{component}.md
└── eras/               # Archived eras
    └── {era-name}.json
```

### New Skills

| Skill | Purpose |
|-------|---------|
| graphing-imports | Dependency scanning |
| querying-workshop | Fast index queries |
| validating-physics | PreToolUse physics check |
| seeding-sanctuary | Virtual taste for cold starts |
| inspiring-ephemerally | Ephemeral external reference |
| forging-patterns | Precedent-breaking mode |
| managing-eras | Era transitions |
| observing-survival | PostToolUse pattern tracking |
| chronicling-rationale | Stop hook craft logs |
| auditing-cohesion | Visual consistency checks |

### New Commands

| Command | Purpose |
|---------|---------|
| `/forge` | Precedent-breaking exploration |
| `/inspire` | Ephemeral external reference |
| `/sanctify` | Promote ephemeral pattern |
| `/new-era` | Design direction shift |
| `/audit` | Visual cohesion check |

### Process Modules

```
sigil-mark/process/
├── workshop-builder.ts      # Build workshop index
├── workshop-query.ts        # Query workshop
├── startup-sentinel.ts      # Freshness check
├── discovery-scanner.ts     # Ripgrep discovery
├── physics-validator.ts     # Physics validation
├── seed-manager.ts          # Virtual Sanctuary
├── ephemeral-context.ts     # Context forking
├── forge-mode.ts            # Forge behavior
├── era-manager.ts           # Era transitions
├── survival-observer.ts     # Pattern tracking
├── chronicling-rationale.ts # Craft logs
├── auditing-cohesion.ts     # Visual auditing
└── agent-orchestration.ts   # 7-phase flow
```

---

## What's Removed from v5.0

### Governance Dialogs

v5.0's approval workflow is removed:

```tsx
// v5.0 - NO LONGER NEEDED
handlePatternApproval({
  pattern: "animation:spring",
  decision: "approve"
});

// v6.0 - Automatic via survival
// Patterns are observed silently
// Status promoted by usage count
```

### JIT Grep as Primary

v5.0's JIT grep is now fallback only:

```tsx
// v5.0 - Primary method
await scanSanctuary(); // 200ms

// v6.0 - Fallback only
const result = queryWorkshop("Button"); // 5ms
if (!result) {
  // Fallback to ripgrep
  await scanSanctuary();
}
```

---

## Breaking Changes

### 1. Governance Functions Deprecated

```tsx
// v5.0
import { handleBypass, handleAmend } from 'sigil-mark/process';

// v6.0 - These still exist but are rarely used
// Survival observation handles most pattern decisions
```

### 2. Workshop Required

The workshop must be built before /craft:

```bash
# v5.0 - No setup needed
/craft "button"

# v6.0 - Workshop built automatically on first run
# Startup sentinel checks freshness
```

### 3. New Directory Structure

```
# v5.0
sigil-mark/
└── (everything here)

# v6.0
.sigil/           # NEW - Runtime state
sigil-mark/       # Still here - Components and process
```

---

## Rollback Instructions

If you need to rollback to v5.0:

```bash
# Remove v6.0 runtime state
rm -rf .sigil/

# Restore version
echo "5.0.0" > VERSION

# Update .sigil-version.json
cat > .sigil-version.json << 'EOF'
{
  "version": "5.0.0",
  "codename": "The Lucid Flow"
}
EOF
```

---

## Verification

After migration, verify:

```bash
# 1. Workshop exists
ls -la .sigil/workshop.json

# 2. Survival tracking initialized
ls -la .sigil/survival.json

# 3. Version updated
cat VERSION
# Should show: 6.0.0

# 4. Run a test /craft
claude
/craft "test button"
# Should complete in <2s

# 5. Check craft log created
ls -la .sigil/craft-log/
```

---

## Troubleshooting

### Workshop Not Building

```bash
# Check for package.json
ls package.json

# Check for imports
ls .sigil/imports.yaml

# Manual rebuild
npx ts-node sigil-mark/process/workshop-builder.ts
```

### Patterns Not Tracking

```bash
# Verify survival.json exists
cat .sigil/survival.json

# Check for @sigil-pattern tags in generated code
rg "@sigil-pattern" src/
```

### Performance Issues

```bash
# Check workshop size
wc -l .sigil/workshop.json

# Check last rebuild time
jq '.indexed_at' .sigil/workshop.json

# Force rebuild
rm .sigil/workshop.json
```

---

## Historical Migrations

### v0.2 → v0.3 Migration

See [docs/MIGRATION-v0.3.md](docs/MIGRATION-v0.3.md) for 0.2 → 0.3 migration guide (Constitutional Design Framework introduction).

### v4.1 → v5.0 Migration

See [docs/MIGRATION-v5.md](docs/MIGRATION-v5.md) for 4.1 → 5.0 migration guide (Seven Laws, Live Grep, JIT Polish).

---

## Support

- [Issues](https://github.com/0xHoneyJar/sigil/issues)
- [Documentation](CLAUDE.md)
- [Changelog](CHANGELOG.md)
