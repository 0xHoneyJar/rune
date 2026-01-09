# Scanning Sanctuary

## Purpose

Discover components in the Sanctuary using ripgrep-based pragmas search.
Find components by tier, zone, physics, or vocabulary term.

## Trigger

- Search queries during `/craft` that need component lookup
- When agent needs to find existing implementations
- Component discovery for code generation context

## Performance Target

- All queries: <50ms

## Functions

### findByTier(tier)

Find components by their tier classification.

```bash
rg "@sigil-tier gold" src/sanctuary/ -l
```

Returns: Array of file paths

### findByZone(zone)

Find components assigned to a specific zone.

```bash
rg "@sigil-zone critical" src/ -l
```

Returns: Array of file paths

### findByPhysics(physics)

Find components using a specific physics profile.

```bash
rg "@sigil-physics deliberate" src/ -l
```

Returns: Array of file paths

### findByVocabulary(term)

Find components handling a vocabulary term.

```bash
rg "@sigil-vocabulary.*claim" src/ -l
```

Returns: Array of file paths

## Workshop Integration

When workshop is available, queries use pre-computed index:
1. Check `workshop.components` for matching entries
2. Fall back to ripgrep if workshop unavailable

## Output

Returns component information:
- File path relative to project root
- Tier classification
- Zone assignment
- Vocabulary terms

## Example Usage

```typescript
// Find gold-tier components
const goldComponents = await findByTier('gold');

// Find components in critical zone
const criticalComponents = await findByZone('critical');

// Find components handling "claim" vocabulary
const claimComponents = await findByVocabulary('claim');
```
