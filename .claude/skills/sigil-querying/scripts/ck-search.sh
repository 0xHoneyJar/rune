#!/bin/bash
# CK semantic search wrapper
# Usage: ./ck-search.sh "query" [src-path] [limit]
#
# Examples:
#   ./ck-search.sh "heavy loading" src/components
#   ./ck-search.sh "feels like RuneScape" src/components 10

set -e

QUERY="$1"
SRC_PATH="${2:-src/components}"
LIMIT="${3:-10}"

# Validate input
if [[ -z "$QUERY" ]]; then
  echo "Usage: ./ck-search.sh \"query\" [src-path] [limit]"
  exit 1
fi

# Check CK availability
if ! command -v ck &> /dev/null; then
  echo "CK not installed. Install with: cargo install ck-search"
  echo ""
  echo "Falling back to grep search..."

  # Simple grep fallback - search for keywords in JSDoc
  KEYWORDS=$(echo "$QUERY" | tr ' ' '\n' | grep -v '^$')

  for keyword in $KEYWORDS; do
    grep -rl "$keyword" "$SRC_PATH" --include="*.tsx" --include="*.jsx" 2>/dev/null || true
  done | sort | uniq

  exit 0
fi

# Validate path exists
if [[ ! -d "$SRC_PATH" ]]; then
  echo "ERROR: Directory not found: $SRC_PATH"
  exit 1
fi

# Run CK semantic search
# CK indexes files and performs vector similarity search
echo "Searching for: $QUERY"
echo ""

# Check if CK index exists, create if not
if [[ ! -d ".ck" ]]; then
  echo "Creating CK index..."
  ck index "$SRC_PATH" --ext tsx,jsx
fi

# Perform search
ck search "$QUERY" --path "$SRC_PATH" --limit "$LIMIT" 2>/dev/null || {
  echo "CK search failed. Falling back to grep..."

  # Grep fallback
  KEYWORDS=$(echo "$QUERY" | tr ' ' '\n' | grep -v '^$')

  for keyword in $KEYWORDS; do
    grep -rl "$keyword" "$SRC_PATH" --include="*.tsx" --include="*.jsx" 2>/dev/null || true
  done | sort | uniq
}
