#!/bin/bash
# Sigil v5.0 → v6.0 Migration Script
# Migrates from "The Lucid Flow" to "Native Muse"

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Flags
DRY_RUN=false

# Parse arguments
while [[ "$#" -gt 0 ]]; do
  case $1 in
    --dry-run) DRY_RUN=true ;;
    -h|--help)
      echo "Usage: $0 [--dry-run]"
      echo ""
      echo "Options:"
      echo "  --dry-run    Preview changes without applying"
      echo "  -h, --help   Show this help message"
      exit 0
      ;;
    *) echo "Unknown parameter: $1"; exit 1 ;;
  esac
  shift
done

# Functions
log_info() {
  echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
  echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
  echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

run_cmd() {
  if [ "$DRY_RUN" = true ]; then
    echo -e "${YELLOW}[DRY-RUN]${NC} Would run: $1"
  else
    eval "$1"
  fi
}

# Header
echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║           Sigil v5.0 → v6.0 Migration Script                 ║"
echo "║                    'Native Muse'                             ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

if [ "$DRY_RUN" = true ]; then
  echo -e "${YELLOW}Running in DRY-RUN mode. No changes will be made.${NC}"
  echo ""
fi

# Check prerequisites
log_info "Checking prerequisites..."

if [ ! -f "package.json" ]; then
  log_error "package.json not found. Run from project root."
  exit 1
fi

if [ ! -d "sigil-mark" ]; then
  log_error "sigil-mark/ directory not found. Is Sigil installed?"
  exit 1
fi

log_success "Prerequisites check passed"
echo ""

# Step 1: Create .sigil directory structure
log_info "Step 1: Creating .sigil directory structure..."

run_cmd "mkdir -p .sigil/craft-log"
run_cmd "mkdir -p .sigil/eras"

log_success "Created .sigil directory structure"
echo ""

# Step 2: Initialize survival.json
log_info "Step 2: Initializing survival tracking..."

SURVIVAL_JSON='.sigil/survival.json'
if [ ! -f "$SURVIVAL_JSON" ] || [ "$DRY_RUN" = true ]; then
  SURVIVAL_CONTENT='{
  "era": "v1",
  "era_started": "'$(date +%Y-%m-%d)'",
  "last_scan": null,
  "patterns": {}
}'
  if [ "$DRY_RUN" = true ]; then
    echo -e "${YELLOW}[DRY-RUN]${NC} Would create $SURVIVAL_JSON with initial content"
  else
    echo "$SURVIVAL_CONTENT" > "$SURVIVAL_JSON"
  fi
fi

log_success "Initialized survival tracking"
echo ""

# Step 3: Build workshop index (placeholder - actual build requires TypeScript)
log_info "Step 3: Building workshop index..."

WORKSHOP_JSON='.sigil/workshop.json'
if [ ! -f "$WORKSHOP_JSON" ] || [ "$DRY_RUN" = true ]; then
  WORKSHOP_CONTENT='{
  "indexed_at": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'",
  "package_hash": "",
  "imports_hash": "",
  "materials": {},
  "components": {},
  "physics": {
    "deliberate": { "timing": 800, "easing": "ease-out", "description": "Critical zone timing" },
    "snappy": { "timing": 150, "easing": "ease-out", "description": "Admin interface timing" },
    "warm": { "timing": 300, "easing": "ease-in-out", "description": "Default timing" }
  },
  "zones": {
    "critical": { "physics": "deliberate", "description": "High-stakes interactions" },
    "standard": { "physics": "warm", "description": "Default zone" },
    "admin": { "physics": "snappy", "description": "Administrative interfaces" }
  }
}'
  if [ "$DRY_RUN" = true ]; then
    echo -e "${YELLOW}[DRY-RUN]${NC} Would create $WORKSHOP_JSON with initial structure"
    echo -e "${YELLOW}[DRY-RUN]${NC} Note: Run 'npx ts-node sigil-mark/process/workshop-builder.ts' to populate"
  else
    echo "$WORKSHOP_CONTENT" > "$WORKSHOP_JSON"
    log_warning "Workshop created with placeholder. Run workshop builder to populate."
  fi
fi

log_success "Created workshop index structure"
echo ""

# Step 4: Update VERSION file
log_info "Step 4: Updating VERSION file..."

run_cmd "echo '6.0.0' > VERSION"

log_success "Updated VERSION to 6.0.0"
echo ""

# Step 5: Update .sigil-version.json
log_info "Step 5: Updating .sigil-version.json..."

VERSION_JSON='.sigil-version.json'
VERSION_CONTENT='{
  "version": "6.0.0",
  "codename": "Native Muse",
  "migrated_from": "5.0.0",
  "migration_date": "'$(date +%Y-%m-%d)'",
  "features": {
    "workshop_index": true,
    "survival_observation": true,
    "virtual_sanctuary": true,
    "ephemeral_inspiration": true,
    "forge_mode": true,
    "era_management": true
  }
}'

if [ "$DRY_RUN" = true ]; then
  echo -e "${YELLOW}[DRY-RUN]${NC} Would update $VERSION_JSON"
else
  echo "$VERSION_CONTENT" > "$VERSION_JSON"
fi

log_success "Updated .sigil-version.json"
echo ""

# Step 6: Create .gitignore entries if needed
log_info "Step 6: Updating .gitignore..."

GITIGNORE_ENTRIES="
# Sigil v6.0 runtime state
.sigil/workshop.lock
.sigil/craft-log/
"

if [ -f ".gitignore" ]; then
  if grep -q ".sigil/workshop.lock" .gitignore; then
    log_info ".gitignore already has Sigil v6.0 entries"
  else
    if [ "$DRY_RUN" = true ]; then
      echo -e "${YELLOW}[DRY-RUN]${NC} Would append Sigil v6.0 entries to .gitignore"
    else
      echo "$GITIGNORE_ENTRIES" >> .gitignore
    fi
  fi
fi

log_success "Updated .gitignore"
echo ""

# Summary
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                    Migration Complete                        ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

if [ "$DRY_RUN" = true ]; then
  echo -e "${YELLOW}This was a dry run. No changes were made.${NC}"
  echo "Run without --dry-run to apply changes."
else
  echo -e "${GREEN}Migration to v6.0.0 'Native Muse' complete!${NC}"
  echo ""
  echo "Next steps:"
  echo "  1. Build full workshop index:"
  echo "     npx ts-node sigil-mark/process/workshop-builder.ts"
  echo ""
  echo "  2. Verify migration:"
  echo "     cat VERSION"
  echo "     ls -la .sigil/"
  echo ""
  echo "  3. Start using v6.0 commands:"
  echo "     /craft - Zone-aware generation with workshop"
  echo "     /forge - Precedent-breaking exploration"
  echo "     /garden - Pattern promotion scan"
fi
echo ""
