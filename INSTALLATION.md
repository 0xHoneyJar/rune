# Installation Guide

Sigil can be installed in two ways: **mounting onto an existing repository** (recommended) or **cloning the template**.

## Prerequisites

### Required
- **Git** - Version control
- **Claude Code** - Claude's official CLI

### Optional
- **jq** - JSON processor (for better JSON handling)
- **yq** - YAML processor (for YAML parsing)

```bash
# macOS (optional)
brew install jq yq

# Ubuntu/Debian (optional)
sudo apt install jq
pip install yq  # or snap install yq
```

## Method 1: Mount onto Existing Repository (Recommended)

Mount Sigil onto any existing git repository. This is the **sidecar pattern** - Sigil rides alongside your project.

### One-Line Install

```bash
curl -fsSL https://raw.githubusercontent.com/zksoju/sigil/main/.claude/scripts/mount-sigil.sh | bash
```

### Manual Install

```bash
# 1. Navigate to your project
cd your-existing-project

# 2. Clone Sigil to a local cache
git clone https://github.com/zksoju/sigil.git ~/.sigil/sigil

# 3. Run mount script
~/.sigil/sigil/.claude/scripts/mount-sigil.sh
```

### What Gets Installed

```
your-project/
├── .claude/
│   ├── commands/           # Symlinked commands (/setup, /envision, etc.)
│   └── skills/             # Symlinked skills (sigil-*)
├── sigil-mark/             # State Zone (your design context)
│   ├── moodboard.md        # Product feel, references, anti-patterns
│   ├── rules.md            # Design rules by category
│   └── inventory.md        # Component list
├── .sigilrc.yaml           # Zone configuration
├── .sigil-version.json     # Version tracking
└── .sigil-setup-complete   # Setup marker
```

## Method 2: Clone Template

Best for new projects starting from scratch.

```bash
# Clone and rename
git clone https://github.com/zksoju/sigil.git my-project
cd my-project

# Remove upstream history (optional)
rm -rf .git
git init
git add .
git commit -m "Initial commit from Sigil template"

# Start Claude Code
claude
```

## Configuration

### .sigilrc.yaml

Zone configuration file. Defines path-based design contexts.

```yaml
version: "1.0"

component_paths:
  - "components/"
  - "src/components/"

zones:
  critical:
    paths: ["src/features/checkout/**", "src/features/claim/**"]
    motion: "deliberate"
    patterns:
      prefer: ["deliberate-entrance", "confirmation-flow"]
      warn: ["instant-transition", "playful-bounce"]

  marketing:
    paths: ["src/features/marketing/**"]
    motion: "playful"
    patterns:
      prefer: ["playful-bounce", "attention-grab"]

  admin:
    paths: ["src/admin/**", "src/dashboard/**"]
    motion: "snappy"
    patterns:
      prefer: ["instant-transition", "snappy-response"]

rejections:
  - pattern: "Spinner"
    reason: "Creates anxiety in critical zones"
    exceptions: ["admin/**"]
```

## Updates

### Pull Latest Updates

```bash
# Using the command
/update

# Or manually
~/.sigil/sigil/.claude/scripts/update-sigil.sh
```

### What Happens During Updates

1. **Fetch**: Downloads latest from upstream
2. **Validate**: Checks file integrity
3. **Update symlinks**: Points to new versions
4. **Preserve state**: Your `sigil-mark/` content is never touched

## Coexistence with Loa

Sigil and [Loa](https://github.com/0xHoneyJar/loa) can coexist on the same repository:

| Aspect | Loa | Sigil |
|--------|-----|-------|
| State Zone | `loa-grimoire/` | `sigil-mark/` |
| Config | `.loa.config.yaml` | `.sigilrc.yaml` |
| Focus | Product development workflow | Design context preservation |
| Commands | `/plan-and-analyze`, `/implement`, etc. | `/envision`, `/codify`, `/craft`, etc. |

Both frameworks use symlinks in `.claude/` and don't conflict.

## Troubleshooting

### "Command not found" after installation

Ensure symlinks were created correctly:

```bash
ls -la .claude/commands/
# Should show symlinks pointing to ~/.sigil/sigil/.claude/commands/
```

If missing, re-run the mount script.

### Setup already completed

If you see "Setup already completed", you can:
- Delete `.sigil-setup-complete` to re-run `/setup`
- Or continue with `/envision` or `/inherit`

### Symlink errors

On some systems, symlinks may fail. Run mount script with verbose output:

```bash
bash -x ~/.sigil/sigil/.claude/scripts/mount-sigil.sh
```

## Next Steps

After installation:

```bash
# 1. Start Claude Code
claude

# 2. Run setup wizard
/setup

# 3. Choose your path:
/envision    # New project - interview to capture product feel
/inherit     # Existing codebase - scan and infer from code
```

See [README.md](README.md) for the complete workflow.
