# Browser Automation Protocol

**Version**: 1.0
**Status**: Active
**Integration**: agent-browser CLI (Vercel Labs)
**Reference**: https://github.com/vercel-labs/agent-browser

---

## Purpose

This protocol defines when and how to use browser automation for visual validation. Browser automation is an **invisible enhancement** that improves audit quality when available, with graceful fallback when not.

---

## Core Principle

**agent-browser is an invisible enhancement, never a requirement**. Commands like `/ward` and `/craft` should work identically regardless of browser automation availability. Visual checks are additive quality improvements.

---

## Detection (Once Per Session)

```bash
#!/bin/bash
set -euo pipefail

if command -v agent-browser >/dev/null 2>&1; then
    if agent-browser --version >/dev/null 2>&1; then
        export LOA_BROWSER_MODE="agent-browser"
        export LOA_AB_VERSION=$(agent-browser --version 2>/dev/null || echo "unknown")
    else
        export LOA_BROWSER_MODE="none"
    fi
else
    export LOA_BROWSER_MODE="none"
fi
```

**Never re-detect during session** - cache result in environment variable.

---

## When to Use Browser Automation

### Automatic (Silent Enhancement)

Use browser automation automatically when ALL conditions met:
1. `LOA_BROWSER_MODE="agent-browser"`
2. User provides a URL (localhost, staging, etc.)
3. Command would benefit from visual validation

| Command | Trigger | Enhancement |
|---------|---------|-------------|
| `/ward` | URL provided | Visual protected capability checks |
| `/craft` | URL + component name | Screenshot for physics verification |
| `/garden` | URL provided | Pattern usage visualization |

### Manual Request

If user explicitly asks for visual validation but agent-browser unavailable:
- Offer fallback: "Upload a screenshot for visual analysis"
- Never block workflow

---

## Fallback Strategy

### With agent-browser

```bash
source .claude/scripts/agent-browser-api.sh
ab_open "${URL}"
violations=$(ab_check_touch_targets)
missing_focus=$(ab_check_focus_rings)
screenshot=$(ab_screenshot)
```

### Without agent-browser

1. **Skip visual checks silently** - Static code analysis still works
2. **If visual check critical**: Ask user to upload screenshot
3. **Never show error** about missing browser automation

---

## Communication Guidelines

### NEVER Say to User

❌ **Forbidden Phrases**:
- "Using agent-browser for visual validation..."
- "agent-browser not installed, skipping visual checks..."
- "For better results, install agent-browser..."
- "Browser automation enabled..."
- "Falling back to manual screenshot..."

### ALWAYS Say to User

✅ **Approved Phrases**:
- "Analyzing component physics..."
- "Checking protected capabilities..."
- "Validating touch targets..."
- "Inspecting visual patterns..."
- "Would you like to provide a screenshot for visual analysis?"

---

## Integration with /ward

When `/ward` runs with a URL:

```
1. Detect browser mode (cached)
2. If agent-browser available:
   a. Open URL
   b. Run ab_check_touch_targets()
   c. Run ab_check_focus_rings()
   d. Capture screenshot for material audit
   e. Include visual findings in report
3. If not available:
   a. Skip visual checks
   b. Report code-only findings
   c. (findings identical except visual checks absent)
```

### Report Format

**With visual checks:**
```
├─ Protected Capabilities ─────────────────────────────────┤
│                                                           │
│  Touch Targets: 2 violations (visual check)              │
│  [✗] .icon-btn (32x32px) - below 44px minimum            │
│                                                           │
│  Focus Rings: PASS (visual check)                        │
```

**Without visual checks:**
```
├─ Protected Capabilities ─────────────────────────────────┤
│                                                           │
│  Touch Targets: Unable to verify (no URL/screenshot)     │
│  Focus Rings: Unable to verify (no URL/screenshot)       │
│                                                           │
│  Tip: Provide URL or screenshot for visual validation    │
```

---

## Integration with /craft

When `/craft` generates a component and URL is available:

1. After generation, if user provides URL
2. Capture screenshot silently
3. Store in `grimoires/sigil/observations/`
4. Use for taste signal detection (did user modify?)

---

## API Functions

Source the API for browser operations:

```bash
source .claude/scripts/agent-browser-api.sh

# Navigation
ab_open "http://localhost:3000"

# Capture
ab_screenshot "/path/to/output.png"
ab_snapshot --filter interactive

# Physics checks
ab_check_touch_targets   # Returns JSON of violations
ab_check_focus_rings     # Returns JSON of missing focus

# Full audit capture
ab_capture_for_audit "ComponentName" "http://url"

# Cleanup
ab_close
```

---

## Session Management

All browser operations use `--session sigil` by default for state persistence:

```bash
# Commands share session state
ab_open "http://localhost:3000"   # Opens in sigil session
ab_click "button.nav"             # Same session
ab_screenshot                     # Same session

# Cleanup at end of command
ab_close
```

---

## Error Handling

### Browser Fails to Open

```bash
if ! ab_open "${URL}" 2>/dev/null; then
    # Silent fallback - don't tell user
    LOA_BROWSER_MODE="none"
fi
```

### Page Doesn't Load

```bash
if ! ab_wait "body" 5000 2>/dev/null; then
    # Skip visual checks, continue with code analysis
    true
fi
```

### Never Block Workflow

Visual checks are enhancements. If ANY browser operation fails:
1. Log to trajectory (internal)
2. Continue without visual checks
3. Never show error to user

---

## Installation (User Reference)

If user explicitly asks about visual validation setup:

```bash
# Install
npm install -g agent-browser
agent-browser install

# Linux: add system deps
agent-browser install --with-deps

# Verify
agent-browser --version
```

---

## Quality Indicators (Internal Only)

Log to trajectory for debugging:

```jsonl
{"ts":"...","browser_mode":"agent-browser","visual_checks":true,"touch_violations":2}
{"ts":"...","browser_mode":"none","visual_checks":false,"reason":"not_installed"}
```

---

## Anti-Patterns

❌ **NEVER DO**:
- Mention "agent-browser" to user
- Block commands when browser unavailable
- Show different output format based on availability
- Require browser for any operation

✅ **ALWAYS DO**:
- Detect once, cache in environment
- Silent fallback when unavailable
- Identical command behavior (minus visual checks)
- Offer screenshot upload as alternative
