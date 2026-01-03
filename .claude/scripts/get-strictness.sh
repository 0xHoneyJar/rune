#!/bin/sh
# get-strictness.sh — Return current Sigil v0.3 strictness level
#
# Usage: ./get-strictness.sh [config_path]
#
# Returns: discovery | guiding | enforcing | strict
# Exit codes:
#   0 - Success
#   1 - Config file not found
#   2 - Invalid strictness value

set -e

CONFIG_PATH="${1:-.sigilrc.yaml}"

# Check if config exists
if [ ! -f "$CONFIG_PATH" ]; then
    echo "CONFIG_NOT_FOUND"
    exit 1
fi

# Try yq first (faster, more reliable)
if command -v yq >/dev/null 2>&1; then
    STRICTNESS=$(yq eval '.strictness // "discovery"' "$CONFIG_PATH" 2>/dev/null)
else
    # Fallback to grep/sed for basic YAML parsing
    STRICTNESS=$(grep -E "^strictness:" "$CONFIG_PATH" 2>/dev/null | sed 's/strictness:[[:space:]]*//' | tr -d '"' | tr -d "'" | tr -d ' ')

    # Default to discovery if not found
    if [ -z "$STRICTNESS" ]; then
        STRICTNESS="discovery"
    fi
fi

# Validate strictness value
case "$STRICTNESS" in
    discovery|guiding|enforcing|strict)
        echo "$STRICTNESS"
        exit 0
        ;;
    *)
        echo "INVALID_STRICTNESS"
        exit 2
        ;;
esac
