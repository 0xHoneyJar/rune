#!/bin/bash
# Sigil Mount Script
# "The guild opens its doors to a new craftsman."
#
# Usage: curl -fsSL https://raw.githubusercontent.com/0xHoneyJar/sigil/main/scripts/mount.sh | bash

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Config
SIGIL_HOME="${HOME}/.sigil/sigil"
SIGIL_REPO="https://github.com/0xHoneyJar/sigil.git"
VERSION="1.0.0"

echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}   ⚒️  Sigil - Craftsman Design System Framework${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

# ─────────────────────────────────────────────────────────────────
# Pre-Flight Checks
# ─────────────────────────────────────────────────────────────────

echo -e "${YELLOW}Running pre-flight checks...${NC}"

# Check 1: Already mounted?
if [[ -f ".sigil-version.json" ]]; then
  CURRENT_VERSION=$(cat .sigil-version.json | grep -o '"version"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/.*"version"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/')
  echo -e "${GREEN}✓ Sigil is already mounted on this repository.${NC}"
  echo "  Current version: ${CURRENT_VERSION}"
  echo ""
  echo "  To update: /sigil update"
  echo "  To reinstall: rm .sigil-version.json && /sigil mount"
  exit 0
fi

# Check 2: Git repository?
if [[ ! -d ".git" ]]; then
  echo -e "${RED}✗ ERROR: Not a git repository.${NC}"
  echo "  Please run from the root of a git repository."
  exit 1
fi
echo -e "${GREEN}✓ Git repository detected${NC}"

# Check 3: yq available?
if ! command -v yq &> /dev/null; then
  echo -e "${YELLOW}⚠ WARNING: yq not found.${NC}"
  echo ""
  echo "  Install with:"
  echo "    macOS: brew install yq"
  echo "    Linux: apt install yq or snap install yq"
  echo ""
  echo "  Continuing without yq (some features may be limited)..."
else
  echo -e "${GREEN}✓ yq available${NC}"
fi

# Check 4: Sigil framework installed?
if [[ ! -d "$SIGIL_HOME" ]]; then
  echo -e "${YELLOW}⚠ Sigil framework not found at ${SIGIL_HOME}${NC}"
  echo "  Installing Sigil framework..."
  mkdir -p "${HOME}/.sigil"
  git clone "$SIGIL_REPO" "$SIGIL_HOME"
  echo -e "${GREEN}✓ Sigil framework installed${NC}"
else
  echo -e "${GREEN}✓ Sigil framework found at ${SIGIL_HOME}${NC}"
  # Update to latest
  echo "  Updating to latest..."
  (cd "$SIGIL_HOME" && git pull --quiet)
fi

echo ""

# ─────────────────────────────────────────────────────────────────
# Mounting Process
# ─────────────────────────────────────────────────────────────────

echo -e "${YELLOW}Mounting Sigil framework...${NC}"

# Step 1: Create sigil-showcase/ directory structure
echo "  Creating sigil-showcase/ directories..."
mkdir -p sigil-showcase/{moodboards,exports,showcase}
mkdir -p sigil-showcase/moodboards/{features,assets}

# Step 2: Create placeholder files
touch sigil-showcase/moodboards/features/.gitkeep
touch sigil-showcase/exports/.gitkeep
touch sigil-showcase/showcase/.gitkeep

# Step 3: Create product moodboard template
if [[ ! -f "sigil-showcase/moodboards/product.md" ]]; then
  PRODUCT_NAME=$(basename "$(pwd)")
  DATE=$(date +%Y-%m-%d)

  cat > sigil-showcase/moodboards/product.md << MOODBOARD_EOF
---
product: ${PRODUCT_NAME}
created: ${DATE}
updated_by: Sigil
---

# ${PRODUCT_NAME} Moodboard

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
MOODBOARD_EOF
  echo -e "${GREEN}  ✓ Created product moodboard template${NC}"
fi

# Step 4: Create .claude/ directories
mkdir -p .claude/{skills,commands}

# Step 5: Symlink skills
echo "  Symlinking skills..."
for skill in sigil-capturing-taste sigil-querying sigil-showcasing sigil-mounting; do
  if [[ -d "$SIGIL_HOME/.claude/skills/${skill}" ]]; then
    ln -sf "$SIGIL_HOME/.claude/skills/${skill}" .claude/skills/
  fi
done

# Step 6: Symlink commands
echo "  Symlinking commands..."
for cmd in taste query export showcase mount update moodboard; do
  if [[ -f "$SIGIL_HOME/.claude/commands/${cmd}.md" ]]; then
    ln -sf "$SIGIL_HOME/.claude/commands/${cmd}.md" .claude/commands/
  fi
done

# Step 7: Create version file
MOUNTED_AT=$(date -u +%Y-%m-%dT%H:%M:%SZ)
cat > .sigil-version.json << VERSION_EOF
{
  "version": "${VERSION}",
  "mounted_at": "${MOUNTED_AT}",
  "sigil_home": "${SIGIL_HOME}"
}
VERSION_EOF

# Step 8: Update .gitignore
if ! grep -q "# Sigil" .gitignore 2>/dev/null; then
  echo "  Updating .gitignore..."
  cat >> .gitignore << GITIGNORE_EOF

# Sigil
.claude/skills/sigil-*
.claude/commands/taste.md
.claude/commands/query.md
.claude/commands/export.md
.claude/commands/showcase.md
.claude/commands/mount.md
.claude/commands/update.md
.claude/commands/moodboard.md
sigil-showcase/showcase/node_modules/
sigil-showcase/showcase/.next/
GITIGNORE_EOF
fi

echo ""

# ─────────────────────────────────────────────────────────────────
# Success Output
# ─────────────────────────────────────────────────────────────────

echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}   ✓ Sigil mounted successfully!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo "Created:"
echo "  sigil-showcase/moodboards/    ← Product and feature moodboards"
echo "  sigil-showcase/exports/       ← Generated JSON/MDX (empty)"
echo "  sigil-showcase/showcase/      ← Next.js app (empty)"
echo ""
echo "Symlinked:"
echo "  .claude/skills/sigil-*        ← 4 skills"
echo "  .claude/commands/*.md         ← 7 commands"
echo ""
echo "Version: ${VERSION}"
echo "Mounted at: ${MOUNTED_AT}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "  1. Create your product moodboard:"
echo "     Edit sigil-showcase/moodboards/product.md"
echo ""
echo "  2. Capture your first component:"
echo "     /sigil taste ClaimButton"
echo ""
echo "  3. View captured components:"
echo "     /sigil taste --list"
echo ""
