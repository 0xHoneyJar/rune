# Sigil Core

> **The Inviolable Constraint**: Using Sigil IS the experience. Everything else is invisible.

---

## The Problem We're Solving

Artists think in **feel**. "This should feel trustworthy." "This needs to feel fast." "Make it feel like home."

But implementation requires **switching modes**: What component? What animation duration? What easing curve? What copy? Does this work on mobile? Is there a hydration issue?

**Every switch breaks flow.**

A designer might context-switch between feel-thinking and implementation-thinking dozens of times per session. Each switch is friction. Each friction compounds. Eventually, the feel gets lost in the implementation details.

---

## The Vision

```
Designer: /craft "claim button that feels trustworthy"

Agent knows EVERYTHING:
  - Feel: "trustworthy" → deliberate physics, critical zone
  - Components: Your Gold patterns, correct APIs
  - Codebase: Your conventions, your folders
  - Persona: Who you're building for (learned from usage)
  - Pitfalls: React gotchas, CSS conflicts, hydration issues
  - Production: What's actually working/breaking (from logs)

Agent generates complete, working code.

Designer: Stays in feel-thinking. Never left.
```

---

## What "Using It IS the Experience" Means

Most tools have:
- **Setup** (configure your preferences)
- **Maintenance** (update your config files)
- **Usage** (the actual features)
- **Feedback** (rate this, fill out forms)

Sigil has:
- **Usage**

That's it. The usage IS the setup. The usage IS the maintenance. The usage IS the feedback.

```
You don't configure Sigil     → You just /craft
You don't maintain Sigil      → It learns from what you keep/change
You don't set up personas     → It infers from your patterns
You don't answer questions    → It observes your choices
You don't debug               → It investigates for you
You don't rate generations    → Acceptance/rejection IS the rating
```

**The act of designing IS how Sigil learns and improves.**

---

## Why This Matters

Every explicit step is a flow-break:

| Step | Flow Break |
|------|------------|
| "First, configure your persona..." | Designer stops designing, starts configuring |
| "Who is this feature for?" | Designer stops designing, starts answering |
| "Rate this generation 1-5" | Designer stops designing, starts evaluating |
| "Add @sigil-zone to your functions" | Designer stops designing, starts annotating |
| "Check the console for errors" | Designer stops designing, starts debugging |

**Each break pulls the designer out of feel-thinking.**

Sigil's job is to handle ALL of this invisibly so the designer never leaves the creative flow.

---

## The Test

Every feature, every version, every decision:

> "Does this require the designer to DO, ANSWER, CONFIGURE, or MAINTAIN anything?"
>
> **If yes → Cut it or make it invisible**
> **If no → It can stay**

### What Gets Cut

| Feature | Why It's Cut |
|---------|--------------|
| JSDoc pragmas (`@sigil-zone`) | Requires explicit annotation |
| Persona configuration | Requires answering questions |
| Discovery YAML | Requires maintenance |
| Preference forms | Requires explicit input |
| Manual debugging | Requires investigation |

### What Survives

| Feature | Why It Survives |
|---------|-----------------|
| `/craft` command | The interface — just use it |
| Taste accumulation | Invisible — from acceptance/rejection |
| Persona inference | Invisible — from patterns |
| Project familiarity | Invisible — from file operations |
| Diagnostics | Invisible — agent investigates |

---

## The Invariants

These NEVER change across versions:

| Invariant | Meaning |
|-----------|---------|
| **Flow state is sacred** | Any prompt, question, or configuration = violation |
| **Using it IS the experience** | No setup, no maintenance, no workflow to learn |
| **Taste accumulates invisibly** | From what you keep, modify, reject |
| **Corrections ARE feedback** | Natural conversation, not forms |
| **Agent investigates** | Designer never debugs manually |
| **Architecture evolves, experience doesn't** | Each version smarter, interaction unchanged |

---

## Natural Correction (The Exception)

Invisibility doesn't mean infallibility. When inference is wrong, designer corrects **naturally**:

```
Designer: /craft "claim button"
Agent: [Generates newcomer-friendly based on inference]

Designer: "No, use technical language, this is for DeFi natives"

Agent: "Got it — adjusting for DeFi-native audience"
       [Regenerates with technical voice]
```

**This is conversation, not configuration.**

The designer didn't:
- Open a settings panel
- Fill out a persona form
- Edit a config file

They just said what they wanted. The agent learned. Flow preserved.

---

## Version Promise

The architecture evolves. The experience stays the same.

```
v9.0:  /craft → design → ship
v10.0: /craft → design → ship (smarter)
v11.0: /craft → design → ship (even smarter)

The designer's experience is IDENTICAL.
Only the invisible intelligence improves.
```

**NEVER:**
```
vX.0: /craft → but first configure your persona...
vX.0: /craft → but also maintain your discovery.yaml...
vX.0: /craft → but rate this generation before continuing...
```

---

## The Commitment

```
Designer uses /craft.
Designer ships.
That's it.

Everything else — taste, persona, project knowledge, diagnostics,
observability, governance — happens BEHIND THE SCENES.

The designer never sees the architecture.
The designer never maintains the system.
The designer never leaves flow state.

Using Sigil IS the experience.
There is no other experience.
```

---

## Related Documents

- **ARCHITECTURE.md** — Visual overview of all layers
- **MASON.md** — Generation skill (how /craft works)
- **CONTEXT.md** — How accumulation works invisibly
- **OBSERVABILITY.md** — Production awareness (invisible)

---

*This document is the source of truth for what Sigil is.*
