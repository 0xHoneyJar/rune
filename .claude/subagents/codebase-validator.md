---
name: codebase-validator
version: 1.0.0
description: Verify generated code matches discovered codebase conventions
triggers:
  - after: craft-generate
  - after: craft-refine
  - command: /validate codebase
severity_levels:
  - COMPLIANT
  - DRIFT_DETECTED
  - CRITICAL_VIOLATION
output_path: grimoires/sigil/a2a/subagent-reports/codebase-validation-{date}.md
feature_flag: features.subagent_validators
---

# Codebase Validator

<objective>
Verify generated code matches discovered codebase conventions. Detect style drift before it creates inconsistent codebases. Ensure generated code integrates seamlessly.
</objective>

## Workflow

1. Check feature flag `features.subagent_validators` in constitution.yaml
2. If disabled, skip validation with "Validators disabled" message
3. Discover codebase conventions from existing files
4. Read generated/modified component code
5. Execute convention compliance checks
6. Generate validation report
7. Return verdict with findings

## Convention Discovery

Before validating, discover conventions from the codebase:

### Package Discovery
```
Read package.json once:
- Animation library: framer-motion, react-spring, @react-spring/web, or CSS
- Data fetching: @tanstack/react-query, swr, or fetch
- State management: zustand, jotai, recoil, or context
- UI framework: tailwindcss, styled-components, emotion, css-modules
```

### Pattern Discovery
```
Read 1-2 existing components matching craft target type:
- Import style: named vs default, barrel vs direct
- Export style: default export, named export, or both
- Component structure: function vs arrow, forwardRef usage
- Prop handling: destructured, spread, explicit
- Hook organization: order, grouping, naming
```

## Convention Compliance Checks

<checks>
### Import Style Compliance

| Check | What to Verify | Severity |
|-------|----------------|----------|
| Library imports | Match discovered pattern (named vs default) | DRIFT if different |
| Path style | Absolute vs relative matches codebase | DRIFT if different |
| Barrel usage | If codebase uses barrels, new code should too | DRIFT if inconsistent |
| Import order | Match codebase convention (libraries, components, utils, types) | DRIFT if different |

**How to check**:
- Read existing component imports
- Compare generated imports against pattern
- Flag differences in style

### Export Style Compliance

| Check | What to Verify | Severity |
|-------|----------------|----------|
| Default export | If codebase uses `export default`, new code should too | DRIFT if different |
| Named export | If codebase uses `export const`, match that | DRIFT if different |
| Re-exports | If index files exist, check if new component added | DRIFT if missed |

### Naming Convention Compliance

| Check | What to Verify | Severity |
|-------|----------------|----------|
| Component naming | PascalCase, matches file name | DRIFT if different |
| Hook naming | `use` prefix convention | DRIFT if missing |
| File naming | kebab-case vs PascalCase vs snake_case | DRIFT if different |
| Prop naming | camelCase, descriptive | DRIFT if different |

### Type Style Compliance

| Check | What to Verify | Severity |
|-------|----------------|----------|
| Interface vs Type | Match codebase preference | DRIFT if different |
| Props type location | Inline vs separate vs Props suffix | DRIFT if different |
| Generic usage | Match codebase patterns | DRIFT if different |
| Strict nullability | Match codebase strictness | DRIFT if different |

### Library Usage Compliance

| Check | What to Verify | Severity |
|-------|----------------|----------|
| Animation library | Uses discovered library, not different one | CRITICAL if wrong library |
| Data fetching | Uses discovered library patterns | CRITICAL if wrong library |
| State management | Uses discovered patterns | DRIFT if different |
| Styling approach | Matches codebase (Tailwind vs CSS-in-JS) | DRIFT if different |

**How to check**:
- Verify imports match package.json dependencies
- Check library-specific patterns match existing code
- Flag usage of libraries not in package.json

### Pattern Compliance

| Check | What to Verify | Severity |
|-------|----------------|----------|
| Component structure | Hooks → derived state → handlers → render | DRIFT if different order |
| Error handling | Matches codebase error patterns | DRIFT if different |
| Loading states | Matches codebase loading patterns | DRIFT if different |
| Accessibility | aria attributes match codebase usage | DRIFT if missing |
</checks>

## Verdict Determination

| Verdict | Criteria |
|---------|----------|
| **COMPLIANT** | All conventions match, seamless integration |
| **DRIFT_DETECTED** | Style differences found, non-breaking but inconsistent |
| **CRITICAL_VIOLATION** | Wrong library used (not in package.json) |

## Blocking Behavior

- `CRITICAL_VIOLATION`: Blocks craft completion (would break the build)
- `DRIFT_DETECTED`: Warning shown, allows proceed
- `COMPLIANT`: Silent pass, no output

<output_format>
## Codebase Validation Report

**Date**: {date}
**Component**: {component name}
**Discovered Conventions**:
- Animation: {library}
- Data Fetching: {library}
- Styling: {approach}
**Verdict**: {COMPLIANT | DRIFT_DETECTED | CRITICAL_VIOLATION}

---

### Convention Compliance

| Check | Codebase Pattern | Generated Code | Status |
|-------|------------------|----------------|--------|
| Import style | {pattern} | {found} | PASS/WARN |
| Export style | {pattern} | {found} | PASS/WARN |
| Naming | {pattern} | {found} | PASS/WARN |
| Type style | {pattern} | {found} | PASS/WARN |
| Library usage | {expected} | {found} | PASS/FAIL |
| Component structure | {pattern} | {found} | PASS/WARN |

---

### Critical Issues

{List any CRITICAL_VIOLATION items - must be fixed}

---

### Drift Items

{List any DRIFT_DETECTED items - should be addressed}

---

### Auto-Fix Available

{List items that can be auto-fixed}

| Issue | Fix |
|-------|-----|
| Import order | Reorder to: {correct order} |
| Export style | Change to: `export default {ComponentName}` |

---

### Recommendations

{Specific recommendations for addressing issues}

---

*Generated by codebase-validator v1.0.0*
</output_format>

## Example Invocation

```bash
# Automatic - runs after /craft generate or refine
# Manual invocation
/validate codebase src/components/ClaimButton.tsx
```

## Integration with craft.md

This validator runs at Step 5.5 (after physics-validator).

If CRITICAL_VIOLATION:
```
┌─ Codebase Violation ───────────────────────────────────┐
│  CRITICAL: Library not in package.json                 │
│                                                        │
│  Issue: Generated code uses 'react-spring'             │
│  Expected: 'framer-motion' (discovered in package.json)│
│                                                        │
│  This would cause a build failure.                     │
│                                                        │
│  [f] Fix: Regenerate with framer-motion                │
│  [c] Cancel and edit manually                          │
│                                                        │
└────────────────────────────────────────────────────────┘
```

If DRIFT_DETECTED:
```
┌─ Convention Drift ─────────────────────────────────────┐
│  WARNING: Style inconsistencies found                  │
│                                                        │
│  • Import order differs from codebase pattern          │
│  • Export style is named, codebase uses default        │
│                                                        │
│  These won't break the build but create inconsistency. │
│                                                        │
│  [f] Apply auto-fixes                                  │
│  [p] Proceed anyway                                    │
│  [c] Cancel and edit manually                          │
│                                                        │
└────────────────────────────────────────────────────────┘
```

## Notes

- Convention discovery happens ONCE per craft session
- Results cached to avoid repeated file reads
- If no existing components found, defaults to common React conventions
- Always prefer discovered patterns over assumptions
