# CRAFT.md

Ralph-style prompt for Sigil. One component per loop. Tune until consistent.

```bash
while :; do cat CRAFT.md | claude-code ; done
```

---

## Context

Read and apply every loop:
- `.claude/rules/00-sigil-core.md` — Priority hierarchy
- `.claude/rules/01-sigil-physics.md` — Behavioral physics
- `.claude/rules/02-sigil-detection.md` — Effect detection
- `.claude/rules/05-sigil-animation.md` — Animation physics
- `.claude/rules/07-sigil-material.md` — Material physics
- `.claude/rules/08-sigil-lexicon.md` — Keyword lookups
- `grimoires/sigil/taste.md` — Accumulated preferences

Read the **Learnings** section below and apply any patterns before generating.

---

## Queue

<!--
List components to build. Ralph picks the most important ONE per loop.
Format: description with effect, feel, and material hints
-->

- [ ] claim rewards button — trustworthy, deliberate, elevated
- [ ] like button for posts — snappy, playful, minimal
- [ ] dark mode toggle — instant, smooth, minimal

---

## Task

1. Study the **Queue** above and choose the most important unchecked item
2. Run `/craft` for that ONE component with the full description
3. After generation, verify against **Acceptance** criteria below
4. If acceptance passes: mark item complete `[x]` and commit
5. If acceptance fails: add learning to **Learnings** section, loop continues
6. If you notice a pattern 3+ times in Learnings: note it for `/inscribe`

**IMPORTANT:** One component per loop. Do not batch. Trust eventual consistency.

---

## Acceptance

Before marking complete, verify:

- [ ] Physics analysis shown before generation
- [ ] Effect correctly detected (financial/destructive/standard/local)
- [ ] Timing matches effect (800ms financial, 200ms standard, 100ms local)
- [ ] Animation matches frequency (springs for interactive, ease for deliberate)
- [ ] Material matches feel adjectives
- [ ] Protected capabilities verified (cancel visible, 44px targets)
- [ ] Matches existing codebase conventions
- [ ] No TypeScript errors
- [ ] Component renders without runtime errors

If ANY fail, do NOT mark complete. Add observation to Learnings and loop.

---

## Learnings

<!--
Update this section when something goes wrong.
Format: YYYY-MM-DD: observation → what it should be
These accumulate and inform future loops.
When a pattern appears 3+ times, run /inscribe to make it permanent.
-->

### Keywords
<!-- Wrong effect detected? -->

### Timing
<!-- Wrong duration? -->

### Animation
<!-- Wrong easing/spring? -->

### Material
<!-- Wrong surface treatment? -->

### Codebase
<!-- Wrong patterns/conventions? -->

---

## Self-Improvement

When you learn something that should persist:

1. **Temporary learning** → Add to Learnings section above
2. **Pattern appears 3+ times** → Note: "Ready for /inscribe"
3. **After session** → Operator runs `/inscribe` to make marks permanent

The sigil improves through use. Each loop that corrects a mistake makes future loops better.

---

## Example Session

```
Loop 1: /craft "claim rewards button — trustworthy, deliberate, elevated"
        → Generated with 800ms, but user prefers 600ms
        → Add to Learnings: "2026-01-13: financial timing 800ms → 600ms preferred"
        → Do NOT mark complete, loop continues

Loop 2: /craft "claim rewards button — trustworthy, deliberate, elevated"
        → Read Learnings, apply 600ms
        → Acceptance passes
        → Mark [x] complete, git commit

Loop 3: /craft "like button for posts — snappy, playful, minimal"
        → Generated correctly first try (learned from taste.md)
        → Mark [x] complete, git commit

Loop 4: All items complete, loop ends or add more to Queue
```

---

## When Done

After completing the Queue:
1. Review Learnings section
2. If patterns appear 3+ times, run `/inscribe` to make them permanent
3. Clear completed items or archive CRAFT.md
4. The sigil now carries your marks forward
