# Sigil Updating Skill

> *"The guild's knowledge grows. Stay current."*

## Purpose

Update the Sigil framework to the latest version. Refreshes symlinks, pulls new skills, and shows changelog of what's new.

---

## Command

```
/sigil update
/sigil update --check   # Check for updates without applying
/sigil update --force   # Update even if already current
```

---

## Update Workflow

### Step 1: Pre-flight Check

```bash
# Verify sigil is mounted
if [[ ! -f ".sigil-version.json" ]]; then
  echo "ERROR: Sigil not mounted on this repository."
  echo "Run /sigil mount first."
  exit 1
fi

# Read current version
CURRENT_VERSION=$(cat .sigil-version.json | yq -r '.version')
SIGIL_HOME=$(cat .sigil-version.json | yq -r '.sigil_home')

echo "Current version: $CURRENT_VERSION"
echo "Sigil home: $SIGIL_HOME"
```

### Step 2: Check for Updates

```bash
cd "$SIGIL_HOME"

# Fetch latest
git fetch origin main --quiet

# Compare versions
LOCAL_VERSION=$(cat VERSION 2>/dev/null || echo "1.0.0")
REMOTE_VERSION=$(git show origin/main:VERSION 2>/dev/null || echo "1.0.0")

if [[ "$LOCAL_VERSION" == "$REMOTE_VERSION" ]]; then
  echo "Already at latest version: $LOCAL_VERSION"
  if [[ "$FORCE" != "true" ]]; then
    exit 0
  fi
fi

echo "Update available: $LOCAL_VERSION → $REMOTE_VERSION"
```

### Step 3: Show Changelog

```bash
# Show changes since current version
git log --oneline "$LOCAL_VERSION..origin/main" 2>/dev/null || \
  git log --oneline -10 origin/main
```

### Step 4: Pull Updates

```bash
# Stash any local changes (shouldn't be any)
git stash --quiet 2>/dev/null || true

# Pull latest
git pull origin main --quiet

# Pop stash if needed
git stash pop --quiet 2>/dev/null || true
```

### Step 5: Refresh Symlinks

```bash
cd "$ORIGINAL_DIR"

# Remove old symlinks
rm -f .claude/skills/sigil-*
rm -f .claude/commands/taste.md
rm -f .claude/commands/query.md
rm -f .claude/commands/export.md
rm -f .claude/commands/showcase.md
rm -f .claude/commands/mount.md
rm -f .claude/commands/update.md
rm -f .claude/commands/moodboard.md

# Create fresh symlinks
for skill in "$SIGIL_HOME/.claude/skills/sigil-"*; do
  ln -sf "$skill" .claude/skills/
done

for cmd in taste query export showcase mount update moodboard; do
  if [[ -f "$SIGIL_HOME/.claude/commands/${cmd}.md" ]]; then
    ln -sf "$SIGIL_HOME/.claude/commands/${cmd}.md" .claude/commands/
  fi
done
```

### Step 6: Update Version File

```bash
cat > .sigil-version.json << EOF
{
  "version": "$REMOTE_VERSION",
  "mounted_at": "$(cat .sigil-version.json | yq -r '.mounted_at')",
  "updated_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "sigil_home": "$SIGIL_HOME"
}
EOF
```

---

## Version File Schema

```json
{
  "version": "1.0.0",
  "mounted_at": "2024-01-15T12:00:00Z",
  "updated_at": "2024-02-01T12:00:00Z",
  "sigil_home": "/Users/name/.sigil/sigil"
}
```

---

## Check Mode

With `--check` flag:

```bash
/sigil update --check

Current version: 1.0.0
Latest version: 1.1.0

Update available!

Changes:
- feat: Add moodboard capture
- fix: Physics parsing edge case
- docs: Improve vocabulary descriptions

Run `/sigil update` to apply.
```

---

## Force Mode

With `--force` flag:

Even if already at latest version:
- Refresh all symlinks
- Update timestamp in version file
- Useful for fixing broken symlinks

---

## Error Handling

| Error | Cause | Resolution |
|-------|-------|------------|
| "Sigil not mounted" | No .sigil-version.json | Run /sigil mount |
| "Framework not found" | SIGIL_HOME missing | Reinstall framework |
| "Git fetch failed" | Network issue | Check internet connection |
| "Permission denied" | Can't update files | Check file permissions |

---

## Agent Behavior

When user runs `/sigil update`:

1. **Check mount** - Verify Sigil is mounted
2. **Fetch remote** - Check for new version
3. **Show diff** - Display what's changed
4. **Confirm update** - Ask user to proceed
5. **Pull changes** - Update framework
6. **Refresh links** - Update symlinks
7. **Report** - Show success message

### Confirmation

Use AskUserQuestion:

```
Update available: 1.0.0 → 1.1.0

Changes include:
- Moodboard capture feature
- Bug fixes

Apply update?

Options:
- Yes, update now
- No, stay on current version
- Show full changelog
```

### Success Message

```
✓ Sigil updated to 1.1.0

Changes applied:
- feat: Add moodboard capture
- fix: Physics parsing edge case
- docs: Improve vocabulary descriptions

Symlinks refreshed:
- 5 skills
- 7 commands

You may need to restart Claude Code to load new commands.
```

---

## Script

### update.sh

```bash
#!/bin/bash
# Update Sigil framework to latest version
# Usage: ./update.sh [--check] [--force]

set -e

ORIGINAL_DIR=$(pwd)
CHECK_ONLY=false
FORCE=false

while [[ $# -gt 0 ]]; do
  case $1 in
    --check) CHECK_ONLY=true; shift ;;
    --force) FORCE=true; shift ;;
    *) shift ;;
  esac
done

# ... implementation from steps above
```

---

## Related

- [sigil-mounting](../sigil-mounting/SKILL.md) - Initial setup
- [protocols/](../../protocols/) - Framework protocols
