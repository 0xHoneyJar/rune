# Sigil Context

> Project-specific context that informs design physics decisions.

Drop your personas, brand guidelines, and domain expertise here. When you run `/craft`, Sigil reads this context and adjusts physics accordingly.

## Directory Structure

```
context/
├── README.md               # You are here (tracked)
├── personas/               # User research, profiles
├── brand/                  # Voice, tone, visual guidelines
└── domain/                 # Best practices, domain expertise
```

## What Goes Where

### personas/
Who are your users? What do they care about?

```markdown
---
type: persona
name: DeFi Power User
priority: primary        # primary, secondary, or edge-case
---

# DeFi Power User

## Demographics
- 25-40 years old
- Manages $50k+ in DeFi positions
- Uses multiple protocols daily

## Behavior
- Expects instant feedback
- Comfortable with transaction risks
- Values efficiency over hand-holding

## Physics Implications
- Can reduce confirmation timing (600ms vs 800ms)
- Skip explanatory copy in confirmations
- Prioritize speed in optimistic operations
```

### brand/
How should your product feel? What's your voice?

```markdown
---
type: brand
---

# Brand Voice

## Tone
- Confident, not arrogant
- Technical, but accessible
- Direct, minimal fluff

## Visual
- Dark mode primary
- Green for success states
- Red for warnings only

## Physics Implications
- Faster animations (confident tone)
- Avoid bouncy springs (too playful)
- Deliberate, not snappy
```

### domain/
What expertise should inform the physics?

```markdown
---
type: domain
domain: defi
source: "DeFi UX Best Practices (2025)"
---

# DeFi UX Patterns

## Transaction Confirmations
- Always show gas estimate before signing
- Display amounts in both native and USD
- Explain slippage in human terms

## Physics Overrides
- All token approvals: Financial physics
- Bridge operations: +200ms to standard timing
```

## How It Works

When you run `/craft`, Sigil:

1. **Scans context/** for relevant files
2. **Extracts physics implications** from frontmatter and content
3. **Adjusts defaults** based on persona expertise, brand tone, domain rules
4. **Shows adjustments** in the analysis box

```
┌─ Craft Analysis ───────────────────────────────────────┐
│                                                        │
│  Target:       ClaimButton                             │
│  Effect:       Financial mutation                      │
│                                                        │
│  Context:      DeFi Power User (primary)               │
│                → Timing: 800ms → 600ms (power user)    │
│                → Copy: Minimal (high expertise)        │
│                                                        │
│  Behavioral    Pessimistic | 600ms | Confirmation      │
│  Animation     ease-out | deliberate                   │
│  Material      Elevated | Green accent                 │
│                                                        │
└────────────────────────────────────────────────────────┘
```

## Explicit References

You can explicitly reference context files:

```bash
# Auto-scan (default)
/craft "claim button"

# Explicit reference
/craft "claim button" @context/personas/power-user.md

# Multiple references
/craft "onboarding" @context/personas/first-time.md @context/brand/voice.md
```

## Important: Files Are Not Tracked

**All files in this directory (except README.md) are gitignored.**

This is intentional because:
- Context is project-specific
- May contain sensitive information (user research, competitive analysis)
- May include content from paid courses or proprietary sources
- Each project should define its own context

## Comparison: context/ vs moodboard/

| Folder | Purpose | Content | Tracked |
|--------|---------|---------|---------|
| `context/` | Project-specific input | Personas, brand, domain rules | No |
| `moodboard/` | Visual inspiration | Screenshots, articles, anti-patterns | Mostly yes |

Use `context/` for "who" and "how" — the people and rules.
Use `moodboard/` for "what" — visual references and patterns.

## Quick Start

1. Create a persona file for your primary user
2. Add any brand guidelines that affect feel
3. Drop domain expertise if you have specialized knowledge
4. Run `/craft` — context is applied automatically
