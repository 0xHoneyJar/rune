#!/bin/bash
# Sigil Kernel Lock Script
# Locks the kernel files (physics.yaml, sync.yaml, fidelity-ceiling.yaml)
# After locking, these files become IMMUTABLE

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Paths
KERNEL_DIR="sigil-mark/kernel"
VERSION_FILE=".sigil-version.json"
KERNEL_FILES=("physics.yaml" "sync.yaml" "fidelity-ceiling.yaml")

# Get current user
CURRENT_USER="${USER:-$(whoami)}"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_kernel_exists() {
    for file in "${KERNEL_FILES[@]}"; do
        if [[ ! -f "${KERNEL_DIR}/${file}" ]]; then
            log_error "Kernel file not found: ${KERNEL_DIR}/${file}"
            exit 1
        fi
    done
    log_info "All kernel files found"
}

check_already_locked() {
    for file in "${KERNEL_FILES[@]}"; do
        if grep -q "^locked: true" "${KERNEL_DIR}/${file}" 2>/dev/null; then
            log_error "Kernel file already locked: ${KERNEL_DIR}/${file}"
            log_error "To unlock, you must perform a HARD FORK"
            exit 1
        fi
    done
    log_info "No kernel files are currently locked"
}

update_kernel_file() {
    local file=$1
    local filepath="${KERNEL_DIR}/${file}"

    # Create temp file with updated lock status
    # Replace 'locked: false' with 'locked: true' and add timestamp/user
    sed -i.bak \
        -e "s/^locked: false/locked: true/" \
        -e "s/^locked_at: null/locked_at: \"${TIMESTAMP}\"/" \
        -e "s/^locked_by: null/locked_by: \"${CURRENT_USER}\"/" \
        "${filepath}"

    rm -f "${filepath}.bak"
    log_info "Locked: ${filepath}"
}

update_version_file() {
    if [[ -f "${VERSION_FILE}" ]]; then
        # Update existing version file
        local temp_file=$(mktemp)
        jq --arg locked_at "${TIMESTAMP}" --arg locked_by "${CURRENT_USER}" \
           '.kernel_locked = true | .kernel_locked_at = $locked_at | .kernel_locked_by = $locked_by | .last_updated = $locked_at' \
           "${VERSION_FILE}" > "${temp_file}"
        mv "${temp_file}" "${VERSION_FILE}"
    else
        # Create new version file
        cat > "${VERSION_FILE}" << EOF
{
  "sigil_version": "11.0.0",
  "kernel_locked": true,
  "kernel_locked_at": "${TIMESTAMP}",
  "kernel_locked_by": "${CURRENT_USER}",
  "setup_completed_at": "${TIMESTAMP}",
  "last_updated": "${TIMESTAMP}"
}
EOF
    fi
    log_info "Updated: ${VERSION_FILE}"
}

verify_lock() {
    local all_locked=true
    for file in "${KERNEL_FILES[@]}"; do
        if ! grep -q "^locked: true" "${KERNEL_DIR}/${file}" 2>/dev/null; then
            log_error "Verification failed for: ${KERNEL_DIR}/${file}"
            all_locked=false
        fi
    done

    if [[ "${all_locked}" = true ]]; then
        log_info "Lock verification: PASSED"
    else
        log_error "Lock verification: FAILED"
        exit 1
    fi
}

# Main
main() {
    echo ""
    echo "╔═══════════════════════════════════════════════════════════════╗"
    echo "║                    SIGIL KERNEL LOCK                          ║"
    echo "╠═══════════════════════════════════════════════════════════════╣"
    echo "║  WARNING: This operation is IRREVERSIBLE without a hard fork  ║"
    echo "║                                                               ║"
    echo "║  Files to be locked:                                          ║"
    echo "║  - sigil-mark/kernel/physics.yaml                            ║"
    echo "║  - sigil-mark/kernel/sync.yaml                               ║"
    echo "║  - sigil-mark/kernel/fidelity-ceiling.yaml                   ║"
    echo "╚═══════════════════════════════════════════════════════════════╝"
    echo ""

    # Check if --force flag is provided
    if [[ "$1" != "--force" ]]; then
        read -p "Type 'LOCK KERNEL' to confirm: " confirm
        if [[ "${confirm}" != "LOCK KERNEL" ]]; then
            log_warn "Lock cancelled"
            exit 0
        fi
    fi

    echo ""
    log_info "Starting kernel lock..."

    check_kernel_exists
    check_already_locked

    for file in "${KERNEL_FILES[@]}"; do
        update_kernel_file "${file}"
    done

    update_version_file
    verify_lock

    echo ""
    echo "╔═══════════════════════════════════════════════════════════════╗"
    echo "║                   KERNEL LOCKED SUCCESSFULLY                   ║"
    echo "╠═══════════════════════════════════════════════════════════════╣"
    echo "║  Locked at: ${TIMESTAMP}               ║"
    echo "║  Locked by: ${CURRENT_USER}                                          ║"
    echo "║                                                               ║"
    echo "║  To unlock, you must:                                         ║"
    echo "║  1. Manually edit all kernel files                            ║"
    echo "║  2. Update .sigil-version.json                                ║"
    echo "║  3. Commit with message containing 'HARD FORK'                ║"
    echo "╚═══════════════════════════════════════════════════════════════╝"
    echo ""
}

main "$@"
