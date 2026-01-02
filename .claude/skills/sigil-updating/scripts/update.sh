#!/bin/bash
# Update Sigil framework to latest version
# Usage: ./update.sh [--check] [--force]
#
# Examples:
#   ./update.sh              # Update to latest
#   ./update.sh --check      # Check for updates only
#   ./update.sh --force      # Force refresh even if current

set -e

ORIGINAL_DIR=$(pwd)
CHECK_ONLY=false
FORCE=false

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --check)
      CHECK_ONLY=true
      shift
      ;;
    --force)
      FORCE=true
      shift
      ;;
    *)
      shift
      ;;
  esac
done

# Check if sigil is mounted
if [[ ! -f ".sigil-version.json" ]]; then
  echo "ERROR: Sigil not mounted on this repository."
  echo "Run /sigil mount first."
  exit 1
fi

# Read current version info
if command -v yq &> /dev/null; then
  CURRENT_VERSION=$(yq -r '.version' .sigil-version.json)
  SIGIL_HOME=$(yq -r '.sigil_home' .sigil-version.json)
else
  CURRENT_VERSION=$(grep '"version"' .sigil-version.json | sed 's/.*: "\(.*\)".*/\1/')
  SIGIL_HOME=$(grep '"sigil_home"' .sigil-version.json | sed 's/.*: "\(.*\)".*/\1/')
fi

echo "Current version: $CURRENT_VERSION"
echo "Sigil home: $SIGIL_HOME"
echo ""

# Check if framework exists
if [[ ! -d "$SIGIL_HOME" ]]; then
  echo "ERROR: Sigil framework not found at $SIGIL_HOME"
  echo "The framework may have been moved or deleted."
  echo ""
  echo "To reinstall:"
  echo "  rm .sigil-version.json"
  echo "  /sigil mount"
  exit 1
fi

# Change to sigil home
cd "$SIGIL_HOME"

# Fetch latest from remote
echo "Checking for updates..."
git fetch origin main --quiet 2>/dev/null || {
  echo "WARNING: Could not fetch from remote. Continuing with local version."
}

# Get versions
LOCAL_VERSION=$(cat VERSION 2>/dev/null || echo "$CURRENT_VERSION")
REMOTE_VERSION=$(git show origin/main:VERSION 2>/dev/null || echo "$LOCAL_VERSION")

echo "Local version: $LOCAL_VERSION"
echo "Remote version: $REMOTE_VERSION"
echo ""

# Compare versions
if [[ "$LOCAL_VERSION" == "$REMOTE_VERSION" && "$FORCE" != "true" ]]; then
  echo "Already at latest version: $LOCAL_VERSION"
  echo ""
  echo "Use --force to refresh symlinks anyway."
  exit 0
fi

if [[ "$LOCAL_VERSION" != "$REMOTE_VERSION" ]]; then
  echo "Update available: $LOCAL_VERSION → $REMOTE_VERSION"
  echo ""

  # Show changelog
  echo "Changes:"
  echo "--------"
  git log --oneline "$LOCAL_VERSION..origin/main" 2>/dev/null | head -20 || \
    git log --oneline -10 origin/main 2>/dev/null || \
    echo "  (changelog not available)"
  echo ""
fi

# Check only mode
if [[ "$CHECK_ONLY" == "true" ]]; then
  echo "Run '/sigil update' to apply."
  exit 0
fi

# Pull updates
echo "Pulling updates..."
git stash --quiet 2>/dev/null || true
git pull origin main --quiet 2>/dev/null || echo "WARNING: Could not pull updates."
git stash pop --quiet 2>/dev/null || true

# Return to original directory
cd "$ORIGINAL_DIR"

# Refresh symlinks
echo "Refreshing symlinks..."

# Remove old symlinks
rm -f .claude/skills/sigil-* 2>/dev/null || true
for cmd in taste query export showcase mount update moodboard; do
  rm -f ".claude/commands/${cmd}.md" 2>/dev/null || true
done

# Create fresh skill symlinks
for skill in "$SIGIL_HOME/.claude/skills/sigil-"*; do
  if [[ -d "$skill" ]]; then
    ln -sf "$skill" .claude/skills/
  fi
done

# Create fresh command symlinks
for cmd in taste query export showcase mount update moodboard; do
  if [[ -f "$SIGIL_HOME/.claude/commands/${cmd}.md" ]]; then
    ln -sf "$SIGIL_HOME/.claude/commands/${cmd}.md" .claude/commands/
  fi
done

# Count what was symlinked
SKILL_COUNT=$(find .claude/skills -type l -name "sigil-*" 2>/dev/null | wc -l | tr -d ' ')
CMD_COUNT=$(find .claude/commands -type l -name "*.md" 2>/dev/null | wc -l | tr -d ' ')

# Update version file
MOUNTED_AT=$(grep '"mounted_at"' .sigil-version.json 2>/dev/null | sed 's/.*: "\(.*\)".*/\1/' || echo "$(date -u +%Y-%m-%dT%H:%M:%SZ)")

cat > .sigil-version.json << EOF
{
  "version": "$REMOTE_VERSION",
  "mounted_at": "$MOUNTED_AT",
  "updated_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "sigil_home": "$SIGIL_HOME"
}
EOF

echo ""
echo "✓ Sigil updated to $REMOTE_VERSION"
echo ""
echo "Symlinks refreshed:"
echo "  - $SKILL_COUNT skills"
echo "  - $CMD_COUNT commands"
echo ""
echo "You may need to restart Claude Code to load new commands."
