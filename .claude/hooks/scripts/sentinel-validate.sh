#!/bin/bash
#
# Sigil v7.5 — Sentinel Validation Script
#
# Called by PreToolUse hook to validate code before Write/Edit operations.
# Returns JSON response for hook processing.
#
# Usage: sentinel-validate.sh <file_path> <content>
#
# Exit codes:
#   0 - Validation passed (or non-blocking warnings)
#   1 - Validation failed (blocking errors)

set -euo pipefail

FILE_PATH="${1:-}"
CONTENT="${2:-}"

# Get project root (where .sigilrc.yaml or package.json exists)
PROJECT_ROOT="$(pwd)"
if [[ -f "${PROJECT_ROOT}/.sigilrc.yaml" ]]; then
  : # Already at project root
elif [[ -f "${PROJECT_ROOT}/package.json" ]]; then
  : # Already at project root
else
  # Try to find project root
  while [[ ! -f "${PROJECT_ROOT}/.sigilrc.yaml" && ! -f "${PROJECT_ROOT}/package.json" && "${PROJECT_ROOT}" != "/" ]]; do
    PROJECT_ROOT="$(dirname "${PROJECT_ROOT}")"
  done
fi

# Skip validation for non-code files
skip_extensions=(
  ".md" ".json" ".yaml" ".yml" ".sh" ".css" ".html" ".svg"
)

for ext in "${skip_extensions[@]}"; do
  if [[ "${FILE_PATH}" == *"${ext}" ]]; then
    echo '{"allow": true, "skipped": true, "reason": "Non-code file"}'
    exit 0
  fi
done

# Skip if content is empty
if [[ -z "${CONTENT}" ]]; then
  echo '{"allow": true, "skipped": true, "reason": "Empty content"}'
  exit 0
fi

# Check if sentinel validator exists
VALIDATOR_PATH="${PROJECT_ROOT}/sigil-mark/process/sentinel-validator.ts"
if [[ ! -f "${VALIDATOR_PATH}" ]]; then
  echo '{"allow": true, "skipped": true, "reason": "Sentinel validator not found"}'
  exit 0
fi

# Run TypeScript validator using npx tsx
# Pass content via stdin to avoid shell escaping issues
RESULT=$(echo "${CONTENT}" | npx tsx -e "
import { sentinelValidate } from '${VALIDATOR_PATH}';
import * as readline from 'readline';

const rl = readline.createInterface({ input: process.stdin });
let content = '';

rl.on('line', (line) => { content += line + '\\n'; });
rl.on('close', () => {
  const result = sentinelValidate('${FILE_PATH}', content, '${PROJECT_ROOT}');

  // Format for hook response
  const response = {
    allow: result.allow,
    errors: result.errors.map(e => ({
      message: e.message,
      suggestion: e.suggestion,
      line: e.line,
    })),
    warnings: result.warnings.map(w => ({
      message: w.message,
      severity: w.severity,
    })),
    durationMs: result.durationMs,
  };

  console.log(JSON.stringify(response));
});
" 2>/dev/null) || {
  # If TypeScript execution fails, allow but warn
  echo '{"allow": true, "skipped": true, "reason": "Validator execution failed"}'
  exit 0
}

# Parse result and determine exit code
ALLOW=$(echo "${RESULT}" | jq -r '.allow // true')

if [[ "${ALLOW}" == "false" ]]; then
  # Output result and exit with error
  echo "${RESULT}"
  exit 1
else
  # Output result and exit success
  echo "${RESULT}"
  exit 0
fi
