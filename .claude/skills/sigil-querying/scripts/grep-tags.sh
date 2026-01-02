#!/bin/bash
# Fast tag-based search for Sigil components
# Usage: ./grep-tags.sh @tag value [src-path]
#
# Examples:
#   ./grep-tags.sh @feel heavy src/components
#   ./grep-tags.sh @rejected spinner src/components
#   ./grep-tags.sh @tier gold src/components

set -e

TAG="$1"
VALUE="$2"
SRC_PATH="${3:-src/components}"

# Validate input
if [[ -z "$TAG" ]] || [[ -z "$VALUE" ]]; then
  echo "Usage: ./grep-tags.sh @tag value [src-path]"
  echo ""
  echo "Examples:"
  echo "  ./grep-tags.sh @feel heavy"
  echo "  ./grep-tags.sh @rejected spinner"
  echo "  ./grep-tags.sh @tier gold"
  exit 1
fi

# Validate path exists
if [[ ! -d "$SRC_PATH" ]]; then
  echo "ERROR: Directory not found: $SRC_PATH"
  exit 1
fi

# Normalize tag (ensure @ prefix)
if [[ "$TAG" != @* ]]; then
  TAG="@$TAG"
fi

# Build search pattern based on tag type
case "$TAG" in
  @feel|@rejected|@inspiration|@problem|@description)
    # Search for tag followed by value (case insensitive)
    PATTERN="${TAG}.*${VALUE}"
    ;;
  @tier)
    # Search for tier annotation
    VALUE_UPPER=$(echo "$VALUE" | tr '[:lower:]' '[:upper:]')
    VALUE_CAPITALIZED=$(echo "$VALUE" | sed 's/\b\(.\)/\u\1/g')
    PATTERN="@tier.*(${VALUE}|${VALUE_UPPER}|${VALUE_CAPITALIZED})"
    ;;
  @intent)
    # Search for JTBD intent label
    PATTERN="@intent.*${VALUE}"
    ;;
  @owner)
    # Search for owner annotation
    PATTERN="@owner.*${VALUE}"
    ;;
  @physics)
    # Search for physics parameters
    PATTERN="@physics.*${VALUE}"
    ;;
  *)
    # Generic tag search
    PATTERN="${TAG}.*${VALUE}"
    ;;
esac

echo "Searching for: $TAG $VALUE"
echo "Pattern: $PATTERN"
echo ""

# Run grep search
RESULTS=$(grep -rli "$PATTERN" "$SRC_PATH" --include="*.tsx" --include="*.jsx" --include="*.vue" --include="*.svelte" 2>/dev/null || true)

if [[ -z "$RESULTS" ]]; then
  echo "No matches found."
  exit 0
fi

# Output results
echo "Found matches:"
echo ""
echo "$RESULTS" | while read -r file; do
  echo "  $file"
done

# Count results
COUNT=$(echo "$RESULTS" | wc -l | tr -d ' ')
echo ""
echo "Total: $COUNT file(s)"
