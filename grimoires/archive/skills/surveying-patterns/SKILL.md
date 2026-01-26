# Surveying Patterns Skill

Health report on pattern authority and component usage.

---

## Core Principle

```
Usage → Authority → Templates
```

Authority is computed from the codebase, not configured. Components earn Gold by being used and surviving.

---

## Authority Tiers

| Tier | Min Imports | Min Stability | Behavior |
|------|-------------|---------------|----------|
| **Gold** | 10+ | 14+ days | Use as templates in /craft |
| **Silver** | 5+ | 7+ days | Prefer if no Gold exists |
| **Draft** | <5 | any | Don't learn from these |

---

## How Authority Works

- **Imports** = how many files use this component
- **Stability** = days since last modification
- **Gold** = proven patterns (use as templates)
- **Orphan** = 0 imports (consider removing)

---

## Workflow

### Step 1: Scan Components

```bash
# Find all components
Glob: src/components/**/*.tsx

# Count imports for each
grep -r "import.*ComponentName" src/
```

### Step 2: Check Stability

For each component, check days since last git commit:
```bash
git log -1 --format="%ci" -- path/to/component.tsx
```

### Step 3: Compute Tiers

Apply thresholds:
- Gold: 10+ imports AND 14+ days
- Silver: 5+ imports
- Draft: everything else

### Step 4: Generate Report

```
┌─ Sigil Garden Report ──────────────────────────────────┐
│                                                        │
│  Authority Distribution                                │
│  ───────────────────────                               │
│  Gold:   8 components  (17%)  ████░░░░░░               │
│  Silver: 12 components (26%)  ██████░░░░               │
│  Draft:  27 components (57%)  ██████████               │
│                                                        │
│  ┌─ Gold Tier (Canonical) ──────────────────────────┐  │
│  │  Component      Imports   Stable                 │  │
│  │  Button         34        62 days                │  │
│  │  Card           28        45 days                │  │
│  │  Input          22        38 days                │  │
│  │  ClaimButton    15        21 days                │  │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
│  ┌─ Approaching Gold ───────────────────────────────┐  │
│  │  DataTable: 9 imports, 12 days (needs 1 more     │  │
│  │             import and 2 more days)              │  │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
│  ┌─ Orphans (Consider Removing) ────────────────────┐  │
│  │  LegacyModal: 0 imports                          │  │
│  │  OldTooltip: 0 imports                           │  │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

## Integration with /craft

When generating new components:
1. Check for Gold tier components with similar patterns
2. Use Gold components as templates
3. Match their physics and conventions

---

## What Sigil Never Asks

- "Should I promote this?" → Promotion is earned
- "Is this canonical?" → Import count decides
- "Do you want to change the tier?" → Authority is computed

---

## Recommendations

**Orphans (0 imports)**:
Consider removing or consolidating.

**Approaching Gold**:
High-value components worth stabilizing.

**Draft with high usage**:
May need refactoring before promotion.
