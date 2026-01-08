#!/bin/bash
#
# Sigil v4.1 - Version Coherence Verification
#
# This script verifies that all version references in the codebase match
# the authoritative version in .sigil-version.json
#
# Usage:
#   ./scripts/verify-version.sh
#
# Exit codes:
#   0 - All versions match
#   1 - Version mismatch detected
#   2 - Script error (missing files, etc.)
#
# CI Usage:
#   Add to your CI pipeline:
#   - name: Verify version coherence
#     run: ./scripts/verify-version.sh
#

set -euo pipefail

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Find project root (where .sigil-version.json lives)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "==============================================================================="
echo "  Sigil v4.1 - Version Coherence Verification"
echo "==============================================================================="
echo ""

# Check for .sigil-version.json
VERSION_FILE="$PROJECT_ROOT/.sigil-version.json"
if [ ! -f "$VERSION_FILE" ]; then
  echo -e "${RED}ERROR:${NC} .sigil-version.json not found at $VERSION_FILE"
  echo "This file is the single source of truth for Sigil version."
  exit 2
fi

# Extract authoritative version using grep/sed (avoiding jq dependency)
SIGIL_VERSION=$(grep -o '"sigil_version": *"[^"]*"' "$VERSION_FILE" | sed 's/"sigil_version": *"\([^"]*\)"/\1/')

if [ -z "$SIGIL_VERSION" ]; then
  echo -e "${RED}ERROR:${NC} Could not extract sigil_version from $VERSION_FILE"
  exit 2
fi

echo "Authoritative version: $SIGIL_VERSION"
echo ""

# Track mismatches
MISMATCH_COUNT=0
declare -a MISMATCH_FILES

# Function to check version in a file
check_version() {
  local file="$1"
  local pattern="$2"
  local description="$3"

  if [ ! -f "$file" ]; then
    echo -e "${YELLOW}SKIP:${NC} $description"
    echo "  File not found: $file"
    return 0
  fi

  # Extract version from file
  local found_version=$(grep -oE "$pattern" "$file" 2>/dev/null | head -1 || true)

  if [ -z "$found_version" ]; then
    echo -e "${YELLOW}SKIP:${NC} $description"
    echo "  Pattern not found in $file"
    return 0
  fi

  # Clean up the found version (extract just the version number)
  local clean_version=$(echo "$found_version" | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1)

  if [ "$clean_version" = "$SIGIL_VERSION" ]; then
    echo -e "${GREEN}OK:${NC} $description"
    echo "  $file: $clean_version"
  else
    echo -e "${RED}MISMATCH:${NC} $description"
    echo "  $file: $clean_version (expected $SIGIL_VERSION)"
    ((MISMATCH_COUNT++)) || true
    MISMATCH_FILES+=("$file")
  fi
}

# Check all version locations
echo "Checking version coherence..."
echo ""

# 1. .sigil-version.json - framework_version
echo -e "${BLUE}[1/6] .sigil-version.json (framework_version)${NC}"
check_version "$VERSION_FILE" '"framework_version": *"[0-9]+\.[0-9]+\.[0-9]+"' "Framework version"
echo ""

# 2. .sigilrc.yaml
echo -e "${BLUE}[2/6] .sigilrc.yaml${NC}"
check_version "$PROJECT_ROOT/.sigilrc.yaml" 'sigil: *"[0-9]+\.[0-9]+\.[0-9]+"' "Sigil config version"
echo ""

# 3. sigil-mark/package.json
echo -e "${BLUE}[3/6] sigil-mark/package.json${NC}"
check_version "$PROJECT_ROOT/sigil-mark/package.json" '"version": *"[0-9]+\.[0-9]+\.[0-9]+"' "Package version"
echo ""

# 4. CLAUDE.md (footer version)
echo -e "${BLUE}[4/6] CLAUDE.md${NC}"
CLAUDE_FILE="$PROJECT_ROOT/CLAUDE.md"
if [ -f "$CLAUDE_FILE" ]; then
  CLAUDE_VERSION=$(grep -oE 'Sigil v[0-9]+\.[0-9]+\.[0-9]+' "$CLAUDE_FILE" | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | tail -1 || true)
  if [ "$CLAUDE_VERSION" = "$SIGIL_VERSION" ]; then
    echo -e "${GREEN}OK:${NC} CLAUDE.md footer"
    echo "  $CLAUDE_FILE: $CLAUDE_VERSION"
  elif [ -n "$CLAUDE_VERSION" ]; then
    echo -e "${RED}MISMATCH:${NC} CLAUDE.md footer"
    echo "  $CLAUDE_FILE: $CLAUDE_VERSION (expected $SIGIL_VERSION)"
    ((MISMATCH_COUNT++)) || true
    MISMATCH_FILES+=("$CLAUDE_FILE")
  else
    echo -e "${YELLOW}SKIP:${NC} CLAUDE.md footer"
    echo "  No version found in footer"
  fi
else
  echo -e "${YELLOW}SKIP:${NC} CLAUDE.md not found"
fi
echo ""

# 5. MIGRATION-v4.1.md (if version matches)
echo -e "${BLUE}[5/6] MIGRATION-v4.1.md${NC}"
MIGRATION_FILE="$PROJECT_ROOT/MIGRATION-v4.1.md"
if [ -f "$MIGRATION_FILE" ]; then
  MIGRATION_VERSION=$(grep -oE 'Version:.*[0-9]+\.[0-9]+\.[0-9]+' "$MIGRATION_FILE" | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1 || true)
  if [ "$MIGRATION_VERSION" = "$SIGIL_VERSION" ]; then
    echo -e "${GREEN}OK:${NC} MIGRATION-v4.1.md"
    echo "  $MIGRATION_FILE: $MIGRATION_VERSION"
  elif [ -n "$MIGRATION_VERSION" ]; then
    echo -e "${RED}MISMATCH:${NC} MIGRATION-v4.1.md"
    echo "  $MIGRATION_FILE: $MIGRATION_VERSION (expected $SIGIL_VERSION)"
    ((MISMATCH_COUNT++)) || true
    MISMATCH_FILES+=("$MIGRATION_FILE")
  else
    echo -e "${YELLOW}SKIP:${NC} Version not found in migration guide"
  fi
else
  echo -e "${YELLOW}SKIP:${NC} MIGRATION-v4.1.md not found"
fi
echo ""

# 6. Check for old version references (v2, v3, 3.0, 2.0) - excluding archives
echo -e "${BLUE}[6/6] Legacy version references${NC}"
LEGACY_REFS=$(grep -r --include="*.ts" --include="*.tsx" --include="*.yaml" --include="*.json" \
  --exclude-dir=node_modules \
  --exclude-dir=.archive \
  --exclude-dir=.archive-v1.0 \
  --exclude-dir=dist \
  --exclude-dir=coverage \
  --exclude-dir=loa-grimoire \
  -E "Sigil v(1|2|3)\.[0-9]|version.*['\"]?(1|2|3)\.[0-9]+\.[0-9]+['\"]?" \
  "$PROJECT_ROOT" 2>/dev/null | grep -v "from_version" | grep -v "CHANGELOG" | grep -v "MIGRATION" | grep -v "test" | head -10 || true)

if [ -n "$LEGACY_REFS" ]; then
  echo -e "${YELLOW}WARNING:${NC} Found potential legacy version references:"
  echo "$LEGACY_REFS" | head -5
  if [ $(echo "$LEGACY_REFS" | wc -l) -gt 5 ]; then
    echo "  ... and more"
  fi
  echo ""
  echo "  These may be intentional (changelogs, comments) or need updating."
else
  echo -e "${GREEN}OK:${NC} No legacy version references found"
fi
echo ""

# Summary
echo "==============================================================================="
if [ $MISMATCH_COUNT -gt 0 ]; then
  echo -e "${RED}FAILED:${NC} $MISMATCH_COUNT version mismatch(es) detected"
  echo ""
  echo "Mismatched files:"
  for file in "${MISMATCH_FILES[@]}"; do
    echo "  - $file"
  done
  echo ""
  echo "How to fix:"
  echo "  1. Update each file to use version $SIGIL_VERSION"
  echo "  2. .sigil-version.json is the single source of truth"
  echo "  3. Run this script again to verify"
  echo "==============================================================================="
  exit 1
else
  echo -e "${GREEN}PASSED:${NC} All version references match $SIGIL_VERSION"
  echo "==============================================================================="
  exit 0
fi
