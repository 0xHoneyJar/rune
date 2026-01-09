# Auditing Cohesion

## Purpose

Visual consistency checks on demand.
Compare component properties against Sanctuary averages.

## Trigger

Manual - `/audit ComponentName` command.

## Philosophy

> "Variance is acceptable when intentional. Flag the unintentional."

The audit system detects unintended visual drift by comparing
properties against established patterns. Deviations aren't errors—
they require justification.

## Audit Flow

1. Identify target component
2. Extract visual properties
3. Calculate Sanctuary averages for same tier
4. Compare and compute variance
5. Flag variances exceeding thresholds
6. Report with justified exceptions

## Visual Properties Checked

| Property | Description | Threshold |
|----------|-------------|-----------|
| shadow | Box shadow values | 20% |
| border-radius | Corner rounding | 10% |
| spacing | Margin/padding | 15% |
| colors | Color values | 10% |
| typography | Font sizes/weights | 10% |
| opacity | Transparency | 5% |

## Variance Calculation

```typescript
variance = |actual - expected| / expected * 100
```

Where:
- `actual` = Component's property value
- `expected` = Sanctuary average for same tier

## Deviation Annotations

Support `@sigil-deviation` JSDoc tag for justified variance:

```typescript
/**
 * @sigil-tier gold
 * @sigil-zone critical
 * @sigil-deviation border-radius "Intentionally sharp for legal feel"
 */
export const TermsButton = () => { ... }
```

Annotated deviations:
- Skip flagging in report
- Listed separately as "Justified Deviations"
- Include reason from annotation

## Audit Report Format

```markdown
# Cohesion Audit: ClaimButton

## Summary
Tier: gold
Zone: critical
Audit Date: 2026-01-08

## Variance Report

| Property | Expected | Actual | Variance | Status |
|----------|----------|--------|----------|--------|
| border-radius | 8px | 12px | 50% | ⚠️ FLAG |
| shadow | rgba(0,0,0,0.1) | rgba(0,0,0,0.1) | 0% | ✓ PASS |
| spacing | 16px | 18px | 12.5% | ✓ PASS |

## Flagged Items
1. **border-radius**: Expected 8px, got 12px (50% variance)
   - Suggestion: Align with tier average or add @sigil-deviation

## Justified Deviations
(none)

## Recommendation
1 property exceeds variance threshold. Consider alignment or justification.
```

## Command Usage

```bash
/audit ClaimButton
/audit src/components/ClaimButton.tsx
```

## Threshold Configuration

In `sigil.yaml`:

```yaml
audit:
  thresholds:
    shadow: 20
    border_radius: 10
    spacing: 15
    colors: 10
    typography: 10
    opacity: 5
```

## Property Extraction

### From Component
- Parse JSX/TSX for style properties
- Extract inline styles
- Extract className references
- Parse Tailwind classes

### From Sanctuary
- Find all components of same tier
- Extract same properties
- Calculate average/median
- Store baseline

## Error Handling

| Error | Cause | Resolution |
|-------|-------|------------|
| "Component not found" | Invalid path/name | Check component exists |
| "No tier peers" | Only component in tier | Compare against lower tier |
| "Cannot parse styles" | Complex style pattern | Manual review suggested |

## Integration

### /craft Integration

After generating code, optionally run quick audit:
- Flag major variances during generation
- Suggest alignment before commit
- Non-blocking (warning only)

### CI Integration

Can run as pre-commit hook:
- Audit changed components
- Fail on >50% variance (configurable)
- Allow @sigil-deviation exceptions

## Performance

- Property extraction: <50ms per component
- Sanctuary average: <100ms (cached)
- Full audit: <200ms
