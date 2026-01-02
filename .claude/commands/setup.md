---
name: "setup"
version: "2.0.0"
description: |
  Initialize Sigil design context framework on a repository.
  Detects component directories, creates state files, and prepares for design capture.

command_type: "init"

arguments: []

pre_flight:
  - check: "file_exists"
    path: ".sigil-version.json"
    error: "Sigil not mounted. Run mount-sigil.sh first."

outputs:
  - path: "sigil-mark/moodboard.md"
    type: "file"
    description: "Empty moodboard template"
  - path: "sigil-mark/rules.md"
    type: "file"
    description: "Empty rules template"
  - path: "sigil-mark/inventory.md"
    type: "file"
    description: "Empty inventory file"
  - path: ".sigilrc.yaml"
    type: "file"
    description: "Zone configuration with detected paths"
  - path: ".sigil-setup-complete"
    type: "file"
    description: "Setup completion marker"

mode:
  default: "foreground"
  allow_background: false
---

# Setup

## Purpose

Initialize Sigil design context framework on a repository. Detects component directories, creates state files, and prepares for design capture.

## Invocation

```
/setup
```

## Prerequisites

- Sigil must be mounted (`.sigil-version.json` exists)

## Workflow

### Step 1: Pre-flight Checks

1. Verify `.sigil-version.json` exists (Sigil is mounted)
2. Check if `.sigil-setup-complete` already exists (warn if so)

### Step 2: Detect Component Directories

Scan for common component directory patterns:
- `components/`
- `app/components/`
- `src/components/`
- `lib/components/`
- `src/ui/`
- `src/features/**/components/`

Use the `detect-components.sh` script:
```bash
.claude/skills/sigil-setup/scripts/detect-components.sh
```

### Step 3: Create State Directory

Create `sigil-mark/` with templates:

```bash
mkdir -p sigil-mark
```

Copy templates from `.claude/templates/`:
- `moodboard.md` → `sigil-mark/moodboard.md`
- `rules.md` → `sigil-mark/rules.md`

Create empty `sigil-mark/inventory.md`.

### Step 4: Create Configuration

Create `.sigilrc.yaml` with detected component paths:

```yaml
version: "1.0"

component_paths:
  - "components/"        # Add detected paths
  - "app/components/"

zones:
  critical:
    paths: []
    motion: "deliberate"
    patterns:
      prefer: ["deliberate-entrance"]
      warn: ["instant-transition"]

  marketing:
    paths: []
    motion: "playful"
    patterns:
      prefer: ["playful-bounce"]

  admin:
    paths: []
    motion: "snappy"

rejections: []
```

### Step 5: Create Marker

Create `.sigil-setup-complete` marker:

```
Sigil setup completed at [timestamp]
```

### Step 6: Report Success

Output created files and next steps.

## Arguments

| Argument | Description | Required |
|----------|-------------|----------|
| None | | |

## Outputs

| Path | Description |
|------|-------------|
| `sigil-mark/moodboard.md` | Empty moodboard template |
| `sigil-mark/rules.md` | Empty rules template |
| `sigil-mark/inventory.md` | Empty inventory file |
| `.sigilrc.yaml` | Zone configuration with detected paths |
| `.sigil-setup-complete` | Setup completion marker |

## Idempotency

If already set up:
1. Warn user that setup is already complete
2. Offer to refresh symlinks only
3. Never overwrite existing state files

## Output Format

```
Sigil Setup Complete

Detected component paths:
  - components/
  - src/features/**/components/

Created:
  - sigil-mark/moodboard.md (template)
  - sigil-mark/rules.md (template)
  - sigil-mark/inventory.md (empty)
  - .sigilrc.yaml (configuration)
  - .sigil-setup-complete (marker)

Next steps:
  - New project: /envision to capture product feel
  - Existing codebase: /inherit to bootstrap from components
```

## Error Handling

| Error | Cause | Resolution |
|-------|-------|------------|
| "Sigil not mounted" | Missing `.sigil-version.json` | Run mount-sigil.sh first |
| "Already set up" | `.sigil-setup-complete` exists | Use existing setup or delete marker |

## Next Step

After setup:
- **New project**: `/envision` to capture product moodboard
- **Existing codebase**: `/inherit` to bootstrap from existing components
