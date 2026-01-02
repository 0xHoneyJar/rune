#!/bin/bash
# Export moodboard to JSON for showcase consumption
# Usage: ./export-moodboard.sh [product|feature-name] [output-file]
#
# Examples:
#   ./export-moodboard.sh product
#   ./export-moodboard.sh transactions
#   ./export-moodboard.sh product sigil-showcase/exports/moodboard.json

set -e

MOODBOARD_DIR="sigil-showcase/moodboards"
EXPORT_DIR="sigil-showcase/exports"

# Default to product moodboard
TYPE="${1:-product}"
OUTPUT="${2:-$EXPORT_DIR/moodboard.json}"

# Determine input file
if [[ "$TYPE" == "product" ]]; then
  INPUT_FILE="$MOODBOARD_DIR/product.md"
else
  INPUT_FILE="$MOODBOARD_DIR/features/${TYPE}.md"
fi

# Check file exists
if [[ ! -f "$INPUT_FILE" ]]; then
  echo "ERROR: Moodboard not found: $INPUT_FILE"
  exit 1
fi

# Ensure export directory exists
mkdir -p "$(dirname "$OUTPUT")"

# Parse frontmatter with yq if available, otherwise use grep
parse_frontmatter() {
  local file="$1"
  local key="$2"

  if command -v yq &> /dev/null; then
    # Extract YAML frontmatter between --- markers
    sed -n '/^---$/,/^---$/p' "$file" | yq -r ".$key // empty" 2>/dev/null || echo ""
  else
    # Fallback: grep for key: value pattern
    grep -m1 "^${key}:" "$file" 2>/dev/null | sed "s/^${key}:[[:space:]]*//" || echo ""
  fi
}

# Extract sections from markdown
extract_section() {
  local file="$1"
  local section="$2"

  # Find section and extract content until next ## or end
  awk -v section="$section" '
    /^## / { if (found) exit; if ($0 ~ section) found=1; next }
    found && /^[^#]/ { print }
  ' "$file"
}

# Extract list items from a section
extract_list_items() {
  local file="$1"
  local section="$2"

  extract_section "$file" "$section" | grep "^-" | sed 's/^-[[:space:]]*//' | grep -v "^$"
}

# Build JSON for product moodboard
if [[ "$TYPE" == "product" ]]; then
  PRODUCT=$(parse_frontmatter "$INPUT_FILE" "product")
  CREATED=$(parse_frontmatter "$INPUT_FILE" "created")

  # Extract north stars
  GAMES=$(extract_section "$INPUT_FILE" "### Games" | grep "^-" | sed 's/^-[[:space:]]*//' | grep -v "^$" | jq -R . | jq -s .)
  PRODUCTS=$(extract_section "$INPUT_FILE" "### Products" | grep "^-" | sed 's/^-[[:space:]]*//' | grep -v "^$" | jq -R . | jq -s .)

  # Extract anti-patterns
  ANTI=$(extract_list_items "$INPUT_FILE" "## Anti-Patterns" | jq -R . | jq -s .)

  # Build feature list
  FEATURES="[]"
  if [[ -d "$MOODBOARD_DIR/features" ]]; then
    FEATURES=$(find "$MOODBOARD_DIR/features" -name "*.md" -type f 2>/dev/null | while read -r f; do
      name=$(basename "$f" .md)
      status=$(parse_frontmatter "$f" "status")
      echo "{\"name\": \"$name\", \"status\": \"${status:-draft}\", \"file\": \"features/$name.md\"}"
    done | jq -s '.')
  fi

  # Output JSON
  cat <<EOF > "$OUTPUT"
{
  "type": "product",
  "product": "$PRODUCT",
  "created": "$CREATED",
  "northStars": {
    "games": $GAMES,
    "products": $PRODUCTS
  },
  "antiPatterns": $ANTI,
  "features": $FEATURES,
  "exportedAt": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF

else
  # Feature moodboard
  FEATURE=$(parse_frontmatter "$INPUT_FILE" "feature")
  PRODUCT=$(parse_frontmatter "$INPUT_FILE" "product")
  STATUS=$(parse_frontmatter "$INPUT_FILE" "status")
  CREATED=$(parse_frontmatter "$INPUT_FILE" "created")

  # Extract feel profile
  PRIMARY_FEEL=$(extract_section "$INPUT_FILE" "### Primary Feel" | grep "^-" | head -1 | sed 's/^-[[:space:]]*//')

  # Extract anti-feels
  ANTI_FEELS=$(extract_list_items "$INPUT_FILE" "### Anti-Feels" | jq -R . | jq -s .)

  # Output JSON
  cat <<EOF > "$OUTPUT"
{
  "type": "feature",
  "feature": "$FEATURE",
  "product": "$PRODUCT",
  "status": "${STATUS:-draft}",
  "created": "$CREATED",
  "primaryFeel": "$PRIMARY_FEEL",
  "antiFeels": $ANTI_FEELS,
  "exportedAt": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF
fi

echo "Exported: $OUTPUT"
