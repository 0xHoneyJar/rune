# Sigil Mounting Skill

> *"The guild opens its doors to a new craftsman."*

## Purpose

Mount the Sigil framework onto an existing repository. Creates the `sigil-showcase/` directory structure and symlinks skills/commands from the central Sigil installation.

## Pre-Flight Checks

Before mounting, validate:

### Step 1: Check if Already Mounted

```bash
if [[ -f ".sigil-version.json" ]]; then
  echo "Sigil is already mounted on this repository."
  echo "Current version: $(cat .sigil-version.json | yq -r '.version')"
  echo ""
  echo "To update: /sigil update"
  echo "To reinstall: rm .sigil-version.json && /sigil mount"
  exit 0
fi
```

### Step 2: Verify Git Repository

```bash
if [[ ! -d ".git" ]]; then
  echo "ERROR: Not a git repository."
  echo "Please run from the root of a git repository."
  exit 1
fi
```

### Step 3: Check for yq Dependency

```bash
if ! command -v yq &> /dev/null; then
  echo "WARNING: yq not found."
  echo ""
  echo "Install with:"
  echo "  macOS: brew install yq"
  echo "  Linux: apt install yq or snap install yq"
  echo ""
  echo "Continuing without yq (some features may be limited)..."
fi
```

### Step 4: Locate Sigil Framework

The framework should be at `~/.sigil/sigil/`. If not found:

```bash
SIGIL_HOME="${HOME}/.sigil/sigil"

if [[ ! -d "$SIGIL_HOME" ]]; then
  echo "Sigil framework not found at $SIGIL_HOME"
  echo ""
  echo "Installing Sigil framework..."
  mkdir -p "${HOME}/.sigil"
  git clone https://github.com/0xHoneyJar/sigil.git "$SIGIL_HOME"
fi
```

---

## Mounting Process

### Step 1: Create sigil-showcase/ Directory Structure

```bash
mkdir -p sigil-showcase/{moodboards,exports,showcase}
mkdir -p sigil-showcase/moodboards/{features,assets}
```

Creates:
```
sigil-showcase/
├── moodboards/
│   ├── product.md        ← Will be created from template
│   ├── features/         ← Feature-level moodboards
│   └── assets/           ← Reference images (Git LFS)
├── exports/
│   └── .gitkeep          ← Placeholder for exports
└── showcase/
    └── .gitkeep          ← Placeholder for Next.js app
```

### Step 2: Create Placeholder Files

```bash
# Moodboards placeholder
touch sigil-showcase/moodboards/features/.gitkeep

# Exports placeholder
touch sigil-showcase/exports/.gitkeep

# Showcase placeholder
touch sigil-showcase/showcase/.gitkeep
```

### Step 3: Create Product Moodboard Template

Write initial product moodboard if it doesn't exist:

```markdown
---
product: [PRODUCT_NAME]
created: [DATE]
updated_by: [USER]
---

# [PRODUCT_NAME] Moodboard

## North Stars

### Games
<!-- Reference games that inspire the feel -->
-

### Products
<!-- Reference products that inspire the aesthetic -->
-

## Core Feelings

| Context | Feel | Reference |
|---------|------|-----------|
| Transactions | | |
| Success states | | |
| Loading | | |
| Errors | | |

## Anti-Patterns

<!-- Patterns to explicitly avoid -->
-

## References

<!-- Add screenshots, links, or embed images -->
```

### Step 4: Create .claude/ Directories (if needed)

```bash
mkdir -p .claude/{skills,commands}
```

### Step 5: Symlink Skills

```bash
SIGIL_HOME="${HOME}/.sigil/sigil"

# Symlink each skill directory
ln -sf "$SIGIL_HOME/.claude/skills/sigil-capturing-taste" .claude/skills/
ln -sf "$SIGIL_HOME/.claude/skills/sigil-querying" .claude/skills/
ln -sf "$SIGIL_HOME/.claude/skills/sigil-showcasing" .claude/skills/
ln -sf "$SIGIL_HOME/.claude/skills/sigil-mounting" .claude/skills/
```

### Step 6: Symlink Commands

```bash
SIGIL_HOME="${HOME}/.sigil/sigil"

# Symlink each command file
for cmd in taste query export showcase mount update moodboard; do
  if [[ -f "$SIGIL_HOME/.claude/commands/${cmd}.md" ]]; then
    ln -sf "$SIGIL_HOME/.claude/commands/${cmd}.md" .claude/commands/
  fi
done
```

### Step 7: Create Version File

```bash
cat > .sigil-version.json << EOF
{
  "version": "1.0.0",
  "mounted_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "sigil_home": "$SIGIL_HOME"
}
EOF
```

### Step 8: Update .gitignore

Append Sigil patterns if not already present:

```bash
if ! grep -q "# Sigil" .gitignore 2>/dev/null; then
  cat >> .gitignore << EOF

# Sigil
.claude/skills/sigil-*
.claude/commands/sigil-*.md
.claude/commands/taste.md
.claude/commands/query.md
.claude/commands/export.md
.claude/commands/showcase.md
.claude/commands/mount.md
.claude/commands/update.md
.claude/commands/moodboard.md
sigil-showcase/showcase/node_modules/
sigil-showcase/showcase/.next/
EOF
fi
```

---

## Success Output

On successful mount, display:

```
✓ Sigil mounted successfully!

Created:
  sigil-showcase/moodboards/    ← Product and feature moodboards
  sigil-showcase/exports/       ← Generated JSON/MDX (empty)
  sigil-showcase/showcase/      ← Next.js app (empty)

Symlinked:
  .claude/skills/sigil-*        ← 4 skills
  .claude/commands/*.md         ← 7 commands

Version: 1.0.0
Mounted at: [TIMESTAMP]

Next steps:
  1. Create your product moodboard:
     Edit sigil-showcase/moodboards/product.md

  2. Capture your first component:
     /sigil taste ClaimButton

  3. View captured components:
     /sigil taste --list
```

---

## Error Handling

| Error | Cause | Resolution |
|-------|-------|------------|
| "Not a git repository" | Not in git root | cd to repository root |
| "Already mounted" | .sigil-version.json exists | Use /sigil update or remove file |
| "Framework not found" | Sigil not installed | Will auto-install from GitHub |
| "Permission denied" | Can't create symlinks | Check directory permissions |

---

## Idempotency

Running `/sigil mount` multiple times is safe:

1. If already mounted, exits with info message
2. If partially mounted, completes missing pieces
3. Symlinks use `-f` flag to force update

---

## Agent Behavior

When user runs `/sigil mount`:

1. Run pre-flight checks
2. If already mounted, inform user and suggest alternatives
3. If not mounted, proceed with full mount
4. Display success message with next steps
5. Optionally ask if user wants to create product moodboard now

Use AskUserQuestion for:
- Confirming product name for moodboard
- Asking if user wants to capture first component immediately
