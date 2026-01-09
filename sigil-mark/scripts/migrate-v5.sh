#!/bin/bash

# Sigil v5.0 Migration Script
# Migrates from v4.x to v5.0 "The Lucid Flow"
#
# Usage:
#   ./sigil-mark/scripts/migrate-v5.sh
#   ./sigil-mark/scripts/migrate-v5.sh --dry-run
#
# What it does:
# 1. Deletes sigil.map and .sigil-cache (Law: Filesystem is truth)
# 2. Creates v5 directory structure
# 3. Initializes governance logs
# 4. Updates .sigil-version.json

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Options
DRY_RUN=false
if [[ "$1" == "--dry-run" ]]; then
  DRY_RUN=true
  echo -e "${YELLOW}DRY RUN MODE - No changes will be made${NC}"
  echo ""
fi

# Find sigil-mark directory
if [[ -d "./sigil-mark" ]]; then
  SIGIL_DIR="./sigil-mark"
elif [[ -d "../sigil-mark" ]]; then
  SIGIL_DIR="../sigil-mark"
else
  echo -e "${RED}Error: Cannot find sigil-mark directory${NC}"
  exit 1
fi

echo -e "${BLUE}Sigil v5.0 Migration${NC}"
echo "===================="
echo ""

# Step 1: Remove cache infrastructure
echo -e "${YELLOW}Step 1: Removing cache infrastructure...${NC}"

if [[ -f "$SIGIL_DIR/sigil.map" ]]; then
  if [[ "$DRY_RUN" == true ]]; then
    echo "  Would delete: $SIGIL_DIR/sigil.map"
  else
    rm "$SIGIL_DIR/sigil.map"
    echo -e "  ${GREEN}Deleted: sigil.map${NC}"
  fi
else
  echo "  sigil.map not found (OK)"
fi

if [[ -d "$SIGIL_DIR/.sigil-cache" ]]; then
  if [[ "$DRY_RUN" == true ]]; then
    echo "  Would delete: $SIGIL_DIR/.sigil-cache/"
  else
    rm -rf "$SIGIL_DIR/.sigil-cache"
    echo -e "  ${GREEN}Deleted: .sigil-cache/${NC}"
  fi
else
  echo "  .sigil-cache not found (OK)"
fi

if [[ -f "./.sigil-cache" ]]; then
  if [[ "$DRY_RUN" == true ]]; then
    echo "  Would delete: ./.sigil-cache"
  else
    rm -rf "./.sigil-cache"
    echo -e "  ${GREEN}Deleted: root .sigil-cache${NC}"
  fi
fi

echo ""

# Step 2: Create v5 directory structure
echo -e "${YELLOW}Step 2: Creating v5 directory structure...${NC}"

V5_DIRS=(
  "$SIGIL_DIR/kernel"
  "$SIGIL_DIR/skills"
  "$SIGIL_DIR/components"
  "$SIGIL_DIR/codebase"
  "$SIGIL_DIR/knowledge"
  "$SIGIL_DIR/governance"
  "$SIGIL_DIR/governance/amendments"
  "$SIGIL_DIR/hooks"
  "$SIGIL_DIR/providers"
  "$SIGIL_DIR/layouts"
  "$SIGIL_DIR/process"
  "$SIGIL_DIR/types"
)

for dir in "${V5_DIRS[@]}"; do
  if [[ ! -d "$dir" ]]; then
    if [[ "$DRY_RUN" == true ]]; then
      echo "  Would create: $dir/"
    else
      mkdir -p "$dir"
      echo -e "  ${GREEN}Created: $dir/${NC}"
    fi
  else
    echo "  Exists: $dir/"
  fi
done

echo ""

# Step 3: Initialize governance logs
echo -e "${YELLOW}Step 3: Initializing governance logs...${NC}"

JUSTIFICATIONS_LOG="$SIGIL_DIR/governance/justifications.log"
if [[ ! -f "$JUSTIFICATIONS_LOG" ]]; then
  if [[ "$DRY_RUN" == true ]]; then
    echo "  Would create: $JUSTIFICATIONS_LOG"
  else
    cat > "$JUSTIFICATIONS_LOG" << 'EOF'
# Sigil Governance - Justification Log
# Append-only log of all BYPASS overrides
# Format: [timestamp] BYPASS\n  File: ...\n  Article: ...\n  Justification: "..."\n
#
# This log is never edited, only appended.
# Use /amend to propose constitution changes.

EOF
    echo -e "  ${GREEN}Created: justifications.log${NC}"
  fi
else
  echo "  Exists: justifications.log"
fi

echo ""

# Step 4: Update version file
echo -e "${YELLOW}Step 4: Updating version file...${NC}"

VERSION_FILE="./.sigil-version.json"
if [[ "$DRY_RUN" == true ]]; then
  echo "  Would update: $VERSION_FILE to v5.0.0"
else
  cat > "$VERSION_FILE" << 'EOF'
{
  "version": "5.0.0",
  "codename": "The Lucid Flow",
  "migrated": true,
  "migratedAt": "TIMESTAMP",
  "previousVersion": "4.1.0"
}
EOF
  # Replace TIMESTAMP with actual timestamp
  TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
  if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s/TIMESTAMP/$TIMESTAMP/g" "$VERSION_FILE"
  else
    sed -i "s/TIMESTAMP/$TIMESTAMP/g" "$VERSION_FILE"
  fi
  echo -e "  ${GREEN}Updated: .sigil-version.json to v5.0.0${NC}"
fi

echo ""

# Done
echo "===================="
if [[ "$DRY_RUN" == true ]]; then
  echo -e "${YELLOW}DRY RUN COMPLETE${NC}"
  echo "Run without --dry-run to apply changes."
else
  echo -e "${GREEN}MIGRATION COMPLETE${NC}"
fi
echo ""

# Print next steps
echo -e "${BLUE}Next Steps:${NC}"
echo ""
echo "1. Add @sigil-tier pragmas to critical components:"
echo "   /**"
echo "    * @sigil-tier gold"
echo "    * @sigil-zone critical"
echo "    */"
echo ""
echo "2. Run /garden to check system health:"
echo "   npx sigil garden"
echo ""
echo "3. See CLAUDE.md for complete v5.0 protocol."
echo ""
echo "The Seven Laws:"
echo "  1. Filesystem is Truth"
echo "  2. Type Dictates Physics"
echo "  3. Zone is Layout, Not Business Logic"
echo "  4. Status Propagates"
echo "  5. One Good Reason > 15% Silent Mutiny"
echo "  6. Never Refuse Outright"
echo "  7. Let Artists Stay in Flow"
echo ""
