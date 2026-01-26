# Rune

Design physics for AI-generated UI.

> "Effect is truth. What the code does determines its physics."

## Install

```bash
curl -fsSL https://raw.githubusercontent.com/0xHoneyJar/rune/main/.claude/scripts/mount-rune.sh | bash
```

Or with options:
```bash
# Auto-confirm updates
curl ... | bash -s -- -y

# Minimal install (rules only, no skills/hooks)
curl ... | bash -s -- --minimal
```

## Physics Table

| Effect | Sync | Timing | Confirmation |
|--------|------|--------|--------------|
| Financial | Pessimistic | 800ms | Required |
| Destructive | Pessimistic | 600ms | Required |
| Soft Delete | Optimistic | 200ms | Toast + Undo |
| Standard | Optimistic | 200ms | None |
| Navigation | Immediate | 150ms | None |
| Local State | Immediate | 100ms | None |

## Four Constructs

| Construct | Command | Purpose |
|-----------|---------|---------|
| ᛊ **Sigil** | `/sigil` | Taste (WHY) — Capture human preferences |
| ᚷ **Glyph** | `/glyph` | Craft (HOW) — Generate with correct physics |
| ᚱ **Rigor** | `/rigor` | Correctness (WHAT) — Validate web3 safety |
| ᚹ **Wyrd** | `/wyrd` | Fate (VALIDATION) — Confidence calibration |

## Usage

### Generate a Component

```
/glyph "claim rewards button"
```

Output:
```
## Hypothesis

**Effect**: Financial (detected: "claim" keyword)
**Physics**: Pessimistic sync, 800ms timing, confirmation required
**Confidence**: 0.90

[y/n/adjust]
```

On accept, generates complete React component with correct physics.

### Record a Preference

```
/sigil "500ms feels more responsive for power users"
```

Future generations apply this preference.

### Validate Web3 Code

```
/rigor src/components/VaultWithdraw.tsx
```

Checks for BigInt safety, data source correctness, receipt guards.

### Check Confidence State

```
/wyrd
```

Shows confidence calibration and learning metrics.

## What Gets Installed

```
.claude/
├── rules/
│   ├── glyph/    (21 files) — Craft rules
│   ├── sigil/    (4 files)  — Taste rules
│   ├── rigor/    (3 files)  — Correctness rules
│   └── wyrd/     (11 files) — Learning rules
├── skills/
│   ├── crafting/           — /glyph
│   ├── observing/          — /sigil
│   ├── enforcing/          — /rigor
│   ├── fating/             — /wyrd
│   └── validating/         — /validate
└── hooks/                  — Workflow integration

grimoires/rune/
├── taste.md    — Accumulated preferences
└── wyrd.md     — Learning state
```

## Protected Capabilities

Non-negotiable rules that Rune enforces:

| Capability | Rule |
|------------|------|
| Withdraw | Always reachable |
| Cancel | Always visible |
| Balance | Always accurate |
| Touch target | ≥ 44px |
| Focus ring | Always visible |

## Learning Loop

```
Generate → Hypothesis → User Feedback → Learn → Improve

           ↓                    ↓
       Accept/Reject      Record as taste
           ↓                    ↓
     Self-validate        Update confidence
           ↓                    ↓
     Write file          Detect patterns
```

## Effect Detection

Rune detects effect from keywords and types:

| Keywords | Effect |
|----------|--------|
| claim, deposit, withdraw, stake, swap | Financial |
| delete, remove, destroy, revoke | Destructive |
| archive, hide, trash (with undo) | Soft Delete |
| save, update, edit, create | Standard |
| toggle, switch, expand, theme | Local State |

Types override keywords: `Currency`, `Wei`, `Token`, `BigInt` → always Financial.

## Philosophy

**Effect is truth.** What the code does determines its physics. "Claim" means financial. "Delete" means destructive.

**Physics over preferences.** "Make it feel trustworthy" is not physics. "800ms pessimistic with confirmation" is physics.

**Correctness over feel.** A beautiful button that sends the wrong amount is worse than an ugly one that's accurate.

**Learn from rejection.** Every "no" teaches the system. Three similar rejections become a pattern.

## Links

- [GitHub](https://github.com/0xHoneyJar/rune)
- [Issues](https://github.com/0xHoneyJar/rune/issues)

---

*Co-Authored-By: Claude <noreply@anthropic.com>*
