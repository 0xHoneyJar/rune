#!/bin/sh
# detect-components.sh — Find component directories in codebase
#
# Usage: ./detect-components.sh [root_path]
#
# Returns: JSON array of detected component paths
# Exit codes:
#   0 - Success (even if no paths found)

set -e

ROOT_PATH="${1:-.}"
FOUND_PATHS=""

# Common component directory patterns
PATTERNS="
components
app/components
src/components
src/features/*/components
lib/components
packages/*/components
"

for pattern in $PATTERNS; do
    # Use find with -maxdepth to check if pattern matches
    if [ -d "${ROOT_PATH}/${pattern%/\*}" ] 2>/dev/null; then
        # Handle glob patterns
        for dir in ${ROOT_PATH}/${pattern}; do
            if [ -d "$dir" ]; then
                # Get relative path
                REL_PATH="${dir#${ROOT_PATH}/}"
                if [ -n "$FOUND_PATHS" ]; then
                    FOUND_PATHS="${FOUND_PATHS}\n${REL_PATH}/"
                else
                    FOUND_PATHS="${REL_PATH}/"
                fi
            fi
        done
    fi
done

# Output as JSON array
if [ -z "$FOUND_PATHS" ]; then
    echo "[]"
else
    # Convert newline-separated list to JSON array
    printf '%s\n' "$FOUND_PATHS" | awk 'BEGIN { printf "[" } NR>1 { printf ", " } { printf "\"%s\"", $0 } END { printf "]\n" }'
fi

exit 0
