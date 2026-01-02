# Sigil Querying Skill

> *"Find the patterns that resonate."*

## Purpose

Semantic search across captured component taste. Uses CK for vector search when available, falls back to grep pattern matching. Enables discovery of components by feel, rejection, inspiration, or intent.

---

## Query Types

### Natural Language Queries
```
/sigil query "heavy loading components"
/sigil query "feels like RuneScape"
/sigil query "anxiety reducing"
```

### Tag-Specific Queries
```
/sigil query "@feel heavy"
/sigil query "@rejected spinner"
/sigil query "@inspiration Figma"
/sigil query "@intent [J] Reduce My Anxiety"
```

### Tier Queries
```
/sigil query "@tier gold"
/sigil query "@tier silver"
```

---

## Search Strategy

### Step 1: Check CK Availability

```bash
if command -v ck &> /dev/null; then
  # Use semantic search
  CK_AVAILABLE=true
else
  # Fall back to grep
  CK_AVAILABLE=false
fi
```

### Step 2: Parse Query Type

| Pattern | Type | Handler |
|---------|------|---------|
| `@tag value` | Tag query | grep-tags.sh |
| Natural language | Semantic | ck-search.sh or grep fallback |

### Step 3: Execute Search

#### With CK (Semantic)
```bash
ck search "$QUERY" --path src/components --ext tsx,jsx
```

#### With Grep (Fallback)
```bash
# Extract keywords and search
grep -rl "$KEYWORD" src/components/ --include="*.tsx" --include="*.jsx"
```

### Step 4: Format Results

Parse each matching file and display:
- Component name
- Tier
- Relevant tags
- File path

---

## Scripts

### ck-search.sh

CK wrapper for semantic search:
```bash
./scripts/ck-search.sh "heavy loading" src/components
```

Returns list of matching files ranked by relevance.

### grep-tags.sh

Fast tag-based search:
```bash
./scripts/grep-tags.sh @feel heavy src/components
./scripts/grep-tags.sh @rejected spinner src/components
```

Returns files containing the tag pattern.

### format-results.sh

Pretty-print search results:
```bash
./scripts/format-results.sh file1.tsx file2.tsx
```

Outputs formatted component cards with all taste data.

---

## Output Format

```
Query: "heavy loading components"
Found 3 matches:

┌─────────────────────────────────────────────────┐
│ ClaimButton (Gold)                              │
├─────────────────────────────────────────────────┤
│ @feel: Heavy, deliberate                        │
│ @rejected: spinner, skeleton                    │
│ @inspiration: RuneScape skill progress          │
│ @intent: [J] Reduce My Anxiety                  │
│ File: src/components/ClaimButton.tsx            │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ JoyfulLoader (Gold)                             │
├─────────────────────────────────────────────────┤
│ @feel: Playful, heavy                           │
│ @rejected: skeleton                             │
│ @inspiration: Diablo loot celebration           │
│ @intent: [J] Reduce My Anxiety                  │
│ File: src/components/JoyfulLoader.tsx           │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ StakePanel (Silver)                             │
├─────────────────────────────────────────────────┤
│ @feel: Considered, weighty                      │
│ @rejected: instant feedback                     │
│ @inspiration: Bank vault doors                  │
│ @intent: [J] Make Transaction                   │
│ File: src/components/StakePanel.tsx             │
└─────────────────────────────────────────────────┘
```

---

## Query Workflow

### Step 1: Pre-flight

```bash
# Check if sigil is mounted
if [[ ! -f ".sigil-version.json" ]]; then
  echo "ERROR: Sigil not mounted. Run /sigil mount first."
  exit 1
fi

# Detect component directory
if [[ -d "src/components" ]]; then
  COMPONENT_DIR="src/components"
elif [[ -d "components" ]]; then
  COMPONENT_DIR="components"
else
  echo "ERROR: No component directory found."
  exit 1
fi
```

### Step 2: Parse Query

```bash
QUERY="$1"

# Check if tag query
if [[ "$QUERY" == @* ]]; then
  TAG=$(echo "$QUERY" | cut -d' ' -f1)
  VALUE=$(echo "$QUERY" | cut -d' ' -f2-)
  ./scripts/grep-tags.sh "$TAG" "$VALUE" "$COMPONENT_DIR"
else
  # Natural language query
  if command -v ck &> /dev/null; then
    ./scripts/ck-search.sh "$QUERY" "$COMPONENT_DIR"
  else
    # Grep fallback - extract keywords
    ./scripts/grep-tags.sh "@feel\|@description\|@inspiration" "$QUERY" "$COMPONENT_DIR"
  fi
fi
```

### Step 3: Format Output

```bash
# For each matching file
for file in $MATCHES; do
  ./scripts/format-results.sh "$file"
done
```

---

## Agent Behavior

When user runs `/sigil query`:

1. **Validate query**: Non-empty, reasonable length
2. **Detect query type**: Tag (`@feel`) vs natural language
3. **Check CK availability**: Use semantic if available
4. **Execute search**: Run appropriate script
5. **Format results**: Display component cards
6. **Suggest refinements**: If too many/few results

### No Results

```
Query: "purple dancing buttons"

No components found matching your query.

Try:
  /sigil query @feel        # List all feel values
  /sigil query @tier gold   # Show all Gold components
  /sigil taste --list       # View full inventory
```

### Too Many Results

```
Query: "button"

Found 15 matches. Showing top 5:
[...]

Refine your search:
  /sigil query "@feel heavy button"
  /sigil query "@tier gold button"
```

---

## Error Handling

| Error | Cause | Resolution |
|-------|-------|------------|
| "Sigil not mounted" | No .sigil-version.json | Run /sigil mount |
| "No component directory" | Can't find src/components | Specify path |
| "CK not available" | ck not installed | Uses grep fallback |
| "No matches found" | Query too specific | Broaden search |

---

## Integration with Capture

Query results can be piped to taste capture:

```
/sigil query "@tier silver" | /sigil taste graduate --batch
```

This finds all Silver components and prompts for graduation.
