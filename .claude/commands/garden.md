---
name: garden
version: "2.0.0"
description: Health report on Layouts, Lenses, and deprecated patterns
agent: gardening-entropy
agent_path: .claude/skills/gardening-entropy/SKILL.md
preflight:
  - sigil_mark_exists
---

# /garden

Health report on Layouts, Lenses, and deprecated patterns. Detects drift and recommends maintenance actions.

## Usage

```
/garden                 # Show full health report
/garden --layout [name] # Report for specific Layout
/garden --deprecated    # Focus on v1.2.5 patterns
/garden --drift         # Focus on pattern drift
```

## What Gets Reported

### 1. Layout Coverage

Shows which Layouts are used and component coverage.

### 2. Lens Distribution

Shows lens usage across the codebase.

### 3. Deprecated Patterns

Lists v1.2.5 patterns that should be migrated.

### 4. Pattern Drift

Components that have drifted from v2.0 patterns.

### 5. Recommendations

Prioritized actions based on findings.

## Output Format

```
/garden

SIGIL v2.0 HEALTH REPORT
═══════════════════════════════════════════════════════════

LAYOUT COVERAGE
┌─────────────────────────────────────────────────────────┐
│ Layout          │ Components │ Coverage                 │
├─────────────────────────────────────────────────────────┤
│ CriticalZone    │ 8          │ ██████████████████░░ 90% │
│ MachineryLayout │ 12         │ ████████████████████ 100%│
│ GlassLayout     │ 6          │ ████████████████████ 100%│
│ No Layout       │ 4          │ ░░░░░░░░░░░░░░░░░░░░ 0%  │
└─────────────────────────────────────────────────────────┘

LENS DISTRIBUTION
┌─────────────────────────────────────────────────────────┐
│ Lens        │ Usage │ Context                          │
├─────────────────────────────────────────────────────────┤
│ StrictLens  │ 8     │ CriticalZone (forced)            │
│ DefaultLens │ 14    │ MachineryLayout, GlassLayout     │
│ A11yLens    │ 0     │ Not enabled                      │
└─────────────────────────────────────────────────────────┘

DEPRECATED PATTERNS (v1.2.5)
┌─────────────────────────────────────────────────────────┐
│ Pattern          │ Files │ Migration                    │
├─────────────────────────────────────────────────────────┤
│ SigilZone        │ 3     │ → CriticalZone/Machinery/Glass│
│ useServerTick    │ 2     │ → useCriticalAction          │
│ useSigilPhysics  │ 1     │ → useLens()                  │
│ @sigil/recipes/* │ 4     │ → Lens components            │
└─────────────────────────────────────────────────────────┘

PATTERN DRIFT
┌─────────────────────────────────────────────────────────┐
│ File                           │ Issue                  │
├─────────────────────────────────────────────────────────┤
│ src/checkout/QuickBuy.tsx      │ Raw button in Layout   │
│ src/features/DeleteBtn.tsx     │ Missing Layout context │
│ src/admin/BulkAction.tsx       │ Wrong time authority   │
└─────────────────────────────────────────────────────────┘

RECOMMENDATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. MIGRATE DEPRECATED PATTERNS (Priority: HIGH)
   Files: 10 files using v1.2.5 patterns
   Action: See sigil-mark/MIGRATION.md
   Command: /validate --deprecated

2. ADD LAYOUT CONTEXT (Priority: MEDIUM)
   Files: 4 components without Layout
   - src/features/QuickAction.tsx
   - src/features/ConfirmBtn.tsx
   Action: /craft [file] to get Layout recommendation

3. FIX DRIFT (Priority: LOW)
   Files: 3 components with pattern drift
   Action: /validate [file] to see specific issues

═══════════════════════════════════════════════════════════
Last Updated: 2026-01-06
```

## Layout-Specific Report

```
/garden --layout CriticalZone

CRITICALZONE HEALTH
────────────────────────────────────────────────────

Components: 8
Lens: StrictLens (forced for financial=true)
Time Authority: server-tick (enforced)

Files:
┌─────────────────────────────────────────────────────────┐
│ File                    │ Financial │ Lens      │ Status│
├─────────────────────────────────────────────────────────┤
│ PaymentForm.tsx         │ true      │ Strict    │ ✓     │
│ ConfirmDialog.tsx       │ true      │ Strict    │ ✓     │
│ DeleteAccount.tsx       │ true      │ Strict    │ ✓     │
│ QuickBuy.tsx            │ true      │ RAW BTN   │ ✗     │
└─────────────────────────────────────────────────────────┘

Issues:
  - QuickBuy.tsx: Uses raw <button> instead of Lens.CriticalButton
```

## Deprecated Patterns Detail

```
/garden --deprecated

DEPRECATED v1.2.5 PATTERNS
────────────────────────────────────────────────────

SigilZone (3 files):
  - src/legacy/OldCheckout.tsx:12
  - src/legacy/OldAdmin.tsx:8
  - src/legacy/OldMarketing.tsx:15
  Migration: Replace with CriticalZone, MachineryLayout, or GlassLayout

useServerTick (2 files):
  - src/legacy/PaymentBtn.tsx:23
  - src/legacy/ConfirmBtn.tsx:18
  Migration: Use useCriticalAction({ timeAuthority: 'server-tick' })

useSigilPhysics (1 file):
  - src/legacy/AnimatedCard.tsx:9
  Migration: Use useLens()

@sigil/recipes/* imports (4 files):
  - src/features/Button.tsx:3
  - src/features/Card.tsx:2
  - src/features/Table.tsx:4
  - src/features/Form.tsx:1
  Migration: Use Layout + Lens components

Total: 10 files need migration
Guide: sigil-mark/MIGRATION.md
```

## Drift Detection

Pattern drift occurs when:
- Raw HTML elements used inside Layouts
- Wrong time authority for action type
- Missing Layout context for action components
- Lens bypass (not using useLens())

## Migration Priority

| Pattern | Priority | Reason |
|---------|----------|--------|
| SigilZone | HIGH | Core architecture change |
| useServerTick | HIGH | Time authority pattern |
| useSigilPhysics | MEDIUM | Lens resolution |
| @sigil/recipes/* | LOW | Still functional |

## Next Steps

Based on recommendations:
- `/validate` for detailed violation report
- `/craft [file]` for guidance on specific files
- See `sigil-mark/MIGRATION.md` for full migration guide
