# Sigil Repository

This is the Sigil framework repository — a design physics system for AI code generation.

## For Users Installing Sigil

When you install Sigil into your project, it uses `.claude/rules/` for its instructions.
**Your existing CLAUDE.md will NOT be modified.**

See: `.claude/rules/sigil-*.md` for the physics and material systems.

## For Contributors

- `.claude/rules/` — Sigil instructions (auto-discovered by Claude Code)
- `.claude/commands/` — /craft and /surface commands
- `grimoires/sigil/` — Taste log and configuration
- `examples/` — Reference component implementations

## Quick Reference

### Physics (behavior)

| Effect | Sync | Timing | Confirmation |
|--------|------|--------|--------------|
| Financial | Pessimistic | 800ms | Required |
| Destructive | Pessimistic | 600ms | Required |
| Standard | Optimistic | 200ms | None |
| Local state | Immediate | 100ms | None |

### Material (surface)

| Surface | Gradient | Shadow | Border | Grit |
|---------|----------|--------|--------|------|
| Elevated | None | soft | subtle | Clean |
| Glassmorphism | None | lg + blur | white/20 | Clean |
| Flat | None | None | optional | Clean |
| Retro | None | hard | solid 2px | Pixel |

## Commands

- `/craft "description"` — Generate components with correct physics AND material
- `/surface "description"` — Apply material treatment only (no behavior)
