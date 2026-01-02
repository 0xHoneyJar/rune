#!/bin/bash
# Export component taste data to JSON
# Usage: ./export-components.sh [src-path] [output-path]
#
# Examples:
#   ./export-components.sh src/components
#   ./export-components.sh src/components sigil-showcase/exports/components.json

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC_PATH="${1:-src/components}"
OUTPUT_PATH="${2:-sigil-showcase/exports/components.json}"

# Parse script from sibling skill
PARSE_SCRIPT="$SCRIPT_DIR/../../sigil-capturing-taste/scripts/parse-jsdoc.sh"

if [[ ! -f "$PARSE_SCRIPT" ]]; then
  echo "ERROR: parse-jsdoc.sh not found at $PARSE_SCRIPT"
  exit 1
fi

# Validate source path
if [[ ! -d "$SRC_PATH" ]]; then
  echo "ERROR: Source directory not found: $SRC_PATH"
  exit 1
fi

# Create output directory
OUTPUT_DIR=$(dirname "$OUTPUT_PATH")
mkdir -p "$OUTPUT_DIR"

# Function to extract tag value
extract_tag() {
  local file="$1"
  local tag="$2"
  "$PARSE_SCRIPT" "$file" "$tag" 2>/dev/null || echo ""
}

# Function to determine tier
get_tier() {
  local file="$1"
  local tier=$(extract_tag "$file" "@tier")

  if [[ -z "$tier" ]]; then
    local owner=$(extract_tag "$file" "@owner")
    local physics=$(extract_tag "$file" "@physics")
    local feel=$(extract_tag "$file" "@feel")

    if [[ -n "$owner" ]] && [[ -n "$physics" ]]; then
      echo "gold"
    elif [[ -n "$feel" ]]; then
      echo "silver"
    else
      echo "uncaptured"
    fi
  else
    echo "$tier" | tr '[:upper:]' '[:lower:]'
  fi
}

# Function to escape JSON strings
json_escape() {
  local input="$1"
  # Escape backslashes, quotes, and newlines
  echo "$input" | sed 's/\\/\\\\/g; s/"/\\"/g; s/\n/\\n/g' | tr -d '\n'
}

# Function to convert comma-separated to JSON array
to_json_array() {
  local input="$1"
  if [[ -z "$input" ]]; then
    echo "[]"
    return
  fi

  # Split by comma and format as JSON array
  echo "$input" | awk -F',' '{
    printf "["
    for (i=1; i<=NF; i++) {
      gsub(/^[ \t]+|[ \t]+$/, "", $i)
      printf "\"%s\"", $i
      if (i < NF) printf ", "
    }
    printf "]"
  }'
}

# Initialize counters
COUNT_TOTAL=0
COUNT_UNCAPTURED=0
COUNT_SILVER=0
COUNT_GOLD=0

# Find all component files
COMPONENT_FILES=$(find "$SRC_PATH" -type f \( -name "*.tsx" -o -name "*.jsx" -o -name "*.vue" -o -name "*.svelte" \) 2>/dev/null | sort)

if [[ -z "$COMPONENT_FILES" ]]; then
  echo "No component files found in $SRC_PATH"
  exit 0
fi

echo "Exporting components from: $SRC_PATH"
echo ""

# Start JSON output
echo "{" > "$OUTPUT_PATH"
echo '  "components": [' >> "$OUTPUT_PATH"

FIRST=true

while IFS= read -r file; do
  # Skip non-component files (index, types, utils, etc.)
  basename=$(basename "$file")
  if [[ "$basename" == "index."* ]] || [[ "$basename" == "types."* ]] || [[ "$basename" == "utils."* ]]; then
    continue
  fi

  # Get component name
  name=$(echo "$basename" | sed 's/\.[^.]*$//')

  # Get tier
  tier=$(get_tier "$file")

  # Extract all taste data
  description=$(extract_tag "$file" "@description")
  feel=$(extract_tag "$file" "@feel")
  rejected=$(extract_tag "$file" "@rejected")
  inspiration=$(extract_tag "$file" "@inspiration")
  intent=$(extract_tag "$file" "@intent")
  owner=$(extract_tag "$file" "@owner")
  physics=$(extract_tag "$file" "@physics")
  captured_at=$(extract_tag "$file" "@capturedAt")
  graduated_at=$(extract_tag "$file" "@graduatedAt")

  # Update counters
  COUNT_TOTAL=$((COUNT_TOTAL + 1))
  case "$tier" in
    gold) COUNT_GOLD=$((COUNT_GOLD + 1)) ;;
    silver) COUNT_SILVER=$((COUNT_SILVER + 1)) ;;
    *) COUNT_UNCAPTURED=$((COUNT_UNCAPTURED + 1)) ;;
  esac

  # Only export captured components (silver or gold)
  if [[ "$tier" == "uncaptured" ]]; then
    continue
  fi

  # Add comma separator after first component
  if [[ "$FIRST" == "true" ]]; then
    FIRST=false
  else
    echo "," >> "$OUTPUT_PATH"
  fi

  # Build JSON object
  cat >> "$OUTPUT_PATH" << EOF
    {
      "name": "$(json_escape "$name")",
      "tier": "$tier",
      "file": "$(json_escape "$file")",
      "description": "$(json_escape "$description")",
      "feel": "$(json_escape "$feel")",
      "rejected": $(to_json_array "$rejected"),
      "inspiration": $(to_json_array "$inspiration"),
      "intent": "$(json_escape "$intent")"$(
        if [[ "$tier" == "gold" ]]; then
          echo ","
          echo "      \"owner\": \"$(json_escape "$owner")\","
          echo "      \"physics\": \"$(json_escape "$physics")\""
        fi
      )$(
        if [[ -n "$captured_at" ]]; then
          echo ","
          echo "      \"capturedAt\": \"$(json_escape "$captured_at")\""
        fi
      )$(
        if [[ -n "$graduated_at" ]]; then
          echo ","
          echo "      \"graduatedAt\": \"$(json_escape "$graduated_at")\""
        fi
      )
    }
EOF

done <<< "$COMPONENT_FILES"

# Close components array
echo "" >> "$OUTPUT_PATH"
echo "  ]," >> "$OUTPUT_PATH"

# Add tier stats
cat >> "$OUTPUT_PATH" << EOF
  "tiers": {
    "total": $COUNT_TOTAL,
    "gold": $COUNT_GOLD,
    "silver": $COUNT_SILVER,
    "uncaptured": $COUNT_UNCAPTURED
  },
  "exportedAt": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF

# Summary
echo "Export complete!"
echo ""
echo "Summary:"
echo "  Total components: $COUNT_TOTAL"
echo "  Gold:             $COUNT_GOLD"
echo "  Silver:           $COUNT_SILVER"
echo "  Uncaptured:       $COUNT_UNCAPTURED"
echo ""
echo "Output: $OUTPUT_PATH"
