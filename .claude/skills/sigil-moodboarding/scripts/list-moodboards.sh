#!/bin/bash
# List all moodboards with metadata
# Usage: ./list-moodboards.sh

set -e

MOODBOARD_DIR="sigil-showcase/moodboards"

# Check moodboard directory exists
if [[ ! -d "$MOODBOARD_DIR" ]]; then
  echo "No moodboards directory found."
  echo "Run /sigil mount to set up the structure."
  exit 0
fi

# Parse frontmatter field
parse_field() {
  local file="$1"
  local key="$2"

  if command -v yq &> /dev/null; then
    sed -n '/^---$/,/^---$/p' "$file" | yq -r ".$key // empty" 2>/dev/null || echo ""
  else
    grep -m1 "^${key}:" "$file" 2>/dev/null | sed "s/^${key}:[[:space:]]*//" || echo ""
  fi
}

echo "Sigil Moodboards"
echo "================"
echo ""

# Product moodboard
if [[ -f "$MOODBOARD_DIR/product.md" ]]; then
  PRODUCT=$(parse_field "$MOODBOARD_DIR/product.md" "product")
  CREATED=$(parse_field "$MOODBOARD_DIR/product.md" "created")
  echo "Product Moodboard:"
  echo "  - $MOODBOARD_DIR/product.md"
  [[ -n "$PRODUCT" ]] && echo "    Product: $PRODUCT"
  [[ -n "$CREATED" ]] && echo "    Created: $CREATED"
  echo ""
else
  echo "Product Moodboard: Not created"
  echo "  Create with: /sigil moodboard"
  echo ""
fi

# Feature moodboards
if [[ -d "$MOODBOARD_DIR/features" ]]; then
  FEATURE_COUNT=$(find "$MOODBOARD_DIR/features" -name "*.md" -type f 2>/dev/null | wc -l | tr -d ' ')

  if [[ "$FEATURE_COUNT" -gt 0 ]]; then
    echo "Feature Moodboards ($FEATURE_COUNT):"

    find "$MOODBOARD_DIR/features" -name "*.md" -type f 2>/dev/null | sort | while read -r f; do
      NAME=$(basename "$f" .md)
      STATUS=$(parse_field "$f" "status")
      CREATED=$(parse_field "$f" "created")

      STATUS_ICON=""
      case "$STATUS" in
        active) STATUS_ICON="[active]" ;;
        draft) STATUS_ICON="[draft]" ;;
        deprecated) STATUS_ICON="[deprecated]" ;;
        *) STATUS_ICON="" ;;
      esac

      echo "  - $NAME $STATUS_ICON"
      [[ -n "$CREATED" ]] && echo "    Created: $CREATED"
    done
    echo ""
  else
    echo "Feature Moodboards: None"
    echo "  Create with: /sigil moodboard [feature-name]"
    echo ""
  fi
else
  echo "Feature Moodboards: None"
  echo "  Create with: /sigil moodboard [feature-name]"
  echo ""
fi

# Asset count
if [[ -d "$MOODBOARD_DIR/assets" ]]; then
  ASSET_COUNT=$(find "$MOODBOARD_DIR/assets" -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.gif" -o -name "*.webp" \) 2>/dev/null | wc -l | tr -d ' ')
  echo "Assets: $ASSET_COUNT files"
else
  echo "Assets: None"
fi
