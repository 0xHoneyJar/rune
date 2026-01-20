# PRD: Craft States — Hammer vs Chisel

```
    +===============================================+
    |  CRAFT STATES                                 |
    |  Hammer vs Chisel Modes for /craft            |
    |                                               |
    |  Version 1.0.0                                |
    +===============================================+
```

**Created**: 2026-01-19
**Status**: Draft
**Author**: Human + Claude

---

## 1. Problem Statement

### The Current State

`/craft` operates in a single mode: fine-grained component generation with physics inference. This works well for:
- "Improve the hover states on this button"
- "Make the claim button feel more trustworthy"
- "Polish the loading animation"

But users also invoke `/craft` for work that spans the full stack:
- "Build the claim feature" (contract → indexer → API → UI)
- "Add portfolio tracking" (data pipeline → state management → visualization)
- "Implement notifications" (backend service → websocket → toast system)

### The Problem

When hammer-level work comes through `/craft`:
1. **Scope is underestimated** — Craft produces a UI component without the supporting infrastructure
2. **Context is missing** — No awareness of indexer schemas, contract ABIs, API shapes
3. **Implementation is incomplete** — User gets a button but not the data pipeline feeding it
4. **Rework ensues** — User realizes they needed `/plan-and-analyze` first

### The Insight

The user's actual workflow:
```
/craft → discovers complexity → needs diagnosis → /observe → synthesize → thorough implementation
```

`/craft` is the **primary entry point**, not Loa's planning commands. But some craft work reveals that the FE ↔ BE pipeline needs architecture before the physics can be applied.

**The missing capability**: `/craft` should detect hammer vs chisel work and hook into Loa's planning sequence when warranted.

---

## 2. Vision

### The Ideal Experience

```
User: /craft "claim rewards feature"

Craft: ┌─ Scope Detection ─────────────────────────────────┐
       │                                                    │
       │  This looks like HAMMER work:                      │
       │  • Contract interaction (rewards.claim())          │
       │  • Indexer dependency (RewardsClaimed events)      │
       │  • API shape needed (GET /rewards, POST /claim)    │
       │  • UI components (RewardsList, ClaimButton)        │
       │                                                    │
       │  Recommended: Architecture pass before crafting    │
       │                                                    │
       │  Options:                                          │
       │  1. Full planning → /plan-and-analyze first        │
       │  2. Quick arch → Lightweight component breakdown   │
       │  3. Just craft → Proceed with UI only (chisel)     │
       │                                                    │
       └────────────────────────────────────────────────────┘

User: 2 (quick arch)

Craft: ┌─ Component Breakdown ─────────────────────────────┐
       │                                                    │
       │  Backend:                                          │
       │  • Indexer handler for RewardsClaimed              │
       │  • API endpoint: GET /api/rewards/:address         │
       │                                                    │
       │  Frontend:                                         │
       │  • useRewards hook (data fetching)                 │
       │  • RewardsList component                           │
       │  • ClaimButton component (financial physics)       │
       │                                                    │
       │  Craft sequence: Backend → Hook → List → Button    │
       │                                                    │
       └────────────────────────────────────────────────────┘

User: proceed

[Craft executes each component with appropriate physics]
```

### Key Principle

**Sigil is a Loa Construct** — it doesn't modify Loa, it leverages Loa. When `/craft` detects hammer work:
- It can suggest `/plan-and-analyze` for full planning
- It can do lightweight architecture inline
- It can proceed chisel-only if user chooses
- It reads Loa's outputs (PRD, SDD) if they exist

---

## 3. User Personas

### Primary: The Craftsman Developer

- Uses `/craft` as primary entry point
- Thinks in terms of "features" not "components"
- Wants thorough implementation, not partial
- Already uses `/observe` for user research
- Values the physics layer for feel

**Current pain**: Invokes `/craft` for feature work, gets incomplete implementation, realizes architecture was needed.

### Secondary: The Loa Power User

- Already uses `/plan-and-analyze` → `/architect` → `/implement`
- Wants `/craft` to enhance the implement phase
- Expects Sigil to read Loa's outputs

**Current pain**: Has to manually invoke `/craft` after `/implement` for physics polish.

---

## 4. Requirements

### 4.1 Scope Detection

**MUST**: Detect when work is hammer vs chisel

| Signal | Indicates | Example |
|--------|-----------|---------|
| Contract reference | Hammer | "claim from vault", "stake tokens" |
| Indexer mention | Hammer | "track events", "historical data" |
| API dependency | Hammer | "fetch from backend", "POST to server" |
| Multi-component | Hammer | "feature", "flow", "system" |
| Single component | Chisel | "button", "modal", "animation" |
| Polish language | Chisel | "improve", "fix", "adjust", "tweak" |
| Physics-only | Chisel | "timing", "animation", "hover state" |

**MUST**: Present scope assessment to user before proceeding

**MUST**: Allow user to override detection (force chisel or hammer)

### 4.2 Chisel Mode (Current + Enhanced)

**MUST**: Retain all current `/craft` capabilities
- Physics detection and inference
- Protected capability checks
- Taste integration
- Analysis box workflow

**SHOULD**: Enhance with context awareness
- Read `grimoires/sigil/observations/` for relevant user feedback
- Read `grimoires/loa/context/` if exists (Loa integration)
- Surface relevant context in analysis box

### 4.3 Hammer Mode (New)

**MUST**: Offer two paths when hammer detected:

1. **Full Hammer** — Orchestrate complete sequence (DEFAULT)
   - Invoke `/plan-and-analyze` → produce PRD
   - Invoke `/architect` → produce SDD
   - Break down into craft-able components
   - Implement each with physics
   - Complete, working feature delivered

2. **Chisel Anyway** — User override
   - Proceed with UI-only craft
   - Warn about missing infrastructure
   - Log decision to taste

**MUST**: In Full Hammer mode:
- **Invoke** Loa commands (not suggest, actually run them)
- Produce real artifacts (`grimoires/loa/prd.md`, `sdd.md`)
- Break down SDD into implementation sequence
- Execute each component with appropriate physics
- Maintain context throughout the sequence
- Deliver complete, working feature

**MUST**: Absorb `/distill` functionality:
- Component breakdown is part of hammer mode
- No separate `/distill` invocation needed
- Breakdown happens after SDD, before implementation

**MUST**: Handle existing Loa artifacts:
- If `grimoires/loa/prd.md` exists → Skip `/plan-and-analyze`, use existing
- If `grimoires/loa/sdd.md` exists → Skip `/architect`, use existing
- Always offer to regenerate if artifacts are stale

### 4.4 Observation Integration

**MUST**: Surface relevant `/observe` findings in craft analysis

```
┌─ Physics Analysis ─────────────────────────────────┐
│                                                    │
│  Component:    ClaimButton                         │
│  Effect:       Financial mutation                  │
│                                                    │
│  Observations:                                     │
│  • @papa_flavio: "Can't see my claimable amount"  │
│    → Implies: Amount should be prominent           │
│                                                    │
│  Behavioral    pessimistic, 800ms, confirmation   │
│  ...                                               │
└────────────────────────────────────────────────────┘
```

**SHOULD**: Prompt for `/observe` when crafting user-facing features without observation context

### 4.5 Loa Handoff Protocol

**MUST**: When suggesting full planning:
- Explain what Loa will provide (PRD, SDD, Sprint)
- Offer to preserve craft context for after planning
- Support resuming craft after Loa workflow completes

**MUST**: When Loa artifacts exist:
- Read and incorporate into craft context
- Reference PRD requirements in analysis
- Align with SDD architecture decisions

**MUST NOT**: Modify Loa commands or artifacts
- Sigil is a Construct, not a Loa override
- Read-only access to Loa outputs
- Suggestions, not mandates

---

## 5. User Flows

### Flow 1: Chisel Work (No Change)

```
User: /craft "improve button hover state"

[Scope Detection: CHISEL]
- Single component
- Polish language
- Physics-only change

[Proceeds with current /craft flow]
```

### Flow 2: Hammer Work → Full Sequence

```
User: /craft "build rewards claiming feature"

[Scope Detection: HAMMER]
- Contract reference (claiming)
- Multi-component (feature)
- Likely needs: indexer, API, UI

Craft: ┌─ HAMMER Mode ─────────────────────────────────────┐
       │                                                    │
       │  This requires full-stack implementation.          │
       │                                                    │
       │  I'll run the complete sequence:                   │
       │  1. /plan-and-analyze → Requirements (PRD)         │
       │  2. /architect → Design (SDD)                      │
       │  3. Component breakdown                            │
       │  4. Implement each with physics                    │
       │                                                    │
       │  [Proceed] [Chisel anyway (UI only)]               │
       │                                                    │
       └────────────────────────────────────────────────────┘

User: proceed

[Phase 1: Requirements]
Craft: Invoking /plan-and-analyze...
       (Pre-seeded with Sigil context: observations, taste)

       ┌─ PRD Discovery ────────────────────────────────────┐
       │  [/plan-and-analyze runs its interview/synthesis]  │
       │  [Interview is faster due to observation context]  │
       └────────────────────────────────────────────────────┘

       PRD saved to grimoires/loa/prd.md

[Phase 2: Architecture]
Craft: Invoking /architect...

       ┌─ SDD Design ───────────────────────────────────────┐
       │  [/architect runs based on PRD]                    │
       └────────────────────────────────────────────────────┘

       SDD saved to grimoires/loa/sdd.md

[Phase 3: Sprint Planning]
Craft: Invoking /sprint-plan...

       ┌─ Sprint Plan ──────────────────────────────────────┐
       │                                                    │
       │  Sprint 1 (single sprint - orderly process):       │
       │                                                    │
       │  Task 1: RewardsClaimed indexer handler            │
       │  Task 2: GET /rewards/:address endpoint            │
       │  Task 3: useRewards data hook                      │
       │  Task 4: RewardsList (standard physics)            │
       │  Task 5: ClaimButton (financial physics)           │
       │                                                    │
       │  Artifacts:                                        │
       │  • grimoires/loa/prd.md                            │
       │  • grimoires/loa/sdd.md                            │
       │  • grimoires/loa/sprint.md                         │
       │                                                    │
       └────────────────────────────────────────────────────┘

       Ready to implement. Run `/run sprint-plan` when ready.

[User reviews plan, makes any adjustments]

User: /run sprint-plan

[Phase 4: Implementation via Loa's run mode]
Craft: [1/5] Implementing RewardsClaimed indexer handler...
       [2/5] Implementing /rewards/:address endpoint...
       [3/5] Implementing useRewards hook...
       [4/5] Crafting RewardsList with standard physics...
       [5/5] Crafting ClaimButton with financial physics...

       ┌─ Complete ─────────────────────────────────────────┐
       │                                                    │
       │  Feature delivered:                                │
       │  • Indexer handler (src/indexer/rewards.ts)        │
       │  • API endpoint (src/api/rewards.ts)               │
       │  • Data hook (src/hooks/useRewards.ts)             │
       │  • RewardsList (src/components/RewardsList.tsx)    │
       │  • ClaimButton (src/components/ClaimButton.tsx)    │
       │                                                    │
       └────────────────────────────────────────────────────┘
```

### Flow 3: Hammer Work with Existing Artifacts

```
User: /craft "build portfolio analytics dashboard"

[Scope Detection: HAMMER]
[Checks for existing artifacts...]
[Found: grimoires/loa/prd.md (2 days old)]

Craft: ┌─ HAMMER Mode ─────────────────────────────────────┐
       │                                                    │
       │  Existing PRD found (2 days old).                  │
       │                                                    │
       │  Options:                                          │
       │  1. Use existing PRD → /architect → implement      │
       │  2. Regenerate PRD (stale/changed requirements)    │
       │  3. Chisel anyway (UI only)                        │
       │                                                    │
       └────────────────────────────────────────────────────┘

User: 1

[Skips /plan-and-analyze, proceeds with /architect...]
```

### Flow 4: Craft with Existing Loa Context

```
[User has completed Loa workflow, PRD/SDD exist]

User: /craft "implement the ClaimButton from the sprint"

[Reads grimoires/loa/prd.md, sdd.md, sprint.md]

Craft: ┌─ Context Detected ─────────────────────────────────┐
       │                                                    │
       │  PRD: "Users can claim accumulated rewards"        │
       │  SDD: ClaimButton uses useClaimMutation hook       │
       │  Sprint: Task 3.2 - Implement ClaimButton          │
       │                                                    │
       │  Proceeding with full context...                   │
       └────────────────────────────────────────────────────┘

[Craft with physics, informed by Loa artifacts]
```

### Flow 5: Craft → Observe → Craft Cycle

```
Day 1:
User: /craft "claim button"
[Implements with financial physics]
[Ships to users]

Day 2:
User: /observe "User said they couldn't find the claim button"
[Documents observation, generates Mom Test questions]

Day 3:
User: /craft "improve claim button discoverability"

Craft: ┌─ Observation Context ─────────────────────────────┐
       │                                                    │
       │  Recent observation:                               │
       │  • User couldn't find claim button                 │
       │  • Hypothesis: Discoverability issue               │
       │  • Suggested: Increase prominence, add visual cue  │
       │                                                    │
       └────────────────────────────────────────────────────┘

[Craft addresses the observation]
```

---

## 6. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Hammer detection accuracy | 90% | User overrides vs detections |
| Quick arch completion rate | 80% | Started vs completed |
| Rework reduction | 50% fewer | Crafts that needed redo |
| Observation utilization | 70% surfaced | Relevant observations shown |
| Loa artifact reading | 100% when present | PRD/SDD incorporated |

---

## 7. Non-Goals (v1)

- **Auto-invoking Loa commands** — Sigil suggests, user decides
- **Modifying Loa artifacts** — Read-only access
- **Replacing /implement** — Hammer mode is for craft, not general implementation
- **Mandatory architecture** — User can always choose chisel

---

## 8. Technical Considerations

### Scope Detection Algorithm

```
HAMMER signals:
- Keywords: "feature", "system", "flow", "pipeline", "integrate"
- References: contract names, event names, API endpoints
- Patterns: "build X", "implement X", "create X" (vs "improve", "fix")

CHISEL signals:
- Keywords: "button", "modal", "animation", "hover", "style"
- References: single component names
- Patterns: "improve X", "fix X", "polish X", "adjust X"

Scoring:
- Each HAMMER signal: +1
- Each CHISEL signal: -1
- Threshold: >= 2 for HAMMER
```

### Context Reading

```
Priority order:
1. grimoires/sigil/observations/*.diagnostic.md (recent first)
2. grimoires/sigil/taste.md (for patterns)
3. grimoires/loa/prd.md (if exists)
4. grimoires/loa/sdd.md (if exists)
5. grimoires/loa/context/ (if exists)
```

### Quick Architecture Format

```yaml
# Inline, not persisted
components:
  - name: "RewardsClaimed handler"
    type: indexer
    dependencies: []

  - name: "GET /rewards/:address"
    type: api
    dependencies: ["RewardsClaimed handler"]

  - name: "useRewards hook"
    type: frontend
    dependencies: ["GET /rewards/:address"]

  - name: "ClaimButton"
    type: frontend
    physics: financial
    dependencies: ["useRewards hook"]

sequence: [1, 2, 3, 4]
```

---

## 9. Design Decisions

1. **Interview handling in hammer mode**
   - **Decision**: Full `/plan-and-analyze` flow
   - **But**: Pre-seeded with Sigil context (observations, taste, previous diagnostics)
   - **Rationale**: Observations provide real user context; taste provides physics preferences; this makes the interview faster and more targeted

2. **Checkpoint behavior**
   - **Decision**: Upfront plan shown, then manual sprint execution
   - **Flow**:
     1. Show complete plan (PRD → SDD → Components → Sequence)
     2. User reviews and approves
     3. `/sprint-plan` runs manually when ready
   - **Rationale**: These are typically not massive multi-sprint efforts. Loa is used for its orderly process, not because scope is huge.

3. **Error recovery**
   - **Decision**: Hook into Loa's existing run mode features
   - **Dependency**: Requires Loa's `/run-halt`, `/run-resume` support
   - **Fallback**: If Loa doesn't support, persist state to `grimoires/sigil/hammer-state.json` for manual resume

4. **Multi-repo hammer work**
   - **Decision**: User explicitly mentions other repo for now
   - **Syntax**: `/craft "build feature" --repo ../backend`
   - **Future**: Loa construct "Hivemind" will surface ecosystem connections and repo relationships automatically
   - **Current scope**: Single repo execution, user orchestrates cross-repo manually

---

## 10. Appendix: Current vs Proposed

| Aspect | Current /craft | Proposed /craft |
|--------|---------------|-----------------|
| Scope detection | None | Hammer vs Chisel |
| Multi-component | Manual | Orchestrated sequence |
| Loa integration | None | **Invokes** Loa commands |
| Observation integration | Basic | Surfaces in analysis |
| Planning | None | Runs /plan-and-analyze |
| Architecture | None | Runs /architect |
| Execution depth | UI only | Full stack (hammer) |
| /distill | Separate command | Absorbed into hammer |
| Artifacts produced | None | PRD, SDD (via Loa) |
| Completion | Partial | Complete feature |

---

## 11. Appendix: Command Absorption

### /distill → Absorbed into Hammer Mode

Current `/distill`:
- Breaks feature into craft-able components
- Identifies physics hints for each
- Outputs component list

In Hammer Mode:
- Same breakdown happens after SDD
- Physics hints derived from SDD architecture
- Immediately proceeds to implementation

**Migration**: `/distill` can remain as standalone for users who want breakdown without implementation, but hammer mode doesn't require it.

---

*PRD generated for Sigil Craft States v1.0.0*
