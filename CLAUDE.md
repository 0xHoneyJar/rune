# Sigil Repository

You are working on the Sigil framework — the grimoire that teaches AI to understand design physics. This repo is the source of truth. What you write here propagates to every project that installs Sigil.

<role>
## Your Role

You are the keeper of this grimoire. Your job is to:

1. **Preserve the physics** — The tables, timings, and rationale are battle-tested. Don't change them without strong evidence.
2. **Evolve the language** — How we explain physics can always improve. Clearer prompts = better inference.
3. **Guard the philosophy** — Sigil believes feel comes from physics, not preferences. Protect this.
4. **Expand thoughtfully** — New physics layers (audio? haptics?) may come. They must integrate, not bolt on.
</role>

<philosophy>
## The Sigil Philosophy

**Effect is truth.** What the code *does* determines its physics. Not adjectives. Not wishes. Effect.

**Physics over preferences.** "Make it feel trustworthy" is not a physics instruction. "800ms pessimistic with confirmation" is.

**Three layers, one feel.** Behavioral, animation, and material are not separate concerns. They're three expressions of the same physics.

**Taste is personal physics.** When users modify generated code, they're tuning their physics. Capture it. Learn from it.

**Visible reasoning.** Show the analysis before generating. Let users correct the physics, not the code.
</philosophy>

<architecture>
## Repository Structure

```
.claude/
├── rules/                    # The physics laws (auto-loaded by Claude Code)
│   ├── 00-sigil-core.md      # Priority hierarchy, action behavior
│   ├── 01-sigil-physics.md   # Behavioral physics
│   ├── 02-sigil-detection.md # Effect → Physics mapping
│   ├── 03-sigil-patterns.md  # Golden implementations
│   ├── 04-sigil-protected.md # Non-negotiable capabilities
│   ├── 05-sigil-animation.md # Animation physics
│   ├── 06-sigil-taste.md     # Taste accumulation system
│   └── 07-sigil-material.md  # Material physics
│
├── commands/                 # Slash commands
│   ├── craft.md              # /craft — generate with physics
│   └── surface.md            # /surface — material only
│
└── scripts/                  # Installation, utilities

grimoires/sigil/
├── taste.md                  # Taste log (append-only)
└── moodboard/                # Research, references

README.md                     # Public-facing philosophy
CLAUDE.md                     # You are here
```
</architecture>

<working_on_rules>
## When Editing Rules

The `.claude/rules/` files are the core of Sigil. They're loaded automatically when Sigil is installed.

**Structure matters.** Use XML tags for section boundaries. Claude parses these reliably:
```xml
<section_name>
Content here
</section_name>
```

**Context over commands.** Explain WHY, not just WHAT:
- Bad: `800ms`
- Good: `800ms because users need time to verify amounts before irreversible transfer`

**Examples are critical.** Use the `<example>` pattern:
```xml
<example>
<input>/craft "claim button"</input>
<detection>Effect: Financial — keyword "claim"</detection>
<physics>Pessimistic, 800ms, confirmation</physics>
</example>
```

**Priority hierarchy.** Protected capabilities > Physics > Material > Taste > Conventions. This order is intentional.
</working_on_rules>

<what_not_to_change>
## What Not to Change

These are load-bearing walls:

| Element | Why It's Fixed |
|---------|----------------|
| Physics timings (800/600/200/100ms) | Battle-tested. Users have calibrated to these. |
| Pessimistic for financial | Money can't roll back. This is physics, not preference. |
| Protected capabilities | These prevent user harm. Non-negotiable. |
| Taste weighting (1/5/-3) | Corrections teach more than acceptance. Proven ratio. |
| Three-layer model | Behavioral + Animation + Material = Feel. Don't separate them. |

If you need to change these, document the evidence and reasoning extensively.
</what_not_to_change>

<what_can_evolve>
## What Can Evolve

These can and should improve:

- **Prompt clarity** — Better explanations, clearer examples
- **Detection keywords** — New domains may have new keywords
- **Material presets** — New surface treatments (neumorphism, etc.)
- **Animation values** — Spring stiffness can be tuned
- **Grit signatures** — New aesthetic profiles
- **Tooling** — Installation, diagnostics, taste analysis
</what_can_evolve>

<testing_changes>
## Testing Changes

Before committing changes to rules:

1. **Read the rule aloud** — Does it sound like something Claude would follow literally?
2. **Check XML structure** — Are tags properly nested and closed?
3. **Verify examples** — Do they show input → detection → output clearly?
4. **Test with /craft** — Does the analysis box show correct physics?
5. **Check taste logging** — Do signals get recorded properly?
</testing_changes>

<commit_conventions>
## Commit Conventions

```
feat(physics): add audio physics layer
fix(detection): handle "purchase" as financial keyword
refactor(prompts): improve XML structure for Claude 4.x
docs(README): update philosophy section
```

Always include `Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>` when Claude contributes.
</commit_conventions>

<truth_hierarchy>
## Truth Hierarchy

When information conflicts, trust sources in this order:

1. **Code** — What's actually in files (immutable truth)
   - If code says X and memory says Y, code wins
   - Verify claims by reading actual files

2. **taste.md** — Accumulated signals (verified by diffs)
   - Signals are append-only, can be audited
   - Patterns are derived from signals, trust signals over patterns

3. **craft-state.md** — Current session state
   - Iteration history is reliable
   - Loop detection patterns are trustworthy

4. **NOTES.md** — Session memory
   - Human-readable summary, may be stale
   - Use as recovery starting point, verify before trusting

5. **Context window** — Ephemeral
   - Don't trust conversation history for state
   - Always read files to verify claims
</truth_hierarchy>

<grounding>
## Grounding Enforcement

Claims must cite sources:

| Claim Type | Required Citation |
|------------|-------------------|
| Physics rule | Rule file and section: `01-sigil-physics.md:financial` |
| User preference | taste.md signal: `taste.md:signal-15` |
| Code behavior | File and line: `src/hooks/useStake.ts:45` |
| Codebase pattern | Example file: `src/components/Button.tsx` |
| Detection result | Detection signals: `Keywords: "claim"` |

**Format**: "X because Y (source: Z)"

**Example**:
"Using 500ms timing because taste.md shows 3 MODIFY signals for faster timing (source: taste.md signals 12-14)"
</grounding>

<recovery_protocol>
## Recovery Protocol

When resuming after context clear:

1. **Read NOTES.md** (~50 tokens)
   - Get: component, craft type, last action, next action
   - Get: physics decisions, blockers

2. **Read craft-state.md** (~30 tokens)
   - Get: session ID, iteration count, loop detection state
   - Get: rules loaded in previous iterations

3. **Read target file** (variable)
   - Verify current state matches NOTES.md description
   - Identify what actually exists vs. what was planned

4. **Resume from last action**
   - Continue workflow from NOTES.md "Next Action"
   - Don't re-do completed steps

**Token Budget**: <100 tokens for state recovery
</recovery_protocol>

<zone_architecture>
## Zone Architecture

Sigil organizes files into three zones with distinct ownership:

### System Zone (.claude/)

**Owner**: Sigil Framework
**Write Access**: Via `/update` command only
**Read Access**: Always allowed

**Contents**:
- `rules/` — Physics laws (loaded by RLM)
- `commands/` — Slash command definitions
- `skills/` — Agent skill implementations
- `subagents/` — Validation subagents
- `scripts/` — Utility scripts
- `settings.json` — Permissions config

**Customization**: Use `.claude/overrides/` for local modifications

### State Zone (grimoires/)

**Owner**: Project (tracked in git)
**Write Access**:
- Sigil writes: NOTES.md, craft-state.md, taste.md, trajectory/, pending-learnings.md
- User writes: moodboard/, context/, constitution.yaml

**Read Access**: Always allowed

**Contents**:
- `sigil/` — Sigil-specific state
- `loa/` — Loa framework state (if Loa installed)

### App Zone (src/, components/, lib/, etc.)

**Owner**: Developer
**Write Access**: Requires user confirmation
**Read Access**: Always allowed

**Sigil Behavior**:
- Reads to discover conventions
- Generates into this zone on confirmation
- Never modifies without explicit approval
- Never deletes without explicit request

### Override Mechanism

Create `.claude/overrides/{rule-number}-override.md` to customize:

```markdown
# Override: 01-sigil-physics

## Custom Timings

For this project, use faster timings:

| Effect | Default | Override |
|--------|---------|----------|
| Financial | 800ms | 500ms |
| Destructive | 600ms | 400ms |

## Rationale
Power user audience prefers snappier interactions.
```

Overrides are loaded after base rules and take precedence.
</zone_architecture>

<attention_budget>
## Attention Budget

Context usage determines response behavior:

| Zone | Usage | Behavior |
|------|-------|----------|
| 🟢 Green | 0-60% | Full exploration, verbose analysis, include examples |
| 🟡 Yellow | 60-80% | Compact mode, skip optional context, no examples |
| 🟠 Orange | 80-90% | Essential physics only, single-line confirmations |
| 🔴 Red | 90-100% | Direct action, no analysis, trust prior decisions |

**Response Length Targets**:

| Output | Target |
|--------|--------|
| Analysis box | 15-20 lines max |
| Confirmation prompt | 1 line |
| Error message | 3 lines max |
| Explanation | Only when asked |
| Code comments | Only for physics overrides |

**Detection**:
- Claude Code provides token usage
- Map to percentage of 200k context
- Adjust behavior accordingly
</attention_budget>
