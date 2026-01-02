---
name: mount
description: Mount Sigil framework onto an existing repository
agent: sigil-mounting
agent_path: .claude/skills/sigil-mounting/SKILL.md
---

# /sigil mount

Mount the Sigil framework onto the current repository.

## What This Does

1. **Pre-flight checks**
   - Verifies not already mounted
   - Confirms git repository
   - Checks yq availability
   - Locates/installs Sigil framework

2. **Creates directory structure**
   - `sigil-showcase/moodboards/` - Product and feature moodboards
   - `sigil-showcase/exports/` - Generated JSON/MDX
   - `sigil-showcase/showcase/` - Next.js preview app

3. **Symlinks framework**
   - Skills from `~/.sigil/sigil/.claude/skills/`
   - Commands from `~/.sigil/sigil/.claude/commands/`

4. **Creates tracking files**
   - `.sigil-version.json` - Version manifest
   - Updates `.gitignore` with Sigil patterns

## Usage

```
/sigil mount
```

## Prerequisites

- Git repository (run from repo root)
- Claude Code CLI

## After Mounting

1. Edit `sigil-showcase/moodboards/product.md` to define your north stars
2. Run `/sigil taste ComponentName` to capture your first component
3. Run `/sigil taste --list` to view captured components

## Already Mounted?

If Sigil is already mounted, you'll see the current version and options to:
- `/sigil update` - Update to latest framework
- Remove `.sigil-version.json` and re-run to reinstall
