#!/bin/bash
# Format search results into component cards
# Usage: ./format-results.sh file1.tsx file2.tsx ...
#
# Parses JSDoc from each file and displays formatted component cards

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Check if parse-jsdoc.sh exists in sibling skill
PARSE_SCRIPT="$SCRIPT_DIR/../../sigil-capturing-taste/scripts/parse-jsdoc.sh"

if [[ ! -f "$PARSE_SCRIPT" ]]; then
  echo "ERROR: parse-jsdoc.sh not found at $PARSE_SCRIPT"
  exit 1
fi

# Function to extract tag value from JSDoc
extract_tag() {
  local file="$1"
  local tag="$2"
  "$PARSE_SCRIPT" "$file" "$tag" 2>/dev/null || echo ""
}

# Function to get component name from file
get_component_name() {
  local file="$1"
  local basename=$(basename "$file" | sed 's/\.[^.]*$//')
  echo "$basename"
}

# Function to determine tier from JSDoc
get_tier() {
  local file="$1"
  local tier=$(extract_tag "$file" "@tier")

  if [[ -z "$tier" ]]; then
    # Check for Gold indicators
    local owner=$(extract_tag "$file" "@owner")
    local physics=$(extract_tag "$file" "@physics")
    local feel=$(extract_tag "$file" "@feel")

    if [[ -n "$owner" ]] && [[ -n "$physics" ]]; then
      echo "Gold"
    elif [[ -n "$feel" ]]; then
      echo "Silver"
    else
      echo "Uncaptured"
    fi
  else
    echo "$tier"
  fi
}

# Function to draw a component card
draw_card() {
  local file="$1"
  local name=$(get_component_name "$file")
  local tier=$(get_tier "$file")

  local feel=$(extract_tag "$file" "@feel")
  local rejected=$(extract_tag "$file" "@rejected")
  local inspiration=$(extract_tag "$file" "@inspiration")
  local intent=$(extract_tag "$file" "@intent")
  local owner=$(extract_tag "$file" "@owner")
  local physics=$(extract_tag "$file" "@physics")

  # Card width
  local width=49

  # Top border
  printf "┌"
  printf '─%.0s' $(seq 1 $width)
  printf "┐\n"

  # Title line
  local title="$name ($tier)"
  local title_len=${#title}
  local padding=$((width - title_len - 1))
  printf "│ %s" "$title"
  printf ' %.0s' $(seq 1 $padding)
  printf "│\n"

  # Separator
  printf "├"
  printf '─%.0s' $(seq 1 $width)
  printf "┤\n"

  # Content lines
  print_line() {
    local label="$1"
    local value="$2"
    if [[ -n "$value" ]]; then
      local content="$label: $value"
      # Truncate if too long
      if [[ ${#content} -gt $((width - 2)) ]]; then
        content="${content:0:$((width - 5))}..."
      fi
      local content_len=${#content}
      local padding=$((width - content_len - 1))
      printf "│ %s" "$content"
      printf ' %.0s' $(seq 1 $padding)
      printf "│\n"
    fi
  }

  print_line "@feel" "$feel"
  print_line "@rejected" "$rejected"
  print_line "@inspiration" "$inspiration"
  print_line "@intent" "$intent"
  [[ "$tier" == "Gold" ]] && print_line "@owner" "$owner"
  [[ "$tier" == "Gold" ]] && print_line "@physics" "$physics"

  # File path
  local file_content="File: $file"
  if [[ ${#file_content} -gt $((width - 2)) ]]; then
    file_content="File: ...${file: -$((width - 12))}"
  fi
  local file_len=${#file_content}
  local padding=$((width - file_len - 1))
  printf "│ %s" "$file_content"
  printf ' %.0s' $(seq 1 $padding)
  printf "│\n"

  # Bottom border
  printf "└"
  printf '─%.0s' $(seq 1 $width)
  printf "┘\n"
}

# Main execution
if [[ $# -eq 0 ]]; then
  echo "Usage: ./format-results.sh file1.tsx file2.tsx ..."
  echo ""
  echo "Formats component files into taste cards."
  exit 1
fi

# Process each file
for file in "$@"; do
  if [[ -f "$file" ]]; then
    draw_card "$file"
    echo ""
  else
    echo "WARNING: File not found: $file"
  fi
done
