# /taste-synthesize Command

Extract patterns from accumulated taste signals and propose rule changes.

---

## Usage

```
/taste-synthesize [options]
```

### Options

| Option | Description | Default |
|--------|-------------|---------|
| `--days N` | Analyze signals from last N days | 30 |
| `--min-confidence` | Minimum confidence level (LOW/MEDIUM/HIGH) | LOW |
| `--effect TYPE` | Filter to specific effect type | all |
| `--auto-inscribe` | Auto-inscribe HIGH confidence patterns | false |
| `--report` | Generate report file only (no prompts) | false |

---

## What It Does

1. **Loads** all taste signals from `grimoires/sigil/taste.md`
2. **Filters** to MODIFY/REJECT signals (ACCEPT has no learning value)
3. **Groups** signals by effect, change, user type, and expected feel
4. **Detects** patterns where 3+ signals show same preference
5. **Cross-references** with `grimoires/sigil/observations/` for evidence
6. **Elevates** confidence for patterns backed by observation evidence
7. **Generates** recommendations for rule changes
8. **Presents** synthesis report with actionable items
9. **Integrates** with `/inscribe` for permanent rule changes

---

## Pattern Types

| Type | Detection | Example |
|------|-----------|---------|
| **Timing** | 3+ same timing change | "800ms → 500ms for Financial" |
| **User Segment** | 3+ same user_type + change | "Mobile users prefer 500ms" |
| **Effect Mismatch** | Expected feel ≠ physics tier | "Users expect snappy, got trustworthy" |
| **Animation** | 3+ same easing change | "ease-out → spring(400, 25)" |
| **Frequency** | Goal contains "quickly"/"checking" | "May be misclassified mutation" |

---

## Confidence Levels

### Base Confidence (from signal count)

| Count | Level | Action |
|-------|-------|--------|
| 3-4 signals | LOW | Surface only |
| 5-7 signals | MEDIUM | Suggest review |
| 8+ signals | HIGH | Recommend inscribe |

### Confidence Elevation (with observation evidence)

When a pattern is backed by validated observation evidence, confidence is elevated:

| Base Level | With Observation | Final Level | Action |
|------------|------------------|-------------|--------|
| LOW | +1 observation | MEDIUM | Suggest review |
| MEDIUM | +1 observation | HIGH | Recommend inscribe |
| HIGH | +1 observation | **VERY_HIGH** | Strong inscribe recommendation |

**VERY_HIGH** is a new confidence tier for patterns backed by both:
- Developer taste signals (3+ MODIFY/REJECT)
- User behavior observations (validated diagnostics)

This dual-evidence pattern represents the highest confidence level for rule changes.

### Observation Matching

For each detected pattern, search `grimoires/sigil/observations/`:

1. **Check user-insights.md** for validated findings matching:
   - Component name in pattern
   - Effect type in pattern
   - User type in pattern

2. **Check *.diagnostic.md** for open diagnostics matching:
   - `related_components` field
   - `gap_type` classification (if validated)

Match criteria:
```
pattern.component ∈ observation.related_components
  OR pattern.effect_type == observation.gap_context
  OR pattern.user_type == observation.user.type
```

If match found, elevate confidence and include observation evidence in report.

---

## Examples

### Basic synthesis
```
/taste-synthesize
```

### Last 7 days only
```
/taste-synthesize --days 7
```

### Only HIGH confidence patterns
```
/taste-synthesize --min-confidence HIGH
```

### Filter to Financial effect
```
/taste-synthesize --effect Financial
```

### Auto-inscribe approved patterns
```
/taste-synthesize --auto-inscribe
```

### Generate report file
```
/taste-synthesize --report
```
Output: `grimoires/sigil/synthesis-report.md`

---

## Synthesis Report Format

### Standard Pattern (without observation evidence)

```markdown
## Pattern: Financial buttons timing (800ms → 500ms)

| Metric | Value |
|--------|-------|
| Signals | 5 MODIFY |
| Confidence | MEDIUM |
| User Types | mobile (3), power-user (2) |
| Observation Evidence | No |

### Recommendation

Consider reducing Financial button timing from 800ms to 500ms for mobile and power-user personas.
```

### Observation-Backed Pattern (elevated confidence)

```markdown
## Pattern: Financial buttons timing (800ms → 500ms)

| Metric | Value |
|--------|-------|
| Signals | 5 MODIFY |
| Confidence | MEDIUM → HIGH (observation-backed) |
| User Types | mobile (3), power-user (2) |
| Observation Evidence | Yes |

### Supporting Observations

- **papa_flavio** (decision-maker): "planning burns, need quick data checks" → discoverability
- **alice** (trust-checker): "checking rewards often" → high frequency usage

### Recommendation

**Strong recommendation:** Inscribe 500ms as default for Financial effects when user_type is mobile or power-user.

Evidence from both developer modifications AND user behavior observations supports this change.
```

### VERY_HIGH Confidence Pattern

```markdown
## Pattern: Trust-checker rewards visibility

| Metric | Value |
|--------|-------|
| Signals | 8 MODIFY |
| Confidence | HIGH → **VERY_HIGH** (observation-backed) |
| User Types | trust-checker (5), casual (3) |
| Observation Evidence | Yes (validated) |

### Supporting Observations

- **alice** (trust-checker): Validated discoverability gap for rewards display
  - Gap: Users cannot verify rewards are accumulating
  - Action: Show delta/trend indicator

### Recommendation

**Inscribe immediately.** This pattern has the highest confidence level:
- 8+ developer modifications confirm the preference
- Validated user observation confirms the behavior need

Add to `inscribed-patterns.yaml`:
```yaml
rewards-visibility-trust-checker:
  component: RewardsDisplay
  user_type: trust-checker
  physics:
    show_delta: true
    trend_indicator: true
    animation: subtle-pulse
```
```

---

## Related Files

| File | Purpose |
|------|---------|
| `grimoires/sigil/taste.md` | Source signals (developer preferences) |
| `grimoires/sigil/observations/` | User behavior observations |
| `grimoires/sigil/observations/user-insights.md` | Validated observation findings |
| `grimoires/sigil/observations/*.diagnostic.md` | Individual user diagnostics |
| `grimoires/sigil/inscribed-patterns.yaml` | Patterns already inscribed |
| `grimoires/sigil/dismissed-patterns.yaml` | Patterns explicitly dismissed |
| `grimoires/sigil/synthesis-report.md` | Generated report (with --report) |

---

## Workflow

### Step 1: Load Signals
```
Read grimoires/sigil/taste.md
Filter to MODIFY/REJECT signals from last N days
```

### Step 2: Detect Patterns
```
Group signals by: effect + change + user_type + expected_feel
Identify patterns with 3+ signals
Calculate base confidence level
```

### Step 3: Cross-Reference Observations
```
For each pattern:
  1. Scan grimoires/sigil/observations/user-insights.md
  2. Scan grimoires/sigil/observations/*.diagnostic.md
  3. Match by component, effect type, or user type
  4. If match found:
     - Elevate confidence level
     - Extract observation evidence
     - Note gap classification if validated
```

### Step 4: Generate Report
```
For each pattern:
  - Show signal count and confidence
  - Show confidence elevation if observation-backed
  - Include "Supporting Observations" section if evidence exists
  - Generate recommendation based on final confidence
```

### Step 5: Present Actions
```
- LOW: "Surface only" - show for awareness
- MEDIUM: "Suggest review" - discuss with team
- HIGH: "Recommend inscribe" - safe to add to rules
- VERY_HIGH: "Inscribe immediately" - dual-evidence pattern
```

---

## When to Run

- **Weekly**: Regular health check of feedback patterns
- **Pre-release**: Consolidate learnings before shipping
- **After friction reports**: When users report consistent issues
- **Threshold**: When 10+ MODIFY/REJECT signals accumulated
- **After /observe**: When new observation validates existing taste pattern

---

## Related Commands

- `/craft` - Generation (reads applied patterns)
- `/inscribe` - Apply patterns permanently
- `/ward` - Validation (checks pattern compliance)
