#!/bin/bash
# Parse JSDoc annotations from a component file
# Usage: ./parse-jsdoc.sh <file-path> [tag]
#
# Examples:
#   ./parse-jsdoc.sh src/components/Button.tsx           # All tags
#   ./parse-jsdoc.sh src/components/Button.tsx @feel     # Specific tag
#   ./parse-jsdoc.sh src/components/Button.tsx --json    # JSON output

set -e

FILE_PATH="$1"
TAG_OR_FLAG="${2:-}"

# Validate input
if [[ -z "$FILE_PATH" ]]; then
  echo "Usage: ./parse-jsdoc.sh <file-path> [tag|--json]"
  exit 1
fi

if [[ ! -f "$FILE_PATH" ]]; then
  echo "ERROR: File not found: $FILE_PATH"
  exit 1
fi

# Check if file has JSDoc
if ! grep -q "@component\|@tier" "$FILE_PATH" 2>/dev/null; then
  echo "No Sigil JSDoc found in: $FILE_PATH"
  exit 0
fi

# JSON output mode
if [[ "$TAG_OR_FLAG" == "--json" ]]; then
  COMPONENT=$(grep -o "@component [A-Za-z0-9_]*" "$FILE_PATH" | head -1 | cut -d' ' -f2)
  DESCRIPTION=$(grep -o "@description [^@]*" "$FILE_PATH" | head -1 | sed 's/@description //' | tr -d '\n' | sed 's/  */ /g')
  FEEL=$(grep -o "@feel [^@]*" "$FILE_PATH" | head -1 | sed 's/@feel //' | tr -d '\n')
  REJECTED=$(grep -o "@rejected [^@]*" "$FILE_PATH" | head -1 | sed 's/@rejected //' | tr -d '\n')
  INSPIRATION=$(grep -o "@inspiration [^@]*" "$FILE_PATH" | head -1 | sed 's/@inspiration //' | tr -d '\n')
  INTENT=$(grep -o "@intent \[J\] [^@]*" "$FILE_PATH" | head -1 | sed 's/@intent //' | tr -d '\n')
  TIER=$(grep -o "@tier [a-z]*" "$FILE_PATH" | head -1 | cut -d' ' -f2)
  OWNER=$(grep -o "@tasteOwner [^@]*" "$FILE_PATH" | head -1 | sed 's/@tasteOwner //' | tr -d '\n')
  PHYSICS=$(grep -o "@physics [^@]*" "$FILE_PATH" | head -1 | sed 's/@physics //' | tr -d '\n')

  cat << EOF
{
  "component": "${COMPONENT:-}",
  "description": "${DESCRIPTION:-}",
  "feel": "${FEEL:-}",
  "rejected": "${REJECTED:-}",
  "inspiration": "${INSPIRATION:-}",
  "intent": "${INTENT:-}",
  "tier": "${TIER:-}",
  "tasteOwner": "${OWNER:-}",
  "physics": "${PHYSICS:-}",
  "file": "$FILE_PATH"
}
EOF
  exit 0
fi

# Specific tag mode
if [[ -n "$TAG_OR_FLAG" && "$TAG_OR_FLAG" == @* ]]; then
  TAG_NAME=$(echo "$TAG_OR_FLAG" | sed 's/^@//')
  VALUE=$(grep -o "@${TAG_NAME} [^@]*" "$FILE_PATH" | head -1 | sed "s/@${TAG_NAME} //" | tr -d '\n')

  if [[ -n "$VALUE" ]]; then
    echo "$VALUE"
  else
    echo "Tag not found: $TAG_OR_FLAG"
    exit 1
  fi
  exit 0
fi

# Default: show all tags
echo "JSDoc for: $FILE_PATH"
echo "═══════════════════════════════════════"
echo ""

# Extract and display each tag
for tag in component description feel rejected inspiration intent tier tasteOwner physics captured_at graduated_at; do
  VALUE=$(grep -o "@${tag} [^@]*" "$FILE_PATH" | head -1 | sed "s/@${tag} //" | tr -d '\n' | sed 's/  */ /g')
  if [[ -n "$VALUE" ]]; then
    printf "  @%-12s %s\n" "$tag:" "$VALUE"
  fi
done

echo ""
