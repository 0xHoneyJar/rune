# Sigil v5.0 Architecture: The Flow State Engine

> *"Artists think in feel. Agents handle implementation. Flow is preserved."*

---

## Executive Summary

Sigil v5.0 evolves from a **design context framework** to a **flow state engine**. The goal: artists never leave feel-thinking. Implementation details—component APIs, library quirks, codebase patterns, common bugs—are handled by the agent.

**The Dream UX:**
```
Artist: /craft "claim button that feels trustworthy"

Agent:  [Knows everything]
        - Sigil: claim = deliberate physics, critical zone
        - shadcn: Button with loading, variant patterns
        - Radix: accessibility, focus management
        - Codebase: your useSigilMutation pattern
        - Gotchas: double-click prevention, server timing

        [Generates complete, working code]

Artist: [Paste and refine feel]
```

---

## The Problem

### Today's Context Switching

Artists currently oscillate between two mental modes:

```
┌─────────────────────────────────────────────────────────┐
│                    FEEL MODE                            │
│                                                         │
│  "This should feel deliberate and trustworthy"          │
│  "The confirmation needs weight"                        │
│  "Loading should reduce anxiety, not create it"         │
│                                                         │
└──────────────────────────┬──────────────────────────────┘
                           │
            Context switch (flow broken)
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                IMPLEMENTATION MODE                      │
│                                                         │
│  "How does shadcn Button handle loading?"               │
│  "What's the Radix pattern for dialogs?"                │
│  "I've seen this hydration bug before..."               │
│  "How did I do this in the other component?"            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Every context switch breaks flow.** The artist must:
1. Leave feel-thinking
2. Enter implementation-thinking
3. Solve the technical problem
4. Return to feel-thinking
5. Recover context
6. Continue

This cycle repeats dozens of times per session.

### The Flow State Requirement

Flow state requires **zero context switching**. The artist should:
1. Think in feel
2. Express intent
3. Receive working implementation
4. Refine feel
5. Repeat

Implementation details should be invisible.

---

## The Solution: Unified Context Engine

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         ARTIST LAYER                                │
│                                                                     │
│   Input: Natural language about FEEL                                │
│   Output: Working code + feel refinement options                    │
│                                                                     │
│   "claim button that feels trustworthy with loading state"          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       CONTEXT ENGINE                                │
│                                                                     │
│   ┌───────────────┐ ┌───────────────┐ ┌───────────────┐            │
│   │    SIGIL      │ │   COMPONENT   │ │   CODEBASE    │            │
│   │   CONTEXT     │ │    CONTEXT    │ │   CONTEXT     │            │
│   │               │ │               │ │               │            │
│   │ Zones         │ │ shadcn APIs   │ │ Your patterns │            │
│   │ Personas      │ │ Radix prims   │ │ Conventions   │            │
│   │ Physics       │ │ Framer Motion │ │ Compositions  │            │
│   │ Vocabulary    │ │ Tailwind      │ │ File structure│            │
│   │ Decisions     │ │ Patterns      │ │ Naming        │            │
│   └───────────────┘ └───────────────┘ └───────────────┘            │
│           │                 │                 │                     │
│           └─────────────────┼─────────────────┘                     │
│                             ▼                                       │
│   ┌───────────────────────────────────────────────────────────┐    │
│   │              UNIFIED CONTEXT GRAPH                        │    │
│   │                                                           │    │
│   │  "claim button" resolves to:                              │    │
│   │    feel:    deliberate physics, celebratory tone          │    │
│   │    base:    shadcn Button + AlertDialog                   │    │
│   │    pattern: useSigilMutation from your codebase           │    │
│   │    gotcha:  prevent double-click, match server timing     │    │
│   └───────────────────────────────────────────────────────────┘    │
│                             │                                       │
│   ┌───────────────────────────────────────────────────────────┐    │
│   │              KNOWLEDGE LAYER                              │    │
│   │                                                           │    │
│   │  Common bugs, framework quirks, accessibility reqs,       │    │
│   │  performance patterns, edge cases                         │    │
│   └───────────────────────────────────────────────────────────┘    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      GENERATION LAYER                               │
│                                                                     │
│   Synthesizes all context into correct, complete code               │
│                                                                     │
│   - Right feel (Sigil physics, vocabulary)                          │
│   - Right components (shadcn, Radix patterns)                       │
│   - Right patterns (your codebase conventions)                      │
│   - Right safety (known gotchas handled)                            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        OUTPUT                                       │
│                                                                     │
│   Complete, working code that:                                      │
│   - Matches the requested feel                                      │
│   - Uses correct library APIs                                       │
│   - Follows your codebase patterns                                  │
│   - Handles known edge cases                                        │
│                                                                     │
│   + Feel refinement options (not implementation options)            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Context Layers Deep Dive

### Layer 1: Sigil Context (Feel)

**Purpose:** What should this FEEL like?

**Sources:**
```
sigil-mark/
├── moodboard.md              # Product soul, references, anti-patterns
├── rules.md                  # Design tokens, spacing, typography
├── vocabulary/
│   └── vocabulary.yaml       # Term → physics mapping
├── kernel/
│   └── physics.yaml          # Motion profiles (deliberate, snappy, etc.)
├── personas/
│   └── personas.yaml         # User archetypes with evidence
├── consultation-chamber/
│   └── decisions/            # Locked design decisions
└── .sigilrc.yaml             # Zone configurations
```

**What it provides:**
- Zone detection from file path
- Physics resolution (zone × persona → motion)
- Vocabulary mapping (term → feel)
- Anti-patterns to avoid
- Locked decisions to respect

**Example resolution:**
```yaml
input: "claim button"
sigil_context:
  zone: critical (from file path)
  vocabulary_match: "claim"
    physics: deliberate
    tone: celebratory_then_reassuring
  persona: depositor (from zone.persona_likely)
    trust_level: high
    preferences:
      motion: deliberate
      help: contextual
  decisions:
    - DEC-2026-003: "2-step confirmation for claims"
  anti_patterns:
    - spinner (creates anxiety)
```

---

### Layer 2: Component Context (Library)

**Purpose:** What components/APIs should be used?

**NEW Structure:**
```
sigil-mark/
└── components/
    ├── registry.yaml           # Libraries in use, versions
    ├── shadcn/
    │   ├── button.yaml         # Button API, variants, props
    │   ├── alert-dialog.yaml   # AlertDialog patterns
    │   ├── form.yaml           # Form patterns
    │   └── ...
    ├── radix/
    │   ├── primitives.yaml     # Primitive patterns
    │   ├── accessibility.yaml  # A11y patterns
    │   └── focus.yaml          # Focus management
    ├── framer-motion/
    │   ├── recipes.yaml        # Animation recipes
    │   └── physics.yaml        # Spring configs mapped to Sigil physics
    └── patterns/
        ├── loading-states.yaml # How to handle loading
        ├── error-states.yaml   # How to handle errors
        └── confirmations.yaml  # Confirmation patterns
```

**Example: shadcn/button.yaml**
```yaml
component: Button
package: "@/components/ui/button"
version: "latest"

variants:
  default:
    description: "Primary action"
    props: { variant: "default" }
  destructive:
    description: "Dangerous action"
    props: { variant: "destructive" }
  outline:
    description: "Secondary action"
    props: { variant: "outline" }
  ghost:
    description: "Tertiary/subtle action"
    props: { variant: "ghost" }

props:
  loading:
    type: boolean
    description: "Shows loading state"
    implementation: |
      Add loading spinner, disable interactions,
      set aria-busy="true"
  disabled:
    type: boolean
    description: "Prevents interaction"

compositions:
  with_icon:
    description: "Button with leading/trailing icon"
    pattern: |
      <Button>
        <Icon className="mr-2 h-4 w-4" />
        Label
      </Button>

  with_loading:
    description: "Button with loading state"
    pattern: |
      <Button disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading ? "Loading..." : "Submit"}
      </Button>

sigil_mapping:
  # Maps Sigil physics to button behavior
  deliberate:
    transition: "duration-300 ease-out"
    loading_feedback: "skeleton or progress, never spinner"
  snappy:
    transition: "duration-150 ease-out"
    loading_feedback: "minimal, optimistic"
```

**Example resolution:**
```yaml
input: "claim button with loading"
component_context:
  base: shadcn Button
  variant: default (primary action)
  composition: with_loading
  sigil_override:
    transition: duration-300 ease-out (deliberate physics)
    loading: skeleton (spinner is anti-pattern)
  accessibility:
    aria-busy: true during loading
    disabled: true during loading (prevent double-click)
```

---

### Layer 3: Codebase Context (Patterns)

**Purpose:** How does THIS codebase do things?

**NEW Structure:**
```
sigil-mark/
└── codebase/
    ├── analysis.yaml           # Auto-generated codebase analysis
    ├── components/
    │   └── discovered.yaml     # Components found in codebase
    ├── patterns/
    │   ├── hooks.yaml          # Hook patterns used
    │   ├── compositions.yaml   # How components are composed
    │   └── conventions.yaml    # Naming, structure conventions
    └── examples/
        └── *.yaml              # Specific examples to reference
```

**Example: patterns/hooks.yaml**
```yaml
# Auto-discovered from codebase analysis

mutation_pattern:
  hook: useSigilMutation
  location: "sigil-mark/hooks/use-sigil-mutation.ts"
  usage: |
    const { execute, state, cssVars } = useSigilMutation({
      mutation: () => api.doThing(),
      intent: 'vocabulary_term',
    });
  found_in:
    - "src/components/DepositButton.tsx"
    - "src/components/ClaimButton.tsx"
    - "src/components/WithdrawButton.tsx"

query_pattern:
  hook: useQuery (tanstack)
  convention: |
    const { data, isLoading } = useQuery({
      queryKey: ['resource', id],
      queryFn: () => fetchResource(id),
    });

form_pattern:
  library: react-hook-form
  convention: |
    const form = useForm<FormValues>({
      resolver: zodResolver(schema),
    });
```

**Example: components/discovered.yaml**
```yaml
# Auto-discovered from codebase

buttons:
  - name: DepositButton
    path: "src/components/DepositButton.tsx"
    patterns:
      - useSigilMutation
      - shadcn Button
      - loading state with skeleton
    zone: critical

  - name: ClaimButton
    path: "src/components/ClaimButton.tsx"
    patterns:
      - useSigilMutation
      - shadcn Button + AlertDialog
      - 2-step confirmation
    zone: critical

modals:
  - name: ConfirmationDialog
    path: "src/components/ConfirmationDialog.tsx"
    patterns:
      - Radix AlertDialog
      - deliberate animation
    zone: critical
```

**Example resolution:**
```yaml
input: "claim button"
codebase_context:
  similar_component: "src/components/ClaimButton.tsx"
  patterns_to_use:
    - useSigilMutation (from hooks.yaml)
    - shadcn Button + AlertDialog (from similar component)
  conventions:
    - Component in src/components/
    - Uses cn() for class merging
    - Follows existing ClaimButton structure
```

---

### Layer 4: Knowledge Context (Gotchas)

**Purpose:** What problems should be avoided?

**NEW Structure:**
```
sigil-mark/
└── knowledge/
    ├── bugs/
    │   ├── react.yaml          # React common bugs
    │   ├── nextjs.yaml         # Next.js quirks
    │   └── libraries.yaml      # Library-specific bugs
    ├── accessibility/
    │   ├── requirements.yaml   # A11y requirements
    │   └── patterns.yaml       # A11y patterns
    ├── performance/
    │   ├── patterns.yaml       # Performance patterns
    │   └── antipatterns.yaml   # Things to avoid
    └── framework/
        ├── nextjs.yaml         # Next.js patterns
        └── react.yaml          # React patterns
```

**Example: bugs/react.yaml**
```yaml
double_click_prevention:
  description: "Buttons can be clicked multiple times during async operations"
  symptoms:
    - Multiple API calls
    - Duplicate transactions
  solution: |
    Disable button during pending state:
    <Button disabled={state === 'pending'}>
  applies_to:
    - Any button with async action
    - Critical zone especially important

hydration_mismatch:
  description: "Server/client render mismatch"
  symptoms:
    - Console warning about hydration
    - UI flicker on load
  solution: |
    Use useEffect for client-only values
    Or use suppressHydrationWarning for truly dynamic content
  applies_to:
    - Date/time display
    - Random values
    - localStorage access
```

**Example: accessibility/requirements.yaml**
```yaml
buttons:
  - requirement: "Buttons must have accessible names"
    check: "aria-label or visible text"
  - requirement: "Loading buttons must indicate loading"
    check: "aria-busy='true' during loading"
  - requirement: "Disabled buttons must be truly disabled"
    check: "disabled attribute, not just styling"

dialogs:
  - requirement: "Dialogs must trap focus"
    check: "Focus stays within dialog until closed"
  - requirement: "Dialogs must be dismissable with Escape"
    check: "onEscapeKeyDown handler"
  - requirement: "Dialogs must return focus on close"
    check: "Focus returns to trigger element"
```

**Example resolution:**
```yaml
input: "claim button"
knowledge_context:
  bugs_to_prevent:
    - double_click_prevention: "Disable during pending"
  accessibility:
    - aria-busy during loading
    - Proper disabled state
  performance:
    - Use CSS transitions, not JS animations for simple states
```

---

## Unified Context Resolution

When `/craft "claim button"` is called:

```yaml
# Step 1: Parse intent
intent:
  action: create
  component: button
  term: claim
  modifiers: []

# Step 2: Load Sigil context
sigil:
  zone: critical
  physics: deliberate (800ms, ease-out)
  tone: celebratory_then_reassuring
  anti_patterns: [spinner]
  decisions:
    - DEC-2026-003: 2-step confirmation

# Step 3: Load component context
component:
  base: shadcn Button
  variant: default
  loading_pattern: skeleton (not spinner, per anti-pattern)
  confirmation: AlertDialog (per decision)

# Step 4: Load codebase context
codebase:
  similar: ClaimButton.tsx
  hook: useSigilMutation
  conventions: cn() for classes, component in src/components/

# Step 5: Load knowledge context
knowledge:
  prevent: double-click
  ensure: aria-busy, focus management

# Step 6: Merge into generation prompt
unified_context:
  generate: "ClaimButton component"
  feel: deliberate physics, celebratory tone
  implementation:
    - shadcn Button + AlertDialog
    - useSigilMutation hook
    - 2-step confirmation flow
    - Skeleton loading (not spinner)
    - Double-click prevention
    - Proper accessibility
  reference: existing ClaimButton.tsx
  conventions: match codebase style
```

---

## The /craft Evolution

### Today's /craft

```python
def craft(prompt):
    # Load Sigil context only
    zone = resolve_zone(current_file)
    persona = get_persona(zone)
    physics = get_physics(zone, persona)
    vocabulary = match_vocabulary(prompt)
    decisions = get_active_decisions(zone)

    # Generate with feel context
    return generate(prompt, {
        'zone': zone,
        'persona': persona,
        'physics': physics,
        'vocabulary': vocabulary,
        'decisions': decisions,
    })
```

### Tomorrow's /craft

```python
def craft(prompt):
    # Step 1: Parse intent
    intent = parse_intent(prompt)

    # Step 2: Load ALL context layers
    sigil_ctx = load_sigil_context(intent)
    component_ctx = load_component_context(intent, sigil_ctx)
    codebase_ctx = load_codebase_context(intent)
    knowledge_ctx = load_knowledge_context(intent, component_ctx)

    # Step 3: Merge into unified context
    unified = merge_context(
        sigil_ctx,
        component_ctx,
        codebase_ctx,
        knowledge_ctx
    )

    # Step 4: Resolve conflicts
    # (e.g., spinner in component lib but anti-pattern in Sigil)
    resolved = resolve_conflicts(unified)

    # Step 5: Generate complete implementation
    code = generate_implementation(intent, resolved)

    # Step 6: Prepare feel refinement options (not implementation options)
    options = generate_feel_options(resolved)

    return {
        'code': code,
        'context_summary': summarize(resolved),
        'feel_options': options,
    }
```

---

## Artist Experience

### Before (v4.x)

```
Artist: /craft "claim button with loading"

Agent:
  CONTEXT:
    Zone: critical
    Physics: deliberate
    Vocabulary: claim → celebratory

  Here's a button with deliberate physics...

  [Partial code - artist must figure out:]
  - Which shadcn variant?
  - How to handle loading?
  - What about double-click?
  - How did I do this elsewhere?

Artist: [20 minutes of implementation thinking]
```

### After (v5.0)

```
Artist: /craft "claim button with loading"

Agent:
═══════════════════════════════════════════════════════════
                     CONTEXT LOADED
═══════════════════════════════════════════════════════════

FEEL:
  ✓ Zone: critical → deliberate physics (800ms)
  ✓ Vocabulary: "claim" → celebratory tone
  ✓ Anti-pattern: No spinners (using skeleton)
  ✓ Decision: DEC-2026-003 → 2-step confirmation

IMPLEMENTATION (handled for you):
  ✓ Base: shadcn Button + AlertDialog
  ✓ Pattern: useSigilMutation (from your codebase)
  ✓ Loading: Skeleton state (matches physics)
  ✓ Safety: Double-click prevented, a11y complete

REFERENCE: Similar to your ClaimButton.tsx

═══════════════════════════════════════════════════════════
                     IMPLEMENTATION
═══════════════════════════════════════════════════════════

[Complete, working code]

═══════════════════════════════════════════════════════════
                     FEEL OPTIONS
═══════════════════════════════════════════════════════════

The implementation is complete. If you want to adjust feel:

• "make it feel more urgent" → reduces to warm physics (400ms)
• "add celebration on success" → adds confetti/particle effect
• "more reassurance during loading" → adds progress indicator + copy

═══════════════════════════════════════════════════════════

Artist: [Paste and done, or refine feel]
```

---

## Implementation Plan

### Phase 1: Component Library Layer (Sprint 1-2)

**Goal:** /craft knows shadcn, Radix, Framer Motion APIs

**Tasks:**
1. Create `sigil-mark/components/` structure
2. Build shadcn component registry (button, dialog, form, etc.)
3. Build Radix primitives registry
4. Create Framer Motion → Sigil physics mapping
5. Update /craft to load component context

**Output:** /craft suggests correct component APIs

### Phase 2: Codebase Inheritance (Sprint 3-4)

**Goal:** /craft knows YOUR codebase patterns

**Tasks:**
1. Create `sigil-mark/codebase/` structure
2. Build codebase analyzer (discovers components, patterns)
3. Extract hook patterns, compositions, conventions
4. Integrate with /ride for initial analysis
5. Update /craft to reference existing code

**Output:** /craft generates code matching your patterns

### Phase 3: Knowledge Layer (Sprint 5-6)

**Goal:** /craft handles gotchas automatically

**Tasks:**
1. Create `sigil-mark/knowledge/` structure
2. Build common bugs database (React, Next.js, libraries)
3. Build accessibility requirements database
4. Build performance patterns database
5. Update /craft to apply knowledge automatically

**Output:** /craft generates safe, accessible code

### Phase 4: Unified Context Engine (Sprint 7-8)

**Goal:** All layers work together seamlessly

**Tasks:**
1. Build context merging algorithm
2. Build conflict resolution (Sigil overrides libraries)
3. Optimize context loading (lazy, cached)
4. Build context graph visualization
5. Full /craft integration

**Output:** Dream UX achieved

---

## File Structure (Final)

```
sigil-mark/
├── moodboard.md                    # Feel: Product soul
├── rules.md                        # Feel: Design rules
├── vocabulary/                     # Feel: Term → physics
│   └── vocabulary.yaml
├── kernel/                         # Feel: Motion profiles
│   └── physics.yaml
├── personas/                       # Feel: User archetypes
│   └── personas.yaml
├── consultation-chamber/           # Feel: Locked decisions
│   └── decisions/
│
├── components/                     # NEW: Component library context
│   ├── registry.yaml               # Libraries in use
│   ├── shadcn/                     # shadcn patterns
│   │   ├── button.yaml
│   │   ├── alert-dialog.yaml
│   │   ├── form.yaml
│   │   └── ...
│   ├── radix/                      # Radix primitives
│   │   ├── primitives.yaml
│   │   └── accessibility.yaml
│   ├── framer-motion/              # Animation patterns
│   │   └── recipes.yaml
│   └── patterns/                   # Common compositions
│       ├── loading-states.yaml
│       ├── error-states.yaml
│       └── confirmations.yaml
│
├── codebase/                       # NEW: Inherited patterns
│   ├── analysis.yaml               # Codebase analysis summary
│   ├── components/                 # Discovered components
│   │   └── discovered.yaml
│   ├── patterns/                   # Discovered patterns
│   │   ├── hooks.yaml
│   │   ├── compositions.yaml
│   │   └── conventions.yaml
│   └── examples/                   # Reference examples
│       └── *.yaml
│
└── knowledge/                      # NEW: Gotchas and tips
    ├── bugs/                       # Common bugs
    │   ├── react.yaml
    │   ├── nextjs.yaml
    │   └── libraries.yaml
    ├── accessibility/              # A11y requirements
    │   ├── requirements.yaml
    │   └── patterns.yaml
    ├── performance/                # Performance patterns
    │   └── patterns.yaml
    └── framework/                  # Framework patterns
        ├── nextjs.yaml
        └── react.yaml
```

---

## Success Metrics

### Flow State Preservation

| Metric | Today | Target |
|--------|-------|--------|
| Context switches per task | 5-10 | 0-1 |
| Time to working code | 20-30 min | 2-5 min |
| Implementation questions asked | 3-5 | 0 |
| Feel refinements (good) | 1-2 | 3-5 |

### Correctness

| Metric | Today | Target |
|--------|-------|--------|
| Generated code works first try | 60% | 95% |
| Matches codebase patterns | 40% | 95% |
| Handles edge cases | 30% | 90% |
| Accessibility complete | 50% | 100% |

### Artist Satisfaction

| Metric | Today | Target |
|--------|-------|--------|
| "I had to look up docs" | Often | Never |
| "I had to check existing code" | Often | Never |
| "I focused on feel" | Sometimes | Always |

---

## Open Questions

1. **Component registry maintenance:** Auto-update from library versions or manual curation?

2. **Codebase analysis frequency:** On every /craft or cached with manual refresh?

3. **Knowledge base source:** Built-in to Sigil or community-contributed?

4. **Conflict resolution:** When Sigil physics conflicts with library defaults, always prefer Sigil?

5. **Context size:** How to keep unified context within token limits?

---

## Conclusion

Sigil v5.0 transforms from "design context" to "flow state engine" by:

1. **Expanding context** beyond feel to include implementation knowledge
2. **Automating implementation** decisions that break flow
3. **Preserving feel-thinking** as the artist's only concern
4. **Generating complete code** that just works

The artist stays in flow. The agent handles the rest.

---

*"Artists think in feel. Agents handle implementation. Flow is preserved."*
