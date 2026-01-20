---
name: "switch-channel"
version: "1.0.0"
description: |
  Switch between Loa + Sigil release channels (stable, develop, canary).
  Preserves user state while updating framework components.

command_type: "system"

arguments:
  - name: "channel"
    type: "string"
    required: false
    description: "Target channel: stable, develop, or canary"
  - name: "status"
    type: "flag"
    required: false
    description: "Show current channel and version info"
  - name: "branch"
    type: "string"
    required: false
    description: "Specific branch (for canary channel only)"

pre_flight:
  - check: "file_exists"
    path: ".loa-version.json"
    error: "Loa not mounted. Run /mount first."
  - check: "command_exists"
    command: "git"
    error: "git is required for channel switching"

outputs:
  - path: ".loa-version.json"
    type: "file"
    description: "Updated version manifest with new channel"

mode:
  default: "foreground"
  allow_background: false
---

# /switch-channel - Switch Release Channels

> *"Change the current, not the course."*

## Purpose

Switch between release channels (stable, develop, canary) for the Loa + Sigil framework. Allows dogfooding develop branch or testing feature branches while preserving user state.

## Invocation

```bash
# Show current channel and versions
/switch-channel --status

# Switch to develop for dogfooding
/switch-channel develop

# Return to stable
/switch-channel stable

# Use specific feature branch (canary)
/switch-channel canary --branch feature/web3-testing
```

## Channels

| Channel | Description | Stability | Updates |
|---------|-------------|-----------|---------|
| `stable` | Production releases on `main` | High | Auto |
| `develop` | Pre-release dogfooding | Medium | Manual |
| `canary` | Feature branches | Low | Manual |

## Workflow

### Phase 1: Pre-flight Checks

1. Verify `.loa-version.json` exists
2. Check for uncommitted changes in working tree
3. Read current channel from version manifest
4. Validate target channel exists in `.claude/channels.yaml`

```bash
# Check for uncommitted changes
if [[ -n "$(git status --porcelain)" ]]; then
  echo "❌ Working tree has uncommitted changes"
  echo "Please commit or stash changes before switching channels"
  exit 1
fi
```

### Phase 2: Show Status (if --status)

Display current channel information and available updates:

```
╔═══════════════════════════════════════════════════════════════╗
║  Current Channel: develop                                      ║
╚═══════════════════════════════════════════════════════════════╝

Components:
  Loa:   2.3.0-dev (develop @ 563b99e)
  Sigil: 2.3.0-dev (develop @ 563b99e)

State Files:
  ✓ grimoires/loa/         (preserved)
  ✓ grimoires/sigil/       (preserved)
  ✓ .loa.config.yaml       (preserved)

Available Channels:
  stable  → Production releases (main branch)
  develop → Current ✓
  canary  → Feature branches (requires --branch)

To switch: /switch-channel stable
```

If `--status` flag, display and exit.

### Phase 3: Resolve Target Channel

1. Read `.claude/channels.yaml` for channel definitions
2. Resolve branch names for target channel
3. If canary, require `--branch` argument

```bash
# Read channel config
CHANNELS_FILE=".claude/channels.yaml"
if [[ ! -f "$CHANNELS_FILE" ]]; then
  echo "❌ Channel definitions not found"
  exit 1
fi

# Get target branches
case "$TARGET_CHANNEL" in
  stable)
    LOA_BRANCH="main"
    SIGIL_BRANCH="main"
    ;;
  develop)
    LOA_BRANCH="develop"
    SIGIL_BRANCH="develop"
    ;;
  canary)
    if [[ -z "$BRANCH_ARG" ]]; then
      echo "❌ Canary channel requires --branch argument"
      exit 1
    fi
    LOA_BRANCH="$BRANCH_ARG"
    SIGIL_BRANCH="$BRANCH_ARG"
    ;;
esac
```

### Phase 4: Fetch and Preview

1. Fetch latest from remotes
2. Show diff summary of what will change
3. Confirm before applying

```bash
# Fetch updates
git fetch loa-upstream "$LOA_BRANCH" --quiet
git fetch sigil-upstream "$SIGIL_BRANCH" --quiet 2>/dev/null || true

# Show what will change
echo "Changes to be applied:"
git diff --stat HEAD..loa-upstream/$LOA_BRANCH -- .claude/
```

### Phase 5: Apply Changes

1. Backup current commit hashes (for rollback)
2. Update Loa components from target branch
3. Update Sigil components (if separate repo)
4. Regenerate checksums

```bash
# Record for rollback
PREV_COMMIT=$(git rev-parse HEAD)

# Update framework components (preserves state files)
git checkout "loa-upstream/$LOA_BRANCH" -- .claude/commands/
git checkout "loa-upstream/$LOA_BRANCH" -- .claude/skills/
git checkout "loa-upstream/$LOA_BRANCH" -- .claude/protocols/
git checkout "loa-upstream/$LOA_BRANCH" -- .claude/scripts/
git checkout "loa-upstream/$LOA_BRANCH" -- .claude/rules/

# Regenerate checksums
.claude/scripts/generate-checksums.sh
```

### Phase 6: Update Version Manifest

Update `.loa-version.json` with new channel info:

```json
{
  "schema_version": 3,
  "framework_version": "2.3.0-dev",
  "channel": "develop",
  "switched_at": "2026-01-19T...",
  "components": {
    "loa": {
      "version": "2.3.0-dev",
      "branch": "develop",
      "commit": "563b99e"
    }
  }
}
```

### Phase 7: Report Success

```
╔═══════════════════════════════════════════════════════════════╗
║  ✓ Switched to develop channel                                 ║
╚═══════════════════════════════════════════════════════════════╝

Updated:
  - 45 commands
  - 22 skills
  - 8 protocols
  - 17 rules

Preserved:
  - grimoires/loa/
  - grimoires/sigil/taste.md
  - .loa.config.yaml

To return to stable: /switch-channel stable
```

## State Preservation

These paths are NEVER modified during channel switch:

| Path | Content |
|------|---------|
| `grimoires/loa/` | PRD, SDD, sprint plans, analytics |
| `grimoires/sigil/taste.md` | Accumulated taste signals |
| `grimoires/sigil/context/` | Visual references |
| `.loa.config.yaml` | User configuration |
| `.claude/overrides/` | User customizations |
| `.beads/` | Task graph |

## Error Handling

| Error | Cause | Resolution |
|-------|-------|------------|
| "Uncommitted changes" | Dirty working tree | Commit or stash first |
| "Channel not found" | Invalid channel name | Use stable, develop, or canary |
| "Branch required" | Canary without --branch | Specify branch with --branch flag |
| "Fetch failed" | Network/auth error | Check connectivity |
| "Loa not mounted" | No .loa-version.json | Run /mount first |

## Rollback

If something goes wrong after switching, use git to restore:

```bash
# Check what changed
git status

# Restore previous state
git checkout HEAD~1 -- .claude/

# Or use the recorded commit
git checkout $PREV_COMMIT -- .claude/
```

## Integration with /mount

The `/mount` command also supports channels:

```bash
# Mount with specific channel
/mount --channel develop

# Equivalent to:
/mount --branch develop
```

## Next Steps

After switching channels:
- Run `/setup` if prompted for new configuration
- Check CHANGELOG.md for new features
- Run your test suite to verify compatibility
