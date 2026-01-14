# Sigil

Design physics for AI code generation.

```
$ curl -fsSL https://sigil.dev/install | bash
> /craft "claim button"
```

---

## The Problem

AI generates UI without understanding *feel*. Every generation is a guess.

"Make a button" could mean:
- Instant feedback (local toggle)
- Optimistic update (social like)
- Server confirmation (money transfer)

And the *look* matters too:
- Clean and minimal (utility)
- Elevated with depth (importance)
- Textured with grit (character)

These aren't style choices. They're **physics** and **material**.

---

## The Two Pillars

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   PHYSICS                         MATERIAL                      │
│   How it BEHAVES                  How it LOOKS                  │
│   ──────────────                  ─────────────                 │
│                                                                 │
│   • Sync strategy                 • Surface treatment           │
│   • Timing                        • Gradients, shadows          │
│   • Confirmation                  • Borders, radius             │
│   • Animation curves              • Texture/grit                │
│                                                                 │
│                    ↓                                            │
│              Together = FEEL                                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

Physics determines behavior. Material determines surface. Feel emerges from both.

---

## Physics

Physics describe how UI *behaves*.

```
EFFECT              SYNC              TIMING          WHY
────────────────────────────────────────────────────────────────────

Financial           Pessimistic       800ms           Money can't be
(claim, withdraw)   Server confirms   Deliberate      rolled back.
                    before UI                         Users need time
                    updates                           to verify.

Destructive         Pessimistic       600ms           Permanent actions
(delete, revoke)    Server confirms   Deliberate      need deliberation.
                    before UI                         Escape hatch
                    updates                           required.

Standard            Optimistic        200ms           Low stakes.
(like, save)        UI updates        Snappy          Feels instant,
                    immediately,                      rolls back on
                    rolls back                        error.

Local               Immediate         100ms           No server.
(toggle, expand)    No server         Instant         Pure client
                    round-trip                        state.
```

---

## Material

Material describes how UI *looks*.

```
SURFACE             GRADIENT    SHADOW      BORDER      GRIT
────────────────────────────────────────────────────────────────────

Elevated            None        soft        subtle      Clean
(cards, dialogs)    1 layer     depth       or none

Glassmorphism       None        lg          white/20    Clean
(overlays)          blur        depth       subtle

Flat                None        None        optional    Clean
(minimal UI)        solid       flat        or none

Retro               None        hard        solid 2px   Pixel
(games, nostalgia)  sharp       offset      chunky
```

**Fidelity Ceiling**: Never exceed—gradients ≤2 stops, shadows ≤1 layer, radius ≤16px.

---

## The Mental Model

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   What you say          What Sigil knows       What you get     │
│   ─────────────         ──────────────         ────────────     │
│                                                                 │
│   "claim button"   →    PHYSICS: financial   →  pessimistic     │
│                         MATERIAL: elevated       800ms          │
│                                                  soft shadow    │
│                                                  confirmation   │
│                                                                 │
│   "glassmorphism   →    PHYSICS: display     →  no sync         │
│    card"                MATERIAL: glass          blur backdrop  │
│                                                  subtle border  │
│                                                                 │
│   "retro pixel     →    PHYSICS: local       →  immediate       │
│    toggle"              MATERIAL: retro          sharp edges    │
│                                                  grit: pixel    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Installation

```bash
curl -fsSL https://sigil.dev/install | bash
```

Adds rules to `.claude/rules/`. Your `CLAUDE.md` stays untouched.

---

## Usage

### /craft — Physics + Material

```
/craft "claim button"              # Financial physics, elevated material
/craft "like button"               # Optimistic physics, flat material
/craft "glassmorphism card"        # Display physics, glass material
/craft "retro pixel badge"         # Local physics, pixel grit
```

Before generating, Sigil shows its analysis:

```
┌─ Sigil Analysis ───────────────────────────────────────┐
│                                                        │
│  Component:    ClaimButton                             │
│  Effect:       Financial mutation                      │
│                                                        │
│  ╔═ PHYSICS (behavior) ═══════════════════════════════╗
│  ║  Sync:         Pessimistic (server confirms)       ║
│  ║  Timing:       800ms (time to verify)              ║
│  ║  Confirmation: Required (two-phase)                ║
│  ║  Animation:    ease-out (deliberate)               ║
│  ╚════════════════════════════════════════════════════╝
│                                                        │
│  ╔═ MATERIAL (surface) ═══════════════════════════════╗
│  ║  Surface:      Elevated                            ║
│  ║  Shadow:       soft (1 layer)                      ║
│  ║  Border:       solid, visible                      ║
│  ║  Radius:       8px                                 ║
│  ║  Grit:         Clean                               ║
│  ╚════════════════════════════════════════════════════╝
│                                                        │
└────────────────────────────────────────────────────────┘

Proceed? (yes / or describe what's different)
```

If wrong, correct it. Sigil learns from your feedback.

### /surface — Material Only

When you only need styling (no behavior):

```
/surface "glassmorphism card"      # Just the material treatment
/surface "retro pixel badge"       # Just the grit signature
```

---

## Taste

Sigil learns your preferences over time.

```
Session 1:  You change 800ms → 500ms
Session 2:  You change soft shadow → no shadow
Session 3:  You change radius 8px → 12px
Session 4:  Sigil applies your preferences automatically
```

Corrections weight 5x. Usage is feedback.

---

## Protected Capabilities

Some things must always work:

| Capability | Rule |
|------------|------|
| Withdraw | Always reachable |
| Cancel | Always visible |
| Touch target | ≥44px minimum |
| Focus ring | Always visible |
| Error recovery | Always possible |

Sigil enforces these. You can override with justification.

---

## Philosophy

**Effect is truth.** What the code *does* determines physics. What it *is* determines material.

**Feel over implementation.** You think in feel ("trustworthy", "snappy", "glassmorphism"). Sigil translates to physics and material.

**Usage is feedback.** No forms. No ratings. Accept, modify, or reject. Corrections teach more than silence.

**Visible reasoning.** Sigil shows its analysis before generating. You can correct before wasted effort.

**Look informs feel.** Physics and material are interconnected. A trustworthy button needs deliberate timing AND clear visual weight.

---

## Links

- [GitHub](https://github.com/0xHoneyJar/sigil)
- [Issues](https://github.com/0xHoneyJar/sigil/issues)

---

*v12.4.0*
