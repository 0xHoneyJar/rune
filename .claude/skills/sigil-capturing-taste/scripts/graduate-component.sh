#!/bin/bash
# Graduate a Silver component to Gold
# Usage: ./graduate-component.sh <component-name> <file-path> <owner> [physics]
#
# Cross-platform compatible (macOS + Linux)

set -e

COMPONENT_NAME="$1"
FILE_PATH="$2"
OWNER="$3"
PHYSICS="${4:-}"

if [[ -z "$COMPONENT_NAME" || -z "$FILE_PATH" || -z "$OWNER" ]]; then
  echo "Usage: ./graduate-component.sh <component-name> <file-path> <owner> [physics]"
  exit 1
fi

# Verify file exists
if [[ ! -f "$FILE_PATH" ]]; then
  echo "ERROR: File not found: $FILE_PATH"
  exit 1
fi

# Verify it's Silver tier
if ! grep -q "@tier silver" "$FILE_PATH"; then
  echo "ERROR: Component is not Silver tier. Cannot graduate."
  exit 1
fi

# Portable sed replacement function
# Works on both macOS and Linux
portable_sed_replace() {
  local pattern="$1"
  local replacement="$2"
  local file="$3"
  local temp_file=$(mktemp)

  sed "s|${pattern}|${replacement}|" "$file" > "$temp_file"
  mv "$temp_file" "$file"
}

# Update tier to gold
portable_sed_replace "@tier silver" "@tier gold" "$FILE_PATH"

# Add tasteOwner if not present
if ! grep -q "@tasteOwner" "$FILE_PATH"; then
  # Insert after @tier line using awk (portable)
  TEMP_FILE=$(mktemp)
  awk -v owner="$OWNER" '
    /@tier gold/ {
      print
      print " * @tasteOwner " owner
      next
    }
    { print }
  ' "$FILE_PATH" > "$TEMP_FILE"
  mv "$TEMP_FILE" "$FILE_PATH"
fi

# Add physics if provided
if [[ -n "$PHYSICS" ]]; then
  if ! grep -q "@physics" "$FILE_PATH"; then
    TEMP_FILE=$(mktemp)
    awk -v physics="$PHYSICS" '
      /@tier gold/ {
        print
        print " * @physics " physics
        next
      }
      { print }
    ' "$FILE_PATH" > "$TEMP_FILE"
    mv "$TEMP_FILE" "$FILE_PATH"
  fi
fi

# Add graduated_at timestamp
DATE=$(date +%Y-%m-%d)
if ! grep -q "@graduated_at" "$FILE_PATH"; then
  TEMP_FILE=$(mktemp)
  awk -v date="$DATE" '
    /@tier gold/ {
      print
      print " * @graduated_at " date
      next
    }
    { print }
  ' "$FILE_PATH" > "$TEMP_FILE"
  mv "$TEMP_FILE" "$FILE_PATH"
fi

echo "✓ Graduated ${COMPONENT_NAME} to Gold tier"
echo ""
echo "Added:"
echo "  @tier: gold"
echo "  @tasteOwner: ${OWNER}"
if [[ -n "$PHYSICS" ]]; then
  echo "  @physics: ${PHYSICS}"
fi
echo "  @graduated_at: ${DATE}"
