#!/bin/bash
# Sigil Pre-commit Hook
# Checks staged files for taste violations
# Part of the JIT Polish workflow - never auto-fixes

# Exit on error
set -e

echo "Running Sigil polish check..."

# Run polish check on staged files only
npx sigil polish --check --staged

# Check exit code
if [ $? -ne 0 ]; then
  echo ""
  echo "╔════════════════════════════════════════════════════════════╗"
  echo "║  SIGIL: Taste violations detected in staged files.         ║"
  echo "╠════════════════════════════════════════════════════════════╣"
  echo "║                                                            ║"
  echo "║  To see violations:     npx sigil polish --staged          ║"
  echo "║  To apply fixes:        npx sigil polish --staged --apply  ║"
  echo "║  To bypass (dangerous): git commit --no-verify             ║"
  echo "║                                                            ║"
  echo "╚════════════════════════════════════════════════════════════╝"
  exit 1
fi

echo "Sigil check passed."
