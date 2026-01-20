---
# Craft State - Investigation Persistence
# This file tracks /craft sessions for iterative debugging
# Auto-managed by /craft command

version: "1.0"
session:
  id: null
  started: null
  last_updated: null
  component: null
  file: null

iterations: []

loop_detection:
  triggered: false
  pattern: null
  escalation_offered: false
  user_choice: null

context:
  effect: null
  sync: null
  data_sources: {}
  findings: []

diagnostics: []

next:
  recommendation: null
  reason: null
  suggested_command: null
---

# Craft State

This file is auto-managed by the `/craft` command to enable iterative debugging.

## How It Works

1. **First /craft on a component**: Creates new session
2. **Subsequent /craft on same component**: Loads existing state, increments iteration
3. **Different component or >1 hour**: Archives old session, starts new
4. **Iteration 3+**: Loop detection checks for patterns

## Session Lifecycle

- **Active**: Component being debugged, <1 hour since last update
- **Archived**: Moved to `context/archive/{session_id}.md`
- **Expired**: >1 hour without activity, auto-archived on next /craft

## Schema

```yaml
session:
  id: "timestamp-component-random"  # Unique session ID
  started: "ISO8601"                 # When session began
  last_updated: "ISO8601"            # Last /craft invocation
  component: "ComponentName"         # Target component
  file: "src/path/to/file.tsx"      # File path

iterations:
  - number: 1
    timestamp: "ISO8601"
    action: "What was attempted"
    result: "SUCCESS | PARTIAL | FAILED"
    hypothesis: "Why we thought this would work"
    tokens_used: 2400
    rules_loaded: ["01-sigil-physics.md"]

loop_detection:
  triggered: true/false
  pattern: "each_fix_reveals_new_issue" | "repeated_fix_attempt" | "stuck_hypothesis"
  escalation_offered: true/false
  user_choice: "diagnose" | "understand" | "plan" | "continue"

context:
  effect: "Financial" | "Destructive" | "Standard" | "Local"
  sync: "pessimistic" | "optimistic" | "immediate"
  data_sources:
    envio: "description of envio data"
    on_chain: "description of on-chain data"
  findings:
    - "Key insight from debugging"

diagnostics:
  - timestamp: "ISO8601"
    command: "/observe diagnose ComponentName"
    findings:
      on_chain: { field: value }
      envio: { field: value }
      mismatch: ["field1", "field2"]
    diagnosis: "Root cause analysis"
    suggested_fix: "Recommended action"

next:
  recommendation: "fix" | "diagnose" | "escalate"
  reason: "Why this is recommended"
  suggested_command: "/observe diagnose ComponentName"
```

## Loop Detection Patterns

| Pattern | Detection | Recommendation |
|---------|-----------|----------------|
| each_fix_reveals_new_issue | All recent results contain "PARTIAL", "reveals", or "but" | /observe diagnose |
| repeated_fix_attempt | Same action attempted multiple times | /understand |
| stuck_hypothesis | Same hypothesis across 3+ iterations | /plan-and-analyze |
