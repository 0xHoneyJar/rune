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

These aren't style choices. They're physics.

---

## The Mental Model

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   What you say          What it means         How it behaves    │
│   ─────────────         ─────────────         ──────────────    │
│                                                                 │
│   "claim button"   →    financial        →    pessimistic       │
│                         mutation               800ms             │
│                                                confirmation      │
│                                                                 │
│   "like button"    →    social           →    optimistic        │
│                         interaction            200ms             │
│                                                instant feel      │
│                                                                 │
│   "dark mode"      →    local            →    immediate         │
│                         state                  100ms             │
│                                                no server         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

The word determines the effect. The effect determines the physics.

---

## Physics

Physics describe how UI *behaves*, not how it *looks*.

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

## The Insight

You describe *feel*. Sigil handles physics.

```
You think:           "trustworthy claim button"

Sigil knows:         "claim" = financial
                     financial = pessimistic
                     pessimistic = 800ms + confirmation
                     trustworthy = deliberate animation

You get:             Component with correct physics
```

No configuration. No questions. Physics are automatic.

---

## Installation

```bash
curl -fsSL https://sigil.dev/install | bash
```

Adds rules to `.claude/rules/`. Your `CLAUDE.md` stays untouched.

---

## Usage

```
/craft "claim button"         # Financial: 800ms, pessimistic
/craft "like button"          # Standard: 200ms, optimistic
/craft "delete with undo"     # Soft delete: toast + undo
/craft "dark mode toggle"     # Local: 100ms, immediate
```

Before generating, Sigil shows what physics it detected:

```
┌─ Physics Analysis ─────────────────────────────────────┐
│                                                        │
│  Component:    ClaimButton                             │
│  Effect:       Financial mutation                      │
│  Detected by:  "claim" keyword                         │
│                                                        │
│  Sync:         Pessimistic (server confirms)           │
│  Timing:       800ms (time to verify amount)           │
│  Confirmation: Required (two-phase)                    │
│  Animation:    ease-out (deliberate)                   │
│                                                        │
└────────────────────────────────────────────────────────┘

Proceed? (yes / or describe what's different)
```

If wrong, correct it. Sigil learns from your feedback.

---

## Taste

Sigil learns your preferences over time.

```
Session 1:  You change 800ms → 500ms
Session 2:  You change 800ms → 500ms
Session 3:  You change 800ms → 500ms
Session 4:  Sigil generates with 500ms automatically
```

Corrections weight 5x. Usage is feedback.

---

## Animation

Animation is how physics become visible.

```
EFFECT              EASING            FEEL
───────────────────────────────────────────────────────

Financial           ease-out          Deliberate. Weight
                    800ms             communicates gravity.

Standard            spring            Snappy. Organic.
                    stiffness: 500    Feels alive.

Local               spring            Instant. Direct.
                    stiffness: 700    No waiting.

High-frequency      none              Used 50x/day?
                    0ms               Best animation is
                                      no animation.
```

---

## Protected Capabilities

Some things must always work:

| Capability | Rule |
|------------|------|
| Withdraw | Always reachable |
| Cancel | Always visible |
| Balance | Always current |
| Error recovery | Always possible |

Sigil enforces these. You can override with justification.

---

## Philosophy

**Effect is truth.** What the code *does* determines how it *behaves*. Not preferences. Not adjectives. Effect.

**Feel over implementation.** You think in feel ("trustworthy", "snappy", "instant"). Sigil translates to physics.

**Usage is feedback.** No forms. No ratings. Accept, modify, or reject. Corrections teach more than silence.

**Visible reasoning.** Sigil shows its analysis before generating. You can correct before wasted effort.

---

## Links

- [GitHub](https://github.com/0xHoneyJar/sigil)
- [Issues](https://github.com/0xHoneyJar/sigil/issues)

---

*v12.3.0*
