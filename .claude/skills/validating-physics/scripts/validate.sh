#!/bin/bash
#
# Sigil v6.1 — Physics Validation Hook
#
# PreToolUse hook for validating code before Write/Edit operations.
# Bridges Claude Code hooks to physics-validator.ts TypeScript module.
#
# Usage: validate.sh <code_content> <file_path>
# Exit code: 0 = allow, 1 = block
#
# Output: JSON to stdout with { valid, violations, divergent }
#

set -euo pipefail

# Get script directory for relative imports
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../../../.." && pwd)"

# Arguments
CODE_CONTENT="${1:-}"
FILE_PATH="${2:-}"

# Validate inputs
if [[ -z "$CODE_CONTENT" ]]; then
  echo '{"valid":true,"violations":[],"divergent":[]}'
  exit 0
fi

# Check if this is a TypeScript/TSX/JavaScript file that needs validation
if [[ -n "$FILE_PATH" ]]; then
  EXTENSION="${FILE_PATH##*.}"
  case "$EXTENSION" in
    ts|tsx|js|jsx)
      # Continue with validation
      ;;
    *)
      # Skip non-JS/TS files
      echo '{"valid":true,"violations":[],"divergent":[]}'
      exit 0
      ;;
  esac
fi

# Create temporary file for code content
TEMP_FILE=$(mktemp)
trap 'rm -f "$TEMP_FILE"' EXIT

echo "$CODE_CONTENT" > "$TEMP_FILE"

# Run TypeScript validation
cd "$PROJECT_ROOT"

# Execute validation via npx tsx
RESULT=$(npx tsx -e "
import { validatePhysicsForHook } from './sigil-mark/process/physics-validator.js';
import * as fs from 'fs';

const code = fs.readFileSync('$TEMP_FILE', 'utf-8');
const filePath = '$FILE_PATH' || undefined;
const projectRoot = '$PROJECT_ROOT';

const result = validatePhysicsForHook(code, filePath, projectRoot);
console.log(JSON.stringify(result));
" 2>/dev/null || echo '{"valid":true,"violations":[],"divergent":[]}')

# Output result
echo "$RESULT"

# Parse result for exit code
VALID=$(echo "$RESULT" | npx tsx -e "
const input = require('fs').readFileSync('/dev/stdin', 'utf-8');
try {
  const result = JSON.parse(input);
  process.exit(result.valid === false ? 1 : 0);
} catch {
  process.exit(0);
}
" 2>/dev/null || true)

# Get exit code from validation
if echo "$RESULT" | grep -q '"valid":false'; then
  exit 1
else
  exit 0
fi
