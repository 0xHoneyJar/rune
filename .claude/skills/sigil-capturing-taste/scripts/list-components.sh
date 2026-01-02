#!/bin/bash
# List all components by tier
# Usage: ./list-components.sh [src-path]

set -e

SRC_PATH="${1:-src/components}"

# Colors
GOLD='\033[1;33m'
SILVER='\033[0;37m'
DIM='\033[2m'
NC='\033[0m'

echo "Sigil Component Inventory"
echo "═════════════════════════"
echo ""

# Find Gold components
echo -e "${GOLD}GOLD${NC}"
GOLD_COMPONENTS=$(grep -rl "@tier gold" "$SRC_PATH" 2>/dev/null || true)
if [[ -n "$GOLD_COMPONENTS" ]]; then
  while IFS= read -r file; do
    NAME=$(grep -o "@component [A-Za-z]*" "$file" | head -1 | cut -d' ' -f2)
    FEEL=$(grep -o "@feel [^@]*" "$file" | head -1 | cut -d' ' -f2-)
    OWNER=$(grep -o "@tasteOwner [^@]*" "$file" | head -1 | cut -d' ' -f2-)
    printf "  %-20s @feel: %-20s @owner: %s\n" "$NAME" "$FEEL" "$OWNER"
  done <<< "$GOLD_COMPONENTS"
else
  echo -e "  ${DIM}(none)${NC}"
fi

echo ""

# Find Silver components
echo -e "${SILVER}SILVER${NC}"
SILVER_COMPONENTS=$(grep -rl "@tier silver" "$SRC_PATH" 2>/dev/null || true)
if [[ -n "$SILVER_COMPONENTS" ]]; then
  while IFS= read -r file; do
    NAME=$(grep -o "@component [A-Za-z]*" "$file" | head -1 | cut -d' ' -f2)
    FEEL=$(grep -o "@feel [^@]*" "$file" | head -1 | cut -d' ' -f2-)
    printf "  %-20s @feel: %s\n" "$NAME" "$FEEL"
  done <<< "$SILVER_COMPONENTS"
else
  echo -e "  ${DIM}(none)${NC}"
fi

echo ""

# Find uncaptured components (files without @tier tag)
echo -e "${DIM}UNCAPTURED${NC}"
ALL_COMPONENTS=$(find "$SRC_PATH" -name "*.tsx" -o -name "*.jsx" 2>/dev/null | head -20)
UNCAPTURED=""
if [[ -n "$ALL_COMPONENTS" ]]; then
  while IFS= read -r file; do
    if ! grep -q "@tier" "$file" 2>/dev/null; then
      BASENAME=$(basename "$file" | sed 's/\.[^.]*$//')
      UNCAPTURED="${UNCAPTURED}${BASENAME}, "
    fi
  done <<< "$ALL_COMPONENTS"
fi

if [[ -n "$UNCAPTURED" ]]; then
  echo "  ${UNCAPTURED%, }"
else
  echo -e "  ${DIM}(none)${NC}"
fi

echo ""
echo "Run /sigil taste [name] to capture taste."
