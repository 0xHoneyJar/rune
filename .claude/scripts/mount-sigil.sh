#!/usr/bin/env bash
# Sigil Framework: Mount Script
# Design Physics Engine for AI-assisted development
set -euo pipefail

# === Colors ===
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BLUE='\033[0;34m'
NC='\033[0m'

log() { echo -e "${GREEN}[sigil]${NC} $*"; }
warn() { echo -e "${YELLOW}[sigil]${NC} $*"; }
err() { echo -e "${RED}[sigil]${NC} ERROR: $*" >&2; exit 1; }
info() { echo -e "${CYAN}[sigil]${NC} $*"; }
step() { echo -e "${BLUE}[sigil]${NC} -> $*"; }

# === Configuration ===
SIGIL_HOME="${SIGIL_HOME:-$HOME/.sigil/sigil}"
SIGIL_REPO="${SIGIL_REPO:-https://github.com/0xHoneyJar/sigil.git}"
SIGIL_BRANCH="${SIGIL_BRANCH:-main}"
VERSION_FILE=".sigil-version.json"

# === Argument Parsing ===
while [[ $# -gt 0 ]]; do
  case $1 in
    --branch)
      SIGIL_BRANCH="$2"
      shift 2
      ;;
    --home)
      SIGIL_HOME="$2"
      shift 2
      ;;
    -h|--help)
      echo "Usage: mount-sigil.sh [OPTIONS]"
      echo ""
      echo "Mount Sigil Design Physics Engine onto a repository."
      echo ""
      echo "Options:"
      echo "  --branch <name>   Sigil branch to use (default: main)"
      echo "  --home <path>     Sigil home directory (default: ~/.sigil/sigil)"
      echo "  -h, --help        Show this help message"
      echo ""
      echo "Examples:"
      echo "  curl -fsSL https://raw.githubusercontent.com/0xHoneyJar/sigil/main/.claude/scripts/mount-sigil.sh | bash"
      echo "  ./mount-sigil.sh --branch develop"
      exit 0
      ;;
    *)
      warn "Unknown option: $1"
      shift
      ;;
  esac
done

# === Pre-flight Checks ===
preflight() {
  log "Running pre-flight checks..."

  if ! git rev-parse --git-dir > /dev/null 2>&1; then
    err "Not a git repository. Initialize with 'git init' first."
  fi

  if [[ -f "$VERSION_FILE" ]]; then
    local existing=$(jq -r '.version // "unknown"' "$VERSION_FILE" 2>/dev/null || echo "unknown")
    warn "Sigil is already mounted (version: $existing)"
    read -p "Remount/upgrade? This will refresh symlinks. (y/N) " -n 1 -r
    echo ""
    [[ $REPLY =~ ^[Yy]$ ]] || { log "Aborted."; exit 0; }
  fi

  command -v git >/dev/null || err "git is required"
  command -v jq >/dev/null || warn "jq not found (optional, for better JSON handling)"

  log "Pre-flight checks passed"
}

# === Clone or Update Sigil ===
setup_sigil_home() {
  step "Setting up Sigil home..."

  if [[ -d "$SIGIL_HOME" ]]; then
    log "Updating existing Sigil installation..."
    cd "$SIGIL_HOME"
    git fetch origin "$SIGIL_BRANCH" --quiet
    git checkout "$SIGIL_BRANCH" --quiet 2>/dev/null || git checkout -b "$SIGIL_BRANCH" "origin/$SIGIL_BRANCH" --quiet
    git reset --hard "origin/$SIGIL_BRANCH" --quiet
    log "Reset to origin/$SIGIL_BRANCH"
    cd - > /dev/null
  else
    log "Installing Sigil..."
    mkdir -p "$(dirname "$SIGIL_HOME")"
    git clone --branch "$SIGIL_BRANCH" "$SIGIL_REPO" "$SIGIL_HOME"
  fi

  log "Sigil home ready at $SIGIL_HOME"
}

# === Sigil v3.x Skills ===
SIGIL_SKILLS=(
  "approving-patterns"
  "canonizing-flaws"
  "codifying-materials"
  "codifying-recipes"
  "codifying-rules"
  "consulting-decisions"
  "crafting-components"
  "crafting-guidance"
  "envisioning-moodboard"
  "envisioning-soul"
  "gardening-entropy"
  "greenlighting-concepts"
  "inheriting-design"
  "initializing-sigil"
  "mapping-zones"
  "unlocking-decisions"
  "updating-framework"
  "validating-fidelity"
)

# === Sigil v3.x Commands ===
SIGIL_COMMANDS=(
  "approve"
  "canonize"
  "codify"
  "consult"
  "craft"
  "envision"
  "garden"
  "greenlight"
  "inherit"
  "map"
  "material"
  "recipe"
  "sigil-setup"
  "unlock"
  "update"
  "validate"
)

# === Sigil v3.x Scripts ===
SIGIL_SCRIPTS=(
  "mount-sigil.sh"
  "sigil-workbench.sh"
  "sigil-tensions.sh"
  "sigil-validate.sh"
  "sigil-detect-zone.sh"
  "sigil-diff.sh"
)

# === Create Symlinks ===
create_symlinks() {
  step "Creating symlinks..."

  # Create .claude directories if needed
  mkdir -p .claude/skills
  mkdir -p .claude/commands

  # Symlink Sigil v1.0 skills
  local skill_count=0
  for skill_name in "${SIGIL_SKILLS[@]}"; do
    if [[ -d "$SIGIL_HOME/.claude/skills/$skill_name" ]]; then
      # Remove existing symlink or directory
      rm -rf ".claude/skills/$skill_name"
      ln -sf "$SIGIL_HOME/.claude/skills/$skill_name" ".claude/skills/$skill_name"
      ((skill_count++))
    fi
  done
  log "Linked $skill_count skills"

  # Symlink Sigil v1.0 commands
  local cmd_count=0
  for cmd in "${SIGIL_COMMANDS[@]}"; do
    if [[ -f "$SIGIL_HOME/.claude/commands/${cmd}.md" ]]; then
      rm -f ".claude/commands/${cmd}.md"
      ln -sf "$SIGIL_HOME/.claude/commands/${cmd}.md" ".claude/commands/${cmd}.md"
      ((cmd_count++))
    fi
  done
  log "Linked $cmd_count commands"

  # Symlink Sigil v1.0 scripts
  mkdir -p .claude/scripts
  local script_count=0
  for script_name in "${SIGIL_SCRIPTS[@]}"; do
    if [[ -f "$SIGIL_HOME/.claude/scripts/$script_name" ]]; then
      # Don't overwrite mount script if it exists locally
      if [[ "$script_name" != "mount-sigil.sh" ]] || [[ ! -f ".claude/scripts/$script_name" ]]; then
        rm -f ".claude/scripts/$script_name"
        ln -sf "$SIGIL_HOME/.claude/scripts/$script_name" ".claude/scripts/$script_name"
        ((script_count++))
      fi
    fi
  done
  log "Linked $script_count scripts"
}

# === Create State Zone Structure ===
create_state_zone() {
  step "Creating sigil-mark/ state zone..."

  # Create v3.x directory structure
  mkdir -p sigil-mark/moodboard/references
  mkdir -p sigil-mark/moodboard/anti-patterns
  mkdir -p sigil-mark/moodboard/articles
  mkdir -p sigil-mark/moodboard/gtm
  mkdir -p sigil-mark/moodboard/screenshots
  mkdir -p sigil-mark/soul-binder
  mkdir -p sigil-mark/lens-array
  mkdir -p sigil-mark/consultation-chamber
  mkdir -p sigil-mark/proving-grounds

  # Create .gitkeep files
  touch sigil-mark/moodboard/references/.gitkeep
  touch sigil-mark/moodboard/anti-patterns/.gitkeep
  touch sigil-mark/moodboard/articles/.gitkeep
  touch sigil-mark/moodboard/gtm/.gitkeep
  touch sigil-mark/moodboard/screenshots/.gitkeep

  log "State zone structure created"
}

# === Create Version File ===
create_version_file() {
  step "Creating version manifest..."

  local sigil_version="3.1.0"
  if [[ -f "$SIGIL_HOME/VERSION" ]]; then
    sigil_version=$(cat "$SIGIL_HOME/VERSION" | tr -d '[:space:]')
  fi

  cat > "$VERSION_FILE" << EOF
{
  "version": "$sigil_version",
  "mounted_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "updated_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "sigil_home": "$SIGIL_HOME",
  "branch": "$SIGIL_BRANCH",
  "architecture": "design-context-framework"
}
EOF

  log "Version manifest created"
}

# === Main ===
main() {
  echo ""
  log "======================================================================="
  log "  Sigil v3.x — Design Context Framework"
  log "  Making the right path easy, wrong path visible"
  log "======================================================================="
  log "  Branch: $SIGIL_BRANCH"
  echo ""

  preflight
  setup_sigil_home
  create_symlinks
  create_state_zone
  create_version_file

  echo ""
  log "======================================================================="
  log "  Sigil Successfully Mounted!"
  log "======================================================================="
  echo ""
  info "Next steps:"
  info "  1. Run 'claude' to start Claude Code"
  info "  2. Run '/sigil-setup' to initialize Sigil"
  info "  3. Run '/envision' to capture product moodboard"
  info "  4. Run '/codify' to define design rules"
  info "  5. Run '/craft' to get design guidance"
  echo ""
  info "Framework structure:"
  info "  .claude/skills/     -> ${#SIGIL_SKILLS[@]} Sigil skills symlinked"
  info "  .claude/commands/   -> ${#SIGIL_COMMANDS[@]} Sigil commands symlinked"
  info "  .claude/scripts/    -> ${#SIGIL_SCRIPTS[@]} Sigil scripts symlinked"
  info "  sigil-mark/         -> Your design context (state zone)"
  info "  .sigil-version.json -> Version tracking"
  echo ""
  info "Key directories:"
  info "  sigil-mark/moodboard/    -> Design inspiration collection"
  info "  sigil-mark/moodboard.md  -> Product feel descriptors"
  info "  sigil-mark/rules.md      -> Design rules"
  info "  .sigilrc.yaml            -> Zone configuration"
  echo ""
  info "Philosophy:"
  info "  - Make the right path easy"
  info "  - Make the wrong path visible (not impossible)"
  info "  - Human accountable for all decisions"
  echo ""
}

main "$@"
