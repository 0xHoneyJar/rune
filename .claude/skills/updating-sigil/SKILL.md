# Sigil Updating Skill

## Purpose

Pull latest Sigil framework updates and refresh physics rules. Keeps the framework current while preserving local taste and state.

---

## Pre-Flight Checks

1. **Sigil Mounted**: Verify `.sigil-version.json` exists
2. **Upstream Configured**: Verify sigil-upstream remote exists

---

## Workflow

### Step 1: Read Current Version

Read `.sigil-version.json` to get:
- Current version
- Last update timestamp
- Installed components

```bash
if [[ ! -f ".sigil-version.json" ]]; then
  echo "❌ Sigil not mounted. Run '/mount' first."
  exit 1
fi

CURRENT_VERSION=$(jq -r '.version' .sigil-version.json)
echo "Current version: $CURRENT_VERSION"
```

### Step 2: Fetch Remote Updates

If `--check` flag is NOT present:

```bash
SIGIL_REMOTE_NAME="sigil-upstream"
SIGIL_BRANCH="main"

git fetch "$SIGIL_REMOTE_NAME" "$SIGIL_BRANCH" --quiet
```

### Step 3: Compare Versions

Compare local manifest with remote:

```bash
REMOTE_VERSION=$(git show "$SIGIL_REMOTE_NAME/$SIGIL_BRANCH:manifest.json" | jq -r '.version')

if [[ "$CURRENT_VERSION" == "$REMOTE_VERSION" ]] && [[ -z "$FORCE" ]]; then
  echo "Sigil is up to date (version $CURRENT_VERSION)"
  echo "Use '--force' to refresh anyway."
  exit 0
fi
```

### Step 4: Report or Apply

**If --check flag:**
Report available updates and exit.

**If updates available (or --force):**
1. Pull latest physics rules
2. Pull latest Sigil skills
3. Pull latest Sigil commands
4. Update `.sigil-version.json`

### Step 5: Apply Updates

```bash
echo "Applying updates..."

# Update physics rules
git checkout "$SIGIL_REMOTE_NAME/$SIGIL_BRANCH" -- .claude/rules/

# Update Sigil-specific skills only
for skill in crafting-physics styling-material animating-motion applying-behavior \
             validating-physics surveying-patterns inscribing-taste distilling-components \
             mounting-sigil updating-sigil agent-browser; do
  git checkout "$SIGIL_REMOTE_NAME/$SIGIL_BRANCH" -- ".claude/skills/$skill" 2>/dev/null
done

# Update Sigil-specific commands only
for cmd in craft style animate behavior ward garden inscribe distill mount update setup feedback; do
  git checkout "$SIGIL_REMOTE_NAME/$SIGIL_BRANCH" -- ".claude/commands/${cmd}.md" 2>/dev/null
done

echo "✓ Updates applied"
```

### Step 6: Update Version Manifest

```bash
cat > .sigil-version.json << EOF
{
  "version": "$REMOTE_VERSION",
  "mounted_at": "$(jq -r '.mounted_at' .sigil-version.json)",
  "updated_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "physics_layers": ["behavioral", "animation", "material"],
  "skills": 11,
  "commands": 12,
  "rules": 17
}
EOF
echo "✓ Version manifest updated"
```

---

## Output Format

### Check Mode

```
Sigil Update Check

Current version: 2.0.0
Remote version: 2.1.0
Status: Update available

Changes:
  - Updated physics timing defaults
  - New animation spring values
  - Added lexicon keywords

Run '/update' to apply updates.
```

### Apply Mode

```
Sigil Updated

Previous version: 2.0.0
New version: 2.1.0

Refreshed:
  - 17 physics rules
  - 11 skills
  - 12 commands

Your state files are preserved:
  - grimoires/sigil/taste.md
  - grimoires/sigil/context/
  - grimoires/sigil/moodboard/
```

### Already Current

```
Sigil is up to date (version 2.0.0)

Use '--force' to refresh anyway.
```

---

## Preserved Files

These files are NEVER overwritten during update:

| File | Purpose |
|------|---------|
| `grimoires/sigil/taste.md` | Accumulated taste signals |
| `grimoires/sigil/context/*` | User context files |
| `grimoires/sigil/moodboard/*` | Visual references |
| `.sigil-version.json` | Updated, not replaced |

---

## Error Handling

| Error | Cause | Resolution |
|-------|-------|------------|
| "Sigil not mounted" | No `.sigil-version.json` | Run `/mount` first |
| "Failed to fetch" | Network/auth issue | Check connectivity and credentials |
| "Merge conflict" | Local changes conflict | Resolve manually or use `--force` |
