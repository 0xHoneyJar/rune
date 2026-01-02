#!/bin/bash
# Launch Sigil Showcase development server
# Usage: ./launch-showcase.sh [--build] [--init] [--port N]
#
# Examples:
#   ./launch-showcase.sh
#   ./launch-showcase.sh --build
#   ./launch-showcase.sh --port 3001

set -e

SHOWCASE_DIR="sigil-showcase/showcase"
EXPORTS_DIR="sigil-showcase/exports"
TEMPLATE_DIR="$HOME/.sigil/sigil/templates/showcase-app"
PORT="${PORT:-3000}"
BUILD_MODE=false
INIT_MODE=false

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --build)
      BUILD_MODE=true
      shift
      ;;
    --init)
      INIT_MODE=true
      shift
      ;;
    --port)
      PORT="$2"
      shift 2
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

# Check Node.js
if ! command -v node &> /dev/null; then
  echo "ERROR: Node.js is required but not installed."
  echo "Install from: https://nodejs.org/"
  exit 1
fi

NODE_VERSION=$(node -v | cut -d'.' -f1 | tr -d 'v')
if [[ "$NODE_VERSION" -lt 18 ]]; then
  echo "ERROR: Node.js 18+ required. Current: $(node -v)"
  exit 1
fi

# Check package manager
if command -v pnpm &> /dev/null; then
  PKG_MANAGER="pnpm"
elif command -v npm &> /dev/null; then
  PKG_MANAGER="npm"
else
  echo "ERROR: npm or pnpm required."
  exit 1
fi

# Initialize mode
if [[ "$INIT_MODE" == "true" ]]; then
  if [[ -d "$SHOWCASE_DIR" ]]; then
    echo "Showcase already exists at $SHOWCASE_DIR"
    echo "Delete it first if you want to reinitialize."
    exit 1
  fi

  if [[ ! -d "$TEMPLATE_DIR" ]]; then
    echo "ERROR: Template not found at $TEMPLATE_DIR"
    echo "Ensure Sigil is properly installed."
    exit 1
  fi

  echo "Initializing showcase app..."
  mkdir -p "$(dirname "$SHOWCASE_DIR")"
  cp -r "$TEMPLATE_DIR" "$SHOWCASE_DIR"

  # Create exports directory
  mkdir -p "$EXPORTS_DIR"

  # Create symlink for components.json
  mkdir -p "$SHOWCASE_DIR/public"
  ln -sf "../../exports/components.json" "$SHOWCASE_DIR/public/components.json"

  echo "Installing dependencies..."
  cd "$SHOWCASE_DIR"
  $PKG_MANAGER install

  echo ""
  echo "Showcase initialized successfully!"
  echo ""
  echo "Next steps:"
  echo "  1. Run /sigil export to generate component data"
  echo "  2. Run /sigil showcase to start the server"
  exit 0
fi

# Check showcase exists
if [[ ! -d "$SHOWCASE_DIR" ]]; then
  echo "ERROR: Showcase not found at $SHOWCASE_DIR"
  echo ""
  echo "Initialize with:"
  echo "  /sigil showcase --init"
  exit 1
fi

# Check exports exist
if [[ ! -f "$EXPORTS_DIR/components.json" ]]; then
  echo "WARNING: No component exports found."
  echo "Run /sigil export to generate components.json"
  echo ""
fi

# Ensure symlink exists
if [[ ! -L "$SHOWCASE_DIR/public/components.json" ]]; then
  mkdir -p "$SHOWCASE_DIR/public"
  ln -sf "../../exports/components.json" "$SHOWCASE_DIR/public/components.json"
fi

cd "$SHOWCASE_DIR"

# Install dependencies if needed
if [[ ! -d "node_modules" ]]; then
  echo "Installing dependencies..."
  $PKG_MANAGER install
fi

# Launch
if [[ "$BUILD_MODE" == "true" ]]; then
  echo "Building Sigil Showcase..."
  $PKG_MANAGER run build
  echo ""
  echo "Build complete! Files in: $SHOWCASE_DIR/out/"
  echo "Deploy to any static host."
else
  echo "Starting Sigil Showcase..."
  echo ""
  PORT=$PORT $PKG_MANAGER run dev
fi
