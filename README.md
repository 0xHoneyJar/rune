# Sigil

> *"The guild's mark on approved work."*

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](CHANGELOG.md)
[![License](https://img.shields.io/badge/license-AGPL--3.0-green.svg)](LICENSE.md)

Craftsman-focused design system framework that captures, curates, and showcases component taste. The agent learns your taste so it stops fighting you.

## Quick Start

### Mount onto Existing Repository

```bash
# One-liner install
curl -fsSL https://raw.githubusercontent.com/0xHoneyJar/sigil/main/scripts/mount.sh | bash

# Start Claude Code
claude

# Capture your first component
/sigil taste ClaimButton
```

### What Sigil Does

```
You: "Build a loading state"
Agent: [greps: @rejected.*spinner, @rejected.*skeleton]
       "You rejected spinners (anxious) and skeletons (clinical).
        Using JoyfulLoader pattern."
```

Sigil stores your design decisions in JSDoc, discovers them via semantic search, and teaches the agent your taste.

## The 4 Questions

Every component capture asks:

| # | Question | Maps To |
|---|----------|---------|
| 1 | "What PROBLEM does this solve?" | `@description` |
| 2 | "How should it FEEL?" | `@feel` + `@intent` |
| 3 | "What did you REJECT?" | `@rejected` |
| 4 | "Any REFERENCES for this vibe?" | `@inspiration` |

## Commands

| Command | Purpose |
|---------|---------|
| `/sigil mount` | Install Sigil onto your repo |
| `/sigil taste` | Capture component taste |
| `/sigil taste [name]` | Capture single component |
| `/sigil taste graduate [name]` | Promote Silver → Gold |
| `/sigil taste --list` | Show tier inventory |
| `/sigil query [query]` | Semantic search across captures |
| `/sigil export` | Generate JSON/MDX for showcase |
| `/sigil showcase` | Launch local preview |

## Tier System

| Tier | Meaning | Requirements |
|------|---------|--------------|
| (none) | Uncaptured | No interview done |
| **Silver** | Captured | 4 questions answered |
| **Gold** | Proven | Silver + 2+ weeks production + taste owner + physics |

## JSDoc Example

```typescript
/**
 * @component ClaimButton
 *
 * @description
 * Users didn't know if their claim went through.
 * They rage-clicked because feedback was too subtle.
 *
 * @intent [J] Reduce My Anxiety
 *
 * @feel Heavy, deliberate. Sacrifice speed for certainty.
 *
 * @inspiration
 * - Bank vault doors: weight = security
 * - Old Mac startup chime: deliberate, confident
 *
 * @rejected instant-feedback, spinner, skeleton
 *
 * @tier gold
 * @tasteOwner soju
 * @physics {"type":"spring","tension":120,"friction":14,"delay":200}
 */
```

## Sigil vs Loa

| Aspect | Loa (Architect) | Sigil (Craftsman) |
|--------|-----------------|-------------------|
| **Focus** | Backend, infrastructure, planning | Frontend, user-facing, execution |
| **Approach** | Top-down (PRD → SDD → Sprint) | Bottom-up (details → patterns) |
| **Metaphor** | Spirits that ride with you | Guild that marks approved work |

Both can be installed on the same project. Use Loa for planning, Sigil for frontend taste.

## File Structure (After Mount)

```
your-repo/
├── .claude/
│   ├── skills/sigil-*/     ← Symlinks to framework
│   └── commands/sigil-*/   ← Symlinks to framework
├── src/components/
│   ├── Button.tsx          ← @tier silver
│   └── ClaimButton.tsx     ← @tier gold, @physics
├── sigil-showcase/         ← Created by mount
│   ├── moodboards/
│   ├── exports/
│   └── showcase/           ← Next.js app
└── .sigil-version.json
```

## Dependencies

| Tool | Required | Install |
|------|----------|---------|
| CK | For semantic search | `cargo install ck-search` |
| yq | For YAML parsing | `brew install yq` |

## Why "Sigil"?

A **sigil** is a medieval seal or symbol of identity. In craft guilds, masters marked their approved work with a sigil.

In Sigil, each component gets its mark - the `@tier`, `@feel`, `@rejected` tags that define its taste. Uncaptured → Silver → Gold mirrors Apprentice → Journeyman → Master.

## Philosophy

| Principle | Description |
|-----------|-------------|
| **Bottom-up** | Start from details, let patterns emerge |
| **Reference-driven** | Use "guiding star" products to evoke feelings |
| **Iterative** | End state discovered through refinement |
| **Detail-first** | Extra care in purposeful, creative approaches |

## Documentation

- **[INSTALLATION.md](INSTALLATION.md)** - Detailed setup guide
- **[CLAUDE.md](CLAUDE.md)** - Agent instructions
- **[vocabulary/vocabulary.md](vocabulary/vocabulary.md)** - JTBD labels

## License

[AGPL-3.0](LICENSE.md)

## Links

- [Repository](https://github.com/0xHoneyJar/sigil)
- [Issues](https://github.com/0xHoneyJar/sigil/issues)
- [Loa (Architect Framework)](https://github.com/0xHoneyJar/loa)
