# Trajectory Logs

Decision trajectory logging for /craft sessions. Records the physics detection → decision → outcome flow.

## Purpose

Trajectory logs enable:
1. **Post-hoc analysis**: Review why decisions were made
2. **Pattern detection**: Identify recurring decision paths
3. **Learning validation**: Check if taste preferences produce good outcomes
4. **Debugging**: Trace back to detection when outcomes are wrong

## File Naming

```
{YYYY-MM-DD}-{component-name}.md
```

Example: `2026-01-20-claim-button.md`

## Directory Structure

```
grimoires/sigil/trajectory/
├── README.md              # This file
├── 2026-01-20-claim-button.md
├── 2026-01-20-withdraw-modal.md
├── 2026-01-19-like-button.md
└── ...
```

## Entry Format

Each trajectory file contains one or more craft sessions:

```markdown
# Trajectory: {Component Name}

## Session {timestamp}

### Input
```
User request: "{original request}"
Component: {component name}
Craft type: {generate/refine/configure/pattern/polish}
```

### Detection
```
Effect detected: {effect type}
Keywords found: {list}
Types found: {list}
Context signals: {list}
Confidence: HIGH/MEDIUM/LOW
```

### Decision
```
Physics applied:
  Behavioral: {sync} | {timing} | {confirmation}
  Animation: {easing} | {timing} | {spring values}
  Material: {surface} | {shadow} | {radius}

Source citations:
  - Timing: {source}
  - Sync: {source}
  - Animation: {source}

Taste overrides:
  - {any taste.md adjustments}
```

### Outcome
```
Signal: {ACCEPT/MODIFY/REJECT}
Changes: {if MODIFY, what changed}
Notes: {any relevant notes}
```

---
```

## Retention Policy

| Age | Action |
|-----|--------|
| < 30 days | Keep in trajectory/ |
| 30-90 days | Compress to summary |
| > 90 days | Archive to context/archive/trajectory/ |

## Compression

After 30 days, trajectory files are compressed:

```markdown
# Trajectory Summary: January 2026

## Statistics

| Metric | Value |
|--------|-------|
| Sessions | 47 |
| ACCEPT | 38 (81%) |
| MODIFY | 7 (15%) |
| REJECT | 2 (4%) |

## Common Patterns

### Timing Modifications
- Financial 800ms → 600ms: 3 times
- Standard 200ms → 150ms: 2 times

### Animation Preferences
- ease-out → spring: 4 times
- Added bounce: 1 time

## Learnings Extracted

- 2026-01-15: "BigInt falsy check" → anti-pattern
- 2026-01-22: "Power user timing" → taste pattern
```

## Feature Flag

Trajectory logging is controlled by:
```yaml
features:
  trajectory_logging: true
```

When disabled, no trajectory files are created.

## Usage

Trajectory files are:
- Written in Step 3b (after analysis)
- Updated in Step 7 (after outcome)
- Read during learning extraction
- Analyzed during /skill-audit --stats
