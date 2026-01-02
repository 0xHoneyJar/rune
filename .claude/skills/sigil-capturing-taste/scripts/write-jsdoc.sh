#!/bin/bash
# Write or update JSDoc annotations in a component file
# Usage: ./write-jsdoc.sh <file-path> <component> <description> <feel> <rejected> <inspiration> <intent> [tier]
#
# Example:
#   ./write-jsdoc.sh src/components/Button.tsx "Button" "Handles clicks" "Snappy" "modals" "Figma" "[J] Make Transaction"

set -e

FILE_PATH="$1"
COMPONENT="$2"
DESCRIPTION="$3"
FEEL="$4"
REJECTED="$5"
INSPIRATION="$6"
INTENT="$7"
TIER="${8:-silver}"

# Validate input
if [[ -z "$FILE_PATH" || -z "$COMPONENT" ]]; then
  echo "Usage: ./write-jsdoc.sh <file-path> <component> <description> <feel> <rejected> <inspiration> <intent> [tier]"
  exit 1
fi

if [[ ! -f "$FILE_PATH" ]]; then
  echo "ERROR: File not found: $FILE_PATH"
  exit 1
fi

DATE=$(date +%Y-%m-%d)

# Build JSDoc block
JSDOC_BLOCK="/**
 * @component $COMPONENT
 * @description $DESCRIPTION
 * @feel $FEEL
 * @rejected $REJECTED
 * @inspiration $INSPIRATION
 * @intent $INTENT
 * @tier $TIER
 * @captured_at $DATE
 * @captured_by Sigil
 */"

# Check if JSDoc already exists
if grep -q "@component $COMPONENT" "$FILE_PATH" 2>/dev/null; then
  echo "Updating existing JSDoc for $COMPONENT..."

  # Create temp file with updates (portable approach)
  TEMP_FILE=$(mktemp)

  # Use awk to replace the JSDoc block
  awk -v new_doc="$JSDOC_BLOCK" '
    /\/\*\*/ { in_jsdoc=1; jsdoc_start=NR }
    in_jsdoc && /@component/ { found_component=1 }
    in_jsdoc && /\*\// {
      if (found_component) {
        print new_doc
        in_jsdoc=0
        found_component=0
        next
      }
      in_jsdoc=0
    }
    !in_jsdoc { print }
  ' "$FILE_PATH" > "$TEMP_FILE"

  mv "$TEMP_FILE" "$FILE_PATH"

else
  echo "Adding new JSDoc for $COMPONENT..."

  # Find the component definition line
  # Look for: export function X, export const X, function X, const X =
  COMPONENT_LINE=$(grep -n "export.*function $COMPONENT\|export.*const $COMPONENT\|^function $COMPONENT\|^const $COMPONENT" "$FILE_PATH" | head -1 | cut -d: -f1)

  if [[ -z "$COMPONENT_LINE" ]]; then
    # Try looser match
    COMPONENT_LINE=$(grep -n "$COMPONENT" "$FILE_PATH" | grep -E "export|function|const" | head -1 | cut -d: -f1)
  fi

  if [[ -z "$COMPONENT_LINE" ]]; then
    echo "WARNING: Could not find component definition. Adding JSDoc at top of file."
    COMPONENT_LINE=1
  fi

  # Insert JSDoc before the component definition (portable approach)
  TEMP_FILE=$(mktemp)
  {
    head -n $((COMPONENT_LINE - 1)) "$FILE_PATH"
    echo "$JSDOC_BLOCK"
    tail -n +$COMPONENT_LINE "$FILE_PATH"
  } > "$TEMP_FILE"

  mv "$TEMP_FILE" "$FILE_PATH"
fi

echo ""
echo "✓ JSDoc written to: $FILE_PATH"
echo ""
echo "Tags:"
echo "  @component: $COMPONENT"
echo "  @description: $DESCRIPTION"
echo "  @feel: $FEEL"
echo "  @rejected: $REJECTED"
echo "  @inspiration: $INSPIRATION"
echo "  @intent: $INTENT"
echo "  @tier: $TIER"
echo "  @captured_at: $DATE"
