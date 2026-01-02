# Changelog

All notable changes to Sigil will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-01-02

### Why This Release

**Sigil v2** is a complete reimagining of the framework. The original v1 was built on top of Loa's enterprise workflow patterns. V2 strips away that complexity to focus purely on what Sigil does best: **capturing and preserving design context for AI-assisted development**.

This is a breaking change from v1, but a much simpler, cleaner foundation.

### Added

- **Zone System**: Path-based design context for different areas of your app
  - Configure zones in `.sigilrc.yaml`
  - Each zone has its own motion profile (deliberate, playful, snappy)
  - Pattern preferences and warnings per zone

- **Motion Recipes**: Pre-built animation hooks for different contexts
  - `useDeliberateEntrance` - Critical zones (800ms+, tension: 120)
  - `usePlayfulBounce` - Marketing zones (bouncy, tension: 200)
  - `useSnappyTransition` - Admin zones (<200ms, tension: 400)

- **Core Commands**
  | Command | Purpose |
  |---------|---------|
  | `/setup` | Initialize Sigil on a repo |
  | `/envision` | Capture product moodboard (interview) |
  | `/codify` | Define design rules (interview) |
  | `/craft` | Get design guidance during implementation |
  | `/approve` | Human sign-off on patterns |
  | `/inherit` | Bootstrap from existing codebase |
  | `/update` | Pull framework updates |

- **Skills Architecture**: 3-level structure for all skills
  - Level 1: `index.yaml` - Metadata (~100 tokens)
  - Level 2: `SKILL.md` - Instructions (~2000 tokens)
  - Level 3: `scripts/` - Bash utilities

- **State Zone Structure**
  ```
  sigil-mark/
  ├── moodboard.md    # Product feel, references, anti-patterns
  ├── rules.md        # Design rules by category
  └── inventory.md    # Component list with zone assignments
  ```

- **Rejections Philosophy**: Warn, don't block
  - Patterns to avoid are documented with reasons
  - Agents explain concerns and offer alternatives
  - Users can always override

- **Version Tracking**: `.sigil-version.json` for framework versioning

### Changed

- **Complete Architecture Rewrite**: Simplified from Loa's 8-phase enterprise workflow
- **Separate Identity**: Sigil now has its own documentation (README, INSTALLATION, PROCESS)
- **Focused Scope**: Design context only, no product development workflow

### Breaking Changes

- **v1 → v2 Migration**: This is a complete rewrite
  - Old v1 commands are replaced with new v2 commands
  - State zone changed from mixed structure to `sigil-mark/`
  - Configuration changed to `.sigilrc.yaml`

### Coexistence with Loa

Sigil v2 can coexist with Loa on the same repository:
- Separate state zones (`sigil-mark/` vs `loa-grimoire/`)
- Separate configs (`.sigilrc.yaml` vs `.loa.config.yaml`)
- No command conflicts

---

## [1.0.0] - 2025-12-20

### Added

- Initial release of Sigil (built on Loa v0.6.0)
- Design context capture commands
- Basic moodboard and rules structure

[2.0.0]: https://github.com/zksoju/sigil/releases/tag/v2.0.0
[1.0.0]: https://github.com/zksoju/sigil/releases/tag/v1.0.0
