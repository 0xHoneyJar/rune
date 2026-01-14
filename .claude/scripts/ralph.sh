#!/bin/bash

# Ralph Wiggum loop for Sigil
# Usage: ./ralph.sh <iterations> [craft_file]
# Example: ./ralph.sh 20 grimoires/sigil/CRAFT.md

if [ -z "$1" ]; then
  echo "Usage: $0 <iterations> [craft_file]"
  echo "Example: $0 20 grimoires/sigil/CRAFT.md"
  exit 1
fi

ITERATIONS=$1
CRAFT_FILE=${2:-"grimoires/sigil/CRAFT.md"}

if [ ! -f "$CRAFT_FILE" ]; then
  echo "Error: CRAFT file not found: $CRAFT_FILE"
  exit 1
fi

echo "┌─────────────────────────────────────────┐"
echo "│  Sigil Ralph Loop                       │"
echo "│  Iterations: $ITERATIONS"
echo "│  CRAFT: $CRAFT_FILE"
echo "└─────────────────────────────────────────┘"
echo ""

for ((i=1; i<=$ITERATIONS; i++)); do
  echo ""
  echo "─── Loop $i of $ITERATIONS ───"
  echo ""

  # Run claude with the CRAFT file as prompt
  result=$(claude -p "$(cat "$CRAFT_FILE")" --output-format text 2>&1) || true

  echo "$result"

  # Check for completion
  if [[ "$result" == *"Queue empty"* ]] || [[ "$result" == *"COMPLETE"* ]]; then
    echo ""
    echo "═══════════════════════════════════════"
    echo "All tasks complete after $i iterations."
    echo "Run /inscribe to make learnings permanent."
    echo "═══════════════════════════════════════"
    exit 0
  fi

  echo ""
  echo "─── End loop $i ───"
done

echo ""
echo "═══════════════════════════════════════"
echo "Reached max iterations ($ITERATIONS)"
echo "Review CRAFT file for progress."
echo "═══════════════════════════════════════"
exit 1
