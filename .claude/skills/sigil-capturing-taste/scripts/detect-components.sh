#!/bin/bash
# Detect React/Vue/Svelte components in a directory
# Usage: ./detect-components.sh [src-path] [component-name]
#
# Examples:
#   ./detect-components.sh src/components          # List all components
#   ./detect-components.sh src/components Button   # Find specific component

set -e

SRC_PATH="${1:-src/components}"
COMPONENT_NAME="${2:-}"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
DIM='\033[2m'
NC='\033[0m'

# Validate path exists
if [[ ! -d "$SRC_PATH" ]]; then
  echo "ERROR: Directory not found: $SRC_PATH"
  exit 1
fi

# If specific component requested, search for it
if [[ -n "$COMPONENT_NAME" ]]; then
  echo "Searching for component: $COMPONENT_NAME"
  echo ""

  # Search by filename
  MATCHES=$(find "$SRC_PATH" -type f \( -name "${COMPONENT_NAME}.tsx" -o -name "${COMPONENT_NAME}.jsx" -o -name "${COMPONENT_NAME}.vue" -o -name "${COMPONENT_NAME}.svelte" \) 2>/dev/null || true)

  # Also search for partial matches
  if [[ -z "$MATCHES" ]]; then
    MATCHES=$(find "$SRC_PATH" -type f \( -name "*${COMPONENT_NAME}*.tsx" -o -name "*${COMPONENT_NAME}*.jsx" \) 2>/dev/null | head -10 || true)
  fi

  if [[ -n "$MATCHES" ]]; then
    echo -e "${GREEN}Found:${NC}"
    while IFS= read -r file; do
      # Check if already captured
      if grep -q "@tier" "$file" 2>/dev/null; then
        TIER=$(grep -o "@tier [a-z]*" "$file" | head -1 | cut -d' ' -f2)
        echo -e "  $file ${DIM}(@tier $TIER)${NC}"
      else
        echo -e "  $file ${YELLOW}(uncaptured)${NC}"
      fi
    done <<< "$MATCHES"
  else
    echo "No component found matching: $COMPONENT_NAME"
    echo ""
    echo "Try:"
    echo "  ./detect-components.sh $SRC_PATH  # List all components"
  fi

  exit 0
fi

# List all components
echo "Detecting components in: $SRC_PATH"
echo ""

# Find component files
COMPONENT_FILES=$(find "$SRC_PATH" -type f \( -name "*.tsx" -o -name "*.jsx" -o -name "*.vue" -o -name "*.svelte" \) 2>/dev/null | sort || true)

if [[ -z "$COMPONENT_FILES" ]]; then
  echo "No component files found."
  exit 0
fi

# Count and categorize
TOTAL=0
CAPTURED=0
UNCAPTURED=0

echo "Components:"
while IFS= read -r file; do
  BASENAME=$(basename "$file" | sed 's/\.[^.]*$//')
  TOTAL=$((TOTAL + 1))

  if grep -q "@tier" "$file" 2>/dev/null; then
    TIER=$(grep -o "@tier [a-z]*" "$file" | head -1 | cut -d' ' -f2)
    CAPTURED=$((CAPTURED + 1))
    echo -e "  ${GREEN}✓${NC} $BASENAME ${DIM}($TIER)${NC}"
  else
    UNCAPTURED=$((UNCAPTURED + 1))
    echo -e "  ${YELLOW}○${NC} $BASENAME"
  fi
done <<< "$COMPONENT_FILES"

echo ""
echo "Summary:"
echo "  Total: $TOTAL"
echo "  Captured: $CAPTURED"
echo "  Uncaptured: $UNCAPTURED"
