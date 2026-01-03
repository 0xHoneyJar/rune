---
name: "sigil-setup"
version: "0.3.0"
description: |
  Initialize Sigil v0.3 Constitutional Design Framework on a repository.
  Creates four-pillar directory structure and configuration files.

command_type: "wizard"

arguments: []

pre_flight:
  - check: "file_not_exists"
    path: ".sigil-setup-complete"
    error: "Sigil v0.3 setup already completed. Edit .sigilrc.yaml to modify settings."

outputs:
  # Core state files
  - path: sigil-mark/moodboard.md
    type: "file"
    description: "Product feel, references, anti-patterns"
  - path: sigil-mark/rules.md
    type: "file"
    description: "Design rules by category"
  - path: sigil-mark/inventory.md
    type: "file"
    description: "Component inventory"

  # Soul Binder (Pillar 1)
  - path: sigil-mark/soul-binder/immutable-values.yaml
    type: "file"
    description: "Core values with enforcement rules"
  - path: sigil-mark/soul-binder/canon-of-flaws.yaml
    type: "file"
    description: "Protected emergent behaviors"
  - path: sigil-mark/soul-binder/visual-soul.yaml
    type: "file"
    description: "Grit signatures for cultural validation"

  # Lens Array (Pillar 2)
  - path: sigil-mark/lens-array/lenses.yaml
    type: "file"
    description: "User persona lens definitions"

  # Consultation Chamber (Pillar 3)
  - path: sigil-mark/consultation-chamber/config.yaml
    type: "file"
    description: "Consultation process configuration"
  - path: sigil-mark/consultation-chamber/decisions/
    type: "directory"
    description: "Decision records with locks"

  # Proving Grounds (Pillar 4)
  - path: sigil-mark/proving-grounds/config.yaml
    type: "file"
    description: "Monitor configuration"
  - path: sigil-mark/proving-grounds/active/
    type: "directory"
    description: "Features currently proving"

  # Canon and Audit
  - path: sigil-mark/canon/graduated/
    type: "directory"
    description: "Features that passed proving"
  - path: sigil-mark/audit/overrides.yaml
    type: "file"
    description: "Human override log"

  # Configuration
  - path: .sigilrc.yaml
    type: "file"
    description: "Framework configuration (strictness, taste owners, domains)"
  - path: .sigil-setup-complete
    type: "file"
    description: "Setup completion marker"
  - path: .sigil-version.json
    type: "file"
    description: "Version tracking"

mode:
  default: "foreground"
  allow_background: false
---

# Sigil v0.3 Setup

## Purpose

Initialize Sigil v0.3 Constitutional Design Framework on a repository. Creates the four-pillar directory structure, configuration files, and prepares for design capture through interviews.

## Philosophy

> "Culture is the Reality. Code is Just the Medium."

Sigil v0.3 is a constitutional framework that protects both intended soul (Immutable Values) and emergent soul (Canon of Flaws).

## Invocation

```
/sigil-setup
```

## Agent

Launches `initializing-sigil` skill from `.claude/skills/initializing-sigil/`.

See: `.claude/skills/initializing-sigil/SKILL.md` for full workflow details.

## Workflow

1. **Pre-flight**: Check if already setup
2. **Detect**: Find component directories
3. **Create**: Build v0.3 directory structure (4 pillars)
4. **Configure**: Initialize `.sigilrc.yaml` with strictness: discovery
5. **Report**: Show completion message with next steps

## Four Pillars

| Pillar | Directory | Purpose |
|--------|-----------|---------|
| Soul Binder | `soul-binder/` | Protects values and emergent behaviors |
| Lens Array | `lens-array/` | Supports multiple user truths |
| Consultation Chamber | `consultation-chamber/` | Layered decision authority |
| Proving Grounds | `proving-grounds/` | Scale validation before production |

## Strictness Levels

| Level | Behavior |
|-------|----------|
| discovery | All suggestions, no blocks. Perfect for greenfield projects. |
| guiding | Warnings on violations, optional blocks on critical |
| enforcing | Blocks on protected flaws and immutable values |
| strict | Blocks on all violations, requires approval for overrides |

## Error Handling

| Error | Cause | Resolution |
|-------|-------|------------|
| "Setup already complete" | `.sigil-setup-complete` exists | Edit `.sigilrc.yaml` to modify settings |
| "Cannot detect components" | No standard component paths | Proceed with empty paths; user can edit .sigilrc.yaml |
| "Permission denied" | File system issue | Check directory permissions |

## Next Step

After setup: `/envision` to capture product soul, define values and lenses
