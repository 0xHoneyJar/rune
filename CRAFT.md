# CRAFT.md

Design physics through continuous human feedback. You are the backpressure.

```bash
./ralph.sh 20 grimoires/sigil/CRAFT.md
```

---

## Deterministic Stack

Load every loop:
- `.claude/rules/sigil-*` — Physics laws
- `grimoires/sigil/taste.md` — Accumulated preferences
- **Signs** below — Your corrections

---

## Queue

<!--
Components to craft. ONE at a time, with your approval.
-->

- [ ] claim button — trustworthy, deliberate
- [ ] card container — clean, elevated
- [ ] toggle switch — snappy, immediate

---

## Task

1. Pick first unchecked `[ ]` item
2. Invoke: `/craft "<item>"`
3. Show physics analysis
4. Generate component
5. **PAUSE — Ask: "Does this feel right?"**
6. Wait for human response:
   - **"yes"** → mark `[x]`, commit, continue to next
   - **correction** → add to Signs, regenerate same item
   - **"focus X"** → use `/style`, `/animate`, or `/behavior` to target layer
7. Repeat until Queue complete

**You are the backpressure. Nothing advances without your approval.**

---

## Signs

### Timing

### Animation

### Material

### Brand

---

## Tools

| Command | Layer | When to use |
|---------|-------|-------------|
| `/craft` | All three | New component, full physics |
| `/style` | Material | Looks wrong, behavior fine |
| `/animate` | Animation | Movement feels off |
| `/behavior` | Behavioral | Timing/sync is wrong |

---

## Example

```
Claude: /craft "claim button — trustworthy"
        [shows analysis, generates component]
        Does this feel right?

Human: "timing feels slow"

Claude: Adding sign, regenerating...
        Does this feel right?

Human: "yes"

Claude: Marked [x], committed.
        Moving to next item...
```
