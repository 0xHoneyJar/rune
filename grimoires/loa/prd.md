# Product Requirements Document: Sigil v10.1 "Usage Reality"

**Version:** 10.1.0
**Codename:** Usage Reality
**Status:** PRD Complete
**Date:** 2026-01-11
**Supersedes:** v9.1.0 "Migration Debt Zero" (completed)
**Sources:** sigil-v10.1-package.zip, CLAUDE.md, existing src/lib/sigil/

---

## 1. Executive Summary

Sigil v10.1 "Usage Reality" completes the v10 vision with three core principles:

1. **Usage is Authority** — Components earn Gold status through import counts, not directories
2. **Effect is Physics** — The verb (mutation/query/local) determines timing, not the noun
3. **Never Interrupt Flow** — Infer, don't ask; generate, don't configure

**Current State:**
- v9.1 migration complete: `sigil-mark/` deleted, grimoire structure established
- Core library exists: `src/lib/sigil/` with 6 modules (~110K bytes)
- Skills exist: Mason, Gardener, Diagnostician in `.claude/skills/`
- Configuration exists: `grimoires/sigil/constitution.yaml`, `authority.yaml`
- Runtime hook exists: `src/hooks/useMotion.ts`

**The Gap:**
The v10.1 concepts are documented in CLAUDE.md but the skills don't fully implement them. The skills reference library functions that exist but aren't wired into the `/craft` and `/garden` workflows.

**The Solution:**
Enhance the existing skills (Mason, Gardener, Diagnostician) to fully leverage the v10.1 library, enabling:
- AST-based intent inference
- Usage-based authority computation
- Effect-based physics selection
- Semantic pattern search
- Pattern debugging without questions

---

## 2. Problem Statement

### 2.1 Skills Don't Use the Library

The Mason skill (`.claude/skills/mason/SKILL.md`) documents the correct workflow:

```markdown
## Workflow
1. Context Loading - Load accumulated taste from grimoires/sigil/.context/
2. Intent Inference - Parse request for component type and purpose
3. Pattern Discovery - Search codebase for canonical patterns via search.ts
4. AST Analysis - Use ast-reader.ts to analyze similar components
5. Generation - Generate component with correct physics
6. Context Update - Record generated patterns
```

But this workflow is **documentation**, not implementation. The skill file references:
- `search.ts` for pattern discovery
- `ast-reader.ts` for intent inference
- `context.ts` for learning signals

These modules exist in `src/lib/sigil/` but aren't invoked by the skill.

### 2.2 Library Modules Not Integrated

| Module | Lines | Status | Gap |
|--------|-------|--------|-----|
| `context.ts` | 15,462 | ✅ Implemented | Not called by skills |
| `survival.ts` | 16,702 | ✅ Implemented | Not called by /garden |
| `physics.ts` | 12,555 | ✅ Implemented | Not called by Mason |
| `ast-reader.ts` | 17,296 | ✅ Implemented | Not called by Mason |
| `diagnostician.ts` | 27,084 | ✅ Implemented | Not called on errors |
| `search.ts` | 17,890 | ✅ Implemented | Not called for canonicals |

### 2.3 v10.1 Package Provides Reference

The `sigil-v10.1-package.zip` provides a reference implementation with:
- 6 MCP tools that implement the exact workflow
- Clear input/output contracts
- Tool composition examples

While we're keeping the skill-based approach, the tool implementations provide the **logic** that skills should invoke.

---

## 3. Goals

### 3.1 Primary Goal

**Mason skill generates code using the full v10.1 pipeline:**

```
User: /craft "claim button for rewards pool"

Mason internally:
1. inferIntent("claim button for rewards pool")
   → { mutation: true, financial: true, interactive: true }

2. inferPhysicsFromEffect({ mutation: true, financial: true })
   → { sync: 'pessimistic', timing: 800, confirmation: true }

3. findCanonical("claim button financial")
   → [{ file: "TransferButton.tsx", authority: "gold" }]

4. analyzeAST("TransferButton.tsx")
   → { patterns: { hooks: [...], animations: [...] } }

5. [Generate code using patterns + physics]

6. validateGeneration(code, physics)
   → { valid: true }
```

### 3.2 Secondary Goals

1. **Gardener skill computes authority** — Run `inferAuthority()` from survival.ts
2. **Diagnostician activates on errors** — Call `matchSymptoms()` from diagnostician.ts
3. **Context accumulates invisibly** — Call `processLearningSignal()` from context.ts
4. **No questions policy enforced** — Skills infer, never ask

### 3.3 Non-Goals

1. **MCP tools** — We're enhancing skills, not creating tools
2. **New library modules** — The 6 modules are complete
3. **UI changes** — This is agent-time workflow only
4. **Runtime layer** — useMotion.ts and physics already work

---

## 4. Requirements

### 4.1 P0: Mason Skill Integration

**Update `.claude/skills/mason/SKILL.md` to call library functions:**

The skill should:

1. **Call inferIntent** on every /craft request:
```typescript
import { inferIntent } from '@/lib/sigil/ast-reader';
const intent = await inferIntent({ target: userRequest });
```

2. **Call inferPhysicsFromEffect** based on intent:
```typescript
import { inferPhysicsFromEffect } from '@/lib/sigil/physics';
const physics = inferPhysicsFromEffect(intent);
```

3. **Call findCanonical** for pattern discovery:
```typescript
import { search, findCanonical } from '@/lib/sigil/search';
const canonicals = await findCanonical(query, 'gold');
```

4. **Call analyzeAST** for pattern extraction:
```typescript
import { analyzeAST } from '@/lib/sigil/ast-reader';
const patterns = await analyzeAST(canonicalFile);
```

5. **Call validateGeneration** after code generation:
```typescript
import { validateGeneration } from '@/lib/sigil/physics';
const validation = validateGeneration(generatedCode, physics);
```

**Acceptance Criteria:**
- [ ] Mason calls all 5 library functions in sequence
- [ ] Mason never asks "What physics do you prefer?"
- [ ] Mason never asks "What zone should this be in?"
- [ ] Generated code includes correct physics values
- [ ] Financial mutations get pessimistic sync + confirmation

---

### 4.2 P0: Gardener Skill Integration

**Update `.claude/skills/gardener/SKILL.md` to call survival.ts:**

The skill should:

1. **Call inferAuthority** for each component:
```typescript
import { inferAuthority, countImports } from '@/lib/sigil/survival';
const authority = await inferAuthority(componentPath);
// Returns: { tier: 'gold' | 'silver' | 'draft', imports: number, stability: number }
```

2. **Check promotion eligibility**:
```typescript
import { checkPromotion } from '@/lib/sigil/survival';
const promotion = await checkPromotion(componentPath);
// Returns: { eligible: boolean, confidence: number, blockers: string[] }
```

**Acceptance Criteria:**
- [ ] /garden reports accurate import counts
- [ ] /garden shows authority tier (gold/silver/draft)
- [ ] /garden identifies promotion-eligible components
- [ ] No file moves required for authority changes

---

### 4.3 P0: Diagnostician Skill Integration

**Update `.claude/skills/diagnostician/SKILL.md` to call diagnostician.ts:**

The skill should:

1. **Call matchSymptoms** when errors reported:
```typescript
import { matchSymptoms, diagnose } from '@/lib/sigil/diagnostician';
const matches = matchSymptoms(errorDescription);
// Returns: { pattern: string, confidence: number, solution: string }[]
```

2. **Never ask diagnostic questions**:
```markdown
NEVER ASK:
- "Can you check the console?"
- "What browser are you using?"
- "Can you reproduce the error?"

INSTEAD INFER:
- Match symptom patterns from PATTERNS constant
- Provide likely solutions ranked by confidence
- Run automated checks where possible
```

**Acceptance Criteria:**
- [ ] Diagnostician matches symptoms without questions
- [ ] Diagnostician provides solutions ranked by confidence
- [ ] Covers 9 pattern categories (hydration, dialog, performance, etc.)

---

### 4.4 P1: Context Accumulation

**Wire context.ts into skill workflows:**

1. **After generation (Mason)**:
```typescript
import { processLearningSignal } from '@/lib/sigil/context';
await processLearningSignal({
  type: 'generation',
  component: generatedComponent,
  physics: appliedPhysics,
  intent: inferredIntent
});
```

2. **After user feedback**:
```typescript
await processLearningSignal({
  type: 'feedback',
  action: 'accept' | 'modify' | 'reject',
  component: componentPath
});
```

**Acceptance Criteria:**
- [ ] Learning signals recorded to grimoires/sigil/.context/
- [ ] Context influences future generations
- [ ] No explicit configuration required

---

### 4.5 P1: Constitution Alignment

**Ensure constitution.yaml matches library physics:**

Current `grimoires/sigil/constitution.yaml`:
```yaml
effect_physics:
  mutation:
    sync: pessimistic
    timing: 800
```

Library `src/lib/sigil/physics.ts`:
```typescript
export const EFFECT_PHYSICS = {
  mutation: { sync: 'pessimistic', timing: 800 },
  ...
};
```

**Verify alignment:**
- [ ] All effect types in constitution.yaml match physics.ts
- [ ] All protected capabilities match
- [ ] All physics presets match useMotion.ts

---

### 4.6 P2: Search Index Initialization

**Enable semantic search:**

```bash
# Build search index
npx sigil index-components src/components/

# Outputs to grimoires/sigil/index/
```

**Acceptance Criteria:**
- [ ] search.ts can find canonical patterns
- [ ] Index regenerates on component changes
- [ ] Index is gitignored (build artifact)

---

## 5. Implementation Sprints

### Sprint 1: Mason Pipeline (P0)

1. Update Mason SKILL.md with library invocations
2. Verify inferIntent() works with descriptions
3. Verify inferPhysicsFromEffect() returns correct physics
4. Verify findCanonical() returns Gold patterns
5. Test end-to-end /craft flow

**Exit Criteria:** `/craft "claim button"` generates code with 800ms pessimistic physics

### Sprint 2: Gardener + Diagnostician (P0)

6. Update Gardener SKILL.md with survival.ts calls
7. Verify inferAuthority() counts imports correctly
8. Update Diagnostician SKILL.md with diagnostician.ts calls
9. Verify matchSymptoms() finds patterns

**Exit Criteria:** `/garden` shows accurate authority, errors trigger pattern matching

### Sprint 3: Context + Polish (P1-P2)

10. Wire context.ts into Mason workflow
11. Add feedback signal processing
12. Initialize search index
13. Verify end-to-end /craft → /garden → Diagnostician flow

**Exit Criteria:** Full v10.1 pipeline operational

---

## 6. File Changes Summary

### Files to Update

| File | Changes |
|------|---------|
| `.claude/skills/mason/SKILL.md` | Add library invocations |
| `.claude/skills/gardener/SKILL.md` | Add survival.ts calls |
| `.claude/skills/diagnostician/SKILL.md` | Add diagnostician.ts calls |
| `.claude/skills/mason/index.yaml` | Update file references |
| `.claude/skills/gardener/index.yaml` | Update file references |
| `.claude/skills/diagnostician/index.yaml` | Update file references |

### Files Already Complete

| File | Status |
|------|--------|
| `src/lib/sigil/context.ts` | ✅ Implemented |
| `src/lib/sigil/survival.ts` | ✅ Implemented |
| `src/lib/sigil/physics.ts` | ✅ Implemented |
| `src/lib/sigil/ast-reader.ts` | ✅ Implemented |
| `src/lib/sigil/diagnostician.ts` | ✅ Implemented |
| `src/lib/sigil/search.ts` | ✅ Implemented |
| `src/hooks/useMotion.ts` | ✅ Implemented |
| `grimoires/sigil/constitution.yaml` | ✅ Complete |
| `grimoires/sigil/authority.yaml` | ✅ Complete |
| `CLAUDE.md` | ✅ Documents v10.1 |

---

## 7. Validation

### 7.1 Manual Test Cases

**Test 1: Financial Mutation**
```
/craft "claim button for rewards"
```
Expected:
- Physics: pessimistic, 800ms
- Confirmation flow included
- useMotion('deliberate') in output

**Test 2: Query Component**
```
/craft "user balance display"
```
Expected:
- Physics: optimistic, 150ms
- No confirmation needed
- useMotion('snappy') in output

**Test 3: Authority Check**
```
/garden src/components/Button.tsx
```
Expected:
- Import count displayed
- Stability days displayed
- Authority tier (gold/silver/draft)

**Test 4: Error Diagnosis**
```
User: "The dialog is glitching when I scroll"
```
Expected:
- Diagnostician activates (no manual trigger)
- Matches "dialog" + "scroll" symptoms
- Provides solutions without asking browser info

### 7.2 Automated Validation

```bash
#!/bin/bash
# validate-v10.1.sh

echo "=== SIGIL v10.1 VALIDATION ==="

echo ""
echo "1. Checking library modules..."
for module in context survival physics ast-reader diagnostician search; do
  if [ -f "src/lib/sigil/${module}.ts" ]; then
    echo "  ✓ ${module}.ts exists"
  else
    echo "  ❌ MISSING: ${module}.ts"
  fi
done

echo ""
echo "2. Checking skill files..."
for skill in mason gardener diagnostician; do
  if [ -f ".claude/skills/${skill}/SKILL.md" ]; then
    echo "  ✓ ${skill}/SKILL.md exists"
  else
    echo "  ❌ MISSING: ${skill}/SKILL.md"
  fi
done

echo ""
echo "3. Checking constitution alignment..."
if grep -q "mutation:" grimoires/sigil/constitution.yaml; then
  echo "  ✓ constitution.yaml has effect_physics"
else
  echo "  ❌ Missing effect_physics in constitution.yaml"
fi

echo ""
echo "4. Checking useMotion hook..."
if [ -f "src/hooks/useMotion.ts" ]; then
  echo "  ✓ useMotion.ts exists"
else
  echo "  ❌ MISSING: useMotion.ts"
fi

echo ""
echo "=== VALIDATION COMPLETE ==="
```

---

## 8. Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Mason asks configuration questions | Yes | No |
| Gardener computes authority | No | Yes |
| Diagnostician matches patterns | No | Yes |
| Context accumulates | No | Yes |
| /craft uses correct physics | Partial | Full |

---

## 9. Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Library modules have bugs | /craft fails | Test each module in isolation first |
| Skills don't invoke library | No improvement | Verify invocations in skill output |
| Physics values inconsistent | Wrong timings | Align constitution.yaml with physics.ts |
| Search index empty | No canonicals found | Seed with initial components |

---

## 10. Out of Scope

1. **MCP tools** — Using enhanced skills approach instead
2. **Runtime layer expansion** — useMotion.ts already works
3. **New library modules** — All 6 modules complete
4. **Component generation** — Focus is on skill integration
5. **UI/visual changes** — Agent-time only

---

## 11. Dependencies

### Internal Dependencies

| Dependency | Status | Required For |
|------------|--------|--------------|
| `src/lib/sigil/` | ✅ Complete | All skills |
| `src/hooks/useMotion.ts` | ✅ Complete | Generated code |
| `grimoires/sigil/constitution.yaml` | ✅ Complete | Physics config |
| `grimoires/sigil/authority.yaml` | ✅ Complete | Tier thresholds |

### External Dependencies

None — all dependencies are internal.

---

## 12. The Promise

After v10.1:

```
/craft "claim button for rewards"

# Mason internally:
# 1. inferIntent() → { mutation: true, financial: true }
# 2. inferPhysicsFromEffect() → { sync: 'pessimistic', timing: 800 }
# 3. findCanonical() → TransferButton.tsx (gold)
# 4. analyzeAST() → { patterns: [...] }
# 5. Generate with physics
# 6. validateGeneration() → valid

# Output: Code with correct physics, no questions asked
```

**The Three Laws in Action:**
1. Authority from usage (findCanonical → gold tier)
2. Physics from effect (financial mutation → pessimistic)
3. Never interrupt flow (infer, don't ask)

---

*PRD Generated: 2026-01-11*
*Sources: sigil-v10.1-package.zip, CLAUDE.md, src/lib/sigil/*
*Key Insight: The library is complete. Skills need to call it.*
