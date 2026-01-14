#!/bin/bash
# check-agent-browser.sh
# Purpose: Check if agent-browser CLI is installed and functional
# Usage: ./check-agent-browser.sh [--quiet]
#
# Exit codes:
#   0 - agent-browser is installed and functional
#   1 - agent-browser is not installed (returns install instructions)
#   2 - agent-browser installed but browser not set up
#
# Output (when not installed):
#   NOT_INSTALLED|npm install -g agent-browser && agent-browser install
#
# Reference: https://github.com/vercel-labs/agent-browser

set -euo pipefail

QUIET=false
if [[ "${1:-}" == "--quiet" ]]; then
    QUIET=true
fi

# Check if agent-browser CLI is available
if command -v agent-browser &> /dev/null; then
    export LOA_AGENT_BROWSER_AVAILABLE=1

    # Check if browser is installed (has chromium)
    if agent-browser --version &> /dev/null; then
        if [[ "${QUIET}" == false ]]; then
            VERSION=$(agent-browser --version 2>/dev/null || echo "unknown")
            echo "INSTALLED|${VERSION}"
        else
            echo "INSTALLED"
        fi
        exit 0
    else
        # CLI exists but may need browser install
        if [[ "${QUIET}" == false ]]; then
            echo "NEEDS_SETUP|agent-browser install"
        else
            echo "NEEDS_SETUP"
        fi
        exit 2
    fi
else
    export LOA_AGENT_BROWSER_AVAILABLE=0

    if [[ "${QUIET}" == true ]]; then
        echo "NOT_INSTALLED"
    else
        echo "NOT_INSTALLED|npm install -g agent-browser && agent-browser install"
    fi
    exit 1
fi
