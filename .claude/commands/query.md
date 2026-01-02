---
name: query
description: Semantic search across captured component taste
agent: sigil-querying
agent_path: .claude/skills/sigil-querying/SKILL.md
---

# /sigil query

Search across captured component taste using semantic or pattern matching.

## Usage

```
/sigil query "heavy loading components"
/sigil query "@feel heavy"
/sigil query "@tier gold"
/sigil query "@intent [J] Reduce My Anxiety"
```

## Query Types

### Natural Language

Free-form queries that search across all taste annotations:

```
/sigil query "heavy loading"
/sigil query "feels like RuneScape"
/sigil query "anxiety reducing"
```

Uses CK semantic search when available, grep fallback otherwise.

### Tag-Specific

Direct tag queries for precise filtering:

| Pattern | Description |
|---------|-------------|
| `@feel heavy` | Search by feel |
| `@rejected spinner` | Search by rejection |
| `@inspiration Figma` | Search by inspiration |
| `@intent [J] Reduce My Anxiety` | Search by JTBD intent |
| `@tier gold` | Search by tier level |
| `@owner @eileen` | Search by owner |

### Tier Queries

```
/sigil query "@tier gold"      # Production-proven components
/sigil query "@tier silver"    # Captured but not graduated
```

## Output Format

Results display as component cards:

```
┌─────────────────────────────────────────────────┐
│ ClaimButton (Gold)                              │
├─────────────────────────────────────────────────┤
│ @feel: Heavy, deliberate                        │
│ @rejected: spinner, skeleton                    │
│ @inspiration: RuneScape skill progress          │
│ @intent: [J] Reduce My Anxiety                  │
│ File: src/components/ClaimButton.tsx            │
└─────────────────────────────────────────────────┘
```

## Search Engine

1. **CK (preferred)**: Semantic vector search
   - Install: `cargo install ck-search`
   - Indexes component JSDoc for similarity matching

2. **Grep (fallback)**: Pattern matching
   - No installation required
   - Keyword-based search across annotations

## Options

| Option | Description |
|--------|-------------|
| `--limit N` | Limit results (default: 10) |
| `--path dir` | Search specific directory |

## Examples

```bash
# Find heavy-feeling components
/sigil query "heavy"

# Find components rejecting skeletons
/sigil query "@rejected skeleton"

# Find Gold-tier components
/sigil query "@tier gold"

# Find by JTBD
/sigil query "@intent [J] Reduce My Anxiety"

# Search specific directory
/sigil query "playful" --path src/components/buttons
```

## Error Handling

| Condition | Message |
|-----------|---------|
| No matches | Suggestions for broader search |
| Too many matches | Shows top 5, suggests refinement |
| CK not installed | Falls back to grep automatically |
| Invalid path | Error with path suggestion |

## Integration

Query results can be piped to other commands:

```bash
# Find Silver components ready for graduation
/sigil query "@tier silver" | /sigil taste graduate --batch
```
