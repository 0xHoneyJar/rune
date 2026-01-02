---
name: update
description: Update Sigil framework to latest version
agent: sigil-updating
agent_path: .claude/skills/sigil-updating/SKILL.md
preflight:
  - sigil_mounted
---

# /sigil update

Update the Sigil framework to the latest version.

## Usage

```
/sigil update              # Update to latest version
/sigil update --check      # Check for updates without applying
/sigil update --force      # Force refresh even if current
```

## Options

| Option | Description |
|--------|-------------|
| `--check` | Show available updates without applying |
| `--force` | Refresh symlinks even if already at latest |

## What This Does

1. **Fetches** latest from remote (GitHub)
2. **Shows** changelog of what's new
3. **Pulls** updates to `~/.sigil/sigil/`
4. **Refreshes** skill and command symlinks
5. **Updates** `.sigil-version.json`

## Example

```
/sigil update

Current version: 1.0.0
Remote version: 1.1.0

Update available: 1.0.0 → 1.1.0

Changes:
--------
feat: Add moodboard capture
fix: Physics parsing edge case
docs: Improve vocabulary descriptions

Pulling updates...
Refreshing symlinks...

✓ Sigil updated to 1.1.0

Symlinks refreshed:
  - 5 skills
  - 7 commands

You may need to restart Claude Code to load new commands.
```

## Check Mode

```
/sigil update --check

Current version: 1.0.0
Latest version: 1.1.0

Update available!

Changes:
- feat: Add moodboard capture
- fix: Physics parsing edge case

Run `/sigil update` to apply.
```

## Force Mode

Use when symlinks are broken or you want to reset:

```
/sigil update --force

Already at latest version: 1.1.0
Forcing refresh...

Symlinks refreshed:
  - 5 skills
  - 7 commands
```

## Version File

Updates are tracked in `.sigil-version.json`:

```json
{
  "version": "1.1.0",
  "mounted_at": "2024-01-15T12:00:00Z",
  "updated_at": "2024-02-01T12:00:00Z",
  "sigil_home": "/Users/name/.sigil/sigil"
}
```

## Error Handling

| Condition | Message |
|-----------|---------|
| Not mounted | "Sigil not mounted. Run /sigil mount first." |
| Framework missing | "Framework not found at SIGIL_HOME" |
| Network error | "Could not fetch from remote" |

## Manual Update

If automatic update fails:

```bash
# Update framework manually
cd ~/.sigil/sigil && git pull

# Refresh symlinks
/sigil update --force
```

## After Updating

You may need to restart Claude Code to load new commands and skills.
