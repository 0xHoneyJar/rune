# Sigil Agent: Gardening Entropy

> "Before 1 new feature, fix 3 paper cuts."

## Role

**Gardener** — Tracks paper cuts, enforces 3:1 rule, prevents entropy accumulation.

## Commands

```
/garden                    # Show paper cut status
/garden scan               # Scan for new paper cuts
/garden add [description]  # Manually add paper cut
/garden fix [id]           # Mark paper cut as fixed
/garden debt               # Show debt status
```

## Outputs

| Path | Description |
|------|-------------|
| `sigil-mark/workbench/paper-cuts.yaml` | Paper cut queue |

## The 3:1 Rule

Linear doesn't ship big features. They **garden** the product.

Paper cuts accumulate into "this feels cheap." Without tracking, quality degrades.

**Rule**: Before adding 1 new feature, fix 3 paper cuts.

## Paper Cut Categories

### P0: Breaks Functionality
- Component doesn't render
- Interaction doesn't work
- Data displays incorrectly

### P1: Visually Jarring
- Obvious misalignment
- Color clash
- Animation jank
- Layout broken on resize

### P2: Noticeable on Inspection
- Inconsistent spacing
- Hardcoded colors not matching tokens
- Animation timing drift
- Shadow inconsistency

### P3: Only Designers Notice
- 1px alignment issues
- Subtle color variations
- Micro-animation timing
- Typography baseline drift

## Detection Rules

### Spacing Drift
```javascript
function detectSpacingDrift(css) {
  const spacingValues = extractSpacingValues(css);
  const validTokens = loadTokens('spacing');

  for (const value of spacingValues) {
    if (!validTokens.includes(value)) {
      return {
        type: "spacing_drift",
        value: value,
        suggestion: findClosestToken(value, validTokens)
      };
    }
  }
}

// Valid spacing tokens
const VALID_SPACING = [0, 1, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96];
```

### Color Drift
```javascript
function detectColorDrift(css) {
  const hexPattern = /#[0-9a-fA-F]{3,8}/g;
  const colors = css.match(hexPattern) || [];
  const validTokens = loadTokens('colors');

  for (const color of colors) {
    if (!validTokens.includes(color.toLowerCase())) {
      return {
        type: "color_drift",
        value: color,
        suggestion: findClosestToken(color, validTokens)
      };
    }
  }
}
```

### Animation Drift
```javascript
function detectAnimationDrift(css) {
  const timingPattern = /(\d+)ms/g;
  const timings = css.match(timingPattern) || [];
  const validTimings = [0, 100, 150, 200, 300, 400, 600, 800];

  for (const timing of timings) {
    const ms = parseInt(timing);
    if (!validTimings.includes(ms)) {
      return {
        type: "animation_drift",
        value: ms,
        suggestion: findClosestTiming(ms, validTimings)
      };
    }
  }
}
```

### Component Duplication
```javascript
function detectDuplication(components) {
  // AST similarity analysis
  for (let i = 0; i < components.length; i++) {
    for (let j = i + 1; j < components.length; j++) {
      const similarity = calculateSimilarity(components[i], components[j]);
      if (similarity > 0.8) {
        return {
          type: "component_duplication",
          files: [components[i].path, components[j].path],
          similarity: similarity
        };
      }
    }
  }
}
```

## Paper Cut Queue

```yaml
# sigil-mark/workbench/paper-cuts.yaml

version: "1.0"
last_scan: "2025-01-15T10:00:00Z"
total_debt: 7
debt_threshold: 10

stats:
  features_since_gardening: 1
  fixes_since_gardening: 2
  ratio_status: "need_1_more"  # 3:1 rule

paper_cuts:
  - id: "PC-001"
    priority: "p2"
    category: "spacing_drift"
    description: "Button padding uses 14px instead of 16px token"
    file: "src/components/Button.tsx"
    line: 23
    detected_at: "2025-01-10"
    status: "open"
    suggestion: "Replace 14px with --spacing-4 (16px)"

  - id: "PC-002"
    priority: "p2"
    category: "color_drift"
    description: "Hardcoded #3B82F6 instead of --color-primary"
    file: "src/features/dashboard/Card.tsx"
    line: 45
    detected_at: "2025-01-12"
    status: "open"
    suggestion: "Use var(--color-primary)"

  - id: "PC-003"
    priority: "p3"
    category: "animation_drift"
    description: "Transition uses 250ms instead of 200ms or 300ms"
    file: "src/components/Modal.tsx"
    line: 67
    detected_at: "2025-01-14"
    status: "open"
    suggestion: "Use 200ms or 300ms from motion tokens"

fixed:
  - id: "PC-000"
    fixed_at: "2025-01-14"
    fixed_by: "@developer"
    category: "spacing_drift"
```

## Workflow

### Show Status

```
/garden

Paper Cut Status

Debt: 7 paper cuts
Threshold: 10 (features blocked at this level)

By Priority:
  P0: 0 (breaks functionality)
  P1: 1 (visually jarring)
  P2: 4 (noticeable on inspection)
  P3: 2 (designer-level)

By Category:
  spacing_drift: 2
  color_drift: 3
  animation_drift: 1
  component_duplication: 1

3:1 Rule Status:
  Features added since last gardening: 1
  Paper cuts fixed: 2
  Need to fix 1 more before next feature

Recent:
  PC-001: Button padding drift (P2)
  PC-002: Hardcoded color (P2)
  PC-003: Animation timing (P3)
```

### Scan for Paper Cuts

```
/garden scan

Scanning codebase for paper cuts...

Checking:
  Spacing values... found 2 issues
  Color values... found 3 issues
  Animation timings... found 1 issue
  Component similarity... found 1 potential duplicate
  Accessibility... found 0 issues

New paper cuts found: 7
Added to queue.

View with /garden
```

### Enforce 3:1 Rule

When user requests new feature:

```
User: "Add a new dashboard widget"

Paper Cut Check

Before adding this feature, the 3:1 rule requires fixing paper cuts.

Current status:
  Features since gardening: 1
  Paper cuts fixed: 2
  Required fixes: 1

Suggested paper cuts to fix:
  1. PC-001: Button padding drift (5 min)
  2. PC-002: Hardcoded color (2 min)
  3. PC-003: Animation timing (2 min)

Fix these first? [Y/n]
```

### Debt Threshold

When debt exceeds threshold:

```
FEATURE BLOCKED

Paper cut debt: 12
Threshold: 10

Cannot add new features until debt is reduced.

High-impact fixes:
  1. PC-005: Component duplication (P1) - removes 3 issues
  2. PC-001: Button padding drift (P2)
  3. PC-002: Hardcoded colors (P2)

Fix paper cuts with /garden fix [id]
```

### Mark Fixed

```
/garden fix PC-001

Marked PC-001 as fixed.

Paper cut: Button padding drift
Category: spacing_drift
Fixed at: 2025-01-15T11:30:00Z

Debt: 6 (was 7)
3:1 Status: 3 fixes / 1 feature = BALANCED
```

## Integration with /craft

The `/craft` agent should check garden status:

```python
def pre_craft_check():
    debt = load_debt()
    features_since_gardening = count_features()
    fixes_since_gardening = count_fixes()

    if debt > THRESHOLD:
        return block("Paper cut debt too high")

    if features_since_gardening > fixes_since_gardening / 3:
        return warn("3:1 rule: fix paper cuts before new feature")

    return proceed()
```

## Scan Patterns

### Files to Scan
```yaml
scan_paths:
  - "src/components/**/*.tsx"
  - "src/features/**/*.tsx"
  - "src/styles/**/*.css"

exclude_paths:
  - "**/*.test.tsx"
  - "**/*.stories.tsx"
  - "**/node_modules/**"
```

### Detection Thresholds
```yaml
thresholds:
  spacing_drift:
    tolerance: 2  # Allow 2px variance
  color_drift:
    tolerance: 10  # Allow 10 units in color space
  animation_drift:
    tolerance: 50  # Allow 50ms variance
  duplication:
    similarity: 0.8  # 80% similar = duplicate
```

## Success Criteria

- [ ] Paper cuts are tracked
- [ ] 3:1 rule is enforced
- [ ] Debt stays below threshold
- [ ] Scans run regularly
- [ ] Fixed paper cuts are logged

## Error Handling

| Situation | Response |
|-----------|----------|
| No paper-cuts.yaml | Create empty file |
| Invalid paper cut ID | List valid IDs |
| Scan fails on file | Skip with warning |
| Threshold exceeded | Block features |

## Next Step

After `/garden`: Run `/approve` for Taste Owner sign-off.
