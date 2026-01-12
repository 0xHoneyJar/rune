# Sigil Architecture Overview

> A visual map of how all the pieces fit together.

---

## The Layer Cake

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                           DESIGNER EXPERIENCE                               │
│                                                                             │
│                              /craft                                         │
│                                 │                                           │
│                        "Just use it. Ship."                                 │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                           SKILLS LAYER                                      │
│                                                                             │
│    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                │
│    │    MASON     │    │   GARDENER   │    │ DIAGNOSTICIAN│                │
│    │              │    │              │    │              │                │
│    │  Generation  │    │  Governance  │    │   Debugging  │                │
│    │  UI + Copy   │    │  Survival    │    │   Patterns   │                │
│    │              │    │  Promotion   │    │   React      │                │
│    └──────┬───────┘    └──────┬───────┘    └──────┬───────┘                │
│           │                   │                   │                         │
├───────────┼───────────────────┼───────────────────┼─────────────────────────┤
│           │                   │                   │                         │
│           └───────────────────┼───────────────────┘                         │
│                               │                                             │
│                     ┌─────────▼─────────┐                                   │
│                     │                   │                                   │
│                     │  CONTEXT LAYER    │                                   │
│                     │                   │                                   │
│                     │  ┌─────────────┐  │                                   │
│                     │  │    Taste    │  │  What patterns you prefer        │
│                     │  └─────────────┘  │                                   │
│                     │  ┌─────────────┐  │                                   │
│                     │  │   Persona   │  │  Who you're building for         │
│                     │  └─────────────┘  │                                   │
│                     │  ┌─────────────┐  │                                   │
│                     │  │   Project   │  │  Your codebase knowledge         │
│                     │  └─────────────┘  │                                   │
│                     │                   │                                   │
│                     └─────────▲─────────┘                                   │
│                               │                                             │
├───────────────────────────────┼─────────────────────────────────────────────┤
│                               │                                             │
│                     ┌─────────┴─────────┐                                   │
│                     │                   │                                   │
│                     │ OBSERVABILITY     │                                   │
│                     │                   │                                   │
│                     │  Vercel Drains    │  Logs, errors, traces            │
│                     │  Web Vitals       │  LCP, CLS, INP                   │
│                     │  Analytics        │  Usage, funnels                  │
│                     │  Events           │  Custom tracking                 │
│                     │                   │                                   │
│                     └───────────────────┘                                   │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                           FOUNDATION                                        │
│                                                                             │
│                     ┌───────────────────┐                                   │
│                     │       CORE        │                                   │
│                     │                   │                                   │
│                     │  The Inviolable   │                                   │
│                     │  Constraint       │                                   │
│                     │                   │                                   │
│                     │  "Using it IS     │                                   │
│                     │   the experience" │                                   │
│                     └───────────────────┘                                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## The Skills

### MASON — Generation

```
Trigger: /craft "..."

         ┌─────────────────────────────────────────┐
         │                MASON                     │
         │                                         │
   ┌─────┴─────┐                                   │
   │  Inputs   │                                   │
   │           │                                   │
   │  • Taste ─────► Physics selection             │
   │  • Persona ───► Copy voice                    │
   │  • Project ───► Conventions                   │
   │  • Gold ──────► Stable patterns               │
   │           │                                   │
   └─────┬─────┘                                   │
         │                                         │
         ▼                                         │
   ┌───────────┐     ┌───────────┐                │
   │ Component │  +  │   Copy    │  = Generation  │
   │ (physics) │     │  (voice)  │                │
   └───────────┘     └───────────┘                │
         │                                         │
         └─────────────────────────────────────────┘
         
Output: Complete UI with appropriate copy
```

**Document**: MASON.md

---

### GARDENER — Invisible Governance

```
Trigger: Background / git push

         ┌─────────────────────────────────────────┐
         │              GARDENER                    │
         │                                         │
         │    Survival Engine                      │
         │    ─────────────────                    │
         │                                         │
         │    ┌─────────┐      ┌─────────┐        │
         │    │  Draft  │ ───► │ Silver  │        │
         │    └─────────┘      └────┬────┘        │
         │                          │             │
         │         5+ uses          │             │
         │         2 weeks stable   │             │
         │         Lint passes      ▼             │
         │                    ┌─────────┐         │
         │                    │  Gold   │         │
         │                    └────┬────┘         │
         │                         │              │
         │         Modified?       │              │
         │         3+ rejections?  ▼              │
         │                    ┌─────────┐         │
         │                    │ Demoted │         │
         │                    └─────────┘         │
         │                                         │
         └─────────────────────────────────────────┘

Output: Patterns promoted/demoted invisibly
        Designer never sees this process
```

**Document**: GARDENER.md (to be created)

---

### DIAGNOSTICIAN — Debugging

```
Trigger: "It's broken" / "glitches" / error detected

         ┌─────────────────────────────────────────┐
         │            DIAGNOSTICIAN                 │
         │                                         │
         │   ┌─────────────────────────────────┐   │
         │   │      Pattern Library            │   │
         │   │                                 │   │
         │   │  • Hydration mismatches         │   │
         │   │  • Dialog instability           │   │
         │   │  • CSS conflicts                │   │
         │   │  • React pitfalls               │   │
         │   │  • Performance issues           │   │
         │   │  • Server component errors      │   │
         │   └─────────────────────────────────┘   │
         │                  │                      │
         │                  ▼                      │
         │   ┌─────────────────────────────────┐   │
         │   │    Observability Check          │   │
         │   │                                 │   │
         │   │  • Vercel logs                  │   │
         │   │  • Error traces                 │   │
         │   │  • Vitals data                  │   │
         │   │  • User reports                 │   │
         │   └─────────────────────────────────┘   │
         │                  │                      │
         │                  ▼                      │
         │   ┌─────────────────────────────────┐   │
         │   │    Investigate (INVISIBLE)      │   │
         │   │                                 │   │
         │   │  Designer NEVER:                │   │
         │   │  • Checks console               │   │
         │   │  • Adds console.log             │   │
         │   │  • Digs through logs            │   │
         │   │  • Traces code manually         │   │
         │   └─────────────────────────────────┘   │
         │                  │                      │
         │                  ▼                      │
         │            Finding + Fix                │
         │                                         │
         └─────────────────────────────────────────┘

Output: "I found the issue. Here's the fix..."
```

**Document**: DIAGNOSTICIAN.md (to be created)

---

## The Context Layer

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CONTEXT LAYER                                     │
│                                                                             │
│   All invisible. All learned from usage.                                    │
│                                                                             │
│   ┌───────────────────────────────────────────────────────────────────┐    │
│   │                           TASTE                                    │    │
│   │                                                                    │    │
│   │   Source: Accept / Modify / Reject                                │    │
│   │                                                                    │    │
│   │   Captures:                                                        │    │
│   │   • Physics preferences (snappy vs deliberate)                    │    │
│   │   • Pattern preferences (which components)                        │    │
│   │   • Layout preferences (flex vs grid)                             │    │
│   │   • Style preferences (minimal vs detailed)                       │    │
│   │                                                                    │    │
│   │   Used by: Mason (generation)                                     │    │
│   │                                                                    │    │
│   └───────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│   ┌───────────────────────────────────────────────────────────────────┐    │
│   │                          PERSONA                                   │    │
│   │                                                                    │    │
│   │   Source: Prompt language, copy that survives                     │    │
│   │                                                                    │    │
│   │   Captures:                                                        │    │
│   │   • Audience sophistication (newcomer → expert)                   │    │
│   │   • Voice (friendly vs technical)                                 │    │
│   │   • Jargon tolerance (low → high)                                 │    │
│   │   • Trust signals needed                                          │    │
│   │                                                                    │    │
│   │   Used by: Mason (copy generation)                                │    │
│   │                                                                    │    │
│   └───────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│   ┌───────────────────────────────────────────────────────────────────┐    │
│   │                          PROJECT                                   │    │
│   │                                                                    │    │
│   │   Source: File operations, imports, conventions                   │    │
│   │                                                                    │    │
│   │   Captures:                                                        │    │
│   │   • Folder structures                                             │    │
│   │   • Naming conventions (kebab vs camel)                           │    │
│   │   • Import patterns (@/ aliases)                                  │    │
│   │   • Asset locations                                               │    │
│   │                                                                    │    │
│   │   Used by: Mason (conventions), Diagnostician (file finding)      │    │
│   │                                                                    │    │
│   └───────────────────────────────────────────────────────────────────┘    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Document**: CONTEXT.md

---

## The Observability Layer

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        OBSERVABILITY LAYER                                  │
│                                                                             │
│   Production awareness. Designer never digs through logs.                   │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │                      VERCEL INTEGRATION                             │  │
│   │                                                                     │  │
│   │   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │  │
│   │   │  Log Drains  │  │  Web Vitals  │  │  Analytics   │             │  │
│   │   │              │  │              │  │              │             │  │
│   │   │  • Errors    │  │  • LCP       │  │  • Events    │             │  │
│   │   │  • Warnings  │  │  • CLS       │  │  • Funnels   │             │  │
│   │   │  • Traces    │  │  • INP       │  │  • Usage     │             │  │
│   │   │              │  │  • FID       │  │              │             │  │
│   │   └──────┬───────┘  └──────┬───────┘  └──────┬───────┘             │  │
│   │          │                 │                 │                      │  │
│   │          └─────────────────┼─────────────────┘                      │  │
│   │                            ▼                                        │  │
│   │                  ┌─────────────────┐                                │  │
│   │                  │  Intelligence   │                                │  │
│   │                  │  Processing     │                                │  │
│   │                  └────────┬────────┘                                │  │
│   │                           │                                         │  │
│   └───────────────────────────┼─────────────────────────────────────────┘  │
│                               │                                             │
│                               ▼                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │                      FEEDS INTO                                     │  │
│   │                                                                     │  │
│   │   Mason ◄───────── Production patterns to avoid/prefer             │  │
│   │   Gardener ◄─────── Survival signals from real usage               │  │
│   │   Diagnostician ◄── Error context, logs, traces                    │  │
│   │   Context ◄──────── What's actually being used                     │  │
│   │                                                                     │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Document**: OBSERVABILITY.md

---

## Data Flow

```
                              DESIGNER
                                 │
                                 │ /craft "..."
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                              MASON                                          │
│                                │                                            │
│            ┌───────────────────┼───────────────────┐                       │
│            │                   │                   │                        │
│            ▼                   ▼                   ▼                        │
│     ┌──────────┐        ┌──────────┐        ┌──────────┐                   │
│     │  Taste   │        │  Persona │        │  Project │                   │
│     │  Context │        │  Context │        │  Context │                   │
│     └──────────┘        └──────────┘        └──────────┘                   │
│            │                   │                   │                        │
│            └───────────────────┼───────────────────┘                       │
│                                │                                            │
│                                ▼                                            │
│                          GENERATION                                         │
│                                │                                            │
└────────────────────────────────┼────────────────────────────────────────────┘
                                 │
                                 ▼
                              DESIGNER
                                 │
                    ┌────────────┼────────────┐
                    │            │            │
                    ▼            ▼            ▼
               ACCEPT       MODIFY       REJECT
                    │            │            │
                    │            │            │
                    └────────────┼────────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │   CONTEXT UPDATED      │
                    │   (Invisible)          │
                    │                        │
                    │   Taste reinforced     │
                    │   Persona refined      │
                    │   Learning continues   │
                    └────────────────────────┘
                                 │
                                 │ Background
                                 ▼
                    ┌────────────────────────┐
                    │      GARDENER          │
                    │                        │
                    │   Survival engine      │
                    │   Promotion/demotion   │
                    │   Gold registry        │
                    └────────────────────────┘
```

---

## Error Flow

```
                              DESIGNER
                                 │
                                 │ "It's broken" / "glitches"
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                          DIAGNOSTICIAN                                      │
│                                │                                            │
│                                ▼                                            │
│            ┌───────────────────────────────────────┐                       │
│            │        Pattern Matching               │                       │
│            │                                       │                       │
│            │  Symptom: "glitches" + "dialog"       │                       │
│            │  Match: dialog_instability pattern    │                       │
│            └───────────────────┬───────────────────┘                       │
│                                │                                            │
│                                ▼                                            │
│            ┌───────────────────────────────────────┐                       │
│            │        Observability Check            │                       │
│            │                                       │                       │
│            │  • Check Vercel logs                  │                       │
│            │  • Check error traces                 │                       │
│            │  • Check Web Vitals                   │                       │
│            └───────────────────┬───────────────────┘                       │
│                                │                                            │
│                                ▼                                            │
│            ┌───────────────────────────────────────┐                       │
│            │        Code Investigation             │                       │
│            │                                       │                       │
│            │  • Check for known anti-patterns      │                       │
│            │  • Analyze component structure        │                       │
│            │  • Compare to working patterns        │                       │
│            └───────────────────┬───────────────────┘                       │
│                                │                                            │
└────────────────────────────────┼────────────────────────────────────────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │   "Found the issue.    │
                    │    Here's the fix..."  │
                    └────────────────────────┘
                                 │
                                 ▼
                              DESIGNER
                                 │
                                 │ Applies fix, ships
                                 │ (Never debugged manually)
                                 ▼
                              ✓ DONE
```

---

## Document Map

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   CORE.md ──────────────────── The inviolable constraint                   │
│       │                        "Using it IS the experience"                 │
│       │                                                                     │
│       ├── MASON.md ─────────── Generation skill                            │
│       │                        UI + Copy from context                       │
│       │                                                                     │
│       ├── GARDENER.md ──────── Invisible governance                        │
│       │                        Survival engine, promotion                   │
│       │                                                                     │
│       ├── DIAGNOSTICIAN.md ─── Debugging skill                             │
│       │                        React patterns, investigation               │
│       │                                                                     │
│       ├── CONTEXT.md ───────── Accumulation mechanics                      │
│       │                        Taste, Persona, Project                      │
│       │                        Cold start, veto                             │
│       │                                                                     │
│       └── OBSERVABILITY.md ─── Production awareness                        │
│                                Vercel Drains, logs, vitals                  │
│                                                                             │
│   ARCHITECTURE.md ──────────── This document                               │
│   (you are here)               Visual overview of everything               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Status

| Document | Status | Focus |
|----------|--------|-------|
| CORE.md | ✅ Complete | Inviolable constraint |
| MASON.md | ✅ Complete | Generation |
| CONTEXT.md | ✅ Complete | Accumulation, cold start, veto |
| OBSERVABILITY.md | ✅ Complete | Vercel Drains, logs, vitals |
| GARDENER.md | ✅ Complete | Survival engine, invisible governance |
| DIAGNOSTICIAN.md | ✅ Complete | React patterns, debugging |
| ARCHITECTURE.md | ✅ Complete | This overview |

---

## The Core Promise

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   Designer: /craft                                                          │
│   Designer: ships                                                           │
│   Designer: iterates                                                        │
│                                                                             │
│   Everything else — taste, persona, project familiarity, diagnostics,       │
│   observability, governance — is INVISIBLE.                                 │
│                                                                             │
│   The architecture exists to make this possible.                            │
│   The designer never sees the architecture.                                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```
