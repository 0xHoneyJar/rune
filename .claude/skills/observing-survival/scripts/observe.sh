#!/bin/bash
#
# Sigil v6.1 — Survival Observation Hook
#
# PostToolUse hook for observing patterns in generated code.
# Bridges Claude Code hooks to survival-observer.ts TypeScript module.
#
# Usage: observe.sh <file_path> <code_content>
# Exit code: Always 0 (non-blocking observation)
#
# Output: JSON to stdout with { patternsDetected, patternsUpdated, candidatesCreated }
#

set -euo pipefail

# Get script directory for relative imports
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../../../.." && pwd)"

# Arguments
FILE_PATH="${1:-}"
CODE_CONTENT="${2:-}"

# Validate inputs
if [[ -z "$CODE_CONTENT" ]] || [[ -z "$FILE_PATH" ]]; then
  echo '{"patternsDetected":0,"patternsUpdated":[],"candidatesCreated":[]}'
  exit 0
fi

# Check if this is a TypeScript/TSX/JavaScript file that needs observation
EXTENSION="${FILE_PATH##*.}"
case "$EXTENSION" in
  ts|tsx|js|jsx)
    # Continue with observation
    ;;
  *)
    # Skip non-JS/TS files
    echo '{"patternsDetected":0,"patternsUpdated":[],"candidatesCreated":[]}'
    exit 0
    ;;
esac

# Create temporary file for code content
TEMP_FILE=$(mktemp)
trap 'rm -f "$TEMP_FILE"' EXIT

echo "$CODE_CONTENT" > "$TEMP_FILE"

# Run TypeScript observation
cd "$PROJECT_ROOT"

# Execute observation via npx tsx
RESULT=$(npx tsx -e "
import { observeForHook } from './sigil-mark/process/survival-observer.js';
import * as fs from 'fs';

const code = fs.readFileSync('$TEMP_FILE', 'utf-8');
const filePath = '$FILE_PATH';
const projectRoot = '$PROJECT_ROOT';

const result = observeForHook(filePath, code, projectRoot);
console.log(JSON.stringify(result));
" 2>/dev/null || echo '{"patternsDetected":0,"patternsUpdated":[],"candidatesCreated":[]}')

# Output result
echo "$RESULT"

# Always exit 0 (non-blocking)
exit 0
