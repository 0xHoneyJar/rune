#!/bin/bash
#
# Sigil v4.1 - Process Layer Import Checker
#
# This script checks for imports of the process layer in 'use client' files.
# The process layer uses Node.js fs and cannot run in browsers.
#
# Usage:
#   ./scripts/check-process-imports.sh [directory]
#
# Exit codes:
#   0 - No violations found
#   1 - Violations found (process imports in client files)
#   2 - Script error
#
# CI Usage:
#   Add to your CI pipeline:
#   - name: Check process imports
#     run: ./scripts/check-process-imports.sh
#

set -euo pipefail

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default directory to check
SEARCH_DIR="${1:-.}"

# Files to exclude (archives, node_modules, etc.)
EXCLUDE_DIRS=(
  "node_modules"
  ".archive"
  ".archive-v1.0"
  "dist"
  "build"
  ".next"
  "coverage"
  "loa-grimoire/context/archive"
)

echo "==============================================================================="
echo "  Sigil v4.1 - Process Layer Import Checker"
echo "==============================================================================="
echo ""
echo "Checking for process layer imports in 'use client' files..."
echo "Directory: $SEARCH_DIR"
echo ""

# Build exclude pattern for grep
EXCLUDE_PATTERN=""
for dir in "${EXCLUDE_DIRS[@]}"; do
  EXCLUDE_PATTERN="$EXCLUDE_PATTERN --exclude-dir=$dir"
done

# Find all 'use client' files
# We look for .tsx, .ts, .jsx, .js files that contain 'use client'
USE_CLIENT_FILES=$(grep -rl $EXCLUDE_PATTERN "'use client'" "$SEARCH_DIR" 2>/dev/null | grep -E '\.(tsx?|jsx?)$' || true)

if [ -z "$USE_CLIENT_FILES" ]; then
  USE_CLIENT_FILES=$(grep -rl $EXCLUDE_PATTERN '"use client"' "$SEARCH_DIR" 2>/dev/null | grep -E '\.(tsx?|jsx?)$' || true)
fi

if [ -z "$USE_CLIENT_FILES" ]; then
  echo -e "${YELLOW}No 'use client' files found. Skipping check.${NC}"
  exit 0
fi

# Counter for violations
VIOLATIONS=0
VIOLATION_FILES=()

# Check each 'use client' file for process imports
for file in $USE_CLIENT_FILES; do
  # Skip files in the process directory itself (they're allowed)
  if [[ "$file" == *"sigil-mark/process/"* ]]; then
    continue
  fi

  # Skip migration guides and documentation
  if [[ "$file" == *"MIGRATION"* ]] || [[ "$file" == *".md" ]]; then
    continue
  fi

  # Check for various process import patterns
  if grep -qE "from ['\"].*sigil-mark/process['\"]" "$file" 2>/dev/null || \
     grep -qE "from ['\"].*process-context['\"]" "$file" 2>/dev/null || \
     grep -qE "import.*ProcessContextProvider" "$file" 2>/dev/null || \
     grep -qE "import.*useProcessContext" "$file" 2>/dev/null || \
     grep -qE "import.*useConstitution" "$file" 2>/dev/null || \
     grep -qE "import.*useDecisions" "$file" 2>/dev/null; then

    ((VIOLATIONS++)) || true
    VIOLATION_FILES+=("$file")

    echo -e "${RED}VIOLATION:${NC} $file"

    # Show the offending import lines
    grep -nE "(from ['\"].*sigil-mark/process['\"]|from ['\"].*process-context['\"]|import.*ProcessContextProvider|import.*useProcessContext|import.*useConstitution|import.*useDecisions)" "$file" 2>/dev/null | head -5 | while read -r line; do
      echo "  $line"
    done
    echo ""
  fi
done

# Summary
echo "==============================================================================="
if [ $VIOLATIONS -gt 0 ]; then
  echo -e "${RED}FAILED:${NC} Found $VIOLATIONS file(s) with process layer imports in 'use client' code"
  echo ""
  echo "The process layer (sigil-mark/process) uses Node.js fs and cannot run in browsers."
  echo ""
  echo "How to fix:"
  echo "  1. Remove the import from the client file"
  echo "  2. For runtime context, use SigilProvider instead:"
  echo ""
  echo "     import { SigilProvider, useSigilZoneContext } from 'sigil-mark/providers';"
  echo ""
  echo "  3. For build-time/agent reading, move the code to a server component"
  echo "     or use the Next.js 'use server' directive"
  echo ""
  echo "See MIGRATION-v4.1.md for full migration guide."
  echo "==============================================================================="
  exit 1
else
  echo -e "${GREEN}PASSED:${NC} No process layer imports found in 'use client' files"
  echo "==============================================================================="
  exit 0
fi
