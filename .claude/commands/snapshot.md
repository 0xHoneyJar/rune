# /snapshot Command

## Purpose

Capture screenshots for PR documentation with optional Web3 state injection.
Supports before/after comparison and automatic PR attachment.

## Usage

```bash
# Simple capture
/snapshot <url>
/snapshot <url> [scenario]

# With label for comparison
/snapshot <url> [scenario] before
/snapshot <url> [scenario] after

# With fork mode
/snapshot <url> <scenario> fork
```

## Arguments

| Position | Name | Description | Required |
|----------|------|-------------|----------|
| 1 | url | URL to capture | Yes |
| 2 | scenario | Web3 scenario (connected, whale, etc.) | No |
| 3 | label/mode | "before", "after", or "fork" | No |

## Scenarios

Built-in scenarios from `.claude/skills/web3-testing/resources/scenarios.yaml`:

| Scenario | Description |
|----------|-------------|
| `connected` | Default wallet with 10 ETH |
| `whale` | High balance (1000 ETH) |
| `disconnected` | Provider installed, not connected |
| `empty` | Near-zero balance |
| `pending` | Mid-transaction state |
| `error` | Transaction failed state |
| `arbitrum` | Arbitrum chain (42161) |
| `base` | Base chain (8453) |

## Workflow

```
1. Parse arguments
   ├── Detect if scenario provided → enable web3 mode
   ├── Detect if "before" → stash changes, checkout main
   ├── Detect if "fork" → set fork mode
   └── Validate URL format

2. Prepare capture
   ├── If before: git stash && git checkout main
   ├── If web3: Load scenario, generate injection script
   ├── If fork: Initialize fork (Tenderly/Anvil)
   └── Create output directory

3. Inject and navigate
   ├── Generate injection script with state
   ├── agent-browser open <url> --evaluate-on-new-document
   └── agent-browser wait --load networkidle

4. Capture
   ├── agent-browser screenshot <path>
   └── Save to grimoires/sigil/snapshots/{date}/

5. Cleanup
   ├── If before: git checkout - && git stash pop
   ├── If fork: Clean up fork (optional)
   └── agent-browser close

6. Generate output
   ├── If before/after pair exists: Generate comparison.md
   └── Report screenshot path
```

## Output

Screenshots saved to:
```
grimoires/sigil/snapshots/{YYYY-MM-DD}/
├── {name}.png                    # Single capture
├── {name}-before.png             # Before capture
├── {name}-after.png              # After capture
└── comparison.md                 # Side-by-side comparison
```

## Examples

### Simple Capture

```bash
/snapshot http://localhost:3000/claim

# Output: grimoires/sigil/snapshots/2026-01-19/claim.png
```

### With Web3 State

```bash
/snapshot http://localhost:3000/claim connected

# Injects connected wallet state, captures with real balance display
```

### Before/After Comparison

```bash
# On feature branch, capture "before" state
/snapshot http://localhost:3000/claim connected before
# Stashes changes, checks out main, captures, restores

# Capture "after" state
/snapshot http://localhost:3000/claim connected after
# Captures current branch state

# Generates comparison.md automatically
```

### Fork Mode

```bash
/snapshot http://localhost:3000/dashboard whale fork

# Uses real contract state from Tenderly/Anvil fork
# Shows actual on-chain balances with mock wallet address
```

## Before/After Git Workflow

When `before` is specified:

```bash
# 1. Stash current changes
git stash push -m "sigil-snapshot-before"

# 2. Checkout main/master
git checkout main

# 3. Capture screenshot
# ... browser automation ...

# 4. Return to feature branch
git checkout -

# 5. Restore changes
git stash pop
```

## Comparison Output

When both before and after exist, generates `comparison.md`:

```markdown
## Visual Comparison

**Captured:** 2026-01-19 14:30:00
**URL:** http://localhost:3000/claim
**Scenario:** connected

| Before | After |
|--------|-------|
| ![before](claim-before.png) | ![after](claim-after.png) |

### Changes

- [Describe visual changes]
```

## Integration with /ward

Snapshot is called by `/ward` for visual validation:

```bash
/ward http://localhost:3000/claim connected
# Internally calls snapshot for the ward report
```

## Error Handling

| Error | Cause | Resolution |
|-------|-------|------------|
| "URL required" | Missing first argument | Provide URL |
| "Invalid URL" | Malformed URL | Check URL format |
| "Scenario not found" | Unknown scenario name | Use built-in or define in web3.yaml |
| "Git stash failed" | Uncommitted changes conflict | Commit or manually stash first |
| "Fork unavailable" | No Tenderly/Anvil configured | Set up fork provider |

## Dependencies

- `agent-browser` skill for browser automation
- `web3-testing` skill for state injection
- `gh` CLI for PR attachment (optional)
