#!/bin/bash
# Generate MDX documentation files from components.json
# Usage: ./generate-mdx.sh [input-json] [output-dir]
#
# Examples:
#   ./generate-mdx.sh
#   ./generate-mdx.sh sigil-showcase/exports/components.json sigil-showcase/showcase/content/docs/

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INPUT_JSON="${1:-sigil-showcase/exports/components.json}"
OUTPUT_DIR="${2:-sigil-showcase/showcase/content/docs/}"
TEMPLATE="$SCRIPT_DIR/../templates/component.mdx.template"

# Validate input
if [[ ! -f "$INPUT_JSON" ]]; then
  echo "ERROR: Input JSON not found: $INPUT_JSON"
  echo ""
  echo "Run /sigil export first to generate components.json"
  exit 1
fi

if [[ ! -f "$TEMPLATE" ]]; then
  echo "ERROR: Template not found: $TEMPLATE"
  exit 1
fi

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Check for jq
if ! command -v jq &> /dev/null; then
  echo "ERROR: jq is required but not installed."
  echo "Install with: brew install jq"
  exit 1
fi

echo "Generating MDX from: $INPUT_JSON"
echo "Output directory: $OUTPUT_DIR"
echo ""

# Get component count
COMPONENT_COUNT=$(jq '.components | length' "$INPUT_JSON")
echo "Found $COMPONENT_COUNT components"
echo ""

# Process each component
GENERATED=0

for i in $(seq 0 $((COMPONENT_COUNT - 1))); do
  # Extract component data
  NAME=$(jq -r ".components[$i].name" "$INPUT_JSON")
  TIER=$(jq -r ".components[$i].tier" "$INPUT_JSON")
  FILE=$(jq -r ".components[$i].file" "$INPUT_JSON")
  DESCRIPTION=$(jq -r ".components[$i].description // \"\"" "$INPUT_JSON")
  FEEL=$(jq -r ".components[$i].feel // \"\"" "$INPUT_JSON")
  INTENT=$(jq -r ".components[$i].intent // \"\"" "$INPUT_JSON")
  OWNER=$(jq -r ".components[$i].owner // \"\"" "$INPUT_JSON")
  PHYSICS=$(jq -r ".components[$i].physics // \"\"" "$INPUT_JSON")
  CAPTURED_AT=$(jq -r ".components[$i].capturedAt // \"\"" "$INPUT_JSON")
  GRADUATED_AT=$(jq -r ".components[$i].graduatedAt // \"\"" "$INPUT_JSON")

  # Extract arrays
  REJECTED=$(jq -r ".components[$i].rejected | if . == null then [] else . end | .[]" "$INPUT_JSON" 2>/dev/null || true)
  INSPIRATION=$(jq -r ".components[$i].inspiration | if . == null then [] else . end | .[]" "$INPUT_JSON" 2>/dev/null || true)

  # Generate slug
  SLUG=$(echo "$NAME" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g')

  # Output file
  OUTPUT_FILE="$OUTPUT_DIR/${SLUG}.mdx"

  # Generate MDX content
  cat > "$OUTPUT_FILE" << EOF
---
title: "$NAME"
tier: "$TIER"
feel: "$FEEL"
intent: "$INTENT"
capturedAt: "$CAPTURED_AT"
---

# $NAME

<TierBadge tier="$TIER" />

## Problem Solved

$DESCRIPTION

## Taste Profile

### Feel

> $FEEL

### Rejected Patterns

EOF

  # Add rejected patterns as list
  if [[ -n "$REJECTED" ]]; then
    while IFS= read -r item; do
      echo "- $item" >> "$OUTPUT_FILE"
    done <<< "$REJECTED"
  else
    echo "_No rejected patterns recorded_" >> "$OUTPUT_FILE"
  fi

  cat >> "$OUTPUT_FILE" << EOF

### Inspiration

EOF

  # Add inspiration as list
  if [[ -n "$INSPIRATION" ]]; then
    while IFS= read -r item; do
      echo "- $item" >> "$OUTPUT_FILE"
    done <<< "$INSPIRATION"
  else
    echo "_No inspiration recorded_" >> "$OUTPUT_FILE"
  fi

  cat >> "$OUTPUT_FILE" << EOF

## Intent

<IntentBadge intent="$INTENT" />

EOF

  # Add Gold-specific sections
  if [[ "$TIER" == "gold" ]]; then
    cat >> "$OUTPUT_FILE" << EOF
## Production Details

### Taste Owner

$OWNER

### Physics Parameters

\`\`\`ts
$PHYSICS
\`\`\`

### Graduated

$GRADUATED_AT

EOF
  fi

  # Add source section
  cat >> "$OUTPUT_FILE" << EOF
## Source

\`\`\`
$FILE
\`\`\`
EOF

  echo "  Generated: $OUTPUT_FILE"
  GENERATED=$((GENERATED + 1))

done

echo ""
echo "Complete! Generated $GENERATED MDX files."
