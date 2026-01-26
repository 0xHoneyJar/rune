# Anthropic Oracle Analysis: Claude Code Best Practices

**Date:** 2026-01-25
**Focus:** Skill design, rule loading, feedback loops, minimal viable patterns
**Sources:** code.claude.com official documentation

---

## Executive Summary

1. **CLAUDE.md should be under ~500 lines** - Anthropic explicitly recommends keeping it concise. If Claude does something correctly without an instruction, remove it. Bloated files cause Claude to ignore actual instructions.

2. **Skills are the recommended extension pattern** - Not custom rule files. Skills load on-demand, support slash command invocation, and can run in isolated subagent contexts.

3. **Context is the fundamental constraint** - Everything in Sigil should be evaluated against "does this consume context unnecessarily?" The best practices doc states: "Most best practices are based on one constraint: Claude's context window fills up fast, and performance degrades as it fills."

4. **Verification beats instructions** - "Give Claude a way to verify its work. This is the single highest-leverage thing you can do." Tests, screenshots, expected outputs > detailed rules.

5. **Human-in-the-loop = interruption, not gates** - Claude Code's model is "interrupt and steer" not "approve every step." The feedback loop is conversational course-correction, not modal confirmations.

---

## Key Findings by Topic

### 1. Skill Design Best Practices

**From Anthropic's Skills Documentation:**

| Do | Don't |
|---|---|
| Keep SKILL.md under 500 lines | Create monolithic instruction files |
| Use `disable-model-invocation: true` for workflows with side effects | Let Claude auto-trigger deployment/commit workflows |
| Put detailed reference in separate files, referenced from SKILL.md | Load everything into the main skill file |
| Write clear descriptions so Claude knows when to use the skill | Use vague descriptions that cause wrong skill selection |
| Use frontmatter to control invocation (`user-invocable`, `disable-model-invocation`) | Rely on Claude's judgment for sensitive operations |

**Skill Types (Anthropic's categorization):**
- **Reference content**: Knowledge Claude applies to current work (conventions, patterns, style guides)
- **Task content**: Step-by-step instructions for specific actions (deploy, commit, review)

**Key insight:** "For skills you invoke manually, set `disable-model-invocation: true` to keep descriptions out of context until you need them."

### 2. Rule Loading Strategies

**Anthropic's recommended architecture:**

```
CLAUDE.md (always loaded, <500 lines)
├── Project conventions
├── Build commands
├── "Always do X" rules
└── @imports for additional files

.claude/rules/*.md (conditional loading via paths: frontmatter)
├── Path-specific rules
└── Only loaded when working with matching files

.claude/skills/<name>/SKILL.md (on-demand)
├── Reference material
├── Invocable workflows
└── Full content loads only when used
```

**Path-specific rules** (this is the RLM pattern Anthropic supports):
```yaml
---
paths:
  - "src/api/**/*.ts"
---
# API Development Rules
- All API endpoints must include input validation
```

Rules without `paths:` field load unconditionally.

**Context costs:**
| Feature | When it loads | Context cost |
|---------|---------------|--------------|
| CLAUDE.md | Session start | Every request |
| Skills | Descriptions at start, full content when used | Low (descriptions only)* |
| Rules with paths: | When working with matching files | Conditional |

*Skills with `disable-model-invocation: true` have zero cost until invoked.

### 3. Feedback Loop Design

**Anthropic's approach is NOT confirmation-based. It's conversational:**

> "You're part of this loop too. You can interrupt at any point to steer Claude in a different direction, provide additional context, or ask it to try a different approach."

**Key patterns:**
1. **Interrupt and steer**: Press `Esc` to stop mid-action, type correction, continue
2. **Rewind**: `Esc Esc` or `/rewind` to restore previous state
3. **Course-correct early**: "Correct Claude as soon as you notice it going off track"

**The feedback loop is:**
```
You describe task → Claude works → You interrupt/correct if wrong → Claude adjusts
```

**NOT:**
```
Claude proposes → You approve → Claude executes → You approve next step
```

**Anti-pattern from Anthropic's docs:**
> "If you've corrected Claude more than twice on the same issue in one session, the context is cluttered with failed approaches. Run `/clear` and start fresh with a more specific prompt."

**This invalidates Sigil's multi-step confirmation patterns for most use cases.**

### 4. Minimal Viable Agent Workflows

**Anthropic's recommended minimal setup:**

1. **CLAUDE.md** - Project conventions (~500 lines max)
2. **Skills for workflows** - `/deploy`, `/review`, etc.
3. **Verification** - Tests, not rules

That's it. No complex physics systems, no multi-layer rule hierarchies.

**From Best Practices:**
> "For each line [in CLAUDE.md], ask: 'Would removing this cause Claude to make mistakes?' If not, cut it."

**Subagents for isolation:**
- Use when task produces verbose output
- Use when enforcing specific tool restrictions
- Use when work is self-contained

**NOT:**
- Complex verification pipelines
- Multi-step approval workflows
- Parallel validation agents

### 5. Anti-Patterns in Skill/Rule Design

**Explicitly called out by Anthropic:**

| Anti-Pattern | Problem | Fix |
|--------------|---------|-----|
| Kitchen sink session | Context full of irrelevant info | `/clear` between unrelated tasks |
| Over-specified CLAUDE.md | Important rules get lost in noise | Ruthlessly prune |
| Correcting over and over | Context polluted with failed approaches | `/clear` and better initial prompt |
| Infinite exploration | Claude reads hundreds of files | Scope investigations narrowly |
| Trust-then-verify gap | Plausible but incorrect output | Provide verification (tests) |

**From the docs:**
> "If Claude already does something correctly without the instruction, delete it."

---

## Gap Analysis: Sigil vs Anthropic Recommendations

### What Sigil Does That Anthropic Doesn't Recommend

| Sigil Pattern | Anthropic Guidance | Gap |
|--------------|-------------------|-----|
| 25+ rule files loaded via RLM | Use path-specific rules in `.claude/rules/` with `paths:` frontmatter | Sigil's RLM is more complex than needed |
| Physics tables in every rule | "If Claude does it correctly without the instruction, delete it" | Much of the physics could be implicit |
| Multi-step confirmation flows | "Interrupt and steer" not modal approvals | Confirmation pattern is non-standard |
| Anchor/Lens CLI validation | Verification should be tests/screenshots | CLI validation adds complexity |
| Taste accumulation system | No equivalent - Claude doesn't persist preferences | Over-engineering for no persistence |
| Complex detection algorithms | Claude naturally detects intent from context | Detection is redundant |

### What Anthropic Recommends That Sigil Could Adopt

| Anthropic Pattern | Sigil Equivalent | Recommendation |
|------------------|------------------|----------------|
| `disable-model-invocation: true` for side-effect skills | Not used | Add to /craft, /commit, /deploy skills |
| Path-specific rules via `paths:` frontmatter | RLM keyword detection | Simpler, more reliable |
| Subagents for isolation | Parallel validation | Use for research, not validation |
| 500-line CLAUDE.md limit | No limit | Enforce limit, move content to skills |
| Verification via tests | Anchor/Lens validation | Tests are simpler and more effective |

---

## Recommended Actions

### Priority 1: Cut Bloat (High Impact, Low Effort)

1. **Consolidate rule files** - Merge the 25+ rule files into:
   - `CLAUDE.md` (~500 lines, always-on conventions)
   - `rules/web3.md` with `paths: ["**/*.sol", "src/**/web3/**"]`
   - `rules/react.md` with `paths: ["**/*.tsx", "**/*.jsx"]`
   - Skills for workflows (`/craft`, `/validate`, `/commit`)

2. **Delete detection logic** - Claude naturally detects Financial/Destructive from context. The keyword tables in `08-sigil-lexicon.md` are unnecessary.

3. **Remove taste accumulation** - Claude doesn't persist between sessions. The signal logging is useless unless you're building a separate learning system.

4. **Remove Anchor/Lens validation** - Replace with "run the tests" verification.

### Priority 2: Adopt Anthropic Patterns (Medium Impact, Medium Effort)

1. **Convert complex rules to skills** - Each major capability becomes a skill:
   - `/craft` - Generate with physics (skill with `disable-model-invocation: true`)
   - `/validate` - Check against physics (skill)
   - `/diagnose` - User feedback analysis (skill)

2. **Use `paths:` frontmatter** - Replace RLM trigger detection with native path matching.

3. **Simplify feedback loop** - Replace confirmation modals with:
   - Show analysis
   - Generate code
   - Let user interrupt/correct if wrong

### Priority 3: Restructure (High Impact, High Effort)

1. **Rewrite CLAUDE.md** - Single file, ~500 lines, covering:
   - Core philosophy (physics = feel)
   - Key timings (Financial: 800ms, Destructive: 600ms, etc.)
   - Protected capabilities
   - Build/test commands

2. **Convert workflows to skills** - Each workflow becomes a skill directory:
   ```
   .claude/skills/
   ├── craft/SKILL.md (the main generation workflow)
   ├── physics/SKILL.md (reference: physics tables)
   ├── patterns/SKILL.md (reference: golden patterns)
   └── web3/SKILL.md (reference: web3 patterns)
   ```

3. **Remove redundant layers** - The physics/animation/material separation is implementation detail, not user-facing. Collapse into single "feel" guidance.

---

## Minimum Viable Sigil

Based on Anthropic's guidance, here's what a minimal effective Sigil would look like:

### CLAUDE.md (~200 lines)

```markdown
# Sigil Design Physics

## Core Principle
Effect determines physics. What the code DOES determines timing, sync, and confirmation.

## Quick Reference
| Effect | Sync | Timing | Confirmation |
|--------|------|--------|--------------|
| Financial | Pessimistic | 800ms | Required |
| Destructive | Pessimistic | 600ms | Required |
| Standard | Optimistic | 200ms | None |
| Local | Immediate | 100ms | None |

## Protected Capabilities (Non-Negotiable)
- Withdraw: Always reachable
- Cancel: Always visible
- Balance: Always accurate
- Touch targets: 44px minimum
- Focus ring: Always visible

## Commands
- `pnpm test` - Run tests
- `pnpm lint` - Run linter

## Conventions
- Use existing patterns from codebase
- Match discovered animation library
- Pessimistic for money, optimistic for everything else
```

### Skills

```
.claude/skills/
├── craft/
│   └── SKILL.md (main generation workflow, disable-model-invocation: true)
├── physics-reference/
│   └── SKILL.md (detailed physics tables, user-invocable: false)
└── patterns/
    └── SKILL.md (golden implementations, user-invocable: false)
```

### Rules (with paths:)

```
.claude/rules/
├── web3.md (paths: ["**/*.sol", "**/web3/**"])
└── react.md (paths: ["**/*.tsx"])
```

**Total: ~1000 lines of content instead of ~5000+**

---

## Sources

- https://code.claude.com/docs/en/best-practices
- https://code.claude.com/docs/en/memory
- https://code.claude.com/docs/en/skills
- https://code.claude.com/docs/en/sub-agents
- https://code.claude.com/docs/en/features-overview
- https://code.claude.com/docs/en/how-claude-code-works
- https://code.claude.com/docs/en/settings
- https://code.claude.com/docs/en/common-workflows
