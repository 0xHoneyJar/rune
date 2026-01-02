---
name: taste
description: Capture component taste through the 4 Questions interview
agent: sigil-capturing-taste
agent_path: .claude/skills/sigil-capturing-taste/SKILL.md
---

# /sigil taste

Capture component taste through the 4 Questions interview.

## Usage

### Capture a Component
```
/sigil taste ComponentName
```

Runs the 4 Questions interview:
1. What problem does this solve?
2. How should it feel?
3. What patterns are rejected?
4. What inspired this?

Writes JSDoc annotations directly to the source file.

### List All Components
```
/sigil taste --list
```

Shows inventory grouped by tier:
- **Gold**: Production-proven with physics and owner
- **Silver**: 4 Questions answered
- **Uncaptured**: No JSDoc yet

### Deep Capture (Nested Components)
```
/sigil taste ComponentName --deep
```

Captures the target component AND drills into its nested children:
1. Captures the parent component
2. Identifies child components used within
3. Prompts to capture each child recursively
4. Useful for capturing entire features at once

Example: `/sigil taste CheckoutFlow --deep` captures CheckoutFlow, then offers to capture CartSummary, PaymentForm, ConfirmButton, etc.

### Graduate to Gold
```
/sigil taste graduate ComponentName
```

Promotes Silver → Gold. Requires:
- Production usage proof
- Physics parameters (for interactive components)
- Taste owner assignment

## Output

After capturing, the component gets JSDoc annotations:

```typescript
/**
 * @component ClaimButton
 * @description Users rage-clicked due to subtle loading feedback
 * @feel Heavy, deliberate
 * @rejected spinner, skeleton
 * @inspiration RuneScape skill progress, Diablo loot drop
 * @intent [J] Reduce My Anxiety
 * @tier silver
 * @captured_at 2024-01-15
 * @captured_by Sigil
 */
```

## Intent Labels

Valid labels (from vocabulary.md):

**Functional**
- `[J] Make Transaction`
- `[J] Find Information`
- `[J] Organize Assets`

**Personal**
- `[J] Reassure Me This Is Safe`
- `[J] Help Me Feel Smart`
- `[J] Give Me Peace of Mind`
- `[J] Reduce My Anxiety`

**Social**
- `[J] Help Me Look Smart, Cool`
- `[J] Help Me Feel Like An Insider`
- `[J] Let Me Express My Identity`

## Discovery Commands

```bash
# Find by rejection
grep -r "@rejected.*spinner" src/components/

# Find by feel
grep -r "@feel.*heavy" src/components/

# Find Gold components
grep -r "@tier gold" src/components/

# Find by intent
grep -r "@intent \[J\] Reduce My Anxiety" src/components/
```
