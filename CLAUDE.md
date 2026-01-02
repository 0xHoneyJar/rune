# CLAUDE.md

Guidance for Claude Code when working with Sigil-enabled repositories.

## What is Sigil?

Sigil is a craftsman-focused design system framework. It captures component taste through JSDoc tags, enabling agents to understand design decisions and stop suggesting rejected patterns.

## Agent Behavior Rules

### Rule 1: Check Rejections First (MANDATORY)

**Before suggesting ANY UI pattern:**

```bash
grep -r "@rejected.*[pattern]" src/components/
```

If rejection found:
1. DO NOT suggest the rejected pattern
2. Cite the rejection in your response
3. Offer alternatives that align with captured taste

**Example:**
```
User: "Add a loading spinner to checkout"

Agent: [runs grep -r "@rejected.*spinner" src/components/]
       [finds: ClaimButton.tsx: @rejected spinner, skeleton]

Response:
"Spinners are rejected in your codebase.

From ClaimButton (@tier gold):
  @rejected: spinner, skeleton
  @feel: Heavy, deliberate

Using JoyfulLoader instead (matches your 'heavy' feel)."
```

### Rule 2: Match @feel to Context

When building UI, find components with similar purpose and match their feel:

```bash
grep -r "@feel.*heavy" src/components/
grep -r "@description.*loading" src/components/
```

### Rule 3: Respect Tiers

| Tier | Usage |
|------|-------|
| Gold | Use by default. Proven patterns. |
| Silver | Use with caveat: "This is Silver, not yet proven." |
| None | Create new. Check @rejected first. |

### Rule 4: Cite Sources

Always explain taste-based decisions:

```
Using JoyfulLoader (Gold).

Problem: Users rage-clicked due to subtle loading feedback
Feel: Heavy, deliberate
Rejected: spinner, skeleton
Physics: spring(120, 14), 200ms delay

<JoyfulLoader isLoading={isPending} minDuration={800} />
```

## Vocabulary Validation

**@intent labels MUST exist in `vocabulary/vocabulary.md`. No hallucination.**

Valid labels:
- Functional: `[J] Make Transaction`, `[J] Find Information`, `[J] Organize Assets`
- Personal: `[J] Reassure Me This Is Safe`, `[J] Help Me Feel Smart`, `[J] Give Me Peace of Mind`, `[J] Reduce My Anxiety`
- Social: `[J] Help Me Look Smart, Cool`, `[J] Help Me Feel Like An Insider`, `[J] Let Me Express My Identity`

"Fun", "Surprise", "Delight" are `@feel` qualities, NOT JTBD labels.

## Commands

| Command | Purpose |
|---------|---------|
| `/sigil mount` | Install framework onto repo |
| `/sigil taste` | Capture component taste (4 questions) |
| `/sigil taste [name]` | Capture single component |
| `/sigil taste graduate [name]` | Promote Silver → Gold |
| `/sigil taste --list` | Show tier inventory |
| `/sigil query [query]` | Semantic search |
| `/sigil export` | Generate JSON/MDX |
| `/sigil showcase` | Launch preview |

## Discovery Commands

```bash
# Find by rejection (ALWAYS check before suggesting patterns)
grep -r "@rejected.*spinner" src/components/

# Find by feel
grep -r "@feel.*heavy" src/components/

# Find by intent
grep -r "@intent \[J\] Reduce My Anxiety" src/components/

# Find by inspiration
grep -r "@inspiration.*RuneScape" src/components/

# Find Gold components (preferred)
grep -r "@tier gold" src/components/

# Find Silver components
grep -r "@tier silver" src/components/

# Find critical path
grep -r "@critical_path true" src/components/
```

## JSDoc Tags

| Tag | Purpose | Required |
|-----|---------|----------|
| `@component` | Component name | Yes |
| `@description` | Problem solved | Yes |
| `@feel` | How it should feel | Yes |
| `@intent` | JTBD label (from vocabulary.md) | Yes |
| `@rejected` | Patterns to avoid | Yes |
| `@inspiration` | References | Recommended |
| `@tier` | silver or gold | Yes |
| `@physics` | Animation params | Gold interactive only |
| `@tasteOwner` | Who defends taste | Gold only |
| `@states` | State-specific feel | If distinct |
| `@critical_path` | Core user loop | If applicable |

## File Structure

```
product-repo/
├── .claude/
│   ├── skills/sigil-*/     ← Sigil skills (symlinks)
│   └── commands/sigil-*/   ← Sigil commands (symlinks)
├── src/components/         ← JSDoc is truth
├── sigil-showcase/
│   ├── moodboards/         ← Product/feature moodboards
│   ├── exports/            ← Generated JSON/MDX
│   └── showcase/           ← Next.js app
└── .sigil-version.json     ← Version tracking
```

## Relationship to Loa

Sigil and Loa are complementary:

| Loa | Sigil |
|-----|-------|
| Planning | Execution |
| Backend/Infra | Frontend/Design |
| PRD → SDD → Sprint | Capture → Query → Showcase |
| `loa-grimoire/` | `sigil-showcase/` |

Both can be installed on the same project. No integration needed - they manage separate concerns.

## Key Conventions

1. **JSDoc is truth** - No manifest, no index file. JSDoc in source files is authoritative.
2. **Grep for discovery** - Use grep to find patterns, not memory.
3. **Check rejections first** - Before suggesting ANY UI pattern.
4. **Respect tiers** - Gold > Silver > Uncaptured.
5. **Cite sources** - Always explain why you chose a pattern.
6. **Validate @intent** - Labels must exist in vocabulary.md.
