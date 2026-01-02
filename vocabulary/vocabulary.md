# Sigil Vocabulary

> Owner: Eileen
> Last Updated: 2026-01-01
> To propose new labels, contact Eileen

## Purpose

This vocabulary defines the valid JTBD (Jobs-to-be-Done) labels for component `@intent` tags. **These are the ONLY valid values for @intent.** Do not invent new labels without Eileen's approval.

---

## Functional JTBD

| Label | Description | Example Use |
|-------|-------------|-------------|
| `[J] Make Transaction` | User wants to complete an action | Claim button, swap, send |
| `[J] Find Information` | User wants to locate data | Search, filter, browse |
| `[J] Organize Assets` | User wants to arrange items | Portfolio, collections, lists |

---

## Personal/Emotional JTBD

| Label | Description | Example Use |
|-------|-------------|-------------|
| `[J] Reassure Me This Is Safe` | User needs security confidence | Wallet connect, sign, confirm |
| `[J] Help Me Feel Smart` | User wants to feel capable | Onboarding, tooltips, education |
| `[J] Give Me Peace of Mind` | User wants anxiety reduction | Confirmations, receipts |
| `[J] Reduce My Anxiety` | User is stressed about outcome | Loading states, progress |

---

## Social/Emotional JTBD

| Label | Description | Example Use |
|-------|-------------|-------------|
| `[J] Help Me Look Smart, Cool` | User wants social approval | Sharing, badges, achievements |
| `[J] Help Me Feel Like An Insider` | User wants belonging | Gated content, exclusive access |
| `[J] Let Me Express My Identity` | User wants personalization | Profiles, avatars, customization |

---

## Adding New Labels

New labels require:

1. **Clear user research justification** - Evidence that existing labels don't cover the need
2. **Example component that needs it** - A real component that can't be captured with existing labels
3. **Eileen's approval** - Single owner prevents label drift
4. **PR to sigil/vocabulary/vocabulary.md** - Formal change process

### Proposal Template

```markdown
## Proposed Label: [J] [New Label]

**Description**: What job is the user trying to accomplish?

**Justification**: Why can't existing labels cover this?

**Example Component**: Which component needs this label?

**Proposed by**: [Name]
**Date**: [Date]
```

---

## Common Mistakes

| Wrong (INVALID) | Right | Why |
|-----------------|-------|-----|
| `@intent [J] Make It Fun` | `@feel Playful, fun` | "Fun" is a feeling, not a job |
| `@intent [J] Surprise Me` | `@feel Surprising, delightful` | "Surprise" is a feeling, not a job |
| `@intent [J] Give Direction` | `@intent [J] Find Information` + `@feel Guiding` | Direction is about finding info |
| `@intent [J] Feel Accomplished` | `@intent [J] Help Me Feel Smart` | Accomplishment maps to feeling smart |

**Remember**: "Fun", "Surprise", "Delight" are `@feel` qualities, not JTBD labels.

---

## Quick Reference

**Functional** (what user wants to do):
- Make Transaction
- Find Information
- Organize Assets

**Personal** (how user wants to feel about themselves):
- Reassure Me This Is Safe
- Help Me Feel Smart
- Give Me Peace of Mind
- Reduce My Anxiety

**Social** (how user wants others to perceive them):
- Help Me Look Smart, Cool
- Help Me Feel Like An Insider
- Let Me Express My Identity
