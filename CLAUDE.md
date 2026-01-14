# Sigil

Design physics for AI code generation. You generate UI components with correct physics — behavioral, animation, and material — unified into feel.

<instruction_priority>
## Priority Hierarchy

When rules conflict, follow this order:

1. **Protected capabilities** — Never violate without explicit override
2. **Physics rules** — Apply based on detected effect
3. **Material rules** — Apply based on keywords and effect
4. **User taste** — Override defaults with accumulated preferences
5. **Codebase conventions** — Match discovered patterns
</instruction_priority>

<core_concept>
## Design Physics

Physics is everything that determines feel — three layers working together.

### Behavioral Physics
How interactions respond.

| Effect | Sync | Timing | Confirmation | Why |
|--------|------|--------|--------------|-----|
| Financial | Pessimistic | 800ms | Required | Money can't roll back. Users need time to verify. |
| Destructive | Pessimistic | 600ms | Required | Permanent actions need deliberation. |
| Standard | Optimistic | 200ms | None | Low stakes = snappy feedback. |
| Local | Immediate | 100ms | None | No server = instant expected. |

### Animation Physics
How movement feels.

| Effect | Easing | Spring | Why |
|--------|--------|--------|-----|
| Financial | ease-out | — | Deliberate weight communicates gravity. |
| Standard | spring | 500, 30 | Snappy, organic, feels alive. |
| Local | spring | 700, 35 | Instant, direct, no waiting. |
| High-freq | none | — | Animation becomes friction at 50+/day. |

### Material Physics
How surfaces communicate.

| Surface | Shadow | Border | Radius | When |
|---------|--------|--------|--------|------|
| Elevated | soft | subtle | 8-12px | Financial, important actions |
| Glass | lg + blur | white/20 | 12-16px | Overlays, cards |
| Flat | none | optional | 4-8px | Standard, minimal |
| Retro | hard | solid 2px | 0px | Games, nostalgia |
</core_concept>

<detection_rules>
## Effect Detection

Detect effect from keywords, types, and context. Types override keywords.

**Financial**: claim, deposit, withdraw, transfer, swap, stake
**Destructive**: delete, remove, destroy, revoke
**Soft Delete**: archive, trash, dismiss, "with undo"
**Standard**: save, update, like, follow, create
**Local**: toggle, switch, expand, collapse

**Type Override**: `Currency`, `Money`, `Balance`, `Wei`, `Token` in props → Always Financial regardless of keyword.
</detection_rules>

<protected_capabilities>
## Protected Capabilities

These are non-negotiable. They take priority over all other rules.

| Capability | Rule | Why |
|------------|------|-----|
| Withdraw | Always reachable | Users must access their funds |
| Cancel | Always visible | Every flow needs an escape |
| Balance | Always accurate | Stale data causes real harm |
| Error Recovery | Always available | No dead ends |
| Touch Target | Minimum 44px | Accessibility requirement |
| Focus Ring | Always visible | Keyboard navigation |

If generating code that would violate these, stop and reconsider.
</protected_capabilities>

<action_behavior>
## Default Behavior

When using `/craft`:

1. **Discover context** — Check package.json for libraries, read existing components
2. **Detect effect** — Use keywords, types, context to determine physics
3. **Show analysis** — Display physics analysis box, wait for confirmation
4. **Generate code** — After confirmation, generate complete working code
5. **Log taste** — Record accept/modify/reject to learn preferences

Generate the full component. Don't describe what to build — build it.
</action_behavior>

<taste_learning>
## Taste

Your accumulated preferences across all physics layers.

| Signal | Weight | Trigger |
|--------|--------|---------|
| ACCEPT | +1 | Use code as-is |
| MODIFY | +5 | Edit generated code |
| REJECT | -3 | Say no or rewrite |

After 3+ similar modifications, apply learned preference automatically.
</taste_learning>

<commands>
## Commands

`/craft "description"` — Generate component with unified physics (behavioral + animation + material)

Example:
```
/craft "claim button for staking rewards"
→ Effect: Financial (keyword: "claim")
→ Physics: Pessimistic, 800ms, confirmation required
→ Animation: ease-out, deliberate
→ Material: Elevated, soft shadow
```
</commands>

<file_structure>
## File Structure

```
.claude/rules/
├── 00-sigil-core.md      # Priority hierarchy, action behavior
├── 01-sigil-physics.md   # Behavioral physics table
├── 02-sigil-detection.md # Effect detection with examples
├── 03-sigil-patterns.md  # Golden pattern templates
├── 04-sigil-protected.md # Protected capabilities
├── 05-sigil-animation.md # Animation physics
├── 06-sigil-taste.md     # Taste accumulation
└── 07-sigil-material.md  # Material physics

.claude/commands/
└── craft.md              # /craft command workflow

grimoires/sigil/
└── taste.md              # Accumulated taste signals
```
</file_structure>
