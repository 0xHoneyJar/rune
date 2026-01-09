#!/bin/bash
# Install Sigil pre-commit hook
# Run: ./sigil-mark/scripts/install-hooks.sh

# Create .husky directory if needed
mkdir -p .husky

# Copy pre-commit hook
cat > .husky/pre-commit << 'EOF'
#!/bin/bash
# Sigil Pre-commit Hook
# Part of JIT Polish workflow

# Run polish check on staged files
npx sigil polish --check --staged

if [ $? -ne 0 ]; then
  echo ""
  echo "Sigil violations detected."
  echo "Run 'npx sigil polish --staged' to see fixes."
  echo "Run 'npx sigil polish --staged --apply' to apply."
  exit 1
fi
EOF

# Make executable
chmod +x .husky/pre-commit

echo "Sigil pre-commit hook installed."
echo ""
echo "To test: git add . && git commit -m 'test'"
echo "To bypass: git commit --no-verify"
