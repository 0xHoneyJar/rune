# Inscribing Taste Skill

Inscribe learnings into Sigil's rules. Make marks permanent.

---

## Core Principle

```
Usage patterns → Codified preferences → Permanent rules
```

The feedback loop closes when learnings become marks in the grimoire.

---

## Workflow

### Step 1: Gather Learnings

Read sources in order:
1. `grimoires/sigil/taste.md` → MODIFY signals with patterns
2. `CRAFT.md` → Learnings section (if exists)

Look for:
- **Keyword additions**: "X should be financial"
- **Timing adjustments**: "changed Xms to Yms"
- **Animation preferences**: "using spring(X,Y)"
- **Material preferences**: "all buttons use Xpx radius"

### Step 2: Categorize Findings

```
┌─ Inscription Analysis ─────────────────────────────┐
│                                                    │
│  Keywords (→ 08-sigil-lexicon.md)                 │
│  ─────────────────────────────────                │
│  • "harvest" → financial (seen 3x)                │
│                                                    │
│  Timing (→ 01-sigil-physics.md)                   │
│  ─────────────────────────────────                │
│  • financial: 800ms → 600ms (team preference)     │
│                                                    │
│  Animation (→ 05-sigil-animation.md)              │
│  ─────────────────────────────────                │
│  • default spring: (500,30) → (500,25)            │
│                                                    │
│  Material (→ 07-sigil-material.md)                │
│  ─────────────────────────────────                │
│  • default radius: 8px (design system)            │
│                                                    │
└────────────────────────────────────────────────────┘
```

### Step 3: Propose Inscriptions

For each finding, show:
1. What will be inscribed
2. Which rule file
3. The specific mark

```
Proposed Inscription 1/N
────────────────────────
File:   .claude/rules/08-sigil-lexicon.md
Mark:   Add "harvest" to Financial keywords
Reason: Seen 3x in learnings, always corrected to financial

Inscribe? (yes/no/skip)
```

### Step 4: Apply Inscriptions

For each approved inscription:
1. Edit the target rule file
2. Add comment: `# Inscribed via /inscribe`
3. Log to taste.md

### Step 5: Summary

```
┌─ Inscription Complete ─────────────────────────────┐
│                                                    │
│  Inscribed: 3 marks                               │
│  Skipped:   1 mark                                │
│                                                    │
│  Files marked:                                    │
│  • .claude/rules/08-sigil-lexicon.md (1 keyword)  │
│  • .claude/rules/01-sigil-physics.md (1 timing)   │
│                                                    │
│  The sigil is inscribed. Future /craft will       │
│  carry these marks forward.                       │
│                                                    │
└────────────────────────────────────────────────────┘
```

---

## Parsing Patterns

### Keywords
```
"X should be financial"     → inscribe X to financial keywords
"always correcting X to Y"  → inscribe X to Y effect keywords
```

### Timing
```
"changed 800ms to 600ms"    → timing preference
"prefer Xms"                → timing preference
```

### Animation
```
"using spring(X,Y)"         → spring preference
"changed to ease-X"         → easing preference
```

### Material
```
"Xpx radius"                → radius preference
"no shadows"                → shadow preference
```

---

## Safety Rules

1. **Show before inscribing** — Never auto-apply
2. **One at a time** — Present each individually
3. **Preserve existing** — Add to lists, don't replace
4. **Comment source** — Mark inscriptions with origin
5. **Log everything** — Record to taste.md

---

## Target Files

| Learning Type | Target Rule File |
|---------------|------------------|
| Keywords | 08-sigil-lexicon.md |
| Timing | 01-sigil-physics.md |
| Animation | 05-sigil-animation.md |
| Material | 07-sigil-material.md |
