# Loa Helper Scripts

Bash utilities for deterministic operations in the Loa framework.

## Dependencies

| Tool | Required By | Install |
|------|-------------|---------|
| `yq` | `mcp-registry.sh` | `brew install yq` / `apt install yq` |
| `agent-browser` | `agent-browser-api.sh`, `/observe` | `npm install -g agent-browser && agent-browser install` |

## Script Inventory

| Script | Purpose | Exit Codes |
|--------|---------|------------|
| `analytics.sh` | Analytics helper functions (THJ only) | 0=success |
| `check-beads.sh` | Check if Beads (bd CLI) is installed | 0=installed, 1=not installed |
| `check-agent-browser.sh` | Check if agent-browser CLI is installed | 0=installed, 1=not installed, 2=needs setup |
| `agent-browser-api.sh` | Browser automation function library | (sourced, not executed) |
| `context-check.sh` | Context size assessment for parallel execution | 0=success |
| `git-safety.sh` | Template repository detection | 0=template, 1=not template |
| `preflight.sh` | Pre-flight validation functions | 0=pass, 1=fail |
| `check-feedback-status.sh` | Check sprint feedback state | 0=success, 1=error, 2=invalid |
| `validate-sprint-id.sh` | Validate sprint ID format | 0=valid, 1=invalid |
| `check-prerequisites.sh` | Check phase prerequisites | 0=OK, 1=missing |
| `mcp-registry.sh` | Query MCP server registry (requires yq) | 0=success, 1=error |
| `validate-mcp.sh` | Validate MCP server configuration | 0=OK, 1=missing |
| `assess-discovery-context.sh` | PRD context ingestion assessment | 0=success |

## Usage Examples

### Check Feedback Status
```bash
./.claude/scripts/check-feedback-status.sh sprint-1
# Returns: AUDIT_REQUIRED | REVIEW_REQUIRED | CLEAR
```

### Validate Sprint ID
```bash
./.claude/scripts/validate-sprint-id.sh sprint-1
# Returns: VALID | INVALID|reason
```

### Check Prerequisites
```bash
./.claude/scripts/check-prerequisites.sh --phase implement
./.claude/scripts/check-prerequisites.sh --phase review --sprint sprint-1
# Returns: OK | MISSING|file1,file2,...
```

### Assess Context Size
```bash
source ./.claude/scripts/context-check.sh
assess_context "implementing-tasks"
# Returns: total=1247 category=SMALL
```

### Check Template Repository
```bash
source ./.claude/scripts/git-safety.sh
detect_template
# Returns: detection method or exit 1
```

### Get User Type
```bash
source ./.claude/scripts/analytics.sh
get_user_type
# Returns: thj | oss | unknown
```

### Query MCP Registry
```bash
./.claude/scripts/mcp-registry.sh list
# Lists all available MCP servers

./.claude/scripts/mcp-registry.sh info linear
# Shows details about a specific server

./.claude/scripts/mcp-registry.sh setup github
# Shows setup instructions

./.claude/scripts/mcp-registry.sh groups
# Lists available server groups

./.claude/scripts/mcp-registry.sh group essential
# Shows servers in a group
```

### Validate MCP Configuration
```bash
./.claude/scripts/validate-mcp.sh linear
# Returns: OK | MISSING:linear

./.claude/scripts/validate-mcp.sh github vercel
# Returns: OK | MISSING:github,vercel
```

### Check Beads Installation
```bash
./.claude/scripts/check-beads.sh
# Returns: INSTALLED | NOT_INSTALLED|brew install ...|npm install ...

./.claude/scripts/check-beads.sh --quiet
# Returns: INSTALLED | NOT_INSTALLED (no install instructions)
```

### Check agent-browser Installation
```bash
./.claude/scripts/check-agent-browser.sh
# Returns: INSTALLED|version | NEEDS_SETUP|... | NOT_INSTALLED|...

./.claude/scripts/check-agent-browser.sh --quiet
# Returns: INSTALLED | NEEDS_SETUP | NOT_INSTALLED
```

### Browser Automation API
```bash
# Source the API
source ./.claude/scripts/agent-browser-api.sh

# Navigate and capture
ab_open "http://localhost:3000"
screenshot=$(ab_screenshot)
snapshot=$(ab_snapshot --filter interactive)

# Interact with elements
ab_click "button.submit"
ab_fill "input[name='email']" "user@example.com"
ab_hover ".menu-trigger"

# Physics checks
violations=$(ab_check_touch_targets)  # 44px minimum
missing=$(ab_check_focus_rings)        # Focus visibility

# Full audit capture
result=$(ab_capture_for_audit "ClaimButton" "http://localhost:3000/claim")

# Cleanup
ab_close
```

Reference: [vercel-labs/agent-browser](https://github.com/vercel-labs/agent-browser)

## Design Principles

1. **Fail fast** - `set -euo pipefail` in all scripts
2. **Parseable output** - Structured return values (e.g., `KEY|value`)
3. **Exit codes** - 0=success, 1=error, 2=invalid input
4. **No side effects** - Scripts read state, don't modify it
5. **Cross-platform** - POSIX-compatible where possible
